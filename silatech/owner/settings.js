import { config } from '../../config.js';

// Command: setname
export const setname = {
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

// Command: setprefix
export const setprefix = {
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

// Command: setowner
export const setowner = {
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

// Command: setfooter
export const setfooter = {
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

// Command: setimage
export const setimage = {
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

// Command: setmode
export const setmode = {
  name: 'setmode',
  alias: ['mode', 'changemode', 'botmode'],
  description: 'Change bot mode (public, private, self)',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      const currentMode = config.MODE || 'public';
      await sock.sendMessage(sender, { 
        text: `✦ Current mode: ${currentMode}\n◉ Usage: ${prefix}setmode [public|private|self]` 
      });
      return;
    }
    
    const validModes = ['public', 'private', 'self'];
    const newMode = args[0].toLowerCase();
    
    if (!validModes.includes(newMode)) {
      await sock.sendMessage(sender, { 
        text: `✖ Invalid mode. Use: public, private, or self` 
      });
      return;
    }
    
    config.updateSetting('MODE', newMode);
    // Also update the mode file
    if (options.setBotMode) {
      options.setBotMode(newMode);
    }
    await sock.sendMessage(sender, { 
      text: `✦ Bot mode updated to: ${newMode}` 
    });
  }
};

// Command: setprefixless
export const setprefixless = {
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

// Command: settings (view all)
export const settings = {
  name: 'settings',
  alias: ['set', 'config', 'botconfig', 'viewsettings'],
  description: 'View all bot settings',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    const settings = config.loadSettings();
    const txt = `✦ Bot Settings\n\n` +
                `◉ Name: ${settings.BOT_NAME}\n` +
                `◉ Version: ${settings.VERSION}\n` +
                `◉ Prefix: ${settings.PREFIX}\n` +
                `◉ Prefixless: ${settings.ALLOW_PREFIXLESS ? 'Yes' : 'No'}\n` +
                `◉ Owner: ${settings.OWNER_NUMBER}\n` +
                `◉ Mode: ${settings.MODE}\n` +
                `◉ Footer: ${settings.FOOTER}\n` +
                `◉ Image: ${settings.BOT_IMAGE ? settings.BOT_IMAGE.substring(0, 30) + '...' : 'Not set'}\n\n` +
                `✦ Created by Sila Tech`;
    
    await sock.sendMessage(sender, { text: txt });
  }
};

// Default export - all commands
export default {
  setname,
  setprefix,
  setowner,
  setfooter,
  setimage,
  setmode,
  setprefixless,
  settings
};