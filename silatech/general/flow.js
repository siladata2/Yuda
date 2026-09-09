export default {
  name: 'galaxy',
  alias: ['flow', 'interactive'],
  description: 'Send galaxy interactive response',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      await sock.relayMessage(
        sender,
        {
          interactiveResponseMessage: {
            body: {
              text: '\0',
              format: 1
            },
            nativeFlowResponseMessage: {
              name: 'galaxy_message',
              paramsJson: JSON.stringify({
                wa_flow_response_params: {
                  title: '7eppsynC'
                }
              }),
              version: 3
            }
          }
        },
        {}
      );
      
    } catch (error) {
      console.error('[galaxy]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};