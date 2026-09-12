const silaStickmanHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
:root{
  --bg:#071015;
  --panel:#0d1a20;
  --line:#20343c;
  --green:#00a884;
  --green2:#00d9a6;
  --white:#e9edef;
  --muted:#8696a0;
}
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  user-select:none;
  -webkit-user-select:none;
  -webkit-tap-highlight-color:transparent;
}
html,body{
  width:100%;
  min-height:100vh;
  overflow:hidden;
  background:transparent;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  touch-action:none;
}
.stage{
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:14px;
}
.game{
  width:100%;
  max-width:420px;
}
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 2px 10px;
}
.title{
  color:var(--white);
  font-size:18px;
  font-weight:700;
}
.subtitle{
  color:var(--muted);
  font-size:11px;
}
.stats{
  display:flex;
  gap:8px;
  margin-bottom:8px;
}
.stat{
  flex:1;
  background:var(--panel);
  border:1px solid var(--line);
  border-radius:9px;
  padding:7px 10px;
  text-align:center;
}
.stat span{
  display:block;
  color:var(--muted);
  font-size:9px;
  text-transform:uppercase;
  letter-spacing:.7px;
}
.stat b{
  color:var(--white);
  font-size:16px;
}
.canvasWrap{
  position:relative;
  width:100%;
  border:1px solid var(--line);
  border-radius:12px;
  overflow:hidden;
  background:#071015;
  box-shadow:0 10px 35px rgba(0,0,0,.35);
}
canvas{
  display:block;
  width:100%;
  height:auto;
}
.message{
  min-height:20px;
  text-align:center;
  color:var(--green2);
  font-size:13px;
  font-weight:600;
  margin:7px 0;
}
.controls{
  display:flex;
  justify-content:center;
  gap:12px;
  margin-top:4px;
}
button{
  border:1px solid var(--line);
  background:var(--panel);
  color:var(--white);
  border-radius:10px;
  min-width:74px;
  height:42px;
  font-size:14px;
  font-weight:600;
}
button:active{
  background:var(--green);
  transform:scale(.96);
}
.reset{
  color:var(--green2);
}
.help{
  text-align:center;
  color:var(--muted);
  font-size:10px;
  margin-top:8px;
}
</style>
</head>

<body>
<div class="stage">
<div class="game">

<div class="header">
  <div class="title">SILA STICKMAN</div>
  <div class="subtitle">RUN • JUMP • SURVIVE</div>
</div>

<div class="stats">
  <div class="stat">
    <span>Score</span>
    <b id="score">0</b>
  </div>
  <div class="stat">
    <span>Best</span>
    <b id="best">0</b>
  </div>
  <div class="stat">
    <span>Coins</span>
    <b id="coins">0</b>
  </div>
</div>

<div class="canvasWrap">
<canvas id="game" width="420" height="520"></canvas>
</div>

<div class="message" id="message">Tap JUMP to start</div>

<div class="controls">
  <button id="jump">↑ JUMP</button>
  <button id="restart" class="reset">↻ NEW GAME</button>
</div>

<div class="help">
  Tap JUMP or swipe upward • Keyboard: SPACE / ↑
</div>

</div>
</div>

<script>
(function(){

const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

const scoreEl=document.getElementById("score");
const bestEl=document.getElementById("best");
const coinsEl=document.getElementById("coins");
const messageEl=document.getElementById("message");

const W=420;
const H=520;
const groundY=430;

let running=false;
let gameOver=false;
let score=0;
let coins=0;
let best=Number(localStorage.getItem("sila_stickman_best")||0);

let speed=5;
let spawnTimer=0;
let coinTimer=0;
let lastTime=0;
let worldTime=0;

const player={
  x:78,
  y:groundY-65,
  w:34,
  h:65,
  vy:0,
  jumping:false,
  squash:0
};

let obstacles=[];
let coinItems=[];
let particles=[];

bestEl.textContent=best;

function resetGame(){
  running=false;
  gameOver=false;
  score=0;
  coins=0;
  speed=5;
  spawnTimer=0;
  coinTimer=0;
  worldTime=0;

  player.y=groundY-player.h;
  player.vy=0;
  player.jumping=false;
  player.squash=0;

  obstacles=[];
  coinItems=[];
  particles=[];

  scoreEl.textContent="0";
  coinsEl.textContent="0";
  messageEl.textContent="Tap JUMP to start";

  draw();
}

function startGame(){
  if(gameOver){
    resetGame();
  }
  if(!running){
    running=true;
    gameOver=false;
    messageEl.textContent="RUN!";
    lastTime=performance.now();
    requestAnimationFrame(loop);
  }
}

function jump(){
  if(gameOver){
    resetGame();
    startGame();
    return;
  }

  if(!running){
    startGame();
    player.vy=-13;
    player.jumping=true;
    return;
  }

  if(!player.jumping){
    player.vy=-13;
    player.jumping=true;
    createJumpParticles();
  }
}

function spawnObstacle(){

  const type=Math.random();

  if(type<0.55){
    obstacles.push({
      x:W+30,
      y:groundY-35,
      w:24,
      h:35,
      type:"block"
    });
  }else if(type<0.82){
    obstacles.push({
      x:W+30,
      y:groundY-52,
      w:28,
      h:52,
      type:"spike"
    });
  }else{
    obstacles.push({
      x:W+30,
      y:groundY-25,
      w:48,
      h:25,
      type:"bar"
    });
  }
}

function spawnCoin(){

  const yChoices=[
    groundY-85,
    groundY-135,
    groundY-185
  ];

  const y=yChoices[Math.floor(Math.random()*yChoices.length)];

  coinItems.push({
    x:W+20,
    y:y,
    r:8,
    rot:0
  });
}

function createParticle(x,y){
  particles.push({
    x:x,
    y:y,
    vx:(Math.random()-.5)*3,
    vy:(Math.random()-.5)*3,
    life:1,
    size:Math.random()*3+1
  });
}

function createJumpParticles(){
  for(let i=0;i<7;i++){
    createParticle(player.x+15,groundY-3);
  }
}

function createCoinParticles(x,y){
  for(let i=0;i<10;i++){
    particles.push({
      x:x,
      y:y,
      vx:(Math.random()-.5)*5,
      vy:(Math.random()-.5)*5,
      life:1,
      size:Math.random()*3+1
    });
  }
}

function rectHit(a,b){

  return(
    a.x<a.x+a.w &&
    a.x+a.w>b.x &&
    a.y<b.y+b.h &&
    a.y+a.h>b.y
  );
}

function playerRect(){
  return{
    x:player.x+7,
    y:player.y+5,
    w:20,
    h:player.h-5
  };
}

function endGame(){

  running=false;
  gameOver=true;

  if(score>best){
    best=score;
    localStorage.setItem("sila_stickman_best",best);
  }

  bestEl.textContent=best;
  messageEl.textContent="GAME OVER • Tap NEW GAME";

  for(let i=0;i<25;i++){
    particles.push({
      x:player.x+18,
      y:player.y+30,
      vx:(Math.random()-.5)*7,
      vy:(Math.random()-.5)*7,
      life:1,
      size:Math.random()*4+1
    });
  }
}

function update(dt){

  worldTime+=dt;

  speed+=0.0008*dt;
  score+=Math.floor(speed*0.02*dt);

  scoreEl.textContent=score;

  player.vy+=0.65*(dt/16.67);
  player.y+=player.vy*(dt/16.67);

  if(player.y>=groundY-player.h){
    player.y=groundY-player.h;
    player.vy=0;
    player.jumping=false;
  }

  spawnTimer-=dt;

  if(spawnTimer<=0){
    spawnObstacle();
    spawnTimer=850+Math.random()*650-(speed*25);
    if(spawnTimer<420)spawnTimer=420;
  }

  coinTimer-=dt;

  if(coinTimer<=0){
    spawnCoin();
    coinTimer=650+Math.random()*700;
  }

  obstacles.forEach(o=>{
    o.x-=speed*(dt/16.67);
  });

  coinItems.forEach(c=>{
    c.x-=speed*(dt/16.67);
    c.rot+=0.08;
  });

  obstacles=obstacles.filter(o=>o.x>-80);
  coinItems=coinItems.filter(c=>c.x>-30);

  const p=playerRect();

  for(const o of obstacles){

    if(
      p.x<o.x+o.w &&
      p.x+p.w>o.x &&
      p.y<o.y+o.h &&
      p.y+p.h>o.y
    ){
      endGame();
      return;
    }
  }

  for(let i=coinItems.length-1;i>=0;i--){

    const c=coinItems[i];

    const dx=(p.x+p.w/2)-c.x;
    const dy=(p.y+p.h/2)-c.y;

    if(Math.sqrt(dx*dx+dy*dy)<22){

      coins++;
      score+=50;

      coinsEl.textContent=coins;
      createCoinParticles(c.x,c.y);

      coinItems.splice(i,1);
    }
  }

  particles.forEach(p=>{
    p.x+=p.vx*(dt/16.67);
    p.y+=p.vy*(dt/16.67);
    p.vy+=0.05;
    p.life-=0.025*(dt/16.67);
  });

  particles=particles.filter(p=>p.life>0);
}

function drawBackground(){

  const grad=ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,"#071015");
  grad.addColorStop(1,"#0c2027");

  ctx.fillStyle=grad;
  ctx.fillRect(0,0,W,H);

  // moon
  ctx.beginPath();
  ctx.arc(330,80,32,0,Math.PI*2);
  ctx.fillStyle="rgba(233,237,239,.08)";
  ctx.fill();

  // stars
  for(let i=0;i<35;i++){

    const x=(i*97)%W;
    const y=35+(i*53)%250;

    ctx.fillStyle="rgba(255,255,255,.22)";
    ctx.fillRect(x,y,2,2);
  }

  // distant buildings
  ctx.fillStyle="#0b181e";

  for(let i=0;i<12;i++){

    const bw=25+(i%3)*15;
    const bh=55+(i%4)*25;
    const x=i*40;

    ctx.fillRect(x,groundY-bh,bw,bh);

    for(let w=0;w<2;w++){
      ctx.fillStyle="rgba(0,168,132,.16)";
      ctx.fillRect(
        x+7+w*10,
        groundY-bh+12,
        4,
        5
      );
    }

    ctx.fillStyle="#0b181e";
  }
}

function drawGround(){

  ctx.fillStyle="#0a151a";
  ctx.fillRect(0,groundY,W,H-groundY);

  ctx.fillStyle="#00a884";
  ctx.fillRect(0,groundY,W,2);

  const offset=(worldTime*speed*.12)%40;

  for(let x=-40;x<W+40;x+=40){

    ctx.fillStyle="rgba(0,168,132,.12)";
    ctx.fillRect(x-offset,groundY+30,22,2);
  }
}

function drawStickman(){

  const x=player.x+17;
  const y=player.y;

  ctx.save();
  ctx.lineCap="round";
  ctx.lineJoin="round";
  ctx.strokeStyle="#e9edef";
  ctx.fillStyle="#e9edef";

  // shadow
  ctx.beginPath();
  ctx.ellipse(
    x,
    groundY+3,
    player.jumping?10:16,
    3,
    0,0,Math.PI*2
  );
  ctx.fillStyle="rgba(0,0,0,.35)";
  ctx.fill();
  ctx.fillStyle="#e9edef";

  // head
  ctx.beginPath();
  ctx.arc(x,y+12,10,0,Math.PI*2);
  ctx.fill();

  // body
  ctx.lineWidth=6;
  ctx.beginPath();
  ctx.moveTo(x,y+23);
  ctx.lineTo(x,y+45);
  ctx.stroke();

  // arms
  const armSwing=Math.sin(worldTime*.015)*8;

  ctx.lineWidth=5;
  ctx.beginPath();
  ctx.moveTo(x,y+27);
  ctx.lineTo(x-13,y+38+armSwing);
  ctx.moveTo(x,y+27);
  ctx.lineTo(x+13,y+38-armSwing);
  ctx.stroke();

  // legs
  let legSwing=Math.sin(worldTime*.02)*9;

  if(player.jumping){
    legSwing=8;
  }

  ctx.beginPath();
  ctx.moveTo(x,y+45);
  ctx.lineTo(x-10,y+61+legSwing);
  ctx.moveTo(x,y+45);
  ctx.lineTo(x+10,y+61-legSwing);
  ctx.stroke();

  // eye
  ctx.fillStyle="#071015";
  ctx.beginPath();
  ctx.arc(x+4,y+10,2,0,Math.PI*2);
  ctx.fill();

  ctx.restore();
}

function drawObstacle(o){

  ctx.save();

  if(o.type==="spike"){

    ctx.fillStyle="#d95757";

    ctx.beginPath();
    ctx.moveTo(o.x,o.y+o.h);
    ctx.lineTo(o.x+o.w/2,o.y);
    ctx.lineTo(o.x+o.w,o.y+o.h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle="rgba(255,255,255,.2)";
    ctx.stroke();

  }else if(o.type==="bar"){

    ctx.fillStyle="#f2a13f";
    ctx.fillRect(o.x,o.y,o.w,o.h);

    ctx.fillStyle="rgba(0,0,0,.18)";
    ctx.fillRect(o.x+6,o.y+5,o.w-12,4);

  }else{

    ctx.fillStyle="#b64d61";
    ctx.fillRect(o.x,o.y,o.w,o.h);

    ctx.fillStyle="rgba(255,255,255,.12)";
    ctx.fillRect(o.x+4,o.y+5,o.w-8,5);
  }

  ctx.restore();
}

function drawCoin(c){

  ctx.save();

  ctx.translate(c.x,c.y);
  ctx.rotate(Math.sin(c.rot));

  ctx.beginPath();
  ctx.arc(0,0,c.r,0,Math.PI*2);

  ctx.fillStyle="#f2c265";
  ctx.fill();

  ctx.lineWidth=2;
  ctx.strokeStyle="#ffe29a";
  ctx.stroke();

  ctx.fillStyle="#7a581c";
  ctx.font="bold 9px Arial";
  ctx.textAlign="center";
  ctx.textBaseline="middle";
  ctx.fillText("S",0,1);

  ctx.restore();
}

function drawParticles(){

  particles.forEach(p=>{

    ctx.globalAlpha=Math.max(0,p.life);
    ctx.fillStyle="#00d9a6";

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  });

  ctx.globalAlpha=1;
}

function draw(){

  drawBackground();
  drawGround();

  coinItems.forEach(drawCoin);
  obstacles.forEach(drawObstacle);

  drawStickman();
  drawParticles();

  if(!running && !gameOver){

    ctx.fillStyle="rgba(0,0,0,.28)";
    ctx.fillRect(0,0,W,H);

    ctx.fillStyle="#e9edef";
    ctx.textAlign="center";
    ctx.font="bold 24px Arial";
    ctx.fillText("SILA STICKMAN",W/2,220);

    ctx.font="13px Arial";
    ctx.fillStyle="#aebac1";
    ctx.fillText("Tap JUMP to start running",W/2,248);

  }

  if(gameOver){

    ctx.fillStyle="rgba(0,0,0,.48)";
    ctx.fillRect(0,0,W,H);

    ctx.textAlign="center";

    ctx.fillStyle="#e9edef";
    ctx.font="bold 28px Arial";
    ctx.fillText("GAME OVER",W/2,220);

    ctx.font="14px Arial";
    ctx.fillStyle="#00d9a6";
    ctx.fillText("Score: "+score,W/2,250);

    ctx.fillStyle="#aebac1";
    ctx.fillText("Tap NEW GAME to play again",W/2,278);
  }
}

function loop(time){

  if(!running){
    draw();
    return;
  }

  const dt=Math.min(35,time-lastTime);
  lastTime=time;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

document.getElementById("jump")
.addEventListener("pointerdown",function(e){
  e.preventDefault();
  jump();
});

document.getElementById("restart")
.addEventListener("pointerdown",function(e){
  e.preventDefault();
  resetGame();
});

document.addEventListener("keydown",function(e){

  if(
    e.code==="Space" ||
    e.code==="ArrowUp"
  ){
    e.preventDefault();
    jump();
  }

  if(e.code==="KeyR"){
    resetGame();
  }
});

let touchStartY=0;

document.addEventListener("touchstart",function(e){

  if(e.touches.length){
    touchStartY=e.touches[0].clientY;
  }
},{passive:true});

document.addEventListener("touchend",function(e){

  if(!e.changedTouches.length)return;

  const dy=e.changedTouches[0].clientY-touchStartY;

  if(dy<-30){
    jump();
  }
},{passive:true});

resetGame();

})();
</script>
</body>
</html>
`;

export default {
  name: 'Stickman',
  alias: ['stickman', 'stickmanrun', 'sila-stickman', 'mchezo-stickman'],
  description: 'Play SILA Stickman Run game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    try {

      const responseId = 'sila-stickman-' + Date.now();

      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: "0cCzjnQ5ERoqM2QrQ7KjmMfxsyeWYu+61/chr2wioyE=",
          botMetadata: {
            messageDisclaimerText: "",
            botResponseId: responseId
          }
        },

        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,

              submessages: [
                {
                  messageType: 2,
                  messageText: "🥷 SILA STICKMAN"
                }
              ],

              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: responseId,

                    sections: [
                      {
                        view_model: {
                          primitive: {
                            "__typename":
                              "GenAIaeacdsnwHtmlPrimitive",

                            payload: silaStickmanHtml,

                            trusted_sources: [
                              "sila-tech"
                            ]
                          },

                          "__typename":
                            "GenAISingleLayoutViewModel"
                        }
                      }
                    ]
                  })
                ).toString('base64')
              },

              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,

                forwardedAiBotMessageInfo: {
                  botJid: "867051314767696@bot"
                },

                forwardOrigin: 4
              }
            }
          }
        }
      };

      await sock.relayMessage(
        sender,
        content,
        {}
      );

    } catch (error) {

      console.error('[STICKMAN]', error);

      await sock.sendMessage(
        sender,
        {
          text:
            `✖ Error: ${error?.message || error}`
        },
        {
          quoted: msg
        }
      );
    }
  }
};