/* BV-Garden: opt-in avatar choice, local progress export, and Elite Imperial League. */
function openAvatarPicker(){
 const modal=document.getElementById('bv-avatar-dialog');
 if(!modal)return;
 document.getElementById('bv-avatar-first').src=asset('explorer');
 document.getElementById('bv-avatar-second').src=asset('explorer_alt');
 updateSelectedAvatar();
 if(modal.showModal)modal.showModal();else modal.setAttribute('open','');
}
function exportProgressBackup(){
 try{
  const position=JSON.parse(localStorage.getItem('bv-garden-explorer-position-v1')||'null');
  const sound=localStorage.getItem('bv-garden-sound-enabled-v1');
  const record={format:'BV-GARDEN-SAVE',version:2,savedAt:new Date().toISOString(),quest,position,sound};
  const blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'});
  const link=document.createElement('a'),url=URL.createObjectURL(blob);
  link.href=url;link.download='BV-Garden-progress-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
  alert('Progress file exported. To keep a backup by email, attach this file to an email you send yourself. No email account is connected or stored by the game.');
 }catch(error){alert('Could not export progress from this browser: '+error.message);}
}
async function importProgressBackup(file){
 if(!file||file.size>1500000){alert('Choose a BV-Garden save file under 1.5 MB.');return;}
 try{
  const data=JSON.parse(await file.text()),q=data?.quest;
  if(data.format!=='BV-GARDEN-SAVE'||data.version!==2||!q||
    !Array.isArray(q.passed)||q.passed.length!==20||!Array.isArray(q.stars)||q.stars.length!==20||
    !q.used||typeof q.used!=='object'||Array.isArray(q.used)||
    !q.seenPrompts||typeof q.seenPrompts!=='object'||Array.isArray(q.seenPrompts))
    throw Error('The file does not contain a valid BV-Garden game save.');
  if(!confirm('Replace this browser’s current game progress with the selected backup?'))return;
  localStorage.setItem(QUEST_STORAGE,JSON.stringify(q));
  if(data.position&&typeof data.position==='object')localStorage.setItem('bv-garden-explorer-position-v1',JSON.stringify(data.position));
  if(data.sound==='true'||data.sound==='false')localStorage.setItem('bv-garden-sound-enabled-v1',data.sound);
  location.reload();
 }catch(error){alert('Could not restore this backup: '+error.message);}
}
const BV_LEAGUE_TASKS=[
 {type:'Conceptual MCQ',prompt:'Two latent dynamics models explain every passive trajectory but predict opposite collision outcomes under a safe intervention. What most directly distinguishes them?',options:['Choose whichever model has fewer parameters','Execute a bounded, independently measured discriminating intervention','Repeat the original passive dataset','Average their confidence scores and call it ground truth'],correct:1,explanation:'A targeted safe intervention can distinguish observationally equivalent causal hypotheses.'},
 {type:'Mathematics · fill in the blank',prompt:'An independently evaluated controller records zero failures in 59 Bernoulli trials. Estimate the one-sided 95% upper confidence bound on failure probability as a percentage, to one decimal place.',answer:5,explanation:'The exact bound is 100(1 − 0.05^(1/59)) ≈ 5.0%. Zero observed failures never proves zero risk.'},
 {type:'Coding · fill in the blank',prompt:'Complete the JavaScript statement to record a normalized, previously unseen question key: if (!seen.has(key)) { ______; show(question); }',answer:'seen.add(key)',explanation:'Record the stable normalized stem before serving it to avoid duplicates during a browser session.'},
 {type:'Short scientific paragraph',prompt:'In two to four sentences, propose an experiment distinguishing real world-model improvement from self-confirming adaptation. Name an independent evaluation, a frozen baseline and one safety metric.',rubric:'A defensible response identifies held-out intervention outcomes or independent ground truth, a matched frozen baseline with equal data/compute, and explicit risk or constraint-violation measurement under shift.'}
];
function leagueHTML(){
 const league=quest.league||{entered:false,answers:{},reviewed:false},answers=league.answers||{};
 let html='<article class="chapter-article"><div class="chapter-tag">ELITE IMPERIAL LEAGUE</div><h4>Independent scientific reasoning</h4><p class="lede">Unlocked after five separately qualifying Imperial Scholar journeys OR five Stellas across advanced Houses 21–25. Complete conceptual, mathematical, coding and short written exercises. The written answer is self-reviewed against a disclosed rubric; this offline game cannot certify scientific mastery.</p>';
 BV_LEAGUE_TASKS.forEach((task,i)=>{
  html+='<section class="bv-league-task"><h5>'+String(i+1).padStart(2,'0')+' · '+qEsc(task.type)+'</h5><p>'+qEsc(task.prompt)+'</p>';
  if(i===0)html+=task.options.map((option,j)=>'<label><input name="bv-league-mcq" type="radio" value="'+j+'" '+(answers.mcq===j?'checked':'')+'> '+qEsc(option)+'</label>').join('');
  if(i===1)html+='<label for="bv-league-math">Answer as a percentage</label><input id="bv-league-math" inputmode="decimal" autocomplete="off" value="'+qEsc(answers.math||'')+'">';
  if(i===2)html+='<label for="bv-league-code">One JavaScript statement</label><input id="bv-league-code" spellcheck="false" autocomplete="off" value="'+qEsc(answers.code||'')+'">';
  if(i===3)html+='<label for="bv-league-written">Your reasoning</label><textarea id="bv-league-written" maxlength="1200" placeholder="Describe the experimental comparison…">'+qEsc(answers.written||'')+'</textarea>';
  html+='</section>';
 });
 html+='<button type="button" class="action-button" data-league-review>Check answers and review rubric →</button>';
 if(league.reviewed)html+='<div class="quest-notice"><strong>'+qEsc(league.feedback||'')+'</strong><p>'+qEsc(BV_LEAGUE_TASKS[0].explanation)+'</p><p>'+qEsc(BV_LEAGUE_TASKS[1].explanation)+'</p><p>'+qEsc(BV_LEAGUE_TASKS[2].explanation)+'</p><p><strong>Writing rubric:</strong> '+qEsc(BV_LEAGUE_TASKS[3].rubric)+'</p></div>';
 html+='<button type="button" class="action-button" data-chapter="20">Return to Imperial record →</button></article>';
 return html;
}
function showLeague(){
 if(!quest.eliteUnlocked)return;
 quest.league.entered=true;storeQuest();
 const pane=document.getElementById('journal-content');
 if(pane){pane.innerHTML=leagueHTML();pane.scrollTop=0;}
}
document.addEventListener('click',event=>{
 const t=event.target;
 if(t.closest('#bv-avatar-toggle')){openAvatarPicker();return;}
 if(t.closest('[data-avatar-close]')){document.getElementById('bv-avatar-dialog')?.close();return;}
 const choice=t.closest('[data-avatar-choice]');
 if(choice){
  quest.avatarChoice=Number(choice.dataset.avatarChoice)===1?1:0;
  storeQuest();updateSelectedAvatar();
  document.getElementById('bv-avatar-dialog')?.close();
  return;
 }
 if(t.closest('[data-new-journey]')){
  if(confirm('Start another journey? Previously earned Imperial wins, chosen avatar and question history will be preserved.'))restartJourney(false);
  return;
 }
 if(t.closest('[data-save-backup]')){exportProgressBackup();return;}
 if(t.closest('[data-restore-backup]')){document.getElementById('bv-backup-file')?.click();return;}
 if(t.closest('[data-league-enter]')){showLeague();return;}
 if(t.closest('[data-league-review]')){
  const selected=document.querySelector('input[name="bv-league-mcq"]:checked');
  const answers=quest.league.answers;
  answers.mcq=selected?Number(selected.value):null;
  answers.math=document.getElementById('bv-league-math')?.value.trim()||'';
  answers.code=document.getElementById('bv-league-code')?.value.trim()||'';
  answers.written=document.getElementById('bv-league-written')?.value.trim()||'';
  const objective=[
    answers.mcq===1,
    Number.isFinite(Number(answers.math))&&Math.abs(Number(answers.math)-5.0)<=0.1,
    /^seen\.add\(key\);?$/.test(answers.code.replace(/\s+/g,''))
  ];
  quest.league.reviewed=true;
  quest.league.feedback=objective.filter(Boolean).length+'/3 objectively graded answers correct. The paragraph is not automatically graded; compare with the disclosed rubric.';
  storeQuest();showLeague();return;
 }
});
document.addEventListener('change',event=>{
 if(event.target?.id==='bv-backup-file')importProgressBackup(event.target.files?.[0]);
});
updateSelectedAvatar();
