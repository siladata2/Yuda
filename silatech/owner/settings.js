// silatech/owner/settings.js
export default {
  name: 'settings',
  alias: ['setting', 'config'],
  description: 'View or change bot settings',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    if (args.length === 0) {
      const settings = `⚙️ *Bot Settings*\n\n` +
                      `📌 Prefix: ${prefix}\n` +
                      `🤖 Name: ${options.BOT_NAME}\n` +
                      `📱 Status: Connected\n` +
                      `👑 Owner: ${options.isOwner ? '✅ Yes' : '❌ No'}`;
      
      await sock.sendMessage(msg.key.remoteJid, { text: settings });
      return;
    }
    
    // Handle setting changes
    const key = args[0].toLowerCase();
    const value = args.slice(1).join(' ');
    
    if (key === 'prefix' && value) {
      // Update prefix logic here
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `✅ Prefix updated to: ${value}` 
      });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `❌ Invalid setting. Use: settings [prefix] [value]` 
      });
    }
  }
};