import axios from 'axios';

export default {
  name: 'nsfwass',
  alias: ['ass', 'pxass'],
  description: 'Get NSFW Ass image',
  category: 'nsfw',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    try {
      const loadingMsg = await sock.sendMessage(sender, { 
        text: '✦ Fetching image, please wait...' 
      });

      // Request ya direct bila query parameters yoyote
      const response = await axios({
        method: 'get',
        url: 'https://api.silatech.site/api/nsfw/px-nsfw-ass',
        params: {}, // Inahakikisha hakuna extra parameters zinazoongezwa
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0' // Inasaidia kuzuia kuonekana kama sandbox/bot request
        }
      });

      if (response.data?.status && response.data?.result) {
        const imageUrl = response.data.result;

        await sock.sendMessage(sender, { 
          text: '✦ Here is your image:' 
        }, { edit: loadingMsg.key });

        await sock.sendMessage(sender, {
          image: { url: imageUrl },
          caption: '✦ Sila Tech NSFW Module'
        }, { quoted: msg });

      } else {
        throw new Error('Invalid or empty response from API');
      }

    } catch (error) {
      console.error('[nsfwass]', error.response?.data || error.message);
      await sock.sendMessage(sender, { 
        text: `✖ Error: ${error.response?.data?.message || error.message || 'Failed to fetch image'}` 
      });
    }
  }
};
