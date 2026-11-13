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
