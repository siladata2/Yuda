import { proto } from '@itsliaaa/baileys';

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
      // Build sections for native flow
      const sections = [
        {
          title: "✦ General Commands",
          rows: [
            { 
              title: "📌 Help", 
              description: "Show this menu", 
              id: `${prefix}menu` 
            },
            { 
              title: "🏓 Ping", 
              description: "Check bot latency", 
              id: `${prefix}ping` 
            },
            { 
              title: "📊 Stats", 
              description: "View bot statistics", 
              id: `${prefix}stats` 
            }
          ]
        },
        {
          title: "✦ AI & Chat",
          rows: [
            { 
              title: "🤖 AI Chat", 
              description: "Chat with AI assistant", 
              id: `${prefix}ai` 
            },
            { 
              title: "🎨 Generate", 
              description: "Generate images with AI", 
              id: `${prefix}generate` 
            }
          ]
        },
        {
          title: "✦ Group Commands",
          rows: [
            { 
              title: "👥 Group Info", 
              description: "Get group details", 
              id: `${prefix}groupinfo` 
            },
            { 
              title: "➕ Add Member", 
              description: "Add someone to group", 
              id: `${prefix}add` 
            }
          ]
        }
      ];
      
      // Add owner section if owner
      if (isOwner) {
        sections.push({
          title: "✦ Owner Commands",
          rows: [
            { 
              title: "⚙️ Mode", 
              description: `Current: ${mode}`, 
              id: `${prefix}mode status` 
            },
            { 
              title: "🔄 Reload", 
              description: "Reload bot commands", 
              id: `${prefix}reload` 
            },
            { 
              title: "📤 Broadcast", 
              description: "Send broadcast message", 
              id: `${prefix}broadcast` 
            }
          ]
        });
      }
      
      // Send interactive message with list
      await sock.sendMessage(sender, {
        text: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n◉ Prefix: ${prefix}\n◉ Mode: ${mode}\n◉ Commands: ${options.commands?.size || 0}\n◉ Status: Online\n\n▸ Tap the button below to explore`,
        footer: '✦ Created by Sila Tech',
        list: {
          buttonText: '☰ Sila Menu',
          description: 'Select a category to view commands',
          sections: sections
        },
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true
        }
      }, { quoted: msg });
      
    } catch (error) {
      console.error('Menu error:', error);
      
      // Fallback to buttons
      try {
        await sock.sendMessage(sender, {
          text: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n◉ Prefix: ${prefix}\n◉ Mode: ${mode}\n\n▸ Quick commands:`,
          footer: '✦ Sila Tech Bot',
          buttons: [
            { buttonId: `${prefix}ping`, buttonText: { displayText: '🏓 Ping' }, type: 1 },
            { buttonId: `${prefix}stats`, buttonText: { displayText: '📊 Stats' }, type: 1 },
            { buttonId: `${prefix}ai`, buttonText: { displayText: '🤖 AI' }, type: 1 }
          ]
        }, { quoted: msg });
      } catch (e) {
        // Final fallback - text menu
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
  }
};