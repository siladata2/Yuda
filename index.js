// index.js
const fs = require('fs')
const path = require('path')
const config = require('./config')

//===================SESSION-AUTH============================
if (!fs.existsSync(path.join(__dirname, 'sessions/creds.json'))) {
  if (!config.SESSION_ID || config.SESSION_ID.trim() === '') {
    console.log('❌ Please add your session to SESSION_ID in config.env or config.js')
    process.exit(1)
  }
  const sessdata = config.SESSION_ID.replace("SILA-MD~", '').trim()
  try {
    const compressedBuffer = Buffer.from(sessdata, 'base64')
    const zlib = require('zlib')
    const sessionBuffer = zlib.gunzipSync(compressedBuffer)
    
    // Create sessions directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'sessions'))) {
      fs.mkdirSync(path.join(__dirname, 'sessions'))
    }
    
    fs.writeFileSync(path.join(__dirname, 'sessions/creds.json'), sessionBuffer)
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
const qrcode = require('qrcode-terminal')

// Import bot handlers
const botHandler = require('./botHandler')

let conn

async function startBot() {
  try {
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
        console.log('Scanning QR is disabled. Use SESSION_ID from your previous session.')
      }
      
      if (connection === 'open') {
        console.log('✅ WhatsApp bot connected successfully!')
        console.log(`📱 Bot running on port ${port}`)
      }
      
      if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode
        if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.badSession) {
          console.log('❌ Session expired! Please update SESSION_ID')
          // Delete invalid session
          if (fs.existsSync(path.join(__dirname, 'sessions/creds.json'))) {
            fs.unlinkSync(path.join(__dirname, 'sessions/creds.json'))
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
      const msg = m.messages[0]
      if (!msg.message) return
      
      const sender = msg.key.remoteJid
      const messageType = Object.keys(msg.message)[0]
      const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || ''
      
      // Ignore group messages if not configured
      if (sender.endsWith('@g.us') && !config.ALLOW_GROUPS) return
      
      // Ignore own messages
      if (msg.key.fromMe) return
      
      console.log(`📩 Message from ${sender}: ${messageContent}`)
      
      // Process message
      await botHandler.processMessage(conn, msg, sender, messageContent, messageType)
    })

    // Express server
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sila Tech WhatsApp Bot</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
              .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
              h1 { font-size: 2.5em; margin-bottom: 10px; }
              .status { background: #4CAF50; padding: 10px; border-radius: 10px; margin: 20px 0; }
              .info { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; }
              .features { text-align: left; padding: 20px; }
              .features li { margin: 10px 0; }
              .footer { margin-top: 30px; font-size: 0.9em; opacity: 0.8; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🤖 Sila Tech Bot</h1>
              <div class="status">✅ Bot is Online</div>
              <div class="info">
                <p>📱 Connected to WhatsApp</p>
                <p>📊 Bot Status: Active</p>
              </div>
              <div class="features">
                <h3>🚀 Features</h3>
                <ul>
                  <li>📥 Import/Export Messages</li>
                  <li>📊 Message Statistics</li>
                  <li>💬 Auto Reply System</li>
                  <li>📝 Custom Commands</li>
                  <li>🔒 Session Management</li>
                </ul>
              </div>
              <div class="footer">
                <p>Made with ❤️ by Sila Tech</p>
                <p>Version 1.0.0</p>
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