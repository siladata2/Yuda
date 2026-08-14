// silatech/ai/gpt.js
import axios from 'axios';

export default {
  name: 'gpt',
  alias: ['ai', 'gpt4'],
  description: 'Ask GPT-4 Mini AI a question',
  category: 'ai',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const query = args.join(' ');

    if (!query) {
      return await sock.sendMessage(msg.key.remoteJid, {
        disclaimerText: 'SILA TECH BOT SYSTEM',
        richResponse: [
          {
            text: `⚠️ *Tafadhali weka swali!*\n\nMfano: \`${prefix}gpt Habari yako?\``
          }
        ]
      }, { quoted: msg });
    }

    try {
      const response = await axios.get(`https://api.silatech.site/api/ai/gpt4-mini?message=${encodeURIComponent(query)}`);
      
      // Kuchukua jibu kutoka kwenye API (Badilisha response.data.result/message kulingana na muundo wa JSON wa API yako)
      const aiResponse = response.data?.result || response.data?.response || response.data?.message || JSON.stringify(response.data);

      await sock.sendMessage(msg.key.remoteJid, {
        disclaimerText: 'SILA TECH AI SYSTEM',
        richResponse: [
          {
            text: `🤖 *GPT-4 Mini*\n\n${aiResponse}`
          }
        ]
      }, { quoted: msg });

    } catch (error) {
      console.error('Error in GPT Command:', error);
      
      await sock.sendMessage(msg.key.remoteJid, {
        disclaimerText: 'SILA TECH BOT SYSTEM',
        richResponse: [
          {
            text: '❌ *Imeshindwa kupata majibu kutoka kwa AI. Jaribu tena baadaye!*'
          }
        ]
      }, { quoted: msg });
    }
  }
};
