const driftHtml = `
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
      <div class="header__title">SILA Drift Circuit</div>
      <div class="header__sub">Stay on track</div>
    </div>
    <div class="stats"><span>Distance<b id="score">0</b>m</span><span>Best<b id="best">0</b>m</span></div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="440"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Drift Circuit</h2>
        <button id="ov-btn">Start Race</button>
      </div>
    </div>
    <div class="controls">
      <div class="ctrl" id="left">◀ STEER</div>
      <div class="ctrl" id="right">STEER ▶</div>
    </div>
    <div class="hint">Hold left/right or swipe to steer through the curves</div>
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
let carX,vx,dist,best=0,running=false,frame=0,speed=4.2,steerDir=0,smoke=[],segY=0;
const roadHalf=70;
let segments=[];

function genSegments(n){
  const arr=[];
  let cx=0,dir=0;
  for(let i=0;i<n;i++){
    dir+=(Math.random()-0.5)*0.35;
    dir=Math.max(-2.4,Math.min(2.4,dir));
    cx+=dir;
    cx=Math.max(-90,Math.min(90,cx));
    arr.push(cx);
  }
  return arr;
}
function reset(){
  carX=0;vx=0;dist=0;frame=0;speed=4.2;smoke=[];segY=0;
  segments=genSegments(4000);
  document.getElementById('score').textContent='0';
}
function start(){reset();running=true;overlay.style.display='none';loop();}
function gameOver(){
  running=false;
  const d=Math.floor(dist);
  if(d>best) best=d;
  document.getElementById('best').textContent=best;
  ovTitle.textContent='Off track! Distance '+d+'m';
  ovBtn.textContent='Try again';
  overlay.style.display='flex';
}
function roadCenterAt(offset){
  const idx=Math.floor(segY+offset);
  if(idx<0||idx>=segments.length) return 0;
  return segments[idx];
}
function steer(dir){ steerDir=dir; }
function update(){
  frame++;
  speed=4.2+Math.min(5,dist*0.004);
  segY+=speed*0.5;
  dist+=speed*0.09;
  document.getElementById('score').textContent=Math.floor(dist);
  vx+=steerDir*0.6;
  vx*=0.85;
  carX+=vx;
  const center=roadCenterAt(60);
  if(Math.abs(carX-center)>roadHalf-14){
    return gameOver();
  }
  if(Math.abs(steerDir)>0&&frame%3===0){
    smoke.push({x:W/2-Math.sign(vx)*14,y:H-70,life:1});
  }
  smoke.forEach(s=>{s.life-=0.05;s.y+=2;});
  smoke=smoke.filter(s=>s.life>0);
}
function draw(){
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#3a2a1a');
  sky.addColorStop(0.4,'#4a3550');
  sky.addColorStop(1,'#111b21');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#1c3d2a';
  ctx.fillRect(0,H*0.35,W,H*0.65);
  const N=44;
  for(let i=0;i<N;i++){
    const t0=i/N,t1=(i+1)/N;
    const y0=H*0.35+ (H*0.65)*t0*t0;
    const y1=H*0.35+ (H*0.65)*t1*t1;
    const persp0=0.15+0.85*t0;
    const persp1=0.15+0.85*t1;
    const c0=roadCenterAt(N-i)-carX;
    const c1=roadCenterAt(N-i-1)-carX;
    const w0=roadHalf*persp0;
    const w1=roadHalf*persp1;
    const cx0=W/2+c0*persp0;
    const cx1=W/2+c1*persp1;
    ctx.fillStyle=i%2===0?'#26303a':'#2c3742';
    ctx.beginPath();
    ctx.moveTo(cx0-w0,y0);ctx.lineTo(cx0+w0,y0);ctx.lineTo(cx1+w1,y1);ctx.lineTo(cx1-w1,y1);
    ctx.closePath();ctx.fill();
    ctx.fillStyle=i%4<2?'#e05c5c':'#e9edef';
    const curbW0=w0*0.08,curbW1=w1*0.08;
    ctx.beginPath();
    ctx.moveTo(cx0-w0-curbW0,y0);ctx.lineTo(cx0-w0,y0);ctx.lineTo(cx1-w1,y1);ctx.lineTo(cx1-w1-curbW1,y1);
    ctx.closePath();ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx0+w0,y0);ctx.lineTo(cx0+w0+curbW0,y0);ctx.lineTo(cx1+w1+curbW1,y1);ctx.lineTo(cx1+w1,y1);
    ctx.closePath();ctx.fill();
  }
  smoke.forEach(s=>{
    ctx.globalAlpha=Math.max(0,s.life)*0.4;
    ctx.fillStyle='#aebac1';
    ctx.beginPath();ctx.arc(s.x,s.y,10*(1.4-s.life),0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  });
  ctx.save();
  ctx.translate(W/2,H-70);
  ctx.rotate(vx*0.03);
  ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=10;ctx.shadowOffsetY=5;
  const grad=ctx.createLinearGradient(-16,-24,16,24);
  grad.addColorStop(0,'#00c2a0');grad.addColorStop(1,'#00453a');
  ctx.fillStyle=grad;
  ctx.beginPath();
  ctx.moveTo(-14,24);ctx.lineTo(-16,-10);ctx.lineTo(-8,-24);ctx.lineTo(8,-24);ctx.lineTo(16,-10);ctx.lineTo(14,24);
  ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(20,30,38,0.85)';
  ctx.fillRect(-9,-16,18,14);
  ctx.fillStyle='#fff6c8';
  ctx.shadowColor='#fff6c8';ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(-9,-20,2.4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(9,-20,2.4,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function loop(){
  if(!running) return;
  update();
  if(running){draw();requestAnimationFrame(loop);}
}
document.getElementById('left').addEventListener('pointerdown',()=>steer(-1));
document.getElementById('right').addEventListener('pointerdown',()=>steer(1));
document.getElementById('left').addEventListener('pointerup',()=>steer(0));
document.getElementById('right').addEventListener('pointerup',()=>steer(0));
document.getElementById('left').addEventListener('pointerleave',()=>steer(0));
document.getElementById('right').addEventListener('pointerleave',()=>steer(0));
document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowLeft') steer(-1);
  if(e.key==='ArrowRight') steer(1);
});
document.addEventListener('keyup',(e)=>{
  if(e.key==='ArrowLeft'||e.key==='ArrowRight') steer(0);
});
ovBtn.addEventListener('click',start);
genSegments(1);
draw();
})();
</script>
</body>
</html>
`;

export default {
  name: 'drift',
  alias: ['driftcircuit', 'kizunguzungu'],
  description: 'Play Drift Circuit racing game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-drift-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🏁 Drift Circuit" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": driftHtml,
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
      console.error('[DRIFT]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
