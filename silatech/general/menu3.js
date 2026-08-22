// silatech/general/menu.js
import { ButtonV2 } from '@itsliaaa/baileys';

export default {
  name: 'menu',
  alias: ['help', 'commands', 'cmds'],
  description: 'Interactive menu with categories',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const isGroup = sender.endsWith('@g.us');
    const isOwner = options.isOwner ? options.isOwner() : false;
    const mode = options.getBotMode ? options.getBotMode() : 'public';
    
    // Check if specific sub-command
    const subCommand = args[0]?.toLowerCase() || '';
    
    // Handle sub-menus
    if (subCommand === 'ai-chat') {
      await sock.sendMessage(sender, {
        text: `✦ AI Chat Menu\n\n◉ Type: .ai [question]\n◉ Example: .ai What is WhatsApp?\n◉ Powered by Sila Tech AI`
      });
      return;
    }
    
    if (subCommand === 'ai-generate') {
      await sock.sendMessage(sender, {
        text: `✦ AI Generate Menu\n\n◉ Type: .generate [prompt]\n◉ Example: .generate a beautiful sunset\n◉ Powered by Sila Tech AI`
      });
      return;
    }
    
    if (subCommand === 'group') {
      await sock.sendMessage(sender, {
        text: `✦ Group Commands\n\n◉ .add [number] - Add member\n◉ .kick [number] - Remove member\n◉ .promote [number] - Make admin\n◉ .demote [number] - Remove admin\n◉ .groupinfo - Group details`
      });
      return;
    }
    
    if (subCommand === 'owner') {
      if (!isOwner) {
        await sock.sendMessage(sender, { text: '⛔ Owner only' });
        return;
      }
      await sock.sendMessage(sender, {
        text: `✦ Owner Commands\n\n◉ .mode [public|private|self] - Change mode\n◉ .reload - Reload commands\n◉ .send [number] [msg] - Send message\n◉ .broadcast [msg] - Broadcast to all`
      });
      return;
    }
    
    // Main menu with ButtonV2
    try {
      const button = new ButtonV2(sock);
      
      const sections = [
        {
          title: '✦ General Commands',
          rows: [
            { 
              title: '📌 Help', 
              description: 'Show this menu', 
              id: `${prefix}menu` 
            },
            { 
              title: '🏓 Ping', 
              description: 'Check bot latency', 
              id: `${prefix}ping` 
            },
            { 
              title: '📊 Stats', 
              description: 'View bot statistics', 
              id: `${prefix}stats` 
            },
            { 
              title: '📤 Send', 
              description: 'Send message to someone', 
              id: `${prefix}send` 
            }
          ]
        },
        {
          title: '✦ AI & Chat',
          rows: [
            { 
              title: '🤖 AI Chat', 
              description: 'Chat with AI assistant', 
              id: `${prefix}menu ai-chat` 
            },
            { 
              title: '🎨 AI Generate', 
              description: 'Generate images with AI', 
              id: `${prefix}menu ai-generate` 
            }
          ]
        },
        {
          title: '✦ Group Commands',
          rows: [
            { 
              title: '👥 Group Menu', 
              description: 'View group commands', 
              id: `${prefix}menu group` 
            },
            { 
              title: '➕ Add Member', 
              description: 'Add someone to group', 
              id: `${prefix}add` 
            }
          ]
        }
      ];
      
      // Add owner section if owner
      if (isOwner) {
        sections.push({
          title: '✦ Owner Commands',
          rows: [
            { 
              title: '🔒 Owner Menu', 
              description: 'View owner commands', 
              id: `${prefix}menu owner` 
            },
            { 
              title: '⚙️ Mode', 
              description: `Current: ${mode}`, 
              id: `${prefix}mode status` 
            },
            { 
              title: '🔄 Reload', 
              description: 'Reload bot commands', 
              id: `${prefix}reload` 
            }
          ]
        });
      }
      
      // Build button
      button.addRawButton({
        buttonText: { 
          displayText: `☰ Sila Menu` 
        },
        buttonId: "main_menu",
        type: 1,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({
            title: `✦ ${options.BOT_NAME || 'SILA TECH BOT'}`,
            sections: sections
          })
        }
      });
      
      // Send with header
      await sock.sendMessage(sender, {
        text: `✦ *${options.BOT_NAME || 'SILA TECH BOT'}* v${options.VERSION || '1.0.0'}\n\n◉ Prefix: ${prefix}\n◉ Mode: ${mode}\n◉ Commands: ${options.commands?.size || 0}\n◉ Status: Online\n◉ Library: @itsliaaa/baileys\n\n▸ Tap the button below to explore`,
        footer: '✦ Created by Sila Tech'
      });
      
      // Send the button
      await button.send(sender);
      
    } catch (error) {
      console.error('Menu button error:', error);
      
      // Fallback to text menu if button fails
      let txt = `✦ ${options.BOT_NAME || 'SILA TECH BOT'}\n`;
      txt += `◉ Prefix: ${prefix}\n`;
      txt += `◉ Mode: ${mode}\n`;
      txt += `◉ Commands: ${options.commands?.size || 0}\n\n`;
      
      txt += `▸ GENERAL\n`;
      txt += `  ${prefix}help - Show menu\n`;
      txt += `  ${prefix}ping - Check latency\n`;
      txt += `  ${prefix}stats - View stats\n`;
      txt += `  ${prefix}send - Send message\n\n`;
      
      txt += `▸ AI\n`;
      txt += `  ${prefix}ai [question] - Chat with AI\n`;
      txt += `  ${prefix}generate [prompt] - Generate image\n\n`;
      
      txt += `▸ GROUP\n`;
      txt += `  ${prefix}add [number] - Add member\n`;
      txt += `  ${prefix}groupinfo - Group info\n\n`;
      
      if (isOwner) {
        txt += `▸ OWNER\n`;
        txt += `  ${prefix}mode [mode] - Change mode\n`;
        txt += `  ${prefix}reload - Reload commands\n`;
        txt += `  ${prefix}broadcast - Broadcast message\n\n`;
      }
      
      txt += `✦ Created by Sila Tech`;
      await sock.sendMessage(sender, { text: txt });
    }
  }
};