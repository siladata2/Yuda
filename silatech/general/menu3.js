import { ButtonV2 } from '@itsliaaa/baileys';

export default {
  name: 'menu3',
  alias: ['m3'],
  description: 'Interactive menu with ButtonV2',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isOwner = options.isOwner ? options.isOwner() : false;
    const mode = options.getBotMode ? options.getBotMode() : 'public';
    
    try {
      // Send header message
      await sock.sendMessage(sender, {
        text: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n◉ Prefix: ${prefix}\n◉ Mode: ${mode}\n◉ Commands: ${options.commands?.size || 0}\n◉ Status: Online\n\n▸ Select an option:`,
        footer: '✦ Created by Sila Tech'
      }, { quoted: msg });
      
      // Send buttons using ButtonV2
      const button = new ButtonV2(sock);
      
      // Add buttons based on user type
      button
        .addButton("🏓 Ping", `${prefix}ping`)
        .addButton("📊 Stats", `${prefix}stats`)
        .addButton("🤖 AI Chat", `${prefix}ai`)
        .addButton("🎨 Generate", `${prefix}generate`);
      
      // Send first row
      await button.send(sender);
      
      // Second row of buttons
      setTimeout(async () => {
        const button2 = new ButtonV2(sock);
        
        button2
          .addButton("👥 Group", `${prefix}groupinfo`)
          .addButton("➕ Add", `${prefix}add`);
        
        if (isOwner) {
          button2
            .addButton("⚙️ Mode", `${prefix}mode status`)
            .addButton("🔄 Reload", `${prefix}reload`);
        }
        
        await button2.send(sender);
      }, 500);
      
    } catch (error) {
      console.error('Menu error:', error);
      
      // Fallback to text
      let txt = `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n`;
      txt += `◉ Prefix: ${prefix}\n`;
      txt += `◉ Mode: ${mode}\n\n`;
      txt += `▸ ${prefix}ping - Ping\n`;
      txt += `▸ ${prefix}stats - Stats\n`;
      txt += `▸ ${prefix}ai - AI Chat\n`;
      txt += `▸ ${prefix}generate - Generate\n`;
      txt += `▸ ${prefix}groupinfo - Group Info\n`;
      txt += `▸ ${prefix}add - Add Member\n`;
      if (isOwner) {
        txt += `\n▸ ${prefix}mode - Change mode\n`;
        txt += `▸ ${prefix}reload - Reload commands\n`;
      }
      txt += `\n✦ Created by Sila Tech`;
      await sock.sendMessage(sender, { text: txt });
    }
  }
};