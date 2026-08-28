import { config } from '../../config.js';

export default {
  name: 'setowner',
  alias: ['owner', 'ownernumber', 'setownernumber'],
  description: 'Change owner phone number',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      const currentOwner = config.OWNER_NUMBER || 'Not set';
      await sock.sendMessage(sender, { 
        text: `✦ Current owner: ${currentOwner}\n◉ Usage: ${prefix}setowner [phone number]` 
      });
      return;
    }
    
    const cleanNumber = args[0].replace(/\D/g, '');
    if (cleanNumber.length < 9) {
      await sock.sendMessage(sender, { 
        text: `✖ Invalid phone number` 
      });
      return;
    }
    
    config.updateSetting('OWNER_NUMBER', cleanNumber);
    await sock.sendMessage(sender, { 
      text: `✦ Owner number updated to: ${cleanNumber}` 
    });
  }
};