(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const n of l.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function a(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(r){if(r.ep)return;r.ep=!0;const l=a(r);fetch(r.href,l)}})();const G=300,s=(t,e)=>t*e,C=t=>{const e=t/G;return{width:t,height:t,centerX:s(150,e),centerY:s(150,e),outerRadius:s(142,e),innerRadius:s(128,e),lineStartX:s(35,e),lineEndX:s(265,e),topLineY:s(100,e),bottomLineY:s(200,e),topTextY:s(70,e),middleTextY:s(150,e),bottomTextY:s(240,e)}},J={mincho:'"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif',gothic:'"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif'},Z=.55,O=t=>J[t],I=t=>Number.isFinite(t)?Math.min(2,Math.max(.5,t)):1,k=(t,e,a,o,r)=>{if(!e)return a;let l=a;const n=a*Z;for(;l>n;){if(t.font=`${Math.round(l)}px ${r}`,t.measureText(e).width<=o)return l;l-=1}return n},V={topText:"",dateText:"",bottomText:"",strokeColor:"#ff0000",strokeWidth:3,textColor:"#ff0000",fontFamily:"mincho",textScale:1},K=48,Q=44,tt=(t,e,a)=>{const o={...V,...a},r=Math.min(e.width,e.height),l=r/300,n=C(r),i=O(o.fontFamily),S=I(o.textScale),v=n.lineEndX-n.lineStartX-12*l;t.clearRect(0,0,e.width,e.height),t.save(),t.strokeStyle=o.strokeColor,t.fillStyle=o.textColor,t.lineCap="round",t.lineJoin="round",t.beginPath(),t.lineWidth=o.strokeWidth*2,t.arc(n.centerX,n.centerY,n.outerRadius,0,Math.PI*2),t.stroke(),t.beginPath(),t.lineWidth=o.strokeWidth,t.arc(n.centerX,n.centerY,n.innerRadius,0,Math.PI*2),t.stroke(),t.beginPath(),t.moveTo(n.lineStartX,n.topLineY),t.lineTo(n.lineEndX,n.topLineY),t.moveTo(n.lineStartX,n.bottomLineY),t.lineTo(n.lineEndX,n.bottomLineY),t.stroke(),t.textAlign="center",t.textBaseline="middle";const T=K*l*S,z=Q*l*S,U=k(t,o.topText,T,v,i);t.font=`${Math.round(U)}px ${i}`,t.fillText(o.topText,n.centerX,n.topTextY);const H=k(t,o.dateText,z,v,i);t.font=`${Math.round(H)}px ${i}`,t.fillText(o.dateText,n.centerX,n.middleTextY);const j=k(t,o.bottomText,T,v,i);t.font=`${Math.round(j)}px ${i}`,t.fillText(o.bottomText,n.centerX,n.bottomTextY),t.restore()},et=[{era:"令和",start:{year:2019,month:5,day:1}},{era:"平成",start:{year:1989,month:1,day:8}},{era:"昭和",start:{year:1926,month:12,day:25}},{era:"大正",start:{year:1912,month:7,day:30}},{era:"明治",start:{year:1868,month:1,day:25}}],ot=(t,e)=>t.year!==e.year?t.year>e.year:t.month!==e.month?t.month>e.month:t.day>=e.day,rt=t=>{const e=et.find(a=>ot(t,a.start));if(!e)throw new Error("対応していない日付です（明治以前）");return{era:e.era,eraYear:t.year-e.start.year+1}},N=t=>t.toString().padStart(2,"0"),at=t=>{const e=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!e)throw new Error("日付は YYYY-MM-DD 形式で指定してください");return{year:Number(e[1]),month:Number(e[2]),day:Number(e[3])}},Y=(t,e,a,o)=>o==="年/月/日"?`${t}年${e}月${a}日`:`${t}${o}${e}${o}${a}`,L=(t,e,a)=>{if(!t)return"";const o=at(t),r=N(o.month),l=N(o.day);if(e==="seireki")return Y(String(o.year),r,l,a);const n=rt(o),i=n.eraYear===1?"元":String(n.eraYear);return Y(`${n.era}${i}`,r,l,a)},nt=(t,e)=>{const a=document.createElement("a");a.href=t,a.download=e,a.click()},lt=(t,e,a=()=>document.createElement("canvas"))=>{if(e)return t.toDataURL("image/png");const o=a();o.width=t.width,o.height=t.height;const r=o.getContext("2d");if(!r)throw new Error("PNG export context not available");return r.fillStyle="#ffffff",r.fillRect(0,0,o.width,o.height),r.drawImage(t,0,0),o.toDataURL("image/png")},st=(t,e)=>{const a=e.fileName??"japanese-date-stamp.png",o=e.triggerDownload??nt,r=lt(t,e.transparentBackground,e.createCanvas);o(r,a)},it=48,ct=44,E=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;"),dt=(t,e)=>{let a=0;for(const o of t)a+=/[\u3000-\u9fff\uff00-\uffef]/u.test(o)?e:e*.55;return a},F=(t,e,a)=>{if(!t)return e;const o=e*.55;let r=e;for(;r>o;){if(dt(t,r)<=a)return r;r-=1}return o},ut=(t,e)=>{const a=document.createElement("a");a.href=t,a.download=e,a.click()},mt=t=>{const e=C(t.size),a=I(t.textScale),o=t.size/300,r=e.lineEndX-e.lineStartX-12*o,l=O(t.fontFamily),n=it*o*a,i=ct*o*a,S=F(t.topText,n,r),v=F(t.dateText,i,r),T=F(t.bottomText,n,r);return`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${t.size}" height="${t.size}" viewBox="0 0 ${t.size} ${t.size}">
  <circle cx="${e.centerX}" cy="${e.centerY}" r="${e.outerRadius}" fill="none" stroke="${t.strokeColor}" stroke-width="${t.strokeWidth*2}" />
  <circle cx="${e.centerX}" cy="${e.centerY}" r="${e.innerRadius}" fill="none" stroke="${t.strokeColor}" stroke-width="${t.strokeWidth}" />
  <line x1="${e.lineStartX}" y1="${e.topLineY}" x2="${e.lineEndX}" y2="${e.topLineY}" stroke="${t.strokeColor}" stroke-width="${t.strokeWidth}" stroke-linecap="round" />
  <line x1="${e.lineStartX}" y1="${e.bottomLineY}" x2="${e.lineEndX}" y2="${e.bottomLineY}" stroke="${t.strokeColor}" stroke-width="${t.strokeWidth}" stroke-linecap="round" />
  <text x="${e.centerX}" y="${e.topTextY}" fill="${t.textColor}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.round(S)}" font-family="${l}">${E(t.topText)}</text>
  <text x="${e.centerX}" y="${e.middleTextY}" fill="${t.textColor}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.round(v)}" font-family="${l}">${E(t.dateText)}</text>
  <text x="${e.centerX}" y="${e.bottomTextY}" fill="${t.textColor}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.round(T)}" font-family="${l}">${E(t.bottomText)}</text>
</svg>`},pt=t=>{const e=mt(t),a=new Blob([e],{type:"image/svg+xml;charset=utf-8"}),o=URL.createObjectURL(a);try{const r=t.fileName??"japanese-date-stamp.svg";(t.triggerDownload??ut)(o,r)}finally{URL.revokeObjectURL(o)}},ft=t=>`${L(t.values.date,t.values.eraFormat,t.values.dateSeparator)} ${t.values.topText} / ${t.values.bottomText}`,ht=({listElement:t,entries:e,onSelect:a})=>{if(t.innerHTML="",e.length===0){const o=document.createElement("li");o.className="rounded-md border border-dashed border-slate-300 px-3 py-2 text-slate-500",o.textContent="履歴はまだありません",t.append(o);return}for(const o of e){const r=document.createElement("li"),l=document.createElement("button");l.type="button",l.className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100",l.textContent=ft(o),l.addEventListener("click",()=>a(o)),r.append(l),t.append(r)}},B="japanese-date-stamp.history.v1",P=10,X=(t=localStorage)=>{const e=t.getItem(B);if(!e)return[];try{const a=JSON.parse(e);return Array.isArray(a)?a.slice(0,P):[]}catch{return[]}},gt=(t,e=localStorage)=>{const a=X(e),r=[{id:crypto.randomUUID(),createdAt:new Date().toISOString(),values:t},...a].slice(0,P);return e.setItem(B,JSON.stringify(r)),r},M=document.querySelector("#app"),xt="/japanese-date-stamp/reference-layout.svg";if(!M)throw new Error("App root not found");M.innerHTML=`
  <main class="mx-auto min-h-screen max-w-7xl p-4 sm:p-6 lg:p-8">
    <header class="mb-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">日本向けデータ印ジェネレーター</h1>
      <p class="mt-2 text-sm text-slate-600">入力からプレビュー、履歴、ダウンロードまでを1画面で操作できます。</p>
    </header>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form class="space-y-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200" aria-label="データ印設定フォーム">
        <h2 class="text-lg font-semibold">入力設定</h2>

        <div>
          <label class="input-label" for="topText">上枠テキスト</label>
          <input class="input-control" id="topText" type="text" value="田中" />
        </div>

        <div>
          <label class="input-label" for="date">日付</label>
          <input class="input-control" id="date" type="date" value="2026-02-20" />
        </div>

        <div>
          <label class="input-label" for="bottomText">下枠テキスト</label>
          <input class="input-control" id="bottomText" type="text" value="一郎" />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="input-label" for="eraFormat">日付フォーマット</label>
            <select class="input-control" id="eraFormat">
              <option value="wareki">和暦</option>
              <option value="seireki" selected>西暦</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="dateSeparator">日付区切り文字</label>
            <input class="input-control" id="dateSeparator" type="text" list="dateSeparatorPresets" value="/" />
            <datalist id="dateSeparatorPresets">
              <option value="/" />
              <option value="-" />
              <option value="." />
              <option value="年/月/日" />
            </datalist>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="input-label" for="fontFamily">書体</label>
            <select class="input-control" id="fontFamily">
              <option value="mincho" selected>明朝体</option>
              <option value="gothic">ゴシック体</option>
            </select>
          </div>
          <div>
            <label class="input-label" for="textScale">文字サイズ倍率</label>
            <input class="input-control" id="textScale" type="number" min="0.5" max="2" step="0.1" value="1" />
          </div>
          <div>
            <label class="input-label" for="textColor">テキスト色</label>
            <input class="input-control h-10 p-1" id="textColor" type="color" value="#ff0000" />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="input-label" for="strokeWidth">枠線太さ(px)</label>
            <input class="input-control" id="strokeWidth" type="number" min="1" step="1" value="3" />
          </div>
          <div>
            <label class="input-label" for="strokeColor">枠線色</label>
            <input class="input-control h-10 p-1" id="strokeColor" type="color" value="#ff0000" />
          </div>
        </div>

        <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <label class="inline-flex items-center gap-2 text-sm text-slate-700" for="transparentBg">
            <input id="transparentBg" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
            PNGを透過背景で出力
          </label>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <button id="downloadPng" type="button" class="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">PNGをダウンロード</button>
          <button id="downloadSvg" type="button" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">SVGをダウンロード</button>
        </div>

        <button id="saveHistory" type="button" class="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">現在の設定を履歴に保存</button>
      </form>

      <div class="space-y-6">
        <section class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold">プレビュー</h2>
            <span class="text-xs text-slate-500">reference-layout.svgベース</span>
          </div>
          <div class="grid place-items-center rounded-lg border border-slate-200 bg-slate-50 p-4">
            <img src="${xt}" alt="データ印レイアウト参考図" class="h-auto w-full max-w-xs" />
            <canvas id="stampCanvas" lang="ja-JP" width="300" height="300" class="mt-4 w-full max-w-xs rounded-md border border-dashed border-slate-300 bg-white"></canvas>
          </div>
        </section>

        <section class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 class="text-lg font-semibold">履歴（最大10件）</h2>
          <ul id="historyList" class="mt-3 space-y-2 text-sm" aria-label="履歴一覧"></ul>
        </section>
      </div>
    </section>
  </main>
`;const d=document.querySelector("#topText"),u=document.querySelector("#date"),m=document.querySelector("#bottomText"),p=document.querySelector("#eraFormat"),f=document.querySelector("#dateSeparator"),h=document.querySelector("#fontFamily"),g=document.querySelector("#textScale"),x=document.querySelector("#textColor"),b=document.querySelector("#strokeColor"),y=document.querySelector("#strokeWidth"),$=document.querySelector("#transparentBg"),A=document.querySelector("#downloadPng"),_=document.querySelector("#downloadSvg"),D=document.querySelector("#saveHistory"),W=document.querySelector("#historyList"),c=document.querySelector("#stampCanvas");if(!d||!u||!m||!p||!f||!h||!g||!x||!b||!y||!$||!A||!_||!D||!W||!c)throw new Error("Rendering controls not found");const R=c.getContext("2d");if(!R)throw new Error("Canvas 2D context not found");const w=()=>{const t=L(u.value,p.value,f.value);tt(R,c,{topText:d.value,dateText:t,bottomText:m.value,fontFamily:h.value,textScale:Number(g.value),textColor:x.value,strokeColor:b.value,strokeWidth:Number(y.value)})},bt=()=>({topText:d.value,date:u.value,bottomText:m.value,eraFormat:p.value,dateSeparator:f.value,fontFamily:h.value,textScale:Number(g.value),textColor:x.value,strokeColor:b.value,strokeWidth:Number(y.value),transparentBackground:$.checked}),yt=t=>{d.value=t.topText,u.value=t.date,m.value=t.bottomText,p.value=t.eraFormat,f.value=t.dateSeparator,h.value=t.fontFamily,g.value=String(t.textScale),x.value=t.textColor,b.value=t.strokeColor,y.value=String(t.strokeWidth),$.checked=t.transparentBackground,w()},q=()=>{ht({listElement:W,entries:X(),onSelect:t=>yt(t.values)})},vt=[d,u,m,p,f,h,g,x,b,y];for(const t of vt)t.addEventListener("input",w),t.addEventListener("change",w);A.addEventListener("click",()=>{st(c,{transparentBackground:$.checked})});_.addEventListener("click",()=>{pt({size:Math.min(c.width,c.height),topText:d.value,dateText:L(u.value,p.value,f.value),bottomText:m.value,strokeColor:b.value,strokeWidth:Number(y.value),textColor:x.value,fontFamily:h.value,textScale:Number(g.value)})});D.addEventListener("click",()=>{gt(bt()),q()});w();q();
