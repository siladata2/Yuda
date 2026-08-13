// silatech/general/interactive.js
// Advanced interactive message with multiple buttons

export default {
  name: 'interactive',
  alias: ['interact', 'inter'],
  description: 'Send interactive messages with multiple buttons',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    // Send a full interactive message
    await sock.sendMessage(sender, {
      text: `🌟 *Welcome to Sila Tech Bot!*\n\n` +
            `Select an option below to get started:`,
      footer: '✨ Sila Tech Bot v1.0',
      buttons: [
        {
          buttonId: '#menu',
          buttonText: { displayText: '📋 Main Menu' },
          type: 1
        },
        {
          buttonId: '#help',
          buttonText: { displayText: '🆘 Help' },
          type: 1
        },
        {
          buttonId: '#about',
          buttonText: { displayText: 'ℹ️ About' },
          type: 1
        },
        {
          buttonId: '#contact',
          buttonText: { displayText: '📱 Contact' },
          type: 1
        }
      ],
      headerType: 1,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: msg });
    
    // Send another interactive message with product options
    setTimeout(async () => {
      await sock.sendMessage(sender, {
        text: `🛍️ *Our Products*\n\nChoose a product to learn more:`,
        footer: '🏷️ Sila Tech Shop',
        buttons: [
          {
            buttonId: '#product_premium',
            buttonText: { displayText: '🌟 Premium' },
            type: 1
          },
          {
            buttonId: '#product_basic',
            buttonText: { displayText: '📱 Basic' },
            type: 1
          },
          {
            buttonId: '#product_enterprise',
            buttonText: { displayText: '🏢 Enterprise' },
            type: 1
          },
          {
            buttonId: '#product_custom',
            buttonText: { displayText: '🎨 Custom' },
            type: 1
          }
        ]
      }, { quoted: msg });
    }, 1000);
    
    await sock.sendMessage(sender, { 
      text: `✅ *Interactive Messages Sent!*\n\n🔘 2 sets of buttons displayed (8 buttons total)` 
    });
  }
};