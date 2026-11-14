/* BV-Garden advanced spectatorship: five real original companion sprites and
   house silhouettes remain visible after Chapter 20, even before qualification.
   Passing the final exam unlocks learning; visibility itself never unlocks lessons.
   Existing 20-chapter data, original rewards and save records are unchanged. */
const BV_ADVANCED_PREVIEW_SITES=[[25,41],[29,37],[33,33],[37,29],[41,25]];
const BV_ADVANCED_PREVIEW_ROOFS=['#f5babb','#f2d0a1','#b9ccd8','#dfb0c7','#b9c8ab'];
const BV_ADVANCED_PREVIEW_HOUSES=BV_ADVANCED_PREVIEW_SITES.map((place,i)=>({
  index:20+i,id:BV_ADVANCED_IDS[i],place,
  short:BV_ADVANCED_CHAPTERS[i].name,
  color:BV_ADVANCED_PREVIEW_ROOFS[i]
}));
const bvAdvancedPreviewZone=(x,y)=>x+y>=60;
function bvAdvancedPreviewPathTile(x,y){
 return BV_ADVANCED_PREVIEW_HOUSES.some((ch,i)=>{
   const before=i===0?chapters[19].place:BV_ADVANCED_PREVIEW_HOUSES[i-1].place;
   return betweenDistance([x,y],before,ch.place)<1.05;
 });
}
function bvAdvancedPreviewOccupied(x,y){
 return BV_ADVANCED_PREVIEW_HOUSES.some(ch=>Math.abs(ch.place[0]-x)+Math.abs(ch.place[1]-y)<3.2)
    || (x+y>=60&&x+y<=62);
}
function bvAdvancedPreviewAddObjects(objects){
 objects.push({place:[23.5,37.5],fn:bvAdvancedPreviewGate});
 BV_ADVANCED_PREVIEW_HOUSES.forEach(ch=>{
   objects.push({place:ch.place,fn:()=>drawHouse(ch)});
   objects.push({place:[ch.place[0]+1.25,ch.place[1]+1.45],fn:()=>drawNpc(ch)});
 });
}
function bvAdvancedPreviewPath(){
 const open=bvAdvancedAllowed(),all=[chapters[19],...BV_ADVANCED_PREVIEW_HOUSES];
 for(let i=0;i<all.length-1;i++){
  const a=all[i].place,b=all[i+1].place;
  for(let k=1;k<=17;k++){
   const t=k/18,p=iso(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);
   if(p.x<-35||p.x>W+35||p.y<-35||p.y>H+45)continue;
   box(p.x-3,p.y-4,6,6,open&&i<=bvAdvancedCurrent()?'#f9d985':'#b9988e');
   if(k===9){
    ctx.beginPath();ctx.arc(p.x,p.y-6,9,0,Math.PI*2);
    ctx.fillStyle=open&&i<bvAdvancedCurrent()?'#fff2b2':'#f5dbd7';ctx.fill();
    txt('›',p.x,p.y,13,'#8c775f');
    if((!open||i>=bvAdvancedCurrent())&&imgs.tonitrus.complete&&imgs.tonitrus.naturalWidth)
      ctx.drawImage(imgs.tonitrus,p.x-16,p.y-43,32,32);
   }
  }
 }
}
function bvAdvancedPreviewHalo(x,y,r,locked,star){
 const border=star?'#c69e45':locked?'#7e5a74':'#83a990',
       hi=star?'#fff0ae':locked?'#f5c4d3':'#e5ffe4';
 for(let k=0;k<36;k++){
   const t=k*Math.PI/18;
   const bx=x+Math.cos(t)*r,by=y+Math.sin(t)*r*.72;
   box(bx-4,by-4,8,8,k%7===0?hi:border);
   if(k%9===0)box(bx-2,by-6,4,4,hi);
 }
 if(locked&&imgs.tonitrus.complete&&imgs.tonitrus.naturalWidth)
   ctx.drawImage(imgs.tonitrus,x+r-14,y-r*.78-12,32,32);
 if(star&&imgs.stella.complete&&imgs.stella.naturalWidth)
   ctx.drawImage(imgs.stella,x+r-14,y-r*.78-12,29,30);
}
function bvAdvancedPreviewGate(){
 const opened=bvAdvancedAllowed(),color=opened?'#5b896b':'#9d506a';
 const start=iso(17,44),end=iso(44,17),y=start.y,mid=iso(22.5,38.5);
 if(y<-100||y>H+120)return;
 const left=Math.min(start.x,end.x),right=Math.max(start.x,end.x);
 // Pixel stone/steel wall: isometric depth shaded into the garden, with a central arch.
 for(let x=left;x<right;x+=21){
  if(x>W+50||x<-50)continue;
  const gateHole=opened&&Math.abs(x-mid.x)<58;
  if(gateHole)continue;
  box(x,y-23,21,27,color,'#423d4e');
  box(x+2,y-19,17,7,opened?'#93b39a':'#c07d8c');
  box(x+1,y-2,19,9,'#50414e');
  box(x+3,y-7,15,4,opened?'#76a386':'#e2b4bb');
  if(((x-left)/21)%3===0)box(x,y-34,8,11,'#3d404b','#e4b58e');
 }
 // Horned Tonitrus portal at the actual 20/21 boundary, not a generic badge.
 const mx=mid.x,my=mid.y;
 if(mx>-140&&mx<W+140){
   box(mx-51,my-59,102,52,'#2e323e','#e2b36c');
   box(mx-47,my-55,94,43,opened?'#456a60':'#713f59','#b5a179');
   box(mx-52,my-68,15,21,'#3b3540','#e3b67b');
   box(mx+37,my-68,15,21,'#3b3540','#e3b67b');
   polygon([[mx-51,my-67],[mx-62,my-93],[mx-30,my-65]],'#efc9a2','#8d6e68');
   polygon([[mx+51,my-67],[mx+62,my-93],[mx+30,my-65]],'#efc9a2','#8d6e68');
   if(imgs.tonitrus.complete&&imgs.tonitrus.naturalWidth)
     ctx.drawImage(imgs.tonitrus,mx-18,my-57,36,38);
   txt(opened?'GATE OPEN':'SEALED GATE',mx,my-13,11,'#fff6d9');
   box(mx-104,my+8,208,25,'#fff6e0','#c39364');
   txt('ADVANCED 21–25 '+(opened?'OPEN':'LOCKED'),mx,my+25,11,'#624c45');
 }
}
function bvAdvancedPreviewFocus(){
 const player=rawIso(state.player.x,state.player.y),focus=rawIso(33,33);
 state.explorePan={x:player.x-focus.x,y:player.y-focus.y};
 if(typeof storeExplorer==='function')storeExplorer();
 document.getElementById('world')?.scrollIntoView({block:'center',behavior:'smooth'});
}
function bvAdvancedPreviewSelect(i){
 if(!Number.isInteger(i)||i<0||i>=5)return;
 if(bvAdvancedAllowed()&&i<=bvAdvancedCurrent()){bvAdvancedShow(i);return;}
 const ch=BV_ADVANCED_CHAPTERS[i],img=BV_ADVANCED_SPRITES[i],
       pane=document.getElementById('journal-content');
 if(!pane)return;
 pane.innerHTML='<article class="chapter-article bv-advanced"><div class="chapter-tag">'+iconBolt()+
 ' SEALED RESEARCH HOUSE · '+(21+i)+'/25</div>'+
 '<div class="guide-header"><img src="'+img+'" alt="Original pixel-art guide: '+qEsc(ch.guide)+'"><div><h4>House '+(21+i)+' · '+qEsc(ch.name)+'</h4><p>'+qEsc(ch.guide)+'</p></div></div>'+
 '<p class="lede">You can inspect this advanced house and its horned Tonitrus boundary now, but its research challenges remain locked.</p>'+
 '<p>Pass all first 20 chapter gates and the final examination with at least 7/10 correct to enter the five-house research expedition. Imperial Scholar status is NOT required. After entry, the advanced houses unlock in order.</p>'+
 '<p>'+iconBolt()+' Original garden: 10 incorrect answers restart Chapter 1; advanced garden: 5 incorrect answers restart House 21.</p>'+
 '<button type="button" class="action-button" data-bv-preview-focus>View the advanced garden and Tonitrus wall →</button>'+
 '<button type="button" class="action-button" data-chapter="20">Return to the original final exam →</button></article>';
 pane.scrollTop=0;bvAdvancedPreviewFocus();
}
function bvAdvancedPreviewRibbon(){
 return '<div class="bv-advanced-ribbon-gate" role="listitem"><span class="bv-advanced-gate-symbol">'+iconBolt()+'</span><strong>HORNED TONITRUS BOUNDARY</strong><small>Visible to everyone · Advanced lessons locked until final exam pass</small>'+
 '<button type="button" class="action-button" data-bv-preview-focus>View Houses 21–25 on the same garden →</button></div>'+
 BV_ADVANCED_CHAPTERS.map((ch,i)=>{
 const star=quest.advanced?.stars?.[i],can=bvAdvancedAllowed(),ready=can&&i<=bvAdvancedCurrent();
 return '<button type="button" role="listitem" class="chapter-button bv-advanced-ribbon-btn '+(ready?'active':'locked')+'" data-bv-advanced-preview="'+i+'" aria-label="Chapter '+(21+i)+' '+qEsc(ch.name)+(!ready?' locked':'')+'">'+
 '<span class="chapter-no">'+(21+i)+'/25 · '+qEsc(ch.guide)+'</span>'+
 '<span class="chapter-title">'+qEsc(ch.name)+'</span>'+
 '<span class="chapter-status">'+(star?iconStar()+' STELLA':ready?'✦ Research house ready':iconBolt()+' VISIBLE · LOCKED')+'</span></button>';
 }).join('');
}
// Reuse the main world and its original sprites when entering the advanced course.
// There is no additional hidden or duplicate map that conceals the five houses.
bvAdvancedHideWorld=function(){
 const layer=document.getElementById('bv-advanced-overlay');
 if(layer)layer.hidden=true;
};
bvAdvancedShowWorld=function(){bvAdvancedPreviewFocus();};
document.addEventListener('click',event=>{
 const focus=event.target.closest('[data-bv-preview-focus]');
 if(focus){bvAdvancedPreviewFocus();return;}
 const choose=event.target.closest('[data-bv-advanced-preview]');
 if(choose){bvAdvancedPreviewSelect(Number(choose.dataset.bvAdvancedPreview));return;}
});
