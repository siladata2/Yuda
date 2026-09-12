const gSilaMinesHtml = `
<style>
:root {
  --bg-dark: #0b0e14;
  --card-bg: #151a21;
  --accent-gold: #f5b000;
  --accent-green: #00c853;
  --accent-blue: #007aff;
  --danger: #ff3b30;
  --text-main: #ffffff;
  --text-muted: #8e8e93;
  --tile-bg: #1e2630;
  --tile-hover: #2a3543;
  --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
html, body { background: var(--bg-dark); color: var(--text-main); font-family: var(--sys); min-height: 100vh; overflow: hidden; touch-action: none; }
.stage { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; }
.card { width: 100%; max-width: 360px; background: var(--card-bg); border-radius: 16px; padding: 14px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

/* Header & Balance */
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
.header__title { font-size: 16px; font-weight: 800; background: linear-gradient(45deg, #f5b000, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.balance-box { background: rgba(0,200,83,0.15); border: 1px solid var(--accent-green); border-radius: 8px; padding: 4px 10px; text-align: right; }
.balance-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; }
.balance-val { font-size: 13px; font-weight: 700; color: var(--accent-green); }

/* Bet & Config Controls */
.config-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.input-group { background: var(--bg-dark); padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
.input-label { font-size: 10px; color: var(--text-muted); margin-bottom: 2px; }
.input-field { width: 100%; background: none; border: none; color: #fff; font-weight: bold; font-size: 13px; outline: none; }
.select-field { width: 100%; background: none; border: none; color: var(--accent-gold); font-weight: bold; font-size: 13px; outline: none; cursor: pointer; }

/* Grid Board */
.board { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; width: 100%; aspect-ratio: 1; background: var(--bg-dark); padding: 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
.cell { background: var(--tile-bg); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px; cursor: pointer; border: 1px solid rgba(255,255,255,0.03); transition: transform 0.1s, background 0.2s, box-shadow 0.2s; }
.cell:active { transform: scale(0.92); }
.cell.revealed { background: #12171f; }
.cell.gem { background: rgba(0, 200, 83, 0.2); border-color: var(--accent-green); box-shadow: 0 0 10px rgba(0, 200, 83, 0.3); animation: pop 0.2s ease; }
.cell.mine { background: rgba(255, 59, 48, 0.2); border-color: var(--danger); box-shadow: 0 0 10px rgba(255, 59, 48, 0.4); animation: shake 0.2s ease; }
@keyframes pop { 0% { transform: scale(0.8); } 100% { transform: scale(1); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }

/* Stats Bar */
.stats { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin: 10px 0; }
.stats b { color: var(--text-main); font-weight: 700; }

/* Action Buttons */
.action-btn { width: 100%; background: linear-gradient(180deg, #00c853, #009624); border: none; border-radius: 10px; color: #fff; font-weight: 800; padding: 12px; font-size: 14px; cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.5); box-shadow: 0 4px 12px rgba(0,200,83,0.3); transition: opacity 0.2s; }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.action-btn.cashout { background: linear-gradient(180deg, #f5b000, #d49600); box-shadow: 0 4px 12px rgba(245,176,0,0.3); color: #000; text-shadow: none; }

.msg { text-align: center; font-size: 12px; font-weight: 600; margin-top: 8px; min-height: 16px; color: var(--accent-gold); }
.footer { margin-top: 8px; display: flex; justify-content: center; }
.footer__reset { background: none; border: none; color: var(--text-muted); font-size: 11px; cursor: pointer; text-decoration: underline; }
</style>

<div class="stage">
  <div class="card">
    <div class="header">
      <span class="header__title">🎮 SILA MINES</span>
      <div class="balance-box">
        <div class="balance-label">WALLET</div>
        <div class="balance-val" id="balance">TSh 5,000</div>
      </div>
    </div>

    <div class="config-panel">
      <div class="input-group">
        <div class="input-label">BET AMOUNT (TSh)</div>
        <input type="number" id="bet-input" class="input-field" value="500" step="100" min="100">
      </div>
      <div class="input-group">
        <div class="input-label">MINES MODE</div>
        <select id="mines-select" class="select-field">
          <option value="3">💣 3 Mines (x1.15+)</option>
          <option value="7">💣 7 Mines (x1.40+)</option>
        </select>
      </div>
    </div>

    <div class="board" id="board"></div>

    <div class="stats">
      <span>MULTIPLIER: <b id="mult" style="color:var(--accent-gold)">1.00x</b></span>
      <span>WIN: <b id="win-amt" style="color:var(--accent-green)">TSh 0</b></span>
    </div>

    <button class="action-btn" id="main-btn">START GAME</button>
    <div class="msg" id="msg">Weka dau kisha bonyeza Start!</div>

    <div class="footer">
      <button class="footer__reset" id="reset-bal">Reset Wallet (TSh 5,000)</button>
    </div>
  </div>
</div>

<script>
(function() {
  const SIZE = 25;
  let balance = 5000;
  let betAmount = 500;
  let mineCount = 3;
  let grid = [], revealed = [];
  let multiplier = 1.0, gemsFound = 0;
  let inGame = false;

  const boardEl = document.getElementById('board');
  const balanceEl = document.getElementById('balance');
  const betInput = document.getElementById('bet-input');
  const minesSelect = document.getElementById('mines-select');
  const multEl = document.getElementById('mult');
  const winAmtEl = document.getElementById('win-amt');
  const mainBtn = document.getElementById('main-btn');
  const msgEl = document.getElementById('msg');

  function updateBalanceUI() {
    balanceEl.textContent = 'TSh ' + balance.toLocaleString();
  }

  function initBoard() {
    boardEl.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.addEventListener('click', () => clickTile(i));
      boardEl.appendChild(cell);
    }
  }

  function startGame() {
    betAmount = parseInt(betInput.value) || 0;
    mineCount = parseInt(minesSelect.value);

    if (betAmount < 100) {
      msgEl.textContent = 'Kiwango cha chini ku-bet ni TSh 100!';
      msgEl.style.color = 'var(--danger)';
      return;
    }
    if (betAmount > balance) {
      msgEl.textContent = 'Huna salio la kutosha kwenye wallet!';
      msgEl.style.color = 'var(--danger)';
      return;
    }

    balance -= betAmount;
    updateBalanceUI();

    grid = Array(SIZE).fill('gem');
    revealed = Array(SIZE).fill(false);

    let placed = 0;
    while (placed < mineCount) {
      let idx = Math.floor(Math.random() * SIZE);
      if (grid[idx] !== 'mine') {
        grid[idx] = 'mine';
        placed++;
      }
    }

    inGame = true;
    gemsFound = 0;
    multiplier = 1.00;

    betInput.disabled = true;
    minesSelect.disabled = true;

    multEl.textContent = '1.00x';
    winAmtEl.textContent = 'TSh ' + betAmount;
    msgEl.textContent = 'Chagua kadi ili kupata Almasi!';
    msgEl.style.color = 'var(--accent-gold)';

    mainBtn.textContent = 'TAKE CASH (CASHOUT)';
    mainBtn.className = 'action-btn cashout';
    mainBtn.disabled = true; // Inakuwa active ukipata gem ya kwanza

    initBoard();
  }

  function clickTile(idx) {
    if (!inGame || revealed[idx]) return;

    revealed[idx] = true;
    const cells = boardEl.children;

    if (grid[idx] === 'mine') {
      // Game Over
      inGame = false;
      cells[idx].classList.add('revealed', 'mine');
      cells[idx].textContent = '💣';

      revealAllMines();
      msgEl.textContent = '💥 UMEPIGWA BOMU! Umepoteza TSh ' + betAmount;
      msgEl.style.color = 'var(--danger)';

      resetControls();
    } else {
      // Safe Gem
      gemsFound++;
      let step = mineCount === 3 ? 0.15 : 0.40;
      multiplier += step;

      let currentWin = Math.floor(betAmount * multiplier);

      cells[idx].classList.add('revealed', 'gem');
      cells[idx].textContent = '💎';

      multEl.textContent = multiplier.toFixed(2) + 'x';
      winAmtEl.textContent = 'TSh ' + currentWin.toLocaleString();

      mainBtn.disabled = false;
      mainBtn.textContent = 'CASHOUT (TSh ' + currentWin.toLocaleString() + ')';
      msgEl.textContent = 'Umetokea Salama! Endelea au Chukua Hela.';
      msgEl.style.color = 'var(--accent-green)';

      if (gemsFound === SIZE - mineCount) {
        cashout();
      }
    }
  }

  function cashout() {
    if (!inGame || gemsFound === 0) return;

    let winAmount = Math.floor(betAmount * multiplier);
    balance += winAmount;
    updateBalanceUI();

    inGame = false;
    msgEl.textContent = '🎉 SHINDA! Umeweka mfukoni TSh ' + winAmount.toLocaleString();
    msgEl.style.color = 'var(--accent-green)';

    revealAllMines();
    resetControls();
  }

  function revealAllMines() {
    const cells = boardEl.children;
    for (let i = 0; i < SIZE; i++) {
      if (grid[i] === 'mine' && !revealed[i]) {
        cells[i].classList.add('revealed', 'mine');
        cells[i].textContent = '💣';
      }
    }
  }

  function resetControls() {
    betInput.disabled = false;
    minesSelect.disabled = false;
    mainBtn.textContent = 'START GAME';
    mainBtn.className = 'action-btn';
    mainBtn.disabled = false;
  }

  mainBtn.onclick = () => {
    if (!inGame) startGame();
    else cashout();
  };

  document.getElementById('reset-bal').onclick = () => {
    if (inGame) return;
    balance = 5000;
    updateBalanceUI();
    msgEl.textContent = 'Wallet imerudishwa TSh 5,000!';
    msgEl.style.color = 'var(--text-muted)';
  };

  updateBalanceUI();
  initBoard();
})();
</script>
`;

export default {
  name: 'silamines',
  alias: ['silamine', 'sila-mines', 'mines2'],
  description: 'Play SILA Mines Betting Game in WhatsApp',
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
              submessages: [{ messageType: 2, messageText: "💎 SILA MINES" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": gSilaMinesHtml,
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
      console.error('[SILA MINES]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
