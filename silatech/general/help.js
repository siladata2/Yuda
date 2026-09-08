import { ButtonV2 } from '@itsliaaa/baileys';

export default {
  name: 'h',
  alias: ['help', 'commands'],
  description: 'Interactive menu with buttons',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    await new ButtonV2(sock)
      .setBody('Halo dunia')
      .setFooter('Footer Message')
      .setThumbnail(
        'https://cdn.ornzora.eu.cc/4d2905ce-3707-4ec0-998a-68a3d851629f-FIORA.jpg'
      )
      .addRawButton({
        buttonText: { displayText: '📡 Menu' },
        buttonId: 'Nixel',
        type: 1,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: "{\"title\":\"Click Here!\",\"sections\":[{\"title\":\"Fiora Sylvie\",\"highlight_label\":\"\",\"rows\":[{\"header\":\"\",\"title\":\"Nixel\",\"description\":\"\",\"id\":\"\"}]}]}"
        }
      })
      .send(sender);
  }
};