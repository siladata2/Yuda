import { config } from '../../config.js';

export default {
  name: 'setprefix',
  alias: ['prefix', 'changeprefix'],
  description: 'Change bot prefix',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      const currentPrefix = config.PREFIX || '.';
      await sock.sendMessage(sender, { 
        text: `✦ Current prefix: ${currentPrefix}\n◉ Usage: ${prefix}setprefix [new prefix]` 
      });
      return;
    }
    
    const newPrefix = args[0];
    if (newPrefix.length > 5) {
      await sock.sendMessage(sender, { 
        text: `✖ Prefix too long (max 5 characters)` 
      });
      return;
    }
    
    config.updateSetting('PREFIX', newPrefix);
    await sock.sendMessage(sender, { 
      text: `✦ Prefix updated to: ${newPrefix}` 
    });
  }
};