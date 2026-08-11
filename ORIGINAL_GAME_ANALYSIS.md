# ORIGINAL_GAME_ANALYSIS.md

## 1. Purpose of this document

This document is the forensic and historical analysis layer for **Deolane San Paolo / `DeolaneSanPaolo`**.

Its purpose is to determine, as accurately as possible, how the target classic DOS investigation game actually behaves before those behaviors are translated into the new game's canonical specifications.

This document is **not** the final game design.

It must answer:

> What did the reference game actually do?

The downstream specifications answer:

> What will Deolane San Paolo do?

Those are deliberately separate questions.

The original game is a behavioral, structural and visual reference. Deolane San Paolo will be an independent browser implementation with original characters, narrative, dialogue, organization, assets and branding.

---

## 2. Current status

**Document state:** baseline research before full executable reverse engineering.

At the moment this document contains:

- behaviors explicitly documented by period manuals;
- behavior described by reputable historical sources;
- information recovered by previous third-party reverse-engineering efforts;
- observations from comparison implementations;
- known implementation differences among those comparison projects;
- a structured list of unanswered questions that must be investigated against the exact target DOS build.

It does **not** yet claim that the original DOS executable has been fully reverse engineered.

No unknown value in this document may silently become a canonical Deolane San Paolo rule merely because it "sounds right."

---

## 3. Target-version warning

The Carmen Sandiego series contains several editions and ports with overlapping names and similar gameplay.

Potentially relevant branches include:

- original 1985/1986 computer release;
- IBM PC / DOS version;
- Apple II version;
- Commodore version;
- Macintosh / Apple IIGS versions;
- Amiga version;
- 1989 Enhanced edition;
- 1992 Deluxe edition;
- console ports such as Master System, Genesis, NES and SNES.

These versions must **not** be treated as mechanically identical without evidence.

### Working target

Until the precise supplied executable is fingerprinted, the working historical target is:

> **The original IBM PC / DOS lineage of _Where in the World Is Carmen Sandiego?_ associated with the 1985/1986 release, with special attention to the specific DOS build represented by the user's childhood experience and supplied visual references.**

However, the supplied screenshots may originate from a later DOS-compatible or graphically revised release.

Therefore, before executable-level findings are accepted, Codex must identify the exact build.

### Mandatory rule

Never merge behavior from:

```text
original DOS
+ Enhanced
+ Deluxe
+ Macintosh
+ Amiga
+ console ports
```

into a fictional "original game" unless each behavior has been independently verified for the selected target build.

---

## 4. Evidence classification

Every nontrivial finding added to this document must carry one of the following statuses.

### `CONFIRMED_BINARY`

Confirmed through static analysis of the exact target executable or its data files.

Examples:

- a constant found in code;
- a travel matrix recovered from a data structure;
- a rank threshold found in a save structure;
- a function that clearly advances the clock by a fixed value.

This is the strongest evidence class.

---

### `CONFIRMED_RUNTIME`

Repeatedly demonstrated by executing the exact target DOS build under controlled conditions.

A runtime finding should ideally include:

- starting state;
- exact action;
- resulting state;
- number of repetitions;
- whether different ranks/cities/cases were tested.

---

### `CONFIRMED_MANUAL`

Explicitly documented in a period manual applicable to the relevant computer release.

Manual documentation is strong evidence for intended behavior, but implementation details should still be verified when exact mechanical fidelity matters.

---

### `CONFIRMED_DATA`

Recovered directly from a target game data/save/resource file without necessarily identifying the executable code that consumes it.

---

### `HISTORICAL_SECONDARY`

Reported by a reputable historical, archival or museum source but not yet confirmed against the target executable.

---

### `COMMUNITY_SECONDARY`

Reported by a FAQ, walkthrough, fan analysis or community resource.

Useful for generating hypotheses, not sufficient by itself for exact implementation.

---

### `COMPARATIVE_IMPLEMENTATION`

Observed in a third-party clone or recreation.

This describes **that implementation**, not necessarily the original.

---

### `HYPOTHESIS`

A plausible interpretation awaiting verification.

---

### `UNKNOWN`

Insufficient evidence.

---

## 5. Evidence precedence

When evidence conflicts, use this default order:

```text
CONFIRMED_BINARY
    ↓
CONFIRMED_DATA
    ↓
CONFIRMED_RUNTIME
    ↓
CONFIRMED_MANUAL
    ↓
HISTORICAL_SECONDARY
    ↓
COMMUNITY_SECONDARY
    ↓
COMPARATIVE_IMPLEMENTATION
    ↓
HYPOTHESIS
```

This order is not absolute.

For example, if binary analysis reveals dead or unused data while runtime testing proves another behavior, runtime behavior wins for gameplay reproduction.

Any conflict must be documented explicitly.

---

# PART I — BASELINE HISTORICAL BEHAVIOR

## 6. Fundamental game structure

### Finding OG-001 — The player is an ACME detective

**Status:** `CONFIRMED_MANUAL`

The player operates as a newly recruited detective working for the Acme Detective Agency.

The reference fiction establishes an international criminal organization led by Carmen Sandiego and a detective agency tasked with tracking its members.

### Relevance to Deolane San Paolo

Preserve the structural role:

```text
player
    ↓
detective/investigator organization
    ↓
assigned cases
    ↓
international criminal network
    ↓
recurring mastermind
```

Do not preserve the proprietary organization names or narrative wording.

---

## 7. Boot and sign-in flow

### Finding OG-002 — Animated introduction exists

**Status:** `CONFIRMED_MANUAL`

The IBM instructions state that launching the program causes an animated introduction to play, after which the player can begin the game.

### Finding OG-003 — The player signs in by name

**Status:** `CONFIRMED_MANUAL`

The investigation begins at the detective agency.

The player types a detective name into the Crime Computer.

The period manual specifies a maximum of **14 letters and spaces** for the sign-in name in the referenced release.

### Finding OG-004 — Assignment follows sign-in

**Status:** `CONFIRMED_MANUAL`

After sign-in, the computer provides the details of the assignment and starts the investigation.

### Exact typewriter/computer wording

**Status:** `UNKNOWN`

The specific presentation remembered by the project owner, including a machine/typewriter reacting that it has never seen the new player before, must be verified against the exact target build.

The manual confirms sign-in and assignment sequencing, but does not establish every line of the on-screen dialogue.

### Required investigation

Record the exact first-run sequence frame by frame:

```text
launch
→ intro animation
→ start input
→ sign-in screen
→ player name submitted
→ database/search response
→ new-player response
→ crime bulletin
→ assignment details
→ first interactive case screen
```

Also test an already-known player name and compare the sequence.

---

## 8. Case premise

### Finding OG-005 — Each assignment concerns a stolen treasure/object

**Status:** `CONFIRMED_MANUAL`

Each case gives the detective a new assignment involving a stolen treasure and a suspect.

The player begins from the known location associated with the crime and pursues the thief from city to city.

### Finding OG-006 — Cases vary

**Status:** `CONFIRMED_MANUAL`

The manual explicitly describes assignments as varying in:

- starting city;
- stolen treasure;
- suspect.

### Exact procedural generation algorithm

**Status:** `UNKNOWN`

It remains unknown whether all of these elements are selected independently, table-driven, constrained by rank or tied to preauthored case templates in the target build.

---

## 9. World size

### Finding OG-007 — Thirty cities exist in the reference world

**Status:** `CONFIRMED_MANUAL`

The manual states that the thief may be hiding in one of **30 cities**.

### Historical 30-city set

The following set is reproduced by the comparative historical project `IcaroBernardes/carmen_sandiego_DOS` and is consistent with known classic-game material.

**Status:** `COMPARATIVE_IMPLEMENTATION` pending verification against target resources.

1. Mexico City
2. London
3. Moscow
4. Istanbul
5. Baghdad
6. Tokyo
7. Port Moresby
8. New Delhi
9. Buenos Aires
10. Sydney
11. City of San Marino
12. Singapore
13. Rome
14. Reykjavik
15. Peking
16. Montreal
17. Lima
18. New York
19. Paris
20. Colombo
21. Budapest
22. Kathmandu
23. Bangkok
24. Cairo
25. Athens
26. Rio de Janeiro
27. Kigali
28. Bamako
29. Moroni
30. Oslo

### Required verification

Recover the city table from the target game files if possible.

For each city record identify:

- internal ID;
- display name;
- country;
- coordinates;
- connected destinations;
- visual resource;
- clue attributes;
- any rank restrictions;
- any city-specific timing value.

---

## 10. Constrained travel network

### Finding OG-008 — The player reasons from available connections

**Status:** `CONFIRMED_MANUAL`

The manual's own clue-solving instructions tell the player to inspect the available connections before researching geographic clues.

This strongly establishes that the game does **not** present all world cities as equally available destinations from every location.

Instead, the current city exposes a constrained set of candidate destinations.

### Model

Conceptually:

```text
CURRENT CITY
    ├── candidate destination A
    ├── candidate destination B
    ├── candidate destination C
    └── possibly additional candidate(s)
```

Exactly one candidate normally advances the pursuit.

### Exact graph

**Status:** `UNKNOWN`

The following must be recovered:

- complete city adjacency graph;
- whether adjacency is directional or symmetrical;
- whether candidates are fixed per city or generated dynamically;
- number of available connections per city;
- whether rank affects candidate count;
- whether previous city is always offered;
- whether decoys are generated or static.

Do not implement the final travel graph until this is known or consciously redesigned in `GAME_SPEC.md`.

---

## 11. Geographic deduction

### Finding OG-009 — Clues identify the next destination indirectly

**Status:** `CONFIRMED_MANUAL`

The player receives clues that may identify:

- the destination city itself;
- the country containing that city;
- a cultural/geographic attribute associated with the destination.

The game expects the player to interpret information rather than simply follow an explicit destination marker.

The bundled World Almanac was part of this deduction loop.

### Confirmed clue concepts

Manual examples demonstrate clues involving topics such as:

- currency;
- fauna/geography;
- regional information.

Other categories remain to be catalogued directly from game resources.

### Design significance

The key mechanic is not:

```text
CLUE → explicit destination
```

It is:

```text
AVAILABLE CONNECTIONS
        +
GEOGRAPHIC CLUE
        +
PLAYER KNOWLEDGE / REFERENCE
        ↓
NEXT DESTINATION
```

This distinction is fundamental and must survive into Deolane San Paolo.

---

## 12. Two simultaneous investigations

### Finding OG-010 — The player tracks location and identity independently

**Status:** `CONFIRMED_MANUAL`

The game maintains two parallel deduction problems.

### Geographic thread

```text
Where did the thief go?
```

### Identity thread

```text
Which known criminal is the thief?
```

Witnesses provide clues to both.

The player may know the correct route without yet knowing the culprit's identity, and vice versa.

This dual-progress structure is one of the core mechanics to preserve.

---

## 13. Suspect pool

### Finding OG-011 — Ten possible suspects

**Status:** `CONFIRMED_MANUAL`

The manual states that there are **10 possible suspects**.

Carmen is described as the most elusive member of the group.

### Classic suspect set

The period manual and historical sources identify the classic dossiers including:

- Carmen Sandiego
- Merey LaRoc
- Dazzle Annie Nonker
- Lady Agatha Wayland
- Len "Red" Bulk
- Scar Graynolt
- Nick Brunch
- Fast Eddie B.
- Ihor Ihorovich
- Katherine "Boom-Boom" Drib

**Status:** `CONFIRMED_MANUAL` for the dossier roster in the referenced manual lineage.

### Deolane San Paolo implication

The new game may preserve a ten-suspect structure while replacing every character.

The exact new cast belongs in `CONTENT_MODEL.md` and narrative specifications.

---

## 14. Suspect identity traits

### Finding OG-012 — The Crime Computer matches identifying characteristics

**Status:** `CONFIRMED_MANUAL`

The player enters identifying characteristics into the Crime Computer.

The computer compares the supplied traits against the suspect dossiers.

Known historical dossier concepts include features such as:

- sex/gender presentation;
- hair;
- hobby/interests;
- vehicle;
- distinctive physical feature or accessory.

The exact trait set varies in descriptions across ports and documentation and must be verified against the exact target build.

### Required binary/data analysis

Recover:

- all trait categories;
- all allowed values for each category;
- which trait values belong to each suspect;
- whether any suspect shares the exact same partial combinations;
- whether clues map directly to encoded trait values;
- whether contradictory entered traits are possible.

---

## 15. Warrant algorithm

### Finding OG-013 — A warrant requires a unique suspect match

**Status:** `CONFIRMED_MANUAL`

When the player submits characteristics to the Crime Computer:

```text
entered traits
      ↓
compare against suspect records
      ↓
matching suspects
```

If more than one suspect matches, the computer returns multiple possible suspects and no warrant is issued.

If exactly one suspect matches, an arrest warrant is issued for that suspect.

This behavior is strongly documented and should be treated as a central mechanical reference.

### Conceptual algorithm

```pseudo
matches = all suspects matching every entered trait

if matches.length == 1:
    issue warrant(matches[0])
else:
    display matches
    no new unique warrant
```

### Still unresolved

Verify:

- behavior when zero suspects match;
- whether computing consumes time;
- exact time cost;
- whether an existing warrant can be replaced;
- whether changing evidence invalidates a warrant;
- whether conflicting evidence can be entered;
- whether warrant creation is automatic at one match or requires explicit Compute action;
- exact failure behavior for a warrant issued for the wrong suspect.

---

## 16. Warrant requirement at capture

### Finding OG-014 — Finding the thief is insufficient without the correct warrant

**Status:** `CONFIRMED_MANUAL`

A correct arrest warrant must be obtained before catching up with the criminal.

The manual explicitly establishes that without a warrant for the correct suspect the player cannot make the arrest and the thief escapes.

### Core invariant for later specification

Unless consciously changed:

```text
FINAL LOCATION
    +
THIEF FOUND
    +
CORRECT ACTIVE WARRANT
    +
WITHIN DEADLINE
        ↓
ARREST
```

Merely reaching the thief must not automatically equal victory.

---

## 17. Investigation locations

### Finding OG-015 — The player chooses locations to investigate

**Status:** `CONFIRMED_MANUAL`

The manual describes selecting locations to investigate and warns that visiting more locations consumes valuable time.

### Exact number of available locations

**Status:** `UNKNOWN` for the exact target build.

Comparison implementations and some ports commonly use three investigation destinations per city, but this must not be promoted to target-DOS fact without verification.

### Candidate location families seen in classic/comparative material

The classic visual/content vocabulary includes places such as:

- airport;
- bank;
- foreign ministry / diplomatic office;
- harbor;
- hotel;
- library;
- marketplace;
- museum;
- palace;
- riverfront;
- sports club;
- stock exchange.

**Status:** mixed `CONFIRMED_MANUAL` / `COMPARATIVE_IMPLEMENTATION`; exact per-build pool requires verification.

### Required investigation

For every city and multiple cases, record:

- number of investigation slots;
- whether locations are random;
- whether the same location set can repeat;
- whether specific cities exclude certain location types;
- whether each location determines clue category;
- whether the NPC within a location changes;
- whether revisiting a location yields the same clue.

---

## 18. Witnesses and clue delivery

### Finding OG-016 — Local informants/witnesses provide clues

**Status:** `CONFIRMED_MANUAL`

The player gathers information while investigating locations.

Clues may concern either:

- the next destination;
- the thief's identity.

### Exact clue allocation algorithm

**Status:** `UNKNOWN`

Need to determine:

- how many clue-bearing locations exist per city;
- whether every visit yields useful information;
- whether identity and destination clues can appear together;
- whether clue type is tied to building type;
- whether clue selection is random;
- whether clues are generated from templates;
- whether some responses are deliberately useless;
- whether clue usefulness scales with rank.

---

## 19. Wrong destination behavior

### Finding OG-017 — Wrong routes waste time and require recovery

**Status:** `HISTORICAL_SECONDARY`

The Strong National Museum of Play describes the classic loop as follows in paraphrase:

- a correct destination produces confirmation through a V.I.L.E. presence;
- a wrong destination leads to interactions indicating the trail is cold;
- the player must backtrack.

This is highly consistent with remembered gameplay and later implementations.

### Exact target behavior

**Status:** requires `CONFIRMED_RUNTIME` / `CONFIRMED_BINARY`.

Verify:

- whether clues in a wrong city are all negative;
- whether the only progress route becomes the previous correct city;
- whether the player may travel from the wrong city to unrelated cities;
- whether the engine explicitly tracks "last correct city";
- exact travel/time penalty;
- whether wrong-city NPCs are chosen from unique text pools.

---

## 20. Suspicious Presence feedback

### Finding OG-018 — A V.I.L.E. crony signals correct pursuit

**Status:** `CONFIRMED_MANUAL`

The manual calls out a "Suspicious Presence" that crosses the screen when the player is on the correct trail.

It also indicates that danger escalates as the detective gets closer.

### Mechanical role

At minimum this is feedback that the current route remains valid.

### Unknowns

Determine:

- whether occurrence is guaranteed or probabilistic;
- exact pursuit stages at which it appears;
- whether animation depends on rank;
- whether multiple variants exist;
- whether it affects time;
- whether later "danger" scenes are purely cosmetic or mechanically meaningful.

---

## 21. Time pressure

### Finding OG-019 — Time is the central consumable resource

**Status:** `CONFIRMED_MANUAL`

The manual repeatedly warns that:

- investigating costs time;
- using the Crime Computer costs valuable hours;
- unnecessary travel wastes time;
- the thief must be caught before the deadline.

The player is therefore optimizing information gain against a finite clock.

### Core strategic tension

```text
more investigation
    → more certainty
    → less remaining time

less investigation
    → more remaining time
    → greater deduction risk
```

### Exact time economy

**Status:** `UNKNOWN`

Do not hard-code remembered or FAQ-derived values into `GAME_SPEC.md` until the target build is tested.

Must recover:

- initial day/time;
- final deadline day/time;
- first investigation cost;
- second investigation cost;
- third investigation cost;
- whether investigation cost increments within a city visit;
- Crime Computer cost;
- dossier cost, if any;
- travel cost;
- whether travel time depends on origin/destination;
- overnight/sleep behavior;
- whether reaching a certain hour automatically advances to next morning;
- whether animation time and game-clock time are independent;
- whether returning to a city resets local investigation costs.

---

## 22. Travel time

### Finding OG-020 — Travel consumes in-game time

**Status:** `CONFIRMED_MANUAL`

Travel is one of the actions against the finite case clock.

### Fixed versus weighted flight time

**Status:** `UNKNOWN`

This is a high-priority reverse-engineering target.

Potential models include:

```text
A. every flight costs the same
B. cost is based on route edge
C. cost is based on geographic distance
D. cost uses a fixed origin/destination matrix
E. cost varies with rank or case
```

Comparison projects implement different simplifications and therefore cannot answer this question.

---

## 23. Final destination and arrest encounter

### Finding OG-021 — The pursuit ends when the player catches up with the thief

**Status:** `CONFIRMED_MANUAL`

The player must track the criminal to the end of the route and possess the correct warrant.

### Final local hiding-place mechanic

**Status:** `UNKNOWN` for exact target build behavior.

Comparison implementations model the final criminal as hiding at one of the investigation locations, but this exact mechanism must be verified.

Determine:

- how the final city is signaled;
- whether ordinary clues change;
- whether each local location says the criminal is nearby;
- whether only one local location triggers capture;
- whether the hiding place is random;
- whether the criminal can be encountered immediately on arrival;
- whether an incorrect/no warrant causes immediate escape;
- whether the player can leave and return after reaching the final city.

---

## 24. Failure

### Finding OG-022 — Running out of time causes the criminal to escape

**Status:** `CONFIRMED_MANUAL`

The case has a deadline.

Failure to catch the thief in time results in escape.

### Finding OG-023 — Catching up without a correct warrant also fails

**Status:** `CONFIRMED_MANUAL`

The player cannot legally arrest the suspect without the correct warrant.

### Other possible failure modes

**Status:** `UNKNOWN`

Investigate:

- whether wrong warrant causes a distinct failure message;
- whether zero-match warrant input has a penalty;
- whether voluntarily abandoning a case exists;
- whether repeated failures affect rank;
- whether progress can be demoted.

---

## 25. Career progression

### Finding OG-024 — Five detective ranks

**Status:** `CONFIRMED_MANUAL`

The manual states that the player starts as a Rookie and progresses through five levels until Ace Detective.

The rank names associated with the classic computer lineage are:

1. Rookie
2. Sleuth
3. Private Eye
4. Investigator
5. Ace Detective

The rank names are additionally supported by save-file analysis performed by a third-party DOS reverse-engineering article.

### Finding OG-025 — Successful cases drive progression

**Status:** `CONFIRMED_MANUAL`

Solving cases advances the detective's career.

### Exact promotion thresholds

**Status:** `UNKNOWN`

Community sources and console ports expose thresholds, but these must not automatically be applied to the target DOS build.

A third-party analysis of `ACME.DAT` confirms that a solved-case count and encoded rank value are stored, but that analysis did not fully recover every promotion threshold.

---

## 26. Promotion knowledge check

### Finding OG-026 — Promotion may involve a reference-book question

**Status:** `COMMUNITY_SECONDARY` / partial data evidence.

Third-party DOS save-file analysis reports that after certain solved-case thresholds, the player is presented with a question that must be answered to move to the next rank.

This aligns with the historical role of the bundled World Almanac.

### Required verification

Determine:

- whether every promotion requires a question;
- question selection algorithm;
- answer format;
- number of attempts;
- failure consequences;
- whether this also served copy protection;
- exact thresholds triggering each promotion;
- whether the mechanism differs by DOS revision.

Do not define the Deolane promotion system until this is resolved or consciously redesigned.

---

## 27. Hall of Fame / end-state

### Finding OG-027 — Hall of Fame exists

**Status:** `CONFIRMED_MANUAL`

The Game menu includes a Hall of Fame for detectives who have captured Carmen.

### Save-data support

**Status:** `COMMUNITY_SECONDARY`

A third-party analysis of the DOS `ACME.DAT` file identifies:

- detective records;
- solved-case count;
- encoded rank;
- Hall of Fame data;
- stored Hall of Fame names.

This is useful evidence about persistent progression structure.

### Exact career ending

**Status:** partially confirmed; target runtime verification required.

Investigate:

- when Carmen becomes the actual culprit;
- whether she can appear before the final career stage;
- how many total successful cases are required;
- exact retirement flow;
- Hall of Fame insertion behavior;
- whether the player can continue under an alias.

---

# PART II — UI AND PLAYER-FACING FLOW

## 28. Main play screen

The project's supplied screenshot reference depicts a compact desktop-style DOS interface with:

- top menu bar;
- city/date panel on the upper-left;
- city artwork below it;
- large information/text area on the right;
- action controls in the lower-right.

### Status

**Version attribution:** `UNKNOWN`

Do not yet assume that this exact screenshot is from the same 1985/1986 IBM PC build as the behavioral manual.

Before `UI_UX_SPEC.md` treats exact geometry as canonical:

1. identify screenshot source/build;
2. compare against the supplied executable;
3. record native resolution;
4. measure panel coordinates;
5. identify fonts;
6. identify border thickness;
7. identify button states;
8. identify palette.

The desired Deolane interface may intentionally target this screenshot even if it belongs to a later DOS revision, but that must be an explicit project decision rather than an accidental version mix.

---

## 29. Menu structure

### Known manual-level elements

**Status:** `CONFIRMED_MANUAL`, with labels/build differences possible.

Documented concepts include:

- Police Dossiers;
- Hall of Fame;
- detective roster;
- new game;
- quit;
- investigation/location selection;
- departure/travel;
- Crime Computer.

### Exact menu labels and icon positions

**Status:** `UNKNOWN`

Recover directly from the target build.

---

## 30. Text presentation

### Working observation

The desired reference experience uses machine/terminal/typewriter-like staged text presentation rather than a modern dialogue system.

### Exact original behavior

**Status:** `UNKNOWN`

Test and document:

- character-by-character typing speed;
- whether typing can be skipped;
- whether key presses accelerate text;
- whether punctuation produces pauses;
- whether text auto-advances;
- whether dialogue is modal;
- whether there are sound effects per character/line;
- whether text overwrites or scrolls;
- text-panel line capacity.

This information belongs here as evidence and later becomes exact behavior in `NARRATIVE_WALKTHROUGH.md` and `UI_UX_SPEC.md`.

---

# PART III — DATA STRUCTURES TO RECOVER

## 31. Target data inventory

When original DOS files are supplied, produce a table like:

| File | Size | SHA-256 | Suspected role | Status |
|---|---:|---|---|---|
| `CARMEN.EXE` | TBD | TBD | Main executable | UNKNOWN |
| `ACME.DAT` | TBD | TBD | Detective/progression data | hypothesis based on secondary analysis |
| ... | ... | ... | ... | ... |

Do not assume filenames from another disk release.

Inventory the actual supplied package.

---

## 32. City records

Attempt to recover a normalized structure:

```text
CityRecord
- id
- display_name
- country
- coordinates
- connections[]
- clue_attributes[]
- visual_resource_id
- optional travel weights
```

Record whether these fields genuinely exist together or are spread across multiple tables.

---

## 33. Suspect records

Attempt to recover:

```text
SuspectRecord
- id
- display_name
- sex/gender trait
- hair trait
- hobby trait
- vehicle trait
- distinguishing feature trait
- biography/dossier text
- portrait resource
```

Do not force this schema onto the binary if the original uses a different representation.

The goal is to understand the actual structure first.

---

## 34. Clue records

Determine whether clues are stored as:

- complete prewritten strings;
- sentence templates plus attribute substitutions;
- indexed fragments;
- city-specific blocks;
- building-specific blocks;
- rank-specific tables;
- some combination of the above.

Desired recovered representation:

```text
Clue
- id
- type
- target attribute
- location/building constraints
- difficulty/rank constraints
- text/template
```

But record the original form before normalization.

---

## 35. Route generation data

Determine whether the pursuit route is:

- generated dynamically;
- selected from preauthored routes;
- generated through city adjacency;
- generated without regard to adjacency and then presented through decoys;
- rank-dependent.

Recover any constraints such as:

- no duplicate cities;
- no immediate return;
- minimum geographic separation;
- fixed route length;
- rank-based route length.

---

## 36. Clock representation

Identify:

- internal unit;
- starting timestamp;
- deadline timestamp;
- action cost constants;
- day rollover;
- sleep/closed-hours rules, if any.

Determine whether the game stores:

```text
absolute hour counter
```

or:

```text
day + hour
```

or another representation.

---

## 37. Detective save format

Based on secondary DOS analysis, `ACME.DAT` is a promising target.

Do not rely on external offsets until verified against the supplied copy.

Recover:

- record length;
- player-name field;
- solved-case field;
- rank field;
- current case state;
- Hall of Fame structure;
- save versioning;
- maximum detective count.

Make a copy before every mutation experiment.

---

# PART IV — COMPARISON PROJECTS

## 38. `fmaclen/julia-sanfrancisco`

### Usefulness

**Status:** `COMPARATIVE_IMPLEMENTATION`

This project is explicitly described by its author as a browser-based clone/proof of concept inspired by the classic game.

Useful concepts include:

- TypeScript browser architecture;
- separate `Game`, `Round`, `Atlas`, `Scene` and suspect structures;
- generated route rounds;
- geographic clue templates;
- suspect clue filtering;
- three generated scenes;
- decoy destinations;
- local browser persistence;
- localization-friendly structure.

### Known deviations that must not be copied blindly

Observed implementation behavior includes:

- six generated rounds;
- up to five destination choices/decoys;
- fixed four-hour flight advancement;
- fixed two-hour investigation advancement;
- a final-capture condition that is not clearly gated by a correct warrant in the same way as the classic manual requires.

These are excellent examples of why this repository is reference material rather than authority.

---

## 39. `Ponup/thiefcatcher`

### Usefulness

**Status:** `COMPARATIVE_IMPLEMENTATION`

Architecturally valuable concepts include:

- `PlayerCase`;
- explicit itinerary;
- current country;
- candidate next countries;
- country places;
- clue factory;
- criminal data;
- capture-order state;
- case timestamps.

Its wrong-route model is also useful conceptually: when off the correct route, the previous correct location can become the recovery target.

### Known simplifications

Observed implementation behavior includes:

- a random five-country itinerary;
- seven-day deadline;
- three candidate next countries;
- simple randomized place selection;
- clue types such as country, criminal and negative;
- some clues that directly name the answer.

These are not evidence of original DOS mechanics.

---

## 40. `IcaroBernardes/carmen_sandiego_DOS`

### Usefulness

**Status:** `COMPARATIVE_IMPLEMENTATION`

This project is primarily a data visualization / interactive homage rather than a full game engine.

Useful material includes:

- reconstructed 30-city set;
- classic suspect dossier information;
- city artwork references;
- location/NPC visual references;
- original-style visual composition.

### Limitation

Much of its scenario is explicitly hard-coded for presentation.

Do not derive procedural mechanics from it.

---

# PART V — REVERSE ENGINEERING PLAN

## 41. Phase 1 — Fingerprint the exact build

Before analyzing behavior:

1. copy the supplied DOS game into a read-only reference workspace;
2. enumerate every file recursively;
3. record file sizes;
4. calculate SHA-256 hashes;
5. inspect executable headers;
6. identify EXE/COM format;
7. search embedded copyright/version strings;
8. compare release metadata;
9. identify graphics mode expectations;
10. determine whether this is original, Enhanced, Deluxe or another revision.

Produce:

```text
reverse-engineering/build-fingerprint.md
```

or incorporate the results into this document.

### Required outcome

A statement such as:

```text
TARGET BUILD:
IBM PC DOS
release/revision: ...
executable hash: ...
disk/resource set hash: ...
confidence: ...
```

No executable-specific conclusion is trustworthy until this step is complete.

---

## 42. Phase 2 — Static file reconnaissance

Perform non-destructive inspection.

Look for:

- readable strings;
- city names;
- suspect names;
- location names;
- clue fragments;
- rank names;
- UI labels;
- file format signatures;
- image/resource blocks;
- palette data;
- save records;
- possible lookup tables.

Create a map:

```text
file
→ offsets/sections
→ suspected data
→ evidence
```

---

## 43. Phase 3 — Executable analysis

Use available DOS/x86 reverse-engineering tools.

Potential tooling may include:

- Ghidra;
- IDA Free;
- radare2 / Cutter;
- objdump-compatible tooling where useful;
- hex editors;
- DOSBox-X debugger or another DOS debugger.

The exact tool does not matter as much as preserving evidence.

Focus on locating code paths associated with strings such as:

- city names;
- rank names;
- "warrant";
- "Interpol";
- action labels;
- time/deadline messages;
- Hall of Fame;
- promotion text.

Cross-references from known strings can lead to gameplay functions.

---

## 44. Phase 4 — Controlled runtime experiments

Run the exact target build in an emulator suitable for reproducible testing.

Prefer an emulator/debugger that supports:

- pause;
- memory inspection;
- breakpoints if possible;
- deterministic CPU configuration;
- screenshots;
- save states when appropriate.

For each experiment record:

```text
TEST ID
build hash
player rank
case seed/state if known
current city
current day/time
action
result
time delta
screen/message
memory/save delta if captured
```

---

## 45. Phase 5 — Differential save analysis

Where the game writes a detective/save file:

1. preserve baseline file;
2. perform exactly one game action;
3. exit/save safely;
4. diff binary file;
5. repeat with controlled changes.

Useful experiments:

```text
change player name only
solve one case
fail one case
receive promotion
issue warrant
capture Carmen
enter Hall of Fame
```

This can expose fields more cheaply than disassembly.

---

## 46. Phase 6 — Clock experiments

This is a priority because previous sources disagree or simplify it.

Create tests for:

### Investigation

```text
same city
visit location #1
record delta

visit location #2
record delta

visit location #3
record delta

return/re-enter
repeat
```

### Crime Computer

```text
open only
compute with no traits
compute with partial traits
compute unique warrant
repeat
```

### Travel

Test many origin/destination pairs.

Build:

| Origin | Destination | Clock delta | Rank | Notes |
|---|---|---:|---|---|

Then determine whether:

- every edge shares one value;
- edge values are fixed;
- values correlate with geographic distance;
- values come from a matrix.

---

## 47. Phase 7 — Route experiments

For each rank generate a large sample of cases.

Record:

- starting city;
- every correct city;
- route length;
- candidate destinations;
- repeated cities;
- final city;
- culprit.

Target sample:

```text
minimum 30 cases per rank
preferred 100+ if automation is practical
```

Infer:

- rank-based route lengths;
- graph constraints;
- candidate-count rules;
- route randomness.

Do not automate input against the executable if doing so would make observations less trustworthy than manual controlled testing; use the simplest reliable method.

---

## 48. Phase 8 — Clue experiments

Build a clue corpus.

For every clue capture:

- exact text;
- current city;
- target city;
- investigation location;
- NPC/witness;
- rank;
- clue type;
- inferred answer;
- whether suspect trait also appears.

Classify:

```text
DESTINATION_CURRENCY
DESTINATION_LANGUAGE
DESTINATION_LANDMARK
DESTINATION_HISTORY
DESTINATION_GEOGRAPHY
DESTINATION_FAUNA
DESTINATION_OTHER

IDENTITY_HAIR
IDENTITY_HOBBY
IDENTITY_VEHICLE
IDENTITY_FEATURE
IDENTITY_OTHER

NEGATIVE
WRONG_CITY
FINAL_CITY
```

These category names are analytical labels, not claims about original internal enums.

---

## 49. Phase 9 — Warrant experiments

Create controlled trait combinations.

For each:

```text
0 matching suspects
1 matching suspect
2 matching suspects
3+ matching suspects
correct culprit unique
wrong suspect unique
```

Record:

- output;
- warrant state;
- time cost;
- whether old warrant survives;
- whether evidence remains editable.

Then deliberately reach the final criminal with:

```text
no warrant
correct warrant
incorrect warrant
```

Capture exact outcomes.

---

## 50. Phase 10 — Progression experiments

Manipulate or naturally advance solved-case state.

Determine exact thresholds:

| From | To | Cases required | Exam? | Other condition |
|---|---|---:|---|---|
| Rookie | Sleuth | TBD | TBD | TBD |
| Sleuth | Private Eye | TBD | TBD | TBD |
| Private Eye | Investigator | TBD | TBD | TBD |
| Investigator | Ace Detective | TBD | TBD | TBD |
| Ace Detective | final/retirement | TBD | TBD | TBD |

Also determine how rank changes:

- route length;
- deadline;
- clue difficulty;
- candidate destinations;
- culprit availability;
- investigation economy.

---

# PART VI — OPEN QUESTIONS REGISTER

## 51. Critical unknowns

The following questions must be answered before `GAME_SPEC.md` is considered mechanically complete.

### Build identity

- [ ] Which exact DOS revision are we reproducing mechanically?
- [ ] Which exact revision are the supplied UI screenshots from?
- [ ] Are mechanical and visual targets intentionally the same revision?

### Opening sequence

- [ ] Exact intro sequence.
- [ ] Exact new-player sign-in dialogue.
- [ ] Exact returning-player dialogue.
- [ ] Does the system explicitly say it has never seen the new player before?
- [ ] Exact assignment/news bulletin ordering.
- [ ] Typewriter text behavior and timing.

### Cities and travel

- [ ] Exact 30-city list in target build.
- [ ] Complete connection graph.
- [ ] Number of candidate destinations.
- [ ] Whether connections are fixed.
- [ ] Exact flight-time algorithm/table.
- [ ] Whether backtracking routes are guaranteed.

### Investigation

- [ ] Exact number of available investigation locations.
- [ ] Exact location pool.
- [ ] Whether three locations are selected per city/case.
- [ ] Location selection algorithm.
- [ ] NPC selection algorithm.
- [ ] Whether repeated location visits repeat clues.
- [ ] Exact time cost per investigation.
- [ ] Whether cost increases with successive investigations.

### Clues

- [ ] Full destination clue taxonomy.
- [ ] Full identity clue taxonomy.
- [ ] Clue generation algorithm.
- [ ] Building-to-clue-category relationship.
- [ ] Rank-to-clue-difficulty relationship.
- [ ] Probability of negative/useless clues.
- [ ] Whether clues can simultaneously reveal destination and identity.

### Wrong routes

- [ ] Exact wrong-city response.
- [ ] Exact recovery/backtracking logic.
- [ ] Whether wrong-city investigation costs normal time.
- [ ] Whether suspicious-presence animation is absent in wrong cities.

### Time

- [ ] Starting day/time.
- [ ] Deadline day/time.
- [ ] Crime Computer time cost.
- [ ] Investigation costs.
- [ ] Travel costs.
- [ ] Overnight behavior.
- [ ] Any free actions.

### Suspects and warrant

- [ ] Exact trait categories.
- [ ] Exact trait values.
- [ ] Exact suspect profile table.
- [ ] Zero-match Crime Computer behavior.
- [ ] Multiple-match behavior.
- [ ] Unique-match behavior.
- [ ] Warrant replacement/invalidation.
- [ ] No-warrant final encounter.
- [ ] Wrong-warrant final encounter.
- [ ] Correct-warrant final encounter.

### Final pursuit

- [ ] Exact final-city behavior.
- [ ] Whether culprit hides in one local location.
- [ ] Hiding-place selection.
- [ ] Capture animation sequence.
- [ ] Escape animation sequence.

### Progression

- [ ] Exact rank thresholds.
- [ ] Promotion exam rules.
- [ ] Difficulty changes per rank.
- [ ] Carmen availability rules.
- [ ] Number of successful cases to career completion.
- [ ] Hall of Fame behavior.
- [ ] Retirement / alias behavior.

### Persistence

- [ ] Save filename(s).
- [ ] Record structure.
- [ ] Current-case persistence.
- [ ] Maximum detective profiles.
- [ ] Hall of Fame capacity.

---

# PART VII — FINDINGS TABLE

## 52. Current evidence summary

| ID | Finding | Status | Safe to use as historical baseline? |
|---|---|---|---|
| OG-001 | Player is detective-agency operative | CONFIRMED_MANUAL | Yes |
| OG-002 | Animated introduction | CONFIRMED_MANUAL | Yes |
| OG-003 | Player enters name at agency computer | CONFIRMED_MANUAL | Yes |
| OG-004 | Assignment follows sign-in | CONFIRMED_MANUAL | Yes |
| OG-005 | Case concerns stolen treasure/object | CONFIRMED_MANUAL | Yes |
| OG-006 | Assignments vary in city/item/suspect | CONFIRMED_MANUAL | Yes |
| OG-007 | World contains 30 cities | CONFIRMED_MANUAL | Yes |
| OG-008 | Travel uses constrained connections | CONFIRMED_MANUAL | Yes |
| OG-009 | Destination clues require geographic deduction | CONFIRMED_MANUAL | Yes |
| OG-010 | Location and identity are parallel investigations | CONFIRMED_MANUAL | Yes |
| OG-011 | 10 possible suspects | CONFIRMED_MANUAL | Yes |
| OG-012 | Crime Computer filters by identity traits | CONFIRMED_MANUAL | Yes |
| OG-013 | Unique suspect match produces warrant | CONFIRMED_MANUAL | Yes |
| OG-014 | Correct warrant is required for arrest | CONFIRMED_MANUAL | Yes |
| OG-015 | Player chooses investigation locations | CONFIRMED_MANUAL | Yes |
| OG-016 | Witnesses/informants provide clues | CONFIRMED_MANUAL | Yes |
| OG-017 | Wrong route requires recovery/backtracking | HISTORICAL_SECONDARY | Yes conceptually; verify exact mechanics |
| OG-018 | Suspicious Presence signals correct trail | CONFIRMED_MANUAL | Yes |
| OG-019 | Actions consume finite time | CONFIRMED_MANUAL | Yes |
| OG-020 | Travel consumes time | CONFIRMED_MANUAL | Yes |
| OG-021 | Pursuit ends by catching thief with warrant | CONFIRMED_MANUAL | Yes |
| OG-022 | Deadline expiration causes failure | CONFIRMED_MANUAL | Yes |
| OG-023 | No correct warrant prevents arrest | CONFIRMED_MANUAL | Yes |
| OG-024 | Five detective ranks | CONFIRMED_MANUAL | Yes |
| OG-025 | Solved cases drive career progression | CONFIRMED_MANUAL | Yes |
| OG-026 | Promotion question/exam | COMMUNITY_SECONDARY | Verify |
| OG-027 | Hall of Fame exists | CONFIRMED_MANUAL | Yes |

---

# PART VIII — SOURCE REGISTER

## 53. Primary/period documentation

### S1 — Brøderbund user manual

**Title:** _Where in the World Is Carmen Sandiego?_ User's Manual  
**Publisher:** Brøderbund Software  
**Period:** 1985/1986 manual lineage  
**Applies to:** Apple, Commodore and IBM PC instructions in the scanned manual.

Archive copy:

https://colorcomputerarchive.com/repo/Documents/Manuals/Games/Where%20in%20the%20World%20is%20Carman%20Sandiego%20%28Broderbund%29.pdf

Alternative searchable transcription / scan host:

https://www.scribd.com/document/808909001/Carmen-Sandiego-DOS-Manual

Use this source for intended core behavior.

Do not assume Macintosh/Amiga-only interface instructions apply to IBM DOS.

---

## 54. Historical secondary source

### S2 — The Strong National Museum of Play

Game-history entry:

https://www.museumofplay.org/games/where-in-the-world-is-carmen-sandiego/

Useful for corroborating:

- educational/geographic investigation loop;
- correct-route henchman feedback;
- wrong-route backtracking;
- finite time;
- warrant-based arrest.

---

## 55. DOS save-data analysis

### S3 — Inside DOS Games

Article:

https://insidedosgames.wordpress.com/2018/11/26/where-in-the-world-is-carmen/

Useful as a reverse-engineering lead for:

- `ACME.DAT`;
- detective records;
- solved-case value;
- encoded rank;
- Hall of Fame data.

Treat offsets as unverified until reproduced against the target build.

---

## 56. Comparison repositories

### S4 — Julia Sanfrancisco

https://github.com/fmaclen/julia-sanfrancisco

Use for modern browser architecture and comparative gameplay modeling.

Do not use as historical authority.

### S5 — ThiefCatcher

https://github.com/Ponup/thiefcatcher

Use for comparative case/clue/domain modeling.

Do not use as historical authority.

### S6 — Carmen Sandiego DOS visualization

https://github.com/IcaroBernardes/carmen_sandiego_DOS

Use for reconstructed classic data and visual references.

Do not use as gameplay-engine authority.

---

# PART IX — RULES FOR CODEX

## 57. What Codex must do when original files become available

Codex must not immediately start implementing Deolane San Paolo.

First:

```text
identify build
→ inventory files
→ hash files
→ extract strings
→ inspect data
→ perform controlled runtime tests
→ disassemble only where useful
→ document findings here
→ distinguish evidence level
→ resolve critical unknowns
```

Only then should confirmed behavior flow into:

- `GAME_SPEC.md`
- `CASE_GENERATION.md`
- `NARRATIVE_WALKTHROUGH.md`
- `UI_UX_SPEC.md`
- `CONTENT_MODEL.md`

---

## 58. What Codex must not do

Do not:

- label a community FAQ as binary-confirmed behavior;
- assume a console-port mechanic exists in DOS;
- treat a clone's constant as an original constant;
- infer exact timing from memory;
- merge original/Enhanced/Deluxe behavior silently;
- copy proprietary dialogue into Deolane San Paolo;
- copy original character assets into production;
- copy original city artwork into production;
- make the original DOS files runtime dependencies;
- publish reference DOS binaries in the Deolane repository;
- commit locally supplied proprietary reference material unless explicitly instructed.

Reference binaries should remain outside production source control.

---

## 59. Research-not-implementation principle

This file may become more detailed than the final `GAME_SPEC.md`.

That is intentional.

`ORIGINAL_GAME_ANALYSIS.md` should preserve:

- evidence;
- ambiguity;
- historical quirks;
- discarded hypotheses;
- version differences.

`GAME_SPEC.md` should eventually contain only the clean, intentional rules selected for Deolane San Paolo.

Example:

```text
ORIGINAL_GAME_ANALYSIS.md

Evidence:
- manual says investigation consumes time
- runtime experiment says first visit +2h
- second visit +3h
- third visit +4h
- returning to city resets visit counter
- binary function confirms lookup table [2,3,4]

            ↓

GAME_SPEC.md

Investigation time:
1st local investigation in a visit: +2h
2nd: +3h
3rd: +4h
counter resets after leaving the city
```

Until that evidence exists, the final specification must not fake certainty.

---

# PART X — HANDOFF TO DEOLANE SAN PAOLO

## 60. Historical mechanics already safe to preserve conceptually

The following design pillars are sufficiently supported to guide the project now:

1. player signs into a detective organization;
2. an assignment follows;
3. a valuable object has been stolen;
4. the player begins from a known crime location;
5. the criminal follows a hidden international trail;
6. each city offers constrained onward travel choices;
7. geographic clues indirectly identify the next destination;
8. witnesses also reveal identifying characteristics;
9. route deduction and culprit deduction happen in parallel;
10. investigation consumes time;
11. travel consumes time;
12. wrong travel is penalized primarily through lost time and recovery;
13. correct pursuit receives diegetic feedback;
14. suspect traits are entered into a computer;
15. the computer filters a fixed suspect pool;
16. a warrant requires uniquely identifying a suspect;
17. the correct warrant is mandatory for a valid arrest;
18. the thief must be reached before a deadline;
19. successful cases advance a detective career;
20. the game culminates in pursuing the criminal mastermind.

These principles may inform the other specifications immediately.

---

## 61. Historical values that must NOT yet be frozen

Do not yet freeze:

```text
route length
number of investigation locations
investigation time costs
flight time costs
deadline
start time
sleep rules
city graph
clue probabilities
negative clue probabilities
suspect trait categories
promotion thresholds
promotion exam behavior
final hiding-place algorithm
Carmen appearance schedule
exact UI geometry
exact typewriter timing
exact first-run dialogue
```

Those remain research targets.

---

## 62. Deolane-specific transformation boundary

The historical analysis must never overwrite the new project's identity.

The new game is:

**Deolane San Paolo**

The recurring mastermind is:

**Deolane San Paolo**, visually defined by:

- blonde hair;
- enormous exaggerated lips;
- intense red lipstick;
- heavy makeup;
- prominent earrings;
- oversized gold necklace;
- huge gold pendant;
- deliberately ostentatious caricature.

Historical Carmen material provides structural inspiration only.

The following must be original to Deolane San Paolo:

- character names;
- organization names;
- agency name;
- dialogue;
- jokes;
- stolen-item writing;
- biographies;
- narrative;
- new portraits;
- city artwork;
- UI artwork where not purely structural;
- logo;
- sound and music;
- promotional material.

---

## 63. Completion criterion for this document

`ORIGINAL_GAME_ANALYSIS.md` is considered sufficiently mature to support final gameplay implementation when:

- [ ] exact target DOS build is fingerprinted;
- [ ] all critical clock values are known;
- [ ] city connection behavior is known;
- [ ] route generation is understood;
- [ ] investigation-location behavior is understood;
- [ ] clue distribution is understood;
- [ ] suspect trait table is recovered;
- [ ] warrant behavior is verified for 0/1/multiple matches;
- [ ] no/correct/wrong warrant final outcomes are tested;
- [ ] wrong-city recovery is verified;
- [ ] rank thresholds are known;
- [ ] difficulty changes by rank are known;
- [ ] final mastermind progression is known;
- [ ] initial sign-in/assignment sequence is recorded;
- [ ] target UI build/version is identified;
- [ ] unresolved differences between manual and executable are documented.

Not every byte of the executable needs to be understood.

The goal is **behavioral completeness**, not reverse engineering for its own sake.

---

## 64. Final directive

The original DOS game is the laboratory specimen.

Do not worship its code, do not blindly copy later clones, and do not trust nostalgia as a debugger.

Observe it.

Measure it.

Document it.

Then reproduce the mechanics intentionally in a clean browser-native engine for **Deolane San Paolo**.

---

# PART XVII — IMPLEMENTATION RESEARCH LOG (2026-08-11)

## 65. Sources inspected for this implementation

| Source | Evidence class | Use in implementation |
|---|---|---|
| MobyGames DOS screenshot collection: <https://www.mobygames.com/game/163/where-in-the-world-is-carmen-sandiego/screenshots/dos/> | Secondary screenshot archive | Confirms 320×200 native DOS captures, hard panel borders, compact bitmap text, city-scene framing and limited palette. |
| Internet Archive DOS item: <https://archive.org/details/msdos_Where_in_the_World_is_Carmen_Sandiego_1985> | Secondary executable/emulation archive | Identifies the hosted item as an enhanced 1990 build despite the URL label; it must not be treated as the untouched 1985 release. |
| Original manual mirror: <https://www.retrogames.cz/manualy/DOS/Carmen_Sandiego_-_DOS_-_Manual.pdf> | Primary-period documentation scan | Supports the investigation/travel/dossier/warrant conceptual loop; executable-specific timing remains governed by the canonical project specifications. |
| Gameplay recording (EGA): <https://www.youtube.com/watch?v=dHCF6A9a2Bg> | Secondary audiovisual record | Used for screen-order and pacing comparison. No unsupported exact time value was promoted from the recording. |
| Gameplay recording (CGA): <https://www.youtube.com/watch?v=aTv4EIBucfo> | Secondary audiovisual record | Used to compare palette-era presentation and confirm that interface structure survives palette variants. |
| Comparative source repository: <https://github.com/IcaroBernardes/carmen_sandiego_DOS> | Third-party reconstruction/data corpus | Raw and processed PNG pairs were inspected to separate original-like pixel material from web wrappers and transforms. Never used as engine authority. |

## 66. Directly confirmed visual structure

Inspection of the screenshot corpus confirmed a dense, single-screen composition rather than a modern dashboard:

```text
top text menu
↓
left city/date header + large scene panel
│
└──────── right information/character panel
          ↓
          four large bottom action controls
```

The implementation therefore preserves one 640×400 logical surface, the 300/340 left-right division, the 22-pixel top menu and the four persistent action areas. Desktop presentation enlarges that surface as one unit; mobile does not reorder the panels.

## 67. Directly confirmed rendering traits

The local comparative corpus contained 118 PNG files. `scripts/analyze-reference-art.ts` indexed their dimensions, alpha use and dominant colors into `.cache/visual-reference/reference-index.json`.

Raw/processed comparisons confirm these useful traits:

- thick black silhouette contours;
- small clusters of flat color rather than smooth shading;
- checkerboard dithering for intermediate tones;
- witness figures composed separately from location backgrounds;
- caricatured profiles whose identity depends on a few exaggerated features;
- nearest-neighbor enlargement.

The comparative repository's wrapper sizes and web transforms are not historical proof and were not copied into the runtime.

## 68. Version caution retained

The exact target executable is still not fingerprinted. The Internet Archive item is explicitly treated as a later enhanced build. Accordingly:

- screenshot evidence constrains layout and rendering;
- the supplied project specifications remain authoritative for exact costs, deadline, route length, warrants and progression;
- no clone-specific fixed travel table or simplified warrant rule was imported.

## 69. Independent implementation decision

The recreated shell uses the historical information hierarchy and interaction density, but every shipped character, emblem, scene, object, faction name, line of dialogue and raster asset is original to Deolane San Paolo. The criminal faction is **T.C.C. — Tríade Chapa-Coco** and the detective organization is **Agência Federal**.

## 70. Project-owner control-mapping observation

**Status:** `PROJECT_OWNER_RUNTIME_OBSERVATION`

Direct comparison by the project owner with the original reference corrected an earlier interpretation of the four bottom controls:

- `SEE` only displays the cities currently available from the present city; it does not select a destination;
- `DEPART` opens the actionable travel interface and owns destination selection;
- the magnifying-glass control opens the local investigation locations such as hotel and bank;
- the computer control opens characteristic filtering and warrant computation;
- suspect dossiers belong exclusively to the top `DOSSIERS` menu.

The exact target executable revision remains unresolved, but this mapping is an explicit project decision and supersedes the earlier provisional mapping in the browser implementation.
