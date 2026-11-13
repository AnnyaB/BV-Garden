function article(ch){const i=ch.index,passed=quest.passed[i];return `<article class="chapter-article"><div class="chapter-tag">CHAPTER ${String(i+1).padStart(2,'0')} / 20 · ${qEsc(ch.tag)}</div><div class="guide-header"><img src="${asset(ch.id)}" alt="Pixel art research companion for ${qEsc(ch.short)}"><div><h4>${qEsc(ch.title)}</h4><p>${qEsc(ch.short)}</p></div></div><p class="lede">${qEsc(ch.tag)}</p><h5>01 · First principles</h5><p>${qEsc(ch.known)}</p>${chapterEquation(i)}${deepHTML(i)}${learningBridge(i)}<h5>02 · Practice and reproducibility</h5><p>${qEsc(ch.experiment)}</p>${window.microLabHTML?microLabHTML(ch):''}${ch.role==='dynamics'?toyHTML():''}${ch.role==='energy'?energyHTML():''}<div class="frontier"><h5>03 · Open research limitation</h5><p>${qEsc(ch.frontier)}</p></div><a href="${qEsc(ch.source)}" class="paper-link" target="_blank" rel="noopener noreferrer">↗ VERIFIED READING<br><span style="font-weight:500">${qEsc(ch.paper)}</span></a>${challengeWidget(i)}${passed?`<p class="chapter-finished">✓ Chapter gate passed. ${quest.stars[i]?'Stella collected.':'A Stella can still be earned using unused questions.'}</p>`:''}</article>`;}
function progress(){const count=state.completed.size,num=quest.stars.filter(Boolean).length;
 document.getElementById('progress-numeric').innerHTML=`${String(count).padStart(2,'0')} <small>/ ${chapters.length}</small>`;
 document.getElementById('progress-fill').style.width=`${count/20*100}%`;
 const reward=document.getElementById('rewardStrip');if(reward)reward.innerHTML=`<span>${iconStar()} <strong>${num}/20</strong> Stella Stars</span><span>${iconBolt()} <strong>${quest.bolts}/10</strong> Tonitrus Bolts</span>${quest.imperial?'<b class="imperial-mini">IMPERIAL SCHOLAR</b>':''}`;
}
function ribbon(){const root=document.getElementById('chapter-ribbon');root.innerHTML=chapters.map((ch,i)=>`<button type="button" role="listitem" class="chapter-button ${quest.passed[i]?'done':''} ${state.current===i?'active':''} ${i>state.current?'locked':''}" data-chapter="${i}" aria-label="Chapter ${i+1} ${qEsc(ch.short)}${i>state.current?' locked':''}"><span class="chapter-no">${String(i+1).padStart(2,'0')} / 20</span><span class="chapter-title">${qEsc(ch.short)}</span><span class="chapter-status">${i>state.current?`${iconBolt()} LOCKED`:quest.stars[i]?`${iconStar()} STELLA`:quest.passed[i]?'✓ cleared · Stella missing':'Face the challenge'}</span></button>`).join('');}
function lockedArticle(i){return `<article class="chapter-article"><div class="chapter-tag">${iconBolt()} RESEARCH OBSTACLE LOCKED</div><h4>${qEsc(chapters[i].short)}</h4><p>Complete every prior chapter’s four-question gate in sequence. Future chapters cannot be reached by skipping the golden thread.</p><p>Current gate: <strong>${state.current<20?`${state.current+1} · ${qEsc(chapters[state.current].short)}`:'all research chapters passed'}</strong>.</p><button class="action-button" data-goto-next>Return to the current gate →</button></article>`;}
function completeScreen(){
 const have=quest.stars.filter(Boolean).length;
 const last=quest.last?.kind==='exam'?quest.last:null;
 const wins=quest.imperialWins||0,journeys=quest.journeyWins||0;
 const backup=`<div class="bv-backup-actions"><button type="button" class="action-button" data-save-backup>Save progress for email</button><button type="button" class="action-button" data-restore-backup>Restore saved progress</button><input id="bv-backup-file" type="file" accept=".json,application/json" hidden><p>Export a backup file and email it to yourself as an attachment. The offline game does not connect to an email account or store your address.</p></div>`;
 if(quest.imperial){
   return `<article class="chapter-article imperial-win"><div class="chapter-tag">20 STELLAS · IMPERIAL SCHOLAR · WIN ${wins}</div><img class="scholar-portrait" src="${asset(quest.avatarChoice===1?'explorer_scholar_alt':'explorer_scholar')}" alt="Explorer with a dark cape, burgundy lining and gold cord"><h4>Imperial Scholar</h4><p class="lede">All 20 Stellas and the advanced final examination completed. Your avatar now wears the academy-style black cape with dark-red lining and gold fastening.</p><p>Imperial wins: <strong>${wins}/5</strong> toward the Elite Imperial League. Completed journeys: <strong>${journeys}</strong>. First completed journey: ${quest.firstWinAt?new Date(quest.firstWinAt).toLocaleDateString():'recorded in an earlier save'}.</p><div class="scholar-gallery">${iconStar()} 20/20 Stellas · ${iconBolt()} ${quest.bolts}/10 Tonitrus</div>${backup}${quest.eliteUnlocked?'<button type="button" class="action-button" data-league-enter>Enter the Elite Imperial League →</button>':'<p class="quest-notice">Earn Imperial Scholar five times on separate 20-Stella journeys to unlock the Elite Imperial League.</p>'}<button type="button" class="action-button" data-new-journey>Begin another journey →</button><button type="button" class="action-button" data-chapter="19">Review Level 20 →</button></article>`;
 }
 const missing=quest.stars.map((star,i)=>!star?i:-1).filter(i=>i>=0);
 let html=`<article class="chapter-article"><div class="chapter-tag">THE IMPERIAL SCHOLAR QUALIFIER</div><h4>20 Stella Stars before the final exam</h4><p class="lede">${have}/20 Stella Stars earned. Every level must have its Stella; clearing a level without collecting its star does not satisfy this qualifier.</p><div class="scholar-gallery">${iconStar()} ${have}/20 Stellas · ${iconBolt()} ${quest.bolts}/10 Tonitrus · Completed journeys ${journeys} · Imperial wins ${wins}/5</div>`;
 if(have<20){html+=`<div class="quest-notice"><strong>Imperial exam locked.</strong><p>Missing Stella levels: ${missing.map(i=>String(i+1).padStart(2,'0')).join(', ')}. New attempts use unused questions.</p></div><button class="action-button" data-chapter="${missing[0]}">Return to Level ${missing[0]+1} →</button>`;}
 else if(quest.active?.kind==='exam'){html+=`<div id="quest-quiz">${quizAreaContent()}</div>`;}
 else {
  html+='<p>Final exam: <strong>10 questions</strong> — 2 easy, 3 medium, 5 hard. Pass with at least 7/10 correct. Imperial Scholar requires at least 7/10, with 2/3 medium and 4/5 hard correct, plus 20 Stella Stars.</p>';
  if(last)html+=`<div class="quest-notice ${last.passed?'success':''}"><strong>${last.correct}/10 · Medium ${last.medium||0}/3 · Hard ${last.hard}/5</strong><p>${qEsc(last.msg)}</p></div>${reviewAfterRound(last)}`;
  if(quest.journeyPassed)html+=`<p class="quest-notice success">First completed journey: ${quest.firstWinAt?new Date(quest.firstWinAt).toLocaleDateString():'previously recorded'} · Total completed journeys: ${journeys}. Pass recorded; Imperial Scholar requires the higher-tier answer conditions.</p><button type="button" class="action-button" data-new-journey>Begin another journey →</button>`;
  if(!last?.exhausted)html+='<button type="button" class="action-button" data-quest-start="exam:20">Begin the Imperial Scholar examination →</button>';
 }
 if(quest.eliteUnlocked)html+='<button type="button" class="action-button" data-league-enter>Elite Imperial League →</button>';
 return html+backup+'</article>';
}
function openChapter(i){if(state.travel)return;
 if(i>=20){state.selection=20;document.getElementById('journal-content').innerHTML=completeScreen();document.getElementById('journal-content').scrollTop=0;return;}
 state.selection=i;state.correctAnswered=false;document.getElementById('journal-content').innerHTML=i>state.current?lockedArticle(i):article(chapters[i]);document.getElementById('journal-content').scrollTop=0;
 document.getElementById('map-location').textContent=(i>state.current?'Locked: ':'Exploring: ')+chapters[i].short;
 document.getElementById('worldTip').textContent=i>state.current?'Tonitrus gate ahead · complete earlier stages':'Research obstacles · earn Stella Stars';ribbon();progress();
}
function beginNext(i){if(i>=20||!quest.passed[i])return;
 if(i===19){openChapter(20);return;}
 const next=chapters[i+1];state.travel={start:performance.now(),from:{...state.player},to:{x:next.place[0]+.5,y:next.place[1]+.8}};
 document.getElementById('worldTip').textContent=`Following the golden path to ${next.short} →`;
}
// The original reset handler would silently erase progress without preserving used questions; replace it.
const resetControl=document.getElementById('reset-progress');const newReset=resetControl.cloneNode(true);resetControl.replaceWith(newReset);
newReset.textContent='restart adventure';newReset.addEventListener('click',()=>{
 if(!window.confirm('Restart your adventure from level 01? Previous questions stay retired and are NEVER reused.'))return;
 restartJourney(false);
});
document.addEventListener('click',ev=>{
 const start=ev.target.closest('[data-quest-start]');if(start){const [kind,index]=start.dataset.questStart.split(':');beginQuest(kind,Number(index));return;}
 const choice=ev.target.closest('[data-quest-choice]');if(choice){selectQuizOption(Number(choice.dataset.questChoice));return;}
 if(ev.target.closest('[data-quest-submit]')){submitQuizAnswer();return;}
 const go=ev.target.closest('[data-quest-next]');if(go){beginNext(Number(go.dataset.questNext));return;}
 if(ev.target.closest('[data-quest-return]')){if(quest.active)openChapter(quest.active.kind==='exam'?20:quest.active.level);return;}
});
progress();ribbon();


/* Twenty small, scientifically identified exercises. Calculations are transparent deterministic toys,
   NOT trained models, benchmark results, proof of mastery or original inventions. */
(()=>{
'use strict';
const LABS=[
['Four milestones','Explore dates in AI history. These are historical landmarks, not a complete history.',[['1956 · Dartmouth','1956'],['1986 · backpropagation','1986'],['2012 · deep vision','2012'],['2023 · predictive embeddings','2023']]],
['Boolean circuits','Toggle two binary inputs and see why the choice of operator changes the result.',[['Toggle A','a'],['Toggle B','b'],['Reset','reset']]],
['Search the graph','Follow breadth-first search on an unweighted directed graph from A toward F.',[['Advance BFS','step'],['Reset','reset']]],
['Check a derivative','Compare finite-difference estimates to the analytic derivative of f(x)=x² at x=3.',[['h = 1','1'],['h = 0.1','.1'],['h = 0.01','.01']]],
['Optimize a scalar','Use true gradient descent on L(w)=(w−2)², starting at w=6.',[['Step η=.1','.1'],['Step η=.3','.3'],['Step η=1.2','1.2'],['Reset','reset']]],
['Generalization under shift','Compare performance on two explicitly synthetic 20-sample test sets.',[['In-distribution','id'],['Shifted inputs','ood'],['Compare','both']]],
['Activation functions','Apply different nonlinear functions to exactly the same scalar input.',[['ReLU(−2)','relu'],['tanh(−2)','tanh'],['sigmoid(−2)','sigmoid'],['ReLU(+2)','positive']]],
['Contrastive temperature','Compute a two-candidate InfoNCE-style softmax loss: similarities 0.8 and 0.4.',[['τ = 0.1','.1'],['τ = 0.5','.5'],['τ = 1','1']]],
['State ambiguity','Two hidden velocities can produce the same observed position; predict the next position.',[['Observe position only','obs'],['Reveal velocities','reveal'],['Take Δt=1','step']]],
['Energy minimization','The energy surface above scores candidate states, not normalized probabilities.',[['E(−1)','-1'],['E(0)','0'],['E(2)','2'],['E(3)','3']]],
['Latent prediction','Calculate squared Euclidean error between an illustrative target embedding (2,1) and a candidate prediction.',[['Predict (0,1)','0'],['Predict (1,1)','1'],['Predict (2,1)','2']]],
['Transition model','Use the state-transition toy above; actions are hand-coded, not learned.',[['Show transition rule','rule'],['Show accumulated step','iterate']]],
['Rollout drift','Compare xₜ₊₁=xₜ+1 (reference) to a model predicting x̂ₜ₊₁=x̂ₜ+1.12.',[['Roll 1 step','1'],['Roll 5 steps','5'],['Roll 10 steps','10']]],
['Receding-horizon control','Compare constant actions over 3 steps with terminal cost (x₃−2)² and control penalty 0.1Σa².',[['a = −1','-1'],['a = 0','0'],['a = +1','1']]],
['Search exploration bonus','Compute UCB = mean + c√(ln N/n), where N=12 and two candidates have different visit counts.',[['Exploration c=.5','.5'],['Exploration c=1.4','1.4']]],
['Contact and inertia','Toy one-step Δv=FΔt/m with F=10 N, Δt=0.1 s; ignores friction.',[['Mass 1 kg','1'],['Mass 5 kg','5']]],
['Grasp feasibility','Compare frictional holding capacity μN with gravitational load mg (N=10 N, m=.5 kg, g=9.81 m/s²).',[['μ = 0.3','.3'],['μ = 0.8','.8']]],
['Abstention trade-off','Apply an illustrative risk threshold to five synthetic predictions; lower thresholds reject more actions.',[['Risk cutoff .2','.2'],['Risk cutoff .5','.5'],['Risk cutoff .8','.8']]],
['Active system identification','Compare passive observation with a controlled 3 N, 1 s push on objects of 1 kg and 3 kg.',[['Only observe','passive'],['Apply controlled push','push']]],
['Open-ended intelligence claim audit','Distinguish bounded empirical progress from the still-unproven goal of unrestricted AGI, ASI or self-improving intelligence.',[['No baseline','none'],['One in-distribution seed','single'],['Matched baselines + multiple seeds + held-out OOD','rigorous']]]
];
const states={};
function init(i){if(!states[i])states[i]={a:0,b:1,w:6,queue:['A'],seen:['A'],k:0};return states[i];}
function safe(t){return String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
window.microLabHTML=function(ch){const i=ch.index,L=LABS[i];if(!L)return'';return `<div class="micro-lab" data-lab-panel="${i}"><div class="micro-heading"><span>◈ WORKSHOP / ${String(i+1).padStart(2,'0')}</span><small>Executable learning toy · no trained model</small></div><h5>${L[0]}</h5><p>${L[1]}</p><div class="micro-actions">${L[2].map(([name,key])=>`<button type="button" data-lab-step="${i}|${key}">${name}</button>`).join('')}</div><output class="micro-output" id="lab-output-${i}">Select an action to inspect the result.</output></div>`;};
function run(i,key){const s=init(i);let out='';
 switch(i){
 case 0:out=({'1956':'1956: The Dartmouth summer workshop helped establish artificial intelligence as a field.','1986':'1986: Influential backpropagation work accelerated multilayer neural-network learning.','2012':'2012: Deep CNNs dramatically improved large-scale ImageNet classification.','2023':'2023: I-JEPA presented predictive representation learning for images (CVPR).'})[key];break;
 case 1:if(key==='reset'){s.a=0;s.b=1;}if(key==='a')s.a=1-s.a;if(key==='b')s.b=1-s.b;out=`A=${s.a}, B=${s.b}; AND=${s.a&s.b}, XOR=${s.a^s.b}, OR=${s.a|s.b}. An operator is a specified truth table.`;break;
 case 2:{const edges={A:['B','C'],B:['D'],C:['E'],D:['F'],E:['F'],F:[]};if(key==='reset'){s.queue=['A'];s.seen=['A'];s.k=0;out='BFS reset: frontier [A].';break;}const n=s.queue.shift();if(!n){out='Queue empty. Visited '+s.seen.join(' → ');break;}for(const v of edges[n])if(!s.seen.includes(v)){s.seen.push(v);s.queue.push(v);}s.k++;out=`Expanded ${n}. Seen: ${s.seen.join(' → ')}. Queue: [${s.queue.join(', ')}]. ${n==='F'?'Goal reached.':''}`;break;}
 case 3:{const h=Number(key),est=((3+h)**2-9)/h;out=`f(3)=9, finite difference=${est.toFixed(4)}; analytic f′(3)=6; absolute error=${Math.abs(est-6).toFixed(4)}.`;break;}
 case 4:if(key==='reset'){s.w=6;out='Reset to w=6, L=16.';break;}const eta=+key,grad=2*(s.w-2);s.w-=eta*grad;out=`η=${eta}, previous gradient=${grad.toFixed(3)}, new w=${s.w.toFixed(3)}, new loss=${((s.w-2)**2).toFixed(3)}. Overshoot is possible.`;break;
 case 5:out=key==='id'?'Synthetic ID set: 17/20 correct = 85%.':key==='ood'?'Synthetic shifted set: 11/20 correct = 55%.':'Synthetic example: ID 85%, shifted 55%, gap 30 percentage points. NOT a measured research result.';break;
 case 6:{let v=key==='positive'?2:-2;const t=key==='relu'||key==='positive'?Math.max(v,0):key==='tanh'?Math.tanh(v):1/(1+Math.exp(-v));out=`input=${v}; ${key==='positive'?'ReLU':key==='relu'?'ReLU':key==='tanh'?'tanh':'sigmoid'} output=${t.toFixed(5)}.`;break;}
 case 7:{let temp=+key,p=Math.exp(.8/temp)/(Math.exp(.8/temp)+Math.exp(.4/temp));out=`τ=${temp}; P(positive candidate | two-candidate toy)=${p.toFixed(4)}, loss=−log(P)=${(-Math.log(p)).toFixed(4)}. No encoder was trained.`;break;}
 case 8:out=key==='obs'?'Both particles are at x=0 now. Position alone cannot identify velocity.':key==='reveal'?'Latent hypotheses: A has v=+1 m/s; B has v=−1 m/s.':'With Δt=1 s and no acceleration: x_next(A)=+1 m; x_next(B)=−1 m. Same current observation, different future.';break;
 case 9:{const x=+key;out=`Candidate s=${x}, E(s)=(s−2)²+0.4=${((x-2)**2+.4).toFixed(2)}. Lowest sampled energy wins.`;break;}
 case 10:{const v=+key;out=`Predict (${v},1) against target (2,1): squared L₂ error=${((v-2)**2).toFixed(2)}. These are fixed toy vectors, not JEPA predictions.`;break;}
 case 11:out=key==='rule'?'Rule: v′=clip(v+a,−3,3); x′=x+v′ (Δt=1). The transition is hand-coded.':'Multi-step forecasts compound transition error if a learned rule deviates from physical reality.';break;
 case 12:{const n=+key;out=`After ${n} steps from x₀=0: reference x=${n.toFixed(2)}, predicted x̂=${(1.12*n).toFixed(2)}, absolute rollout error=${(.12*n).toFixed(2)}.`;break;}
 case 13:{const a=+key;const x=3*a,loss=(x-2)**2+.1*3*a*a;out=`Constant a=${a}, terminal x₃=${x}, cost=${loss.toFixed(2)}. This toy enumerates only three actions; real MPC replans.`;break;}
 case 14:{const c=+key,N=12;const A=.6+c*Math.sqrt(Math.log(N)/10),B=.45+c*Math.sqrt(Math.log(N)/2);out=`c=${c}: UCB(A)=${A.toFixed(3)} (10 visits), UCB(B)=${B.toFixed(3)} (2 visits). Select ${A>B?'A':'B'} in this toy.`;break;}
 case 15:{const m=+key;out=`F=10 N, m=${m} kg, Δt=.1 s → Δv=${(10*.1/m).toFixed(2)} m/s. Actual contact adds friction and other constraints.`;break;}
 case 16:{const mu=+key,cap=mu*10,need=.5*9.81;out=`μ=${mu}; holding capacity=${cap.toFixed(2)} N, gravitational load=${need.toFixed(3)} N → ${cap>=need?'idealized static hold feasible':'idealized static hold infeasible'}. Real grasps need more modeling.`;break;}
 case 17:{const lim=+key,risks=[.05,.17,.29,.48,.75],unsafe=[false,true,false,true,true];let num=0,bad=0;risks.forEach((r,j)=>{if(r<=lim){num++;bad+=unsafe[j]?1:0;}});out=`Cutoff ${lim}: accepted ${num}/5 (${(100*num/5).toFixed(0)}% coverage), unsafe accepted ${bad}/${num}. All cases are explicitly synthetic, not validated risk estimates.`;break;}
 case 18:out=key==='passive'?'Both objects remain still; no acceleration is observed, so passive data do not distinguish mass.':'With a 3 N push for 1 s, Δv=3 m/s if mass=1 kg; Δv=1 m/s if mass=3 kg (friction ignored). A controlled intervention distinguishes them.';break;
 case 19:out=key==='none'?'An algorithm name with no matched baseline provides no comparative evidence.':key==='single'?'One seed on familiar tasks cannot establish robust OOD generalization or novelty.':'A bounded protocol: measure retention, OOD transfer, independent task-family adaptation, intervention safety and full compute costs across matched baselines and independent seeds. This could test a specific claim; it would NOT establish unrestricted AGI, ASI or perpetual recursive improvement.';break;
 }
 return out||'No calculation available.';
}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-lab-step]');if(!b)return;const [i,key]=b.dataset.labStep.split('|');const index=+i;const out=document.getElementById('lab-output-'+index);if(out)out.textContent=run(index,key);});
window.LatentAtlasLabs={count:LABS.length,labNames:LABS.map(x=>x[0])};
})();

/* Accessibility and world exploration controls. No changes to scoring or chapter locks. */
'use strict';
(() => {
  const nav = document.getElementById('garden-tour');
  const openButton = document.getElementById('garden-index-toggle');
  const centerButton = document.getElementById('garden-center');
  const map = document.getElementById('world');
  const held = new Set();
  let last = 0;
  let drag = null;
  let skipClick = false;
  const important = ['INPUT', 'TEXTAREA', 'SELECT'];
  const isEditing = el => important.includes(el?.tagName) || !!el?.isContentEditable;
  const chapterLabel = i => `${String(i+1).padStart(2,'0')} · ${chapters[i].short}`;
  const arrow = {arrowup:[-1,0],w:[-1,0],arrowdown:[1,0],s:[1,0],arrowleft:[0,1],a:[0,1],arrowright:[0,-1],d:[0,-1]};
  const nearChapter = () => chapters.reduce((best,ch,i) => {
    const dist = Math.hypot(state.player.x - (ch.place[0]+.5),state.player.y-(ch.place[1]+.8));
    return dist < best.d ? {i,d:dist} : best;
  },{i:Math.min(19,state.current),d:Infinity});
  function visit(i) {
    if(!Number.isInteger(i)||i<0||i>=chapters.length)return;
    state.travel=null;state.player={x:chapters[i].place[0]+.5,y:chapters[i].place[1]+.8};
    state.explorePan={x:0,y:0}; held.clear();
    // Sightseeing is unrestricted; lessons still enforce the original progression.
    openChapter(i);
    nav.hidden=true;openButton.setAttribute('aria-expanded','false');
    map.focus({preventScroll:true});
  }
  function toggle(force){const on=typeof force==='boolean'?force:nav.hidden; nav.hidden=!on;openButton.setAttribute('aria-expanded',String(on));if(on)nav.querySelector('button')?.focus();else openButton.focus();}
  nav.innerHTML='<div class="garden-tour-head"><strong>Visit any station</strong><button type="button" id="garden-close" aria-label="Close research map">×</button></div><p>Walk freely between all 20 companions; locked lessons remain locked.</p><div class="garden-tour-grid">'+chapters.map((ch,i)=>`<button type="button" data-visit="${i}" aria-label="Visit station ${chapterLabel(i)}">${String(i+1).padStart(2,'0')} <span>${ch.short}</span></button>`).join('')+'</div>';
  nav.addEventListener('click',ev=>{const b=ev.target.closest('[data-visit]'); if(b){visit(Number(b.dataset.visit));return;}if(ev.target.closest('#garden-close'))toggle(false);});
  openButton.addEventListener('click',()=>toggle());
  centerButton.addEventListener('click',()=>{state.explorePan={x:0,y:0};map.focus({preventScroll:true});});
  // Override ONLY physical roaming restrictions; openChapter() still protects all lesson gates.
  canEnterZone=function(){return true;};
  move=function(dx,dy){state.travel=null;state.player.x=Math.max(0,Math.min(NX-1,state.player.x+dx));state.player.y=Math.max(0,Math.min(NY-1,state.player.y+dy));state.explorePan={x:0,y:0};};
  state.explorePan={x:0,y:0};
  function pan(dx,dy){state.explorePan.x=Math.max(-1800,Math.min(1800,state.explorePan.x+dx));state.explorePan.y=Math.max(-1100,Math.min(1100,state.explorePan.y+dy));}
  document.addEventListener('keydown',ev=>{
    if(isEditing(ev.target)||ev.ctrlKey||ev.metaKey||ev.altKey)return;
    const key=ev.key.toLowerCase();
    if(arrow[key]){
      if(ev.shiftKey){const [dx,dy]=arrow[key];pan(-dx*34-dy*30,-dx*18+dy*18);}
      else {held.add(key);if(!ev.repeat){const [dx,dy]=arrow[key];move(dx*.35,dy*.35);}}
      ev.preventDefault();ev.stopImmediatePropagation();return;
    }
    if(key==='m'){toggle();ev.preventDefault();return;}
    if(key==='f'){state.explorePan={x:0,y:0};map.focus({preventScroll:true});ev.preventDefault();return;}
    if(key==='['||key===']'){const now=nearChapter().i;visit((now+(key===']'?1:19))%20);ev.preventDefault();return;}
    if(key==='e'&&ev.target===map){const near=nearChapter(); if(near.d<6)openChapter(near.i);ev.preventDefault();return;}
    if(key==='escape'&&!nav.hidden){toggle(false);ev.preventDefault();return;}
  },true);
  document.addEventListener('keyup',ev=>{held.delete(ev.key.toLowerCase());},true);
  window.addEventListener('blur',()=>held.clear());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)held.clear();});
  function tick(t){let dt=last?Math.min(.07,(t-last)/1000):0;last=t;
    let dx=0,dy=0;for(const k of held){if(arrow[k]){dx+=arrow[k][0];dy+=arrow[k][1];}}
    if(dx||dy){const norm=Math.hypot(dx,dy);move(dx/norm*5.2*dt,dy/norm*5.2*dt);}
    requestAnimationFrame(tick);
  }requestAnimationFrame(tick);
  // Pointer dragging pans the camera. A stationary click retains existing click-to-visit behaviour.
  map.addEventListener('pointerdown',ev=>{if(ev.button!==0)return;drag={id:ev.pointerId,x:ev.clientX,y:ev.clientY,moved:false};},true);
  map.addEventListener('pointermove',ev=>{
    if(!drag||ev.pointerId!==drag.id)return;
    const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;
    if(Math.hypot(dx,dy)>1){drag.moved=true;pan(dx*W/map.getBoundingClientRect().width,dy*H/map.getBoundingClientRect().height);drag.x=ev.clientX;drag.y=ev.clientY;ev.preventDefault();ev.stopImmediatePropagation();}
  },true);
  map.addEventListener('pointerup',ev=>{if(drag&&drag.id===ev.pointerId){skipClick=drag.moved;drag=null;}},true);
  map.addEventListener('pointercancel',()=>{drag=null;},true);
  map.addEventListener('click',ev=>{if(skipClick){skipClick=false;ev.stopImmediatePropagation();ev.preventDefault();}},true);
  // Onscreen arrows continue moving while held, retaining their original single-click action.
  let buttonHeld=null;
  document.querySelectorAll('[data-move]').forEach(btn=>{
    btn.addEventListener('pointerdown',ev=>{if(ev.pointerType==='mouse'&&ev.button!==0)return;buttonHeld={btn,at:performance.now(),last:performance.now()};});
    btn.addEventListener('pointerup',()=>{buttonHeld=null;});
    btn.addEventListener('pointercancel',()=>{buttonHeld=null;});
  });
  window.addEventListener('pointerup',()=>{buttonHeld=null;});
  function holdButtons(t){if(buttonHeld&&t-buttonHeld.at>180){const v=buttonHeld.btn.dataset.move,ds={up:[-1,0],down:[1,0],left:[0,1],right:[0,-1]}[v];if(ds){let dt=Math.min(.065,(t-buttonHeld.last)/1000);move(ds[0]*5*dt,ds[1]*5*dt);}buttonHeld.last=t;}requestAnimationFrame(holdButtons);}requestAnimationFrame(holdButtons);
  window.researchGardenVisit=visit;
})();
