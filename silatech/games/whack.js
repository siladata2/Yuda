const whackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{--card-2:#2a3942;--ink:#e9edef;--muted:#8696a0;--accent:#00a884;--line:#2a3942;--cell-bg:#111b21;
--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow:hidden;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.stats{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:14px;}
.stats b{color:var(--ink);font-weight:600;margin-left:4px;}
.stats .time{color:var(--accent);font-weight:700;}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.hole{aspect-ratio:1;background:var(--cell-bg);border:1px solid var(--line);border-radius:50%;position:relative;overflow:hidden;cursor:pointer;}
.mole{position:absolute;left:50%;bottom:-100%;width:64%;height:64%;transform:translateX(-50%);border-radius:50%;background:#8b5e34;display:flex;align-items:center;justify-content:center;font-size:26px;transition:bottom .12s ease;}
.hole.up .mole{bottom:8%;}
.hole.bad .mole{background:#e05c5c;}
.hole.hit .mole{filter:brightness(1.6);}
.overlay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(11,20,26,0.82);z-index:5;}
.overlay.show{display:flex;}
.overlay h2{font-size:20px;}
.overlay button{background:var(--accent);border:none;border-radius:8px;color:#0b141a;font-weight:700;font-family:inherit;padding:10px 22px;font-size:14px;cursor:pointer;}
.hint{font-size:11px;color:var(--muted);text-align:center;margin-top:10px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Whack-a-Mole</div>
      <div class="header__sub">30s round</div>
    </div>
    <div class="stats">
      <span>Score<b id="score">0</b></span>
      <span>Best<b id="best">0</b></span>
      <span class="time"><span id="time">30</span>s</span>
    </div>
    <div class="grid" id="grid"></div>
    <div class="hint">Tap the brown mole 🐹 — avoid the red one 🔴</div>
  </div>
  <div class="overlay" id="overlay">
    <h2 id="ov-title">SILA Whack-a-Mole</h2>
    <button id="ov-btn">Start</button>
  </div>
</main>
<script>
(function(){
const holes=[];
let score=0,best=0,time=30,timer=null,spawner=null,running=false;
const grid=document.getElementById('grid');
const overlay=document.getElementById('overlay');
const ovTitle=document.getElementById('ov-title');
const ovBtn=document.getElementById('ov-btn');

for(let i=0;i<9;i++){
  const h=document.createElement('div');
  h.className='hole';
  h.innerHTML='<div class="mole"></div>';
  h.addEventListener('click',()=>hit(i));
  grid.appendChild(h);
  holes.push({el:h,up:false,bad:false});
}
function hit(i){
  if(!running) return;
  const h=holes[i];
  if(!h.up) return;
  h.el.classList.add('hit');
  setTimeout(()=>h.el.classList.remove('hit'),120);
  if(h.bad){
    score=Math.max(0,score-5);
  } else {
    score+=10;
  }
  document.getElementById('score').textContent=score;
  hide(i);
}
function show(i){
  const h=holes[i];
  h.bad=Math.random()<0.25;
  h.el.querySelector('.mole').textContent=h.bad?'🔴':'🐹';
  h.el.classList.toggle('bad',h.bad);
  h.el.classList.add('up');
  h.up=true;
  setTimeout(()=>{ if(h.up) hide(i); },700+Math.random()*400);
}
function hide(i){
  const h=holes[i];
  h.up=false;
  h.el.classList.remove('up');
}
function spawnLoop(){
  const empty=holes.map((h,i)=>h.up?-1:i).filter(i=>i>=0);
  if(empty.length){
    const i=empty[Math.floor(Math.random()*empty.length)];
    show(i);
  }
}
function start(){
  score=0;time=30;running=true;
  document.getElementById('score').textContent='0';
  document.getElementById('time').textContent='30';
  overlay.classList.remove('show');
  timer=setInterval(()=>{
    time--;
    document.getElementById('time').textContent=time;
    if(time<=0) end();
  },1000);
  spawner=setInterval(spawnLoop,650);
}
function end(){
  running=false;
  clearInterval(timer);clearInterval(spawner);
  holes.forEach((h,i)=>hide(i));
  if(score>best){best=score;}
  document.getElementById('best').textContent=best;
  ovTitle.textContent='Time up — Score '+score;
  ovBtn.textContent='Play again';
  overlay.classList.add('show');
}
ovBtn.addEventListener('click',start);
})();
</script>
</body>
</html>
`;

export default {
  name: 'whack',
  alias: ['whackamole', 'piga'],
  description: 'Play Whack-a-Mole action game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-whack-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🐹 Whack-a-Mole" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": whackHtml,
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
      console.error('[WHACK]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
