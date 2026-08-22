// silatech/general/menu_advanced.js
import ButtonV2 from '../buttonv2.js';

export default {
  name: 'menuadv',
  alias: ['madv'],
  description: 'Advanced menu with native flow',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isOwner = options.isOwner ? options.isOwner() : false;
    
    try {
      const button = new ButtonV2(sock);
      
      // Add single select flow
      button.addSingleSelect(
        "📋 Categories",
        "categories",
        "✦ Sila Tech Menu",
        [
          {
            title: "✦ General",
            rows: [
              { title: "🏓 Ping", description: "Check latency", id: `${prefix}ping` },
              { title: "📊 Stats", description: "Bot stats", id: `${prefix}stats` }
            ]
          },
          {
            title: "✦ AI",
            rows: [
              { title: "🤖 AI Chat", description: "Chat with AI", id: `${prefix}ai` },
              { title: "🎨 Generate", description: "Generate images", id: `${prefix}generate` }
            ]
          },
          {
            title: "✦ Group",
            rows: [
              { title: "👥 Group Info", description: "Group details", id: `${prefix}groupinfo` },
              { title: "➕ Add Member", description: "Add to group", id: `${prefix}add` }
            ]
          }
        ]
      );
      
      if (isOwner) {
        button.addButton("⚙️ Mode", `${prefix}mode status`);
        button.addButton("🔄 Reload", `${prefix}reload`);
      }
      
      await button.send(sender, {
        text: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n◉ Select a category:`,
        footer: '✦ Sila Tech Bot',
        buttonText: '☰ Menu'
      });
      
    } catch (error) {
      console.error('Menu error:', error);
      await sock.sendMessage(sender, { text: `✖ ${error.message}` });
    }
  }
};