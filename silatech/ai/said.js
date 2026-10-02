import OpenAI from 'openai';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.CLEAN_API_KEY,
  baseURL: "https://cleanapis.com/v1",
});

const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    description: "Get the current weather for a city",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
  },
}];

async function get_weather(city){ return { temp_c: 31, sky: "humid", city }; }

function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function buildAiHtml({ prompt, answer, model }){
  return `<style>
*{box-sizing:border-box;margin:0;padding:0}body{background:transparent;font-family:system-ui;color:#fff}
.p{max-width:430px;margin:auto;padding:14px}
.card{background:rgba(16,17,21,.92);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:18px}
.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.dot{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#ff6a00,#ff2a00);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px}
.model{font-size:11px;opacity:.6}
.prompt{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;font-size:12px;margin-bottom:12px}
.label{font-size:10px;opacity:.5;margin-bottom:4px;letter-spacing:.5px}
.answer{background:rgba(255,106,0,.08);border:1px solid rgba(255,106,0,.2);border-radius:14px;padding:12px;font-size:13px;line-height:1.5;white-space:pre-wrap}
.footer{font-size:10px;opacity:.4;margin-top:10px;text-align:right}
</style>
<body><div class="p"><div class="card">
<div class="head"><div class="dot">AI</div><div><div style="font-weight:700;font-size:13px">${esc(model)}</div><div class="model">CleanAPIs • Tools + Streaming + Vision</div></div></div>
<div class="label">PROMPT</div><div class="prompt">${esc(prompt)}</div>
<div class="label">RESPONSE</div><div class="answer">${esc(answer)}</div>
<div class="footer">via cleanapis.com/v1</div>
</div></div>`;
}

export default {
  name: 'ai',
  alias: ['gpt','cleanai','ask'],
  category: 'ai',
  async execute(sock, msg, args, prefix){
    const sender = msg.key.remoteJid;
    const prompt = args.join(' ').trim();
    if(!prompt) return sock.sendMessage(sender,{text:`Usage: ${prefix}ai <swali>`});
    if(!process.env.CLEAN_API_KEY) return sock.sendMessage(sender,{text:'✖ CLEAN_API_KEY missing in.env'});

    const MODEL = "claude-opus-4.8";
    try{
      await sock.sendMessage(sender,{text:'✦ Thinking...'});
      let messages = [{ role: "user", content: prompt }];
      let response = await client.chat.completions.create({ model: MODEL, messages, tools });
      let message = response.choices[0].message;
      let finalAnswer = message.content || '';

      if(message.tool_calls){
        messages.push(message);
        for(const call of message.tool_calls){
          const a = JSON.parse(call.function.arguments);
          const result = await get_weather(a.city);
          messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
        }
        const final = await client.chat.completions.create({ model: MODEL, messages, tools });
        finalAnswer = final.choices[0].message.content;
      }

      // 1. Rich HTML
      const html = buildAiHtml({ prompt, answer: finalAnswer, model: MODEL });
      const payload = `<!DOCTYPE html>\n${html}`;

      await sock.relayMessage(sender, {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: `> ${prompt.slice(0,40)}` }],
              unifiedResponse: { data: Buffer.from(JSON.stringify({ response_id: randomUUID(), sections: [{ view_model: { primitive: { __typename: 'GenAIaeacdsnwHtmlPrimitive', payload, url: 'https://cleanapis.com/v1', trusted_sources: ['cleanapis.com','youtube.com'] }, __typename: 'GenAISingleLayoutViewModel' } }] })).toString('base64') },
              contextInfo: { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' }, forwardOrigin: 4 }
            }
          }
        }
      }, {});

      // 2. Text fallback
      await sock.sendMessage(sender,{text: finalAnswer},{quoted: msg});

    }catch(e){
      await sock.sendMessage(sender,{text:`✖ ${e.message}`});
    }
  }
};