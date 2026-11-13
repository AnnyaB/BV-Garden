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
  "\nJSON.stringify({chapters:CHALLENGE_BANK,exam:IMPERIAL_BANK})").runInNewContext({}, {timeout:5000}));
test("20 distinct research levels", bankData.chapters.length === 20);
const normalizeStem = t=>String(t).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();
const stems = new Map();
let chapterTotal=0,examTotal=0;
function validateQuestion(q, label, level) {
  const stem=normalizeStem(q.t);
  test(label+" has a unique, nonempty stem", stem.length > 15 && !stems.has(stem));
  stems.set(stem,label);
  test(label+" includes an answer explanation", typeof q.why === "string" && q.why.length >= 25);
  test(label+" correct answer count", q.a.length === (level < 5 ? 1 : 2));
  test(label+" includes plausible wrong options", q.b.length >= 2);
  const options=[...q.a,...q.b].map(normalizeStem);
  test(label+" has unique answer options", options.every(Boolean) && new Set(options).size===options.length);
}
for (const [i, chapter] of bankData.chapters.entries()) {
  test("Level "+(i+1)+" tier sizes", chapter.e.length>=4 && chapter.m.length>=5 &&
    chapter.h.length>=(i===19?15:9));
  for (const tier of ["e","m","h"]) for (const [j,question] of chapter[tier].entries()) {
    validateQuestion(question,"chapter "+(i+1)+"/"+tier+"/"+j,i);
    chapterTotal++;
  }
}
for (const tier of ["e","m","h"]) for (const [j,q] of bankData.exam[tier].entries()) {
  validateQuestion(q,"imperial/"+tier+"/"+j,20);
  examTotal++;
}
test("367 chapter questions", chapterTotal === 367);
console.log("PASS authored bank: "+chapterTotal+" chapter MCQs + "+examTotal+
  " final examination MCQs, all unique normalized stems");
test("Global no-repeat uses normalized stem history",
  html.includes("quest.seenPrompts[questionFingerprint(source.t)]=true") &&
  html.includes("const unseenQuest=") &&
  (html.match(/quest.seenPrompts=seenHistory/g)||[]).length===2);
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
  simulated.historical.length>15 && simulated.selected===3);

// Check the four structured teaching sections in all 20 chapters.
const guideStart=html.indexOf("const RESEARCH_PRIMERS=[");
const guideEnd=html.indexOf("if(RESEARCH_PRIMERS.length!==20",guideStart);
test("Research primer source is discoverable",guideStart>0&&guideEnd>guideStart);
const guides=JSON.parse(new Script(html.slice(guideStart,guideEnd)+
  "\nJSON.stringify(RESEARCH_PRIMERS)").runInNewContext({}, {timeout:5000}));
test("Every level has four substantive lesson components",
  guides.length===20 && guides.every(g=>g.length===4&&g.every(p=>p.length>=170)));
test("Redundant map legend removed",
  !html.includes('<div class="world-legend">'));
test("Prerequisite notice shown above research game",
  html.includes("STARTING POINT · PYTHON, ALGEBRA & PROBABILITY"));

console.log("Static verification complete; separately test runtime and browser behavior.");
