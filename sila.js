// sila.js - Main bot file using @itsliaaa/baileys
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
    console.log('✅ Session extracted and saved successfully');
  } catch (err) {
    console.log('❌ Failed to extract session:', err.message);
    process.exit(1);
  }
}

// ==================== EXPRESS SERVER WITH BLACK THEME HTML ====================
const app = express();
const port = process.env.PORT || 9090;

// HTML Page with Black Theme
const htmlPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SILA TECH BOT</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: #0a0a0a;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
        }
        
        /* Animated background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 50%, rgba(120, 80, 255, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 50%, rgba(255, 80, 120, 0.05) 0%, transparent 50%);
            z-index: 0;
        }
        
        .container {
            background: #0d0d0d;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            padding: 50px;
            max-width: 700px;
            width: 100%;
            position: relative;
            z-index: 1;
            box-shadow: 
                0 0 60px rgba(120, 80, 255, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        
        .container:hover {
            border-color: rgba(120, 80, 255, 0.2);
            box-shadow: 
                0 0 80px rgba(120, 80, 255, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .logo {
            font-size: 72px;
            margin-bottom: 10px;
            display: block;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .title {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 8px;
        }
        
        .title span {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            color: rgba(255, 255, 255, 0.4);
            font-size: 14px;
            letter-spacing: 4px;
            text-transform: uppercase;
        }
        
        .status-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 30px;
        }
        
        .status-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        
        .status-row:last-child {
            border-bottom: none;
        }
        
        .status-label {
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            font-weight: 500;
        }
        
        .status-value {
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            animation: blink 1.5s ease-in-out infinite;
        }
        
        .status-dot.online {
            background: #22c55e;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .badge.success {
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .badge.primary {
            background: rgba(139, 92, 246, 0.15);
            color: #8b5cf6;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 30px 0;
        }
        
        .feature-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .feature-item:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(139, 92, 246, 0.2);
            transform: translateY(-2px);
        }
        
        .feature-icon {
            font-size: 24px;
            margin-bottom: 6px;
            display: block;
        }
        
        .feature-name {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            font-weight: 500;
        }
        
        .commands-section {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .commands-title {
            color: rgba(255, 255, 255, 0.5);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .commands-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
        }
        
        .cmd {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 8px 12px;
            text-align: center;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .cmd:hover {
            background: rgba(139, 92, 246, 0.1);
            border-color: rgba(139, 92, 246, 0.2);
            color: #ffffff;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .footer-text {
            color: rgba(255, 255, 255, 0.2);
            font-size: 12px;
            letter-spacing: 1px;
        }
        
        .footer-text strong {
            color: rgba(255, 255, 255, 0.3);
        }
        
        .uptime {
            color: rgba(255, 255, 255, 0.3);
            font-size: 12px;
            text-align: center;
            margin-top: 15px;
        }
        
        @media (max-width: 600px) {
            .container {
                padding: 25px;
            }
            
            .features-grid {
                grid-template-columns: 1fr 1fr;
            }
            
            .commands-grid {
                grid-template-columns: 1fr 1fr;
            }
            
            .logo {
                font-size: 48px;
            }
            
            .title {
                font-size: 24px;
            }
        }
        
        @media (max-width: 400px) {
            .features-grid {
                grid-template-columns: 1fr;
            }
            
            .commands-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="logo">🧛</span>
            <h1 class="title"><span>SILA TECH BOT</span></h1>
            <p class="subtitle">WhatsApp Bot Framework</p>
        </div>
        
        <div class="status-card">
            <div class="status-row">
                <span class="status-label">Status</span>
                <span class="status-value">
                    <span class="status-dot online"></span>
                    Connected
                    <span class="badge success">ONLINE</span>
                </span>
            </div>
            <div class="status-row">
                <span class="status-label">Bot Name</span>
                <span class="status-value">${config.BOT_NAME || 'SILA TECH BOT'}</span>
            </div>
            <div class="status-row">
                <span class="status-label">Version</span>
                <span class="status-value">${config.VERSION || '1.0.0'}</span>
            </div>
            <div class="status-row">
                <span class="status-label">Prefix</span>
                <span class="status-value">${config.PREFIX || '!'}</span>
            </div>
            <div class="status-row">
                <span class="status-label">Owner</span>
                <span class="status-value">${config.OWNER_NUMBER || 'Not Set'}</span>
            </div>
            <div class="status-row">
                <span class="status-label">Library</span>
                <span class="status-value">
                    <span class="badge primary">@itsliaaa/baileys</span>
                </span>
            </div>
        </div>
        
        <div class="features-grid">
            <div class="feature-item">
                <span class="feature-icon">📥</span>
                <span class="feature-name">Import</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">📤</span>
                <span class="feature-name">Export</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span class="feature-name">Stats</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">🛡️</span>
                <span class="feature-name">Anti-Systems</span>
            </div>
        </div>
        
        <div class="commands-section">
            <div class="commands-title">📋 Available Commands</div>
            <div class="commands-grid">
                <span class="cmd">${config.PREFIX}help</span>
                <span class="cmd">${config.PREFIX}ping</span>
                <span class="cmd">${config.PREFIX}stats</span>
                <span class="cmd">${config.PREFIX}settings</span>
                <span class="cmd">${config.PREFIX}add</span>
                <span class="cmd">${config.PREFIX}menu</span>
            </div>
        </div>
        
        <div class="uptime">
            ⏱️ Uptime: <span id="uptime">Loading...</span>
        </div>
        
        <div class="footer">
            <p class="footer-text">Made with ❤️ by <strong>Sila Tech</strong></p>
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

// Routes
app.get('/', (req, res) => {
  res.send(htmlPage);
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    connected: isConnected || false,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/status', (req, res) => {
  res.json({
    status: isConnected ? 'online' : 'offline',
    bot: config.BOT_NAME,
    version: config.VERSION,
    prefix: config.PREFIX,
    owner: config.OWNER_NUMBER,
    uptime: process.uptime(),
    library: '@itsliaaa/baileys',
    commands: commands.size,
    createdBy: 'Sila Tech'
  });
});

app.listen(port, () => {
  console.log(`🌐 Web server running on port ${port}`);
  console.log(`📱 Dashboard: http://localhost:${port}`);
});

// ==================== IMPORT BAILEYS ====================
import { 
  default as makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason,
  makeCacheableSignalKeyStore,
  Browsers
} from '@itsliaaa/baileys';
import pino from 'pino';

// ==================== COMMANDS SYSTEM ====================
const commands = new Map();
const commandCategories = new Map();
let isConnected = false;
let sock = null;

async function loadCommands() {
  const commandsDir = path.join(__dirname, config.COMMANDS_DIR || './silatech');
  
  if (!fs.existsSync(commandsDir)) {
    console.log('⚠️ Commands folder not found!');
    console.log('📁 Please create commands in: ' + commandsDir);
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
  console.log(`✅ Loaded ${commands.size} commands from ${commandsDir}`);
}

// ==================== OWNER FUNCTIONS ====================
function isOwner(jid) {
  const ownerNumber = config.OWNER_NUMBER || process.env.OWNER_NUMBER || '';
  if (!ownerNumber) return false;
  
  const cleanJid = jid?.split('@')[0]?.replace(/\D/g, '');
  const cleanOwner = ownerNumber.replace(/\D/g, '');
  
  return cleanJid === cleanOwner;
}

// ==================== MESSAGE HANDLER ====================
async function handleMessage(msg) {
  try {
    if (!msg.message) return;
    
    const sender = msg.key.remoteJid;
    const isGroup = sender?.endsWith('@g.us');
    const fromMe = msg.key.fromMe || false;
    
    // Get message text
    let text = '';
    if (msg.message.conversation) text = msg.message.conversation;
    else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
    else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption;
    else if (msg.message.videoMessage?.caption) text = msg.message.videoMessage.caption;
    
    if (!text) return;
    
    // Check prefix
    const prefix = config.PREFIX || '.';
    if (!text.startsWith(prefix)) return;
    
    const args = text.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    
    if (!commandName) return;
    
    // Log command
    console.log(`💬 Command: ${commandName} from ${fromMe ? 'BOT' : sender}`);
    
    // Check if command exists
    const command = commands.get(commandName);
    if (!command) {
      if (!fromMe) {
        await sock.sendMessage(sender, { 
          text: `❌ Command "${commandName}" not found. Type ${prefix}help for available commands.` 
        });
      }
      return;
    }
    
    // Check if command is owner only
    if (command.ownerOnly && !isOwner(sender) && !fromMe) {
      await sock.sendMessage(sender, { text: '❌ This command is for owner only!' });
      return;
    }
    
    // Execute command
    try {
      await command.execute(sock, msg, args, prefix, {
        BOT_NAME: config.BOT_NAME,
        VERSION: config.VERSION,
        isOwner: () => isOwner(sender) || fromMe,
        isGroup,
        commands,
        commandCategories
      });
    } catch (error) {
      console.error(`❌ Command ${commandName} failed:`, error.message);
      if (!fromMe) {
        await sock.sendMessage(sender, { text: '❌ An error occurred while executing the command.' });
      }
    }
  } catch (error) {
    console.error('❌ Message handler error:', error);
  }
}

// ==================== BOT START ====================
async function startBot() {
  try {
    console.log('🚀 Starting WhatsApp bot using @itsliaaa/baileys...');
    
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
        console.log(`📦 Using: @itsliaaa/baileys`);
        console.log(`👑 Owner: ${config.OWNER_NUMBER || 'Not set'}`);
        console.log(`🌐 Dashboard: http://localhost:${port}`);
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

    // Messages - Process ALL messages including fromMe
    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        await handleMessage(msg);
      }
    });

    // Send startup message to owner
    setTimeout(async () => {
      try {
        if (config.OWNER_NUMBER && isConnected) {
          const ownerJid = config.OWNER_NUMBER.replace(/\D/g, '') + '@s.whatsapp.net';
          await sock.sendMessage(ownerJid, {
            text: `✅ *${config.BOT_NAME} v${config.VERSION}* is now online!\n\n` +
                  `💬 Prefix: ${config.PREFIX}\n` +
                  `📦 Using: @itsliaaa/baileys\n` +
                  `👨‍💻 Created by: Sila Tech\n\n` +
                  `🌐 Dashboard: https://${process.env.HEROKU_APP_NAME || 'localhost'}.herokuapp.com\n\n` +
                  `Type ${config.PREFIX}help for commands.`
          });
          console.log(`📨 Startup message sent to owner`);
        }
      } catch (error) {
        console.log('⚠️ Could not send startup message to owner');
      }
    }, 5000);

  } catch (error) {
    console.error('❌ Error starting bot:', error);
    setTimeout(startBot, 5000);
  }
}

// ==================== START ====================
startBot();

// Export for testing
export { sock, isConnected, commands };