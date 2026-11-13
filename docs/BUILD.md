# Reproducible, byte-preserving build

BV-Garden ships one standalone HTML game. The source tree was created by splitting its existing inline CSS and JavaScript **without changing the generated HTML**. The build preserves original ordering, script scope, assets, audio and game behavior.

## Source files

| Location | Responsibility |
| --- | --- |
| `src/index.template.html` | Document, layout and four inline resource placeholders |
| `src/styles/main.css` | Original garden styles |
| `src/styles/responsive.css` | Existing responsive and math adjustments |
| `src/scripts/01-curriculum.js` | Chapter content and reading references |
| `src/assets/embedded-sprites.js` | Existing embedded character/sprite images |
| `src/scripts/02-world.js` | 2.5D garden renderer and controls |
| `src/quiz/chapter-bank.js` | The 20-chapter question bank |
| `src/quiz/imperial-bank.js` | Imperial examination questions |
| `src/quiz/quest-engine.js` | Selection, scoring and saved history |
| `src/lessons/primers.js` | Research-level teaching and prerequisites |
| `src/scripts/03-interactions.js` | Game interactions and conceptual labs |
| `src/scripts/04-persistence-audio.js` | Browser autosave and award sounds |

## Commands

```bash
npm run build:check
npm test
npm run build
```

`build:check` compares the regenerated file with the committed root `index.html` byte-for-byte and exits unsuccessfully on any difference. `npm test` also audits the entire question bank and selected game invariants. `build` intentionally writes a new `index.html` only when a developer changes source files.

The fragments are *not* independent ES modules: the game currently uses a classic inline-script scope. Keeping the scripts concatenated in the original order avoids an unsafe behavioral migration. Source organization does not claim that a runtime redesign or browser regression suite was performed.

Only `index.html` and `.nojekyll` go into the GitHub Pages artifact. The private development repository and its history must not be made public to enable Pages on GitHub Free.
