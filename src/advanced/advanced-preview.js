/* Chapter 20/21 visual divider. The authentic user-supplied spiked-ball
   sprite is rendered in one straight row, with open ground on both sides.
   The five advanced houses remain visible without exposing locked lessons. */
const BV_ADVANCED_PREVIEW_SITES=[[29,48],[32.75,44.25],[36.5,40.5],[40.25,36.75],[44,33]];
const BV_ADVANCED_PREVIEW_ROOFS=['#f5babb','#f2d0a1','#b9ccd8','#dfb0c7','#b9c8ab'];
const BV_ADVANCED_PREVIEW_HOUSES=BV_ADVANCED_PREVIEW_SITES.map((place,i)=>({
 index:20+i,id:BV_ADVANCED_IDS[i],place,
 short:BV_ADVANCED_CHAPTERS[i].name,
 color:BV_ADVANCED_PREVIEW_ROOFS[i]
}));
const bvAdvancedPreviewZone=(x,y)=>x+y>=67;
const BV_SPIKED_IMG=new Image();
BV_SPIKED_IMG.src=BV_SPIKED_BALL;
function bvAdvancedPreviewOccupied(x,y){
 return BV_ADVANCED_PREVIEW_HOUSES.some(ch=>Math.abs(ch.place[0]-x)+Math.abs(ch.place[1]-y)<3.2)
   || Math.abs(x+y-66.5)<2.2;
}
function bvAdvancedPreviewAddObjects(objects){
 objects.push({place:[33.25,33.25],fn:bvAdvancedPreviewGate});
 BV_ADVANCED_PREVIEW_HOUSES.forEach(ch=>{
   objects.push({place:ch.place,fn:()=>drawHouse(ch)});
   objects.push({place:[ch.place[0]+1.25,ch.place[1]+1.45],fn:()=>drawNpc(ch)});
 });
}
function bvAdvancedPreviewGate(){
 if(!BV_SPIKED_IMG.complete||!BV_SPIKED_IMG.naturalWidth)return;
 // Constant x+y makes an exactly horizontal isometric-space divider.
 // Spacing matches the image's spiked silhouette; no fence, portals or text.
 for(let x=11;x<=55;x+=0.75){
   const p=iso(x,66.5-x);
   if(p.x<-50||p.x>W+50||p.y<-52||p.y>H+52)continue;
   ctx.drawImage(BV_SPIKED_IMG,Math.round(p.x-23),Math.round(p.y-23),46,46);
 }
}
function bvAdvancedPreviewFocus(){
 const player=rawIso(state.player.x,state.player.y);
 const focusX=rawIso(36.5,40.5).x,focusY=rawIso(33.25,33.25).y;
 state.explorePan={x:player.x-focusX,y:player.y-focusY};
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
 ' ADVANCED CHAPTER · LOCKED · '+(21+i)+'/25</div>'+
 '<div class="guide-header"><img src="'+img+'" alt="Pixel art illustration for House '+(21+i)+'"><div><h4>House '+(21+i)+' · '+qEsc(ch.name)+'</h4></div></div>'+
 '<p class="lede">You can inspect this advanced house and its spiked-ball boundary now, but its research challenges remain locked.</p>'+
 '<p>Pass all first 20 chapter gates and the final examination with at least 7/10 correct to enter the five-house research expedition. Imperial Scholar status is NOT required. After entry, the advanced houses unlock in order.</p>'+
 '<p>'+iconBolt()+' Original garden: 10 incorrect answers restart Chapter 1; advanced garden: 5 incorrect answers restart House 21.</p>'+
 '<button type="button" class="action-button" data-bv-preview-focus>View advanced houses 21–25 →</button>'+
 '<button type="button" class="action-button" data-chapter="20">Return to the original final exam →</button></article>';
 pane.scrollTop=0;bvAdvancedPreviewFocus();
}
function bvAdvancedPreviewRibbon(){
 return '<button type="button" role="listitem" class="bv-advanced-ribbon-gate" data-bv-preview-focus aria-label="View advanced chapters 21 through 25 beyond the spiked-ball divider"><img src="'+BV_SPIKED_BALL+'" alt="" aria-hidden="true">21–25</button>'+
 BV_ADVANCED_CHAPTERS.map((ch,i)=>{
 const star=quest.advanced?.stars?.[i],can=bvAdvancedAllowed(),ready=can&&i<=bvAdvancedCurrent();
 return '<button type="button" role="listitem" class="chapter-button bv-advanced-ribbon-btn '+(ready?'active':'locked')+'" data-bv-advanced-preview="'+i+'" aria-label="Chapter '+(21+i)+' '+qEsc(ch.name)+(!ready?' locked':'')+'">'+
 '<span class="chapter-no">'+(21+i)+'/25</span>'+
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

// The compact map button uses the exact same image as the in-world divider.
const bvPeekIcon=document.querySelector('.bv-adv-peek-icon');
if(bvPeekIcon)bvPeekIcon.style.backgroundImage='url('+BV_SPIKED_BALL+')';
