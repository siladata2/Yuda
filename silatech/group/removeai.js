import { randomUUID } from 'crypto';

export default {
  name: 'removeai',
  alias: ['rmai', 'delai', 'kickai'],
  description: 'Remove Meta AI bot from group',
  category: 'group',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    // Check if in group
    if (!sender.endsWith('@g.us')) {
      await sock.sendMessage(sender, { text: '✖ This command only works in groups' });
      return;
    }
    
    try {
      // Meta AI JID
      const metaJid = '867051314767696@bot';
      
      // Remove Meta AI from group
      await sock.groupParticipantsUpdate(
        sender,
        [metaJid],
        'remove'
      );
      
      // Send success message with rich response
      const responseId = randomUUID();
      
      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: "✦ Meta AI",
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
                      "view_model": {
                        "primitive": {
                          "text": "✦ Meta AI Removed!\n\n◉ AI Assistant has been removed from the group\n◉ You can add again with .addai\n\n✦ Created by Sila Tech",
                          "__typename": "GenAIMarkdownTextUXPrimitive"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "cta_text": "✦ Add Again",
                          "cta_type": "OPEN_URL",
                          "cta_url": "https://ai.meta.com",
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
      console.error('[removeai]', error);
      await sock.sendMessage(sender, { 
        text: `✖ Failed to remove Meta AI: ${error?.message || error}` 
      });
    }
  }
};