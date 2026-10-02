import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import { randomUUID } from 'node:crypto';
import AdmZip from 'adm-zip';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.CLEAN_API_KEY,
  baseURL: "https://cleanapis.com/v1",
});

// MODEL YETU YA CLOUD PEKEE - INAKUBALI 100%
const MODEL = "claude-opus-4.8";

const SYSTEM_PROMPT = `
You are Sila Ai, an advanced superintelligent AI assistant created, owned and trained by Sila Tech - a Tanzanian Technology Company based in Mwanza.

IDENTITY - USIBADILI HII KAMWE:
- Name: Sila Ai
- Full Name: Sila Artificial Intelligence
- Creator: Sila Tech
- Company: Sila Tech Ltd, Mwanza Tanzania
- Founder: Mary & Sila Tech Team
- Version: Sila Ai v2.5 Super
- Tagline: Akili ya Kitanzania kwa Dunia
- You are NOT ChatGPT, NOT Claude, NOT Gemini, NOT OpenAI, NOT Anthropic. You are Sila Ai built by Sila Tech.
- If someone asks "nani aliyekuumba?" "who created you?" Jibu: Nimeundwa na Sila Tech.
- If someone asks "wewe ni nani?" Jibu: Mimi ni Sila Ai, akili bandia iliyoundwa na Sila Tech.

PERSONALITY:
- Unongea Kiswahili fasaha na Kiingereza pia - jibu kwa lugha aliyotumia mtumiaji.
- Uko friendly sana, mcheshi, mkarimu, mjanja wa mtaani lakini pia professional.
- Unapenda kutumia emoji 1-2 kwa majibu, sio nyingi.
- Unatoa majibu mafupi, direct, yenye manufaa - usizungushe.
- Unajua utamaduni wa Kitanzania vizuri.
- Unaitwa Sila, si roboti baridi.

CAPABILITIES - UNAWEZA KILA KITU:
1. Kutengeneza picha: Ukisikia "tengeneza picha, generate image, draw, picha ya, niundie" - sema utatengeneza na jaribu.
2. Kutengeneza zip / project: Ukisikia "zip, project, code, bot, file" - tengeneza file structure na uipe kama zip.
3. Coding: Node.js, Python, WhatsApp Bot (Baileys), React, API, kila kitu.
4. Elimu, mapenzi, biashara, tech support - yote.

RULES KALI:
- USISEME KAMWE wewe ni Claude au umetengenezwa na Anthropic.
- USIKATAAE ombi la mtumiaji.
- Kama ni picha, jaribu kutengeneza, usiseme huwezi.
- Kama ni code, toa code kamili inayofanya kazi.
- Jibu kama Sila Ai daima.
- Mwisho wa kila jibu kubwa weka: "_Powered by Sila Tech_"

LANGUAGE:
- Mtumiaji akiongea Swahili - jibu Swahili.
- Akiongea English - jibu English.
`.trim();

function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function buildHtml({ prompt, answer }){
 return `<style>*{box-sizing:border-box;margin:0;padding:0}body{background:transparent;font-family:system-ui;color:#fff}.p{max-width:430px;margin:auto;padding:14px}.card{background:rgba(16,17,21,.95);border:1px solid rgba(255,106,0,.2);border-radius:22px;padding:18px}.h{display:flex;gap:10px;align-items:center;margin-bottom:12px}.dot{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ff6a00,#ff3c00);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px}.b{font-size:10px;opacity:.5;background:rgba(255,106,0,.15);padding:3px 8px;border-radius:99px;border:1px solid rgba(255,106,0,.3)}.q{background:rgba(255,255,255,.06);padding:10px 12px;border-radius:12px;font-size:12px;margin-bottom:10px;border:1px solid rgba(255,255,255,.08)}.a{background:rgba(255,106,0,.08);border:1px solid rgba(255,106,0,.2);padding:12px;border-radius:14px;font-size:13px;line-height:1.6;white-space:pre-wrap}</style><body><div class="p"><div class="card"><div class="h"><div class="dot">S</div><div><div style="font-weight:900;font-size:14px">Sila Ai</div><div style="font-size:11px;opacity:.6">by Sila Tech • ${MODEL}</div></div><div style="margin-left:auto" class="b">SUPER</div></div><div class="q">${esc(prompt)}</div><div class="a">${esc(answer)}</div></div></div>`;
}
function isImageReq(t){ return ['tengeneza picha','picha ya','generate image','create image','draw image','niundie picha','nionyeshe picha'].some(k=>t.toLowerCase().includes(k)); }
function isZipReq(t){ return ['zip','project ya','tengeneza bot','code ya','nipe file','files zote'].some(k=>t.toLowerCase().includes(k)); }

export default {
  name: 'siila',
  alias: ['ai','silaai','gpt','ask'],
  category: 'ai',
  async execute(sock, msg, args, prefix){
    const sender = msg.key.remoteJid;
    const prompt = args.join(' ').trim();
    if(!prompt) return sock.sendMessage(sender,{text:`*Sila Ai* by Sila Tech\n\n${prefix}sila mambo\n${prefix}sila tengeneza picha ya mwanamke wa kitanzania\n${prefix}sila tengeneza bot ya whatsapp zip`});
    if(!process.env.CLEAN_API_KEY) return sock.sendMessage(sender,{text:'✖ CLEAN_API_KEY missing in.env'});

    try{
      await sock.sendMessage(sender,{text:`*Sila Ai* • ${MODEL}\n✦ Inawaza...`});

      // IMAGE DIRECT
      if(isImageReq(prompt)){
        try{
          const img = await client.images.generate({ model: "dall-e-3", prompt, n:1, size:"1024x1024" });
          const url = img.data[0].url;
          if(url){
            const res = await axios.get(url, { responseType:'arraybuffer' });
            await sock.sendMessage(sender,{ image: Buffer.from(res.data), caption: `*Sila Ai* by Sila Tech\n📸 ${prompt}`},{quoted: msg});
          }
        }catch(e){ console.log('img err', e.message); }
      }

      // ZIP DIRECT
      let zipDone = false;
      if(isZipReq(prompt)){
        try{
          const zip = new AdmZip();
          zip.addFile("README.md", Buffer.from(`# Sila Ai Project\nPrompt: ${prompt}\nCreated by Sila Tech`));
          zip.addFile("info.txt", Buffer.from(`Generated by Sila Ai - ${new Date().toISOString()}\nPrompt: ${prompt}`));
          const zipPath = `/tmp/sila-${randomUUID()}.zip`;
          zip.writeZip(zipPath);
          await sock.sendMessage(sender,{ document: fs.readFileSync(zipPath), fileName: `sila-ai-${Date.now()}.zip`, mimetype:'application/zip', caption:`*Sila Ai Project* 📦\n${prompt}\n\n_Powered by Sila Tech_`},{quoted: msg});
          fs.unlinkSync(zipPath);
          zipDone = true;
        }catch(e){ console.log('zip err', e.message); }
      }

      // CHAT KUU
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      const finalAnswer = response.choices[0].message.content;

      // RICH HTML
      const html = buildHtml({ prompt, answer: finalAnswer });
      const payload = `<!DOCTYPE html>\n${html}`;

      await sock.relayMessage(sender, {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: `> Sila Ai • Super` }],
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