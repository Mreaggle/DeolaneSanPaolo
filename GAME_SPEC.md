# GAME_SPEC.md

## 1. Document authority

This document is the canonical gameplay specification for **Deolane San Paolo / `DeolaneSanPaolo`**.

It defines what the game does mechanically.

For gameplay rules, this document has precedence over:

- implementation details;
- reference repositories;
- remembered behavior;
- prototype behavior;
- UI convenience;
- assumptions derived from the historical DOS game.

`ORIGINAL_GAME_ANALYSIS.md` describes historical evidence.

This document defines the intentional rules of **Deolane San Paolo**.

If later reverse engineering proves that a historical mechanic differs from a value specified here, the implementation must **not** silently change. The project owner must explicitly revise this document first.

---

# PART I — DESIGN PILLARS

## 2. Core gameplay identity

Deolane San Paolo is a single-player investigative pursuit game.

The player is a detective assigned to recover stolen objects and capture members of an international criminal organization.

Every ordinary case contains two simultaneous deduction problems:

```text
WHERE DID THE CRIMINAL GO?
                +
WHO IS THE CRIMINAL?
```

The player must solve both before time expires.

The game is not an action game.

There is:

- no combat system;
- no health;
- no damage;
- no player movement inside scenes;
- no economy;
- no equipment progression;
- no inventory puzzle system;
- no dialogue tree;
- no RPG stats.

The primary resource is **time**.

The primary skill is **deduction**.

---

## 3. Canonical gameplay loop

Every standard case follows this structure:

```text
CASE ASSIGNMENT
      ↓
crime + stolen object + starting city + deadline
      ↓
STARTING CITY
      ↓
inspect available travel destinations
      ↓
investigate local locations
      ↓
collect:
  - geographic clues
  - identity clues
      ↓
deduce next city
      ↓
travel
      ↓
correct city?
  ├── YES → trail advances
  └── NO  → cold trail / recover by backtracking
      ↓
repeat
      ↓
identify one unique suspect
      ↓
issue arrest warrant
      ↓
reach final city
      ↓
find correct local hideout
      ↓
correct warrant + time remaining?
  ├── YES → CAPTURE
  └── NO  → ESCAPE / CASE FAILED
```

The game must preserve this loop at every rank.

Difficulty may change the length and obscurity of the case but must not replace the fundamental loop.

---

# PART II — PLAYER PROFILE AND CAREER

## 4. Player profile

A player profile contains at minimum:

- detective name;
- current rank;
- total successfully solved cases;
- total failed cases;
- whether Deolane San Paolo has been captured;
- Hall of Fame status;
- current active case, if any.

The first time a player enters a new name, a new detective profile is created.

Narrative wording and the exact sign-in sequence belong in `NARRATIVE_WALKTHROUGH.md`.

---

## 5. Starting rank

Every new detective begins as:

```text
ROOKIE
```

No player-selectable difficulty replaces the career rank system in the default game.

---

## 6. Career ranks

The canonical ranks are:

1. Rookie
2. Sleuth
3. Private Eye
4. Investigator
5. Ace Detective

These names may later receive an original fictional presentation layer, but the progression tiers and mechanical ordering remain five-tiered unless this file is explicitly revised.

---

## 7. Promotion thresholds

Career progression is based on **successfully solved cases**.

Canonical thresholds:

| Solved cases | Career state |
|---:|---|
| 0 | Rookie |
| 1–3 | Sleuth |
| 4–6 | Private Eye |
| 7–9 | Investigator |
| 10–13 | Ace Detective |
| 14 | Deolane captured / Hall of Fame |

The first successful case promotes Rookie to Sleuth.

At 4, 7 and 10 solved cases, the player advances to the next rank.

The fourteenth successful case is the final Deolane San Paolo case.

---

## 8. Failed cases and rank

A failed case:

- does not increase solved-case count;
- does increase failed-case statistics;
- does not demote the player;
- does not erase previous progress;
- does not reset the career;
- allows the player to receive another case.

Rank is never lost because of failure.

---

## 9. Promotion examination

Promotion examination behavior is reserved for `NARRATIVE_WALKTHROUGH.md` and a later explicit project decision.

For the first implementation baseline:

```text
successful case threshold
        ↓
automatic promotion
```

No promotion can be blocked by an external reference-book question unless this specification is later revised.

The architecture must not make it difficult to add such a screen later.

---

# PART III — CRIMINAL CAST

## 10. Number of suspects

The canonical suspect pool contains:

```text
10 suspects
```

It consists of:

- Deolane San Paolo;
- nine subordinate criminals.

The nine subordinate characters will be defined in the content specification.

---

## 11. Deolane San Paolo

Deolane San Paolo is the recurring criminal mastermind and final career target.

Her visual identity is specified in `AGENTS.md` and `VISUAL_SPEC.md`.

Mechanically:

- Deolane is not selected as the culprit in ordinary cases 1–13;
- the fourteenth successful case is always a Deolane case;
- the final case still uses the same investigation, travel, identity and warrant mechanics;
- Deolane must still be uniquely identified;
- the player must still possess a valid warrant for Deolane;
- reaching Deolane without a correct warrant results in failure.

The final case must not bypass the core game merely because she is narratively known as the mastermind.

---

## 12. Culprit selection

For ordinary cases:

```text
culprit ∈ subordinate suspects
```

Selection is random but must obey repetition controls defined in `CASE_GENERATION.md`.

The player is not told the culprit's identity at case start.

---

# PART IV — SUSPECT IDENTIFICATION

## 13. Canonical identity trait categories

Every suspect has exactly one value for each of five canonical identity categories:

1. `sex`
2. `hair`
3. `hobby`
4. `feature`
5. `vehicle`

The human-facing labels and allowed values belong in `CONTENT_MODEL.md`.

The categories exist for deduction and warrant matching.

---

## 14. Unique identity requirement

Every suspect must have a unique combination across the five categories.

No two suspects may have identical full trait profiles.

Example conceptual structure:

```text
Suspect A:
sex     = female
hair    = blonde
hobby   = tennis
feature = necklace
vehicle = convertible

Suspect B:
sex     = female
hair    = blonde
hobby   = golf
feature = tattoo
vehicle = limousine
```

---

## 15. Single-clue identification restriction

Ordinary content should be balanced so that no single identity trait uniquely identifies the culprit unless explicitly required by late-game content.

Preferred design:

```text
one identity clue   → multiple candidates
two identity clues  → usually 2–4 candidates
three clues         → often unique
```

`CASE_GENERATION.md` must validate that every case exposes enough identity information to produce one unique suspect before the final encounter.

---

## 16. Identity clues are truthful

A valid identity clue can never lie.

If a witness states that the criminal:

```text
had blonde hair
```

then the actual culprit's hair trait must be blonde.

There are no false identity clues.

Difficulty is created by:

- clue obscurity;
- fewer early identity clues;
- overlapping suspect characteristics;

not by misinformation.

---

# PART V — CASE CREATION

## 17. Standard case definition

A case consists at minimum of:

```text
case ID / seed
culprit
stolen object
starting city
hidden route
final city
final hideout
start time
deadline
identity clue plan
geographic clue plan
case status
```

The precise data schema belongs in `CONTENT_MODEL.md`.

---

## 18. The crime

The crime has already occurred when gameplay begins.

The player does not:

- witness the theft;
- fight the thief;
- solve a crime-scene object puzzle.

The crime is the narrative trigger for the international pursuit.

---

## 19. Stolen object

Every case contains one stolen object.

The stolen object:

- is named in the case briefing;
- is associated with the starting city/country or its fictional context;
- is recovered automatically after a successful arrest;
- is not mechanically usable by the player;
- does not occupy an inventory system;
- does not alter suspect deduction.

The stolen object exists to create narrative flavor and case identity.

---

## 20. Case route

Every case contains a hidden ordered route:

```text
route[0] = starting city
route[1] = first escape destination
route[2] = ...
route[n] = final city
```

The player must never see the hidden route directly.

Only clues reveal how to follow it.

---

## 21. Route length by rank

Canonical number of route cities:

| Rank | Total cities in hidden route | Required successful moves |
|---|---:|---:|
| Rookie | 4 | 3 |
| Sleuth | 5 | 4 |
| Private Eye | 6 | 5 |
| Investigator | 7 | 6 |
| Ace Detective | 8 | 7 |
| Final Deolane case | 8 | 7 |

`route[0]` is included in the total.

Therefore a Rookie case contains:

```text
crime city
→ city
→ city
→ final city
```

An Ace Detective case contains eight route cities.

---

## 22. No route repetition

A hidden route may not contain the same city twice.

Therefore:

```text
route[i] != route[j]
for every i != j
```

This avoids loops that would make trail state ambiguous.

---

# PART VI — WORLD AND CITIES

## 23. World size

The initial content target is:

```text
30 cities
```

This mirrors the scale of the classic structure.

The final city roster is original project data and belongs in `CONTENT_MODEL.md`.

---

## 24. City graph

Cities form a graph.

Every city has a fixed set of legal travel connections.

The player cannot freely select any of the 30 cities from every location.

Conceptually:

```text
CITY A
├── CITY B
├── CITY C
├── CITY D
└── CITY E
```

Travel is only permitted along a listed connection.

---

## 25. Connection rules

A connection has at minimum:

- destination city;
- travel time in hours.

Connections must be configured so that:

- the world graph is connected;
- every city is reachable;
- generated routes are solvable;
- reverse travel needed for recovery is possible through the game rules.

The exact graph belongs in content data.

---

## 26. Candidate travel list

When the player chooses `DEPART`, the game displays the legal candidate destinations for the current state.

The game never highlights the correct choice.

The destination list must not say:

```text
CORRECT DESTINATION
```

or display quest markers.

The player must reason from clues.

---

# PART VII — INVESTIGATION LOCATIONS

## 27. Three local locations

Every city state presented during a case exposes exactly:

```text
3 investigation locations
```

These are the three places available under the investigation action for that city visit.

This is a hard gameplay rule.

---

## 28. Global place pool

The baseline place pool contains twelve reusable types:

1. Airport
2. Bank
3. Foreign Ministry
4. Harbor
5. Hotel
6. Library
7. Marketplace
8. Museum
9. Palace
10. Riverfront
11. Sports Club
12. Stock Exchange

The displayed names may be localized or adapted to the Deolane universe.

---

## 29. Selecting three places

For each correct-route city, the case generator selects exactly three place types from those permitted for that city.

The three selected place types must be distinct.

Example:

```text
CAIRO

Hotel
Museum
Marketplace
```

A different case may present:

```text
CAIRO

Bank
Airport
Palace
```

The same city does not require the same three investigation locations in every case.

---

## 30. Place compatibility

Some cities may exclude place types that make no narrative or geographic sense.

The content data may define:

```text
allowedPlaces[]
```

The case generator must select only from allowed places.

However, each city must allow enough place types to reliably choose three unique locations.

---

# PART VIII — WITNESSES

## 31. Witness role

Each selected investigation location contains exactly one witness presentation for the visit.

Witnesses are information-delivery characters.

They are not full conversational NPCs.

The player does not select dialogue topics.

Interaction is:

```text
choose location
→ time passes
→ witness appears
→ statement/clue displayed
```

---

## 32. Witness pool

Each place type should have multiple possible witness roles.

Baseline target:

```text
3 witness roles per place type
```

Examples:

```text
Bank:
- guard
- teller
- manager/executive
```

Exact witness identities belong in `CONTENT_MODEL.md`.

---

## 33. Witness persistence

A witness/clue selected for a location is fixed for that generated city state.

Reloading the same case must not reroll the witness or clue.

This must be stored in case state or deterministically regenerated from the case seed.

---

# PART IX — CLUE SYSTEM

## 34. Two primary clue families

Clues belong to two gameplay families:

```text
GEOGRAPHIC
IDENTITY
```

Additional state-response messages such as wrong-city messages exist but are not ordinary deduction clues.

---

## 35. Geographic clue purpose

A geographic clue provides information about the **next hidden-route city**.

It must not normally name that city directly.

It may reference attributes such as:

- currency;
- language;
- monument;
- history;
- geography;
- river;
- mountain;
- architecture;
- fauna;
- food;
- cultural practice;
- flag;
- political or historical institution;
- transportation clue;
- region-specific object.

Exact clue categories belong in the content model.

---

## 36. Geographic deduction rule

The player is expected to compare the clue against the destinations available from the current city.

Correct structure:

```text
available candidates
      +
clue
      ↓
deduction
```

Example:

```text
Destinations:
Rome
Oslo
Moscow

Witness:
"The thief exchanged money for kroner."

Player reasoning:
kroner → Norway → Oslo
```

The game must not replace this with:

```text
Go to Oslo.
```

except where an explicitly easy clue template has been approved.

---

## 37. Correct-city geographic clues

In every non-final city on the correct route:

- all useful geographic clues must refer to the same next route city;
- no geographic clue may deliberately indicate a wrong destination;
- clue wording may be indirect;
- clue difficulty may vary by rank.

---

## 38. Geographic clue solvability

A generated city state must be solvable from the information available to the player.

At minimum:

```text
the combined useful geographic clues
must uniquely identify
the next route city
among the displayed travel candidates
```

The generator must validate this.

---

## 39. Geographic clue redundancy

Multiple investigation locations may provide different facts pointing to the same destination.

Example:

```text
Bank:
"She exchanged money for yen."

Museum:
"He asked about ukiyo-e prints."

Airport:
"They boarded a carrier displaying a red sun."
```

All three may point toward the same destination.

This redundancy is intentional.

The player may leave after one clue if confident.

---

## 40. Identity clue purpose

An identity clue describes a trait of the actual culprit.

Identity clues map to one of the five canonical trait categories:

```text
sex
hair
hobby
feature
vehicle
```

Example:

```text
"She was driving a limousine."
→ vehicle = limousine
```

---

## 41. Combined witness statements

A single witness statement may contain:

- a geographic clue only;
- an identity clue only;
- both a geographic and identity clue;
- a negative/cold-trail response when off-route.

The generator controls distribution.

---

## 42. Baseline clue distribution in correct cities

For every non-final correct-route city:

- all three local locations are eligible to provide a geographic clue;
- at least two of the three must provide useful geographic information;
- at least one of the three must provide or include an identity clue until sufficient identity evidence has been exposed;
- no more than one location may be purely non-useful at higher ranks;
- Rookie cases do not contain purely non-useful correct-route witnesses.

The exact distribution is generated under the constraints in `CASE_GENERATION.md`.

---

## 43. Identity clue availability guarantee

Before entering the final city, the case must have exposed enough identity clues that the culprit can be uniquely identified from the suspect database.

The player is not required to investigate every available location.

Therefore the generator must ensure there is at least one reasonable clue path that:

```text
follows correct cities
+
uses a sensible number of investigations
+
uniquely identifies culprit
+
leaves enough time to win
```

---

## 44. Clue difficulty by rank

Clue difficulty increases with career rank.

### Rookie

- clues are direct;
- commonly known geographic associations;
- high redundancy;
- no useless correct-route clue;
- identity clues use straightforward language.

### Sleuth

- clues remain reasonably direct;
- greater variety of geographic categories;
- slightly less redundant.

### Private Eye

- more indirect cultural/historical associations;
- individual clues may be ambiguous;
- combined clues remain decisive.

### Investigator

- higher proportion of indirect clues;
- less obvious references;
- one location may occasionally provide a non-useful response.

### Ace Detective

- most indirect clues;
- greater reliance on comparing multiple candidate destinations;
- one non-useful response may appear;
- identity clues may be phrased narratively instead of as explicit trait labels.

### Final Deolane case

Uses Ace Detective clue difficulty.

Difficulty never permits false information.

---

# PART X — INVESTIGATION ACTION

## 45. Investigation state

When entering a correct or wrong city state, the game initializes an investigation-visit counter:

```text
investigationsThisVisit = 0
```

This counter controls time cost.

---

## 46. Investigation time costs

Canonical time costs for the current city visit:

| Investigation number during the current visit | Time cost |
|---:|---:|
| 1st | 2 hours |
| 2nd | 3 hours |
| 3rd | 4 hours |

Therefore investigating all three locations costs:

```text
2 + 3 + 4 = 9 hours
```

The cost depends on investigation order number, not the identity of the building.

---

## 47. Leaving resets investigation sequence

Whenever the player departs the city, the local investigation counter is reset.

If the player later returns:

```text
investigationsThisVisit = 0
```

The next new investigation costs 2 hours again.

---

## 48. Visiting an already investigated location

A location already investigated in the same generated city state remains marked as visited.

Selecting it again performs a **review**, not a new investigation.

Review behavior:

- redisplays the previously obtained witness statement;
- costs 0 game hours;
- does not reroll the witness;
- does not reroll the clue;
- does not increment the investigation counter.

This avoids accidental time loss caused merely by rereading evidence.

---

## 49. Investigation and deadline

The time cost is applied before the clue is revealed.

Sequence:

```text
select unvisited location
→ advance clock
→ check deadline
→ if time expired: case fails
→ otherwise reveal witness/clue
```

If the investigation advances the clock to the exact deadline, the case is considered out of time before the clue/encounter can save it.

---

# PART XI — TRAVEL

## 50. Travel action

Travel is initiated through the departure/map interface.

The player selects one legal candidate destination.

Travel is immediate from the player's perspective except for the DOS-style transition/animation.

There is no ticket price or inventory requirement.

---

## 51. Travel time

Each graph connection contains an integer travel cost in hours.

Canonical range:

```text
3–7 hours
```

The exact value is data-driven per connection.

Example:

```text
Paris → London = 3
Paris → Cairo  = 6
```

Travel time is not calculated at runtime from real-world kilometers.

It is a designed gameplay weight.

---

## 52. Symmetrical travel-time baseline

Unless explicitly overridden in city connection data:

```text
travelTime(A, B) = travelTime(B, A)
```

The architecture may support asymmetric edges, but baseline content should use symmetrical values.

---

## 53. Travel consumes time before arrival state

Sequence:

```text
select destination
→ advance clock by edge cost
→ check deadline
→ if expired: case fails
→ otherwise arrive
→ classify arrival as:
   correct progression
   known correct anchor
   old route city
   wrong city
   final city
```

---

## 54. No real-time countdown

The case clock does not advance according to wall-clock seconds while the player is reading or thinking.

Time advances only because of defined game actions.

The player may spend as long as necessary reading a clue without consuming game hours.

This is a turn/action-based clock.

---

# PART XII — CORRECT ROUTE STATE

## 55. Furthest correct route index

The case tracks:

```text
furthestRouteIndex
```

This represents the furthest city on the hidden route that the player has correctly reached.

Route progress is monotonic.

It never decreases.

---

## 56. Correct forward travel

If:

```text
destination == route[furthestRouteIndex + 1]
```

then:

```text
furthestRouteIndex += 1
```

The destination becomes the new correct-route anchor.

---

## 57. Correct-route anchor

The current furthest correct city is called the:

```text
trail anchor
```

This is the latest city where the criminal's trail is confirmed.

If the player later travels incorrectly, the trail anchor remains unchanged.

---

## 58. Returning to an older correct city

If the player voluntarily returns to a route city behind the trail anchor:

- `furthestRouteIndex` does not decrease;
- the criminal is no longer considered to be there;
- that city behaves as a cold/old trail;
- it does not reveal new forward-route progression clues;
- recovery information must ultimately lead the player back toward the trail anchor.

The game must never "move the thief backward."

---

# PART XIII — WRONG CITIES

## 59. Wrong city definition

A destination is a wrong city when it is not:

- the next hidden-route city;
- the current trail anchor;
- a valid final state already reached.

Traveling to a wrong city does not advance the hidden route.

---

## 60. Wrong-city investigation

In a wrong city:

- the three selected locations remain investigable;
- investigation costs normal time;
- witnesses do not provide false geographic information;
- witnesses do not provide new culprit identity evidence;
- witnesses give cold-trail/negative responses.

Example conceptual messages:

```text
"No one matching that description has been seen here."

"The person you're after didn't come through here."

"You may want to retrace your steps."
```

Exact dialogue belongs in narrative/content data.

---

## 61. Wrong-city travel recovery

The player must not be trapped in a wrong city.

The travel list while off-route must always make a route back toward the trail anchor possible.

At minimum, the game guarantees an available recovery destination that leads directly to the current trail anchor.

This may be represented as a return connection even if the normal geographic graph would otherwise make recovery unnecessarily complex.

---

## 62. Multiple consecutive wrong cities

A player may make another incorrect travel decision while already off-route.

The trail anchor remains the same.

Example:

```text
correct anchor: Paris

Paris
→ London  [wrong]
→ Oslo    [wrong]
```

The case still considers Paris the last confirmed trail location.

Negative witnesses remain negative until the player returns to Paris.

---

## 63. Returning to the anchor

When the player returns to the trail anchor:

- route progress remains unchanged;
- correct clue state becomes available again;
- already visited anchor locations remain visited;
- previously collected clues remain the same;
- investigation review remains free;
- any still-unvisited anchor locations may be investigated with a new city-visit counter beginning at 2 hours.

---

## 64. Wrong-route penalty

The main penalty for a wrong destination is:

```text
travel time out
+
investigation time wasted
+
travel time back
```

There is no arbitrary score deduction required.

---

# PART XIV — TRAIL FEEDBACK

## 65. Suspicious-presence feedback

Correct progression may display DOS-style pursuit feedback such as:

- suspicious figure;
- accomplice;
- threatening presence;
- fleeing silhouette;
- escalating pursuit animation.

This feedback confirms that the player remains on the live trail.

It is not itself a clue that names the next destination.

---

## 66. Feedback timing

Trail feedback may occur after arriving at a correct-route city or during the first investigation there.

The exact presentation sequence belongs in `NARRATIVE_WALKTHROUGH.md`.

Mechanically:

- it costs 0 game hours;
- it cannot alter route state;
- it cannot provide false information.

---

# PART XV — DOSSIERS

## 67. Suspect dossiers

The player can access the suspect database during an active case.

The dossiers expose the known profiles of all suspects, including their canonical trait values and biographies.

Dossier access is necessary for deduction.

---

## 68. Dossier time cost

Opening, browsing and closing dossiers costs:

```text
0 game hours
```

The player may study dossiers without deadline penalty.

The time penalty is attached to querying/issuing a warrant, not reading reference material.

---

# PART XVI — WARRANT COMPUTER

## 69. Warrant input

The warrant interface allows the player to enter zero or one selected value for each canonical category:

```text
sex
hair
hobby
feature
vehicle
```

The player is not forced to fill every field.

---

## 70. Warrant matching rule

When the player chooses `COMPUTE` / `ISSUE WARRANT`, the game evaluates:

```pseudo
matches = suspects where
    every entered trait
    equals that suspect's corresponding trait
```

Unspecified fields are ignored.

---

## 71. Warrant query time cost

Every committed warrant computation costs:

```text
2 game hours
```

Opening or editing the warrant screen before committing costs 0.

---

## 72. Zero matching suspects

If:

```text
matches.length == 0
```

then:

- no warrant is issued;
- any previously active warrant is cleared;
- the computer reports that no suspect matches;
- the 2-hour compute cost remains spent.

---

## 73. Multiple matching suspects

If:

```text
matches.length > 1
```

then:

- no warrant is issued;
- any previously active warrant is cleared;
- the computer displays the matching candidate set;
- the player must gather or enter more identifying information;
- the 2-hour compute cost remains spent.

---

## 74. Exactly one matching suspect

If:

```text
matches.length == 1
```

then:

- an arrest warrant is issued for that suspect;
- this warrant becomes the active warrant;
- the computer identifies the suspect;
- the 2-hour compute cost remains spent.

---

## 75. Replacing a warrant

The player may compute a new warrant later.

Every computation first invalidates the previous active warrant.

Only the result of the most recent successful unique computation is active.

---

## 76. Warrant truth versus culprit truth

The warrant computer does not know which suspect is actually guilty.

It only matches the traits entered by the player.

Therefore the player can obtain a validly issued but **incorrect** warrant by entering a unique trait combination that describes the wrong suspect.

This is intentional.

---

## 77. Correct warrant definition

A warrant is correct when:

```text
activeWarrant.suspectId == case.culpritId
```

No other condition makes a warrant correct.

---

# PART XVII — FINAL CITY

## 78. Reaching the final city

The final city is:

```text
route[last]
```

When the player travels correctly into it:

```text
furthestRouteIndex = last index
```

The game enters final-city investigation mode.

---

## 79. Three final-city locations

The final city also exposes exactly three investigation locations.

Exactly one is the culprit's hideout.

The hideout is selected when the case is generated and does not change.

---

## 80. Non-hideout final locations

Investigating one of the two incorrect final-city locations:

- costs investigation time normally;
- confirms that the culprit is very close;
- does not fail the case;
- does not move the culprit;
- does not reveal the hideout explicitly.

These messages are final-pursuit feedback.

---

## 81. Final hideout encounter

Investigating the selected hideout performs:

```text
advance investigation time
→ deadline check
→ culprit encounter
→ warrant validation
```

The player does not receive an opportunity to leave the hideout and obtain a warrant after seeing the culprit.

The encounter is decisive.

---

# PART XVIII — CAPTURE

## 82. Successful capture conditions

A capture succeeds only if all are true:

```text
current city == final city
selected location == final hideout
current time < deadline
active warrant exists
active warrant suspect == actual culprit
```

If all conditions are true:

```text
CASE SOLVED
```

---

## 83. Capture result

A successful capture:

- arrests the culprit;
- recovers the stolen object;
- ends the active case;
- increments solved-case count by 1;
- evaluates promotion;
- autosaves career progression;
- transitions to post-case narrative.

Exact presentation belongs in `NARRATIVE_WALKTHROUGH.md`.

---

# PART XIX — ESCAPE AND CASE FAILURE

## 84. No warrant at hideout

If the player encounters the culprit with no active warrant:

```text
culprit escapes
case fails
```

The player cannot issue a warrant afterward.

---

## 85. Wrong warrant at hideout

If an active warrant exists but names a different suspect:

```text
culprit escapes
case fails
```

The distinction may receive unique dialogue, but the mechanical result is failure.

---

## 86. Deadline expiration

The case fails when:

```text
currentTime >= deadline
```

after an action advances the clock.

The culprit escapes.

---

## 87. Exact-deadline rule

The deadline is exclusive.

To succeed:

```text
currentTime < deadline
```

If the action that reaches the hideout advances time to exactly the deadline:

```text
currentTime == deadline
```

the player is too late.

The case fails before arrest resolution.

---

## 88. Abandoning a case

If the UI provides an explicit `ABANDON CASE` action and the player confirms it:

- the case immediately ends as failed;
- failed-case statistics increment;
- rank is unchanged;
- the player returns to headquarters.

Abandonment costs no additional simulated hours because the case ends immediately.

---

# PART XX — CLOCK AND DEADLINE

## 89. Clock model

The game uses a discrete simulated calendar.

Internally, the recommended canonical representation is elapsed integer minutes or hours from case start.

Gameplay costs are specified in whole hours.

The UI may display:

```text
weekday
date
hour
```

according to the narrative calendar.

---

## 90. Case start time

Every standard case begins at:

```text
Monday, 9:00 a.m.
```

This is a fictional case clock, not the user's real calendar.

---

## 91. Standard deadline

Every standard case has:

```text
120 hours
```

from the case start.

Therefore:

```text
start:    Monday 09:00
deadline: Saturday 09:00
```

The deadline is identical across ranks in the baseline rules.

Difficulty increases primarily because higher ranks require longer routes and harder clues under the same finite time budget.

---

## 92. Final Deolane deadline

The final Deolane case also uses:

```text
120 hours
```

No extra time is granted.

---

## 93. Free actions

The following actions cost 0 game hours:

- reading current city description;
- reading previously revealed clue;
- opening/closing menus;
- viewing map before committing travel;
- viewing destination list;
- browsing suspect dossiers;
- opening/closing warrant interface;
- adjusting warrant fields before Compute;
- changing settings;
- saving automatically;
- watching transition animations;
- reading narrative text.

---

## 94. Time-consuming actions

Canonical time costs:

| Action | Cost |
|---|---:|
| First new investigation in current visit | 2 h |
| Second new investigation in current visit | 3 h |
| Third new investigation in current visit | 4 h |
| Warrant compute | 2 h |
| Travel | connection-specific, 3–7 h |
| Re-read visited location | 0 h |
| Dossier browsing | 0 h |

---

## 95. No forced sleep mechanic in baseline

The baseline game does not force the player to stop investigating at night.

The clock may cross midnight continuously.

Example:

```text
Monday 23:00
+ 4h
→ Tuesday 03:00
```

No automatic sleep period is inserted.

If later reverse engineering justifies a historical sleeping rule and the project owner chooses to adopt it, this section must be revised first.

---

# PART XXI — GAME STATES

## 96. Canonical case state machine

A case can be in one of these high-level statuses:

```text
BRIEFING
ACTIVE
SOLVED
FAILED_TIME
FAILED_NO_WARRANT
FAILED_WRONG_WARRANT
ABANDONED
```

The presentation layer may group failure states visually.

---

## 97. Active navigation substates

During `ACTIVE`, the player may be in:

```text
CORRECT_CITY
WRONG_CITY
OLD_ROUTE_CITY
FINAL_CITY
```

UI screens such as dossiers/map/warrant are overlays or presentation substates and must not themselves modify the route.

---

# PART XXII — SOLVABILITY GUARANTEES

## 98. Every generated case must be logically solvable

A case is invalid and must be regenerated if:

- the hidden route cannot be traversed through legal connections;
- the geographic clues cannot distinguish the next city;
- insufficient identity evidence exists;
- the culprit cannot become a unique warrant match;
- minimum required action time exceeds the deadline;
- the final hideout cannot be reached;
- a route creates an unrecoverable wrong-city trap.

---

## 99. Minimum-time solvability

The generator must calculate a reasonable successful-path budget.

A correct player must be able to:

- investigate enough to follow the route;
- collect enough identity clues;
- compute at least one correct warrant;
- reach the final hideout;

before the 120-hour deadline.

---

## 100. Do not solve the case for the player

Solvability does not mean revealing answers.

The engine may guarantee that evidence exists, but the player must still interpret it.

Do not implement automatic clue-to-city mapping in the player-facing UI.

Do not mark the suspect automatically merely because enough traits have been seen.

The player must intentionally use the warrant system.

---

# PART XXIII — DIFFICULTY

## 101. Rank is the difficulty system

The default game has no Easy/Normal/Hard selector.

Career rank controls difficulty.

---

## 102. Difficulty dimensions

Higher rank may increase difficulty through:

- longer hidden routes;
- more obscure geographic clue wording;
- less clue redundancy;
- occasional non-useful witnesses on correct-route cities;
- identity clues that require interpreting descriptions rather than explicit labels.

Higher rank must **not** introduce false clues.

---

## 103. Rank route difficulty summary

| Rank | Route cities | Clue style | Correct-route useless clue |
|---|---:|---|---|
| Rookie | 4 | very direct | 0 |
| Sleuth | 5 | direct | 0 |
| Private Eye | 6 | moderate | max 1 occasionally |
| Investigator | 7 | indirect | max 1 |
| Ace Detective | 8 | hardest | max 1 |
| Deolane final | 8 | hardest | max 1 |

---

# PART XXIV — CASE COMPLETION AND CAREER VICTORY

## 104. Ordinary case victory

An ordinary case is won when:

```text
culprit captured
```

with a correct warrant before the deadline.

The stolen object is automatically recovered.

---

## 105. Final career case

After 13 successful cases:

- the next case is the Deolane San Paolo case;
- Deolane is the culprit;
- route length is eight cities;
- clue difficulty uses Ace Detective rules;
- all ordinary warrant requirements remain active.

---

## 106. Career victory

Career victory occurs when the player successfully captures Deolane San Paolo in the final case.

The player then:

- reaches 14 successful cases;
- enters the Hall of Fame;
- completes the principal career arc.

---

## 107. Failure in final Deolane case

If Deolane escapes:

- career progress remains at 13 solved cases;
- the player remains Ace Detective;
- a new final Deolane case may be generated;
- Deolane must be captured successfully to complete the career.

The player does not need to replay the previous 13 successes.

---

# PART XXV — PERSISTENCE OF ACTIVE CASES

## 108. Active case persistence

Leaving or reloading the browser must not reroll the active case.

Persist enough state to preserve:

- case seed;
- culprit;
- stolen object;
- route;
- furthest route index;
- trail anchor;
- current city;
- selected three locations per city state;
- visited state;
- witness selection;
- clue selection;
- final hideout;
- elapsed time;
- deadline;
- active warrant;
- failure/solution state.

---

## 109. No reload exploitation

Reloading must not:

- reset time;
- reroll clues;
- reroll hideout;
- reroll culprit;
- undo a wrong trip;
- restore an invalidated warrant;
- convert a failed case back into an active case.

---

# PART XXVI — WHAT IS NOT A GAMEPLAY RULE

## 110. Narrative wording

This document does not define:

- exact dialogue;
- jokes;
- agency name;
- criminal-organization name;
- news bulletin wording;
- Deolane's biography;
- witness personalities.

Those belong in `NARRATIVE_WALKTHROUGH.md` and content data.

---

## 111. Visual rendering

This document does not define:

- pixel palette;
- portrait dimensions;
- screen geometry;
- button border thickness;
- fonts;
- dithering rules.

Those belong in `VISUAL_SPEC.md` and `UI_UX_SPEC.md`.

---

## 112. Technical implementation

This document defines behavior, not exact code structure.

For example:

```text
Warrant compute costs 2h
```

is canonical.

Whether the implementation uses:

```text
WarrantEngine.compute()
```

or another internal API belongs in `TECH_ARCHITECTURE.md`.

---

# PART XXVII — INVARIANTS

## 113. Core invariants

The implementation must always preserve these truths.

### Case invariants

```text
exactly one actual culprit
exactly one stolen object
exactly one hidden route
exactly one final city
exactly one final hideout
```

### Route invariants

```text
route cities are unique
furthest route progress never decreases
wrong travel never advances the route
```

### Location invariants

```text
exactly three investigation locations per city state
location clue does not reroll after save/reload
```

### Evidence invariants

```text
identity clues are truthful
useful geographic clues point to the intended next city
combined useful clues are sufficient to solve progression
```

### Warrant invariants

```text
0 matches       → no warrant
>1 matches      → no warrant
exactly 1 match → warrant for that suspect
```

### Capture invariant

```text
capture requires:
correct final hideout
AND time remaining
AND correct active warrant
```

---

# PART XXVIII — REFERENCE EXAMPLE

## 114. Example Rookie case

This is illustrative and not production content.

### Generated case

```text
Rank: Rookie
Culprit: Suspect 04
Stolen item: Golden ceremonial mask
Start: São Paulo
Route:
São Paulo
→ Lisbon
→ Cairo
→ Tokyo

Final hideout:
Tokyo / Hotel

Deadline:
Saturday 09:00
```

### São Paulo

Available travel:

```text
Lisbon
Buenos Aires
Lima
```

Investigation #1:

```text
Bank
+2h

Witness:
"The traveler asked where to exchange money for euros
and kept talking about fado."
```

Player deduces Lisbon.

The statement also says:

```text
"He had black hair."
```

Identity:

```text
hair = black
```

Player travels to Lisbon.

---

## 115. Example wrong travel

Instead the player chooses Buenos Aires.

```text
travel +4h
```

Buenos Aires does not advance route.

At a local hotel:

```text
investigation +2h

"No one matching that description checked in here."
```

The player is off the trail.

The travel interface provides a recovery path to São Paulo.

Traveling back costs the normal edge time.

The hidden route remains:

```text
São Paulo → Lisbon → Cairo → Tokyo
```

unchanged.

---

## 116. Example warrant

Later the player has learned:

```text
hair = black
hobby = golf
vehicle = limousine
```

At the warrant computer:

```text
Compute
+2h
```

If these values uniquely match Suspect 04:

```text
ARREST WARRANT ISSUED:
SUSPECT 04
```

If two suspects match, no warrant is issued.

---

## 117. Example final encounter

The player reaches Tokyo.

Three local locations:

```text
Airport
Hotel
Museum
```

Hideout is Hotel.

Player investigates Airport:

```text
+2h
"The person you're chasing was seen nearby."
```

Then Hotel:

```text
+3h
```

If:

```text
time < deadline
AND warrant == Suspect 04
```

then:

```text
CAPTURE
CASE SOLVED
```

Otherwise the culprit escapes.

---

# PART XXIX — IMPLEMENTATION ACCEPTANCE TESTS

## 118. Minimum behavioral tests

The implementation must eventually include automated coverage for at least these scenarios.

### Case setup

- new case has exactly one culprit;
- new case has one stolen object;
- route length matches rank;
- route has no duplicate cities;
- route is traversable.

### City investigation

- city exposes exactly three places;
- first investigation costs 2h;
- second costs 3h;
- third costs 4h;
- review costs 0h;
- leaving and returning resets visit cost sequence;
- clues do not reroll.

### Route progression

- correct next city advances route;
- wrong city does not advance route;
- furthest progress never decreases;
- wrong city can recover to trail anchor;
- repeated wrong cities preserve anchor.

### Geographic clues

- all truthful;
- correct-route clue plan points to next city;
- combined useful clues uniquely distinguish target among candidates.

### Identity clues

- all describe actual culprit;
- enough clues exist before final city;
- full exposed evidence can identify culprit uniquely.

### Warrant

- zero matches issues no warrant;
- two or more matches issue no warrant;
- one match issues warrant;
- compute costs 2h;
- new compute clears/replaces prior warrant;
- wrong unique warrant is possible.

### Deadline

- actions advance clock;
- free actions do not;
- exactly-at-deadline is failure;
- after-deadline is failure;
- clock does not tick from real-world waiting.

### Final city

- exactly one hideout;
- non-hideout final locations do not end case;
- correct hideout + no warrant fails;
- correct hideout + wrong warrant fails;
- correct hideout + correct warrant succeeds;
- deadline overrides otherwise correct capture.

### Career

- successful case increments solved count;
- failed case does not;
- failure never demotes;
- thresholds promote correctly;
- Deolane becomes final target at 13 solved cases;
- successful Deolane capture produces Hall of Fame state;
- failed Deolane case remains retryable.

---

# PART XXX — CHANGE CONTROL

## 119. Gameplay changes require specification updates

Do not change a canonical number or behavior directly in code.

Examples:

```text
3 locations
2/3/4 investigation hours
2h warrant computation
120h deadline
rank thresholds
route lengths
10 suspects
5 identity categories
```

must be changed here first.

After this file changes:

1. update implementation;
2. update automated tests;
3. update related narrative/UI docs if necessary;
4. document migration implications for saved games.

---

## 120. No accidental clone deviations

If a reference implementation differs from this document:

```text
GAME_SPEC.md wins.
```

Examples:

- a clone uses fixed four-hour flights;
- a clone catches the criminal without validating the warrant;
- a clone uses five destinations;
- a clone creates five-country routes for every rank.

Those behaviors must not leak into Deolane San Paolo unless this file explicitly adopts them.

---

# PART XXXI — FINAL GAMEPLAY CONTRACT

## 121. The shortest complete definition

A Deolane San Paolo case is valid only if the following experience is possible:

```text
A valuable object is stolen.

The detective starts at the crime city.

The criminal has secretly fled through a sequence of cities.

At each confirmed city, the detective chooses among three local
investigation locations.

Witnesses provide indirect geographic clues about the criminal's
next destination and identifying clues about the criminal.

Every investigation consumes limited case time.

The detective chooses among constrained travel destinations.

Correct travel advances the pursuit.

Wrong travel wastes time and creates a cold trail that requires
backtracking to the last confirmed location.

Identity clues are compared against a fixed database of ten suspects.

The detective manually submits traits to the warrant computer.

A warrant is issued only when exactly one suspect matches.

Warrant computation also consumes time.

The criminal is hidden at one of three locations in the final city.

Finding the criminal before the deadline is not enough.

The detective must also possess a warrant naming the actual culprit.

Correct hideout + correct warrant + time remaining = capture.

No warrant, wrong warrant or expired time = escape.

Successful cases increase career rank.

After thirteen successful cases, the detective receives the final
case against Deolane San Paolo.

Capturing Deolane with the same rules completes the career and places
the detective in the Hall of Fame.
```

That loop is the mechanical identity of the game.

Do not simplify it away.

Do not modernize it away.

Do not allow visual implementation concerns to change it.

**`GAME_SPEC.md` is the gameplay source of truth.**
