import { config } from '../../config.js';

export default {
  name: 'setimage',
  alias: ['image', 'botimage', 'setbotimage'],
  description: 'Change bot image URL',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      const currentImage = config.BOT_IMAGE || 'Not set';
      await sock.sendMessage(sender, { 
        text: `✦ Current image: ${currentImage.substring(0, 30)}...\n◉ Usage: ${prefix}setimage [image URL]` 
      });
      return;
    }
    
    const imageUrl = args[0];
    if (!imageUrl.startsWith('http')) {
      await sock.sendMessage(sender, { 
        text: `✖ Please provide a valid image URL` 
      });
      return;
    }
    
    config.updateSetting('BOT_IMAGE', imageUrl);
    await sock.sendMessage(sender, { 
      text: `✦ Bot image updated` 
    });
  }
};