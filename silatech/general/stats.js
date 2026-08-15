export default {
  name: 'stats',
  alias: ['status', 'info'],
  description: 'Show bot statistics',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const mem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    const totalMem = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
    const mode = options.getBotMode ? options.getBotMode() : 'public';
    
    const txt = `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n`;
    txt += `◉ Version: ${options.VERSION || '1.0.0'}\n`;
    txt += `◉ Prefix: ${prefix}\n`;
    txt += `◉ Mode: ${mode}\n`;
    txt += `◉ Status: Connected\n`;
    txt += `◉ Uptime: ${h}h ${m}m ${s}s\n`;
    txt += `◉ Memory: ${mem}MB / ${totalMem}MB\n`;
    txt += `◉ Commands: ${options.commands?.size || 0}\n`;
    txt += `◉ Library: @itsliaaa/baileys\n`;
    txt += `✦ Created by Sila Tech`;
    
    await sock.sendMessage(sender, { text: txt });
  }
};