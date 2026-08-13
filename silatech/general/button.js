// silatech/general/button.js
export default {
  name: 'button',
  alias: ['btn', 'buttons', 'menu'],
  description: 'Send interactive button messages',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    // Help text
    if (args.length === 0 || args[0].toLowerCase() === 'help') {
      const helpText = `🔘 *Button Command Usage*\n\n` +
                       `*1. Plain Button:*\n` +
                       `${prefix}button plain "✨ Interesting Menu" "#Menu"\n\n` +
                       `*2. Interactive Response:*\n` +
                       `${prefix}button interactive "💭 Response" "menu_options" "#Menu"\n\n` +
                       `*3. List Reply:*\n` +
                       `${prefix}button list "📄 See More" "✨ Interesting Menu" "#Menu"\n\n` +
                       `*4. Template Button:*\n` +
                       `${prefix}button template "✨ Interesting Menu" "#Menu" 1\n\n` +
                       `*5. Quick Reply Buttons:*\n` +
                       `${prefix}button quick\n\n` +
                       `*Examples:*\n` +
                       `${prefix}button plain "Open Menu" "#main-menu"\n` +
                       `${prefix}button list "View Options" "Choose an option" "#options"`;
      
      await sock.sendMessage(sender, { text: helpText });
      return;
    }

    try {
      const type = args[0].toLowerCase();
      
      switch (type) {
        case 'plain':
          await handlePlainButton(sock, msg, args, prefix);
          break;
          
        case 'interactive':
          await handleInteractiveButton(sock, msg, args, prefix);
          break;
          
        case 'list':
          await handleListButton(sock, msg, args, prefix);
          break;
          
        case 'template':
          await handleTemplateButton(sock, msg, args, prefix);
          break;
          
        case 'quick':
          await handleQuickButtons(sock, msg, args, prefix);
          break;
          
        case 'full':
          await handleFullButtons(sock, msg, args, prefix);
          break;
          
        default:
          await sock.sendMessage(sender, { 
            text: `❌ Unknown button type. Use: plain, interactive, list, template, quick, or full` 
          });
      }
      
    } catch (error) {
      console.error('Button command error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ Error: ${error.message}` 
      });
    }
  }
};

// ==================== HANDLERS ====================

// 1. Plain Button
async function handlePlainButton(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Parse: !button plain "display text" "id"
  let displayText = '✨ Interesting Menu';
  let buttonId = '#Menu';
  
  if (args.length >= 2) {
    // Try to get quoted text
    const fullText = args.slice(1).join(' ');
    const quotedMatch = fullText.match(/"([^"]+)"/g);
    
    if (quotedMatch && quotedMatch.length >= 2) {
      displayText = quotedMatch[0].replace(/"/g, '');
      buttonId = quotedMatch[1].replace(/"/g, '');
    } else if (quotedMatch && quotedMatch.length === 1) {
      displayText = quotedMatch[0].replace(/"/g, '');
      buttonId = '#Menu';
    } else {
      // Parse without quotes
      const parts = fullText.split(/\s+/);
      displayText = parts[0] || '✨ Interesting Menu';
      buttonId = parts[1] || '#Menu';
    }
  }
  
  await sock.sendMessage(sender, {
    type: 'plain',
    buttonReply: {
      id: buttonId,
      displayText: displayText
    }
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Plain Button Sent!*\n\n🔘 Display: ${displayText}\n🆔 ID: ${buttonId}` 
  });
}

// 2. Interactive Button
async function handleInteractiveButton(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Parse: !button interactive "text" "name" "id"
  let text = '💭 Response';
  let name = 'menu_options';
  let paramsId = '#Menu';
  let description = '✨ Interesting Menu';
  
  if (args.length >= 2) {
    const fullText = args.slice(1).join(' ');
    const quotedMatch = fullText.match(/"([^"]+)"/g);
    
    if (quotedMatch && quotedMatch.length >= 3) {
      text = quotedMatch[0].replace(/"/g, '');
      name = quotedMatch[1].replace(/"/g, '');
      paramsId = quotedMatch[2].replace(/"/g, '');
    } else if (quotedMatch && quotedMatch.length === 2) {
      text = quotedMatch[0].replace(/"/g, '');
      name = quotedMatch[1].replace(/"/g, '');
      paramsId = '#Menu';
    } else {
      const parts = fullText.split(/\s+/);
      text = parts[0] || '💭 Response';
      name = parts[1] || 'menu_options';
      paramsId = parts[2] || '#Menu';
    }
  }
  
  await sock.sendMessage(sender, {
    flowReply: {
      format: 0,
      text: text,
      name: name,
      paramsJson: JSON.stringify({
        id: paramsId,
        description: description
      })
    }
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Interactive Button Sent!*\n\n💭 Text: ${text}\n📛 Name: ${name}\n🆔 ID: ${paramsId}` 
  });
}

// 3. List Reply Button
async function handleListButton(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Parse: !button list "title" "description" "id"
  let title = '📄 See More';
  let description = '✨ Interesting Menu';
  let id = '#Menu';
  
  if (args.length >= 2) {
    const fullText = args.slice(1).join(' ');
    const quotedMatch = fullText.match(/"([^"]+)"/g);
    
    if (quotedMatch && quotedMatch.length >= 3) {
      title = quotedMatch[0].replace(/"/g, '');
      description = quotedMatch[1].replace(/"/g, '');
      id = quotedMatch[2].replace(/"/g, '');
    } else if (quotedMatch && quotedMatch.length === 2) {
      title = quotedMatch[0].replace(/"/g, '');
      description = quotedMatch[1].replace(/"/g, '');
      id = '#Menu';
    } else {
      const parts = fullText.split(/\s+/);
      title = parts[0] || '📄 See More';
      description = parts[1] || '✨ Interesting Menu';
      id = parts[2] || '#Menu';
    }
  }
  
  await sock.sendMessage(sender, {
    listReply: {
      title: title,
      description: description,
      id: id
    }
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *List Reply Button Sent!*\n\n📄 Title: ${title}\n📝 Description: ${description}\n🆔 ID: ${id}` 
  });
}

// 4. Template Button
async function handleTemplateButton(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Parse: !button template "display text" "id" index
  let displayText = '✨ Interesting Menu';
  let id = '#Menu';
  let index = 1;
  
  if (args.length >= 2) {
    const fullText = args.slice(1).join(' ');
    const quotedMatch = fullText.match(/"([^"]+)"/g);
    
    if (quotedMatch && quotedMatch.length >= 2) {
      displayText = quotedMatch[0].replace(/"/g, '');
      id = quotedMatch[1].replace(/"/g, '');
      
      // Try to get index
      const remaining = fullText.replace(quotedMatch[0], '').replace(quotedMatch[1], '').trim();
      if (remaining && /^\d+$/.test(remaining)) {
        index = parseInt(remaining);
      }
    } else if (quotedMatch && quotedMatch.length === 1) {
      displayText = quotedMatch[0].replace(/"/g, '');
      id = '#Menu';
    } else {
      const parts = fullText.split(/\s+/);
      displayText = parts[0] || '✨ Interesting Menu';
      id = parts[1] || '#Menu';
      if (parts[2] && /^\d+$/.test(parts[2])) {
        index = parseInt(parts[2]);
      }
    }
  }
  
  await sock.sendMessage(sender, {
    type: 'template',
    buttonReply: {
      id: id,
      displayText: displayText,
      index: index
    }
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Template Button Sent!*\n\n🔘 Display: ${displayText}\n🆔 ID: ${id}\n🔢 Index: ${index}` 
  });
}

// 5. Quick Reply Buttons
async function handleQuickButtons(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Send quick reply buttons
  await sock.sendMessage(sender, {
    text: '🔘 *Quick Reply Menu*\n\nSelect an option:',
    buttons: [
      { buttonId: '#menu', buttonText: { displayText: '📋 Menu' }, type: 1 },
      { buttonId: '#help', buttonText: { displayText: '🆘 Help' }, type: 1 },
      { buttonId: '#about', buttonText: { displayText: 'ℹ️ About' }, type: 1 },
      { buttonId: '#contact', buttonText: { displayText: '📱 Contact' }, type: 1 }
    ],
    footerText: '✨ Sila Tech Bot'
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Quick Reply Buttons Sent!*\n\n🔘 4 buttons displayed:\n• 📋 Menu\n• 🆘 Help\n• ℹ️ About\n• 📱 Contact` 
  });
}

// 6. Full Interactive Buttons with Multiple Rows
async function handleFullButtons(sock, msg, args, prefix) {
  const sender = msg.key.remoteJid;
  
  // Send full interactive buttons
  await sock.sendMessage(sender, {
    text: '🌟 *Main Menu*\n\nChoose an option from the list:',
    footer: '✨ Sila Tech Bot v1.0',
    buttons: [
      {
        buttonId: '#menu',
        buttonText: { displayText: '📋 Main Menu' },
        type: 1
      },
      {
        buttonId: '#settings',
        buttonText: { displayText: '⚙️ Settings' },
        type: 1
      },
      {
        buttonId: '#stats',
        buttonText: { displayText: '📊 Statistics' },
        type: 1
      }
    ],
    headerType: 1,
    viewOnce: false,
    contextInfo: {
      mentionedJid: [sender],
      forwardingScore: 999,
      isForwarded: true
    }
  }, { quoted: msg });
  
  // Send another set of buttons (list style)
  await sock.sendMessage(sender, {
    text: '📋 *Additional Options*',
    footer: 'Select an option below:',
    buttons: [
      {
        buttonId: '#product',
        buttonText: { displayText: '📦 Products' },
        type: 1
      },
      {
        buttonId: '#order',
        buttonText: { displayText: '🛒 Order Now' },
        type: 1
      },
      {
        buttonId: '#support',
        buttonText: { displayText: '💬 Support' },
        type: 1
      }
    ]
  }, { quoted: msg });
  
  await sock.sendMessage(sender, { 
    text: `✅ *Full Interactive Buttons Sent!*\n\n🔘 6 buttons displayed in 2 groups` 
  });
}