import { randomUUID } from 'crypto';

export default {
  name: 'snake',
  alias: ['snakegame', 'play-snake', 'snake-live'],
  description: 'Play live Snake game in WhatsApp',
  category: 'games',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isOwner = options.isOwner ? options.isOwner() : false;
    
    // Game state management
    if (!global.gameStates) global.gameStates = {};
    
    const playerId = sender;
    const gameState = global.gameStates[playerId] || {
      snake: [{ x: 5, y: 5 }],
      direction: 'right',
      food: { x: 10, y: 5 },
      score: 0,
      active: false,
      grid: { width: 15, height: 10 }
    };
    
    // Show game menu with rich UI
    if (args.length === 0) {
      const content = {
        messageContextInfo: {
          messageSecret: "6dl5L3BxZ/haIDZtasZ9fcN4X+nGecLNbuiLh1slHLw="
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": randomUUID(),
                  "sections": [
                    {
                      "view_model": {
                        "primitive": {
                          "text": "🐍 *SNAKE GAME*\n◉ Eat, grow, and survive\n◉ Live game in WhatsApp\n\n▸ Choose a control:",
                          "__typename": "GenAIMarkdownTextUXPrimitive"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitives": [
                          {
                            "__typename": "GenAI3PExtWidgetPrimitive",
                            "header": {
                              "__typename": "GenAI3PExtWidgetStandardHeader",
                              "title": "🎮 Controls"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "⬆ Up",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "up",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "up"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "⬇ Down",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "down",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "down"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "⬅ Left",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "left",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "left"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "➡ Right",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "right",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "right"}
                                }
                              ]
                            }
                          },
                          {
                            "__typename": "GenAI3PExtWidgetPrimitive",
                            "header": {
                              "__typename": "GenAI3PExtWidgetStandardHeader",
                              "title": "🎯 Actions"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "▶ Start",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "start",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "start"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🔄 Restart",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "restart",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "restart"}
                                }
                              ]
                            }
                          }
                        ],
                        "__typename": "GenAIHScrollLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "cta_text": "🎮 Play Snake",
                          "cta_type": "OPEN_URL",
                          "cta_url": "https://silatech.site/games/snake",
                          "__typename": "GenAIFooterActionPrimitive"
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
                forwardOrigin: 4
              }
            }
          }
        }
      };
      
      await sock.relayMessage(sender, content, {});
      return;
    }
    
    // Handle commands
    const command = args[0].toLowerCase();
    
    // Start game
    if (command === 'start') {
      if (gameState.active) {
        await sock.sendMessage(sender, { text: '✖ Game is already running!' });
        return;
      }
      
      // Initialize game
      gameState.snake = [{ x: 7, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 5 }];
      gameState.direction = 'right';
      gameState.score = 0;
      gameState.active = true;
      gameState.food = generateFood(gameState);
      
      global.gameStates[playerId] = gameState;
      
      // Send initial game board
      await sendGameBoard(sock, sender, gameState, prefix);
      return;
    }
    
    // Restart game
    if (command === 'restart') {
      gameState.snake = [{ x: 7, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 5 }];
      gameState.direction = 'right';
      gameState.score = 0;
      gameState.active = true;
      gameState.food = generateFood(gameState);
      
      global.gameStates[playerId] = gameState;
      
      await sendGameBoard(sock, sender, gameState, prefix);
      return;
    }
    
    // Handle movement
    if (['up', 'down', 'left', 'right'].includes(command)) {
      if (!gameState.active) {
        await sock.sendMessage(sender, { text: '✖ Game not started! Use .snake start' });
        return;
      }
      
      // Prevent reverse direction
      const opposites = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      };
      
      if (opposites[command] === gameState.direction) {
        await sock.sendMessage(sender, { text: '✖ Cannot reverse direction!' });
        return;
      }
      
      gameState.direction = command;
      
      // Move snake
      const moved = moveSnake(gameState);
      
      if (!moved) {
        // Game over
        gameState.active = false;
        global.gameStates[playerId] = gameState;
        
        await sock.sendMessage(sender, {
          text: `💀 *GAME OVER*\n\n◉ Final Score: ${gameState.score}\n◉ Length: ${gameState.snake.length}\n\n▸ Type .snake start to play again`
        });
        return;
      }
      
      global.gameStates[playerId] = gameState;
      
      // Send updated board
      await sendGameBoard(sock, sender, gameState, prefix);
      return;
    }
    
    // Help
    await sock.sendMessage(sender, {
      text: `🐍 *Snake Game Controls*\n\n` +
            `▸ ${prefix}snake - Show menu\n` +
            `▸ ${prefix}snake start - Start game\n` +
            `▸ ${prefix}snake restart - Restart game\n` +
            `▸ ${prefix}snake up - Move up\n` +
            `▸ ${prefix}snake down - Move down\n` +
            `▸ ${prefix}snake left - Move left\n` +
            `▸ ${prefix}snake right - Move right\n\n` +
            `🎮 Play live in WhatsApp!`
    });
  }
};

// ==================== GAME LOGIC ====================

function generateFood(state) {
  const { width, height } = state.grid;
  let food;
  let attempts = 0;
  
  do {
    food = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    attempts++;
  } while (
    state.snake.some(seg => seg.x === food.x && seg.y === food.y) && 
    attempts < 100
  );
  
  return food;
}

function moveSnake(state) {
  const head = { ...state.snake[0] };
  
  switch (state.direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }
  
  const { width, height } = state.grid;
  
  // Wrap around walls
  if (head.x < 0) head.x = width - 1;
  if (head.x >= width) head.x = 0;
  if (head.y < 0) head.y = height - 1;
  if (head.y >= height) head.y = 0;
  
  // Check collision with self
  if (state.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    return false;
  }
  
  state.snake.unshift(head);
  
  // Check food
  if (head.x === state.food.x && head.y === state.food.y) {
    state.score += 10;
    state.food = generateFood(state);
  } else {
    state.snake.pop();
  }
  
  return true;
}

async function sendGameBoard(sock, sender, state, prefix) {
  const { width, height } = state.grid;
  
  // Build board
  let board = '';
  
  // Top border
  board += '┌' + '─'.repeat(width * 2) + '┐\n';
  
  for (let y = 0; y < height; y++) {
    board += '│';
    for (let x = 0; x < width; x++) {
      const isHead = state.snake[0].x === x && state.snake[0].y === y;
      const isBody = state.snake.slice(1).some(seg => seg.x === x && seg.y === y);
      const isFood = state.food.x === x && state.food.y === y;
      
      if (isHead) {
        board += '🟢';
      } else if (isBody) {
        board += '🟩';
      } else if (isFood) {
        board += '🍎';
      } else {
        board += '⬛';
      }
    }
    board += '│\n';
  }
  
  // Bottom border
  board += '└' + '─'.repeat(width * 2) + '┘\n';
  
  // Controls
  board += `\n🎮 *Controls:*\n`;
  board += `⬆ ${prefix}snake up    ⬇ ${prefix}snake down\n`;
  board += `⬅ ${prefix}snake left  ➡ ${prefix}snake right\n`;
  
  // Score
  board += `\n📊 *Score:* ${state.score} | 🐍 *Length:* ${state.snake.length}`;
  
  await sock.sendMessage(sender, { text: board });
}