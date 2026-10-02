import axios from 'axios';
import { randomUUID } from 'node:crypto';
import yts from 'yt-search';

function esc(v) {
  return String(v?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function buildPlayerHtml({ title, audioUri, thumb }) {
  return `<style>*{box-sizing:border-box;margin:0;padding:0}body{background:transparent;font-family:system-ui;color:#fff}:root{--a:#ff6a00}.p{max-width:430px;margin:auto;padding:14px}.card{background:rgba(16,17,21,.92);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:18px}.th{width:100%;height:160px;border-radius:14px;object-fit:cover;margin-bottom:12px;background:#111}.tt{font-size:16px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ar{font-size:12px;opacity:.6;margin:14px 0}.ctl{display:flex;align-items:center;justify-content:center;gap:14px}.btn{width:60px;height:60px;border:0;border-radius:50%;background:var(--a);display:flex;align-items:center;justify-content:center}.btn svg{width:26px;height:26px;fill:#fff}.skip{width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center}.skip svg{width:18px;height:18px;fill:#fff}.prog{width:100%;height:5px;-webkit-appearance:none;background:rgba(255,255,255,.15);border-radius:99px;margin-top:16px}.prog::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--a)}.times{display:flex;justify-content:space-between;font-size:10px;opacity:.55;margin-top:6px}</style><body><div class="p"><div class="card">${thumb? `<img class="th" src="${esc(thumb)}" />` : ''}<div class="tt">${esc(title)}</div><div class="ar">Sila Tech • YouTube Audio</div><div class="ctl"><button class="skip" onclick="sk(-10)"><svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6z"/></svg></button><button class="btn" onclick="tg()"><svg id="pi" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg id="pu" style="display:none" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg></button><button class="skip" onclick="sk(10)"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM10 6v12l8.5-6L10 6z"/></svg></button></div><input class="prog" id="pr" type="range" min="0" max="100" value="0" oninput="sv(this.value)"><div class="times"><span id="ct">0:00</span><span id="dt">--:--</span></div></div></div><audio id="a" preload="auto" src="${audioUri}"></audio><script>var a=document.getElementById("a"),pr=document.getElementById("pr"),ct=document.getElementById("ct"),dt=document.getElementById("dt"),pi=document.getElementById("pi"),pu=document.getElementById("pu");function fm(s){if(!isFinite(s))return"0:00";var m=Math.floor(s/60),x=Math.floor(s%60);return m+":"+(x<10?"0":"")+x}function up(){if(a.paused){pi.style.display="block";pu.style.display="none"}else{pi.style.display="none";pu.style.display="block"}}function tg(){a.paused?a.play():a.pause();up()}function sk(v){if(isFinite(a.duration))a.currentTime=Math.max(0,Math.min(a.duration,a.currentTime+v))}function sv(v){if(!isFinite(a.duration))return;a.currentTime=v/100*a.duration}a.addEventListener("loadedmetadata",function(){dt.textContent=fm(a.duration)});a.addEventListener("timeupdate",function(){pr.value=a.currentTime/a.duration*100;ct.textContent=fm(a.currentTime)});a.addEventListener("play",up);a.addEventListener("pause",up);up();</script>`;
}

// YT DL BYPASS BOT DETECTION
async function getAudioBypass(url) {
  const apis = [
    `https://api.silatech.site/api/downloader/ytmp3?url=${encodeURIComponent(url)}`,
    `https://api.dreaded.site/api/youtube/mp3?url=${encodeURIComponent(url)}`,
    `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`
  ];
  for (const api of apis) {
    try {
      const { data } = await axios.get(api, { timeout: 20000 });
      const audio = data.audio || data.result?.audio || data.data?.audio || data.download_url;
      if (audio) return { audio, title: data.title || data.result?.title, thumbnail: data.thumbnail || data.result?.thumbnail };
    } catch {}
  }
  // last try ruhend
  try {
    const { ytmp3 } = await import('ruhend-scraper');
    const dl = await ytmp3(url);
    if (dl?.audio) return dl;
  } catch {}
  throw new Error('All download servers are busy, try again');
}

export default {
  name: 'song',
  alias: ['play'],
  category: 'download',
  async execute(sock, msg, args, prefix) {
    const sender = msg.key.remoteJid;
    const query = args.join(' ').trim();
    if (!query) return sock.sendMessage(sender, { text: `Usage: ${prefix}song <name>` });
    await sock.sendMessage(sender, { text: '✦ Downloading...' });
    try {
      let videoUrl = query, titleS = query, thumbS = '';
      if (!query.includes('youtube.com') &&!query.includes('youtu.be')) {
        const search = await yts(query);
        if (!search.videos.length) throw new Error('No results');
        const v = search.videos[0];
        videoUrl = v.url; titleS = v.title; thumbS = v.thumbnail;
      }
      const dl = await getAudioBypass(videoUrl);
      const title = dl.title || titleS;
      const audioUri = dl.audio;
      const thumb = dl.thumbnail || thumbS;
      const html = buildPlayerHtml({ title, audioUri, thumb });
      await sock.relayMessage(sender, {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        botForwardedMessage: { message: { richResponseMessage: { messageType: 1, submessages: [{ messageType: 2, messageText: `> ${title}` }], unifiedResponse: { data: Buffer.from(JSON.stringify({ response_id: randomUUID(), sections: [{ view_model: { primitive: { __typename: 'GenAIaeacdsnwHtmlPrimitive', payload: `<!DOCTYPE html>\n${html}`, url: videoUrl, trusted_sources: ['youtube.com'] }, __typename: 'GenAISingleLayoutViewModel' } }] })).toString('base64') }, contextInfo: { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' }, forwardOrigin: 4 } } } }
      }, {});
      const audioRes = await axios.get(audioUri, { responseType: 'arraybuffer' });
      await sock.sendMessage(sender, { audio: Buffer.from(audioRes.data), mimetype: 'audio/mpeg', fileName: `${title.replace(/[^a-z0-9]/gi, '_')}.mp3` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(sender, { text: `✖ Error: ${e.message}` });
    }
  }
};