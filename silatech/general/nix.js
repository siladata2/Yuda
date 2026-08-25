import { randomUUID } from 'crypto';

export default {
  name: 'nixcode',
  alias: ['latex', 'nixel', 'formula'],
  description: 'Send NIXCODE formatted message with LaTeX',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      // Get text from args or use default
      let text = args.join(' ') || 'Shiroko is my bini:\n- Model 1: {{NIXEL_0}}NIXCODE{{/NIXEL_0}}\n- Model 2: {{NIXEL_1}}NIXCODE{{/NIXEL_1}}';
      
      // Generate unique response ID
      const responseId = randomUUID();
      
      // Build submessages
      const submessages = [{
        messageType: 2,
        messageText: text
      }];
      
      // Build unified response
      const unified = {
        "response_id": responseId,
        "sections": [{
          "view_model": {
            "primitive": {
              "text": text,
              "inline_entities": [
                {
                  "key": "NIXEL_0",
                  "metadata": {
                    "latex_expression": "NIXCODE",
                    "latex_image": {
                      "url": "https://cdn.ornzora.eu.cc/1ca0f9a4-a81f-498e-92e8-8a4c76abf1ef-FIORA.png",
                      "width": 1279,
                      "height": 825
                    },
                    "font_height": 83.333333333333,
                    "padding": 15,
                    "__typename": "GenAILatexItem"
                  }
                },
                {
                  "key": "NIXEL_1",
                  "metadata": {
                    "latex_expression": "NIXCODE",
                    "latex_image": {
                      "url": "https://cdn.ornzora.eu.cc/a3a756f2-6bb8-4814-a024-c325524a2308-FIORA.png",
                      "width": 1429,
                      "height": 1897
                    },
                    "font_height": 83.333333333333,
                    "padding": 15,
                    "__typename": "GenAILatexItem"
                  }
                }
              ],
              "__typename": "GenAIMarkdownTextUXPrimitive"
            },
            "__typename": "GenAISingleLayoutViewModel"
          }
        }]
      };
      
      // Build content
      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            pluginMetadata: {},
            richResponseSourcesMetadata: {}
          }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: submessages,
              unifiedResponse: {
                data: Buffer.from(JSON.stringify(unified), 'utf-8').toString('base64')
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
      
      // Send the message
      await sock.relayMessage(sender, content, {});
      
      // Send confirmation
      await sock.sendMessage(sender, {
        text: `✦ NIXCODE sent successfully!\n◉ Response ID: ${responseId.substring(0, 8)}...`
      });
      
    } catch (error) {
      console.error('NIXCODE error:', error);
      await sock.sendMessage(sender, {
        text: `✖ Failed to send NIXCODE: ${error.message}`
      });
    }
  }
};