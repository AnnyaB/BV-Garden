#!/usr/bin/env node
/* Behavioral tests of the actual advanced-house functions; no browser dependencies. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const bank=readFileSync(resolve(root,'src/advanced/advanced-bank.js'),'utf8');
const engine=readFileSync(resolve(root,'src/advanced/advanced-engine.js'),'utf8');
function setup({passes=true,imperialWins=0}={}){
 const main=document=>({
   getElementById:()=>({innerHTML:'',scrollTop:0}),querySelector:()=>null,
   addEventListener:()=>{},dispatchEvent:()=>{}
 });
 const ctx={
   state:{current:passes?20:19},
   quest:{journeyPassed:passes,examPass:false,imperial:false,imperialWins,eliteUnlocked:false,
     passed:Array(20).fill(true),stars:Array(20).fill(false),used:{},seenPrompts:{},league:{}},
   document:main(),window:{addEventListener:()=>{}},openChapter:()=>{},showLeague:()=>{},
   CustomEvent:class {constructor(name){this.type=name;}},
   completeScreen:()=>'<article>Main exam remains</article>',
   qEsc:x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;'),
   questionFingerprint:t=>String(t).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim(),
   shuffleQuest:x=>x.slice(),
   iconStar:()=>'*',iconBolt:()=>'-',
   storeQuest:()=>{},showRewardToast:()=>{},
   BV_ADVANCED_SPRITES:['sprite0','sprite1','sprite2','sprite3','sprite4']
 };
 const code='const Q=(t,a,b,why)=>({t,a,b,why});\n'+bank+'\n'+engine+
 '\nthis.actions={allowed:bvAdvancedAllowed,show:bvAdvancedShow,start:bvAdvancedStart,select:bvAdvancedSelect,submit:bvAdvancedSubmit,reset:bvAdvancedReset,pick:bvAdvancedPick,current:bvAdvancedCurrent,has:bvAdvancedHasFullSet,hydrate:bvAdvancedHydrate};';
 new Script(code).runInNewContext(ctx,{timeout:6000});
 return ctx;
}
const test=(name,fn)=>{fn();console.log('PASS '+name)};
function answerRound(ctx,numberCorrect){
 const api=ctx.actions,chapter=ctx.quest.advanced.active.level;
 for(let i=0;i<8;i++){
  const a=ctx.quest.advanced.active,q=a.items[a.position];
  const picks=i<numberCorrect?q.answer:[q.options.findIndex((_,j)=>!q.answer.includes(j))];
  for(const j of picks)api.select(j);
  api.submit();
  if(i<7)assert.equal(ctx.quest.advanced.active.level,chapter);
 }
}
test('Research houses remain locked before ordinary final exam completion',()=>{
 const x=setup({passes:false});assert.equal(x.actions.allowed(),false);
 x.actions.start(0);assert.equal(x.quest.advanced.active,null);
});
test('20 chapter gates + ordinary final pass open advanced even with zero Stellas',()=>{
 const x=setup();assert.equal(x.actions.allowed(),true);assert.equal(x.actions.current(),0);
 x.actions.start(1);assert.equal(x.quest.advanced.active,null);
 x.actions.start(0);
 assert.ok(x.quest.advanced.active);
 assert.deepEqual(Array.from(x.quest.advanced.active.items,q=>q.tier),['e','e','m','m','h','h','h','h']);
});
test('Six of eight earns advanced Stella; two wrong produce two advanced bolts',()=>{
 const x=setup();x.actions.start(0);answerRound(x,6);
 assert.equal(x.quest.advanced.stars[0],true);
 assert.equal(x.quest.advanced.passed[0],true);
 assert.equal(x.quest.advanced.bolts,2);
 assert.equal(x.quest.imperial,false);assert.equal(x.quest.imperialWins,0);
 assert.equal(x.actions.current(),1);
});
test('Five incorrect responses reset advanced track only and keep used history',()=>{
 const x=setup();x.quest.imperialWins=2;
 x.actions.start(0);
 for(let i=0;i<5;i++){
  const a=x.quest.advanced.active,q=a.items[a.position];
  x.actions.select(q.options.findIndex((_,j)=>!q.answer.includes(j)));
  x.actions.submit();
 }
 assert.equal(x.quest.advanced.active,null);
 assert.equal(x.quest.advanced.bolts,0);
 assert.equal(x.quest.advanced.passed.every(v=>!v),true);
 assert.equal(x.quest.advanced.last.reset,true);
 assert.ok(Object.keys(x.quest.advanced.used).length>=8);
 assert.equal(x.quest.imperialWins,2);
 assert.equal(x.quest.passed.every(Boolean),true);
 assert.equal(x.quest.journeyPassed,true);
});
test('Collecting five separate advanced Stellas unlocks the existing Elite League',()=>{
 const x=setup();
 for(let i=0;i<4;i++){x.quest.advanced.passed[i]=true;x.quest.advanced.stars[i]=true;}
 assert.equal(x.actions.current(),4);
 x.actions.start(4);answerRound(x,8);
 assert.equal(x.quest.advanced.stars.every(Boolean),true);
 assert.equal(x.quest.advanced.completedRecord,true);
 assert.equal(x.quest.eliteUnlocked,true);
 assert.equal(x.quest.imperialWins,0);
});
test('Five Imperial wins still independently unlock Elite League',()=>{
 const x=setup({imperialWins:5});assert.equal(x.quest.eliteUnlocked,true);
});
test('Every advanced stem can only be sampled once; exhausted pool is rejected',()=>{
 const x=setup(),ids=new Set();
 for(let i=0;i<8;i++){
  const q=x.actions.pick(0,'e');assert.ok(q);assert.ok(!ids.has(q.index));ids.add(q.index);
 }
 assert.equal(x.actions.pick(0,'e'),null);
 assert.equal(x.actions.has(0),false);
});
test('Advanced view is recorded without modifying main-world progress',()=>{
 const x=setup();
 x.actions.show(0);
 assert.equal(x.quest.advanced.view,0);
 assert.equal(x.quest.passed.every(Boolean),true);
 x.actions.show();
 assert.equal(x.quest.advanced.view,'map');
});
console.log('Advanced independent progression and scoring regression tests passed.');
