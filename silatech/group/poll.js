import crypto from 'crypto';
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from 'baileys';

async function sendImagePoll(conn, jid, values, pollName = 'Choose your favorite image') {
  const messageSecret = crypto.randomBytes(32);

  const hashOpt = (name, sha) =>
    crypto
      .createHash('sha256')
      .update(
        crypto.createHash('sha256').update(String(name)).digest('hex') +
          (sha ? Buffer.from(sha).toString('base64') : '')
      )
      .digest('hex');

  const images = await Promise.all(
    values.map(async (item, index) => {
      const { imageMessage } = await prepareWAMessageMedia(
        { image: item.image },
        { upload: conn.waUploadToServer }
      );

      if (!imageMessage?.fileSha256)
        throw new Error(`Failed to create imageMessage at index ${index}`);

      return {
        index,
        name: String(item.name),
        imageMessage,
        optionHash: hashOpt(item.name, imageMessage.fileSha256)
      };
    })
  );

  const parent = generateWAMessageFromContent(
    jid,
    {
      pollCreationMessageV3: {
        name: pollName,
        selectableOptionsCount: 1,
        options: images.map(({ name, optionHash }) => ({
          optionName: name,
          optionHash
        })),
        pollContentType: proto.Message.PollContentType.IMAGE
      },
      messageContextInfo: { messageSecret }
    },
    {}
  );

  const parentKey = parent.key;

  await conn.relayMessage(jid, parent.message, {
    messageId: parentKey.id,
    additionalNodes: [
      {
        tag: 'meta',
        attrs: {
          polltype: 'creation',
          contenttype: 'image'
        }
      }
    ]
  });

  for (const { imageMessage } of images) {
    const child = proto.Message.create({
      messageContextInfo: {
        messageAssociation: {
          parentMessageKey: parentKey,
          associationType: proto.MessageAssociation.AssociationType.MEDIA_POLL
        }
      },
      pollCreationOptionImageMessage: {
        message: { imageMessage }
      }
    });

    await conn.relayMessage(jid, child, {
      messageId: crypto.randomUUID(),
      additionalNodes: [
        {
          tag: 'meta',
          attrs: {
            message_association_type: 'media_poll'
          }
        }
      ]
    });
  }
}

export default {
  name: 'poll',
  alias: ['gpoll', 'pollimage', 'imgpoll'],
  description: 'Create image poll in group',
  category: 'group',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    // Check if in group
    if (!sender.endsWith('@g.us')) {
      await sock.sendMessage(sender, {
        text: '✖ This command only works in groups'
      });
      return;
    }

    const botImage = options.BOT_IMAGE || 'https://i.ibb.co/674988wP/silatech.jpg';

    try {
      // Default poll images
      const images = [
        {
          name: 'Image 1',
          image: {
            url: botImage
          }
        },
        {
          name: 'Image 2',
          image: {
            url: 'https://i.ibb.co/674988wP/silatech.jpg'
          }
        }
      ];

      await sendImagePoll(sock, sender, images, 'Vote for your favorite image');

    } catch (error) {
      console.error('[grouppoll]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      });
    }
  }
};