// silatech/general/ping.js
export default {
  name: 'ping',
  alias: ['pong', 'speed'],
  description: 'Check bot latency with editing animation',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const start = Date.now();
    const imageUrl = 'https://i.ibb.co/674988wP/silatech.jpg';

    // 1. Tuma ujumbe wa kwanza wa Pinging...
    const initialMsg = await sock.sendMessage(msg.key.remoteJid, {
      text: '🏓 *Pinging...*',
      contextInfo: {
        externalAdReply: {
          title: "SILA TECH BOT SYSTEM",
          body: "Testing response speed...",
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: imageUrl,
          sourceUrl: "https://api.silatech.site"
        }
      }
    }, { quoted: msg });

    // 2. Kagua latency na kuandaa Uptime
    const latency = Date.now() - start;

    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    const resultText = `🏓 *PONG!*

⚡ *Speed:* \`${latency}ms\`
⏱️ *Uptime:* \`${uptimeStr}\`
📊 *Status:* \`Active & Connected\`
🤖 *Bot:* \`SILA TECH BOT\``;

    // 3. Edit ujumbe wa kwanza na kuweka matokeo
    await sock.sendMessage(msg.key.remoteJid, {
      text: resultText,
      edit: initialMsg.key,
      contextInfo: {
        externalAdReply: {
          title: "SILA TECH BOT SYSTEM",
          body: `Response Time: ${latency}ms`,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: imageUrl,
          sourceUrl: "https://api.silatech.site"
        }
      }
    });
  }
};
