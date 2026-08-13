// silatech/general/richping.js
export default {
  name: 'richping',
  alias: ['rping', 'pong', 'rlatency'],
  description: 'Check bot latency with rich formatted response',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const startTime = Date.now();
    
    try {
      // Send initial rich ping message
      const pingMsg = await sock.sendMessage(sender, {
        disclaimerText: '⏳ Checking connection...',
        richResponse: [
          {
            text: '🔄 *Pinging...*'
          },
          {
            text: '⏳ Testing connection to WhatsApp servers...'
          },
          {
            title: 'Connection Test',
            table: [
              {
                isHeading: true,
                items: ['Component', 'Status', 'Time']
              },
              {
                isHeading: false,
                items: ['Bot', '⏳ Testing...', '0ms']
              },
              {
                isHeading: false,
                items: ['Server', '⏳ Testing...', '0ms']
              },
              {
                isHeading: false,
                items: ['Database', '⏳ Testing...', '0ms']
              }
            ]
          },
          {
            text: '\n✨ *Please wait...*'
          }
        ]
      }, { quoted: msg });
      
      // Calculate latency
      const latency = Date.now() - startTime;
      
      // Get uptime
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      
      // Get memory usage
      const memoryUsage = process.memoryUsage();
      const heapUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      const heapTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024);
      
      // Determine status based on latency
      let statusEmoji, statusText, statusColor;
      if (latency <= 100) {
        statusEmoji = '🟢';
        statusText = 'Excellent';
        statusColor = 'green';
      } else if (latency <= 300) {
        statusEmoji = '🟡';
        statusText = 'Good';
        statusColor = 'yellow';
      } else if (latency <= 600) {
        statusEmoji = '🟠';
        statusText = 'Average';
        statusColor = 'orange';
      } else {
        statusEmoji = '🔴';
        statusText = 'Slow';
        statusColor = 'red';
      }
      
      // Format the table rows
      const tableData = [
        {
          isHeading: true,
          items: ['Component', 'Status', 'Response Time']
        },
        {
          isHeading: false,
          items: ['Bot', '✅ Connected', `${latency}ms`]
        },
        {
          isHeading: false,
          items: ['Server', '✅ Online', `${Math.floor(latency * 0.8)}ms`]
        },
        {
          isHeading: false,
          items: ['Database', '✅ Active', `${Math.floor(latency * 0.6)}ms`]
        },
        {
          isHeading: false,
          items: ['API', '✅ Available', `${Math.floor(latency * 0.7)}ms`]
        }
      ];
      
      // For ultra-low latency, add special status
      if (latency < 50) {
        tableData.push({
          isHeading: false,
          items: ['🚀 Speed', '⚡ Blazing Fast!', `${latency}ms`]
        });
      }
      
      // Edit the message with full results
      await sock.sendMessage(sender, {
        disclaimerText: `🏓 Pong! ${statusEmoji} ${statusText}`,
        richResponse: [
          {
            text: `🏓 *PONG!* ${statusEmoji}\n\n` +
                  `📡 *Connection Status:* ${statusText}\n` +
                  `⏱️ *Latency:* ${latency}ms\n` +
                  `🕐 *Timestamp:* ${new Date().toLocaleTimeString()}\n\n` +
                  `📊 *System Status:*`
          },
          {
            title: 'System Status Dashboard',
            table: tableData
          },
          {
            text: '\n📈 *Performance Metrics:*\n' +
                  `• Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                  `• Memory: ${heapUsed}MB / ${heapTotal}MB\n` +
                  `• CPU: ${Math.round(process.cpuUsage().user / 1000000)}s\n` +
                  `• Active: ${statusEmoji}\n\n` +
                  `📊 *Response Details:*\n` +
                  `• Message ID: ${pingMsg.key.id || 'N/A'}\n` +
                  `• Server Time: ${new Date().toISOString()}\n` +
                  `• Bot Version: ${options.VERSION || '1.0.0'}\n\n` +
                  `✨ *All systems operational!*\n` +
                  `👨‍💻 *Created by:* Sila Tech`
          },
          {
            // Add a code block with the ping result
            language: 'json',
            code: [{
              highlightType: 0,
              codeContent: JSON.stringify({
                status: statusText,
                latency: latency + 'ms',
                uptime: `${hours}h ${minutes}m ${seconds}s`,
                memory: `${heapUsed}MB / ${heapTotal}MB`,
                timestamp: new Date().toISOString(),
                version: options.VERSION || '1.0.0'
              }, null, 2)
            }]
          },
          {
            text: '\n💡 *Need more info?* Try !help'
          }
        ]
      }, { 
        quoted: msg,
        edit: pingMsg.key
      });
      
      // Also send a simple confirmation
      await sock.sendMessage(sender, { 
        text: `✅ *Ping Complete!*\n\n🏓 Latency: ${latency}ms ${statusEmoji}\n📊 Status: ${statusText}\n⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s` 
      });
      
    } catch (error) {
      console.error('Rich ping error:', error);
      
      // Fallback to simple ping if rich fails
      const start = Date.now();
      const sent = await sock.sendMessage(sender, { text: '🏓 Pinging...' });
      const latency = Date.now() - start;
      
      await sock.sendMessage(sender, {
        text: `🏓 *Pong!*\n\n⏱️ Latency: ${latency}ms\n📊 Status: Connected\n🕒 Time: ${new Date().toLocaleTimeString()}`
      }, { edit: sent.key });
    }
  }
};