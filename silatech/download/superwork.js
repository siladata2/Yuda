import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs/promises';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const AUTHOR = 'Sila Tech';
const BOT_NAME = 'SILA TECH BOT';

/* ================= TOKEN GENERATOR ================= */
class TokenGenerator {
  constructor() {
    this.baseURL = 'https://supawork.ai/supawork/api';
    this.tempMailURL = 'https://akunlama.com/api/v1/mail/list';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'sec-ch-ua-platform': '"Android"',
      'authorization': 'null',
      'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
      'sec-ch-ua-mobile': '?1',
      'dnt': '1',
      'origin': 'https://supawork.ai',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://supawork.ai/ai-image-to-video',
      'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
      'priority': 'u=1, i'
    };
  }

  generateEmail() {
    const timestamp = Date.now();
    const recipient = `silatech-${timestamp}`;
    return { email: `${recipient}@akunlama.com`, recipient };
  }

  generatePassword(length = 16) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async sendVerificationCode(email, password) {
    try {
      const response = await axios.post(
        `${this.baseURL}/user/register`,
        { email, password, register_code: "", credential: "" },
        { headers: this.headers }
      );
      if (response.data.code === 100000) {
        return { success: true, credential: response.data.data.credential };
      }
      return { success: false, result: response.data.message };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }

  async getVerificationCode(recipient, maxRetries = 10, delayMs = 3000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await delay(delayMs);
        const response = await axios.get(`${this.tempMailURL}?recipient=${recipient}`);
        if (response.data && response.data.length > 0) {
          const subject = response.data[0].message.headers.subject;
          const codeMatch = subject.match(/(\d{4,6})/);
          if (codeMatch) return { success: true, result: codeMatch[1] };
        }
      } catch {}
    }
    return { success: false, result: 'Timeout: verification code not received' };
  }

  async verifyCode(email, password, code, credential) {
    try {
      const response = await axios.post(
        `${this.baseURL}/user/register/code/verify`,
        { email, password, register_code: code, credential, route_path: "/ai-image-to-video" },
        { headers: this.headers }
      );
      if (response.data.code === 100000) return { success: true };
      return { success: false, result: response.data.message };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }

  async getToken(email, password) {
    try {
      const response = await axios.post(
        `${this.baseURL}/user/login/password`,
        { email, password },
        { headers: this.headers }
      );
      if (response.data.code === 100000) {
        return { success: true, result: response.data.data };
      }
      return { success: false, result: response.data.message };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }

  async generate() {
    try {
      const emailData = this.generateEmail();
      const password = this.generatePassword();

      const cred = await this.sendVerificationCode(emailData.email, password);
      if (!cred.success) return { success: false, result: cred.result };

      const code = await this.getVerificationCode(emailData.recipient);
      if (!code.success) return { success: false, result: code.result };

      const verify = await this.verifyCode(emailData.email, password, code.result, cred.credential);
      if (!verify.success) return { success: false, result: verify.result };

      const token = await this.getToken(emailData.email, password);
      if (!token.success) return { success: false, result: token.result };

      return {
        success: true,
        result: {
          email: emailData.email,
          password,
          userId: token.result.user_info.user_id,
          token: token.result.token,
          userInfo: token.result.user_info
        }
      };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }
}

/* ================= TEXT TO VIDEO ================= */
class TextToVideo {
  constructor(token) {
    this.token = token;
    this.baseURL = 'https://supawork.ai/supawork/headshot/api';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'sec-ch-ua-platform': '"Android"',
      'authorization': token,
      'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
      'sec-ch-ua-mobile': '?1',
      'dnt': '1',
      'origin': 'https://supawork.ai',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://supawork.ai/app/ai-text-to-video',
      'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
      'priority': 'u=1, i'
    };
    this.models = {
      'wan-22': { aigc_app_code: 'text_to_video_generator', model_code: 'wan-22-ai', sub_app_code: 'Wan-2.2-t2v-fast', duration: '5', resolution: '480p', aspect_ratio: '16:9', currency_type: 'gold' },
      'supawork': { aigc_app_code: 'text_to_video_generator', model_code: 'supawork-ai', sub_app_code: 'Supawork-01', duration: '6', resolution: '768p', currency_type: 'gold' },
      'vidu-2.0': { aigc_app_code: 'text_to_video_generator', model_code: 'vidu', sub_app_code: 'VIDU-2.0', duration: '4', resolution: '720p', aspect_ratio: '1:1', style: 'anime', amplitude: 'auto', currency_type: 'gold' },
      'hailuo': { aigc_app_code: 'text_to_video_generator', model_code: 'hailuo', sub_app_code: 'MiniMax-Hailuo-02', duration: '6', resolution: '768p', currency_type: 'gold' },
      'kling-1.6': { aigc_app_code: 'text_to_video_generator', model_code: 'kling', sub_app_code: 'Kling-1.6', duration: '5', resolution: '720p', aspect_ratio: '9:16', currency_type: 'gold' },
      'seedance-1-lite': { aigc_app_code: 'text_to_video_generator', model_code: 'seedance', sub_app_code: 'Seedance-1-lite', duration: '10', resolution: '720p', aspect_ratio: '16:9', currency_type: 'gold' }
    };
  }

  getAvailableModels() { return Object.keys(this.models); }

  async generateVideo(prompt, modelName = 'wan-22') {
    const model = this.models[modelName];
    if (!model) return { success: false, result: `Model '${modelName}' not available. Models: ${this.getAvailableModels().join(', ')}` };
    const identityId = crypto.randomUUID();
    try {
      const payload = { ...model, custom_prompt: prompt, identity_id: identityId };
      const response = await axios.post(`${this.baseURL}/media/video/generate`, payload, { headers: this.headers });
      if (response.data.code === 100000) {
        return { success: true, result: { identityId, taskId: response.data.data?.creation_id, model: modelName, prompt } };
      }
      return { success: false, result: response.data.message };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }

  async checkStatus(identityId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/media/aigc/result/list/v1`,
        { params: { page_no: 1, page_size: 10, identity_id: identityId }, headers: this.headers }
      );
      if (response.data.code === 100000) {
        const data = response.data.data;
        if (!data.list || data.list.length === 0) return { success: true, result: { status: 'not_found' } };
        const task = data.list[0];
        const result = task.list[0];
        if (task.status === 1 && result.status === 1) {
          return { success: true, result: { status: 'completed', videoUrl: result.url[0], model: task.model_name, prompt: result.custom_prompt, duration: result.req_payload.duration, resolution: result.req_payload.resolution } };
        }
        if (task.status === -1 || result.status === -1) return { success: true, result: { status: 'failed', error: result.error_code } };
        return { success: true, result: { status: 'processing' } };
      }
      return { success: false, result: response.data.message };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }

  async waitForCompletion(identityId, maxRetries = 60, delayMs = 10000) {
    for (let i = 0; i < maxRetries; i++) {
      await delay(delayMs);
      const statusResult = await this.checkStatus(identityId);
      if (!statusResult.success) continue;
      const result = statusResult.result;
      if (result.status === 'completed') return { success: true, result };
      if (result.status === 'failed') return { success: false, result: `Generation failed: ${result.error}` };
    }
    return { success: false, result: 'Timeout' };
  }

  async generateAndWait(prompt, modelName = 'wan-22') {
    const submit = await this.generateVideo(prompt, modelName);
    if (!submit.success) return submit;
    return await this.waitForCompletion(submit.result.identityId);
  }
}

/* ================= NANO BANANA (Image to Image) ================= */
class NanoBanana {
  constructor() {
    this.baseURL = 'https://supawork.ai/supawork/headshot/api';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
      'Accept': 'application/json',
      'sec-ch-ua-platform': '"Android"',
      'authorization': 'null',
      'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      'sec-ch-ua-mobile': '?1',
      'dnt': '1',
      'content-type': 'application/json',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://supawork.ai/id/nano-banana',
      'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
      'priority': 'u=1, i'
    };
  }

  async getPresigned() {
    try {
      const response = await axios.get(`${this.baseURL}/sys/oss/token?f_suffix=png&get_num=3&unsafe=1`, { headers: this.headers });
      if (response.data?.code === 100000 && response.data.data.length > 0) {
        return { success: true, result: response.data.data[0] };
      }
      return { success: false, result: 'Presigned URL failed' };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }

  async upload(path) {
    try {
      const urlsResult = await this.getPresigned();
      if (!urlsResult.success) return urlsResult;
      const fileBuffer = await fs.readFile(path);
      const response = await axios.put(urlsResult.result.put, fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': fileBuffer.length
        }
      });
      if (response.status === 200) return { success: true, result: urlsResult.result.get };
      return { success: false, result: `Upload failed: ${response.status}` };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }

  async generate(imageUrl, identity, prompt) {
    try {
      const response = await axios.post(
        `${this.baseURL}/media/image/generator`,
        {
          identity_id: identity,
          aigc_app_code: 'image_to_image_generator',
          model_code: 'google_nano_banana',
          custom_prompt: prompt,
          aspect_ratio: 'match_input_image',
          image_urls: [imageUrl],
          currency_type: 'silver'
        },
        { headers: this.headers }
      );
      if (response.data?.code === 100000) return { success: true, result: response.data.data };
      return { success: false, result: response.data.message };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }

  async check(identity, maxAttempts = 15, pollInterval = 5000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axios.get(
          `${this.baseURL}/media/aigc/result/list/v1?page_no=1&page_size=10&identity_id=${identity}`,
          { headers: this.headers }
        );
        const data = response.data.data;
        if (data?.list?.length > 0) {
          const mainTask = data.list[0];
          if (mainTask.status === 1 && mainTask.list?.length > 0) {
            const subTask = mainTask.list[0];
            if (subTask.status === 1 && subTask.url?.length > 0) {
              return { success: true, result: subTask.url[0] };
            }
          }
        }
        await delay(pollInterval);
      } catch {
        await delay(pollInterval);
      }
    }
    return { success: false, result: 'Timeout' };
  }

  async create(imagePath, prompt) {
    try {
      const identityId = crypto.randomUUID();
      const uploadResult = await this.upload(imagePath);
      if (!uploadResult.success) return uploadResult;
      const generateResult = await this.generate(uploadResult.result, identityId, prompt);
      if (!generateResult.success) return generateResult;
      return await this.check(identityId);
    } catch (error) {
      return { success: false, result: error.message };
    }
  }
}

/* ================= COMMAND ================= */
export default {
  name: 'supawork',
  alias: ['t2v', 'text2video', 'nano', 'nanobanana'],
  description: 'AI Video & Image Generator using Supawork',
  category: 'download',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isOwner = options.isOwner ? options.isOwner() : false;

    // Get or create token
    if (!global.supaworkTokens) global.supaworkTokens = {};

    let userToken = global.supaworkTokens[sender];
    if (!userToken) {
      await sock.sendMessage(sender, {
        text: `✦ Registering to Supawork AI...\n◉ Please wait...`
      });

      const generator = new TokenGenerator();
      const tokenResult = await generator.generate();

      if (!tokenResult.success) {
        await sock.sendMessage(sender, {
          text: `✖ Failed to register: ${tokenResult.result}`
        });
        return;
      }

      userToken = tokenResult.result;
      global.supaworkTokens[sender] = userToken;
    }

    // Show menu
    if (args.length === 0) {
      const models = new TextToVideo(userToken.token).getAvailableModels();
      await sock.sendMessage(sender, {
        text: `✦ SUPawork AI\n\n` +
              `◉ Commands:\n` +
              `  ${prefix}supawork video [prompt] [model] - Text to Video\n` +
              `  ${prefix}supawork image [prompt] - Image to Image\n` +
              `  ${prefix}supawork status - Check token\n` +
              `  ${prefix}supawork models - List models\n\n` +
              `◉ Models:\n${models.map(m => `  • ${m}`).join('\n')}\n\n` +
              `◉ Example:\n` +
              `  ${prefix}supawork video "cat dancing in rain"\n` +
              `  ${prefix}supawork video "sunset over ocean" vidu-2.0`
      });
      return;
    }

    const subCommand = args[0].toLowerCase();

    // List models
    if (subCommand === 'models') {
      const models = new TextToVideo(userToken.token).getAvailableModels();
      await sock.sendMessage(sender, {
        text: `✦ Available Models\n\n${models.map((m, i) => `◉ ${i + 1}. ${m}`).join('\n')}`
      });
      return;
    }

    // Check token
    if (subCommand === 'status') {
      await sock.sendMessage(sender, {
        text: `✦ Supawork Account\n\n◉ Email: ${userToken.email}\n◉ User ID: ${userToken.userId}\n◉ Token: ${userToken.token.substring(0, 30)}...`
      });
      return;
    }

    // Text to Video
    if (subCommand === 'video') {
      if (args.length < 2) {
        await sock.sendMessage(sender, {
          text: `✖ Please provide a prompt\n◉ Usage: ${prefix}supawork video [prompt] [model]`
        });
        return;
      }

      const model = args[args.length - 1] && args[args.length - 1].includes('-') ? args.pop() : 'wan-22';
      const prompt = args.slice(1).join(' ');

      await sock.sendMessage(sender, {
        text: `✦ Generating video...\n◉ Model: ${model}\n◉ Prompt: ${prompt}\n\n▸ This may take 1-5 minutes`
      });

      const t2v = new TextToVideo(userToken.token);
      const result = await t2v.generateAndWait(prompt, model);

      if (!result.success) {
        await sock.sendMessage(sender, {
          text: `✖ Failed: ${result.result}`
        });
        return;
      }

      const r = result.result;
      await sock.sendMessage(sender, {
        video: { url: r.videoUrl },
        caption: `✦ Video Generated\n\n◉ Prompt: ${r.prompt}\n◉ Model: ${r.model}\n◉ Duration: ${r.duration}s\n◉ Resolution: ${r.resolution}\n\n✦ ${AUTHOR}`,
        mimetype: 'video/mp4'
      }, { quoted: msg });
      return;
    }

    // Image to Image (Nano Banana)
    if (subCommand === 'image') {
      if (args.length < 2) {
        await sock.sendMessage(sender, {
          text: `✖ Please provide a prompt\n◉ Usage: ${prefix}supawork image [prompt]\n◉ Reply to an image to use it`
        });
        return;
      }

      const prompt = args.slice(1).join(' ');

      // Check if replying to an image
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted?.imageMessage) {
        await sock.sendMessage(sender, {
          text: `✖ Please reply to an image`
        });
        return;
      }

      await sock.sendMessage(sender, {
        text: `✦ Generating image...\n◉ Prompt: ${prompt}\n\n▸ This may take 1-3 minutes`
      });

      try {
        // Download quoted image
        const buffer = await sock.downloadMediaMessage({ message: { imageMessage: quoted.imageMessage } });
        const tmpPath = `/tmp/supawork_${Date.now()}.png`;
        await fs.writeFile(tmpPath, buffer);

        const nano = new NanoBanana();
        const result = await nano.create(tmpPath, prompt);
        await fs.unlink(tmpPath).catch(() => {});

        if (!result.success) {
          await sock.sendMessage(sender, {
            text: `✖ Failed: ${result.result}`
          });
          return;
        }

        await sock.sendMessage(sender, {
          image: { url: result.result },
          caption: `✦ Image Generated\n\n◉ Prompt: ${prompt}\n\n✦ ${AUTHOR}`
        }, { quoted: msg });
      } catch (error) {
        await sock.sendMessage(sender, {
          text: `✖ Error: ${error.message}`
        });
      }
      return;
    }

    await sock.sendMessage(sender, {
      text: `✖ Unknown command. Use ${prefix}supawork for help`
    });
  }
};