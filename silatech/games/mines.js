const gMinesHtml = `
<style>
:root {
  --card-2: #2a3942;
  --ink: #e9edef;
  --ink-soft: #aebac1;
  --muted: #8696a0;
  --accent: #00a884;
  --danger: #f2593f;
  --gold: #f2c265;
  --line: #2a3942;
  --cell-bg: #111b21;
  --cell-hidden: #202c33;
  --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
html, body { background: transparent; color: var(--ink); font-family: var(--sys); min-height: 100vh; overflow: hidden; touch-action: none; }
.stage { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; }
.card { width: 100%; max-width: 360px; }
.header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
.header__title { font-size: 17px; font-weight: 600; color: var(--gold); }
.header__sub { font-size: 12px; color: var(--muted); }
.stats { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.stats b { color: var(--ink); font-weight: 600; margin-left: 4px; }
.board { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; width: 100%; aspect-ratio: 1; background: var(--cell-bg); padding: 10px; border: 1px solid var(--line); border-radius: 10px; }
.cell { background: var(--cell-hidden); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.1s ease, background 0.2s ease; }
.cell:active { transform: scale(0.95); }
.cell.revealed { background: var(--card-2); }
.cell.gem { background: rgba(0, 168, 132, 0.2); border-color: var(--accent); }
.cell.mine { background: rgba(242, 89, 63, 0.2); border-color: var(--danger); }
.controls { display: flex; gap: 8px; margin-top: 14px; }
.btn { flex: 1; background: var(--card-2); border: 1px solid var(--line); border-radius: 8px; color: var(--ink); font-weight: 600; padding: 12px 0; font-size: 13px; cursor: pointer; text-align: center; }
.btn:active { background: var(--accent); color: #0b141a; }
.btn-cashout { background: var(--gold); color: #0b141a; border: none; }
.footer { margin-top: 10px; display: flex; justify-content: center; }
.footer__reset { background: none; border: none; color: var(--accent); font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; padding: 6px 12px; }
.msg { text-align: center; font-size: 14px; color: var(--accent); font-weight: 600; margin-top: 8px; min-height: 18px; }
</style>

<div class="stage">
  <div class="card">
    <div class="header">
      <span class="header__title">💎 MINES SWEEPER</span>
      <span class="header__sub">Avoid the 💣</span>
    </div>
    <div class="stats">
      <span>MULTIPLIER<b id="mult" style="color:var(--gold)">1.00x</b></span>
      <span>GEMS<b id="gems">0/22</b></span>
      <span>SCORE<b id="score">0</b></span>
    </div>
    <div class="board" id="board"></div>
    <div class="msg" id="msg">Select a tile to start!</div>
    <div class="controls">
      <button class="btn btn-cashout" id="btn-cashout">💰 CASHOUT</button>
    </div>
    <div class="footer">
      <button class="footer__reset" id="reset">New Game</button>
    </div>
  </div>
</div>

<script>
(function() {
  const SIZE = 25;
  const MINE_COUNT = 3;
  let grid = [], revealed = [];
  let score = 0, multiplier = 1.0, gemsFound = 0, gameOver = false, gameStarted = false;

  const boardEl = document.getElementById('board');
  const multEl = document.getElementById('mult');
  const gemsEl = document.getElementById('gems');
  const scoreEl = document.getElementById('score');
  const msgEl = document.getElementById('msg');
  const cashoutBtn = document.getElementById('btn-cashout');

  function initGame() {
    grid = Array(SIZE).fill('gem');
    revealed = Array(SIZE).fill(false);
    
    // Plant Mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      let idx = Math.floor(Math.random() * SIZE);
      if (grid[idx] !== 'mine') {
        grid[idx] = 'mine';
        minesPlaced++;
      }
    }

    score = 0;
    multiplier = 1.00;
    gemsFound = 0;
    gameOver = false;
    gameStarted = false;

    multEl.textContent = multiplier.toFixed(2) + 'x';
    gemsEl.textContent = '0/' + (SIZE - MINE_COUNT);
    scoreEl.textContent = score;
    msgEl.textContent = 'Pick a tile to find gems!';
    msgEl.style.color = 'var(--accent)';
    cashoutBtn.style.opacity = '0.5';

    renderBoard();
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;

      if (revealed[i]) {
        cell.classList.add('revealed');
        if (grid[i] === 'mine') {
          cell.classList.add('mine');
          cell.textContent = '💣';
        } else {
          cell.classList.add('gem');
          cell.textContent = '💎';
        }
      }

      cell.addEventListener('click', () => clickTile(i));
      boardEl.appendChild(cell);
    }
  }

  function clickTile(idx) {
    if (gameOver || revealed[idx]) return;

    gameStarted = true;
    cashoutBtn.style.opacity = '1';
    revealed[idx] = true;

    if (grid[idx] === 'mine') {
      gameOver = true;
      revealAll();
      msgEl.textContent = '💥 BOOM! Game Over!';
      msgEl.style.color = 'var(--danger)';
    } else {
      gemsFound++;
      multiplier += 0.25;
      score = Math.floor(gemsFound * 100 * multiplier);
      
      multEl.textContent = multiplier.toFixed(2) + 'x';
      gemsEl.textContent = gemsFound + '/' + (SIZE - MINE_COUNT);
      scoreEl.textContent = score;

      if (gemsFound === SIZE - MINE_COUNT) {
        gameOver = true;
        msgEl.textContent = '🎉 YOU WON! Perfect Clearance!';
        msgEl.style.color = 'var(--gold)';
      } else {
        msgEl.textContent = 'Safe! Keep going or Cashout.';
      }
    }
    renderBoard();
  }

  function cashout() {
    if (gameOver || !gameStarted || gemsFound === 0) return;
    gameOver = true;
    revealAll();
    msgEl.textContent = '💰 Cashed out ' + score + ' points!';
    msgEl.style.color = 'var(--gold)';
  }

  function revealAll() {
    revealed = Array(SIZE).fill(true);
    renderBoard();
  }

  cashoutBtn.onclick = cashout;
  document.getElementById('reset').onclick = initGame;

  initGame();
})();
</script>
`;

export default {
  name: 'mines',
  alias: ['minesweeper', 'mchezo-mines'],
  description: 'Play Mines puzzle game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-mines-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "💎 MINES" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": gMinesHtml,
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
      console.error('[MINES]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
