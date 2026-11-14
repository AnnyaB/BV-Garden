#!/usr/bin/env node
/* No-dependency behavioral regression: the twenty-five-house shared world preview.
   No real user data, and no need to unlock or fake achievements. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const preview=readFileSync(resolve(root,'src/advanced/advanced-preview.js'),'utf8');
const world=readFileSync(resolve(root,'src/scripts/02-world.js'),'utf8');
const interactions=readFileSync(resolve(root,'src/scripts/03-interactions.js'),'utf8');
const engine=readFileSync(resolve(root,'src/quiz/quest-engine.js'),'utf8');
const context={
 BV_ADVANCED_IDS:['anya','bond','damian','yor','loid'],
 BV_ADVANCED_CHAPTERS:[
  {name:'Generative Systems',guide:'Anya Forger'},
  {name:'World Models',guide:'Bond Forger'},
  {name:'Compositional Robotics',guide:'Damian Desmond'},
  {name:'Safety',guide:'Yor Forger'},
  {name:'Invention',guide:'Loid Forger'}],
 BV_ADVANCED_SPRITES:['anya-src','bond-src','damian-src','yor-src','loid-src'],
 BV_SPIKED_BALL:'data:image/png;base64,FAKE_FOR_VM',
 Image:class{set src(x){this._src=x;}},
 chapters:Array.from({length:20},(_,i)=>({place:[i+3,i+4],short:'Main chapter '+i})),
 state:{player:{x:5,y:21},explorePan:null,current:0},
 quest:{advanced:{stars:[false,false,false,false,false],passed:[false,false,false,false,false]},passed:Array(20).fill(false)},
 imgs:{tonitrus:{complete:true,naturalWidth:20},stella:{complete:true,naturalWidth:20}},
 rawIso:(x,y)=>({x:535+(x-y)*30,y:-100+(x+y)*15}),
 betweenDistance:(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1];const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-(a[0]+t*dx),p[1]-(a[1]+t*dy));},
 document:{
  getElementById:id=>({innerHTML:'',scrollTop:0,scrollIntoView:()=>{}}),
  querySelector:()=>null,
  addEventListener:()=>{}
 },
 qEsc:s=>String(s),iconBolt:()=>'<img class="bolt">',iconStar:()=>'<img class="star">',
 bvAdvancedAllowed:()=>false,bvAdvancedCurrent:()=>0,bvAdvancedShow:()=>{throw Error('Locked preview must not open a lesson')},
 bvAdvancedHideWorld:()=>{},bvAdvancedShowWorld:()=>{},
 storeExplorer:()=>{}
};
const code=preview+"\nthis.previewTest={sites:BV_ADVANCED_PREVIEW_SITES,houses:BV_ADVANCED_PREVIEW_HOUSES,locked:bvAdvancedPreviewZone,select:bvAdvancedPreviewSelect,ribbon:bvAdvancedPreviewRibbon,focus:bvAdvancedPreviewFocus};";
new Script(code).runInNewContext(context,{timeout:4000});
const p=context.previewTest;
const test=(name,fn)=>{fn();console.log('PASS '+name)};
test('Twenty original chapters and five distinct future houses',()=>{
 assert.equal(p.houses.length,5);
 assert.deepEqual(Array.from(p.houses,x=>x.index),[20,21,22,23,24]);
 assert.deepEqual(Array.from(p.houses,x=>x.id),['anya','bond','damian','yor','loid']);
 assert.equal(context.chapters.length,20);
});
test('Barrier separates the old twenty from the five visible houses',()=>{
 assert.equal(p.locked(20,36),false);
 assert.equal(p.locked(29,48),true);
 assert.equal(p.locked(44,33),true);
});
test('Locked chapter ribbon shows five advanced entries and horned Bolt wall',()=>{
 const html=p.ribbon();
 assert.equal((html.match(/data-bv-advanced-preview=/g)||[]).length,5);
 assert.match(html,/data-bv-preview-focus/);
 assert.match(html,/LOCKED/);
 assert.doesNotMatch(html,/VISIBLE · LOCKED/);
});
test('Clicking a locked advanced guide displays a preview but cannot open lessons',()=>{
 p.select(0);
 assert.equal(context.quest.advanced.stars.every(x=>!x),true);
 assert.equal(context.quest.passed.every(x=>!x),true);
 assert.ok(Number.isFinite(context.state.explorePan.x));
});
test('Original world renderer includes five future houses and their exact built-in character PNG IDs',()=>{
 assert.ok(world.includes("bvAdvancedPreviewAddObjects(objects)"));
 assert.ok(world.includes("bvAdvancedPreviewSelect(h.index)"));
 assert.ok(world.includes("'anya','bond','damian','yor','loid'"));
 assert.ok(!world.includes("bvAdvancedPreviewHalo("));
 assert.ok(!world.includes("bvAdvancedPreviewPath();"));
});
test('Original pixel spiked ball is the only new terrain boundary; no fence or circles',()=>{
 assert.ok(preview.includes("const BV_SPIKED_IMG=new Image()"));
 assert.ok(preview.includes("for(let x=11;x<=55;x+=0.75)"));
 assert.ok(preview.includes("ctx.drawImage(BV_SPIKED_IMG"));
 assert.ok(!preview.includes('SEALED GATE'));
 assert.ok(!preview.includes('bvAdvancedPreviewHalo('));
 assert.ok(!preview.includes('bvAdvancedPreviewPath()'));
 assert.equal(p.houses.every(ch=>Math.abs(ch.place[0]+ch.place[1]-77)<0.001),true);
});
test('Actual main movement guard prevents entering preview sector before qualifying',()=>{
 const match=engine.match(/function canEnterZone\(x,y\)\{return [^}]+\}/);
 assert.ok(match);
 let success=false;
 context.bvAdvancedAllowed=()=>false;
 context.bvAdvancedPreviewZone=(x,y)=>p.locked(x,y);
 new Script(match[0]+'\nthis.zoneCheck=canEnterZone;').runInNewContext(context);
 success=context.zoneCheck(29,48);
 assert.equal(success,false);
 context.bvAdvancedAllowed=()=>true;
 assert.equal(context.zoneCheck(29,48),true);
});
test('Every automatic chapter arrival appears clearly left of its companion without changing roaming',()=>{
  const match=world.match(/function companionLeftArrival\(ch\)\{return\{[^}]*\};\}/);
  assert.ok(match,'Landing helper exists in the real world renderer');
  new Script(match[0]+'\nthis.arrival=companionLeftArrival;').runInNewContext(context);
  assert.match(world,/const pos=companionLeftArrival\(c\);state\.travel=/);
  assert.match(interactions,/to:companionLeftArrival\(next\)/);
  for(let i=0;i<20;i++){
    const row=Math.floor(i/5),col=i%5,c=row%2?4-col:col;
    const ch={place:[5+row*5+c*4,5+row*5+(4-c)*4]};
    const target=context.arrival(ch);
    const player=context.rawIso(target.x,target.y);
    const npc=context.rawIso(ch.place[0]+1.25,ch.place[1]+1.45);
    assert.ok(npc.x-player.x>=70,'Player stays visibly left of chapter '+(i+1));
    assert.ok(Math.abs(npc.y-player.y)<=4,'Player keeps companion standing depth at chapter '+(i+1));
    assert.ok(target.x>=0&&target.x<58&&target.y>=0&&target.y<58,'Arrival stays inside map');
  }
});
console.log('Shared world spectator preview verified without granting awards.');
