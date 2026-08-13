// config.js
module.exports = {
  // Add your session ID here
  SESSION_ID: '', // Format: sila~[base64 compressed session]
  
  // Bot settings
  ALLOW_GROUPS: false, // Set to true to allow group messages
  BOT_PREFIX: '.', // Command prefix
  
  // Auto reply settings
  AUTO_REPLY: true,
  DEFAULT_REPLY: 'Hello! I am Sila Tech Bot. How can I help you?',
  
  // Import/Export settings
  IMPORT_EXPORT: true,
  EXPORT_CHANNEL: 'status@broadcast', // Channel to send exported data
  
  // Message logging
  LOG_MESSAGES: true,
  LOG_FILE: 'message_logs.json'
}