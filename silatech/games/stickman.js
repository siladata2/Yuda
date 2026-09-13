import { ButtonV2 } from 'baileys';

const stickmanHtml = `
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
.bars{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.barwrap{flex:1;height:10px;background:var(--cell-bg);border:1px solid var(--line);border-radius:6px;overflow:hidden;}
.bar{height:100%;width:100%;background:var(--accent);transition:width .2s ease;}
.bar.ai{background:#e05c5c;}
.tag{font-size:11px;color:var(--muted);width:34px;}
.wrap{position:relative;background:#111b21;border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,.6);}
canvas{display:block;width:100%;}
.overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(11,20,26,0.8);}
.overlay h2{font-size:19px;text-align:center;padding:0 16px;}
.overlay button{background:var(--accent);border:none;border-radius:8px;color:#0b141a;font-weight:700;font-family:inherit;padding:10px 22px;font-size:14px;cursor:pointer;}
.controls{display:flex;justify-content:space-between;margin-top:12px;gap:8px;}
.ctrl{flex:1;background:var(--card-2);border:1px solid var(--line-strong,#374248);border-radius:10px;padding:12px 0;text-align:center;font-size:13px;font-weight:600;color:var(--ink);cursor:pointer;}
.ctrl:active{background:var(--accent);color:#0b141a;}
.hint{font-size:11px;color:var(--muted);text-align:center;margin-top:8px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Stickman Fighter</div>
      <div class="header__sub">VS AI</div>
    </div>
    <div class="bars">
      <span class="tag">You</span>
      <div class="barwrap"><div class="bar" id="hp-you"></div></div>
    </div>
    <div class="bars">
      <span class="tag">AI</span>
      <div class="barwrap"><div class="bar ai" id="hp-ai"></div></div>
    </div>
    <div class="wrap" id="wrap">
      <canvas id="canvas" width="320" height="300"></canvas>
      <div class="overlay" id="overlay">
        <h2 id="ov-title">SILA Stickman Fighter</h2>
        <button id="ov-btn">Fight</button>
      </div>
    </div>
    <div class="controls">
      <div class="ctrl" id="back">◀ BACK</div>
      <div class="ctrl" id="fwd">FWD ▶</div>
      <div class="ctrl" id="punch">👊 PUNCH</div>
      <div class="ctrl" id="kick">🦵 KICK</div>
      <div class="ctrl" id="block">🛡️ BLOCK</div>
    </div>
    <div class="hint">Get close, then Punch/Kick. Block reduces damage.</div>
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
const hpYouEl=document.getElementById('hp-you');
const hpAiEl=document.getElementById('hp-ai');
let you,ai,running=false,frame=0;
const MAXHP=100;
const REACH=54;

function newFighter(x,facing,color){
  return {x,y:groundY,facing,color,hp:MAXHP,state:'idle',stateTimer:0,vx:0,blocking:false,hitFlash:0};
}
function reset(){
  you=newFighter(90,1,'#00c2a0');
  ai=newFighter(230,-1,'#e05c5c');
  frame=0;
  updateBars();
}
function updateBars(){
  hpYouEl.style.width=Math.max(0,you.hp)+'%';
  hpAiEl.style.width=Math.max(0,ai.hp)+'%';
}
function start(){
  reset();running=true;overlay.style.display='none';loop();
}
function endGame(){
  running=false;
  const won=ai.hp<=0;
  ovTitle.textContent=won?'You win! 🏆':'You lost!';
  ovBtn.textContent='Fight again';
  overlay.style.display='flex';
}
function distBetween(){ return Math.abs(you.x-ai.x); }
function setState(f,state,dur){
  f.state=state;f.stateTimer=dur;
}
function tryAttack(f,type){
  if(!running) return;
  if(f.state==='punch'||f.state==='kick'||f.stateTimer>0) return;
  setState(f,type,type==='punch'?16:22);
}
function move(dir){
  if(!running) return;
  if(you.state==='punch'||you.state==='kick') return;
  you.vx=dir*2.4;
  setTimeout(()=>{ you.vx=0; },140);
}
function setBlock(on){
  if(!running) return;
  you.blocking=on;
  you.state=on?'block':'idle';
}
function applyHit(attacker,defender,dmg){
  if(distBetween()>REACH) return false;
  const facingRight=attacker.x<defender.x;
  if((facingRight&&attacker.facing!==1)||(!facingRight&&attacker.facing!==-1)) return false;
  let d=dmg;
  if(defender.blocking) d*=0.3;
  defender.hp-=d;
  defender.hitFlash=8;
  updateBars();
  if(defender.hp<=0){ endGame(); }
  return true;
}
function aiThink(){
  if(!running) return;
  const d=distBetween();
  if(ai.state==='hitstun'||ai.stateTimer>0) return;
  if(d>REACH+10){
    ai.vx=(you.x<ai.x?-1:1)*2.0;
  } else {
    ai.vx=0;
    const r=Math.random();
    if(r<0.35){ setState(ai,'punch',16); }
    else if(r<0.55){ setState(ai,'kick',22); }
    else if(r<0.75){ ai.blocking=true; ai.state='block'; setTimeout(()=>{ if(running){ai.blocking=false; if(ai.state==='block') ai.state='idle';} },500); }
    else { ai.vx=(Math.random()<0.5?-1:1)*2.0; setTimeout(()=>{ ai.vx=0; },200); }
  }
}
function update(){
  frame++;
  if(frame%40===0) aiThink();
  [you,ai].forEach(f=>{
    if(f.stateTimer>0){
      f.stateTimer--;
      if(f.stateTimer===0){
        if(f.state==='punch'||f.state==='kick') f.state='idle';
      }
    }
    f.x+=f.vx;
    f.x=Math.max(30,Math.min(W-30,f.x));
    if(f.hitFlash>0) f.hitFlash--;
  });
  you.facing=you.x<ai.x?1:-1;
  ai.facing=ai.x<you.x?1:-1;
  if(you.state==='punch'&&you.stateTimer===10) applyHit(you,ai,10);
  if(you.state==='kick'&&you.stateTimer===14) applyHit(you,ai,16);
  if(ai.state==='punch'&&ai.stateTimer===10) applyHit(ai,you,8);
  if(ai.state==='kick'&&ai.stateTimer===14) applyHit(ai,you,13);
}
function drawStick(f){
  ctx.save();
  ctx.translate(f.x,f.y);
  ctx.strokeStyle=f.hitFlash>0?'#fff':f.color;
  ctx.lineWidth=4;
  ctx.lineCap='round';
  const punch=f.state==='punch';
  const kick=f.state==='kick';
  const block=f.state==='block';
  const armSwing=punch?18*f.facing:0;
  const legKick=kick?20*f.facing:0;
  ctx.beginPath();ctx.arc(0,-58,10,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(0,-14);ctx.stroke();
  ctx.beginPath();
  if(block){
    ctx.moveTo(0,-42);ctx.lineTo(10*f.facing,-40);
    ctx.moveTo(0,-42);ctx.lineTo(-6*f.facing,-30);
  } else {
    ctx.moveTo(0,-42);ctx.lineTo(10*f.facing+armSwing,-30);
    ctx.moveTo(0,-42);ctx.lineTo(-8*f.facing,-30);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0,-14);ctx.lineTo(8*f.facing+legKick,0);
  ctx.moveTo(0,-14);ctx.lineTo(-7*f.facing,0);
  ctx.stroke();
  ctx.restore();
}
function draw(){
  ctx.fillStyle='#0e3a5f';
  ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#2a3942';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,groundY);ctx.lineTo(W,groundY);ctx.stroke();
  drawStick(you);
  drawStick(ai);
}
function loop(){
  if(!running) return;
  update();
  draw();
  requestAnimationFrame(loop);
}
document.getElementById('back').addEventListener('click',()=>move(-1));
document.getElementById('fwd').addEventListener('click',()=>move(1));
document.getElementById('punch').addEventListener('click',()=>tryAttack(you,'punch'));
document.getElementById('kick').addEventListener('click',()=>tryAttack(you,'kick'));
document.getElementById('block').addEventListener('pointerdown',()=>setBlock(true));
document.getElementById('block').addEventListener('pointerup',()=>setBlock(false));
document.getElementById('block').addEventListener('pointerleave',()=>setBlock(false));
ovBtn.addEventListener('click',start);
reset();
draw();
})();
</script>
</body>
</html>
`;

// ============================================
// Sends the actual fullscreen HTML game payload
// (same GenAI rich-response pattern as before)
// ============================================
async function sendStickmanGame(sock, sender) {
  const responseId = 'sila-stickman-' + Date.now();
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
          submessages: [{ messageType: 2, messageText: "🥋 Stickman Fighter" }],
          unifiedResponse: {
            data: Buffer.from(JSON.stringify({
              "response_id": responseId,
              "sections": [{
                "view_model": {
                  "primitive": {
                    "__typename": "GenAIaeacdsnwHtmlPrimitive",
                    "payload": stickmanHtml,
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
}

// Pulls a selected id out of whatever shape the button reply arrives in.
// Different Baileys/WA versions surface native_flow replies differently,
// so we check the common ones defensively.
function extractSelectedId(m) {
  const msg = m?.message;
  if (!msg) return null;
  const nativeFlow = msg.interactiveResponseMessage?.nativeFlowResponseMessage;
  if (nativeFlow?.paramsJson) {
    try {
      const parsed = JSON.parse(nativeFlow.paramsJson);
      if (parsed?.id) return parsed.id;
    } catch (e) {}
  }
  if (msg.buttonsResponseMessage?.selectedButtonId) {
    return msg.buttonsResponseMessage.selectedButtonId;
  }
  if (msg.templateButtonReplyMessage?.selectedId) {
    return msg.templateButtonReplyMessage.selectedId;
  }
  if (msg.listResponseMessage?.singleSelectReply?.selectedRowId) {
    return msg.listResponseMessage.singleSelectReply.selectedRowId;
  }
  return null;
}

export default {
  name: 'stickman',
  alias: ['stickmanfight', 'kipande'],
  description: 'Play Stickman Fighter vs AI in WhatsApp (button-launched fullscreen)',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const BUTTON_ID = 'sila_play_stickman';

    try {
      // 1. Send the interactive button first
      await new ButtonV2(sock)
        .setBody('Tayari kupambana? 🥋')
        .setFooter('𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡🤓')
        .setThumbnail('https://i.ibb.co/674988wP/silatech.jpg')
        .addRawButton({
          buttonText: { displayText: 'Play Stickman Fighter' },
          buttonId: BUTTON_ID,
          type: 1,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: 'Bonyeza kucheza!',
              sections: [{
                title: 'SILA TECH Games',
                highlight_label: '',
                rows: [{
                  header: '',
                  title: '🥋 Stickman Fighter',
                  description: 'Piga ngumi/mateke dhidi ya AI',
                  id: BUTTON_ID
                }]
              }]
            })
          }
        })
        .send(sender);

      // 2. Listen for the tap on that button, then open the fullscreen game
      const listener = async ({ messages }) => {
        for (const m of messages) {
          if (m.key.remoteJid !== sender) continue;
          if (!m.message) continue;
          const selected = extractSelectedId(m);
          if (selected === BUTTON_ID) {
            sock.ev.off('messages.upsert', listener);
            clearTimeout(cleanupTimer);
            await sendStickmanGame(sock, sender);
          }
        }
      };
      sock.ev.on('messages.upsert', listener);

      // Auto-cleanup the listener after 5 minutes so it doesn't leak
      const cleanupTimer = setTimeout(() => {
        sock.ev.off('messages.upsert', listener);
      }, 5 * 60 * 1000);

    } catch (error) {
      console.error('[STICKMAN]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
