/* Small hand-authored pixel-shaded chibi fan sprites for five distinct canon characters.
   These are illustrative interpretations, not official anime imagery. */
function bvAdvancedSprite(v){
 const px=(x,y,w,h,c)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>';
 const skin='#efc8a5',skinShade='#d7a884',outline='#25303b';
 let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 88" shape-rendering="crispEdges">';
 s+='<ellipse cx="32" cy="81" rx="19" ry="4" fill="#67867b" opacity=".28"/>';
 s+=px(18,70,11,8,'#2d343c')+px(36,70,11,8,'#2d343c')+px(18,76,12,5,outline)+px(35,76,12,5,outline);
 s+=px(20,56,10,16,v.pants||'#333844')+px(35,56,10,16,v.pants||'#333844');
 s+=px(16,38,32,23,outline)+px(18,40,28,19,v.coat||'#2c3644');
 s+=px(20,40,4,19,v.shade||'#18212b')+px(40,41,5,17,v.shade||'#18212b');
 s+=px(9,42,7,18,outline)+px(10,43,6,15,v.coat||'#2c3644')+px(48,42,7,18,outline)+px(49,43,5,15,v.coat||'#2c3644');
 s+=px(10,59,6,7,skinShade)+px(49,59,5,7,skin);
 s+=px(29,37,7,5,skinShade);
 s+=px(17,15,30,26,outline)+px(19,17,26,22,skin);
 s+=px(18,31,4,5,skinShade)+px(41,29,4,5,skinShade);
 s+=px(23,28,4,3,outline)+px(37,28,4,3,outline)+px(25,27,2,1,'#f8f8f5')+px(39,27,2,1,'#f8f8f5');
 s+=px(31,33,3,2,'#b77b75')+px(30,36,6,1,'#bd8f8d');
 s+=px(17,14,31,8,v.hair||'#43372e')+px(18,20,6,8,v.hair||'#43372e')+px(41,20,7,8,v.hair||'#43372e');
 s+=px(22,14,18,3,v.highlight||'#7b6754');
 if(v.school){s+=px(30,43,5,16,'#ddd5ae')+px(29,46,7,2,'#d6b26d')+px(20,59,9,8,'#1a232d')+px(36,59,9,8,'#1a232d')+px(20,67,9,5,'#f3f1e9')+px(36,67,9,5,'#f3f1e9');}
 if(v.glasses){s+=px(21,25,11,9,'#313740')+px(33,25,11,9,'#313740')+px(23,26,8,6,'#c4dbe0')+px(35,26,8,6,'#c4dbe0')+px(31,28,3,2,'#313740')+px(24,27,3,2,outline)+px(38,27,3,2,outline);}
 if(v.tie)s+=px(29,41,7,13,v.tie)+px(30,54,5,5,v.tie);
 if(v.hat){s+=px(14,12,37,6,'#bca87d')+px(20,4,26,11,'#dac798')+px(21,11,24,3,'#30303e')+px(12,16,41,4,'#b2a07a');}
 if(v.longHair){s+=px(12,19,8,34,v.hair)+px(44,19,8,34,v.hair)+px(17,15,30,7,v.hair)+px(20,18,7,8,v.highlight||v.hair);}
 if(v.jacketTrim){s+=px(19,39,5,16,v.jacketTrim)+px(40,39,5,16,v.jacketTrim);}
 if(v.bulk){s+=px(6,42,4,14,v.shade||'#222')+px(54,42,4,14,v.shade||'#222');}
 s+='</svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
}
const BV_ADVANCED_SPRITES=[
 bvAdvancedSprite({hair:'#222730',highlight:'#4d5562',coat:'#222a34',shade:'#11171e',school:true}),
 bvAdvancedSprite({hair:'#705139',highlight:'#a48362',coat:'#303640',shade:'#1c2127',school:true,glasses:true,bulk:true}),
 bvAdvancedSprite({hair:'#684632',highlight:'#b19072',coat:'#1f2939',shade:'#131a28',hat:true,jacketTrim:'#455a70'}),
 bvAdvancedSprite({hair:'#8c9696',highlight:'#c5c9c5',coat:'#48515e',shade:'#303744',glasses:true,tie:'#2a7b79'}),
 bvAdvancedSprite({hair:'#d4aa68',highlight:'#ffe0a2',coat:'#e9e9da',shade:'#b9b9af',glasses:true,longHair:true,jacketTrim:'#9d3f4d'})
];
