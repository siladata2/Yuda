const offroadHtml = `
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
.stats{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:14px;}
.stats b{color:var(--ink);font-weight:600;margin-left:4px;}
.wrap{position:relative;background:#0b141a;border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,.6);}
canvas{display:block;width:100%;}
.overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(11,20,26,0.78);}
.overlay h2{font-size:19px;text-align:center;padding:0 16px;}
.overlay button{background:var(--accent);border:none;border-radius:8px;color:#0b141a;font-weight:700;font-family:inherit;padding:10px 22px;font-size:14px;cursor:pointer;}
.controls{display:flex;justify-content:space-between;margin-top:12px;gap:10px;}
.ctrl{flex:1;background:var(--card-2);border:1px solid var(--line);border-radius:10px;padding:14px 0;text-align:center;font-size:20px;color:var(--ink);cursor:pointer;}
.ctrl:active{background:var(--accent);}
.hint{font-size:11px;color:var(--muted);text-align:center;margin-top:8px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Off-Road Rally</div>
      <div class="header__sub">Desert dash</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Best<b id="best">0</b></span><span>Speed<b id="spd">1x</b></span></div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="440"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Off-Road Rally</h2>
        <button id="ov-btn">Start Rally</button>
      </div>
    </div>
    <div class="controls">
      <div class="ctrl" id="left">◀</div>
      <div class="ctrl" id="right">▶</div>
    </div>
    <div class="hint">Swipe or tap — hit ramps for bonus, dodge rocks & cacti</div>
  </div>
</main>
<script>
(function(){
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const W=canvas.width,H=canvas.height;
const overlay=document.getElementById('overlay');
const ovTitle=document.getElementById('ov-title');
const ovBtn=document.getElementById('ov-btn');
const roadL=W*0.1,roadR=W*0.9,roadW=roadR-roadL,lanes=3,laneW=roadW/lanes;
let player,obs,ramps,dust,score,best=0,running=false,frame=0,speed=5,bump=0,dashOffset=0;

function laneX(i){return roadL+laneW*i+laneW/2;}
function reset(){
  player={targetLane:1,x:laneX(1),y:H-90,w:32,h:52,bounce:0};
  obs=[];ramps=[];dust=[];score=0;frame=0;speed=5;
  document.getElementById('score').textContent='0';
  document.getElementById('spd').textContent='1x';
}
function start(){reset();running=true;overlay.style.display='none';loop();}
function gameOver(){
  running=false;
  if(score>best) best=score;
  document.getElementById('best').textContent=best;
  ovTitle.textContent='Wrecked! Score '+score;
  ovBtn.textContent='Try again';
  overlay.style.display='flex';
}
function moveLane(dir){
  if(!running) return;
  player.targetLane=Math.max(0,Math.min(lanes-1,player.targetLane+dir));
}
function spawnObs(){
  const lane=Math.floor(Math.random()*lanes);
  const type=Math.random()<0.5?'rock':'cactus';
  obs.push({lane,x:laneX(lane),y:-60,type});
}
function spawnRamp(){
  const lane=Math.floor(Math.random()*lanes);
  ramps.push({lane,x:laneX(lane),y:-50,taken:false});
}
function spawnDust(){
  dust.push({x:player.x+(Math.random()-0.5)*22,y:player.y+22,life:1,vx:(Math.random()-0.5)*1.5});
}
function update(){
  frame++;
  score=Math.floor(frame/6);
  document.getElementById('score').textContent=score;
  speed=5+Math.min(6,score*0.018);
  document.getElementById('spd').textContent=(speed/5).toFixed(1)+'x';
  dashOffset=(dashOffset+speed)%36;
  player.x+=(laneX(player.targetLane)-player.x)*0.25;
  player.bounce=Math.sin(frame*0.4)*2;
  if(frame%Math.max(30,55-Math.floor(score/2))===0) spawnObs();
  if(frame%110===0) spawnRamp();
  if(frame%3===0) spawnDust();
  obs.forEach(o=>o.y+=speed);
  obs=obs.filter(o=>o.y<H+50);
  ramps.forEach(r=>r.y+=speed);
  ramps=ramps.filter(r=>r.y<H+40&&!r.taken);
  dust.forEach(d=>{d.life-=0.05;d.y+=1.5;d.x+=d.vx;});
  dust=dust.filter(d=>d.life>0);
  for(const o of obs){
    const w=o.type==='rock'?26:20;
    if(Math.abs(o.x-player.x)<w/2+12&&Math.abs(o.y-player.y)<w/2+16){
      return gameOver();
    }
  }
  for(const r of ramps){
    if(!r.taken&&Math.abs(r.x-player.x)<20&&Math.abs(r.y-player.y)<22){
      r.taken=true;score+=15;document.getElementById('score').textContent=score;
    }
  }
}
function roundRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}
function draw(){
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#5a3a2a');
  sky.addColorStop(0.4,'#8a5a3a');
  sky.addColorStop(0.55,'#3a2a20');
  sky.addColorStop(1,'#1a1510');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2e2418';
  ctx.fillRect(0,0,roadL,H);
  ctx.fillRect(roadR,0,W-roadR,H);
  const road=ctx.createLinearGradient(0,0,0,H);
  road.addColorStop(0,'#8a6a44');road.addColorStop(1,'#5a4028');
  ctx.fillStyle=road;
  ctx.fillRect(roadL,0,roadW,H);
  ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=2;
  ctx.setLineDash([14,14]);ctx.lineDashOffset=-dashOffset;
  for(let i=1;i<lanes;i++){
    const x=roadL+laneW*i;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.strokeStyle='#e05c5c';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(roadL,0);ctx.lineTo(roadL,H);ctx.stroke();
  ctx.beginPath();ctx.moveTo(roadR,0);ctx.lineTo(roadR,H);ctx.stroke();
  dust.forEach(d=>{
    ctx.globalAlpha=Math.max(0,d.life)*0.5;
    ctx.fillStyle='#d9c4a0';
    ctx.beginPath();ctx.arc(d.x,d.y,7*(1.5-d.life),0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  });
  ramps.forEach(r=>{
    ctx.fillStyle='#f2c265';
    ctx.beginPath();
    ctx.moveTo(r.x-18,r.y+10);ctx.lineTo(r.x+18,r.y+10);ctx.lineTo(r.x,r.y-14);
    ctx.closePath();ctx.fill();
  });
  obs.forEach(o=>{
    ctx.save();
    ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=6;ctx.shadowOffsetY=3;
    if(o.type==='rock'){
      const grad=ctx.createLinearGradient(o.x-14,o.y-12,o.x+14,o.y+12);
      grad.addColorStop(0,'#8a8478');grad.addColorStop(1,'#4a4640');
      ctx.fillStyle=grad;
      ctx.beginPath();ctx.arc(o.x,o.y,14,0,Math.PI*2);ctx.fill();
    } else {
      ctx.fillStyle='#2f6e3a';
      roundRect(o.x-5,o.y-16,10,32,4);ctx.fill();
      roundRect(o.x-14,o.y-6,10,16,4);ctx.fill();
      roundRect(o.x+4,o.y-10,10,16,4);ctx.fill();
    }
    ctx.restore();
  });
  ctx.save();
  ctx.translate(player.x,player.y+player.bounce);
  ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=8;ctx.shadowOffsetY=4;
  const grad=ctx.createLinearGradient(-16,-26,16,26);
  grad.addColorStop(0,'#f2a13f');grad.addColorStop(1,'#7a4a10');
  ctx.fillStyle=grad;
  roundRect(-16,-26,32,52,8);ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(20,30,38,0.85)';
  roundRect(-12,-18,24,18,4);ctx.fill();
  ctx.fillStyle='#fff6c8';
  ctx.shadowColor='#fff6c8';ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(-9,-24,2.4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(9,-24,2.4,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function loop(){
  if(!running) return;
  update();
  if(running){draw();requestAnimationFrame(loop);}
}
document.getElementById('left').addEventListener('click',()=>moveLane(-1));
document.getElementById('right').addEventListener('click',()=>moveLane(1));
document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowLeft') moveLane(-1);
  if(e.key==='ArrowRight') moveLane(1);
});
let sx=0;
document.getElementById('wrap').addEventListener('touchstart',(e)=>{sx=e.touches[0].clientX;});
document.getElementById('wrap').addEventListener('touchend',(e)=>{
  const dx=e.changedTouches[0].clientX-sx;
  if(Math.abs(dx)>30) moveLane(dx>0?1:-1);
});
ovBtn.addEventListener('click',start);
draw();
})();
</script>
</body>
</html>
`;

export default {
  name: 'offroad',
  alias: ['offroadrally', 'jangwa'],
  description: 'Play Off-Road Rally racing game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-offroad-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🏜️ Off-Road Rally" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": offroadHtml,
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
      console.error('[OFFROAD]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
