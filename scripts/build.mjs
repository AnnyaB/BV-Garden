#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(root,p),"utf8");
const parts=[
["@@BV_STYLE_MAIN@@",["src/styles/main.css"]],
["@@BV_STYLE_RESPONSIVE@@",["src/styles/responsive.css","src/styles/advanced.css"]],
["@@BV_SCRIPT_MAIN@@",["src/scripts/01-curriculum.js","src/assets/embedded-sprites.js","src/assets/avatar-variants.js","src/scripts/02-world.js","src/assets/five-canon-portraits.js","src/quiz/chapter-bank.js","src/advanced/llm-chapter-extension.js","src/quiz/imperial-bank.js","src/advanced/advanced-bank.js","src/advanced/advanced-art.js","src/assets/spiked-ball.js","src/advanced/advanced-garden.js","src/quiz/quest-engine.js","src/lessons/primers.js","src/scripts/03-interactions.js","src/scripts/05-features.js","src/advanced/advanced-engine.js","src/advanced/advanced-preview.js"]],
["@@BV_SCRIPT_PERSISTENCE@@",["src/scripts/04-persistence-audio.js"]]
];
let html=read("src/index.template.html");
for(const [marker,paths] of parts){
 if(html.split(marker).length!==2)throw Error("Missing or duplicate placeholder: "+marker);
 html=html.replace(marker,()=>paths.map(read).join(""));
}
if(/@@BV_(STYLE|SCRIPT)_/.test(html))throw Error("Unresolved placeholder");
const hash=createHash("sha256").update(html,"utf8").digest("hex");
if(process.argv.includes("--check")){
 if(read("index.html")!==html){console.error("FAIL: index.html differs from exact source build");process.exitCode=1;}
 else console.log("PASS byte-identical standalone game: "+hash);
}else{
 writeFileSync(resolve(root,"index.html"),html,"utf8");console.log("Built "+hash);
}
