import { config } from '../../config.js';

export default {
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
                `▸ Commands:\n` +
                `  ${prefix}setname [name] - Change bot name\n` +
                `  ${prefix}setprefix [prefix] - Change prefix\n` +
                `  ${prefix}setowner [number] - Change owner\n` +
                `  ${prefix}setfooter [text] - Change footer\n` +
                `  ${prefix}setimage [url] - Change image\n` +
                `  ${prefix}setmode [mode] - Change mode\n` +
                `  ${prefix}setprefixless [on|off] - Toggle prefixless\n\n` +
                `✦ Created by Sila Tech`;
    
    await sock.sendMessage(sender, { text: txt });
  }
};