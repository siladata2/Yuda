const gStickmanHtml = `
<style>
:root {
  --card-2: #2a3942;
  --ink: #e9edef;
  --ink-soft: #aebac1;
  --muted: #8696a0;
  --accent: #00a884;
  --danger: #f2593f;
  --line: #2a3942;
  --cell-bg: #111b21;
  --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
html, body { background: transparent; color: var(--ink); font-family: var(--sys); min-height: 100vh; overflow: hidden; touch-action: none; }
.stage { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; }
.card { width: 100%; max-width: 360px; }
.header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
.header__title { font-size: 17px; font-weight: 600; }
.header__sub { font-size: 12px; color: var(--muted); }
.stats { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.stats b { color: var(--ink); font-weight: 600; margin-left: 4px; }
.game-container { position: relative; width: 100%; aspect-ratio: 4/3; background: var(--cell-bg); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
canvas { width: 100%; height: 100%; display: block; }
.controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
.btn { background: var(--card-2); border: 1px solid var(--line); border-radius: 8px; color: var(--ink); font-weight: 600; padding: 12px 0; font-size: 14px; cursor: pointer; text-align: center; }
.btn:active { background: var(--accent); color: #0b141a; }
.btn-attack { background: #374248; border-color: var(--accent); color: var(--accent); }
.footer { margin-top: 10px; display: flex; justify-content: center; }
.footer__reset { background: none; border: none; color: var(--accent); font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; padding: 6px 12px; }
.msg { text-align: center; font-size: 14px; color: var(--accent); font-weight: 600; margin-top: 6px; min-height: 18px; }
</style>

<div class="stage">
  <div class="card">
    <div class="header">
      <span class="header__title">STICKMAN SLAYER</span>
      <span class="header__sub">Tap or Use Buttons</span>
    </div>
    <div class="stats">
      <span>SCORE<b id="score">0</b></span>
      <span>KILLS<b id="kills">0</b></span>
      <span>BEST<b id="best">0</b></span>
    </div>
    <div class="game-container">
      <canvas id="canvas"></canvas>
    </div>
    <div class="msg" id="msg"></div>
    <div class="controls">
      <button class="btn" id="btn-left">← LEFT</button>
      <button class="btn btn-attack" id="btn-attack">⚔️ ATTACK</button>
      <button class="btn" id="btn-right">RIGHT →</button>
    </div>
    <div class="footer">
      <button class="footer__reset" id="reset">Restart Game</button>
    </div>
  </div>
</div>

<script>
(function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const killsEl = document.getElementById('kills');
  const bestEl = document.getElementById('best');
  const msgEl = document.getElementById('msg');
  
  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resize();

  let score = 0, kills = 0, best = 0, gameOver = false;
  let player, enemies = [], particles = [];

  class Player {
    constructor() {
      this.x = width / 2;
      this.y = height - 40;
      this.facing = 'right';
      this.isAttacking = false;
      this.attackTimer = 0;
      this.hp = 100;
    }
    draw() {
      ctx.strokeStyle = '#00a884';
      ctx.lineWidth = 3;

      // Head
      ctx.beginPath();
      ctx.arc(this.x, this.y - 30, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 22);
      ctx.lineTo(this.x, this.y - 10);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 10);
      ctx.lineTo(this.x - 8, this.y);
      ctx.moveTo(this.x, this.y - 10);
      ctx.lineTo(this.x + 8, this.y);
      ctx.stroke();

      // Arms & Sword Animation
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 20);
      let armX = this.facing === 'right' ? this.x + 12 : this.x - 12;
      if (this.isAttacking) {
        armX = this.facing === 'right' ? this.x + 20 : this.x - 20;
      }
      ctx.lineTo(armX, this.y - 15);
      ctx.stroke();

      // Sword Draw
      if (this.isAttacking) {
        ctx.strokeStyle = '#e9edef';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let swordX = this.facing === 'right' ? armX + 18 : armX - 18;
        ctx.moveTo(armX, this.y - 15);
        ctx.lineTo(swordX, this.y - 25);
        ctx.stroke();
      }
    }
    attack() {
      if (this.isAttacking) return;
      this.isAttacking = true;
      this.attackTimer = 10;
      
      // Hit detection
      enemies.forEach((enemy, idx) => {
        let dist = Math.abs(enemy.x - this.x);
        if (dist < 35 && ((this.facing === 'right' && enemy.x > this.x) || (this.facing === 'left' && enemy.x < this.x))) {
          createParticles(enemy.x, enemy.y - 20, '#f2593f');
          enemies.splice(idx, 1);
          score += 50;
          kills++;
        }
      });
    }
    update() {
      if (this.isAttacking) {
        this.attackTimer--;
        if (this.attackTimer <= 0) this.isAttacking = false;
      }
    }
  }

  class Enemy {
    constructor() {
      this.side = Math.random() < 0.5 ? 'left' : 'right';
      this.x = this.side === 'left' ? -10 : width + 10;
      this.y = height - 40;
      this.speed = 1.2 + Math.random() * 1.5;
    }
    draw() {
      ctx.strokeStyle = '#f2593f';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(this.x, this.y - 28, 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 21);
      ctx.lineTo(this.x, this.y - 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 10);
      ctx.lineTo(this.x - 6, this.y);
      ctx.moveTo(this.x, this.y - 10);
      ctx.lineTo(this.x + 6, this.y);
      ctx.stroke();
    }
    update() {
      if (this.x < player.x) this.x += this.speed;
      else this.x -= this.speed;

      // Touch Player Game Over
      if (Math.abs(this.x - player.x) < 10) {
        endGame();
      }
    }
  }

  function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 15,
        color: color
      });
    }
  }

  function spawnEnemies() {
    if (gameOver) return;
    if (Math.random() < 0.035) enemies.push(new Enemy());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Ground Line
    ctx.strokeStyle = '#2a3942';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 38);
    ctx.lineTo(width, height - 38);
    ctx.stroke();

    if (!gameOver) {
      player.update();
      player.draw();

      spawnEnemies();
      enemies.forEach(e => { e.update(); e.draw(); });

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) particles.splice(idx, 1);
      });

      scoreEl.textContent = score;
      killsEl.textContent = kills;
      requestAnimationFrame(loop);
    }
  }

  function endGame() {
    gameOver = true;
    msgEl.textContent = 'GAME OVER!';
    if (score > best) best = score;
    bestEl.textContent = best;
  }

  function init() {
    score = 0; kills = 0; gameOver = false;
    enemies = []; particles = [];
    msgEl.textContent = '';
    player = new Player();
    loop();
  }

  // Controls
  document.getElementById('btn-left').onclick = () => { if(!gameOver){ player.facing = 'left'; player.x = Math.max(20, player.x - 15); } };
  document.getElementById('btn-right').onclick = () => { if(!gameOver){ player.facing = 'right'; player.x = Math.min(width - 20, player.x + 15); } };
  document.getElementById('btn-attack').onclick = () => { if(!gameOver) player.attack(); };
  document.getElementById('reset').onclick = init;

  document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') { player.facing = 'left'; player.x = Math.max(20, player.x - 15); }
    if (e.key === 'ArrowRight') { player.facing = 'right'; player.x = Math.min(width - 20, player.x + 15); }
    if (e.key === ' ' || e.key === 'ArrowUp') player.attack();
  });

  init();
})();
</script>
`;

export default {
  name: 'stickman',
  alias: ['stickfight', 'stickgame'],
  description: 'Play Stickman Slayer HTML game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-stickman-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "⚔️ STICKMAN SLAYER" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": gStickmanHtml,
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
      console.error('[STICKMAN]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
