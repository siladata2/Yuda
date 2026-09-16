export default {
  name: 'imnotrobot',
  alias: ['verifycode', 'robotcheck'],
  description: 'Verify yourself as human',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const userId = msg.key.participant || sender;
    
    if (!global.verificationCodes) global.verificationCodes = {};
    
    const verification = global.verificationCodes[userId];
    
    if (!verification) {
      await sock.sendMessage(sender, { 
        text: '✖ No verification pending' 
      });
      return;
    }
    
    if (Date.now() > verification.expires) {
      delete global.verificationCodes[userId];
      await sock.sendMessage(sender, { 
        text: '✖ Verification expired' 
      });
      return;
    }
    
    const inputCode = args[0]?.toUpperCase();
    
    if (inputCode === verification.code) {
      delete global.verificationCodes[userId];
      await sock.sendMessage(sender, {
        text: `✦ Verified successfully!\n◉ Welcome human!`,
        mentions: [userId]
      });
    } else {
      verification.attempts--;
      
      if (verification.attempts <= 0) {
        delete global.verificationCodes[userId];
        await sock.sendMessage(sender, {
          text: `✖ Verification failed!\n◉ You have been kicked`,
          mentions: [userId]
        });
      } else {
        await sock.sendMessage(sender, {
          text: `✖ Wrong code!\n◉ Attempts left: ${verification.attempts}`,
          mentions: [userId]
        });
      }
    }
  }
};
