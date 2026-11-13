# Architecture and verification

BV-Garden is a **client-side 2.5D HTML Canvas educational game**. It does not require Python packages, ML frameworks, model checkpoints, a server database, or a paid API.

## Runtime and source
- Root **index.html**: authoritative playable game, including pixel art, CSS, game logic, educational content, and embedded MP3 data URLs.
- **archive/research-garden-source-legacy.zip**: older editable-source snapshot; **not** the authoritative current game.
- **.github/workflows/pages.yml**: prepares only index.html and .nojekyll for public Pages hosting.
- **scripts/verify-site.mjs**: dependency-free checks for script syntax and selected invariants.

## Game contract
- 20 research locations and guides.
- 4 questions per normal chapter: easy, medium, hard, hard.
- At least 3 correct earns a Stella. Both hard correct can allow progress without earning a star.
- On the **10th** wrong answer, reset to Chapter 1 while retiring questions already seen.
- The game may allow travel to other locations, but visiting does not unlock their lessons.

## Persistence
The browser uses localStorage. Known keys:
- latent-atlas-research-quest-v1: chapter/quiz/star/bolt history and active questions.
- bv-garden-explorer-position-v1: explorer position, camera pan, selected chapter and reset epoch.
- bv-garden-sound-enabled-v1: sound preference.

There is **no account sync or cloud backup**. Changing website origins/devices, erasing site data, restricted private browsing or storage failure can prevent resume. Sound playback may be restricted until user interaction.

## Limitations
Static checks do not validate every physical device, browser, audio policy, or quiz transition. The educational research content is not peer-reviewed as a new research contribution, and the in-game award is not evidence of AGI/ASI.
