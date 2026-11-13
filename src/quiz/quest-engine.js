/* RESEARCH GARDEN QUEST ENGINE · 20 chapters, nonrepeating conceptual question IDs, real scoring. */
'use strict';
const QUEST_STORAGE='latent-atlas-research-quest-v1';
const initQuest=()=>({passed:Array(20).fill(false),stars:Array(20).fill(false),bolts:0,used:{},seenPrompts:{},active:null,last:null,imperial:false,examPass:false,epoch:0,avatarChoice:0,imperialWins:0,journeyWins:0,firstWinAt:null,journeyPassed:false,imperialThisJourney:false,eliteUnlocked:false,league:{entered:false,answers:{},reviewed:false}});
let quest=initQuest();
try{const old=JSON.parse(localStorage.getItem(QUEST_STORAGE)||'null');if(old&&Array.isArray(old.passed)&&old.passed.length===20&&Array.isArray(old.stars)&&old.stars.length===20){
 quest={...initQuest(),...old};quest.passed=old.passed.map(Boolean);quest.stars=old.stars.map(Boolean);quest.bolts=Math.max(0,Math.min(10,Number(old.bolts)||0));
}}catch(_){/* storage unavailable => session-only state */}
quest.avatarChoice=quest.avatarChoice===1?1:0;
quest.imperialWins=Number.isInteger(quest.imperialWins)&&quest.imperialWins>=0?Math.min(999,quest.imperialWins):(quest.imperial?1:0);
if(quest.imperial&&!quest.imperialWins)quest.imperialWins=1;
quest.journeyWins=Number.isInteger(quest.journeyWins)&&quest.journeyWins>=0?Math.min(999,quest.journeyWins):Math.max(quest.imperialWins,quest.examPass?1:0);
quest.journeyPassed=Boolean(quest.journeyPassed||quest.examPass);
quest.imperialThisJourney=Boolean(quest.imperialThisJourney||quest.imperial);
quest.firstWinAt=Number.isFinite(quest.firstWinAt)?quest.firstWinAt:null;
/* Historical saves without a recorded completion time remain undated; do not fabricate a first-win timestamp. */
quest.eliteUnlocked=quest.imperialWins>=5;
if(!quest.league||typeof quest.league!=='object')quest.league={entered:false,answers:{},reviewed:false};
if(!quest.league.answers||typeof quest.league.answers!=='object')quest.league.answers={};
function storeQuest(){try{localStorage.setItem(QUEST_STORAGE,JSON.stringify(quest));}catch(_){}}
function canEnterZone(x,y){return !chapters.some((ch,i)=>i>state.current&&Math.hypot(x-ch.place[0],y-ch.place[1])<3.5);}
function move(dx,dy){if(state.travel)state.travel=null;const nx=Math.max(0,Math.min(NX-1,state.player.x+dx)),ny=Math.max(0,Math.min(NY-1,state.player.y+dy));if(!canEnterZone(nx,ny)){showRewardToast('tonitrus','Concept gate locked · resolve the four obstacles');return;}state.player.x=nx;state.player.y=ny;}
function repairProgress(){state.completed.clear();for(let i=0;i<20;i++){if(!quest.passed[i])break;state.completed.add(i);}state.current=state.completed.size;state.correctAnswered=false;}
repairProgress();
let quizSelected=Array.isArray(quest.active?.selected)?quest.active.selected.slice():[];
const qEsc=t=>String(t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const asset=id=>typeof INLINE_SPRITES!=='undefined'?INLINE_SPRITES[id]:`assets/${id}.png`;
const iconStar=()=>`<img class="reward-img" src="${asset('stella')}" alt="Stella Star">`;
const iconBolt=()=>`<img class="reward-img" src="${asset('tonitrus')}" alt="Tonitrus Bolt">`;
function shuffleQuest(values){const x=values.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
const questionsFor=(kind,level,d)=>kind==='exam'?IMPERIAL_BANK[d]:CHALLENGE_BANK[level][d];
const questionId=(kind,level,d,i)=>`${kind}:${level}:${d}:${i}`;
// A full normalized stem (not an index or a truncated hash) prevents exact-wording
// repeats across chapter tiers, across chapters, and in the final examination.
const questionFingerprint=text=>String(text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
if(!quest.used||typeof quest.used!=='object'||Array.isArray(quest.used))quest.used={};
if(!quest.seenPrompts||typeof quest.seenPrompts!=='object'||Array.isArray(quest.seenPrompts))quest.seenPrompts={};
// Migrate historical v1 saves without reusing a single already displayed prompt.
for(const key of Object.keys(quest.used)){
 if(!quest.used[key])continue;
 const match=/^(stage|exam):(\d+):(e|m|h):(\d+)$/.exec(key);
 if(!match)continue;
 const [,kind,levelText,tier,indexText]=match,level=Number(levelText),index=Number(indexText);
 const source=kind==='exam'?IMPERIAL_BANK[tier]?.[index]:CHALLENGE_BANK[level]?.[tier]?.[index];
 if(source?.t)quest.seenPrompts[questionFingerprint(source.t)]=true;
}
const unseenQuest=(kind,level,tier,item,index)=>!quest.used[questionId(kind,level,tier,index)]&&!quest.seenPrompts[questionFingerprint(item.t)];
function pickQuestQuestion(kind,level,d){
 const all=questionsFor(kind,level,d),eligible=all.map((r,i)=>i).filter(i=>unseenQuest(kind,level,d,all[i],i));
 if(!eligible.length)return null;
 // Present the new case-based problems first while keeping all old content as
 // fallback. Original indices are never shifted, so legacy saves remain valid.
 const beginning=kind==='stage'?{e:3,m:3,h:6}[d]:Infinity;
 const advanced=eligible.filter(i=>i>=beginning),pool=advanced.length?advanced:eligible;
 const i=pool[Math.floor(Math.random()*pool.length)],source=all[i];
 const options=shuffleQuest([...source.a.map(s=>({s,ok:true})),...source.b.map(s=>({s,ok:false}))]);
 const id=questionId(kind,level,d,i);
 quest.used[id]=true;quest.seenPrompts[questionFingerprint(source.t)]=true;
 return{id,level,d,index:i,options:options.map(o=>o.s),answer:options.flatMap((o,j)=>o.ok?[j]:[]),chosen:null,correct:null};
}
function hasQuestions(kind,level){
 const needs=kind==='exam'?{e:2,m:3,h:5}:{e:1,m:1,h:2};
 return Object.entries(needs).every(([d,n])=>questionsFor(kind,level,d)
   .filter((item,i)=>unseenQuest(kind,level,d,item,i)).length>=n);
}
function beginQuest(kind,level){if(quest.imperial)return;
 if(kind==='stage'&&level>state.current)return;
 if(kind==='stage'&&quest.stars[level])return;
 if(kind==='exam'&&!(state.current===20&&quest.stars.every(Boolean)))return;
 if(quest.active){if(quest.active.kind===kind&&quest.active.level===level){openChapter(kind==='exam'?20:level);return;}
   quest.last={kind,level,blocked:true,msg:`Finish your current ${quest.active.kind==='exam'?'Imperial exam':`chapter ${quest.active.level+1}`} trial before starting another.`};openChapter(kind==='exam'?20:level);return;}
 if(!hasQuestions(kind,level)){quest.last={kind,level,exhausted:true,msg:'This chapter has no unused questions left in the offline bank. Repeating a previously seen question would violate the no-repeat rule.'};storeQuest();openChapter(kind==='exam'?20:level);return;}
 const tiers=kind==='exam'?['e','e','m','m','m','h','h','h','h','h']:['e','m','h','h'];
 quest.last=null;quest.active={kind,level,items:tiers.map(d=>pickQuestQuestion(kind,level,d)),position:0,results:[],selected:[],created:Date.now()};quizSelected=[];storeQuest();openChapter(kind==='exam'?20:level);
}
function selectQuizOption(j){const a=quest.active;if(!a)return;const q=a.items[a.position];if(!q||q.correct!==null)return;
 const multiple=(a.kind==='exam'||a.level>=5);
 quizSelected=multiple?(quizSelected.includes(j)?quizSelected.filter(x=>x!==j):[...quizSelected,j]):[j];
 a.selected=quizSelected.slice();storeQuest();updateQuizArea();
}
function submitQuizAnswer(){const a=quest.active;if(!a)return;const q=a.items[a.position];if(!q||q.correct!==null||!quizSelected.length)return;
 const selected=quizSelected.slice().sort((x,y)=>x-y),expected=q.answer.slice().sort((x,y)=>x-y);
 q.correct=JSON.stringify(selected)===JSON.stringify(expected);q.chosen=selected;
 a.results.push({d:q.d,ok:q.correct,id:q.id});a.position++;quizSelected=[];a.selected=[];
 if(!q.correct){quest.bolts++;showRewardToast('tonitrus','Tonitrus obstacle encountered · +1 Bolt');if(quest.bolts>=10){restartForBolts();return;}}
 if(a.position>=a.items.length)resolveAttempt();
 storeQuest();progress();if(a&&a.kind==='stage')openChapter(a.level);else openChapter(20);
}
function restartJourney(tenthBolt=false){
 const previous=quest;quest=initQuest();
 quest.used=previous.used;quest.seenPrompts=previous.seenPrompts;
 quest.avatarChoice=previous.avatarChoice===1?1:0;
 quest.imperialWins=previous.imperialWins||0;quest.journeyWins=previous.journeyWins||0;quest.firstWinAt=previous.firstWinAt||null;
 quest.eliteUnlocked=quest.imperialWins>=5;quest.league=previous.league||{entered:false,answers:{},reviewed:false};
 quest.epoch=(previous.epoch||0)+1;
 if(tenthBolt)quest.last={kind:'stage',level:0,reset:true,msg:'Tenth Tonitrus Bolt! Back to chapter 01. Previously used questions remain retired.'};
 repairProgress();state.player={x:chapters[0].place[0]+.5,y:chapters[0].place[1]+.8};state.travel=null;
 updateSelectedAvatar();storeQuest();progress();ribbon();openChapter(0);
}
function restartForBolts(){restartJourney(true);}
function resolveAttempt(){const a=quest.active,hard=a.results.filter(r=>r.d==='h'&&r.ok).length,correct=a.results.filter(r=>r.ok).length;
 if(a.kind==='stage'){
   const earned=correct>=3,passed=earned||(hard===2);
   if(passed){quest.passed[a.level]=true;if(earned){quest.stars[a.level]=true;showRewardToast('stella','Stella Star earned!');}else showRewardToast('stella','Golden path unlocked · no Stella yet');repairProgress();}
   quest.last={kind:'stage',level:a.level,passed,earned,correct,hard,msg:earned?'Stella earned! At least three correct.':passed?'Both hard challenges passed — next chapter unlocked, but no Stella. Replay with fresh questions to earn it.':'The gate remains closed. Review the lesson and retry with unused questions.'};
 }else{
   const medium=a.results.filter(r=>r.d==='m'&&r.ok).length;
   const passed=correct>=7;
   const imperial=passed&&quest.stars.every(Boolean)&&medium>=2&&hard>=4;
   quest.examPass=passed;quest.imperial=imperial;
   if(passed&&!quest.journeyPassed){
     quest.journeyPassed=true;quest.journeyWins=(quest.journeyWins||0)+1;
     if(!quest.firstWinAt)quest.firstWinAt=Date.now();
   }
   if(imperial&&!quest.imperialThisJourney){
     quest.imperialThisJourney=true;quest.imperialWins=(quest.imperialWins||0)+1;
     quest.eliteUnlocked=quest.imperialWins>=5;updateSelectedAvatar();
     showRewardToast('stella','Imperial Scholar · win '+quest.imperialWins+' of 5');
   }
   quest.last={kind:'exam',level:20,passed,imperial,correct,medium,hard,
     msg:imperial?'Imperial Scholar awarded: 20 Stellas and the advanced exam requirements satisfied.':
       passed?'Exam passed, but Imperial Scholar needs at least 2 medium and 4 hard answers correct.':
       'Exam not passed. At least 7/10 answers are needed; Imperial Scholar additionally requires 2 medium and 4 hard.'};
 }
 quest.last.breakdown=a.items.map(item=>{const reference=questionsFor(a.kind,a.level,item.d)[item.index];return {tier:item.d,ok:item.correct,prompt:reference.t,expected:item.answer.map(j=>item.options[j]),why:reference.why};});
 quest.active=null;storeQuest();ribbon();
}
function updateSelectedAvatar(){
 const key=(quest.imperial||quest.imperialWins>0)?(quest.avatarChoice===1?'explorer_scholar_alt':'explorer_scholar'):
   (quest.avatarChoice===1?'explorer_alt':'explorer');
 if(INLINE_SPRITES[key]&&imgs.explorer)imgs.explorer.src=asset(key);
 const current=document.getElementById('bv-avatar-current');
 if(current)current.src=asset(quest.avatarChoice===1?'explorer_alt':'explorer');
 for(const button of document.querySelectorAll('[data-avatar-choice]')){
   const selected=Number(button.dataset.avatarChoice)===quest.avatarChoice;
   button.setAttribute('aria-pressed',String(selected));button.classList.toggle('chosen',selected);
 }
}
updateSelectedAvatar();
function updateQuizArea(){const region=document.getElementById('quest-quiz');if(region)region.innerHTML=quizAreaContent();}
function quizAreaContent(){const a=quest.active;if(!a)return '';
 const q=a.items[a.position];if(!q)return '';
 const multiple=a.kind==='exam'||a.level>=5;
 const tier={e:'EASY · fundamentals',m:'MEDIUM · reasoning',h:'HARD · research-grade'}[q.d];
 const correctSoFar=a.results.filter(x=>x.ok).length;
 const which=a.kind==='exam'?`IMPERIAL EXAM · QUESTION ${a.position+1}/10`:`CHAPTER ${String(a.level+1).padStart(2,'0')} · OBSTACLE ${a.position+1}/4`;
 return `<div class="quest-question"><div class="quest-topline"><span>${which}</span><strong>${tier}</strong></div><div class="quest-dots">${a.items.map((z,i)=>`<span class="${i<a.position?(z.correct?'right':'wrong'):i===a.position?'here':''}"></span>`).join('')}</div><p class="quest-prompt">${qEsc(questionsFor(a.kind,a.level,q.d)[q.index].t)}</p><div class="quest-option-list">${q.options.map((op,j)=>`<button type="button" data-quest-choice="${j}" class="quest-choice ${quizSelected.includes(j)?'picked':''}" aria-pressed="${quizSelected.includes(j)}"><span class="choice-box">${multiple?'▢':'◯'}</span>${qEsc(op)}</button>`).join('')}</div><p class="quest-hint">${multiple?'MULTI-SELECT · choose every valid statement':'SINGLE CHOICE · choose one defensible answer'} · No second guesses after submitting.</p><button type="button" class="action-button quest-submit" data-quest-submit ${quizSelected.length?'':'disabled'}>Lock answer · face the Tonitrus obstacle →</button><div class="quest-score">Correct so far: <strong>${correctSoFar}/${a.position}</strong> · ${iconBolt()} ${quest.bolts}/10 bolts</div></div>`;
}
function showRewardToast(kind,message){const box=document.getElementById('gameToast');if(!box)return;box.innerHTML=`<img class="reward-img" src="${asset(kind)}" alt=""><strong>${qEsc(message)}</strong>`;box.classList.remove('hidden');clearTimeout(showRewardToast._timer);showRewardToast._timer=setTimeout(()=>box.classList.add('hidden'),2500);}
function reviewAfterRound(last){if(!Array.isArray(last.breakdown))return '';return `<details class="quest-debrief"><summary>Study the completed challenge · explanations after all submissions</summary>${last.breakdown.map((z,i)=>`<div class="quest-debrief-item"><strong>${i+1}. ${z.ok?'✓ CORRECT':'✕ INCORRECT'} · ${z.tier.toUpperCase()}</strong><p>${qEsc(z.prompt)}</p><p><b>Defensible selection:</b> ${z.expected.map(qEsc).join(' + ')}</p><p>${qEsc(z.why)}</p></div>`).join('')}</details>`;}
function challengeWidget(level){const active=quest.active,own=quest.stars[level],passed=quest.passed[level],last=quest.last&&quest.last.kind==='stage'&&quest.last.level===level?quest.last:null;
 let html=`<div class="challenge-stage"><h5>05 · THE TONITRUS OBSTACLE COURSE</h5><p>Four conceptual challenges: <strong>1 easy + 1 medium + 2 hard</strong>. A Stella needs ≥3 correct; both hard correct can unlock the next chapter without a Stella. Wrong answers add Tonitrus Bolts, and the 10th Bolt restarts at level 01.</p><div class="chapter-award-line">${own?iconStar():iconBolt()} <strong>${own?'Stella collected':passed?'Unlocked without Stella':'Chapter gate awaiting challenge'}</strong></div>`;
 if(active&&active.kind==='stage'&&active.level===level)html+=`<div id="quest-quiz">${quizAreaContent()}</div>`;
 else if(active)html+=`<p class="quest-notice">An unfinished challenge is active in chapter ${active.level+1}. Complete it before starting another.</p><button class="action-button" data-quest-return>Return to the active challenge →</button>`;
 else if(own)html+=`<div class="quest-notice success">${iconStar()} This chapter's Stella has been collected. Scientific reading and workshops remain available.</div>`;
 else {if(last)html+=`<div class="quest-notice ${last.passed?'success':''}"><strong>${last.correct!==undefined?`${last.correct}/4 correct · ${last.hard}/2 hard · `:''}${last.passed?'GATE OPEN':'GATE CLOSED'}</strong><p>${qEsc(last.msg)}</p></div>${reviewAfterRound(last)}`;
  if(!last?.exhausted)html+=`<button class="action-button" data-quest-start="stage:${level}">${passed?'Retry for your missing Stella':'Face four randomized conceptual obstacles'} →</button>`;
 }
 if(passed&&level+1<20)html+=`<button class="action-button next-quest" data-quest-next="${level}">Follow the golden path to ${qEsc(chapters[level+1].short)} →</button>`;
 html+='</div>';return html;
}
