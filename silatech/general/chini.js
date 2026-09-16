import { api } from './anichin.js';

export default {
  name: 'donghua',
  alias: ['anichin', 'chini', 'anime'],
  description: 'Search donghua from Anichin',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const botName = options.BOT_NAME || 'SILA TECH BOT';
    const footer = options.FOOTER || 'Created by Sila Tech';
    
    if (args.length === 0) {
      await sock.sendMessage(sender, {
        text: `✦ Donghua Search\n◉ Usage: ${prefix}donghua [query]\n◉ Example: ${prefix}donghua Perfect World\n\n▸ Commands:\n◉ ${prefix}donghua search [query]\n◉ ${prefix}donghua latest\n◉ ${prefix}donghua popular\n◉ ${prefix}donghua detail [slug]\n◉ ${prefix}donghua episode [slug]`
      });
      return;
    }
    
    const subCommand = args[0].toLowerCase();
    const query = args.slice(1).join(' ');
    
    try {
      await sock.sendPresenceUpdate('composing', sender);
      
      // Search
      if (subCommand === 'search' && query) {
        const result = await api.search(query);
        
        if (!result.results.length) {
          await sock.sendMessage(sender, {
            text: `✖ No results found for: ${query}`
          });
          return;
        }
        
        const cards = result.results.slice(0, 10).map((item, index) => ({
          body: {
            text: `✦ ${item.title}\n◉ Type: ${item.type || 'Donghua'}\n◉ Episode: ${item.episode || 'N/A'}`
          },
          footer: {
            text: `✦ Sila Tech`
          },
          header: {
            title: item.title.substring(0, 30),
            hasMediaAttachment: true,
            imageMessage: {
              url: item.thumbnail
            }
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: '📖 View Detail',
                  id: `${prefix}donghua detail ${item.slug}`
                })
              },
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '🔗 Open',
                  url: item.url,
                  merchant_url: item.url
                })
              }
            ]
          }
        }));
        
        await sock.sendMessage(sender, {
          text: `✦ Donghua Search\n◉ Query: ${query}\n◉ Found: ${result.results.length} results`
        });
        
        await sock.relayMessage(
          sender,
          {
            interactiveMessage: {
              header: { hasMediaAttachment: false },
              body: { text: `✦ Results for: ${query}` },
              footer: { text: `✦ ${footer}` },
              carouselMessage: { cards }
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
                    attrs: { type: 'native_flow', v: '1' },
                    content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
                  }
                ]
              }
            ]
          }
        );
        return;
      }
      
      // Latest
      if (subCommand === 'latest') {
        const result = await api.terbaru(1);
        
        const cards = result.results.slice(0, 10).map((item) => ({
          body: {
            text: `✦ ${item.title}\n◉ Episode: ${item.episode || 'N/A'}`
          },
          footer: { text: `✦ Sila Tech` },
          header: {
            title: item.title.substring(0, 30),
            hasMediaAttachment: true,
            imageMessage: { url: item.thumbnail }
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: '📖 Detail',
                  id: `${prefix}donghua detail ${item.slug}`
                })
              }
            ]
          }
        }));
        
        await sock.relayMessage(
          sender,
          {
            interactiveMessage: {
              header: { hasMediaAttachment: false },
              body: { text: `✦ Latest Donghua` },
              footer: { text: `✦ ${footer}` },
              carouselMessage: { cards }
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
                    attrs: { type: 'native_flow', v: '1' },
                    content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
                  }
                ]
              }
            ]
          }
        );
        return;
      }
      
      // Popular
      if (subCommand === 'popular') {
        const popular = await api.populer();
        
        const cards = popular.slice(0, 10).map((item) => ({
          body: {
            text: `✦ ${item.title}\n◉ Episode: ${item.episode || 'N/A'}`
          },
          footer: { text: `✦ Sila Tech` },
          header: {
            title: item.title.substring(0, 30),
            hasMediaAttachment: true,
            imageMessage: { url: item.thumbnail }
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: '📖 Detail',
                  id: `${prefix}donghua detail ${item.slug}`
                })
              }
            ]
          }
        }));
        
        await sock.relayMessage(
          sender,
          {
            interactiveMessage: {
              header: { hasMediaAttachment: false },
              body: { text: `✦ Popular Donghua` },
              footer: { text: `✦ ${footer}` },
              carouselMessage: { cards }
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
                    attrs: { type: 'native_flow', v: '1' },
                    content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
                  }
                ]
              }
            ]
          }
        );
        return;
      }
      
      // Detail
      if (subCommand === 'detail' && query) {
        const detail = await api.detail(query);
        
        let text = `✦ ${detail.title}\n\n`;
        if (detail.japaneseTitle) text += `◉ Japanese: ${detail.japaneseTitle}\n`;
        if (detail.type) text += `◉ Type: ${detail.type}\n`;
        if (detail.status) text += `◉ Status: ${detail.status}\n`;
        if (detail.genres.length) text += `◉ Genres: ${detail.genres.join(', ')}\n`;
        text += `\n▸ Synopsis:\n${detail.synopsis?.substring(0, 500) || 'No synopsis'}...\n`;
        text += `\n▸ Episodes: ${detail.episodes.length}\n`;
        
        await sock.sendMessage(sender, {
          image: { url: detail.cover },
          caption: text
        });
        
        // Send episodes list
        if (detail.episodes.length > 0) {
          const sections = [
            {
              title: `✦ Episodes (${detail.episodes.length})`,
              rows: detail.episodes.slice(0, 10).map((ep, index) => ({
                header: '',
                title: ep.title.substring(0, 50),
                description: ep.date || `Episode ${index + 1}`,
                id: `${prefix}donghua episode ${ep.slug}`
              }))
            }
          ];
          
          await sock.sendMessage(sender, {
            text: `✦ Select an episode:`,
            footer: `✦ ${footer}`,
            buttons: [
              {
                buttonId: 'select_episode',
                buttonText: { displayText: '📺 Watch Episode' },
                type: 1,
                nativeFlowInfo: {
                  name: 'single_select',
                  paramsJson: JSON.stringify({
                    title: `✦ ${detail.title}`,
                    sections: sections
                  })
                }
              }
            ],
            headerType: 1
          });
        }
        return;
      }
      
      // Episode
      if (subCommand === 'episode' && query) {
        const episode = await api.episode(query);
        
        let text = `✦ ${episode.title}\n\n`;
        if (episode.episodeNumber) text += `◉ Episode: ${episode.episodeNumber}\n`;
        if (episode.releasedDate) text += `◉ Released: ${episode.releasedDate}\n`;
        text += `\n▸ Stream Servers:\n`;
        
        if (episode.streams.length > 0) {
          episode.streams.forEach((stream, i) => {
            text += `${i + 1}. ${stream.server}\n`;
          });
        } else {
          text += `No streams available`;
        }
        
        const buttons = episode.streams.slice(0, 5).map((stream) => ({
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: `▶ ${stream.server}`,
            url: stream.url,
            merchant_url: stream.url
          })
        }));
        
        await sock.sendMessage(sender, {
          image: { url: episode.cover },
          caption: text,
          footer: `✦ ${footer}`,
          buttons: buttons,
          headerType: 1
        });
        return;
      }
      
      // Default: search
      const result = await api.search(args.join(' '));
      
      if (!result.results.length) {
        await sock.sendMessage(sender, {
          text: `✖ No results found for: ${args.join(' ')}`
        });
        return;
      }
      
      const cards = result.results.slice(0, 10).map((item) => ({
        body: {
          text: `✦ ${item.title}\n◉ Type: ${item.type || 'Donghua'}\n◉ Episode: ${item.episode || 'N/A'}`
        },
        footer: { text: `✦ Sila Tech` },
        header: {
          title: item.title.substring(0, 30),
          hasMediaAttachment: true,
          imageMessage: { url: item.thumbnail }
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: '📖 Detail',
                id: `${prefix}donghua detail ${item.slug}`
              })
            }
          ]
        }
      }));
      
      await sock.relayMessage(
        sender,
        {
          interactiveMessage: {
            header: { hasMediaAttachment: false },
            body: { text: `✦ Donghua Search: ${args.join(' ')}` },
            footer: { text: `✦ ${footer}` },
            carouselMessage: { cards }
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
                  attrs: { type: 'native_flow', v: '1' },
                  content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
                }
              ]
            }
          ]
        }
      );
      
    } catch (error) {
      console.error('[donghua]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      });
    }
  }
};