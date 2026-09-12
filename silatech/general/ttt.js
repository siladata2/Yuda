import { randomUUID } from 'crypto';

export default {
  name: 'chess',
  alias: ['playchess', 'chessgame'],
  description: 'Play Chess Interactive Game',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    try {
      const responseId = randomUUID();

      const content = {
        messageContextInfo: {
          messageSecret: "v/3VN8Gfr2dbKzgt1GKDEU7ovyYW+nswh4Duwq6KDuU="
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [
                    {
                      "view_model": {
                        "primitive": {
                          "__typename": "FOATextPrimitive",
                          "text": "Chess Master AI"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "text": "♟️ *CHESS ENGINE* - Live Game\nStatus: *YOUR TURN*",
                          "__typename": "GenAIMarkdownTextUXPrimitive"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "__typename": "GenAIImagePrimitive",
                          "preview_image": {
                            "__typename": "GenAIMediaItem",
                            "mime_type": "image/jpeg",
                            "url": "https://i.ibb.co/674988wP/silatech.jpg" // Weka URL ya picha ya Bodi ya Chess hapa
                          },
                          "full_image": {
                            "__typename": "GenAIMediaItem",
                            "mime_type": "image/jpeg",
                            "url": "https://i.ibb.co/674988wP/silatech.jpg"
                          }
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
                              "title": "Controls"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "New Game 🔄",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "chess_reset",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "Starting new game..."
                                  }
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "Undo ↩️",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "chess_undo",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "Undoing move..."
                                  }
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "Resign 🏳️",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "chess_resign",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "Game ended"
                                  }
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
                            "__typename": "GenAIFooterActionPrimitive",
                            "cta_text": "Play Full Screen Web App",
                            "cta_type": "OPEN_URL",
                            "cta_url": "https://silatech.site/chess"
                          }
                        ],
                        "__typename": "GenAIHScrollLayoutViewModel"
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

    } catch (error) {
      console.error('[chess]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};
