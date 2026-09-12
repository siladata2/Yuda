const fruitHtml = `
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
.stats .time{color:var(--accent);font-weight:700;}
.wrap{position:relative;background:var(--cell-bg);border:1px solid var(--line);border-radius:10px;overflow:hidden;}
canvas{display:block;width:100%;}
.overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(11,20,26,0.75);}
.overlay h2{font-size:19px;text-align:center;padding:0 16px;}
.overlay button{background:var(--accent);border:none;border-radius:8px;color:#0b141a;font-weight:700;font-family:inherit;padding:10px 22px;font-size:14px;cursor:pointer;}
.hint{font-size:11px;color:var(--muted);text-align:center;margin-top:10px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Fruit Slice</div>
      <div class="header__sub">30s round</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Best<b id="best">0</b></span><span class="time"><span id="time">30</span>s</span></div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="420"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Fruit Slice</h2>
        <button id="ov-btn">Start</button>
      </div>
    </div>
    <div class="hint">Swipe across fruit 🍉 to slice — avoid bombs 💣</div>
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
const FRUITS=['🍉','🍎','🍊','🍋','🍓','🥝'];
let items,score,best=0,time=30,running=false,timer=null,frame=0,trail=[];

function reset(){
  items=[];score=0;time=30;frame=0;trail=[];
  document.getElementById('score').textContent='0';
  document.getElementById('time').textContent='30';
}
function start(){
  reset();
  running=true;
  overlay.style.display='none';
  timer=setInterval(()=>{
    time--;
    document.getElementById('time').textContent=time;
    if(time<=0) return end();
  },1000);
  loop();
}
function end(){
  running=false;
  clearInterval(timer);
  if(score>best) best=score;
  document.getElementById('best').textContent=best;
  ovTitle.textContent='Time up — Score '+score;
  ovBtn.textContent='Play again';
  overlay.style.display='flex';
}
function spawn(){
  const isBomb=Math.random()<0.18;
  items.push({
    x:40+Math.random()*(W-80),
    y:H+20,
    vy:-(9+Math.random()*3),
    vx:(Math.random()-0.5)*2.5,
    r:22,
    icon:isBomb?'💣':FRUITS[Math.floor(Math.random()*FRUITS.length)],
    bomb:isBomb,
    sliced:false
  });
}
function update(){
  frame++;
  if(frame%55===0) spawn();
  items.forEach(it=>{
    it.vy+=0.28;
    it.y+=it.vy;
    it.x+=it.vx;
  });
  items=items.filter(it=>it.y<H+60&&!it.sliced);
  if(trail.length>1) trail=trail.slice(-10);
}
function draw(){
  ctx.fillStyle='#0e3a5f';
  ctx.fillRect(0,0,W,H);
  if(trail.length>1){
    ctx.strokeStyle='rgba(255,255,255,0.55)';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(trail[0].x,trail[0].y);
    trail.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.stroke();
  }
  ctx.font='40px serif';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  items.forEach(it=>ctx.fillText(it.icon,it.x,it.y));
}
function loop(){
  if(!running) return;
  update();
  draw();
  requestAnimationFrame(loop);
}
function pointToLocal(clientX,clientY){
  const rect=canvas.getBoundingClientRect();
  const scale=W/rect.width;
  return {x:(clientX-rect.left)*scale,y:(clientY-rect.top)*scale};
}
function checkSlice(p){
  for(const it of items){
    if(it.sliced) continue;
    const d=Math.hypot(p.x-it.x,p.y-it.y);
    if(d<it.r){
      it.sliced=true;
      if(it.bomb){
        score=Math.max(0,score-15);
      } else {
        score+=10;
      }
      document.getElementById('score').textContent=score;
    }
  }
}
canvas.addEventListener('pointerdown',(e)=>{ if(!running) return; trail=[pointToLocal(e.clientX,e.clientY)]; checkSlice(trail[0]); });
canvas.addEventListener('pointermove',(e)=>{
  if(!running||!e.buttons) return;
  const p=pointToLocal(e.clientX,e.clientY);
  trail.push(p);
  checkSlice(p);
});
document.getElementById('wrap').addEventListener('touchmove',(e)=>{ e.preventDefault(); },{passive:false});
ovBtn.addEventListener('click',start);
draw();
})();
</script>
</body>
</html>
`;

export default {
  name: 'fruitslice',
  alias: ['fruitninja', 'matunda'],
  description: 'Play Fruit Slice action game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-fruitslice-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🍉 Fruit Slice" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": fruitHtml,
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
      console.error('[FRUITSLICE]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
