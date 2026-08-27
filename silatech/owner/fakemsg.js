import { delay } from '@itsliaaa/baileys';

export default {
  name: 'fakemsg',
  alias: ['fedit', 'editmsg'],
  description: 'Edit replied message text',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (!msg.message?.extendedTextMessage?.contextInfo?.stanzaId) {
      await sock.sendMessage(sender, { text: '✖ Reply to a message to edit' });
      return;
    }
    
    if (!args.length) {
      await sock.sendMessage(sender, { text: '✖ Provide new text' });
      return;
    }
    
    const stanzaId = msg.message.extendedTextMessage.contextInfo.stanzaId;
    const newText = args.join(' ');
    
    try {
      // Send temporary message
      const tempId = await sock.relayMessage(
        sender,
        {
          extendedTextMessage: {
            text: '',
            contextInfo: {
              isGroupStatus: true,
            },
          },
        },
        {}
      );
      
      // Send protocol message with new text
      const tempId2 = await sock.relayMessage(
        sender,
        {
          protocolMessage: {
            key: {
              jid: sender,
              fromMe: true,
              id: tempId,
            },
            type: 14,
            editedMessage: {
              extendedTextMessage: {
                text: newText,
                contextInfo: {
                  isGroupStatus: false,
                },
              },
            },
          },
        },
        {
          messageId: stanzaId,
        }
      );
      
      await delay(100);
      
      // Delete temporary messages
      await Promise.allSettled([
        sock.sendMessage(sender, {
          delete: {
            remoteJid: sender,
            id: tempId,
            fromMe: true,
          },
        }),
        sock.sendMessage(sender, {
          delete: {
            remoteJid: sender,
            id: tempId2,
            fromMe: true,
          },
        }),
      ]);
      
    } catch (error) {
      console.error('[fakemsg]', error);
      await sock.sendMessage(sender, { text: `✖ ${error?.message || error}` });
    }
  }
};