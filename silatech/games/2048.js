const g2048Html = `
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
.board{position:relative;width:100%;aspect-ratio:1;background:var(--cell-bg);border:1px solid var(--line);border-radius:10px;padding:8px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);gap:8px;}
.bgcell{background:rgba(255,255,255,0.03);border-radius:8px;}
.tile{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:700;transition:top .12s ease,left .12s ease,transform .12s ease;color:#0b141a;}
.tile.new{animation:pop .18s ease;}
@keyframes pop{from{transform:scale(.5)}to{transform:scale(1)}}
.controls{display:flex;justify-content:center;margin-top:14px;}
.pad{display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(3,44px);gap:4px;}
.pad button{background:var(--card-2);border:1px solid var(--line-strong);border-radius:8px;color:var(--ink);font-size:16px;cursor:pointer;}
.pad button:active{background:var(--accent);}
.footer{margin-top:14px;display:flex;justify-content:center;}
.footer__reset{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:8px 16px;}
.msg{text-align:center;font-size:14px;color:var(--accent);font-weight:600;margin-top:8px;min-height:18px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA 2048</div>
      <div class="header__sub">Swipe or tap</div>
    </div>
    <div class="stats"><span>Score<b id="score">0</b></span><span>Best<b id="best">0</b></span></div>
    <div class="board" id="board"></div>
    <div class="msg" id="msg"></div>
    <div class="controls">
      <div class="pad">
        <span></span><button id="up">↑</button><span></span>
        <button id="left">←</button><span></span><button id="right">→</button>
        <span></span><button id="down">↓</button><span></span>
      </div>
    </div>
    <div class="footer"><button class="footer__reset" id="reset">New game</button></div>
  </div>
</main>
<script>
(function(){
const SIZE=4;
let grid,score=0,best=0,over=false;
const boardEl=document.getElementById('board');
const scoreEl=document.getElementById('score');
const bestEl=document.getElementById('best');
const msgEl=document.getElementById('msg');
const COLORS={2:'#e9edef',4:'#d9e2e6',8:'#8fd6b8',16:'#5fc79f',32:'#33b88a',64:'#00a884',
128:'#00c2a0',256:'#00d9b3',512:'#f2c265',1024:'#f2a13f',2048:'#f27e3f'};

function initBg(){
  boardEl.innerHTML='';
  for(let i=0;i<16;i++){
    const c=document.createElement('div');
    c.className='bgcell';
    boardEl.appendChild(c);
  }
}
function newGrid(){
  grid=Array.from({length:SIZE},()=>Array(SIZE).fill(0));
  score=0;over=false;msgEl.textContent='';
  addTile();addTile();
  render();
}
function addTile(){
  const empty=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++) if(grid[r][c]===0) empty.push([r,c]);
  if(!empty.length) return;
  const [r,c]=empty[Math.floor(Math.random()*empty.length)];
  grid[r][c]=Math.random()<0.9?2:4;
}
function render(){
  initBg();
  const cellSize=(boardEl.clientWidth-16-8*3)/4;
  for(let r=0;r<SIZE;r++){
    for(let c=0;c<SIZE;c++){
      const v=grid[r][c];
      if(!v) continue;
      const t=document.createElement('div');
      t.className='tile new';
      t.textContent=v;
      t.style.width=cellSize+'px';
      t.style.height=cellSize+'px';
      t.style.left=(8+c*(cellSize+8))+'px';
      t.style.top=(8+r*(cellSize+8))+'px';
      t.style.background=COLORS[v]||'#f2593f';
      t.style.fontSize=(v<100?22:v<1000?18:14)+'px';
      if(v>4) t.style.color='#0b141a';
      boardEl.appendChild(t);
    }
  }
  scoreEl.textContent=score;
  if(score>best){best=score;}
  bestEl.textContent=best;
}
function slide(row){
  const filtered=row.filter(v=>v!==0);
  const result=[];
  for(let i=0;i<filtered.length;i++){
    if(filtered[i]===filtered[i+1]){
      result.push(filtered[i]*2);
      score+=filtered[i]*2;
      i++;
    } else {
      result.push(filtered[i]);
    }
  }
  while(result.length<SIZE) result.push(0);
  return result;
}
function rotate(g){
  const n=g.length;
  const res=Array.from({length:n},()=>Array(n).fill(0));
  for(let r=0;r<n;r++) for(let c=0;c<n;c++) res[c][n-1-r]=g[r][c];
  return res;
}
function move(dir){
  if(over) return;
  let g=grid.map(r=>[...r]);
  let rotations=0;
  if(dir==='up') rotations=3;
  else if(dir==='right') rotations=2;
  else if(dir==='down') rotations=1;
  for(let i=0;i<rotations;i++) g=rotate(g);
  let moved=false;
  for(let r=0;r<SIZE;r++){
    const before=g[r].join(',');
    g[r]=slide(g[r]);
    if(g[r].join(',')!==before) moved=true;
  }
  for(let i=0;i<(4-rotations)%4;i++) g=rotate(g);
  if(moved){
    grid=g;
    addTile();
    render();
    checkOver();
  }
}
function checkOver(){
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(grid[r][c]===0) return;
    if(grid[r][c]===2048){msgEl.textContent='You reached 2048! 🎉';over=true;return;}
    if(c<SIZE-1&&grid[r][c]===grid[r][c+1]) return;
    if(r<SIZE-1&&grid[r][c]===grid[r+1][c]) return;
  }
  over=true;
  msgEl.textContent='Game over';
}
document.getElementById('up').addEventListener('click',()=>move('up'));
document.getElementById('down').addEventListener('click',()=>move('down'));
document.getElementById('left').addEventListener('click',()=>move('left'));
document.getElementById('right').addEventListener('click',()=>move('right'));
document.getElementById('reset').addEventListener('click',newGrid);
document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowUp') move('up');
  else if(e.key==='ArrowDown') move('down');
  else if(e.key==='ArrowLeft') move('left');
  else if(e.key==='ArrowRight') move('right');
});
let sx=0,sy=0;
document.body.addEventListener('touchstart',(e)=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;});
document.body.addEventListener('touchend',(e)=>{
  const dx=e.changedTouches[0].clientX-sx;
  const dy=e.changedTouches[0].clientY-sy;
  if(Math.max(Math.abs(dx),Math.abs(dy))<24) return;
  if(Math.abs(dx)>Math.abs(dy)) move(dx>0?'right':'left');
  else move(dy>0?'down':'up');
});
newGrid();
})();
</script>
</body>
</html>
`;

export default {
  name: '2048',
  alias: ['twozerofourfive', 'mchezo2048'],
  description: 'Play 2048 puzzle game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-2048-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🔢 2048" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": g2048Html,
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
      console.error('[2048]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
