const rpsHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{--bg:transparent;--card-2:#2a3942;--ink:#e9edef;--ink-soft:#aebac1;--muted:#8696a0;
--accent:#00a884;--line:#2a3942;--line-strong:#374248;--cell-bg:#111b21;
--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow-x:hidden;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.score{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:16px;}
.score b{color:var(--ink);font-weight:600;margin-left:4px;}
.arena{display:flex;align-items:center;justify-content:space-around;background:var(--cell-bg);border:1px solid var(--line);border-radius:12px;padding:24px 12px;margin-bottom:16px;min-height:130px;}
.slot{font-size:52px;line-height:1;transition:transform .25s ease;}
.slot.shake{animation:shake .6s ease infinite;}
@keyframes shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}
.vs{font-size:12px;color:var(--muted);}
.result{text-align:center;font-size:14px;color:var(--ink-soft);min-height:20px;margin-bottom:16px;}
.result.win{color:var(--accent);font-weight:600;}
.result.lose{color:#e05c5c;font-weight:600;}
.choices{display:flex;gap:10px;}
.choice{flex:1;background:var(--card-2);border:1px solid var(--line-strong);border-radius:12px;padding:16px 0;font-size:32px;cursor:pointer;transition:transform .12s ease,border-color .15s ease;}
.choice:active{transform:scale(.92);}
.choice:hover{border-color:var(--accent);}
.footer{margin-top:14px;display:flex;justify-content:center;}
.footer__reset{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:8px 16px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Rock Paper Scissors</div>
      <div class="header__sub">VS AI</div>
    </div>
    <div class="score">
      <span>You<b id="s-you">0</b></span>
      <span>Draw<b id="s-draw">0</b></span>
      <span>AI<b id="s-ai">0</b></span>
    </div>
    <div class="arena">
      <div class="slot" id="you-slot">❔</div>
      <div class="vs">VS</div>
      <div class="slot" id="ai-slot">❔</div>
    </div>
    <div class="result" id="result">Pick your move</div>
    <div class="choices">
      <button class="choice" data-c="rock">🪨</button>
      <button class="choice" data-c="paper">📄</button>
      <button class="choice" data-c="scissors">✂️</button>
    </div>
    <div class="footer"><button class="footer__reset" id="reset">Reset score</button></div>
  </div>
</main>
<script>
(function(){
const EMOJI={rock:'🪨',paper:'📄',scissors:'✂️'};
const BEATS={rock:'scissors',paper:'rock',scissors:'paper'};
let score={you:0,ai:0,draw:0};
const youSlot=document.getElementById('you-slot');
const aiSlot=document.getElementById('ai-slot');
const result=document.getElementById('result');
let locked=false;

document.querySelectorAll('.choice').forEach(b=>{
  b.addEventListener('click',()=>play(b.dataset.c));
});
document.getElementById('reset').addEventListener('click',()=>{
  score={you:0,ai:0,draw:0};updateScore();
  youSlot.textContent='❔';aiSlot.textContent='❔';
  result.textContent='Pick your move';result.className='result';
});

function play(choice){
  if(locked) return;
  locked=true;
  youSlot.textContent=EMOJI[choice];
  aiSlot.classList.add('shake');
  result.textContent='...';result.className='result';
  setTimeout(()=>{
    const options=['rock','paper','scissors'];
    const ai=options[Math.floor(Math.random()*3)];
    aiSlot.classList.remove('shake');
    aiSlot.textContent=EMOJI[ai];
    let outcome;
    if(ai===choice) outcome='draw';
    else if(BEATS[choice]===ai) outcome='win';
    else outcome='lose';
    if(outcome==='win'){score.you++;result.textContent='You win! 🎉';result.className='result win';}
    else if(outcome==='lose'){score.ai++;result.textContent='AI wins!';result.className='result lose';}
    else {score.draw++;result.textContent="It's a draw";result.className='result';}
    updateScore();
    locked=false;
  },700);
}
function updateScore(){
  document.getElementById('s-you').textContent=score.you;
  document.getElementById('s-ai').textContent=score.ai;
  document.getElementById('s-draw').textContent=score.draw;
}
})();
</script>
</body>
</html>
`;

export default {
  name: 'rps',
  alias: ['bunanabakolamawe', 'rockpaperscissors', 'kikaratasimkasi'],
  description: 'Play Rock Paper Scissors vs AI in WhatsApp',
  category: 'games',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const responseId = 'sila-rps-' + Date.now();
      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: "0cCzjnQ5ERoqM2QrQ7KjmMfxsyeWYu+61/chr2wioyE=",
          botMetadata: { messageDisclaimerText: "", botResponseId: responseId }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: "🪨📄✂️ Rock Paper Scissors" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": rpsHtml,
                        "trusted_sources": ["sila-tech"]
                      },
                      "__typename": "GenAISingleLayoutViewModel"
                    }
                  }]
                })).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                forwardOrigin: 4
              }
            }
          }
        }
      };
      await sock.relayMessage(sender, content, {});
    } catch (error) {
      console.error('[RPS]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
