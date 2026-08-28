import { config } from '../../config.js';

export default {
  name: 'stats',
  alias: ['status', 'info', 'botinfo'],
  description: 'Show bot statistics with image',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      // Get all settings from config
      const botName = config.BOT_NAME || 'SILA TECH BOT';
      const version = config.VERSION || '1.0.0';
      const footer = config.FOOTER || 'Created by Sila Tech';
      const botImage = config.BOT_IMAGE || 'https://i.ibb.co/674988wP/silatech.jpg';
      const ownerNumber = config.OWNER_NUMBER || 'Not set';
      const mode = config.MODE || 'public';
      const prefix = config.PREFIX || '.';
      const allowPrefixless = config.ALLOW_PREFIXLESS !== undefined ? config.ALLOW_PREFIXLESS : true;
      
      // Get system stats
      const uptime = process.uptime();
      const h = Math.floor(uptime / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);
      const memUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
      const memTotal = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
      const cpuUsage = process.cpuUsage();
      const cpuUser = Math.round(cpuUsage.user / 1000000);
      const cpuSystem = Math.round(cpuUsage.system / 1000000);
      
      // Build stats text
      const txt = `✦ ${botName}\n` +
                  `◉ Version: ${version}\n` +
                  `◉ Prefix: ${prefix}\n` +
                  `◉ Prefixless: ${allowPrefixless ? 'Yes' : 'No'}\n` +
                  `◉ Mode: ${mode}\n` +
                  `◉ Owner: ${ownerNumber}\n` +
                  `◉ Status: Connected\n` +
                  `◉ Uptime: ${h}h ${m}m ${s}s\n` +
                  `◉ Memory: ${memUsed}MB / ${memTotal}MB\n` +
                  `◉ CPU: ${cpuUser}s / ${cpuSystem}s\n` +
                  `◉ Commands: ${options.commands?.size || 0}\n` +
                  `◉ Library: @itsliaaa/baileys\n` +
                  `◉ Created: ${footer}`;
      
      // Send with image if available
      if (botImage && botImage.startsWith('http')) {
        await sock.sendMessage(sender, {
          image: { url: botImage },
          caption: txt,
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363426725658598@newsletter',
              newsletterName: botName,
              serverMessageId: Date.now().toString()
            }
          }
        });
      } else {
        // Send as text if no image
        await sock.sendMessage(sender, { text: txt });
      }
      
    } catch (error) {
      console.error('[stats]', error);
      
      // Fallback to text only
      const botName = config.BOT_NAME || 'SILA TECH BOT';
      const version = config.VERSION || '1.0.0';
      const footer = config.FOOTER || 'Created by Sila Tech';
      const ownerNumber = config.OWNER_NUMBER || 'Not set';
      
      const uptime = process.uptime();
      const h = Math.floor(uptime / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);
      
      const txt = `✦ ${botName}\n` +
                  `◉ Version: ${version}\n` +
                  `◉ Owner: ${ownerNumber}\n` +
                  `◉ Uptime: ${h}h ${m}m ${s}s\n` +
                  `◉ Commands: ${options.commands?.size || 0}\n` +
                  `✦ ${footer}`;
      
      await sock.sendMessage(sender, { text: txt });
    }
  }
};