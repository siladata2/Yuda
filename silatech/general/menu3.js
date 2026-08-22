export default {
  name: 'menu3',
  alias: ['menu3', 'm3'],
  description: 'Interactive menu with buttons',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isOwner = options.isOwner ? options.isOwner() : false;
    const mode = options.getBotMode ? options.getBotMode() : 'public';
    
    try {
      // Send first row of buttons
      await sock.sendMessage(sender, {
        text: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n◉ Prefix: ${prefix}\n◉ Mode: ${mode}\n◉ Commands: ${options.commands?.size || 0}\n◉ Status: Online\n\n▸ Select an option:`,
        footer: '✦ Sila Tech Bot',
        buttons: [
          { buttonId: `${prefix}ping`, buttonText: { displayText: '🏓 Ping' }, type: 1 },
          { buttonId: `${prefix}stats`, buttonText: { displayText: '📊 Stats' }, type: 1 },
          { buttonId: `${prefix}ai`, buttonText: { displayText: '🤖 AI Chat' }, type: 1 },
          { buttonId: `${prefix}generate`, buttonText: { displayText: '🎨 Generate' }, type: 1 }
        ],
        headerType: 1
      }, { quoted: msg });
      
      // Send second row after a small delay
      setTimeout(async () => {
        const buttons = [
          { buttonId: `${prefix}groupinfo`, buttonText: { displayText: '👥 Group Info' }, type: 1 },
          { buttonId: `${prefix}add`, buttonText: { displayText: '➕ Add Member' }, type: 1 }
        ];
        
        if (isOwner) {
          buttons.push(
            { buttonId: `${prefix}mode status`, buttonText: { displayText: `⚙️ Mode` }, type: 1 },
            { buttonId: `${prefix}reload`, buttonText: { displayText: '🔄 Reload' }, type: 1 }
          );
        }
        
        await sock.sendMessage(sender, {
          text: isOwner ? '✦ Owner & Group Commands' : '✦ Group Commands',
          footer: '✦ Sila Tech Bot',
          buttons: buttons,
          headerType: 1
        }, { quoted: msg });
      }, 800);
      
    } catch (error) {
      console.error('Menu error:', error);
      
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