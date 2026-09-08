import axios from 'axios';
import { prepareWAMessageMedia } from '@itsliaaa/baileys';

export default {
  name: 'silaai',
  alias: ['a', 'ai', 'ask'],
  description: 'Chat with Sila AI',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const text = args.join(' ');
    
    if (!text) {
      await sock.sendMessage(sender, { 
        text: `✦ Sila AI\n◉ Usage: ${prefix}silaai [question]\n◉ Example: ${prefix}silaai What is WhatsApp?` 
      });
      return;
    }
    
    try {
      // Initialize user data
      if (!global.db) global.db = {};
      if (!global.db.data) global.db.data = {};
      if (!global.db.data.users) global.db.data.users = {};
      if (!global.db.data.users[sender]) global.db.data.users[sender] = {};
      if (!global.db.data.users[sender].silaai) {
        global.db.data.users[sender].silaai = { logs: [] };
      }
      
      // Keep only last 10 logs
      global.db.data.users[sender].silaai.logs = global.db.data.users[sender].silaai.logs.slice(-10);
      
      // Get logs
      let logs = [{ role: "user", content: text }];
      
      // Call API
      const response = await axios.get(`https://api.silatech.site/api/ai/claude?text=${encodeURIComponent(text)}`);
      
      if (response.data?.success && response.data?.result) {
        const result = response.data.result;
        
        // Send as normal text with Sila AI formatting
        const reply = `✦ Sila AI\n\n${result}`;
        
        await sock.sendMessage(sender, { text: reply });
        
        // Save to logs
        logs.push({ role: "assistant", content: result });
        global.db.data.users[sender].silaai.logs.push(...logs);
        
      } else {
        throw new Error('Invalid response from API');
      }
      
    } catch (error) {
      console.error('[silaai]', error);
      await sock.sendMessage(sender, { 
        text: `✖ Error: ${error.message || 'Failed to get response'}` 
      });
    }
  },
  
  // Handle button clicks
  async before(sock, msg, options) {
    const sender = msg.key.remoteJid;
    
    // Initialize user data
    if (!global.db) global.db = {};
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.users[sender]) global.db.data.users[sender] = {};
    if (!global.db.data.users[sender].silaai) {
      global.db.data.users[sender].silaai = { logs: [] };
    }
    
    // Keep only last 10 logs
    global.db.data.users[sender].silaai.logs = global.db.data.users[sender].silaai.logs.slice(-10);
    
    // Handle button clicks (messages starting with SILA-)
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    if (text.startsWith('SILA-')) {
      await silaButtonClick('button_click', text, sock, msg);
    }
  }
};

async function silaButtonClick(type, text, sock, msg) {
  const sender = msg.key.remoteJid;
  
  // Initialize user data
  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.users[sender]) global.db.data.users[sender] = {};
  if (!global.db.data.users[sender].silaai) {
    global.db.data.users[sender].silaai = { logs: [] };
  }
  
  let logs = [];
  let id = "SILA-unknown_id";
  
  try {
    const userLogs = global.db.data.users[sender].silaai.logs || [];
    const filtered = userLogs
      .filter(v => v.tool_calls && v.data_id)
      .map(v => ({ ...JSON.parse(v.tool_calls[0].function.arguments), id: v.tool_calls[0].id }))
      .map(v => ({ id: v.id, data_id: v.data_id }))
      .find(item => item.data_id?.includes(text));
    
    if (filtered) id = filtered.id;
  } catch {
    id = "SILA-unknown";
  }
  
  logs = [{
    role: "tool",
    tool_call_id: id,
    content: JSON.stringify({
      user_button_clicked_id: text,
      description: `User has interacted with button id ${text}. Respond naturally as if replying to user.`
    })
  }];
  
  // Get response from API
  try {
    const response = await axios.get(`https://api.silatech.site/api/ai/claude?text=${encodeURIComponent(text)}`);
    
    if (response.data?.success && response.data?.result) {
      const result = response.data.result;
      
      logs.push({ role: "assistant", content: result });
      await sock.sendMessage(sender, { text: `✦ Sila AI\n\n${result}` });
      global.db.data.users[sender].silaai.logs.push(...logs);
    }
  } catch (error) {
    console.error('[silaai button]', error);
    await sock.sendMessage(sender, { text: `✖ Error: ${error.message}` });
  }
}