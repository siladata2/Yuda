const brickHtml = `
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
      <div class="header__title">SILA Brick Breaker</div>
      <div class="header__sub">Drag paddle</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Lives<b id="lives">3</b></span><span>Best<b id="best">0</b></span></div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="420"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Brick Breaker</h2>
        <button id="ov-btn">Start</button>
      </div>
    </div>
    <div class="hint">Drag left/right on the board to move the paddle</div>
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
let paddle,ball,bricks,score,lives,best=0,running=false,rows=5,cols=7;
const brickW=(W-20)/cols,brickH=16,brickGap=4;
const COLORS=['#f2593f','#f2a13f','#f2c265','#00c2a0','#00a884'];

function reset(){
  paddle={w:70,h:10,x:W/2-35,y:H-24};
  ball={x:W/2,y:H-40,r:6,dx:3.4,dy:-3.4};
  bricks=[];
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      bricks.push({x:10+c*brickW,y:40+r*(brickH+brickGap),w:brickW-brickGap,h:brickH,alive:true,color:COLORS[r%COLORS.length]});
    }
  }
  score=0;lives=3;
  document.getElementById('score').textContent='0';
  document.getElementById('lives').textContent='3';
}
function start(){
  reset();
  running=true;
  overlay.style.display='none';
  loop();
}
function loseLife(){
  lives--;
  document.getElementById('lives').textContent=lives;
  if(lives<=0){ return gameOver(false); }
  ball={x:W/2,y:H-40,r:6,dx:3.4,dy:-3.4};
  paddle.x=W/2-35;
}
function gameOver(won){
  running=false;
  if(score>best) best=score;
  document.getElementById('best').textContent=best;
  ovTitle.textContent=won?'You cleared it! Score '+score:'Game over — Score '+score;
  ovBtn.textContent='Play again';
  overlay.style.display='flex';
}
function update(){
  ball.x+=ball.dx;ball.y+=ball.dy;
  if(ball.x-ball.r<0||ball.x+ball.r>W) ball.dx*=-1;
  if(ball.y-ball.r<0) ball.dy*=-1;
  if(ball.y+ball.r>paddle.y&&ball.y-ball.r<paddle.y+paddle.h&&ball.x>paddle.x&&ball.x<paddle.x+paddle.w){
    ball.dy=-Math.abs(ball.dy);
    const hitPos=(ball.x-(paddle.x+paddle.w/2))/(paddle.w/2);
    ball.dx=hitPos*4.2;
  }
  if(ball.y-ball.r>H) return loseLife();
  let alive=0;
  for(const b of bricks){
    if(!b.alive) continue;
    alive++;
    if(ball.x+ball.r>b.x&&ball.x-ball.r<b.x+b.w&&ball.y+ball.r>b.y&&ball.y-ball.r<b.y+b.h){
      b.alive=false;
      ball.dy*=-1;
      score+=10;
      document.getElementById('score').textContent=score;
      break;
    }
  }
  if(alive===0) gameOver(true);
}
function draw(){
  ctx.fillStyle='#0e3a5f';
  ctx.fillRect(0,0,W,H);
  bricks.forEach(b=>{
    if(!b.alive) return;
    ctx.fillStyle=b.color;
    ctx.fillRect(b.x,b.y,b.w,b.h);
  });
  ctx.fillStyle='#e9edef';
  ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
  ctx.fillStyle='#00a884';
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
function movePaddleTo(clientX){
  const rect=canvas.getBoundingClientRect();
  const scale=W/rect.width;
  let x=(clientX-rect.left)*scale-paddle.w/2;
  x=Math.max(0,Math.min(W-paddle.w,x));
  paddle.x=x;
}
canvas.addEventListener('pointerdown',(e)=>{ if(running) movePaddleTo(e.clientX); });
canvas.addEventListener('pointermove',(e)=>{ if(running&&e.buttons) movePaddleTo(e.clientX); });
document.getElementById('wrap').addEventListener('touchmove',(e)=>{
  if(running){ movePaddleTo(e.touches[0].clientX); e.preventDefault(); }
},{passive:false});
ovBtn.addEventListener('click',start);
draw();
})();
</script>
</body>
</html>
`;

export default {
  name: 'brickbreaker',
  alias: ['breakout', 'tofali'],
  description: 'Play Brick Breaker action game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-brickbreaker-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🧱 Brick Breaker" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": brickHtml,
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
      console.error('[BRICKBREAKER]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
