// sila.js - Main bot file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import zlib from 'zlib';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== SESSION AUTH ====================
const SESSION_DIR = config.SESSION_DIR || './sessions';

if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

if (!fs.existsSync(path.join(SESSION_DIR, 'creds.json'))) {
  const SESSION_ID = process.env.SESSION_ID || config.SESSION_ID;
  
  if (!SESSION_ID || SESSION_ID.trim() === '') {
    console.log('❌ No SESSION_ID found!');
    console.log('📝 Add SESSION_ID to .env or Heroku Config Vars');
    process.exit(1);
  }

  try {
    let sessdata = SESSION_ID.trim();
    // Remove prefixes if any
    const prefixes = ['SILA-MD~', 'sila~', 'CIPHER-MD~'];
    for (const prefix of prefixes) {
      if (sessdata.startsWith(prefix)) {
        sessdata = sessdata.substring(prefix.length).trim();
        break;
      }
    }

    const compressedBuffer = Buffer.from(sessdata, 'base64');
    let sessionBuffer;
    
    try {
      sessionBuffer = zlib.gunzipSync(compressedBuffer);
    } catch {
      sessionBuffer = compressedBuffer;
    }

    fs.writeFileSync(path.join(SESSION_DIR, 'creds.json'), sessionBuffer);
    console.log('✅ Session extracted and saved successfully');
  } catch (err) {
    console.log('❌ Failed to extract session:', err.message);
    process.exit(1);
  }
}

// ==================== EXPRESS SERVER ====================
const app = express();
const port = process.env.PORT || 9090;

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    bot: config.BOT_NAME,
    version: config.VERSION,
    uptime: process.uptime(),
    createdBy: 'Sila Tech'
  });
});

app.listen(port, () => {
  console.log(`🌐 Web server running on port ${port}`);
});

// ==================== IMPORT BAILEYS ====================
import { 
  default as makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason,
  makeCacheableSignalKeyStore,
  Browsers
} from '@itsliaaa/baileys';
import Pino from 'pino';
import { Boom } from '@hapi/boom';

// ==================== COMMANDS SYSTEM ====================
const commands = new Map();
const commandCategories = new Map();

async function loadCommands() {
  const commandsDir = path.join(__dirname, config.COMMANDS_DIR || './silatech');
  
  if (!fs.existsSync(commandsDir)) {
    console.log('⚠️ Commands folder not found, creating...');
    fs.mkdirSync(commandsDir, { recursive: true });
    fs.mkdirSync(path.join(commandsDir, 'general'), { recursive: true });
    fs.mkdirSync(path.join(commandsDir, 'owner'), { recursive: true });
    fs.mkdirSync(path.join(commandsDir, 'group'), { recursive: true });
    return;
  }

  async function loadDir(dir, category = 'general') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await loadDir(fullPath, item);
      } else if (item.endsWith('.js')) {
        try {
          const commandModule = await import(`file://${fullPath}`);
          const command = commandModule.default || commandModule;
          
          if (command && command.name) {
            command.category = category;
            commands.set(command.name.toLowerCase(), command);
            
            if (!commandCategories.has(category)) {
              commandCategories.set(category, []);
            }
            commandCategories.get(category).push(command.name);
            
            if (command.alias && Array.isArray(command.alias)) {
              command.alias.forEach(alias => {
                commands.set(alias.toLowerCase(), command);
              });
            }
          }
        } catch (error) {
          console.log(`⚠️ Failed to load command ${item}:`, error.message);
        }
      }
    }
  }

  await loadDir(commandsDir);
  console.log(`✅ Loaded ${commands.size} commands`);
}

// ==================== BOT START ====================
let sock = null;
let isConnected = false;

async function startBot() {
  try {
    console.log('🚀 Starting WhatsApp bot...');
    
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    
    sock = makeWASocket({
      logger: Pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: true,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
      defaultQueryTimeoutMs: 20000
    });

    // Load commands
    await loadCommands();

    // Connection events
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'open') {
        isConnected = true;
        console.log('✅ WhatsApp bot connected successfully!');
        console.log(`📱 Bot: ${config.BOT_NAME} v${config.VERSION}`);
        console.log(`💬 Prefix: ${config.PREFIX}`);
        console.log(`👨‍💻 Created by: Sila Tech`);
      }
      
      if (connection === 'close') {
        isConnected = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        
        if (statusCode === DisconnectReason.loggedOut || statusCode === DisconnectReason.badSession) {
          console.log('❌ Session expired! Please update SESSION_ID');
          if (fs.existsSync(path.join(SESSION_DIR, 'creds.json'))) {
            fs.unlinkSync(path.join(SESSION_DIR, 'creds.json'));
          }
          process.exit(1);
        } else {
          console.log('🔄 Reconnecting...');
          setTimeout(startBot, 5000);
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    // Messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      if (!msg.message) return;
      
      const sender = msg.key.remoteJid;
      const isGroup = sender?.endsWith('@g.us');
      
      // Ignore own messages (optional - remove if you want bot to respond to itself)
      if (msg.key.fromMe) return;
      
      // Extract text
      let text = '';
      if (msg.message.conversation) text = msg.message.conversation;
      else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
      else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption;
      else if (msg.message.videoMessage?.caption) text = msg.message.videoMessage.caption;
      
      if (!text) return;
      
      // Check prefix
      const prefix = config.PREFIX || '!';
      if (!text.startsWith(prefix)) return;
      
      const args = text.slice(prefix.length).trim().split(/\s+/);
      const commandName = args.shift().toLowerCase();
      
      if (!commandName) return;
      
      // Check if command exists
      const command = commands.get(commandName);
      if (!command) return;
      
      // Check if command is owner only
      if (command.ownerOnly && !isOwner(sender)) {
        await sock.sendMessage(sender, { text: '❌ This command is for owner only!' });
        return;
      }
      
      // Execute command
      try {
        console.log(`💬 Command: ${commandName} from ${sender}`);
        await command.execute(sock, msg, args, prefix, {
          BOT_NAME: config.BOT_NAME,
          VERSION: config.VERSION,
          isOwner: () => isOwner(sender),
          isGroup
        });
      } catch (error) {
        console.error(`❌ Command ${commandName} failed:`, error.message);
        await sock.sendMessage(sender, { text: '❌ An error occurred while executing the command.' });
      }
    });

  } catch (error) {
    console.error('❌ Error starting bot:', error);
    setTimeout(startBot, 5000);
  }
}

// ==================== HELPER FUNCTIONS ====================
function isOwner(jid) {
  const ownerNumber = config.OWNER_NUMBER || '';
  if (!ownerNumber) return false;
  
  const cleanJid = jid?.split('@')[0]?.replace(/\D/g, '');
  const cleanOwner = ownerNumber.replace(/\D/g, '');
  
  return cleanJid === cleanOwner;
}

// ==================== START ====================
startBot();

export { sock, isConnected, commands };