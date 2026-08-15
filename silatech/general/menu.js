// silatech/general/menu.js
export default {
  name: 'menu',
  alias: ['help', 'list', 'commands'],
  description: 'Display all available commands dynamically',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    // 1. Kuchukua na kuandaa commands zote zilizopo kwenye bot
    const commandsMap = options?.commands || options?.plugins || new Map();
    const categories = {};

    // Kundi la kila command kulingana na category yake
    commandsMap.forEach((cmd) => {
      const cat = cmd.category ? cmd.category.toUpperCase() : 'GENERAL';
      if (!categories[cat]) {
        categories[cat] = [];
      }
      // Kuzuia alias au kurudia majina ya command
      if (!categories[cat].includes(cmd.name)) {
        categories[cat].push(cmd.name);
      }
    });

    // 2. Kuandaa Uptime
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    // 3. Kuunda submessages za richResponse
    const richSubmessages = [
      {
        text: `🤖 *SILA TECH BOT MENU*\n\n⏱️ *Uptime:* \`${uptimeStr}\`\n🌐 *Website:* \`silatech.site\`\n📌 *Prefix:* [ \`${prefix}\` ]`
      }
    ];

    // Kupitia makundi yote na kuongeza kwenye richResponse
    Object.keys(categories).forEach((cat) => {
      const cmdList = categories[cat].map(c => `• \`${prefix}${c}\``).join('\n');
      richSubmessages.push({
        text: `📂 *${cat} COMMANDS*\n${cmdList}`
      });
    });

    richSubmessages.push({
      text: `💡 *Tip:* Tumia \`${prefix}help <command_name>\` kupata maelezo ya command husika.`
    });

    // 4. Kutuma Menu
    await sock.sendMessage(msg.key.remoteJid, {
      disclaimerText: 'SILA TECH MAIN MENU',
      richResponse: richSubmessages
    }, { quoted: msg });
  }
};
