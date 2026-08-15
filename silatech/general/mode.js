export default {
  name: 'mode',
  alias: ['setmode', 'botmode'],
  description: 'Change bot mode (public, private, self)',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const currentMode = options.getBotMode ? options.getBotMode() : 'public';
    
    if (args.length === 0 || args[0] === 'status') {
      const info = {
        'public': '✦ Public - Anyone can use',
        'private': '◉ Private - Owner only',
        'self': '◈ Self - Bot only'
      };
      
      const txt = `◉ Current Mode: ${currentMode.toUpperCase()}\n`;
      txt += `${info[currentMode] || ''}\n\n`;
      txt += `▸ Change: ${prefix}mode [public|private|self]`;
      
      await sock.sendMessage(sender, { text: txt });
      return;
    }
    
    const newMode = args[0].toLowerCase();
    const result = options.setBotMode ? options.setBotMode(newMode) : { success: false };
    
    if (!result.success) {
      await sock.sendMessage(sender, { text: `✖ Failed: ${result.error || 'Unknown error'}` });
      return;
    }
    
    const emojis = { 'public': '✦', 'private': '◉', 'self': '◈' };
    await sock.sendMessage(sender, {
      text: `${emojis[newMode] || '◉'} Mode changed to ${newMode.toUpperCase()}`
    });
  }
};