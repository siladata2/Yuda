const strikeopsHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{--card-2:#2a3942;--ink:#e9edef;--muted:#8696a0;--accent:#00a884;--line:#2a3942;--cell-bg:#111b21;
--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow:hidden;touch-action:none;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.bars{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.barwrap{flex:1;height:10px;background:var(--cell-bg);border:1px solid var(--line);border-radius:6px;overflow:hidden;}
.bar{height:100%;width:100%;background:var(--accent);transition:width .15s ease;}
.tag{font-size:11px;color:var(--muted);width:30px;}
.stats{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:10px;}
.stats b{color:var(--ink);font-weight:600;margin-left:4px;}
.wrap{position:relative;background:#141c14;border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,.6);}
canvas{display:block;width:100%;}
.overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(11,20,26,0.82);}
.overlay h2{font-size:19px;text-align:center;padding:0 16px;}
.overlay p{font-size:12px;color:var(--muted);text-align:center;padding:0 20px;}
.overlay button{background:var(--accent);border:none;border-radius:8px;color:#0b141a;font-weight:700;font-family:inherit;padding:10px 22px;font-size:14px;cursor:pointer;}
.controls{display:grid;grid-template-columns:repeat(3,1fr) auto auto;gap:6px;margin-top:12px;align-items:center;}
.pad{display:grid;grid-template-columns:repeat(3,36px);grid-template-rows:repeat(3,36px);gap:3px;grid-column:span 3;}
.pad button{background:var(--card-2);border:1px solid #374248;border-radius:6px;color:var(--ink);font-size:13px;cursor:pointer;}
.pad button:active{background:var(--accent);}
.actions{display:flex;flex-direction:column;gap:6px;grid-column:span 2;}
.fire{background:#e05c5c;border:none;border-radius:8px;color:#fff;font-weight:700;font-family:inherit;padding:12px 0;font-size:13px;cursor:pointer;}
.fire:active{background:#b84444;}
.reload{background:var(--card-2);border:1px solid #374248;border-radius:8px;color:var(--ink);font-family:inherit;padding:8px 0;font-size:11px;cursor:pointer;}
.hint{font-size:10px;color:var(--muted);text-align:center;margin-top:8px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Strike Ops</div>
      <div class="header__sub">Wave defense</div>
    </div>
    <div class="bars">
      <span class="tag">HP</span>
      <div class="barwrap"><div class="bar" id="hp"></div></div>
    </div>
    <div class="stats">
      <span>Score<b id="score">0</b></span>
      <span>Wave<b id="wave">1</b></span>
      <span>Ammo<b id="ammo">12/12</b></span>
      <span>Best<b id="best">0</b></span>
    </div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="340"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Strike Ops</h2>
        <p id="ov-sub">Hold enemies off as long as you can. Auto-aims at the nearest target.</p>
        <button id="ov-btn">Deploy</button>
      </div>
    </div>
    <div class="controls">
      <div class="pad">
        <span></span><button id="up">▲</button><span></span>
        <button id="left">◀</button><span></span><button id="right">▶</button>
        <span></span><button id="down">▼</button><span></span>
      </div>
      <div class="actions">
        <button class="fire" id="fire">🔫 FIRE</button>
        <button class="reload" id="reload">RELOAD</button>
      </div>
    </div>
    <div class="hint">Move with the pad, hold FIRE to shoot the nearest enemy</div>
  </div>
</main>
<script>
(function(){
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const W=canvas.width,H=canvas.height;
const overlay=document.getElementById('overlay');
const ovTitle=document.getElementById('ov-title');
const ovSub=document.getElementById('ov-sub');
const ovBtn=document.getElementById('ov-btn');
const hpEl=document.getElementById('hp');
const scoreEl=document.getElementById('score');
const waveEl=document.getElementById('wave');
const ammoEl=document.getElementById('ammo');
const bestEl=document.getElementById('best');
const MAG=12;
let player,enemies,bullets,particles,move,firing,reloading,best=0,running=false,frame=0;
let score,wave,killsThisWave,ammo,reloadTimer;

function reset(){
  player={x:W/2,y:H/2,r:11,hp:100,speed:2.4,fireCd:0};
  enemies=[];bullets=[];particles=[];
  move={x:0,y:0};firing=false;reloading=false;
  score=0;wave=1;killsThisWave=0;ammo=MAG;reloadTimer=0;frame=0;
  updateHUD();
}
function updateHUD(){
  hpEl.style.width=Math.max(0,player.hp)+'%';
  scoreEl.textContent=score;
  waveEl.textContent=wave;
  ammoEl.textContent=(reloading?'...':ammo)+'/'+MAG;
}
function start(){
  reset();running=true;overlay.style.display='none';loop();
}
function gameOver(){
  running=false;
  if(score>best) best=score;
  bestEl.textContent=best;
  ovTitle.textContent='Overrun! Score '+score;
  ovSub.textContent='Wave '+wave+' — kills: '+score;
  ovBtn.textContent='Redeploy';
  overlay.style.display='flex';
}
function spawnEnemy(){
  const side=Math.floor(Math.random()*4);
  let x,y;
  if(side===0){x=Math.random()*W;y=-20;}
  else if(side===1){x=Math.random()*W;y=H+20;}
  else if(side===2){x=-20;y=Math.random()*H;}
  else {x=W+20;y=Math.random()*H;}
  const hard=Math.random()<Math.min(0.5,0.1+wave*0.04);
  enemies.push({x,y,r:hard?13:10,hp:hard?3:1,maxHp:hard?3:1,speed:hard?1.0:1.4+Math.random()*0.4,hard});
}
function nearestEnemy(){
  let best=null,bd=Infinity;
  for(const e of enemies){
    const d=Math.hypot(e.x-player.x,e.y-player.y);
    if(d<bd){bd=d;best=e;}
  }
  return best;
}
function tryFire(){
  if(reloading||ammo<=0||player.fireCd>0) return;
  const target=nearestEnemy();
  if(!target) return;
  const dx=target.x-player.x,dy=target.y-player.y;
  const len=Math.hypot(dx,dy)||1;
  bullets.push({x:player.x,y:player.y,vx:dx/len*7,vy:dy/len*7,life:60});
  ammo--;
  player.fireCd=8;
  updateHUD();
  particles.push({x:player.x+dx/len*14,y:player.y+dy/len*14,r:6,life:1,type:'flash'});
  if(ammo<=0) startReload();
}
function startReload(){
  if(reloading) return;
  reloading=true;
  updateHUD();
  reloadTimer=90;
}
function update(){
  frame++;
  if(player.fireCd>0) player.fireCd--;
  if(reloading){
    reloadTimer--;
    if(reloadTimer<=0){ reloading=false; ammo=MAG; updateHUD(); }
  }
  if(firing) tryFire();
  player.x+=move.x*player.speed;
  player.y+=move.y*player.speed;
  player.x=Math.max(player.r,Math.min(W-player.r,player.x));
  player.y=Math.max(player.r,Math.min(H-player.r,player.y));
  const spawnRate=Math.max(22,60-wave*4);
  if(frame%spawnRate===0) spawnEnemy();
  enemies.forEach(e=>{
    const dx=player.x-e.x,dy=player.y-e.y;
    const len=Math.hypot(dx,dy)||1;
    e.x+=dx/len*e.speed;
    e.y+=dy/len*e.speed;
  });
  bullets.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.life--;});
  bullets=bullets.filter(b=>b.life>0&&b.x>-10&&b.x<W+10&&b.y>-10&&b.y<H+10);
  for(const b of bullets){
    for(const e of enemies){
      if(Math.hypot(b.x-e.x,b.y-e.y)<e.r){
        e.hp--;
        b.life=0;
        particles.push({x:e.x,y:e.y,r:e.r,life:1,type:'spark'});
        break;
      }
    }
  }
  bullets=bullets.filter(b=>b.life>0);
  const before=enemies.length;
  enemies.forEach(e=>{ if(e.hp<=0){ score+=e.hard?3:1; killsThisWave++; } });
  enemies=enemies.filter(e=>e.hp>0);
  if(before!==enemies.length) updateHUD();
  for(const e of enemies){
    if(Math.hypot(e.x-player.x,e.y-player.y)<e.r+player.r){
      player.hp-=e.hard?0.7:0.4;
      e.hp=0;
      particles.push({x:e.x,y:e.y,r:e.r,life:1,type:'spark'});
    }
  }
  enemies=enemies.filter(e=>e.hp>0);
  if(player.hp<=0){ updateHUD(); return gameOver(); }
  if(killsThisWave>=8+wave*2){
    wave++;killsThisWave=0;updateHUD();
  }
  particles.forEach(p=>p.life-=0.08);
  particles=particles.filter(p=>p.life>0);
}
function roundRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}
function draw(){
  ctx.fillStyle='#151f16';
  ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
  for(let x=0;x<W;x+=28){ ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke(); }
  for(let y=0;y<H;y+=28){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); }
  bullets.forEach(b=>{
    ctx.strokeStyle='#f2c265';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(b.x,b.y);
    ctx.lineTo(b.x-b.vx*1.6,b.y-b.vy*1.6);
    ctx.stroke();
  });
  enemies.forEach(e=>{
    ctx.save();
    ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=6;
    ctx.fillStyle=e.hard?'#c1473f':'#e05c5c';
    ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    if(e.maxHp>1){
      ctx.fillStyle='#0b141a';
      ctx.fillRect(e.x-e.r,e.y-e.r-8,e.r*2,3);
      ctx.fillStyle='#f2c265';
      ctx.fillRect(e.x-e.r,e.y-e.r-8,e.r*2*(e.hp/e.maxHp),3);
    }
    ctx.restore();
  });
  particles.forEach(p=>{
    ctx.globalAlpha=Math.max(0,p.life);
    if(p.type==='flash'){
      ctx.fillStyle='#fff6c8';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);ctx.fill();
    } else {
      ctx.fillStyle='#f2c265';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*(1.4-p.life),0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  });
  ctx.save();
  ctx.translate(player.x,player.y);
  const target=nearestEnemy();
  let ang=0;
  if(target) ang=Math.atan2(target.y-player.y,target.x-player.x);
  ctx.rotate(ang);
  ctx.strokeStyle='#8696a0';ctx.lineWidth=4;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,0);ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=8;
  ctx.fillStyle='#00c2a0';
  ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function loop(){
  if(!running) return;
  update();
  if(running){draw();requestAnimationFrame(loop);}
}
function setMove(x,y){ move.x=x;move.y=y; }
const upB=document.getElementById('up'),downB=document.getElementById('down');
const leftB=document.getElementById('left'),rightB=document.getElementById('right');
function bindHold(el,fn,release){
  el.addEventListener('pointerdown',fn);
  el.addEventListener('pointerup',release);
  el.addEventListener('pointerleave',release);
}
bindHold(upB,()=>setMove(move.x,-1),()=>setMove(move.x,move.y<0?0:move.y));
bindHold(downB,()=>setMove(move.x,1),()=>setMove(move.x,move.y>0?0:move.y));
bindHold(leftB,()=>setMove(-1,move.y),()=>setMove(move.x<0?0:move.x,move.y));
bindHold(rightB,()=>setMove(1,move.y),()=>setMove(move.x>0?0:move.x,move.y));
document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowUp') move.y=-1;
  if(e.key==='ArrowDown') move.y=1;
  if(e.key==='ArrowLeft') move.x=-1;
  if(e.key==='ArrowRight') move.x=1;
  if(e.code==='Space') firing=true;
});
document.addEventListener('keyup',(e)=>{
  if(e.key==='ArrowUp'&&move.y<0) move.y=0;
  if(e.key==='ArrowDown'&&move.y>0) move.y=0;
  if(e.key==='ArrowLeft'&&move.x<0) move.x=0;
  if(e.key==='ArrowRight'&&move.x>0) move.x=0;
  if(e.code==='Space') firing=false;
});
const fireB=document.getElementById('fire');
fireB.addEventListener('pointerdown',()=>{firing=true;});
fireB.addEventListener('pointerup',()=>{firing=false;});
fireB.addEventListener('pointerleave',()=>{firing=false;});
document.getElementById('reload').addEventListener('click',startReload);
ovBtn.addEventListener('click',start);
reset();
draw();
})();
</script>
</body>
</html>
`;

export default {
  name: 'strikeops',
  alias: ['sos', 'vita', 'shooter'],
  description: 'Play SILA Strike Ops — top-down wave shooter in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-strikeops-' + Date.now();
      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: "0cCzjnQ5ERoqM2QrQ7KjmMfxsyeWYu+61/chr2wioyE=",
          botMetadata: { messageDisclaimerText: "", botResponseId: responseId }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: "🔫 SILA Strike Ops" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": strikeopsHtml,
                        "trusted_sources": ["sila-tech"]
                      },
                      "__typename": "GenAISingleLayoutViewModel"
                    }
                  }]
                })).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                forwardOrigin: 4
              }
            }
          }
        }
      };
      await sock.relayMessage(sender, content, {});
    } catch (error) {
      console.error('[STRIKEOPS]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
