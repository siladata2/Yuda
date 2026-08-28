import { downloadContentFromMessage } from '@itsliaaa/baileys';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'dlstatus',
  alias: ['downloadstatus', 'statusdl', 'save status'],
  description: 'Download WhatsApp status',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      // Check if replying to a status
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      if (!quotedMsg) {
        await sock.sendMessage(sender, {
          text: `✦ Download Status\n\n◉ Reply to a status message\n◉ Usage: ${prefix}dlstatus`
        });
        return;
      }
      
      // Check message types
      const isImage = quotedMsg.imageMessage;
      const isVideo = quotedMsg.videoMessage;
      const isAudio = quotedMsg.audioMessage;
      
      if (!isImage && !isVideo && !isAudio) {
        await sock.sendMessage(sender, {
          text: '✖ Not a status message'
        });
        return;
      }
      
      let mediaMessage = isImage || isVideo || isAudio;
      let mediaType = isImage ? 'image' : isVideo ? 'video' : 'audio';
      let caption = isImage?.caption || isVideo?.caption || '';
      
      // Send loading
      await sock.sendMessage(sender, { text: `✦ Downloading ${mediaType}...` });
      
      // Download media
      const stream = await downloadContentFromMessage(mediaMessage, mediaType);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      
      // Generate filename
      const timestamp = Date.now();
      const ext = isImage ? 'jpg' : isVideo ? 'mp4' : 'mp3';
      const filename = `status_${timestamp}.${ext}`;
      
      // Send based on type
      if (isImage) {
        await sock.sendMessage(sender, {
          image: buffer,
          caption: caption || '✦ Status Image\n◉ Downloaded by Sila Tech Bot'
        });
      } else if (isVideo) {
        await sock.sendMessage(sender, {
          video: buffer,
          caption: caption || '✦ Status Video\n◉ Downloaded by Sila Tech Bot'
        });
      } else if (isAudio) {
        await sock.sendMessage(sender, {
          audio: buffer,
          mimetype: 'audio/mpeg'
        });
      }
      
    } catch (error) {
      console.error('[dlstatus]', error);
      await sock.sendMessage(sender, {
        text: `✖ Failed to download status: ${error?.message || error}`
      });
    }
  }
};