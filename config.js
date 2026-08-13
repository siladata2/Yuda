// config.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Session
  SESSION_ID: process.env.SESSION_ID || '',
  
  // Bot Info
  BOT_NAME: process.env.BOT_NAME || 'SILA TECH BOT',
  VERSION: '1.0.0',
  PREFIX: process.env.PREFIX || '.',
  
  // Owner
  OWNER_NUMBER: process.env.OWNER_NUMBER || '',
  
  // Settings
  ALLOW_GROUPS: process.env.ALLOW_GROUPS === 'true' || true,
  AUTO_REPLY: false,
  
  // Anti Systems (enable/disable)
  ANTILINK: true,
  ANTIBADWORD: true,
  ANTIBOT: true,
  ANTIBUG: true,
  ANTIBUN: true,
  ANTIFAKE: true,
  ANTIFORWARD: true,
  ANTIGROUPLINK: true,
  ANTIMEDIA: true,
  ANTIMENTION: true,
  ANTISPAM: true,
  ANTISTATUS: true,
  ANTITAG: true,
  CHATBOT: true,
  
  // Paths
  SESSION_DIR: './sessions',
  COMMANDS_DIR: './silatech'
};