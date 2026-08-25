import { ButtonV2 } from '../silacode.js';

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
      const button = new ButtonV2(sock);
      
      // Add buttons
      button
        .addButton('🏓 Ping', `${prefix}ping`)
        .addButton('📊 Stats', `${prefix}stats`)
        .addButton('🤖 AI Chat', `${prefix}ai`)
        .addButton('🎨 Generate', `${prefix}generate`)
        .addButton('👥 Group Info', `${prefix}groupinfo`)
        .addButton('➕ Add Member', `${prefix}add`);
      
      if (isOwner) {
        button
          .addButton('⚙️ Mode', `${prefix}mode status`)
          .addButton('🔄 Reload', `${prefix}reload`);
      }
      
      // Set body and footer
      button
        .setBody(`✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n◉ Prefix: ${prefix}\n◉ Mode: ${mode}\n◉ Commands: ${options.commands?.size || 0}\n◉ Status: Online\n\n▸ Tap a button below:`)
        .setFooter('✦ Created by Sila Tech');
      
      // Send buttons
      await button.send(sender);
      
    } catch (error) {
      console.error('Menu3 error:', error);
      
      // Fallback to text menu
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