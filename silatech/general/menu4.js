import { randomUUID } from 'node:crypto';

export default {
  name: 'amenu',
  alias: ['txmenu', 'nexusmenu', 'bossmenu'],
  description: 'Send owner premium menu',
  category: 'owner',
  ownerOnly: true,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const botName = options.BOT_NAME || 'SILA TECH BOT';
    const version = options.VERSION || '1.0.0';
    const footer = options.FOOTER || 'Sila Tech';
    const botImage = options.BOT_IMAGE || 'https://i.ibb.co/674988wP/silatech.jpg';

    try {
      const widgetUuid = randomUUID();

      await sock.relayMessage(
        sender,
        {
          interactiveMessage: {
            header: {
              hasMediaAttachment: true,
              imageMessage: {
                url: botImage,
                mimetype: 'image/jpeg'
              }
            },
            body: {
              text: '\u0000'
            },
            footer: {
              text: `✦ ${botName}`
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: '\u0000',
                    sections: [
                      {
                        title: '⊹ CHOOSE CATEGORY ⊹',
                        highlight_label: `「 ${botName} 」`,
                        rows: [
                          { title: '「 ▢ All Menu 」', description: '└── Description All Cmd', id: `${prefix}menuall` },
                          { title: '「 ▢ 18+ 」', description: '└── Description 18+ Cmd', id: `${prefix}menunsfw+` },
                          { title: '「 ▢ AI Menu 」', description: '└── Description AI Cmd', id: `${prefix}menuai` },
                          { title: '「 ▢ AI Image 」', description: '└── Description AI Image Cmd', id: `${prefix}menuimageai` },
                          { title: '「 ▢ AI Video 」', description: '└── Description AI Video Cmd', id: `${prefix}menuvideoai` },
                          { title: '「 ▢ Cpanel 」', description: '└── Description Cpanel Cmd', id: `${prefix}menu cpanelv2` },
                          { title: '「 ▢ Download 」', description: '└── Description Download Cmd', id: `${prefix}menudownload` },
                          { title: '「 ▢ Economy 」', description: '└── Description Economy Cmd', id: `${prefix}menuekonomi` },
                          { title: '「 ▢ Fun 」', description: '└── Description Fun Cmd', id: `${prefix}menufun` },
                          { title: '「 ▢ Game 」', description: '└── Description Games Cmd', id: `${prefix}menugame` },
                          { title: '「 ▢ Group 」', description: '└── Description Group Cmd', id: `${prefix}menugroup` },
                          { title: '「 ▢ Qur\'an 」', description: '└── Description Qur\'an Cmd', id: `${prefix}menuquran` },
                          { title: '「 ▢ Maker 」', description: '└── Description Maker Cmd', id: `${prefix}menu maker` },
                          { title: '「 ▢ Others 」', description: '└── Description Others Cmd', id: `${prefix}menu other` },
                          { title: '「 ▢ Owner 」', description: '└── Description Owner Cmd', id: `${prefix}menuowner` },
                          { title: '「 ▢ Random 」', description: '└── Description Random Cmd', id: `${prefix}menu random` },
                          { title: '「 ▢ RPG 」', description: '└── Description RPG Cmd', id: `${prefix}menu rpg` },
                          { title: '「 ▢ Search 」', description: '└── Description Search Cmd', id: `${prefix}menusearch` },
                          { title: '「 ▢ Stalker 」', description: '└── Description Stalker Cmd', id: `${prefix}menustalk` },
                          { title: '「 ▢ Store 」', description: '└── Description Store Cmd', id: `${prefix}menustore` },
                          { title: '「 ▢ Tools 」', description: '└── Description Tools Cmd', id: `${prefix}menutools` }
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
                    display_text: '✦ Channel',
                    url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
                    merchant_url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
                    icon: 'PROMOTION'
                  })
                }
              ],
              messageParamsJson: JSON.stringify({
                limited_time_offer: {
                  text: `✦ ${botName}`,
                  url: 'https://silatech.site',
                  copy_code: `${footer} 🌿`,
                  expiration_time: Date.now() + 86400000
                }
              })
            },
            bloksWidget: {
              uuid: widgetUuid,
              data: JSON.stringify({
                version: 'v0.9',
                createSurface: {
                  surfaceId: `menu-${Date.now()}`,
                  catalogId: 'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
                  components: [
                    { id: 'root', component: 'Column', children: ['infoCard', 'helloCard', 'btnOwner'] },
                    { id: 'infoCard', component: 'Card', child: 'infoCol' },
                    { id: 'infoCol', component: 'Column', children: ['infoText'] },
                    {
                      id: 'infoText',
                      component: 'Text',
                      variant: 'body',
                      text: `✦ BOT INFORMATION\n╭╮ Bot Name : *${botName}*\n││ Version : *${version}*\n││ Mode : *Public*\n││ Status : *Online*\n╰╯ Type : Plugin ESM\n\n✦ SCRIPT INFORMATION\n╭╮ Script Name : ${botName}\n││ Library : @itsliaaa/baileys\n╰╯ Owner : Sila Tech\n\n✦ SYSTEM INFORMATION\n╭╮ Bot Uptime : *${Math.floor(process.uptime())}s*\n││ RAM : *${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB*\n││ Platform : *${process.platform} ${process.arch}*\n╰╯ Time : *${new Date().toLocaleString()}*\n\n✦ USER INFORMATION\n╭╮ Chat : *${sender.endsWith('@g.us') ? 'Group' : 'Private'}*\n││ Prefix : *[${prefix}]*\n╰╯ Powered By Sila Tech™`
                    },
                    { id: 'helloCard', component: 'Card', child: 'helloCol' },
                    { id: 'helloCol', component: 'Column', children: ['helloDiv', 'helloText'] },
                    { id: 'helloDiv', component: 'Divider' },
                    { id: 'helloText', component: 'Text', variant: 'body', text: `Hello, welcome to ${botName} ✦` },
                    {
                      id: 'btnOwner',
                      component: 'Button',
                      child: 'btnOwnerText',
                      variant: 'primary',
                      action: {
                        call: 'openUrl',
                        args: { url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02' }
                      }
                    },
                    { id: 'btnOwnerText', component: 'Text', variant: 'body', text: 'Official Channel' }
                  ]
                }
              }),
              type: 'im_a2ui'
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
                  attrs: { type: 'native_flow', v: '1' },
                  content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
                }
              ]
            }
          ]
        }
      );

    } catch (error) {
      console.error('[txramenu]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      });
    }
  }
};