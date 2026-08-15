// silatech/general/ai.js
import fetch from 'node-fetch';

export default {
  name: 'ai',
  alias: ['gpt', 'chatgpt', 'silaai', 'ask', 'botai'],
  description: 'Chat with AI using Sila Tech API',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    // Check if there's a message
    if (args.length === 0) {
      const helpText = `🤖 *AI Chat Command*\n\n` +
                       `*Usage:*\n` +
                       `${prefix}ai [your question]\n\n` +
                       `*Examples:*\n` +
                       `${prefix}ai What is WhatsApp bot?\n` +
                       `${prefix}ai Tell me a joke\n` +
                       `${prefix}ai How to code in JavaScript?\n\n` +
                       `*Features:*\n` +
                       `• Powered by GPT-4 Mini\n` +
                       `• Fast responses\n` +
                       `• Supports multiple languages\n` +
                       `• Context-aware conversations\n\n` +
                       `👨‍💻 *API by:* Sila Tech`;
      
      await sock.sendMessage(sender, { text: helpText });
      return;
    }

    try {
      // Get the question
      const question = args.join(' ');
      
      // Send typing indicator
      await sock.sendPresenceUpdate('composing', sender);
      
      // Send initial message
      const sentMsg = await sock.sendMessage(sender, {
        text: `🤖 *Thinking...*\n\n⏳ Processing your question...`
      });
      
      // Call the API
      const apiUrl = `https://api.silatech.site/api/ai/gpt4-mini?message=${encodeURIComponent(question)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SilaTechBot/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract the answer (handle different response formats)
      let answer = '';
      if (data.response) {
        answer = data.response;
      } else if (data.result) {
        answer = data.result;
      } else if (data.message) {
        answer = data.message;
      } else if (data.data) {
        answer = data.data;
      } else if (typeof data === 'string') {
        answer = data;
      } else {
        answer = JSON.stringify(data, null, 2);
      }
      
      // Format the response
      const formattedResponse = `🤖 *AI Response*\n\n` +
                               `📝 *Your Question:*\n${question}\n\n` +
                               `💬 *Answer:*\n${answer}\n\n` +
                               `⚡ *Powered by:* Sila Tech AI\n` +
                               `🕐 *Time:* ${new Date().toLocaleTimeString()}`;
      
      // Check if response is too long
      if (formattedResponse.length > 65000) {
        // Send as document if too long
        const buffer = Buffer.from(formattedResponse, 'utf-8');
        await sock.sendMessage(sender, {
          document: buffer,
          mimetype: 'text/plain',
          fileName: `ai_response_${Date.now()}.txt`,
          caption: `📄 *AI Response*\n\n📝 Question: ${question.substring(0, 50)}${question.length > 50 ? '...' : ''}`
        });
      } else {
        // Edit the message with the response
        await sock.sendMessage(sender, {
          text: formattedResponse
        }, { edit: sentMsg.key });
      }
      
    } catch (error) {
      console.error('AI command error:', error);
      
      await sock.sendMessage(sender, {
        text: `❌ *AI Error*\n\n` +
              `Failed to get response from AI API.\n` +
              `Error: ${error.message}\n\n` +
              `💡 Please try again later or use !help for other commands.`
      });
    }
  }
};