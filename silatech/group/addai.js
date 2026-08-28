export default {
  name: 'addai',
  alias: ['addmeta', 'addbot'],
  description: 'Add Meta AI bot to group',
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
      
      // Add Meta AI to group
      await sock.groupParticipantsUpdate(
        sender,
        [metaJid],
        'add'
      );
      
      // Send success message with rich response
      const responseId = crypto.randomUUID();
      
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
                          "text": "✦ Meta AI Added Successfully!\n\n◉ AI Assistant is now in the group\n◉ You can chat with Meta AI\n◉ Mention @867051314767696 to interact\n\n✦ Created by Sila Tech",
                          "__typename": "GenAIMarkdownTextUXPrimitive"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "cta_text": "✦ Learn More",
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
      console.error('[addai]', error);
      await sock.sendMessage(sender, { 
        text: `✖ Failed to add Meta AI: ${error?.message || error}` 
      });
    }
  }
};