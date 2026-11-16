#!/usr/bin/env node
// Dependency-free static audit. It is not a browser/device integration test.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const test = (label, ok) => { assert.ok(ok, label); console.log("PASS " + label); };
test("HTML5 document", /^\s*<!doctype html>/i.test(html));
test("Viewport metadata", /<meta\s+name=["']viewport["']/i.test(html));
test("Canvas world", /<canvas\b[^>]*\bid=["']world["']/i.test(html));
test("Game save storage", html.includes("latent-atlas-research-quest-v1"));
test("Explorer save storage", html.includes("bv-garden-explorer-position-v1"));
test("Sound preference storage", html.includes("bv-garden-sound-enabled-v1"));
test("Ten bolt restart", html.includes("if(quest.bolts>=10){restartForBolts();return;}"));
test("Unfinished quiz restore", html.includes("if(quest.active){openChapter("));
test("Stella audio trigger", html.includes("playSound('stella')"));
test("Tonitrus audio trigger", html.includes("playSound('fail')"));

const cast = html.match(/const IDS=\[([^\]]+)\]/);
assert.ok(cast, "Character IDs found");
const ids = [...cast[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
test("20 unique chapter cast IDs", ids.length === 20 && new Set(ids).size === 20);

test("Original twenty character placements use all five new canon guides", 
  ids[0]==="george"&&ids[1]==="bill"&&ids[4]==="daybreak"&&
  ids[18]==="matthew"&&ids[19]==="olka");
const advIds=(html.match(/const BV_ADVANCED_IDS=\[([^\]]+)\]/)||[])[1];
assert.ok(advIds,"Advanced companion list found");
const advancedCast=[...advIds.matchAll(/'([^']+)'/g)].map(m=>m[1]);
test("Advanced Houses 21–25 retain the original Anya Bond Damian Yor Loid portraits",
  JSON.stringify(advancedCast)===JSON.stringify(["anya","bond","damian","yor","loid"]));
test("All twenty-five chapter companions are distinct",new Set([...ids,...advancedCast]).size===25);
const fiveAtlas=html.match(/const BV_CAST_ATLAS='data:image\/png;base64,([A-Za-z0-9+/=]+)'/);
assert.ok(fiveAtlas,"Embedded five-character PNG atlas found");
const fivePng=Buffer.from(fiveAtlas[1],"base64");
test("Five full-length canon sprite images have correct dimensions and PNG signature",
  fivePng.length>12000&&fivePng.toString("ascii",1,4)==="PNG"&&
  fivePng.readUInt32BE(16)===480&&fivePng.readUInt32BE(20)===152&&
  html.includes("const BV_CAST_STRIDE=96;")&&html.includes("const BV_CAST_HEIGHT=152;"));
test("All twenty-five house companions render on one original canvas with clear spacing",
 html.includes("NX=58,NY=58")&&
 html.includes("const BV_ADVANCED_PREVIEW_SITES=[[29,48],[32.75,44.25],[36.5,40.5],[40.25,36.75],[44,33]]")&&
 html.includes("bvAdvancedPreviewAddObjects(objects)")&&
 html.includes("bvAdvancedPreviewOccupied(x,y)"));
test("Single horizontal separator uses transparent user-supplied pixel spiked ball",
 html.includes("const BV_SPIKED_BALL='data:image/png;base64,")&&
 html.includes("function bvAdvancedPreviewGate()")&&
 html.includes("for(let x=11;x<=55;x+=0.75)")&&
 html.includes("ctx.drawImage(BV_SPIKED_IMG")&&
 !html.includes("bvAdvancedPreviewHalo(")&&!html.includes("bvAdvancedPreviewPath();")&&
 !html.includes("SEALED GATE"));
test("Small advanced preview button displays actual spiked ball, not lightning emoji",
 html.includes('class="bv-adv-peek-icon"')&&
 html.includes("bvPeekIcon.style.backgroundImage")&&
 !html.includes("⚡ 21–25"));
test("Advanced houses remain inspectable while challenge gates stay locked",
 html.includes("function bvAdvancedPreviewSelect(i)")&&
 html.includes("function bvAdvancedPreviewRibbon()")&&
 html.includes("data-bv-advanced-preview")&&
 html.includes("data-bv-preview-focus")&&
 html.includes("bvAdvancedPreviewSelect(h.index)")&&
 html.includes("bvAdvancedShowWorld=function(){bvAdvancedPreviewFocus();}"));
test("Advanced terrain traversal stays locked until ordinary final exam passes",
 html.includes("const bvAdvancedPreviewZone=(x,y)=>x+y>=67")&&
 html.includes("bvAdvancedPreviewZone(x,y)")&&
 html.includes("bvAdvancedAllowed())")&&
 html.includes("bvAdvancedPreviewOccupied(x,y)"));


// Verify the research reading of every original chapter against its exact topic.
const chapterReadingSource=readFileSync(resolve(root,"src/scripts/01-curriculum.js"),"utf8");
const chapterReadingRows=JSON.parse(new Script(chapterReadingSource+String.fromCharCode(10)+'JSON.stringify(CONTENT.map(row=>({name:row[0],title:row[7],url:row[8]})))').runInNewContext({}, {timeout:5000}));
const expectedChapterReadings=[["AI Origins","https://ai.dartmouth.edu/our-story"],["Logic & Data","https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/"],["Python & Algorithms","https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/"],["Mathematics","https://mml-book.github.io/"],["Optimization","https://web.stanford.edu/~boyd/cvxbook/"],["Machine Learning","https://see.stanford.edu/Course/CS229"],["Deep Learning","https://arxiv.org/abs/1706.03762"],["Self-Supervision","https://proceedings.mlr.press/v119/chen20j.html"],["Representations","https://doi.org/10.1109/TPAMI.2013.50"],["Energy Models","https://cs.nyu.edu/~yann/2010f-G22-2565-001/diglib/lecun-06.pdf"],["Predictive Embeddings","https://openaccess.thecvf.com/content/CVPR2023/html/Assran_Self-Supervised_Learning_From_Images_With_a_Joint-Embedding_Predictive_Architecture_CVPR_2023_paper.html"],["Dynamics & State","https://web.stanford.edu/class/cs234/modules.html"],["World Models","https://www.nature.com/articles/s41586-025-08744-2"],["Model Predictive Control","https://proceedings.iclr.cc/paper_files/paper/2024/hash/cf73d57b6dcda32b293df7c2d5341f49-Abstract-Conference.html"],["Search & MCTD","https://proceedings.mlr.press/v267/yoon25a.html"],["Object & Skill Models","https://proceedings.iclr.cc/paper_files/paper/2025/hash/ae82a60c5ce50b5c4d18cfe3214eb684-Abstract-Conference.html"],["Embodied Learning","https://proceedings.mlr.press/v270/kim25c.html"],["Safety & Shift","https://proceedings.neurips.cc/paper/2019/hash/8558cb408c1d76621371888657d2eb1d-Abstract.html"],["Physical Reasoning","https://proceedings.mlr.press/v306/feng26aa.html"],["Continual & Lifelong Learning","https://www.nature.com/articles/s42256-025-00983-2"]];
test("All 20 original chapters have verified, topic-matched, distinct reading destinations",
  chapterReadingRows.length===20 && chapterReadingRows.every((r,i)=>r.name===expectedChapterReadings[i][0]&&r.url===expectedChapterReadings[i][1]&&r.title.length>10) &&
  new Set(chapterReadingRows.map(r=>r.url)).size===20);

const sounds = [...html.matchAll(/\b(stella|fail):'data:audio\/mpeg;base64,([A-Za-z0-9+/=]+)'/g)];
test("Two embedded MP3 clips", sounds.length === 2 && new Set(sounds.map(s => s[1])).size === 2);
for (const [, name, data] of sounds) {
  const bytes = Buffer.from(data, "base64");
  test("MP3 signature for " + name, bytes.length > 1000 &&
      ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) ||
      (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)));
}
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
  .filter(([, attributes]) => !/\bsrc\s*=/.test(attributes) && !/\btype\s*=\s*["']application\/json/.test(attributes));
test("At least two embedded script blocks", scripts.length >= 2);
scripts.forEach(([, , code], index) => new Script(code, { filename: "inline-" + index + ".js" }));
console.log("PASS embedded script syntax: " + scripts.length + " scripts");
test("20 LaTeX chapter formulations", (html.match(/String\.raw`/g) || []).length === 20);
test("Native MathML formulations are present", html.includes("const BV_MATHML=[") && html.includes("chapterEquation(i)"));
test("Current chapter displays typeset mathematics", html.includes("${chapterEquation(i)}"));
test("Current BV-Garden name", html.includes("BV <strong>GARDEN</strong>"));
test("Dartmouth source corrected", html.includes("https://ai.dartmouth.edu/our-story") && !html.includes("www.dartmouth.edu/~ai50/homepage"));
test("LeCun tutorial uses NYU-hosted PDF", html.includes("cs.nyu.edu/~yann/2010f-G22-2565-001/diglib/lecun-06.pdf"));
test("MPC chapter links to actual TD-MPC2 paper", html.includes("cf73d57b6dcda32b293df7c2d5341f49-Abstract-Conference.html") && !html.includes("v235/hansen24a.html"));
test("Legacy learning paper and controls preserved", html.includes("Monte Carlo Tree Diffusion") && html.includes("bv-garden-explorer-position-v1"));


// Verify every authored stem and exact-answer structure from the real game bank.
const bankStart = html.indexOf("const Q=(t,a,b,why)");
const bankEnd = html.indexOf("/* RESEARCH GARDEN QUEST ENGINE", bankStart);
test("Question-bank source is discoverable", bankStart > 0 && bankEnd > bankStart);
const bankCode = html.slice(bankStart, bankEnd);
const bankData = JSON.parse(new Script(bankCode +
  "\nJSON.stringify({chapters:CHALLENGE_BANK,exam:IMPERIAL_BANK,adv:BV_ADVANCED_BANK,advChapters:BV_ADVANCED_CHAPTERS})").runInNewContext({}, {timeout:5000}));

const expectedAdvancedReadings=["https://arxiv.org/abs/2210.03629","https://proceedings.neurips.cc/paper_files/paper/2023/hash/d842425e4bf79ba039352da0f658a906-Abstract-Conference.html","https://proceedings.neurips.cc/paper_files/paper/2023/hash/a85b405ed65c6477a4fe8302b5e06ce7-Abstract-Conference.html","https://proceedings.iclr.cc/paper_files/paper/2025/hash/85381f4549b5ddf1d48e2e287d7d3d15-Abstract-Conference.html","https://proceedings.mlr.press/v258/li25g.html","https://proceedings.mlr.press/v306/dong26a.html","https://proceedings.mlr.press/v235/zhou24f.html","https://proceedings.neurips.cc/paper_files/paper/2024/hash/439539557e9ba0d04055773ff1f3241c-Abstract-Datasets_and_Benchmarks_Track.html","https://proceedings.mlr.press/v274/luketina25a.html","https://proceedings.iclr.cc/paper_files/paper/2024/hash/f3549ef9b5ff520a7e41ff3cc306ab2b-Abstract-Conference.html","https://proceedings.mlr.press/v270/hu25a.html","https://proceedings.mlr.press/v270/dixit25a.html","https://proceedings.iclr.cc/paper_files/paper/2025/hash/36b7acf6f6010652b3f2a433774a66fe-Abstract-Conference.html","https://arxiv.org/abs/2505.22954","https://www.nature.com/articles/s41586-026-10265-5"];
const actualAdvancedReadings=bankData.advChapters.flatMap(ch=>ch.papers.map(p=>p[1]));
test("All 15 advanced-house research-paper destinations match verified primary records",
  actualAdvancedReadings.length===15&&actualAdvancedReadings.every((u,i)=>u===expectedAdvancedReadings[i])&&
  new Set(actualAdvancedReadings).size===15&&bankData.advChapters.every(ch=>ch.papers.length===3));

test("20 distinct research levels", bankData.chapters.length === 20);
const normalizeStem = t=>String(t).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();
const stems = new Map();
let chapterTotal=0,examTotal=0;
function validateQuestion(q, label, level) {
  const stem=normalizeStem(q.t);
  test(label+" has a unique, nonempty stem", stem.length > 15 && !stems.has(stem));
  stems.set(stem,label);
  test(label+" includes an answer explanation", typeof q.why === "string" && q.why.length >= 25);
  test(label+" correct answer count", q.a.length === ((level < 5 || label.startsWith("imperial/e/")) ? 1 : 2));
  test(label+" includes plausible wrong options", q.b.length >= 2);
  const options=[...q.a,...q.b].map(t=>String(t).normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim());
  test(label+" has unique answer options", options.every(Boolean) && new Set(options).size===options.length);
}
for (const [i, chapter] of bankData.chapters.entries()) {
  test("Level "+(i+1)+" tier sizes", chapter.e.length>=5 && chapter.m.length>=5 &&
    chapter.h.length>=10);
  for (const tier of ["e","m","h"]) for (const [j,question] of chapter[tier].entries()) {
    validateQuestion(question,"chapter "+(i+1)+"/"+tier+"/"+j,i);
    chapterTotal++;
  }
}
for (const tier of ["e","m","h"]) for (const [j,q] of bankData.exam[tier].entries()) {
  validateQuestion(q,"imperial/"+tier+"/"+j,20);
  examTotal++;
}
test("430 chapter questions including LM and generative AI", chapterTotal === 430);
test("Five different advanced guides",bankData.advChapters.length===5&&new Set(bankData.advChapters.map(x=>x.guide)).size===5&&
  bankData.advChapters.every(x=>x.intro.length>100&&x.experiment.length>100&&x.papers.length>=3));
test("25 distinct chapters with advanced RSI and verified conference research links",
  new Set(bankData.advChapters.map(x=>x.name)).size===5&&
  bankData.advChapters[4].name.includes("Recursive Improvement")&&
  bankData.advChapters[4].intro.includes("RSI")&&
  bankData.advChapters.every(x=>x.papers.length===3&&
    new Set(x.papers.map(p=>p[1])).size===3&&x.papers.every(p=>/^https:\/\//.test(p[1])))&&
  new Set(bankData.advChapters.flatMap(x=>x.papers.map(p=>p[1]))).size===15);
test("160 advanced MCQs in exactly 5 houses",bankData.adv.length===5&&
  bankData.adv.every(b=>b.e.length===8&&b.m.length===8&&b.h.length===16));
for(const [i,b] of bankData.adv.entries()){
 for(const tier of ["e","m","h"])for(const [j,q] of b[tier].entries()){
   const name="advanced "+(i+21)+"/"+tier+"/"+j,stem=normalizeStem(q.t);
   test(name+" unique stem",stem.length>40&&!stems.has(stem));
   stems.set(stem,name);
   test(name+" single or double correct answers",q.a.length===(tier==='h'?2:1));
   test(name+" independent explanation",typeof q.why==='string'&&q.why.length>60);
   const options=[...q.a,...q.b].map(x=>String(x).toLowerCase().trim());
   test(name+" distinct options",q.b.length>=3&&new Set(options).size===options.length);
 }
}
test("Advanced five-Bolt reset is separate from original ten-Bolt reset",
  html.includes("if(adv.bolts>=5){bvAdvancedReset();return;}") &&
  html.includes("quest.advanced=reset")&&html.includes("data-bv-advanced-enter") &&
  html.includes("function bvAdvancedHydrate()"));
test("Existing final examination open after finishing 20 gates",
  html.includes("if(kind==='exam'&&state.current!==20)return;"));
test("Advanced elite qualification accepts either route",
  html.includes("quest.imperialWins>=5||quest.advanced.completedRecord")&&
  html.includes("if(adv.stars.every(Boolean)){adv.completedRecord=true;quest.eliteUnlocked=true;}"));
console.log("PASS authored bank: "+chapterTotal+" chapter MCQs + "+examTotal+
  " final examination MCQs, all unique normalized stems");
test("Five full journeys have nonrepeating, globally unique stems",
  bankData.chapters.every(ch=>ch.e.length>=5&&ch.m.length>=5&&ch.h.length>=10) &&
  bankData.exam.e.length>=10 && bankData.exam.m.length>=15 && bankData.exam.h.length>=25);
test("Global no-repeat uses normalized stem history",
  html.includes("quest.seenPrompts[questionFingerprint(source.t)]=true") &&
  html.includes("const unseenQuest=") &&
  html.includes("quest.seenPrompts=previous.seenPrompts"));
test("Imperial examination has 50 independently authored items",examTotal === 50);
test("Existing question IDs survive appending advanced bank",
  html.includes("CHALLENGE_BANK[i][tier].push(...RESEARCH_QUESTIONS[i][tier])"));

// Unit-test migration and sampling through the actual question functions.
const coreStart = html.indexOf("const questionId=(kind,level,d,i)=>");
const coreEnd = html.indexOf("function beginQuest(", coreStart);
test("Global picker source is discoverable",coreStart>bankEnd&&coreEnd>coreStart);
const simulation=bankCode+"\n"+
  "let quest={used:{'stage:0:e:0':true},seenPrompts:{}};\n"+
  "const questionsFor=(kind,level,d)=>kind==='exam'?IMPERIAL_BANK[d]:CHALLENGE_BANK[level][d];\n"+
  "const shuffleQuest=xs=>xs.slice();\n"+
  html.slice(coreStart,coreEnd)+"\n"+
  "const previous=questionFingerprint(CHALLENGE_BANK[0].e[0].t);\n"+
  "if(!quest.seenPrompts[previous])throw Error('Historical stem not migrated');\n"+
  "const selected=[];for(let j=0;j<20;j++){const q=pickQuestQuestion('stage',0,'e');if(!q)break;selected.push(questionFingerprint(CHALLENGE_BANK[0].e[q.index].t));}\n"+
  "if(selected.length!==CHALLENGE_BANK[0].e.length-1||new Set(selected).size!==selected.length||selected.includes(previous))throw Error('Question reused or skipped');\n"+
  "if(hasQuestions('stage',0))throw Error('Exhausted tier should block new 4-question trial');\n"+
  "JSON.stringify({historical:previous,selected:selected.length});";
const simulated = JSON.parse(new Script(simulation).runInNewContext({}, {timeout:5000}));
test("Question selection migrates saved history and never repeats",
  simulated.historical.length>15 && simulated.selected===4);

// Check the four structured teaching sections in all 20 chapters.
const guideStart=html.indexOf("const RESEARCH_PRIMERS=[");
const guideEnd=html.indexOf("if(RESEARCH_PRIMERS.length!==20",guideStart);
test("Research primer source is discoverable",guideStart>0&&guideEnd>guideStart);
const guides=JSON.parse(new Script(html.slice(guideStart,guideEnd)+
  "\nJSON.stringify(RESEARCH_PRIMERS)").runInNewContext({}, {timeout:5000}));
test("Every level has four substantive lesson components",
  guides.length===20 && guides.every(g=>g.length===4&&g.every(p=>p.length>=90)));
test("Redundant map legend removed",
  !html.includes('<div class="world-legend">'));
test("Prerequisite notice shown above research game",
  html.includes("THE CENTRAL QUESTION") && html.includes("Can machines learn how the world works—and use that knowledge to predict, reason, and act?") && html.includes("Some familiarity with Levels 1–3") && html.includes("Full teaching from scratch for beginners is planned for a future version."));


test("Avatar selector exposes two picture-only options",
  html.includes("id=\"bv-avatar-first\"") && html.includes("id=\"bv-avatar-second\"") &&
  html.includes("id=\"bv-avatar-toggle\"") && html.includes("data-avatar-choice=\"0\"") &&
  html.includes("data-avatar-choice=\"1\""));
test("Original sprite remains available",
  html.includes('"explorer":"data:image/png;base64,'));
const alternate=html.match(/const BV_AVATAR_OPTION_2="data:image\/png;base64,([A-Za-z0-9+/=]+)";/);
test("Matching alternate pixel PNG is embedded",Boolean(alternate));
if(alternate){
 const bytes=Buffer.from(alternate[1],"base64");
 test("Alternate avatar uses original 90×102 sprite dimensions",bytes.toString("ascii",1,4)==="PNG" &&
   bytes.readUInt32BE(16)===90 && bytes.readUInt32BE(20)===102);
}
test("Imperial exam separates passing and advanced scholarship",
  html.includes("const passed=correct>=7;") &&
  html.includes("medium>=2&&hard>=4") &&
  html.includes("quest.stars.every(Boolean)") &&
  html.includes("if(passed&&!quest.journeyPassed)") &&
  html.includes("if(imperial&&!quest.imperialThisJourney)"));
test("Five Imperial wins unlock a distinct League",
  html.includes("quest.eliteUnlocked=quest.imperialWins>=5") &&
  html.includes("const BV_LEAGUE_TASKS=[") &&
  html.includes("data-league-review") &&
  html.includes("data-league-enter"));
test("Offline email backup is described without claiming account login",
  html.includes("exportProgressBackup()") &&
  html.includes("importProgressBackup(file)") &&
  html.includes("does not connect to an email account"));

console.log("Static verification complete; separately test runtime and browser behavior.");
