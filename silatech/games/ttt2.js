import { randomUUID } from 'crypto';

// ============================================
// HTML DINO RUN GAME - FIXED FOR WHATSAPP
// ============================================
const dinoHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{
  --bg:transparent;
  --ink:#e9edef;
  --ink-soft:#aebac1;
  --muted:#8696a0;
  --accent:#00a884;
  --accent-2:#008069;
  --line:#2a3942;
  --line-strong:#374248;
  --sky:#111b21;
  --sky-2:#0b141a;
  --ground:#374248;
  --ground-2:#2a3942;
  --dino:#e9edef;
  --dino-dark:#aebac1;
  --cactus:#00a884;
  --cactus-dark:#008069;
  --rock:#8696a0;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html,body{
  background:transparent;
  color:var(--ink);
  font-family:var(--sys);
  min-height:100vh;
  overflow-x:hidden;
  cursor:pointer;
  -webkit-font-smoothing:antialiased;
}

.stage{
  min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:20px 16px;
}

.card{
  width:100%;
  max-width:480px;
}

.header{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-bottom:12px;padding-bottom:12px;
  border-bottom:1px solid var(--line);
  gap:8px;
}
.header__title{
  font-size:17px;font-weight:600;
  color:var(--ink);letter-spacing:-.005em;
}
.header__sub{font-size:12px;color:var(--muted)}

.hud{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:10px;gap:8px;
}
.hud__stat{display:flex;flex-direction:column;gap:2px}
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
  background:var(--sky-2);
  border-radius:8px;
  overflow:hidden;
  border:1px solid var(--line);
  box-shadow:0 8px 24px -8px rgba(0,0,0,.5);
  cursor:pointer;
}

canvas{
  display:block;
  width:100%;height:100%;
  pointer-events:none;
}

.overlay{
  position:absolute;inset:0;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  background:rgba(11,20,26,.92);
  gap:14px;
  padding:24px;
  text-align:center;
  transition:opacity .3s ease,visibility .3s ease;
  z-index:10;
}
.overlay.hidden{opacity:0;visibility:hidden;pointer-events:none}

.overlay__emoji{
  font-size:48px;line-height:1;
  animation:bounce 1.8s ease-in-out infinite;
}
@keyframes bounce{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-8px)}
}
.overlay__title{
  font-size:22px;font-weight:700;
  letter-spacing:-.02em;color:var(--ink);
  line-height:1.2;
}
.overlay__sub{
  font-size:13px;color:var(--ink-soft);
  line-height:1.5;max-width:300px;
}
.overlay__btn{
  background:var(--accent);border:none;
  color:#0b141a;font-family:inherit;
  font-size:15px;font-weight:700;
  padding:12px 36px;border-radius:24px;
  cursor:pointer;
  transition:transform .15s ease,background .15s ease;
  margin-top:4px;
}
.overlay__btn:active{transform:scale(.96);background:var(--accent-2)}
.overlay__btn:hover{background:var(--accent-2)}

.game-over__score{
  font-size:36px;font-weight:800;
  color:var(--accent);
  font-variant-numeric:tabular-nums;
  letter-spacing:-.02em;
  line-height:1;
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
  flex-wrap:wrap;
  flex:1;
}
.controls__hint kbd{
  background:var(--line);
  border:1px solid var(--line-strong);
  border-radius:4px;
  padding:2px 6px;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:10px;font-weight:600;
  color:var(--ink-soft);
}
.controls__btn{
  background:transparent;border:none;
  color:var(--accent);font-family:inherit;
  font-size:13px;font-weight:600;
  cursor:pointer;padding:8px 14px;
  border-radius:8px;
  transition:background .15s ease,color .15s ease;
  white-space:nowrap;
}
.controls__btn:hover{background:rgba(0,168,132,.1);color:var(--ink)}
.controls__btn:active{background:rgba(0,168,132,.2)}

.hint-mobile{
  position:absolute;
  bottom:8px;left:0;right:0;
  text-align:center;
  font-size:10px;
  color:rgba(233,237,239,.55);
  z-index:8;
  pointer-events:none;
  letter-spacing:.03em;
}

@media (max-width:420px){
  .stage{padding:14px 12px}
  .header__title{font-size:15px}
  .hud__value{font-size:14px}
  .overlay__title{font-size:18px}
  .overlay__emoji{font-size:40px}
  .game-over__score{font-size:28px}
  .controls__hint{font-size:10px}
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
      <div class="header__title">Dino Run</div>
      <div class="header__sub">SILA Arcade</div>
    </div>

    <div class="hud">
      <div class="hud__stat">
        <span class="hud__label">Score</span>
        <span class="hud__value" id="score">0</span>
      </div>
      <div class="hud__stat">
        <span class="hud__label">Best</span>
        <span class="hud__value hi" id="high">0</span>
      </div>
      <div class="hud__stat">
        <span class="hud__label">Speed</span>
        <span class="hud__value" id="speed">1.0x</span>
      </div>
    </div>

    <div class="game-wrap" id="gameWrap">
      <canvas id="canvas"></canvas>
      <div class="hint-mobile" id="hintMobile">Tap to jump</div>

      <div class="overlay" id="startOverlay">
        <div class="overlay__emoji">🦖</div>
        <div class="overlay__title">Dino Run</div>
        <div class="overlay__sub">Jump over obstacles. The longer you survive, the faster it gets!</div>
        <button class="overlay__btn" id="startBtn">Start Game</button>
      </div>

      <div class="overlay hidden" id="overOverlay">
        <div class="overlay__emoji">💥</div>
        <div class="overlay__title">Game Over!</div>
        <div class="game-over__label">Your Score</div>
        <div class="game-over__score" id="finalScore">0</div>
        <div class="overlay__sub" id="bestMsg"></div>
        <button class="overlay__btn" id="retryBtn">Try Again</button>
      </div>
    </div>

    <div class="controls">
      <div class="controls__hint">
        <kbd>SPACE</kbd> jump &nbsp;·&nbsp; <kbd>↓</kbd> duck
      </div>
      <button class="controls__btn" id="resetBtn">Reset</button>
    </div>
  </div>
</main>

<script>
(function(){
'use strict';

var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var gameWrap=document.getElementById('gameWrap');
var startOverlay=document.getElementById('startOverlay');
var overOverlay=document.getElementById('overOverlay');
var finalScore=document.getElementById('finalScore');
var bestMsg=document.getElementById('bestMsg');
var scoreEl=document.getElementById('score');
var highEl=document.getElementById('high');
var speedEl=document.getElementById('speed');
var hintMobile=document.getElementById('hintMobile');

var W=0,H=0,DPR=1;

function resizeCanvas(){
  var rect=gameWrap.getBoundingClientRect();
  DPR=Math.min(window.devicePixelRatio||1,2);
  W=rect.width;H=rect.height;
  canvas.width=Math.floor(W*DPR);
  canvas.height=Math.floor(H*DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.imageSmoothingEnabled=false;
}

var S={
  running:false,
  over:false,
  score:0,
  high:0,
  speed:1,
  baseSpeed:5,
  maxSpeed:15,
  frame:0,
  groundY:0,
  dino:null,
  obstacles:[],
  clouds:[],
  particles:[],
  nextSpawn:60,
  jumpBuffer:0,
  groundOffset:0
};

try{
  S.high=parseInt(localStorage.getItem('sila_dino_high')||'0',10)||0;
}catch(e){S.high=0;}

var GRAVITY=0.85;
var JUMP_V=-14.5;
var DINO_X_RATIO=0.08;

function layout(){
  S.groundY=H-24;
  if(S.dino){
    S.dino.x=W*DINO_X_RATIO;
    S.dino.groundY=S.groundY;
  }
}

function createDino(){
  return {
    x:W*DINO_X_RATIO,
    y:0,
    w:44,h:44,
    vy:0,
    onGround:true,
    ducking:false,
    duckT:0,
    legFrame:0,
    blinkT:Math.random()*200
  };
}

// ==== Audio ====
var audioCtx=null;
function beep(freq,dur,type){
  try{
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') audioCtx.resume();
    var o=audioCtx.createOscillator();
    var g=audioCtx.createGain();
    o.type=type||'square';
    o.frequency.value=freq;
    g.gain.value=0.03;
    g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+dur);
    o.connect(g);g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime+dur);
  }catch(e){}
}

// ==== Input handlers (WhatsApp-safe) ====
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
  if(!S.running||S.over||!S.dino) return;
  if(!S.dino.onGround){
    S.dino.vy=Math.max(S.dino.vy,GRAVITY*4);
  } else {
    S.dino.ducking=true;
  }
}
function duckEnd(){
  if(!S.dino) return;
  S.dino.ducking=false;
}

// Handle tap/click on game area
function handleTap(e){
  if(e&&e.preventDefault) e.preventDefault();
  if(S.over){restart();return;}
  if(!S.running){startGame();return;}
  jump();
}

gameWrap.addEventListener('click',handleTap);
gameWrap.addEventListener('touchstart',handleTap,{passive:false});

// Keyboard
document.addEventListener('keydown',function(e){
  if(e.key===' '||e.key==='ArrowUp'||e.key==='w'||e.key==='W'){
    e.preventDefault();jump();
  } else if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){
    e.preventDefault();duckStart();
  }
});
document.addEventListener('keyup',function(e){
  if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){
    duckEnd();
  }
});

// ==== Obstacles ====
var TYPES=[
  {w:18,h:36,kind:'cactus-small'},
  {w:24,h:50,kind:'cactus-big'},
  {w:54,h:28,kind:'rock'},
  {w:34,h:44,kind:'cactus-cluster'}
];

function spawnObstacle(){
  var t=TYPES[Math.floor(Math.random()*TYPES.length)];
  var o={
    x:W+20,
    w:t.w,h:t.h,
    kind:t.kind
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

function addDust(x,y){
  for(var i=0;i<3;i++){
    S.particles.push({
      x:x,y:y,
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

  S.speed=Math.min(S.maxSpeed,S.baseSpeed+S.score*0.0009);
  speedEl.textContent=S.speed.toFixed(1)+'x';

  S.score+=0.35*S.speed;
  scoreEl.textContent=Math.floor(S.score);

  var d=S.dino;
  if(!d.onGround){
    d.vy+=GRAVITY;
    d.y+=d.vy;
    if(S.jumpBuffer>0&&d.vy>-2){
      d.vy=JUMP_V;S.jumpBuffer=0;
    }
    var groundLevel=S.groundY-d.h;
    if(d.y>=groundLevel){
      d.y=groundLevel;d.vy=0;d.onGround=true;
      addDust(d.x+d.w/2,S.groundY);
    }
  }
  if(S.jumpBuffer>0)S.jumpBuffer--;

  if(d.onGround){
    d.legFrame=Math.floor(S.frame/6)%2;
    if(S.frame%4===0&&Math.random()<0.3){
      addDust(d.x+4,S.groundY);
    }
  }
  d.blinkT--;
  if(d.blinkT<0) d.blinkT=Math.random()*180+80;

  if(d.ducking&&d.onGround){
    d.duckT=Math.min(d.duckT+0.25,1);
  } else {
    d.duckT=Math.max(d.duckT-0.25,0);
  }

  if(Math.random()<0.006) spawnCloud();
  for(var i=S.clouds.length-1;i>=0;i--){
    var c=S.clouds[i];
    c.x-=(c.speed+S.speed*0.05);
    if(c.x<-80)S.clouds.splice(i,1);
  }

  S.nextSpawn-=S.speed;
  if(S.nextSpawn<=0){
    spawnObstacle();
    S.nextSpawn=Math.max(60,140+Math.random()*100+S.speed*6-S.score*0.005);
  }

  for(var j=S.obstacles.length-1;j>=0;j--){
    var o=S.obstacles[j];
    o.x-=S.speed;
    if(o.x+o.w<-20){S.obstacles.splice(j,1);continue;}
    var dinoBox=getDinoBox();
    var oBox={x:o.x+3,y:o.y+3,w:o.w-6,h:o.h-6};
    if(rectIntersect(dinoBox,oBox)){
      gameOver();
      return;
    }
  }

  for(var k=S.particles.length-1;k>=0;k--){
    var p=S.particles[k];
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=0.15;
    p.life--;
    if(p.life<=0)S.particles.splice(k,1);
  }

  S.groundOffset=(S.groundOffset+S.speed)%40;
}

function getDinoBox(){
  var d=S.dino;
  var duckAmt=d.duckT;
  var h=d.h*(1-duckAmt*0.45);
  var y=S.groundY-h;
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
  var skyGrad=ctx.createLinearGradient(0,0,0,H);
  skyGrad.addColorStop(0,'#0b141a');
  skyGrad.addColorStop(1,'#111b21');
  ctx.fillStyle=skyGrad;
  ctx.fillRect(0,0,W,H);

  // clouds
  S.clouds.forEach(function(c){
    ctx.fillStyle='rgba(134,150,160,0.15)';
    ctx.beginPath();
    ctx.arc(c.x,c.y,14*c.scale,0,Math.PI*2);
    ctx.arc(c.x+12*c.scale,c.y-4*c.scale,16*c.scale,0,Math.PI*2);
    ctx.arc(c.x+26*c.scale,c.y,14*c.scale,0,Math.PI*2);
    ctx.fill();
  });

  // ground line
  ctx.strokeStyle='#374248';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(0,S.groundY);
  ctx.lineTo(W,S.groundY);
  ctx.stroke();

  // ground dashes
  ctx.strokeStyle='#2a3942';
  ctx.lineWidth=1.5;
  for(var x=-S.groundOffset;x<W;x+=40){
    ctx.beginPath();
    ctx.moveTo(x,S.groundY+6);
    ctx.lineTo(x+16,S.groundY+6);
    ctx.stroke();
  }

  // particles
  S.particles.forEach(function(p){
    var a=p.life/p.maxLife;
    ctx.fillStyle='rgba(134,150,160,'+a.toFixed(2)+')';
    ctx.fillRect(p.x,p.y,p.size,p.size);
  });

  // obstacles
  S.obstacles.forEach(drawObstacle);

  // dino
  if(S.dino) drawDino(S.dino);
}

function drawObstacle(o){
  if(o.kind==='cactus-small'||o.kind==='cactus-big'||o.kind==='cactus-cluster'){
    ctx.fillStyle='#00a884';
    var count=o.kind==='cactus-cluster'?3:1;
    var cw=o.w/count;
    for(var i=0;i<count;i++){
      var cx=o.x+i*cw+cw/2;
      ctx.fillRect(cx-3,o.y,6,o.h);
      ctx.fillRect(cx-9,o.y+o.h*0.35,6,o.h*0.25);
      ctx.fillRect(cx+3,o.y+o.h*0.5,6,o.h*0.25);
      ctx.fillRect(cx-9,o.y+o.h*0.35,12,4);
      ctx.fillRect(cx+3,o.y+o.h*0.5,12,4);
    }
  } else if(o.kind==='rock'){
    ctx.fillStyle='#8696a0';
    ctx.beginPath();
    ctx.moveTo(o.x,o.y+o.h);
    ctx.lineTo(o.x+o.w*0.15,o.y+o.h*0.4);
    ctx.lineTo(o.x+o.w*0.5,o.y);
    ctx.lineTo(o.x+o.w*0.85,o.y+o.h*0.3);
    ctx.lineTo(o.x+o.w,o.y+o.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle='rgba(233,237,239,0.15)';
    ctx.beginPath();
    ctx.moveTo(o.x+o.w*0.5,o.y);
    ctx.lineTo(o.x+o.w*0.65,o.y+o.h*0.4);
    ctx.lineTo(o.x+o.w*0.5,o.y+o.h*0.6);
    ctx.closePath();
    ctx.fill();
  }
}

function drawDino(d){
  var duckAmt=d.duckT;
  var h=d.h*(1-duckAmt*0.45);
  var w=d.w+duckAmt*8;
  var y=S.groundY-h;
  var x=d.x;

  var bodyColor='#e9edef';
  var darkColor='#8696a0';

  // tail
  ctx.fillStyle=bodyColor;
  ctx.beginPath();
  ctx.moveTo(x,y+h*0.55);
  ctx.lineTo(x-8,y+h*0.5);
  ctx.lineTo(x-4,y+h*0.75);
  ctx.closePath();
  ctx.fill();

  // body
  ctx.fillStyle=bodyColor;
  roundRect(ctx,x,y+h*0.15,w*0.65,h*0.7,4);
  ctx.fill();

  // head
  var headW=w*0.55;
  var headH=h*0.5;
  var headX=x+w*0.35;
  var headY=y+h*0.05;
  ctx.fillStyle=bodyColor;
  roundRect(ctx,headX,headY,headW,headH,3);
  ctx.fill();

  // snout
  ctx.fillStyle=bodyColor;
  ctx.fillRect(headX+headW*0.6,headY+headH*0.5,headW*0.4,headH*0.3);

  // eye
  var eyeX=headX+headW*0.72;
  var eyeY=headY+headH*0.32;
  ctx.fillStyle='#0b141a';
  ctx.beginPath();
  ctx.arc(eyeX,eyeY,headH*0.14,0,Math.PI*2);
  ctx.fill();
  if(d.blinkT<6){
    ctx.fillStyle=bodyColor;
    ctx.fillRect(eyeX-headH*0.16,eyeY-1,headH*0.32,2);
  } else {
    ctx.fillStyle='#00a884';
    ctx.beginPath();
    ctx.arc(eyeX+1,eyeY,headH*0.06,0,Math.PI*2);
    ctx.fill();
  }

  // legs
  ctx.fillStyle=darkColor;
  if(d.onGround&&!d.ducking){
    var legOffset=d.legFrame===0?0:4;
    ctx.fillRect(x+w*0.35,y+h*0.8,4,h*0.2);
    ctx.fillRect(x+w*0.35+legOffset,y+h*0.8,4,h*0.2);
    ctx.fillRect(x+w*0.15,y+h*0.8,4,h*0.2);
    ctx.fillRect(x+w*0.15-legOffset,y+h*0.8,4,h*0.2);
  } else if(!d.onGround){
    ctx.fillRect(x+w*0.25,y+h*0.75,6,4);
    ctx.fillRect(x+w*0.45,y+h*0.75,6,4);
  } else {
    ctx.fillRect(x+w*0.3,y+h*0.85,6,4);
  }

  // arm
  ctx.fillStyle=darkColor;
  ctx.fillRect(x+w*0.55,y+h*0.45,6,3);
}

function roundRect(c,x,y,w,h,r){
  c.beginPath();
  c.moveTo(x+r,y);
  c.lineTo(x+w-r,y);
  c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r);
  c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h);
  c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r);
  c.quadraticCurveTo(x,y,x+r,y);
  c.closePath();
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
  S.groundOffset=0;
  S.dino=createDino();
  layout();
  scoreEl.textContent='0';
  speedEl.textContent='1.0x';
  startOverlay.classList.add('hidden');
  overOverlay.classList.add('hidden');
  hintMobile.textContent='Tap to jump';
  beep(440,0.08,'sine');
}

function gameOver(){
  S.running=false;
  S.over=true;
  beep(180,0.25,'sawtooth');

  var finalVal=Math.floor(S.score);
  finalScore.textContent=finalVal;
  if(finalVal>S.high){
    S.high=finalVal;
    try{localStorage.setItem('sila_dino_high',String(S.high));}catch(e){}
    bestMsg.textContent='🏆 New record! You beat your high score.';
  } else {
    bestMsg.textContent='Best: '+S.high;
  }
  highEl.textContent=S.high;
  overOverlay.classList.remove('hidden');
}

function restart(){
  startGame();
}

// ==== Main Loop ====
var lastTs=0;
function loop(ts){
  requestAnimationFrame(loop);
  var dt=Math.min(50,ts-lastTs);
  lastTs=ts;
  if(S.running){
    update();
  }
  draw();
}

// ==== Buttons ====
document.getElementById('startBtn').addEventListener('click',function(e){
  e.stopPropagation();
  startGame();
});
document.getElementById('retryBtn').addEventListener('click',function(e){
  e.stopPropagation();
  restart();
});
document.getElementById('resetBtn').addEventListener('click',function(e){
  e.stopPropagation();
  if(S.running||S.over) restart();
  else startGame();
});

// ==== Init ====
resizeCanvas();
S.dino=createDino();
layout();
highEl.textContent=S.high;
draw();
requestAnimationFrame(loop);

// Resume audio context on first interaction
document.addEventListener('touchstart',function initAudio(){
  try{
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') audioCtx.resume();
  }catch(e){}
  document.removeEventListener('touchstart',initAudio);
},{once:true,passive:true});

document.addEventListener('click',function initAudio2(){
  try{
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') audioCtx.resume();
  }catch(e){}
  document.removeEventListener('click',initAudio2);
},{once:true});

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