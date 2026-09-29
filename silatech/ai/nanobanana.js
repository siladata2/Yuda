import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import fs from 'fs/promises';

const AUTHOR = 'Sila Tech';
const BOT_NAME = 'SILA TECH BOT';

const generateDeviceId = () => {
  const prefix = 'Mozilla50LinuxAndroid10KAppleWebKit53736KHTMLlikeGeckoChrome141000MobileSafari53736id';
  const randomId = Math.random().toString().slice(2) + Math.random().toString().slice(2);
  return `${prefix}${randomId}`;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const nanobanana = {
  getToken: async () => {
    const data = new FormData();
    data.append('device_id', generateDeviceId());

    const config = {
      method: 'POST',
      url: 'https://familypro.io/api/ai-task/guest_login?ai_type=nano_banana',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
        'sec-ch-ua-platform': '"Android"',
        'authorization': 'null',
        'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        'dnt': '1',
        'sec-ch-ua-mobile': '?1',
        'origin': 'https://familypro.io',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
        'priority': 'u=1, i',
        ...data.getHeaders()
      },
      data
    };

    try {
      const response = await axios.request(config);
      const token = response.headers['x-guest-token'];
      if (!token) throw new Error('Token not found');
      return token;
    } catch (error) {
      console.error('Error getting token:', error.message);
      throw error;
    }
  },

  submit: async (token, prompt, imagePath) => {
    const data = new FormData();
    data.append('prompt', prompt);
    data.append('reference_images', createReadStream(imagePath));

    const config = {
      method: 'POST',
      url: 'https://familypro.io/api/ai-task/make/nano_banana',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
        'sec-ch-ua-platform': '"Android"',
        'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        'dnt': '1',
        'sec-ch-ua-mobile': '?1',
        'guest-authorization': token,
        'origin': 'https://familypro.io',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
        'priority': 'u=1, i',
        ...data.getHeaders()
      },
      data
    };

    try {
      const response = await axios.request(config);
      const responseData = response.data;
      if (responseData.code === 100000 && responseData.data?.polling_ai_task_url) {
        return responseData.data.polling_ai_task_url;
      }
      throw new Error(responseData.message || 'Unknown error');
    } catch (error) {
      console.error('Submit error:', error.message);
      throw error;
    }
  },

  status: async (pollingUrl) => {
    const config = {
      method: 'GET',
      url: pollingUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
        'sec-ch-ua-platform': '"Android"',
        'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        'dnt': '1',
        'sec-ch-ua-mobile': '?1',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
        'priority': 'u=1, i'
      }
    };

    const maxRetries = 20;
    const pollInterval = 3000;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await axios.request(config);
        const { code, task_status, data } = response.data;
        if (code !== 100000) throw new Error(response.data.message || 'Unknown error');

        if (task_status === 'succeed') {
          return data.output;
        }
        if (task_status === 'failed' || task_status === 'error') {
          throw new Error(`Task failed: ${task_status}`);
        }
        await delay(pollInterval);
      } catch (error) {
        console.error('Status error:', error.message);
        throw error;
      }
    }
    throw new Error('Timeout');
  },

  create: async (prompt, imagePath) => {
    try {
      const token = await nanobanana.getToken();
      const pollingUrl = await nanobanana.submit(token, prompt, imagePath);
      const finalImageUrl = await nanobanana.status(pollingUrl);
      return { success: true, result: finalImageUrl };
    } catch (error) {
      console.error('Main error:', error.message);
      return { success: false, result: error.message };
    }
  }
};

/* ================= COMMAND ================= */
export default {
  name: 'nanobanana',
  alias: ['nanob', 'nanoedit', 'aiedit'],
  description: 'AI Image Editor using Nano Banana',
  category: 'ai',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    if (args.length === 0) {
      await sock.sendMessage(sender, {
        text: `✦ Nano Banana AI Editor\n\n` +
              `◉ Edit images with AI\n` +
              `◉ Reply to an image with prompt\n\n` +
              `▸ Usage:\n` +
              `  ${prefix}nanobanana [prompt]\n` +
              `  (Reply to an image)\n\n` +
              `▸ Examples:\n` +
              `  ${prefix}nanobanana "add sunglasses"\n` +
              `  ${prefix}nanobanana "change background to beach"\n` +
              `  ${prefix}nanobanana "make it anime style"\n\n` +
              `✦ ${AUTHOR}`
      });
      return;
    }

    // Get prompt
    const prompt = args.join(' ');

    // Check if replying to image
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.imageMessage) {
      await sock.sendMessage(sender, {
        text: `✖ Please reply to an image\n◉ Usage: ${prefix}nanobanana [prompt]`
      });
      return;
    }

    await sock.sendMessage(sender, {
      text: `✦ Processing...\n◉ Prompt: ${prompt}\n◉ This may take 30-60 seconds`
    });

    try {
      // Download quoted image
      const buffer = await sock.downloadMediaMessage({ message: { imageMessage: quoted.imageMessage } });
      const tmpPath = `/tmp/nanobanana_${Date.now()}.jpg`;
      await fs.writeFile(tmpPath, buffer);

      // Generate
      const result = await nanobanana.create(prompt, tmpPath);

      // Cleanup
      await fs.unlink(tmpPath).catch(() => {});

      if (!result.success) {
        await sock.sendMessage(sender, {
          text: `✖ Failed: ${result.result}`
        });
        return;
      }

      // Send result
      await sock.sendMessage(sender, {
        image: { url: result.result },
        caption: `✦ Nano Banana AI\n\n◉ Prompt: ${prompt}\n\n✦ ${AUTHOR}`,
        footer: `✦ ${BOT_NAME}`
      }, { quoted: msg });

    } catch (error) {
      console.error('[nanobanana]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      });
    }
  }
};