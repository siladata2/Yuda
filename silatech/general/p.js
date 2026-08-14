// silatech/general/ping.js
export default {
  name: 'ping2',
  alias: ['pong', 'speed'],
  description: 'Check bot latency with rich style and animation',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const start = Date.now();
    const imageUrl = 'https://i.ibb.co/674988wP/silatech.jpg';

    // 1. Tuma ujumbe wa kwanza (Pinging...)
    const initialMsg = await sock.sendMessage(msg.key.remoteJid, {
      richResponse: [{ text: '🏓 *Pinging...*' }],
      contextInfo: {
        externalAdReply: {
          title: "SILA TECH BOT SYSTEM",
          body: "Testing speed...",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: imageUrl,
          sourceUrl: "https://api.silatech.site"
        }
      }
    }, { quoted: msg });

    // 2. Mahesabu ya Uptime na Latency
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    const latency = Date.now() - start;

    const pingText = `🏓 *PONG!*

⚡ *Speed:* \`${latency}ms\`
⏱️ *Uptime:* \`${uptimeStr}\`
📊 *Status:* \`Active & Connected\`
🤖 *Bot:* \`SILA TECH BOT\``;

    // 3. Edit ujumbe wa kwanza na kuweka matokeo
    await sock.sendMessage(msg.key.remoteJid, {
      edit: initialMsg.key,
      richResponse: [{ text: pingText }],
      contextInfo: {
        externalAdReply: {
          title: "SILA TECH BOT SYSTEM",
          body: `Response Time: ${latency}ms`,
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: imageUrl,
          sourceUrl: "https://api.silatech.site"
        }
      }
    });
  }
};
