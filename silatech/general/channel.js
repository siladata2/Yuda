import { prepareWAMessageMedia, generateMessageIDV2, proto } from 'baileys';

export default {
  name: 'newsletter',
  alias: ['nl', 'broadcastnl', 'sendnl'],
  description: 'Send image to newsletter',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      const newsletterId = "120363426725658598@newsletter";
      const imageUrl = args[0] || "https://i.ibb.co/674988wP/silatech.jpg";
      const caption = args.slice(1).join(' ') || '✦ Sila Tech';
      
      // Prepare media
      const media = await prepareWAMessageMedia(
        { 
          image: { url: imageUrl },
          caption: caption
        },
        { 
          upload: sock.waUploadToServer,
          jid: '@newsletter'
        }
      );
      
      // Build node
      const node = {
        tag: 'message',
        attrs: {
          to: newsletterId,
          id: generateMessageIDV2(),
          type: 'media',
        },
        content: [{
          tag: 'plaintext',
          attrs: { mediatype: 'image' },
          content: await proto.Message.encode(media).finish()
        }]
      };
      
      // Send
      await sock.query(node);
      
      await sock.sendMessage(sender, {
        text: `✦ Newsletter sent successfully!\n◉ ID: ${newsletterId}\n◉ Image: ${imageUrl.substring(0, 30)}...`
      });
      
    } catch (error) {
      console.error('[newsletter]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};

