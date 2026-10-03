export default {
  name: 'ownerinfo',
  alias: ['owner', 'creator', 'about'],
  description: 'Show owner information',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const botName = options.BOT_NAME || 'SILA TECH BOT';
    const footer = options.FOOTER || 'Created by Sila Tech';

    try {
      await sock.relayMessage(
        sender,
        {
          interactiveMessage: {
            header: {
              hasMediaAttachment: true,
              locationMessage: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: 'Sila Tech',
                address: 'Tanzania',
                jpegThumbnail: 'THUMBNAIL_BASE64_HAPA'
              }
            },
            body: {
              text: '\u0000'
            },
            footer: {
              text: `✦ ${footer}`
            },
            nativeFlowMessage: {
              buttons: [
                { name: '' },
                {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: 'Owner Info',
                    sections: [
                      {
                        title: '✦ OWNER DETAILS',
                        highlight_label: '「 Sila Tech 」',
                        rows: [
                          {
                            title: '「 👤 Name 」',
                            description: 'Sila Tech',
                            id: `${prefix}ownerinfo`
                          },
                          {
                            title: '「 📱 WhatsApp 」',
                            description: '+255 637 351 031',
                            id: `${prefix}ownerinfo`
                          },
                          {
                            title: '「 📢 Channel 」',
                            description: 'Follow our channel',
                            id: `${prefix}ownerinfo`
                          }
                        ]
                      }
                    ],
                    icon: 'DEFAULT'
                  })
                },
                {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: 'Links',
                    sections: [
                      {
                        title: 'Information',
                        highlight_label: 'Links',
                        rows: [
                          { title: 'Ping', id: `${prefix}ping` },
                          { title: 'Owner', id: `${prefix}owner` },
                          { title: 'Bot Script', id: `${prefix}sc` }
                        ]
                      }
                    ],
                    icon: 'REVIEW'
                  })
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Contact Owner',
                    url: 'https://wa.me/255637351031',
                    merchant_url: 'https://wa.me/255637351031',
                    icon: 'PROMOTION'
                  })
                }
              ],
              messageParamsJson: JSON.stringify({
                limited_time_offer: {
                  text: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' }),
                  url: 'https://wa.me/255637351031',
                  copy_code: 'Sila Tech Positive Vibes 🌿',
                  expiration_time: Date.now() + 2592000000
                }
              })
            },
            bloksWidget: {
              uuid: options.widgetUuid || crypto.randomUUID(),
              data: JSON.stringify({
                version: 'v0.9',
                createSurface: {
                  surfaceId: `menu-${Date.now()}`,
                  catalogId: 'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
                  components: [
                    {
                      id: 'root',
                      component: 'Column',
                      children: ['infoCard', 'helloCard', 'btnOwner']
                    },
                    {
                      id: 'infoCard',
                      component: 'Card',
                      child: 'infoCol'
                    },
                    {
                      id: 'infoCol',
                      component: 'Column',
                      children: ['infoText']
                    },
                    {
                      id: 'infoText',
                      component: 'Text',
                      variant: 'body',
                      text: `乂 BOT INFORMATION\n╭╮ Bot Name : *${botName}*\n││ Version : *1.0.0* \n││ Mode : *Public* \n││ Status : *Group Chat*\n││ Creator : @255637351031\n╰╯ Type : Plugin ESM\n\n乂 SCRIPT INFORMATION\n╭╮ Script Name : Sila-MD\n││ Owner : Sila Tech\n││ Library : @itsliaaa/baileys\n╰╯ Channel : silatech.site\n\n乂 SYSTEM INFORMATION\n╭╮ Platform : *linux x64*\n││ Time : *${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}*\n╰╯ Uptime : *${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m*\n\n乂 USER INFORMATION\n╭╮ User : @${sender.split('@')[0]}\n││ Cooperation : Sila Tech™\n││ Chat : *${sender.endsWith('@g.us') ? 'Group' : 'Private'}*\n╰╯ Prefix : *[${prefix}]*\n\nI will Always Be There🧊:\n◦ Powered By Sila Tech™`
                    },
                    {
                      id: 'helloCard',
                      component: 'Card',
                      child: 'helloCol'
                    },
                    {
                      id: 'helloCol',
                      component: 'Column',
                      children: ['helloDiv', 'helloText']
                    },
                    {
                      id: 'helloDiv',
                      component: 'Divider'
                    },
                    {
                      id: 'helloText',
                      component: 'Text',
                      variant: 'body',
                      text: `Hello, welcome to ${botName} 🍃.`
                    },
                    {
                      id: 'btnOwner',
                      component: 'Button',
                      child: 'btnOwnerText',
                      variant: 'primary',
                      action: {
                        call: 'openUrl',
                        args: { url: 'https://wa.me/255637351031' }
                      }
                    },
                    {
                      id: 'btnOwnerText',
                      component: 'Text',
                      variant: 'body',
                      text: 'Contact Owner'
                    }
                  ]
                }
              }),
              type: 'im_a2ui'
            }
          }
        },
        {}
      );

    } catch (error) {
      console.error('[ownerinfo]', error);
      await sock.sendMessage(sender, {
        text: `✦ Owner Info\n\n◉ Name: Sila Tech\n◉ WhatsApp: +255 637 351 031\n◉ Channel: silatech.site\n\n✦ ${footer}`
      });
    }
  }
};