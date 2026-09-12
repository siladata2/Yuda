const connect4Html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{--card-2:#2a3942;--ink:#e9edef;--ink-soft:#aebac1;--muted:#8696a0;
--accent:#00a884;--line:#2a3942;--line-strong:#374248;--cell-bg:#111b21;
--y:#f2c265;--r:#e05c5c;
--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow-x:hidden;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.status{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:13px;}
.status__turn{display:flex;align-items:center;gap:8px;color:var(--ink-soft);}
.dot{width:14px;height:14px;border-radius:50%;background:var(--y);}
.dot.is-r{background:var(--r);}
.status__score{display:flex;gap:10px;color:var(--muted);font-size:12px;}
.status__score b{color:var(--ink);margin-left:3px;}
.board{position:relative;background:#0e3a5f;border:1px solid var(--line);border-radius:10px;padding:6px;display:grid;grid-template-columns:repeat(7,1fr);gap:5px;}
.col{display:flex;flex-direction:column-reverse;gap:5px;cursor:pointer;}
.hole{aspect-ratio:1;border-radius:50%;background:#0b141a;position:relative;}
.hole .piece{position:absolute;inset:6%;border-radius:50%;background:var(--y);transform:scale(0);transition:transform .18s cubic-bezier(.34,1.56,.64,1);}
.hole.filled-y .piece{background:var(--y);transform:scale(1);}
.hole.filled-r .piece{background:var(--r);transform:scale(1);}
.hole.win .piece{box-shadow:0 0 0 3px var(--accent);}
.levels{margin-top:14px;}
.levels__label{font-size:11px;color:var(--muted);margin-bottom:8px;}
.levels__list{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 6px;}
.levels__list::-webkit-scrollbar{display:none;}
.level{background:transparent;border:1px solid var(--line-strong);border-radius:20px;padding:9px 16px;font-size:13px;color:var(--ink-soft);cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;}
.level.is-active{background:var(--accent);border-color:var(--accent);color:#0b141a;}
.footer{margin-top:12px;display:flex;justify-content:center;}
.footer__reset{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:8px 16px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Connect Four</div>
      <div class="header__sub">VS AI</div>
    </div>
    <div class="status">
      <div class="status__turn"><span class="dot" id="dot"></span><span id="status-text">Your turn</span></div>
      <div class="status__score"><span>You<b id="s-you">0</b></span><span>AI<b id="s-ai">0</b></span></div>
    </div>
    <div class="board" id="board"></div>
    <div class="levels">
      <div class="levels__label">Difficulty</div>
      <div class="levels__list" id="levels-list"></div>
    </div>
    <div class="footer"><button class="footer__reset" id="reset">Reset board</button></div>
  </div>
</main>
<script>
(function(){
const COLS=7,ROWS=6;
const LEVELS=['Easy','Medium','Hard'];
const DEPTHS=[2,4,6];
let board,turn,over,thinking,level=1,scores={you:0,ai:0};
const boardEl=document.getElementById('board');
const statusText=document.getElementById('status-text');
const dot=document.getElementById('dot');
const levelsList=document.getElementById('levels-list');

function buildLevels(){
  levelsList.innerHTML='';
  LEVELS.forEach((name,i)=>{
    const b=document.createElement('button');
    b.className='level'+(i===level?' is-active':'');
    b.textContent=name;
    b.addEventListener('click',()=>{level=i;document.querySelectorAll('.level').forEach((el,idx)=>el.classList.toggle('is-active',idx===i));reset();});
    levelsList.appendChild(b);
  });
}
function buildBoard(){
  boardEl.innerHTML='';
  for(let c=0;c<COLS;c++){
    const col=document.createElement('div');
    col.className='col';
    col.dataset.col=c;
    for(let r=0;r<ROWS;r++){
      const h=document.createElement('div');
      h.className='hole';
      h.innerHTML='<div class="piece"></div>';
      col.appendChild(h);
    }
    col.addEventListener('click',()=>onCol(c));
    boardEl.appendChild(col);
  }
}
function reset(){
  board=Array.from({length:COLS},()=>Array(ROWS).fill(null));
  turn='Y';over=false;thinking=false;
  render();
}
function render(){
  for(let c=0;c<COLS;c++){
    const col=boardEl.children[c];
    for(let r=0;r<ROWS;r++){
      const h=col.children[r];
      const v=board[c][r];
      h.className='hole'+(v?' filled-'+v.toLowerCase():'');
    }
  }
  if(over){statusText.textContent='Game over';}
  else if(thinking){statusText.textContent='AI is thinking…';}
  else {statusText.textContent=turn==='Y'?'Your turn':'AI turn';}
  dot.className='dot'+(turn==='R'?' is-r':'');
  document.getElementById('s-you').textContent=scores.you;
  document.getElementById('s-ai').textContent=scores.ai;
}
function drop(c,player){
  for(let r=0;r<ROWS;r++){
    if(!board[c][r]){board[c][r]=player;return r;}
  }
  return -1;
}
function onCol(c){
  if(over||thinking||turn!=='Y') return;
  const r=drop(c,'Y');
  if(r<0) return;
  render();
  if(checkWin('Y')){scores.you++;over=true;render();markWin('Y');return;}
  if(isFull()){over=true;render();return;}
  turn='R';thinking=true;render();
  setTimeout(aiMove,400);
}
function aiMove(){
  const c=bestMove(DEPTHS[level]);
  const r=drop(c,'R');
  thinking=false;
  render();
  if(r>=0&&checkWin('R')){scores.ai++;over=true;render();markWin('R');return;}
  if(isFull()){over=true;render();return;}
  turn='Y';render();
}
function isFull(){return board.every(col=>col[ROWS-1]!==null);}
function validCols(b){const v=[];for(let c=0;c<COLS;c++) if(!b[c][ROWS-1]) v.push(c);return v;}
function checkWinBoard(b,player){
  for(let c=0;c<COLS;c++)for(let r=0;r<ROWS;r++){
    if(b[c][r]!==player) continue;
    if(c+3<COLS&&b[c+1][r]===player&&b[c+2][r]===player&&b[c+3][r]===player) return true;
    if(r+3<ROWS&&b[c][r+1]===player&&b[c][r+2]===player&&b[c][r+3]===player) return true;
    if(c+3<COLS&&r+3<ROWS&&b[c+1][r+1]===player&&b[c+2][r+2]===player&&b[c+3][r+3]===player) return true;
    if(c+3<COLS&&r-3>=0&&b[c+1][r-1]===player&&b[c+2][r-2]===player&&b[c+3][r-3]===player) return true;
  }
  return false;
}
function checkWin(player){return checkWinBoard(board,player);}
function markWin(player){
  // simple full-board flash could be added; kept minimal
}
function scorePosition(b,player){
  let score=0;
  const opp=player==='R'?'Y':'R';
  const centerCol=Math.floor(COLS/2);
  for(let r=0;r<ROWS;r++) if(b[centerCol][r]===player) score+=3;
  function windowScore(cells){
    const p=cells.filter(v=>v===player).length;
    const o=cells.filter(v=>v===opp).length;
    const e=cells.filter(v=>v===null).length;
    if(p===4) return 100;
    if(p===3&&e===1) return 5;
    if(p===2&&e===2) return 2;
    if(o===3&&e===1) return -4;
    return 0;
  }
  for(let c=0;c<COLS;c++)for(let r=0;r<ROWS;r++){
    if(c+3<COLS) score+=windowScore([b[c][r],b[c+1][r],b[c+2][r],b[c+3][r]]);
    if(r+3<ROWS) score+=windowScore([b[c][r],b[c][r+1],b[c][r+2],b[c][r+3]]);
    if(c+3<COLS&&r+3<ROWS) score+=windowScore([b[c][r],b[c+1][r+1],b[c+2][r+2],b[c+3][r+3]]);
    if(c+3<COLS&&r-3>=0) score+=windowScore([b[c][r],b[c+1][r-1],b[c+2][r-2],b[c+3][r-3]]);
  }
  return score;
}
function cloneBoard(b){return b.map(col=>[...col]);}
function dropSim(b,c,player){
  const nb=cloneBoard(b);
  for(let r=0;r<ROWS;r++){ if(!nb[c][r]){nb[c][r]=player;return nb;} }
  return nb;
}
function minimax(b,depth,alpha,beta,maximizing){
  const valid=validCols(b);
  const win=checkWinBoard(b,'R')?'R':checkWinBoard(b,'Y')?'Y':null;
  if(depth===0||win||!valid.length){
    if(win==='R') return {score:1000000};
    if(win==='Y') return {score:-1000000};
    if(!valid.length) return {score:0};
    return {score:scorePosition(b,'R')};
  }
  if(maximizing){
    let value=-Infinity,col=valid[0];
    for(const c of valid){
      const nb=dropSim(b,c,'R');
      const res=minimax(nb,depth-1,alpha,beta,false);
      if(res.score>value){value=res.score;col=c;}
      alpha=Math.max(alpha,value);
      if(alpha>=beta) break;
    }
    return {score:value,col};
  } else {
    let value=Infinity,col=valid[0];
    for(const c of valid){
      const nb=dropSim(b,c,'Y');
      const res=minimax(nb,depth-1,alpha,beta,true);
      if(res.score<value){value=res.score;col=c;}
      beta=Math.min(beta,value);
      if(alpha>=beta) break;
    }
    return {score:value,col};
  }
}
function bestMove(depth){
  const res=minimax(board,depth,-Infinity,Infinity,true);
  return res.col!==undefined?res.col:validCols(board)[0];
}
document.getElementById('reset').addEventListener('click',reset);
buildLevels();
buildBoard();
reset();
})();
</script>
</body>
</html>
`;

export default {
  name: 'connect4',
  alias: ['connectfour', 'tegeamawe', 'c4'],
  description: 'Play Connect Four vs AI in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-connect4-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🔴🟡 Connect Four" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": connect4Html,
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
      console.error('[CONNECT4]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
