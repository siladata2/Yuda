import { randomUUID } from 'crypto';

// ============================================
// HTML PIANO GAME SOURCE CODE
// ============================================
const pianoHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root {
  --bg: #111b21;
  --card: #2a3942;
  --ink: #e9edef;
  --muted: #8696a0;
  --accent: #00a884;
  --white-key: #ffffff;
  --black-key: #0f171e;
  --sys: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
html,body{
  background:transparent;
  color:var(--ink);
  font-family:var(--sys);
  min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
}
.stage{
  width:100%;max-width:380px;
  padding:20px 12px;
  display:flex;flex-direction:column;gap:16px;
}
.header{
  display:flex;align-items:baseline;justify-content:space-between;
  border-bottom:1px solid #2a3942;padding-bottom:8px;
}
.title{font-size:18px;font-weight:600;color:var(--ink)}
.sub{font-size:12px;color:var(--muted)}
.controls{
  display:flex;justify-content:space-between;align-items:center;
  background:#1f2c34;padding:10px 14px;border-radius:8px;
}
.octave-btn{
  background:var(--card);border:1px solid #374248;
  color:var(--ink);padding:6px 12px;border-radius:6px;
  font-size:12px;font-weight:600;cursor:pointer;
}
.octave-btn:active{background:var(--accent);color:#000}
.piano-container{
  position:relative;
  display:flex;
  height:180px;
  background:#000;
  padding:8px 8px 0;
  border-radius:10px;
  box-shadow:0 10px 25px rgba(0,0,0,0.5);
}
.key{
  position:relative;
  cursor:pointer;
  border-radius:0 0 4px 4px;
}
.key.white{
  flex:1;
  background:var(--white-key);
  border:1px solid #ccc;
  border-top:none;
  z-index:1;
}
.key.white:active, .key.white.active{
  background:#e0e0e0;
  transform:translateY(2px);
}
.key.black{
  width:10%;
  height:60%;
  background:var(--black-key);
  position:absolute;
  z-index:2;
  border-radius:0 0 3px 3px;
}
.key.black:active, .key.black.active{
  background:#333;
}
/* Key positions for 1 octave (C, D, E, F, G, A, B) */
.key[data-note="C#"] { left: 10.5%; }
.key[data-note="D#"] { left: 24.8%; }
.key[data-note="F#"] { left: 53.4%; }
.key[data-note="G#"] { left: 67.7%; }
.key[data-note="A#"] { left: 82.0%; }

.note-display{
  text-align:center;font-size:14px;color:var(--accent);
  min-height:20px;font-weight:600;
}
</style>
</head>
<body>
<div class="stage">
  <div class="header">
    <div class="title">SILA Studio Piano</div>
    <div class="header__sub">PLAY & LEARN</div>
  </div>

  <div class="controls">
    <button class="octave-btn" id="oct-down"> Octave -</button>
    <span class="sub" id="oct-label">Octave: 4</span>
    <button class="octave-btn" id="oct-up">Octave + </button>
  </div>

  <div class="note-display" id="display">Touch a key to play</div>

  <div class="piano-container">
    <div class="key white" data-note="C"></div>
    <div class="key black" data-note="C#"></div>
    <div class="key white" data-note="D"></div>
    <div class="key black" data-note="D#"></div>
    <div class="key white" data-note="E"></div>
    <div class="key white" data-note="F"></div>
    <div class="key black" data-note="F#"></div>
    <div class="key white" data-note="G"></div>
    <div class="key black" data-note="G#"></div>
    <div class="key white" data-note="A"></div>
    <div class="key black" data-note="A#"></div>
    <div class="key white" data-note="B"></div>
  </div>
</div>

<script>
(function(){
  let audioCtx = null;
  let currentOctave = 4;

  const notesMap = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4,
    'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  };

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function getFrequency(note, octave) {
    const keyIndex = notesMap[note];
    const semitonesFromA4 = (keyIndex - 9) + (octave - 4) * 12;
    return 440 * Math.pow(2, semitonesFromA4 / 12);
  }

  function playNote(note) {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const freq = getFrequency(note, currentOctave);
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);

    document.getElementById('display').textContent = 'Playing: ' + note + currentOctave + ' (' + Math.round(freq) + 'Hz)';
  }

  document.querySelectorAll('.key').forEach(key => {
    const handlePress = (e) => {
      e.preventDefault();
      const note = key.dataset.note;
      key.classList.add('active');
      playNote(note);
      setTimeout(() => key.classList.remove('active'), 200);
    };

    key.addEventListener('touchstart', handlePress);
    key.addEventListener('mousedown', handlePress);
  });

  document.getElementById('oct-down').addEventListener('click', () => {
    if (currentOctave > 2) currentOctave--;
    document.getElementById('oct-label').textContent = 'Octave: ' + currentOctave;
  });

  document.getElementById('oct-up').addEventListener('click', () => {
    if (currentOctave < 6) currentOctave++;
    document.getElementById('oct-label').textContent = 'Octave: ' + currentOctave;
  });
})();
</script>
</body>
</html>
`;

// ============================================
// BOT COMMAND IMPLEMENTATION
// ============================================
export default {
  name: 'piano',
  alias: ['playpiano', 'music', 'keyboards'],
  description: 'Play live HTML Piano directly in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    try {
      const responseId = 'sila-piano-' + Date.now();

      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: "0cCzjnQ5ERoqM2QrQ7KjmMfxsyeWYu+61/chr2wioyE=",
          botMetadata: {
            messageDisclaimerText: "",
            botResponseId: responseId
          }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                {
                  messageType: 2,
                  messageText: "🎹 Play Interactive Piano"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [
                    {
                      "view_model": {
                        "primitive": {
                          "__typename": "GenAIaeacdsnwHtmlPrimitive",
                          "payload": pianoHtml,
                          "trusted_sources": ["sila-tech"]
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    }
                  ]
                })).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: "867051314767696@bot"
                },
                forwardOrigin: 4
              }
            }
          }
        }
      };

      await sock.relayMessage(sender, content, {});

    } catch (error) {
      console.error('[PIANO]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      }, { quoted: msg });
    }
  }
};
