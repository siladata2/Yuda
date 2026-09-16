export default {
  name: 'menu3',
  alias: ['m3', 'bigmenu', 'allmenu'],
  description: 'Interactive menu with video header and category list',
  category: 'general',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isOwner = options.isOwner ? options.isOwner() : false;
    const botName = options.BOT_NAME || 'SILA TECH BOT';
    const footer = options.FOOTER || 'Created by Sila Tech';

    // Orodha ya makundi (unaweza kuhariri kufuata commands zako halisi)
    const categories = [
      { header: '◈', title: 'absen', description: '4 features', id: `${prefix}menu absen` },
      { header: '🤖', title: 'ai', description: '16 features', id: `${prefix}menu ai` },
      { header: '🎴', title: 'anime', description: '24 features', id: `${prefix}menu anime` },
      { header: '◈', title: 'bug', description: '4 features', id: `${prefix}menu bug` },
      { header: '◈', title: 'business', description: '1 feature', id: `${prefix}menu business` },
      { header: '◈', title: 'canvas', description: '18 features', id: `${prefix}menu canvas` },
      { header: '◈', title: 'career', description: '5 features', id: `${prefix}menu career` },
      { header: '◈', title: 'database', description: '5 features', id: `${prefix}menu database` },
      { header: '🛠️', title: 'downloader', description: '34 features', id: `${prefix}menu downloader` },
      { header: '◈', title: 'education', description: '3 features', id: `${prefix}menu education` },
      { header: '🎮', title: 'fun', description: '27 features', id: `${prefix}menu fun` },
      { header: '🕹️', title: 'game', description: '6 features', id: `${prefix}menu game` },
      { header: '🛡️', title: 'group', description: '41 features', id: `${prefix}menu group` },
      { header: '🖼️', title: 'image', description: '1 feature', id: `${prefix}menu image` },
      { header: '📡', title: 'info', description: '12 features', id: `${prefix}menu info` },
      { header: '◈', title: 'islamic', description: '8 features', id: `${prefix}menu islamic` },
      { header: '◈', title: 'lifestyle', description: '4 features', id: `${prefix}menu lifestyle` },
      { header: '🧿', title: 'main', description: '17 features', id: `${prefix}menu main` },
      { header: '♛', title: 'owner', description: '98 features', id: `${prefix}menu owner` },
      { header: '💎', title: 'premium', description: '3 features', id: `${prefix}menu premium` },
      { header: '💭', title: 'quotes', description: '10 features', id: `${prefix}menu quotes` },
      { header: '⚔️', title: 'rpg', description: '94 features', id: `${prefix}menu rpg` },
      { header: '🔍', title: 'search', description: '42 features', id: `${prefix}menu search` },
      { header: '👥', title: 'stalk', description: '2 features', id: `${prefix}menu stalk` },
      { header: '🎨', title: 'sticker', description: '9 features', id: `${prefix}menu sticker` },
      { header: '◈', title: 'stock', description: '2 features', id: `${prefix}menu stock` },
      { header: '🔩', title: 'tools', description: '63 features', id: `${prefix}menu tools` },
      { header: '💫', title: 'xp', description: '3 features', id: `${prefix}menu xp` }
    ];

    // Build sections
    const section = {
      title: '✦ 28 Categories ✦',
      rows: categories
    };

    try {
      await sock.relayMessage(
        sender,
        {
          interactiveMessage: {
            header: {
              hasMediaAttachment: true,
              videoMessage: {
                url: options.BOT_VIDEO || 'https://mmg.whatsapp.net/v/t62.7161-24/809110648_3347642615444580_1947470951550067238_n.enc?ccb=11-4&oh=01_Q5Aa5gGeBgfABrppvnNt7_Z6Md-kgO-SaDnbph06RahGpg6BKg&oe=6AD194B0&_nc_sid=5e03e0&mms3=true',
                mimetype: 'video/mp4',
                fileSha256: 'tDb9nWz/gQ/M3/xnlXcnLbt5DYmf1qpRtGFSu5tqeLo=',
                fileLength: '5010209',
                seconds: 24,
                mediaKey: 'YHsn/+rn+wgAxrHcj3a3rH8bxkQQuaXLk3aHqOMyMF4=',
                gifPlayback: true,
                fileEncSha256: '8jzwXdz1+VzHp0NoszZP3mvddEXIlFKfmgStWV98fV4=',
                directPath: '/v/t62.7161-24/809110648_3347642615444580_1947470951550067238_n.enc?ccb=11-4&oh=01_Q5Aa5gGeBgfABrppvnNt7_Z6Md-kgO-SaDnbph06RahGpg6BKg&oe=6AD194B0&_nc_sid=5e03e0',
                mediaKeyTimestamp: '1789535320',
                gifAttribution: 'NONE'
              }
            },
            footer: {
              text: `✦ ${botName}\n◉ Prefix: ${prefix}\n◉ Mode: ${options.getBotMode ? options.getBotMode() : 'public'}\n\n✦ ${footer}`
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: '▾ View Categories',
                    sections: [section],
                    icon: 'REVIEW'
                  })
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: '◈ All Commands',
                    id: `${prefix}menu all`,
                    icon: 'DOCUMENT'
                  })
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: '♛ Owner',
                    id: `${prefix}owner`,
                    icon: 'PROMOTION'
                  })
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: '⌘ Official Channel',
                    url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
                    merchant_url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
                    webview_interaction: true,
                    icon: 'IMAGE'
                  })
                }
              ],
              messageParamsJson: JSON.stringify({
                bottom_sheet: {
                  in_thread_buttons_limit: 1,
                  divider_indices: [0, 1, 2, 3],
                  list_title: botName,
                  button_title: 'Open Menu'
                }
              })
            }
          }
        },
        {
          additionalNodes: [
            {
              tag: 'biz',
              attrs: {},
              content: [
                {
                  tag: 'interactive',
                  attrs: { type: 'native_flow', v: '1' },
                  content: [
                    { tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }
                  ]
                }
              ]
            }
          ]
        }
      );
    } catch (error) {
      console.error('[menu3]', error);
      await sock.sendMessage(sender, {
        text: `✦ ${botName}\n◉ Prefix: ${prefix}\n\n▸ ${prefix}help - All commands\n▸ ${prefix}owner - Owner info\n\n✦ ${footer}`
      });
    }
  }
};
