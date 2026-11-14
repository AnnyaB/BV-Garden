# Beyond Vision · The Latent Atlas Research Garden

A 2.5D pixel-art browser game. Development is ongoing.

## Play

Play the deployed game: https://annyab.github.io/BV-Garden/

Open `index.html` in a browser, or serve the folder locally:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/ .

**Controls:** WASD or arrow keys to move, M for the map, F to recenter, and drag to pan. Touch controls are provided on supported screens.

## Progress and Game Rules

### Chapters 1–20 · Original Research Garden

The original garden contains **20 sequential chapters**. Each chapter has four conceptual questions:

- **1 easy**
- **1 medium**
- **2 hard**

**Stella Star:** Answer at least **3/4 questions correctly** to earn the chapter's Stella and unlock the next chapter.

**Alternative advancement:** Answer **both hard questions correctly** to unlock the next chapter even if fewer than three answers are correct. This does **not** award a Stella. The player can revisit the chapter and attempt fresh questions to earn its missing Stella.

If neither condition is met, the chapter remains locked until the player passes another attempt.

**Tonitrus Bolts:** Every incorrect answer adds one Bolt. The **10th cumulative incorrect answer** resets the original journey to Chapter 1. Previously used questions remain retired, and advanced research progress and historical Imperial wins are preserved.

The game does not repeat previously used question prompts. Its offline question bank is finite; further attempts may become unavailable if insufficient unused questions remain.

### Final Examination · Original Garden

After passing all 20 chapter gates, the player can attempt the final examination **without needing all 20 Stellas**.

The examination contains **10 questions**:

- **2 easy**
- **3 medium**
- **5 hard**

**Ordinary examination pass:** At least **7/10 correct**.

An ordinary pass unlocks the advanced research expedition (Chapters 21–25), even if the player has not earned all 20 Stellas or Imperial Scholar status.

**Imperial Scholar qualification** requires all of the following:

- All **20 original Stella Stars**
- At least **7/10 examination answers correct**
- At least **2/3 medium answers correct**
- At least **4/5 hard answers correct**

An Imperial Scholar qualification is recorded as one Imperial win. The player's selected avatar receives the Imperial Scholar uniform. Qualifying again on separate journeys increases the historical Imperial win count.

### Chapters 21–25 · Advanced Research Garden

The advanced expedition contains five additional research houses, unlocked sequentially:

21. Grounded Generative Agents & Tool Evaluation
22. Causal Identifiability & Intervention
23. Unseen Skill Composition & Transfer
24. Certified Runtime Risk & OOD
25. Recursive Improvement & Scientific Discovery

Each advanced house has **8 conceptual research questions**:

- **2 easy**
- **2 medium**
- **4 hard**

Advanced easy and medium questions use single-choice answers. Advanced hard questions require selecting both correct statements.

**Advanced Stella Star:** At least **6/8 answers correct** earns the house's Stella and unlocks the next house.

Unlike Chapters 1–20, the advanced houses do not have a separate two-hard-answers advancement exception. A score below 6/8 does not pass the house.

**Advanced Tonitrus Bolts:** Each incorrect answer adds one advanced Bolt. The **5th cumulative advanced incorrect answer** resets the advanced expedition to House 21.

This advanced reset does **not** reset the original 20-chapter journey or its Imperial record. Previously used advanced questions remain retired.

The advanced expedition tracks its own five Stellas, five-Bolt counter, question history and progression.

### Elite Imperial League · Two Qualification Routes

The **Elite Imperial League** unlocks through either of these independent routes:

1. Earn **five separate Imperial Scholar wins** across qualifying original-garden journeys.
2. Earn **all five advanced Stella Stars** from Houses 21–25.

Either route is sufficient. Completing both is not required.

The existing Elite Imperial League contains conceptual, mathematical, coding and short written scientific-reasoning exercises. Written responses are self-reviewed against a disclosed rubric.

### Question Integrity and Progress Preservation

- Previously displayed question prompts are tracked to prevent their reuse across attempts and journeys.
- Question choices can be single-select or multi-select, depending on the chapter and difficulty.
- Submitted answers cannot be changed or retried within the same question.
- Completed assessments provide explanations and answer reviews.
- The original garden and advanced garden maintain separate Bolt-reset rules.
- Ordinary examination passes, Imperial wins and advanced qualification are tracked separately.
- Progress, active assessments, selected avatar, player position and map pan are saved locally.
- Completing game assessments represents game achievement, **not certification of research mastery, scientific invention, AGI or ASI**.

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
