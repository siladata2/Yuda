import { config } from '../../config.js';

export default {
  name: 'setprefixless',
  alias: ['prefixless', 'toggleprefixless', 'noprefix'],
  description: 'Toggle prefixless mode (on/off)',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      const currentStatus = config.ALLOW_PREFIXLESS ? 'Enabled' : 'Disabled';
      await sock.sendMessage(sender, { 
        text: `✦ Prefixless mode: ${currentStatus}\n◉ Usage: ${prefix}setprefixless [on|off]` 
      });
      return;
    }
    
    const value = args[0].toLowerCase();
    const allow = value === 'on' || value === 'true' || value === '1';
    
    if (!['on', 'off', 'true', 'false', '1', '0'].includes(value)) {
      await sock.sendMessage(sender, { 
        text: `✖ Please use: on or off` 
      });
      return;
    }
    
    config.updateSetting('ALLOW_PREFIXLESS', allow);
    await sock.sendMessage(sender, { 
      text: `✦ Prefixless mode: ${allow ? 'Enabled' : 'Disabled'}` 
    });
  }
};