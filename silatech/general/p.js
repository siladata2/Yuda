// silatech/general/ping3.js
export default {
  name: 'ping3',
  alias: ['p3', 'speedtest'],
  description: 'Check bot latency x3 with v2 buttons',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const jid = msg.key.remoteJid;
    
    // Fanya ping mara 3
    let results = [];
    for(let i = 0; i < 3; i++) {
      const start = Date.now();
      await sock.sendMessage(jid, { text: '.' }, { quoted: msg });
      results.push(Date.now() - start);
      await new Promise(r => setTimeout(r, 200));
    }
    
    const avg = Math.floor(results.reduce((a,b) => a+b)/3);
    const min = Math.min(...results);
    const max = Math.max(...results);
    const uptime = process.uptime();
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    // Rich Message V2
    const message = {
      interactiveMessage: {
        header: {
          title: "🏓 RICHTOR PING V2",
          subtitle: "SILA TECH SYSTEM",
          hasMediaAttachment: true,
          imageMessage: {
            // Weka link ya logo yako hapa
            url: "https://i.imgur.com/xxxxxxx.jpg" 
          }
        },
        body: {
          text: `*Matokeo ya Ping x3*\n\n` +
                `1️⃣ Test 1: ${results[0]}ms\n` +
                `2️⃣ Test 2: ${results[1]}ms\n` +
                `3️⃣ Test 3: ${results[2]}ms\n` +
                `📊 *Average:* ${avg}ms\n` +
                `⚡ *Min:* ${min}ms | *Max:* ${max}ms\n` +
                `🕒 *Uptime:* ${Math.floor(uptime/3600)}h ${Math.floor((uptime%3600)/60)}m\n` +
                `💾 *RAM:* ${ram} MB`
        },
        footer: {
          text: "© 2026 RichTor by SILA TECH"
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "🔄 Ping Tena",
                id: `${prefix}ping3`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "📈 Stats",
                id: `${prefix}stats`
              })
            },
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "🌐 Website",
                url: "https://silatech.com" // Weka site yako
              })
            }
          ]
        }
      }
    };

    await sock.sendMessage(jid, message, { quoted: msg });
  }
};