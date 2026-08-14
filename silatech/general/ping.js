// silatech/general/ping.js
export default {
  name: 'ping',
  alias: ['pong', 'speed'],
  description: 'Check bot latency with rich style',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const start = Date.now();

    // Kuhesabu uptime
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

    await sock.sendMessage(msg.key.remoteJid, {
      text: pingText,
      contextInfo: {
        externalAdReply: {
          title: "SILA TECH BOT SYSTEM",
          body: `Response Time: ${latency}ms`,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true, // Weka false kama wataka thumbnail iwe ndogo
          thumbnailUrl: "https://i.ibb.co/674988wP/silatech.jpg", // Weka URL ya picha au logo yako
          sourceUrl: "https://api.silatech.site" // Link yako
        }
      }
    }, { quoted: msg });
  }
};
