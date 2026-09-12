const flappyHtml = `
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
.overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(11,20,26,0.7);}
.overlay h2{font-size:20px;}
.overlay button{background:var(--accent);border:none;border-radius:8px;color:#0b141a;font-weight:700;font-family:inherit;padding:10px 22px;font-size:14px;cursor:pointer;}
.hint{font-size:12px;color:var(--muted);text-align:center;margin-top:10px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Flappy</div>
      <div class="header__sub">Tap to fly</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Best<b id="best">0</b></span></div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="420"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Flappy</h2>
        <button id="ov-btn">Start</button>
      </div>
    </div>
    <div class="hint">Tap or press Space to flap</div>
  </div>
</main>
<script>
(function(){
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const W=canvas.width,H=canvas.height;
let bird,pipes,score,best=0,running=false,gravity=0.45,vel=0,gap=140,pipeW=52,speed=2.6,frame=0;
const overlay=document.getElementById('overlay');
const ovTitle=document.getElementById('ov-title');
const ovBtn=document.getElementById('ov-btn');

function reset(){
  bird={x:70,y:H/2,r:12};
  vel=0;pipes=[];score=0;frame=0;
  document.getElementById('score').textContent='0';
  spawnPipe();
}
function spawnPipe(){
  const top=40+Math.random()*(H-gap-160);
  pipes.push({x:W,top,scored:false});
}
function flap(){
  if(!running) return;
  vel=-7.5;
}
function start(){
  reset();
  running=true;
  overlay.style.display='none';
  loop();
}
function gameOver(){
  running=false;
  if(score>best){best=score;}
  document.getElementById('best').textContent=best;
  ovTitle.textContent='Game over — Score '+score;
  ovBtn.textContent='Play again';
  overlay.style.display='flex';
}
function update(){
  frame++;
  vel+=gravity;
  bird.y+=vel;
  if(frame%90===0) spawnPipe();
  pipes.forEach(p=>p.x-=speed);
  pipes=pipes.filter(p=>p.x>-pipeW);
  for(const p of pipes){
    if(!p.scored&&p.x+pipeW<bird.x){p.scored=true;score++;document.getElementById('score').textContent=score;}
    if(bird.x+bird.r>p.x&&bird.x-bird.r<p.x+pipeW){
      if(bird.y-bird.r<p.top||bird.y+bird.r>p.top+gap) return gameOver();
    }
  }
  if(bird.y+bird.r>H||bird.y-bird.r<0) return gameOver();
}
function draw(){
  ctx.fillStyle='#0e3a5f';
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#00a884';
  pipes.forEach(p=>{
    ctx.fillRect(p.x,0,pipeW,p.top);
    ctx.fillRect(p.x,p.top+gap,pipeW,H-p.top-gap);
  });
  ctx.fillStyle='#f2c265';
  ctx.beginPath();
  ctx.arc(bird.x,bird.y,bird.r,0,Math.PI*2);
  ctx.fill();
}
function loop(){
  if(!running) return;
  update();
  if(running){
    draw();
    requestAnimationFrame(loop);
  }
}
ovBtn.addEventListener('click',start);
document.getElementById('wrap').addEventListener('pointerdown',(e)=>{
  if(!running) return;
  flap();
});
document.addEventListener('keydown',(e)=>{ if(e.code==='Space') flap(); });
draw();
})();
</script>
</body>
</html>
`;

export default {
  name: 'flappy',
  alias: ['flappyball', 'ndege'],
  description: 'Play Flappy Bird style action game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-flappy-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🐤 Flappy" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": flappyHtml,
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
      console.error('[FLAPPY]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
