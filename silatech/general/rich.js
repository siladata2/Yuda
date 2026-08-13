// silatech/general/rich.js
export default {
  name: 'rich',
  alias: ['richmsg', 'formatted', 'code', 'table'],
  description: 'Send rich formatted messages with code and tables',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    // Help text
    if (args.length === 0 || args[0].toLowerCase() === 'help') {
      const helpText = `📝 *Rich Message Command Usage*\n\n` +
                       `*1. Code Block:*\n` +
                       `${prefix}rich code javascript "console.log('Hello!')"\n\n` +
                       `*2. Table:*\n` +
                       `${prefix}rich table "Title" "Col1,Col2,Col3" "Row1,Row2,Row3"\n\n` +
                       `*3. Mixed Content:*\n` +
                       `${prefix}rich mixed "Text" "code" "table"\n\n` +
                       `*4. Full Example:*\n` +
                       `${prefix}rich full\n\n` +
                       `*5. Custom Rich Message:*\n` +
                       `${prefix}rich custom "Your formatted message here"`;
      
      await sock.sendMessage(sender, { text: helpText });
      return;
    }

    try {
      const type = args[0].toLowerCase();
      
      switch (type) {
        case 'code':
          await handleCodeBlock(sock, msg, args, prefix);
          break;
          
        case 'table':
          await handleTable(sock, msg, args, prefix);
          break;
          
        case 'mixed':
          await handleMixedContent(sock, msg, args, prefix);
          break;
          
        case 'full':
          await handleFullRichMessage(sock, msg, args, prefix);
          break;
          
        case 'custom':
          await handleCustomRichMessage(sock, msg, args, prefix);
          break;
          
        default:
          // Send a default rich message
          await sendDefaultRichMessage(sock, msg, args, prefix);
      }
      
    } catch (error) {
      console.error('Rich command error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ Error: ${error.message}` 
      });
    }
  }
};

// ==================== HANDLERS ====================

// 1. Code Block Handler
async function handleCodeBlock(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  let language = 'javascript';
  let codeContent = 'console.log("Hello, World!")';
  
  if (args.length >= 2) {
    // Parse: !rich code [language] "code content"
    const fullText = args.slice(1).join(' ');
    const quotedMatch = fullText.match(/"([^"]+)"/);
    
    if (quotedMatch) {
      const beforeQuote = fullText.substring(0, fullText.indexOf(quotedMatch[0])).trim();
      if (beforeQuote) {
        language = beforeQuote;
      }
      codeContent = quotedMatch[1];
    } else {
      const parts = fullText.split(/\s+/);
      if (parts.length >= 2) {
        language = parts[0];
        codeContent = parts.slice(1).join(' ');
      } else {
        codeContent = fullText;
      }
    }
  }
  
  await sock.sendMessage(sender, {
    disclaimerText: `📝 Code Example (${language})`,
    richResponse: [
      {
        text: `💻 *${language.toUpperCase()} Code Example*`
      },
      {
        language: language,
        code: [{
          highlightType: 0,
          codeContent: codeContent
        }]
      },
      {
        text: `\n✨ Code shared via Sila Tech Bot`
      }
    ]
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Code Block Sent!*\n\n📝 Language: ${language}\n💻 Code: ${codeContent.substring(0, 50)}${codeContent.length > 50 ? '...' : ''}` 
  });
}

// 2. Table Handler
async function handleTable(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Parse: !rich table "Title" "Col1,Col2,Col3" "Row1,Row2,Row3"
  let title = '📊 Data Table';
  let headers = ['', 'Column 1', 'Column 2', 'Column 3'];
  let rows = [
    ['Row 1', 'Data 1', 'Data 2', 'Data 3'],
    ['Row 2', 'Data 4', 'Data 5', 'Data 6']
  ];
  
  if (args.length >= 2) {
    const fullText = args.slice(1).join(' ');
    const quotedMatch = fullText.match(/"([^"]+)"/g);
    
    if (quotedMatch && quotedMatch.length >= 2) {
      title = quotedMatch[0].replace(/"/g, '');
      
      // Parse headers
      const headerStr = quotedMatch[1].replace(/"/g, '');
      headers = ['', ...headerStr.split(',').map(h => h.trim())];
      
      // Parse rows
      if (quotedMatch.length >= 3) {
        const rowStr = quotedMatch[2].replace(/"/g, '');
        const rowItems = rowStr.split('|').map(r => r.trim());
        rows = rowItems.map(row => {
          const cells = row.split(',').map(c => c.trim());
          return ['', ...cells];
        });
      }
    } else {
      const parts = fullText.split(/\s+/);
      title = parts[0] || '📊 Data Table';
      if (parts.length >= 2) {
        headers = ['', ...parts[1].split(',').map(h => h.trim())];
      }
      if (parts.length >= 3) {
        rows = parts.slice(2).map(row => {
          const cells = row.split(',').map(c => c.trim());
          return ['', ...cells];
        });
      }
    }
  }
  
  const tableData = [
    {
      isHeading: true,
      items: headers
    },
    ...rows.map(row => ({
      isHeading: false,
      items: row
    }))
  ];
  
  await sock.sendMessage(sender, {
    disclaimerText: `📊 ${title}`,
    richResponse: [
      {
        text: `📊 *${title}*`
      },
      {
        title: 'Data Comparison',
        table: tableData
      },
      {
        text: `\n📊 Table shared via Sila Tech Bot`
      }
    ]
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Table Sent!*\n\n📊 Title: ${title}\n📋 Columns: ${headers.length - 1}\n📝 Rows: ${rows.length}` 
  });
}

// 3. Mixed Content Handler
async function handleMixedContent(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Send a message with text, code, and table
  await sock.sendMessage(sender, {
    disclaimerText: '📝 Mixed Content Example',
    richResponse: [
      {
        text: '🌟 *Welcome to Sila Tech Bot!*\n\nHere\'s a mixed content example:\n'
      },
      {
        text: '💻 *Code Example:*'
      },
      {
        language: 'javascript',
        code: [{
          highlightType: 0,
          codeContent: 'const bot = new SilaBot();\nbot.start();\nconsole.log("Bot is running!");'
        }]
      },
      {
        text: '\n📊 *Feature Comparison:*\n'
      },
      {
        title: 'Bot Features Comparison',
        table: [
          {
            isHeading: true,
            items: ['', 'Basic', 'Premium', 'Enterprise']
          },
          {
            isHeading: false,
            items: ['Price', 'Free', 'TZS 70,000', 'TZS 150,000']
          },
          {
            isHeading: false,
            items: ['Features', 'Basic', 'Advanced', 'Full']
          },
          {
            isHeading: false,
            items: ['Support', 'Community', 'Priority', 'Dedicated']
          }
        ]
      },
      {
        text: '\n✨ *Choose the plan that fits your needs!*'
      }
    ]
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Mixed Content Sent!*\n\n📝 Includes: Text, Code Block, and Table` 
  });
}

// 4. Full Rich Message Handler
async function handleFullRichMessage(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Comprehensive rich message
  await sock.sendMessage(sender, {
    disclaimerText: '🌟 Full Rich Message Example',
    richResponse: [
      {
        text: '🚀 *SILA TECH BOT v1.0*\n\n' +
              'Welcome to the most advanced WhatsApp bot framework!\n' +
              'Here\'s what you can do:\n'
      },
      {
        text: '📋 *Features Overview*'
      },
      {
        title: 'Bot Capabilities',
        table: [
          {
            isHeading: true,
            items: ['', 'Status', 'Performance', 'Ease of Use']
          },
          {
            isHeading: false,
            items: ['Messaging', '✅', '5/5', '✅']
          },
          {
            isHeading: false,
            items: ['Automation', '✅', '4/5', '✅']
          },
          {
            isHeading: false,
            items: ['Anti-Systems', '✅', '5/5', '✅']
          },
          {
            isHeading: false,
            items: ['Commands', '✅', '4/5', '✅']
          }
        ]
      },
      {
        text: '\n💻 *Quick Start Code:*\n'
      },
      {
        language: 'javascript',
        code: [{
          highlightType: 0,
          codeContent: 'import { SilaBot } from "@sila-tech/bot";\n\nconst bot = new SilaBot({\n  session: "your-session",\n  prefix: "!"\n});\n\nbot.start();'
        }]
      },
      {
        text: '\n🔧 *Comparison with Other Bots:*\n'
      },
      {
        title: 'Framework Comparison',
        table: [
          {
            isHeading: true,
            items: ['', 'Sila Tech', 'Baileys', 'Other']
          },
          {
            isHeading: false,
            items: ['Speed', '5/5', '4/5', '3/5']
          },
          {
            isHeading: false,
            items: ['Features', '5/5', '4/5', '3/5']
          },
          {
            isHeading: false,
            items: ['Support', '5/5', '4/5', '2/5']
          }
        ]
      },
      {
        text: '\n✨ *Ready to get started?*\n' +
              'Type !help for more commands!\n' +
              '\n👨‍💻 *Created by:* Sila Tech'
      }
    ]
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Full Rich Message Sent!*\n\n📝 Contains:\n• 2 Tables\n• 1 Code Block\n• Multiple Text Sections` 
  });
}

// 5. Custom Rich Message
async function handleCustomRichMessage(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  if (args.length < 2) {
    await sock.sendMessage(sender, { 
      text: `❌ Please provide custom content.\nUsage: ${prefix}rich custom "Your rich message content"` 
    });
    return;
  }
  
  const customText = args.slice(1).join(' ');
  
  await sock.sendMessage(sender, {
    disclaimerText: '📝 Custom Rich Message',
    richResponse: [
      {
        text: customText
      }
    ]
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Custom Rich Message Sent!*\n\n📝 ${customText.substring(0, 50)}${customText.length > 50 ? '...' : ''}` 
  });
}

// 6. Default Rich Message
async function sendDefaultRichMessage(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // If user just typed !rich with text, send it as rich message
  const text = args.join(' ');
  
  if (text) {
    await sock.sendMessage(sender, {
      disclaimerText: '📝 Rich Message',
      richResponse: [
        {
          text: text
        }
      ]
    }, { quoted: msg });
  } else {
    // Send a default rich message
    await sock.sendMessage(sender, {
      disclaimerText: '📝 Sila Tech Bot - Rich Message Example',
      richResponse: [
        {
          text: '🌟 *Welcome to Rich Messages!*\n\n' +
                'This is a rich formatted message with:\n' +
                '• Text formatting\n' +
                '• Code blocks\n' +
                '• Tables\n' +
                '• And more!\n\n' +
                '✨ *Type !rich help for usage*'
        }
      ]
    }, { quoted: msg });
  }
  
  await sock.sendMessage(sender, { 
    text: `✅ *Rich Message Sent!*` 
  });
}