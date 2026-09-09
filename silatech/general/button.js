export default {
  name: 'button',
  alias: ['btn', 'signup', 'register'],
  description: 'Send signup button',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      await sock.sendMessage(sender, {
        title: 'Fiora Sylvie',
        body: 'https://fiora.nixel.my.id/',
        footer: '✦ Sila Tech',
        buttons: [
          {
            buttonId: 'inapp_signup',
            buttonText: { displayText: '📝 Sign Up' },
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
      
    } catch (error) {
      console.error('[button]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};