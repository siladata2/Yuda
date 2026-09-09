import { randomUUID } from 'crypto';

export default {
  name: 'games',
  alias: ['game', 'play', 'mini'],
  description: 'Play mini games in WhatsApp',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    // Show games menu
    if (args.length === 0 || args[0] === 'menu') {
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
                          "text": "✦ SILENT TECH\n◉ Mini Games\n◉ 13 games available\n\n▸ Type any command to play\n▸ Quick games in WhatsApp",
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
                              "title": "✦ Games"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🏃 Dino",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "dino",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "dino"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🐍 Snake",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "snake",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "snake"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🎹 Piano",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "piano",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "piano"}
                                }
                              ]
                            }
                          },
                          {
                            "__typename": "GenAI3PExtWidgetPrimitive",
                            "header": {
                              "__typename": "GenAI3PExtWidgetStandardHeader",
                              "title": "✦ More Games"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🏎 Race",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "race",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "race"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🐦 Flappy",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "flappy",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "flappy"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🧩 Tetris",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "tetris",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "tetris"}
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
                        "primitives": [
                          {
                            "__typename": "GenAI3PExtWidgetPrimitive",
                            "header": {
                              "__typename": "GenAI3PExtWidgetStandardHeader",
                              "title": "✦ Action"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🧠 Memory",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "memory",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "memory"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🏓 Pong",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "pong",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "pong"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🧱 Breakout",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "breakout",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "breakout"}
                                }
                              ]
                            }
                          },
                          {
                            "__typename": "GenAI3PExtWidgetPrimitive",
                            "header": {
                              "__typename": "GenAI3PExtWidgetStandardHeader",
                              "title": "✦ Puzzle"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🔢 2048",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "2048",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "2048"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🔨 Mole",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "mole",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "mole"}
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "🚀 Shooter",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "shooter",
                                  "toast": {"__typename": "GenAI3PExtWidgetToast", "label": "shooter"}
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
                          "text": "✦ Simon Says - Repeat the pattern\n✦ Type .simon to play",
                          "__typename": "GenAIMarkdownTextUXPrimitive"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "cta_text": "✦ Play Now",
                          "cta_type": "OPEN_URL",
                          "cta_url": "https://silatech.site",
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
    
    // Handle individual games
    const game = args[0].toLowerCase();
    
    // Dino Runner
    if (game === 'dino') {
      await sock.sendMessage(sender, {
        text: `🦖 *DINO RUNNER*\n\n` +
              `Jump over obstacles and survive!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "jump" to jump\n` +
              `• Reply with "duck" to duck\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Snake
    if (game === 'snake') {
      await sock.sendMessage(sender, {
        text: `🐍 *SNAKE*\n\n` +
              `Eat, grow, and survive!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "up" to move up\n` +
              `• Reply with "down" to move down\n` +
              `• Reply with "left" to move left\n` +
              `• Reply with "right" to move right\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Piano
    if (game === 'piano') {
      await sock.sendMessage(sender, {
        text: `🎹 *PIANO*\n\n` +
              `Play and record music!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with notes: C D E F G A B\n` +
              `• Reply with "record" to start recording\n` +
              `• Reply with "play" to play recorded\n` +
              `• Reply with "stop" to stop\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Car Race
    if (game === 'race') {
      await sock.sendMessage(sender, {
        text: `🏎 *CAR RACE*\n\n` +
              `Dodge traffic and survive!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "left" to move left\n` +
              `• Reply with "right" to move right\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Flappy Bird
    if (game === 'flappy') {
      await sock.sendMessage(sender, {
        text: `🐦 *FLAPPY BIRD*\n\n` +
              `Tap to flap and survive!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "flap" to jump\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Tetris
    if (game === 'tetris') {
      await sock.sendMessage(sender, {
        text: `🧩 *TETRIS*\n\n` +
              `Clear the lines!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "left" to move left\n` +
              `• Reply with "right" to move right\n` +
              `• Reply with "rotate" to rotate\n` +
              `• Reply with "down" to drop\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Memory Match
    if (game === 'memory') {
      await sock.sendMessage(sender, {
        text: `🧠 *MEMORY MATCH*\n\n` +
              `Find all pairs!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "A1" to flip card\n` +
              `• Reply with "B2" to flip card\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Pong
    if (game === 'pong') {
      await sock.sendMessage(sender, {
        text: `🏓 *PONG*\n\n` +
              `Beat the CPU!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "up" to move up\n` +
              `• Reply with "down" to move down\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0 - 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Brick Breaker
    if (game === 'breakout') {
      await sock.sendMessage(sender, {
        text: `🧱 *BRICK BREAKER*\n\n` +
              `Break all bricks!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "left" to move left\n` +
              `• Reply with "right" to move right\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // 2048
    if (game === '2048') {
      await sock.sendMessage(sender, {
        text: `🔢 *2048*\n\n` +
              `Merge to 2048!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "up" to move up\n` +
              `• Reply with "down" to move down\n` +
              `• Reply with "left" to move left\n` +
              `• Reply with "right" to move right\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Whack-a-Mole
    if (game === 'mole') {
      await sock.sendMessage(sender, {
        text: `🔨 *WHACK-A-MOLE*\n\n` +
              `Smash those moles!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "1" to hit mole 1\n` +
              `• Reply with "2" to hit mole 2\n` +
              `• Reply with "3" to hit mole 3\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Space Shooter
    if (game === 'shooter') {
      await sock.sendMessage(sender, {
        text: `🚀 *SPACE SHOOTER*\n\n` +
              `Blast the invaders!\n\n` +
              `📝 *How to play:*\n` +
              `• Reply with "left" to move left\n` +
              `• Reply with "right" to move right\n` +
              `• Reply with "shoot" to fire\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Simon Says
    if (game === 'simon') {
      await sock.sendMessage(sender, {
        text: `🔴 *SIMON SAYS*\n\n` +
              `Repeat the pattern!\n\n` +
              `📝 *How to play:*\n` +
              `• Watch the pattern\n` +
              `• Reply with sequence: R G B Y\n` +
              `• Example: R G B\n` +
              `• Reply with "start" to begin\n\n` +
              `🎯 *Score:* 0\n` +
              `🏆 *High Score:* 0\n\n` +
              `✦ Sila Tech Games`
      });
      return;
    }
    
    // Unknown game
    await sock.sendMessage(sender, {
      text: `✖ Game not found\n◉ Type ${prefix}games menu to see all games`
    });
  }
};