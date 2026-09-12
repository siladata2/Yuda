const memoryHtml = `
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
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow-x:hidden;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.stats{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:14px;}
.stats b{color:var(--ink);font-weight:600;margin-left:4px;}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.tile{aspect-ratio:1;background:var(--cell-bg);border:1px solid var(--line);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;position:relative;transform-style:preserve-3d;transition:transform .35s ease,background .2s ease;}
.tile .face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;backface-visibility:hidden;border-radius:10px;}
.tile .back{background:var(--card-2);font-size:16px;color:var(--muted);}
.tile .front{transform:rotateY(180deg);}
.tile.flipped{transform:rotateY(180deg);}
.tile.matched{background:rgba(0,168,132,0.15);border-color:var(--accent);}
.footer{margin-top:16px;display:flex;justify-content:center;}
.footer__reset{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:8px 16px;}
.win{text-align:center;font-size:14px;color:var(--accent);font-weight:600;margin-top:10px;min-height:18px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Memory Match</div>
      <div class="header__sub">Solo</div>
    </div>
    <div class="stats">
      <span>Moves<b id="moves">0</b></span>
      <span>Pairs<b id="pairs">0/8</b></span>
    </div>
    <div class="grid" id="grid"></div>
    <div class="win" id="win"></div>
    <div class="footer"><button class="footer__reset" id="reset">New game</button></div>
  </div>
</main>
<script>
(function(){
const ICONS=['🍎','🍋','🍇','🍉','🍓','🍒','🍑','🥝'];
let deck=[],flipped=[],matched=0,moves=0,lock=false;
const grid=document.getElementById('grid');
const movesEl=document.getElementById('moves');
const pairsEl=document.getElementById('pairs');
const winEl=document.getElementById('win');

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
function build(){
  deck=shuffle([...ICONS,...ICONS]);
  flipped=[];matched=0;moves=0;lock=false;
  movesEl.textContent='0';pairsEl.textContent='0/8';winEl.textContent='';
  grid.innerHTML='';
  deck.forEach((icon,i)=>{
    const t=document.createElement('div');
    t.className='tile';
    t.dataset.icon=icon;
    t.dataset.idx=i;
    t.innerHTML='<div class="face back">?</div><div class="face front">'+icon+'</div>';
    t.addEventListener('click',()=>flip(t));
    grid.appendChild(t);
  });
}
function flip(t){
  if(lock) return;
  if(t.classList.contains('flipped')||t.classList.contains('matched')) return;
  t.classList.add('flipped');
  flipped.push(t);
  if(flipped.length===2){
    moves++;movesEl.textContent=moves;
    lock=true;
    const [a,b]=flipped;
    if(a.dataset.icon===b.dataset.icon){
      a.classList.add('matched');b.classList.add('matched');
      matched++;pairsEl.textContent=matched+'/8';
      flipped=[];lock=false;
      if(matched===8){winEl.textContent='Solved in '+moves+' moves! 🎉';}
    } else {
      setTimeout(()=>{
        a.classList.remove('flipped');b.classList.remove('flipped');
        flipped=[];lock=false;
      },700);
    }
  }
}
document.getElementById('reset').addEventListener('click',build);
build();
})();
</script>
</body>
</html>
`;

export default {
  name: 'memory',
  alias: ['kumbukumbu', 'matchgame', 'cardmatch'],
  description: 'Play a memory card matching game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-memory-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🧠 Memory Match" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": memoryHtml,
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
      console.error('[MEMORY]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
