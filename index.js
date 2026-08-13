// index.js
const fs = require('fs')
const path = require('path')

// Load config
let config
try {
  config = require('./config')
} catch (e) {
  config = {
    SESSION_ID: process.env.SESSION_ID || '',
    ALLOW_GROUPS: true,
    BOT_PREFIX: process.env.BOT_PREFIX || '!',
    AUTO_REPLY: false,
    IMPORT_EXPORT: true,
    EXPORT_CHANNEL: 'status@broadcast',
    LOG_MESSAGES: true,
    LOG_FILE: 'message_logs.json'
  }
}

//===================SESSION-AUTH============================
const sessionsDir = path.join(__dirname, 'sessions')
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true })
}

const sessionId = process.env.SESSION_ID || config.SESSION_ID || ''

if (!sessionId || sessionId.trim() === '') {
  console.log('❌ Please add your session to SESSION_ID in Heroku Config Vars')
  console.log('📝 Go to: Heroku Dashboard > Your App > Settings > Config Vars')
  console.log('🔑 Add variable: SESSION_ID = sila~[your_compressed_session]')
  process.exit(1)
}

if (!fs.existsSync(path.join(sessionsDir, 'creds.json'))) {
  const sessdata = sessionId.replace("sila~", '').trim()
  try {
    const compressedBuffer = Buffer.from(sessdata, 'base64')
    const zlib = require('zlib')
    const sessionBuffer = zlib.gunzipSync(compressedBuffer)
    fs.writeFileSync(path.join(sessionsDir, 'creds.json'), sessionBuffer)
    console.log("✅ Session extracted and saved successfully")
  } catch (err) {
    console.log('❌ Failed to extract session:', err.message)
    process.exit(1)
  }
}

const express = require("express")
const app = express()
const port = process.env.PORT || 9090

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@itsliaaa/baileys')
const Pino = require('pino')

// Import bot handlers
let botHandler
try {
  botHandler = require('./botHandler')
} catch (e) {
  console.log('⚠️ botHandler.js not found, creating default handler')
  botHandler = {
    processMessage: async (conn, msg, sender, content, messageType) => {
      // Only respond to commands
      if (content.startsWith(config.BOT_PREFIX)) {
        await conn.sendMessage(sender, { 
          text: 'Hello! I am Sila Tech Bot. Use !help for commands.' 
        })
      }
      // No auto-reply for non-commands
    }
  }
}

let conn

async function startBot() {
  try {
    console.log('🚀 Starting WhatsApp bot...')
    const { state, saveCreds } = await useMultiFileAuthState('sessions')
    
    conn = makeWASocket({
      logger: Pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false,
      browser: ['Sila Tech Bot', 'Chrome', '1.0.0']
    })

    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update
      
      if (qr) {
        console.log('❌ QR Code detected! Please use SESSION_ID instead.')
      }
      
      if (connection === 'open') {
        console.log('✅ WhatsApp bot connected successfully!')
        console.log(`📱 Bot running on port ${port}`)
        console.log('🌐 Web dashboard: https://your-app-name.herokuapp.com')
      }
      
      if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode
        if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.badSession) {
          console.log('❌ Session expired! Please update SESSION_ID')
          if (fs.existsSync(path.join(sessionsDir, 'creds.json'))) {
            fs.unlinkSync(path.join(sessionsDir, 'creds.json'))
          }
          process.exit(1)
        } else {
          console.log('🔄 Reconnecting...')
          setTimeout(startBot, 3000)
        }
      }
    })

    conn.ev.on('creds.update', saveCreds)

    // Handle incoming messages
    conn.ev.on('messages.upsert', async (m) => {
      try {
        const msg = m.messages[0]
        if (!msg.message) return
        
        const sender = msg.key.remoteJid
        const messageType = Object.keys(msg.message)[0]
        const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || ''
        
        // Allow group messages
        if (sender.endsWith('@g.us') && !config.ALLOW_GROUPS) return
        
        // REMOVED: Don't ignore own messages (msg.key.fromMe)
        // Now bot will respond to commands from anyone including itself
        
        console.log(`📩 Message from ${sender}: ${messageContent.substring(0, 50)}`)
        
        // Process ALL messages including fromMe
        if (botHandler && typeof botHandler.processMessage === 'function') {
          await botHandler.processMessage(conn, msg, sender, messageContent, messageType)
        }
      } catch (error) {
        console.error('❌ Error processing message:', error)
      }
    })

    // Express server
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sila Tech WhatsApp Bot</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin: 0; }
              .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
              h1 { font-size: 2.5em; margin-bottom: 10px; }
              .status { background: #4CAF50; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 1.2em; }
              .info { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
              .footer { margin-top: 30px; font-size: 0.9em; opacity: 0.8; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🤖 Sila Tech Bot</h1>
              <div class="status">✅ Bot is Online</div>
              <div class="info">
                <p>📱 WhatsApp Bot Active</p>
                <p>📊 Status: Running</p>
                <p>🌐 Port: ${port}</p>
              </div>
              <div class="footer">
                <p>Made with ❤️ by Sila Tech</p>
              </div>
            </div>
          </body>
        </html>
      `)
    })

    app.listen(port, () => {
      console.log(`🌐 Web server running on port ${port}`)
    })

  } catch (error) {
    console.error('❌ Error starting bot:', error)
    setTimeout(startBot, 5000)
  }
}

// Start the bot
startBot()

module.exports = { conn }