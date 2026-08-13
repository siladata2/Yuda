// silatech/general/superping.js
// Advanced ping with animated status updates

export default {
  name: 'superping',
  alias: ['sping', 'ultraping', 'speedtest'],
  description: 'Advanced ping with animated status and speed test',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const startTime = Date.now();
    
    // Animation frames
    const frames = ['🔄', '⚡', '🚀', '🏓'];
    let frameIndex = 0;
    
    try {
      // Send initial message with animation
      const pingMsg = await sock.sendMessage(sender, {
        text: `🏓 Pinging... ${frames[0]}`
      }, { quoted: msg });
      
      // Update with animation frames
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        frameIndex = (frameIndex + 1) % frames.length;
        await sock.sendMessage(sender, {
          text: `🏓 Pinging... ${frames[frameIndex]}`
        }, { edit: pingMsg.key });
      }
      
      // Calculate final latency
      const latency = Date.now() - startTime;
      
      // Get system stats
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      
      const memory = process.memoryUsage();
      const usedMemory = Math.round(memory.heapUsed / 1024 / 1024);
      const totalMemory = Math.round(memory.heapTotal / 1024 / 1024);
      
      // Speed test - multiple pings
      const pingCount = 5;
      let totalLatency = 0;
      let minLatency = Infinity;
      let maxLatency = 0;
      
      for (let i = 0; i < pingCount; i++) {
        const pingStart = Date.now();
        await sock.sendPresenceUpdate('composing', sender);
        const pingLatency = Date.now() - pingStart;
        totalLatency += pingLatency;
        minLatency = Math.min(minLatency, pingLatency);
        maxLatency = Math.max(maxLatency, pingLatency);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const avgLatency = Math.round(totalLatency / pingCount);
      
      // Determine status
      let statusEmoji, statusText, performance;
      if (avgLatency <= 100) {
        statusEmoji = '🌟';
        statusText = 'EXCELLENT';
        performance = '⚡ Super Fast';
      } else if (avgLatency <= 300) {
        statusEmoji = '✅';
        statusText = 'GOOD';
        performance = '📡 Stable';
      } else if (avgLatency <= 600) {
        statusEmoji = '⚠️';
        statusText = 'AVERAGE';
        performance = '📶 Normal';
      } else {
        statusEmoji = '❌';
        statusText = 'SLOW';
        performance = '🐌 Needs Improvement';
      }
      
      // Create the final rich message
      const finalMessage = {
        disclaimerText: `🏓 Ping Complete! ${statusEmoji}`,
        richResponse: [
          {
            text: `🏓 *SPEED TEST RESULTS* ${statusEmoji}\n\n` +
                  `📊 *Status:* ${statusText}\n` +
                  `⚡ *Performance:* ${performance}\n` +
                  `⏱️ *Current Latency:* ${latency}ms\n` +
                  `📈 *Average Latency:* ${avgLatency}ms (${pingCount} pings)\n` +
                  `📉 *Min Latency:* ${minLatency}ms\n` +
                  `📈 *Max Latency:* ${maxLatency}ms\n\n` +
                  `🕐 *Test Time:* ${new Date().toLocaleTimeString()}`
          },
          {
            title: '📊 Performance Dashboard',
            table: [
              {
                isHeading: true,
                items: ['Metric', 'Value', 'Status']
              },
              {
                isHeading: false,
                items: ['Latency', `${avgLatency}ms`, statusEmoji]
              },
              {
                isHeading: false,
                items: ['Uptime', `${hours}h ${minutes}m ${seconds}s`, '✅']
              },
              {
                isHeading: false,
                items: ['Memory', `${usedMemory}MB / ${totalMemory}MB`, usedMemory < totalMemory * 0.8 ? '✅' : '⚠️']
              },
              {
                isHeading: false,
                items: ['Ping Tests', `${pingCount}`, '✅']
              },
              {
                isHeading: false,
                items: ['Speed', `${performance}`, statusEmoji]
              }
            ]
          },
          {
            text: '\n📦 *System Details:*\n' +
                  `• Node.js: ${process.version}\n` +
                  `• Platform: ${process.platform}\n` +
                  `• Architecture: ${process.arch}\n` +
                  `• Bot Version: ${options.VERSION || '1.0.0'}\n` +
                  `• Library: @itsliaaa/baileys\n\n` +
                  `✨ *All systems operational!*\n` +
                  `👨‍💻 *Created by:* Sila Tech`
          }
        ]
      };
      
      // Send the final rich message
      await sock.sendMessage(sender, finalMessage, { 
        quoted: msg,
        edit: pingMsg.key
      });
      
      // Send a quick summary
      await sock.sendMessage(sender, {
        text: `✅ *Speed Test Complete!*\n\n` +
              `🏓 Avg: ${avgLatency}ms | Min: ${minLatency}ms | Max: ${maxLatency}ms\n` +
              `📊 Status: ${statusText} ${statusEmoji}\n` +
              `⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s`
      });
      
    } catch (error) {
      console.error('Super ping error:', error);
      
      // Fallback simple ping
      const start = Date.now();
      const sent = await sock.sendMessage(sender, { text: '🏓 Pinging...' });
      const latency = Date.now() - start;
      
      await sock.sendMessage(sender, {
        text: `🏓 *Pong!*\n\n⏱️ Latency: ${latency}ms\n📊 Status: Connected`
      }, { edit: sent.key });
    }
  }
};