const runnerHtml = `
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
      <div class="header__title">SILA Runner</div>
      <div class="header__sub">Endless</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Best<b id="best">0</b></span></div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="300"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Runner</h2>
        <button id="ov-btn">Start</button>
      </div>
    </div>
    <div class="hint">Tap or press Space to jump over obstacles</div>
  </div>
</main>
<script>
(function(){
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const W=canvas.width,H=canvas.height;
const groundY=H-40;
const overlay=document.getElementById('overlay');
const ovTitle=document.getElementById('ov-title');
const ovBtn=document.getElementById('ov-btn');
let player,obstacles,score,best=0,running=false,speed=4.5,frame=0,gravity=0.9;

function reset(){
  player={x:40,y:groundY-30,w:26,h:30,vy:0,jumping:false};
  obstacles=[];
  score=0;frame=0;speed=4.5;
  document.getElementById('score').textContent='0';
}
function start(){
  reset();
  running=true;
  overlay.style.display='none';
  loop();
}
function jump(){
  if(!running) return;
  if(!player.jumping){
    player.vy=-13.5;
    player.jumping=true;
  }
}
function gameOver(){
  running=false;
  if(score>best) best=score;
  document.getElementById('best').textContent=best;
  ovTitle.textContent='Game over — Score '+score;
  ovBtn.textContent='Play again';
  overlay.style.display='flex';
}
function spawn(){
  const h=20+Math.random()*24;
  obstacles.push({x:W+10,y:groundY-h,w:16+Math.random()*10,h});
}
function update(){
  frame++;
  score=Math.floor(frame/6);
  document.getElementById('score').textContent=score;
  speed=4.5+score*0.01;
  player.vy+=gravity;
  player.y+=player.vy;
  if(player.y>groundY-player.h){
    player.y=groundY-player.h;
    player.vy=0;
    player.jumping=false;
  }
  if(frame%Math.max(45,70-Math.floor(score/3))===0) spawn();
  obstacles.forEach(o=>o.x-=speed);
  obstacles=obstacles.filter(o=>o.x+o.w>0);
  for(const o of obstacles){
    if(player.x+player.w>o.x&&player.x<o.x+o.w&&player.y+player.h>o.y){
      return gameOver();
    }
  }
}
function draw(){
  ctx.fillStyle='#0e3a5f';
  ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#2a3942';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(0,groundY);
  ctx.lineTo(W,groundY);
  ctx.stroke();
  ctx.fillStyle='#f2c265';
  ctx.fillRect(player.x,player.y,player.w,player.h);
  ctx.fillStyle='#e05c5c';
  obstacles.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));
}
function loop(){
  if(!running) return;
  update();
  if(running){
    draw();
    requestAnimationFrame(loop);
  }
}
document.getElementById('wrap').addEventListener('pointerdown',()=>{ if(running) jump(); });
document.addEventListener('keydown',(e)=>{ if(e.code==='Space') jump(); });
ovBtn.addEventListener('click',start);
draw();
})();
</script>
</body>
</html>
`;

export default {
  name: 'runner',
  alias: ['dinorunner', 'kukimbia'],
  description: 'Play an endless runner jump game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-runner-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🏃 Runner" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": runnerHtml,
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
      console.error('[RUNNER]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
