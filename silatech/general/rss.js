export default {
  name: 'rss',
  alias: ['memory', 'meminfo'],
  description: 'Show memory usage',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      const mem = process.memoryUsage();
      
      const rss = (mem.rss / 1024 / 1024).toFixed(1);
      const heapTotal = (mem.heapTotal / 1024 / 1024).toFixed(1);
      const heapUsed = (mem.heapUsed / 1024 / 1024).toFixed(1);
      const external = (mem.external / 1024 / 1024).toFixed(1);
      const arrayBuffers = (mem.arrayBuffers / 1024 / 1024).toFixed(1);
      
      const text = `ᯓ *MEMORY USAGE* ᯓ\n` +
                   `⊹ *rss*: ${rss}MiB\n` +
                   `⊹ *heapTotal*: ${heapTotal}MiB\n` +
                   `⊹ *heapUsed*: ${heapUsed}MiB\n` +
                   `⊹ *external*: ${external}MiB\n` +
                   `⊹ *arrayBuffers*: ${arrayBuffers}MiB`;
      
      await sock.sendMessage(sender, {
        text: text
      }, { quoted: msg });
      
    } catch (error) {
      console.error('[rss]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};
