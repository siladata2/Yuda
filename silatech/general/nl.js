export default {
  name: 'nltext',
  alias: ['nlmsg', 'sendnltext'],
  description: 'Send text to newsletter',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      await sock.sendMessage(sender, {
        text: `✦ Newsletter Text\n◉ Usage: ${prefix}nltext [message]`
      });
      return;
    }
    
    try {
      const newsletterId = "120363426725658598@newsletter";
      const text = args.join(' ');
      
      const node = {
        tag: 'message',
        attrs: {
          to: newsletterId,
          id: generateMessageIDV2(),
          type: 'text',
        },
        content: [{
          tag: 'plaintext',
          attrs: { mediatype: 'text' },
          content: text
        }]
      };
      
      await sock.query(node);
      
      await sock.sendMessage(sender, {
        text: `✦ Newsletter text sent!\n◉ ID: ${newsletterId}`
      });
      
    } catch (error) {
      console.error('[nltext]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};