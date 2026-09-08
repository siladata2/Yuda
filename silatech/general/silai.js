import axios from 'axios';

export default {
  name: 'silaai',
  alias: ['silaa', 'ai', 'ask'],
  description: 'Chat with Sila AI',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const text = args.join(' ');
    
    if (!text) {
      await sock.sendMessage(sender, { 
        text: `✦ Sila AI\n◉ Usage: ${prefix}silaai [question]\n◉ Example: ${prefix}silaai What is WhatsApp?` 
      });
      return;
    }
    
    try {
      // Send loading message
      const loadingMsg = await sock.sendMessage(sender, { 
        text: '✦ Sila AI is thinking...' 
      });
      
      // Call API
      const response = await axios.get(`https://api.silatech.site/api/ai/claude?text=${encodeURIComponent(text)}`);
      
      if (response.data?.success && response.data?.result) {
        const result = response.data.result;
        const timestamp = response.data.timestamp ? new Date(response.data.timestamp).toLocaleString() : '';
        
        const reply = `✦ Sila AI\n\n${result}\n\n◉ ${timestamp}`;
        
        await sock.sendMessage(sender, { 
          text: reply,
          edit: loadingMsg.key
        });
      } else {
        throw new Error('Invalid response from API');
      }
      
    } catch (error) {
      console.error('[silaai]', error);
      await sock.sendMessage(sender, { 
        text: `✖ Error: ${error.message || 'Failed to get response'}` 
      });
    }
  }
};