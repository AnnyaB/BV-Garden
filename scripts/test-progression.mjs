#!/usr/bin/env node
/**
 * Behavioral regression checks for the actual BV-Garden quest functions.
 * Runs without browsers, external dependencies, paid APIs or real user data.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const source=readFileSync(resolve(root,"src/quiz/quest-engine.js"),"utf8");
const portion=(start,end)=>{
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
 assert(a>=0 && b>a,"Missing test function "+start);
 return source.slice(a,b);
};
const initQuest=()=>({
 passed:Array(20).fill(false),stars:Array(20).fill(false),bolts:0,
 used:{},seenPrompts:{},active:null,last:null,imperial:false,examPass:false,
 epoch:0,avatarChoice:0,imperialWins:0,journeyWins:0,firstWinAt:null,
 journeyPassed:false,imperialThisJourney:false,eliteUnlocked:false,
 league:{entered:false,answers:{},reviewed:false}
});
const ctx={
 quest:initQuest(),initQuest,
 state:{player:{x:0,y:0},travel:null,completed:new Set(),current:20},
 chapters:Array.from({length:20},(_,i)=>({place:[i+2,i+3]})),
 questionsFor:(_,__,tier)=>[{t:"Test: "+tier,why:"A pre-reviewed explanation for the expected choice."}],
 storeQuest:()=>{ctx.saved=(ctx.saved||0)+1},
 ribbon:()=>{},progress:()=>{},openChapter:()=>{},updateSelectedAvatar:()=>{},
 showRewardToast:()=>{},
 repairProgress:()=>{ctx.state.current=ctx.quest.passed.findIndex(x=>!x);if(ctx.state.current<0)ctx.state.current=20}
};
const setup=portion("function beginQuest(kind,level)","function selectQuizOption(j)");
const restart=portion("function restartJourney(tenthBolt=false)","function restartForBolts()");
const resolveAttempt=portion("function resolveAttempt()","function updateSelectedAvatar()");
ctx.hasQuestions=()=>true;
ctx.pickQuestQuestion=(_,level,tier)=>({d:tier,level,index:0,options:["yes"],answer:[0],correct:null});
ctx.quizSelected=[];
new Script(setup+"\n"+restart+"\n"+resolveAttempt+
  "\nthis.bvActions={beginQuest,restartJourney,resolveAttempt};").runInNewContext(ctx,{timeout:3000});
const {beginQuest,restartJourney,resolveAttempt:gradeAttempt}=ctx.bvActions;
const test=(name,fn)=>{fn();console.log("PASS "+name)};
const tiers=["e","e","m","m","m","h","h","h","h","h"];
function makeExam(correctEasy,correctMedium,correctHard){
 const allowances={e:correctEasy,m:correctMedium,h:correctHard};
 const count={e:0,m:0,h:0};
 const items=tiers.map(d=>{
  const good=count[d]++<allowances[d];
  return{d,index:0,correct:good,options:["yes"],answer:[0]};
 });
 ctx.quest.active={
  kind:"exam",level:20,items,
  results:items.map(item=>({d:item.d,ok:item.correct})),
  position:items.length,selected:[]
 };
}
function fullStellas(){ctx.quest.stars.fill(true);ctx.quest.passed.fill(true);ctx.state.current=20;}

// Ordinary exam access depends on finishing chapter gates, not collecting
// every Stella; all Stellas remain mandatory for Imperial Scholar status.
test("Ordinary final examination opens with missing Stellas, but not before chapter 20",()=>{
 ctx.quest=initQuest();ctx.state.current=19;
 beginQuest("exam",20);assert.equal(ctx.quest.active,null);
 ctx.state.current=20;
 beginQuest("exam",20);
 assert.equal(ctx.quest.active.kind,"exam");
 assert.deepEqual(Array.from(ctx.quest.active.items,x=>x.d),tiers);
 ctx.quest.active=null;
});

// 7 total may pass the exam but without hard-tier competence no Imperial dress.
test("Seven correct, easy-dominant result passes without Imperial Scholar",()=>{
 ctx.quest=initQuest();fullStellas();
 makeExam(2,3,2);gradeAttempt();
 assert.equal(ctx.quest.examPass,true);
 assert.equal(ctx.quest.imperial,false);
 assert.equal(ctx.quest.imperialWins,0);
 assert.equal(ctx.quest.journeyWins,1);
 assert.ok(Number.isFinite(ctx.quest.firstWinAt));
});

// 6/10 fails despite five hard correct; thresholds are conjunctive.
test("Six correct never qualifies for the advanced uniform",()=>{
 ctx.quest=initQuest();fullStellas();
 makeExam(1,0,5);gradeAttempt();
 assert.equal(ctx.quest.examPass,false);
 assert.equal(ctx.quest.imperial,false);
 assert.equal(ctx.quest.imperialWins,0);
});

// Seven correct with 4 hard and 2 medium is sufficient only with 20 Stellas.
test("Seven correct with advanced tiers still requires twenty Stellas",()=>{
 ctx.quest=initQuest();ctx.quest.stars.fill(true);ctx.quest.stars[8]=false;
 makeExam(1,2,4);gradeAttempt();
 assert.equal(ctx.quest.examPass,true);
 assert.equal(ctx.quest.imperial,false);
 assert.equal(ctx.quest.imperialWins,0);
});

// Repeated successful attempts within a journey must not mint extra wins.
test("Imperial wins count at most once per complete journey",()=>{
 ctx.quest=initQuest();fullStellas();
 makeExam(1,2,4);gradeAttempt();
 assert.equal(ctx.quest.imperial,true);
 assert.equal(ctx.quest.imperialWins,1);
 assert.equal(ctx.quest.journeyWins,1);
 makeExam(1,2,4);gradeAttempt();
 assert.equal(ctx.quest.imperialWins,1);
 assert.equal(ctx.quest.journeyWins,1);
});

// Preserve the first win and all used questions while moving through 5 passes.
test("Exactly five distinct qualified journeys unlock the Elite Imperial League",()=>{
 ctx.quest=initQuest();
 ctx.quest.used={"stage:0:e:0":true};
 ctx.quest.seenPrompts={"a saved question":true};
 ctx.quest.avatarChoice=1;
 let first=null;
 for(let attempt=1;attempt<=5;attempt++){
  if(attempt>1){
   restartJourney(false);
   assert.equal(ctx.quest.imperialWins,attempt-1);
   assert.equal(ctx.quest.avatarChoice,1);
   assert.equal(ctx.quest.used["stage:0:e:0"],true);
   assert.equal(ctx.quest.seenPrompts["a saved question"],true);
  }
  fullStellas();
  makeExam(1,2,4);gradeAttempt();
  if(attempt===1)first=ctx.quest.firstWinAt;
  assert.equal(ctx.quest.firstWinAt,first);
  assert.equal(ctx.quest.imperialWins,attempt);
  assert.equal(ctx.quest.journeyWins,attempt);
  assert.equal(ctx.quest.eliteUnlocked,attempt===5);
 }
});

// A tenth bolt resets only the current journey; it must preserve earned
// Imperial successes and no-repeat history.
test("Tonitrus reset retains cumulative achievement and seen-question history",()=>{
 ctx.quest.bolts=10;
 restartJourney(true);
 assert.equal(ctx.quest.imperialWins,5);
 assert.equal(ctx.quest.journeyWins,5);
 assert.equal(ctx.quest.eliteUnlocked,true);
 assert.equal(ctx.quest.imperial,false);
 assert.equal(ctx.quest.bolts,0);
 assert.equal(ctx.quest.last.reset,true);
 assert.equal(ctx.quest.seenPrompts["a saved question"],true);
});
// Restarting the original adventure must not erase advanced Stellas or history.
test("Original journey restart retains the separate advanced research progress",()=>{
 ctx.quest=initQuest();
 ctx.quest.advanced={passed:[true,false,false,false,false],stars:[true,false,false,false,false],bolts:2,
  used:{"adv:0:h:0":true},seen:{"held-out advanced concept":true},completedRecord:false};
 restartJourney(false);
 assert.equal(ctx.quest.advanced.stars[0],true);
 assert.equal(ctx.quest.advanced.bolts,2);
 assert.equal(ctx.quest.advanced.used["adv:0:h:0"],true);
 ctx.quest.advanced.completedRecord=true;
 restartJourney(false);
 assert.equal(ctx.quest.eliteUnlocked,true);
});
console.log("Quest progression and award regression tests passed.");
