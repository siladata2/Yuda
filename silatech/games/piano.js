
import { randomUUID } from 'crypto';

// ============================================
// SILA PIANO TILES V2 — MUSIC EDITION
// ============================================

const pianoHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<style>
:root{
--accent:#00a884;
--bg:#080d12;
--card:#111b21;
--ink:#e9edef;
--muted:#8696a0;
--line:#2a3942;
--tile:#e9edef;
--danger:#ef4444;
--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
}

*{
margin:0;
padding:0;
box-sizing:border-box;
-webkit-tap-highlight-color:transparent;
user-select:none;
}

html,body{
background:transparent;
color:var(--ink);
font-family:var(--sys);
min-height:100vh;
overflow-x:hidden;
touch-action:manipulation;
}

.stage{
min-height:100vh;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
padding:20px 12px;
}

.card{
width:100%;
max-width:380px;
}

.header{
display:flex;
align-items:center;
justify-content:space-between;
padding-bottom:14px;
margin-bottom:14px;
border-bottom:1px solid var(--line);
}

.title{
font-size:18px;
font-weight:700;
}

.sub{
font-size:11px;
color:var(--muted);
}

.stats{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:8px;
margin-bottom:14px;
}

.stat{
background:rgba(42,57,66,.3);
border:1px solid var(--line);
border-radius:10px;
padding:10px 6px;
text-align:center;
}

.stat-label{
font-size:10px;
color:var(--muted);
margin-bottom:4px;
}

.stat-value{
font-size:18px;
font-weight:700;
}

.game{
position:relative;
width:100%;
aspect-ratio:4/5;
max-height:520px;
overflow:hidden;
border-radius:12px;
border:1px solid var(--line);
background:var(--bg);
touch-action:manipulation;
}

.lanes{
position:absolute;
inset:0;
display:grid;
grid-template-columns:repeat(4,1fr);
}

.lane{
border-right:1px solid rgba(55,66,72,.6);
}

.lane:last-child{
border-right:none;
}

.tiles{
position:absolute;
inset:0;
overflow:hidden;
}

.tile{
position:absolute;
height:110px;
background:linear-gradient(180deg,#f4f6f7,#aebbc2);
border:1px solid rgba(255,255,255,.3);
border-radius:5px;
box-shadow:0 4px 12px rgba(0,0,0,.3);
cursor:pointer;
touch-action:manipulation;
}

.tile.hit{
background:var(--accent);
opacity:.75;
}

.tile.missed{
background:var(--danger);
}

.hit-zone{
position:absolute;
bottom:0;
left:0;
right:0;
height:14%;
border-top:2px solid rgba(0,168,132,.8);
background:linear-gradient(0deg,rgba(0,168,132,.1),transparent);
pointer-events:none;
}

.progress{
position:absolute;
top:0;
left:0;
height:3px;
width:100%;
background:var(--accent);
z-index:5;
}

.speed-label{
position:absolute;
top:12px;
right:12px;
z-index:10;
font-size:10px;
padding:6px 9px;
border-radius:15px;
background:rgba(0,0,0,.5);
color:var(--ink);
}

.controls{
margin-top:14px;
}

.label{
font-size:11px;
color:var(--muted);
margin-bottom:8px;
}

.levels{
display:flex;
gap:8px;
overflow-x:auto;
scrollbar-width:none;
padding:2px 2px 6px;
}

.levels::-webkit-scrollbar{
display:none;
}

.level{
flex-shrink:0;
padding:10px 16px;
border-radius:20px;
border:1px solid var(--line);
background:transparent;
color:var(--muted);
font-family:inherit;
font-size:12px;
cursor:pointer;
}

.level.active{
background:var(--accent);
color:#06110f;
border-color:var(--accent);
font-weight:700;
}

.actions{
display:flex;
gap:8px;
margin-top:12px;
}

.btn{
flex:1;
border:1px solid var(--line);
background:transparent;
color:var(--ink);
border-radius:9px;
padding:12px;
font-family:inherit;
font-size:13px;
font-weight:600;
cursor:pointer;
}

.btn.primary{
background:var(--accent);
color:#06110f;
border-color:var(--accent);
}

.btn:disabled{
opacity:.6;
cursor:default;
}

.message{
text-align:center;
color:var(--muted);
font-size:11px;
margin-top:10px;
}

.modal{
position:fixed;
inset:0;
z-index:50;
display:flex;
align-items:center;
justify-content:center;
padding:22px;
background:rgba(8,13,18,.8);
opacity:0;
pointer-events:none;
transition:opacity .2s ease;
}

.modal.open{
opacity:1;
pointer-events:auto;
}

.modal-card{
width:100%;
max-width:310px;
background:#2a3942;
border-radius:14px;
padding:26px 22px 0;
text-align:center;
overflow:hidden;
}

.modal-title{
font-size:22px;
font-weight:800;
margin-bottom:8px;
}

.modal-sub{
font-size:13px;
line-height:1.5;
color:#aebac1;
margin-bottom:20px;
}

.modal-btn{
width:100%;
border:none;
border-top:1px solid #374248;
background:transparent;
color:var(--accent);
padding:15px;
font-family:inherit;
font-size:15px;
font-weight:700;
cursor:pointer;
}
</style>
</head>

<body>

<main class="stage">
<div class="card">

<div class="header">
<div class="title">SILA Piano Tiles</div>
<div class="sub">MUSIC EDITION</div>
</div>

<div class="stats">
<div class="stat">
<div class="stat-label">SCORE</div>
<div class="stat-value" id="score">0</div>
</div>

<div class="stat">
<div class="stat-label">COMBO</div>
<div class="stat-value" id="combo">0</div>
</div>

<div class="stat">
<div class="stat-label">SPEED</div>
<div class="stat-value" id="speed">1.0x</div>
</div>
</div>

<div class="game" id="game">

<div class="progress" id="progress"></div>

<div class="speed-label" id="speed-label">1.0x SPEED</div>

<div class="lanes">
<div class="lane"></div>
<div class="lane"></div>
<div class="lane"></div>
<div class="lane"></div>
</div>

<div class="tiles" id="tiles"></div>

<div class="hit-zone"></div>

</div>

<div class="controls">

<div class="label">DIFFICULTY</div>

<div class="levels" id="levels">
<button class="level active" data-level="0">Easy</button>
<button class="level" data-level="1">Normal</button>
<button class="level" data-level="2">Hard</button>
<button class="level" data-level="3">Master</button>
</div>

</div>

<div class="actions">
<button class="btn primary" id="start">Start Game</button>
<button class="btn" id="reset">Reset</button>
</div>

<div class="message" id="message">
Press Start Game to begin
</div>

</div>
</main>

<div class="modal" id="modal">

<div class="modal-card">

<div class="modal-title" id="modal-title">Game Over</div>

<div class="modal-sub" id="modal-sub"></div>

<button class="modal-btn" id="retry">Play Again</button>

</div>

</div>

<script>
(function(){

'use strict';

// ============================================
// LICENSED MUSIC CONFIGURATION
// ============================================

// Replace this with your own licensed audio URL.
const MUSIC_URL='https://h.uguu.se/EMksfecC.mp3';

const $=id=>document.getElementById(id);

const game=$('game');
const tilesEl=$('tiles');
const scoreEl=$('score');
const comboEl=$('combo');
const speedEl=$('speed');
const speedLabel=$('speed-label');
const progressEl=$('progress');
const messageEl=$('message');
const modal=$('modal');
const modalTitle=$('modal-title');
const modalSub=$('modal-sub');
const startBtn=$('start');

let music=null;

// ============================================
// AUDIO ENGINE
// ============================================

let audioContext=null;
let masterGain=null;

const notes=[
261.63,293.66,329.63,349.23,
392.00,440.00,493.88,523.25
];

function initAudio(){

if(!audioContext){
audioContext=new (window.AudioContext||window.webkitAudioContext)();

masterGain=audioContext.createGain();
masterGain.gain.value=0.16;
masterGain.connect(audioContext.destination);
}

if(audioContext.state==='suspended'){
audioContext.resume();
}

}

function playPianoNote(index){

if(!audioContext||!masterGain)return;

const now=audioContext.currentTime;
const oscillator=audioContext.createOscillator();
const gain=audioContext.createGain();

oscillator.type='triangle';
oscillator.frequency.value=notes[index%notes.length];

gain.gain.setValueAtTime(.0001,now);
gain.gain.exponentialRampToValueAtTime(.20,now+.008);
gain.gain.exponentialRampToValueAtTime(.0001,now+.35);

oscillator.connect(gain);
gain.connect(masterGain);

oscillator.start(now);
oscillator.stop(now+.4);

}

// ============================================
// GAME STATE
// ============================================

const LEVELS=[
{name:'Easy',baseSpeed:155,interval:800,duration:70000},
{name:'Normal',baseSpeed:190,interval:680,duration:60000},
{name:'Hard',baseSpeed:235,interval:560,duration:55000},
{name:'Master',baseSpeed:280,interval:440,duration:50000}
];

const state={
running:false,
level:0,
score:0,
combo:0,
best:0,
misses:0,
maxMisses:3,
elapsed:0,
spawnTimer:0,
lastTime:0,
animationId:null,
tiles:[],
tileId:0,
music:null,
musicStarted:false
};

// ============================================
// MUSIC
// ============================================

function prepareMusic(){

if(!MUSIC_URL||MUSIC_URL.includes('YOUR_LICENSED')){
return;
}

if(!music){
music=new Audio(MUSIC_URL);
music.preload='auto';
music.loop=true;
music.volume=.32;
music.setAttribute('playsinline','');
}

}

function startMusic(){

prepareMusic();

if(!music)return;

const result=music.play();

if(result&&typeof result.catch==='function'){
result.catch(()=>{
messageEl.textContent='Tap Start again to enable music';
});
}

}

function stopMusic(){

if(!music)return;

music.pause();
music.currentTime=0;

}

// ============================================
// STATS
// ============================================

function updateStats(){

scoreEl.textContent=state.score;
comboEl.textContent=state.combo;

const multiplier=getSpeedMultiplier();

speedEl.textContent=multiplier.toFixed(1)+'x';
speedLabel.textContent=multiplier.toFixed(1)+'x SPEED';

}

// ============================================
// DYNAMIC SPEED
// ============================================

function getSpeedMultiplier(){

// Speed increases gradually as the song progresses.
const progress=state.elapsed/LEVELS[state.level].duration;

const multiplier=1+Math.min(progress,1)*1.8;

return multiplier;

}

function getCurrentSpeed(){

return LEVELS[state.level].baseSpeed*getSpeedMultiplier();

}

function getCurrentInterval(){

const base=LEVELS[state.level].interval;

// Spawn interval decreases as speed rises.
return Math.max(220,base/getSpeedMultiplier());

}

// ============================================
// TILE SYSTEM
// ============================================

function clearTiles(){

tilesEl.innerHTML='';
state.tiles=[];

}

function createTile(){

const lane=Math.floor(Math.random()*4);

const tileEl=document.createElement('button');

tileEl.className='tile';
tileEl.type='button';
tileEl.setAttribute('aria-label','Piano tile');

tileEl.style.left=(lane*25+1)+'%';
tileEl.style.width='23%';

const tile={
id:state.tileId++,
lane,
y:-115,
hit:false,
missed:false,
el:tileEl,
note:Math.floor(Math.random()*notes.length)
};

tileEl.addEventListener('pointerdown',(e)=>{
e.preventDefault();
hitTile(tile);
});

tilesEl.appendChild(tileEl);
state.tiles.push(tile);

renderTile(tile);

}

function renderTile(tile){

tile.el.style.transform='translateY('+tile.y+'px)';

}

// ============================================
// HIT / MISS
// ============================================

function hitTile(tile){

if(!state.running||tile.hit||tile.missed)return;

const rect=game.getBoundingClientRect();
const zoneTop=rect.height*.86;

// Prevent tapping tiles that are too high.
if(tile.y+110<zoneTop-95)return;

tile.hit=true;
tile.el.classList.add('hit');

playPianoNote(tile.note);

state.score+=10+state.combo;
state.combo++;
state.best=Math.max(state.best,state.combo);

updateStats();

setTimeout(()=>{
if(tile.el.parentNode)tile.el.remove();
},70);

}

function missTile(tile){

if(tile.hit||tile.missed)return;

tile.missed=true;
tile.el.classList.add('missed');

state.combo=0;
state.misses++;

updateStats();

setTimeout(()=>{
if(tile.el.parentNode)tile.el.remove();
},80);

if(state.misses>=state.maxMisses){
endGame('miss');
}

}

// ============================================
// GAME LOOP
// ============================================

function updateTiles(delta){

const bottom=game.getBoundingClientRect().height;
const speed=getCurrentSpeed();

for(let i=state.tiles.length-1;i>=0;i--){

const tile=state.tiles[i];

if(tile.hit||tile.missed){
state.tiles.splice(i,1);
continue;
}

tile.y+=speed*delta/1000;

renderTile(tile);

if(tile.y>bottom){

missTile(tile);
state.tiles.splice(i,1);

}

}

}

function loop(timestamp){

if(!state.running)return;

const delta=Math.min(timestamp-state.lastTime,50);

state.lastTime=timestamp;
state.elapsed+=delta;
state.spawnTimer+=delta;

if(state.spawnTimer>=getCurrentInterval()){

state.spawnTimer=0;
createTile();

}

updateTiles(delta);

const duration=LEVELS[state.level].duration;
const remaining=Math.max(0,duration-state.elapsed);

progressEl.style.width=(remaining/duration*100)+'%';

updateStats();

if(state.elapsed>=duration){

endGame('time');
return;

}

state.animationId=requestAnimationFrame(loop);

}

// ============================================
// START / END / RESET
// ============================================

function startGame(){

if(state.running)return;

closeModal();
clearTiles();

initAudio();
startMusic();

state.running=true;
state.score=0;
state.combo=0;
state.best=0;
state.misses=0;
state.elapsed=0;
state.spawnTimer=0;
state.lastTime=performance.now();

startBtn.textContent='Playing...';
startBtn.disabled=true;

messageEl.textContent='Tap the tiles with the music';

progressEl.style.width='100%';

updateStats();

createTile();

state.animationId=requestAnimationFrame(loop);

}

function endGame(reason){

if(!state.running)return;

state.running=false;

if(state.animationId){
cancelAnimationFrame(state.animationId);
state.animationId=null;
}

stopMusic();

startBtn.disabled=false;
startBtn.textContent='Start Game';

modalTitle.textContent=reason==='time'
?'Song Complete!'
:'Game Over';

modalSub.textContent=
'Score: '+state.score+
' | Best Combo: '+state.best;

modal.classList.add('open');

messageEl.textContent='Round finished';

}

function closeModal(){

modal.classList.remove('open');

}

function resetGame(){

if(state.animationId){
cancelAnimationFrame(state.animationId);
state.animationId=null;
}

stopMusic();

state.running=false;
state.score=0;
state.combo=0;
state.best=0;
state.misses=0;
state.elapsed=0;
state.spawnTimer=0;

clearTiles();

startBtn.disabled=false;
startBtn.textContent='Start Game';

progressEl.style.width='100%';

messageEl.textContent='Press Start Game to begin';

closeModal();
updateStats();

}

// ============================================
// EVENTS
// ============================================

document.querySelectorAll('.level').forEach(el=>{

el.addEventListener('click',()=>{

if(state.running)return;

state.level=Number(el.dataset.level);

document.querySelectorAll('.level').forEach(btn=>{
btn.classList.toggle('active',btn===el);
});

messageEl.textContent='Difficulty: '+LEVELS[state.level].name;

});

});

startBtn.addEventListener('click',startGame);

$('reset').addEventListener('click',resetGame);

$('retry').addEventListener('click',()=>{
closeModal();
startGame();
});

modal.addEventListener('click',(e)=>{
if(e.target===modal)closeModal();
});

updateStats();

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
  alias: ['pianotiles', 'piano-game', 'tiles'],
  description: 'Play SILA Piano Tiles with licensed music',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {

    const sender=msg.key.remoteJid;

    try{

      const responseId='sila-piano-'+Date.now()+'-'+randomUUID();

      const content={
        messageContextInfo:{
          deviceListMetadata:{},
          deviceListMetadataVersion:2,
          messageSecret:"0cCzjnQ5ERoqM2QrQ7KjmMfxsyeWYu+61/chr2wioyE=",
          botMetadata:{
            messageDisclaimerText:"",
            botResponseId:responseId
          }
        },

        botForwardedMessage:{
          message:{
            richResponseMessage:{
              messageType:1,

              submessages:[
                {
                  messageType:2,
                  messageText:"🎹 SILA Piano Tiles — Music Edition"
                }
              ],

              unifiedResponse:{
                data:Buffer.from(JSON.stringify({
                  response_id:responseId,

                  sections:[
                    {
                      view_model:{
                        primitive:{
                          "__typename":"GenAIaeacdsnwHtmlPrimitive",
                          payload:pianoHtml,
                          trusted_sources:["sila-tech"]
                        },

                        "__typename":"GenAISingleLayoutViewModel"
                      }
                    }
                  ]
                })).toString('base64')
              },

              contextInfo:{
                forwardingScore:1,
                isForwarded:true,

                forwardedAiBotMessageInfo:{
                  botJid:"867051314767696@bot"
                },

                forwardOrigin:4
              }

            }
          }
        }
      };

      await sock.relayMessage(sender,content,{});

    }catch(error){

      console.error('[PIANO]',error);

      await sock.sendMessage(sender,{
        text:'✖ Error: '+(error?.message||error)
      },{quoted:msg});

    }

  }
};
