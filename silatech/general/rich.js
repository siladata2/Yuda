import { AIRich } from 'baileys';

export default {
  name: 'rich',
  alias: ['aiadv', 'richadv', 'aireplyadv'],
  description: 'Send advanced AI rich response',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      // Build rich response
      await new AIRich(sock)
        .addText('✦ Welcome to Sila Tech Bot\n\nThis is an advanced AI rich response with multiple features:')
        .addCode(`import { AIRich } from 'baileys';\n\nconst bot = new AIRich(sock)\n  .addText('Hello')\n  .send(m.chat);`, 'javascript')
        .addTable([
          ['Feature', 'Status', 'Version'],
          ['Text', '✅', 'v1.0'],
          ['Code', '✅', 'v1.0'],
          ['Image', '✅', 'v1.0'],
          ['Suggest', '✅', 'v1.0']
        ])
        .addImage('https://i.ibb.co/674988wP/silatech.jpg')
        .addReels([
          {
            username: 'Sila Tech',
            thumbnail: 'https://i.ibb.co/674988wP/silatech.jpg',
            url: 'https://silatech.site',
            title: 'Sila Tech Channel'
          }
        ])
        .addPost({
          title: 'Sila Tech Bot',
          thumbnail: 'https://i.ibb.co/674988wP/silatech.jpg',
          url: 'https://silatech.site',
          caption: 'WhatsApp Bot Framework',
          likes: 100,
          comments: 25,
          shares: 50
        })
        .addSuggest([
          `${prefix}help`,
          `${prefix}menu`,
          `${prefix}stats`,
          `${prefix}ping`
        ])
        .addTip('✦ Created by Sila Tech')
        .setFooter('Powered by Sila Tech')
        .send(sender);
        
    } catch (error) {
      console.error('[airichadv]', error);
      
      // Fallback to text
      const txt = `✦ AI Rich Response\n\n` +
                  `◉ Welcome to Sila Tech Bot\n` +
                  `◉ Code: import { AIRich } from 'baileys'\n\n` +
                  `▸ Features: Text, Code, Image, Suggestions\n\n` +
                  `▸ Suggestions:\n` +
                  `  ${prefix}help\n` +
                  `  ${prefix}menu\n` +
                  `  ${prefix}stats\n` +
                  `  ${prefix}ping\n\n` +
                  `✦ Created by Sila Tech`;
      
      await sock.sendMessage(sender, { text: txt });
    }
  }
};