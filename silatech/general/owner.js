import { randomUUID } from 'node:crypto';

const THUMBNAIL = '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';

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
    const ownerNumber = options.config?.getSetting ? options.config.getSetting('OWNER_NUMBER') : '255637351031';
    const now = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' });
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

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
                jpegThumbnail: THUMBNAIL
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
                    title: '\u0000',
                    sections: [
                      {
                        title: '⊹ OWNER DETAILS ⊹',
                        highlight_label: '「 Sila Tech 」',
                        rows: [
                          { title: '「 ▢ Name 」', description: ' └── Sila Tech', id: `${prefix}ownerinfo` },
                          { title: '「 ▢ WhatsApp 」', description: ' └── +255 637 351 031', id: `${prefix}ownerinfo` },
                          { title: '「 ▢ GitHub 」', description: ' └── Sila-Md', id: `${prefix}ownerinfo` },
                          { title: '「 ▢ Channel 」', description: ' └── WhatsApp Channel', id: `${prefix}ownerinfo` }
                        ]
                      }
                    ],
                    icon: 'DEFAULT'
                  })
                },
                {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: '\u0000',
                    sections: [
                      {
                        title: 'Information',
                        highlight_label: 'Information',
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
                    display_text: '\u0000',
                    url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
                    merchant_url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
                    icon: 'PROMOTION'
                  })
                }
              ],
              messageParamsJson: JSON.stringify({
                limited_time_offer: {
                  text: now,
                  url: 'https://wa.me/255637351031',
                  copy_code: 'Sila Tech Positive Vibes 🌿',
                  expiration_time: Date.now() + 2592000000
                }
              })
            },
            bloksWidget: {
              uuid: randomUUID(),
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
                      text: `乂 BOT INFORMATION\n╭╮ Bot Name : *${botName}*\n││ Version : *1.0.0*\n││ Mode : *Public*\n││ Status : *${sender.endsWith('@g.us') ? 'Group Chat' : 'Private Chat'}*\n││ Creator : @${ownerNumber}\n╰╯ Type : Plugin ESM\n\n乂 SCRIPT INFORMATION\n╭╮ Script Name : Sila-MD\n││ Owner : Sila Tech\n││ Library : @itsliaaa/baileys\n╰╯ Channel : silatech.site\n\n乂 SYSTEM INFORMATION\n╭╮ Bot Uptime : *${hours}h ${minutes}m ${seconds}s*\n││ Platform : *${process.platform} ${process.arch}*\n╰╯ Time : *${now}*\n\n乂 USER INFORMATION\n╭╮ User : @${sender.split('@')[0]}\n││ Cooperation : Sila Tech™\n││ Chat : *${sender.endsWith('@g.us') ? 'Group' : 'Private'}*\n╰╯ Prefix : *[${prefix}]*\n\nI will Always Be There 🧊:\n◦ Powered By Sila Tech™`
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