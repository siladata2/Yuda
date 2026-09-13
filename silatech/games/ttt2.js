import { randomUUID } from 'crypto';

// ============================================
// ADVANCED TICTACTOE GAME - PRO EDITION
// ============================================
const tictactoeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{
  --bg:#0b141a;
  --card:#111b21;
  --card-2:#1f2c33;
  --ink:#e9edef;
  --ink-soft:#aebac1;
  --muted:#8696a0;
  --accent:#00a884;
  --accent-2:#008069;
  --line:#2a3942;
  --line-strong:#374248;
  --cell-bg:#0b141a;
  --o:#00a884;
  --x:#e9edef;
  --danger:#f15c6d;
  --gold:#ffd700;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
[data-theme="neon"]{
  --bg:#0a0014;--card:#15002a;--card-2:#1e0040;--accent:#ff00ff;--o:#00ffff;--x:#ffff00;
  --line:#3d0066;--line-strong:#5c0099;--cell-bg:#0a0014;
}
[data-theme="retro"]{
  --bg:#1a1208;--card:#2a1e0f;--card-2:#3d2b17;--accent:#ff9500;--o:#ff9500;--x:#00d4aa;
  --line:#4d3820;--line-strong:#6b4f2c;--cell-bg:#1a1208;
}
[data-theme="ocean"]{
  --bg:#051b2e;--card:#0a2942;--card-2:#0f3a5c;--accent:#00b4d8;--o:#00b4d8;--x:#90e0ef;
  --line:#1a4d6e;--line-strong:#2a6e94;--cell-bg:#051b2e;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html,body{
  background:transparent;color:var(--ink);font-family:var(--sys);
  min-height:100vh;overflow-x:hidden;touch-action:manipulation;
  -webkit-font-smoothing:antialiased;transition:background .3s ease;
}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 14px}
.card{width:100%;max-width:380px}

.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--line);gap:8px}
.header__title{font-size:17px;font-weight:700;color:var(--ink);letter-spacing:-.01em}
.header__sub{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.header__icons{display:flex;gap:8px}
.icon-btn{
  background:transparent;border:none;color:var(--muted);cursor:pointer;
  padding:6px;border-radius:6px;font-size:16px;line-height:1;
  transition:all .15s ease;
}
.icon-btn:hover{color:var(--ink);background:var(--card-2)}
.icon-btn:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.icon-btn.is-active{color:var(--accent)}

.status{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:12px;gap:8px}
.status__turn{display:flex;align-items:center;gap:8px;color:var(--ink-soft)}
.status__indicator{
  width:9px;height:9px;border-radius:50%;background:var(--x);position:relative;flex-shrink:0;
  transition:background .2s ease;
}
.status__indicator.is-o{background:var(--o)}
.status__indicator.is-thinking::after{
  content:'';position:absolute;inset:-3px;border-radius:50%;
  border:1.5px solid var(--o);animation:ring 1.1s ease-out infinite;
}
@keyframes ring{0%{transform:scale(.7);opacity:1}100%{transform:scale(2.2);opacity:0}}
.status__score{display:flex;gap:10px;font-variant-numeric:tabular-nums;color:var(--muted);font-size:11px}
.status__score b{color:var(--ink);font-weight:700;margin-left:3px}

.timer-bar{
  height:3px;background:var(--line);border-radius:2px;overflow:hidden;
  margin-bottom:12px;opacity:0;transition:opacity .3s ease;
}
.timer-bar.is-active{opacity:1}
.timer-bar__fill{
  height:100%;background:var(--accent);width:100%;
  transition:width .1s linear,background .3s ease;
}
.timer-bar.is-warning .timer-bar__fill{background:var(--danger)}

.board{
  width:100%;aspect-ratio:1;position:relative;display:grid;
  grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;
  background:var(--cell-bg);border-radius:10px;overflow:hidden;
  border:1px solid var(--line);
  transition:background .3s ease;
}
.cell{position:relative;background:transparent;border:none;cursor:pointer;padding:0;font-family:inherit;color:inherit}
.cell:disabled{cursor:default}
.cell:focus-visible{outline:2px solid var(--accent);outline-offset:-3px}
.cell:not(:disabled):hover{background:rgba(255,255,255,0.03)}
.cell::before{content:'';position:absolute;right:0;top:6%;bottom:6%;width:1px;background:var(--line-strong)}
.cell:nth-child(3n)::before{display:none}
.cell::after{content:'';position:absolute;bottom:0;left:6%;right:6%;height:1px;background:var(--line-strong)}
.cell:nth-last-child(-n+3)::after{display:none}
.cell.is-winning{background:rgba(0,168,132,0.16);animation:pulse 1.2s ease-in-out infinite}
.cell.is-winning-x{background:rgba(233,237,239,0.09)}
.cell.is-hint{animation:hintPulse 1s ease-in-out infinite}
@keyframes pulse{0%,100%{background:rgba(0,168,132,0.16)}50%{background:rgba(0,168,132,0.28)}}
@keyframes hintPulse{0%,100%{background:rgba(255,215,0,0.08)}50%{background:rgba(255,215,0,0.22)}}

.mark{position:absolute;inset:22%;pointer-events:none}
.mark__svg{width:100%;height:100%;overflow:visible}
.mark__svg path,.mark__svg circle{fill:none;stroke:var(--x);stroke-width:9;stroke-linecap:round}
.mark--o .mark__svg path,.mark--o .mark__svg circle{stroke:var(--o)}
.mark__svg path{stroke-dasharray:120;stroke-dashoffset:120;animation:draw .3s ease-out forwards}
.mark__svg path:nth-child(2){animation-delay:.12s}
.mark__svg circle{stroke-dasharray:220;stroke-dashoffset:220;animation:draw .4s ease-out forwards}
@keyframes draw{to{stroke-dashoffset:0}}

.winning-line{
  position:absolute;height:4px;background:var(--o);transform-origin:left center;
  z-index:5;pointer-events:none;border-radius:2px;
  box-shadow:0 0 12px var(--o);
}
.winning-line.is-x{background:var(--x);box-shadow:0 0 12px var(--x)}

.controls{
  display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:14px;
}
.ctrl{
  background:var(--card-2);border:1px solid var(--line-strong);border-radius:8px;
  padding:10px 8px;font-size:12px;font-weight:600;color:var(--ink-soft);
  cursor:pointer;font-family:inherit;display:flex;align-items:center;
  justify-content:center;gap:5px;transition:all .15s ease;
}
.ctrl:hover:not(:disabled){color:var(--ink);border-color:var(--accent)}
.ctrl:disabled{opacity:.4;cursor:not-allowed}
.ctrl:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.ctrl__icon{font-size:14px}

.levels{margin-top:14px}
.levels__label{font-size:11px;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em}
.levels__list{
  display:flex;flex-wrap:nowrap;gap:6px;overflow-x:auto;overflow-y:hidden;
  -webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;
  padding:2px 2px 6px;margin:0 -2px;
}
.levels__list::-webkit-scrollbar{display:none}
.level{
  background:transparent;border:1px solid var(--line-strong);border-radius:20px;
  padding:8px 14px;font-size:12px;font-weight:600;color:var(--ink-soft);
  cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;
  transition:all .15s ease;
}
.level:hover{color:var(--ink);border-color:var(--ink-soft)}
.level.is-active{background:var(--accent);border-color:var(--accent);color:#0b141a}
.level:focus-visible{outline:2px solid var(--accent);outline-offset:1px}

.footer{margin-top:10px;display:flex;justify-content:center;gap:12px}
.footer__btn{
  background:none;border:none;color:var(--accent);font-family:inherit;
  font-size:12px;font-weight:600;cursor:pointer;padding:8px 12px;
  transition:color .15s ease;
}
.footer__btn:hover{color:var(--ink)}
.footer__btn:focus-visible{outline:2px solid var(--accent);outline-offset:1px}

/* MODAL */
.modal{
  position:fixed;inset:0;z-index:50;display:flex;align-items:center;
  justify-content:center;padding:24px;opacity:0;pointer-events:none;
  transition:opacity .3s ease;
}
.modal.is-open{opacity:1;pointer-events:auto}
.modal__backdrop{position:absolute;inset:0;background:rgba(11,20,26,0.75);backdrop-filter:blur(4px)}
.modal__card{
  position:relative;background:var(--card-2);border-radius:16px;
  padding:24px 20px 0;text-align:center;max-width:340px;width:100%;
  box-shadow:0 24px 50px -12px rgba(0,0,0,0.7);
  transform:translateY(8px) scale(.96);
  transition:transform .35s cubic-bezier(.34,1.56,.64,1);overflow:hidden;
}
.modal.is-open .modal__card{transform:translateY(0) scale(1)}
.modal__emoji{font-size:44px;margin-bottom:8px;line-height:1}
.modal__title{font-size:20px;font-weight:700;letter-spacing:-.015em;color:var(--ink);margin-bottom:6px;line-height:1.25}
.modal__title.is-o{color:var(--o)}
.modal__title.is-win{color:var(--accent)}
.modal__sub{font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.4}
.modal__stats{
  display:flex;justify-content:center;gap:16px;margin-bottom:16px;
  padding:10px;background:var(--card);border-radius:8px;
}
.modal__stat{display:flex;flex-direction:column;gap:2px}
.modal__stat-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.modal__stat-value{font-size:16px;font-weight:700;color:var(--ink)}
.modal__actions{display:flex;border-top:1px solid var(--line-strong);margin:0 -20px}
.modal__btn{
  flex:1;background:transparent;border:none;color:var(--accent);
  font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;
  padding:14px 12px;transition:color .15s ease;
}
.modal__btn:hover{color:var(--ink)}
.modal__btn+.modal__btn{border-left:1px solid var(--line-strong)}
.modal__btn:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}

/* STATS PANEL */
.stats-panel{
  position:fixed;inset:0;z-index:60;display:flex;align-items:flex-end;
  justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s ease;
}
.stats-panel.is-open{opacity:1;pointer-events:auto}
.stats-panel__backdrop{position:absolute;inset:0;background:rgba(11,20,26,0.75);backdrop-filter:blur(4px)}
.stats-panel__card{
  position:relative;background:var(--card-2);border-radius:20px 20px 0 0;
  padding:20px;width:100%;max-width:420px;max-height:85vh;overflow-y:auto;
  transform:translateY(100%);transition:transform .4s cubic-bezier(.34,1.2,.64,1);
}
.stats-panel.is-open .stats-panel__card{transform:translateY(0)}
.stats-panel__grab{width:36px;height:4px;background:var(--line-strong);border-radius:2px;margin:0 auto 16px}
.stats-panel__title{font-size:16px;font-weight:700;margin-bottom:16px;color:var(--ink)}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.stat-box{
  background:var(--card);border-radius:10px;padding:12px;text-align:center;
  border:1px solid var(--line);
}
.stat-box__value{font-size:22px;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}
.stat-box__label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:2px}
.achievements{display:flex;flex-direction:column;gap:8px}
.achievement{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  background:var(--card);border-radius:8px;border:1px solid var(--line);
  opacity:.4;transition:all .3s ease;
}
.achievement.is-unlocked{opacity:1;border-color:var(--gold)}
.achievement__icon{font-size:22px}
.achievement__info{flex:1;text-align:left}
.achievement__name{font-size:12px;font-weight:700;color:var(--ink)}
.achievement__desc{font-size:10px;color:var(--muted);margin-top:1px}

/* TOAST */
.toast{
  position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);
  background:var(--card-2);color:var(--ink);padding:10px 18px;border-radius:20px;
  font-size:12px;font-weight:600;z-index:70;box-shadow:0 8px 20px rgba(0,0,0,0.4);
  transition:transform .35s cubic-bezier(.34,1.56,.64,1);pointer-events:none;
  border:1px solid var(--line-strong);
}
.toast.is-show{transform:translateX(-50%) translateY(0)}

@media (max-width:380px){
  .stage{padding:14px 10px}
  .level{padding:7px 12px;font-size:11px}
  .modal__title{font-size:18px}
  .ctrl{font-size:11px;padding:9px 6px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms!important;animation-iteration-count:1!important;
    transition-duration:.01ms!important;
  }
}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div>
        <div class="header__title">SILA TicTacToe</div>
        <div class="header__sub" id="mode-label">VS AI</div>
      </div>
      <div class="header__icons">
        <button class="icon-btn" id="btn-sound" title="Sound">🔊</button>
        <button class="icon-btn" id="btn-theme" title="Theme">🎨</button>
        <button class="icon-btn" id="btn-stats" title="Stats">📊</button>
      </div>
    </div>

    <div class="status" aria-live="polite">
      <div class="status__turn">
        <span class="status__indicator" id="indicator"></span>
        <span id="status-text">Your turn</span>
      </div>
      <div class="status__score">
        <span>W<b id="score-x">0</b></span>
        <span>D<b id="score-d">0</b></span>
        <span>L<b id="score-o">0</b></span>
      </div>
    </div>

    <div class="timer-bar" id="timer-bar">
      <div class="timer-bar__fill" id="timer-fill"></div>
    </div>

    <div class="board" id="board" role="grid" aria-label="3x3 Game board"></div>

    <div class="controls">
      <button class="ctrl" id="btn-undo" disabled>
        <span class="ctrl__icon">↩️</span><span>Undo</span>
      </button>
      <button class="ctrl" id="btn-hint">
        <span class="ctrl__icon">💡</span><span>Hint</span>
      </button>
      <button class="ctrl" id="btn-mode">
        <span class="ctrl__icon">🎮</span><span id="mode-btn-text">PvP</span>
      </button>
    </div>

    <div class="levels">
      <div class="levels__label">Difficulty</div>
      <div class="levels__list" id="levels-list" role="radiogroup" aria-label="Difficulty level"></div>
    </div>

    <div class="footer">
      <button class="footer__btn" id="reset">Reset board</button>
      <button class="footer__btn" id="reset-scores">Reset scores</button>
    </div>
  </div>
</main>

<!-- Game End Modal -->
<div class="modal" id="modal" hidden>
  <div class="modal__backdrop" id="modal-backdrop"></div>
  <div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal__emoji" id="modal-emoji">🏆</div>
    <h2 class="modal__title" id="modal-title">You won!</h2>
    <p class="modal__sub" id="modal-sub">Great job. Want to try again?</p>
    <div class="modal__stats" id="modal-stats">
      <div class="modal__stat">
        <div class="modal__stat-label">Streak</div>
        <div class="modal__stat-value" id="modal-streak">0</div>
      </div>
      <div class="modal__stat">
        <div class="modal__stat-label">Win Rate</div>
        <div class="modal__stat-value" id="modal-rate">0%</div>
      </div>
      <div class="modal__stat">
        <div class="modal__stat-label">Total</div>
        <div class="modal__stat-value" id="modal-total">0</div>
      </div>
    </div>
    <div class="modal__actions">
      <button class="modal__btn" id="modal-close">Close</button>
      <button class="modal__btn" id="modal-retry">Play Again</button>
    </div>
  </div>
</div>

<!-- Stats Panel -->
<div class="stats-panel" id="stats-panel" hidden>
  <div class="stats-panel__backdrop" id="stats-backdrop"></div>
  <div class="stats-panel__card">
    <div class="stats-panel__grab"></div>
    <div class="stats-panel__title">📊 Your Statistics</div>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-box__value" id="st-wins">0</div><div class="stat-box__label">Wins</div></div>
      <div class="stat-box"><div class="stat-box__value" id="st-losses">0</div><div class="stat-box__label">Losses</div></div>
      <div class="stat-box"><div class="stat-box__value" id="st-draws">0</div><div class="stat-box__label">Draws</div></div>
      <div class="stat-box"><div class="stat-box__value" id="st-rate">0%</div><div class="stat-box__label">Win Rate</div></div>
      <div class="stat-box"><div class="stat-box__value" id="st-streak">0</div><div class="stat-box__label">Streak</div></div>
      <div class="stat-box"><div class="stat-box__value" id="st-best">0</div><div class="stat-box__label">Best Streak</div></div>
    </div>
    <div class="stats-panel__title" style="margin-top:8px">🏆 Achievements</div>
    <div class="achievements" id="achievements-list"></div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
(function(){
'use strict';

// ============ CONFIG ============
const LEVELS=[
  {name:'Beginner', depth:1, randomRate:1.0},
  {name:'Trained', depth:2, randomRate:0.15},
  {name:'Tactician', depth:4, randomRate:0.10},
  {name:'Master', depth:7, randomRate:0.02},
  {name:'Impossible', depth:9, randomRate:0}
];
const THEMES=['dark','neon','retro','ocean'];
const ACHIEVEMENTS=[
  {id:'first_win', name:'First Victory', desc:'Win your first game', icon:'🥇'},
  {id:'streak_3', name:'Hat Trick', desc:'Win 3 in a row', icon:'🔥'},
  {id:'streak_5', name:'On Fire', desc:'Win 5 in a row', icon:'⚡'},
  {id:'beat_master', name:'Master Slayer', desc:'Beat Master AI', icon:'👑'},
  {id:'beat_impossible', name:'Perfect Mind', desc:'Beat Impossible AI', icon:'💎'},
  {id:'draw_master', name:'Perfect Balance', desc:'Draw vs Master AI', icon:'⚖️'},
  {id:'play_10', name:'Getting Started', desc:'Play 10 games', icon:'🎮'},
  {id:'play_50', name:'Dedicated', desc:'Play 50 games', icon:'🏅'}
];
const WIN_LINES=[
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ============ STATE ============
const STORAGE_KEY='sila_ttt_v2';
const state={
  board:Array(9).fill(null),
  human:'X', ai:'O',
  turn:'X',
  over:false, winner:null, line:null,
  thinking:false,
  level:2,
  mode:'ai', // 'ai' | 'pvp'
  scores:{X:0,O:0,D:0},
  streak:0,
  bestStreak:0,
  totalGames:0,
  achievements:new Set(),
  history:[],
  soundOn:true,
  theme:'dark',
  timer:null,
  timeLeft:0,
  lastMove:null
};

// ============ PERSISTENCE ============
function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY,JSON.stringify({
      scores:state.scores,
      streak:state.streak,
      bestStreak:state.bestStreak,
      totalGames:state.totalGames,
      achievements:[...state.achievements],
      soundOn:state.soundOn,
      theme:state.theme,
      level:state.level,
      mode:state.mode
    }));
  }catch(e){}
}
function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const d=JSON.parse(raw);
    if(d.scores) state.scores=d.scores;
    if(typeof d.streak==='number') state.streak=d.streak;
    if(typeof d.bestStreak==='number') state.bestStreak=d.bestStreak;
    if(typeof d.totalGames==='number') state.totalGames=d.totalGames;
    if(Array.isArray(d.achievements)) state.achievements=new Set(d.achievements);
    if(typeof d.soundOn==='boolean') state.soundOn=d.soundOn;
    if(d.theme) state.theme=d.theme;
    if(typeof d.level==='number') state.level=d.level;
    if(d.mode) state.mode=d.mode;
  }catch(e){}
}

// ============ DOM HELPERS ============
const $=id=>document.getElementById(id);
const boardEl=$('board'),statusText=$('status-text'),indicator=$('indicator');
const levelsList=$('levels-list');
const scoreX=$('score-x'),scoreO=$('score-o'),scoreD=$('score-d');
const modal=$('modal');
const timerBar=$('timer-bar'),timerFill=$('timer-fill');

// ============ SOUND (Web Audio) ============
let audioCtx=null;
function beep(freq,duration,type='sine',vol=0.08){
  if(!state.soundOn) return;
  try{
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.type=type;osc.frequency.value=freq;
    gain.gain.setValueAtTime(vol,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+duration);
    osc.connect(gain);gain.connect(audioCtx.destination);
    osc.start();osc.stop(audioCtx.currentTime+duration);
  }catch(e){}
}
const sounds={
  placeX:()=>beep(660,0.1,'triangle'),
  placeO:()=>beep(440,0.1,'triangle'),
  win:()=>{beep(660,0.12);setTimeout(()=>beep(880,0.12),120);setTimeout(()=>beep(1100,0.2),240);},
  lose:()=>{beep(300,0.2,'sawtooth');setTimeout(()=>beep(200,0.3,'sawtooth'),150);},
  draw:()=>{beep(500,0.15);setTimeout(()=>beep(400,0.15),150);},
  click:()=>beep(800,0.03,'square',0.04),
  achievement:()=>{beep(1000,0.1);setTimeout(()=>beep(1300,0.1),100);setTimeout(()=>beep(1600,0.2),200);}
};

// ============ TOAST ============
let toastTimer=null;
function showToast(msg){
  const t=$('toast');
  t.textContent=msg;
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('is-show'),2200);
}

// ============ BUILD UI ============
function buildBoard(){
  boardEl.innerHTML='';
  for(let i=0;i<9;i++){
    const c=document.createElement('button');
    c.className='cell';
    c.setAttribute('role','gridcell');
    c.setAttribute('aria-label','Cell '+(i+1));
    c.dataset.idx=i;
    c.addEventListener('click',()=>onCell(i));
    boardEl.appendChild(c);
  }
}
function buildLevels(){
  levelsList.innerHTML='';
  LEVELS.forEach((lvl,i)=>{
    const b=document.createElement('button');
    b.className='level'+(i===state.level?' is-active':'');
    b.setAttribute('role','radio');
    b.setAttribute('aria-checked',i===state.level?'true':'false');
    b.textContent=lvl.name;
    b.addEventListener('click',()=>setLevel(i));
    levelsList.appendChild(b);
  });
}
function buildAchievements(){
  const list=$('achievements-list');
  list.innerHTML='';
  ACHIEVEMENTS.forEach(a=>{
    const unlocked=state.achievements.has(a.id);
    const el=document.createElement('div');
    el.className='achievement'+(unlocked?' is-unlocked':'');
    el.innerHTML=`
      <div class="achievement__icon">${unlocked?a.icon:'🔒'}</div>
      <div class="achievement__info">
        <div class="achievement__name">${a.name}</div>
        <div class="achievement__desc">${a.desc}</div>
      </div>`;
    list.appendChild(el);
  });
}

// ============ THEME ============
function applyTheme(){
  document.documentElement.setAttribute('data-theme',state.theme);
}
function cycleTheme(){
  const idx=THEMES.indexOf(state.theme);
  state.theme=THEMES[(idx+1)%THEMES.length];
  applyTheme();
  saveState();
  showToast('Theme: '+state.theme.charAt(0).toUpperCase()+state.theme.slice(1));
  sounds.click();
}

// ============ LEVEL ============
function setLevel(i){
  state.level=i;
  document.querySelectorAll('.level').forEach((el,idx)=>{
    const on=idx===i;
    el.classList.toggle('is-active',on);
    el.setAttribute('aria-checked',on?'true':'false');
  });
  saveState();
  resetBoard();
}

// ============ MODE ============
function toggleMode(){
  state.mode=state.mode==='ai'?'pvp':'ai';
  updateModeUI();
  saveState();
  resetBoard();
  showToast(state.mode==='ai'?'VS AI mode':'Player vs Player');
  sounds.click();
}
function updateModeUI(){
  const isAI=state.mode==='ai';
  $('mode-label').textContent=isAI?'VS AI':'VS PLAYER';
  $('mode-btn-text').textContent=isAI?'PvP':'AI';
  document.querySelector('.levels').style.display=isAI?'block':'none';
  // In PvP, X is always human, O is Player 2
}

// ============ TIMER (30s per turn) ============
const TURN_TIME=30;
function startTimer(){
  stopTimer();
  state.timeLeft=TURN_TIME;
  timerBar.classList.add('is-active');
  timerBar.classList.remove('is-warning');
  timerFill.style.width='100%';
  state.timer=setInterval(()=>{
    state.timeLeft-=0.1;
    const pct=Math.max(0,state.timeLeft/TURN_TIME*100);
    timerFill.style.width=pct+'%';
    if(state.timeLeft<=5) timerBar.classList.add('is-warning');
    if(state.timeLeft<=0){
      stopTimer();
      handleTimeout();
    }
  },100);
}
function stopTimer(){
  if(state.timer){clearInterval(state.timer);state.timer=null;}
  timerBar.classList.remove('is-active');
  timerFill.style.width='100%';
}
function handleTimeout(){
  if(state.over||state.thinking) return;
  // In AI mode: player skips → auto-random move
  if(state.mode==='ai'&&state.turn===state.human){
    const empty=state.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
    if(empty.length){
      const m=empty[Math.floor(Math.random()*empty.length)];
      showToast('⏰ Time up! Auto-played');
      makeMove(m,state.human);
      if(!state.over){
        state.turn=state.ai;
        state.thinking=true;
        render();
        setTimeout(aiMove,500);
      }
    }
  } else if(state.mode==='pvp'){
    // PvP: switch turn
    showToast('⏰ Time up! Turn skipped');
    state.turn=state.turn==='X'?'O':'X';
    render();
    startTimer();
  }
}

// ============ RENDER ============
function markSVG(v){
  if(v==='X'){
    return '<svg class="mark__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><path d="M 22 22 L 78 78"/><path d="M 78 22 L 22 78"/></svg>';
  }
  return '<svg class="mark__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="50" r="30"/></svg>';
}
function renderCell(i){
  const cell=boardEl.children[i];
  const v=state.board[i];
  const existing=cell.querySelector('.mark');
  if(v){
    if(!existing){
      const m=document.createElement('div');
      m.className='mark mark--'+v.toLowerCase();
      m.innerHTML=markSVG(v);
      cell.appendChild(m);
    }
    cell.disabled=true;
  } else {
    if(existing) existing.remove();
    cell.disabled=state.over||state.thinking||(state.mode==='ai'&&state.turn!==state.human);
  }
  const isWin=!!(state.line&&state.line.includes(i));
  cell.classList.toggle('is-winning',isWin);
  cell.classList.toggle('is-winning-x',isWin&&state.winner==='X');
  cell.classList.remove('is-hint');
}
function render(){
  for(let i=0;i<9;i++) renderCell(i);
  if(state.over){
    if(state.winner==='X'){statusText.textContent=state.mode==='ai'?'You won!':'X wins!';indicator.className='status__indicator';}
    else if(state.winner==='O'){statusText.textContent=state.mode==='ai'?'AI won!':'O wins!';indicator.className='status__indicator is-o';}
    else {statusText.textContent='Draw';indicator.className='status__indicator';}
  } else if(state.thinking){
    statusText.textContent='AI is thinking…';
    indicator.className='status__indicator is-o is-thinking';
  } else {
    const label=state.mode==='ai'
      ?(state.turn===state.human?'Your turn':'AI turn')
      :(state.turn==='X'?'Player X turn':'Player O turn');
    statusText.textContent=label;
    indicator.className='status__indicator'+(state.turn==='O'?' is-o':'');
  }
  scoreX.textContent=state.scores.X;
  scoreO.textContent=state.scores.O;
  scoreD.textContent=state.scores.D;
  $('btn-undo').disabled=state.history.length===0||state.over||state.thinking;
}
function updateStatsUI(){
  $('st-wins').textContent=state.scores.X;
  $('st-losses').textContent=state.scores.O;
  $('st-draws').textContent=state.scores.D;
  const total=state.totalGames||1;
  $('st-rate').textContent=Math.round(state.scores.X/total*100)+'%';
  $('st-streak').textContent=state.streak;
  $('st-best').textContent=state.bestStreak;
}

// ============ GAME FLOW ============
function onCell(i){
  if(state.over||state.thinking) return;
  if(state.board[i]!==null) return;
  if(state.mode==='ai'&&state.turn!==state.human) return;
  makeMove(i,state.turn);
}
function makeMove(i,player){
  state.board[i]=player;
  state.history.push({i,player});
  state.lastMove=i;
  renderCell(i);
  if(player==='X') sounds.placeX(); else sounds.placeO();
  const r=checkWinner(state.board);
  if(r){endGame(r);return;}
  if(state.mode==='ai'){
    if(player===state.human){
      state.turn=state.ai;
      state.thinking=true;
      render();
      stopTimer();
      setTimeout(aiMove,380+Math.random()*320);
    } else {
      state.turn=state.human;
      state.thinking=false;
      render();
      startTimer();
    }
  } else {
    state.turn=player==='X'?'O':'X';
    render();
    startTimer();
  }
}
function aiMove(){
  if(!state.thinking) return;
  const m=chooseAIMove();
  if(m===null){state.thinking=false;render();return;}
  state.board[m]=state.ai;
  state.history.push({i:m,player:state.ai});
  state.lastMove=m;
  renderCell(m);
  sounds.placeO();
  state.thinking=false;
  const r=checkWinner(state.board);
  if(r){endGame(r);}
  else {state.turn=state.human;render();startTimer();}
}

// ============ AI ============
function chooseAIMove(){
  const empty=state.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
  if(!empty.length) return null;
  const L=state.level;
  if(L===0) return empty[Math.floor(Math.random()*empty.length)];
  // Perfect endgame: check immediate wins/blocks first
  const win=findImmediate(state.board,state.ai);
  if(win!==null) return win;
  const block=findImmediate(state.board,state.human);
  if(block!==null) return block;
  if(L===1){
    if(state.board[4]===null) return 4;
    const corners=[0,2,6,8].filter(i=>state.board[i]===null);
    if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
    return empty[Math.floor(Math.random()*empty.length)];
  }
  const cfg=LEVELS[L];
  if(cfg.randomRate>0&&Math.random()<cfg.randomRate) return empty[Math.floor(Math.random()*empty.length)];
  return minimaxMove(state.board,state.ai,cfg.depth);
}
function findImmediate(board,player){
  for(const line of WIN_LINES){
    const cells=[board[line[0]],board[line[1]],board[line[2]]];
    const c=cells.filter(v=>v===player).length;
    const e=cells.filter(v=>v===null).length;
    if(c===2&&e===1) return line[cells.indexOf(null)];
  }
  return null;
}
function minimaxMove(board,player,maxDepth){
  let best=-Infinity,moves=[];
  for(let i=0;i<9;i++){
    if(board[i]!==null) continue;
    board[i]=player;
    const s=minimax(board,player==='O'?'X':'O',0,maxDepth,-Infinity,Infinity);
    board[i]=null;
    if(s>best){best=s;moves=[i];}
    else if(s===best){moves.push(i);}
  }
  return moves[Math.floor(Math.random()*moves.length)];
}
function minimax(board,current,depth,maxDepth,alpha,beta){
  const r=checkWinner(board);
  if(r){
    if(r.winner==='O') return 10-depth;
    if(r.winner==='X') return depth-10;
    return 0;
  }
  if(depth>=maxDepth) return 0;
  const isMax=current==='O';
  let best=isMax?-Infinity:Infinity;
  const empty=[];
  for(let i=0;i<9;i++) if(board[i]===null) empty.push(i);
  // Move ordering: center, corners, edges
  empty.sort((a,b)=>{
    const score=x=>x===4?2:(x%2===0?1:0);
    return score(b)-score(a);
  });
  for(const i of empty){
    board[i]=current;
    const s=minimax(board,current==='O'?'X':'O',depth+1,maxDepth,alpha,beta);
    board[i]=null;
    if(isMax){best=Math.max(best,s);alpha=Math.max(alpha,s);}
    else {best=Math.min(best,s);beta=Math.min(beta,s);}
    if(beta<=alpha) break;
  }
  return best;
}
function checkWinner(board){
  for(const line of WIN_LINES){
    const [a,b,c]=line;
    if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
      return {winner:board[a],line};
    }
  }
  if(board.every(v=>v!==null)) return {winner:'D',line:null};
  return null;
}

// ============ END GAME ============
function endGame(r){
  stopTimer();
  state.over=true;
  state.winner=r.winner;
  state.line=r.line;
  state.totalGames++;
  const humanWon=(r.winner==='X');
  if(r.winner==='X'){state.scores.X++;state.streak++;sounds.win();}
  else if(r.winner==='O'){state.scores.O++;state.streak=0;sounds.lose();}
  else {state.scores.D++;state.streak=0;sounds.draw();}
  if(state.streak>state.bestStreak) state.bestStreak=state.streak;
  checkAchievements(r.winner);
  saveState();
  render();
  if(r.line){
    setTimeout(()=>drawWinningLine(r.line,r.winner),220);
    setTimeout(()=>showModal(r.winner),950);
  } else {
    setTimeout(()=>showModal(r.winner),400);
  }
}

// ============ ACHIEVEMENTS ============
function unlock(id){
  if(state.achievements.has(id)) return;
  state.achievements.add(id);
  saveState();
  buildAchievements();
  const a=ACHIEVEMENTS.find(x=>x.id===id);
  if(a){
    showToast('🏆 '+a.name+' unlocked!');
    sounds.achievement();
  }
}
function checkAchievements(winner){
  if(winner==='X'){
    unlock('first_win');
    if(state.streak>=3) unlock('streak_3');
    if(state.streak>=5) unlock('streak_5');
    if(state.level>=3) unlock('beat_master');
    if(state.level===4) unlock('beat_impossible');
  }
  if(winner==='D'&&state.level>=3) unlock('draw_master');
  if(state.totalGames>=10) unlock('play_10');
  if(state.totalGames>=50) unlock('play_50');
}

// ============ MODAL ============
function showModal(winner){
  const title=$('modal-title'),sub=$('modal-sub'),emoji=$('modal-emoji');
  if(winner==='X'){
    emoji.textContent='🏆';title.textContent=state.mode==='ai'?'You won!':'X wins!';
    title.className='modal__title is-win';sub.textContent='Great job. Want to try again?';
  } else if(winner==='O'){
    emoji.textContent=state.mode==='ai'?'🤖':'⚪';title.textContent=state.mode==='ai'?'AI won!':'O wins!';
    title.className='modal__title is-o';sub.textContent='The opponent played better this time.';
  } else {
    emoji.textContent='🤝';title.textContent='Draw';title.className='modal__title';
    sub.textContent='It is a tie. Play another round?';
  }
  const total=state.totalGames||1;
  $('modal-streak').textContent=state.streak;
  $('modal-rate').textContent=Math.round(state.scores.X/total*100)+'%';
  $('modal-total').textContent=state.totalGames;
  modal.hidden=false;
  void modal.offsetWidth;
  modal.classList.add('is-open');
  setTimeout(()=>$('modal-retry').focus(),80);
}
function hideModal(){
  modal.classList.remove('is-open');
  setTimeout(()=>{modal.hidden=true;},350);
}

// ============ STATS PANEL ============
function openStats(){
  updateStatsUI();
  buildAchievements();
  $('stats-panel').hidden=false;
  void $('stats-panel').offsetWidth;
  $('stats-panel').classList.add('is-open');
}
function closeStats(){
  $('stats-panel').classList.remove('is-open');
  setTimeout(()=>{$('stats-panel').hidden=true;},350);
}

// ============ WINNING LINE ============
function drawWinningLine(line,winner){
  const rect=boardEl.getBoundingClientRect();
  const s=boardEl.children[line[0]].getBoundingClientRect();
  const e=boardEl.children[line[2]].getBoundingClientRect();
  const x1=s.left+s.width/2-rect.left;
  const y1=s.top+s.height/2-rect.top;
  const x2=e.left+e.width/2-rect.left;
  const y2=e.top+e.height/2-rect.top;
  const len=Math.hypot(x2-x1,y2-y1);
  const ang=Math.atan2(y2-y1,x2-x1);
  const el=document.createElement('div');
  el.className='winning-line'+(winner==='X'?' is-x':'');
  el.style.left=x1+'px';el.style.top=y1+'px';el.style.width=len+'px';
  el.style.transform='translateY(-50%) rotate('+ang+'rad) scaleX(0)';
  el.style.transition='transform .55s cubic-bezier(0.65,0,0.35,1)';
  boardEl.appendChild(el);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    el.style.transform='translateY(-50%) rotate('+ang+'rad) scaleX(1)';
  }));
}

// ============ UNDO ============
function undo(){
  if(state.history.length===0||state.over||state.thinking) return;
  // In AI mode, undo both player and AI moves
  const undos=state.mode==='ai'?Math.min(2,state.history.length):1;
  for(let k=0;k<undos;k++){
    const last=state.history.pop();
    if(!last) break;
    state.board[last.i]=null;
    const cell=boardEl.children[last.i];
    const mark=cell.querySelector('.mark');
    if(mark) mark.remove();
  }
  state.over=false;state.winner=null;state.line=null;
  // Clear winning line
  const wl=boardEl.querySelector('.winning-line');
  if(wl) wl.remove();
  if(state.mode==='ai') state.turn=state.human;
  else state.turn=state.history.length%2===0?'X':'O';
  stopTimer();
  render();
  if(!state.over) startTimer();
  sounds.click();
  showToast('↩️ Move undone');
}

// ============ HINT ============
function showHint(){
  if(state.over||state.thinking) return;
  if(state.mode==='ai'&&state.turn!==state.human) return;
  const empty=state.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
  if(!empty.length) return;
  // Use minimax to find best move for current player
  const current=state.turn;
  let best=-Infinity,bestMove=empty[0];
  for(const i of empty){
    state.board[i]=current;
    const s=minimax(state.board,current==='X'?'O':'X',0,5,-Infinity,Infinity);
    state.board[i]=null;
    if(s>best){best=s;bestMove=i;}
  }
  const cell=boardEl.children[bestMove];
  cell.classList.add('is-hint');
  sounds.click();
  showToast('💡 Try the highlighted cell');
  setTimeout(()=>cell.classList.remove('is-hint'),2500);
}

// ============ RESET ============
function resetBoard(){
  hideModal();
  stopTimer();
  state.board=Array(9).fill(null);
  state.turn='X';
  state.over=false;state.winner=null;state.line=null;
  state.thinking=false;
  state.history=[];
  state.lastMove=null;
  const wl=boardEl.querySelector('.winning-line');
  if(wl) wl.remove();
  render();
  startTimer();
}
function resetScores(){
  state.scores={X:0,O:0,D:0};
  state.streak=0;state.bestStreak=0;state.totalGames=0;
  saveState();
  render();
  updateStatsUI();
  showToast('🔄 Scores reset');
}

// ============ EVENT LISTENERS ============
$('reset').addEventListener('click',()=>{sounds.click();resetBoard();});
$('reset-scores').addEventListener('click',()=>{sounds.click();resetScores();});
$('modal-retry').addEventListener('click',()=>{sounds.click();resetBoard();});
$('modal-close').addEventListener('click',()=>{sounds.click();hideModal();});
$('modal-backdrop').addEventListener('click',()=>{sounds.click();hideModal();});
$('btn-undo').addEventListener('click',undo);
$('btn-hint').addEventListener('click',showHint);
$('btn-mode').addEventListener('click',toggleMode);
$('btn-theme').addEventListener('click',cycleTheme);
$('btn-sound').addEventListener('click',()=>{
  state.soundOn=!state.soundOn;
  saveState();
  $('btn-sound').textContent=state.soundOn?'🔊':'🔇';
  $('btn-sound').classList.toggle('is-active',!state.soundOn);
  if(state.soundOn) sounds.click();
  showToast(state.soundOn?'🔊 Sound on':'🔇 Sound off');
});
$('btn-stats').addEventListener('click',()=>{sounds.click();openStats();});
$('stats-backdrop').addEventListener('click',closeStats);

document.addEventListener('keydown',(e)=>{
  if(modal.classList.contains('is-open')){
    if(e.key==='Escape'){e.preventDefault();hideModal();}
    if(e.key==='Enter'){e.preventDefault();resetBoard();}
    return;
  }
  if($('stats-panel').classList.contains('is-open')){
    if(e.key==='Escape'){e.preventDefault();closeStats();}
    return;
  }
  // Keyboard shortcuts
  if(e.key==='u'||e.key==='U'){undo();}
  if(e.key==='h'||e.key==='H'){showHint();}
  if(e.key==='r'||e.key==='R'){resetBoard();}
  // Number keys 1-9 to place
  if(e.key>='1'&&e.key<='9'){
    const idx=parseInt(e.key)-1;
    onCell(idx);
  }
});

// ============ INIT ============
loadState();
applyTheme();
buildBoard();
buildLevels();
updateModeUI();
$('btn-sound').textContent=state.soundOn?'🔊':'🔇';
$('btn-sound').classList.toggle('is-active',!state.soundOn);
render();
updateStatsUI();
startTimer();

})();
</script>
</body>
</html>
`;

// ============================================
// BOT COMMAND IMPLEMENTATION
// ============================================
export default {
  name: 'ttt2',
  alias: ['ttt', 'xox', 'tictac'],
  description: 'Play advanced TicTacToe vs AI (5 levels, themes, stats, achievements)',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    try {
      const responseId = 'sila-tictactoe-' + Date.now();

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
                  messageText: "❌⭕ TicTacToe PRO — 5 AI Levels"
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
                          "payload": tictactoeHtml,
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
      console.error('[TICTACTOE]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      }, { quoted: msg });
    }
  }
};