
import { randomUUID } from 'crypto';

// ============================================
// SILA PIANO TILES — HTML GAME SOURCE CODE
// ============================================
const pianoHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<style>
:root{
  --bg:transparent;
  --ink:#e9edef;
  --muted:#8696a0;
  --accent:#00a884;
  --line:#2a3942;
  --cell:#111b21;
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
  justify-content:space-between;
  align-items:center;
  padding-bottom:14px;
  margin-bottom:14px;
  border-bottom:1px solid var(--line);
}

.title{
  font-size:18px;
  font-weight:700;
  letter-spacing:-.4px;
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
  color:var(--muted);
  font-size:10px;
  margin-bottom:4px;
}

.stat-value{
  font-size:18px;
  font-weight:700;
  font-variant-numeric:tabular-nums;
}

.game{
  position:relative;
  width:100%;
  aspect-ratio:4/5;
  max-height:520px;
  overflow:hidden;
  border:1px solid var(--line);
  border-radius:12px;
  background:#080d12;
  touch-action:manipulation;
}

.lane{
  position:absolute;
  inset:0;
  display:grid;
  grid-template-columns:repeat(4,1fr);
}

.lane-line{
  border-right:1px solid rgba(55,66,72,.55);
}

.lane-line:last-child{
  border-right:none;
}

.tiles{
  position:absolute;
  inset:0;
  overflow:hidden;
}

.tile{
  position:absolute;
  top:0;
  width:23%;
  height:110px;
  background:linear-gradient(180deg,#f2f4f5,#b8c4ca);
  border:1px solid rgba(255,255,255,.35);
  border-radius:5px;
  box-shadow:0 4px 12px rgba(0,0,0,.25);
  cursor:pointer;
  transform:translateY(-130px);
  transition:background .08s ease,transform .08s ease;
  touch-action:manipulation;
}

.tile::after{
  content:'';
  position:absolute;
  inset:0;
  border-radius:5px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
  pointer-events:none;
}

.tile.hit{
  background:var(--accent);
  transform:scale(.96);
  opacity:.8;
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
  border-top:2px solid rgba(0,168,132,.7);
  background:linear-gradient(0deg,rgba(0,168,132,.10),transparent);
  pointer-events:none;
}

.progress{
  position:absolute;
  top:0;
  left:0;
  height:3px;
  width:100%;
  background:var(--accent);
  transform-origin:left;
  transition:width .1s linear;
  z-index:5;
}

.combo-pop{
  position:absolute;
  top:35%;
  left:0;
  right:0;
  text-align:center;
  font-size:24px;
  font-weight:800;
  color:var(--accent);
  opacity:0;
  pointer-events:none;
  z-index:10;
}

.combo-pop.show{
  animation:pop .45s ease-out;
}

@keyframes pop{
  0%{opacity:0;transform:scale(.7)}
  30%{opacity:1;transform:scale(1.1)}
  100%{opacity:0;transform:translateY(-30px) scale(1)}
}

.controls{
  margin-top:14px;
}

.controls-label{
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

.btn:active{
  transform:scale(.98);
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
  display:flex;
  align-items:center;
  justify-content:center;
  padding:22px;
  z-index:50;
  background:rgba(8,13,18,.78);
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
  border:1px solid #374248;
  border-radius:14px;
  padding:26px 22px 0;
  text-align:center;
  overflow:hidden;
  transform:scale(.94);
  transition:transform .25s ease;
}

.modal.open .modal-card{
  transform:scale(1);
}

.modal-title{
  font-size:22px;
  font-weight:800;
  margin-bottom:8px;
}

.modal-sub{
  color:#aebac1;
  font-size:13px;
  line-height:1.5;
  margin-bottom:20px;
}

.modal-btn{
  width:100%;
  border:none;
  border-top:1px solid #374248;
  background:transparent;
  color:#00a884;
  padding:15px;
  font-family:inherit;
  font-size:15px;
  font-weight:700;
  cursor:pointer;
}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms!important;
    transition-duration:.01ms!important;
  }
}
</style>
</head>

<body>

<main class="stage">
  <div class="card">

    <div class="header">
      <div class="title">SILA Piano Tiles</div>
      <div class="sub">TAP THE TILES</div>
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
        <div class="stat-label">BEST</div>
        <div class="stat-value" id="best">0</div>
      </div>
    </div>

    <div class="game" id="game">

      <div class="progress" id="progress"></div>

      <div class="lane">
        <div class="lane-line"></div>
        <div class="lane-line"></div>
        <div class="lane-line"></div>
        <div class="lane-line"></div>
      </div>

      <div class="tiles" id="tiles"></div>

      <div class="hit-zone"></div>

      <div class="combo-pop" id="combo-pop">COMBO!</div>

    </div>

    <div class="controls">
      <div class="controls-label">DIFFICULTY</div>

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
      Tap Start Game to begin
    </div>

  </div>
</main>

<div class="modal" id="modal">
  <div class="modal-card">
    <div class="modal-title" id="modal-title">Game Over</div>
    <div class="modal-sub" id="modal-sub">Your final score</div>
    <button class="modal-btn" id="retry">Play Again</button>
  </div>
</div>

<script>
(function(){

'use strict';

const $=id=>document.getElementById(id);

const game=$('game');
const tilesEl=$('tiles');
const scoreEl=$('score');
const comboEl=$('combo');
const bestEl=$('best');
const progressEl=$('progress');
const messageEl=$('message');
const modal=$('modal');
const modalTitle=$('modal-title');
const modalSub=$('modal-sub');
const comboPop=$('combo-pop');
const startBtn=$('start');

const state={
  running:false,
  score:0,
  combo:0,
  best:0,
  level:0,
  speed:1,
  spawnInterval:700,
  tileHeight:110,
  tileId:0,
  tiles:[],
  lastTime:0,
  spawnTimer:0,
  animationId:null,
  gameDuration:60000,
  elapsed:0,
  misses:0,
  maxMisses:3
};

const LEVELS=[
  {name:'Easy',speed:150,duration:70000,interval:800},
  {name:'Normal',speed:190,duration:60000,interval:680},
  {name:'Hard',speed:235,duration:55000,interval:560},
  {name:'Master',speed:285,duration:50000,interval:440}
];

function updateStats(){
  scoreEl.textContent=state.score;
  comboEl.textContent=state.combo;
  bestEl.textContent=state.best;
}

function clearTiles(){
  tilesEl.innerHTML='';
  state.tiles=[];
}

function setLevel(level){
  if(state.running)return;

  state.level=level;

  document.querySelectorAll('.level').forEach((el,i)=>{
    el.classList.toggle('active',i===level);
  });

  messageEl.textContent='Difficulty: '+LEVELS[level].name;
}

function randomLane(){
  return Math.floor(Math.random()*4);
}

function createTile(){
  const rect=game.getBoundingClientRect();
  const width=rect.width/4;
  const lane=randomLane();

  const el=document.createElement('button');

  el.className='tile';
  el.type='button';
  el.setAttribute('aria-label','Piano tile');
  el.style.left=(lane*25+1)+'%';
  el.style.width='23%';
  el.style.height=state.tileHeight+'px';

  const tile={
    id:state.tileId++,
    el:el,
    x:lane,
    y:-state.tileHeight-5,
    hit:false,
    missed:false
  };

  el.addEventListener('pointerdown',(e)=>{
    e.preventDefault();
    hitTile(tile);
  });

  tilesEl.appendChild(el);
  state.tiles.push(tile);
  renderTile(tile);
}

function renderTile(tile){
  tile.el.style.transform='translateY('+tile.y+'px)';
}

function hitTile(tile){
  if(!state.running||tile.hit||tile.missed)return;

  const rect=game.getBoundingClientRect();
  const zoneTop=rect.height*0.86;

  // Tile must be near the lower section.
  if(tile.y+state.tileHeight<zoneTop-85)return;

  tile.hit=true;
  tile.el.classList.add('hit');

  state.score+=10+state.combo;
  state.combo++;
  state.best=Math.max(state.best,state.combo);

  updateStats();

  if(state.combo>0&&state.combo%10===0){
    comboPop.textContent=state.combo+' COMBO!';
    comboPop.classList.remove('show');
    void comboPop.offsetWidth;
    comboPop.classList.add('show');
  }

  setTimeout(()=>{
    if(tile.el&&tile.el.parentNode){
      tile.el.remove();
    }
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
    if(tile.el&&tile.el.parentNode){
      tile.el.remove();
    }
  },80);

  if(state.misses>=state.maxMisses){
    endGame('miss');
  }
}

function updateTiles(delta){
  const rect=game.getBoundingClientRect();
  const bottom=rect.height;

  for(let i=state.tiles.length-1;i>=0;i--){
    const tile=state.tiles[i];

    if(tile.hit||tile.missed){
      state.tiles.splice(i,1);
      continue;
    }

    tile.y+=LEVELS[state.level].speed*delta/1000;
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

  const config=LEVELS[state.level];

  if(state.spawnTimer>=config.interval){
    state.spawnTimer=0;
    createTile();
  }

  updateTiles(delta);

  const remaining=Math.max(0,config.duration-state.elapsed);
  progressEl.style.width=(remaining/config.duration*100)+'%';

  if(state.elapsed>=config.duration){
    endGame('time');
    return;
  }

  state.animationId=requestAnimationFrame(loop);
}

function startGame(){
  if(state.running)return;

  closeModal();
  clearTiles();

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
  messageEl.textContent='Tap the tiles before they reach the bottom';

  updateStats();
  progressEl.style.width='100%';

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

  startBtn.disabled=false;
  startBtn.textContent='Start Game';

  let title='Game Over';
  let sub='';

  if(reason==='time'){
    title='Time Complete!';
    sub='Final Score: '+state.score+' | Best Combo: '+state.best;
  }else{
    title='Missed Tiles!';
    sub='Final Score: '+state.score+' | Best Combo: '+state.best;
  }

  modalTitle.textContent=title;
  modalSub.textContent=sub;
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

  state.running=false;
  state.score=0;
  state.combo=0;
  state.best=0;
  state.elapsed=0;
  state.spawnTimer=0;
  state.misses=0;

  clearTiles();

  startBtn.disabled=false;
  startBtn.textContent='Start Game';

  progressEl.style.width='100%';
  messageEl.textContent='Tap Start Game to begin';

  closeModal();
  updateStats();
}

document.querySelectorAll('.level').forEach((el)=>{
  el.addEventListener('click',()=>{
    setLevel(Number(el.dataset.level));
  });
});

startBtn.addEventListener('click',startGame);
$('reset').addEventListener('click',resetGame);
$('retry').addEventListener('click',()=>{
  closeModal();
  startGame();
});

modal.addEventListener('click',(e)=>{
  if(e.target===modal){
    closeModal();
  }
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
  description: 'Play SILA Piano Tiles game in WhatsApp',
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
                  messageText:"🎹 SILA Piano Tiles"
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
