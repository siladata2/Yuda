import { randomUUID } from 'crypto';

export default {
  name: 'gamehub',
  alias: ['games', 'game', 'play'],
  description: 'Play games inside WhatsApp',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      const responseId = randomUUID();
      
      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: '',
            botResponseId: 'f090cd0f-bad1-4a4a-b0c3-b8f8e852c197',
            verificationMetadata: {
              proofs: [{
                version: 1,
                useCase: 1,
                signature: 'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YY28GDo8OXSlgg==',
                certificateChain: [
                  'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGE663ESCbLizCieg4wPebEFhVgH2dAgtZ8ajRuM4EY9p4BB4ay1X8InJh4KPu2GGhxlhPifhj3TFWzDND9OoPAx9ngvHgJ7qW+qq4UWIO3BxUoSc1UlkrSRYrDad3Oddz6dbHJqguhpE4JQ9nTyVT3lFWnuMg2oBEXG2mkdFR1fOnKG03454VeAGFLQfQMoAlq7AfmTFVXn45X8kMduwwCFuSE3sIF8uAMhP5Ng1Rn+mMmGZfne5RsyCa4wuHhv9p5KVKgnP8NXF6Sv6kAx5Dcer/qxZRaofRXTp7kSenmU+HU1w9KQfsEpHdbsfoRXKsscYm2KYl45U+FaFWbdaM1SXso3kE7SmMbNNCoJyX1ra8qoCXn940lJ3NjAb/7V6FjV7kHXXQycABxEtM7f3XaWzBMAnHMv43vTYv0g14snH90OpBPAJoOqA9Fhd+7636dOAT1pEQfCaghq/oSE2+/c0pbXK20WxtrzJnGRO6Kiy3R9KWMiPlbQu5Npoiu25PMFqujhoZiteQY3EoQnxLCHWZuV7ozseUrnfCbSGuzIvvd2iwx3z7k2Vlh5+vuiM9/j6/tstk5KG0AhP/G4aOAnbQfnowH1jpCC51Onnoz9eXDBwYOmA/QCiLgIL9PcJUoMPERaX0bp3Oy5q77VNVzFhIWFWVukfWn7uNmZgKFqfPzLAiy5nBEwfSrf23tmXxjbF0131XO1KbraDB0TVktoWMF45Y2U81rB4yD7WR+MFxMRaA3EF+jC6i/+giHnUHRhb3F4BF3derq03u1EmegX6dnt43U5dnSZmJb9pmQslhBaFlWJqRK82gqfdRtT5r4Q/wamUUgrIGjS',
                  'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGFOvdeboN7QHpWcPzdiI0ToTcoQmXrfuUIXi8v7akW/tOniN+d81uRd3SAcEEBKYyU3FCvolzcQCSd/P1+7jc8AwUqwp7OE0QpcJmqTO7EBLHQHx5B2gEZN0+ELrpuGdG3pQRVs7UB0bhTChnGR3asNYE6akIIrcMBKLaH0A+RjpJ0cOMh4Im9ZysfMWlFkng2Q0rmbBjxmxt/uY2hMDC6FAT6Agty8fSMQZAqU1KgbDpe/0kHA1p0U04N2t7xgi/zCsrPIHrq3YSKn1pYAmUeT+F/CK5Wz2SsEN7DicSMzHsK5XMJ0sWFp4ICrmSp+n5dhzrW/rt2ZB6sEyX4ll1z0dRuApMLNV4+j96Ir+0FzQ1QwNzMDHdQMSYXJulErBjjuK7j6BPG3lGd6yaGIZbfkZmL4ohq/thIIFP99JsUppkox0ENCmXkcwYfvTw8Ob+fv5VeTycFXUIufKV/Sc16Yf4bi5Hlr1U/zQRb/T86KHxUBBYuDW4F0PbrOZUGKaWKoWlHG2ZLTxLYomYbS/K7EyF6zjeLLioB/kQOtqD1K8R5u4tl7WnauJLV6jANHFWRflWdoBTETbgVE2Jew46vvQlk6VQKlava48yGAjZWvjkGCsZWUSu5azahZh9FbNbc/Z/cbY7++g2xxpTFywh698xyGsO4WSEIT9zWv3+esKut+/1BTu/hVZReQnU9NaJSeMpysUZmWmVM0FNQPPNrfYrj6p25MtyfjVT/AtCgEhNrin5q8unHgfDRUpi7WffTH3NFVVHcfOrc99/wHfAHUtAEFTdzjHSwJ+AODaXf/zbAnGXHqKgtcnesf+UhbPBK6HYX0T95EgGOUzwNPujmKUrcKNDFeCksP2QXSZiT1J03T/sGgIBABuuu6UoA1l8Id7qOtDl9umuZVsxFoXfVEzOR702oL3fwCCWJr8U9UJ6aUHa4o/lXP/zFoC4rV9DFvntb5HfPDL2taOmYocN1iI3l9rl4S+Pvoo8iFjRrwJAikIgZ+pbX137sfKdETrgw0QuW+khRtsj6Q90s3vmI/bxRNASxBKws92R/JCSZUenpRtSUrRoY9mvFlq7qsbAWkGA09lzFCVB/sK/kXJLBGgx+298TvhBYyOw=='
                ]
              }]
            }
          }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{
                messageType: 2,
                messageText: '> popioo'
              }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  response_id: '183d0aee-fb35-4349-8bc5-7793b11859db',
                  sections: [{
                    view_model: {
                      primitive: {
                        text: '> popioo',
                        __typename: 'GenAIMarkdownTextUXPrimitive'
                      },
                      __typename: 'GenAISingleLayoutViewModel'
                    }
                  }],
                  embedded_screens: [{
                    title: '✦ Games Hub',
                    content: [
                      {
                        __typename: 'FOAIDNixelButtonSheets',
                        tabs: [
                          {
                            id: 'tab_0',
                            tab_header: 'Dino Runner',
                            sections: [{
                              __typename: 'GenAIUnifiedResponseSection',
                              view_model: {
                                __typename: 'GenAISingleLayoutViewModel',
                                primitive: {
                                  __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                  payload: `<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}</style>
<body style="margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:manipulation;cursor:pointer">
<div style="width:100%;max-width:620px;margin:auto;padding:16px;box-sizing:border-box">
<div style="background:rgba(255,255,255,.06);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.15);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35)">
<div style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center">
<div><div style="font-size:11px;letter-spacing:1.5px;color:rgba(255,255,255,.45)">SILA GAMES</div><div style="font-size:21px;font-weight:bold;color:#fff">Dino Runner</div></div>
<div style="text-align:right"><div id="score" style="font-size:18px;font-weight:bold;color:#fff;text-shadow:0 0 10px rgba(108,92,231,.85);transition:transform .15s">00000</div><div id="best" style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px">BEST 00000</div></div>
</div>
<div style="padding:18px">
<canvas id="game" width="560" height="190" style="width:100%;height:auto;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.12);border-radius:12px;display:block"></canvas>
<div id="status" style="text-align:center;margin-top:10px;font-size:12px;color:rgba(255,255,255,.55)">Speed 5.0x</div>
</div></div></div>
<script>
const c=document.getElementById('game'),x=c.getContext('2d'),scoreEl=document.getElementById('score'),bestEl=document.getElementById('best'),statusEl=document.getElementById('status');
const GY=170;
let d,o,clouds,particles,ambient,trail,score,best=0,speed,gameOver,last,shake,flash,runT,spawnTimer,milestone,squash;
function loadBest(){
let vals=[];
try{let v=localStorage.getItem('dino_best');if(v)vals.push(parseInt(v,10))}catch(e){}
try{let v=sessionStorage.getItem('dino_best');if(v)vals.push(parseInt(v,10))}catch(e){}
try{let m=document.cookie.match(/(?:^|;\\s*)dino_best=(\\d+)/);if(m)vals.push(parseInt(m[1],10))}catch(e){}
return vals.length?Math.max(...vals.filter(v=>!isNaN(v))):0
}
function saveBest(v){
let val=String(Math.floor(v));
try{localStorage.setItem('dino_best',val)}catch(e){}
try{sessionStorage.setItem('dino_best',val)}catch(e){}
try{document.cookie='dino_best='+val+';max-age=31536000;path=/'}catch(e){}
try{
let rq=indexedDB.open('dino_db',1);
rq.onupgradeneeded=()=>{rq.result.createObjectStore('kv')};
rq.onsuccess=()=>{try{rq.result.transaction('kv','readwrite').objectStore('kv').put(val,'dino_best')}catch(e){}}
}catch(e){}
}
function loadBestAsync(cb){
try{
let rq=indexedDB.open('dino_db',1);
rq.onupgradeneeded=()=>{rq.result.createObjectStore('kv')};
rq.onsuccess=()=>{
try{
let gr=rq.result.transaction('kv','readonly').objectStore('kv').get('dino_best');
gr.onsuccess=()=>{if(gr.result)cb(parseInt(gr.result,10))}
}catch(e){}
}
}catch(e){}
}
best=loadBest();
loadBestAsync(v=>{if(!isNaN(v)&&v>best){best=v;bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0')}});
function reset(){
d={x:55,y:132,w:27,h:30,vy:0,jumping:false};
o=[];
clouds=[{x:120,y:32,w:44,s:.35},{x:300,y:52,w:60,s:.22},{x:460,y:26,w:36,s:.4},{x:560,y:70,w:50,s:.18}];
particles=[];
trail=[];
if(!ambient){ambient=[];for(let i=0;i<18;i++)ambient.push({x:Math.random()*c.width,y:Math.random()*c.height,r:.5+Math.random()*1.5,vx:.1+Math.random()*.3,ph:Math.random()*10})}
score=0;speed=5;gameOver=false;last=0;shake=0;flash=0;runT=0;milestone=0;squash=1;
spawnTimer=70+Math.random()*30;
bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0');
statusEl.textContent='Speed 5.0x'
}
function burst(px,py,n,col,spd){for(let i=0;i<n;i++)particles.push({x:px,y:py,vx:(Math.random()-.5)*spd,vy:-Math.random()*spd,life:1,col,size:2+Math.random()*2})}
function jumpDino(){
if(gameOver){reset();return}
if(!d.jumping){d.jumping=true;d.vy=-13;squash=.7;burst(d.x+13,d.y+30,10,'255,255,255',4)}
}
function cactus(){
let h=24+Math.random()*24;
o.push({x:c.width+20,y:GY-h,w:16+Math.random()*6,h});
if(Math.random()<.22){o.push({x:c.width+20+34+Math.random()*10,y:GY-(20+Math.random()*18),w:16,h:20+Math.random()*18})}
}
function hit(a,b){return a.x+4<b.x+b.w&&a.x+a.w-4>b.x&&a.y+4<b.y+b.h&&a.y+a.h>b.y}
function drawTrail(){
trail.forEach((p,i)=>{x.fillStyle='rgba(108,92,231,'+(.25*(i/trail.length))+')';x.fillRect(p.x,p.y,27,30)})
}
function drawDino(){
x.save();
let cx=d.x+13,cy=d.y+30;
x.translate(cx,cy);
x.scale(1/squash,squash);
x.translate(-cx,-cy);
let legOff=d.jumping?0:Math.sin(runT*.5)*5;
x.fillStyle='#eaeaea';
x.fillRect(d.x,d.y,27,30);
x.fillRect(d.x+22,d.y+5,13,18);
x.fillStyle='#6c5ce7';
x.fillRect(d.x+29,d.y+8,4,4);
x.fillStyle='#eaeaea';
x.fillRect(d.x+5,d.y+30,6,8+legOff);
x.fillRect(d.x+20,d.y+30,6,8-legOff);
x.restore()
}
function drawCactus(q){
x.save();
x.shadowColor='rgba(255,90,90,.35)';x.shadowBlur=10;
x.fillStyle='#e17a7a';
x.fillRect(q.x,q.y,q.w,q.h);
x.fillRect(q.x-7,q.y+10,7,6);
x.fillRect(q.x-7,q.y+4,6,12);
x.fillRect(q.x+q.w,q.y+18,7,6);
x.fillRect(q.x+q.w+1,q.y+12,6,12);
x.restore()
}
function drawParticles(){
particles.forEach(p=>{x.fillStyle='rgba('+p.col+','+Math.max(p.life,0)+')';x.fillRect(p.x,p.y,p.size,p.size)})
}
function drawAmbient(){
ambient.forEach(p=>{let a=.15+Math.sin(runT*.05+p.ph)*.1;x.fillStyle='rgba(180,160,255,'+a+')';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()})
}
function draw(){
x.clearRect(0,0,c.width,c.height);
x.save();
if(shake>0)x.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
drawAmbient();
x.fillStyle='rgba(255,255,255,.35)';
clouds.forEach(q=>{let b=Math.sin(runT*.03+q.x)*2;x.fillRect(q.x,q.y+b,q.w,5);x.fillRect(q.x+10,q.y+b-5,q.w*.45,10)});
x.strokeStyle='rgba(255,255,255,.25)';
x.lineWidth=2;
x.setLineDash([10,8]);
x.lineDashOffset=-runT*speed*.6;
x.beginPath();x.moveTo(0,GY);x.lineTo(c.width,GY);x.stroke();
x.setLineDash([]);
drawTrail();
drawDino();
o.forEach(drawCactus);
drawParticles();
if(flash>0){x.fillStyle='rgba(255,60,60,'+(flash*.35)+')';x.fillRect(0,0,c.width,c.height)}
x.restore();
if(gameOver){
x.fillStyle='rgba(15,15,25,.55)';x.fillRect(0,0,c.width,c.height);
x.fillStyle='#fff';x.textAlign='center';
x.font='bold 24px Arial';x.fillText('GAME OVER',c.width/2,85);
x.font='14px Arial';x.fillText('Tap layar untuk main lagi',c.width/2,112);
x.textAlign='left'
}
}
function loop(t){
if(!last)last=t;
let dt=Math.min((t-last)/16.67,2);
last=t;
runT+=dt;
if(!gameOver){
d.y+=d.vy*dt;d.vy+=.75*dt;
if(d.y>=132){
if(d.jumping){burst(d.x+13,GY,10,'255,255,255',3.5);squash=1.35}
d.y=132;d.vy=0;d.jumping=false
}
if(d.jumping)trail.push({x:d.x,y:d.y});
if(trail.length>6)trail.shift();
if(!d.jumping)trail.length=0;
squash+=(1-squash)*.18*dt;
if(!d.jumping&&Math.floor(runT)%8===0&&Math.random()<.4)burst(d.x+6,GY-2,1,'255,255,255',1.5);
ambient.forEach(p=>{p.x-=p.vx*dt;if(p.x<-4)p.x=c.width+4});
spawnTimer-=dt;
if(spawnTimer<=0){cactus();spawnTimer=Math.max(38,62-speed*1.4)+Math.random()*30}
o.forEach(q=>q.x-=speed*dt);
o=o.filter(q=>q.x>-40);
clouds.forEach(q=>{q.x-=q.s*dt;if(q.x<-80)q.x=c.width+Math.random()*100});
particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.3*dt;p.life-=.03*dt});
particles=particles.filter(p=>p.life>0);
speed=Math.min(11,speed+.0018*dt);
score+=dt*.6;
if(score>best)best=score;
if(Math.floor(score/500)>milestone){
milestone=Math.floor(score/500);
scoreEl.style.transform='scale(1.35)';
setTimeout(()=>scoreEl.style.transform='scale(1)',150)
}
scoreEl.textContent=String(Math.floor(score)).padStart(5,'0');
bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0');
statusEl.textContent='Speed '+speed.toFixed(1)+'x';
for(const q of o)if(hit(d,q)){
gameOver=true;shake=14;flash=1;
saveBest(best);
burst(d.x+13,d.y+15,18,'255,90,90',5)
}
}
if(shake>0)shake=Math.max(0,shake-.6*dt);
if(flash>0)flash=Math.max(0,flash-.05*dt);
draw();
requestAnimationFrame(loop)
}
document.addEventListener('pointerdown',e=>{e.preventDefault();jumpDino()});
document.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();jumpDino()}});
reset();
requestAnimationFrame(loop);
</script></body>`,
                                  url: 'https://nixel.dev',
                                  trusted_sources: ['nixel.dev']
                                }
                              }
                            }]
                          },
                          {
                            id: 'tab_1',
                            tab_header: 'Tic Tac Toe',
                            sections: [{
                              __typename: 'GenAIUnifiedResponseSection',
                              view_model: {
                                __typename: 'GenAISingleLayoutViewModel',
                                primitive: {
                                  __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                  payload: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tic-Tac-Toe</title>
<style>
:root{--bg:transparent;--card:transparent;--card-2:#2a3942;--ink:#e9edef;--ink-soft:#aebac1;--muted:#8696a0;--accent:#00a884;--accent-2:#008069;--line:#2a3942;--line-strong:#374248;--cell-bg:#111b21;--o:#00a884;--x:#e9edef;--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 16px}
.card{width:100%;max-width:280px}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--line);gap:8px}
.header__title{font-size:17px;font-weight:600;color:var(--ink);letter-spacing:-.005em}
.header__sub{font-size:12px;color:var(--muted)}
.status{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:13px;gap:8px}
.status__turn{display:flex;align-items:center;gap:8px;color:var(--ink-soft)}
.status__indicator{width:9px;height:9px;border-radius:50%;background:var(--x);position:relative;flex-shrink:0;transition:background .2s ease}
.status__indicator.is-o{background:var(--o)}
.status__indicator.is-thinking::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:1.5px solid var(--o);animation:ring 1.1s ease-out infinite}
@keyframes ring{0%{transform:scale(.7);opacity:1}100%{transform:scale(2.2);opacity:0}}
.status__score{display:flex;gap:12px;font-variant-numeric:tabular-nums;color:var(--muted);font-size:12px}
.status__score b{color:var(--ink);font-weight:600;margin-left:3px}
.board{width:100%;aspect-ratio:1;position:relative;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;background:var(--cell-bg);border-radius:8px;overflow:hidden;border:1px solid var(--line)}
.cell{position:relative;background:transparent;border:none;cursor:pointer;padding:0;font-family:inherit;color:inherit}
.cell:disabled{cursor:default}
.cell:focus-visible{outline:2px solid var(--accent);outline-offset:-3px}
.cell::before{content:'';position:absolute;right:0;top:6%;bottom:6%;width:1px;background:var(--line-strong)}
.cell:nth-child(3n)::before{display:none}
.cell::after{content:'';position:absolute;bottom:0;left:6%;right:6%;height:1px;background:var(--line-strong)}
.cell:nth-last-child(-n+3)::after{display:none}
.cell.is-winning{background:rgba(0,168,132,0.14)}
.cell.is-winning-x{background:rgba(233,237,239,0.07)}
.mark{position:absolute;inset:22%;pointer-events:none}
.mark__svg{width:100%;height:100%;overflow:visible}
.mark__svg path,.mark__svg circle{fill:none;stroke:var(--x);stroke-width:9;stroke-linecap:round}
.mark--o .mark__svg path,.mark--o .mark__svg circle{stroke:var(--o)}
.mark__svg path{stroke-dasharray:120;stroke-dashoffset:120;animation:draw .3s ease-out forwards}
.mark__svg path:nth-child(2){animation-delay:.12s}
.mark__svg circle{stroke-dasharray:220;stroke-dashoffset:220;animation:draw .4s ease-out forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.winning-line{position:absolute;height:4px;background:var(--o);transform-origin:left center;z-index:5;pointer-events:none;border-radius:2px}
.winning-line.is-x{background:var(--x)}
.levels{margin-top:10px}
.levels__label{font-size:11px;color:var(--muted);margin-bottom:6px}
.levels__list{display:flex;flex-wrap:nowrap;gap:8px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;padding:2px 2px 4px;margin:0 -2px}
.levels__list::-webkit-scrollbar{display:none}
.level{background:transparent;border:1px solid var(--line-strong);border-radius:20px;padding:8px 14px;font-size:12px;font-weight:500;color:var(--ink-soft);cursor:pointer;font-family:inherit;transition:color .15s ease,border-color .15s ease,background .15s ease;white-space:nowrap;flex-shrink:0}
.level:hover{color:var(--ink);border-color:var(--ink-soft)}
.level.is-active{background:var(--accent);border-color:var(--accent);color:#0b141a}
.level:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.footer{margin-top:8px;display:flex;justify-content:center}
.footer__reset{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:8px 16px;transition:color .15s ease}
.footer__reset:hover{color:var(--ink)}
.footer__reset:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.modal{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .3s ease}
.modal.is-open{opacity:1;pointer-events:auto}
.modal__backdrop{position:absolute;inset:0;background:transparent}
.modal__card{position:relative;background:var(--card-2);border-radius:12px;padding:24px 24px 0;text-align:center;max-width:300px;width:100%;box-shadow:0 24px 50px -12px rgba(0,0,0,0.6);transform:translateY(8px) scale(.96);transition:transform .35s cubic-bezier(.34,1.56,.64,1);overflow:hidden}
.modal.is-open .modal__card{transform:translateY(0) scale(1)}
.modal__title{font-size:20px;font-weight:700;letter-spacing:-.015em;color:var(--ink);margin-bottom:8px;line-height:1.25}
.modal__title.is-o{color:var(--o)}
.modal__sub{font-size:14px;color:var(--muted);margin-bottom:20px;line-height:1.4}
.modal__retry{background:transparent;border:none;color:var(--accent);font-family:inherit;font-size:16px;font-weight:600;letter-spacing:-.005em;cursor:pointer;padding:14px 24px;width:100%;border-top:1px solid var(--line-strong);transition:color .15s ease}
.modal__retry:hover{color:var(--ink)}
.modal__retry:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
@media (max-width:380px){.stage{padding:12px 10px}.level{padding:7px 12px;font-size:11px}.modal__title{font-size:18px}}
</style>
</head>
<body>
<main class="stage">
<div class="card">
<div class="header"><div class="header__title">Tic-Tac-Toe</div><div class="header__sub">vs AI</div></div>
<div class="status" aria-live="polite">
<div class="status__turn"><span class="status__indicator" id="indicator"></span><span id="status-text">Your turn</span></div>
<div class="status__score"><span>You<b id="score-x">0</b></span><span>Draw<b id="score-d">0</b></span><span>AI<b id="score-o">0</b></span></div>
</div>
<div class="board" id="board" role="grid" aria-label="Game board"></div>
<div class="levels"><div class="levels__label">Difficulty</div><div class="levels__list" id="levels-list" role="radiogroup" aria-label="Difficulty"></div></div>
<div class="footer"><button class="footer__reset" id="reset">New Game</button></div>
</div>
</main>
<div class="modal" id="modal" hidden><div class="modal__backdrop" id="modal-backdrop"></div><div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 class="modal__title" id="modal-title">You win</h2><p class="modal__sub" id="modal-sub">Great job. Play again?</p><button class="modal__retry" id="modal-retry">Play again</button></div></div>
<script>
const state={board:Array(9).fill(null),human:'X',ai:'O',turn:'X',over:false,winner:null,line:null,thinking:false,level:2,scores:{X:0,O:0,D:0}};
const LEVELS=[{name:'Beginner'},{name:'Trained'},{name:'Tactician'},{name:'Master'}];
const WIN_LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const $=id=>document.getElementById(id);
const boardEl=$('board'),statusText=$('status-text'),indicator=$('indicator');
const levelsList=$('levels-list');
const scoreX=$('score-x'),scoreO=$('score-o'),scoreD=$('score-d');
const modal=$('modal');
function buildBoard(){boardEl.innerHTML='';for(let i=0;i<9;i++){const c=document.createElement('button');c.className='cell';c.setAttribute('role','gridcell');c.setAttribute('aria-label',\`Cell \${i+1}\`);c.dataset.idx=i;c.addEventListener('click',()=>onCell(i));boardEl.appendChild(c)}}
function buildLevels(){levelsList.innerHTML='';LEVELS.forEach((lvl,i)=>{const b=document.createElement('button');b.className='level'+(i===state.level?' is-active':'');b.setAttribute('role','radio');b.setAttribute('aria-checked',i===state.level?'true':'false');b.textContent=lvl.name;b.addEventListener('click',()=>setLevel(i));levelsList.appendChild(b)});}
function setLevel(i){state.level=i;document.querySelectorAll('.level').forEach((el,idx)=>{const on=idx===i;el.classList.toggle('is-active',on);el.setAttribute('aria-checked',on?'true':'false')});resetBoard();}
function markSVG(v){if(v==='X'){return '<svg class="mark__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><path d="M 22 22 L 78 78"/><path d="M 78 22 L 22 78"/></svg>'}return '<svg class="mark__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="50" r="30"/></svg>';}
function renderCell(i){const cell=boardEl.children[i];const v=state.board[i];const existing=cell.querySelector('.mark');if(v){if(!existing){const m=document.createElement('div');m.className='mark mark--'+v.toLowerCase();m.innerHTML=markSVG(v);cell.appendChild(m)}cell.disabled=true}else{if(existing)existing.remove();cell.disabled=state.over||state.thinking||state.turn!==state.human}const isWin=!!(state.line&&state.line.includes(i));cell.classList.toggle('is-winning',isWin);cell.classList.toggle('is-winning-x',isWin&&state.winner==='X');}
function render(){for(let i=0;i<9;i++)renderCell(i);if(state.over){if(state.winner==='X'){statusText.textContent='You win';indicator.className='status__indicator';}else if(state.winner==='O'){statusText.textContent='AI wins';indicator.className='status__indicator is-o';}else{statusText.textContent='Draw';indicator.className='status__indicator';}}else if(state.thinking){statusText.textContent='AI thinking...';indicator.className='status__indicator is-o is-thinking';}else{statusText.textContent=state.turn===state.human?'Your turn':'AI turn';indicator.className='status__indicator'+(state.turn===state.ai?' is-o':'');}scoreX.textContent=state.scores.X;scoreO.textContent=state.scores.O;scoreD.textContent=state.scores.D;}
function onCell(i){if(state.over||state.thinking)return;if(state.board[i]!==null)return;if(state.turn!==state.human)return;state.board[i]=state.human;renderCell(i);const r=checkWinner(state.board);if(r){endGame(r);return;}state.turn=state.ai;state.thinking=true;render();setTimeout(aiMove,380+Math.random()*340);}
function aiMove(){if(!state.thinking)return;const m=chooseAIMove();if(m===null){state.thinking=false;render();return;}state.board[m]=state.ai;renderCell(m);state.thinking=false;const r=checkWinner(state.board);if(r){endGame(r);}else{state.turn=state.human;render();}}
function chooseAIMove(){const empty=state.board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);if(!empty.length)return null;const L=state.level;if(L===0)return empty[Math.floor(Math.random()*empty.length)];if(L===1){const win=findImmediate(state.board,state.ai);if(win!==null)return win;if(Math.random()>0.15){const block=findImmediate(state.board,state.human);if(block!==null)return block;}if(state.board[4]===null)return 4;if(Math.random()>0.2){const corners=[0,2,6,8].filter(i=>state.board[i]===null);if(corners.length)return corners[Math.floor(Math.random()*corners.length)];}return empty[Math.floor(Math.random()*empty.length)];}if(L===2){if(Math.random()<0.10)return empty[Math.floor(Math.random()*empty.length)];return minimaxMove(state.board,state.ai,4);}return minimaxMove(state.board,state.ai,9);}
function findImmediate(board,player){for(const line of WIN_LINES){const cells=[board[line[0]],board[line[1]],board[line[2]]];const c=cells.filter(v=>v===player).length;const e=cells.filter(v=>v===null).length;if(c===2&&e===1)return line[cells.indexOf(null)];}return null;}
function minimaxMove(board,player,maxDepth){let best=-Infinity,moves=[];for(let i=0;i<9;i++){if(board[i]!==null)continue;board[i]=player;const s=minimax(board,player==='O'?'X':'O',0,maxDepth,-Infinity,Infinity);board[i]=null;if(s>best){best=s;moves=[i];}else if(s===best){moves.push(i);}}return moves[Math.floor(Math.random()*moves.length)];}
function minimax(board,current,depth,maxDepth,alpha,beta){const r=checkWinner(board);if(r){if(r.winner==='O')return 10-depth;if(r.winner==='X')return depth-10;return 0;}if(depth>=maxDepth)return 0;const isMax=current==='O';let best=isMax?-Infinity:Infinity;for(let i=0;i<9;i++){if(board[i]!==null)continue;board[i]=current;const s=minimax(board,current==='O'?'X':'O',depth+1,maxDepth,alpha,beta);board[i]=null;if(isMax){best=Math.max(best,s);alpha=Math.max(alpha,s);}else{best=Math.min(best,s);beta=Math.min(beta,s);}if(beta<=alpha)break;}return best;}
function checkWinner(board){for(const line of WIN_LINES){const [a,b,c]=line;if(board[a]&&board[a]===board[b]&&board[a]===board[c]){return {winner:board[a],line};}}if(board.every(v=>v!==null))return {winner:'D',line:null};return null;}
function endGame(r){state.over=true;state.winner=r.winner;state.line=r.line;if(r.winner==='X')state.scores.X++;else if(r.winner==='O')state.scores.O++;else state.scores.D++;render();if(r.line){setTimeout(()=>drawWinningLine(r.line,r.winner),220);setTimeout(()=>showModal(r.winner),950);}else{setTimeout(()=>showModal(r.winner),400);}}
function showModal(winner){const title=$('modal-title');const sub=$('modal-sub');if(winner==='X'){title.textContent='You win';title.className='modal__title';sub.textContent='Great job. Play again?';}else if(winner==='O'){title.textContent='AI wins';title.className='modal__title is-o';sub.textContent='Better luck next time. Try again?';}else{title.textContent='Draw';title.className='modal__title';sub.textContent='Tie game. Play again?';}modal.hidden=false;void modal.offsetWidth;modal.classList.add('is-open');setTimeout(()=>$('modal-retry').focus(),80);}
function hideModal(){modal.classList.remove('is-open');setTimeout(()=>{modal.hidden=true;},350);}
function drawWinningLine(line,winner){const rect=boardEl.getBoundingClientRect();const s=boardEl.children[line[0]].getBoundingClientRect();const e=boardEl.children[line[2]].getBoundingClientRect();const x1=s.left+s.width/2-rect.left;const y1=s.top+s.height/2-rect.top;const x2=e.left+e.width/2-rect.left;const y2=e.top+e.height/2-rect.top;const len=Math.hypot(x2-x1,y2-y1);const ang=Math.atan2(y2-y1,x2-x1);const el=document.createElement('div');el.className='winning-line'+(winner==='X'?' is-x':'');el.style.left=x1+'px';el.style.top=y1+'px';el.style.width=len+'px';el.style.transform=\`translateY(-50%) rotate(\${ang}rad) scaleX(0)\`;el.style.transition='transform .55s cubic-bezier(0.65,0,0.35,1)';boardEl.appendChild(el);requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.transform=\`translateY(-50%) rotate(\${ang}rad) scaleX(1)\`;}));}
function resetBoard(){hideModal();state.board=Array(9).fill(null);state.turn=state.human;state.over=false;state.winner=null;state.line=null;state.thinking=false;const wl=boardEl.querySelector('.winning-line');if(wl)wl.remove();render();}
$('reset').addEventListener('click',resetBoard);
$('modal-retry').addEventListener('click',resetBoard);
$('modal-backdrop').addEventListener('click',resetBoard);
document.addEventListener('keydown',(e)=>{if(!modal.classList.contains('is-open'))return;if(e.key==='Escape'||e.key==='Enter'){e.preventDefault();resetBoard();}});
buildBoard();buildLevels();render();
</script>
</body></html>`,
                                  url: 'https://nixel.dev',
                                  trusted_sources: ['nixel.dev']
                                }
                              }
                            }]
                          },
                          {
                            id: 'tab_2',
                            tab_header: 'Doom',
                            sections: [{
                              __typename: 'GenAIUnifiedResponseSection',
                              view_model: {
                                __typename: 'GenAISingleLayoutViewModel',
                                primitive: {
                                  __typename: 'GenAIaeacdsnwHtmlPrimitive',
                                  payload: `<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}</style>
<body style="margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:manipulation;cursor:pointer">
<div style="width:100%;max-width:620px;margin:auto;box-sizing:border-box">
<div style="position:relative;width:100%;aspect-ratio:16/9;background:rgba(255,255,255,.06);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.15);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35)">
<canvas id="game" width="480" height="270" style="position:absolute;inset:0;width:100%;height:100%;display:block;background:#000;touch-action:none"></canvas>
<div style="position:absolute;top:8px;left:12px;pointer-events:none;text-shadow:0 1px 4px rgba(0,0,0,.9)">
<div style="font-size:9px;letter-spacing:1.5px;color:rgba(255,255,255,.65)">SILA DOOM</div>
<div style="font-size:14px;font-weight:bold;color:#fff">Mini Doom FPS</div>
</div>
<div style="position:absolute;top:8px;right:12px;text-align:right;pointer-events:none;text-shadow:0 1px 4px rgba(0,0,0,.9)">
<div id="hp" style="font-size:13px;font-weight:bold;color:#fff;transition:transform .15s">HP 100</div>
<div id="ammo" style="font-size:9px;color:rgba(255,255,255,.75);margin-top:1px">AMMO 30 · SCORE 0</div>
</div>
<div id="status" style="position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:9px;color:rgba(255,255,255,.75);pointer-events:none;text-shadow:0 1px 4px rgba(0,0,0,.9)">5 enemies left</div>
<div style="position:absolute;bottom:6px;left:6px;display:flex;gap:5px">
<button id="forward" style="width:44px;height:32px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:rgba(0,0,0,.4);color:#fff;font-size:14px;padding:0">▲</button>
</div>
<div style="position:absolute;bottom:6px;right:6px;display:grid;grid-template-columns:repeat(3,32px);gap:5px">
<button id="strafeL" style="width:32px;height:32px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:rgba(0,0,0,.4);color:#fff;font-size:13px;padding:0">◀</button>
<button id="fire" style="width:32px;height:32px;border:1px solid rgba(230,60,60,.5);border-radius:8px;background:rgba(230,60,60,.35);color:#fff;font-size:13px;padding:0">🔥</button>
<button id="strafeR" style="width:32px;height:32px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:rgba(0,0,0,.4);color:#fff;font-size:13px;padding:0">▶</button>
</div>
</div></div>
<script>
const c=document.getElementById('game'),x=c.getContext('2d'),hpEl=document.getElementById('hp'),ammoEl=document.getElementById('ammo'),statusEl=document.getElementById('status');
x.imageSmoothingEnabled=false;
const W=c.width,H=c.height;
const map=["################","#..............#","#..##....##....#","#..#..........##","#..#..####.....#","#.....#........#","###...#..####..#","#.....#........#","#..####........#","#........####..#","#........#.....#","#..##....#.....#","#..##..........#","#..............#","#..............#","################"];
const player={x:2.5,y:2.5,angle:0,hp:100,ammo:30,score:0,fireCooldown:0,muzzle:0,hurt:0};
let enemies,pickups,particles,ambient,shake,bobT,runT,endT,gameOver,win;
const keys=Object.create(null);
const FOV=Math.PI/3,MOVE=.052;
let zBuffer=new Float32Array(W);
function initEnemies(){return [{x:11.5,y:2.5,hp:60,max:60,dead:false,flash:0},{x:7.5,y:5.5,hp:60,max:60,dead:false,flash:0},{x:13.5,y:8.5,hp:60,max:60,dead:false,flash:0},{x:5.5,y:10.5,hp:60,max:60,dead:false,flash:0},{x:11.5,y:12.5,hp:60,max:60,dead:false,flash:0}]}
function initPickups(){return [{x:4.5,y:1.5,type:"ammo",taken:false},{x:14.5,y:5.5,type:"health",taken:false},{x:3.5,y:13.5,type:"ammo",taken:false}]}
function reset(){
player.x=2.5;player.y=2.5;player.angle=0;player.hp=100;player.ammo=30;player.score=0;player.fireCooldown=0;player.muzzle=0;player.hurt=0;
enemies=initEnemies();pickups=initPickups();particles=[];
if(!ambient){ambient=[];for(let i=0;i<16;i++)ambient.push({x:Math.random()*W,y:Math.random()*H,r:.6+Math.random()*1.2,vx:.15+Math.random()*.25,ph:Math.random()*10})}
shake=0;bobT=0;runT=0;endT=0;gameOver=false;win=false
}
function burst(px,py,n,col,spd,grav){for(let i=0;i<n;i++)particles.push({x:px,y:py,vx:(Math.random()-.5)*spd,vy:-Math.random()*spd,life:1,col,size:2+Math.random()*2.5,grav:grav||0})}
function isWall(px,py){const mx=Math.floor(px),my=Math.floor(py);if(mx<0||my<0||my>=map.length||mx>=map[0].length)return true;return map[my][mx]==="#"}
function canWalk(px,py){const r=.18;return !isWall(px-r,py-r)&&!isWall(px+r,py-r)&&!isWall(px-r,py+r)&&!isWall(px+r,py+r)}
function move(dx,dy){const nx=player.x+dx,ny=player.y+dy;if(canWalk(nx,player.y))player.x=nx;if(canWalk(player.x,ny))player.y=ny}
function normAngle(a){while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function lineClear(x1,y1,x2,y2){const d=Math.hypot(x2-x1,y2-y1),steps=Math.ceil(d/.08);for(let i=1;i<steps;i++){const t=i/steps,px=x1+(x2-x1)*t,py=y1+(y2-y1)*t;if(isWall(px,py))return false}return true}
function castRay(a){const ca=Math.cos(a),sa=Math.sin(a);let d=0;while(d<30){d+=.025;if(isWall(player.x+ca*d,player.y+sa*d))break}return d}
function screenPos(ex,ey){const dx=ex-player.x,dy=ey-player.y,d=Math.hypot(dx,dy);const a=normAngle(Math.atan2(dy,dx)-player.angle);const sx=W/2+Math.tan(a)*(W/2)/Math.tan(FOV/2);return {sx,d,a}}
function shoot(){
if(player.fireCooldown>0||player.ammo<=0||gameOver||win)return;
player.fireCooldown=13;player.ammo--;player.muzzle=4;
burst(W/2,H-88,7,'255,210,80',3,.1);
let best=null,bestDist=Infinity;
for(const e of enemies){
if(e.dead)continue;
const {sx,d,a}=screenPos(e.x,e.y);
if(d>10)continue;
const tol=.055+.16/d;
if(Math.abs(a)<tol&&d<bestDist&&lineClear(player.x,player.y,e.x,e.y)){best=e;bestDist=d}
}
if(best){
const dmg=25+Math.floor(Math.random()*12);
best.hp-=dmg;best.flash=6;
const {sx,d}=screenPos(best.x,best.y);
const size=Math.min(H*1.8,H/d*.72);
if(best.hp<=0){best.dead=true;player.score+=100;burst(sx,H/2,22,'220,40,40',4.5,.25)}
else{player.score+=10;burst(sx,H/2,10,'220,40,40',3.5,.2)}
}
}
function updateEnemies(){
for(const e of enemies){
if(e.dead)continue;
if(e.flash>0)e.flash--;
const d=dist(player,e);
if(d<1){
player.hp-=.18;player.hurt=6;shake=Math.max(shake,4.5);
const a=Math.atan2(e.y-player.y,e.x-player.x);
player.x-=Math.cos(a)*.015;player.y-=Math.sin(a)*.015;
continue
}
if(d<7&&lineClear(e.x,e.y,player.x,player.y)){
const a=Math.atan2(player.y-e.y,player.x-e.x),spd=.0085;
const nx=e.x+Math.cos(a)*spd,ny=e.y+Math.sin(a)*spd;
if(canWalk(nx,ny)){e.x=nx;e.y=ny}
if(Math.random()<.006&&d<6){player.hp-=2.5;player.hurt=10;shake=Math.max(shake,3.5);}
}
}
}
function updatePickups(){
for(const p of pickups){
if(p.taken)continue;
if(Math.hypot(player.x-p.x,player.y-p.y)<.55){
p.taken=true;
if(p.type==="ammo")player.ammo=Math.min(99,player.ammo+15);
if(p.type==="health")player.hp=Math.min(100,player.hp+25)
}
}
}
function update(){
runT++;
if(gameOver||win){endT++;return}
if(player.fireCooldown>0)player.fireCooldown--;
if(player.muzzle>0)player.muzzle--;
if(player.hurt>0)player.hurt--;
if(shake>0)shake=Math.max(0,shake-.6);
let dx=0,dy=0;
const moving=keys.forward||keys.strafeL||keys.strafeR;
if(moving)bobT++;else bobT+=.15;
if(keys.forward){dx+=Math.cos(player.angle)*MOVE;dy+=Math.sin(player.angle)*MOVE}
if(keys.strafeL){dx+=Math.cos(player.angle-Math.PI/2)*MOVE;dy+=Math.sin(player.angle-Math.PI/2)*MOVE}
if(keys.strafeR){dx+=Math.cos(player.angle+Math.PI/2)*MOVE;dy+=Math.sin(player.angle+Math.PI/2)*MOVE}
move(dx,dy);
updateEnemies();updatePickups();
if(keys.fire)shoot();
particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.grav;p.life-=.035});
particles=particles.filter(p=>p.life>0);
ambient.forEach(p=>{p.x-=p.vx;if(p.x<-4)p.x=W+4});
if(enemies.filter(e=>!e.dead).length===0)win=true;
if(player.hp<=0)gameOver=true
}
function wallColor(d,side){let l=230-d*18;if(side)l*=.76;l=Math.max(25,Math.min(220,l));return 'rgb('+Math.floor(l)+','+Math.floor(l*.62)+','+Math.floor(l*.48)+')'}
function drawWalls(bob){
const half=H/2+bob,halfFov=FOV/2;
const sky=x.createLinearGradient(0,0,0,half);sky.addColorStop(0,'#12151a');sky.addColorStop(1,'#34302b');
x.fillStyle=sky;x.fillRect(0,0,W,half);
const floor=x.createLinearGradient(0,half,0,H);floor.addColorStop(0,'#4a4540');floor.addColorStop(1,'#111');
x.fillStyle=floor;x.fillRect(0,half,W,H-half);
for(let px=0;px<W;px++){
const a=player.angle-halfFov+(px/W)*FOV;
let raw=castRay(a);
const corrected=raw*Math.cos(a-player.angle);
zBuffer[px]=corrected;
const wallH=Math.min(H*3,H/corrected),top=half-wallH/2;
const cellX=player.x+Math.cos(a)*raw,cellY=player.y+Math.sin(a)*raw;
const wx=cellX-Math.floor(cellX),wy=cellY-Math.floor(cellY);
const side=wx<.035||wx>.965;
x.fillStyle=wallColor(corrected,side);
x.fillRect(px,top,1,wallH)
}
}
function drawEnemySprite(e,bob){
if(e.dead)return;
const {sx,d,a}=screenPos(e.x,e.y);
if(Math.abs(a)>FOV*.7||d<.2)return;
const size=Math.min(H*1.8,H/d*.72);
const left=Math.floor(sx-size*.3),top=Math.floor(H/2+bob-size*.48),bottom=Math.floor(H/2+bob+size*.52);
const zi=Math.max(0,Math.min(W-1,Math.floor(sx)));
if(d>zBuffer[zi]+.25)return;
const hit=e.flash>0;
const wob=Math.sin(runT*.08+e.x*3)*2;
x.fillStyle=hit?'#fff':'#991b1b';
x.fillRect(left+size*.12+wob,top+size*.28,size*.36,size*.48);
x.fillRect(left+size*.16+wob,top,size*.28,size*.22);
if(size>25){
x.fillStyle='#ffd000';
x.fillRect(left+size*.22+wob,top+size*.09,Math.max(2,size*.035),Math.max(2,size*.045));
x.fillRect(left+size*.38+wob,top+size*.09,Math.max(2,size*.035),Math.max(2,size*.045))
}
x.fillStyle=hit?'#fff':'#741414';
x.fillRect(left-size*.03+wob,top+size*.28,size*.15,size*.11);
x.fillRect(left+size*.6-size*.12+wob,top+size*.28,size*.15,size*.11);
x.fillRect(left+size*.13+wob,bottom-size*.23,size*.14,size*.25);
x.fillRect(left+size*.35+wob,bottom-size*.23,size*.14,size*.25);
if(size>35){
const barW=size*.55;
x.fillStyle='#111';x.fillRect(sx-barW/2,top-size*.07,barW,4);
x.fillStyle='#e33';x.fillRect(sx-barW/2,top-size*.07,barW*Math.max(0,e.hp/e.max),4)
}
}
function drawPickup(p,bob){
if(p.taken)return;
const {sx,d,a}=screenPos(p.x,p.y);
if(Math.abs(a)>FOV*.6)return;
const pulse=1+.12*Math.sin(runT*.12+p.x*4);
const size=Math.min(45,H/d*.2)*pulse;
const zi=Math.max(0,Math.min(W-1,Math.floor(sx)));
if(d>zBuffer[zi]+.15)return;
x.save();
x.shadowColor=p.type==='health'?'rgba(33,197,93,.7)':'rgba(246,201,69,.7)';
x.shadowBlur=10;
x.fillStyle=p.type==='health'?'#21c55d':'#f6c945';
x.fillRect(sx-size/2,H/2+bob-size/2,size,size);
x.restore()
}
function drawWeapon(bob){
const cx=W/2,base=H+bob*1.5;
x.fillStyle='#282828';x.fillRect(cx-44,base-64,88,50);
x.fillStyle='#555';x.fillRect(cx-32,base-80,64,24);
if(player.muzzle>0){
x.fillStyle=player.muzzle%2?'#fff':'#ffd43b';
x.beginPath();x.moveTo(cx,base-96);x.lineTo(cx-20,base-68);x.lineTo(cx,base-74);x.lineTo(cx+20,base-68);x.closePath();x.fill()
}
}
function drawAmbient(){ambient.forEach(p=>{const a=.12+Math.sin(runT*.04+p.ph)*.08;x.fillStyle='rgba(200,190,255,'+a+')';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()})}
function drawParticles(){particles.forEach(p=>{x.fillStyle='rgba('+p.col+','+Math.max(p.life,0)+')';x.fillRect(p.x,p.y,p.size,p.size)})}
function drawCrosshair(){const cx=W/2,cy=H/2;x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=2;x.beginPath();x.moveTo(cx-5,cy);x.lineTo(cx-1,cy);x.moveTo(cx+1,cy);x.lineTo(cx+5,cy);x.moveTo(cx,cy-5);x.lineTo(cx,cy-1);x.moveTo(cx,cy+1);x.lineTo(cx,cy+5);x.stroke()}
function drawVignette(){const g=x.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=g;x.fillRect(0,0,W,H)}
function drawEndScreen(){if(!gameOver&&!win)return;const a=Math.min(1,endT*.04);x.fillStyle='rgba(0,0,0,'+(a*.75)+')';x.fillRect(0,0,W,H);x.globalAlpha=a;x.textAlign='center';x.fillStyle=win?'#ffd43b':'#f33';x.font='bold 22px Arial';x.fillText(win?'LEVEL CLEAR':'YOU DIED',W/2,H/2-10);x.fillStyle='#fff';x.font='12px Arial';x.fillText('Score '+player.score+' · Tap to restart',W/2,H/2+14);x.textAlign='left';x.globalAlpha=1}
function draw(){x.clearRect(0,0,W,H);x.save();if(shake>0)x.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);const bob=Math.sin(bobT*.3)*(keys.forward||keys.strafeL||keys.strafeR?3:.8);drawWalls(bob);drawAmbient();const sprites=[...enemies.filter(e=>!e.dead).map(e=>({t:'e',o:e})),...pickups.filter(p=>!p.taken).map(p=>({t:'p',o:p}))];sprites.sort((a,b)=>dist(player,b.o)-dist(player,a.o));for(const s of sprites)s.t==='e'?drawEnemySprite(s.o,bob):drawPickup(s.o,bob);drawParticles();drawWeapon(bob);drawCrosshair();drawVignette();if(player.hurt>0){x.fillStyle='rgba(255,0,0,'+(player.hurt/45)+')';x.fillRect(0,0,W,H)}x.restore();drawEndScreen();hpEl.textContent='HP '+Math.max(0,Math.floor(player.hp));ammoEl.textContent='AMMO '+player.ammo+' · SCORE '+player.score;statusEl.textContent=win?'Level clear!':gameOver?'You died':enemies.filter(e=>!e.dead).length+' enemies left'}
function loop(){update();draw();requestAnimationFrame(loop)}
function bind(id,key){const b=document.getElementById(id);const down=e=>{e.preventDefault();keys[key]=true};const up=e=>{e.preventDefault();keys[key]=false};b.addEventListener('touchstart',down,{passive:false});b.addEventListener('touchend',up,{passive:false});b.addEventListener('touchcancel',up,{passive:false});b.addEventListener('mousedown',down);b.addEventListener('mouseup',up);b.addEventListener('mouseleave',up)}
bind('forward','forward');bind('strafeL','strafeL');bind('strafeR','strafeR');bind('fire','fire');
let looking=false;let lookLastX=0;
c.addEventListener('pointerdown',e=>{if(gameOver||win){reset();return;}looking=true;lookLastX=e.clientX;c.setPointerCapture(e.pointerId);});
c.addEventListener('pointermove',e=>{if(!looking)return;const dx=e.clientX-lookLastX;player.angle+=dx*0.009;lookLastX=e.clientX;});
const stopLook=e=>{looking=false;};c.addEventListener('pointerup',stopLook);c.addEventListener('pointercancel',stopLook);
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='w')keys.forward=true;if(k==='a')keys.strafeL=true;if(k==='d')keys.strafeR=true;if(k==='arrowleft')player.angle-=.1;if(k==='arrowright')player.angle+=.1;if(k===' ')keys.fire=true});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='w')keys.forward=false;if(k==='a')keys.strafeL=false;if(k==='d')keys.strafeR=false;if(k===' ')keys.fire=false});
reset();requestAnimationFrame(loop);
</script></body>`,
                                  url: 'https://nixel.dev',
                                  trusted_sources: ['nixel.dev']
                                }
                              }
                            }]
                          }
                        ]
                      }
                    ]
                  }]
                }).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: '867051314767696@bot'
                },
                forwardOrigin: 4
              }
            }
          }
        }
      };
      
      await sock.relayMessage(sender, content, {});
      
    } catch (error) {
      console.error('[gamehub]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};