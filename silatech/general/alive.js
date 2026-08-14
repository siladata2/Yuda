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
🌐 *API:* \`api.silatech.site\`

Type *${prefix}menu* to see all available commands.`;

    // 1. Tuma ujumbe wa kwanza wa kuangalia status
    await sock.sendMessage(msg.key.remoteJid, {
      disclaimerText: 'SILA TECH BOT SYSTEM',
      richResponse: [
        {
          text: '⚡ *Checking System Status...*'
        }
      ]
    }, { quoted: msg });

    // 2. Tuma taarifa kamili za Alive
    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: imageUrl },
      caption: aliveText,
      contextInfo: {
        externalAdReply: {
          title: "SILA TECH OFFICIAL BOT",
          body: "System Active",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: imageUrl,
          sourceUrl: "https://api.silatech.site"
        }
      }
    }, { quoted: msg });
  }
};
