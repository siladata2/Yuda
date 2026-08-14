// silatech/general/ping.js
export default {
  name: 'ping2',
  alias: ['pong', 'speed'],
  description: 'Check bot latency with rich response structure',
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

    await sock.sendMessage(msg.key.remoteJid, {
      disclaimerText: 'SILA TECH BOT SYSTEM',
      richResponse: [
        {
          text: '🏓 *PONG!* Status na Taarifa za Bot:'
        },
        {
          title: 'System Performance',
          table: [
            {
              isHeading: true,
              items: ['Metric', 'Value']
            },
            {
              isHeading: false,
              items: ['Latency', `${latency}ms`]
            },
            {
              isHeading: false,
              items: ['Uptime', uptimeStr]
            },
            {
              isHeading: false,
              items: ['Status', 'Active & Connected']
            }
          ]
        },
        {
          language: 'bash',
          code: [
            {
              highlightType: 0,
              codeContent: `ping_ms=${latency}\nstatus="ONLINE"`
            }
          ]
        },
        {
          text: '🤖 Powered by *SILA TECH*'
        }
      ]
    }, { quoted: msg });
  }
};
