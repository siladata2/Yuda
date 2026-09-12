const gSilaPenaltyHtml = `
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
  --pitch-green: #1b4332;
  --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
html, body { background: var(--bg-dark); color: var(--text-main); font-family: var(--sys); min-height: 100vh; overflow: hidden; touch-action: none; }
.stage { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; }
.card { width: 100%; max-width: 360px; background: var(--card-bg); border-radius: 16px; padding: 14px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

/* Header & Wallet */
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
.header__title { font-size: 16px; font-weight: 800; background: linear-gradient(45deg, #00c853, #f5b000); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.balance-box { background: rgba(0,200,83,0.15); border: 1px solid var(--accent-green); border-radius: 8px; padding: 4px 10px; text-align: right; }
.balance-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; }
.balance-val { font-size: 13px; font-weight: 700; color: var(--accent-green); }

/* Pitch & Goal Display */
.stadium { position: relative; width: 100%; aspect-ratio: 16/10; background: linear-gradient(180deg, #0d1f2d 0%, var(--pitch-green) 100%); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; margin-bottom: 12px; }
canvas { width: 100%; height: 100%; display: block; }

/* Goal Targets overlay */
.target-grid { position: absolute; top: 15%; left: 15%; width: 70%; height: 45%; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 6px; }
.target-btn { background: rgba(245, 176, 0, 0.2); border: 1px dashed var(--accent-gold); border-radius: 6px; cursor: pointer; transition: background 0.2s, transform 0.1s; }
.target-btn:active { background: rgba(0, 200, 83, 0.5); transform: scale(0.92); }
.target-btn:disabled { opacity: 0.2; cursor: not-allowed; border-color: var(--text-muted); }

/* Bet Controls */
.config-panel { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px; }
.input-group { background: var(--bg-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
.input-label { font-size: 10px; color: var(--text-muted); margin-bottom: 2px; }
.input-field { width: 100%; background: none; border: none; color: #fff; font-weight: bold; font-size: 14px; outline: none; }

/* Stats Bar */
.stats { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 10px; }
.stats b { color: var(--text-main); font-weight: 700; }

/* Buttons */
.action-btn { width: 100%; background: linear-gradient(180deg, #00c853, #009624); border: none; border-radius: 10px; color: #fff; font-weight: 800; padding: 12px; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,200,83,0.3); transition: opacity 0.2s; }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.action-btn.cashout { background: linear-gradient(180deg, #f5b000, #d49600); box-shadow: 0 4px 12px rgba(245,176,0,0.3); color: #000; }

.msg { text-align: center; font-size: 12px; font-weight: 600; margin-top: 8px; min-height: 16px; color: var(--accent-gold); }
.footer { margin-top: 8px; display: flex; justify-content: center; }
.footer__reset { background: none; border: none; color: var(--text-muted); font-size: 11px; cursor: pointer; text-decoration: underline; }
</style>

<div class="stage">
  <div class="card">
    <div class="header">
      <span class="header__title">⚽ SILA PENALTY</span>
      <div class="balance-box">
        <div class="balance-label">WALLET</div>
        <div class="balance-val" id="balance">TSh 5,000</div>
      </div>
    </div>

    <div class="stadium">
      <canvas id="fieldCanvas"></canvas>
      <div class="target-grid" id="targetGrid">
        <button class="target-btn" data-pos="0"></button>
        <button class="target-btn" data-pos="1"></button>
        <button class="target-btn" data-pos="2"></button>
        <button class="target-btn" data-pos="3"></button>
        <button class="target-btn" data-pos="4"></button>
        <button class="target-btn" data-pos="5"></button>
      </div>
    </div>

    <div class="config-panel">
      <div class="input-group">
        <div class="input-label">BET AMOUNT (TSh)</div>
        <input type="number" id="bet-input" class="input-field" value="500" step="100" min="100">
      </div>
    </div>

    <div class="stats">
      <span>MULTIPLIER: <b id="mult" style="color:var(--accent-gold)">1.00x</b></span>
      <span>WIN: <b id="win-amt" style="color:var(--accent-green)">TSh 0</b></span>
    </div>

    <button class="action-btn" id="main-btn">START MATCH</button>
    <div class="msg" id="msg">Set bet and click Start Match!</div>

    <div class="footer">
      <button class="footer__reset" id="reset-bal">Reset Wallet (TSh 5,000)</button>
    </div>
  </div>
</div>

<script>
(function() {
  const canvas = document.getElementById('fieldCanvas');
  const ctx = canvas.getContext('2d');
  const balanceEl = document.getElementById('balance');
  const betInput = document.getElementById('bet-input');
  const mainBtn = document.getElementById('main-btn');
  const multEl = document.getElementById('mult');
  const winAmtEl = document.getElementById('win-amt');
  const msgEl = document.getElementById('msg');
  const targetBtns = document.querySelectorAll('.target-btn');

  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resize();

  let balance = 5000;
  let betAmount = 500;
  let multiplier = 1.00;
  let goalsScored = 0;
  let inGame = false;
  let keeperPos = 1;

  function updateBalanceUI() {
    balanceEl.textContent = 'TSh ' + balance.toLocaleString();
  }

  function toggleTargets(enable) {
    targetBtns.forEach(btn => btn.disabled = !enable);
  }

  function drawPitch(keeperDir = 1, ballTarget = null, isSaved = false) {
    ctx.clearRect(0, 0, width, height);

    // Goal Frame
    let gx = width * 0.15, gy = height * 0.15, gw = width * 0.7, gh = height * 0.45;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(gx, gy, gw, gh);

    // Net Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let x = gx; x <= gx + gw; x += 15) {
      ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + gh); ctx.stroke();
    }
    for (let y = gy; y <= gy + gh; y += 12) {
      ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx + gw, y); ctx.stroke();
    }

    // Goalkeeper
    let kx = gx + (gw / 5) * (keeperDir % 3 * 2 + 0.5);
    let ky = keeperDir < 3 ? gy + gh * 0.3 : gy + gh * 0.7;
    ctx.font = '24px serif';
    ctx.fillText('🧤', kx - 12, ky);

    // Ball
    let bx = width / 2;
    let by = height - 20;

    if (ballTarget !== null) {
      bx = gx + (gw / 3) * (ballTarget % 3 + 0.5);
      by = ballTarget < 3 ? gy + gh * 0.3 : gy + gh * 0.7;
    }

    ctx.font = '18px serif';
    ctx.fillText('⚽', bx - 9, by);
  }

  function startMatch() {
    betAmount = parseInt(betInput.value) || 0;

    if (betAmount < 100) {
      msgEl.textContent = 'Minimum bet amount is TSh 100!';
      msgEl.style.color = 'var(--danger)';
      return;
    }
    if (betAmount > balance) {
      msgEl.textContent = 'Insufficient balance in your wallet!';
      msgEl.style.color = 'var(--danger)';
      return;
    }

    balance -= betAmount;
    updateBalanceUI();

    inGame = true;
    goalsScored = 0;
    multiplier = 1.00;

    betInput.disabled = true;
    multEl.textContent = '1.00x';
    winAmtEl.textContent = 'TSh ' + betAmount.toLocaleString();
    msgEl.textContent = 'Select a corner to shoot!';
    msgEl.style.color = 'var(--accent-gold)';

    mainBtn.textContent = 'CASHOUT (TSh ' + betAmount.toLocaleString() + ')';
    mainBtn.className = 'action-btn cashout';
    mainBtn.disabled = true;

    toggleTargets(true);
    drawPitch(1, null);
  }

  function shoot(targetPos) {
    if (!inGame) return;

    let keeperChoice = Math.floor(Math.random() * 6);
    let isSaved = keeperChoice === targetPos;

    drawPitch(keeperChoice, targetPos, isSaved);

    if (isSaved) {
      inGame = false;
      toggleTargets(false);
      msgEl.textContent = '❌ SAVED! Goalkeeper caught your shot!';
      msgEl.style.color = 'var(--danger)';
      resetControls();
    } else {
      goalsScored++;
      multiplier += 0.45;
      let currentWin = Math.floor(betAmount * multiplier);

      multEl.textContent = multiplier.toFixed(2) + 'x';
      winAmtEl.textContent = 'TSh ' + currentWin.toLocaleString();

      msgEl.textContent = '⚽ GOAL! Shoot again or Cashout!';
      msgEl.style.color = 'var(--accent-green)';

      mainBtn.disabled = false;
      mainBtn.textContent = 'CASHOUT (TSh ' + currentWin.toLocaleString() + ')';
    }
  }

  function cashout() {
    if (!inGame || goalsScored === 0) return;

    let winAmount = Math.floor(betAmount * multiplier);
    balance += winAmount;
    updateBalanceUI();

    inGame = false;
    toggleTargets(false);
    msgEl.textContent = '🎉 CASHOUT! You won TSh ' + winAmount.toLocaleString();
    msgEl.style.color = 'var(--accent-green)';

    resetControls();
  }

  function resetControls() {
    betInput.disabled = false;
    mainBtn.textContent = 'START MATCH';
    mainBtn.className = 'action-btn';
    mainBtn.disabled = false;
  }

  targetBtns.forEach(btn => {
    btn.onclick = () => shoot(parseInt(btn.dataset.pos));
  });

  mainBtn.onclick = () => {
    if (!inGame) startMatch();
    else cashout();
  };

  document.getElementById('reset-bal').onclick = () => {
    if (inGame) return;
    balance = 5000;
    updateBalanceUI();
    msgEl.textContent = 'Wallet reset to TSh 5,000!';
    msgEl.style.color = 'var(--text-muted)';
  };

  toggleTargets(false);
  updateBalanceUI();
  drawPitch(1, null);
})();
</script>
`;

export default {
  name: 'penalty',
  alias: ['penalty', 'sila-penalty', 'shootout'],
  description: 'Play SILA Penalty Shootout Game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-penalty-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "⚽ SILA PENALTY" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": gSilaPenaltyHtml,
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
      console.error('[SILA PENALTY]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
