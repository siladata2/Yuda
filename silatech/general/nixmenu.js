import { randomUUID } from 'crypto';

export default {
  name: 'smenu',
  alias: ['ssmenu', 'six', 'menus'],
  description: 'Display SILA menu with rich response',
  category: 'general',
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
                          "text": "Sila Tech"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "text": "Created by Sila",
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
                            "url": "https://i.ibb.co/674988wP/silatech.jpg"
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
                              "title": "Menu"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "Help",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "00",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "NIX"
                                  }
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "Ping",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "01",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "NIX"
                                  }
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "Stats",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "02",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "NIX"
                                  }
                                }
                              ]
                            }
                          },
                          {
                            "__typename": "GenAI3PExtWidgetPrimitive",
                            "header": {
                              "__typename": "GenAI3PExtWidgetStandardHeader",
                              "title": "Commands"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": ".menu",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "10",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "NIX"
                                  }
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "Mode",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "11",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "NIX"
                                  }
                                },
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "Reload",
                                  "state": "PENDING",
                                  "kind": "OTHER",
                                  "tool_call_id": "12",
                                  "toast": {
                                    "__typename": "GenAI3PExtWidgetToast",
                                    "label": "NIX"
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
                            "cta_text": "WhatsApp Group",
                            "cta_type": "OPEN_URL",
                            "cta_url": "https://chat.whatsapp.com/IS276Wg9zcuCnJRiMDI64g?s=cl&p=a&mlu=4"
                          },
                          {
                            "__typename": "GenAIFooterActionPrimitive",
                            "cta_text": "WhatsApp Channel",
                            "cta_type": "OPEN_URL",
                            "cta_url": "https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02"
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
      console.error('[nixmenu]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};