// botHandler.js
const fs = require('fs')
const path = require('path')
const config = require('./config')

// Message storage for import/export
let messageStore = {
  messages: [],
  stats: {
    total: 0,
    byType: {},
    bySender: {}
  }
}

// Load existing messages if any
if (fs.existsSync(path.join(__dirname, 'message_store.json'))) {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'message_store.json'), 'utf8')
    messageStore = JSON.parse(data)
  } catch (e) {
    console.log('⚠️ Could not load message store, starting fresh')
  }
}

async function processMessage(conn, msg, sender, content, messageType) {
  try {
    // Log message
    if (config.LOG_MESSAGES) {
      logMessage(sender, content, messageType)
    }

    // Check if message starts with bot prefix
    if (!content.startsWith(config.BOT_PREFIX)) {
      // NO AUTO-REPLY - Just return
      return
    }

    // Handle commands (works for everyone including bot itself)
    const command = content.slice(config.BOT_PREFIX.length).trim().toLowerCase()

    // Handle import command
    if (command.startsWith('import')) {
      await handleImport(conn, msg, sender, command)
      return
    }

    // Handle export command
    if (command.startsWith('export')) {
      await handleExport(conn, msg, sender, command)
      return
    }

    // Handle stats command
    if (command === 'stats') {
      await handleStats(conn, msg, sender)
      return
    }

    // Handle help command
    if (command === 'help' || command === 'menu') {
      await handleHelp(conn, msg, sender)
      return
    }

    // Unknown command
    if (command.length > 0) {
      await conn.sendMessage(sender, { 
        text: `❌ Unknown command: ${command}\n\nType !help for available commands` 
      })
    }

  } catch (error) {
    console.error('❌ Error processing message:', error)
    await conn.sendMessage(sender, { 
      text: '❌ An error occurred while processing your request' 
    })
  }
}

async function handleImport(conn, msg, sender, command) {
  try {
    const args = command.split(' ')
    if (args.length < 2) {
      await conn.sendMessage(sender, { 
        text: '📥 *Import Usage:*\n!import [text/data]\nExample: !import Hello, this is an imported message' 
      })
      return
    }

    const dataToImport = args.slice(1).join(' ')
    
    // Add to message store
    messageStore.messages.push({
      id: Date.now(),
      text: dataToImport,
      imported: true,
      timestamp: new Date().toISOString(),
      importedBy: sender
    })
    
    messageStore.stats.total++
    
    // Save to file
    fs.writeFileSync(path.join(__dirname, 'message_store.json'), JSON.stringify(messageStore, null, 2))
    
    await conn.sendMessage(sender, { 
      text: `✅ *Import Successful!*\n\n📝 Imported: "${dataToImport}"\n📊 Total messages: ${messageStore.stats.total}` 
    })
    
  } catch (error) {
    console.error('Import error:', error)
    await conn.sendMessage(sender, { text: '❌ Failed to import data' })
  }
}

async function handleExport(conn, msg, sender, command) {
  try {
    const args = command.split(' ')
    const exportAll = args.includes('--all')
    
    let exportData = {}
    
    if (exportAll) {
      exportData = messageStore
    } else {
      // Export last 10 messages
      const recentMessages = messageStore.messages.slice(-10)
      exportData = {
        messages: recentMessages,
        stats: {
          total: recentMessages.length,
          lastExport: new Date().toISOString()
        }
      }
    }
    
    // Create export file
    const exportFile = path.join(__dirname, `export_${Date.now()}.json`)
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2))
    
    // Send file
    const fileBuffer = fs.readFileSync(exportFile)
    await conn.sendMessage(sender, {
      document: fileBuffer,
      mimetype: 'application/json',
      fileName: `messages_export_${new Date().toISOString().split('T')[0]}.json`,
      caption: `📊 *Export Complete!*\n\n📝 Messages exported: ${exportData.messages?.length || 0}\n📅 Date: ${new Date().toLocaleDateString()}\n🔍 Type: ${exportAll ? 'Full' : 'Recent (10)'}`
    })
    
    // Clean up
    fs.unlinkSync(exportFile)
    
  } catch (error) {
    console.error('Export error:', error)
    await conn.sendMessage(sender, { text: '❌ Failed to export data' })
  }
}

async function handleStats(conn, msg, sender) {
  try {
    const stats = messageStore.stats
    const lastMessages = messageStore.messages.slice(-5)
    
    let statsText = `📊 *Message Statistics*\n\n`
    statsText += `📝 Total Messages: ${stats.total}\n`
    statsText += `📈 Messages by Type:\n`
    
    for (const [type, count] of Object.entries(stats.byType)) {
      statsText += `  • ${type}: ${count}\n`
    }
    
    if (lastMessages.length > 0) {
      statsText += `\n📋 *Last 5 Messages:*\n`
      lastMessages.forEach((msg, i) => {
        statsText += `${i+1}. ${msg.text?.substring(0, 50)}${msg.text?.length > 50 ? '...' : ''}\n`
      })
    }
    
    await conn.sendMessage(sender, { text: statsText })
    
  } catch (error) {
    console.error('Stats error:', error)
    await conn.sendMessage(sender, { text: '❌ Failed to get statistics' })
  }
}

async function handleHelp(conn, msg, sender) {
  const helpText = `🤖 *Sila Tech Bot Commands*

📥 *Import:*
!import [text] - Import text message

📤 *Export:*
!export - Export recent 10 messages
!export --all - Export all messages

📊 *Stats:*
!stats - View message statistics

ℹ️ *Help:*
!help or !menu - Show this menu

✨ *Features:*
• Message import/export system
• Message statistics
• No auto-reply (command only)

📌 *Examples:*
!import Hello, this is a test
!stats
!export`

  await conn.sendMessage(sender, { text: helpText })
}

function logMessage(sender, content, type) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    sender: sender,
    content: content,
    type: type
  }
  
  // Update stats
  messageStore.stats.total++
  messageStore.stats.byType[type] = (messageStore.stats.byType[type] || 0) + 1
  
  if (!messageStore.stats.bySender[sender]) {
    messageStore.stats.bySender[sender] = 0
  }
  messageStore.stats.bySender[sender]++
  
  // Log to file
  if (config.LOG_FILE) {
    let logs = []
    const logFile = path.join(__dirname, config.LOG_FILE)
    if (fs.existsSync(logFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf8'))
      } catch (e) {}
    }
    logs.push(logEntry)
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2))
  }
  
  // Save message store periodically
  if (messageStore.messages.length % 10 === 0) {
    fs.writeFileSync(path.join(__dirname, 'message_store.json'), JSON.stringify(messageStore, null, 2))
  }
}

module.exports = { processMessage }