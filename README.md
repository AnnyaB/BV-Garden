# BV-Garden
### Beyond Vision · The Latent Atlas Research Garden

An interactive **2.5D pixel-art research-learning adventure** through AI foundations, mathematical reasoning, world models, embodied intelligence, safety and open scientific questions.

## Highlights
- **20 conceptual chapters**, from AI origins to open-ended intelligence.
- **Four questions per chapter**: one easy, one medium, two hard.
- **Stella**: at least 3/4 answers correct earns a star. Both hard answers correct can separately unlock the next chapter without a star.
- **Tonitrus**: the 10th incorrect answer restarts the adventure at Chapter 1, retaining previously used question history.
- **Exploration**: 2.5D pixel garden with keyboard and touch movement, camera panning, a map and 20 research companions.
- **Autosave**: chapter and answer history, unfinished quiz, game awards, explorer position, camera pan and sound preference in local browser storage.
- **Audio**: two embedded event sounds, subject to browser autoplay restrictions.

This project is an educational game, you can revise concepts and check your existing knowledge level. 

## Play
Open the standalone [index.html](index.html) in a browser. For an ordinary locally hosted preview:

~~~sh
python3 -m http.server 8000
~~~

Visit http://localhost:8000/ and use the same browser/origin to resume. Storage may be lost when you change origin/device, clear site data, or browse privately.

**Controls:** WASD or arrows to move; M to open the map; F to recenter; drag to pan. Touchscreen controls are available. Entering a locked location does not unlock its lesson.


## Source organization and testing

BV-Garden has a **maintainable source tree with an exactly reproducible playable artifact**. The current HTML was split into individual CSS, inline sprite data, quiz banks, teaching content, world logic and save/audio logic. Rebuilding concatenates those files in their original order; it does not alter or modernize the game engine.

```text
src/
  index.template.html
  styles/           # Original CSS and responsive additions
  assets/           # Embedded sprite data
  scripts/          # Curriculum, world rendering, interactions and saves
  quiz/             # Level MCQs, final examination and quest engine
  lessons/          # Teaching material and prerequisite guides
scripts/
  build.mjs         # Deterministic standalone HTML builder
  verify-site.mjs   # Question-bank and source integrity checks
```

**No dependencies or paid API are required to play.** With Node.js 20+ installed, contributors can use:

```sh
npm run build:check
npm test
npm run build
```

Run `npm run build` only after intentionally editing source files, and review the generated HTML diff. See [build reproducibility](docs/BUILD.md) and [contributing](CONTRIBUTING.md).

## Deployment

GitHub Pages on GitHub Free requires a public repository. This development repository is private and does **not** currently host a live GitHub Pages website. For a safe release, create a fresh-history public repository containing only the reviewed release files. The Pages workflow verifies the game and publishes only the root `index.html` as the website artifact; it skips private repositories.
## Documentation
- [Architecture and persistence](docs/ARCHITECTURE.md)
- [Chapter cast and asset provenance](docs/CHARACTERS.md)
- [Research catalogue](docs/SOURCES_HARVARD.md)
- [Private deployment history](docs/DEPLOYMENT_PRIVACY.md)
- [Public GitHub Pages publication guide](docs/PUBLISHING.md)
- [Licensing and asset-rights notice](NOTICE.md)

Run static checks with **node scripts/verify-site.mjs**. Passing checks does not replace real-browser and device testing.

## Credits and scope
This project uses characters inspired by *SPY×FAMILY* and two externally supplied sounds. 
