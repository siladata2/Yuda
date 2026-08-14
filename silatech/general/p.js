// silatech/general/ping.js
export default {
  name: 'ping2',
  alias: ['pong', 'latency'],
  description: 'Check bot latency with rich UI',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const start = Date.now();
    const uptime = process.uptime();
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    // 1. Tuma "Pinging..." kwanza
    const sent = await sock.sendMessage(msg.key.remoteJid, { 
      text: '🏓 *RICHTOR PING* \n\n_Inapima kasi..._' 
    });

    const latency = Date.now() - start;

    // 2. Tuma Rich Message na buttons
    const richMessage = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `🏓 *PONG!* 🏓\n\n` +
                    `⏱️ *Latency:* ${latency}ms\n` +
                    `📊 *Status:* \`Connected\`\n` +
                    `🕒 *Uptime:* ${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s\n` +
                    `💾 *RAM:* ${memory} MB\n` +
                    `⚡ *Powered by:* SILA TECH`
            },
            header: {
              title: "RichTor System Status",
              hasMediaAttachment: true,
              // Weka thumbnail yako hapa
              imageMessage: {
                url: "https://i.imgur.com/xxxxxxx.jpg" // Weka link ya logo yako ya Blue on Black
              }
            },
            footer: {
              text: "© 2026 SILA TECH"
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🔄 Ping Tena",
                    id: `${prefix}ping`
                  })
                },
                {
                  name: "quick_reply", 
                  buttonParamsJson: JSON.stringify({
                    display_text: "📊 Menu",
                    id: `${prefix}menu`
                  })
                }
              ]
            }
          }
        }
      }
    };

    await sock.sendMessage(msg.key.remoteJid, richMessage, { 
      quoted: sent 
    });
  }
};