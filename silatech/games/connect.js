import { randomUUID } from 'crypto';

// ============================================
// HTML CONNECT 4 GAME SOURCE CODE
// ============================================
const connect4Html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{
  --bg:transparent;
  --card-2:#1f2c34;
  --ink:#e9edef;
  --muted:#8696a0;
  --accent:#00a884;
  --board-bg:#0b141a;
  --grid-blue:#128c7e;
  --empty-cell:#202c33;
  --p1-red:#ff4b4b;
  --p2-yellow:#ffc107;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
html,body{
  background:transparent;
  color:var(--ink);
  font-family:var(--sys);
  min-height:100vh;
  display:flex;align-items:center;justify-content:center;
  padding:16px;
}
.card{width:100%;max-width:360px}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #2a3942;padding-bottom:8px}
.header__title{font-size:16px;font-weight:700;color:var(--accent)}
.header__sub{font-size:12px;color:var(--muted)}
.status{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:13px}
.status__turn{display:flex;align-items:center;gap:6px}
.disc-icon{width:12px;height:12px;border-radius:50%;background:var(--p1-red)}
.disc-icon.ai{background:var(--p2-yellow)}
.board{
  display:grid;grid-template-columns:repeat(7,1fr);gap:6px;
  background:var(--grid-blue);padding:10px;border-radius:12px;
  box-shadow:0 8px 20px rgba(0,0,0,0.4);
}
.cell{
  width:100%;aspect-ratio:1;background:var(--empty-cell);
  border-radius:50%;cursor:pointer;position:relative;
  transition:background .2s ease, transform .1s;
}
.cell:hover{transform:scale(1.05)}
.cell.red{background:var(--p1-red);box-shadow:inset 0 -3px 0 rgba(0,0,0,0.2)}
.cell.yellow{background:var(--p2-yellow);box-shadow:inset 0 -3px 0 rgba(0,0,0,0.2)}
.cell.win{animation:pulse 0.6s infinite alternate}
@keyframes pulse{from{transform:scale(0.9)}to{transform:scale(1.1)}}
.footer{margin-top:14px;text-align:center}
.reset-btn{
  background:transparent;border:1px solid var(--accent);color:var(--accent);
  padding:8px 16px;border-radius:20px;font-weight:600;cursor:pointer;font-size:12px;
}
.reset-btn:hover{background:var(--accent);color:#000}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="header__title">SILA Connect 4</div>
    <div class="header__sub">VS AI</div>
  </div>
  <div class="status">
    <div class="status__turn">
      <span class="disc-icon" id="disc"></span>
      <span id="status-text">Your turn</span>
    </div>
    <div style="font-size:12px;color:var(--muted)">Connect 4 in a row</div>
  </div>
  <div class="board" id="board"></div>
  <div class="footer">
    <button class="reset-btn" id="reset">New Game</button>
  </div>
</div>

<script>
(function(){
const ROWS=6, COLS=7;
let board=Array(ROWS).fill(null).map(()=>Array(COLS).fill(0));
let turn=1; // 1: You (Red), 2: AI (Yellow)
let gameOver=false;

const boardEl=document.getElementById('board');
const statusText=document.getElementById('status-text');
const disc=document.getElementById('disc');

function init(){
  boardEl.innerHTML='';
  board=Array(ROWS).fill(null).map(()=>Array(COLS).fill(0));
  gameOver=false;
  turn=1;
  updateStatus();
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const cell=document.createElement('div');
      cell.className='cell';
      cell.dataset.col=c;
      cell.dataset.row=r;
      cell.addEventListener('click',()=>makeMove(c));
      boardEl.appendChild(cell);
    }
  }
}

function updateStatus(){
  if(gameOver) return;
  if(turn===1){
    statusText.textContent="Your turn";
    disc.className="disc-icon";
  } else {
    statusText.textContent="AI thinking...";
    disc.className="disc-icon ai";
  }
}

function makeMove(col){
  if(gameOver || turn!==1) return;
  for(let r=ROWS-1; r>=0; r--){
    if(board[r][col]===0){
      board[r][col]=1;
      renderBoard();
      if(checkWin(r,col,1)){
        statusText.textContent="🎉 You Won!";
        gameOver=true;
        return;
      }
      turn=2;
      updateStatus();
      setTimeout(aiMove, 400);
      return;
    }
  }
}

function aiMove(){
  if(gameOver) return;
  let validCols=[];
  for(let c=0;c<COLS;c++) if(board[0][c]===0) validCols.push(c);
  if(!validCols.length) return;
  
  // Basic AI choice
  let col = validCols[Math.floor(Math.random()*validCols.length)];
  for(let r=ROWS-1; r>=0; r--){
    if(board[r][col]===0){
      board[r][col]=2;
      renderBoard();
      if(checkWin(r,col,2)){
        statusText.textContent="🤖 AI Won!";
        gameOver=true;
        return;
      }
      turn=1;
      updateStatus();
      return;
    }
  }
}

function renderBoard(){
  const cells=boardEl.children;
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const idx=r*COLS+c;
      const val=board[r][c];
      cells[idx].className='cell'+(val===1?' red':val===2?' yellow':'');
    }
  }
}

function checkWin(r,c,p){
  const dir=[[0,1],[1,0],[1,1],[1,-1]];
  for(let [dr,dc] of dir){
    let count=1;
    for(let i=1;i<4;i++){
      let nr=r+dr*i, nc=c+dc*i;
      if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&board[nr][nc]===p) count++; else break;
    }
    for(let i=1;i<4;i++){
      let nr=r-dr*i, nc=c-dc*i;
      if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&board[nr][nc]===p) count++; else break;
    }
    if(count>=4) return true;
  }
  return false;
}

document.getElementById('reset').addEventListener('click',init);
init();
})();
</script>
</body>
</html>
`;

// ============================================
// BOT COMMAND IMPLEMENTATION
// ============================================
export default {
  name: 'connect4',
  alias: ['c4', 'connectfour'],
  description: 'Play live HTML Connect 4 game vs AI',
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
                  messageText: "🔴🟡 Connect 4 vs AI"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [
                    {
                      "view_model": {
                        "primitive": {
                          "__typename": "GenAIaeacdsnwHtmlPrimitive",
                          "payload": connect4Html,
                          "trusted_sources": ["sila-tech"]
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    }
                  ]
                })).toString('base64')
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

      await sock.relayMessage(sender, content, {});

    } catch (error) {
      console.error('[CONNECT4]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      }, { quoted: msg });
    }
  }
};
