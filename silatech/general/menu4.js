// silatech/general/menu.js
import ButtonV2 from '../buttonv2.js';

export default {
  name: 'menu4',
  alias: ['help', 'commands'],
  description: 'Show menu with buttons',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isOwner = options.isOwner ? options.isOwner() : false;
    const mode = options.getBotMode ? options.getBotMode() : 'public';
    
    try {
      const button = new ButtonV2(sock);
      
      button
        .addButton("🏓 Ping", `${prefix}ping`)
        .addButton("📊 Stats", `${prefix}stats`)
        .addButton("🤖 AI Chat", `${prefix}ai`)
        .addButton("🎨 Generate", `${prefix}generate`);
      
      if (isOwner) {
        button
          .addButton("⚙️ Mode", `${prefix}mode status`)
          .addButton("🔄 Reload", `${prefix}reload`);
      }
      
      await button.send(sender, {
        text: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n◉ Prefix: ${prefix}\n◉ Mode: ${mode}\n◉ Status: Online\n\n▸ Select an option:`,
        footer: '✦ Sila Tech Bot',
        moreText: '✦ More commands:'
      });
      
    } catch (error) {
      console.error('Menu error:', error);
      
      let txt = `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n`;
      txt += `◉ Prefix: ${prefix}\n`;
      txt += `◉ Mode: ${mode}\n\n`;
      txt += `▸ ${prefix}ping - Ping\n`;
      txt += `▸ ${prefix}stats - Stats\n`;
      txt += `▸ ${prefix}ai - AI\n`;
      txt += `▸ ${prefix}generate - Generate\n`;
      if (isOwner) {
        txt += `▸ ${prefix}mode - Mode\n`;
        txt += `▸ ${prefix}reload - Reload\n`;
      }
      txt += `\n✦ Sila Tech`;
      await sock.sendMessage(sender, { text: txt });
    }
  }
};