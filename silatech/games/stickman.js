const gStickmanHtml = `
<style>
:root {
  --card-2: #2a3942;
  --ink: #e9edef;
  --ink-soft: #aebac1;
  --muted: #8696a0;
  --accent: #00a884;
  --danger: #f2593f;
  --special: #f2c265;
  --line: #2a3942;
  --cell-bg: #111b21;
  --sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
html, body { background: transparent; color: var(--ink); font-family: var(--sys); min-height: 100vh; overflow: hidden; touch-action: none; }
.stage { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; }
.card { width: 100%; max-width: 360px; }
.header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--line); }
.header__title { font-size: 16px; font-weight: 600; color: var(--accent); }
.header__sub { font-size: 11px; color: var(--muted); }
.stats { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 8px; }
.stats b { color: var(--ink); font-weight: 600; margin-left: 2px; }

/* Health Bar Design */
.hp-container { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-bottom: 8px; overflow: hidden; }
.hp-fill { height: 100%; width: 100%; background: var(--accent); transition: width 0.2s ease, background 0.3s; }

.game-container { position: relative; width: 100%; aspect-ratio: 4/3; background: var(--cell-bg); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
canvas { width: 100%; height: 100%; display: block; }
.controls { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 10px; }
.btn { background: var(--card-2); border: 1px solid var(--line); border-radius: 8px; color: var(--ink); font-weight: 600; padding: 10px 0; font-size: 12px; cursor: pointer; text-align: center; }
.btn:active { background: var(--accent); color: #0b141a; }
.btn-attack { background: #374248; border-color: var(--accent); color: var(--accent); }
.btn-power { background: #3e321e; border-color: var(--special); color: var(--special); }
.footer { margin-top: 6px; display: flex; justify-content: center; }
.footer__reset { background: none; border: none; color: var(--accent); font-family: inherit; font-size: 12px; font-weight: 500; cursor: pointer; padding: 4px 8px; }
.msg { text-align: center; font-size: 13px; color: var(--accent); font-weight: 600; margin-top: 4px; min-height: 16px; }
</style>

<div class="stage">
  <div class="card">
    <div class="header">
      <span class="header__title">STICKMAN WARRIOR PRO</span>
      <span class="header__sub">LVL <b id="level" style="color:var(--accent);">1</b></span>
    </div>
    <div class="hp-container">
      <div class="hp-fill" id="hp-fill"></div>
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
      <button class="btn btn-attack" id="btn-attack">⚔️ SLASH</button>
      <button class="btn btn-power" id="btn-power">💥 BLAST</button>
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
  const levelEl = document.getElementById('level');
  const bestEl = document.getElementById('best');
  const msgEl = document.getElementById('msg');
  const hpFill = document.getElementById('hp-fill');
  
  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resize();

  let score = 0, kills = 0, level = 1, best = 0, gameOver = false;
  let player, enemies = [], particles = [], floatingTexts = [];

  class Player {
    constructor() {
      this.x = width / 2;
      this.y = height - 40;
      this.facing = 'right';
      this.isAttacking = false;
      this.attackTimer = 0;
      this.maxHp = 100;
      this.hp = 100;
      this.powerCharge = 100;
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

      // Arms & Sword
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 20);
      let armX = this.facing === 'right' ? this.x + 12 : this.x - 12;
      if (this.isAttacking) {
        armX = this.facing === 'right' ? this.x + 22 : this.x - 22;
      }
      ctx.lineTo(armX, this.y - 15);
      ctx.stroke();

      if (this.isAttacking) {
        ctx.strokeStyle = '#e9edef';
        ctx.lineWidth = 3;
        ctx.beginPath();
        let swordX = this.facing === 'right' ? armX + 22 : armX - 22;
        ctx.moveTo(armX, this.y - 15);
        ctx.lineTo(swordX, this.y - 28);
        ctx.stroke();
      }
    }
    attack() {
      if (this.isAttacking) return;
      this.isAttacking = true;
      this.attackTimer = 8;
      
      let hitAny = false;
      enemies.forEach((enemy, idx) => {
        let dist = Math.abs(enemy.x - this.x);
        if (dist < 45 && ((this.facing === 'right' && enemy.x > this.x) || (this.facing === 'left' && enemy.x < this.x))) {
          enemy.hp -= 50;
          createParticles(enemy.x, enemy.y - 20, '#f2593f', 6);
          if (enemy.hp <= 0) {
            enemies.splice(idx, 1);
            kills++;
            score += 50 * level;
            addFloatingText('+50', enemy.x, enemy.y - 30, '#00a884');
            checkLevelUp();
          }
          hitAny = true;
        }
      });
    }
    specialBlast() {
      createParticles(this.x, this.y - 15, '#f2c265', 30);
      enemies.forEach((enemy) => {
        enemy.hp -= 100;
        addFloatingText('CRIT!', enemy.x, enemy.y - 30, '#f2c265');
      });
      enemies = enemies.filter(e => e.hp > 0);
      kills += enemies.length;
      score += 100 * level;
      checkLevelUp();
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
      this.speed = (1.0 + Math.random() * 0.8) + (level * 0.15);
      this.hp = 50;
      this.damage = 10;
      this.attackCooldown = 0;
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

      // Enemy hit player
      if (Math.abs(this.x - player.x) < 12) {
        if (this.attackCooldown <= 0) {
          player.hp -= this.damage;
          this.attackCooldown = 40;
          updateHpUI();
          createParticles(player.x, player.y - 15, '#f2593f', 5);
          addFloatingText('-10 HP', player.x, player.y - 35, '#f2593f');
          if (player.hp <= 0) endGame();
        }
      }
      if (this.attackCooldown > 0) this.attackCooldown--;
    }
  }

  function checkLevelUp() {
    if (kills >= level * 5) {
      level++;
      player.hp = Math.min(player.maxHp, player.hp + 30); // Heal on Level Up
      updateHpUI();
      levelEl.textContent = level;
      addFloatingText('LEVEL UP!', player.x, player.y - 45, '#f2c265');
    }
  }

  function updateHpUI() {
    let pct = Math.max(0, (player.hp / player.maxHp) * 100);
    hpFill.style.width = pct + '%';
    if (pct < 30) hpFill.style.background = 'var(--danger)';
    else if (pct < 60) hpFill.style.background = 'var(--special)';
    else hpFill.style.background = 'var(--accent)';
  }

  function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 18,
        color: color
      });
    }
  }

  function addFloatingText(text, x, y, color) {
    floatingTexts.push({ text, x, y, color, life: 25 });
  }

  function spawnEnemies() {
    if (gameOver) return;
    let spawnRate = 0.02 + (level * 0.005);
    if (Math.random() < spawnRate && enemies.length < 5 + level) {
      enemies.push(new Enemy());
    }
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

      // Particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) particles.splice(idx, 1);
      });

      // Floating Texts
      floatingTexts.forEach((ft, idx) => {
        ft.y -= 0.8;
        ft.life--;
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(ft.text, ft.x - 10, ft.y);
        if (ft.life <= 0) floatingTexts.splice(idx, 1);
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
    score = 0; kills = 0; level = 1; gameOver = false;
    enemies = []; particles = []; floatingTexts = [];
    levelEl.textContent = level;
    msgEl.textContent = '';
    player = new Player();
    updateHpUI();
    loop();
  }

  // Controls
  document.getElementById('btn-left').onclick = () => { if(!gameOver){ player.facing = 'left'; player.x = Math.max(20, player.x - 16); } };
  document.getElementById('btn-right').onclick = () => { if(!gameOver){ player.facing = 'right'; player.x = Math.min(width - 20, player.x + 16); } };
  document.getElementById('btn-attack').onclick = () => { if(!gameOver) player.attack(); };
  document.getElementById('btn-power').onclick = () => { if(!gameOver) player.specialBlast(); };
  document.getElementById('reset').onclick = init;

  document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') { player.facing = 'left'; player.x = Math.max(20, player.x - 16); }
    if (e.key === 'ArrowRight') { player.facing = 'right'; player.x = Math.min(width - 20, player.x + 16); }
    if (e.key === ' ' || e.key === 'ArrowUp') player.attack();
    if (e.key.toLowerCase() === 'x') player.specialBlast();
  });

  init();
})();
</script>
`;

export default {
  name: 'stickman',
  alias: ['stickfight', 'stickgame', 'stk'],
  description: 'Play Stickman Warrior Pro in WhatsApp',
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
              submessages: [{ messageType: 2, messageText: "⚔️ STICKMAN WARRIOR PRO" }],
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
