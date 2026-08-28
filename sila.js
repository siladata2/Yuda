// sila.js - Main bot file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import zlib from 'zlib';
import dotenv from 'dotenv';
import { config } from './config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//==================== SESSION AUTH ====================
const SESSION_DIR = config.SESSION_DIR || './sessions';

if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

if (!fs.existsSync(path.join(SESSION_DIR, 'creds.json'))) {
  const SESSION_ID = process.env.SESSION_ID || config.SESSION_ID;
  
  if (!SESSION_ID || SESSION_ID.trim() === '') {
    console.log('✖ No SESSION_ID found');
    console.log('➜ Add SESSION_ID to .env or Heroku Config Vars');
    process.exit(1);
  }

  try {
    let sessdata = SESSION_ID.trim();
    const prefixes = ['SILA-MD~', 'sila~', 'CIPHER-MD~', 'itsliaaa~'];
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
    console.log('✔ Session extracted successfully');
  } catch (err) {
    console.log('✖ Failed to extract session:', err.message);
    process.exit(1);
  }
}

//==================== EXPRESS SERVER ====================
const app = express();
const port = process.env.PORT || 9090;

// Get bot settings for HTML
const botName = config.BOT_NAME || 'SILA TECH BOT';
const version = config.VERSION || '1.0.0';
const prefix = config.PREFIX || '.';
const mode = getBotMode() || 'public';

const htmlPage = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${botName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0a;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px;
    }
    .container {
      background: #0d0d0d;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 24px;
      padding: 50px;
      max-width: 700px;
      width: 100%;
      box-shadow: 0 0 60px rgba(120,80,255,0.05);
    }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 72px; display: block; margin-bottom: 10px; }
    .title { color: #fff; font-size: 32px; font-weight: 700; letter-spacing: 2px; }
    .title span { background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: rgba(255,255,255,0.4); font-size: 14px; letter-spacing: 4px; text-transform: uppercase; }
    .status-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 30px;
    }
    .status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .status-row:last-child { border-bottom: none; }
    .status-label { color: rgba(255,255,255,0.5); font-size: 14px; }
    .status-value { color: #fff; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      animation: blink 1.5s ease-in-out infinite;
    }
    .status-dot.online { background: #22c55e; box-shadow: 0 0 20px rgba(34,197,94,0.3); }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge.success { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
    .badge.primary { background: rgba(139,92,246,0.15); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.2); }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer-text { color: rgba(255,255,255,0.2); font-size: 12px; letter-spacing: 1px; }
    .footer-text strong { color: rgba(255,255,255,0.3); }
    .uptime { color: rgba(255,255,255,0.3); font-size: 12px; text-align: center; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">✦</span>
      <h1 class="title"><span>${botName}</span></h1>
      <p class="subtitle">WhatsApp Bot Framework</p>
    </div>
    <div class="status-card">
      <div class="status-row">
        <span class="status-label">Status</span>
        <span class="status-value"><span class="status-dot online"></span>Connected <span class="badge success">Online</span></span>
      </div>
      <div class="status-row">
        <span class="status-label">Bot Name</span>
        <span class="status-value">${botName}</span>
      </div>
      <div class="status-row">
        <span class="status-label">Version</span>
        <span class="status-value">${version}</span>
      </div>
      <div class="status-row">
        <span class="status-label">Prefix</span>
        <span class="status-value">${prefix}</span>
      </div>
      <div class="status-row">
        <span class="status-label">Mode</span>
        <span class="status-value">${mode}</span>
      </div>
      <div class="status-row">
        <span class="status-label">Library</span>
        <span class="status-value"><span class="badge primary">@itsliaaa/baileys</span></span>
      </div>
    </div>
    <div class="uptime">⏱ Uptime: <span id="uptime">Loading...</span></div>
    <div class="footer">
      <p class="footer-text">Made with ❤ by <strong>Sila Tech</strong></p>
    </div>
  </div>
  <script>
    function updateUptime() {
      const startTime = ${Date.now()};
      const uptimeElement = document.getElementById('uptime');
      setInterval(() => {
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        let display = '';
        if (hours > 0) display += hours + 'h ';
        if (minutes > 0 || hours > 0) display += minutes + 'm ';
        display += seconds + 's';
        uptimeElement.textContent = display;
      }, 1000);
    }
    updateUptime();
  </script>
</body>
</html>
`;

app.get('/', (req, res) => res.send(htmlPage));
app.get('/health', (req, res) => res.json({ status: 'healthy', connected: isConnected || false, uptime: process.uptime() }));
app.get('/status', (req, res) => res.json({ 
  status: isConnected ? 'online' : 'offline', 
  bot: config.BOT_NAME, 
  version: config.VERSION, 
  prefix: config.PREFIX, 
  mode: getBotMode(), 
  uptime: process.uptime() 
}));

app.listen(port, () => {
  console.log(`◉ Web server running on port ${port}`);
});

//==================== IMPORT BAILEYS ====================
import { 
  default as makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason,
  makeCacheableSignalKeyStore,
  Browsers
} from '@itsliaaa/baileys';
import pino from 'pino';

//==================== COMMANDS SYSTEM ====================
const commands = new Map();
const commandCategories = new Map();
let isConnected = false;
let sock = null;

async function loadCommands() {
  const commandsDir = path.join(__dirname, config.COMMANDS_DIR || './silatech');
  
  if (!fs.existsSync(commandsDir)) {
    console.log('⚠ Commands folder not found');
    fs.mkdirSync(commandsDir, { recursive: true });
    fs.mkdirSync(path.join(commandsDir, 'general'), { recursive: true });
    fs.mkdirSync(path.join(commandsDir, 'owner'), { recursive: true });
    fs.mkdirSync(path.join(commandsDir, 'group'), { recursive: true });
    fs.mkdirSync(path.join(commandsDir, 'sticker'), { recursive: true });
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
          console.log(`⚠ Failed to load ${item}:`, error.message);
        }
      }
    }
  }

  await loadDir(commandsDir);
  console.log(`✔ Loaded ${commands.size} commands`);
}

//==================== MODE SYSTEM ====================
const MODE_FILE = './bot_mode.json';
let currentMode = 'public';

function getBotMode() {
  try {
    if (fs.existsSync(MODE_FILE)) {
      const data = JSON.parse(fs.readFileSync(MODE_FILE, 'utf8'));
      currentMode = data.mode || 'public';
    }
  } catch {}
  return currentMode;
}

function setBotMode(mode) {
  const validModes = ['public', 'private', 'self'];
  if (!validModes.includes(mode)) {
    return { success: false, error: 'Invalid mode' };
  }
  try {
    fs.writeFileSync(MODE_FILE, JSON.stringify({ 
      mode, 
      updatedAt: new Date().toISOString()
    }, null, 2));
    currentMode = mode;
    return { success: true, mode };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function isOwnerNumber(jid) {
  const ownerNumber = config.OWNER_NUMBER || process.env.OWNER_NUMBER || '';
  if (!ownerNumber) return false;
  const cleanJid = jid?.split('@')[0]?.replace(/\D/g, '');
  const cleanOwner = ownerNumber.replace(/\D/g, '');
  return cleanJid === cleanOwner;
}

getBotMode();
console.log(`◉ Bot Mode: ${getBotMode()}`);

//==================== MESSAGE HANDLER ====================
async function handleMessage(msg) {
  try {
    if (!msg.message) return;
    
    const sender = msg.key.remoteJid;
    const isGroup = sender?.endsWith('@g.us');
    const fromMe = msg.key.fromMe || false;
    
    let text = '';
    if (msg.message.conversation) text = msg.message.conversation;
    else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
    else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption;
    else if (msg.message.videoMessage?.caption) text = msg.message.videoMessage.caption;
    
    if (!text) return;
    
    // Get current prefix and settings
    const prefix = config.PREFIX || '.';
    const allowPrefixless = config.ALLOW_PREFIXLESS !== undefined ? config.ALLOW_PREFIXLESS : true;
    
    let commandName = '';
    let args = [];
    let usedPrefix = prefix;
    
    // Check if message starts with prefix
    if (text.startsWith(prefix)) {
      const parts = text.slice(prefix.length).trim().split(/\s+/);
      commandName = parts.shift().toLowerCase();
      args = parts;
      usedPrefix = prefix;
    } 
    // Check if prefixless is allowed
    else if (allowPrefixless) {
      const words = text.trim().split(/\s+/);
      const firstWord = words[0].toLowerCase();
      
      // Check if first word is a command
      if (commands.has(firstWord)) {
        commandName = firstWord;
        args = words.slice(1);
        usedPrefix = '';
      } else {
        // Check aliases
        for (const [cmdName, command] of commands.entries()) {
          if (command.alias && command.alias.includes(firstWord)) {
            commandName = cmdName;
            args = words.slice(1);
            usedPrefix = '';
            break;
          }
        }
      }
    }
    
    if (!commandName) return;
    
    console.log(`◈ ${commandName} from ${fromMe ? 'BOT' : sender} (prefix: ${usedPrefix || 'none'})`);
    
    const command = commands.get(commandName);
    if (!command) return;
    
    const mode = getBotMode();
    const isOwner = isOwnerNumber(sender) || fromMe;
    
    if (mode === 'self' && !isOwner && !fromMe) {
      await sock.sendMessage(sender, { text: 'Self mode active' });
      return;
    }
    
    if (mode === 'private' && !isOwner && !fromMe) {
      await sock.sendMessage(sender, { text: 'Private mode active' });
      return;
    }
    
    if (command.ownerOnly && !isOwner && !fromMe) {
      await sock.sendMessage(sender, { text: 'Owner only' });
      return;
    }
    
    try {
      await command.execute(sock, msg, args, prefix, {
        BOT_NAME: config.BOT_NAME,
        VERSION: config.VERSION,
        FOOTER: config.FOOTER,
        BOT_IMAGE: config.BOT_IMAGE,
        isOwner: () => isOwner || fromMe,
        isGroup,
        commands,
        commandCategories,
        getBotMode,
        setBotMode,
        isOwnerNumber,
        config
      });
    } catch (error) {
      console.error(`✖ ${commandName} failed:`, error.message);
      if (!fromMe) {
        await sock.sendMessage(sender, { text: '✖ Error executing command' });
      }
    }
  } catch (error) {
    console.error('✖ Message handler error:', error);
  }
}

//==================== BOT START ====================
async function startBot() {
  try {
    console.log('◉ Starting WhatsApp bot...');
    
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    
    sock = makeWASocket({
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ['Sila Tech Bot', 'Chrome', '1.0.0'],
      markOnlineOnConnect: true,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
      defaultQueryTimeoutMs: 20000,
      generateHighQualityLinkPreview: true
    });

    await loadCommands();

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'open') {
        isConnected = true;
        console.log('✔ Bot connected successfully');
        console.log(`◉ ${config.BOT_NAME} v${config.VERSION}`);
        console.log(`◉ Prefix: ${config.PREFIX}`);
        console.log(`◉ Mode: ${getBotMode()}`);
        console.log(`◉ Library: @itsliaaa/baileys`);
      }
      
      if (connection === 'close') {
        isConnected = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        
        if (statusCode === DisconnectReason.loggedOut || statusCode === DisconnectReason.badSession) {
          console.log('✖ Session expired');
          if (fs.existsSync(path.join(SESSION_DIR, 'creds.json'))) {
            fs.unlinkSync(path.join(SESSION_DIR, 'creds.json'));
          }
          process.exit(1);
        } else {
          console.log('◉ Reconnecting...');
          setTimeout(startBot, 5000);
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        await handleMessage(msg);
      }
    });

    setTimeout(async () => {
      try {
        if (config.OWNER_NUMBER && isConnected) {
          const ownerJid = config.OWNER_NUMBER.replace(/\D/g, '') + '@s.whatsapp.net';
          await sock.sendMessage(ownerJid, {
            text: `✦ ${config.BOT_NAME} v${config.VERSION} online\n◉ Prefix: ${config.PREFIX}\n◉ Mode: ${getBotMode()}\n◉ Library: @itsliaaa/baileys`
          });
          console.log('◉ Startup message sent to owner');
        }
      } catch {}
    }, 5000);

  } catch (error) {
    console.error('✖ Error starting bot:', error);
    setTimeout(startBot, 5000);
  }
}

startBot();

export { sock, isConnected, commands };