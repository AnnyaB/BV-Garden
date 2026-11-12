# BV-Garden — The Latent Atlas Research Garden

Private source repository for an interactive, offline-capable 2.5D pixel-art research adventure.

## Play
Open `index.html` in a modern browser, or serve it through a static host. All artwork, learning material, questions and scoring logic are embedded in this standalone HTML. The complete editable multi-file source is also preserved as `research-garden-source.zip`.

## Explore all 20 locations
- **WASD / Arrow keys**: continuous movement. Touchscreen directional buttons also work.
- **M** or **☷ Map**: accessible list of all 20 stations; choosing one moves the explorer there, without unlocking its lessons.
- **Drag the garden**: pan the camera; **Shift + arrows**: keyboard camera panning.
- **F** or **⌖**: recenter on the explorer.
- **[ / ]**: visit previous / next research station.
- **E**: talk with a nearby research companion (while the canvas is focused).
- **Tab / Enter**: navigate and operate visible buttons, choices and journal controls.

## Learning progression
20 chapters ordered from AI origins, logic, programming and mathematical foundations through world models, embodied learning, safety, physical reasoning and open-ended intelligence. Every chapter has four conceptual challenges; awarding and unlocking follow the Stella / Tonitrus rules in the supplied source package. Visiting a locked house does not unlock a lesson.

20 established *SPY×FAMILY* characters are used as unofficial pixel fan-art guides; this game is not affiliated with the series' rights holders. Passing the in-game Imperial Scholar examination is a fictional achievement and not a scientific qualification. Research frontiers are described as open questions, not achieved AGI/ASI.

## Visibility and deployment
The repository is intentionally **private**. Publishing a game through a static web host can still make the website public, even if its source repository is private. Please check hosting access settings before distributing the playable URL.

## Documentation and scientific provenance
- [20 chapter companions and their science topics](CHARACTERS.md) — identity map and unofficial fan-art notice.
- [Harvard-style research source catalogue](SOURCES_HARVARD.md) — 64 selected foundational and frontier references, with peer-review status, primary links, scientific limitations and future research questions.
- [Private deployment and safe preview](DEPLOYMENT_PRIVACY.md) — why a private source repository does **not** necessarily produce a private website.

The standalone game and source ZIP were committed in `main`; roaming, keyboard access and the 20-location map are included without changing the Stella/Tonitrus progression conditions. This bibliography is selective, not a claim to cite every AI paper in existence.

## Autosave and Stella / Tonitrus audio (13 November 2026)
- The playable `index.html` automatically stores **chapter progress, awarded stars, bolt count, used question IDs, active quiz and chosen answers** in browser `localStorage`. It also remembers the explorer's map position, camera pan and currently viewed chapter.
- Revisit **the same website origin in the same browser/device** to resume. Progress is not synchronized across devices, and clearing browser/site data, private browsing restrictions, or changing from `file://` to a hosted origin can prevent restoration.
- A **new Stella after all four chapter questions** plays the user's supplied approximately two-second twinkle sound. The **10th Tonitrus Bolt** plays the supplied fail-trumpet sound and restarts at Chapter 1. Previously seen questions remain retired.
- The existing `♪ mute sounds / ♪ enable sounds` button controls playback and remembers the preference. Audio may require a user interaction on mobile; autoplay policies can mute playback without warning.
- Both supplied original MP3 files are **embedded inside the playable `index.html`** so no additional file downloads are needed to play.
- The repository's `research-garden-source.zip` is an **older source snapshot**. The current updated editable ZIP (including the original audio files) is in the owner's [Google Drive Research Garden folder](https://drive.google.com/drive/folders/1FwTfNHQ1QJ1O8lOSfGmH4yTTX1UPmJHs) as `BV_Garden_AUTOSAVE_STELLA_TONITRUS_Source.zip`.
- For public distribution, verify the licenses for the user-provided sound effects credited in filenames to **shidenbeatsmusic** and **universfield**; a supplied audio file is not by itself a redistribution license.
