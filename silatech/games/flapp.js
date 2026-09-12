import { randomUUID } from 'crypto';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
  *{margin:0;padding:0;box-sizing:border-box;user-select:none;}
  body{background:#111b21;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:10px;}
  .card{width:100%;max-width:340px;text-align:center;}
  canvas{background:#70c5ce;border-radius:8px;border:2px solid #2a3942;width:100%;display:block;}
  .controls{margin-top:10px;}
  .btn-jump{width:100%;padding:15px;background:#00a884;border:none;border-radius:8px;color:#fff;font-size:18px;font-weight:bold;cursor:pointer;}
  .btn-jump:active{background:#008069;}
</style>
</head>
<body>
<div class="card">
  <h3 style="margin-bottom:8px;color:#00a884;">🐤 SILA Flappy Bird</h3>
  <canvas id="c" width="320" height="400"></canvas>
  <div class="controls">
    <button class="btn-jump" id="jump">JUMP 🚀</button>
  </div>
</div>
<script>
const cvs=document.getElementById("c"),ctx=cvs.getContext("2d");
let bird={x:50,y:150,w:20,h:20,g:0.25,v:0,j:-5.5};
let pipe=[],score=0,over=false;
pipe[0]={x:cvs.width,top:120,gap:100};

function draw(){
  ctx.fillStyle="#70c5ce";ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.fillStyle="#ffbc00";ctx.fillRect(bird.x,bird.y,bird.w,bird.h);
  
  if(!over){bird.v+=bird.g;bird.y+=bird.v;}

  for(let i=0;i<pipe.length;i++){
    ctx.fillStyle="#2e7d32";
    ctx.fillRect(pipe[i].x,0,35,pipe[i].top);
    ctx.fillRect(pipe[i].x,pipe[i].top+pipe[i].gap,35,cvs.height);
    if(!over) pipe[i].x-=1.5;
    if(pipe[i].x===120) pipe.push({x:cvs.width,top:Math.floor(Math.random()*180)+30,gap:100});

    if(bird.x+bird.w>=pipe[i].x && bird.x<=pipe[i].x+35 && (bird.y<=pipe[i].top || bird.y+bird.h>=pipe[i].top+pipe[i].gap)) over=true;
    if(pipe[i].x===bird.x) score++;
  }
  if(bird.y+bird.h>=cvs.height||bird.y<=0) over=true;

  ctx.fillStyle="#fff";ctx.font="20px sans-serif";
  ctx.fillText("Score: "+score,10,25);
  if(over){ctx.fillStyle="#e53935";ctx.fillText("GAME OVER",100,200);}
  else requestAnimationFrame(draw);
}
document.getElementById("jump").onclick=()=>{
  if(over){bird.y=150;bird.v=0;pipe=[{x:cvs.width,top:120,gap:100}];score=0;over=false;draw();}
  else bird.v=bird.j;
};
draw();
</script>
</body>
</html>
`;

export default {
  name: 'flappy',
  alias: ['flappybird'],
  description: 'Play Flappy Bird',
  category: 'games',
  async execute(sock, msg) {
    const payload = {
      messageContextInfo: { messageSecret: "0cCzjnQ5ERoqM2QrQ7KjmMfxsyeWYu+61/chr2wioyE=" },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            unifiedResponse: {
              data: Buffer.from(JSON.stringify({
                "response_id": 'sila-flappy-' + Date.now(),
                "sections": [{
                  "view_model": {
                    "primitive": { "__typename": "GenAIaeacdsnwHtmlPrimitive", "payload": htmlContent, "trusted_sources": ["sila-tech"] },
                    "__typename": "GenAISingleLayoutViewModel"
                  }
                }]
              })).toString('base64')
            }
          }
        }
      }
    };
    await sock.relayMessage(msg.key.remoteJid, payload, {});
  }
};
