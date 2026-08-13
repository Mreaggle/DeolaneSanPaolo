# REFERENCES_AND_ACCEPTANCE.md

## 1. Document authority

This document defines the canonical reference hierarchy and final acceptance criteria for **Deolane San Paolo / `DeolaneSanPaolo`**.

Its purpose is twofold:

1. define what each historical or comparative reference is allowed to teach us;
2. define how the final game must be evaluated so that a technically functional implementation does not drift away from the intended DOS experience.

This is the project's anti-drift specification.

For reference interpretation:

```text
ORIGINAL_GAME_ANALYSIS.md
    +
REFERENCES_AND_ACCEPTANCE.md
        ↓
project decisions
```

For final acceptance:

```text
GAME_SPEC.md
CASE_GENERATION.md
CONTENT_MODEL.md
UI_UX_SPEC.md
VISUAL_SPEC.md
ASSET_MANIFEST.md
TECH_ARCHITECTURE.md
NARRATIVE_WALKTHROUGH.md
        ↓
REFERENCES_AND_ACCEPTANCE.md
        ↓
release gate
```

If the game "works" but fails the acceptance criteria here, it is not considered complete.

---

# PART I — REFERENCE PHILOSOPHY

## 2. References are not equal

The project uses several sources with different levels of authority.

They must never be merged indiscriminately.

The four principal reference families are:

1. the exact target **Carmen Sandiego DOS original executable/data**;
2. `fmaclen/julia-sanfrancisco`;
3. `Ponup/thiefcatcher`;
4. `IcaroBernardes/carmen_sandiego_DOS`.

Each answers different questions.

---

## 3. Reference hierarchy

Default authority for reconstructing historical behavior:

```text
TARGET DOS EXECUTABLE / DATA
        ↓
CONTROLLED RUNTIME OBSERVATION
        ↓
PERIOD MANUAL / PRIMARY DOCUMENTATION
        ↓
HISTORICAL SECONDARY SOURCES
        ↓
COMMUNITY REVERSE ENGINEERING
        ↓
THIRD-PARTY CLONES
```

Third-party clones are never allowed to overrule verified target-build behavior.

---

## 4. Different references may be authoritative for different dimensions

Example:

```text
DOS executable
→ gameplay timing

DOS screenshot
→ UI geometry

Icaro www PNG corpus
→ visual rendering vocabulary

Julia Sanfrancisco
→ useful browser/domain architecture concepts

Thiefcatcher
→ case-state and itinerary modeling concepts
```

No source receives universal authority.

---

# PART II — PRIMARY REFERENCE: ORIGINAL DOS GAME

## 5. Reference identity

Primary behavioral reference:

```text
Where in the World Is Carmen Sandiego?
IBM PC / DOS lineage
Brøderbund
```

The precise target build must be fingerprinted in accordance with `ORIGINAL_GAME_ANALYSIS.md`.

Until the build is identified, no version-specific mechanic may be called exact.

---

## 6. What to observe in the original DOS build

The exact target executable/data should be used to investigate:

### Opening

- boot behavior;
- intro animation;
- title flow;
- detective-name entry;
- new-player recognition;
- returning-player recognition;
- typewriter/computer response;
- assignment sequence;
- News Flash ordering.

### Case generation

- culprit selection;
- stolen object selection;
- starting city;
- route length;
- route construction;
- final city;
- final hiding place;
- rank influence.

### World/travel

- city roster;
- legal connections;
- destination list size;
- destination ordering;
- travel-time values;
- backtracking behavior.

### Investigation

- number of local places;
- place-selection behavior;
- witness roles;
- clue persistence;
- investigation timing;
- repeated-location behavior.

### Clues

- geographic clue categories;
- clue templates;
- clue wording;
- destination discrimination;
- identity clue categories;
- identity-clue distribution;
- negative clue behavior;
- wrong-city messaging.

### Crime Computer / warrant

- trait fields;
- field values;
- zero-match result;
- multi-match result;
- unique-match result;
- warrant issuance;
- warrant time cost;
- replacement behavior.

### Pursuit/final city

- trail feedback;
- proximity animations;
- final-city state;
- hiding-place mechanics;
- no-warrant encounter;
- wrong-warrant encounter;
- correct-warrant capture.

### Time

- case start time;
- investigation costs;
- warrant/computer costs;
- flight costs;
- deadline;
- sleep/overnight behavior;
- exact-deadline behavior.

### Progression

- rank names;
- promotion thresholds;
- promotion questions;
- difficulty changes;
- mastermind appearance;
- Hall of Fame;
- retirement/end-state.

### Presentation

- screen resolution;
- panel geometry;
- menu labels;
- button geometry;
- fonts;
- text speed;
- animation timing;
- sprite placement;
- color/palette behavior.

---

## 7. What may be copied conceptually from the DOS original

The project intentionally preserves the design structure of:

- geographic pursuit;
- hidden route;
- limited candidate destinations;
- three-place investigation loop;
- witnesses;
- geographic deduction;
- suspect deduction;
- dossiers;
- warrant filtering;
- time pressure;
- wrong-route punishment;
- final local search;
- correct-warrant requirement;
- career ranks;
- recurring mastermind structure.

These are gameplay/system concepts.

---

## 8. What must not be copied directly into production

Do not directly ship:

- Carmen Sandiego character;
- V.I.L.E. characters;
- ACME text/branding;
- original dialogue;
- original biographies;
- original city artwork;
- original witness artwork;
- original suspect portraits;
- original logos;
- original music;
- original sound recordings;
- original proprietary PNGs;
- original binaries/data.

Historical reference files remain development references only.

---

## 9. Original executable as source of truth

When an observed historical value conflicts with a clone:

```text
target executable wins
```

when evidence is clear.

Example:

```text
target DOS investigation cost = X
clone investigation cost = Y

→ use X as historical evidence
```

Whether Deolane ultimately adopts X is then determined by the project's canonical specification.

---

# PART III — PRIMARY DOCUMENTATION

## 10. Period manual

Reference:

```text
Where in the World Is Carmen Sandiego?
Brøderbund user manual
```

Known archive reference used during research:

```text
https://colorcomputerarchive.com/repo/Documents/Manuals/Games/
Where%20in%20the%20World%20is%20Carman%20Sandiego%20%28Broderbund%29.pdf
```

The manual is valuable for intended rules and terminology.

---

## 11. What the manual is useful for

Use it for:

- intended player objective;
- detective sign-in;
- case assignment structure;
- 30-city claim;
- suspect-dossier concept;
- Crime Computer behavior;
- warrant requirement;
- time pressure;
- Suspicious Presence;
- career/rank intent;
- Hall of Fame concept.

---

## 12. What not to infer blindly from the manual

Do not assume the manual proves:

- exact internal algorithm;
- exact travel matrix;
- exact randomization;
- hidden constants;
- actual bug behavior;
- exact timing where not explicitly documented;
- implementation differences between every supported platform.

Manual describes intended behavior.

Executable establishes actual target behavior.

---

# PART IV — JULIA SANFRANCISCO

## 13. Repository

```text
https://github.com/fmaclen/julia-sanfrancisco
```

Role:

```text
modern browser implementation reference
```

Not:

```text
historical authority
```

---

## 14. Why Julia Sanfrancisco is useful

This repository is especially useful because it demonstrates a similar game loop using a browser-first TypeScript architecture.

Useful areas include:

- content/data separation;
- localization;
- case/round structures;
- witness/place modeling;
- suspect traits;
- generated clues;
- decoy destinations;
- browser-local state;
- modern frontend organization.

---

## 15. Relevant Julia structures

Its game model includes concepts equivalent to:

```text
Scene
Atlas
Round
LocalizedSuspect
Game
```

Useful structural lesson:

```text
case data
≠
rendered screen
```

---

## 16. Julia witness taxonomy

The implementation models three witness roles for classic place families such as:

```text
Airport
Bank
Foreign Ministry
Harbor
Hotel
Library
Marketplace
Museum
Palace
Riverfront
Sport Club
Stock Exchange
```

This is useful for:

- content organization;
- witness grouping;
- data-model comparison.

Do not assume every witness list is exact target-build evidence unless separately verified.

---

## 17. Julia three-scene model

The current implementation generates:

```text
NUMBER_OF_SCENES = 3
```

per round.

This makes it a useful comparison for the three-investigation-location mechanic.

However:

```text
Julia implementation
!= proof of original DOS behavior
```

---

## 18. Julia route structure

The repository currently uses a fixed:

```text
NUMBER_OF_ROUNDS = 6
```

in its game generation.

Deolane must **not** inherit six rounds globally merely because Julia uses them.

Our route lengths are defined by `GAME_SPEC.md`.

---

## 19. Julia decoy structure

Julia builds destinations from:

- previous route city;
- next route city;
- random decoys.

It fills a destination set up to a maximum defined by its own implementation.

This is useful inspiration for:

- recovery;
- previous-city inclusion;
- candidate generation.

It is not our canonical decoy algorithm.

---

## 20. Julia wrong-city recovery

Its decoy-round generation explicitly includes the last anchor city so the player can return to where the suspect was last seen.

This is an important comparative design insight.

Deolane adopts the **concept** through its own explicit trail-anchor rule.

Do not copy Julia's implementation literally.

---

## 21. Julia clue generation

Julia generates destination clues from properties such as:

- currency;
- language;
- flag;
- sights;
- objects;
- topics;
- plane/ship context.

This is useful evidence for a content-driven clue-template architecture.

---

## 22. Julia identity clues

It can attach suspect clues separately from geographic clue text.

This reinforces the architectural usefulness of treating:

```text
destination evidence
and
identity evidence
```

as distinct data dimensions.

---

## 23. What not to copy from Julia

Do not blindly inherit:

- six-round case length;
- its exact decoy count;
- its randomness implementation;
- its timing constants;
- its case progression;
- its simplified final encounter;
- any warrant behavior that differs from `GAME_SPEC.md`;
- any UI choice that departs from the DOS target;
- names/lore/art.

---

## 24. Specific Julia divergence risk

A modern clone may make choices for development convenience.

Examples include:

```text
fixed action times
simplified travel
simplified warrant validation
different route length
browser-oriented UX improvements
```

Every such choice must be compared against our specifications.

---

# PART V — THIEFCATCHER

## 25. Repository

```text
https://github.com/Ponup/thiefcatcher
```

Role:

```text
domain-model / case-architecture comparison reference
```

Not:

```text
historical authority
```

---

## 26. Why Thiefcatcher is useful

The repository exposes domain-oriented concepts including files such as:

```text
PlayerCase.h
PlayerCase.cpp
PlayerCaseManager.h
PlayerCaseManager.cpp
ClueFactory.h
ClueFactory.cpp
```

This makes it useful for analyzing how another implementation decomposes:

- active case state;
- itinerary;
- suspect;
- destinations;
- clues;
- places;
- captured state.

---

## 27. PlayerCase conceptual value

The `PlayerCase` model is useful as comparative inspiration for:

```text
current position
criminal/suspect
next-country candidates
places
clues
stolen object
capture order
itinerary
case dates
```

This reinforces our own decision to maintain an explicit case-definition/runtime-state model.

---

## 28. Wrong-route concept

Thiefcatcher contains logic that can use the previous correct location as a recovery direction after wrong travel.

This is useful as a comparative example of trail recovery.

Deolane implements its own canonical:

```text
trailAnchor
```

model.

---

## 29. ClueFactory value

`ClueFactory` is useful for thinking about clue categories as data-generating strategies.

Comparative clue concepts include:

```text
country/location
criminal/identity
negative
```

This supports the architectural separation in our `ClueGenerator`.

---

## 30. What not to copy from Thiefcatcher

Do not inherit blindly:

- its itinerary length;
- its deadline;
- its number of candidate countries;
- its direct-answer clues;
- any country/city abstraction differences;
- its exact clue distributions;
- C++ architectural patterns unsuited to Svelte/TypeScript;
- GPL-covered implementation code.

---

## 31. License caution

Treat Thiefcatcher as a reference for ideas and behavior.

Do not transplant source code into Deolane.

Independent reimplementation is required.

---

# PART VI — ICARO CARMEN SANDIEGO DOS PROJECT

## 32. Repository

```text
https://github.com/IcaroBernardes/carmen_sandiego_DOS
```

Primary role:

```text
historical data / visual-reference corpus
```

Secondary role:

```text
classic content-structure reference
```

Not:

```text
canonical gameplay engine
```

---

## 33. Why Icaro is valuable

The repository contains a reconstruction/visualization using classic game material and exposes:

- 30-city roster;
- city artwork;
- witness/location imagery;
- suspect dossiers;
- world map;
- classic visual assets;
- classic content relationships.

Its `index.qmd` also demonstrates how those assets are associated with:

- cities;
- locations;
- witnesses;
- suspect profiles.

---

## 34. Icaro visual corpus

Important reference path:

```text
www/
```

Relevant categories include:

```text
www/cities/
www/raws/
www/wrapped/
www/profiles/
www/outlines/
```

plus shared image files.

This corpus is the primary visual reference described in `VISUAL_SPEC.md`.

---

## 35. Icaro city roster

Its source enumerates the classic thirty-city set used during our analysis.

This is useful for:

- historical comparison;
- city-count verification;
- map-reference study.

Our production city data remains controlled by `CONTENT_MODEL.md`.

---

## 36. Icaro suspect dossiers

Its source contains classic suspect information including:

- name;
- sex;
- occupation;
- hobby;
- vehicle;
- feature;
- additional flavor text.

This is useful for understanding dossier information density and presentation.

Do not copy the cast.

---

## 37. Icaro visual-processing warning

Its `R/modify_assets.R` performs post-processing such as:

- resizing;
- transparency manipulation;
- outline creation;
- background replacement;
- wrapping.

Therefore not every PNG in `www/` is an untouched original game bitmap.

`VISUAL_SPEC.md` defines how to distinguish raw versus processed material.

---

## 38. What to observe in Icaro

Observe:

- pixel density;
- silhouette;
- city-scene composition;
- portrait framing;
- witness scale;
- palette tendencies;
- broad color clustering;
- character exaggeration;
- asset categories;
- world-map appearance;
- visual information density.

---

## 39. What not to copy from Icaro

Do not copy:

- source PNGs into production;
- original Carmen art;
- classic suspect art;
- classic logos;
- its Quarto page layout;
- Bootstrap styling;
- its web fonts;
- its tooltip UX;
- its specific R visualization architecture.

The visualization is not the DOS game's UI.

---

# PART VII — REFERENCE MATRIX

## 40. Source responsibility matrix

| Question | Primary reference | Secondary reference |
|---|---|---|
| Exact DOS mechanic | Target executable | Manual |
| Action time | Target executable/runtime | Community analysis |
| Hidden route behavior | Executable/runtime | Julia / Thiefcatcher |
| Warrant algorithm | Executable/manual | Julia |
| Wrong-city recovery | Executable/runtime | Julia / Thiefcatcher |
| DOS UI geometry | Exact target screenshot/runtime | Icaro assets |
| Pixel rendering | Original/raw visual corpus | Icaro processed assets |
| Browser architecture | Our TECH_ARCHITECTURE | Julia |
| Domain case model | Our TECH_ARCHITECTURE | Thiefcatcher |
| Content schemas | Our CONTENT_MODEL | Julia / Icaro |
| Production artwork | VISUAL_SPEC + OpenAI pipeline | DOS/Icaro as reference only |

---

# PART VIII — REFERENCE CONFLICT RULES

## 41. Clone versus original

If a clone contradicts verified DOS behavior:

```text
clone loses
```

---

## 42. Manual versus executable

If manual describes intended behavior but executable demonstrably behaves differently:

Document both.

For historical reconstruction:

```text
runtime executable behavior has priority
```

unless the executable behavior is clearly a bug the project deliberately rejects.

---

## 43. DOS version conflict

If original DOS and Enhanced/Deluxe differ:

Do not average them.

Record:

```text
VERSION A behavior
VERSION B behavior
```

Then choose deliberately.

---

## 44. Visual-source conflict

If an Icaro processed PNG differs from a raw source:

For source rendering analysis:

```text
raw source wins
```

For understanding Icaro's framing/composition:

```text
processed version may still be useful
```

---

# PART IX — ACCEPTANCE PHILOSOPHY

## 45. Four independent acceptance dimensions

The game must pass:

1. mechanical fidelity;
2. interaction/UI fidelity;
3. visual fidelity;
4. technical quality.

Passing only three is insufficient.

---

## 46. No aggregate "close enough"

A build cannot compensate:

```text
excellent graphics
```

for:

```text
wrong warrant mechanics
```

or:

```text
perfect engine
```

for:

```text
modern UI
```

Each critical category has hard gates.

---

# PART X — MECHANICAL ACCEPTANCE

## 47. Case lifecycle

PASS only if:

- [ ] case begins through briefing/assignment;
- [ ] exactly one culprit exists;
- [ ] exactly one stolen item exists;
- [ ] one hidden ordered route exists;
- [ ] starting city is known;
- [ ] culprit identity is unknown;
- [ ] deadline exists.

---

## 48. Three-location rule

PASS only if every generated city investigation state exposes:

```text
exactly 3 places
```

No fourth hidden place.

No two-place simplified mode.

---

## 49. Investigation timing

PASS only if:

```text
first new investigation = 2h
second = 3h
third = 4h
review = 0h
```

and leaving/returning resets the current-visit investigation cost sequence.

---

## 50. Geographic clues

PASS only if:

- [ ] clue information is truthful;
- [ ] correct next destination is not normally named directly;
- [ ] clue set distinguishes next city among candidates;
- [ ] clues require geographic/cultural interpretation;
- [ ] no automatic answer marker exists.

---

## 51. Identity clues

PASS only if:

- [ ] identity evidence describes actual culprit;
- [ ] evidence uses canonical trait categories;
- [ ] enough evidence exists before final city;
- [ ] no contradictory trait clues exist.

---

## 52. Travel

PASS only if:

- [ ] candidate list is constrained;
- [ ] not all world cities are selectable;
- [ ] correct destination is not marked;
- [ ] travel consumes edge-specific time;
- [ ] hidden route remains hidden.

---

## 53. Wrong city

PASS only if:

- [ ] wrong city does not advance route;
- [ ] negative witnesses do not lie;
- [ ] trail anchor remains unchanged;
- [ ] recovery remains possible;
- [ ] wrong trip wastes meaningful time.

---

## 54. Backtracking

PASS only if:

- [ ] furthest route index never decreases;
- [ ] returning to old route city does not move culprit backward;
- [ ] player can recover to current trail anchor.

---

## 55. Warrant system

PASS only if:

```text
0 matches       → no warrant
1 match         → warrant
2+ matches      → no warrant
```

Every committed computation consumes 2 hours.

---

## 56. Wrong warrant

PASS only if the system permits a uniquely matched but incorrect warrant and that wrong warrant fails at final encounter.

The engine must not secretly correct the player.

---

## 57. Final city

PASS only if:

- [ ] three investigation locations exist;
- [ ] exactly one hideout exists;
- [ ] hideout is stable;
- [ ] non-hideout searches do not immediately fail;
- [ ] final search consumes normal investigation time.

---

## 58. Capture

PASS only if all are required:

```text
final city
+
correct hideout
+
currentTime < deadline
+
active warrant
+
warrant suspect == culprit
```

---

## 59. Failure

PASS only if these work:

- [ ] deadline expiration;
- [ ] no warrant at hideout;
- [ ] wrong warrant at hideout;
- [ ] abandonment.

---

## 60. Exact deadline

PASS only if:

```text
time == deadline
```

is too late.

---

## 61. Progression

PASS only if:

- [ ] new profile starts Rookie;
- [ ] successful cases increment solved count;
- [ ] failures do not;
- [ ] failure does not demote;
- [ ] rank thresholds match GAME_SPEC;
- [ ] Deolane final case occurs after 13 solved cases;
- [ ] capture completes Hall of Fame career state.

---

# PART XI — PROCEDURAL ACCEPTANCE

## 62. Determinism

For any accepted test seed:

```text
same seed
+
same content version
+
same generation version
=
same case definition
```

PASS requires byte-equivalent/canonical-equivalent generated definition.

---

## 63. No Math.random dependency

PASS only if generation/domain modules contain no uncontrolled `Math.random()` calls.

---

## 64. Route validity

Across bulk generation:

- [ ] 0 duplicate-city routes;
- [ ] 0 illegal forward edges;
- [ ] route lengths always match rank;
- [ ] final city always reachable.

---

## 65. Geographic solvability

For all generated correct-route city states:

```text
intersection(all useful clue-compatible candidates)
=
{correct destination}
```

---

## 66. Identity solvability

For every accepted case:

```text
guaranteed pre-final evidence
→ exactly 1 suspect
→ actual culprit
```

---

## 67. Temporal solvability

Every accepted case must have at least one reasonable successful path below the configured timing margin.

No case may rely on impossible omniscience.

---

## 68. Bulk generation release gate

Before release, run at least:

```text
1,000 cases × each rank
+
1,000 final Deolane cases
```

Minimum total:

```text
6,000 validated case generations
```

PASS requires zero hard-invariant failures.

---

# PART XII — CONTENT ACCEPTANCE

## 69. Referential integrity

PASS only if:

- [ ] every city reference resolves;
- [ ] every connection resolves;
- [ ] every place resolves;
- [ ] every witness resolves;
- [ ] every suspect trait resolves;
- [ ] every clue template resolves;
- [ ] every asset ID resolves;
- [ ] every baseline localization key resolves.

---

## 70. Suspect matrix

PASS only if:

```text
10 total suspects
1 mastermind
9 subordinate
all complete trait vectors unique
```

---

## 71. City graph

PASS only if:

- [ ] graph connected;
- [ ] 8-city routes can be generated;
- [ ] no unusable isolated city exists;
- [ ] every city permits at least 3 investigation places.

---

# PART XIII — UI ACCEPTANCE

## 72. Logical viewport

PASS only if canonical gameplay UI renders in:

```text
640 × 400 logical pixels
```

without layout reflow.

---

## 73. Standard shell

PASS only if standard city gameplay contains:

- [ ] compact top menu;
- [ ] upper-left city/time panel;
- [ ] left scene artwork panel;
- [ ] right textual/information area;
- [ ] lower-right action region;
- [ ] SEE;
- [ ] DEPART;
- [ ] SEARCH;
- [ ] P.C.

---

## 74. No modern reflow

PASS only if narrow screens scale the fixed game viewport instead of rearranging the interface into a mobile card layout.

---

## 75. Button behavior

PASS only if buttons provide:

```text
normal
hover/focus
pressed
disabled
```

with DOS-style hard bevel behavior.

---

## 76. Keyboard

PASS only if:

- [ ] Tab navigation works;
- [ ] Enter/Space activate focused control;
- [ ] Esc closes safe modal/menu states;
- [ ] lists/menus support keyboard navigation.

---

## 77. Text reveal

PASS only if:

- [ ] typewriter/progressive reveal is supported where specified;
- [ ] first skip input completes text;
- [ ] same skip input does not also advance screen.

---

## 78. Dossier

PASS only if:

- [ ] all ten suspects accessible;
- [ ] portrait visible;
- [ ] five warrant-relevant traits readable;
- [ ] browsing costs no gameplay time;
- [ ] closing restores previous context.

---

## 79. Warrant UI

PASS only if:

- [ ] five fields exist;
- [ ] fields may remain unset;
- [ ] editing is free;
- [ ] compute is explicit;
- [ ] 0/1/multiple result states are distinct;
- [ ] active warrant status can be seen.

---

## 80. Map

PASS only if:

- [ ] current city shown;
- [ ] available candidates shown;
- [ ] selected candidate may be shown;
- [ ] hidden route not shown;
- [ ] correct answer not visually marked.

---

# PART XIV — VISUAL ACCEPTANCE

## 81. Visual target

The final game must appear compatible with an IBM PC DOS graphical title from approximately:

```text
1989–1991
```

Not merely "retro."

---

## 82. Pixel rendering

PASS only if production art has:

- [ ] crisp square pixels;
- [ ] no antialiased sprite fringe;
- [ ] no smooth gradients;
- [ ] limited color use;
- [ ] hard outline behavior;
- [ ] controlled dithering;
- [ ] nearest-neighbor display.

---

## 83. UI visual language

PASS only if:

- [ ] square corners;
- [ ] hard black/gray/light bevels;
- [ ] no glassmorphism;
- [ ] no CSS gradients;
- [ ] no blur;
- [ ] no floating cards;
- [ ] no Material/Bootstrap visual language;
- [ ] no modern icon library visible in gameplay.

---

## 84. Portrait fidelity

Character portrait review must compare production art beside reference portraits at:

```text
1×
and
4× nearest-neighbor
```

PASS requires similar:

- apparent pixel density;
- head-to-body ratio;
- contour thickness;
- shading economy;
- caricature intensity;
- palette discipline.

---

## 85. Deolane identity gate

Every Deolane asset must preserve:

- [ ] blonde hair;
- [ ] enormous exaggerated lips;
- [ ] intense red lipstick;
- [ ] heavy makeup;
- [ ] large earrings;
- [ ] oversized gold necklace;
- [ ] enormous gold pendant;
- [ ] same recognizable character design.

If any primary Deolane visual loses these traits, it fails regardless of general artistic quality.

---

## 86. City fidelity

Each city image must:

- [ ] read geographically without baked text;
- [ ] have one dominant visual identity;
- [ ] use simplified DOS composition;
- [ ] avoid photographic detail;
- [ ] avoid cinematic modern rendering;
- [ ] fit the native scene viewport.

---

## 87. Witness fidelity

Witness sprites must:

- [ ] be occupation-readable;
- [ ] use same caricature system;
- [ ] use transparent/binary-alpha background;
- [ ] not look like a different art pack.

---

## 88. Icon fidelity

Icons must:

- [ ] remain recognizable at native scale;
- [ ] use low color count;
- [ ] use hard contours;
- [ ] avoid modern vector smoothness.

---

# PART XV — ASSET ACCEPTANCE

## 89. Manifest coverage

PASS only if every production art file exists in:

```text
ASSET_MANIFEST.md
```

and runtime registry.

---

## 90. OpenAI generation provenance

Every production artistic PNG must satisfy `VISUAL_SPEC.md`:

```text
OpenAI API generation
→ approved post-processing
→ production PNG
```

Reference-original Carmen PNGs are not production assets.

---

## 91. Dimensions

PASS only if each production PNG matches manifest native dimensions exactly.

---

## 92. Alpha

Transparent assets must meet declared alpha requirements.

Unexpected semitransparent fringe is failure.

---

## 93. Orphan assets

Release build must contain no unexplained production art PNGs outside the asset manifest.

---

# PART XVI — TECHNICAL ACCEPTANCE

## 94. Static runtime

PASS only if production gameplay requires:

```text
no backend
no server API
no database server
no OpenAI request
```

---

## 95. GitHub Pages

PASS only if the game works correctly from a repository subpath equivalent to:

```text
https://<user>.github.io/DeolaneSanPaolo/
```

---

## 96. Engine/UI separation

PASS only if a full deterministic case can be executed in automated tests without mounting Svelte or DOM.

---

## 97. Content/data separation

Adding a valid new city must not require changing:

```text
CaseEngine
WarrantEngine
TimeEngine
```

---

## 98. Asset separation

Changing a city-art filename through registry/manifest update must not alter gameplay code.

---

## 99. Persistence

PASS only if reload preserves:

- [ ] culprit;
- [ ] route;
- [ ] city;
- [ ] clock;
- [ ] visited places;
- [ ] clues;
- [ ] warrant;
- [ ] hideout;
- [ ] progression.

---

## 100. Reload exploit test

PASS only if browser reload cannot:

- reset time;
- undo bad travel;
- reroll clue;
- reroll hideout;
- restore cleared warrant;
- revive failed case.

---

# PART XVII — NARRATIVE ACCEPTANCE

## 101. Opening flow

Once `NARRATIVE_WALKTHROUGH.md` is finalized, PASS only if the implemented opening follows it state-for-state.

At minimum:

```text
boot/title
→ agency
→ player name
→ record search
→ new/returning player response
→ crime/news
→ assignment
→ starting city
```

---

## 102. Case-ending flow

PASS only if success/failure transitions return through the specified post-case/headquarters flow rather than abruptly resetting the game.

---

## 103. Final career flow

PASS only if final Deolane capture receives a distinct narrative resolution and Hall of Fame ending.

---

# PART XVIII — HUMAN PLAYTEST ACCEPTANCE

## 104. Automated tests are not sufficient

The final release requires human playtesting.

Computers can prove a clue set has one mathematical answer.

They cannot prove the clue feels satisfying rather than written by a tax form.

---

## 105. Minimum human sessions

Before first public release, complete at least:

```text
3 full new-player careers
```

using different case seeds.

At least one should be played without developer/debug information.

---

## 106. Human fidelity questions

After each session evaluate:

### Investigation

- Did investigation feel like deduction?
- Did clues require thinking?
- Were wrong choices plausible?
- Was there tension between evidence and time?

### Travel

- Did the world feel like a constrained network?
- Did a wrong destination meaningfully hurt?
- Was recovery understandable without being automatic?

### Warrant

- Did suspect identification feel independent from route tracking?
- Was it possible to feel uncertain before computing?
- Did the warrant feel mechanically necessary?

### UI

- Did the interface feel like DOS software rather than a website?
- Was it compact?
- Did interactions feel deliberate?
- Were modern web patterns visible?

### Visuals

- Did any asset look conspicuously newer?
- Did any image look like AI concept art converted to pixels?
- Did Deolane remain visually consistent?

---

# PART XIX — REFERENCE SCREENSHOT COMPARISON

## 107. Side-by-side requirement

For major gameplay screens, produce comparison sheets:

```text
historical structural reference
beside
Deolane implementation
```

Comparison is for structure/style, not content copying.

---

## 108. Compare

Measure:

- panel ratio;
- text density;
- menu height;
- action-button footprint;
- art-panel footprint;
- border thickness;
- apparent font size;
- negative space;
- color hierarchy.

---

## 109. Drift signs

Reject if comparison reveals:

- significantly more empty space;
- huge modern buttons;
- oversized typography;
- floating overlays;
- softened borders;
- card-like segmentation;
- large HD artwork overwhelming UI;
- mobile-style spacing.

---

# PART XX — ACCEPTANCE TEST SEEDS

## 110. Mandatory deterministic scenarios

Maintain fixed seeds/fixtures for:

```text
ROOKIE_HAPPY_PATH
SLEUTH_HAPPY_PATH
PRIVATE_EYE_HAPPY_PATH
INVESTIGATOR_HAPPY_PATH
ACE_HAPPY_PATH
WRONG_CITY_SINGLE
WRONG_CITY_CHAIN
RETURN_OLD_ROUTE_CITY
ZERO_MATCH_WARRANT
MULTIPLE_MATCH_WARRANT
WRONG_UNIQUE_WARRANT
TIME_EXPIRES_DURING_INVESTIGATION
TIME_EXPIRES_DURING_TRAVEL
TIME_EXPIRES_AT_HIDEOUT
NO_WARRANT_HIDEOUT
WRONG_WARRANT_HIDEOUT
CORRECT_WARRANT_HIDEOUT
DEOLANE_FINAL_SUCCESS
DEOLANE_FINAL_FAILURE
RELOAD_ACTIVE_CASE
```

---

# PART XXI — GOLDEN PATH ACCEPTANCE

## 111. Rookie golden path

Automated E2E must demonstrate:

```text
new detective
→ case briefing
→ investigate
→ deduce route
→ travel correctly
→ collect identity evidence
→ issue correct warrant
→ reach final city
→ find hideout
→ arrest
→ promotion
```

---

## 112. Wrong-route path

Automated E2E:

```text
correct anchor
→ wrong city
→ investigate negative clue
→ another wrong city optional
→ return to anchor
→ resume correct trail
→ still solve case
```

---

## 113. Wrong-warrant path

Automated E2E:

```text
enter traits for wrong unique suspect
→ warrant issued
→ reach actual culprit
→ encounter
→ escape
→ failure state = wrong warrant
```

This ensures warrant correctness is not cosmetic.

---

# PART XXII — RELEASE-BLOCKING FAILURES

## 114. Mechanical blockers

Any of these blocks release:

- correct destination highlighted;
- wrong city accidentally advances route;
- no warrant required for capture;
- wrong warrant still captures culprit;
- route can duplicate city;
- identity clue lies;
- impossible clue set;
- unsolvable case;
- reload rerolls case;
- deadline not enforced.

---

## 115. Visual blockers

Any of these blocks release:

- antialiased production sprite edges;
- smooth-gradient city art;
- obviously modern UI;
- original Carmen artwork accidentally shipped;
- Deolane visual inconsistency;
- non-manifest production PNG;
- wrong native asset size.
- an animation whose DOM/CSS runs but whose intended artwork produces no visible pixel change;
- a new animation without deterministic rendered-frame validation.

---

## 116. Technical blockers

Any of these blocks release:

- API key in frontend bundle;
- backend required for play;
- GitHub Pages subpath broken;
- save corruption on normal reload;
- nondeterministic same-seed generation;
- engine rule implemented only in UI.

---

# PART XXIII — NON-BLOCKING POLISH

## 117. Examples

These may be improved after core acceptance if they do not break experience:

- optional extra sound effects;
- additional clue wording;
- additional stolen items;
- small animation timing polish;
- extra accessibility labels;
- additional locale.

They do not excuse failing core gates.

---

# PART XXIV — FIDELITY SCORECARD

## 118. Release scorecard

Before release, score each section:

| Area | Required result |
|---|---|
| Core gameplay | PASS |
| Case generation | PASS |
| Warrant mechanics | PASS |
| Time/deadline | PASS |
| Wrong-city/backtracking | PASS |
| Progression | PASS |
| UI structure | PASS |
| DOS visual language | PASS |
| Deolane consistency | PASS |
| Asset pipeline | PASS |
| Save/persistence | PASS |
| GitHub Pages deployment | PASS |
| Human playtest | PASS |

There is no weighted average.

Every row must pass.

---

# PART XXV — SOURCE-SPECIFIC "DO NOT COPY" SUMMARY

## 119. Original DOS

Learn:

```text
behavior
timing
flow
screen language
```

Do not ship:

```text
copyrighted art/text/binaries
```

---

## 120. Julia Sanfrancisco

Learn:

```text
browser modeling
round/scene/content structure
decoy/recovery concepts
clue-template ideas
```

Do not inherit:

```text
constants
route length
timing
simplifications
final-capture deviations
```

---

## 121. Thiefcatcher

Learn:

```text
case domain model
itinerary concepts
clue categorization
recovery modeling
```

Do not inherit:

```text
exact case length
deadline
candidate counts
direct-answer clues
source code
```

---

## 122. Icaro

Learn:

```text
visual corpus
classic data organization
portrait/witness/city references
```

Do not inherit:

```text
Quarto UX
Bootstrap styling
processed assets as exact raw truth
original production PNGs
```

---

# PART XXVI — FINAL REFERENCE DECISION TEMPLATE

## 123. When a disputed mechanic is found

Document:

```text
QUESTION:
What is being disputed?

TARGET DOS:
Observed behavior / unknown

MANUAL:
Documented behavior

JULIA:
Behavior

THIEFCATCHER:
Behavior

ICARO:
Relevant evidence or N/A

PROJECT DECISION:
Chosen Deolane behavior

SPEC UPDATED:
Which document/section
```

No silent compromise.

---

# PART XXVII — DEFINITION OF FIDELITY

## 124. Mechanical fidelity

Means the player repeatedly experiences:

```text
investigate
deduce
travel
risk being wrong
identify culprit separately
manage time
obtain warrant
search final location
capture under correct conditions
```

---

## 125. Experiential fidelity

Means the player feels:

- uncertainty;
- pressure;
- satisfaction from interpreting clues;
- punishment for reckless travel;
- temptation to investigate one more location;
- growing confidence in suspect identity;
- pursuit escalation;
- relief or frustration at final encounter.

---

## 126. Visual fidelity

Means the implementation looks technically constrained by the same era:

- hard pixels;
- limited colors;
- fixed panels;
- bitmap text;
- low-resolution art;
- economical animation.

---

## 127. Fidelity is not literal cloning

Deolane San Paolo is not required to reproduce:

- Carmen's name;
- ACME;
- V.I.L.E.;
- original cast;
- original dialogue;
- original stolen objects;
- original art.

Its fiction is new.

Its mechanical and visual grammar intentionally preserves the target experience.

---

# PART XXVIII — FINAL RELEASE PROCEDURE

## 128. Pre-release sequence

Required order:

```text
1. content validation
2. asset validation
3. typecheck
4. unit tests
5. integration tests
6. bulk-generation validation
7. E2E test suite
8. native-resolution visual regression
9. GitHub Pages preview deployment
10. human full-career playtest
11. acceptance scorecard
12. release
```

---

## 129. GitHub Pages preview

Before production publication, validate from the real static-hosting environment.

Do not accept only:

```text
localhost works
```

as proof.

---

# PART XXIX — FINAL DIRECTIVE

## 130. The references exist to constrain invention

Do not use them as excuses to copy blindly.

Do not use them as excuses to redesign freely either.

The correct workflow is:

```text
observe
↓
measure
↓
compare
↓
document
↓
decide
↓
specify
↓
implement independently
↓
test against the intended experience
```

The project is finished only when the resulting browser game is:

```text
technically clean
+
mechanically coherent
+
procedurally fair
+
visually period-authentic
+
experientially recognizable
```

A game that compiles is not necessarily the game we intended.

A game that resembles the screenshot is not necessarily mechanically faithful.

A game with the right rules but modern UX is not faithful either.

All of these dimensions must agree.

**`REFERENCES_AND_ACCEPTANCE.md` is the final anti-drift gate for Deolane San Paolo.**
