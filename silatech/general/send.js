// silatech/general/send.js
import { prepareWAMessageMedia } from '@itsliaaa/baileys';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'send',
  alias: ['s', 'message', 'sendmsg'],
  description: 'Send different types of messages',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isGroup = sender.endsWith('@g.us');
    
    // Check if there are arguments
    if (args.length === 0) {
      const helpText = `📝 *Send Command Usage*\n\n` +
                       `*1. Text Message:*\n` +
                       `${prefix}send text Hello there!\n\n` +
                       `*2. Text with Link Preview:*\n` +
                       `${prefix}send link https://www.npmjs.com/package/@itsliaaa/baileys\n\n` +
                       `*3. Send to Specific User:*\n` +
                       `${prefix}send to 2547XXXXXXXX Hello!\n\n` +
                       `*4. Send Image with Caption:*\n` +
                       `${prefix}send image [caption] (Reply to an image)\n\n` +
                       `*5. Send Video with Caption:*\n` +
                       `${prefix}send video [caption] (Reply to a video)\n\n` +
                       `📌 *Note:* For image/video, reply to the media message.`;
      
      await sock.sendMessage(sender, { text: helpText });
      return;
    }

    try {
      // Get the target JID
      let targetJid = sender;
      let commandType = args[0].toLowerCase();
      let messageContent = args.slice(1).join(' ');
      
      // Check if sending to specific user
      if (commandType === 'to') {
        if (args.length < 3) {
          await sock.sendMessage(sender, { 
            text: `❌ Usage: ${prefix}send to [number] [message]` 
          });
          return;
        }
        
        const number = args[1].replace(/\D/g, '');
        targetJid = number + '@s.whatsapp.net';
        commandType = args[2].toLowerCase();
        messageContent = args.slice(3).join(' ');
        
        // Check if target is valid
        try {
          const [result] = await sock.onWhatsApp(targetJid);
          if (!result || !result.exists) {
            await sock.sendMessage(sender, { 
              text: `❌ The number ${number} is not registered on WhatsApp.` 
            });
            return;
          }
        } catch (error) {
          await sock.sendMessage(sender, { 
            text: `❌ Could not verify number: ${error.message}` 
          });
          return;
        }
      }
      
      // Handle different message types
      switch (commandType) {
        case 'text':
        case 'msg':
        case 'message':
          if (!messageContent) {
            await sock.sendMessage(sender, { 
              text: `❌ Please provide a message. Usage: ${prefix}send text [your message]` 
            });
            return;
          }
          
          await sock.sendMessage(targetJid, {
            text: messageContent,
            contextInfo: {
              mentionedJid: [sender],
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363313568945338@newsletter',
                newsletterName: 'SILA TECH BOT',
                serverMessageId: Date.now().toString()
              }
            }
          }, { quoted: msg });
          
          await sock.sendMessage(sender, { 
            text: `✅ Message sent successfully!\n📱 To: ${targetJid}\n📝 Message: ${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}` 
          });
          break;
          
        case 'link':
          if (!messageContent) {
            await sock.sendMessage(sender, { 
              text: `❌ Please provide a URL. Usage: ${prefix}send link [url]` 
            });
            return;
          }
          
          // Extract URL from message
          const urlMatch = messageContent.match(/(https?:\/\/[^\s]+)/);
          if (!urlMatch) {
            await sock.sendMessage(sender, { 
              text: `❌ No valid URL found in: ${messageContent}` 
            });
            return;
          }
          
          const url = urlMatch[0];
          const linkText = messageContent.replace(url, '').trim() || '👆🏻 Check it out!';
          
          try {
            // Try to send with link preview
            await sock.sendMessage(targetJid, {
              text: linkText + '\n\n' + url,
              linkPreview: {
                'matched-text': url,
                title: '🔗 Sila Tech Link',
                description: 'Shared via Sila Tech Bot',
                previewType: 0
              }
            }, { quoted: msg });
            
            await sock.sendMessage(sender, { 
              text: `✅ Link sent successfully!\n🔗 URL: ${url}` 
            });
          } catch (error) {
            // Fallback: send as plain text
            await sock.sendMessage(targetJid, {
              text: `📎 *Shared Link:*\n${url}\n\n${linkText}`
            }, { quoted: msg });
            
            await sock.sendMessage(sender, { 
              text: `✅ Link sent (plain text mode)\n🔗 URL: ${url}` 
            });
          }
          break;
          
        case 'image':
        case 'img':
          // Check if replying to an image
          if (msg.message?.imageMessage) {
            const imageMsg = msg.message.imageMessage;
            const caption = messageContent || imageMsg.caption || '📸 Image shared via Sila Tech Bot';
            
            // Get the image
            const media = await sock.downloadMediaMessage(msg);
            
            await sock.sendMessage(targetJid, {
              image: media,
              caption: caption,
              contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
              }
            }, { quoted: msg });
            
            await sock.sendMessage(sender, { 
              text: `✅ Image sent successfully!\n📱 To: ${targetJid}\n📝 Caption: ${caption.substring(0, 30)}${caption.length > 30 ? '...' : ''}` 
            });
          } else {
            await sock.sendMessage(sender, { 
              text: `❌ Please reply to an image message.\nUsage: ${prefix}send image [caption] (reply to an image)` 
            });
          }
          break;
          
        case 'video':
        case 'vid':
          // Check if replying to a video
          if (msg.message?.videoMessage) {
            const videoMsg = msg.message.videoMessage;
            const caption = messageContent || videoMsg.caption || '🎬 Video shared via Sila Tech Bot';
            
            // Get the video
            const media = await sock.downloadMediaMessage(msg);
            
            await sock.sendMessage(targetJid, {
              video: media,
              caption: caption,
              contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
              }
            }, { quoted: msg });
            
            await sock.sendMessage(sender, { 
              text: `✅ Video sent successfully!\n📱 To: ${targetJid}\n📝 Caption: ${caption.substring(0, 30)}${caption.length > 30 ? '...' : ''}` 
            });
          } else {
            await sock.sendMessage(sender, { 
              text: `❌ Please reply to a video message.\nUsage: ${prefix}send video [caption] (reply to a video)` 
            });
          }
          break;
          
        case 'withpreview':
        case 'preview':
          // Send with large link preview and favicon
          const previewUrl = args[1] || '';
          if (!previewUrl || !previewUrl.match(/(https?:\/\/[^\s]+)/)) {
            await sock.sendMessage(sender, { 
              text: `❌ Please provide a valid URL.\nUsage: ${prefix}send preview [url] [caption]` 
            });
            return;
          }
          
          const previewCaption = args.slice(2).join(' ') || '👆🏻 Check it out!';
          
          try {
            // Prepare high quality thumbnail (using default image if available)
            let highQualityThumb;
            const defaultImagePath = path.join(__dirname, '../../assets/logo.jpg');
            
            if (fs.existsSync(defaultImagePath)) {
              try {
                const { imageMessage } = await prepareWAMessageMedia({
                  image: { url: defaultImagePath }
                }, {
                  upload: sock.waUploadToServer,
                  mediaTypeOverride: 'thumbnail-link'
                });
                imageMessage.height = 720;
                imageMessage.width = 480;
                highQualityThumb = imageMessage;
              } catch (e) {
                // Use simple preview if image not available
                highQualityThumb = undefined;
              }
            }
            
            await sock.sendMessage(targetJid, {
              text: previewCaption + '\n\n' + previewUrl,
              linkPreview: {
                'matched-text': previewUrl,
                title: '🌟 Sila Tech Bot',
                description: 'Shared via WhatsApp Bot by Sila Tech',
                previewType: 0,
                highQualityThumbnail: highQualityThumb,
                linkPreviewMetadata: {
                  linkMediaDuration: 0,
                  socialMediaPostType: 0
                }
              }
            }, { quoted: msg });
            
            await sock.sendMessage(sender, { 
              text: `✅ Preview sent successfully!\n🔗 URL: ${previewUrl}` 
            });
          } catch (error) {
            await sock.sendMessage(sender, { 
              text: `❌ Failed to send preview: ${error.message}` 
            });
          }
          break;
          
        default:
          // If commandType is not recognized, send as text
          if (args.length > 0) {
            const fullMessage = args.join(' ');
            await sock.sendMessage(targetJid, {
              text: fullMessage,
              contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
              }
            }, { quoted: msg });
            
            await sock.sendMessage(sender, { 
              text: `✅ Message sent successfully!\n📱 To: ${targetJid}` 
            });
          } else {
            await sock.sendMessage(sender, { 
              text: `❌ Unknown command. Type ${prefix}send for help.` 
            });
          }
      }
      
    } catch (error) {
      console.error('Send command error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ Error sending message: ${error.message}` 
      });
    }
  }
};