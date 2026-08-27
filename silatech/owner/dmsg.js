import { delay } from '@itsliaaa/baileys';

export default {
  name: 'dmsg',
  alias: ['delete', 'del'],
  description: 'Delete replied message without admin role',
  category: 'owner',
  ownerOnly: true,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (!msg.message?.extendedTextMessage?.contextInfo?.stanzaId) {
      await sock.sendMessage(sender, { text: '✖ Reply to a message to delete' });
      return;
    }
    
    try {
      const chatId = sender;
      const stanzaId = msg.message.extendedTextMessage.contextInfo.stanzaId;
      
      // Send temporary message
      const tempId = await sock.relayMessage(
        chatId,
        {
          groupStatusMessageV2: {
            message: {
              extendedTextMessage: {
                text: '',
                contextInfo: {
                  isGroupStatus: true,
                },
              },
            },
          },
        },
        {}
      );
      
      // Send protocol message
      const tempId2 = await sock.relayMessage(
        chatId,
        {
          protocolMessage: {
            key: {
              jid: chatId,
              fromMe: true,
              id: tempId,
            },
            type: 14,
            editedMessage: {
              extendedTextMessage: {
                text: '\0',
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
      
      // Delete both temporary messages
      await Promise.allSettled([
        sock.sendMessage(chatId, {
          delete: {
            remoteJid: chatId,
            id: tempId,
            fromMe: true,
          },
        }),
        sock.sendMessage(chatId, {
          delete: {
            remoteJid: chatId,
            id: tempId2,
            fromMe: true,
          },
        }),
      ]);
      
    } catch (error) {
      console.error('[dmsg]', error);
      await sock.sendMessage(sender, { text: `✖ ${error?.message || error}` });
    }
  }
};