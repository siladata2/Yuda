import axios from 'axios';
import { randomUUID } from 'node:crypto';

/* ================= PLAYER HTML ================= */
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildPlayerHtml({ title, audioUri }) {
  return `<style>
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
    body{background:transparent;font-family:system-ui,Arial,sans-serif;color:#fff}
    :root{--a:#ff6a00}
    .p{max-width:430px;margin:auto;padding:14px}
    .card{background:rgba(16,17,21,.92);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:18px;box-shadow:0 12px 40px rgba(0,0,0,.5)}
    .tt{font-size:16px;font-weight:700;line-height:1.3;margin-bottom:10px}
    .ar{font-size:12px;opacity:.6;margin-bottom:14px}
    .ctl{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:12px}
    .btn{width:60px;height:60px;border:0;border-radius:50%;background:var(--a);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .btn svg{width:26px;height:26px;fill:#fff}
    .skip{width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .skip svg{width:18px;height:18px;fill:#fff}
    .prog{width:100%;height:5px;-webkit-appearance:none;appearance:none;background:rgba(255,255,255,.15);border-radius:99px;margin-top:16px;cursor:pointer}
    .prog::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--a)}
    .times{display:flex;justify-content:space-between;font-size:10px;opacity:.55;margin-top:6px}
    .badge{display:inline-block;font-size:9px;font-weight:700;padding:3px 9px;border-radius:99px;background:rgba(255,106,0,.18);color:var(--a);margin-top:10px}
  </style>
  <body><div class="p"><div class="card">
    <div class="tt">${esc(title)}</div>
    <div class="ar">Sila Tech Ringtone</div>
    <div class="ctl">
      <button class="skip" onclick="sk(-10)"><svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z"/></svg></button>
      <button class="btn" id="pp" onclick="tg()"><svg id="pi" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg id="pu" style="display:none" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg></button>
      <button class="skip" onclick="sk(10)"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM10 6v12l8.5-6L10 6z"/></svg></button>
    </div>
    <input class="prog" id="pr" type="range" min="0" max="100" value="0" step="0.1" oninput="sv(this.value)">
    <div class="times"><span id="ct">0:00</span><span id="dt">--:--</span></div>
  </div></div>
  <audio id="a" preload="auto" src="${audioUri}"></audio>
  <script>
    var a=document.getElementById("a"),pr=document.getElementById("pr"),ct=document.getElementById("ct"),dt=document.getElementById("dt"),pi=document.getElementById("pi"),pu=document.getElementById("pu");
    function fm(s){if(!isFinite(s))return"0:00";var m=Math.floor(s/60),x=Math.floor(s%60);return m+":"+(x<10?"0":"")+x}
    function up(){if(a.paused){pi.style.display="block";pu.style.display="none"}else{pi.style.display="none";pu.style.display="block"}}
    function tg(){a.paused?a.play():a.pause();up()}
    function sk(v){if(isFinite(a.duration))a.currentTime=Math.max(0,Math.min(a.duration,a.currentTime+v))}
    function sv(v){if(!isFinite(a.duration))return;a.currentTime=v/100*a.duration}
    a.addEventListener("loadedmetadata",function(){dt.textContent=fm(a.duration)});
    a.addEventListener("timeupdate",function(){if(!isFinite(a.duration))return;pr.value=a.currentTime/a.duration*100;ct.textContent=fm(a.currentTime)});
    a.addEventListener("play",up);a.addEventListener("pause",up);
    a.addEventListener("ended",function(){pr.value=0;ct.textContent="0:00";a.currentTime=0;up()});
    up();
  </script>`;
}

/* ================= MAIN ================= */
async function RingtoneSearch(query) {
  const res = await axios.get(
    `https://api.silatech.site/api/downloader/download-ringtone?q=${encodeURIComponent(query)}`
  );
  
  if (!res.data || !res.data.BK9 || !res.data.BK9.length) {
    return { success: false, message: 'No ringtones found' };
  }
  
  return { success: true, results: res.data.BK9 };
}

export default {
  name: 'ringtone',
  alias: ['rt', 'tones', 'searchringtone'],
  description: 'Search and play ringtones',
  category: 'download',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const query = args.join(' ').trim();

    if (!query) {
      await sock.sendMessage(sender, {
        text: `✦ Ringtone Search\n◉ Usage: ${prefix}ringtone [query]\n◉ Example: ${prefix}ringtone Quran`
      });
      return;
    }

    await sock.sendMessage(sender, {
      text: '✦ Searching ringtones, please wait...'
    });

    try {
      const result = await RingtoneSearch(query);
      if (!result.success) throw new Error(result.message);

      const first = result.results[0];
      const audioUri = first.audio;

      const htmlPayload = buildPlayerHtml({
        title: first.title || 'Ringtone',
        audioUri
      });

      const t1 = `<!DOCTYPE html>\n${htmlPayload}`;

      // Send rich player
      await sock.relayMessage(sender, {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {}
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                { messageType: 2, messageText: `> ${first.title}` }
              ],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  response_id: randomUUID(),
                  sections: [{
                    view_model: {
                      primitive: {
                        __typename: 'GenAIaeacdsnwHtmlPrimitive',
                        payload: t1,
                        url: first.source,
                        trusted_sources: ['meloboom.com']
                      },
                      __typename: 'GenAISingleLayoutViewModel'
                    }
                  }]
                })).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
                forwardOrigin: 4
              }
            }
          }
        }
      }, {});

      // Also send audio as attachment
      const audioRes = await axios.get(first.audio, { responseType: 'arraybuffer' });
      const audioBuffer = Buffer.from(audioRes.data);
      
      await sock.sendMessage(sender, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: `${first.title.replace(/[^a-z0-9]/gi, '_')}.mp3`
      }, { quoted: msg });

    } catch (error) {
      console.error('[ringtone]', error);
      await sock.sendMessage(sender, {
        text: `✖ Failed to search ringtone.\n◉ Error: ${error?.message || error}`
      });
    }
  }
};