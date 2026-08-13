// config.js
module.exports = {
  // Read SESSION_ID from environment variable (Heroku) or from config
  SESSION_ID: process.env.SESSION_ID || '',
  
  // Bot settings
  ALLOW_GROUPS: process.env.ALLOW_GROUPS === 'true' || true, // Allow groups by default
  BOT_PREFIX: process.env.BOT_PREFIX || '.', '/',
  
  // Auto reply settings - DISABLED
  AUTO_REPLY: false, // Changed to false
  
  // Import/Export settings
  IMPORT_EXPORT: true,
  EXPORT_CHANNEL: 'status@broadcast',
  
  // Message logging
  LOG_MESSAGES: true,
  LOG_FILE: 'message_logs.json'
}