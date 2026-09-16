import { generateWAMessageContent } from 'baileys';

const hex_to_argb = (hex) => {
  if (!hex) return undefined;
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return ((0xFF << 24) | (r << 16) | (g << 8) | b) >>> 0;
};

async function groupStatus(conn, jid, content) {
  const { backgroundColor, font } = content;
  delete content.backgroundColor;
  delete content.font;

  const inside = await generateWAMessageContent(content, {
    upload: conn.waUploadToServer
  });

  const messageType = Object.keys(inside)[0];

  const groupStatusContext = {
    featureEligibilities: {
      canReceiveMultiReact: true
    },
    statusSourceType: 4,
    statusAttributions: [
      { type: 10 }
    ],
    isGroupStatus: true,
    statusAudienceMetadata: {
      audienceType: 1
    }
  };

  inside[messageType].contextInfo = {
    ...(inside[messageType].contextInfo || {}),
    ...groupStatusContext
  };

  if (messageType === 'extendedTextMessage') {
    if (backgroundColor) inside[messageType].backgroundArgb = backgroundColor;
    inside[messageType].textArgb = 4294967295;
    inside[messageType].font = font || 5;
    inside[messageType].previewType = 0;
    inside[messageType].inviteLinkGroupTypeV2 = 0;
  }

  await conn.relayMessage(jid, inside, {});
  return true;
}

export default {
  name: 'swgc',
  alias: ['groupstatus', 'statusgroup', 'gs'],
  description: 'Upload media or text to group status',
  category: 'group',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    // Get quoted message
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const mime = quoted?.imageMessage ? 'image' : 
                 quoted?.videoMessage ? 'video' : 
                 quoted?.audioMessage ? 'audio' : '';
    
    let caption = '';
    if (quoted?.imageMessage?.caption) caption = quoted.imageMessage.caption;
    else if (quoted?.videoMessage?.caption) caption = quoted.videoMessage.caption;
    else if (quoted?.conversation) caption = quoted.conversation;
    else if (quoted?.extendedTextMessage?.text) caption = quoted.extendedTextMessage.text;
    
    let targetJid = sender;
    
    // Check if args contains group JID
    if (args.length > 0) {
      const input = args.join(' ').trim();
      if (input.endsWith('@g.us')) {
        targetJid = input;
      } else {
        caption = input;
      }
    }
    
    if (!targetJid.endsWith('@g.us')) {
      await sock.sendMessage(sender, {
        text: `✖ This command must be used in a group or provide a group ID.\n\n▸ Format:\n◉ ${prefix}swgc → upload to this group\n◉ ${prefix}swgc 1234xxx@g.us → upload to another group`
      });
      return;
    }
    
    // Verify group access
    if (targetJid !== sender) {
      const groupMetadata = await sock.groupMetadata(targetJid).catch(() => null);
      if (!groupMetadata) {
        await sock.sendMessage(sender, {
          text: '✖ Bot is not in that group or invalid group ID!'
        });
        return;
      }
    }
    
    try {
      let payload = {};
      
      if (mime === 'image') {
        // Download quoted image
        const buffer = await sock.downloadMediaMessage({
          message: { imageMessage: quoted.imageMessage }
        });
        payload = {
          image: buffer,
          caption
        };
      } else if (mime === 'video') {
        // Download quoted video
        const buffer = await sock.downloadMediaMessage({
          message: { videoMessage: quoted.videoMessage }
        });
        payload = {
          video: buffer,
          caption
        };
      } else if (mime === 'audio') {
        // Download quoted audio
        const buffer = await sock.downloadMediaMessage({
          message: { audioMessage: quoted.audioMessage }
        });
        payload = {
          audio: buffer,
          mimetype: 'audio/mp4'
        };
      } else if (caption) {
        payload = {
          text: caption,
          backgroundColor: hex_to_argb('#1B5E20'),
          font: 5
        };
      } else {
        await sock.sendMessage(sender, {
          text: `✖ Reply to media or type text to upload as status.\n\n▸ Format:\n◉ ${prefix}swgc → upload to this group\n◉ ${prefix}swgc 1234xxx@g.us → upload to another group`
        });
        return;
      }
      
      await groupStatus(sock, targetJid, payload);
      
      if (targetJid === sender) {
        await sock.sendMessage(sender, {
          text: '✦ Successfully uploaded to group status.'
        });
      } else {
        await sock.sendMessage(sender, {
          text: `✦ Successfully uploaded to ${targetJid}`
        });
      }
      
    } catch (error) {
      console.error('[swgc]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      });
    }
  }
};