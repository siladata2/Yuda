import { AIRich } from 'baileys';
import axios from 'axios';

export default {
  name: 'gpt',
  alias: ['ask', 'chat', 'gpt', 'copilot', 'gpt4'],
  description: 'AI with rich responses',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      await sock.sendMessage(sender, {
        text: `✦ Gpt\n◉ Usage: ${prefix}gpt [question]\n◉ Example: ${prefix}gpt What is WhatsApp?`
      });
      return;
    }
    
    const question = args.join(' ');
    
    try {
      // Send typing indicator
      await sock.sendPresenceUpdate('composing', sender);
      
      // Call AI API
      const response = await axios.get(`https://api.silatech.site/api/ai/gpt4-mini?message=${encodeURIComponent(question)}`);
      
      if (!response.data || !response.data.answer) {
        throw new Error('No response from AI');
      }
      
      const aiResponse = response.data.answer;
      
      // Detect response type
      const isCode = aiResponse.includes('```') || 
                     aiResponse.includes('function') || 
                     aiResponse.includes('const') || 
                     aiResponse.includes('import') ||
                     aiResponse.includes('class') ||
                     aiResponse.includes('console.log') ||
                     aiResponse.includes('<!DOCTYPE') ||
                     aiResponse.includes('<html>') ||
                     aiResponse.includes('<style>') ||
                     aiResponse.includes('def ') ||
                     aiResponse.includes('npm ');
      
      const isTable = aiResponse.includes('|') && aiResponse.includes('---');
      const isList = aiResponse.includes('\n- ') || aiResponse.includes('\n• ') || aiResponse.includes('\n* ');
      
      // Build rich response
      const rich = new AIRich(sock);
      
      // Handle different response types
      if (isCode) {
        const codeBlocks = aiResponse.match(/```(\w+)?\n([\s\S]*?)```/g);
        
        if (codeBlocks) {
          // Add text before first code block
          const textBefore = aiResponse.split(/```(\w+)?\n/)[0];
          if (textBefore && textBefore.trim()) {
            rich.addText(textBefore.trim());
          }
          
          for (const block of codeBlocks) {
            const langMatch = block.match(/```(\w+)?\n/);
            const lang = langMatch ? langMatch[1] || 'javascript' : 'javascript';
            const code = block.replace(/```(\w+)?\n/, '').replace(/```$/, '');
            rich.addCode(code.trim(), lang);
          }
          
          const textAfter = aiResponse.split(/```(\w+)?\n/).pop();
          if (textAfter && textAfter.trim() && !textAfter.includes('```')) {
            rich.addText(textAfter.trim());
          }
        } else {
          rich.addText(aiResponse);
        }
      } else if (isTable) {
        const lines = aiResponse.split('\n').filter(line => line.trim());
        const tableData = [];
        
        for (const line of lines) {
          if (line.includes('|') && !line.includes('---')) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c);
            if (cells.length > 0) {
              tableData.push(cells);
            }
          }
        }
        
        const textBefore = aiResponse.split(/\n\|/)[0];
        if (textBefore && textBefore.trim()) {
          rich.addText(textBefore.trim());
        }
        
        if (tableData.length > 0) {
          rich.addTable(tableData);
        } else {
          rich.addText(aiResponse);
        }
        
        const tableEnd = aiResponse.split(/\|\n/);
        if (tableEnd.length > 1) {
          const textAfter = tableEnd.slice(1).join('\n').trim();
          if (textAfter) {
            rich.addText(textAfter);
          }
        }
      } else if (isList) {
        rich.addText(aiResponse);
      } else {
        rich.addText(aiResponse);
      }
      
      // Add footer only
      rich.setFooter('✦ Powered By Sila Tech');
      
      // Send rich response
      await rich.send(sender);
      
    } catch (error) {
      console.error('[ai]', error);
      
      await sock.sendMessage(sender, { 
        text: `✖ Error: ${error.message || 'Service unavailable'}` 
      });
    }
  }
};