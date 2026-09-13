import { randomUUID } from 'crypto';

// ============================================
// HTML DINO RUN GAME SOURCE CODE
// ============================================
const dinoHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{
  --bg:#f7f7f7;
  --ink:#2b2b2b;
  --ink-soft:#888;
  --muted:#a0a0a0;
  --ground:#c8c8c8;
  --accent:#00a884;
  --danger:#e74c3c;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html,body{
  background:transparent;
  color:var(--ink);
  font-family:var(--sys);
  min-height:100vh;
  overflow:hidden;
  touch-action:manipulation;
  cursor:pointer;
  -webkit-font-smoothing:antialiased;
}

.stage{
  min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:16px;
}

.card{
  width:100%;
  max-width:520px;
}

.header{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-bottom:12px;padding-bottom:10px;
  border-bottom:1px solid rgba(0,0,0,.08);
  gap:8px;
}
.header__title{
  font-size:17px;font-weight:700;
  color:var(--ink);letter-spacing:-.005em;
}
.header__sub{font-size:12px;color:var(--muted);font-weight:500}

.hud{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:10px;gap:8px;font-size:13px;
}
.hud__stat{
  display:flex;flex-direction:column;gap:2px;
}
.hud__label{
  font-size:10px;color:var(--muted);
  text-transform:uppercase;letter-spacing:.08em;font-weight:600;
}
.hud__value{
  font-size:16px;font-weight:700;color:var(--ink);
  font-variant-numeric:tabular-nums;
}
.hud__value.hi{color:var(--accent)}

.game-wrap{
  position:relative;
  width:100%;
  aspect-ratio:16/9;
  background:#fff;
  border-radius:12px;
  overflow:hidden;
  border:1px solid rgba(0,0,0,.08);
  box-shadow:0 4px 20px -8px rgba(0,0,0,.15);
  touch-action:none;
}

canvas{
  display:block;
  width:100%;height:100%;
  image-rendering:pixelated;
  image-rendering:crisp-edges;
}

.overlay{
  position:absolute;inset:0;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  background:rgba(255,255,255,.94);
  backdrop-filter:blur(4px);
  -webkit-backdrop-filter:blur(4px);
  gap:14px;
  padding:24px;
  text-align:center;
  transition:opacity .25s ease;
  z-index:10;
}
.overlay.hidden{opacity:0;pointer-events:none}

.overlay__emoji{
  font-size:48px;line-height:1;
  animation:bounce 1.6s ease-in-out infinite;
}
@keyframes bounce{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-6px)}
}
.overlay__title{
  font-size:22px;font-weight:800;
  letter-spacing:-.02em;color:var(--ink);
  line-height:1.2;
}
.overlay__sub{
  font-size:13px;color:var(--ink-soft);
  line-height:1.5;max-width:280px;
}
.overlay__btn{
  background:var(--accent);border:none;
  color:#fff;font-family:inherit;
  font-size:15px;font-weight:700;
  padding:12px 32px;border-radius:24px;
  cursor:pointer;
  box-shadow:0 4px 14px -4px rgba(0,168,132,.5);
  transition:transform .15s ease,box-shadow .15s ease;
}
.overlay__btn:active{transform:scale(.96)}
.overlay__btn:hover{box-shadow:0 6px 18px -4px rgba(0,168,132,.7)}

.score-badge{
  display:inline-flex;align-items:center;gap:6px;
  background:#f0f0f0;padding:6px 14px;border-radius:20px;
  font-size:13px;font-weight:700;color:var(--ink);
}

.game-over__score{
  font-size:34px;font-weight:800;
  color:var(--accent);
  font-variant-numeric:tabular-nums;
  letter-spacing:-.02em;
}
.game-over__label{
  font-size:11px;color:var(--muted);
  text-transform:uppercase;letter-spacing:.1em;font-weight:600;
}

.controls{
  margin-top:12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
}
.controls__hint{
  font-size:11px;color:var(--muted);
  display:flex;align-items:center;gap:6px;
  flex:1;
}
.controls__hint kbd{
  background:#f0f0f0;
  border:1px solid rgba(0,0,0,.08);
  border-radius:4px;
  padding:2px 6px;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:10px;font-weight:600;
  color:var(--ink);
}
.controls__btn{
  background:transparent;border:none;
  color:var(--accent);font-family:inherit;
  font-size:13px;font-weight:600;
  cursor:pointer;padding:8px 14px;
  border-radius:8px;
  transition:background .15s ease;
}
.controls__btn:hover{background:rgba(0,168,132,.08)}

.tap-zone{
  position:absolute;inset:0;
  z-index:5;
  cursor:pointer;
}

.sound-toggle{
  position:absolute;top:10px;right:10px;
  z-index:20;
  background:rgba(255,255,255,.85);
  border:1px solid rgba(0,0,0,.08);
  width:32px;height:32px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;
  font-size:15px;
  transition:transform .15s ease,background .15s ease;
}
.sound-toggle:active{transform:scale(.9)}
.sound-toggle:hover{background:#fff}
.sound-toggle.muted{opacity:.5}

@media (max-width:420px){
  .stage{padding:10px}
  .header__title{font-size:15px}
  .hud__value{font-size:14px}
  .overlay__title{font-size:18px}
  .overlay__emoji{font-size:40px}
  .game-over__score{font-size:28px}
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
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">🦖 Dino Run</div>
      <div class="header__sub">SILA Arcade</div>
    </div>

    <div class="hud">
      <div class="hud__stat">
        <span class="hud__label">Score</span>
        <span class="hud__value" id="score">0</span>
      </div>
      <div class="hud__stat">
        <span class="hud__label">High Score</span>
        <span class="hud__value hi" id="high">0</span>
      </div>
      <div class="hud__stat">
        <span class="hud__label">Speed</span>
        <span class="hud__value" id="speed">1.0x</span>
      </div>
    </div>

    <div class="game-wrap" id="gameWrap">
      <canvas id="canvas"></canvas>
      <button class="sound-toggle" id="soundBtn" aria-label="Toggle sound">🔊</button>
      <div class="tap-zone" id="tapZone"></div>

      <div class="overlay" id="startOverlay">
        <div class="overlay__emoji">🦖</div>
        <div class="overlay__title">Dino Run</div>
        <div class="overlay__sub">Ruka ili kuepuka vikwazo. Jinsi unavyoendelea, ndivyo inakuwa haraka!</div>
        <button class="overlay__btn" id="startBtn">Anza Mchezo</button>
      </div>

      <div class="overlay hidden" id="overOverlay">
        <div class="overlay__emoji">💥</div>
        <div class="overlay__title">Game Over!</div>
        <div class="game-over__label">Score Yako</div>
        <div class="game-over__score" id="finalScore">0</div>
        <div class="overlay__sub" id="bestMsg"></div>
        <button class="overlay__btn" id="retryBtn">Jaribu Tena</button>
      </div>
    </div>

    <div class="controls">
      <div class="controls__hint">
        <kbd>SPACE</kbd> / <kbd>↑</kbd> ruka &nbsp;·&nbsp; <kbd>↓</kbd> inama
      </div>
      <button class="controls__btn" id="resetBtn">Reset</button>
    </div>
  </div>
</main>

<script>
(function(){
'use strict';

const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const gameWrap=document.getElementById('gameWrap');
const startOverlay=document.getElementById('startOverlay');
const overOverlay=document.getElementById('overOverlay');
const finalScore=document.getElementById('finalScore');
const bestMsg=document.getElementById('bestMsg');
const scoreEl=document.getElementById('score');
const highEl=document.getElementById('high');
const speedEl=document.getElementById('speed');
const soundBtn=document.getElementById('soundBtn');
const tapZone=document.getElementById('tapZone');

// ==== Audio Engine (simple WebAudio beeps) ====
let audioCtx=null;
let soundOn=true;
function beep(freq,dur,type){
  if(!soundOn) return;
  try{
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const o=audioCtx.createOscillator();
    const g=audioCtx.createGain();
    o.type=type||'square';
    o.frequency.value=freq;
    g.gain.value=0.04;
    g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+dur);
    o.connect(g);g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime+dur);
  }catch(e){}
}

// ==== Canvas Setup (DPR-aware) ====
let W=0,H=0,DPR=1;
function resizeCanvas(){
  const rect=gameWrap.getBoundingClientRect();
  DPR=Math.min(window.devicePixelRatio||1,2);
  W=rect.width;H=rect.height;
  canvas.width=W*DPR;
  canvas.height=H*DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.imageSmoothingEnabled=false;
}
window.addEventListener('resize',()=>{resizeCanvas();layout();});

// ==== Game State ====
const S={
  running:false,
  over:false,
  score:0,
  high:parseInt(localStorage.getItem('sila_dino_high')||'0',10)||0,
  speed:1,
  baseSpeed:5.5,
  maxSpeed:16,
  frame:0,
  groundY:0,
  dino:null,
  obstacles:[],
  clouds:[],
  particles:[],
  nextSpawn:0,
  jumpBuffer:0,
  gameOverAt:0
};

const GRAVITY=0.85;
const JUMP_V=-14.5;
const DINO_X_RATIO=0.08;

function layout(){
  S.groundY=H-24;
  if(S.dino){
    S.dino.x=W*DINO_X_RATIO;
    S.dino.groundY=S.groundY;
  }
}

// ==== Dino Entity ====
function createDino(){
  return {
    x:W*DINO_X_RATIO,
    y:S.groundY-44,
    w:44,h:44,
    vy:0,
    onGround:true,
    ducking:false,
    duckT:0,
    legFrame:0,
    blinkT:Math.random()*200
  };
}

// ==== Input ====
function jump(){
  if(S.over){restart();return;}
  if(!S.running){startGame();return;}
  if(S.dino.onGround){
    S.dino.vy=JUMP_V;
    S.dino.onGround=false;
    beep(520,0.08,'square');
  } else {
    S.jumpBuffer=8;
  }
}
function duckStart(){
  if(!S.running||S.over) return;
  if(!S.dino.onGround){
    // fast fall
    S.dino.vy=Math.max(S.dino.vy,GRAVITY*4);
  } else {
    S.dino.ducking=true;
  }
}
function duckEnd(){
  if(!S.dino) return;
  S.dino.ducking=false;
}

document.addEventListener('keydown',e=>{
  if(e.key===' '||e.key==='ArrowUp'||e.key==='w'||e.key==='W'){
    e.preventDefault();jump();
  } else if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){
    e.preventDefault();duckStart();
  }
});
document.addEventListener('keyup',e=>{
  if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){
    duckEnd();
  }
});
tapZone.addEventListener('pointerdown',e=>{
  e.preventDefault();
  const rect=gameWrap.getBoundingClientRect();
  const y=(e.clientY-rect.top)/rect.height;
  if(y>0.65){duckStart();}else{jump();}
  if(!S.running&&!S.over) startGame();
});
tapZone.addEventListener('pointerup',duckEnd);
tapZone.addEventListener('pointercancel',duckEnd);
tapZone.addEventListener('pointerleave',duckEnd);

// ==== Obstacles ====
const TYPES=[
  {w:18,h:36,kind:'cactus-small',color:'#4a7c4a'},
  {w:24,h:50,kind:'cactus-big',color:'#3d6b3d'},
  {w:54,h:28,kind:'rock',color:'#7a7a7a'},
  {w:34,h:44,kind:'cactus-cluster',color:'#4a7c4a'}
];

function spawnObstacle(){
  const t=TYPES[Math.floor(Math.random()*TYPES.length)];
  const o={
    x:W+20,
    w:t.w,h:t.h,
    kind:t.kind,
    color:t.color,
    flap:0
  };
  o.y=S.groundY-o.h;
  S.obstacles.push(o);
}

function spawnCloud(){
  S.clouds.push({
    x:W+30+Math.random()*60,
    y:20+Math.random()*(H*0.4),
    scale:0.6+Math.random()*0.5,
    speed:0.3+Math.random()*0.3
  });
}

// ==== Particles (dust) ====
function addDust(x,y){
  for(let i=0;i<3;i++){
    S.particles.push({
      x,y,
      vx:-1-Math.random()*2,
      vy:-Math.random()*1.5,
      life:20+Math.random()*15,
      maxLife:35,
      size:2+Math.random()*2
    });
  }
}

// ==== Update ====
function update(){
  if(!S.running) return;
  S.frame++;

  // Speed up gradually
  S.speed=Math.min(S.maxSpeed,S.baseSpeed+S.score*0.0009);
  speedEl.textContent=S.speed.toFixed(1)+'x';

  // Score
  S.score+=0.35*S.speed;
  scoreEl.textContent=Math.floor(S.score);

  // Dino physics
  const d=S.dino;
  if(!d.onGround){
    d.vy+=GRAVITY;
    d.y+=d.vy;
    if(S.jumpBuffer>0&&d.vy>-2){
      d.vy=JUMP_V;S.jumpBuffer=0;
    }
    const groundLevel=S.groundY-d.h;
    if(d.y>=groundLevel){
      d.y=groundLevel;d.vy=0;d.onGround=true;
      addDust(d.x+d.w/2,S.groundY);
    }
  }
  if(S.jumpBuffer>0)S.jumpBuffer--;

  // Dino animation
  if(d.onGround){
    d.legFrame=Math.floor(S.frame/6)%2;
    if(S.frame%4===0&&Math.random()<0.2){
      // running dust
      if(Math.random()<0.5) addDust(d.x+4,S.groundY);
    }
  }
  d.blinkT--;
  if(d.blinkT<0) d.blinkT=Math.random()*180+80;

  if(d.ducking&&d.onGround){
    d.duckT=Math.min(d.duckT+0.25,1);
  } else {
    d.duckT=Math.max(d.duckT-0.25,0);
  }

  // Clouds
  if(Math.random()<0.006) spawnCloud();
  for(let i=S.clouds.length-1;i>=0;i--){
    const c=S.clouds[i];
    c.x-=(c.speed+S.speed*0.05);
    if(c.x<-80)S.clouds.splice(i,1);
  }

  // Obstacles
  S.nextSpawn-=S.speed;
  if(S.nextSpawn<=0){
    spawnObstacle();
    const minGap=Math.max(60,180-S.score*0.01);
    S.nextSpawn=Math.max(60,140+Math.random()*100+S.speed*6-S.score*0.005);
    if(S.nextSpawn<minGap)S.nextSpawn=minGap;
  }

  for(let i=S.obstacles.length-1;i>=0;i--){
    const o=S.obstacles[i];
    o.x-=S.speed;
    if(o.x+o.w<-20){S.obstacles.splice(i,1);continue;}
    // collision check
    const dinoBox=getDinoBox();
    const oBox={x:o.x+3,y:o.y+3,w:o.w-6,h:o.h-6};
    if(rectIntersect(dinoBox,oBox)){
      gameOver();
      return;
    }
  }

  // Particles
  for(let i=S.particles.length-1;i>=0;i--){
    const p=S.particles[i];
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=0.15;
    p.life--;
    if(p.life<=0)S.particles.splice(i,1);
  }
}

function getDinoBox(){
  const d=S.dino;
  const duckAmt=d.duckT;
  const h=d.h*(1-duckAmt*0.45);
  const y=S.groundY-h;
  return {
    x:d.x+6,
    y:y+4,
    w:d.w-12,
    h:h-6
  };
}
function rectIntersect(a,b){
  return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
}

// ==== Draw ====
function draw(){
  // clear (sky)
  const skyGrad=ctx.createLinearGradient(0,0,0,H);
  skyGrad.addColorStop(0,'#fefefe');
  skyGrad.addColorStop(1,'#f0f4f8');
  ctx.fillStyle=skyGrad;
  ctx.fillRect(0,0,W,H);

  // clouds
  S.clouds.forEach(c=>{
    ctx.fillStyle='rgba(200,210,220,0.7)';
    ctx.beginPath();
    ctx.arc(c.x,c.y,14*c.scale,0,Math.PI*2);
    ctx.arc(c.x+12*c.scale,c.y-4*c.scale,16*c.scale,0,Math.PI*2);
    ctx.arc(c.x+26*c.scale,c.y,14*c.scale,0,Math.PI*2);
    ctx.fill();
  });

  // ground
  ctx.strokeStyle='#c8c8c8';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(0,S.groundY);
  ctx.lineTo(W,S.groundY);
  ctx.stroke();

  // ground dashes (moving)
  const dashOffset=-(S.frame*S.speed)%40;
  ctx.strokeStyle='#dcdcdc';
  ctx.lineWidth=1.5;
  for(let x=dashOffset;x<W;x+=40){
    ctx.beginPath();
    ctx.moveTo(x,S.groundY+6);
    ctx.lineTo(x+16,S.groundY+6);
    ctx.stroke();
  }

  // particles
  S.particles.forEach(p=>{
    const a=p.life/p.maxLife;
    ctx.fillStyle='rgba(180,180,180,'+a.toFixed(2)+')';
    ctx.fillRect(p.x,p.y,p.size,p.size);
  });

  // obstacles
  S.obstacles.forEach(drawObstacle);

  // dino
  if(S.dino) drawDino(S.dino);
}

function drawObstacle(o){
  ctx.save();
  if(o.kind==='cactus-small'||o.kind==='cactus-big'||o.kind==='cactus-cluster'){
    ctx.fillStyle=o.color;
    const count=o.kind==='cactus-cluster'?3:1;
    const cw=o.w/count;
    for(let i=0;i<count;i++){
      const cx=o.x+i*cw+cw/2;
      // trunk
      ctx.fillRect(cx-3,o.y,6,o.h);
      // arms
      ctx.fillRect(cx-9,o.y+o.h*0.35,6,o.h*0.25);
      ctx.fillRect(cx+3,o.y+o.h*0.5,6,o.h*0.25);
      // tops
      ctx.fillRect(cx-9,o.y+o.h*0.35,12,4);
      ctx.fillRect(cx+3,o.y+o.h*0.5,12,4);
    }
  } else if(o.kind==='rock'){
    ctx.fillStyle=o.color;
    ctx.beginPath();
    ctx.moveTo(o.x,o.y+o.h);
    ctx.lineTo(o.x+o.w*0.15,o.y+o.h*0.4);
    ctx.lineTo(o.x+o.w*0.5,o.y);
    ctx.lineTo(o.x+o.w*0.85,o.y+o.h*0.3);
    ctx.lineTo(o.x+o.w,o.y+o.h);
    ctx.closePath();
    ctx.fill();
    // highlight
    ctx.fillStyle='rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(o.x+o.w*0.5,o.y);
    ctx.lineTo(o.x+o.w*0.65,o.y+o.h*0.4);
    ctx.lineTo(o.x+o.w*0.5,o.y+o.h*0.6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawDino(d){
  const duckAmt=d.duckT;
  const baseH=d.h;
  const h=baseH*(1-duckAmt*0.45);
  const w=d.w+duckAmt*8;
  const y=S.groundY-h;
  const x=d.x;

  ctx.save();

  // body color
  const bodyColor='#5a5a5a';
  const darkColor='#3d3d3d';

  // tail
  ctx.fillStyle=bodyColor;
  ctx.beginPath();
  ctx.moveTo(x,y+h*0.55);
  ctx.lineTo(x-8,y+h*0.5);
  ctx.lineTo(x-4,y+h*0.75);
  ctx.closePath();
  ctx.fill();

  // main body
  ctx.fillStyle=bodyColor;
  roundRect(ctx,x,y+h*0.15,w*0.65,h*0.7,4);
  ctx.fill();

  // head
  const headW=w*0.55;
  const headH=h*0.5;
  const headX=x+w*0.35;
  const headY=y+h*0.05;
  ctx.fillStyle=bodyColor;
  roundRect(ctx,headX,headY,headW,headH,3);
  ctx.fill();

  // jaw / snout
  ctx.fillStyle=bodyColor;
  ctx.fillRect(headX+headW*0.6,headY+headH*0.5,headW*0.4,headH*0.3);

  // eye
  const eyeX=headX+headW*0.72;
  const eyeY=headY+headH*0.32;
  ctx.fillStyle='#fff';
  ctx.beginPath();
  ctx.arc(eyeX,eyeY,headH*0.16,0,Math.PI*2);
  ctx.fill();
  if(d.blinkT<6){
    ctx.fillStyle=bodyColor;
    ctx.fillRect(eyeX-headH*0.16,eyeY-1,headH*0.32,2);
  } else {
    ctx.fillStyle=darkColor;
    ctx.beginPath();
    ctx.arc(eyeX+1,eyeY,headH*0.08,0,Math.PI*2);
    ctx.fill();
  }

  // legs
  ctx.fillStyle=darkColor;
  if(d.onGround&&!d.ducking){
    const legOffset=d.legFrame===0?0:4;
    // front leg
    ctx.fillRect(x+w*0.35,y+h*0.8,4,h*0.2);
    ctx.fillRect(x+w*0.35+legOffset,y+h*0.8,4,h*0.2);
    // back leg
    ctx.fillRect(x+w*0.15,y+h*0.8,4,h*0.2);
    ctx.fillRect(x+w*0.15-legOffset,y+h*0.8,4,h*0.2);
  } else if(!d.onGround){
    // tucked legs
    ctx.fillRect(x+w*0.25,y+h*0.75,6,4);
    ctx.fillRect(x+w*0.45,y+h*0.75,6,4);
  } else {
    // ducking
    ctx.fillRect(x+w*0.3,y+h*0.85,6,4);
  }

  // tiny arm
  ctx.fillStyle=darkColor;
  ctx.fillRect(x+w*0.55,y+h*0.45,6,3);

  ctx.restore();
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

// ==== Game Flow ====
function startGame(){
  resizeCanvas();
  layout();
  S.running=true;
  S.over=false;
  S.score=0;
  S.frame=0;
  S.speed=S.baseSpeed;
  S.obstacles=[];
  S.clouds=[];
  S.particles=[];
  S.nextSpawn=60;
  S.jumpBuffer=0;
  S.dino=createDino();
  layout();
  scoreEl.textContent='0';
  speedEl.textContent='1.0x';
  startOverlay.classList.add('hidden');
  overOverlay.classList.add('hidden');
  beep(440,0.08,'sine');
}

function gameOver(){
  S.running=false;
  S.over=true;
  beep(180,0.25,'sawtooth');
  setTimeout(()=>beep(120,0.3,'sawtooth'),120);

  const finalVal=Math.floor(S.score);
  finalScore.textContent=finalVal;
  if(finalVal>S.high){
    S.high=finalVal;
    try{localStorage.setItem('sila_dino_high',String(S.high));}catch(e){}
    bestMsg.textContent='🏆 Rekodi mpya! Umevuka high score yako.';
  } else {
    bestMsg.textContent='High Score: '+S.high;
  }
  highEl.textContent=S.high;
  overOverlay.classList.remove('hidden');
}

function restart(){
  startGame();
}

// ==== Main Loop ====
let lastTs=0;
function loop(ts){
  requestAnimationFrame(loop);
  // cap dt
  const dt=Math.min(50,ts-lastTs);
  lastTs=ts;
  if(S.running){
    update();
  }
  draw();
}
requestAnimationFrame(loop);

// ==== Buttons ====
document.getElementById('startBtn').addEventListener('click',startGame);
document.getElementById('retryBtn').addEventListener('click',restart);
document.getElementById('resetBtn').addEventListener('click',()=>{
  if(S.running||S.over) restart();
  else startGame();
});
soundBtn.addEventListener('click',()=>{
  soundOn=!soundOn;
  soundBtn.textContent=soundOn?'🔊':'🔇';
  soundBtn.classList.toggle('muted',!soundOn);
});

// ==== Init ====
resizeCanvas();
S.dino=createDino();
layout();
highEl.textContent=S.high;
draw();

})();
</script>
</body>
</html>
`;

// ============================================
// BOT COMMAND IMPLEMENTATION
// ============================================
export default {
  name: 'dino',
  alias: ['dinorun', 'dinosaur', 'chrome-dino', 'sila-dino'],
  description: '🦖 Play Dino Run game inside WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    try {
      const responseId = 'sila-dino-' + Date.now();

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
                  messageText: "🦖 Dino Run - SILA Arcade"
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
                          "payload": dinoHtml,
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
      console.error('[DINO]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      }, { quoted: msg });
    }
  }
};