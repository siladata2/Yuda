import axios from 'axios';
import { randomUUID } from 'crypto';

export default {
  name: 'gitclone',
  alias: ['git', 'clonegit', 'github'],
  description: 'Download GitHub repo as ZIP',
  category: 'tools',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    // Get text from args or quoted message
    let text = '';
    if (msg.message?.extendedTextMessage?.text) {
      text = msg.message.extendedTextMessage.text;
    } else if (args.length) {
      text = args.join(' ');
    }
    
    if (!text.trim()) {
      await sock.sendMessage(sender, {
        text: `✦ Git Clone\n◉ Usage: ${prefix}gitclone user/repo\n◉ Example: ${prefix}gitclone Sila-Md/Sila-Md`
      });
      return;
    }
    
    // Extract user/repo
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9][a-zA-Z0-9-]{0,38})\/([a-zA-Z0-9._-]{1,100})(?:\.git)?/i;
    const repoRegex = /([a-zA-Z0-9][a-zA-Z0-9-]{0,38})\/([a-zA-Z0-9._-]{1,100})/i;
    
    let match = text.match(urlRegex) || text.match(repoRegex);
    
    if (!match) {
      await sock.sendMessage(sender, {
        text: `✖ Invalid repo format\n◉ Use: user/repo\n◉ Example: Sila-Md/Sila-Md`
      });
      return;
    }
    
    let [, user, repo] = match;
    repo = repo.split(/[?#@]/)[0].replace(/\.git$/i, '').trim();
    
    if (!user || !repo) {
      await sock.sendMessage(sender, { text: '✖ Invalid username or repo' });
      return;
    }
    
    const zipUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;
    const repoUrl = `https://github.com/${user}/${repo}`;
    
    try {
      // Check if repo exists
      await axios.head(zipUrl, { 
        headers: { 'User-Agent': 'Mozilla/5.0' } 
      });
      
      // Send rich response with file
      const responseId = randomUUID();
      
      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: "✦ GitHub Downloader",
            richResponseSourcesMetadata: {}
          }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [
                    {
                      "view_model": {
                        "primitive": {
                          "text": `✦ GitHub Repository\n\n◉ Repo: ${user}/${repo}\n◉ URL: ${repoUrl}\n◉ Downloading ZIP...`,
                          "__typename": "GenAIMarkdownTextUXPrimitive"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "preview_image": {
                            "mime_type": "image/jpeg",
                            "url": `https://opengraph.githubassets.com/0/${user}/${repo}`
                          },
                          "full_image": {
                            "mime_type": "image/jpeg",
                            "url": `https://opengraph.githubassets.com/0/${user}/${repo}`
                          },
                          "__typename": "GenAIImagePrimitive"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    },
                    {
                      "view_model": {
                        "primitive": {
                          "cta_text": "✦ View on GitHub",
                          "cta_type": "OPEN_URL",
                          "cta_url": repoUrl,
                          "__typename": "GenAIFooterActionPrimitive"
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    }
                  ]
                })).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: "0@bot"
                },
                forwardOrigin: 4
              }
            }
          }
        }
      };
      
      // Send rich message first
      await sock.relayMessage(sender, content, {});
      
      // Send the file
      await sock.sendMessage(sender, {
        document: { url: zipUrl },
        fileName: `${repo}.zip`,
        mimetype: 'application/zip',
        caption: `✦ ${user}/${repo}\n◉ Size: Downloading...\n◉ ${repoUrl}`
      }, { quoted: msg });
      
    } catch (error) {
      const msg = error.response?.status === 404
        ? '✖ Repository not found or private'
        : `✖ Failed: ${error.message}`;
      
      await sock.sendMessage(sender, { text: msg });
      console.error('[gitclone]', error);
    }
  }
};