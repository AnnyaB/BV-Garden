/* Isometric advanced garden. Faithfully reuses the same roof geometry, tile palette,
   shadowing and original PNG companions used by the first twenty houses.
   It does not change the existing world renderer or its navigation. */
function bvAdvancedRenderGarden(){
 const canvas=document.getElementById('bv-advanced-world');
 if(!canvas)return;
 const c=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
 const sites=[[116,289],[283,238],[450,292],[617,237],[785,292]];
 const adv=quest.advanced,now=bvAdvancedCurrent();
 const colors=['#f5babb','#f2d0a1','#b9ccd8','#dfb0c7','#b9c8ab'];
 c.imageSmoothingEnabled=false;
 const sprites=BV_ADVANCED_SPRITES.map(url=>{const im=new Image();im.onload=()=>draw();im.src=url;return im;});
 const iconStella=new Image(),iconBoltImg=new Image();
 iconStella.onload=()=>draw();iconStella.src=asset('stella');
 iconBoltImg.onload=()=>draw();iconBoltImg.src=asset('tonitrus');
 function polygon(points,fill,stroke){
   c.beginPath();c.moveTo(points[0][0],points[0][1]);
   for(let j=1;j<points.length;j++)c.lineTo(points[j][0],points[j][1]);
   c.closePath();c.fillStyle=fill;c.fill();
   if(stroke){c.lineWidth=1;c.strokeStyle=stroke;c.stroke();}
 }
 function block(x,y,w,h,color,stroke){
   c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
   if(stroke){c.strokeStyle=stroke;c.strokeRect(Math.round(x)+.5,Math.round(y)+.5,Math.round(w)-1,Math.round(h)-1);}
 }
 function label(text,x,y,font,color,align='center'){
   c.textAlign=align;c.textBaseline='middle';c.font='800 '+font+'px ui-monospace, Menlo, monospace';
   c.fillStyle=color;c.fillText(text,x,y);
 }
 function house(i){
  const [x,y]=sites[i],height=49+(i%3)*5,active=i===now,won=adv.stars[i],roof=colors[i];
  polygon([[x-47,y+7],[x,y+28],[x+47,y+7],[x,y-15]],'#709c79');
  polygon([[x-34,y-height],[x,y-height+16],[x,y+9],[x-34,y-7]],'#f7eedb','#c4b99e');
  polygon([[x,y-height+16],[x+35,y-height],[x+35,y-7],[x,y+9]],'#decbb5','#b9b19d');
  for(let k=0;k<5;k++){block(x-31+k*5,y-height+20+k*3,7,2,'#e3d0ba');block(x+9+k*5,y-height+23-k*2,6,2,'#c5b49c');}
  polygon([[x-41,y-height],[x,y-height-25],[x+41,y-height],[x,y-height+20]],roof,'#607164');
  polygon([[x-41,y-height],[x,y-height+20],[x,y-height+10],[x-41,y-height-9]],'#ad8d88');
  for(let k=-2;k<=2;k++)block(x+k*13-6,y-height-7+Math.abs(k)*2,8,3,'#ffffff65');
  block(x-27,y-height+11,12,13,'#785a58');block(x-25,y-height+13,8,9,'#ffe0a4');
  block(x+14,y-height+11,12,13,'#785a58');block(x+16,y-height+13,8,9,'#ffe0a4');
  polygon([[x-9,y-9],[x,y-5],[x,y+9],[x-9,y+3]],'#638979');
  polygon([[x,y-5],[x+9,y-10],[x+9,y+3],[x,y+9]],'#426c61');
  block(x-37,y+2,7,8,'#67996f');block(x+31,y+2,7,8,'#6d9e6b');
  block(x+12,y-height-26,8,11,'#a57f79');block(x+13,y-height-28,9,4,'#dfb0a6');
  const title=BV_ADVANCED_CHAPTERS[i].name;
  const short=title.length>17?title.slice(0,16)+'…':title;
  block(x-65+3,y-height-81+3,130,24,'#5d866d');
  block(x-65,y-height-81,130,24,active?'#fff8dc':'#fffaf1',active?'#e2af54':'#9eb09b');
  block(x-61,y-height-78,23,18,active?'#e6b964':won?'#8cb8a5':'#b9c8ba');
  label(String(i+21),x-49,y-height-69,11,'#42594e');
  label(short,x+12,y-height-69,9,'#466556');
  if(active){block(x-4,y-height-50,9,10,'#fce9ab','#ae9560');label('!',x+.5,y-height-43,9,'#926950');}
  if(won){block(x-32,y+14,64,6,'#f9d985');}
 }
 function portrait(i){
  const [hx,hy]=sites[i],x=hx+51,y=hy+8,im=sprites[i],locked=i>now,won=adv.stars[i];
  c.fillStyle='#294d3b50';c.beginPath();c.ellipse(x,y+2,i===1?25:18,5,0,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(x,y-48,i===1?44:39,0,Math.PI*2);
  c.fillStyle=locked?'#5d6e7499':won?'#e6d4a44d':'#fef3cf48';c.fill();
  c.strokeStyle=locked?'#728c89':won?'#dfb64d':'#d6b26c';c.lineWidth=3;c.stroke();
  if(im.complete&&im.naturalWidth){
   const h=i===1?95:i===0||i===2?81:87,w=h*im.naturalWidth/im.naturalHeight;
   c.globalAlpha=locked?0.58:1;c.drawImage(im,x-w/2,y-h,w,h);c.globalAlpha=1;
  }else{block(x-18,y-57,36,45,'#d2a88e');}
  const icon=won?iconStella:locked?iconBoltImg:null;
  if(icon?.complete&&icon.naturalWidth)c.drawImage(icon,x+26,y-83,27,29);
  if(!locked&&!won){c.fillStyle='#ffebb4';c.beginPath();c.arc(x+30,y-83,14,0,Math.PI*2);c.fill();label('✦',x+30,y-84,17,'#b48440');}
  block(x-56,y+8,112,23,locked?'#dfe2dd':won?'#f7eac2':'#fff9ed','#99b59e');
  label('HOUSE '+(21+i),x,y+20,10,'#405a4c');
 }
 function grass(){
  const fill=c.createLinearGradient(0,0,0,H);
  fill.addColorStop(0,'#d7e5db');fill.addColorStop(.5,'#b6d5be');fill.addColorStop(1,'#9ac8a9');
  c.fillStyle=fill;c.fillRect(0,0,W,H);
  const tw=60,th=30;
  for(let row=-1;row<20;row++)for(let col=-1;col<19;col++){
   const x=col*tw+((row%2)*tw/2),y=row*(th/1.4)+125;
   const shade=((row*17+col*31)%7+7)%7;
   polygon([[x,y-th/2],[x+tw/2,y],[x,y+th/2],[x-tw/2,y]],
    shade<2?'#acceb0':shade<5?'#aad0a9':'#b5d6b7','#97bf9b88');
  }
  for(let k=0;k<60;k++){
   const x=(k*151+29)%W,y=(k*87+131)%H;
   if(y<135||k%5===0)continue;
   block(x,y-9,2,10,'#739b78');
   block(x-5,y-9,10,5,k%3===0?'#f3b8c8':'#faefb4');
   block(x-1,y-7,3,2,'#dfc58d');
  }
 }
 function path(){
  for(let i=0;i<sites.length-1;i++){
   const a=sites[i],b=sites[i+1];
   for(let k=1;k<=17;k++){
    const f=k/18,x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f+8;
    block(x-3,y,6,5,i<now?'#f9d985':'#d3bba0');
    if(k===9){
     c.fillStyle=i<now?'#fff0b6':'#eed9c8';c.beginPath();c.arc(x,y-11,12,0,2*Math.PI);c.fill();
     label('›',x,y-11,20,'#8a755d');
     if(i>=now&&iconBoltImg.complete&&iconBoltImg.naturalWidth)c.drawImage(iconBoltImg,x-14,y-45,28,28);
    }
   }
  }
 }
 function draw(){
  grass();path();
  for(let i=0;i<5;i++)house(i);
  for(let i=0;i<5;i++)portrait(i);
  block(12,10,300,36,'#fff9e9d9','#aabda9');
  label('ADVANCED RESEARCH · HOUSES 21–25',24,28,14,'#3c6654','left');
  block(W-206,10,194,36,'#fff9e9d9','#aabda9');
  label('TONITRUS '+adv.bolts+'/5',W-109,28,14,'#8a6556');
 }
 draw();
 const hits=sites.map(([x,y])=>({left:x-70,right:x+100,top:y-152,bottom:y+40}));
 canvas.onclick=event=>{
  const rect=canvas.getBoundingClientRect(),
  x=(event.clientX-rect.left)*canvas.width/rect.width,
  y=(event.clientY-rect.top)*canvas.height/rect.height;
  const i=hits.findIndex(hit=>x>=hit.left&&x<=hit.right&&y>=hit.top&&y<=hit.bottom);
  if(i>=0&&i<=bvAdvancedCurrent())bvAdvancedShow(i);
 };
}
