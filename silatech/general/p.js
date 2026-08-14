// silatech/general/ping.js
export default {
  name: 'ping2',
  alias: ['pong', 'speed'],
  description: 'Check bot latency with rich style',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const start = Date.now();

    // 1. Tuma ujumbe wa kwanza
    await sock.sendMessage(msg.key.remoteJid, {
      disclaimerText: 'SILA TECH BOT SYSTEM',
      richResponse: [
        {
          text: ''
        }
      ]
    }, { quoted: msg });

    // 2. Kagua latency na kuandaa Uptime
    const latency = Date.now() - start;

    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    const pingText = `🏓 *PONG!*

⚡ *Speed:* \`${latency}ms\`
⏱️ *Uptime:* \`${uptimeStr}\`
📊 *Status:* \`Active & Connected\`
🤖 *Bot:* \`SILA TECH BOT\``;

    // 3. Tuma ujumbe wa pili wa matokeo
    await sock.sendMessage(msg.key.remoteJid, {
      disclaimerText: 'SILA TECH BOT SYSTEM',
      richResponse: [
        {
          text: pingText
        }
      ]
    }, { quoted: msg });
  }
};
