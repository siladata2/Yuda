// silatech/general/ping.js
export default {
  name: 'ping',
  alias: ['pong'],
  description: 'Check bot latency',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const start = Date.now();
    const sent = await sock.sendMessage(msg.key.remoteJid, { 
      text: '🏓 Pinging...' 
    });
    const latency = Date.now() - start;
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🏓 *Pong!*\n\n⏱️ Latency: ${latency}ms\n📊 Status: Connected\n🕒 Uptime: ${Math.floor(process.uptime())}s`
    });
  }
};