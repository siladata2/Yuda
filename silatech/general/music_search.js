export default {
  name: 'playsc',
  alias: ['musicsc', 'songsch'],
  description: 'Search music with results',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const botImage = options.BOT_IMAGE || 'https://i.ibb.co/674988wP/silatech.jpg';
    
    if (args.length === 0) {
      await sock.sendMessage(sender, {
        text: `✦ Music Search\n◉ Usage: ${prefix}play [song name]\n◉ Example: ${prefix}play Clandestina`
      });
      return;
    }
    
    const query = args.join(' ');
    
    try {
      // Demo results - replace with actual API
      const results = [
        { title: `1. ${query} - Remix`, duration: '2:27', id: 'result_0' },
        { title: `2. ${query} - Original`, duration: '2:58', id: 'result_1' },
        { title: `3. ${query} - Cover`, duration: '2:57', id: 'result_2' },
        { title: `4. ${query} - TikTok`, duration: '2:11', id: 'result_3' },
        { title: `5. ${query} - Slowed`, duration: '3:24', id: 'result_4' }
      ];
      
      await sock.relayMessage(
        sender,
        {
          interactiveMessage: {
            header: {
              title: " ",
              imageMessage: {
                url: botImage,
                mimetype: "image/jpeg",
                caption: `> Results found for: *${query}*\n> Choose an option:`,
                fileSha256: "57UE/xOX29LrDYtapRFcij90x8geFmq4RliZ4rAvRG0=",
                fileLength: 55061,
                mediaKey: "tq51xZ48VvA2BY9wsGn2zhM0Kqq6Yz40kqF5abnL06w=",
                fileEncSha256: "eRR1HQa4Mqwwrr1RIzCJp77guF8CPlSoOTCsxqA14m0=",
                directPath: "/o1/v/t24/f2/m235/AQOC-w1uXUUfgVdnTKWsic7bdJD-eSWqnTbI4uEl4FM_O4_Q3tcpdZrMbTgfGeBkL0_lv_E8GHMmNMeZ3Zzxanf51V8Hn9B0H2d_9jxt8Q?ccb=9-4&oh=01_Q5Aa5gGeUkvk24lFF5duuGJJNGU1bapFs1CJoi5sDvmYAkEBgg&oe=6AD06DA5&_nc_sid=e6ed6c",
                mediaKeyTimestamp: 1789455984
              },
              hasMediaAttachment: true
            },
            body: {
              text: `> Results found for: *${query}*\n> Choose an option:`
            },
            footer: {
              text: "Select a song to download"
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "",
                  buttonParamsJson: JSON.stringify({})
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    "icon": "PROMOTION",
                    "title": "乂 MUSIC 乂",
                    "sections": [
                      {
                        "title": "乂 RESULTS 乂",
                        "highlight_label": "",
                        "rows": results.map(r => ({
                          "header": "",
                          "title": r.title,
                          "description": `Duration: ${r.duration}`,
                          "id": `playpick:${r.id}`
                        }))
                      }
                    ]
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    "display_text": "乂 LINK 乂",
                    "url": "https://silatech.site",
                    "webview_interaction": false,
                    "icon": "REVIEW"
                  })
                }
              ],
              messageParamsJson: "{\"limited_time_offer\":{\"text\":\"乂 SILA PLAY MUSIC 乂\",\"url\":\"https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02\",\"icon\":\"REVIEW\"}}"
            },
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              expiration: 7776000,
              disappearingMode: {
                initiator: 0
              },
              forwardOrigin: 0
            }
          }
        },
        {
          additionalNodes: [
            {
              tag: "biz",
              attrs: {},
              content: [
                {
                  tag: "interactive",
                  attrs: {
                    type: "native_flow",
                    v: "1"
                  },
                  content: [
                    {
                      tag: "native_flow",
                      attrs: {
                        v: "9",
                        name: "mixed"
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
      console.error('[play]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};
