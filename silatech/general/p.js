// silatech/general/ping.js
export default {
  name: 'ping2',
  alias: ['pong'],
  description: 'Check bot latency with location rich format',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const start = Date.now();
    const latency = Date.now() - start;

    await sock.sendMessage(msg.key.remoteJid, {
      location: { 
        degreesLatitude: 0, 
        degreesLongitude: 0,
        name: `⚡ SILA TECH LATENCY: ${latency}ms`
      },
      caption: `🏓 *PONG!*\n\n⏱️ *Latency:* \`${latency}ms\`\n📊 *Status:* \`Online\`\n🕒 *Uptime:* \`${Math.floor(process.uptime())}s\``,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363000000000000@newsletter', // JID ya channel yako kama unayo
          newsletterName: 'SILA TECH UPDATES',
          serverMessageId: -1
        }
      }
    }, { quoted: msg });
  }
};
