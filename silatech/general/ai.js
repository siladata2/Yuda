// silatech/general/ai.js
import fetch from 'node-fetch';

export default {
  name: 'ai',
  alias: ['gpt', 'ask'],
  description: 'Chat with AI',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      await sock.sendMessage(sender, { 
        text: `❌ Usage: ${prefix}ai [question]` 
      });
      return;
    }

    try {
      const question = args.join(' ');
      const apiUrl = `https://api.silatech.site/api/ai/gpt4-mini?message=${encodeURIComponent(question)}`;
      
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
      const answer = data.response || data.result || data.message || data.data || JSON.stringify(data);
      
      await sock.sendMessage(sender, {
        text: answer
      });
      
    } catch (error) {
      console.error('AI error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ Error: ${error.message}` 
      });
    }
  }
};