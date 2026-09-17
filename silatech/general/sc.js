export default {
  name: 'sc',
  alias: ['script', 'repo', 'sourcecode'],
  description: 'Get source code',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const pushname = msg.pushName || 'User';
    const botImage = options.BOT_IMAGE || 'https://i.ibb.co/674988wP/silatech.jpg';
    
    const sc = `\`</> SOURCE CODE\``;
    
    const info = `
Hello, \`${pushname}\`
This source code is available for anyone who wants
to learn, develop, or modify
this base script.

"ACCESS"

«status   : PUBLIC
license  : FREE
creator  : Sila Tech»

"RULES"

1. CREDITS
   Do not remove the original credits.
   Credits must remain included.

2. RESALE
   Selling this base script in its
   original form is prohibited.

3. MODIFICATION
   You may resell it if you have
   added your own features or modifications.

4. OWNERSHIP
   Claiming this source code as
   100% your own work is prohibited.

"SYSTEM MESSAGE"

This source was made to be developed,
not to be claimed as your own.

</> happy coding, ${pushname}
`.trim();
    
    try {
      await sock.sendMessage(sender, {
        image: { url: botImage },
        caption: sc,
        footer: info,
        buttons: [
          {
            buttonId: 'get_sc',
            buttonText: { displayText: '📦 Get Source Code' },
            type: 1,
            nativeFlowInfo: {
              name: 'cta_url',
              paramsJson: JSON.stringify({
                display_text: '📦 Get Source Code',
                url: 'https://github.com/Sila-Md/Sila-Md',
                merchant_url: 'https://github.com/Sila-Md/Sila-Md'
              })
            }
          }
        ],
        headerType: 1,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true
        }
      }, { quoted: msg });
      
    } catch (error) {
      console.error('[sc]', error);
      
      await sock.sendMessage(sender, {
        text: `${sc}\n\n${info}\n\n▸ Source Code: https://github.com/Sila-Md/Sila-Md`
      }, { quoted: msg });
    }
  }
};
