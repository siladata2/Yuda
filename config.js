// config.js
module.exports = {
  // Read SESSION_ID from environment variable (Heroku) or from config
  SESSION_ID: process.env.SESSION_ID || '',
  
  // Bot settings
  ALLOW_GROUPS: process.env.ALLOW_GROUPS === 'true' || false,
  BOT_PREFIX: process.env.BOT_PREFIX || '!',
  
  // Auto reply settings
  AUTO_REPLY: process.env.AUTO_REPLY !== 'false',
  DEFAULT_REPLY: process.env.DEFAULT_REPLY || 'Hello! I am Sila Tech Bot. How can I help you?',
  
  // Import/Export settings
  IMPORT_EXPORT: true,
  EXPORT_CHANNEL: 'status@broadcast',
  
  // Message logging
  LOG_MESSAGES: true,
  LOG_FILE: 'message_logs.json'
}