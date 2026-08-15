// silatech/general/help.js
export default {
  name: 'help2',
  alias: ['menu2', 'commands'],
  description: 'Show available commands',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const commands = options.commands || [];
    let helpText = `🤖 *${options.BOT_NAME || 'Sila Tech Bot'}*\n\n`;
    helpText += `📋 *Available Commands*\n\n`;
    
    // Group commands by category
    const categories = new Map();
    for (const [name, cmd] of commands) {
      if (!categories.has(cmd.category)) {
        categories.set(cmd.category, []);
      }
      categories.get(cmd.category).push({ name, ...cmd });
    }
    
    for (const [category, cmds] of categories) {
      helpText += `*${category.toUpperCase()}*\n`;
      for (const cmd of cmds) {
        helpText += `  ${prefix}${cmd.name}`;
        if (cmd.alias?.length) {
          helpText += ` (${cmd.alias.join(', ')})`;
        }
        helpText += ` - ${cmd.description || 'No description'}\n`;
      }
      helpText += '\n';
    }
    
    helpText += `\n👨‍💻 *Created by:* Sila Tech`;
    
    await sock.sendMessage(msg.key.remoteJid, { text: helpText });
  }
};