export default {
  name: 'expired',
  alias: ['expiredmsg', 'expire'],
  description: 'Send expired message notification',
  category: 'tools',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isGroup = sender.endsWith('@g.us');
    const botImage = options.BOT_IMAGE || 'https://i.ibb.co/674988wP/silatech.jpg';
    
    try {
      await sock.relayMessage(
        sender,
        {
          interactiveMessage: {
            header: {
              title: "Sila Tech",
              imageMessage: {
                url: botImage,
                mimetype: "image/jpeg",
                caption: "Sila Tech",
                fileSha256: "lbtAAGP25uj0BvMABva/Y13H8AK74CWCsoOQ19FEUEM=",
                fileLength: 43482,
                height: 736,
                width: 736,
                mediaKey: "i62LxryPqf7tMaJ0N7vdXJf+SXFcqTv8/L5dqjTwIOo=",
                fileEncSha256: "BHoVJmH1+a5lmcFhe8AGzOMKcMjhMLKqc7o1aNRP5kQ=",
                directPath: "/o1/v/t24/f2/m233/AQOY0BMV8rHqTAeVFknBIs9VZ6MzdkAvCIbWHvBWqfq28lDEXmDGKzecBPO6HxvIg2YQXIc2iyI2jEmweLN2F9TPPjSHWVbRmboW-6ouAg?ccb=9-4&oh=01_Q5Aa5QEU5gJHz1nRUI86his_JTRAi60qKMEswgjMDzQCC1rtBQ&oe=6ABCB382&_nc_sid=e6ed6c",
                mediaKeyTimestamp: 1788172406,
                jpegThumbnail: "/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAgACADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwUGBP/EACgQAAIBBAAEBQUAAAAAAAAAAAECAwAEBRESISIxBhMjQWEUcXKBsf/EABcBAAMBAAAAAAAAAAAAAAAAAAABBAL/xAAcEQACAgIDAAAAAAAAAAAAAAAAAQIRAxIhMkH/2gAMAwEAAhEDEQA/ANXhnf0Y4SN7PcUxkyPkzFJ42RAOTFe5+KD4UVVxYY63xt3+9N7i1hmGpEV1HMA75GoJyWzsTI/NOHzDFSSgt1K/GyTUzOfTH4j+VV5a1kfK3DRoBGIkVW3pSdHtUrexvD6cg0wAquHVDRaeHr22gxoSRnaXjbojUsdfqiZXI3EaAiJ4Uc9IY9R17nVTlpmp8epiSNZEJ2N7GjRzkTfRh7mRtgnUaHQFCxxT29CuRVnMpO7LCsr7C9Tb5mss0z3Nnb8W3l57PvrfLdGyNi9zdeZBwjiHNSe1LyXiA4SVPY1sZ//Z"
              },
              hasMediaAttachment: true
            },
            body: {
              text: "> *乂 This list has expired. Please search again with play. 乂*"
            },
            footer: {
              text: "Powered by Sila Tech"
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "order_status",
                  buttonParamsJson: JSON.stringify({
                    "reference_id": "SilaTech",
                    "order": {
                      "subtotal": {
                        "value": 0,
                        "offset": 100
                      },
                      "tax": {
                        "value": 0,
                        "offset": 100
                      },
                      "currency": "TZS",
                      "country": "TZ"
                    }
                  })
                }
              ],
              messageParamsJson: ""
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
      console.error('[expired]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};
