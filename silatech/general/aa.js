// silatech/general/aiimage.js
import fetch from 'node-fetch';

export default {
  name: 'imagine',
  alias: ['generate', 'draw'],
  description: 'Generate image with AI',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      await sock.sendMessage(sender, { 
        text: `❌ Usage: ${prefix}imagine [description]` 
      });
      return;
    }

    try {
      const prompt = args.join(' ');
      const apiUrl = `https://api.silatech.site/api/ai/generate-image?prompt=${encodeURIComponent(prompt)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SilaTechBot/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const imageUrl = data.image || data.url || data.data || data.result;
      
      if (imageUrl) {
        await sock.sendMessage(sender, {
          image: { url: imageUrl },
          caption: `🎨 ${prompt}`
        });
      } else {
        throw new Error('No image generated');
      }
      
    } catch (error) {
      await sock.sendMessage(sender, { 
        text: `❌ Error: ${error.message}` 
      });
    }
  }
};