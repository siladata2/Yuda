import axios from 'axios';

export default {
  name: 'nsfw',
  alias: ['18+', 'dewasa', 'nsfwpic'],
  description: 'Get NSFW images from Sila API',
  category: 'nsfw',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      // Send loading
      const loadingMsg = await sock.sendMessage(sender, { 
        text: '✦ Loading NSFW...' 
      });
      
      // Fetch from API
      const response = await axios.get('https://api.silatech.site/api/nsfw/px-nsfw-ass');
      
      if (response.data?.status && response.data?.result) {
        const imageUrl = response.data.result;
        
        // Send image
        await sock.sendMessage(sender, {
          image: { url: imageUrl },
          caption: `✦ NSFW Content\n◉ Source: PxNSFW\n◉ Powered by Sila Tech`
        });
        
        // Delete loading message
        await sock.sendMessage(sender, { 
          text: '✅',
          edit: loadingMsg.key
        });
        
      } else {
        throw new Error('Invalid response from API');
      }
      
    } catch (error) {
      console.error('[nsfw]', error);
      await sock.sendMessage(sender, { 
        text: `✖ Error: ${error.message || 'Failed to fetch NSFW content'}` 
      });
    }
  }
};