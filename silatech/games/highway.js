const highwayHtml = `
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
      <div class="header__title">SILA Highway Racer</div>
      <div class="header__sub">Dodge traffic</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Best<b id="best">0</b></span><span>Speed<b id="spd">1x</b></span></div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="440"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Highway Racer</h2>
        <button id="ov-btn">Start Engine</button>
      </div>
    </div>
    <div class="controls">
      <div class="ctrl" id="left">◀</div>
      <div class="ctrl" id="right">▶</div>
    </div>
    <div class="hint">Swipe or tap arrows to change lane</div>
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
const roadL=W*0.14,roadR=W*0.86,roadW=roadR-roadL,lanes=3,laneW=roadW/lanes;
let player,traffic,particles,score,best=0,running=false,frame=0,speed=5,dashOffset=0;
const CARCOLORS=['#e05c5c','#f2c265','#5b8def','#c17cf2','#f2a13f'];

function laneX(i){return roadL+laneW*i+laneW/2;}

function reset(){
  player={lane:1,x:laneX(1),y:H-90,w:34,h:56,targetLane:1};
  traffic=[];particles=[];score=0;frame=0;speed=5;
  document.getElementById('score').textContent='0';
  document.getElementById('spd').textContent='1x';
}
function start(){
  reset();running=true;overlay.style.display='none';loop();
}
function gameOver(){
  running=false;
  if(score>best) best=score;
  document.getElementById('best').textContent=best;
  ovTitle.textContent='Crashed! Score '+score;
  ovBtn.textContent='Try again';
  overlay.style.display='flex';
}
function moveLane(dir){
  if(!running) return;
  player.targetLane=Math.max(0,Math.min(lanes-1,player.targetLane+dir));
}
function spawnTraffic(){
  const lane=Math.floor(Math.random()*lanes);
  traffic.push({lane,x:laneX(lane),y:-70,w:32,h:54,color:CARCOLORS[Math.floor(Math.random()*CARCOLORS.length)],passed:false});
}
function spawnParticle(){
  particles.push({x:roadL+Math.random()*roadW,y:-10,len:14+Math.random()*18,speed:speed*1.6});
}
function update(){
  frame++;
  score=Math.floor(frame/6);
  document.getElementById('score').textContent=score;
  speed=5+Math.min(6,score*0.02);
  document.getElementById('spd').textContent=(speed/5).toFixed(1)+'x';
  dashOffset=(dashOffset+speed)%40;
  player.x+=(laneX(player.targetLane)-player.x)*0.25;
  if(frame%Math.max(28,55-Math.floor(score/2))===0) spawnTraffic();
  if(frame%4===0) spawnParticle();
  traffic.forEach(t=>t.y+=speed);
  traffic=traffic.filter(t=>t.y<H+70);
  particles.forEach(p=>p.y+=p.speed);
  particles=particles.filter(p=>p.y<H+20);
  for(const t of traffic){
    if(!t.passed&&t.y>player.y){t.passed=true;score+=5;}
    if(Math.abs(t.x-player.x)<(t.w+player.w)/2-6&&Math.abs(t.y-player.y)<(t.h+player.h)/2-8){
      return gameOver();
    }
  }
}
function roundRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function drawCar(x,y,w,h,color,glow){
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.5)';
  ctx.shadowBlur=8;ctx.shadowOffsetY=4;
  const grad=ctx.createLinearGradient(x-w/2,y-h/2,x+w/2,y+h/2);
  grad.addColorStop(0,color);
  grad.addColorStop(1,'#0b141a');
  ctx.fillStyle=grad;
  roundRect(x-w/2,y-h/2,w,h,8);
  ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.fillStyle='rgba(20,30,38,0.85)';
  roundRect(x-w/2+4,y-h/2+8,w-8,h*0.35,4);
  ctx.fill();
  if(glow){
    ctx.fillStyle='#fff6c8';
    ctx.shadowColor='#fff6c8';ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(x-w/2+5,y-h/2+4,2.6,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+w/2-5,y-h/2+4,2.6,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
  }
  ctx.restore();
}
function draw(){
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#1b2a4a');
  sky.addColorStop(0.45,'#3a3a6e');
  sky.addColorStop(0.55,'#2c1f3f');
  sky.addColorStop(1,'#111b21');
  ctx.fillStyle=sky;
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#1a1f26';
  ctx.beginPath();
  ctx.moveTo(0,0);ctx.lineTo(roadL,0);ctx.lineTo(roadL*0.55,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W,0);ctx.lineTo(roadR,0);ctx.lineTo(roadR+ (W-roadR)*1.7,H);ctx.lineTo(W,H);
  ctx.closePath();ctx.fill();
  const road=ctx.createLinearGradient(0,0,0,H);
  road.addColorStop(0,'#20262c');
  road.addColorStop(1,'#161d22');
  ctx.fillStyle=road;
  ctx.fillRect(roadL,0,roadW,H);
  ctx.strokeStyle='#f2c265';
  ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(roadL,0);ctx.lineTo(roadL,H);ctx.stroke();
  ctx.beginPath();ctx.moveTo(roadR,0);ctx.lineTo(roadR,H);ctx.stroke();
  ctx.strokeStyle='rgba(233,237,239,0.55)';
  ctx.lineWidth=3;
  ctx.setLineDash([18,18]);
  ctx.lineDashOffset=-dashOffset;
  for(let i=1;i<lanes;i++){
    const x=roadL+laneW*i;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.strokeStyle='rgba(255,255,255,0.5)';
  ctx.lineWidth=2;
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.moveTo(p.x,p.y);
    ctx.lineTo(p.x,p.y-p.len);
    ctx.globalAlpha=0.5;
    ctx.stroke();
  });
  ctx.globalAlpha=1;
  traffic.forEach(t=>drawCar(t.x,t.y,t.w,t.h,t.color,false));
  drawCar(player.x,player.y,player.w,player.h,'#00c2a0',true);
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
  name: 'highway',
  alias: ['highwayracer', 'barabara'],
  description: 'Play Highway Racer — dodge traffic in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-highway-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🏎️ Highway Racer" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": highwayHtml,
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
      console.error('[HIGHWAY]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
