const gSilaAviatorHtml = `
<style>
:root {
  --bg-dark: #0b0e14;
  --card-bg: #151a21;
  --accent-gold: #f5b000;
  --accent-green: #00c853;
  --accent-red: #ff3b30;
  --text-main: #ffffff;
  --text-muted: #8e8e93;
  --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
html, body { background: var(--bg-dark); color: var(--text-main); font-family: var(--sys); min-height: 100vh; overflow: hidden; touch-action: none; }
.stage { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; }
.card { width: 100%; max-width: 360px; background: var(--card-bg); border-radius: 16px; padding: 14px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

/* Header & Wallet */
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
.header__title { font-size: 16px; font-weight: 800; background: linear-gradient(45deg, #ff3b30, #f5b000); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.balance-box { background: rgba(0,200,83,0.15); border: 1px solid var(--accent-green); border-radius: 8px; padding: 4px 10px; text-align: right; }
.balance-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; }
.balance-val { font-size: 13px; font-weight: 700; color: var(--accent-green); }

/* Canvas Animation Area */
.display-area { position: relative; width: 100%; aspect-ratio: 16/10; background: #07090d; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; margin-bottom: 12px; }
canvas { width: 100%; height: 100%; display: block; }
.mult-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 32px; font-weight: 900; color: #fff; text-shadow: 0 0 15px rgba(0,0,0,0.8); pointer-events: none; }
.mult-overlay.crashed { color: var(--accent-red); }

/* Bet Controls */
.config-panel { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px; }
.input-group { background: var(--bg-dark); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
.input-label { font-size: 10px; color: var(--text-muted); margin-bottom: 2px; }
.input-field { width: 100%; background: none; border: none; color: #fff; font-weight: bold; font-size: 14px; outline: none; }

/* Buttons */
.action-btn { width: 100%; background: linear-gradient(180deg, #ff3b30, #d32f2f); border: none; border-radius: 10px; color: #fff; font-weight: 800; padding: 12px; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(255,59,48,0.3); transition: opacity 0.2s; }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.action-btn.cashout { background: linear-gradient(180deg, #f5b000, #d49600); box-shadow: 0 4px 12px rgba(245,176,0,0.3); color: #000; }

.msg { text-align: center; font-size: 12px; font-weight: 600; margin-top: 8px; min-height: 16px; color: var(--accent-gold); }
.footer { margin-top: 8px; display: flex; justify-content: center; }
.footer__reset { background: none; border: none; color: var(--text-muted); font-size: 11px; cursor: pointer; text-decoration: underline; }
</style>

<div class="stage">
  <div class="card">
    <div class="header">
      <span class="header__title">✈️ SILA AVIATOR</span>
      <div class="balance-box">
        <div class="balance-label">WALLET</div>
        <div class="balance-val" id="balance">TSh 5,000</div>
      </div>
    </div>

    <div class="display-area">
      <canvas id="skyCanvas"></canvas>
      <div class="mult-overlay" id="multDisplay">1.00x</div>
    </div>

    <div class="config-panel">
      <div class="input-group">
        <div class="input-label">BET AMOUNT (TSh)</div>
        <input type="number" id="bet-input" class="input-field" value="500" step="100" min="100">
      </div>
    </div>

    <button class="action-btn" id="main-btn">PLACE BET</button>
    <div class="msg" id="msg">Set bet and click Place Bet!</div>

    <div class="footer">
      <button class="footer__reset" id="reset-bal">Reset Wallet (TSh 5,000)</button>
    </div>
  </div>
</div>

<script>
(function() {
  const canvas = document.getElementById('skyCanvas');
  const ctx = canvas.getContext('2d');
  const balanceEl = document.getElementById('balance');
  const betInput = document.getElementById('bet-input');
  const mainBtn = document.getElementById('main-btn');
  const multDisplay = document.getElementById('multDisplay');
  const msgEl = document.getElementById('msg');

  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resize();

  let balance = 5000;
  let betAmount = 500;
  let multiplier = 1.00;
  let crashPoint = 0;
  let gameInterval = null;
  let isFlying = false;
  let hasBetted = false;
  let cashedOut = false;
  let planeProgress = 0;

  function updateBalanceUI() {
    balanceEl.textContent = 'TSh ' + balance.toLocaleString();
  }

  function drawScene(progress, crashed = false) {
    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    if (!isFlying && progress === 0) return;

    // Flight Curve Path
    let startX = 20;
    let startY = height - 20;
    let currentX = startX + (width - 60) * Math.min(progress, 1);
    let currentY = startY - (height - 50) * Math.min(progress, 1);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (currentX - startX) / 2, startY, currentX, currentY);
    ctx.strokeStyle = crashed ? '#ff3b30' : '#f5b000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(currentX, height);
    ctx.lineTo(startX, height);
    ctx.fillStyle = crashed ? 'rgba(255, 59, 48, 0.15)' : 'rgba(245, 176, 0, 0.15)';
    ctx.fill();

    // Draw Plane Emoji
    if (!crashed) {
      ctx.font = '20px serif';
      ctx.fillText('✈️', currentX - 10, currentY + 5);
    }
  }

  function startFlight() {
    betAmount = parseInt(betInput.value) || 0;

    if (betAmount < 100) {
      msgEl.textContent = 'Minimum bet amount is TSh 100!';
      msgEl.style.color = 'var(--accent-red)';
      return;
    }
    if (betAmount > balance) {
      msgEl.textContent = 'Insufficient balance in your wallet!';
      msgEl.style.color = 'var(--accent-red)';
      return;
    }

    balance -= betAmount;
    updateBalanceUI();

    // Calculate random crash point
    let rand = Math.random();
    if (rand < 0.05) crashPoint = 1.00; // Insta crash
    else crashPoint = parseFloat((1 + Math.pow(Math.random(), 3) * 15).toFixed(2));

    multiplier = 1.00;
    planeProgress = 0;
    isFlying = true;
    hasBetted = true;
    cashedOut = false;

    betInput.disabled = true;
    multDisplay.classList.remove('crashed');
    multDisplay.textContent = '1.00x';
    msgEl.textContent = 'Plane is flying! Cash out before it flies away!';
    msgEl.style.color = 'var(--accent-gold)';

    mainBtn.textContent = 'CASHOUT (TSh ' + betAmount + ')';
    mainBtn.className = 'action-btn cashout';

    gameInterval = setInterval(() => {
      planeProgress += 0.015;
      multiplier += 0.02 + (multiplier * 0.015);

      if (multiplier >= crashPoint) {
        crashGame();
      } else {
        multDisplay.textContent = multiplier.toFixed(2) + 'x';
        if (!cashedOut) {
          let currentWin = Math.floor(betAmount * multiplier);
          mainBtn.textContent = 'CASHOUT (TSh ' + currentWin.toLocaleString() + ')';
        }
        drawScene(planeProgress, false);
      }
    }, 80);
  }

  function cashOut() {
    if (!isFlying || cashedOut) return;

    cashedOut = true;
    let winAmount = Math.floor(betAmount * multiplier);
    balance += winAmount;
    updateBalanceUI();

    msgEl.textContent = '🎉 WINNER! Cashed out TSh ' + winAmount.toLocaleString();
    msgEl.style.color = 'var(--accent-green)';

    mainBtn.disabled = true;
    mainBtn.textContent = 'CASHED OUT';
  }

  function crashGame() {
    clearInterval(gameInterval);
    isFlying = false;

    multDisplay.classList.add('crashed');
    multDisplay.textContent = 'FLEW AWAY @ ' + crashPoint.toFixed(2) + 'x';

    drawScene(planeProgress, true);

    if (!cashedOut) {
      msgEl.textContent = '💥 CRASHED! You lost TSh ' + betAmount.toLocaleString();
      msgEl.style.color = 'var(--accent-red)';
    }

    resetControls();
  }

  function resetControls() {
    betInput.disabled = false;
    mainBtn.disabled = false;
    mainBtn.textContent = 'PLACE BET';
    mainBtn.className = 'action-btn';
    hasBetted = false;
  }

  mainBtn.onclick = () => {
    if (!isFlying && !hasBetted) startFlight();
    else if (isFlying && !cashedOut) cashOut();
  };

  document.getElementById('reset-bal').onclick = () => {
    if (isFlying) return;
    balance = 5000;
    updateBalanceUI();
    msgEl.textContent = 'Wallet reset to TSh 5,000!';
    msgEl.style.color = 'var(--text-muted)';
  };

  updateBalanceUI();
  drawScene(0);
})();
</script>
`;

export default {
  name: 'silaaviator',
  alias: ['aviator', 'sila-aviator', 'crash'],
  description: 'Play SILA Aviator Crash Game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-aviator-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "✈️ SILA AVIATOR" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": gSilaAviatorHtml,
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
      console.error('[SILA AVIATOR]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
