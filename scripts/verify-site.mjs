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
console.log("Static verification complete; separately test runtime and browser behavior.");
