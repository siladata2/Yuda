const starHtml = `
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
.wrap{position:relative;background:#020308;border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,.6);}
canvas{display:block;width:100%;}
.overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(2,3,8,0.8);}
.overlay h2{font-size:19px;text-align:center;padding:0 16px;color:#7dfcff;text-shadow:0 0 10px #7dfcff;}
.overlay button{background:#7dfcff;border:none;border-radius:8px;color:#021018;font-weight:700;font-family:inherit;padding:10px 22px;font-size:14px;cursor:pointer;}
.controls{display:flex;justify-content:space-between;margin-top:12px;gap:10px;}
.ctrl{flex:1;background:var(--card-2);border:1px solid #3a5a6e;border-radius:10px;padding:14px 0;text-align:center;font-size:20px;color:#7dfcff;cursor:pointer;}
.ctrl:active{background:#0d3a44;}
.hint{font-size:11px;color:var(--muted);text-align:center;margin-top:8px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Star Racer</div>
      <div class="header__sub">Hover circuit</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Best<b id="best">0</b></span><span>Speed<b id="spd">1x</b></span></div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="440"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Star Racer</h2>
        <button id="ov-btn">Launch</button>
      </div>
    </div>
    <div class="controls">
      <div class="ctrl" id="left">◀</div>
      <div class="ctrl" id="right">▶</div>
    </div>
    <div class="hint">Swipe or tap arrows to dodge asteroids</div>
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
const roadL=W*0.16,roadR=W*0.84,roadW=roadR-roadL,lanes=3,laneW=roadW/lanes;
let player,rocks,stars,trail,score,best=0,running=false,frame=0,speed=5.4,dashOffset=0;

function laneX(i){return roadL+laneW*i+laneW/2;}
function initStars(){
  stars=[];
  for(let i=0;i<70;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+0.4,s:0.5+Math.random()*1.5});
}
function reset(){
  player={targetLane:1,x:laneX(1),y:H-90,w:28,h:44};
  rocks=[];trail=[];score=0;frame=0;speed=5.4;
  document.getElementById('score').textContent='0';
  document.getElementById('spd').textContent='1x';
}
function start(){reset();running=true;overlay.style.display='none';loop();}
function gameOver(){
  running=false;
  if(score>best) best=score;
  document.getElementById('best').textContent=best;
  ovTitle.textContent='Hull breach! Score '+score;
  ovBtn.textContent='Relaunch';
  overlay.style.display='flex';
}
function moveLane(dir){
  if(!running) return;
  player.targetLane=Math.max(0,Math.min(lanes-1,player.targetLane+dir));
}
function spawnRock(){
  const lane=Math.floor(Math.random()*lanes);
  rocks.push({lane,x:laneX(lane),y:-60,r:14+Math.random()*10,rot:Math.random()*Math.PI});
}
function update(){
  frame++;
  score=Math.floor(frame/6);
  document.getElementById('score').textContent=score;
  speed=5.4+Math.min(6,score*0.018);
  document.getElementById('spd').textContent=(speed/5.4).toFixed(1)+'x';
  dashOffset=(dashOffset+speed)%40;
  player.x+=(laneX(player.targetLane)-player.x)*0.28;
  stars.forEach(s=>{s.y+=s.s*(speed/5.4);if(s.y>H){s.y=0;s.x=Math.random()*W;}});
  if(frame%Math.max(26,50-Math.floor(score/2))===0) spawnRock();
  rocks.forEach(r=>{r.y+=speed;r.rot+=0.05;});
  rocks=rocks.filter(r=>r.y<H+60);
  trail.push({x:player.x,y:player.y+18,life:1});
  trail.forEach(t=>t.life-=0.06);
  trail=trail.filter(t=>t.life>0);
  for(const r of rocks){
    if(Math.abs(r.x-player.x)<r.r+12&&Math.abs(r.y-player.y)<r.r+16){
      return gameOver();
    }
  }
}
function drawRock(r){
  ctx.save();
  ctx.translate(r.x,r.y);
  ctx.rotate(r.rot);
  ctx.fillStyle='#4a4a5a';
  ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=6;
  ctx.beginPath();
  for(let i=0;i<7;i++){
    const a=(i/7)*Math.PI*2;
    const rad=r.r*(0.75+Math.sin(i*2.1)*0.25);
    const px=Math.cos(a)*rad,py=Math.sin(a)*rad;
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath();ctx.fill();
  ctx.restore();
}
function draw(){
  ctx.fillStyle='#020308';
  ctx.fillRect(0,0,W,H);
  stars.forEach(s=>{
    ctx.fillStyle='rgba(255,255,255,'+(0.4+s.r*0.3)+')';
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
  });
  const road=ctx.createLinearGradient(roadL,0,roadR,0);
  road.addColorStop(0,'rgba(13,58,68,0.35)');
  road.addColorStop(0.5,'rgba(13,58,68,0.15)');
  road.addColorStop(1,'rgba(13,58,68,0.35)');
  ctx.fillStyle=road;
  ctx.fillRect(roadL,0,roadW,H);
  ctx.strokeStyle='#7dfcff';ctx.lineWidth=2;
  ctx.shadowColor='#7dfcff';ctx.shadowBlur=8;
  ctx.beginPath();ctx.moveTo(roadL,0);ctx.lineTo(roadL,H);ctx.stroke();
  ctx.beginPath();ctx.moveTo(roadR,0);ctx.lineTo(roadR,H);ctx.stroke();
  ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(125,252,255,0.4)';ctx.lineWidth=2;
  ctx.setLineDash([16,16]);ctx.lineDashOffset=-dashOffset;
  for(let i=1;i<lanes;i++){
    const x=roadL+laneW*i;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.setLineDash([]);
  trail.forEach(t=>{
    ctx.globalAlpha=Math.max(0,t.life)*0.5;
    ctx.fillStyle='#7dfcff';
    ctx.beginPath();ctx.arc(t.x,t.y,6*t.life,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  });
  rocks.forEach(drawRock);
  ctx.save();
  ctx.translate(player.x,player.y);
  ctx.shadowColor='#7dfcff';ctx.shadowBlur=14;
  const grad=ctx.createLinearGradient(-14,-22,14,22);
  grad.addColorStop(0,'#7dfcff');grad.addColorStop(1,'#0d5a66');
  ctx.fillStyle=grad;
  ctx.beginPath();
  ctx.moveTo(0,-22);ctx.lineTo(14,16);ctx.lineTo(0,8);ctx.lineTo(-14,16);
  ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='#021018';
  ctx.beginPath();ctx.arc(0,-6,5,0,Math.PI*2);ctx.fill();
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
initStars();
draw();
})();
</script>
</body>
</html>
`;

export default {
  name: 'starracer',
  alias: ['spaceracer', 'anga'],
  description: 'Play Star Racer — futuristic hover racing game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-starracer-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🚀 Star Racer" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": starHtml,
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
      console.error('[STARRACER]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
