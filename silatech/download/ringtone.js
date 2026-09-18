import axios from 'axios';
import { randomUUID } from 'node:crypto';

function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPlayerHtml({ title, source, audioUrl, filename }) {
  const safeTitle = esc(title || 'Ringtone');
  const safeSource = esc(source || '#');
  const safeFilename = esc(filename || 'ringtone.mp3');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>${safeTitle}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  body{background:transparent;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;color:#fff;padding:10px}
  :root{--accent:#ff6a00;--accent2:#ff9500}
  .wrapper{max-width:430px;margin:0 auto}
  .card{background:linear-gradient(145deg,#1a1b20,#101116);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:22px;box-shadow:0 15px 50px rgba(0,0,0,0.6)}
  .header{display:flex;align-items:center;gap:12px;margin-bottom:18px}
  .icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
  .header-text{flex:1;min-width:0}
  .title{font-size:16px;font-weight:700;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .subtitle{font-size:11px;opacity:.55;margin-top:3px;letter-spacing:.5px}
  .visualizer{height:80px;background:rgba(0,0,0,0.35);border-radius:14px;margin-bottom:18px;display:flex;align-items:center;justify-content:center;gap:4px;padding:0 20px;overflow:hidden}
  .bar{width:3px;background:linear-gradient(180deg,var(--accent),var(--accent2));border-radius:3px;height:15%;animation:pulse 1s ease-in-out infinite}
  .bar:nth-child(2){animation-delay:.1s}.bar:nth-child(3){animation-delay:.2s}.bar:nth-child(4){animation-delay:.3s}
  .bar:nth-child(5){animation-delay:.4s}.bar:nth-child(6){animation-delay:.5s}.bar:nth-child(7){animation-delay:.6s}
  .bar:nth-child(8){animation-delay:.7s}.bar:nth-child(9){animation-delay:.8s}.bar:nth-child(10){animation-delay:.9s}
  .bar:nth-child(11){animation-delay:.15s}.bar:nth-child(12){animation-delay:.35s}
  @keyframes pulse{0%,100%{height:15%;opacity:.5}50%{height:85%;opacity:1}}
  .visualizer.paused .bar{animation-play-state:paused;height:15%;opacity:.3}
  .progress{width:100%;height:6px;-webkit-appearance:none;appearance:none;background:rgba(255,255,255,0.1);border-radius:99px;outline:none;cursor:pointer}
  .progress::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--accent);box-shadow:0 0 12px rgba(255,106,0,0.7);cursor:pointer}
  .times{display:flex;justify-content:space-between;font-size:11px;opacity:.55;margin-top:8px;font-variant-numeric:tabular-nums}
  .controls{display:flex;align-items:center;justify-content:center;gap:16px;margin:18px 0}
  .btn-main{width:64px;height:64px;border:0;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(255,106,0,0.4);transition:transform .15s ease}
  .btn-main:active{transform:scale(0.92)}
  .btn-main svg{width:26px;height:26px;fill:#fff}
  .btn-skip{width:46px;height:46px;border:0;border-radius:50%;background:rgba(255,255,255,0.08);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s ease}
  .btn-skip:active{transform:scale(0.92);background:rgba(255,255,255,0.15)}
  .btn-skip svg{width:18px;height:18px;fill:#fff}
  .download-section{display:flex;gap:10px;margin-top:6px}
  .btn-download{flex:1;padding:15px;border:0;border-radius:14px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;box-shadow:0 8px 24px rgba(34,197,94,0.35);transition:transform .15s ease;text-decoration:none}
  .btn-download:active{transform:scale(0.97)}
  .btn-download svg{width:18px;height:18px;fill:#fff}
  .btn-source{padding:15px;border:1px solid rgba(255,255,255,0.12);border-radius:14px;background:rgba(255,255,255,0.05);color:#fff;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer}
  .btn-source:active{background:rgba(255,255,255,0.12)}
  .btn-source svg{width:16px;height:16px;fill:#fff}
  .status{text-align:center;font-size:11px;opacity:.5;margin-top:14px;min-height:16px;letter-spacing:.3px}
  .status.success{color:#22c55e;opacity:1}
  .status.error{color:#ef4444;opacity:1}
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div class="icon">🎵</div>
      <div class="header-text">
        <div class="title">${safeTitle}</div>
        <div class="subtitle">SILA TECH RINGTONE</div>
      </div>
    </div>

    <div class="visualizer paused" id="viz">
      <div class="bar"></div><div class="bar"></div><div class="bar"></div>
      <div class="bar"></div><div class="bar"></div><div class="bar"></div>
      <div class="bar"></div><div class="bar"></div><div class="bar"></div>
      <div class="bar"></div><div class="bar"></div><div class="bar"></div>
    </div>

    <input class="progress" id="prog" type="range" min="0" max="100" value="0" step="0.1">
    <div class="times">
      <span id="cur">0:00</span>
      <span id="dur">--:--</span>
    </div>

    <div class="controls">
      <button class="btn-skip" onclick="skip(-10)">
        <svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
      </button>
      <button class="btn-main" id="playBtn" onclick="togglePlay()">
        <svg id="playIcon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <svg id="pauseIcon" style="display:none" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
      </button>
      <button class="btn-skip" onclick="skip(10)">
        <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2-12v12l8.5-6L8 6z"/></svg>
      </button>
    </div>

    <div class="download-section">
      <a class="btn-download" id="dlBtn" href="${audioUrl}" download="${safeFilename}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>
        <span>Download Ringtone</span>
      </a>
      <a class="btn-source" href="${safeSource}" target="_blank" rel="noopener" title="Source">
        <svg viewBox="0 0 24 24"><path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.586 5H14V3h7z"/></svg>
      </a>
    </div>

    <div class="status" id="status">Tap play to listen • Download to save</div>
  </div>
</div>

<audio id="audio" preload="auto"></audio>

<script>
(function(){
  var AUDIO_URL = ${JSON.stringify(audioUrl)};
  var a = document.getElementById('audio');
  var prog = document.getElementById('prog');
  var cur = document.getElementById('cur');
  var dur = document.getElementById('dur');
  var playIcon = document.getElementById('playIcon');
  var pauseIcon = document.getElementById('pauseIcon');
  var viz = document.getElementById('viz');
  var status = document.getElementById('status');
  var dlBtn = document.getElementById('dlBtn');
  var dlText = dlBtn.querySelector('span');

  // Use direct URL — no base64
  a.src = AUDIO_URL;
  a.load();

  function fmt(s){
    if (!isFinite(s)) return '0:00';
    var m = Math.floor(s / 60);
    var x = Math.floor(s % 60);
    return m + ':' + (x < 10 ? '0' : '') + x;
  }

  function setStatus(text, type){
    status.textContent = text;
    status.className = 'status' + (type ? ' ' + type : '');
  }

  function updateUI(){
    if (a.paused) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      viz.classList.add('paused');
    } else {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      viz.classList.remove('paused');
    }
  }

  window.togglePlay = function(){
    if (a.paused) {
      a.play().then(function(){
        setStatus('Playing...', 'success');
      }).catch(function(e){
        setStatus('Playback error: ' + e.message, 'error');
      });
    } else {
      a.pause();
      setStatus('Paused');
    }
    updateUI();
  };

  window.skip = function(sec){
    if (isFinite(a.duration)) {
      a.currentTime = Math.max(0, Math.min(a.duration, a.currentTime + sec));
    }
  };

  prog.addEventListener('input', function(){
    if (isFinite(a.duration)) {
      a.currentTime = (prog.value / 100) * a.duration;
    }
  });

  a.addEventListener('loadedmetadata', function(){
    dur.textContent = fmt(a.duration);
    setStatus('Ready to play', 'success');
  });

  a.addEventListener('timeupdate', function(){
    if (!isFinite(a.duration)) return;
    prog.value = (a.currentTime / a.duration) * 100;
    cur.textContent = fmt(a.currentTime);
  });

  a.addEventListener('play', updateUI);
  a.addEventListener('pause', updateUI);

  a.addEventListener('ended', function(){
    prog.value = 0;
    cur.textContent = '0:00';
    a.currentTime = 0;
    updateUI();
    setStatus('Finished');
  });

  a.addEventListener('error', function(){
    var err = a.error;
    var msg = 'Failed to load audio';
    if (err) {
      if (err.code === 1) msg = 'Audio loading aborted';
      else if (err.code === 2) msg = 'Network error';
      else if (err.code === 3) msg = 'Decode error';
      else if (err.code === 4) msg = 'Format not supported';
    }
    setStatus(msg, 'error');
  });

  a.addEventListener('canplay', function(){
    setStatus('Buffered • Tap play', 'success');
  });

  // Download click feedback
  dlBtn.addEventListener('click', function(){
    setStatus('Starting download...', 'success');
    dlText.textContent = 'Downloading...';
    setTimeout(function(){
      dlText.textContent = 'Download Ringtone';
      setStatus('Check your downloads folder', 'success');
    }, 2000);
  });

  updateUI();
})();
</script>
</body>
</html>`;
}

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
  description: 'Search and play ringtones with download button',
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

      const safeName =
        (first.title || 'ringtone')
          .replace(/[^a-z0-9]+/gi, '_')
          .replace(/^_+|_+$/g, '')
          .toLowerCase() || 'ringtone';

      const htmlPayload = buildPlayerHtml({
        title: first.title || 'Ringtone',
        source: first.source || '#',
        audioUrl: first.audio,
        filename: `${safeName}.mp3`
      });

      await sock.relayMessage(
        sender,
        {
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
                  data: Buffer.from(
                    JSON.stringify({
                      response_id: randomUUID(),
                      sections: [
                        {
                          view_model: {
                            primitive: {
                              __typename: 'GenAIaeacdsnwHtmlPrimitive',
                              payload: htmlPayload,
                              url: first.source,
                              trusted_sources: ['meloboom.com']
                            },
                            __typename: 'GenAISingleLayoutViewModel'
                          }
                        }
                      ]
                    })
                  ).toString('base64')
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
        },
        {}
      );
    } catch (error) {
      console.error('[ringtone]', error);
      await sock.sendMessage(sender, {
        text: `✖ Failed to search ringtone.\n◉ Error: ${error?.message || error}`
      });
    }
  }
};