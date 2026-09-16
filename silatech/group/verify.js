export default {
  name: 'verify',
  alias: ['verifyme', 'imnotrobot', 'captcha'],
  description: 'Send verification message to group member',
  category: 'group',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const botImage = options.BOT_IMAGE || 'https://i.ibb.co/674988wP/silatech.jpg';
    
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
      await sock.sendMessage(sender, {
        image: { url: botImage },
        caption: `⚠️ @${targetJid.split('@')[0]} Bot detected! (1/2)\n\n` +
                 `Your messages will be deleted until verified.\n` +
                 `You have 45 seconds.\n` +
                 `To verify that you are not a bot, type the code shown:\n` +
                 `*.imnotrobot <code>*\n\n` +
                 `You have 1 attempt before being kicked.`,
        footer: '© Sila Tech',
        buttons: [
          {
            buttonId: `.imnotrobot ${code}`,
            buttonText: { displayText: 'Verify Me' },
            type: 1
          }
        ],
        headerType: 1,
        contextInfo: {
          mentionedJid: [targetJid]
        }
      });
      
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
