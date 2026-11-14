/* Retain the EXACT original character PNG artwork for advanced Houses 21–25.
   Those portraits have simply moved from their previous chapter locations.
   No procedural lookalikes, no modified faces and no duplicate cast members. */
const BV_ADVANCED_IDS=['anya','bond','damian','yor','loid'];
const BV_ADVANCED_SPRITES=BV_ADVANCED_IDS.map(
 id=>typeof INLINE_SPRITES==='undefined'?id:INLINE_SPRITES[id]
);
