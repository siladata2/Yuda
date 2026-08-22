import { ButtonV2 } from '@itsliaaa/baileys';

export default {
  name: 'menu3',
  alias: ['help', 'commands'],
  description: 'Interactive menu',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isOwner = options.isOwner ? options.isOwner() : false;
    const mode = options.getBotMode ? options.getBotMode() : 'public';
    
    try {
      const sections = [
        {
          title: "✦ General",
          rows: [
            { title: "📌 Help", description: "Show menu", id: `${prefix}menu` },
            { title: "🏓 Ping", description: "Check latency", id: `${prefix}ping` },
            { title: "📊 Stats", description: "Bot statistics", id: `${prefix}stats` }
          ]
        },
        {
          title: "✦ AI & Chat",
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
      ];
      
      if (isOwner) {
        sections.push({
          title: "✦ Owner",
          rows: [
            { title: "⚙️ Mode", description: `Current: ${mode}`, id: `${prefix}mode status` },
            { title: "🔄 Reload", description: "Reload commands", id: `${prefix}reload` }
          ]
        });
      }
      
      await new ButtonV2(sock)
        .addRawButton({
          buttonText: { displayText: "☰ Sila Menu" },
          buttonId: "main_menu",
          type: 1,
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify({
              title: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}`,
              sections: sections
            })
          }
        })
        .send(sender);
        
    } catch (error) {
      console.error('Menu error:', error);
      
      let txt = `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n`;
      txt += `◉ Prefix: ${prefix}\n`;
      txt += `◉ Mode: ${mode}\n\n`;
      txt += `▸ ${prefix}menu - Menu\n`;
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