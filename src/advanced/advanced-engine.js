/* Standalone post-Loid research track: separate 21–25 house map, scoring and persistence.
   No changes to the original world geometry, 20-chapter question pool or uniforms. */
function bvAdvancedBlank(){
 return {passed:[false,false,false,false,false],stars:[false,false,false,false,false],
   bolts:0,used:{},seen:{},active:null,last:null,epoch:0,completedRecord:false};
}
function bvAdvancedHydrate(){
 const a=quest.advanced&&typeof quest.advanced==='object'?quest.advanced:{};
 const fresh=bvAdvancedBlank();
 quest.advanced={...fresh,...a,
  passed:Array.isArray(a.passed)&&a.passed.length===5?a.passed.map(Boolean):fresh.passed,
  stars:Array.isArray(a.stars)&&a.stars.length===5?a.stars.map(Boolean):fresh.stars,
  bolts:Number.isInteger(a.bolts)&&a.bolts>=0&&a.bolts<5?a.bolts:0,
  used:a.used&&typeof a.used==='object'&&!Array.isArray(a.used)?a.used:{},
  seen:a.seen&&typeof a.seen==='object'&&!Array.isArray(a.seen)?a.seen:{}
 };
 quest.advanced.completedRecord=Boolean(a.completedRecord||quest.advanced.stars.every(Boolean));
 if(quest.advanced.active && (!Array.isArray(quest.advanced.active.items)||!Number.isInteger(quest.advanced.active.position)))quest.advanced.active=null;
 quest.eliteUnlocked=Boolean(quest.imperialWins>=5||quest.advanced.completedRecord);
}
bvAdvancedHydrate();
function bvAdvancedAllowed(){return state.current===20&&(quest.journeyPassed||quest.examPass||quest.imperial);}
function bvAdvancedCurrent(){const i=quest.advanced.passed.findIndex(x=>!x);return i<0?5:i;}
function bvAdvancedMarkSeen(t){return questionFingerprint(t);}
function bvAdvancedPick(level,tier){
 const adv=quest.advanced,bank=BV_ADVANCED_BANK[level][tier];
 const available=bank.map((q,i)=>i).filter(i=>!adv.used['adv:'+level+':'+tier+':'+i]&&!adv.seen[bvAdvancedMarkSeen(bank[i].t)]&&!quest.seenPrompts[bvAdvancedMarkSeen(bank[i].t)]);
 if(!available.length)return null;
 const index=available[Math.floor(Math.random()*available.length)];
 const q=bank[index],o=shuffleQuest([...q.a.map(x=>({t:x,ok:true})),...q.b.map(x=>({t:x,ok:false}))]);
 adv.used['adv:'+level+':'+tier+':'+index]=true;
 adv.seen[bvAdvancedMarkSeen(q.t)]=true;
 quest.seenPrompts[bvAdvancedMarkSeen(q.t)]=true;
 return {tier,index,options:o.map(x=>x.t),answer:o.flatMap((x,i)=>x.ok?[i]:[]),ok:null,chosen:[]};
}
function bvAdvancedHasFullSet(level){
 const adv=quest.advanced,need={e:2,m:2,h:4};
 return Object.entries(need).every(([tier,n])=>BV_ADVANCED_BANK[level][tier].filter((q,i)=>!adv.used['adv:'+level+':'+tier+':'+i]&&!adv.seen[bvAdvancedMarkSeen(q.t)]&&!quest.seenPrompts[bvAdvancedMarkSeen(q.t)]).length>=n);
}
function bvAdvancedMapHTML(){
 const adv=quest.advanced,current=bvAdvancedCurrent();
 return '<article class="chapter-article bv-advanced"><div class="chapter-tag">POST-LOID RESEARCH EXPEDITION · CHAPTERS 21–25</div>'+
 '<h4>The Five Hidden Research Houses</h4><p class="lede">These five research houses follow the original twenty chapters and a passing final examination. Imperial Scholar status is not required.</p>'+
 '<p class="bv-adv-rules">'+iconStar()+' '+adv.stars.filter(Boolean).length+'/5 advanced Stellas · '+iconBolt()+' '+adv.bolts+'/5 advanced Tonitrus Bolts. Each house has 2 easy, 2 medium and 4 hard conceptual questions (8 in total). At least 6/8 earns a Stella; a fifth incorrect answer resets only the advanced expedition to House 21.</p>'+
 '<p class="bv-adv-map-tip">Explore the five isometric research houses on the large map to the left. Select a house there or use the accessible chapter links below.</p>'+
 '<div class="bv-adv-house-links" role="group" aria-label="Visit advanced houses">'+BV_ADVANCED_CHAPTERS.map((ch,i)=>{
   const locked=i>current,star=adv.stars[i];
   return '<button type="button" class="bv-adv-house-link '+(i===current?'active ':'')+'" data-bv-adv-stage="'+i+'" '+(locked?'disabled aria-disabled="true"':'')+' aria-label="House '+(21+i)+': '+qEsc(ch.name)+(locked?', locked':'')+'"><b>'+(21+i)+'</b><span>House '+(21+i)+'<small>'+qEsc(ch.name)+'</small></span><span class="bv-adv-link-state">'+(star?iconStar():locked?iconBolt():'✦')+'</span></button>';
 }).join('')+'</div>'+
 (adv.completedRecord?'<div class="quest-notice success">'+iconStar()+' All five advanced Stellas recorded: Elite Imperial League qualification unlocked.</div>':'')+
 '<div class="bv-adv-actions"><button type="button" class="action-button" data-chapter="20">Return to the Chapter 20 final record →</button>'+
 (quest.eliteUnlocked?'<button type="button" class="action-button" data-league-enter>Enter Elite Imperial League →</button>':'')+'</div></article>';
}
function bvAdvancedQuizHTML(){
 const a=quest.advanced.active;
 if(!a||!a.items[a.position])return '';
 const item=a.items[a.position],q=BV_ADVANCED_BANK[a.level][item.tier][item.index],multiple=item.tier==='h';
 const names={e:'EASY · advanced foundations',m:'MEDIUM · experiment design',h:'HARD · invention and falsification'};
 return '<div class="quest-question"><div class="quest-topline"><span>ADVANCED HOUSE '+(21+a.level)+' · QUESTION '+(a.position+1)+'/8</span><strong>'+names[item.tier]+'</strong></div>'+
 '<div class="quest-dots">'+a.items.map((z,i)=>'<span class="'+(i<a.position?(z.ok?'right':'wrong'):i===a.position?'here':'')+'"></span>').join('')+'</div>'+
 '<p class="quest-prompt">'+qEsc(q.t)+'</p>'+
 '<div class="quest-option-list">'+item.options.map((opt,j)=>'<button type="button" class="quest-choice '+(a.selected.includes(j)?'picked':'')+'" data-bv-adv-option="'+j+'" aria-pressed="'+a.selected.includes(j)+'"><span class="choice-box">'+(multiple?'▢':'◯')+'</span>'+qEsc(opt)+'</button>').join('')+'</div>'+
 '<p class="quest-hint">'+(multiple?'MULTI-SELECT · select both scientifically valid statements':'SINGLE CHOICE · select the best defensible answer')+' · Submit once, without second guesses.</p>'+
 '<button type="button" class="action-button" data-bv-adv-submit '+(a.selected.length?'':'disabled')+'>Lock this answer →</button>'+
 '<div class="quest-score">'+iconBolt()+' Advanced bolts: '+quest.advanced.bolts+'/5 · Correct: '+a.results.filter(r=>r.ok).length+'/'+a.position+'</div></div>';
}
/* Advanced equations reuse the offline, accessible MathML/LaTeX pattern of the original 20. */
const BV_ADVANCED_TEX=["\\widehat{S}=\\frac{1}{N}\\sum_{i=1}^{N}\\mathbf{1}[V(y_i)=1]","\\mathbb{E}[Y\\mid\\operatorname{do}(A=a)]","\\operatorname{Post}(\\pi_i)\\subseteq\\operatorname{Pre}(\\pi_{i+1})","R_{\\mathrm{accept}}=\\Pr(\\mathrm{failure}\\mid\\mathrm{accept})","\\Delta_k=J_{\\mathrm{sealed}}(\\pi_{k+1})-J_{\\mathrm{sealed}}(\\pi_k)"];
const BV_ADVANCED_MATHML=["<mrow><mover><mi>S</mi><mo>^</mo></mover><mo>=</mo><mfrac><mn>1</mn><mi>N</mi></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>N</mi></munderover><mi>𝟙</mi><mo>[</mo><mi>V</mi><mo>(</mo><msub><mi>y</mi><mi>i</mi></msub><mo>)</mo><mo>=</mo><mn>1</mn><mo>]</mo></mrow>","<mrow><mi>𝔼</mi><mo>[</mo><mi>Y</mi><mo>|</mo><mi>do</mi><mo>(</mo><mi>A</mi><mo>=</mo><mi>a</mi><mo>)</mo><mo>]</mo></mrow>","<mrow><mi>Post</mi><mo>(</mo><msub><mi>π</mi><mi>i</mi></msub><mo>)</mo><mo>⊆</mo><mi>Pre</mi><mo>(</mo><msub><mi>π</mi><mrow><mi>i</mi><mo>+</mo><mn>1</mn></mrow></msub><mo>)</mo></mrow>","<mrow><msub><mi>R</mi><mtext>accept</mtext></msub><mo>=</mo><mi>Pr</mi><mo>(</mo><mtext>failure</mtext><mo>|</mo><mtext>accept</mtext><mo>)</mo></mrow>","<mrow><msub><mi>Δ</mi><mi>k</mi></msub><mo>=</mo><msub><mi>J</mi><mtext>sealed</mtext></msub><mo>(</mo><msub><mi>π</mi><mrow><mi>k</mi><mo>+</mo><mn>1</mn></mrow></msub><mo>)</mo><mo>−</mo><msub><mi>J</mi><mtext>sealed</mtext></msub><mo>(</mo><msub><mi>π</mi><mi>k</mi></msub><mo>)</mo></mrow>"];
function bvAdvancedEquation(i){
 if(!Number.isInteger(i)||i<0||i>=5)return '';
 return '<div class="math-line bv-typeset-math"><div class="bv-math-scroll"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics>'+BV_ADVANCED_MATHML[i]+'<annotation encoding="application/x-tex">'+qEsc(BV_ADVANCED_TEX[i])+'</annotation></semantics></math></div></div>';
}

function bvAdvancedStageHTML(i){
 const ch=BV_ADVANCED_CHAPTERS[i],adv=quest.advanced,last=adv.last?.level===i?adv.last:null,star=adv.stars[i];
 let html='<article class="chapter-article bv-advanced"><div class="chapter-tag">ADVANCED CHAPTER '+(21+i)+'/25 · '+qEsc(ch.role)+'</div>'+
 '<div class="guide-header"><img src="'+BV_ADVANCED_SPRITES[i]+'" alt="Pixel-art research companion"><div><h4>'+qEsc(ch.name)+'</h4><p>Research House '+(21+i)+'</p></div></div>'+
 '<h5>01 · Scientific foundations</h5><p>'+qEsc(ch.intro)+'</p>'+bvAdvancedEquation(i)+'<h5>02 · Reproducible experimental design</h5><p>'+qEsc(ch.experiment)+'</p>'+
 '<div class="frontier"><h5>03 · Open invention problem</h5><p>'+qEsc(ch.challenge)+'</p></div>'+
 '<h5>Verified research readings</h5>'+ch.papers.map(p=>'<p><a class="paper-link" target="_blank" rel="noopener noreferrer" href="'+qEsc(p[1])+'">'+qEsc(p[0])+' ↗</a></p>').join('')+
 '<div class="challenge-stage"><h5>04 · Tonitrus research obstacle course</h5><p>2 easy + 2 medium + 4 hard · at least <strong>6/8</strong> correct earns a Stella and unlocks the next house. Every incorrect answer adds one advanced Bolt; five Bolts restart at House 21. The original 20-chapter record is never reset.</p>';
 if(adv.active&&adv.active.level===i)html+=bvAdvancedQuizHTML();
 else if(adv.active)html+='<p class="quest-notice">Finish the unfinished test in House '+(21+adv.active.level)+' before opening another examination.</p><button type="button" class="action-button" data-bv-adv-stage="'+adv.active.level+'">Resume that exam →</button>';
 else if(star)html+='<p class="quest-notice success">'+iconStar()+' Stella already collected in this advanced chapter.</p>';
 else{
  if(last)html+='<div class="quest-notice '+(last.passed?'success':'')+'"><strong>'+last.correct+'/8 correct · '+(last.passed?'STELLA EARNED':'RESEARCH GATE CLOSED')+'</strong><p>'+qEsc(last.message)+'</p></div>'+ (last.results?'<details class="quest-debrief"><summary>Review completed answers and explanations</summary>'+last.results.map(r=>'<div class="quest-debrief-item"><strong>'+qEsc(r.tier.toUpperCase())+' · '+(r.ok?'CORRECT':'INCORRECT')+'</strong><p>'+qEsc(r.prompt)+'</p><p><b>Defensible answer:</b> '+r.answers.map(qEsc).join(' + ')+'</p><p>'+qEsc(r.why)+'</p></div>').join('')+'</details>':'');
  html+='<button type="button" class="action-button" data-bv-adv-start="'+i+'" '+(bvAdvancedHasFullSet(i)?'':'disabled')+'>'+(bvAdvancedHasFullSet(i)?'Face eight unseen research questions →':'No complete unseen question set remains for this house')+'</button>';
 }
 html+='</div><div class="bv-adv-actions"><button type="button" class="action-button" data-bv-advanced-enter>View the five research houses →</button></div></article>';return html;
}
function bvAdvancedShow(level=null){
 if(!bvAdvancedAllowed())return;
 const pane=document.getElementById('journal-content');if(!pane)return;
 const validLevel=Number.isInteger(level)&&level>=0&&level<5&&level<=bvAdvancedCurrent();
 quest.advanced.view=validLevel?level:'map';
 pane.innerHTML=validLevel?bvAdvancedStageHTML(level):bvAdvancedMapHTML();
 pane.scrollTop=0;
 storeQuest();
 bvAdvancedShowWorld();
}
function bvAdvancedStart(level){
 const adv=quest.advanced;
 if(!bvAdvancedAllowed()||adv.active||level!==bvAdvancedCurrent()||adv.stars[level]||!bvAdvancedHasFullSet(level))return;
 const tiers=['e','e','m','m','h','h','h','h'],items=tiers.map(t=>bvAdvancedPick(level,t));
 if(items.some(x=>!x))throw Error('Advanced selection invariant broken');
 adv.last=null;adv.active={level,items,position:0,selected:[],results:[],created:Date.now()};
 storeQuest();bvAdvancedShow(level);
}
function bvAdvancedSelect(index){
 const a=quest.advanced.active;if(!a)return;
 const item=a.items[a.position];if(!item||item.ok!==null||index<0||index>=item.options.length)return;
 a.selected=item.tier==='h'?(a.selected.includes(index)?a.selected.filter(x=>x!==index):[...a.selected,index]):[index];
 storeQuest();bvAdvancedShow(a.level);
}
function bvAdvancedReset(){
 const prev=quest.advanced,reset=bvAdvancedBlank();
 reset.used=prev.used;reset.seen=prev.seen;reset.completedRecord=prev.completedRecord;reset.epoch=(prev.epoch||0)+1;
 reset.last={level:0,reset:true,correct:0,passed:false,message:'Five advanced Tonitrus Bolts: start again at House 21. Previous questions stay retired; the original journey and Imperial record are safe.'};
 quest.advanced=reset;quest.eliteUnlocked=Boolean(quest.imperialWins>=5||reset.completedRecord);
 storeQuest();bvAdvancedShow();
 document.dispatchEvent(new CustomEvent('bv-advanced-bolt-reset'));
}
function bvAdvancedSubmit(){
 const adv=quest.advanced,a=adv.active;if(!a||!a.selected.length)return;
 const item=a.items[a.position],selected=[...a.selected].sort((x,y)=>x-y);
 const expected=[...item.answer].sort((x,y)=>x-y);
 const ok=JSON.stringify(selected)===JSON.stringify(expected);
 item.ok=ok;item.chosen=selected;a.results.push({tier:item.tier,index:item.index,ok});
 a.position++;a.selected=[];
 if(!ok){
  adv.bolts++;showRewardToast('tonitrus','Advanced research obstacle · +1 Bolt');
  if(adv.bolts>=5){bvAdvancedReset();return;}
 }
 if(a.position>=8){
  const n=a.results.filter(r=>r.ok).length,earned=n>=6,level=a.level;
  if(earned){
   adv.stars[level]=true;adv.passed[level]=true;
   if(adv.stars.every(Boolean)){adv.completedRecord=true;quest.eliteUnlocked=true;}
   showRewardToast('stella','Stella Star earned!');
  }
  adv.last={level,correct:n,passed:earned,message:earned?'Stella earned; the next advanced research house is available.':'At least six correct are required. Review the answers and retry with fresh questions.',
   results:a.results.map(r=>{
    const q=BV_ADVANCED_BANK[level][r.tier][r.index];
    return {tier:r.tier,ok:r.ok,prompt:q.t,answers:q.a,why:q.why};
   })};
  adv.active=null;
 }
 storeQuest();
 bvAdvancedShow(a.level);
}
/* The second garden occupies the existing large game viewport, not tiny journal cards.
   The original canvas, its camera and twenty-house progression are never modified. */
function bvAdvancedHideWorld(){
 const overlay=document.getElementById('bv-advanced-overlay');
 if(overlay&&!overlay.hidden){overlay.hidden=true;if(quest.advanced){quest.advanced.view=null;storeQuest();}}
}
function bvAdvancedShowWorld(){
 const host=document.querySelector('.canvas-wrap');if(!host)return;
 let layer=document.getElementById('bv-advanced-overlay');
 if(!layer){
  layer=document.createElement('section');
  layer.id='bv-advanced-overlay';layer.className='bv-advanced-overlay';
  layer.setAttribute('aria-label','Advanced five-house isometric research garden');
  layer.innerHTML='<div class="bv-advanced-map-header"><strong>MAP 02 · ADVANCED RESEARCH GARDEN</strong><button type="button" class="bv-adv-exit" data-bv-advanced-exit aria-label="Return to the original garden">Return to Main Garden ✕</button></div>'+
   '<canvas id="bv-advanced-world" width="940" height="470" tabindex="0" role="img" aria-label="Interactive 2.5D map with five isometric houses, characters Anya, Bond, Damian, Yor and Loid, and Stella and Tonitrus icons. Select the matching house from the chapter links at right if using a keyboard."></canvas>';
  host.append(layer);
 }
 layer.hidden=false;
 bvAdvancedRenderGarden();
}
const bvNormalChapterOpen=openChapter;
openChapter=function(i){bvAdvancedHideWorld();return bvNormalChapterOpen(i);};
const bvOriginalShowLeague=showLeague;
showLeague=function(){bvAdvancedHideWorld();return bvOriginalShowLeague();};
document.addEventListener('click',event=>{
 if(event.target.closest('[data-bv-advanced-exit]'))openChapter(20);
});
document.addEventListener('keydown',event=>{
 if(!document.getElementById('bv-advanced-overlay')?.hidden&&
    document.getElementById('bv-advanced-overlay')&&
    ['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(event.key.toLowerCase())&&
    !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){
  event.stopImmediatePropagation();event.preventDefault();
 }
},true);

const bvOriginalCompleteScreen=completeScreen;
completeScreen=function(){
 const html=bvOriginalCompleteScreen();
 if(!bvAdvancedAllowed())return html;
 return html+'<div class="bv-adv-portal"><h4>Research Expedition · Houses 21–25</h4><p>After passing the Chapter 20 final examination, explore five new advanced research houses. Imperial Scholar status is optional; five advanced Stellas or five separate Imperial wins qualify for the Elite Imperial League.</p><button type="button" class="action-button" data-bv-advanced-enter>Enter the five research houses →</button></div>';
};
document.addEventListener('click',event=>{
 const t=event.target,enter=t.closest('[data-bv-advanced-enter]');
 if(enter){bvAdvancedShow();return;}
 const stage=t.closest('[data-bv-adv-stage]');if(stage){bvAdvancedShow(Number(stage.dataset.bvAdvStage));return;}
 const begin=t.closest('[data-bv-adv-start]');if(begin){bvAdvancedStart(Number(begin.dataset.bvAdvStart));return;}
 const choice=t.closest('[data-bv-adv-option]');if(choice){bvAdvancedSelect(Number(choice.dataset.bvAdvOption));return;}
 if(t.closest('[data-bv-adv-submit]')){bvAdvancedSubmit();return;}
});
storeQuest();
window.addEventListener('load',()=>{
 const a=quest.advanced;
 if(bvAdvancedAllowed()&&(a.active||a.view==='map'||Number.isInteger(a.view))){
   const wanted=a.active?a.active.level:a.view;
   bvAdvancedShow(Number.isInteger(wanted)?wanted:null);
 }
},{once:true});
