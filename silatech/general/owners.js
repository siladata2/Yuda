import { randomUUID } from 'node:crypto';

export default {
  name: 'owner2',
  alias: ['botinfo', 'richowner', 'aiowner'],
  description: 'Show owner info with AI rich response',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const botName = options.BOT_NAME || 'SILA TECH BOT';
    const ownerNumber = options.config?.getSetting ? options.config.getSetting('OWNER_NUMBER') : '255637351031';
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const now = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' });

    try {
      // Build rich response sections
      const sections = [
        {
          view_model: {
            primitive: {
              text: `✦ *BOT INFORMATION*\n\n` +
                    `◉ Bot Name: ${botName}\n` +
                    `◉ Version: 1.0.0\n` +
                    `◉ Mode: Public\n` +
                    `◉ Status: ${sender.endsWith('@g.us') ? 'Group Chat' : 'Private Chat'}\n` +
                    `◉ Creator: @${ownerNumber}\n` +
                    `◉ Type: Plugin ESM`,
              __typename: 'GenAIMarkdownTextUXPrimitive'
            },
            __typename: 'GenAISingleLayoutViewModel'
          }
        },
        {
          view_model: {
            primitive: {
              text: `✦ *SCRIPT INFORMATION*\n\n` +
                    `◉ Script Name: Sila-MD\n` +
                    `◉ Owner: Sila Tech\n` +
                    `◉ Library: @itsliaaa/baileys\n` +
                    `◉ Channel: silatech.site`,
              __typename: 'GenAIMarkdownTextUXPrimitive'
            },
            __typename: 'GenAISingleLayoutViewModel'
          }
        },
        {
          view_model: {
            primitive: {
              text: `✦ *SYSTEM INFORMATION*\n\n` +
                    `◉ Bot Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                    `◉ Platform: ${process.platform} ${process.arch}\n` +
                    `◉ Node: ${process.version}\n` +
                    `◉ Time: ${now}`,
              __typename: 'GenAIMarkdownTextUXPrimitive'
            },
            __typename: 'GenAISingleLayoutViewModel'
          }
        },
        {
          view_model: {
            primitive: {
              text: `✦ *USER INFORMATION*\n\n` +
                    `◉ User: @${sender.split('@')[0]}\n` +
                    `◉ Cooperation: Sila Tech™\n` +
                    `◉ Chat: ${sender.endsWith('@g.us') ? 'Group' : 'Private'}\n` +
                    `◉ Prefix: [${prefix}]`,
              __typename: 'GenAIMarkdownTextUXPrimitive'
            },
            __typename: 'GenAISingleLayoutViewModel'
          }
        },
        {
          view_model: {
            primitives: [
              {
                __typename: 'GenAIFooterActionPrimitive',
                cta_text: '✦ Contact Owner',
                cta_type: 'OPEN_URL',
                cta_url: `https://wa.me/${ownerNumber}`
              },
              {
                __typename: 'GenAIFooterActionPrimitive',
                cta_text: '✦ WhatsApp Channel',
                cta_type: 'OPEN_URL',
                cta_url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02'
              }
            ],
            __typename: 'GenAIHScrollLayoutViewModel'
          }
        }
      ];

      await sock.relayMessage(
        sender,
        {
          botForwardedMessage: {
            message: {
              richResponseMessage: {
                messageType: 1,
                submessages: [
                  {
                    messageType: 2,
                    messageText: `> Owner Information - ${botName}`
                  }
                ],
                unifiedResponse: {
                  data: Buffer.from(JSON.stringify({
                    response_id: randomUUID(),
                    sections
                  })).toString('base64')
                },
                contextInfo: {
                  forwardingScore: 1,
                  isForwarded: true,
                  forwardedAiBotMessageInfo: {
                    botJid: '867051314767696@bot'
                  },
                  forwardOrigin: 4
                }
              }
            }
          }
        },
        {}
      );

    } catch (error) {
      console.error('[owner2]', error);
      await sock.sendMessage(sender, {
        text: `✦ Owner Information\n\n◉ Bot: ${botName}\n◉ Owner: Sila Tech\n◉ WhatsApp: +${ownerNumber}\n◉ GitHub: Sila-Md\n◉ Channel: silatech.site`
      });
    }
  }
};