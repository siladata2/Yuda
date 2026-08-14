// silatech/general/alive.js
export default {
  name: 'alive',
  alias: ['bot', 'info'],
  description: 'Check bot online status',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    await sock.sendMessage(msg.key.remoteJid, {
      disclaimerText: 'SILA TECH BOT SYSTEM',
      richResponse: [
        {
          text: '🤖 *SILA TECH BOT IS ALIVE!*'
        },
        {
          text: `🟢 *System Status:* \`Online & Running\`\n⏱️ *Uptime:* \`${uptimeStr}\`\n👨‍💻 *Developer:* \`Sila Tech\`\n🌐 *Website:* \`silatech.site\``
        },
        {
          text: `Type *${prefix}menu* to see all available commands.`
        }
      ]
    }, { quoted: msg });
  }
};
