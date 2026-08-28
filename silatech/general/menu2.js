import { randomUUID } from 'crypto';

export default {
  name: 'menu2',
  alias: ['s2', 'ss2', 'm2'],
  description: 'Display Sila menu with all commands',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const commands = options.commands || new Map();
    
    try {
      const responseId = randomUUID();
      
      // Group commands by category
      const categories = new Map();
      for (const [name, cmd] of commands) {
        if (!categories.has(cmd.category)) {
          categories.set(cmd.category, []);
        }
        categories.get(cmd.category).push({ name, ...cmd });
      }
      
      // Build sections for menu
      const sections = [];
      
      // Add header
      sections.push({
        "view_model": {
          "primitive": {
            "__typename": "FOATextPrimitive",
            "text": "let me know~"
          },
          "__typename": "GenAISingleLayoutViewModel"
        }
      });
      
      sections.push({
        "view_model": {
          "primitive": {
            "text": `im here~\nWelcome to Sila Menu\nPrefix: ${prefix}\nCommands: ${commands.size}`,
            "__typename": "GenAIMarkdownTextUXPrimitive"
          },
          "__typename": "GenAISingleLayoutViewModel"
        }
      });
      
      // Add image
      sections.push({
        "view_model": {
          "primitive": {
            "__typename": "GenAIImagePrimitive",
            "preview_image": {
              "__typename": "GenAIMediaItem",
              "mime_type": "image/jpeg",
              "url": "https://i.ibb.co/674988wP/silatech.jpg"
            },
            "full_image": {
              "__typename": "GenAIMediaItem",
              "mime_type": "image/jpeg",
              "url": "https://i.ibb.co/674988wP/silatech.jpg"
            }
          },
          "__typename": "GenAISingleLayoutViewModel"
        }
      });
      
      // Create command buttons from categories
      const categoryNames = Array.from(categories.keys());
      const categoryButtons = [];
      
      // Limit to first 6 categories for display
      const displayCategories = categoryNames.slice(0, 6);
      
      for (const cat of displayCategories) {
        const cmds = categories.get(cat) || [];
        const firstCmd = cmds[0]?.name || '';
        
        categoryButtons.push({
          "__typename": "GenAI3PExtWidgetPrimitive",
          "header": {
            "__typename": "GenAI3PExtWidgetStandardHeader",
            "title": cat.toUpperCase()
          },
          "body": {
            "__typename": "GenAI3PExtCalendarEventList",
            "sections": [],
            "ctas": cmds.slice(0, 3).map((cmd, idx) => ({
              "__typename": "GenAI3PExtWidgetCTA",
              "label": cmd.name,
              "state": "PENDING",
              "kind": "OTHER",
              "tool_call_id": `${prefix}${cmd.name}`,
              "toast": {
                "__typename": "GenAI3PExtWidgetToast",
                "label": cmd.name
              }
            }))
          }
        });
      }
      
      // Add category buttons
      if (categoryButtons.length > 0) {
        sections.push({
          "view_model": {
            "primitives": categoryButtons,
            "__typename": "GenAIHScrollLayoutViewModel"
          }
        });
      }
      
      // Add footer with group and channel
      sections.push({
        "view_model": {
          "primitives": [
            {
              "__typename": "GenAIFooterActionPrimitive",
              "cta_text": "WhatsApp Group",
              "cta_type": "OPEN_URL",
              "cta_url": "https://chat.whatsapp.com/IS276Wg9zcuCnJRiMDI64g?s=cl&p=a&mlu=4"
            },
            {
              "__typename": "GenAIFooterActionPrimitive",
              "cta_text": "WhatsApp Channel",
              "cta_type": "OPEN_URL",
              "cta_url": "https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02"
            }
          ],
          "__typename": "GenAIHScrollLayoutViewModel"
        }
      });
      
      const content = {
        messageContextInfo: {
          messageSecret: "v/3VN8Gfr2dbKzgt1GKDEU7ovyYW+nswh4Duwq6KDuU="
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": sections
                })).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardOrigin: 4
              }
            }
          }
        }
      };
      
      await sock.relayMessage(sender, content, {});
      
    } catch (error) {
      console.error('[nixmenu]', error);
      
      // Fallback to text menu if rich response fails
      let txt = `✦ Sila Menu\n◉ Prefix: ${prefix}\n◉ Commands: ${commands.size}\n\n`;
      
      const categories = new Map();
      for (const [name, cmd] of commands) {
        if (!categories.has(cmd.category)) {
          categories.set(cmd.category, []);
        }
        categories.get(cmd.category).push(name);
      }
      
      for (const [category, cmds] of categories) {
        txt += `▸ ${category.toUpperCase()}\n`;
        for (const cmd of cmds.slice(0, 5)) {
          txt += `  ${prefix}${cmd}\n`;
        }
        if (cmds.length > 5) txt += `  +${cmds.length - 5} more\n`;
        txt += '\n';
      }
      
      txt += `✦ Created by Sila Tech`;
      await sock.sendMessage(sender, { text: txt });
    }
  }
};