import { randomUUID } from 'crypto';

// ============================================
// HTML PIANO GAME SOURCE CODE
// ============================================
const pianoHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{
  --bg:transparent;
  --card:#1f2c33;
  --card-2:#2a3942;
  --ink:#e9edef;
  --ink-soft:#aebac1;
  --muted:#8696a0;
  --accent:#00a884;
  --accent-2:#008069;
  --line:#2a3942;
  --line-strong:#374248;
  --white-key:#f5f7f8;
  --white-key-active:#00a884;
  --black-key:#0b141a;
  --black-key-active:#008069;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html,body{
  background:transparent;color:var(--ink);
  font-family:var(--sys);min-height:100vh;
  overflow-x:hidden;touch-action:manipulation;
  -webkit-font-smoothing:antialiased;
}
.stage{
  min-height:100vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:20px 12px;
}
.card{width:100%;max-width:420px}

.header{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-bottom:12px;padding-bottom:10px;
  border-bottom:1px solid var(--line);gap:8px;
}
.header__title{font-size:17px;font-weight:600;color:var(--ink);letter-spacing:-.005em}
.header__sub{font-size:12px;color:var(--muted)}

.mode-bar{
  display:flex;gap:6px;margin-bottom:12px;
  overflow-x:auto;scrollbar-width:none;padding:2px 2px 4px;
}
.mode-bar::-webkit-scrollbar{display:none}
.mode-btn{
  background:transparent;border:1px solid var(--line-strong);
  border-radius:16px;padding:7px 14px;
  font-size:12px;font-weight:500;color:var(--ink-soft);
  cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;
  transition:all .15s ease;
}
.mode-btn.is-active{background:var(--accent);border-color:var(--accent);color:#0b141a}

.info-bar{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:10px;font-size:13px;gap:8px;
}
.info-bar__label{color:var(--ink-soft);display:flex;align-items:center;gap:6px}
.info-bar__dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--accent);flex-shrink:0;
  animation:pulse 1.6s ease-in-out infinite;
}
@keyframes pulse{
  0%,100%{opacity:1;transform:scale(1)}
  50%{opacity:.5;transform:scale(1.3)}
}
.info-bar__notes{
  display:flex;gap:6px;font-size:11px;
  color:var(--muted);font-variant-numeric:tabular-nums;
}
.info-bar__notes b{color:var(--ink);font-weight:600;margin-left:3px}

.display{
  background:linear-gradient(180deg,#0b141a 0%,#111b21 100%);
  border:1px solid var(--line);
  border-radius:10px;
  padding:14px 16px;margin-bottom:12px;
  min-height:64px;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:4px;
  box-shadow:inset 0 2px 12px rgba(0,0,0,0.4);
}
.display__note{
  font-size:36px;font-weight:700;
  letter-spacing:-.02em;color:var(--accent);
  line-height:1;
  text-shadow:0 0 20px rgba(0,168,132,0.5);
  transition:all .12s ease;
}
.display__note.is-active{
  transform:scale(1.15);
  text-shadow:0 0 30px rgba(0,168,132,0.9);
}
.display__sub{
  font-size:11px;color:var(--muted);
  text-transform:uppercase;letter-spacing:.08em;
}

/* PIANO */
.piano-wrap{
  position:relative;width:100%;
  padding:10px;background:var(--card);
  border-radius:10px;border:1px solid var(--line);
  margin-bottom:12px;
}
.piano{
  position:relative;display:flex;
  height:170px;width:100%;
  border-radius:6px;overflow:hidden;
  background:#000;
  box-shadow:0 4px 14px rgba(0,0,0,0.5);
}
.white-keys{
  display:flex;width:100%;height:100%;
  position:relative;
}
.white-key{
  flex:1;background:linear-gradient(180deg,#ffffff 0%,#e8ebed 88%,#d5d9db 100%);
  border:1px solid #b8bfc3;
  border-right:none;
  border-radius:0 0 6px 6px;
  cursor:pointer;position:relative;
  display:flex;align-items:flex-end;justify-content:center;
  padding-bottom:6px;
  font-size:9px;font-weight:600;color:#8696a0;
  transition:all .06s ease;
  box-shadow:inset 0 -4px 8px rgba(0,0,0,0.08);
}
.white-key:last-child{border-right:1px solid #b8bfc3}
.white-key:active,.white-key.is-active{
  background:linear-gradient(180deg,#00a884 0%,#008069 100%);
  color:#0b141a;
  transform:translateY(2px);
  box-shadow:inset 0 2px 6px rgba(0,0,0,0.3);
}
.black-keys{
  position:absolute;top:0;left:0;
  width:100%;height:62%;
  pointer-events:none;
}
.black-key{
  position:absolute;
  background:linear-gradient(180deg,#1a252b 0%,#0b141a 100%);
  border-radius:0 0 4px 4px;
  cursor:pointer;pointer-events:auto;
  width:8.5%;height:100%;
  border:1px solid #000;
  display:flex;align-items:flex-end;justify-content:center;
  padding-bottom:4px;
  font-size:8px;font-weight:600;color:#5a6870;
  transition:all .06s ease;
  box-shadow:0 3px 6px rgba(0,0,0,0.6);
  z-index:2;
}
.black-key:active,.black-key.is-active{
  background:linear-gradient(180deg,#008069 0%,#005c4b 100%);
  color:#0b141a;
  transform:translateY(2px);
  height:calc(100% + 2px);
}

/* AUTO-PLAY / RECORD CONTROLS */
.controls{
  display:flex;gap:8px;margin-bottom:10px;
  flex-wrap:wrap;
}
.ctrl-btn{
  flex:1;min-width:80px;
  background:transparent;
  border:1px solid var(--line-strong);
  border-radius:8px;
  padding:10px 12px;
  color:var(--ink-soft);
  font-family:inherit;font-size:12px;font-weight:600;
  cursor:pointer;transition:all .15s ease;
}
.ctrl-btn:hover{color:var(--ink);border-color:var(--ink-soft)}
.ctrl-btn:active{transform:scale(.97)}
.ctrl-btn.is-on{
  background:var(--accent);border-color:var(--accent);
  color:#0b141a;
}
.ctrl-btn.is-rec{
  background:#e63946;border-color:#e63946;color:#fff;
  animation:recblink 1.2s ease-in-out infinite;
}
@keyframes recblink{
  0%,100%{opacity:1}
  50%{opacity:.55}
}

/* SONG LIST */
.songs{margin-top:6px}
.songs__label{font-size:11px;color:var(--muted);margin-bottom:8px}
.songs__list{
  display:flex;flex-wrap:nowrap;gap:8px;
  overflow-x:auto;scrollbar-width:none;
  padding:2px 2px 6px;margin:0 -2px;
}
.songs__list::-webkit-scrollbar{display:none}
.song{
  background:transparent;
  border:1px solid var(--line-strong);
  border-radius:20px;padding:9px 16px;
  font-size:12px;font-weight:500;
  color:var(--ink-soft);cursor:pointer;
  font-family:inherit;white-space:nowrap;flex-shrink:0;
  transition:all .15s ease;
}
.song:hover{color:var(--ink);border-color:var(--ink-soft)}
.song.is-active{background:var(--accent);border-color:var(--accent);color:#0b141a}
.song:focus-visible{outline:2px solid var(--accent);outline-offset:1px}

.footer{
  margin-top:10px;display:flex;justify-content:center;
}
.footer__reset{
  background:none;border:none;
  color:var(--accent);font-family:inherit;
  font-size:13px;font-weight:500;cursor:pointer;
  padding:8px 16px;transition:color .15s ease;
}
.footer__reset:hover{color:var(--ink)}

@media (max-width:380px){
  .stage{padding:14px 8px}
  .piano{height:140px}
  .display__note{font-size:30px}
  .song{padding:8px 14px;font-size:11px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms!important;
    animation-iteration-count:1!important;
    transition-duration:.01ms!important;
  }
}
</style>
</head>
<body>
<div class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">🎹 SILA Piano</div>
      <div class="header__sub">Tap keys to play</div>
    </div>

    <div class="mode-bar" id="mode-bar">
      <button class="mode-btn is-active" data-mode="free">Free Play</button>
      <button class="mode-btn" data-mode="song">Learn Song</button>
      <button class="mode-btn" data-mode="record">Record</button>
    </div>

    <div class="info-bar">
      <div class="info-bar__label">
        <span class="info-bar__dot" id="dot"></span>
        <span id="mode-label">Free Play</span>
      </div>
      <div class="info-bar__notes">
        <span>Notes<b id="note-count">0</b></span>
      </div>
    </div>

    <div class="display">
      <div class="display__note" id="display-note">♪</div>
      <div class="display__sub" id="display-sub">Press any key</div>
    </div>

    <div class="piano-wrap">
      <div class="piano" id="piano">
        <div class="white-keys" id="white-keys"></div>
        <div class="black-keys" id="black-keys"></div>
      </div>
    </div>

    <div class="controls">
      <button class="ctrl-btn" id="btn-record">● Record</button>
      <button class="ctrl-btn" id="btn-play">▶ Play</button>
      <button class="ctrl-btn" id="btn-clear">✕ Clear</button>
    </div>

    <div class="songs">
      <div class="songs__label">Songs to learn</div>
      <div class="songs__list" id="songs-list"></div>
    </div>

    <div class="footer">
      <button class="footer__reset" id="reset">Reset</button>
    </div>
  </div>
</div>

<script>
(function(){
  // ===== NOTES =====
  const NOTES = [
    {note:'C4',freq:261.63},
    {note:'C#4',freq:277.18,black:true},
    {note:'D4',freq:293.66},
    {note:'D#4',freq:311.13,black:true},
    {note:'E4',freq:329.63},
    {note:'F4',freq:349.23},
    {note:'F#4',freq:369.99,black:true},
    {note:'G4',freq:392.00},
    {note:'G#4',freq:415.30,black:true},
    {note:'A4',freq:440.00},
    {note:'A#4',freq:466.16,black:true},
    {note:'B4',freq:493.88},
    {note:'C5',freq:523.25},
    {note:'C#5',freq:554.37,black:true},
    {note:'D5',freq:587.33},
    {note:'D#5',freq:622.25,black:true},
    {note:'E5',freq:659.25}
  ];

  const WHITE_NOTES = NOTES.filter(n=>!n.black);
  const BLACK_NOTES = NOTES.filter(n=>n.black);

  // ===== SONGS =====
  const SONGS = [
    {name:'Twinkle',seq:['C4','C4','G4','G4','A4','A4','G4','F4','F4','E4','E4','D4','D4','C4']},
    {name:'Happy B-Day',seq:['C4','C4','D4','C4','F4','E4','C4','C4','D4','C4','G4','F4']},
    {name:'Mary Lamb',seq:['E4','D4','C4','D4','E4','E4','E4','D4','D4','D4','E4','G4','G4']},
    {name:'Jingle',seq:['E4','E4','E4','E4','E4','E4','E4','G4','C4','D4','E4','F4','F4','F4','F4','F4','E4','E4','E4','E4','D4','D4','E4','D4','G4']},
    {name:'Ode Joy',seq:['E4','E4','F4','G4','G4','F4','E4','D4','C4','C4','D4','E4','E4','D4','D4']},
    {name:'Birthday',seq:['G4','G4','A4','G4','C5','B4','G4','G4','A4','G4','D5','C5']}
  ];

  // ===== STATE =====
  const state = {
    mode:'free',
    noteCount:0,
    recorded:[],
    isRecording:false,
    isPlaying:false,
    activeSong:null,
    learnIndex:0,
    playTimers:[]
  };

  // ===== AUDIO =====
  let audioCtx = null;
  function getCtx(){
    if(!audioCtx){
      try{
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }catch(e){ audioCtx = null; }
    }
    if(audioCtx && audioCtx.state === 'suspended'){
      audioCtx.resume().catch(()=>{});
    }
    return audioCtx;
  }

  function playTone(freq, duration){
    duration = duration || 0.55;
    const ctx = getCtx();
    if(!ctx) return;
    try{
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    }catch(e){}
  }

  function vibrate(){
    if(navigator.vibrate) {
      try{ navigator.vibrate(10); }catch(e){}
    }
  }

  // ===== DOM =====
  const $ = id => document.getElementById(id);
  const whiteKeysEl = $('white-keys');
  const blackKeysEl = $('black-keys');
  const displayNote = $('display-note');
  const displaySub = $('display-sub');
  const noteCountEl = $('note-count');
  const modeLabel = $('mode-label');
  const modeBar = $('mode-bar');
  const songsList = $('songs-list');
  const btnRecord = $('btn-record');
  const btnPlay = $('btn-play');
  const btnClear = $('btn-clear');

  // ===== BUILD PIANO =====
  function buildPiano(){
    whiteKeysEl.innerHTML = '';
    blackKeysEl.innerHTML = '';

    WHITE_NOTES.forEach((n, i) => {
      const k = document.createElement('button');
      k.className = 'white-key';
      k.dataset.note = n.note;
      k.dataset.freq = n.freq;
      k.textContent = n.note;
      k.setAttribute('aria-label','White key '+n.note);
      attachKeyEvents(k);
      whiteKeysEl.appendChild(k);
    });

    // Position black keys between white keys
    // Pattern of black key positions: after C, D, F, G, A (not E, B)
    const blackPositions = [1, 2, 4, 5, 6]; // index in white keys where black key sits after
    // Actually we need to map black notes to specific positions
    // C#=between C&D, D#=between D&E, F#=between F&G, G#=between G&A, A#=between A&B
    const blackMap = {
      'C#4': 0, 'D#4': 1, 'F#4': 3, 'G#4': 4, 'A#4': 5,
      'C#5': 7, 'D#5': 8
    };

    BLACK_NOTES.forEach(n => {
      const pos = blackMap[n.note];
      if(pos === undefined) return;
      const k = document.createElement('button');
      k.className = 'black-key';
      k.dataset.note = n.note;
      k.dataset.freq = n.freq;
      k.textContent = n.note.replace('#','♯');
      // position: each white key is 100/WHITE_NOTES.length % wide
      const whiteWidth = 100 / WHITE_NOTES.length;
      k.style.left = (whiteWidth * (pos + 1) - whiteWidth * 0.30) + '%';
      k.setAttribute('aria-label','Black key '+n.note);
      attachKeyEvents(k);
      blackKeysEl.appendChild(k);
    });
  }

  function attachKeyEvents(el){
    const press = (e) => {
      e.preventDefault();
      triggerNote(el);
    };
    el.addEventListener('pointerdown', press);
    el.addEventListener('touchstart', press, {passive:false});
    el.addEventListener('mousedown', press);
  }

  function triggerNote(el){
    if(state.isPlaying && state.mode !== 'song') return;
    const note = el.dataset.note;
    const freq = parseFloat(el.dataset.freq);
    if(!note || !freq) return;

    playTone(freq, 0.6);
    vibrate();

    // Visual
    el.classList.add('is-active');
    setTimeout(()=>el.classList.remove('is-active'), 140);

    // Display
    displayNote.textContent = note.replace('#','♯');
    displayNote.classList.add('is-active');
    setTimeout(()=>displayNote.classList.remove('is-active'), 200);
    displaySub.textContent = freq.toFixed(1) + ' Hz';

    // Count
    state.noteCount++;
    noteCountEl.textContent = state.noteCount;

    // Record
    if(state.isRecording){
      state.recorded.push({note, freq});
    }

    // Learn mode
    if(state.mode === 'song' && state.activeSong){
      const expected = state.activeSong.seq[state.learnIndex];
      if(note === expected){
        state.learnIndex++;
        if(state.learnIndex >= state.activeSong.seq.length){
          displaySub.textContent = '🎉 Song complete!';
          state.learnIndex = 0;
          setTimeout(()=>{ displaySub.textContent = 'Start again'; }, 1500);
        } else {
          displaySub.textContent = 'Next: ' + state.activeSong.seq[state.learnIndex].replace('#','♯');
        }
      } else {
        displaySub.textContent = 'Expected: ' + expected.replace('#','♯');
      }
    }
  }

  // ===== MODES =====
  function setMode(mode){
    if(state.isPlaying) stopPlay();
    state.mode = mode;
    state.learnIndex = 0;
    document.querySelectorAll('.mode-btn').forEach(b=>{
      b.classList.toggle('is-active', b.dataset.mode === mode);
    });

    if(mode === 'free'){
      modeLabel.textContent = 'Free Play';
      displaySub.textContent = 'Press any key';
      state.activeSong = null;
    } else if(mode === 'song'){
      modeLabel.textContent = 'Learn Song';
      displaySub.textContent = 'Pick a song below';
    } else if(mode === 'record'){
      modeLabel.textContent = 'Record';
      displaySub.textContent = state.isRecording ? 'Recording...' : 'Press record to start';
    }
    updateSongsUI();
  }

  // ===== SONGS UI =====
  function buildSongs(){
    songsList.innerHTML = '';
    SONGS.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'song';
      b.textContent = s.name;
      b.addEventListener('click', () => selectSong(i));
      songsList.appendChild(b);
    });
  }

  function selectSong(i){
    if(state.mode !== 'song') setMode('song');
    state.activeSong = SONGS[i];
    state.learnIndex = 0;
    document.querySelectorAll('.song').forEach((el, idx) => {
      el.classList.toggle('is-active', idx === i);
    });
    displaySub.textContent = 'Play: ' + state.activeSong.seq[0].replace('#','♯');
    displayNote.textContent = state.activeSong.seq[0].replace('#','♯');
  }

  function updateSongsUI(){
    document.querySelectorAll('.song').forEach(el => {
      el.classList.toggle('is-active', false);
    });
  }

  // ===== RECORD =====
  function toggleRecord(){
    if(state.isPlaying) return;
    state.isRecording = !state.isRecording;
    if(state.isRecording){
      state.recorded = [];
      btnRecord.textContent = '■ Stop';
      btnRecord.classList.add('is-rec');
      if(state.mode !== 'record') setMode('record');
      displaySub.textContent = 'Recording...';
    } else {
      btnRecord.textContent = '● Record';
      btnRecord.classList.remove('is-rec');
      displaySub.textContent = state.recorded.length + ' notes saved';
    }
  }

  // ===== PLAY =====
  function playRecorded(){
    if(state.isPlaying){ stopPlay(); return; }
    if(state.recorded.length === 0){
      displaySub.textContent = 'Nothing recorded';
      return;
    }
    state.isPlaying = true;
    btnPlay.textContent = '■ Stop';
    btnPlay.classList.add('is-on');
    state.recorded.forEach((item, i) => {
      const t = setTimeout(() => {
        playTone(item.freq, 0.5);
        displayNote.textContent = item.note.replace('#','♯');
        displayNote.classList.add('is-active');
        setTimeout(()=>displayNote.classList.remove('is-active'), 150);
        displaySub.textContent = (i+1) + ' / ' + state.recorded.length;
        if(i === state.recorded.length - 1){
          setTimeout(()=>{
            state.isPlaying = false;
            btnPlay.textContent = '▶ Play';
            btnPlay.classList.remove('is-on');
          }, 500);
        }
      }, i * 320);
      state.playTimers.push(t);
    });
  }

  function stopPlay(){
    state.playTimers.forEach(t => clearTimeout(t));
    state.playTimers = [];
    state.isPlaying = false;
    btnPlay.textContent = '▶ Play';
    btnPlay.classList.remove('is-on');
  }

  function clearAll(){
    stopPlay();
    state.recorded = [];
    state.noteCount = 0;
    state.learnIndex = 0;
    noteCountEl.textContent = '0';
    displayNote.textContent = '♪';
    displaySub.textContent = 'Cleared';
    state.isRecording = false;
    btnRecord.textContent = '● Record';
    btnRecord.classList.remove('is-rec');
  }

  // ===== EVENTS =====
  modeBar.addEventListener('click', e => {
    const btn = e.target.closest('.mode-btn');
    if(!btn) return;
    setMode(btn.dataset.mode);
  });

  btnRecord.addEventListener('click', toggleRecord);
  btnPlay.addEventListener('click', playRecorded);
  btnClear.addEventListener('click', clearAll);
  $('reset').addEventListener('click', () => {
    clearAll();
    setMode('free');
    state.activeSong = null;
    updateSongsUI();
  });

  // Keyboard support
  const keyMap = {
    'a':'C4','w':'C#4','s':'D4','e':'D#4','d':'E4',
    'f':'F4','t':'F#4','g':'G4','y':'G#4','h':'A4',
    'u':'A#4','j':'B4','k':'C5','o':'C#5','l':'D5','p':'D#5',';':'E5'
  };
  document.addEventListener('keydown', e => {
    if(e.repeat) return;
    const note = keyMap[e.key.toLowerCase()];
    if(!note) return;
    const el = document.querySelector('[data-note="'+note+'"]');
    if(el) triggerNote(el);
  });

  // ===== INIT =====
  buildPiano();
  buildSongs();
  setMode('free');
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
  alias: ['keys', 'musical', 'pianogame'],
  description: 'Play interactive Piano game in WhatsApp',
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
                  messageText: "🎹 SILA Piano - Tap keys to play!"
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
      await sock.sendMessage(
        sender,
        { text: `✖ Error: ${error?.message || error}` },
        { quoted: msg }
      );
    }
  }
};