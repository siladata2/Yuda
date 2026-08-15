export default {
  name: 'help2',
  alias: ['menu2', 'commands'],
  description: 'Show available commands',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const commands = options.commands || new Map();
    
    let txt = `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n`;
    txt += `◉ Version: ${options.VERSION || '1.0.0'}\n`;
    txt += `◉ Prefix: ${prefix}\n`;
    txt += `◉ Mode: ${options.getBotMode ? options.getBotMode() : 'public'}\n`;
    txt += `◉ Commands: ${commands.size}\n\n`;
    
    const categories = new Map();
    for (const [name, cmd] of commands) {
      if (!categories.has(cmd.category)) {
        categories.set(cmd.category, []);
      }
      categories.get(cmd.category).push({ name, ...cmd });
    }
    
    for (const [category, cmds] of categories) {
      txt += `▸ ${category.toUpperCase()}\n`;
      for (const cmd of cmds) {
        let line = `  ${prefix}${cmd.name}`;
        if (cmd.alias?.length) {
          line += ` (${cmd.alias.join(', ')})`;
        }
        line += ` - ${cmd.description || ''}`;
        if (cmd.ownerOnly) line += ' [OWNER]';
        txt += line + '\n';
      }
      txt += '\n';
    }
    
    txt += `✦ Created by Sila Tech`;
    await sock.sendMessage(sender, { text: txt });
  }
};