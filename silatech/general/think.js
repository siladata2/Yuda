import { AIRich } from 'baileys';
import axios from 'axios';

export default {
  name: 'copilot',
  alias: ['ask', 'chat', 'copilot', 'think'],
  description: 'AI Copilot with rich responses',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    if (args.length === 0) {
      await sock.sendMessage(sender, {
        text: `✦ AI Copilot\n◉ Usage: ${prefix}ai [question]\n◉ Example: ${prefix}ai What is WhatsApp?`
      });
      return;
    }
    
    const question = args.join(' ');
    
    try {
      // Send typing indicator
      await sock.sendPresenceUpdate('composing', sender);
      
      // Call AI API
      const response = await axios.get(`https://api.silatech.site/api/ai/ai-copilot?q=${encodeURIComponent(question)}`);
      
      if (!response.data || !response.data.response) {
        throw new Error('No response from AI');
      }
      
      const aiResponse = response.data.response;
      
      // Detect response type and build rich message
      const isCode = aiResponse.includes('```') || 
                     aiResponse.includes('function') || 
                     aiResponse.includes('const') || 
                     aiResponse.includes('import') ||
                     aiResponse.includes('class') ||
                     aiResponse.includes('console.log');
      
      const isTable = aiResponse.includes('|') && aiResponse.includes('---');
      const isList = aiResponse.includes('\n- ') || aiResponse.includes('\n• ');
      
      try {
        // Try to send as rich response
        const rich = new AIRich(sock);
        
        // Add header
        rich.addText(`✦ AI Copilot Response\n\n`);
        
        // Handle different response types
        if (isCode) {
          // Extract code blocks
          const codeBlocks = aiResponse.match(/```(\w+)?\n([\s\S]*?)```/g);
          
          if (codeBlocks) {
            // Add text before code
            const textBefore = aiResponse.split(/```(\w+)?\n/)[0];
            if (textBefore && textBefore.trim()) {
              rich.addText(textBefore.trim());
            }
            
            // Add each code block
            for (const block of codeBlocks) {
              const langMatch = block.match(/```(\w+)?\n/);
              const lang = langMatch ? langMatch[1] || 'javascript' : 'javascript';
              const code = block.replace(/```(\w+)?\n/, '').replace(/```$/, '');
              rich.addCode(code.trim(), lang);
            }
            
            // Add text after code
            const textAfter = aiResponse.split(/```(\w+)?\n/).pop();
            if (textAfter && textAfter.trim() && !textAfter.includes('```')) {
              rich.addText(textAfter.trim());
            }
          } else {
            // No code blocks found, send as text
            rich.addText(aiResponse);
          }
        } else if (isTable) {
          // Parse table
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
          
          if (tableData.length > 0) {
            rich.addTable(tableData);
          } else {
            rich.addText(aiResponse);
          }
        } else if (isList) {
          // Add list as text
          rich.addText(aiResponse);
        } else {
          // Regular text response
          rich.addText(aiResponse);
        }
        
        // Add suggestions
        rich.addSuggest([
          `${prefix}ai ${question}`,
          `${prefix}help`,
          `${prefix}menu`
        ]);
        
        // Add footer
        rich.setFooter('✦ Powered by Sila Tech AI');
        
        // Send rich response
        await rich.send(sender);
        
      } catch (richError) {
        // Fallback to text if rich fails
        console.error('[ai rich fallback]', richError);
        
        let cleanResponse = aiResponse;
        
        // Clean markdown
        cleanResponse = cleanResponse.replace(/```(\w+)?\n/g, '```\n');
        
        // Send as text with code formatting
        const maxLength = 4096;
        if (cleanResponse.length > maxLength) {
          const chunks = cleanResponse.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [];
          for (const chunk of chunks) {
            await sock.sendMessage(sender, { text: `✦ AI Response\n\n${chunk}` });
          }
        } else {
          await sock.sendMessage(sender, { text: `✦ AI Response\n\n${cleanResponse}` });
        }
      }
      
    } catch (error) {
      console.error('[ai]', error);
      
      // Error fallback
      let errorMsg = '✖ AI service error';
      
      if (error.response) {
        errorMsg = `✖ API Error: ${error.response.status}`;
      } else if (error.message) {
        errorMsg = `✖ ${error.message}`;
      }
      
      await sock.sendMessage(sender, { 
        text: `${errorMsg}\n\n◉ Please try again later` 
      });
    }
  }
};