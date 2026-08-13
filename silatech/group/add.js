// silatech/group/add.js
export default {
  name: 'add',
  alias: ['invite', 'addmember'],
  description: 'Add member to group',
  category: 'group',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    if (!msg.key.remoteJid?.endsWith('@g.us')) {
      await sock.sendMessage(msg.key.remoteJid, { 
        text: '❌ This command only works in groups!' 
      });
      return;
    }
    
    if (!args.length) {
      await sock.sendMessage(msg.key.remoteJid, { 
        text: '📝 Usage: !add 2547XXXXXXXX' 
      });
      return;
    }
    
    try {
      const number = args[0].replace(/\D/g, '');
      const jid = `${number}@s.whatsapp.net`;
      
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [jid], 'add');
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `✅ Added +${number} to the group!` 
      });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `❌ Failed to add member: ${error.message}` 
      });
    }
  }
};