import { randomUUID } from 'node:crypto';

/* ================= MAIN ================= */
async function YouTubeplay(url) {
  try {
    const response = await fetch(`https://api.silatech.site/api/downloader/download-youtube5?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!data || !data.status) {
      return { success: false, message: data?.message || 'Failed to fetch video' };
    }

    const result = data.result || data.data || data;

    return {
      success: true,
      result: {
        title: result.title || 'YouTube Video',
        channel: result.channel || result.author || 'YouTube',
        duration: result.duration || '',
        thumbnail: result.thumbnail || result.thumb || '',
        audio: result.audio || result.audioUrl || result.mp3 || '',
        video: result.video || result.videoUrl || result.mp4 || '',
        quality: result.quality || 'HD',
        views: result.views || '0',
        likes: result.likes || '0',
        description: result.description || ''
      }
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/* ================= PLAYER HTML ================= */
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildPlayerHtml({ title, channel, duration, audioUrl, thumbnail, quality, views }) {
  return `<style>
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
    body{background:transparent;font-family:system-ui,Arial,sans-serif;color:#fff}
    :root{--a:#ff6a00}
    .p{max-width:430px;margin:auto;padding:14px}
    .card{background:rgba(16,17,21,.92);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:18px;box-shadow:0 12px 40px rgba(0,0,0,.5)}
    .top{display:flex;gap:14px;align-items:center}
    .cv{width:96px;height:96px;border-radius:14px;object-fit:cover;background:#222;flex-shrink:0}
    .tt{font-size:16px;font-weight:700;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .ar{font-size:12px;opacity:.6;margin-top:4px}
    .ctl{display:flex;align-items:center;justify-content:center;gap:20px;margin-top:20px}
    .btn{width:64px;height:64px;border:0;border-radius:50%;background:var(--a);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 6px 20px rgba(255,106,0,.3)}
    .btn svg{width:26px;height:26px;fill:#fff}
    .skip{width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .skip svg{width:18px;height:18px;fill:#fff}
    .prog{width:100%;height:5px;-webkit-appearance:none;appearance:none;background:rgba(255,255,255,.15);border-radius:99px;margin-top:18px;cursor:pointer}
    .prog::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--a)}
    .times{display:flex;justify-content:space-between;font-size:10px;opacity:.55;margin-top:6px}
    .badge{display:inline-block;font-size:10px;font-weight:700;padding:4px 10px;border-radius:99px;background:rgba(255,106,0,.18);color:var(--a);margin-top:10px}
    .row{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
    .chip{font-size:11px;padding:6px 12px;border-radius:99px;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.05)}
    .vol{display:flex;align-items:center;gap:8px;margin-top:16px}
    .vol input{flex:1;height:4px;-webkit-appearance:none;appearance:none;background:rgba(255,255,255,.15);border-radius:99px}
    .vol input::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:var(--a)}
  </style>
  <body><div class="p"><div class="card"><div class="top">
    <img class="cv" src="${thumbnail || ''}" onerror="this.style.display='none'">
    <div><div class="tt">${esc(title || 'Unknown')}</div><div class="ar">${esc(channel || 'YouTube')}</div>
    <div class="row">
      ${quality ? `<span class="chip">◉ ${esc(quality)}</span>` : ''}
      ${views ? `<span class="chip">👁 ${esc(views)}</span>` : ''}
      ${duration ? `<span class="chip">⏱ ${esc(duration)}</span>` : ''}
    </div>
    </div></div>
    <div class="ctl">
    <button class="skip" onclick="sk(-10)"><svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z"/></svg></button>
    <button class="btn" id="pp" onclick="tg()"><svg id="pi" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg id="pu" style="display:none" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg></button>
    <button class="skip" onclick="sk(10)"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM10 6v12l8.5-6L10 6z"/></svg></button>
    </div>
    <input class="prog" id="pr" type="range" min="0" max="100" value="0" step="0.1" oninput="sv(this.value)">
    <div class="times"><span id="ct">0:00</span><span id="dt">${esc(duration || '0:00')}</span></div>
    <div class="vol">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,.6)"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
      <input type="range" id="vo" min="0" max="1" step="0.01" value="1" oninput="a.volume=this.value">
    </div>
    </div></div>
    <audio id="a" preload="auto" src="${audioUrl}"></audio>
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

export default {
  name: 'ytplay',
  alias: ['ytp', 'playyt', 'youtube', 'ytdl', 'ytmp3', 'ytmp4'],
  description: 'Download YouTube audio/video with player',
  category: 'download',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const query = args.join(' ').trim();

    if (!query) {
      await sock.sendMessage(sender, {
        text: `✦ YouTube Downloader\n◉ Usage: ${prefix}ytplay [url]\n◉ Example: ${prefix}ytplay https://youtu.be/xxxxx`
      });
      return;
    }

    await sock.sendMessage(sender, {
      text: '✦ Processing, please wait...'
    });

    try {
      const result = await YouTubeplay(query);

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to download');
      }

      const d = result.result;

      // Build player HTML
      const htmlPayload = buildPlayerHtml({
        title: d.title,
        channel: d.channel,
        duration: d.duration,
        audioUrl: d.audio,
        thumbnail: d.thumbnail,
        quality: d.quality,
        views: d.views
      });

      const fullHtml = `<!DOCTYPE html>\n${htmlPayload}`;

      // Send rich HTML player
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
              submessages: [{
                messageType: 2,
                messageText: `> ${d.title}`
              }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  response_id: randomUUID(),
                  sections: [{
                    view_model: {
                      primitive: {
                        __typename: 'GenAIaeacdsnwHtmlPrimitive',
                        payload: fullHtml,
                        url: 'https://www.youtube.com',
                        trusted_sources: ['youtube.com']
                      },
                      __typename: 'GenAISingleLayoutViewModel'
                    }
                  }]
                })).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: '867051314767696@bot'
                },
                forwardOrigin: 4
              }
            }
          }
        }
      }, {});

      // Send audio file
      if (d.audio) {
        try {
          await sock.sendMessage(sender, {
            audio: { url: d.audio },
            mimetype: 'audio/mpeg',
            fileName: `${d.title}.mp3`,
            ptt: false
          }, { quoted: msg });
        } catch (audioError) {
          console.error('[ytplay audio]', audioError);
        }
      }

      // Send video file
      if (d.video) {
        try {
          await sock.sendMessage(sender, {
            video: { url: d.video },
            mimetype: 'video/mp4',
            fileName: `${d.title}.mp4`,
            caption: `🎬 ${d.title}`
          }, { quoted: msg });
        } catch (videoError) {
          console.error('[ytplay video]', videoError);
        }
      }

    } catch (error) {
      console.error('[ytplay]', error);
      await sock.sendMessage(sender, {
        text: `✖ Failed to download YouTube.\n◉ Error: ${error?.message || error}`
      });
    }
  }
};