const gSilaAviatorHtml = `
<style>
:root {
  --bg-dark: #000000;
  --card-bg: #0d0f12;
  --panel-bg: #181b20;
  --input-bg: #000000;
  --accent-red: #e50914;
  --accent-green: #28a745;
  --accent-gold: #f5b000;
  --text-main: #ffffff;
  --text-muted: #8e8e93;
  --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
html, body { background: var(--bg-dark); color: var(--text-main); font-family: var(--sys); min-height: 100vh; overflow: hidden; touch-action: none; }
.stage { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; }
.card { width: 100%; max-width: 360px; background: var(--card-bg); border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.8); }

/* Header */
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.header__title { font-size: 16px; font-weight: 800; color: var(--accent-red); display: flex; align-items: center; gap: 4px; }
.balance-val { font-size: 15px; font-weight: 800; color: #fff; }

/* Multiplier History Pills */
.history-bar { display: flex; gap: 6px; overflow-x: auto; margin-bottom: 8px; padding-bottom: 2px; scrollbar-width: none; }
.history-bar::-webkit-scrollbar { display: none; }
.pill { background: #1c2230; color: #5c84ff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 12px; white-space: nowrap; }
.pill.purple { color: #c05cff; }

/* Display Area */
.display-area { position: relative; width: 100%; aspect-ratio: 16/11; background: radial-gradient(circle at center, #131924 0%, #080a0f 100%); border-radius: 8px; overflow: hidden; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.05); }
canvas { width: 100%; height: 100%; display: block; }
.mult-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 42px; font-weight: 900; color: #fff; pointer-events: none; }
.mult-overlay.crashed { color: var(--accent-red); font-size: 20px; }

/* Bet Controls Panel */
.bet-panel { background: var(--panel-bg); border-radius: 12px; padding: 10px; }
.tabs { display: flex; justify-content: center; gap: 16px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px; }
.tab { font-size: 12px; font-weight: 700; color: var(--text-muted); cursor: pointer; position: relative; padding-bottom: 2px; }
.tab.active { color: #fff; }
.tab.active::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 100%; height: 2px; background: var(--accent-red); }

.controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

/* Left Input Box */
.input-box { background: var(--input-bg); border-radius: 8px; padding: 6px; display: flex; flex-direction: column; justify-content: space-between; gap: 6px; border: 1px solid rgba(255,255,255,0.1); }
.stepper { display: flex; align-items: center; justify-content: space-between; }
.step-btn { background: #22262c; color: #fff; border: none; border-radius: 50%; width: 22px; height: 22px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.bet-val-display { font-size: 14px; font-weight: 800; color: #fff; }
.preset-btns { display: flex; gap: 4px; }
.preset-btn { flex: 1; background: #22262c; color: var(--text-muted); border: none; border-radius: 4px; font-size: 9px; font-weight: 700; padding: 4px 0; cursor: pointer; text-align: center; }

/* Right Big Bet Button */
.main-bet-btn { background: var(--accent-green); border: none; border-radius: 10px; color: #fff; font-weight: 800; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; cursor: pointer; transition: opacity 0.2s; }
.main-bet-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.main-bet-btn.cashout { background: var(--accent-gold); color: #000; }
.btn-title { font-size: 15px; }
.btn-sub { font-size: 12px; opacity: 0.9; }

.msg { text-align: center; font-size: 11px; font-weight: 600; margin-top: 6px; min-height: 14px; color: var(--accent-gold); }
</style>

<div class="stage">
  <div class="card">
    <div class="header">
      <span class="header__title">✈️ Sila Aviator</span>
      <div class="balance-val" id="balance">10,000.00 TZS</div>
    </div>

    <div class="history-bar" id="historyBar">
      <span class="pill">1.03x</span>
      <span class="pill purple">2.53x</span>
      <span class="pill">1.72x</span>
      <span class="pill">1.11x</span>
      <span class="pill purple">4.55x</span>
      <span class="pill">1.75x</span>
    </div>

    <div class="display-area">
      <canvas id="skyCanvas"></canvas>
      <div class="mult-overlay" id="multDisplay">1.00x</div>
    </div>

    <div class="bet-panel">
      <div class="tabs">
        <span class="tab active">Place Bet</span>
        <span class="tab">Auto</span>
      </div>

      <div class="controls-grid">
        <div class="input-box">
          <div class="stepper">
            <button class="step-btn" id="minus-btn">-</button>
            <span class="bet-val-display" id="bet-display">5,000.00</span>
            <button class="step-btn" id="plus-btn">+</button>
          </div>
          <div class="preset-btns">
            <button class="preset-btn" data-val="1000">1,000</button>
            <button class="preset-btn" data-val="5000">5,000</button>
            <button class="preset-btn" data-val="10000">10,000</button>
          </div>
        </div>

        <button class="main-bet-btn" id="main-btn">
          <span class="btn-title">Place Bet</span>
          <span class="btn-sub" id="btn-sub-val">5,000.00 TZS</span>
        </button>
      </div>
    </div>

    <div class="msg" id="msg">Place your bet to start!</div>
  </div>
</div>

<script>
(function() {
  const canvas = document.getElementById('skyCanvas');
  const ctx = canvas.getContext('2d');
  const balanceEl = document.getElementById('balance');
  const betDisplay = document.getElementById('bet-display');
  const btnSubVal = document.getElementById('btn-sub-val');
  const mainBtn = document.getElementById('main-btn');
  const multDisplay = document.getElementById('multDisplay');
  const msgEl = document.getElementById('msg');
  const historyBar = document.getElementById('historyBar');

  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resize();

  let balance = 10000;
  let betAmount = 5000;
  let multiplier = 1.00;
  let crashPoint = 0;
  let gameInterval = null;
  let isFlying = false;
  let cashedOut = false;
  let planeProgress = 0;

  function updateUI() {
    balanceEl.textContent = balance.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' TZS';
    betDisplay.textContent = betAmount.toLocaleString('en-US', {minimumFractionDigits: 2});
    if (!isFlying) {
      btnSubVal.textContent = betAmount.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' TZS';
    }
  }

  function drawScene(progress, crashed = false) {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    if (!isFlying && progress === 0) return;

    let startX = 10;
    let startY = height - 10;
    let currentX = startX + (width - 40) * Math.min(progress, 1);
    let currentY = startY - (height - 30) * Math.min(progress, 1);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (currentX - startX) / 2, startY, currentX, currentY);
    ctx.strokeStyle = crashed ? '#e50914' : '#e50914';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.lineTo(currentX, height);
    ctx.lineTo(startX, height);
    ctx.fillStyle = crashed ? 'rgba(229, 9, 20, 0.1)' : 'rgba(229, 9, 20, 0.2)';
    ctx.fill();

    if (!crashed) {
      ctx.font = '18px serif';
      ctx.fillText('✈️', currentX - 10, currentY + 5);
    }
  }

  function startFlight() {
    if (betAmount > balance) {
      msgEl.textContent = 'Insufficient balance!';
      msgEl.style.color = 'var(--accent-red)';
      return;
    }

    balance -= betAmount;
    updateUI();

    let rand = Math.random();
    crashPoint = rand < 0.1 ? 1.00 : parseFloat((1 + Math.pow(Math.random(), 2.5) * 8).toFixed(2));

    multiplier = 1.00;
    planeProgress = 0;
    isFlying = true;
    cashedOut = false;

    multDisplay.classList.remove('crashed');
    multDisplay.textContent = '1.00x';
    msgEl.textContent = 'Plane taking off...';
    msgEl.style.color = 'var(--accent-gold)';

    mainBtn.className = 'main-bet-btn cashout';
    mainBtn.querySelector('.btn-title').textContent = 'Cash Out';

    gameInterval = setInterval(() => {
      planeProgress += 0.012;
      multiplier += 0.01 + (multiplier * 0.01);

      if (multiplier >= crashPoint) {
        crashGame();
      } else {
        multDisplay.textContent = multiplier.toFixed(2) + 'x';
        if (!cashedOut) {
          let currentWin = (betAmount * multiplier).toFixed(2);
          btnSubVal.textContent = parseFloat(currentWin).toLocaleString() + ' TZS';
        }
        drawScene(planeProgress, false);
      }
    }, 70);
  }

  function cashOut() {
    if (!isFlying || cashedOut) return;

    cashedOut = true;
    let winAmount = Math.floor(betAmount * multiplier);
    balance += winAmount;
    updateUI();

    msgEl.textContent = '🎉 Cashed out ' + winAmount.toLocaleString() + ' TZS';
    msgEl.style.color = 'var(--accent-green)';

    mainBtn.disabled = true;
    mainBtn.querySelector('.btn-title').textContent = 'Cashed Out';
  }

  function crashGame() {
    clearInterval(gameInterval);
    isFlying = false;

    multDisplay.classList.add('crashed');
    multDisplay.textContent = 'FLEW AWAY @ ' + crashPoint.toFixed(2) + 'x';

    drawScene(planeProgress, true);

    if (!cashedOut) {
      msgEl.textContent = '💥 Flew Away!';
      msgEl.style.color = 'var(--accent-red)';
    }

    // Add to history
    const pill = document.createElement('span');
    pill.className = 'pill' + (crashPoint >= 2.0 ? ' purple' : '');
    pill.textContent = crashPoint.toFixed(2) + 'x';
    historyBar.prepend(pill);

    resetControls();
  }

  function resetControls() {
    mainBtn.disabled = false;
    mainBtn.className = 'main-bet-btn';
    mainBtn.querySelector('.btn-title').textContent = 'Place Bet';
    updateUI();
  }

  // Event Listeners
  document.getElementById('minus-btn').onclick = () => {
    if (isFlying) return;
    if (betAmount > 1000) betAmount -= 1000;
    updateUI();
  };
  document.getElementById('plus-btn').onclick = () => {
    if (isFlying) return;
    betAmount += 1000;
    updateUI();
  };

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.onclick = () => {
      if (isFlying) return;
      betAmount = parseInt(btn.dataset.val);
      updateUI();
    };
  });

  mainBtn.onclick = () => {
    if (!isFlying) startFlight();
    else if (!cashedOut) cashOut();
  };

  updateUI();
  drawScene(0);
})();
</script>
`;

export default {
  name: 'aviator',
  alias: ['aviator', 'silaaviator', 'crash'],
  description: 'Play SILA Madrin Aviator in WhatsApp',
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
              submessages: [{ messageType: 2, messageText: "✈️ Madrin Aviator" }],
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
