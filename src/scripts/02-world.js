const IDS=['george','bill','chimera','becky','daybreak','emile','ewen','henry','franky','yuri','sylvia','fiona','martha','melinda','donovan','demetrius','camilla','shopkeeper','matthew','olka'];
const COLORS=['#f5babb','#f2d0a1','#b8d3c0','#d5c5ae','#b9ccd8','#e9bc92','#d2bfde','#b6d5d2','#ebc6a4','#e9b9c7','#acbad4','#d4c2a2','#c6d4bd','#e6baa8','#c4c1df','#f1d1aa','#afd4bf','#bfccd5','#dfb0c7','#b9c8ab'];
const chapters=CONTENT.map((e,i)=>{
 const row=Math.floor(i/5),col=i%5,c=row%2?4-col:col;
 return {index:i,id:IDS[i],short:e[0],name:e[0],tag:e[1],title:e[2],known:e[3],math:e[4],experiment:e[5],frontier:e[6],paper:e[7],source:e[8],correct:e[9],wrong:[e[10],e[11]],role:e[12],color:COLORS[i],place:[5+row*5+c*4,5+row*5+(4-c)*4]};
});


/* Accessible, offline mathematical typesetting: native MathML with exact LaTeX sources. */
const BV_TEX = [
  String.raw`\mathrm{rules}\longrightarrow\mathrm{representations}\longrightarrow\mathrm{experience}`,
  String.raw`\mathrm{evidence}+\mathrm{assumptions}\longrightarrow\mathrm{testable\ hypothesis}`,
  String.raw`T(n)\in\{\mathcal{O}(n),\mathcal{O}(n\log n),\mathcal{O}(n^2)\}`,
  String.raw`\Pr(X\mid Y)=\frac{\Pr(Y\mid X)\Pr(X)}{\Pr(Y)}`,
  String.raw`\theta_{t+1}=\theta_t-\eta\nabla_\theta\mathcal{L}(\theta_t)`,
  String.raw`\mathcal{R}_{\mathrm{test}}\neq\mathcal{R}_{\mathrm{train}}`,
  String.raw`\frac{\partial\mathcal{L}}{\partial W}=\frac{\partial\mathcal{L}}{\partial h}\frac{\partial h}{\partial W}`,
  String.raw`\mathcal{L}_{\mathrm{SSL}}=d\big(f_\theta(x),g_\xi(x)\big)`,
  String.raw`z_t=f_\theta(o_{\le t})`,
  String.raw`\hat{s}=\underset{s}{\operatorname{argmin}}\,E_\theta(s,c)`,
  String.raw`\mathcal{L}=d\big(P_\theta(c),\operatorname{sg}(T_\xi(x))\big)`,
  String.raw`s_{t+1}=f_\theta(s_t,a_t)+\varepsilon_t`,
  String.raw`z_t\xrightarrow{a_t}z_{t+1}\longrightarrow\cdots\longrightarrow z_{t+H}`,
  String.raw`\mathbf{a}^{*}=\underset{\mathbf a}{\operatorname{argmin}}\sum_{k=0}^{H-1}\ell(\hat{s}_{t+k},a_{t+k})`,
  String.raw`\mathrm{select}\longrightarrow\mathrm{expand}\longrightarrow\mathrm{evaluate}\longrightarrow\mathrm{refine}`,
  String.raw`z=\{z_{\mathrm{object}},z_{\mathrm{relation}},z_{\mathrm{contact}}\}`,
  String.raw`a_t=\pi(b_t,g,\mathcal C)`,
  String.raw`\operatorname{allow}(a_t)\Longrightarrow a_t\in\mathcal A_{\mathrm{verified}}`,
  String.raw`\mathrm{observe}\longrightarrow\mathrm{hypothesize}\longrightarrow\mathrm{intervene}\longrightarrow\mathrm{update}`,
  String.raw`\mathrm{experience}\longrightarrow\mathrm{model\ revision}\longrightarrow\mathrm{novel\ tasks}\longrightarrow\mathrm{evaluation}`
];
const bvNode=(tag,...children)=>'<'+tag+'>'+children.join('')+'</'+tag+'>';
const bvMi=t=>bvNode('mi',t), bvMn=t=>bvNode('mn',String(t)), bvMo=t=>bvNode('mo',t), bvMt=t=>bvNode('mtext',t);
const bvRow=(...x)=>bvNode('mrow',...x), bvSub=(a,b)=>bvNode('msub',a,b), bvSup=(a,b)=>bvNode('msup',a,b);
const bvFrac=(a,b)=>bvNode('mfrac',a,b), bvOver=(a,b)=>bvNode('mover',a,b), bvUnder=(a,b)=>bvNode('munder',a,b);
const bvCall=(f,...args)=>bvRow(f,bvMo('('),...args,bvMo(')'));
const bvArrow=bvMo('⟶'), bvTheta=bvMi('θ'), bvL=bvMi('ℒ');
const bvSet=(...items)=>bvRow(bvMo('{'),...items.flatMap((x,i)=>i?[bvMo(','),x]:[x]),bvMo('}'));
const BV_MATHML=[
  bvRow(bvMt('rules'),bvArrow,bvMt('representations'),bvArrow,bvMt('experience')),
  bvRow(bvMt('evidence'),bvMo('+'),bvMt('assumptions'),bvArrow,bvMt('testable hypothesis')),
  bvRow(bvCall(bvMi('T'),bvMi('n')),bvMo('∈'),bvSet(
    bvCall(bvMi('𝒪'),bvMi('n')),
    bvCall(bvMi('𝒪'),bvRow(bvMi('n'),bvMt(' log '),bvMi('n'))),
    bvCall(bvMi('𝒪'),bvSup(bvMi('n'),bvMn(2))))),
  bvRow(bvCall(bvMt('Pr'),bvMi('X'),bvMo('|'),bvMi('Y')),bvMo('='),
    bvFrac(bvRow(bvCall(bvMt('Pr'),bvMi('Y'),bvMo('|'),bvMi('X')),bvCall(bvMt('Pr'),bvMi('X'))),
      bvCall(bvMt('Pr'),bvMi('Y')))),
  bvRow(bvSub(bvTheta,bvRow(bvMi('t'),bvMo('+'),bvMn(1))),bvMo('='),
    bvSub(bvTheta,bvMi('t')),bvMo('−'),bvMi('η'),
    bvSub(bvMo('∇'),bvTheta),bvCall(bvL,bvSub(bvTheta,bvMi('t')))),
  bvRow(bvSub(bvMi('ℛ'),bvMt('test')),bvMo('≠'),bvSub(bvMi('ℛ'),bvMt('train'))),
  bvRow(bvFrac(bvRow(bvMo('∂'),bvL),bvRow(bvMo('∂'),bvMi('W'))),bvMo('='),
    bvFrac(bvRow(bvMo('∂'),bvL),bvRow(bvMo('∂'),bvMi('h'))),
    bvFrac(bvRow(bvMo('∂'),bvMi('h')),bvRow(bvMo('∂'),bvMi('W')))),
  bvRow(bvSub(bvL,bvMt('SSL')),bvMo('='),
    bvCall(bvMi('d'),bvCall(bvSub(bvMi('f'),bvTheta),bvMi('x')),bvMo(','),
      bvCall(bvSub(bvMi('g'),bvMi('ξ')),bvMi('x')))),
  bvRow(bvSub(bvMi('z'),bvMi('t')),bvMo('='),
    bvCall(bvSub(bvMi('f'),bvTheta),bvSub(bvMi('o'),bvRow(bvMo('≤'),bvMi('t'))))),
  bvRow(bvOver(bvMi('s'),bvMo('^')),bvMo('='),
    bvUnder(bvMt('arg min'),bvMi('s')),
    bvCall(bvSub(bvMi('E'),bvTheta),bvMi('s'),bvMo(','),bvMi('c'))),
  bvRow(bvL,bvMo('='),
    bvCall(bvMi('d'),bvCall(bvSub(bvMi('P'),bvTheta),bvMi('c')),bvMo(','),
      bvCall(bvMt('sg'),bvCall(bvSub(bvMi('T'),bvMi('ξ')),bvMi('x'))))),
  bvRow(bvSub(bvMi('s'),bvRow(bvMi('t'),bvMo('+'),bvMn(1))),bvMo('='),
    bvCall(bvSub(bvMi('f'),bvTheta),bvSub(bvMi('s'),bvMi('t')),bvMo(','),
      bvSub(bvMi('a'),bvMi('t'))),bvMo('+'),bvSub(bvMi('ε'),bvMi('t'))),
  bvRow(bvSub(bvMi('z'),bvMi('t')),
    bvOver(bvArrow,bvSub(bvMi('a'),bvMi('t'))),
    bvSub(bvMi('z'),bvRow(bvMi('t'),bvMo('+'),bvMn(1))),bvArrow,bvMo('⋯'),bvArrow,
    bvSub(bvMi('z'),bvRow(bvMi('t'),bvMo('+'),bvMi('H')))),
  bvRow(bvSup(bvMi('𝐚'),bvMo('*')),bvMo('='),
    bvUnder(bvMt('arg min'),bvMi('𝐚')),
    bvNode('munderover',bvMi('∑'),bvRow(bvMi('k'),bvMo('='),bvMn(0)),
      bvRow(bvMi('H'),bvMo('−'),bvMn(1))),
    bvCall(bvMi('ℓ'),bvSub(bvOver(bvMi('s'),bvMo('^')),bvRow(bvMi('t'),bvMo('+'),bvMi('k'))),
      bvMo(','),bvSub(bvMi('a'),bvRow(bvMi('t'),bvMo('+'),bvMi('k'))))),
  bvRow(bvMt('select'),bvArrow,bvMt('expand'),bvArrow,bvMt('evaluate'),bvArrow,bvMt('refine')),
  bvRow(bvMi('z'),bvMo('='),bvSet(bvSub(bvMi('z'),bvMt('object')),
    bvSub(bvMi('z'),bvMt('relation')),bvSub(bvMi('z'),bvMt('contact')))),
  bvRow(bvSub(bvMi('a'),bvMi('t')),bvMo('='),
    bvCall(bvMi('π'),bvSub(bvMi('b'),bvMi('t')),bvMo(','),bvMi('g'),bvMo(','),bvMi('𝒞'))),
  bvRow(bvCall(bvMt('allow'),bvSub(bvMi('a'),bvMi('t'))),bvMo('⟹'),
    bvSub(bvMi('a'),bvMi('t')),bvMo('∈'),bvSub(bvMi('𝒜'),bvMt('verified'))),
  bvRow(bvMt('observe'),bvArrow,bvMt('hypothesize'),bvArrow,bvMt('intervene'),bvArrow,bvMt('update')),
  bvRow(bvMt('experience'),bvArrow,bvMt('model revision'),bvArrow,bvMt('novel tasks'),bvArrow,bvMt('evaluation'))
];
const bvMathEscape=t=>String(t).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function chapterEquation(i){
  if(!Number.isInteger(i)||i<0||i>=20)return '';
  return '<div class="math-line bv-typeset-math"><div class="bv-math-scroll"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics>'+
    BV_MATHML[i]+'<annotation encoding="application/x-tex">'+bvMathEscape(BV_TEX[i])+'</annotation></semantics></math></div></div>';
}

const canvas=document.getElementById('world'),ctx=canvas.getContext('2d',{alpha:false});ctx.imageSmoothingEnabled=false;
const W=canvas.width,H=canvas.height,TW=60,TH=30,NX=48,NY=48,OX=535,OY=-100;
const imgs={};for(const id of [...IDS,'anya','bond','damian','yor','loid','explorer','stella','tonitrus','explorer_scholar']){const im=new Image();if(INLINE_SPRITES[id])im.src=INLINE_SPRITES[id];imgs[id]=im;}
const state={player:{x:chapters[0].place[0]+.5,y:chapters[0].place[1]+.8},cam:{x:0,y:0},current:0,completed:new Set(),selection:null,hover:null,hitBoxes:[],toy:{x:0,v:1,a:0},energy:null,correctAnswered:false,travel:null,t:0};
try{const p=JSON.parse(localStorage.getItem('latent-atlas-thread-v2')||'[]');if(Array.isArray(p)){for(let i=0;i<chapters.length;i++){if(!p.includes(i))break;state.completed.add(i);}}}catch(_){}
state.current=state.completed.size;
const initial=chapters[Math.min(state.current,chapters.length-1)].place;state.player={x:initial[0]+.5,y:initial[1]+.8};
function save(){try{localStorage.setItem('latent-atlas-thread-v2',JSON.stringify([...state.completed]));}catch(_) {}}
function rawIso(x,y){return{x:OX+(x-y)*TW/2,y:OY+(x+y)*TH/2};}
function iso(x,y){const p=rawIso(x,y);return{x:p.x+state.cam.x,y:p.y+state.cam.y};}
function hash(x,y){let n=(x*374761393+y*668265263)^0x51ab1d;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;}
function box(x,y,w,h,fill,stroke){ctx.fillStyle=fill;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.strokeRect(Math.round(x)+.5,Math.round(y)+.5,Math.round(w)-1,Math.round(h)-1);}}
function polygon(points,fill,stroke){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function txt(str,x,y,size,color,align='center',weight='800'){ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.font=`${weight} ${size}px ui-monospace, Menlo, monospace`;ctx.fillStyle=color;ctx.fillText(str,x,y);}
function betweenDistance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(len||1)));return Math.hypot(p[0]-(a[0]+t*dx),p[1]-(a[1]+t*dy));}
function pathTile(x,y){for(let i=0;i<chapters.length-1;i++)if(betweenDistance([x,y],chapters[i].place,chapters[i+1].place)<1.05)return true;return typeof bvAdvancedPreviewPathTile==='function'&&bvAdvancedPreviewPathTile(x,y);}
function tile(x,y){const p=iso(x,y);if(p.x<-44||p.x>W+44||p.y<-30||p.y>H+33)return;const f=hash(x,y),path=pathTile(x,y),c=path?(f>.5?'#e7d9b6':'#e1d2ae'):(f>.7?'#a6d2aa':f>.4?'#a9ce9b':'#a9d0b0');polygon([[p.x,p.y-TH/2],[p.x+TW/2,p.y],[p.x,p.y+TH/2],[p.x-TW/2,p.y]],c,path?'#d5c7a7':'#95bd91');if(x===NX-1||y===NY-1)polygon([[p.x+TW/2,p.y],[p.x,p.y+TH/2],[p.x,p.y+TH/2+13],[p.x+TW/2,p.y+13]],'#71a589');if(f>.84&&!path){box(p.x-6,p.y-4,3,3,'#84b98a');box(p.x+5,p.y+3,3,2,'#79af84');}}
function drawFlower(p,seed){const x=p.x,y=p.y;box(x-1,y-9,2,11,'#709f77');box(x-6,y-8,11,6,seed>.6?'#f3b7c9':'#fff0b4');box(x-2,y-6,4,3,'#debd81');}
function drawBush(p,f){const x=p.x,y=p.y;polygon([[x-16,y],[x-11,y-11],[x-2,y-14],[x+11,y-9],[x+17,y],[x,y+5]],'#417d5e');polygon([[x-11,y-3],[x-7,y-12],[x+5,y-12],[x+12,y-1]],'#79ad7b');box(x-4,y-9,5,2,'#b2d59b');if(f>.8)box(x+6,y-5,3,3,'#f6abbf');}
function drawTree(p,f){const x=p.x,y=p.y,flower=f>.965,col=flower?'#ed9fae':'#488b69',bright=flower?'#ffd0da':'#8ac59a';
 box(x-4,y-31,8,34,'#805d50');box(x+2,y-29,3,28,'#a48164');
 polygon([[x-30,y-26],[x-23,y-49],[x,y-61],[x+23,y-49],[x+30,y-26],[x+16,y-16],[x-20,y-16]],flower?'#be6c84':'#3a7557');
 polygon([[x-30,y-39],[x-13,y-58],[x+7,y-66],[x+25,y-50],[x+31,y-38],[x+11,y-27],[x-16,y-31]],col);
 polygon([[x-20,y-53],[x-9,y-69],[x+8,y-69],[x+24,y-49],[x+5,y-43],[x-17,y-43]],bright);
 for(let i=0;i<7;i++){const px=x-18+hash(i,f*100)*35,py=y-57+hash(i+7,f*100)*23;box(px,py,4,4,flower?'#ffe4e4':'#b2d8ac');}
}
function drawHouse(ch){const i=ch.index,p=iso(...ch.place),x=Math.round(p.x),y=Math.round(p.y),h=47+(i%3)*5,done=state.completed.has(i),active=i===state.current;
 const roof=ch.color;
 polygon([[x-47,y+7],[x,y+28],[x+47,y+7],[x,y-15]],'#709c79');
 polygon([[x-34,y-h],[x,y-h+16],[x,y+9],[x-34,y-7]],'#f7eedb','#c4b99e');
 polygon([[x,y-h+16],[x+35,y-h],[x+35,y-7],[x,y+9]],'#decbb5','#b9b19d');
 // warm pixelated brick and timber panels
 for(let k=0;k<5;k++){box(x-31+k*5,y-h+20+k*3,7,2,'#e3d0ba');box(x+9+k*5,y-h+23-k*2,6,2,'#c5b49c');}
 polygon([[x-41,y-h],[x,y-h-25],[x+41,y-h],[x,y-h+20]],roof,'#607164');
 polygon([[x-41,y-h],[x,y-h+20],[x,y-h+10],[x-41,y-h-9]],'#ad8d88');
 for(let k=-2;k<=2;k++){box(x+k*13-6,y-h-7+Math.abs(k)*2,8,3,'#ffffff65');}
 box(x-27,y-h+11,12,13,'#785a58');box(x-25,y-h+13,8,9,'#ffe0a4');box(x-22,y-h+16,2,3,'#fff5d3');
 box(x+14,y-h+11,12,13,'#785a58');box(x+16,y-h+13,8,9,'#ffe0a4');box(x+19,y-h+16,2,3,'#fff5d3');
 polygon([[x-9,y-9],[x,y-5],[x,y+9],[x-9,y+3]],'#638979');polygon([[x,y-5],[x+9,y-10],[x+9,y+3],[x,y+9]],'#426c61');
 box(x+3,y+0,2,2,'#e9d7a0');box(x-37,y+2,7,8,'#67996f');box(x+31,y+2,7,8,'#6d9e6b');
 // chimney, roof tiles, flowerbeds and playful lantern
 box(x+12,y-h-26,8,11,'#a57f79');box(x+13,y-h-28,9,4,'#dfb0a6');
 if(i%3===0){drawFlower({x:x-44,y:y+10},.7);drawFlower({x:x+43,y:y+12},.2);}
 if(active){const b=Math.sin(state.t*.004)*3;box(x-4,y-h-51+b,9,10,'#fce9ab','#ae9560');txt('!',x+.5,y-h-43+b,10,'#926950');}
 const label=ch.short.length>18?ch.short.slice(0,17)+'…':ch.short;
 const lw=Math.max(87,label.length*6+39),ly=y-h-70;
 box(x-lw/2+3,ly+3,lw,22,'#5d866d');box(x-lw/2,ly,lw,22,active?'#fff8dc':'#fffaf1',active?'#e2af54':'#9eb09b');box(x-lw/2+4,ly+3,20,16,active?'#e6b964':done?'#8cb8a5':'#b9c8ba');txt(String(i+1).padStart(2,'0'),x-lw/2+14,ly+15,10,'#42594e');txt(label,x+10,ly+15,10,'#466556');
 state.hitBoxes.push({kind:i>=20?'advanced-preview':'chapter',index:i>=20?i-20:i,x:x-Math.max(52,lw/2),y:ly-5,w:Math.max(104,lw),h:y-ly+21,depth:ch.place[0]+ch.place[1]});
}
function drawNpc(ch){const p=iso(ch.place[0]+1.25,ch.place[1]+1.45),x=p.x,y=p.y,b=Math.sin(state.t*.002+ch.index)*1.5,im=imgs[ch.id],h=ch.index>=20?(ch.id==='bond'?70:ch.id==='anya'?74:ch.id==='loid'||ch.id==='yor'?78:74):ch.id==='bill'?91:ch.id==='matthew'||ch.id==='olka'?78:ch.id==='daybreak'?77:71;
 ctx.fillStyle='#43735a60';ctx.beginPath();ctx.ellipse(x,y+2,ch.id==='bill'?25:15,5,0,0,Math.PI*2);ctx.fill();
 if(ch.index>=20&&typeof bvAdvancedPreviewHalo==='function'){const n=ch.index-20,bvStar=!!quest?.advanced?.stars?.[n],locked=!bvAdvancedAllowed()||n>bvAdvancedCurrent();bvAdvancedPreviewHalo(x,y-h/2+b,ch.id==='bond'?49:43,locked,bvStar);}
 if(im?.complete&&im.naturalWidth){const w=h*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,x-w/2,y-h+b,w,h);}else {box(x-12,y-42,24,36,ch.color);box(x-9,y-53,18,17,'#f0d3be');}
 if(typeof quest!=='undefined'){const advIndex=ch.index-20,advanced=ch.index>=20;
 const badge=advanced?(quest.advanced?.stars?.[advIndex]?'stella':(!bvAdvancedAllowed()||advIndex>bvAdvancedCurrent()?'tonitrus':null)):(quest.stars[ch.index]?'stella':ch.index>state.current?'tonitrus':null);if(badge&&imgs[badge].complete&&imgs[badge].naturalWidth)ctx.drawImage(imgs[badge],x+22,y-h+2+b,21,22);}
 if(state.current===ch.index){txt('✦',x,y-h-9+b,16,'#fff3c0');}
 state.hitBoxes.push({kind:ch.index>=20?'advanced-preview':'chapter',index:ch.index>=20?ch.index-20:ch.index,x:x-29,y:y-h-13,w:58,h:h+22,depth:ch.place[0]+ch.place[1]+2});
}
function drawExplorer(){const p=iso(state.player.x,state.player.y),x=p.x,y=p.y,im=imgs.explorer,b=Math.sin(state.t*.011)*1.4;
 ctx.fillStyle='#476e5770';ctx.beginPath();ctx.ellipse(x,y+3,16,5,0,0,Math.PI*2);ctx.fill();
 if(im.complete&&im.naturalWidth){const h=75,w=h*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,x-w/2,y-h+b,w,h);}else{box(x-10,y-34,20,36,'#266ec8');box(x-11,y-56,22,25,'#262631');}
 box(x-24,y-93+b,48,17,'#304c64','#e8e2d8');txt('YOU ✦',x,y-81+b,10,'#fff9ef');}
function drawFountain(){const p=iso(23,22),x=p.x,y=p.y;polygon([[x-34,y],[x,y+17],[x+34,y],[x,y-17]],'#d3ddc6');polygon([[x-30,y-1],[x,y+12],[x+30,y-1],[x,y-14]],'#8ec9cf');box(x-3,y-32,6,28,'#e1ece5');box(x-14,y-15,29,5,'#e0e9d5');box(x-10,y-12,20,4,'#a0c2bf');box(x-1,y-41,2,13,'#a2dcde');}
function drawPath(){for(let i=0;i<chapters.length-1;i++){const a=chapters[i].place,b=chapters[i+1].place,active=i<state.current;for(let k=1;k<=17;k++){const t=k/18,p=iso(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);if(p.x<-20||p.x>W+20||p.y<-20||p.y>H+20)continue;box(p.x-2,p.y-3,4,5,active?'#f9d985':'#c6ac8e');if(k===9){ctx.fillStyle=active?'#fff2b2':'#e0cbbb';ctx.beginPath();ctx.arc(p.x,p.y-4,7,0,Math.PI*2);ctx.fill();txt('›',p.x,p.y,12,'#8c775f');if(!active&&imgs.tonitrus.complete&&imgs.tonitrus.naturalWidth)ctx.drawImage(imgs.tonitrus,p.x-14,p.y-34,28,28);}}}
 if(typeof bvAdvancedPreviewPath==='function')bvAdvancedPreviewPath();}
let last=0;
function render(ms){requestAnimationFrame(render);if(ms-last<85)return;last=ms;state.t=ms;
 if(state.travel){const tr=state.travel,tt=Math.min(1,(ms-tr.start)/1150),ease=tt*tt*(3-2*tt);state.player.x=tr.from.x+(tr.to.x-tr.from.x)*ease;state.player.y=tr.from.y+(tr.to.y-tr.from.y)*ease;if(tt>=1){state.travel=null;openChapter(state.current);}}
 const target=rawIso(state.player.x,state.player.y),cx=W*.50-target.x+(state.explorePan?.x||0),cy=H*.58-target.y+(state.explorePan?.y||0);
 state.cam.x+=(cx-state.cam.x)*.10;state.cam.y+=(cy-state.cam.y)*.10;
 const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#bfe4d2');grad.addColorStop(.6,'#87bfc0');grad.addColorStop(1,'#699eaa');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 for(let n=0;n<30;n++){let x=hash(n,42)*W,y=hash(n,73)*H;box(x,y,15+hash(n,15)*18,2,'#d5f3df77');}
 for(let s=0;s<NX+NY-1;s++)for(let x=0;x<NX;x++){const y=s-x;if(y>=0&&y<NY)tile(x,y);}
 drawPath();state.hitBoxes=[];
 const objects=[];
 for(let x=0;x<NX;x++)for(let y=0;y<NY;y++){
 const p=iso(x,y);if(p.x<-80||p.x>W+80||p.y<-100||p.y>H+65)continue;
 const n=hash(x+31,y+87),occupied=chapters.some(a=>Math.abs(a.place[0]-x)+Math.abs(a.place[1]-y)<2.6)||Math.hypot(x-23,y-22)<2.8||(typeof bvAdvancedPreviewOccupied==='function'&&bvAdvancedPreviewOccupied(x,y));
 if(!occupied&&!pathTile(x,y)&&n>.90){const frankyTree=x===16&&y===24,handlerTree=x===17&&y===33,tx=frankyTree?14:handlerTree?15:x,ty=frankyTree?26:handlerTree?34:y;objects.push({place:[tx,ty],fn:()=>drawTree(iso(tx,ty),n)});}
 else if(!occupied&&!pathTile(x,y)&&n>.81)objects.push({place:[x,y],fn:()=>drawBush(iso(x,y),n)});
 else if(!occupied&&!pathTile(x,y)&&n>.72)objects.push({place:[x,y],fn:()=>drawFlower(iso(x,y),n)});
 }
 chapters.forEach(ch=>{objects.push({place:ch.place,fn:()=>drawHouse(ch)});objects.push({place:[ch.place[0]+1.25,ch.place[1]+1.45],fn:()=>drawNpc(ch)});});
 if(typeof bvAdvancedPreviewAddObjects==='function')bvAdvancedPreviewAddObjects(objects);
 objects.push({place:[23,22],fn:drawFountain});objects.push({place:[state.player.x,state.player.y],fn:drawExplorer});
 objects.sort((a,b)=>(a.place[0]+a.place[1])-(b.place[0]+b.place[1]));objects.forEach(x=>x.fn());
 box(17,14,220,28,'#294b4dc9','#8cbeae');txt('A LIVING RESEARCH GARDEN',127,32,12,'#fff6df');
 const info=state.current<chapters.length?`NEXT ${String(state.current+1).padStart(2,'0')}/${chapters.length}: ${chapters[state.current].short}`:'JOURNEY COMPLETE · KEEP RESEARCHING';
 box(17,H-38,Math.min(W-30,info.length*7.3+20),24,'#fff6dfde','#bcae96');txt(info,29,H-22,11,'#476c59','left');
}
function progress(){const count=state.completed.size;document.getElementById('progress-numeric').innerHTML=`${String(count).padStart(2,'0')} <small>/ ${chapters.length}</small>`;document.getElementById('progress-fill').style.width=`${count/chapters.length*100}%`;}
function ribbon(){const root=document.getElementById('chapter-ribbon');root.innerHTML=chapters.map((ch,i)=>`<button type="button" role="listitem" class="chapter-button ${state.completed.has(i)?'done':''} ${state.current===i?'active':''} ${i>state.current?'locked':''}" data-chapter="${i}" aria-label="Chapter ${i+1} ${ch.short}${i>state.current?' locked':''}"><span class="chapter-no">${String(i+1).padStart(2,'0')} / ${chapters.length}</span><span class="chapter-title">${ch.short}</span><span class="chapter-status">${i>state.current?'♢ complete previous first':state.completed.has(i)?'✓ discovered':'✦ current quest'}</span></button>`).join('');}
function toyHTML(){const t=state.toy;return `<div class="toy-lab"><h5>PLAYABLE STATE-TRANSITION TOY</h5><div class="toy-title">A hand-coded rule, NOT a trained world model. Δt = 1, v bounded to [−3, 3].</div><div class="toy-viz"><div>position<br><span class="toy-number" id="toy-x">${t.x}</span></div><div>velocity<br><span class="toy-number" id="toy-v">${t.v}</span></div><div>acceleration<br><span class="toy-number" id="toy-a">${t.a}</span></div></div><div class="toy-actions"><button data-accel="-1">← a = −1</button><button data-accel="0">a = 0</button><button data-accel="1">a = +1 →</button><button data-accel="reset">Reset</button></div><div class="toy-result" id="toy-result">Select an action to compute the next state.</div></div>`;}
function energyHTML(){return `<div class="toy-lab"><h5>PLAYABLE ENERGY LANDSCAPE</h5><div class="toy-title">Hand-coded E(s)=(s−2)²+0.4 for candidate s. Lower energy is preferred; it is NOT a calibrated probability or a learned EBM.</div><div class="toy-actions">${[-1,0,1,2,3].map(x=>`<button data-energy="${x}">s = ${x}</button>`).join('')}</div><div class="toy-result" id="energy-result">Test candidate states to find the minimum.</div></div>`;}
function article(ch){const i=ch.index,finished=state.completed.has(i),answered=state.correctAnswered||finished;return `<article class="chapter-article"><div class="chapter-tag"><span>✦</span> LEVEL ${String(i+1).padStart(2,'0')} / ${chapters.length} · ${ch.tag}</div><div class="guide-header"><img src="${INLINE_SPRITES[ch.id]}" alt="Pixel companion for ${ch.short}"><div><h4>${ch.title}</h4><p>Concept: ${ch.short}</p></div></div><p class="lede">${ch.tag}</p><h5>01 · What you must understand</h5><p>${ch.known}</p>${chapterEquation(i)}<h5>02 · A real experiment to implement</h5><p>${ch.experiment}</p>${window.microLabHTML?microLabHTML(ch):''}<div class="frontier"><h5>03 · Open, unsolved research question</h5><p>${ch.frontier}</p></div>${ch.role==='dynamics'?toyHTML():''}${ch.role==='energy'?energyHTML():''}<a href="${ch.source}" class="paper-link" target="_blank" rel="noopener noreferrer">↗ PRIMARY READING<br><span style="font-weight:500">${ch.paper}</span></a><div class="knowledge-check"><h5>04 · Check the prerequisite</h5><p>Choose the scientifically defensible statement to unlock the next chapter.</p><div class="check-answers">${quizOptions(ch).map((o,j)=>`<button data-answer="${i}:${j}" ${answered?'disabled':''}>${o}</button>`).join('')}</div><div class="quiz-feedback" id="quiz-feedback">${answered?'✓ Principle verified. You may continue.':'Knowledge gates preserve the chapter order.'}</div></div>${answered&&i===state.current?`<button class="action-button" type="button" data-continue="${i}">Complete this level · follow the path →</button>`:''}${finished?`<p class="chapter-finished">✓ Completed. Earlier ideas remain available for review.</p>`:''}</article>`;}
function quizOptions(ch){const a=[ch.correct,...ch.wrong];return [a[1],a[0],a[2]];}
function lockedArticle(i){const ch=chapters[i],next=chapters[state.current];return `<article class="chapter-article"><div class="chapter-tag">♢ RESEARCH PATH LOCKED</div><h4>${ch.short}</h4><p class="lede">The garden follows ONE continuous scientific thread. You cannot jump directly to this chapter.</p><h5>Required previous chapter</h5><p>${next?`${String(state.current+1).padStart(2,'0')} · ${next.short}`:'All chapters are complete.'}</p><button class="action-button" data-goto-next type="button">Follow the next concept →</button></article>`;}
function completeScreen(){return `<article class="chapter-article"><div class="chapter-tag">✦ THE WHOLE THREAD · 20 / 20</div><h4>Beyond a roadmap: test an original claim.</h4><p class="lede">You have traversed the full curriculum from AI history through predictive representation learning, MCTD, physical interaction and the theoretical frontier of open-ended general intelligence.</p><p>This is a learning-game milestone, not evidence of scientific mastery, general intelligence, or a new algorithm. Treat AGI, ASI and unrestricted self-improvement as hypothetical goals; turn a bounded open problem into a reproducible experiment.</p><a class="paper-link" href="#sources" target="_blank">↗ Explore the primary research references</a><button class="action-button" data-chapter="0">Review the first principles ↗</button></article>`;}
function openChapter(i){if(state.travel)return;if(i>=chapters.length){state.selection=i;document.getElementById('journal-content').innerHTML=completeScreen();return;}const same=state.selection===i;state.selection=i;state.correctAnswered=state.completed.has(i)||(same&&state.correctAnswered);document.getElementById('journal-content').innerHTML=i>state.current?lockedArticle(i):article(chapters[i]);document.getElementById('journal-content').scrollTop=0;document.getElementById('map-location').textContent=(i>state.current?'Locked: ':'Exploring: ')+chapters[i].short;document.getElementById('worldTip').textContent=i>state.current?'Follow the golden thread · no skipped stages':'✦ '+chapters[i].short+' · check the principle to progress';ribbon();}
function verifyAnswer(i,j){if(i!==state.current||state.correctAnswered)return;const el=document.getElementById('quiz-feedback');if(j!==1){if(el)el.textContent='Not quite. Review the core concept, then try again.';return;}state.correctAnswered=true;if(el)el.textContent='✓ Correct. This prerequisite is ready.';openChapter(i);}
function beginNext(i){if(i!==state.current||!state.correctAnswered)return;state.completed.add(i);state.current=state.completed.size;state.correctAnswered=false;save();progress();ribbon();const next=chapters[state.current];if(!next){document.getElementById('journal-content').innerHTML=completeScreen();document.getElementById('worldTip').textContent='✦ All 20 stages completed';return;}state.travel={start:performance.now(),from:{...state.player},to:{x:next.place[0]+.5,y:next.place[1]+.8}};document.getElementById('worldTip').textContent=`Following the thread to ${next.short} →`;document.getElementById('map-location').textContent=`Next concept: ${next.short}`;document.getElementById('journal-content').innerHTML=`<div class="welcome-card"><div class="hello-icon">✦</div><h4>Following the golden path...</h4><p>The next companion introduces <strong>${next.short}</strong>.</p></div>`;}
function startNext(){if(state.current>=chapters.length){openChapter(chapters.length);return;}const c=chapters[state.current];const pos={x:c.place[0]+.5,y:c.place[1]+.8};state.travel={start:performance.now(),from:{...state.player},to:pos};}
function move(dx,dy){if(state.travel)state.travel=null;state.player.x=Math.max(0,Math.min(NX-1,state.player.x+dx));state.player.y=Math.max(0,Math.min(NY-1,state.player.y+dy));}
function coords(ev){const r=canvas.getBoundingClientRect();return{x:(ev.clientX-r.left)*W/r.width,y:(ev.clientY-r.top)*H/r.height};}
function atPoint(p){return state.hitBoxes.filter(h=>p.x>=h.x&&p.x<=h.x+h.w&&p.y>=h.y&&p.y<=h.y+h.h).sort((a,b)=>b.depth-a.depth)[0]||null;}
canvas.addEventListener('pointermove',ev=>{const h=atPoint(coords(ev));state.hover=h;canvas.style.cursor=h?'pointer':'crosshair';});canvas.addEventListener('pointerleave',()=>state.hover=null);
canvas.addEventListener('click',ev=>{const p=coords(ev),h=atPoint(p);if(h){if(h.kind==='advanced-preview'){bvAdvancedPreviewSelect(h.index);return;}openChapter(h.index);return;}let best={dist:Infinity,x:state.player.x,y:state.player.y};for(let x=0;x<NX;x++)for(let y=0;y<NY;y++){const q=iso(x,y),d=(q.x-p.x)**2+((q.y-p.y)*2)**2;if(d<best.dist)best={x,y,dist:d};}if(typeof canEnterZone==='function'&&!canEnterZone(best.x,best.y)){if(typeof showRewardToast==='function')showRewardToast('tonitrus','Finish the current concept to cross this gate');return;}state.player.x=best.x;state.player.y=best.y;state.travel=null;});
document.addEventListener('click',ev=>{const ch=ev.target.closest('[data-chapter]');if(ch){openChapter(+ch.dataset.chapter);return;}const a=ev.target.closest('[data-answer]');if(a){const [i,j]=a.dataset.answer.split(':').map(Number);verifyAnswer(i,j);return;}const next=ev.target.closest('[data-continue]');if(next){beginNext(+next.dataset.continue);return;}if(ev.target.closest('[data-goto-next]')){startNext();return;}const accel=ev.target.closest('[data-accel]');if(accel){if(accel.dataset.accel==='reset')state.toy={x:0,v:1,a:0};else{const t=state.toy;t.a=+accel.dataset.accel;t.v=Math.max(-3,Math.min(3,t.v+t.a));t.x+=t.v;}for(const k of ['x','v','a']){const el=document.getElementById('toy-'+k);if(el)el.textContent=state.toy[k];}const o=document.getElementById('toy-result');if(o)o.textContent=`Hand-coded next state: x=${state.toy.x}, v=${state.toy.v}; compare with measured motion.`;return;}const energy=ev.target.closest('[data-energy]');if(energy){const s=+energy.dataset.energy,result=(s-2)**2+.4;document.getElementById('energy-result').textContent=`State s=${s} has E=${result.toFixed(2)}. ${s===2?'This is the minimum for this toy function.':'Try another state; lower is preferred.'}`;}});
document.getElementById('start-journey').addEventListener('click',startNext);document.getElementById('reset-progress').addEventListener('click',()=>{state.completed.clear();state.current=0;state.correctAnswered=false;save();progress();ribbon();state.player={x:chapters[0].place[0]+.5,y:chapters[0].place[1]+.8};state.travel=null;openChapter(0);});
document.querySelectorAll('[data-move]').forEach(btn=>btn.addEventListener('click',()=>{const d=btn.dataset.move;if(d==='up')move(-1,0);else if(d==='down')move(1,0);else if(d==='left')move(0,1);else move(0,-1);canvas.focus({preventScroll:true});}));
window.addEventListener('keydown',ev=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;const k=ev.key.toLowerCase();if(k==='w'||k==='arrowup'){move(-1,0);ev.preventDefault();}if(k==='s'||k==='arrowdown'){move(1,0);ev.preventDefault();}if(k==='a'||k==='arrowleft'){move(0,1);ev.preventDefault();}if(k==='d'||k==='arrowright'){move(0,-1);ev.preventDefault();}if(k==='enter'&&document.activeElement===canvas){openChapter(state.current);ev.preventDefault();}});
document.getElementById('soundless').addEventListener('click',ev=>{ev.currentTarget.textContent='♪ silent explorer';});
state.cam.x=W*.5-rawIso(state.player.x,state.player.y).x;state.cam.y=H*.58-rawIso(state.player.x,state.player.y).y;
requestAnimationFrame(()=>{progress();ribbon();render(performance.now());});

