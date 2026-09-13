const qrHtml = (initialText) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<style>
:root{--card-2:#2a3942;--ink:#e9edef;--ink-soft:#aebac1;--muted:#8696a0;--accent:#00a884;
--line:#2a3942;--line-strong:#374248;--cell-bg:#111b21;
--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow-x:hidden;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.qrbox{background:#fff;border-radius:12px;padding:18px;display:flex;align-items:center;justify-content:center;min-height:200px;}
#qrcanvas{display:flex;}
.field{margin-top:16px;}
.field label{font-size:11px;color:var(--muted);display:block;margin-bottom:6px;}
.field input{width:100%;background:var(--cell-bg);border:1px solid var(--line);border-radius:8px;padding:11px 12px;color:var(--ink);font-family:inherit;font-size:13px;}
.field input:focus{outline:none;border-color:var(--accent);}
.row{display:flex;gap:8px;margin-top:10px;}
.row button{flex:1;font-family:inherit;font-size:13px;border-radius:8px;padding:11px 0;cursor:pointer;}
.btn-primary{background:var(--accent);border:none;color:#0b141a;font-weight:700;}
.btn-secondary{background:var(--card-2);border:1px solid var(--line-strong);color:var(--ink);}
.presets{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}
.chip{background:transparent;border:1px solid var(--line-strong);border-radius:16px;padding:7px 12px;font-size:11px;color:var(--ink-soft);cursor:pointer;font-family:inherit;}
.chip:active{background:var(--accent);color:#0b141a;border-color:var(--accent);}
.hint{font-size:11px;color:var(--muted);text-align:center;margin-top:12px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA QR Generator</div>
      <div class="header__sub">Tool</div>
    </div>
    <div class="qrbox"><div id="qrcanvas"></div></div>
    <div class="field">
      <label>Text or link</label>
      <input id="text" type="text" placeholder="https://example.com or any text" />
    </div>
    <div class="row">
      <button class="btn-primary" id="gen">Generate</button>
      <button class="btn-secondary" id="dl">Download PNG</button>
    </div>
    <div class="presets" id="presets"></div>
    <div class="hint">Type anything — a link, WiFi text, or plain message</div>
  </div>
</main>
<script>
(function(){
const initial=${JSON.stringify(initialText || 'https://wa.me/')};
const input=document.getElementById('text');
const canvasWrap=document.getElementById('qrcanvas');
let qr=null;
input.value=initial;

function render(text){
  canvasWrap.innerHTML='';
  if(!text.trim()){ text=' '; }
  qr=new QRCode(canvasWrap,{
    text:text,
    width:180,
    height:180,
    colorDark:'#0b141a',
    colorLight:'#ffffff',
    correctLevel:QRCode.CorrectLevel.M
  });
}
document.getElementById('gen').addEventListener('click',()=>render(input.value));
document.getElementById('dl').addEventListener('click',()=>{
  const img=canvasWrap.querySelector('img')||canvasWrap.querySelector('canvas');
  if(!img) return;
  const link=document.createElement('a');
  link.download='sila-qr.png';
  link.href=img.src||img.toDataURL('image/png');
  link.click();
});
const PRESETS=[
  {label:'WhatsApp me',val:'https://wa.me/'},
  {label:'My website',val:'https://'},
  {label:'Plain text',val:'Hello from SILA TECH'},
  {label:'Email',val:'mailto:'}
];
const presetsEl=document.getElementById('presets');
PRESETS.forEach(p=>{
  const b=document.createElement('button');
  b.className='chip';
  b.textContent=p.label;
  b.addEventListener('click',()=>{ input.value=p.val; input.focus(); });
  presetsEl.appendChild(b);
});
input.addEventListener('keydown',(e)=>{ if(e.key==='Enter') render(input.value); });
render(initial);
})();
</script>
</body>
</html>
`;

export default {
  name: 'qr',
  alias: ['qrcode', 'qrgen'],
  description: 'Generate a QR code from text or a link in WhatsApp',
  category: 'tools',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    try {
      const initialText = args && args.length ? args.join(' ') : '';
      const responseId = 'sila-qr-' + Date.now();
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
              submessages: [{ messageType: 2, messageText: "🔲 QR Generator" }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [{
                    "view_model": {
                      "primitive": {
                        "__typename": "GenAIaeacdsnwHtmlPrimitive",
                        "payload": qrHtml(initialText),
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
      console.error('[QR]', error);
      await sock.sendMessage(sender, { text: `✖ Error: ${error?.message || error}` }, { quoted: msg });
    }
  }
};
