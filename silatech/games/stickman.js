const stickmanHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Stickman Fight</title>
<style>
  :root{
    --ink:#e9edef;--muted:#8696a0;--accent:#00a884;--bg:#0b141a;
    --line:#2a3942;--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  }
  *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
  html,body{background:var(--bg);color:var(--ink);font-family:var(--sys);min-height:100vh;overflow:hidden;touch-action:none;}
  .stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;}
  .card{width:100%;max-width:400px;}
  .header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--line);}
  .header__title{font-size:17px;font-weight:600;}
  .header__sub{font-size:12px;color:var(--muted);}
  .stats{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:10px;}
  .stats b{color:var(--ink);font-weight:600;margin-left:4px;}
  canvas{width:100%;background:linear-gradient(#1a2b33,#0b141a);border:1px solid var(--line);border-radius:10px;display:block;touch-action:none;}
  .msg{text-align:center;font-size:14px;color:var(--accent);font-weight:600;margin-top:8px;min-height:18px;}
  .controls{display:flex;justify-content:space-between;margin-top:12px;gap:8px;}
  .pad{display:flex;gap:6px;}
  .pad button{width:52px;height:52px;background:#2a3942;border:1px solid #374248;border-radius:10px;color:var(--ink);font-size:18px;cursor:pointer;}
  .pad button:active{background:var(--accent);}
  .actionBtn{width:70px;height:52px;background:#374248;border:1px solid #4a5b63;border-radius:10px;color:var(--ink);font-size:13px;font-weight:600;cursor:pointer;}
  .actionBtn:active{background:var(--accent);}
  .footer{margin-top:12px;display:flex;justify-content:center;}
  .footer__reset{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:8px 16px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">STICKMAN FIGHT</div>
      <div class="header__sub">Move + Punch/Kick</div>
    </div>
    <div class="stats">
      <span>You <b id="hpP">100</b></span>
      <span>Enemy <b id="hpE">100</b></span>
      <span>Round <b id="round">1</b></span>
    </div>
    <canvas id="game" width="360" height="360"></canvas>
    <div class="msg" id="msg"></div>
    <div class="controls">
      <div class="pad">
        <button id="left">←</button>
        <button id="right">→</button>
      </div>
      <div class="pad">
        <button class="actionBtn" id="punch">PUNCH</button>
        <button class="actionBtn" id="kick">KICK</button>
      </div>
    </div>
    <div class="footer"><button class="footer__reset" id="reset">New fight</button></div>
  </div>
</main>
<script>
(function(){
const cv=document.getElementById('game');
const ctx=cv.getContext('2d');
const hpPEl=document.getElementById('hpP');
const hpEEl=document.getElementById('hpE');
const roundEl=document.getElementById('round');
const msgEl=document.getElementById('msg');

let W=360,H=360;
function resize(){
  const rect=cv.getBoundingClientRect();
  W=rect.width; H=rect.width;
  cv.width=W; cv.height=H;
}
window.addEventListener('resize',resize);

const GROUND=()=>H-40;

let player,enemy,round,over;

function newFighter(x,color){
  return {
    x:x, vx:0, facing: x<W/2?1:-1,
    hp:100, state:'idle', stateTimer:0,
    color:color, hit:false
  };
}

function reset(){
  player=newFighter(W*0.25,'#00d9b3');
  enemy=newFighter(W*0.75,'#f2593f');
  round=1; over=false;
  msgEl.textContent='';
  updateHud();
}

function updateHud(){
  hpPEl.textContent=Math.max(0,Math.round(player.hp));
  hpEEl.textContent=Math.max(0,Math.round(enemy.hp));
  roundEl.textContent=round;
}

function distBetween(){ return Math.abs(player.x-enemy.x); }

function doAction(type){
  if(over) return;
  if(player.state!=='idle') return;
  player.state=type;
  player.stateTimer=0;
}

function enemyAI(){
  if(over) return;
  if(enemy.state!=='idle') return;
  const d=distBetween();
  enemy.facing = player.x < enemy.x ? -1 : 1;
  if(d>60){
    enemy.vx = enemy.facing*1.6;
  } else {
    enemy.vx=0;
    const r=Math.random();
    if(r<0.02) enemy.state='punch';
    else if(r<0.03) enemy.state='kick';
  }
}

function applyHit(attacker,defender,dmg,range){
  const d=distBetween();
  if(d<range && !attacker.hit){
    defender.hp-=dmg;
    attacker.hit=true;
    defender.state='hurt';
    defender.stateTimer=0;
    spawnHitFx(defender.x,GROUND()-40);
    if(defender.hp<=0) endRound(attacker===player);
  }
}

let fx=[];
function spawnHitFx(x,y){
  fx.push({x,y,life:14});
}

function endRound(playerWon){
  over=true;
  msgEl.textContent = playerWon ? 'You win the round! 🥊' : 'You got knocked out!';
}

function update(){
  if(!over){
    // movement
    if(player.state==='idle'){
      player.x += player.vx;
    }
    player.x=Math.max(20,Math.min(W-20,player.x));
    enemy.x=Math.max(20,Math.min(W-20,enemy.x));

    player.facing = enemy.x < player.x ? -1 : 1;

    enemyAI();
    if(enemy.state==='idle'){
      enemy.x += enemy.vx;
    }

    // state timers
    [player,enemy].forEach(f=>{
      if(f.state!=='idle'){
        f.stateTimer++;
        if((f.state==='punch'||f.state==='kick')){
          if(f.stateTimer===6){
            if(f===player) applyHit(player,enemy, f.state==='kick'?18:12, f.state==='kick'?55:45);
            else applyHit(enemy,player, f.state==='kick'?18:12, f.state==='kick'?55:45);
          }
        }
        const dur = f.state==='hurt'?14:16;
        if(f.stateTimer>dur){
          f.state='idle'; f.stateTimer=0; f.hit=false;
        }
      }
    });
    updateHud();
  }
  fx=fx.filter(p=>{p.life--; return p.life>0;});
}

function drawStick(f){
  const g=GROUND();
  const bob = f.state==='idle'? Math.sin(Date.now()/200)*2 : 0;
  const x=f.x, headY=g-70+bob;
  ctx.save();
  ctx.translate(x,0);
  ctx.scale(f.facing,1);
  ctx.strokeStyle=f.color;
  ctx.fillStyle=f.color;
  ctx.lineWidth=4;
  ctx.lineCap='round';

  // head
  ctx.beginPath();
  ctx.arc(0,headY,12,0,Math.PI*2);
  ctx.fill();

  // body
  ctx.beginPath();
  ctx.moveTo(0,headY+12);
  ctx.lineTo(0,g-30);
  ctx.stroke();

  // legs
  ctx.beginPath();
  if(f.state==='kick'){
    ctx.moveTo(0,g-30); ctx.lineTo(-8,g-8);
    ctx.moveTo(0,g-30); ctx.lineTo(30,g-25);
  } else {
    ctx.moveTo(0,g-30); ctx.lineTo(-10,g);
    ctx.moveTo(0,g-30); ctx.lineTo(10,g);
  }
  ctx.stroke();

  // arms
  ctx.beginPath();
  if(f.state==='punch'){
    ctx.moveTo(0,headY+20); ctx.lineTo(32,headY+18);
    ctx.moveTo(0,headY+20); ctx.lineTo(-10,headY+35);
  } else if(f.state==='hurt'){
    ctx.moveTo(0,headY+20); ctx.lineTo(-14,headY+10);
    ctx.moveTo(0,headY+20); ctx.lineTo(14,headY+10);
  } else {
    ctx.moveTo(0,headY+20); ctx.lineTo(-14,headY+35);
    ctx.moveTo(0,headY+20); ctx.lineTo(14,headY+35);
  }
  ctx.stroke();

  ctx.restore();
}

function draw(){
  ctx.clearRect(0,0,W,H);
  // ground
  ctx.fillStyle='#1a2b33';
  ctx.fillRect(0,GROUND(),W,H-GROUND());
  ctx.strokeStyle='#2a3942';
  ctx.beginPath();
  ctx.moveTo(0,GROUND());
  ctx.lineTo(W,GROUND());
  ctx.stroke();

  drawStick(enemy);
  drawStick(player);

  // fx
  fx.forEach(p=>{
    ctx.fillStyle='rgba(255,220,120,'+(p.life/14)+')';
    ctx.beginPath();
    ctx.arc(p.x,p.y,10*(1-p.life/14)+4,0,Math.PI*2);
    ctx.fill();
  });

  if(over){
    ctx.fillStyle='rgba(0,0,0,0.4)';
    ctx.fillRect(0,0,W,H);
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

document.getElementById('left').addEventListener('touchstart',()=>{player.vx=-2.2;});
document.getElementById('left').addEventListener('touchend',()=>{player.vx=0;});
document.getElementById('right').addEventListener('touchstart',()=>{player.vx=2.2;});
document.getElementById('right').addEventListener('touchend',()=>{player.vx=0;});
document.getElementById('left').addEventListener('mousedown',()=>{player.vx=-2.2;});
document.getElementById('left').addEventListener('mouseup',()=>{player.vx=0;});
document.getElementById('right').addEventListener('mousedown',()=>{player.vx=2.2;});
document.getElementById('right').addEventListener('mouseup',()=>{player.vx=0;});
document.getElementById('punch').addEventListener('click',()=>doAction('punch'));
document.getElementById('kick').addEventListener('click',()=>doAction('kick'));
document.getElementById('reset').addEventListener('click',reset);

document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowLeft') player.vx=-2.2;
  else if(e.key==='ArrowRight') player.vx=2.2;
  else if(e.key===' '||e.key==='p'||e.key==='P') doAction('punch');
  else if(e.key==='k'||e.key==='K') doAction('kick');
});
document.addEventListener('keyup',(e)=>{
  if(e.key==='ArrowLeft'||e.key==='ArrowRight') player.vx=0;
});

resize();
reset();
loop();
})();
</script>
</body>
</html>
`;

/**
 * Stickman Fight command.
 *
 * Sends a normal Baileys interactive/button message containing a link/webview
 * to the game. Replace GAME_HOST_URL below with the URL where you host
 * stickman.html (e.g. a simple Express static route), OR see the
 * "inline webview" note below if your bot framework has a supported
 * in-chat HTML viewer plugin.
 *
 * This does NOT spoof any "verified AI" / trusted-source metadata.
 */

const GAME_HOST_URL = 'https://your-domain.example.com/games/stickman.html';

export default {
  name: 'stickman',
  alias: ['stick', 'fight'],
  description: 'Play a Stickman Fight mini-game (opens in browser/webview)',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      await sock.sendMessage(
        sender,
        {
          text:
            '🥊 *Stickman Fight*\n\n' +
            'Tap the link below to play in your browser:\n' +
            GAME_HOST_URL +
            '\n\nControls: ← → move, tap PUNCH/KICK to attack.',
        },
        { quoted: msg }
      );
    } catch (error) {
      console.error('[stickman]', error);
      await sock.sendMessage(
        sender,
        { text: `✖ Error: ${error?.message || error}` },
        { quoted: msg }
      );
    }
  },
};

/*
 * HOW TO SERVE THE GAME:
 * 1. Save the `stickmanHtml` string above to a file, e.g. `public/games/stickman.html`.
 * 2. If your bot project already runs an Express server, add:
 *
 *      app.use('/games', express.static(path.join(__dirname, 'public/games')));
 *
 * 3. Set GAME_HOST_URL to that public URL (must be reachable from the user's phone).
 * 4. If you don't have a web server yet, you can quickly deploy stickman.html
 *    to any static host (Render, Vercel, GitHub Pages, Netlify) for free.
 */
