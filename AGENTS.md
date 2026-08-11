# AGENTS.md

## 1. Project identity

**Project name:** Deolane San Paolo  
**Repository / canonical slug:** `DeolaneSanPaolo`

Deolane San Paolo is a browser-based detective and geographic investigation game built as a mechanically faithful recreation of the classic late-1980s/early-1990s DOS investigation-game formula represented by *Where in the World Is Carmen Sandiego?*, while using an entirely new title, narrative, cast, criminal organization, dialogue, visual assets and content.

The game must feel as if it were a lost DOS title from the same technological era, but it must be implemented from scratch for the modern browser and published as a fully static GitHub Pages site.

The goal is **not** to modernize the experience. The goal is to preserve its deliberate limitations, pacing, information density, investigation loop, screen composition, pixel-art presentation and interaction model, while replacing the fiction with the Deolane San Paolo universe.

---

## 2. Central creative premise

The principal villain and recurring criminal mastermind is **Deolane San Paolo**.

Her visual identity is mandatory and must remain consistent across every appearance:

- straight blonde hair;
- extremely large, exaggerated lips;
- lips covered with intense red lipstick;
- heavy and intentionally excessive makeup;
- large earrings;
- a conspicuously oversized gold necklace;
- an enormous gold pendant as her most recognizable accessory;
- flashy, ostentatious and immediately recognizable presentation;
- exaggerated DOS-era caricature rather than realistic portraiture.

Her silhouette and face must be recognizable even at low native pixel resolution.

Deolane is the equivalent narrative centerpiece of the criminal organization, but **the project must develop its own organization, supporting criminals, agency, stolen objects, dialogue, humor, setting and lore** in the dedicated narrative documents.

Do not introduce details about her biography, motivations, organization, relationships or story arc unless those details are explicitly defined in the narrative specification.

---

## 3. Primary implementation target

The final game must run entirely in a web browser and be deployable through **GitHub Pages**.

Default technical assumptions:

- static frontend only;
- no required backend;
- no required external database;
- no server-side session state;
- no runtime dependency on the original DOS executable;
- game state persisted locally in the browser;
- deterministic game logic where appropriate;
- all content and gameplay data kept separate from engine code;
- production build emitted as static files suitable for GitHub Pages.

Preferred baseline stack unless `TECH_ARCHITECTURE.md` later overrides it:

- TypeScript;
- Vite;
- Svelte;
- CSS;
- Canvas only where Canvas materially improves DOS-style rendering or animation;
- JSON or TypeScript data modules for structured content;
- `localStorage` or IndexedDB for local persistence.

Do not introduce a backend, authentication service, cloud database, analytics dependency, API requirement or framework migration unless a specification explicitly requires it.

---

## 4. Core design rule

**Behavioral fidelity takes priority over convenience.**

The implementation must reproduce the intended investigation structure as specified in the project documentation, even where a modern UX convention would be easier.

Do not automatically:

- simplify the investigation loop;
- reveal correct destinations;
- add quest markers;
- add glowing objectives;
- add modern tutorials over every screen;
- replace deductions with multiple-choice answers;
- eliminate wrong routes;
- eliminate time penalties;
- make the warrant system cosmetic;
- remove backtracking;
- replace DOS-like interaction with a modern dashboard;
- add responsive card grids simply because they are conventional;
- convert the interface into a mobile-app aesthetic;
- introduce achievements, currencies, battle passes, login systems or other unrelated systems.

If a proposed change makes the game easier to understand but less faithful to the documented design, **the documented design wins**.

---

## 5. The project is specification-driven

Codex must not treat the prompt, its own prior assumptions or a reference repository as the source of truth.

The source of truth is the Markdown specification set in this repository.

Before implementing or materially modifying gameplay, read the relevant specification files.

### Mandatory documentation set and reading order

1. `AGENTS.md`
2. `ORIGINAL_GAME_ANALYSIS.md`
3. `GAME_SPEC.md`
4. `NARRATIVE_WALKTHROUGH.md`
5. `CASE_GENERATION.md`
6. `CONTENT_MODEL.md`
7. `UI_UX_SPEC.md`
8. `VISUAL_SPEC.md`
9. `ASSET_MANIFEST.md`
10. `TECH_ARCHITECTURE.md`
11. `REFERENCES_AND_ACCEPTANCE.md`

Not every implementation task requires rereading every file, but no task may contradict them.

### Purpose of each specification

#### `ORIGINAL_GAME_ANALYSIS.md`
Records evidence gathered from the original DOS game, manuals, runtime observation, reverse engineering and comparison projects.

It must distinguish:

- directly confirmed behavior;
- experimentally observed behavior;
- behavior inferred from code or data;
- secondary-source claims;
- unresolved hypotheses.

This document describes **what the historical reference actually does**. It is not itself the implementation specification.

#### `GAME_SPEC.md`
Canonical source of truth for game rules and mechanics.

Defines, among other things:

- case lifecycle;
- investigation;
- travel;
- time;
- clues;
- suspect identification;
- warrants;
- wrong destinations;
- backtracking;
- final hiding place;
- arrest;
- escape;
- win/loss conditions;
- ranks;
- progression;
- difficulty.

#### `NARRATIVE_WALKTHROUGH.md`
Canonical source of truth for the **player-facing sequence of the game from boot to ending**.

This file must describe the experience as a walkthrough, state by state and screen by screen.

It includes, among other things:

- title and intro sequence;
- first contact with the agency;
- player-name entry;
- the typewriter/computer response to an unknown player;
- the machine stating that it has never seen the player before;
- immediate crime/news bulletin;
- assignment of the first case;
- transition into the investigation;
- city arrival;
- investigation flow;
- travel;
- dossiers;
- warrant issuance;
- pursuit;
- arrest or escape;
- post-case debrief;
- rank promotion;
- subsequent cases;
- Deolane San Paolo progression;
- final career state / ending.

This file determines **what the player experiences and in what order**.  
`GAME_SPEC.md` determines the rules underneath that experience.

#### `CASE_GENERATION.md`
Defines exactly how cases are generated.

Covers:

- culprit selection;
- stolen item selection;
- starting location;
- hidden route;
- route length;
- decoys;
- final hideout;
- clue allocation;
- identity clues;
- geographic clues;
- negative clues;
- solvability constraints;
- difficulty scaling;
- randomization;
- deterministic seeds where used.

#### `CONTENT_MODEL.md`
Defines structured content and schemas.

Covers:

- cities;
- connections;
- places;
- witnesses;
- suspects;
- suspect traits;
- clues;
- stolen objects;
- ranks;
- agency data;
- narrative strings;
- localization-ready text;
- asset references.

Gameplay data must not be hard-coded into UI components when it belongs in the content model.

#### `UI_UX_SPEC.md`
Defines the exact screen structure and interaction model.

Covers:

- menu bar;
- city/date panel;
- city image panel;
- text/information panel;
- investigation controls;
- travel controls;
- map;
- dossiers;
- warrant computer;
- headquarters;
- news bulletin;
- post-case screens;
- menus;
- button states;
- navigation behavior;
- logical resolution;
- keyboard/mouse interaction if applicable.

#### `VISUAL_SPEC.md`
Defines the mandatory visual language.

Covers:

- DOS-era target;
- native pixel grid;
- palette;
- dithering;
- outlines;
- typography;
- scaling;
- sprite treatment;
- portrait treatment;
- city-scene treatment;
- icon treatment;
- UI borders;
- forbidden modern effects.

#### `ASSET_MANIFEST.md`
Canonical inventory of visual assets.

Each asset should have:

- stable ID;
- filename;
- category;
- intended native dimensions;
- transparency requirements;
- usage;
- reuse rules;
- status.

Code must reference stable asset IDs/paths defined here instead of inventing arbitrary filenames.

#### `TECH_ARCHITECTURE.md`
Defines the implementation architecture.

Covers:

- stack;
- modules;
- state machine;
- persistence;
- directory structure;
- rendering strategy;
- engine/UI/data separation;
- testing;
- build;
- GitHub Pages deployment.

#### `REFERENCES_AND_ACCEPTANCE.md`
Defines:

- approved reference materials;
- what each reference is useful for;
- known deviations in third-party clones;
- what must not be copied blindly;
- mechanical acceptance criteria;
- UI acceptance criteria;
- visual acceptance criteria;
- regression criteria.

---

## 6. Conflict resolution and authority

If documentation conflicts, use this priority:

1. explicit project decision in the most specific specification;
2. `GAME_SPEC.md` for gameplay rules;
3. `NARRATIVE_WALKTHROUGH.md` for player-facing sequence and narrative presentation;
4. `CASE_GENERATION.md` for procedural generation;
5. `CONTENT_MODEL.md` for data structure;
6. `UI_UX_SPEC.md` for interaction and layout;
7. `VISUAL_SPEC.md` for rendering and visual behavior;
8. `TECH_ARCHITECTURE.md` for implementation details;
9. `ORIGINAL_GAME_ANALYSIS.md` as historical evidence;
10. third-party reference projects.

When a real contradiction cannot be resolved from these files, do not silently choose one interpretation. Mark the issue clearly in the implementation notes and avoid building speculative behavior into core systems.

---

## 7. Original DOS game and reference projects

The original DOS game may be supplied locally for research.

It is a **behavioral reference**, not a runtime dependency.

If available, use it to determine:

- exact gameplay rules;
- timing;
- route behavior;
- clue behavior;
- UI sequencing;
- visual proportions;
- screen state transitions;
- progression;
- data structures where useful.

Any reverse-engineering findings must be documented in `ORIGINAL_GAME_ANALYSIS.md` before they are treated as confirmed project behavior.

Known comparison repositories may include:

- `fmaclen/julia-sanfrancisco`
- `Ponup/thiefcatcher`
- `IcaroBernardes/carmen_sandiego_DOS`

Use them as comparative references only.

Do **not** assume any of them reproduces the DOS original perfectly.

In particular:

- do not inherit fixed travel times merely because a clone uses them;
- do not inherit its case length without verification;
- do not make warrants cosmetic;
- do not copy its simplified clues;
- do not copy its architecture merely because it already works;
- do not couple the new game to another project's naming or data structures.

The final engine must be an independent implementation driven by this project's specifications.

---

## 8. Clean architecture requirement

Gameplay logic must be independent from presentation.

The project should conceptually separate:

```text
content/data
    ↓
case generation
    ↓
game engine
    ↓
state
    ↓
UI presentation
    ↓
visual assets
```

The engine must be testable without the graphical interface.

A case should be playable through programmatic actions such as:

```text
startCase()
investigate(place)
travel(destination)
setWarrantTrait(...)
issueWarrant()
```

without requiring DOM clicks to execute the rules.

UI components must call game-engine actions.  
UI components must not independently decide game rules.

---

## 9. Required gameplay systems

Unless later specifications explicitly change them, plan the architecture around distinct responsibilities such as:

- `CaseEngine`
- `CaseGenerator`
- `RouteEngine`
- `ClueEngine`
- `WarrantEngine`
- `TimeEngine`
- `TravelEngine`
- `ProgressionEngine`
- persistence/session state
- content repository/data loader

Exact class names are not mandatory until `TECH_ARCHITECTURE.md` defines them, but the separation of responsibilities is.

Avoid one giant `Game.ts` containing every system.

Avoid business rules embedded inside Svelte components.

---

## 10. Content must be data-driven

Cities, suspects, locations, witnesses, clues, items and progression must be representable as structured data.

A new city should ideally require adding data and assets, not modifying the engine.

A new suspect should ideally require adding:

- metadata;
- identifying traits;
- narrative content;
- asset references;

without adding suspect-specific branching to core gameplay code.

Avoid logic such as:

```ts
if (city === "Paris") ...
if (suspect === "Deolane") ...
```

unless the story specification explicitly requires a unique scripted event.

Deolane may have unique narrative treatment, but her mechanical behavior must remain data-driven wherever possible.

---

## 11. Narrative sequencing is a first-class system

Do not treat story text as decorative filler.

The game begins as a directed player experience, not by dropping the player directly onto a map.

The opening sequence must be specified in `NARRATIVE_WALKTHROUGH.md`.

At minimum, the architecture must support a sequence equivalent in structure to:

```text
boot / title
    ↓
agency terminal / typewriter
    ↓
player enters name
    ↓
system searches records
    ↓
system reports that it has never seen this player before
    ↓
news/crime bulletin interrupts or follows immediately
    ↓
stolen object + starting city revealed
    ↓
player receives assignment
    ↓
case begins
```

The exact wording, timing, humor and identity of the agency will be defined later.

Do not invent final dialogue before that document exists.

The same principle applies to:

- case-complete sequences;
- failed-case sequences;
- promotions;
- Deolane encounters;
- final progression.

---

## 12. Visual fidelity rules

The game must not look like a modern web app with pixel-art illustrations pasted into it.

The **entire interface** must belong to the same DOS-era visual system.

Until `VISUAL_SPEC.md` provides exact values, assume:

- hard pixel grid;
- integer pixel coordinates;
- integer scaling;
- nearest-neighbor image scaling;
- bitmap typography;
- square corners;
- no modern border radius;
- no blur;
- no glassmorphism;
- no soft drop shadows;
- no CSS gradients;
- no antialiasing-dependent effects;
- no emoji as game icons;
- no generic modern icon library visible in gameplay;
- black/white/gray DOS-like panel construction;
- intentionally compact spacing;
- low-resolution pixel art;
- limited indexed-style palette;
- strong black outlines;
- checkerboard dithering where appropriate.

The supplied DOS screenshots are strict layout and rendering references when referenced by the specification.

### Critical distinction

Generate or draw art assets for:

- characters;
- witnesses;
- city scenes;
- special narrative scenes;
- sprite-like icons where necessary.

Implement deterministic UI structure in code for:

- borders;
- panels;
- menus;
- text boxes;
- buttons;
- selected/pressed states;
- layout;
- labels.

Do not generate entire UI screenshots and use them as interactive backgrounds.

---

## 13. Deolane San Paolo visual lock

Every Deolane asset must preserve the same identifying features.

Mandatory recognition hierarchy:

1. blonde hair;
2. enormous bright-red lipstick-covered lips;
3. oversized gold pendant necklace;
4. prominent earrings;
5. heavy makeup;
6. ostentatious appearance.

At DOS resolution, these traits must be exaggerated enough to survive downscaling.

Do not gradually redesign her between:

- dossier portrait;
- encounter sprite;
- intro/cutscene art;
- arrest/escape sequence;
- promotional art.

If a generated asset loses the identifying traits, the asset is invalid even if it is otherwise attractive.

---

## 14. UI fidelity over responsive redesign

The desktop DOS composition is the primary design target.

The browser may scale the logical game viewport to fit available space, but it must not rearrange the gameplay interface into a different responsive composition unless `UI_UX_SPEC.md` explicitly defines an alternate mode.

Prefer:

```text
fixed logical viewport
        ↓
integer or nearest-neighbor scaling
        ↓
browser display
```

over:

```text
desktop layout
        ↓
CSS cards rearranged independently
        ↓
different game on every viewport
```

If mobile support is later required, preserve the original composition where practical instead of redesigning the game.

---

## 15. Asset policy

Never invent an asset path because it seems reasonable.

Use `ASSET_MANIFEST.md`.

Where artwork is not ready:

- use an explicit placeholder;
- keep the final asset ID/path stable;
- do not create visually unrelated production art merely to fill the slot.

All pixel-art images must be displayed without smoothing.

Avoid embedding meaningful text permanently inside art unless the asset specification explicitly requires it.

Text rendered by the UI must remain editable and localization-ready.

---

## 16. Text and localization

Even if the first release is in Portuguese, keep player-facing text separable from engine logic.

Do not scatter dialogue strings across gameplay modules.

Narrative content should support later localization without rewriting the engine.

Names, clues and dialogue may have stylistic exceptions, but data structure should remain localization-friendly.

---

## 17. Randomness and reproducibility

Random generation must be controllable.

Case generation should support deterministic seeded behavior if defined by `CASE_GENERATION.md`.

This is necessary for:

- debugging;
- automated tests;
- reproducing bug reports;
- validating clue solvability;
- comparing implementation behavior with specifications.

Do not use uncontrolled `Math.random()` throughout unrelated modules if a centralized RNG system is specified.

---

## 18. Solvability is mandatory

A procedurally generated case must not rely on luck.

Every generated case must satisfy the solvability constraints documented in `CASE_GENERATION.md`.

Automated tests should eventually be able to generate many cases and verify that:

- the route can be followed from available clues;
- the culprit can be uniquely identified in time;
- the correct warrant can be obtained;
- decoys do not make the intended answer logically impossible;
- final capture remains reachable before the deadline under valid play.

Do not compensate for broken generation by revealing answers in the UI.

---

## 19. Persistence

The project must support local browser persistence without requiring an account.

Persist only the state required by the specifications, potentially including:

- player name;
- rank/progression;
- solved cases;
- current case;
- current game clock;
- current route position;
- collected evidence;
- warrant state;
- settings.

The exact schema belongs in `TECH_ARCHITECTURE.md`.

Persistence format must be versionable so future data changes do not silently corrupt existing saves.

---

## 20. GitHub Pages constraints

All production functionality must work when hosted as static content under a GitHub Pages project path.

Do not assume the site is always hosted at `/`.

Routing, asset URLs and build configuration must support a repository subpath such as:

```text
https://<user>.github.io/DeolaneSanPaolo/
```

unless deployment configuration explicitly uses a custom domain.

Avoid runtime filesystem assumptions.

Avoid server-only routing.

A clean production build must be deployable from GitHub Actions or the selected Pages workflow.

---

## 21. Testing expectations

Gameplay mechanics require automated tests.

Prioritize tests for:

- case generation;
- route progression;
- wrong-city behavior;
- return/backtracking behavior;
- clue allocation;
- suspect filtering;
- warrant issuance;
- correct/incorrect warrant behavior;
- time costs;
- deadline expiration;
- arrest;
- escape;
- progression;
- save/restore;
- deterministic seed reproduction.

UI tests should focus on state transitions and critical interactions rather than brittle pixel snapshots unless the visual specification explicitly requires screenshot regression tests.

Visual fidelity may later use reference screenshots and image-diff acceptance thresholds.

---

## 22. No speculative modernization

Do not add features because they seem useful.

Examples of changes that require explicit specification approval:

- dynamic difficulty;
- AI-generated clues at runtime;
- online leaderboards;
- multiplayer;
- accounts;
- server saves;
- procedural AI artwork;
- live maps;
- geolocation;
- achievements;
- daily challenges;
- cosmetics;
- monetization;
- voice acting;
- accessibility redesign that changes core information presentation;
- alternate modern UI theme.

Accessibility improvements that preserve behavior and layout semantics are welcome, but do not replace the defined visual identity.

---

## 23. Do not use runtime generative AI for core gameplay

The game must remain deterministic, lightweight and usable as a static GitHub Pages application.

Do not require OpenAI, image-generation or other generative-AI APIs at runtime for:

- clues;
- dialogue;
- case generation;
- city descriptions;
- suspect behavior;
- artwork.

Generative tools may be used during development to create source assets or draft content, but shipped gameplay must use curated local content unless a later specification deliberately changes this rule.

---

## 24. Performance philosophy

This is intentionally a lightweight DOS-like browser game.

Avoid unnecessary heavy dependencies.

Prefer:

- local assets;
- compact data;
- straightforward state;
- simple rendering;
- preloaded critical sprites;
- lazy loading for noncritical larger art where appropriate.

Do not introduce a large dependency to solve a problem that can be solved reliably with a few lines of project code.

---

## 25. Development behavior for Codex

When assigned a task:

1. identify which specification files govern it;
2. read those files before coding;
3. inspect existing implementation before replacing it;
4. preserve established architecture unless the task explicitly changes it;
5. implement the smallest complete change that satisfies the specification;
6. add or update tests for mechanical behavior;
7. run the relevant tests/build/lint checks;
8. report any unresolved specification conflict instead of hiding it.

Do not silently rewrite unrelated files.

Do not rename canonical data IDs casually.

Do not change visual dimensions merely to make implementation easier.

Do not weaken a mechanic because a test is inconvenient.

---

## 26. Placeholder policy during early development

The game may be developed before final artwork exists.

Use neutral placeholders while preserving:

- final expected dimensions;
- final asset IDs;
- transparency behavior;
- anchor positions;
- layout space.

Gameplay development must not be blocked by missing final artwork.

Conversely, placeholder artwork must never become the basis for redesigning a screen away from its specified dimensions.

---

## 27. Definition of "faithful"

For this project, fidelity means preserving the combination of:

- investigation loop;
- geographical deduction;
- identity deduction;
- time pressure;
- travel consequences;
- wrong-route consequences;
- warrant requirement;
- final pursuit;
- progression;
- DOS screen sequencing;
- DOS-like interaction density;
- period-authentic graphical language.

It does **not** mean retaining the original game's:

- title;
- named characters;
- criminal organization;
- agency name;
- dialogue;
- specific stolen treasures;
- proprietary artwork;
- fictional lore.

Deolane San Paolo must feel like she belongs to a different game built from the same design DNA.

---

## 28. Current project status

At the time this file is created, the detailed specifications have not all been written yet.

Therefore:

- do not begin full gameplay implementation based only on this document;
- do not fill missing specifications with assumptions;
- help create and validate the remaining specification documents first;
- implementation should begin only when the relevant rule, narrative, UI, visual and architecture requirements for the task are sufficiently defined.

The immediate documentation sequence after this file is:

```text
ORIGINAL_GAME_ANALYSIS.md
GAME_SPEC.md
NARRATIVE_WALKTHROUGH.md
CASE_GENERATION.md
CONTENT_MODEL.md
UI_UX_SPEC.md
VISUAL_SPEC.md
ASSET_MANIFEST.md
TECH_ARCHITECTURE.md
REFERENCES_AND_ACCEPTANCE.md
```

---

## 29. Final directive

When there is a choice between:

> "a cleaner modern game"

and

> "the strange, compact, deduction-heavy DOS experience defined by these specifications"

choose the latter.

**Build Deolane San Paolo as a native browser game with an old DOS soul, not as a modern game wearing a pixel-art costume.**
