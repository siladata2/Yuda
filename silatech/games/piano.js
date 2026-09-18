import { randomUUID } from 'crypto';

// ============================================
// HTML PIANO GAME - PRO PREMIUM EDITION
// ============================================
const pianoHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{
  --purple-1:#7c3aed;
  --purple-2:#a855f7;
  --purple-3:#c084fc;
  --purple-4:#8b5cf6;
  --purple-deep:#4c1d95;
  --purple-dark:#2e1065;
  --bg-card:#1a1033;
  --bg-deep:#0f0a1e;
  --ink:#ffffff;
  --ink-soft:#d8cff0;
  --ink-muted:#9d8fc4;
  --white-key:#ffffff;
  --white-key-shadow:#e0dbe8;
  --black-key:#1a1424;
  --accent-glow:rgba(168,85,247,0.5);
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html,body{
  background:#0a0612;
  color:var(--ink);
  font-family:var(--sys);
  min-height:100vh;
  overflow-x:hidden;
  touch-action:manipulation;
  -webkit-font-smoothing:antialiased;
}

.stage{
  min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:20px 12px;
  background:
    radial-gradient(circle at 20% 10%, rgba(124,58,237,0.18) 0%, transparent 50%),
    radial-gradient(circle at 80% 90%, rgba(168,85,247,0.15) 0%, transparent 50%),
    #0a0612;
}

.card{
  width:100%;max-width:400px;
  background:linear-gradient(160deg,#2d1b4e 0%,#1a1033 60%,#14092b 100%);
  border-radius:28px;
  padding:22px 18px 18px;
  box-shadow:
    0 30px 80px -20px rgba(124,58,237,0.5),
    0 0 0 1px rgba(168,85,247,0.15) inset,
    0 1px 0 rgba(255,255,255,0.08) inset;
  position:relative;
  overflow:hidden;
}
.card::before{
  content:'';
  position:absolute;top:-50%;left:-50%;
  width:200%;height:200%;
  background:radial-gradient(circle at 30% 20%, rgba(168,85,247,0.15) 0%, transparent 40%);
  pointer-events:none;
}

/* HEADER */
.header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:18px;position:relative;z-index:2;
  gap:10px;
}
.header__left{
  display:flex;align-items:center;gap:12px;
}
.header__icon{
  width:44px;height:44px;border-radius:12px;
  background:linear-gradient(135deg,#a855f7 0%,#7c3aed 100%);
  display:flex;align-items:center;justify-content:center;
  font-size:22px;
  box-shadow:0 8px 20px -6px rgba(168,85,247,0.6);
  flex-shrink:0;
}
.header__text{display:flex;flex-direction:column;gap:2px}
.header__title{
  font-size:19px;font-weight:700;
  color:#fff;letter-spacing:-.02em;
  line-height:1;
}
.header__sub{
  font-size:10px;font-weight:600;
  color:var(--ink-muted);
  letter-spacing:.14em;
  text-transform:uppercase;
}
.header__badge{
  display:flex;align-items:center;gap:6px;
  padding:8px 14px;border-radius:20px;
  background:rgba(168,85,247,0.12);
  border:1px solid rgba(168,85,247,0.3);
  font-size:11px;font-weight:700;
  color:var(--purple-3);
  letter-spacing:.08em;
  text-transform:uppercase;
  white-space:nowrap;
}
.header__badge::before{
  content:'';width:6px;height:6px;border-radius:50%;
  background:var(--purple-2);
  box-shadow:0 0 8px var(--purple-2);
  animation:dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse{
  0%,100%{opacity:1;transform:scale(1)}
  50%{opacity:0.5;transform:scale(1.3)}
}

/* DISPLAY */
.display{
  background:linear-gradient(135deg,rgba(124,58,237,0.25) 0%,rgba(168,85,247,0.15) 100%);
  border:1px solid rgba(168,85,247,0.25);
  border-radius:20px;
  padding:18px 16px;
  margin-bottom:16px;
  min-height:100px;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:6px;
  position:relative;
  z-index:2;
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.06);
}
.display__label{
  font-size:10px;font-weight:700;
  color:var(--ink-muted);
  letter-spacing:.2em;
  text-transform:uppercase;
  display:flex;align-items:center;gap:6px;
}
.display__label::before{
  content:'♪';
  color:var(--purple-3);
  font-size:12px;
}
.display__note{
  font-size:52px;font-weight:800;
  color:#fff;
  letter-spacing:-.03em;
  line-height:1;
  text-shadow:0 0 30px rgba(168,85,247,0.6);
  transition:all .15s cubic-bezier(.34,1.56,.64,1);
}
.display__note.is-active{
  transform:scale(1.12);
  color:var(--purple-3);
  text-shadow:0 0 40px rgba(192,132,252,0.9);
}
.display__sub{
  font-size:11px;
  color:var(--ink-soft);
  font-weight:500;
  letter-spacing:.02em;
  min-height:14px;
}

/* PIANO */
.piano-wrap{
  background:linear-gradient(180deg,#0f0a1e 0%,#1a1033 100%);
  border-radius:20px;
  padding:14px 12px 12px;
  margin-bottom:16px;
  border:1px solid rgba(168,85,247,0.2);
  box-shadow:
    inset 0 2px 12px rgba(0,0,0,0.5),
    0 8px 24px -8px rgba(0,0,0,0.6);
  position:relative;
  z-index:2;
}
.piano{
  position:relative;
  display:flex;
  height:180px;
  width:100%;
  border-radius:8px;
  overflow:hidden;
  background:#000;
  box-shadow:0 4px 20px rgba(124,58,237,0.3);
}
.white-keys{
  display:flex;width:100%;height:100%;
  position:relative;
}
.white-key{
  flex:1;
  background:linear-gradient(180deg,#ffffff 0%,#f0ecf5 70%,#d8d0e3 100%);
  border:1px solid #b8a8d0;
  border-right:none;
  border-radius:0 0 8px 8px;
  cursor:pointer;
  position:relative;
  display:flex;align-items:flex-end;justify-content:center;
  padding-bottom:10px;
  font-size:10px;font-weight:700;
  color:#5a4a7a;
  transition:all .06s ease;
  box-shadow:
    inset 0 -6px 12px rgba(124,58,237,0.08),
    inset 0 2px 0 rgba(255,255,255,0.9);
  letter-spacing:.02em;
}
.white-key:last-child{border-right:1px solid #b8a8d0}
.white-key:active,
.white-key.is-active{
  background:linear-gradient(180deg,#a855f7 0%,#7c3aed 100%);
  color:#fff;
  transform:translateY(3px) scaleY(0.98);
  box-shadow:
    inset 0 4px 10px rgba(0,0,0,0.4),
    0 0 20px rgba(168,85,247,0.8);
}

.black-keys{
  position:absolute;top:0;left:0;
  width:100%;height:62%;
  pointer-events:none;
}
.black-key{
  position:absolute;
  background:linear-gradient(180deg,#2a1f3d 0%,#0f0a1e 100%);
  border-radius:0 0 6px 6px;
  cursor:pointer;
  pointer-events:auto;
  width:8.5%;height:100%;
  border:1px solid #000;
  display:flex;align-items:flex-end;justify-content:center;
  padding-bottom:6px;
  font-size:9px;font-weight:700;
  color:#9d8fc4;
  transition:all .06s ease;
  box-shadow:
    0 4px 10px rgba(0,0,0,0.7),
    inset 0 -3px 6px rgba(124,58,237,0.3);
  z-index:2;
  letter-spacing:.02em;
}
.black-key:active,
.black-key.is-active{
  background:linear-gradient(180deg,#a855f7 0%,#7c3aed 100%);
  color:#fff;
  transform:translateY(3px);
  height:calc(100% + 3px);
  box-shadow:
    0 0 20px rgba(168,85,247,0.9),
    inset 0 2px 6px rgba(0,0,0,0.4);
}

/* RECORD BUTTON - BIG PREMIUM */
.record-area{
  display:flex;gap:10px;
  margin-bottom:14px;
  position:relative;z-index:2;
}
.btn-record{
  flex:1;
  background:linear-gradient(135deg,#a855f7 0%,#7c3aed 100%);
  border:none;
  border-radius:16px;
  padding:16px 20px;
  color:#fff;
  font-family:inherit;
  font-size:14px;font-weight:800;
  letter-spacing:.1em;
  text-transform:uppercase;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:10px;
  transition:all .2s cubic-bezier(.34,1.56,.64,1);
  box-shadow:
    0 12px 28px -8px rgba(168,85,247,0.7),
    inset 0 1px 0 rgba(255,255,255,0.2);
  position:relative;
  overflow:hidden;
}
.btn-record::before{
  content:'';
  position:absolute;inset:0;
  background:linear-gradient(135deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%);
  transform:translateX(-100%);
  transition:transform .6s ease;
}
.btn-record:hover::before{transform:translateX(100%)}
.btn-record:active{transform:scale(.97)}
.btn-record__icon{
  width:22px;height:22px;
  border-radius:50%;
  background:rgba(255,255,255,0.25);
  display:flex;align-items:center;justify-content:center;
  font-size:12px;
  transition:all .2s ease;
}
.btn-record.is-recording{
  background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);
  box-shadow:
    0 12px 28px -8px rgba(239,68,68,0.7),
    inset 0 1px 0 rgba(255,255,255,0.2);
  animation:recPulse 1.4s ease-in-out infinite;
}
.btn-record.is-recording .btn-record__icon{
  background:#fff;
  color:#dc2626;
  border-radius:4px;
  width:14px;height:14px;
}
@keyframes recPulse{
  0%,100%{box-shadow:0 12px 28px -8px rgba(239,68,68,0.7),inset 0 1px 0 rgba(255,255,255,0.2)}
  50%{box-shadow:0 12px 36px -4px rgba(239,68,68,1),inset 0 1px 0 rgba(255,255,255,0.3)}
}

.btn-icon{
  width:56px;height:56px;
  background:rgba(168,85,247,0.12);
  border:1px solid rgba(168,85,247,0.3);
  border-radius:16px;
  color:var(--purple-3);
  font-size:20px;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all .18s ease;
  flex-shrink:0;
  font-family:inherit;
}
.btn-icon:hover{
  background:rgba(168,85,247,0.22);
  color:#fff;
  border-color:var(--purple-2);
}
.btn-icon:active{transform:scale(.94)}

/* PLAYBACK BAR */
.playback{
  display:flex;gap:8px;
  margin-bottom:14px;
  position:relative;z-index:2;
}
.btn-play{
  flex:1;
  background:rgba(168,85,247,0.1);
  border:1px solid rgba(168,85,247,0.25);
  border-radius:12px;
  padding:12px 14px;
  color:var(--ink-soft);
  font-family:inherit;
  font-size:12px;font-weight:700;
  letter-spacing:.06em;
  text-transform:uppercase;
  cursor:pointer;
  transition:all .18s ease;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
.btn-play:hover{
  background:rgba(168,85,247,0.2);
  color:#fff;
  border-color:var(--purple-2);
}
.btn-play.is-playing{
  background:linear-gradient(135deg,#a855f7 0%,#7c3aed 100%);
  color:#fff;
  border-color:transparent;
}

/* INFO FOOTER */
.info-footer{
  display:flex;align-items:center;justify-content:center;
  gap:8px;
  padding-top:14px;
  border-top:1px solid rgba(168,85,247,0.15);
  position:relative;z-index:2;
}
.info-footer__icon{
  font-size:14px;
  color:var(--purple-3);
}
.info-footer__text{
  font-size:10px;font-weight:700;
  color:var(--ink-muted);
  letter-spacing:.18em;
  text-transform:uppercase;
}

/* NOTES COUNTER */
.notes-counter{
  position:absolute;
  top:22px;right:18px;
  display:flex;align-items:center;gap:6px;
  padding:6px 12px;
  border-radius:16px;
  background:rgba(168,85,247,0.15);
  border:1px solid rgba(168,85,247,0.25);
  font-size:10px;font-weight:800;
  color:var(--purple-3);
  letter-spacing:.08em;
  z-index:3;
}
.notes-counter__dot{
  width:5px;height:5px;border-radius:50%;
  background:var(--purple-2);
  box-shadow:0 0 8px var(--purple-2);
}

/* RECORDED NOTES PREVIEW */
.preview{
  display:flex;gap:4px;
  flex-wrap:wrap;
  padding:10px 12px;
  background:rgba(15,10,30,0.6);
  border-radius:10px;
  margin-bottom:14px;
  min-height:38px;
  border:1px solid rgba(168,85,247,0.15);
  position:relative;z-index:2;
  overflow:hidden;
}
.preview__empty{
  font-size:11px;color:var(--ink-muted);
  letter-spacing:.05em;
  align-self:center;
  width:100%;text-align:center;
}
.preview__note{
  padding:3px 8px;
  border-radius:6px;
  background:rgba(168,85,247,0.2);
  color:var(--purple-3);
  font-size:10px;font-weight:700;
  letter-spacing:.02em;
  animation:noteIn .3s cubic-bezier(.34,1.56,.64,1);
}
@keyframes noteIn{
  0%{transform:scale(0);opacity:0}
  100%{transform:scale(1);opacity:1}
}

@media (max-width:380px){
  .stage{padding:14px 8px}
  .piano{height:150px}
  .display__note{font-size:42px}
  .card{padding:18px 14px 14px;border-radius:24px}
  .header__title{font-size:17px}
  .btn-record{font-size:13px;padding:14px}
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
    <div class="notes-counter">
      <span class="notes-counter__dot"></span>
      <span id="notes-count">0 NOTES</span>
    </div>

    <div class="header">
      <div class="header__left">
        <div class="header__icon">🎵</div>
        <div class="header__text">
          <div class="header__title">Piano</div>
          <div class="header__sub">Madrin Music</div>
        </div>
      </div>
    </div>

    <div class="display">
      <div class="display__label">Now Playing</div>
      <div class="display__note" id="display-note">Do</div>
      <div class="display__sub" id="display-sub">Tap a key to play</div>
    </div>

    <div class="piano-wrap">
      <div class="piano" id="piano">
        <div class="white-keys" id="white-keys"></div>
        <div class="black-keys" id="black-keys"></div>
      </div>
    </div>

    <div class="preview" id="preview">
      <div class="preview__empty">No notes recorded yet</div>
    </div>

    <div class="record-area">
      <button class="btn-record" id="btn-record">
        <span class="btn-record__icon">●</span>
        <span id="record-label">Record</span>
      </button>
      <button class="btn-icon" id="btn-clear" aria-label="Clear">🗑</button>
    </div>

    <div class="playback">
      <button class="btn-play" id="btn-play">
        <span>▶</span>
        <span>Play Back</span>
      </button>
    </div>

    <div class="info-footer">
      <span class="info-footer__icon">🎹</span>
      <span class="info-footer__text">Madrin Premium</span>
    </div>
  </div>
</div>

<script>
(function(){
  // ===== NOTES (Solfège style like screenshot) =====
  const NOTES = [
    {id:'Do4',  solfa:'Do',  freq:261.63},
    {id:'Do#4', solfa:'Do#', freq:277.18, black:true},
    {id:'Re4',  solfa:'Re',  freq:293.66},
    {id:'Re#4', solfa:'Re#', freq:311.13, black:true},
    {id:'Mi4',  solfa:'Mi',  freq:329.63},
    {id:'Fa4',  solfa:'Fa',  freq:349.23},
    {id:'Fa#4', solfa:'Fa#', freq:369.99, black:true},
    {id:'Sol4', solfa:'Sol', freq:392.00},
    {id:'Sol#4',solfa:'Sol#',freq:415.30, black:true},
    {id:'La4',  solfa:'La',  freq:440.00},
    {id:'La#4', solfa:'La#', freq:466.16, black:true},
    {id:'Si4',  solfa:'Si',  freq:493.88},
    {id:'Do5',  solfa:'Do',  freq:523.25}
  ];

  const WHITE_NOTES = NOTES.filter(n=>!n.black);
  const BLACK_NOTES = NOTES.filter(n=>n.black);

  // ===== STATE =====
  const state = {
    noteCount:0,
    recorded:[],
    isRecording:false,
    isPlaying:false,
    playTimers:[]
  };

  // ===== AUDIO =====
  let audioCtx = null;
  function getCtx(){
    if(!audioCtx){
      try{ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e){ audioCtx = null; }
    }
    if(audioCtx && audioCtx.state === 'suspended'){
      audioCtx.resume().catch(()=>{});
    }
    return audioCtx;
  }

  function playTone(freq, duration){
    duration = duration || 0.6;
    const ctx = getCtx();
    if(!ctx) return;
    try{
      const now = ctx.currentTime;
      // Rich piano-like tone: dual oscillator
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc2.detune.setValueAtTime(4, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 4, now);
      filter.Q.setValueAtTime(0.7, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.32, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    }catch(e){}
  }

  function vibrate(){
    if(navigator.vibrate){ try{ navigator.vibrate(12); }catch(e){} }
  }

  // ===== DOM =====
  const $ = id => document.getElementById(id);
  const whiteKeysEl = $('white-keys');
  const blackKeysEl = $('black-keys');
  const displayNote = $('display-note');
  const displaySub = $('display-sub');
  const notesCountEl = $('notes-count');
  const btnRecord = $('btn-record');
  const recordLabel = $('record-label');
  const btnPlay = $('btn-play');
  const btnClear = $('btn-clear');
  const preview = $('preview');

  // ===== BUILD PIANO =====
  function buildPiano(){
    whiteKeysEl.innerHTML = '';
    blackKeysEl.innerHTML = '';

    WHITE_NOTES.forEach((n) => {
      const k = document.createElement('button');
      k.className = 'white-key';
      k.dataset.note = n.id;
      k.dataset.freq = n.freq;
      k.dataset.solfa = n.solfa;
      k.textContent = n.solfa;
      k.setAttribute('aria-label','Key '+n.solfa);
      attachKeyEvents(k);
      whiteKeysEl.appendChild(k);
    });

    // Map black keys between white keys
    const blackMap = {
      'Do#4': 0, 'Re#4': 1, 'Fa#4': 3, 'Sol#4': 4, 'La#4': 5
    };

    BLACK_NOTES.forEach(n => {
      const pos = blackMap[n.id];
      if(pos === undefined) return;
      const k = document.createElement('button');
      k.className = 'black-key';
      k.dataset.note = n.id;
      k.dataset.freq = n.freq;
      k.dataset.solfa = n.solfa;
      k.textContent = n.solfa;
      const whiteWidth = 100 / WHITE_NOTES.length;
      k.style.left = (whiteWidth * (pos + 1) - whiteWidth * 0.32) + '%';
      k.setAttribute('aria-label','Key '+n.solfa);
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
  }

  function triggerNote(el){
    if(state.isPlaying) return;
    const note = el.dataset.note;
    const freq = parseFloat(el.dataset.freq);
    const solfa = el.dataset.solfa;
    if(!note || !freq) return;

    playTone(freq, 0.6);
    vibrate();

    el.classList.add('is-active');
    setTimeout(()=>el.classList.remove('is-active'), 150);

    displayNote.textContent = solfa;
    displayNote.classList.add('is-active');
    setTimeout(()=>displayNote.classList.remove('is-active'), 220);
    displaySub.textContent = freq.toFixed(1) + ' Hz';

    state.noteCount++;
    notesCountEl.textContent = state.noteCount + (state.noteCount === 1 ? ' NOTE' : ' NOTES');

    if(state.isRecording){
      state.recorded.push({note, freq, solfa});
      addPreviewChip(solfa);
    }
  }

  // ===== PREVIEW CHIPS =====
  function addPreviewChip(solfa){
    const empty = preview.querySelector('.preview__empty');
    if(empty) empty.remove();
    const chip = document.createElement('div');
    chip.className = 'preview__note';
    chip.textContent = solfa;
    preview.appendChild(chip);
    preview.scrollTop = preview.scrollHeight;
    // Limit preview display
    const chips = preview.querySelectorAll('.preview__note');
    if(chips.length > 20){
      chips[0].remove();
    }
  }

  function clearPreview(){
    preview.innerHTML = '<div class="preview__empty">No notes recorded yet</div>';
  }

  // ===== RECORD =====
  function toggleRecord(){
    if(state.isPlaying) return;
    state.isRecording = !state.isRecording;

    if(state.isRecording){
      // Fresh recording
      state.recorded = [];
      clearPreview();
      btnRecord.classList.add('is-recording');
      recordLabel.textContent = 'Recording';
      displaySub.textContent = 'Recording... tap keys';
    } else {
      btnRecord.classList.remove('is-recording');
      recordLabel.textContent = 'Record';
      displaySub.textContent = state.recorded.length + ' note' + (state.recorded.length === 1 ? '' : 's') + ' saved';
    }
  }

  // ===== PLAY BACK =====
  function playBack(){
    if(state.isPlaying){ stopPlay(); return; }
    if(state.recorded.length === 0){
      displaySub.textContent = 'Record some notes first';
      return;
    }
    state.isPlaying = true;
    btnPlay.classList.add('is-playing');
    btnPlay.innerHTML = '<span>■</span><span>Stop</span>';

    state.recorded.forEach((item, i) => {
      const t = setTimeout(() => {
        playTone(item.freq, 0.5);
        displayNote.textContent = item.solfa;
        displayNote.classList.add('is-active');
        setTimeout(()=>displayNote.classList.remove('is-active'), 150);
        displaySub.textContent = 'Playing ' + (i+1) + ' / ' + state.recorded.length;
        // Highlight key visually
        const key = document.querySelector('[data-note="'+item.note+'"]');
        if(key){
          key.classList.add('is-active');
          setTimeout(()=>key.classList.remove('is-active'), 180);
        }

        if(i === state.recorded.length - 1){
          setTimeout(()=>{
            state.isPlaying = false;
            btnPlay.classList.remove('is-playing');
            btnPlay.innerHTML = '<span>▶</span><span>Play Back</span>';
            displaySub.textContent = 'Playback complete';
          }, 600);
        }
      }, i * 330);
      state.playTimers.push(t);
    });
  }

  function stopPlay(){
    state.playTimers.forEach(t => clearTimeout(t));
    state.playTimers = [];
    state.isPlaying = false;
    btnPlay.classList.remove('is-playing');
    btnPlay.innerHTML = '<span>▶</span><span>Play Back</span>';
  }

  // ===== CLEAR =====
  function clearAll(){
    stopPlay();
    if(state.isRecording) toggleRecord();
    state.recorded = [];
    state.noteCount = 0;
    notesCountEl.textContent = '0 NOTES';
    displayNote.textContent = 'Do';
    displaySub.textContent = 'Tap a key to play';
    clearPreview();
  }

  // ===== EVENTS =====
  btnRecord.addEventListener('click', toggleRecord);
  btnPlay.addEventListener('click', playBack);
  btnClear.addEventListener('click', clearAll);

  // Keyboard support (piano layout)
  const keyMap = {
    'a':'Do4','w':'Do#4','s':'Re4','e':'Re#4','d':'Mi4',
    'f':'Fa4','t':'Fa#4','g':'Sol4','y':'Sol#4','h':'La4',
    'u':'La#4','j':'Si4','k':'Do5'
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
  alias: ['keys', 'musical', 'pianogame', 'pianopro'],
  description: 'Play interactive Pro Piano in WhatsApp',
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
                  messageText: "🎹 SILA Piano Pro - Tap keys & record your melody"
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