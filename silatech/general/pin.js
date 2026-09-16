import axios from 'axios';
import { randomUUID } from 'crypto';

export default {
  name: 'pinterest',
  alias: ['pin', 'pins', 'searchpin'],
  description: 'Search Pinterest images with rich carousel UI',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const botName = options.BOT_NAME || 'SILA TECH BOT';
    const footer = options.FOOTER || 'Created by Sila Tech';
    
    if (args.length === 0) {
      await sock.sendMessage(sender, {
        text: `✦ Pinterest Search\n◉ Usage: ${prefix}pinterest [query]\n◉ Example: ${prefix}pinterest Cat`
      });
      return;
    }
    
    const query = args.join(' ');
    
    try {
      // Send typing indicator
      await sock.sendPresenceUpdate('composing', sender);
      
      // Call Pinterest API
      const response = await axios.get(
        `https://api.silatech.site/api/search/search-pinterest?query=${encodeURIComponent(query)}&scope=pins`
      );
      
      if (!response.data || !response.data.results || response.data.results.length === 0) {
        await sock.sendMessage(sender, {
          text: `✖ No results found for: ${query}`
        });
        return;
      }
      
      const results = response.data.results;
      const totalResults = results.length;
      
      // Build carousel cards
      const cards = results.slice(0, 10).map((pin, index) => {
        const title = pin.title || `Pinterest Pin #${index + 1}`;
        const description = pin.fullName ? `By: ${pin.fullName}` : `By: @${pin.username}`;
        
        return {
          body: {
            text: `✦ ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}\n${description}`
          },
          footer: {
            text: `✦ Sila Tech`
          },
          header: {
            title: title.substring(0, 30),
            hasMediaAttachment: true,
            imageMessage: {
              url: pin.image || pin.thumb
            }
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: '📥 Download',
                  id: `${prefix}pindl ${pin.image}`
                })
              },
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '🔗 View Pin',
                  url: pin.pinUrl,
                  merchant_url: pin.pinUrl
                })
              }
            ]
          }
        };
      });
      
      // Send initial info message
      await sock.sendMessage(sender, {
        text: `✦ Pinterest Search Results\n◉ Query: ${query}\n◉ Found: ${totalResults} pins\n◉ Showing: ${cards.length} results\n\n▸ Swipe to see more`
      });
      
      // Send carousel
      await sock.relayMessage(
        sender,
        {
          interactiveMessage: {
            header: {
              hasMediaAttachment: false
            },
            body: {
              text: `✦ Pinterest: ${query}\n◉ ${totalResults} results found`
            },
            footer: {
              text: `✦ ${footer}`
            },
            carouselMessage: {
              cards: cards
            }
          }
        },
        {
          additionalNodes: [
            {
              tag: 'biz',
              attrs: {},
              content: [
                {
                  tag: 'interactive',
                  attrs: {
                    type: 'native_flow',
                    v: '1'
                  },
                  content: [
                    {
                      tag: 'native_flow',
                      attrs: {
                        v: '9',
                        name: 'mixed'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      );
      
    } catch (error) {
      console.error('[pinterest]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      });
    }
  }
};