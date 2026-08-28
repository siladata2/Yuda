import { config } from '../../config.js';

export default {
  name: 'setfooter',
  alias: ['footer', 'changefooter'],
  description: 'Change bot footer text',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      const currentFooter = config.FOOTER || 'Created by Sila Tech';
      await sock.sendMessage(sender, { 
        text: `✦ Current footer: ${currentFooter}\n◉ Usage: ${prefix}setfooter [new footer]` 
      });
      return;
    }
    
    const newFooter = args.join(' ');
    config.updateSetting('FOOTER', newFooter);
    await sock.sendMessage(sender, { 
      text: `✦ Footer updated to: ${newFooter}` 
    });
  }
};