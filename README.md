# Beyond Vision · The Latent Atlas Research Garden

A 2.5D pixel-art browser game for learning AI, mathematics, world models and embodied intelligence. Development is ongoing.

## Play

Open `index.html` in a browser, or serve the folder locally:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/ .

**Controls:** WASD or arrow keys to move, M for the map, F to recenter, and drag to pan. Touch controls are provided on supported screens.

**Progress:** There are 20 chapters, each with one easy, one medium and two hard questions. At least 3/4 correct earns a Stella; answering both hard questions correctly can advance without a Stella. The tenth incorrect answer resets the current journey to Chapter 1. The final exam needs at least 7/10 correct to pass. Imperial Scholar additionally requires all 20 Stellas, at least two medium and four hard exam answers correct. Five qualifying Imperial journeys unlock the Elite Imperial League.

Progress is saved **in this browser on this website origin**, not in an online account. Use the game's export/restore controls to make and load a save file; you can email that file to yourself. This is not automatic email synchronization. Browser storage may not survive clearing site data, switching devices or using private browsing.

## Verify or rebuild locally

Requires **Node.js 20+**. No package installation or paid service is needed.

```sh
npm run build:check
npm test
```

The checked-in `index.html` is the playable build; `build:check` verifies that it matches the `src/` files byte-for-byte. Run `npm run build` **only when deliberately regenerating** `index.html` after changing source files.

Research references: [source catalogue](docs/SOURCES_HARVARD.md).

**Rights:** This is a proprietary project in development, **not MIT-licensed** and not open for external contributions. See [LICENSE](LICENSE) for access, reuse and third-party asset restrictions.
