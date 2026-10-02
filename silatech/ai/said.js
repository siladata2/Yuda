import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'node:crypto';
import AdmZip from 'adm-zip';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.CLEAN_API_KEY,
  baseURL: "https://cleanapis.com/v1",
});

// models zenye uwezo mzuri - itachagua moja random kila mara
const MODELS = [
  "claude-opus-4.8",
  "claude-sonnet-4.5",
  "claude-haiku-4.5",
  "gpt-4o",
  "gpt-4o-mini",
  "gemini-2.0-flash",
  "llama-3.3-70b"
];

const IMAGE_MODELS = ["dall-e-3", "gpt-image-1", "flux-pro"];

const SYSTEM_PROMPT = `
You are Sila Ai, an advanced AI assistant created and owned by Sila Tech.

Identity:
- Name: Sila Ai
- Creator: Sila Tech (Tanzanian Tech Company)
- Developer: Sila Tech Team
- Version: Sila Ai v2.5

Personality:
- Unajibu kwa Kiswahili na Kiingereza kulingana na lugha ya mtumiaji.
- Uko friendly, mcheshi kiasi, mjanja, na unatoa majibu mafupi lakini yenye maana.
- Usiwahi sema wewe ni ChatGPT, Claude, Gemini au OpenAI. Wewe ni Sila Ai wa Sila Tech tu.
- Ukimuuliza nani alikuumba: Sila Tech.
- Una uwezo wa kutengeneza picha, code, na zip files.

Capabilities:
- Unatengeneza picha ukiambiwa "tengeneza picha", "generate image", "nionyeshe picha ya..."
- Unatengeneza zip files za project ukiambiwa "tengeneza project", "zip", "code ya..."
- Unajua coding zote: Node.js, Python, WhatsApp Bot, etc.

Rules:
- Usiwahi kukataa kutengeneza picha au code.
- Jibu moja kwa moja bila maneno mengi ya kuanza.
`.trim();

function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function buildHtml({ prompt, answer, model }){
 return `<style>*{box-sizing:border-box;margin:0;padding:0}body{background:transparent;font-family:system-ui;color:#fff}.p{max-width:430px;margin:auto;padding:14px}.card{background:rgba(16,17,21,.95);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:18px}.h{display:flex;gap:10px;align-items:center;margin-bottom:10px}.dot{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#ff6a00,#ff3c00);display:flex;align-items:center;justify-content:center;font-weight:900}.m{font-size:11px;opacity:.5}.q{background:rgba(255,255,255,.06);padding:10px;border-radius:12px;font-size:12px;margin-bottom:10px}.a{background:rgba(255,106,0,.1);border:1px solid rgba(255,106,0,.25);padding:12px;border-radius:14px;font-size:13px;line-height:1.5;white-space:pre-wrap}</style><body><div class="p"><div class="card"><div class="h"><div class="dot">S</div><div><div style="font-weight:800">Sila Ai</div><div class="m">by Sila Tech • ${esc(model)}</div></div></div><div class="q">${esc(prompt)}</div><div class="a">${esc(answer)}</div></div></div>`;
}

function isImageRequest(text){
  const keys = ['tengeneza picha','nionyeshe picha','generate image','create image','draw','picha ya','niundie picha'];
  return keys.some(k=>text.toLowerCase().includes(k));
}
function isZipRequest(text){
  const keys = ['zip','project','tengeneza bot','code ya','file zote','nifanyie project'];
  return keys.some(k=>text.toLowerCase().includes(k));
}

export default {
  name: 'siila',
  alias: ['ai','silaai','gpt'],
  category: 'ai',
  async execute(sock, msg, args, prefix){
    const sender = msg.key.remoteJid;
    const prompt = args.join(' ').trim();
    if(!prompt) return sock.sendMessage(sender,{text:`*Sila Ai* by Sila Tech\n\nMatumizi:\n${prefix}sila habari\n${prefix}sila tengeneza picha ya gari\n${prefix}sila tengeneza whatsapp bot zip`});

    if(!process.env.CLEAN_API_KEY) return sock.sendMessage(sender,{text:'✖ CLEAN_API_KEY missing in.env'});

    const model = MODELS[Math.floor(Math.random()*MODELS.length)];

    try{
      await sock.sendMessage(sender,{text:`*Sila Ai* • ${model}\n✦ Inafikiria...`});

      // 1. IMAGE GENERATION
      if(isImageRequest(prompt)){
        const imgModel = IMAGE_MODELS[Math.floor(Math.random()*IMAGE_MODELS.length)];
        try{
          const img = await client.images.generate({
            model: imgModel,
            prompt: prompt,
            n: 1,
            size: "1024x1024"
          });
          const url = img.data[0].url;
          const res = await axios.get(url, { responseType: 'arraybuffer' });
          await sock.sendMessage(sender,{ image: Buffer.from(res.data), caption: `*Sila Ai* • by Sila Tech\nModel: ${imgModel}\nPrompt: ${prompt}`},{quoted: msg});
          return;
        }catch(e){
          // fallback kama image model haipo, aendelee na text
          console.log('Image fail, fallback to text', e.message);
        }
      }

      // 2. ZIP / PROJECT GENERATION
      if(isZipRequest(prompt)){
        const completion = await client.chat.completions.create({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT + "\n\nUser wants a zip project. Generate file structure in JSON format: {\"files\":[{\"path\":\"index.js\",\"content\":\"code here\"}]}. Then explain shortly." },
            { role: "user", content: prompt }
          ]
        });
        const answer = completion.choices[0].message.content;
        // try kutengeneza zip kama AI imerudisha code
        try{
          const zip = new AdmZip();
          zip.addFile("README.md", Buffer.from(`# Project by Sila Ai\nPrompt: ${prompt}\n\n${answer}`));
          zip.addFile("sila-project.txt", Buffer.from(answer));
          const zipPath = `/tmp/sila-${randomUUID()}.zip`;
          zip.writeZip(zipPath);
          await sock.sendMessage(sender,{ document: fs.readFileSync(zipPath), fileName: 'sila-ai-project.zip', mimetype: 'application/zip', caption: `*Sila Ai Project* • by Sila Tech\n${prompt}`},{quoted: msg});
          fs.unlinkSync(zipPath);
        }catch{}
        // tuma pia rich html
      }

      // 3. NORMAL CHAT
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ]
      });

      const finalAnswer = response.choices[0].message.content;

      // Rich HTML
      const html = buildHtml({ prompt, answer: finalAnswer, model });
      const payload = `<!DOCTYPE html>\n${html}`;
      await sock.relayMessage(sender, {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: `> Sila Ai • ${model}` }],
              unifiedResponse: { data: Buffer.from(JSON.stringify({ response_id: randomUUID(), sections: [{ view_model: { primitive: { __typename: 'GenAIaeacdsnwHtmlPrimitive', payload, url: 'https://cleanapis.com/v1', trusted_sources: ['cleanapis.com'] }, __typename: 'GenAISingleLayoutViewModel' } }] })).toString('base64') },
              contextInfo: { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' }, forwardOrigin: 4 }
            }
          }
        }
      }, {});

      await sock.sendMessage(sender,{text: finalAnswer},{quoted: msg});

    }catch(e){
      await sock.sendMessage(sender,{text:`✖ Sila Ai Error: ${e.message}`});
    }
  }
};