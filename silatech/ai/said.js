import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.CLEAN_API_KEY, // cc_... yako kutoka.env
  baseURL: "https://cleanapis.com/v1",
});

const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    description: "Get the current weather for a city",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
  },
}];

// fake weather function - weka real API yako hapa
async function get_weather(city){
  return { temp_c: 31, sky: "humid", city };
}

export default {
  name: 'aai',
  alias: ['gpt','cleanai','ask'],
  category: 'ai',
  async execute(sock, msg, args, prefix){
    const sender = msg.key.remoteJid;
    const prompt = args.join(' ').trim();
    if(!prompt) return sock.sendMessage(sender,{text:`Usage: ${prefix}ai <swali>\nEx: ${prefix}ai What is weather in Dhaka?`});

    if(!process.env.CLEAN_API_KEY) return sock.sendMessage(sender,{text:'✖ CLEAN_API_KEY missing in.env'});

    try{
      await sock.sendMessage(sender,{text:'✦ Thinking...'});

      let messages = [{ role: "user", content: prompt }];

      // model - badilisha kwa moja yenye Tools capability
      const MODEL = "claude-opus-4.8"; // au gpt-4o, claude-sonnet-4 etc

      let response = await client.chat.completions.create({
        model: MODEL,
        messages: messages,
        tools: tools,
      });

      let message = response.choices[0].message;

      // kama AI imeita tool
      if(message.tool_calls){
        messages.push(message);
        for(const call of message.tool_calls){
          if(call.function.name === "get_weather"){
            const args = JSON.parse(call.function.arguments);
            const result = await get_weather(args.city);
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify(result),
            });
          }
        }
        // second call na tool result
        const final = await client.chat.completions.create({
          model: MODEL,
          messages: messages,
          tools: tools,
        });
        await sock.sendMessage(sender,{text: final.choices[0].message.content},{quoted: msg});
      }else{
        // direct answer - kama Hello!
        await sock.sendMessage(sender,{text: message.content},{quoted: msg});
      }

    }catch(e){
      console.error(e);
      await sock.sendMessage(sender,{text:`✖ AI Error: ${e.message}`});
    }
  }
};