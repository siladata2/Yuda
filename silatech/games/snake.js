import { randomUUID } from 'crypto';

// ============================================
// HTML SNAKE GAME SOURCE CODE
// ============================================
const snakeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root {
  --bg: transparent;
  --card-bg: #1f2c34;
  --board-bg: #0b141a;
  --ink: #e9edef;
  --muted: #8696a0;
  --accent: #00a884;
  --snake-head: #005c4b;
  --snake-body: #00a884;
  --food: #ff4b4b;
  --sys: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; user-select:none; }
html, body {
  background: transparent;
  color: var(--ink);
  font-family: var(--sys);
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 12px;
}
.card { width: 100%; max-width: 340px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #2a3942; padding-bottom: 6px; }
.header__title { font-size: 16px; font-weight: 700; color: var(--accent); }
.score-board { font-size: 12px; color: var(--muted); }
.score-board b { color: var(--ink); margin-left: 2px; }
.board-container { position: relative; width: 100%; aspect-ratio: 1; background: var(--board-bg); border-radius: 8px; border: 1px solid #2a3942; overflow: hidden; }
canvas { width: 100%; height: 100%; display: block; }
.controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 12px; max-width: 200px; margin-left: auto; margin-right: auto; }
.btn { background: #202c33; border: 1px solid #2a3942; color: var(--ink); padding: 12px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; text-align: center; }
.btn:active { background: var(--accent); color: #000; }
.btn-up { grid-column: 2; }
.btn-left { grid-column: 1; grid-row: 2; }
.btn-down { grid-column: 2; grid-row: 2; }
.btn-right { grid-column: 3; grid-row: 2; }
.footer { margin-top: 10px; text-align: center; }
.reset-btn { background: transparent; border: 1px solid var(--accent); color: var(--accent); padding: 6px 16px; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 12px; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="header__title">🐍 SILA Snake</div>
    <div class="score-board">Score: <b id="score">0</b></div>
  </div>
  <div class="board-container">
    <canvas id="gameCanvas" width="300" height="300"></canvas>
  </div>
  <div class="controls">
    <button class="btn btn-up" id="btn-up">▲</button>
    <button class="btn btn-left" id="btn-left">◄</button>
    <button class="btn btn-down" id="btn-down">▼</button>
    <button class="btn btn-right" id="btn-right">►</button>
  </div>
  <div class="footer">
    <button class="reset-btn" id="reset">Restart Game</button>
  </div>
</div>

<script>
(function(){
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const gridSize = 15;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let dx = 1, dy = 0;
let score = 0;
let gameInterval = null;
let gameOver = false;

function main() {
  if (gameOver) return;
  gameInterval = setTimeout(function() {
    clearCanvas();
    moveSnake();
    drawFood();
    drawSnake();
    checkGameOver();
    main();
  }, 120);
}

function clearCanvas() {
  ctx.fillStyle = '#0b141a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#005c4b' : '#00a884';
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
  });
}

function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function drawFood() {
  ctx.fillStyle = '#ff4b4b';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

function checkGameOver() {
  const head = snake[0];
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) gameOver = true;
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) gameOver = true;
  }
  if (gameOver) {
    ctx.fillStyle = '#e9edef';
    ctx.font = '20px sans-serif';
    ctx.fillText('Game Over!', 95, 150);
  }
}

function changeDirection(newDx, newDy) {
  if ((newDx === -dx && newDx !== 0) || (newDy === -dy && newDy !== 0)) return;
  dx = newDx; dy = newDy;
}

document.getElementById('btn-up').onclick = () => changeDirection(0, -1);
document.getElementById('btn-down').onclick = () => changeDirection(0, 1);
document.getElementById('btn-left').onclick = () => changeDirection(-1, 0);
document.getElementById('btn-right').onclick = () => changeDirection(1, 0);

document.getElementById('reset').onclick = () => {
  clearTimeout(gameInterval);
  snake = [{x: 10, y: 10}];
  dx = 1; dy = 0;
  score = 0;
  gameOver = false;
  scoreEl.textContent = score;
  generateFood();
  main();
};

generateFood();
main();
})();
</script>
</body>
</html>
`;

// ============================================
// BOT COMMAND IMPLEMENTATION
// ============================================
export default {
  name: 'snake',
  alias: ['snakegame', 'nyoka'],
  description: 'Play live HTML Snake game in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    try {
      const responseId = 'sila-snake-' + Date.now();

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
                  messageText: "🐍 Classic Snake Game"
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
                          "payload": snakeHtml,
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
      console.error('[SNAKE]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      }, { quoted: msg });
    }
  }
};
