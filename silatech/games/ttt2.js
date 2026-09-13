import { randomUUID } from 'crypto';

// ============================================
// HTML QR CODE GENERATOR - WHATSAPP READY
// ============================================
const qrHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{
  --card-2:#2a3942;
  --ink:#e9edef;
  --ink-soft:#aebac1;
  --muted:#8696a0;
  --accent:#00a884;
  --accent-2:#008069;
  --danger:#e05c5c;
  --line:#2a3942;
  --line-strong:#374248;
  --cell-bg:#111b21;
  --bg-deep:#0b141a;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;}
html,body{
  background:transparent;
  color:var(--ink);
  font-family:var(--sys);
  min-height:100vh;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.stage{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:24px 16px;
}
.card{width:100%;max-width:400px;}
.header{
  display:flex;
  align-items:baseline;
  justify-content:space-between;
  margin-bottom:14px;
  padding-bottom:12px;
  border-bottom:1px solid var(--line);
  gap:8px;
}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}

.tabs{
  display:flex;
  gap:6px;
  margin-bottom:12px;
  overflow-x:auto;
  overflow-y:hidden;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
  padding-bottom:2px;
}
.tabs::-webkit-scrollbar{display:none;}
.tab{
  background:transparent;
  border:1px solid var(--line-strong);
  border-radius:20px;
  padding:7px 14px;
  font-size:12px;
  font-weight:600;
  color:var(--ink-soft);
  cursor:pointer;
  font-family:inherit;
  white-space:nowrap;
  flex-shrink:0;
  transition:background .15s ease,color .15s ease,border-color .15s ease;
}
.tab:active{transform:scale(.96);}
.tab.is-active{
  background:var(--accent);
  border-color:var(--accent);
  color:#0b141a;
}

.form{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;}
.field{display:flex;flex-direction:column;gap:4px;}
.field label{
  font-size:11px;
  color:var(--muted);
  font-weight:600;
  letter-spacing:.03em;
  text-transform:uppercase;
}
.field input,.field textarea,.field select{
  background:var(--cell-bg);
  border:1px solid var(--line-strong);
  border-radius:8px;
  padding:11px 12px;
  color:var(--ink);
  font-family:inherit;
  font-size:14px;
  outline:none;
  transition:border-color .15s ease;
  width:100%;
  -webkit-appearance:none;
  appearance:none;
}
.field textarea{
  resize:none;
  min-height:70px;
  line-height:1.4;
  font-size:14px;
}
.field select{
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' stroke='%23aebac1' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat:no-repeat;
  background-position:right 12px center;
  padding-right:32px;
}
.field input:focus,.field textarea:focus,.field select:focus{
  border-color:var(--accent);
}

.generate-btn{
  background:var(--accent);
  border:none;
  color:#0b141a;
  font-family:inherit;
  font-size:14px;
  font-weight:700;
  padding:13px 20px;
  border-radius:10px;
  cursor:pointer;
  transition:background .15s ease,transform .08s ease;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  margin-top:4px;
}
.generate-btn:active{transform:scale(.98);background:var(--accent-2);}

.preview{
  background:var(--cell-bg);
  border:1px solid var(--line);
  border-radius:10px;
  padding:20px;
  margin-top:14px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:12px;
  min-height:120px;
  justify-content:center;
}
.preview__empty{
  text-align:center;
  color:var(--muted);
  font-size:13px;
  line-height:1.5;
  padding:14px 0;
}
.preview__empty-icon{
  font-size:36px;
  display:block;
  margin-bottom:8px;
  opacity:.5;
}
.preview__canvas-wrap{
  background:#fff;
  border-radius:10px;
  padding:12px;
  display:none;
  box-shadow:0 4px 20px -8px rgba(0,168,132,.4);
}
.preview__canvas-wrap.show{display:block;}
#qrCanvas{
  display:block;
  image-rendering:pixelated;
  image-rendering:crisp-edges;
  width:220px;
  height:220px;
}
.preview__info{
  font-size:12px;
  color:var(--ink-soft);
  text-align:center;
  max-width:280px;
  word-break:break-word;
  line-height:1.4;
  display:none;
}
.preview__info.show{display:block;}
.preview__info b{color:var(--accent);font-weight:600;}

.actions{
  display:none;
  gap:8px;
  width:100%;
  margin-top:4px;
}
.actions.show{display:flex;}
.action-btn{
  flex:1;
  background:var(--card-2);
  border:1px solid var(--line-strong);
  border-radius:8px;
  color:var(--ink);
  font-family:inherit;
  font-size:12px;
  font-weight:600;
  padding:11px 10px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:5px;
  transition:background .15s ease,transform .08s ease;
}
.action-btn:active{transform:scale(.97);background:var(--accent);color:#0b141a;}
.action-btn .icon{font-size:14px;}

.toast{
  position:fixed;
  bottom:24px;
  left:50%;
  transform:translateX(-50%) translateY(20px);
  background:var(--accent);
  color:#0b141a;
  padding:10px 20px;
  border-radius:20px;
  font-size:13px;
  font-weight:700;
  opacity:0;
  pointer-events:none;
  transition:opacity .25s ease,transform .25s ease;
  z-index:100;
  white-space:nowrap;
}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

.footer{
  margin-top:14px;
  display:flex;
  justify-content:center;
  gap:8px;
}
.footer__btn{
  background:none;
  border:none;
  color:var(--accent);
  font-family:inherit;
  font-size:13px;
  font-weight:500;
  cursor:pointer;
  padding:8px 14px;
}
.footer__btn:active{color:var(--ink);}

@media (max-width:380px){
  .header__title{font-size:15px;}
  .tab{padding:6px 12px;font-size:11px;}
  #qrCanvas{width:190px;height:190px;}
}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA QR Generator</div>
      <div class="header__sub">Free · Offline</div>
    </div>

    <div class="tabs" id="tabs">
      <button class="tab is-active" data-type="text">📝 Text</button>
      <button class="tab" data-type="url">🔗 URL</button>
      <button class="tab" data-type="wifi">📶 WiFi</button>
      <button class="tab" data-type="email">✉️ Email</button>
      <button class="tab" data-type="phone">📞 Phone</button>
      <button class="tab" data-type="sms">💬 SMS</button>
    </div>

    <div class="form" id="form"></div>

    <div class="preview">
      <div class="preview__empty" id="emptyState">
        <span class="preview__empty-icon">📱</span>
        Enter content above and tap<br>Generate to create your QR code
      </div>
      <div class="preview__canvas-wrap" id="canvasWrap">
        <canvas id="qrCanvas" width="440" height="440"></canvas>
      </div>
      <div class="preview__info" id="infoText"></div>
      <div class="actions" id="actions">
        <button class="action-btn" id="downloadBtn">
          <span class="icon">⬇</span> Save PNG
        </button>
        <button class="action-btn" id="copyBtn">
          <span class="icon">📋</span> Copy Image
        </button>
      </div>
    </div>

    <div class="footer">
      <button class="footer__btn" id="clearBtn">Clear</button>
    </div>
  </div>
</main>

<div class="toast" id="toast"></div>

<script>
(function(){
'use strict';

// ============================================
// MINIMAL QR CODE GENERATOR (Vanilla, no deps)
// Based on public-domain qrcode implementation
// ============================================
var QRCode=(function(){
  function QRCode(typeNumber,errorCorrectLevel){
    this.typeNumber=typeNumber;
    this.errorCorrectLevel=errorCorrectLevel;
    this.modules=null;
    this.moduleCount=0;
    this.dataCache=null;
    this.dataList=[];
  }
  QRCode.prototype={addData:function(data){
    this.dataList.push(data);
    this.dataCache=null;
  },isDark:function(row,col){
    if(row<0||this.moduleCount<=row||col<0||this.moduleCount<=col) throw new Error(row+","+col);
    return this.modules[row][col];
  },getModuleCount:function(){return this.moduleCount;},make:function(){
    this.makeImpl(false,this.getBestMaskPattern());
  },makeImpl:function(test,maskPattern){
    this.moduleCount=this.typeNumber*4+17;
    this.modules=new Array(this.moduleCount);
    for(var row=0;row<this.moduleCount;row++){
      this.modules[row]=new Array(this.moduleCount);
      for(var col=0;col<this.moduleCount;col++) this.modules[row][col]=null;
    }
    this.setupPositionProbePattern(0,0);
    this.setupPositionProbePattern(this.moduleCount-7,0);
    this.setupPositionProbePattern(0,this.moduleCount-7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test,maskPattern);
    if(this.typeNumber>=7) this.setupTypeNumber(test);
    if(this.dataCache==null){
      this.dataCache=QRCode.createData(this.typeNumber,this.errorCorrectLevel,this.dataList);
    }
    this.mapData(this.dataCache,maskPattern);
  },setupPositionProbePattern:function(row,col){
    for(var r=-1;r<=7;r++){
      if(row+r<=-1||this.moduleCount<=row+r) continue;
      for(var c=-1;c<=7;c++){
        if(col+c<=-1||this.moduleCount<=col+c) continue;
        if((0<=r&&r<=6&&(c==0||c==6))||(0<=c&&c<=6&&(r==0||r==6))||(2<=r&&r<=4&&2<=c&&c<=4)){
          this.modules[row+r][col+c]=true;
        }else{
          this.modules[row+r][col+c]=false;
        }
      }
    }
  },getBestMaskPattern:function(){
    var minLostPoint=0,pattern=0;
    for(var i=0;i<8;i++){
      this.makeImpl(true,i);
      var lostPoint=QRCodeUtil.getLostPoint(this);
      if(i==0||minLostPoint>lostPoint){minLostPoint=lostPoint;pattern=i;}
    }
    return pattern;
  },setupTimingPattern:function(){
    for(var r=8;r<this.moduleCount-8;r++){
      if(this.modules[r][6]!=null) continue;
      this.modules[r][6]=(r%2==0);
    }
    for(var c=8;c<this.moduleCount-8;c++){
      if(this.modules[6][c]!=null) continue;
      this.modules[6][c]=(c%2==0);
    }
  },setupPositionAdjustPattern:function(){
    var pos=QRCodeUtil.getPatternPosition(this.typeNumber);
    for(var i=0;i<pos.length;i++){
      for(var j=0;j<pos.length;j++){
        var row=pos[i],col=pos[j];
        if(this.modules[row][col]!=null) continue;
        for(var r=-2;r<=2;r++){
          for(var c=-2;c<=2;c++){
            if(r==-2||r==2||c==-2||c==2||(r==0&&c==0)){
              this.modules[row+r][col+c]=true;
            }else{
              this.modules[row+r][col+c]=false;
            }
          }
        }
      }
    }
  },setupTypeNumber:function(test){
    var bits=QRCodeUtil.getBCHTypeNumber(this.typeNumber);
    for(var i=0;i<18;i++){
      var mod=(!test&&((bits>>i)&1)==1);
      this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=mod;
    }
    for(var i2=0;i2<18;i2++){
      var mod2=(!test&&((bits>>i2)&1)==1);
      this.modules[i2%3+this.moduleCount-8-3][Math.floor(i2/3)]=mod2;
    }
  },setupTypeInfo:function(test,maskPattern){
    var data=(this.errorCorrectLevel<<3)|maskPattern;
    var bits=QRCodeUtil.getBCHTypeInfo(data);
    for(var i=0;i<15;i++){
      var mod=(!test&&((bits>>i)&1)==1);
      if(i<6){this.modules[i][8]=mod;}
      else if(i<8){this.modules[i+1][8]=mod;}
      else{this.modules[this.moduleCount-15+i][8]=mod;}
    }
    for(var i2=0;i2<15;i2++){
      var mod2=(!test&&((bits>>i2)&1)==1);
      if(i2<8){this.modules[8][this.moduleCount-i2-1]=mod2;}
      else if(i2<9){this.modules[8][15-i2-1+1]=mod2;}
      else{this.modules[8][15-i2-1]=mod2;}
    }
    this.modules[this.moduleCount-8][8]=(!test);
  },mapData:function(data,maskPattern){
    var inc=-1,row=this.moduleCount-1,bitIndex=7,byteIndex=0;
    for(var col=this.moduleCount-1;col>0;col-=2){
      if(col==6) col--;
      while(true){
        for(var c=0;c<2;c++){
          if(this.modules[row][col-c]==null){
            var dark=false;
            if(byteIndex<data.length){
              dark=(((data[byteIndex]>>>bitIndex)&1)==1);
            }
            var mask=QRCodeUtil.getMask(maskPattern,row,col-c);
            if(mask) dark=!dark;
            this.modules[row][col-c]=dark;
            bitIndex--;
            if(bitIndex==-1){byteIndex++;bitIndex=7;}
          }
        }
        row+=inc;
        if(row<0||this.moduleCount<=row){row-=inc;inc=-inc;break;}
      }
    }
  }};
  QRCode.PAD0=0xEC;
  QRCode.PAD1=0x11;
  QRCode.createData=function(typeNumber,errorCorrectLevel,dataList){
    var rsBlocks=QRCodeUtil.getRSBlocks(typeNumber,errorCorrectLevel);
    var buffer=new QRCodeUtil.BitBuffer();
    for(var i=0;i<dataList.length;i++){
      var data=dataList[i];
      buffer.put(data.mode,4);
      buffer.put(data.getLength(),QRCodeUtil.getLengthInBits(data.mode,typeNumber));
      data.write(buffer);
    }
    var totalDataCount=0;
    for(var i2=0;i2<rsBlocks.length;i2++) totalDataCount+=rsBlocks[i2].dataCount;
    if(buffer.getLengthInBits()>totalDataCount*8){
      throw new Error("code length overflow. ("+buffer.getLengthInBits()+">"+totalDataCount*8+")");
    }
    if(buffer.getLengthInBits()+4<=totalDataCount*8) buffer.put(0,4);
    while(buffer.getLengthInBits()%8!=0) buffer.putBit(false);
    while(true){
      if(buffer.getLengthInBits()>=totalDataCount*8) break;
      buffer.put(QRCode.PAD0,8);
      if(buffer.getLengthInBits()>=totalDataCount*8) break;
      buffer.put(QRCode.PAD1,8);
    }
    return QRCode.createBytes(buffer,rsBlocks);
  };
  QRCode.createBytes=function(buffer,rsBlocks){
    var offset=0,maxDcCount=0,maxEcCount=0;
    var dcdata=new Array(rsBlocks.length);
    var ecdata=new Array(rsBlocks.length);
    for(var r=0;r<rsBlocks.length;r++){
      var dcCount=rsBlocks[r].dataCount;
      var ecCount=rsBlocks[r].totalCount-dcCount;
      maxDcCount=Math.max(maxDcCount,dcCount);
      maxEcCount=Math.max(maxEcCount,ecCount);
      dcdata[r]=new Array(dcCount);
      for(var i=0;i<dcdata[r].length;i++) dcdata[r][i]=0xff&buffer.buffer[i+offset];
      offset+=dcCount;
      var rsPoly=QRCodeUtil.getErrorCorrectPolynomial(ecCount);
      var rawPoly=new QRCodeUtil.Polynomial(dcdata[r],rsPoly.getLength()-1);
      var modPoly=rawPoly.mod(rsPoly);
      ecdata[r]=new Array(rsPoly.getLength()-1);
      for(var i2=0;i2<ecdata[r].length;i2++){
        var modIndex=i2+modPoly.getLength()-ecdata[r].length;
        ecdata[r][i2]=(modIndex>=0)?modPoly.get(modIndex):0;
      }
    }
    var totalCodeCount=0;
    for(var i3=0;i3<rsBlocks.length;i3++) totalCodeCount+=rsBlocks[i3].totalCount;
    var data=new Array(totalCodeCount);
    var index=0;
    for(var i4=0;i4<maxDcCount;i4++){
      for(var r2=0;r2<rsBlocks.length;r2++){
        if(i4<dcdata[r2].length) data[index++]=dcdata[r2][i4];
      }
    }
    for(var i5=0;i5<maxEcCount;i5++){
      for(var r3=0;r3<rsBlocks.length;r3++){
        if(i5<ecdata[r3].length) data[index++]=ecdata[r3][i5];
      }
    }
    return data;
  };
  return QRCode;
})();

var QRCodeUtil=(function(){
  var PATTERN_POSITION_TABLE=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]];
  var G15=(1<<10)|(1<<8)|(1<<5)|(1<<4)|(1<<2)|(1<<1)|(1<<0);
  var G18=(1<<12)|(1<<11)|(1<<10)|(1<<9)|(1<<8)|(1<<5)|(1<<2)|(1<<0);
  var G15_MASK=(1<<14)|(1<<12)|(1<<10)|(1<<4)|(1<<1);
  function getBCHTypeInfo(data){
    var d=data<<10;
    while(getBCHDigit(d)-getBCHDigit(G15)>=0){
      d^=(G15<<(getBCHDigit(d)-getBCHDigit(G15)));
    }
    return ((data<<10)|d)^G15_MASK;
  }
  function getBCHTypeNumber(data){
    var d=data<<12;
    while(getBCHDigit(d)-getBCHDigit(G18)>=0){
      d^=(G18<<(getBCHDigit(d)-getBCHDigit(G18)));
    }
    return (data<<12)|d;
  }
  function getBCHDigit(data){
    var digit=0;
    while(data!=0){digit++;data>>>=1;}
    return digit;
  }
  var ERROR_CORRECT_L=1;
  var ERROR_CORRECT_M=0;
  var ERROR_CORRECT_Q=3;
  var ERROR_CORRECT_H=2;
  var MODE_NUMBER=1<<0,MODE_ALPHA_NUM=1<<1,MODE_8BIT_BYTE=1<<2,MODE_KANJI=1<<3;
  var RS_BLOCK_TABLE=[
    [1,26,19],[1,26,16],[1,26,13],[1,26,9],
    [1,44,34],[1,44,28],[1,44,22],[1,44,16],
    [1,70,55],[1,70,44],[2,35,17],[2,35,13],
    [1,100,80],[2,50,32],[2,50,24],[4,25,9],
    [1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],
    [2,86,68],[4,43,27],[4,43,19],[4,43,15],
    [2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],
    [2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],
    [2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],
    [2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],
    [4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],
    [2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],
    [4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],
    [3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],
    [5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],
    [5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],
    [1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],
    [5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],
    [3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],
    [3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],
    [4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],
    [2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],
    [4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],
    [6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],
    [8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],
    [10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],
    [8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],
    [3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],
    [7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],
    [5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],
    [13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],
    [17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],
    [17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],
    [13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],
    [12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],
    [6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],
    [17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],
    [4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],
    [20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],
    [19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]
  ];
  function getRSBlocks(typeNumber,errorCorrectLevel){
    var rsBlock=getRsBlockTable(typeNumber,errorCorrectLevel);
    if(rsBlock==undefined) throw new Error("bad rs block @ typeNumber:"+typeNumber+"/errorCorrectLevel:"+errorCorrectLevel);
    var length=rsBlock.length/3;
    var list=[];
    for(var i=0;i<length;i++){
      var count=rsBlock[i*3+0],totalCount=rsBlock[i*3+1],dataCount=rsBlock[i*3+2];
      for(var j=0;j<count;j++) list.push({totalCount:totalCount,dataCount:dataCount});
    }
    return list;
  }
  function getRsBlockTable(typeNumber,errorCorrectLevel){
    switch(errorCorrectLevel){
      case ERROR_CORRECT_L:return RS_BLOCK_TABLE[(typeNumber-1)*4+0];
      case ERROR_CORRECT_M:return RS_BLOCK_TABLE[(typeNumber-1)*4+1];
      case ERROR_CORRECT_Q:return RS_BLOCK_TABLE[(typeNumber-1)*4+2];
      case ERROR_CORRECT_H:return RS_BLOCK_TABLE[(typeNumber-1)*4+3];
      default:return undefined;
    }
  }
  function getLengthInBits(mode,type){
    if(1<=type&&type<10){
      switch(mode){
        case MODE_NUMBER:return 10;
        case MODE_ALPHA_NUM:return 9;
        case MODE_8BIT_BYTE:return 8;
        case MODE_KANJI:return 8;
      }
    }else if(type<27){
      switch(mode){
        case MODE_NUMBER:return 12;
        case MODE_ALPHA_NUM:return 11;
        case MODE_8BIT_BYTE:return 16;
        case MODE_KANJI:return 10;
      }
    }else if(type<41){
      switch(mode){
        case MODE_NUMBER:return 14;
        case MODE_ALPHA_NUM:return 13;
        case MODE_8BIT_BYTE:return 16;
        case MODE_KANJI:return 12;
      }
    }else{
      throw new Error("type:"+type);
    }
  }
  function BitBuffer(){
    this.buffer=[];
    this.length=0;
  }
  BitBuffer.prototype={get:function(index){var bufIndex=Math.floor(index/8);return ((this.buffer[bufIndex]>>>(7-index%8))&1)==1;},put:function(num,length){for(var i=0;i<length;i++){this.putBit(((num>>>(length-i-1))&1)==1);}},getLengthInBits:function(){return this.length;},putBit:function(bit){var bufIndex=Math.floor(this.length/8);if(this.buffer.length<=bufIndex) this.buffer.push(0);if(bit) this.buffer[bufIndex]|=(0x80>>>(this.length%8));this.length++;}};
  var BITS=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6];
  var BIT_LIMIT=[0,128,192,224,256,320,384,448,512,576,640,704,768,832,896,960,1024,1152,1280,1408,1536,1664,1792,2048,2304,2560,2816,3072,3328,3584,4096,4352,4608,4864,5120,5376,5632,5888,6144,6400,6656,6912,7168,7424,7680,7936,8192,8448,8704,8960,9216,9472,9728,9984,10240,10496,10752,11008,11264,11520,11776,12032,12288,12544,12800,13056,13312,13568,13824,14080,14336,14592,14848,15104,15360,15616,15872,16128,16384,16640,16896,17152,17408,17664,17920,18176,18432,18688,18944,19200,19456,19712,19968,20224,20480,20736,20992,21248,21504,21760];
  function getPatternPosition(typeNumber){return PATTERN_POSITION_TABLE[typeNumber-1];}
  function getMask(maskPattern,i,j){
    switch(maskPattern){
      case 0:return (i+j)%2==0;
      case 1:return i%2==0;
      case 2:return j%3==0;
      case 3:return (i+j)%3==0;
      case 4:return (Math.floor(i/2)+Math.floor(j/3))%2==0;
      case 5:return (i*j)%2+(i*j)%3==0;
      case 6:return ((i*j)%2+(i*j)%3)%2==0;
      case 7:return ((i*j)%3+(i+j)%2)%2==0;
      default:throw new Error("bad maskPattern:"+maskPattern);
    }
  }
  function getErrorCorrectPolynomial(errorCorrectLength){
    var a=new Polynomial([1],0);
    for(var i=0;i<errorCorrectLength;i++) a=a.multiply(new Polynomial([1,getErrorCorrectPolynomialExp(i)],0));
    return a;
  }
  function getErrorCorrectPolynomialExp(i){
    var e=1;
    for(var j=0;j<i;j++) e=(e*2)%255;
    return e;
  }
  function Polynomial(num,shift){
    if(num.length==undefined) throw new Error("num.length is undefined");
    var offset=0;
    while(offset<num.length&&num[offset]==0) offset++;
    this.num=new Array(num.length-offset+shift);
    for(var i=0;i<num.length-offset;i++) this.num[i]=num[i+offset];
  }
  Polynomial.prototype={
    get:function(index){return this.num[index];},
    getLength:function(){return this.num.length;},
    multiply:function(e){
      var num=new Array(this.getLength()+e.getLength()-1);
      for(var i=0;i<this.getLength();i++){
        for(var j=0;j<e.getLength();j++){
          num[i+j]^=gexp(glog(this.get(i))+glog(e.get(j)));
        }
      }
      return new Polynomial(num,0);
    },
    mod:function(e){
      if(this.getLength()-e.getLength()<0) return this;
      var num=new Array(this.getLength());
      for(var i=0;i<this.getLength();i++) num[i]=this.get(i);
      while(num.length-e.getLength()>=0){
        var ratio=glog(num[0])-glog(e.get(0));
        for(var i2=0;i2<e.getLength();i2++){
          num[i2]^=gexp(glog(e.get(i2))+ratio);
        }
        var offset=0;
        while(offset<num.length&&num[offset]==0) offset++;
        num=num.slice(offset);
      }
      var p=new Polynomial(num,0);
      var result=new Array(e.getLength()-1);
      for(var i3=0;i3<result.length;i3++) result[i3]=0;
      for(var i4=0;i4<num.length;i4++) result[i4]=num[i4];
      return new Polynomial(result,0);
    }
  };
  var EXP_TABLE=new Array(256),LOG_TABLE=new Array(256);
  for(var i=0;i<8;i++) EXP_TABLE[i]=1<<i;
  for(var i=8;i<256;i++) EXP_TABLE[i]=EXP_TABLE[i-4]^EXP_TABLE[i-5]^EXP_TABLE[i-6]^EXP_TABLE[i-8];
  for(var i=0;i<255;i++) LOG_TABLE[EXP_TABLE[i]]=i;
  function glog(n){if(n<1) throw new Error("glog("+n+")");return LOG_TABLE[n];}
  function gexp(n){while(n<0) n+=255;while(n>=256) n-=255;return EXP_TABLE[n];}
  function getLostPoint(qrCode){
    var moduleCount=qrCode.getModuleCount(),lostPoint=0;
    for(var row=0;row<moduleCount;row++){
      for(var col=0;col<moduleCount;col++){
        var sameCount=0,dark=qrCode.isDark(row,col);
        for(var r=-1;r<=1;r++){
          if(row+r<0||moduleCount<=row+r) continue;
          for(var c=-1;c<=1;c++){
            if(col+c<0||moduleCount<=col+c) continue;
            if(r==0&&c==0) continue;
            if(dark==qrCode.isDark(row+r,col+c)) sameCount++;
          }
        }
        if(sameCount>5) lostPoint+=(3+sameCount-5);
      }
    }
    for(var row2=0;row2<moduleCount-1;row2++){
      for(var col2=0;col2<moduleCount-1;col2++){
        var count=0;
        if(qrCode.isDark(row2,col2)) count++;
        if(qrCode.isDark(row2+1,col2)) count++;
        if(qrCode.isDark(row2,col2+1)) count++;
        if(qrCode.isDark(row2+1,col2+1)) count++;
        if(count==0||count==4) lostPoint+=3;
      }
    }
    for(var row3=0;row3<moduleCount;row3++){
      for(var col3=0;col3<moduleCount-6;col3++){
        if(qrCode.isDark(row3,col3)&&!qrCode.isDark(row3,col3+1)&&qrCode.isDark(row3,col3+2)&&qrCode.isDark(row3,col3+3)&&qrCode.isDark(row3,col3+4)&&!qrCode.isDark(row3,col3+5)&&qrCode.isDark(row3,col3+6)) lostPoint+=40;
      }
    }
    for(var col4=0;col4<moduleCount;col4++){
      for(var row4=0;row4<moduleCount-6;row4++){
        if(qrCode.isDark(row4,col4)&&!qrCode.isDark(row4+1,col4)&&qrCode.isDark(row4+2,col4)&&qrCode.isDark(row4+3,col4)&&qrCode.isDark(row4+4,col4)&&!qrCode.isDark(row4+5,col4)&&qrCode.isDark(row4+6,col4)) lostPoint+=40;
      }
    }
    var darkCount=0;
    for(var col5=0;col5<moduleCount;col5++){
      for(var row5=0;row5<moduleCount;row5++){
        if(qrCode.isDark(row5,col5)) darkCount++;
      }
    }
    var ratio=Math.abs(100*darkCount/moduleCount/moduleCount-50)/5;
    lostPoint+=ratio*10;
    return lostPoint;
  }
  function QR8bitByte(data){
    this.mode=MODE_8BIT_BYTE;
    this.data=data;
    this.parsedData=[];
    for(var i=0,l=this.data.length;i<l;i++){
      var byteArray=[];
      var code=this.data.charCodeAt(i);
      if(code>0x10000){
        byteArray[0]=0xF0|((code&0x1C0000)>>>18);
        byteArray[1]=0x80|((code&0x3F000)>>>12);
        byteArray[2]=0x80|((code&0xFC0)>>>6);
        byteArray[3]=0x80|(code&0x3F);
      }else if(code>0x800){
        byteArray[0]=0xE0|((code&0xF000)>>>12);
        byteArray[1]=0x80|((code&0xFC0)>>>6);
        byteArray[2]=0x80|(code&0x3F);
      }else if(code>0x80){
        byteArray[0]=0xC0|((code&0x7C0)>>>6);
        byteArray[1]=0x80|(code&0x3F);
      }else{
        byteArray[0]=code;
      }
      this.parsedData.push(byteArray);
    }
    this.parsedData=Array.prototype.concat.apply([],this.parsedData);
    if(this.parsedData.length!=this.data.length){
      this.parsedData.unshift(191);
      this.parsedData.unshift(187);
      this.parsedData.unshift(239);
    }
  }
  QR8bitByte.prototype={
    getLength:function(buffer){return this.parsedData.length;},
    write:function(buffer){
      for(var i=0,l=this.parsedData.length;i<l;i++) buffer.put(this.parsedData[i],8);
    }
  };
  return {
    QRCode:QRCode,
    QR8bitByte:QR8bitByte,
    MODE_8BIT_BYTE:MODE_8BIT_BYTE,
    ERROR_CORRECT_L:ERROR_CORRECT_L,
    ERROR_CORRECT_M:ERROR_CORRECT_M,
    ERROR_CORRECT_Q:ERROR_CORRECT_Q,
    ERROR_CORRECT_H:ERROR_CORRECT_H
  };
})();

// ============================================
// QR RENDERING
// ============================================
function generateQR(text, canvas, size){
  canvas.width=size;
  canvas.height=size;
  var ctx=canvas.getContext('2d');

  // white bg
  ctx.fillStyle='#ffffff';
  ctx.fillRect(0,0,size,size);

  // pick error correction and type
  var ecl=QRCodeUtil.ERROR_CORRECT_M;
  var typeNumber=1;
  var byteData=new QRCodeUtil.QR8bitByte(text);
  var dataLen=byteData.parsedData.length;
  // find smallest type that fits
  for(var t=1;t<=40;t++){
    try{
      var test=new QRCodeUtil.QRCode(t,ecl);
      test.addData(new QRCodeUtil.QR8bitByte(text));
      test.make();
      typeNumber=t;
      break;
    }catch(e){continue;}
  }
  if(typeNumber>40) throw new Error('Text too long for QR code');

  var qr=new QRCodeUtil.QRCode(typeNumber,ecl);
  qr.addData(new QRCodeUtil.QR8bitByte(text));
  qr.make();

  var moduleCount=qr.getModuleCount();
  var margin=4;
  var totalModules=moduleCount+margin*2;
  var cellSize=Math.floor(size/totalModules);
  var actualSize=cellSize*totalModules;
  var offset=(size-actualSize)/2;

  // background
  ctx.fillStyle='#ffffff';
  ctx.fillRect(offset,offset,actualSize,actualSize);

  // modules
  ctx.fillStyle='#0b141a';
  for(var row=0;row<moduleCount;row++){
    for(var col=0;col<moduleCount;col++){
      if(qr.isDark(row,col)){
        var x=offset+(col+margin)*cellSize;
        var y=offset+(row+margin)*cellSize;
        ctx.fillRect(x,y,cellSize,cellSize);
      }
    }
  }
}

// ============================================
// FORM BUILDER
// ============================================
var FORM_FIELDS={
  text:[{name:'content',label:'Your Text',type:'textarea',placeholder:'Type anything here...',required:true}],
  url:[{name:'content',label:'Website URL',type:'text',placeholder:'https://example.com',required:true}],
  wifi:[
    {name:'ssid',label:'Network Name (SSID)',type:'text',placeholder:'MyWiFi',required:true},
    {name:'password',label:'Password',type:'text',placeholder:'Enter password',required:false},
    {name:'encryption',label:'Security',type:'select',options:[{v:'WPA',t:'WPA/WPA2'},{v:'WEP',t:'WEP'},{v:'nopass',t:'No password'}],required:true}
  ],
  email:[
    {name:'to',label:'Recipient Email',type:'text',placeholder:'hello@example.com',required:true},
    {name:'subject',label:'Subject',type:'text',placeholder:'Hello',required:false},
    {name:'body',label:'Message',type:'textarea',placeholder:'Write your message...',required:false}
  ],
  phone:[{name:'number',label:'Phone Number',type:'text',placeholder:'+255712345678',required:true}],
  sms:[
    {name:'number',label:'Phone Number',type:'text',placeholder:'+255712345678',required:true},
    {name:'message',label:'Message',type:'textarea',placeholder:'Your SMS message...',required:false}
  ]
};

var currentType='text';
var tabs=document.getElementById('tabs');
var formEl=document.getElementById('form');
var emptyState=document.getElementById('emptyState');
var canvasWrap=document.getElementById('canvasWrap');
var qrCanvas=document.getElementById('qrCanvas');
var infoText=document.getElementById('infoText');
var actionsEl=document.getElementById('actions');
var toast=document.getElementById('toast');
var lastQRText='';

function buildForm(type){
  formEl.innerHTML='';
  var fields=FORM_FIELDS[type];
  fields.forEach(function(f){
    var wrap=document.createElement('div');
    wrap.className='field';
    var label=document.createElement('label');
    label.textContent=f.label;
    label.setAttribute('for','f_'+f.name);
    wrap.appendChild(label);

    var input;
    if(f.type==='textarea'){
      input=document.createElement('textarea');
      input.rows=3;
    }else if(f.type==='select'){
      input=document.createElement('select');
      f.options.forEach(function(o){
        var opt=document.createElement('option');
        opt.value=o.v;
        opt.textContent=o.t;
        input.appendChild(opt);
      });
    }else{
      input=document.createElement('input');
      input.type='text';
    }
    input.id='f_'+f.name;
    input.placeholder=f.placeholder||'';
    input.autocomplete='off';
    input.spellcheck=false;
    wrap.appendChild(input);
    formEl.appendChild(wrap);
  });

  // generate button
  var btn=document.createElement('button');
  btn.className='generate-btn';
  btn.type='button';
  btn.innerHTML='✨ Generate QR Code';
  btn.addEventListener('click',onGenerate);
  formEl.appendChild(btn);

  // live update on input
  formEl.querySelectorAll('input,textarea,select').forEach(function(el){
    el.addEventListener('input',function(){
      if(lastQRText) onGenerate();
    });
  });
}

function escapeQR(s){
  return String(s).replace(/\\\\/g,'\\\\\\\\').replace(/;/g,'\\\\;').replace(/,/g,'\\\\,').replace(/:/g,'\\\\:').replace(/"/g,'\\\\"');
}

function buildQRText(type){
  var val=function(n){var el=document.getElementById('f_'+n);return el?el.value.trim():'';};
  switch(type){
    case 'text':return val('content');
    case 'url':{
      var u=val('content');
      if(u&&!/^https?:\\/\\//i.test(u)) u='https://'+u;
      return u;
    }
    case 'wifi':{
      var ssid=val('ssid');
      var pass=val('password');
      var enc=val('encryption')||'WPA';
      if(!ssid) return '';
      if(enc==='nopass') return 'WIFI:T:nopass;S:'+escapeQR(ssid)+';;';
      return 'WIFI:T:'+enc+';S:'+escapeQR(ssid)+';P:'+escapeQR(pass)+';;';
    }
    case 'email':{
      var to=val('to');
      if(!to) return '';
      var subj=val('subject');
      var body=val('body');
      var parts=['mailto:'+to];
      var q=[];
      if(subj) q.push('subject='+encodeURIComponent(subj));
      if(body) q.push('body='+encodeURIComponent(body));
      if(q.length) parts.push('?'+q.join('&'));
      return parts.join('');
    }
    case 'phone':{
      var n=val('number');
      if(!n) return '';
      return 'tel:'+n.replace(/\\s+/g,'');
    }
    case 'sms':{
      var num=val('number');
      if(!num) return '';
      var msg=val('message');
      return 'smsto:'+num.replace(/\\s+/g,'')+(msg?':'+msg:'');
    }
  }
  return '';
}

function truncate(s,n){
  if(s.length<=n) return s;
  return s.slice(0,n-1)+'…';
}

function onGenerate(){
  var text=buildQRText(currentType);
  if(!text){
    showEmpty('Fill in the fields above to generate your QR code');
    return;
  }
  try{
    generateQR(text,qrCanvas,440);
    emptyState.style.display='none';
    canvasWrap.classList.add('show');
    infoText.classList.add('show');
    actionsEl.classList.add('show');
    lastQRText=text;
    infoText.innerHTML='<b>'+currentType.toUpperCase()+'</b> · '+truncate(text.replace(/</g,'&lt;'),80);
  }catch(err){
    showEmpty('⚠️ '+err.message);
  }
}

function showEmpty(msg){
  emptyState.style.display='block';
  emptyState.innerHTML='<span class="preview__empty-icon">📱</span>'+msg;
  canvasWrap.classList.remove('show');
  infoText.classList.remove('show');
  actionsEl.classList.remove('show');
  lastQRText='';
}

// ============================================
// TOAST
// ============================================
var toastTimer=null;
function showToast(msg){
  toast.textContent=msg;
  toast.classList.add('show');
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){toast.classList.remove('show');},1800);
}

// ============================================
// TABS
// ============================================
tabs.addEventListener('click',function(e){
  var t=e.target.closest('.tab');
  if(!t) return;
  e.preventDefault();
  tabs.querySelectorAll('.tab').forEach(function(x){x.classList.remove('is-active');});
  t.classList.add('is-active');
  currentType=t.dataset.type;
  buildForm(currentType);
  showEmpty('Enter content above and tap Generate');
});

// ============================================
// DOWNLOAD
// ============================================
document.getElementById('downloadBtn').addEventListener('click',function(e){
  e.preventDefault();
  if(!lastQRText){showToast('Generate a QR first');return;}
  try{
    var url=qrCanvas.toDataURL('image/png');
    var a=document.createElement('a');
    a.href=url;
    a.download='sila-qr-'+currentType+'-'+Date.now()+'.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('✓ Downloaded');
  }catch(err){
    showToast('Download not supported');
  }
});

// ============================================
// COPY IMAGE
// ============================================
document.getElementById('copyBtn').addEventListener('click',async function(e){
  e.preventDefault();
  if(!lastQRText){showToast('Generate a QR first');return;}
  try{
    if(!navigator.clipboard||!window.ClipboardItem){
      showToast('Copy not supported here');
      return;
    }
    var blob=await new Promise(function(res){qrCanvas.toBlob(res,'image/png');});
    if(!blob){showToast('Failed');return;}
    await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
    showToast('✓ Copied to clipboard');
  }catch(err){
    showToast('Copy failed');
  }
});

// ============================================
// CLEAR
// ============================================
document.getElementById('clearBtn').addEventListener('click',function(e){
  e.preventDefault();
  formEl.querySelectorAll('input,textarea').forEach(function(el){el.value='';});
  formEl.querySelectorAll('select').forEach(function(el){el.selectedIndex=0;});
  showEmpty('Enter content above and tap Generate');
  showToast('Cleared');
});

// ============================================
// INIT
// ============================================
buildForm('text');
showEmpty('Enter content above and tap Generate');

})();
</script>
</body>
</html>
`;

// ============================================
// BOT COMMAND IMPLEMENTATION
// ============================================
export default {
  name: 'qr',
  alias: ['qrcode', 'qrgen', 'generateqr', 'qrgenerate'],
  description: '📱 Generate QR codes for text, URLs, WiFi, email, phone, SMS',
  category: 'tools',
  ownerOnly: false,

  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;

    try {
      const responseId = 'sila-qr-' + Date.now();

      const content = {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: "0cCzjnQ5ERoqM2QrQ7KjmMfxsyeWYu+61/chr2wioyE=",
          botMetadata: {
            messageDisclaimerText: "",
            botResponseId: responseId
          }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                {
                  messageType: 2,
                  messageText: "📱 QR Code Generator"
                }
              ],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  "response_id": responseId,
                  "sections": [
                    {
                      "view_model": {
                        "primitive": {
                          "__typename": "GenAIaeacdsnwHtmlPrimitive",
                          "payload": qrHtml,
                          "trusted_sources": ["sila-tech"]
                        },
                        "__typename": "GenAISingleLayoutViewModel"
                      }
                    }
                  ]
                })).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: "867051314767696@bot"
                },
                forwardOrigin: 4
              }
            }
          }
        }
      };

      await sock.relayMessage(sender, content, {});

    } catch (error) {
      console.error('[QR]', error);
      await sock.sendMessage(sender, {
        text: `✖ Error: ${error?.message || error}`
      }, { quoted: msg });
    }
  }
};