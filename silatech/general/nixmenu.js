import { randomUUID } from 'crypto';

export default {
  name: 'nixmenu',
  alias: ['nxmenu', 'nix', 'menu2'],
  description: 'Display NIX menu with rich response',
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
                          "text": "✦ let me know~"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "text": "✦ im here~\n◉ Welcome to NIX Menu",
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
                            "url": "https://cdn.ornzora.eu.cc/f4ec8425-c846-4937-b838-9291bf0514e2-FIORA.jpg"
                          },
                          "full_image": {
                            "__typename": "GenAIMediaItem",
                            "mime_type": "image/jpeg",
                            "url": "https://cdn.ornzora.eu.cc/2fa0763e-011f-4d18-b69b-32dd24282393-FIORA.jpg"
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
                              "title": "✦ LIST-X"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "✦ Menu",
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
                                  "label": "✦ Profile",
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
                                  "label": "✦ Script",
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
                              "title": "✦ NX-T"
                            },
                            "body": {
                              "__typename": "GenAI3PExtCalendarEventList",
                              "sections": [],
                              "ctas": [
                                {
                                  "__typename": "GenAI3PExtWidgetCTA",
                                  "label": "✦ NIXCODE",
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
                                  "label": "✦ NIXEL",
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
                                  "label": "✦ FIORA",
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
                            "cta_text": "✦ WhatsApp Group",
                            "cta_type": "OPEN_URL",
                            "cta_url": "https://chat.whatsapp.com/J7OzqKB7Bl2AGIcNEYsdch?s=cl&p=a&ilr=0"
                          },
                          {
                            "__typename": "GenAIFooterActionPrimitive",
                            "cta_text": "✦ WhatsApp Channel",
                            "cta_type": "OPEN_URL",
                            "cta_url": "https://whatsapp.com/channel/0029VbCV1ck8fewpdNb2TY2k"
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