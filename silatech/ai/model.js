import axios from 'axios';
import { randomUUID } from 'node:crypto';

const API_KEY = process.env.CLEAN_API_KEY;
const BASE = 'https://cleanapis.com/v1';

function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function buildHtml(models, isSingle=false){
  if(isSingle){
    const m = models[0];
    return `<style>*{box-sizing:border-box;margin:0;padding:0}body{background:transparent;font-family:system-ui;color:#fff}.p{max-width:430px;margin:auto;padding:14px}.card{background:rgba(16,17,21,.92);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:18px}.t{font-size:16px;font-weight:800}.id{font-size:11px;opacity:.6;margin:4px 0}.d{font-size:12px;opacity:.8;margin:10px 0;line-height:1.4}.row{display:flex;justify-content:space-between;background:rgba(255,255,255,.06);padding:8px 10px;border-radius:10px;margin-bottom:6px;font-size:12px}.k{opacity:.6}.v{font-weight:700}.tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}.tags span{font-size:10px;background:rgba(255,106,0,.2);border:1px solid rgba(255,106,0,.3);padding:3px 8px;border-radius:99px}</style><body><div class="p"><div class="card"><div class="t">${esc(m.name||m.id)}</div><div class="id">${esc(m.id)} • ${esc(m.owned_by)}</div><div class="d">${esc(m.description)}</div><div class="row"><span class="k">Type</span><span class="v">${esc(m.type)}</span></div><div class="row"><span class="k">Context</span><span class="v">${(m.context_window||0).toLocaleString()}</span></div><div class="row"><span class="k">Input</span><span class="v">$${m.pricing?.input_per_1k}/1k</span></div><div class="row"><span class="k">Output</span><span class="v">$${m.pricing?.output_per_1k}/1k</span></div><div class="tags">${(m.capabilities||[]).map(c=>`<span>${esc(c)}</span>`).join('')}</div></div></div>`;
  }
  const cards = models.map(m=>`<div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px;margin-bottom:8px"><div style="font-weight:700;font-size:13px">${esc(m.name||m.id)}</div><div style="font-size:10px;opacity:.6">${esc(m.id)} • ${esc(m.type)}</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">${(m.capabilities||[]).slice(0,4).map(c=>`<span style="font-size:9px;background:rgba(255,106,0,.2);padding:2px 6px;border-radius:99px">${esc(c)}</span>`).join('')}</div></div>`).join('');
  return `<style>*{box-sizing:border-box;margin:0;padding:0}body{background:transparent;font-family:system-ui;color:#fff}.p{max-width:430px;margin:auto;padding:14px}.card{background:rgba(16,17,21,.92);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:16px}.title{font-size:16px;font-weight:800;margin-bottom:10px}</style><body><div class="p"><div class="card"><div class="title">✦ CleanAPIs - ${models.length} Models</div>${cards}</div></div>`;
}

export default {
  name: 'models',
  alias: ['model','cleanmodels'],
  category: 'ai',
  async execute(sock, msg, args, prefix){
    const sender = msg.key.remoteJid;
    if(!API_KEY) return sock.sendMessage(sender,{text:'✖ CLEAN_API_KEY missing in.env'});

    const id = args[0];
    const headers = { Authorization: `Bearer ${API_KEY}` };

    try{
      await sock.sendMessage(sender,{text: id? `✦ Fetching ${id}...` : '✦ Fetching models...'});

      let models, isSingle=false;
      if(id){
        const { data } = await axios.get(`${BASE}/models/${id}`, { headers });
        models = [data]; isSingle=true;
      }else{
        const { data } = await axios.get(`${BASE}/models`, { headers });
        models = data.data || [];
      }

      const html = buildHtml(models, isSingle);
      const payload = `<!DOCTYPE html>\n${html}`;

      await sock.relayMessage(sender, {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: `> ${isSingle? models[0].id : `${models.length} models found`}` }],
              unifiedResponse: { data: Buffer.from(JSON.stringify({ response_id: randomUUID(), sections: [{ view_model: { primitive: { __typename: 'GenAIaeacdsnwHtmlPrimitive', payload, url: `${BASE}/models`, trusted_sources: ['cleanapis.com'] }, __typename: 'GenAISingleLayoutViewModel' } }] })).toString('base64') },
              contextInfo: { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' }, forwardOrigin: 4 }
            }
          }
        }
      }, {});

    }catch(e){
      await sock.sendMessage(sender,{text:`✖ ${e.response?.data?.message || e.response?.statusText || e.message}`});
    }
  }
};