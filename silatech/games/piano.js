import { randomUUID } from 'crypto';

// ============================================
// HTML PRO PREMIUM PIANO SOURCE CODE
// ============================================
const pianoHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root {
  --bg-gradient: linear-gradient(135deg, #090d16 0%, #111827 50%, #0d131f 100%);
  --panel-bg: rgba(22, 30, 46, 0.75);
  --panel-border: rgba(255, 255, 255, 0.08);
  --ink: #f3f4f6;
  --muted: #9ca3af;
  --accent-gold: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --accent-cyan: #06b6d4;
  --neon-glow: 0 0 20px rgba(6, 182, 212, 0.4);
  --white-key-grad: linear-gradient(to bottom, #ffffff 0%, #e2e8f0 100%);
  --black-key-grad: linear-gradient(to bottom, #1f2937 0%, #111827 100%);
  --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}

html, body {
  background: transparent;
  color: var(--ink);
  font-family: var(--sys);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.stage {
  width: 100%;
  max-width: 400px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Glassmorphism Card Wrapper */
.card-wrapper {
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--panel-border);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.header__brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge-pro {
  background: var(--accent-gold);
  color: #000;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.header__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
}

/* Screen Display */
.display-panel {
  background: rgba(10, 15, 26, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
}
.note-info {
  display: flex;
  flex-direction: column;
}
.note-played {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-cyan);
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}
.note-freq {
  font-size: 11px;
  color: var(--muted);
}

/* Octave Controls */
.octave-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.05);
  padding: 4px;
  border-radius: 8px;
}
.oct-btn {
  background: transparent;
  border: none;
  color: var(--ink);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.oct-btn:active {
  background: var(--accent-cyan);
  color: #000;
}
.oct-val {
  font-size: 12px;
  font-weight: 600;
  padding: 0 4px;
  min-width: 18px;
  text-align: center;
}

/* Piano Engine Keyboard */
.piano-board {
  position: relative;
  display: flex;
  height: 190px;
  background: #0b0f19;
  border-radius: 12px;
  padding: 8px 6px 0 6px;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: inset 0 5px 10px rgba(0,0,0,0.8);
}
.key {
  position: relative;
  cursor: pointer;
  user-select: none;
}
.key.white {
  flex: 1;
  background: var(--white-key-grad);
  border-radius: 0 0 6px 6px;
  margin: 0 1px;
  z-index: 1;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  transition: background 0.1s, transform 0.05s;
}
.key.white.active, .key.white:active {
  background: #c7d2fe;
  transform: translateY(3px);
  box-shadow: 0 0 15px rgba(199, 210, 254, 0.8);
}

.key.black {
  width: 11.5%;
  height: 58%;
  background: var(--black-key-grad);
  position: absolute;
  z-index: 2;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2);
  transition: background 0.1s, transform 0.05s;
}
.key.black.active, .key.black:active {
  background: #06b6d4;
  transform: translateY(2px);
  box-shadow: var(--neon-glow);
}

/* Key Positioning Ratio */
.key[data-note="C#"] { left: 10.2%; }
.key[data-note="D#"] { left: 24.5%; }
.key[data-note="F#"] { left: 53.0%; }
.key[data-note="G#"] { left: 67.3%; }
.key[data-note="A#"] { left: 81.6%; }

.footer-text {
  text-align: center;
  font-size: 11px;
  color: var(--muted);
  margin-top: 14px;
}
</style>
</head>
<body>

<div class="stage">
  <div class="card-wrapper">
    <div class="header">
      <div class="header__brand">
        <span class="badge-pro">PRO</span>
        <span class="header__title">SILA Studio Piano</span>
      </div>
    </div>

    <div class="display-panel">
      <div class="note-info">
        <span class="note-played" id="note-display">Ready</span>
        <span class="note-freq" id="freq-display">Tap any key to start</span>
      </div>
      <div class="octave-controls">
        <button class="oct-btn" id="oct-down">-</button>
        <span class="oct-val" id="oct-val">4</span>
        <button class="oct-btn" id="oct-up">+</button>
      </div>
    </div>

    <div class="piano-board">
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

    <div class="footer-text">
      Ultra Low Latency Audio • Touch Enabled
    </div>
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

  function playSound(note) {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const freq = getFrequency(note, currentOctave);
    
    // Polyphonic Sound Synthesis
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Audio Envelope (Attack & Decay)
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);

    // Update Display
    document.getElementById('note-display').textContent = note + currentOctave;
    document.getElementById('freq-display').textContent = Math.round(freq) + ' Hz';
  }

  // Bind Events
  document.querySelectorAll('.key').forEach(key => {
    const triggerKey = (e) => {
      e.preventDefault();
      const note = key.dataset.note;
      key.classList.add('active');
      playSound(note);
      setTimeout(() => key.classList.remove('active'), 180);
    };

    key.addEventListener('touchstart', triggerKey, {passive: false});
    key.addEventListener('mousedown', triggerKey);
  });

  // Octave Controllers
  document.getElementById('oct-down').addEventListener('click', () => {
    if (currentOctave > 2) {
      currentOctave--;
      document.getElementById('oct-val').textContent = currentOctave;
    }
  });

  document.getElementById('oct-up').addEventListener('click', () => {
    if (currentOctave < 6) {
      currentOctave++;
      document.getElementById('oct-val').textContent = currentOctave;
    }
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
  alias: ['playpiano', 'music', 'studio'],
  description: 'Play live Pro Premium HTML Piano in WhatsApp',
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
                  messageText: "🎹 SILA Pro Studio Piano"
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
