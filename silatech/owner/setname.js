import { config } from '../../config.js';

export default {
  name: 'setname',
  alias: ['name', 'botname'],
  description: 'Change bot name',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      const currentName = config.BOT_NAME || 'SILA TECH BOT';
      await sock.sendMessage(sender, { 
        text: `✦ Current bot name: ${currentName}\n◉ Usage: ${prefix}setname [new name]` 
      });
      return;
    }
    
    const newName = args.join(' ');
    config.updateSetting('BOT_NAME', newName);
    await sock.sendMessage(sender, { 
      text: `✦ Bot name updated to: ${newName}` 
    });
  }
};