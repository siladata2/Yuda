import { ButtonV2 } from 'baileys';

const stickmanHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
:root{--card-2:#2a3942;--ink:#e9edef;--muted:#8696a0;--accent:#00a884;--line:#2a3942;--cell-bg:#111b21;
--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow:hidden;touch-action:none;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:360px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);}
.header__title{font-size:17px;font-weight:600;}
.header__sub{font-size:12px;color:var(--muted);}
.bars{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.barwrap{flex:1;height:10px;background:var(--cell-bg);border:1px solid var(--line);border-radius:6px;overflow:hidden;}
.bar{height:100%;width:100%;background:var(--accent);transition:width .2s ease;}
.bar.ai{background:#e05c5c;}
.tag{font-size:11px;color:var(--muted);width:34px;}
.wrap{position:relative;background:#111b21;border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,.6);}
canvas{display:block;width:100%;}
.overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(11,20,26,0.8);}
.overlay h2{font-size:19px;text-align:center;padding:0 16px;}
.overlay button{background:var(--accent);border:none;border-radius:8px;color:#0b141a;font-weight:700;font-family:inherit;padding:10px 22px;font-size:14px;cursor:pointer;}
.controls{display:flex;justify-content:space-between;margin-top:12px;gap:8px;}
.ctrl{flex:1;background:var(--card-2);border:1px solid var(--line-strong,#374248);border-radius:10px;padding:12px 0;text-align:center;font-size:13px;font-weight:600;color:var(--ink);cursor:pointer;}
.ctrl:active{background:var(--accent);color:#0b141a;}
.hint{font-size:11px;color:var(--muted);text-align:center;margin-top:8px;}
</style>
</head>
<body>
<main class="stage">
  <div class="card">
    <div class="header">
      <div class="header__title">SILA Stickman Fighter</div>