// silatech/general/menu.js
export default {
  name: 'menu',
  alias: ['m', 'help', 'list'],
  description: 'Show all commands in RichResponse',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const jid = msg.key.remoteJid;
    const uptime = process.uptime();
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalCmds = 24; // Weka idadi ya commands zako

    await sock.sendMessage(jid, {
      disclaimerText: '© 2026 RichTor by SILA TECH | Mwanza, TZ',
      richResponse: [
        {
          title: '🏓 RICHTOR BOT v2.0',
          text: `*Karibu kwenye RichTor System*\n\nBot ya kisasa yenye kasi na ubora.\nServer: Online | Location: Mwanza, TZ`
        },
        {
          text: `*📊 SYSTEM STATUS*\n\n` +
                `Uptime: ${Math.floor(uptime/3600)}h ${Math.floor((uptime%3600)/60)}m\n` +
                `RAM: ${ram} MB\n` +
                `Commands: ${totalCmds}+\n` +
                `Status: 🟢 Online`
        },
        {
          title: '📁 GENERAL',
          text: `*${prefix}ping* - Angalia kasi ya bot\n` +
                `*${prefix}ping3* - Ping mara 3\n` +
                `*${prefix}menu* - Onyesha menu hii\n` +
                `*${prefix}stats* - Takwimu za bot\n` +
                `*${prefix}owner* - Pata namba ya owner`
        },
        {
          title: '🛠️ TOOLS',
          text: `*${prefix}sticker* - Tengeneza sticker\n` +
                `*${prefix}toimg* - Geuza sticker kuwa picha\n` +
                `*${prefix}qr* - Tengeneza QR Code\n` +
                `*${prefix}ss* - Screenshot ya website\n` +
                `*${prefix}translate* - Tafsiri lugha`
        },
        {
          title: '📥 DOWNLOADER',
          text: `*${prefix}play* - Download wimbo YouTube\n` +
                `*${prefix}video* - Download video YouTube\n` +
                `*${prefix}tiktok* - Download TikTok\n` +
                `*${prefix}ig* - Download Instagram\n` +
                `*${prefix}fb* - Download Facebook`
        },
        {
          title: '👑 OWNER',
          text: `*${prefix}broadcast* - Tuma ujumbe kwa wote\n` +
                `*${prefix}join* - Jiunge na group\n` +
                `*${prefix}leave* - Toka group\n` +
                `*${prefix}ban* - Ban mtu\n` +
                `*${prefix}unban* - Unban mtu`
        },
        {
          text: `*ℹ️ JINSI YA KUTUMIA*\n\n` +
                `Tumia *${prefix}command* kutekeleza amri.\n` +
                `Mfano: *${prefix}ping*\n\n` +
                `Kwa msaada zaidi wasiliana na Owner.`
        }
      ]
    }, { quoted: msg });
  }
};