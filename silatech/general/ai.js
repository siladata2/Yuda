// silatech/ai/gpt.js
import axios from 'axios';

export default {
  name: 'gpt',
  alias: ['ai', 'gpt4', 'ask'],
  description: 'Ask GPT-4 Mini AI questions',
  category: 'ai',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const text = args.join(' ');

    if (!text) {
      return await sock.sendMessage(msg.key.remoteJid, {
        disclaimerText: 'SILA TECH BOT SYSTEM',
        richResponse: [
          {
            text: `⚠️ *Tafadhali weka swali au ujumbe!*\n\n*Mfano:* \`${prefix}gpt Mambo vipi?\``
          }
        ]
      }, { quoted: msg });
    }

    try {
      // 1. Inatuma maombi kwenye API
      const response = await axios.get(`https://api.silatech.site/api/ai/gpt4-mini`, {
        params: { message: text }
      });

      // Chukua jibu kutoka kwa API (Badilisha response.data.result/message kulingana na muundo wa JSON ya API yako)
      const aiReply = response.data?.result || response.data?.message || response.data?.reply || JSON.stringify(response.data);

      // 2. Inatuma jibu kwa kutumia richResponse
      await sock.sendMessage(msg.key.remoteJid, {
        disclaimerText: 'SILA TECH AI SYSTEM',
        richResponse: [
          {
            text: `🤖 *GPT-4 MINI RESPONSE*\n\n${aiReply}`
          }
        ]
      }, { quoted: msg });

    } catch (error) {
      console.error('API Error:', error);
      
      await sock.sendMessage(msg.key.remoteJid, {
        disclaimerText: 'SILA TECH BOT ERROR',
        richResponse: [
          {
            text: '❌ *Imeshindwa kupata jibu kutoka kwa AI. Jaribu tena baadae!*'
          }
        ]
      }, { quoted: msg });
    }
  }
};
