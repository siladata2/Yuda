import { Carousel } from 'baileys';

export default {
  name: 'shop',
  alias: ['products', 'catalog', 'shop'],
  description: 'Display products in carousel',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      await new Carousel(sock)
        .setBody('Our Products')
        .setFooter('Sila Tech Shop')
        .addCard([
          {
            body: {
              text: 'Product A - TZS 50,000'
            },
            footer: {
              text: '10% off'
            },
            header: {
              title: 'Product A',
              hasMediaAttachment: true,
              imageMessage: {
                url: 'https://i.ibb.co/674988wP/silatech.jpg'
              }
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Buy',
                    id: `${prefix}buy_a`
                  })
                }
              ]
            }
          },
          {
            body: {
              text: 'Product B - TZS 75,000'
            },
            footer: {
              text: '15% off'
            },
            header: {
              title: 'Product B',
              hasMediaAttachment: true,
              imageMessage: {
                url: 'https://i.ibb.co/674988wP/silatech.jpg'
              }
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Buy',
                    id: `${prefix}buy_b`
                  })
                }
              ]
            }
          },
          {
            body: {
              text: 'Product C - TZS 100,000'
            },
            footer: {
              text: '20% off'
            },
            header: {
              title: 'Product C',
              hasMediaAttachment: true,
              imageMessage: {
                url: 'https://i.ibb.co/674988wP/silatech.jpg'
              }
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Buy',
                    id: `${prefix}buy_c`
                  })
                }
              ]
            }
          }
        ])
        .send(sender);
        
    } catch (error) {
      console.error('[carousel]', error);
      
      // Fallback to text
      const txt = `✦ Products\n\n` +
                  `◉ Product A - TZS 50,000 (10% off)\n` +
                  `◉ Product B - TZS 75,000 (15% off)\n` +
                  `◉ Product C - TZS 100,000 (20% off)\n\n` +
                  `▸ To buy: ${prefix}buy [product]`;
      
      await sock.sendMessage(sender, { text: txt });
    }
  }
};