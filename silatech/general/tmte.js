import { delay, prepareWAMessageMedia } from '@itsliaaa/baileys';

const urls = [
  'https://cdn.ornzora.eu.cc/aed35b3f-baf5-4c2e-9839-1a1188c5c44a-FIORA.jpg',
  'https://cdn.ornzora.eu.cc/4930f428-6661-4c17-a52c-2d48eff2f86d-FIORA.jpg',
  'https://cdn.ornzora.eu.cc/d4443125-d672-4034-972c-04b73969b359-FIORA.jpg',
  'https://cdn.ornzora.eu.cc/59f8c79a-8274-4d61-a200-ea4a279b9e5d-FIORA.jpg',
  'https://cdn.ornzora.eu.cc/090f9baf-aaeb-4c79-8995-b3b541cef444-FIORA.jpg'
];

export default {
  name: 'tmte',
  alias: ['tmte2', 'slideshow'],
  description: 'Display image slideshow with link preview',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const command = args[0]?.toLowerCase() || 'tmte';
    
    const link = 'https://silatech.site';
    const title = '✦ Sila';
    const description = 'Created By Sila';
    const text = '✦ Sila Tech';
    
    try {
      const { key } = await sock.sendMessage(sender, { text: '✦ Loading...' });
      
      if (command === 'tmte' || command === 'tmte2') {
        const medias = await Promise.all(
          urls.map(async url => {
            const { imageMessage } = await prepareWAMessageMedia(
              { image: { url } },
              { upload: sock.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
            );
            return imageMessage;
          })
        );
        
        for (let i = 0; i < 5; i++) {
          for (const image of medias) {
            await sock.sendMessage(
              sender,
              {
                edit: key,
                text: text.includes(link) ? text : `${link}\n${text}`,
                linkPreview: {
                  'matched-text': link,
                  title,
                  description,
                  jpegThumbnail: image.jpegThumbnail,
                  highQualityThumbnail: image
                }
              }
            );
            await delay(2000);
          }
        }
      }
      
    } catch (error) {
      console.error('[tmte]', error);
      await sock.sendMessage(sender, { text: `✖ ${error?.message || error}` });
    }
  }
};