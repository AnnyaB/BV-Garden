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
 chapters:Array.from({length:20},(_,i)=>({place:[i+3,i+4],short:'Main chapter '+i})),
 state:{player:{x:5,y:21},explorePan:null,current:0},
 quest:{advanced:{stars:[false,false,false,false,false],passed:[false,false,false,false,false]},passed:Array(20).fill(false)},
 imgs:{tonitrus:{complete:true,naturalWidth:20},stella:{complete:true,naturalWidth:20}},
 rawIso:(x,y)=>({x:535+(x-y)*30,y:-100+(x+y)*15}),
 betweenDistance:(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1];const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-(a[0]+t*dx),p[1]-(a[1]+t*dy));},
 document:{
  getElementById:id=>({innerHTML:'',scrollTop:0,scrollIntoView:()=>{}}),
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
 assert.equal(p.locked(25,41),true);
 assert.equal(p.locked(41,25),true);
});
test('Locked chapter ribbon shows five advanced entries and horned Bolt wall',()=>{
 const html=p.ribbon();
 assert.equal((html.match(/data-bv-advanced-preview=/g)||[]).length,5);
 assert.match(html,/HORNED TONITRUS BOUNDARY/);
 assert.match(html,/VISIBLE · LOCKED/);
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
 assert.ok(world.includes("bvAdvancedPreviewHalo("));
});
test('Actual main movement guard prevents entering preview sector before qualifying',()=>{
 const match=engine.match(/function canEnterZone\(x,y\)\{return [^}]+\}/);
 assert.ok(match);
 let success=false;
 context.bvAdvancedAllowed=()=>false;
 context.bvAdvancedPreviewZone=(x,y)=>p.locked(x,y);
 new Script(match[0]+'\nthis.zoneCheck=canEnterZone;').runInNewContext(context);
 success=context.zoneCheck(25,41);
 assert.equal(success,false);
 context.bvAdvancedAllowed=()=>true;
 assert.equal(context.zoneCheck(25,41),true);
});
console.log('Shared world spectator preview verified without granting awards.');
