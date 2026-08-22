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
      // Send the menu with buttons using native WhatsApp format
      await sock.sendMessage(sender, {
        text: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n◉ Prefix: ${prefix}\n◉ Mode: ${mode}\n◉ Status: Online\n\n▸ Select an option below:`,
        footer: '✦ Created by Sila Tech',
        buttons: [
          {
            buttonId: `${prefix}ping`,
            buttonText: { displayText: '🏓 Ping' },
            type: 1
          },
          {
            buttonId: `${prefix}stats`,
            buttonText: { displayText: '📊 Stats' },
            type: 1
          },
          {
            buttonId: `${prefix}ai`,
            buttonText: { displayText: '🤖 AI Chat' },
            type: 1
          },
          {
            buttonId: `${prefix}generate`,
            buttonText: { displayText: '🎨 Generate' },
            type: 1
          }
        ],
        headerType: 1,
        viewOnce: false,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true
        }
      }, { quoted: msg });
      
      // Send second set of buttons for more options
      setTimeout(async () => {
        const buttonRows = [
          {
            buttonId: `${prefix}groupinfo`,
            buttonText: { displayText: '👥 Group Info' },
            type: 1
          },
          {
            buttonId: `${prefix}add`,
            buttonText: { displayText: '➕ Add Member' },
            type: 1
          }
        ];
        
        if (isOwner) {
          buttonRows.push({
            buttonId: `${prefix}mode status`,
            buttonText: { displayText: `⚙️ Mode: ${mode}` },
            type: 1
          });
          buttonRows.push({
            buttonId: `${prefix}reload`,
            buttonText: { displayText: '🔄 Reload' },
            type: 1
          });
        }
        
        await sock.sendMessage(sender, {
          text: isOwner ? '✦ Owner & Group Commands' : '✦ Group Commands',
          footer: '✦ Sila Tech Bot',
          buttons: buttonRows,
          headerType: 1
        }, { quoted: msg });
      }, 500);
      
    } catch (error) {
      console.error('Menu error:', error);
      
      // Fallback to text menu
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