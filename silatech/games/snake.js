const snakeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{--card-2:#2a3942;--ink:#e9edef;--ink-soft:#aebac1;--muted:#8696a0;
--accent:#00a884;--line:#2a3942;--line-strong:#374248;--cell-bg:#111b21;
--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow-x:hidden;touch-action:none;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.stats{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:14px;}
.stats b{color:var(--ink);font-weight:600;margin-left:4px;}
.wrap{background:var(--cell-bg);border:1px solid var(--line);border-radius:10px;padding:6px;}
canvas{display:block;width:100%;border-radius:6px;}
.controls{display:flex;justify-content:center;margin-top:14px;}
.pad{display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(3,44px);gap:4px;}
.pad button{background:var(--card-2);border:1px solid var(--line-strong);border-radius:8px;color:var(--ink);font-size:16px;cursor:pointer;}
.pad button:active{background:var(--accent);}
.footer{margin-top:14px;display:flex;justify-content:center;}
.footer__reset{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:8px 16px;}
.msg{text-align:center;font-size:14px;color:#e05c5c;font-weight:600;margin-top:8px;min-height:18px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Snake</div>
      <div class="header__sub">Classic</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Best<b id="best">0</b></span></div>
    <div class="wrap"><canvas id="canvas" width="320" height="320"></canvas></div>
    <div class="msg" id="msg"></div>
    <div class="controls">
      <div class="pad">
        <span></span><button id="up">↑</button><span></span>
        <button id="left">←</button><span></span><button id="right">→</button>
        <span></span><button id="down">↓</button><span></span>
      </div>
    </div>
    <div class="footer"><button class="footer__reset" id="reset">Restart</button></div>
  </div>
</main>
<script>
(function(){
const GRID=16;
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
let cell=canvas.width/GRID;
let snake,dir,nextDir,food,score,best=0,over=false,timer=null;

function reset(){
  snake=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];
  dir={x:1,y:0};nextDir={x:1,y:0};
  score=0;over=false;
  document.getElementById('msg').textContent='';
  placeFood();
  document.getElementById('score').textContent='0';
  if(timer) clearInterval(timer);
  timer=setInterval(tick,150);
  draw();
}
function placeFood(){
  let ok=false;
  while(!ok){
    food={x:Math.floor(Math.random()*GRID),y:Math.floor(Math.random()*GRID)};
    ok=!snake.some(s=>s.x===food.x&&s.y===food.y);
  }
}
function tick(){
  if(over) return;
  dir=nextDir;
  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.y<0||head.x>=GRID||head.y>=GRID||snake.some(s=>s.x===head.x&&s.y===head.y)){
    over=true;
    clearInterval(timer);
    if(score>best) best=score;
    document.getElementById('best').textContent=best;
    document.getElementById('msg').textContent='Game over — tap Restart';
    return;
  }
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){
    score+=10;
    document.getElementById('score').textContent=score;
    placeFood();
  } else {
    snake.pop();
  }
  draw();
}
function draw(){
  ctx.fillStyle='#111b21';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#f2593f';
  ctx.beginPath();
  ctx.arc(food.x*cell+cell/2,food.y*cell+cell/2,cell*0.35,0,Math.PI*2);
  ctx.fill();
  snake.forEach((s,i)=>{
    ctx.fillStyle=i===0?'#00a884':'#00c2a0';
    ctx.beginPath();
    ctx.roundRect(s.x*cell+1,s.y*cell+1,cell-2,cell-2,4);
    ctx.fill();
  });
}
function setDir(x,y){
  if(dir.x===-x&&dir.y===-y) return;
  nextDir={x,y};
}
document.getElementById('up').addEventListener('click',()=>setDir(0,-1));
document.getElementById('down').addEventListener('click',()=>setDir(0,1));
document.getElementById('left').addEventListener('click',()=>setDir(-1,0));
document.getElementById('right').addEventListener('click',()=>setDir(1,0));
document.getElementById('reset').addEventListener('click',reset);
document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowUp') setDir(0,-1);
  else if(e.key==='ArrowDown') setDir(0,1);
  else if(e.key==='ArrowLeft') setDir(-1,0);
  else if(e.key==='ArrowRight') setDir(1,0);
});
let sx=0,sy=0;
document.body.addEventListener('touchstart',(e)=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;});
document.body.addEventListener('touchend',(e)=>{
  const dx=e.changedTouches[0].clientX-sx;
  const dy=e.changedTouches[0].clientY-sy;
  if(Math.max(Math.abs(dx),Math.abs(dy))<24) return;
  if(Math.abs(dx)>Math.abs(dy)) setDir(dx>0?1:-1,0);
  else setDir(0,dy>0?1:-1);
});
reset();
})();
</script>
</body>
</html>
`;

export default {
  name: 'snake',
  alias: ['nyoka', 'snakegame'],
  description: 'Play classic Snake game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-snake-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🐍 Snake" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": snakeHtml,
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
      console.error('[SNAKE]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
