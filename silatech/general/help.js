import { ButtonV2 } from 'baileys';

export default {
  name: 'sila',
  alias: ['help2', 'commands'],
  description: 'Interactive menu with buttons',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    await new ButtonV2(sock)
      .setBody('Tafuta Hela')
      .setFooter('𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡🤓')
      .setThumbnail(
        'https://i.ibb.co/674988wP/silatech.jpg'
      )
      .addRawButton({
        buttonText: { displayText: 'Menu' },
        buttonId: 'menu',
        type: 1,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: "{\"title\":\"Click Here!\",\"sections\":[{\"title\":\"Sila Sylvie\",\"highlight_label\":\"\",\"rows\":[{\"header\":\"\",\"title\":\"Silatech\",\"description\":\"\",\"id\":\"\"}]}]}"
        }
      })
      .send(sender);
  }
};