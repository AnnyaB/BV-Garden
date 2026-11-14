#!/usr/bin/env node
/* Browser-only evidence of the real BV-Garden standalone game.
   This test neither alters user saves nor bypasses challenge gates. */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1600,height:980},deviceScaleFactor:1});
 page.on('pageerror',error=>errors.push(String(error)));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'load',timeout:45000});
 await page.waitForFunction(()=>typeof BV_ADVANCED_PREVIEW_HOUSES!=='undefined'&&
   BV_ADVANCED_PREVIEW_HOUSES.length===5&&typeof bvAdvancedPreviewGate==='function',{timeout:20000});
 await page.waitForTimeout(1100);
 const original=await page.evaluate(()=>({
   main:IDS.slice(),advanced:BV_ADVANCED_PREVIEW_HOUSES.map(ch=>({index:ch.index,id:ch.id})),
   examQualified:bvAdvancedAllowed(),progress:state.current,worldSize:[NX,NY],
   complete:!!document.querySelector('#world'),
   previewControl:!!document.querySelector('[data-bv-preview-focus]')
 }));
 assert.equal(original.main.length,20);
 assert.deepEqual(original.advanced.map(ch=>ch.id),['anya','bond','damian','yor','loid']);
 assert.deepEqual(original.advanced.map(ch=>ch.index),[20,21,22,23,24]);
 assert.equal(original.examQualified,false);
 assert.equal(original.progress,0);
 assert.deepEqual(original.worldSize,[58,58]);
 mkdirSync('artifacts',{recursive:true});
 await page.locator('#explore').scrollIntoViewIfNeeded();
 await page.waitForTimeout(600);
 await page.locator('.game-layout').screenshot({path:'artifacts/main-garden-browser.jpeg',type:'jpeg',quality:80});
 // Spectatorship must not give away advanced research lessons or awards.
 await page.locator('button[data-bv-advanced-preview="0"]').click();
 await page.waitForTimeout(2600);
 const after=await page.evaluate(()=>({
   qualified:bvAdvancedAllowed(),
   selected:(document.getElementById('journal-content')?.textContent||'').slice(0,800),
   advancedUnlocked:quest.advanced.stars.some(Boolean),
   viewCameraPan:state.explorePan
 }));
 assert.equal(after.qualified,false);
 assert.match(after.selected,/ADVANCED CHAPTER · LOCKED/);
 assert.equal(after.advancedUnlocked,false);
 assert.ok(Number.isFinite(after.viewCameraPan?.x));
 await page.locator('#explore').scrollIntoViewIfNeeded();
 await page.waitForTimeout(2100);
 const shot=await page.locator('.game-layout').screenshot({path:'artifacts/advanced-locked-browser.jpeg',type:'jpeg',quality:75});
 assert.equal(errors.length,0,'Browser errors: '+errors.join(' | '));
 console.log('PASS: Chromium rendered the actual feature-branch 25-house game');
 console.log('PASS: Main cast 20, extra cast 5 with Anya Bond Damian Yor Loid');
 console.log('PASS: Unqualified player can view the advanced world but not enter lessons');
 console.log('PASS: No JavaScript page exceptions');
 console.log('SCREENSHOT_AVAILABLE: artifacts/advanced-locked-browser.jpeg');
 // Log in small chunks so an authorized reviewer can reconstruct and display
 // the exact Chromium screenshot from the CI job without another deployment.
 const b64=Buffer.from(shot).toString('base64');
 console.log('BV_ADV_BROWSER_JPEG_START');
 for(let pos=0;pos<b64.length;pos+=6000)console.log('BV_ADV_BROWSER_JPEG_CHUNK:'+b64.slice(pos,pos+6000));
 console.log('BV_ADV_BROWSER_JPEG_END');
}finally{await browser.close();}
