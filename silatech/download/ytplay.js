import { randomUUID } from 'node:crypto';

/* ================= MAIN ================= */
async function YouTubeplay(url) {
  try {
    const response = await fetch(`https://api.silatech.site/api/downloader/download-youtube5?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!data || !data.status) {
      return { success: false, message: data?.message || 'Failed to fetch video' };
    }

    // Get the video info from response
    const result = data.result || data.data || data;

    return {
      success: true,
      result: {
        title: result.title || 'YouTube Video',
        channel: result.channel || result.author || 'YouTube',
        duration: result.duration || '',
        thumbnail: result.thumbnail || result.thumb || '',
        audio: result.audio || result.audioUrl || result.mp3 || '',
        video: result.video || result.videoUrl || result.mp4 || '',
        quality: result.quality || 'HD',
        views: result.views || '0',
        likes: result.likes || '0',
        description: result.description || ''
      }
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export default {
  name: 'ytplay',
  alias: ['ytp', 'playyt', 'youtube', 'ytdl'],
  description: 'Download YouTube audio/video',
  category: 'downlod',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const query = args.join(' ').trim();

    if (!query) {
      await sock.sendMessage(sender, {
        text: `✦ YouTube Downloader\n◉ Usage: ${prefix}ytplay [url]\n◉ Example: ${prefix}ytplay https://youtu.be/xxxxx`
      });
      return;
    }

    await sock.sendMessage(sender, {
      text: '✦ Processing, please wait...'
    });

    try {
      const result = await YouTubeplay(query);

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to download');
      }

      const d = result.result;

      // Build info text
      let infoText = `✦ *YouTube Video*\n\n`;
      infoText += `◉ Title: ${d.title}\n`;
      infoText += `◉ Channel: ${d.channel}\n`;
      if (d.duration) infoText += `◉ Duration: ${d.duration}\n`;
      if (d.views) infoText += `◉ Views: ${d.views}\n`;
      if (d.likes) infoText += `◉ Likes: ${d.likes}\n`;
      infoText += `◉ Quality: ${d.quality}\n`;

      // Send info with thumbnail
      await sock.sendMessage(sender, {
        image: { url: d.thumbnail },
        caption: infoText,
        footer: '✦ Sila Tech',
        buttons: [
          {
            buttonId: 'audio_dl',
            buttonText: { displayText: '🎵 Audio (MP3)' },
            type: 1
          },
          {
            buttonId: 'video_dl',
            buttonText: { displayText: '🎬 Video (MP4)' },
            type: 1
          }
        ],
        headerType: 1,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true
        }
      }, { quoted: msg });

      // Send audio if available
      if (d.audio) {
        try {
          await sock.sendMessage(sender, {
            audio: { url: d.audio },
            mimetype: 'audio/mpeg',
            fileName: `${d.title}.mp3`,
            ptt: false
          }, { quoted: msg });
        } catch (audioError) {
          console.error('[ytplay audio]', audioError);
          await sock.sendMessage(sender, {
            text: `✖ Failed to send audio: ${audioError.message}`
          });
        }
      }

      // Send video if available
      if (d.video) {
        try {
          await sock.sendMessage(sender, {
            video: { url: d.video },
            mimetype: 'video/mp4',
            fileName: `${d.title}.mp4`,
            caption: `🎬 ${d.title}`
          }, { quoted: msg });
        } catch (videoError) {
          console.error('[ytplay video]', videoError);
          await sock.sendMessage(sender, {
            text: `✖ Failed to send video: ${videoError.message}`
          });
        }
      }

    } catch (error) {
      console.error('[ytplay]', error);
      await sock.sendMessage(sender, {
        text: `✖ Failed to download YouTube.\n◉ Error: ${error?.message || error}`
      });
    }
  }
};