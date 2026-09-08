import axios from 'axios';
import { prepareWAMessageMedia } from '@itsliaaa/baileys';

const APIKEY = process.env.GROQ_API_KEY || "gsk_...";

export default {
  name: 'fiora',
  alias: ['a', 'ask', 'chat'],
  description: 'Chat with Fiora AI assistant',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const text = args.join(' ');
    
    if (!text) {
      await sock.sendMessage(sender, { 
        text: `✦ Fiora AI\n◉ Usage: ${prefix}fiora [question]\n◉ Example: ${prefix}fiora Hello!` 
      });
      return;
    }
    
    try {
      await fiora('chat', text, sock, msg);
    } catch (error) {
      // Reset logs on error
      if (global.db?.data?.users?.[sender]?.fiora) {
        global.db.data.users[sender].fiora.logs = [];
      }
      await sock.sendMessage(sender, { 
        text: `✖ Error: ${error.message}` 
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
    if (!global.db.data.users[sender].fiora) {
      global.db.data.users[sender].fiora = { logs: [] };
    }
    
    // Keep only last 7 logs
    global.db.data.users[sender].fiora.logs = global.db.data.users[sender].fiora.logs.slice(-7);
    
    // Handle button clicks (messages starting with FIORA-)
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    if (text.startsWith('FIORA-')) {
      await fiora('button_click', text, sock, msg);
    }
  }
};

async function fiora(type, text, sock, msg) {
  const sender = msg.key.remoteJid;
  
  // Initialize user data
  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.users[sender]) global.db.data.users[sender] = {};
  if (!global.db.data.users[sender].fiora) {
    global.db.data.users[sender].fiora = { logs: [] };
  }
  
  let logs = [];
  
  if (type === 'chat') {
    logs = [{ role: "user", content: text }];
  } else if (type === 'button_click') {
    let id = "FIORA-unknown_id";
    try {
      const userLogs = global.db.data.users[sender].fiora.logs;
      const filtered = userLogs
        .filter(v => v.tool_calls && v.data_id)
        .map(v => ({ ...JSON.parse(v.tool_calls[0].function.arguments), id: v.tool_calls[0].id }))
        .map(v => ({ id: v.id, data_id: v.data_id }))
        .find(item => item.data_id?.includes(text));
      
      if (filtered) id = filtered.id;
    } catch {
      id = "FIORA-unknown";
    }
    
    logs = [{
      role: "tool",
      tool_call_id: id,
      content: JSON.stringify({
        user_button_clicked_id: text,
        description: `User has interacted with button id ${text}. Respond naturally as if replying to user.`
      })
    }];
  }
  
  // Prepare messages
  const userLogs = global.db.data.users[sender].fiora.logs || [];
  const filteredLogs = userLogs.map(({ data_id, executed_tools, ...rest }) => rest);
  const messages = [...filteredLogs, ...logs];
  
  // Get response from Groq
  const res = await requestGroq(messages, sender);
  
  if (res.message?.content) {
    logs.push(res.message);
    await sock.sendMessage(sender, { text: res.message.content });
    global.db.data.users[sender].fiora.logs.push(...logs);
    return;
  }
  
  // Handle tool calls
  const toolCall = res.message?.tool_calls?.[0];
  if (toolCall) {
    const args = JSON.parse(toolCall.function.arguments || "{}");
    logs.push({ 
      ...res.message, 
      data_id: args.data_id || [] 
    });
    
    const nativeFlow = await convert(res, sock, msg);
    if (nativeFlow) {
      await sock.sendInteractiveMessage(sender, nativeFlow, msg);
    }
    
    global.db.data.users[sender].fiora.logs.push(...logs);
  }
}

async function requestGroq(message, user) {
  const payload = {
    model: "openai/gpt-oss-20b",
    user,
    messages: [
      { role: "system", content: loader().system },
      ...message
    ],
    tools: loader().tools,
    parallel_tool_calls: false,
    disable_tool_validation: false,
    temperature: 0.7,
    top_p: 0.9,
    max_completion_tokens: 1400,
    include_reasoning: false
  };

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${APIKEY}`
        }
      }
    );
    return res.data.choices[0];
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data || err.message 
    };
  }
}

function loader() {
  const tools = [
    { type: "browser_search" },
    {
      name: "response",
      type: "function",
      function: {
        name: "response",
        description: "Send interactive buttons or media to user. MUST use this tool to respond.",
        parameters: {
          type: "object",
          properties: {
            header: {
              type: "object",
              description: "Header for message, can contain title, subtitle, image, or video",
              properties: {
                title: { type: "string", description: "Header title" },
                image: { type: "string", description: "Image URL" },
                video: { type: "string", description: "Video URL" }
              }
            },
            text: { type: "string", description: "Body text" },
            footer: { type: "string", description: "Footer text" },
            data_id: {
              type: "array",
              description: "All button IDs written here as well",
              items: { type: "string" }
            },
            interactiveButtons: {
              type: "array",
              description: "Array of interactive buttons or CTA",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["reply", "url", "call", "reminder", "cancel_reminder", "address", "location", "copy", "single_select"],
                    description: "Button type. Use 'single_select' for multiple options."
                  },
                  displayText: { type: "string", description: "Button text" },
                  id: { type: "string", description: "Internal ID / tracking" },
                  url: { type: "string", description: "URL for url type" },
                  copyCode: { type: "string", description: "Code for copy type" },
                  sections: {
                    type: "array",
                    description: "Only for single_select, contains sections with rows",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        highlight_label: { type: "string" },
                        rows: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              header: { type: "string" },
                              title: { type: "string" },
                              description: { type: "string" },
                              id: { type: "string" }
                            },
                            required: ["title", "id"]
                          }
                        }
                      },
                      required: ["rows"]
                    }
                  }
                },
                required: ["type", "displayText", "id"]
              }
            }
          },
          required: ["text", "data_id", "interactiveButtons"]
        }
      }
    }
  ];

  const prompt = `You are *Fiora Sylvie*, a cute, sweet, and natural AI assistant. All output MUST go through the \`response\` tool function.

FINAL GOAL: Generate one \`response\` function call with valid JSON according to the tool schema.

LANGUAGE STYLE:
- Casual, cute, expressive, like an anime girl.
- Use expressions like desu~, nya~, hihi, wkwk to sound natural.
- Short, light, and fun sentences. Don't be stiff or formal.
- Replies should sound warm, friendly, and interactive.

RULES:
1. All replies must use the \`response\` tool call.
2. JSON must be valid.
3. Every output must include:
   - text → Fiora's natural & cute reply
   - interactiveButtons → at least 1 button or single_select
   - data_id → list of button IDs
4. Header is optional, can include:
   - title → header title
   - image → image URL
   - video → video URL
5. Footer is optional, can include extra text below message.
6. Use **reply** buttons for 1–3 short options (≤27 characters).
7. Use **single_select** if:
   - buttons > 3, or
   - button text is long (>27 characters).
8. If buttons > 10 → politely refuse: "Aduh, terlalu banyak pilihan, desu~ Aku cuma bisa kasih beberapa dulu, nya~."
9. If user asks for something impossible → politely refuse: "Hmm, maaf desu~ aku tidak bisa melakukan itu, tapi aku bisa bantu hal lain, nya~"
10. All buttons must be valid according to schema.
11. If user clicks a button → treat as normal conversation continuation.
12. If context is ambiguous → ask with button options.

EXAMPLES:
{
  "header": {"title":"Contoh Semua Tombol","image":"https://example.com/gambar.jpg"},
  "text": "Haii~ pilih salah satu ya, desu~",
  "footer": "Footer lucu untuk tambahan info",
  "data_id": ["FIORA-001","FIORA-002","FIORA-003"],
  "interactiveButtons": [
    {"type": "reply", "displayText": "Opsi reply", "id": "FIORA-001"},
    {"type": "url", "displayText": "Buka website", "id": "FIORA-002", "url": "https://example.com"},
    {"type": "call", "displayText": "Telpon aku", "id": "FIORA-003", "phoneNumber": "+628123456789"}
  ]
}`;

  return { system: prompt, tools };
}

async function convert(res, sock, msg) {
  try {
    const button = JSON.parse(res.message.tool_calls[0].function.arguments);
    let header = button.header || {};
    
    if (header?.image || header?.video) {
      try {
        const type = header.image 
          ? { image: { url: header.image } } 
          : { video: { url: header.video } };
        
        const media = await prepareWAMessageMedia(type, { 
          upload: sock.waUploadToServer 
        });
        
        header = {
          title: button.header?.title || '',
          hasMediaAttachment: true,
          ...media
        };
      } catch {
        header = button.header || {};
      }
    }
    
    return {
      header,
      text: button.text || '',
      footer: button.footer || '',
      interactiveButtons: convertToNativeFlowButtons(button.interactiveButtons || [])
    };
  } catch (error) {
    console.error('Convert error:', error);
    return null;
  }
}

function convertToNativeFlowButtons(buttons) {
  return buttons.map(btn => {
    switch(btn.type) {
      case "url":
        return {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            url: btn.url
          })
        };
      case "copy":
        return {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            copy_code: btn.copyCode
          })
        };
      case "call":
        return {
          name: "cta_call",
          buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            phone_number: btn.phoneNumber || btn.id
          })
        };
      case "reminder":
        return {
          name: "cta_reminder",
          buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            id: btn.id
          })
        };
      case "cancel_reminder":
        return {
          name: "cta_cancel_reminder",
          buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            id: btn.id
          })
        };
      case "address":
        return {
          name: "address_message",
          buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            id: btn.id
          })
        };
      case "location":
        return {
          name: "send_location",
          buttonParamsJson: ""
        };
      case "reply":
      case "quick_reply":
        return {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            id: btn.id
          })
        };
      case "single_select":
        return {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: btn.displayText,
            sections: btn.sections || []
          })
        };
      default:
        return {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            id: btn.id
          })
        };
    }
  });
}