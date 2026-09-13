import { randomUUID } from 'crypto';

// ============================================
// HTML DINO RUN - BUTTON CONTROLS + SWIPE
// ============================================
const dinoHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{
  --card-2:#2a3942;
  --ink:#e9edef;
  --ink-soft:#aebac1;
  --muted:#8696a0;
  --accent:#00a884;
  --accent-2:#008069;
  --danger:#e05c5c;
  --line:#2a3942;
  --line-strong:#374248;
  --cell-bg:#111b21;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;}
html,body{
  background:transparent;color:var(--ink);font-family:var(--sys);
  min-height:100vh;overflow-x:hidden;
}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-bottom:14px;padding-bottom:12px;
  border-bottom:1px solid var(--line);
}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.stats{
  display:flex;justify-content:space-between;
  font-size:12px;color:var(--muted);margin-bottom:14px;
}
.stats b{color:var(--ink);font-weight:600;margin-left:4px;}
.stats b.hi{color:var(--accent);}
.wrap{
  background:var(--cell-bg);
  border:1px solid var(--line);
  border-radius:10px;
  padding:6px;
  position:relative;
  overflow:hidden;
}
canvas{display:block;width:100%;border-radius:6px;}
.hint{
  position:absolute;
  bottom:8px;left:0;right:0;
  text-align:center;
  font-size:10px;
  color:rgba(233,237,239,.4);
  pointer-events:none;
  letter-spacing:.03em;
}
.msg{
  text-align:center;font-size:14px;
  color:var(--danger);font-weight:600;
  margin-top:10px;min-height:18px;
}
.controls{
  display:flex;justify-content:center;
  margin-top:14px;gap:8px;
}
.btn-big{
  background:var(--card-2);
  border:1px solid var(--line-strong);
  border-radius:10px;
  color:var(--ink);
  font-size:13px;font-weight:700;
  padding:14px 20px;
  cursor:pointer;
  font-family:inherit;
  min-width:120px;
  display:flex;align-items:center;justify-content:center;gap:6px;
  transition:background .12s ease,transform .08s ease;
}
.btn-big:active{background:var(--accent);transform:scale(.97);color:#0b141a;}
.btn-big .icon{font-size:16px;}
.btn-big.jump:active{background:var(--accent);}
.btn-big.duck:active{background:var(--danger);}
.footer{
  margin-top:12px;display:flex;
  justify-content:center;gap:8px;
}
.footer__reset{
  background:none;border:none;
  color:var(--accent);font-family:inherit;
  font-size:13px;font-weight:500;cursor:pointer;
  padding:8px 16px;
}
.footer__reset:active{color:var(--ink);}

@media (max-width:380px){
  .btn-big{min-width:100px;padding:12px 14px;font-size:12px;}
  .header__title{font-size:15px;}
  .stats{font-size:11px;}
}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Dino</div>
      <div class="header__sub">Endless Run</div>
    </div>
    <div class="stats">
      <span>Score<b id="score">0</b></span>
      <span>Best<b id="best" class="hi">0</b></span>
      <span>Speed<b id="speed">1.0x</b></span>
    </div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="640" height="360"></canvas>
      <div class="hint" id="hint">Swipe up to jump</div>
    </div>
    <div class="msg" id="msg"></div>
    <div class="controls">
      <button class="btn-big jump" id="jumpBtn">
        <span class="icon">⬆</span> JUMP
      </button>
      <button class="btn-big duck" id="duckBtn">
        <span class="icon">⬇</span> DUCK
      </button>
    </div>
    <div class="footer">
      <button class="footer__reset" id="reset">Restart</button>
    </div>
  </div>
</main>
<script>
(function(){
'use strict';

var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var wrap=document.getElementById('wrap');
var scoreEl=document.getElementById('score');
var bestEl=document.getElementById('best');
var speedEl=document.getElementById('speed');
var msgEl=document.getElementById('msg');
var hintEl=document.getElementById('hint');

// Fixed internal resolution, CSS scales it
var W=640,H=360;
var GROUND_H=40;
var GROUND_Y=H-GROUND_H;
var DINO_W=44,DINO_H=48;
var DINO_X=60;

// ===== State =====
var state={
  running:false,
  over:false,
  score:0,
  best:0,
  speed:1,
  baseSpeed:5.5,
  maxSpeed:16,
  dino:null,
  obstacles:[],
  clouds:[],
  particles:[],
  frame:0,
  nextSpawn:0,
  jumpBuffer:0,
  groundOffset:0,
  audioCtx:null
};

try{
  state.best=parseInt(localStorage.getItem('sila_dino_best')||'0',10)||0;
}catch(e){state.best=0;}
bestEl.textContent=state.best;

// Physics - bigger jumps
var GRAVITY=0.9;
var JUMP_V=-17;       // stronger jump
var FAST_FALL=3.5;    // fast fall multiplier

// ===== Audio =====
function beep(freq,dur,type){
  try{
    if(!state.audioCtx){
      state.audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    }
    if(state.audioCtx.state==='suspended') state.audioCtx.resume();
    var o=state.audioCtx.createOscillator();
    var g=state.audioCtx.createGain();
    o.type=type||'square';
    o.frequency.value=freq;
    g.gain.value=0.04;
    g.gain.exponentialRampToValueAtTime(0.001,state.audioCtx.currentTime+dur);
    o.connect(g);g.connect(state.audioCtx.destination);
    o.start();
    o.stop(state.audioCtx.currentTime+dur);
  }catch(e){}
}

// ===== Dino =====
function createDino(){
  return {
    x:DINO_X,
    y:GROUND_Y-DINO_H,
    w:DINO_W,
    h:DINO_H,
    vy:0,
    onGround:true,
    ducking:false,
    duckT:0,
    legFrame:0,
    blinkT:Math.random()*200
  };
}

// ===== Obstacles =====
var TYPES=[
  {w:20,h:40,kind:'cactus-small'},
  {w:28,h:55,kind:'cactus-big'},
  {w:60,h:30,kind:'rock'},
  {w:38,h:48,kind:'cactus-cluster'}
];

function spawnObstacle(){
  var t=TYPES[Math.floor(Math.random()*TYPES.length)];
  var o={
    x:W+20,
    w:t.w,h:t.h,
    kind:t.kind
  };
  o.y=GROUND_Y-o.h;
  state.obstacles.push(o);
}
function spawnCloud(){
  state.clouds.push({
    x:W+30+Math.random()*60,
    y:20+Math.random()*(GROUND_Y*0.5),
    scale:0.7+Math.random()*0.5,
    speed:0.3+Math.random()*0.3
  });
}
function addDust(x,y){
  for(var i=0;i<3;i++){
    state.particles.push({
      x:x,y:y,
      vx:-1-Math.random()*2,
      vy:-Math.random()*1.5,
      life:20+Math.random()*15,
      maxLife:35,
      size:2+Math.random()*2
    });
  }
}

// ===== Controls =====
function doJump(){
  if(state.over){restart();return;}
  if(!state.running){startGame();return;}
  if(state.dino.onGround){
    state.dino.vy=JUMP_V;
    state.dino.onGround=false;
    beep(520,0.08,'square');
  } else {
    state.jumpBuffer=8;
  }
}
function doDuckStart(){
  if(!state.running||state.over||!state.dino) return;
  if(!state.dino.onGround){
    state.dino.vy=Math.max(state.dino.vy,GRAVITY*FAST_FALL);
  } else {
    state.dino.ducking=true;
  }
}
function doDuckEnd(){
  if(!state.dino) return;
  state.dino.ducking=false;
}

// Button handlers
document.getElementById('jumpBtn').addEventListener('click',function(e){
  e.preventDefault();
  e.stopPropagation();
  doJump();
});
document.getElementById('duckBtn').addEventListener('click',function(e){
  e.preventDefault();
  e.stopPropagation();
  doDuckStart();
  setTimeout(doDuckEnd,300);
});

// Tap the canvas to jump
wrap.addEventListener('click',function(e){
  // ignore if clicked on hint
  if(e.target===hintEl) return;
  doJump();
});

// Swipe gestures (like Snake)
var sx=0,sy=0,swiping=false;
wrap.addEventListener('touchstart',function(e){
  if(e.touches.length!==1) return;
  sx=e.touches[0].clientX;
  sy=e.touches[0].clientY;
  swiping=true;
},{passive:true});
wrap.addEventListener('touchend',function(e){
  if(!swiping) return;
  swiping=false;
  var dx=e.changedTouches[0].clientX-sx;
  var dy=e.changedTouches[0].clientY-sy;
  if(Math.max(Math.abs(dx),Math.abs(dy))<24){
    // small tap -> jump
    doJump();
    return;
  }
  if(dy<0&&Math.abs(dy)>Math.abs(dx)){
    // swipe up -> jump
    doJump();
  } else if(dy>0&&Math.abs(dy)>Math.abs(dx)){
    // swipe down -> duck
    doDuckStart();
    setTimeout(doDuckEnd,300);
  }
},{passive:true});

// Keyboard (still nice for desktop)
document.addEventListener('keydown',function(e){
  if(e.key===' '||e.key==='ArrowUp'||e.key==='w'||e.key==='W'){
    e.preventDefault();doJump();
  } else if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){
    e.preventDefault();doDuckStart();
  }
});
document.addEventListener('keyup',function(e){
  if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){
    doDuckEnd();
  }
});

// ===== Update =====
function update(){
  if(!state.running) return;
  state.frame++;

  state.speed=Math.min(state.maxSpeed,state.baseSpeed+state.score*0.001);
  speedEl.textContent=state.speed.toFixed(1)+'x';

  state.score+=0.35*state.speed;
  scoreEl.textContent=Math.floor(state.score);

  var d=state.dino;
  if(!d.onGround){
    d.vy+=GRAVITY;
    d.y+=d.vy;
    if(state.jumpBuffer>0&&d.vy>-2){
      d.vy=JUMP_V;state.jumpBuffer=0;
    }
    var groundLevel=GROUND_Y-d.h;
    if(d.y>=groundLevel){
      d.y=groundLevel;d.vy=0;d.onGround=true;
      addDust(d.x+d.w/2,GROUND_Y);
    }
  }
  if(state.jumpBuffer>0)state.jumpBuffer--;

  if(d.onGround){
    d.legFrame=Math.floor(state.frame/6)%2;
    if(state.frame%4===0&&Math.random()<0.3){
      addDust(d.x+4,GROUND_Y);
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
  for(var i=state.clouds.length-1;i>=0;i--){
    var c=state.clouds[i];
    c.x-=(c.speed+state.speed*0.05);
    if(c.x<-80)state.clouds.splice(i,1);
  }

  state.nextSpawn-=state.speed;
  if(state.nextSpawn<=0){
    spawnObstacle();
    state.nextSpawn=Math.max(70,150+Math.random()*100+state.speed*6-state.score*0.005);
  }

  for(var j=state.obstacles.length-1;j>=0;j--){
    var o=state.obstacles[j];
    o.x-=state.speed;
    if(o.x+o.w<-20){state.obstacles.splice(j,1);continue;}
    var dinoBox=getDinoBox();
    var oBox={x:o.x+3,y:o.y+3,w:o.w-6,h:o.h-6};
    if(rectIntersect(dinoBox,oBox)){
      gameOver();
      return;
    }
  }

  for(var k=state.particles.length-1;k>=0;k--){
    var p=state.particles[k];
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=0.15;
    p.life--;
    if(p.life<=0)state.particles.splice(k,1);
  }

  state.groundOffset=(state.groundOffset+state.speed)%40;
}

function getDinoBox(){
  var d=state.dino;
  var duckAmt=d.duckT;
  var h=d.h*(1-duckAmt*0.45);
  var y=GROUND_Y-h;
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

// ===== Draw =====
function draw(){
  var skyGrad=ctx.createLinearGradient(0,0,0,H);
  skyGrad.addColorStop(0,'#0b141a');
  skyGrad.addColorStop(1,'#111b21');
  ctx.fillStyle=skyGrad;
  ctx.fillRect(0,0,W,H);

  // clouds
  state.clouds.forEach(function(c){
    ctx.fillStyle='rgba(134,150,160,0.15)';
    ctx.beginPath();
    ctx.arc(c.x,c.y,18*c.scale,0,Math.PI*2);
    ctx.arc(c.x+16*c.scale,c.y-6*c.scale,20*c.scale,0,Math.PI*2);
    ctx.arc(c.x+34*c.scale,c.y,18*c.scale,0,Math.PI*2);
    ctx.fill();
  });

  // ground line
  ctx.strokeStyle='#374248';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(0,GROUND_Y);
  ctx.lineTo(W,GROUND_Y);
  ctx.stroke();

  // ground dashes
  ctx.strokeStyle='#2a3942';
  ctx.lineWidth=1.5;
  for(var x=-state.groundOffset;x<W;x+=40){
    ctx.beginPath();
    ctx.moveTo(x,GROUND_Y+8);
    ctx.lineTo(x+18,GROUND_Y+8);
    ctx.stroke();
  }

  // particles
  state.particles.forEach(function(p){
    var a=p.life/p.maxLife;
    ctx.fillStyle='rgba(134,150,160,'+a.toFixed(2)+')';
    ctx.fillRect(p.x,p.y,p.size,p.size);
  });

  // obstacles
  state.obstacles.forEach(drawObstacle);

  // dino
  if(state.dino) drawDino(state.dino);
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
  var w=d.w+duckAmt*10;
  var y=GROUND_Y-h;
  var x=d.x;

  var bodyColor='#e9edef';
  var darkColor='#8696a0';

  // tail
  ctx.fillStyle=bodyColor;
  ctx.beginPath();
  ctx.moveTo(x,y+h*0.55);
  ctx.lineTo(x-10,y+h*0.5);
  ctx.lineTo(x-5,y+h*0.78);
  ctx.closePath();
  ctx.fill();

  // body
  ctx.fillStyle=bodyColor;
  roundRect(ctx,x,y+h*0.15,w*0.65,h*0.7,5);
  ctx.fill();

  // head
  var headW=w*0.55;
  var headH=h*0.5;
  var headX=x+w*0.35;
  var headY=y+h*0.05;
  ctx.fillStyle=bodyColor;
  roundRect(ctx,headX,headY,headW,headH,4);
  ctx.fill();

  // snout
  ctx.fillStyle=bodyColor;
  ctx.fillRect(headX+headW*0.6,headY+headH*0.5,headW*0.4,headH*0.3);

  // eye
  var eyeX=headX+headW*0.72;
  var eyeY=headY+headH*0.32;
  ctx.fillStyle='#0b141a';
  ctx.beginPath();
  ctx.arc(eyeX,eyeY,headH*0.15,0,Math.PI*2);
  ctx.fill();
  if(d.blinkT<6){
    ctx.fillStyle=bodyColor;
    ctx.fillRect(eyeX-headH*0.17,eyeY-1,headH*0.34,2);
  } else {
    ctx.fillStyle='#00a884';
    ctx.beginPath();
    ctx.arc(eyeX+1,eyeY,headH*0.07,0,Math.PI*2);
    ctx.fill();
  }

  // legs
  ctx.fillStyle=darkColor;
  if(d.onGround&&!d.ducking){
    var legOffset=d.legFrame===0?0:5;
    ctx.fillRect(x+w*0.35,y+h*0.8,5,h*0.2);
    ctx.fillRect(x+w*0.35+legOffset,y+h*0.8,5,h*0.2);
    ctx.fillRect(x+w*0.15,y+h*0.8,5,h*0.2);
    ctx.fillRect(x+w*0.15-legOffset,y+h*0.8,5,h*0.2);
  } else if(!d.onGround){
    ctx.fillRect(x+w*0.25,y+h*0.75,7,5);
    ctx.fillRect(x+w*0.45,y+h*0.75,7,5);
  } else {
    ctx.fillRect(x+w*0.3,y+h*0.85,7,5);
  }

  // arm
  ctx.fillStyle=darkColor;
  ctx.fillRect(x+w*0.55,y+h*0.45,7,4);
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

// ===== Game Flow =====
function startGame(){
  state.running=true;
  state.over=false;
  state.score=0;
  state.frame=0;
  state.speed=state.baseSpeed;
  state.obstacles=[];
  state.clouds=[];
  state.particles=[];
  state.nextSpawn=60;
  state.jumpBuffer=0;
  state.groundOffset=0;
  state.dino=createDino();
  scoreEl.textContent='0';
  speedEl.textContent='1.0x';
  msgEl.textContent='';
  hintEl.textContent='Tap or Swipe up to jump';
  beep(440,0.08,'sine');
}

function gameOver(){
  state.running=false;
  state.over=true;
  beep(180,0.25,'sawtooth');

  var finalVal=Math.floor(state.score);
  if(finalVal>state.best){
    state.best=finalVal;
    try{localStorage.setItem('sila_dino_best',String(state.best));}catch(e){}
    bestEl.textContent=state.best;
    msgEl.textContent='🏆 New best! '+finalVal+' points';
  } else {
    msgEl.textContent='Game over — '+finalVal+' points · Tap JUMP to retry';
  }
  hintEl.textContent='Tap JUMP to play again';
}

function restart(){
  startGame();
}

document.getElementById('reset').addEventListener('click',function(e){
  e.preventDefault();e.stopPropagation();
  restart();
});

// ===== Main Loop =====
var lastTs=0;
function loop(ts){
  requestAnimationFrame(loop);
  var dt=Math.min(50,ts-lastTs);
  lastTs=ts;
  if(state.running){
    update();
  }
  draw();
}

// Init
state.dino=createDino();
draw();
requestAnimationFrame(loop);

// Resume audio on first touch
document.addEventListener('touchstart',function initA(){
  try{
    if(!state.audioCtx) state.audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(state.audioCtx.state==='suspended') state.audioCtx.resume();
  }catch(e){}
  document.removeEventListener('touchstart',initA);
},{once:true,passive:true});

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
  description: '🦖 Play Dino Run in WhatsApp',
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
                  messageText: "🦖 Dino Run"
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