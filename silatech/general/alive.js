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

    const imageUrl = 'https://i.ibb.co/674988wP/silatech.jpg';

    const aliveText = `🤖 *SILA TECH BOT IS ALIVE!*

🟢 *System Status:* \`Online & Running\`
⏱️ *Uptime:* \`${uptimeStr}\`
👨‍💻 *Developer:* \`Sila Tech\`
🌐 *Website:* \`silatech.site\`

Type *${prefix}menu* to see all available commands.`;

    await sock.sendMessage(msg.key.remoteJid, {
      disclaimerText: 'SILA TECH BOT SYSTEM',
      richResponse: [
        {
          image: { url: imageUrl },
          caption: aliveText
        }
      ]
    }, { quoted: msg });
  }
};
