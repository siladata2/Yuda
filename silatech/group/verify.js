export default {
  name: 'verify',
  alias: ['verifyme', 'imnotrobot', 'captcha'],
  description: 'Send verification message to group member',
  category: 'group',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (!sender.endsWith('@g.us')) {
      await sock.sendMessage(sender, { text: '✖ This command only works in groups' });
      return;
    }
    
    // Get target user
    let targetJid = '';
    
    // Check if replying to someone
    if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
      targetJid = msg.message.extendedTextMessage.contextInfo.participant;
    } else if (args[0]) {
      const number = args[0].replace(/\D/g, '');
      targetJid = `${number}@s.whatsapp.net`;
    } else {
      await sock.sendMessage(sender, {
        text: `✦ Verification\n◉ Reply to a user or use: ${prefix}verify [number]`
      });
      return;
    }
    
    // Generate random code
    const code = generateCode(6);
    
    try {
      await sock.relayMessage(
        sender,
        {
          interactiveMessage: {
            header: {
              title: "",
              subtitle: "",
              imageMessage: {
                url: "https://mmg.whatsapp.net/o1/v/t24/f2/m231/AQPpMYmi88ZoRS9dF5vRvMMK_pQkwScg0bUMRlzDrTtgH108IEQuJMg1DFB4P8xaY6jCeKy4iKsi7a1n0wzQMkFMLnZn_PYiR5YMNbPhFg?ccb=9-4&oh=01_Q5Aa5gH60KxQ9frfojQ5btgBgzcyc13iDsJCIYb4AxSTEOvEfA&oe=6AD1EEE2&_nc_sid=e6ed6c&mms3=true",
                mimetype: "image/jpeg",
                fileSha256: "GLVAKFZ2jpjG423QxaVhmWovQ/goeqVWd/rH9RESzvI=",
                fileLength: 38188,
                height: 120,
                width: 300,
                mediaKey: "Q4fzpYbeuRvMe4LlWZBcB/Mnrqd0yLyrMMYG7e3360A=",
                fileEncSha256: "EXnjoLNiGGKFLAaNus93U5WxCQdZVxOlad6Q8dveXf8=",
                directPath: "/o1/v/t24/f2/m231/AQPpMYmi88ZoRS9dF5vRvMMK_pQkwScg0bUMRlzDrTtgH108IEQuJMg1DFB4P8xaY6jCeKy4iKsi7a1n0wzQMkFMLnZn_PYiR5YMNbPhFg?ccb=9-4&oh=01_Q5Aa5gH60KxQ9frfojQ5btgBgzcyc13iDsJCIYb4AxSTEOvEfA&oe=6AD1EEE2&_nc_sid=e6ed6c",
                mediaKeyTimestamp: 1789552275,
                jpegThumbnail: "/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANACADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQMEBv/EACQQAAICAQIFBQAAAAAAAAAAAAECAxEABBIFITFBcRNRUmGh/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAEhIv/aAAwDAQACEQMRAD8A2cuuSF2WRGpApZgRQ3GhhTXwNCsrMY1Zgo3iiT9e+Nl00MxBljV6+QvA+mheMRtGpQdAe2a5TUY4hIsknqIDGGIUjl3IHPwMph1kczBUDAkEjcKujR/cdsW+48GsAiQMWA5nqcWw1//Z"
              },
              hasMediaAttachment: true
            },
            body: {
              text: `⚠️ @${targetJid.split('@')[0]} Bot detected! (1/2)\n\nPesan anda akan dihapus sampai terverifikasi.\nWaktu anda 45 detik.\nUntuk memverifikasi bahwa anda bukan bot, silahkan ketik kode pada gambar:\n*.imnotrobot <kode>*\n\nAnda memiliki 1 kesempatan sebelum dikick.`
            },
            footer: {
              text: "© Sila Tech"
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    "display_text": "Verify Me",
                    "id": `.imnotrobot ${code}`
                  })
                }
              ],
              messageParamsJson: "{}"
            },
            contextInfo: {
              mentionedJid: [targetJid]
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
      
      // Save verification code
      if (!global.verificationCodes) global.verificationCodes = {};
      global.verificationCodes[targetJid] = {
        code: code,
        expires: Date.now() + 45000,
        attempts: 1
      };
      
      await sock.sendMessage(sender, {
        text: `✦ Verification sent to @${targetJid.split('@')[0]}\n◉ Code: ${code}\n◉ Expires: 45s`,
        mentions: [targetJid]
      });
      
    } catch (error) {
      console.error('[verify]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};

function generateCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
