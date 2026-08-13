# CASE_GENERATION.md

## 1. Document authority

This document defines the canonical procedural generation rules for cases in **Deolane San Paolo / `DeolaneSanPaolo`**.

It specifies mathematically and algorithmically how a valid case is produced.

For case-generation behavior:

```text
GAME_SPEC.md
    ↓
CASE_GENERATION.md
    ↓
implementation
```

`GAME_SPEC.md` defines the gameplay contract.

This document defines how procedural generation must produce content that satisfies that contract.

If a generated case violates `GAME_SPEC.md`, the case is invalid even if the generator itself completed without errors.

---

# PART I — GENERATION GOALS

## 2. Primary goals

Every generated case must be:

- deterministic when given the same seed and content version;
- logically solvable;
- mechanically valid;
- geographically traversable;
- temporally winnable;
- nontrivial;
- free from contradictory clues;
- free from route duplication;
- free from unwinnable warrant states;
- stable across browser reloads;
- independent from wall-clock randomness after case creation.

The generator must never depend on runtime generative AI.

---

## 3. Generation pipeline

Every case must be created through a fixed pipeline:

```text
INPUTS
  player profile
  current rank
  solved-case count
  content version
  root RNG seed
        ↓
1. determine case type
        ↓
2. select culprit
        ↓
3. select starting city
        ↓
4. generate hidden route
        ↓
5. select stolen object
        ↓
6. generate travel candidate state
        ↓
7. assign three investigation locations per route city
        ↓
8. select witnesses
        ↓
9. generate geographic clues
        ↓
10. generate identity clues
        ↓
11. distribute negative/non-useful responses
        ↓
12. select final hideout
        ↓
13. compute timing budget
        ↓
14. validate geographic solvability
        ↓
15. validate identity solvability
        ↓
16. validate temporal solvability
        ↓
17. validate persistence/determinism
        ↓
18. accept case OR reject and regenerate
```

No partially invalid case may be exposed to the player.

---

# PART II — DETERMINISTIC RANDOMNESS

## 4. Root case seed

Every generated case receives a root seed.

The seed must be a stable integer or stable string that is transformed into a deterministic PRNG state.

Recommended external representation:

```text
DSP-<contentVersion>-<profileId>-<caseOrdinal>-<entropy>
```

Example:

```text
DSP-1-kauan-0007-8F13C0A2
```

The exact human-readable format is implementation-defined.

The important requirement is:

```text
same root seed
+
same content version
+
same generation algorithm version
=
same case
```

---

## 5. Seed sources

For a new case, entropy may be produced from a cryptographically strong browser source such as:

```text
crypto.getRandomValues(...)
```

Once the root seed is created, all procedural generation must use the seeded PRNG.

Do not use `Math.random()` inside case-generation code.

---

## 6. Seeded PRNG

The implementation must provide a deterministic PRNG with stable behavior across supported browsers.

The algorithm must be explicitly chosen and versioned.

Acceptable examples:

- Mulberry32;
- xorshift32;
- SplitMix32;
- PCG variant implemented consistently in TypeScript.

Do not rely on engine-specific random behavior.

---

## 7. Substream seeds

To reduce accidental case changes when one generator subsystem is modified, derive deterministic sub-seeds from the root seed.

Recommended conceptual structure:

```text
rootSeed
├── culpritSeed
├── routeSeed
├── stolenItemSeed
├── placeSeed
├── witnessSeed
├── geoClueSeed
├── identityClueSeed
├── negativeClueSeed
└── hideoutSeed
```

Use a deterministic hash/derivation function:

```pseudo
subSeed = hash(rootSeed + ":" + subsystemName)
```

This means changing witness-selection code should not necessarily reroll the culprit or hidden route.

---

## 8. Generation algorithm version

Persist:

```text
generationVersion
contentVersion
seed
```

with the active case.

Example:

```json
{
  "generationVersion": 1,
  "contentVersion": 3,
  "seed": "DSP-1-..."
}
```

A saved case must continue to reconstruct the same content even after unrelated application updates whenever practical.

If a future incompatible generation change occurs, saved case state should be persisted explicitly rather than regenerated using a different algorithm.

---

# PART III — CASE TYPE

## 9. Ordinary versus final case

The case type is determined before culprit selection.

If:

```text
player.solvedCases < 13
```

then:

```text
caseType = STANDARD
```

If:

```text
player.solvedCases == 13
AND Deolane has not been captured
```

then:

```text
caseType = FINAL_DEOLANE
```

After Deolane has been captured, the principal career arc is complete.

Post-career free play, if implemented later, is outside this baseline specification.

---

# PART IV — CULPRIT SELECTION

## 10. Standard culprit pool

For standard cases:

```text
eligibleCulprits = all suspects except Deolane San Paolo
```

The baseline pool therefore contains:

```text
9 subordinate criminals
```

---

## 11. Final culprit

For the final case:

```text
culprit = Deolane San Paolo
```

No RNG is used for final culprit selection.

---

## 12. Repetition control

Standard culprit selection must avoid excessive immediate repetition.

Canonical rule:

```text
if at least 2 eligible culprits exist:
    culprit != previousCase.culprit
```

Additionally, if historical profile state stores recent culprits:

```text
prefer culprits not used in the last 2 solved/failed cases
```

This second restriction is soft.

If it makes selection impossible, only the immediate-repeat prohibition remains hard.

---

## 13. Culprit weighting

Baseline selection is uniform among currently eligible suspects.

For candidate set `S`:

```text
P(s) = 1 / |S|
```

for every:

```text
s ∈ S
```

Do not secretly make visually distinctive suspects more frequent.

---

# PART V — ROUTE LENGTH

## 14. Rank route lengths

The hidden route length is fixed by current rank.

| Rank / case type | Total route cities |
|---|---:|
| Rookie | 4 |
| Sleuth | 5 |
| Private Eye | 6 |
| Investigator | 7 |
| Ace Detective | 8 |
| Final Deolane | 8 |

If:

```text
L = route length
```

then the player must make:

```text
L - 1
```

correct forward travel decisions.

---

# PART VI — STARTING CITY

## 15. Starting-city pool

A starting city is selected from cities marked:

```text
canStartCase = true
```

in content data.

By default all 30 cities should be eligible unless explicitly excluded.

---

## 16. Starting-city constraints

The selected starting city must satisfy:

1. enough graph connectivity exists to generate a route of required length;
2. at least three allowed investigation place types exist;
3. at least one compatible stolen object exists;
4. the city is not prohibited for the current case type;
5. generation can find a valid full route without repeated cities.

---

## 17. Starting-city repetition

Soft preference:

```text
startingCity != previousCase.startingCity
```

If enough cities exist, avoid reuse among the previous three case starts.

This is not a hard validity condition.

---

# PART VII — HIDDEN ROUTE GENERATION

## 18. Route definition

The route is an ordered list:

```text
R = [r0, r1, r2, ..., r(L-1)]
```

where:

```text
r0 = starting city
r(L-1) = final city
```

and:

```text
ri != rj for all i != j
```

---

## 19. Route-edge validity

For every adjacent pair:

```text
(ri, r(i+1))
```

a legal travel connection must exist.

Therefore:

```text
edge(ri, r(i+1)) = true
```

---

## 20. Route generation algorithm

Use constrained randomized depth-first search with backtracking.

Conceptual algorithm:

```pseudo
function generateRoute(start, targetLength, rng):
    route = [start]

    function extend(route):
        if route.length == targetLength:
            return route

        current = route.last

        candidates =
            legalConnections(current)
            .filter(city => city not in route)
            .filter(city => canStillReachRequiredDepth(city, route))

        shuffle(candidates, rng)

        for candidate in candidates:
            route.push(candidate)

            if partialRoutePassesConstraints(route):
                result = extend(route)
                if result exists:
                    return result

            route.pop()

        return failure

    return extend(route)
```

Do not generate an unconstrained random list of cities and merely pretend they are connected afterward.

---

## 21. Route quality constraints

A route is rejected if:

- any city repeats;
- any edge is illegal;
- a route city has fewer than required travel-choice possibilities for clue gameplay;
- the resulting geographic clues cannot distinguish forward progression;
- minimum required gameplay time exceeds deadline;
- the final city lacks three valid investigation locations.

---

## 22. Avoid trivial geographic oscillation

Reject routes containing obvious alternating regional patterns when avoidable, such as:

```text
Europe → neighboring Europe → neighboring Europe → neighboring Europe
```

for every step of a long high-rank case.

This is a soft diversity constraint, not a hard geographic simulation rule.

Preferred routes should create the sensation of international pursuit.

---

## 23. Optional distance diversity heuristic

Content data may group cities into broad regions:

```text
North America
South America
Europe
Africa
Middle East
Asia
Oceania
```

Route scoring may reward transitions across regions.

Example score:

```pseudo
score(route) =
    uniqueRegions(route) * REGION_WEIGHT
    + routeLength
    - repeatedRegionRunsPenalty
```

The generator may choose among several valid candidate routes using this score.

This must never override solvability.

---

# PART VIII — TRAVEL CANDIDATES AND DECOYS

## 24. Candidate destination source

The player-facing departure list is derived from legal connections of the current city/state.

The hidden next city must appear in that list.

---

## 25. Correct-route candidate structure

For a live trail city `ri`, where:

```text
i < L - 1
```

the departure list must contain:

```text
r(i+1)
```

plus legal alternatives.

These alternatives are **decoy destinations**.

---

## 26. Decoy count target

Baseline target number of displayed choices:

```text
3 to 5 total destinations
```

including the correct destination.

Preferred default:

```text
4 total destinations
```

when graph connectivity permits.

Rank may influence the preferred count:

| Rank | Preferred total travel choices |
|---|---:|
| Rookie | 3 |
| Sleuth | 3 |
| Private Eye | 4 |
| Investigator | 4 |
| Ace Detective | 5 |
| Final Deolane | 5 |

If the legal graph provides fewer choices, display all legal choices.

---

## 27. Decoy validity

A decoy must:

- be legally reachable;
- not be the hidden next city;
- not duplicate another displayed destination;
- not be made obviously impossible by every useful clue;
- remain distinguishable from the correct city through the combined clue set.

---

## 28. Decoy quality

Good decoys should share some clue-domain similarities with the correct target.

Example:

If the correct city uses a currency clue, avoid only presenting decoys with wildly unrelated currencies when a more plausible distractor exists.

Difficulty increases when clues require comparison, not when the interface hides information.

---

## 29. Candidate list order

Destination display order must be randomized deterministically per case state.

The correct destination must not always appear:

- first;
- center;
- last.

Use a seeded shuffle.

---

# PART IX — WRONG-CITY RECOVERY CANDIDATES

## 30. Trail anchor

The generator/runtime tracks:

```text
trailAnchor = furthest confirmed correct-route city
```

Wrong travel does not change it.

---

## 31. Recovery guarantee

While the player is off-route, the candidate travel list must always contain a recovery option toward the trail anchor.

Baseline behavior:

```text
trailAnchor is inserted as a legal recovery destination
```

even when normal graph topology would require multiple hops.

This is a gameplay recovery edge, not necessarily a permanent world-map connection.

---

## 32. Wrong-city decoys

While off-route, the game may also display other legal destinations.

Preferred total candidate count follows rank difficulty.

However:

```text
recovery destination must always be present
```

The game may allow multiple wrong choices before recovery.

---

# PART X — STOLEN OBJECT SELECTION

## 33. Stolen-object source

Every city defines or references a pool of eligible stolen objects.

Example conceptual data:

```text
São Paulo:
- museum artifact
- historic document
- ceremonial object
```

The production objects must be original content.

---

## 34. Object compatibility

The selected stolen object must be compatible with the starting city.

Prefer:

```text
object.startCityIds contains startingCity
```

or:

```text
object.region/culture tags overlap startingCity
```

---

## 35. Stolen-object repetition

Avoid selecting the exact same stolen object used in the immediately previous case.

Soft preference:

```text
avoid previous 3 objects
```

when enough content exists.

---

# PART XI — INVESTIGATION PLACE GENERATION

## 36. Three locations per city state

Every generated city investigation state contains exactly:

```text
3 unique place types
```

This applies to:

- correct-route cities;
- wrong cities;
- old-route cities;
- final city.

---

## 37. Allowed place pool

For city `c`:

```text
P(c) = allowed place types
```

Generation requires:

```text
|P(c)| >= 3
```

---

## 38. Correct-route place selection

For each correct route city:

```pseudo
places = chooseUnique(P(city), 3, placeRng)
```

Once selected, the list is fixed for that case.

---

## 39. Wrong-city place selection

Wrong-city state may be generated lazily on first arrival using deterministic derivation:

```text
wrongCitySeed = hash(rootSeed + ":wrong-city:" + cityId)
```

This ensures returning to the same wrong city produces the same:

- places;
- witnesses;
- negative responses.

---

## 40. Final-city places

Final city also receives exactly three places.

After selecting them:

```text
finalHideout ∈ finalCityPlaces
```

using the dedicated hideout sub-seed.

---

# PART XII — WITNESS SELECTION

## 41. Witness pool

Each place type defines:

```text
witnessRoles[]
```

Baseline expected size:

```text
3 roles per place type
```

---

## 42. Witness selection

For each generated place:

```pseudo
witness = random(place.witnessRoles, witnessRng)
```

Selection is deterministic for the case.

---

## 43. Witness diversity

Where practical, avoid presenting the same witness role repeatedly across successive route cities.

This is a soft presentation rule.

It must not cause case generation failure.

---

# PART XIII — GEOGRAPHIC CLUE GENERATION

## 44. Geographic clue target

For route city `ri`:

```text
target = r(i+1)
```

Every useful geographic clue generated in `ri` must describe a true property of `target`.

---

## 45. Geographic clue attributes

Each city contains structured clue attributes such as:

```text
currency
language
flag
landmarks
history
geography
river
mountains
fauna
food
architecture
culture
institutions
transport
objects
topics
```

The exact schema belongs in `CONTENT_MODEL.md`.

---

## 46. Clue template compatibility

A clue template declares which attribute type it consumes.

Example:

```text
template type: currency

"The traveler asked where to exchange money for {currency}."
```

A generated clue is valid only if:

```text
target city contains required attribute
AND
template is allowed for selected place
AND
template difficulty <= rank allowance
```

---

## 47. Place-to-clue compatibility

Place types may prefer clue categories.

Example:

```text
Bank:
  currency
  finance
  identity

Airport:
  flag
  language
  destination transport
  identity

Museum:
  history
  landmark
  culture
  identity

Library:
  language
  history
  topic
  identity
```

This creates contextual witness statements.

The mapping belongs in content data.

---

## 48. Candidate discriminator set

For current city `c` with displayed candidate destinations:

```text
D = {d1, d2, ..., dk}
```

and correct target:

```text
t ∈ D
```

a clue attribute `a` is a **strong discriminator** if:

```text
value(t, a)
```

is not shared by any other candidate in `D`.

Formally:

```text
count(d ∈ D where value(d,a) overlaps value(t,a)) == 1
```

---

## 49. Weak discriminator

An attribute is a weak discriminator if it eliminates at least one decoy but does not uniquely identify the target.

Example:

```text
Candidates:
A, B, C, D

Clue 1 leaves:
A, C

Clue 2 leaves:
C
```

Weak clues are permitted, especially at higher ranks, provided the combined clue set resolves uniquely.

---

## 50. Clue-set solvability

Let:

```text
C = set of useful geographic clues available in current route city
```

Define:

```text
compatibleDestinations(clue)
```

as candidate cities consistent with that clue.

The combined candidate set is:

```text
S = intersection over all useful clues of compatibleDestinations(clue)
```

A valid route-city clue plan requires:

```text
S = {target}
```

Exactly one destination must remain.

At least one geographic clue in each route city must remain compatible with multiple displayed candidates. A second, more specific factual clue may be decisive, as in the original manual examples. Difficulty comes from clue order, specificity and the choice between spending time or travelling with partial confidence; generated text must never enumerate competing candidate clues as an artificial `A or B` statement.

Every useful geographic clue must eliminate at least one displayed candidate. A clue whose compatible set equals the complete `DEPART` list is invalid on the correct trail; generic statements such as crossing an international border provide no information in this world-spanning route and are reserved for neither normal nor broad clue slots. Broad reports use meaningful region, hemisphere, latitude or relative-direction information. The city-specific currency, landmark, cuisine and physical-geography reports remain the more decisive layer.

---

## 51. Minimum useful geographic clues

Canonical minimum per correct non-final city:

```text
2 useful geographic clues
```

At Rookie rank, the third witness slot normally carries a separate identity clue. This preserves two truthful geographic reports while allowing enough warrant evidence to be gathered before capture.

---

## 52. Clue redundancy by rank

Preferred geographic-clue pattern:

### Rookie

```text
1 broad geographic clue + 1 specific geographic clue + 1 identity clue
```

or:

```text
2 complementary geographic clues + 1 identity clue
```

### Sleuth

```text
2–3 useful geographic clues
at least 1 broad clue
```

### Private Eye

```text
2–3 useful geographic clues
combined set must be unique
strong clue preferred but not mandatory
```

### Investigator

```text
2 useful minimum
may require combination
```

### Ace Detective / Deolane

```text
2 useful minimum
combination-based discrimination encouraged
```

---

## 53. Geographic clue template repetition

Avoid displaying identical clue templates in adjacent route cities.

Soft preference:

```text
templateId not used in previous route city
```

---

# PART XIV — IDENTITY CLUE GENERATION

## 54. Culprit trait vector

Every culprit has vector:

```text
T = {
  sex,
  hair,
  hobby,
  feature,
  vehicle
}
```

---

## 55. Identity clue target

Every identity clue describes exactly one actual trait of the culprit.

No generated identity clue may describe a different suspect.

Identity text is spoken by the witness in first person, not narrated about the witness and not presented as information voluntarily disclosed by the culprit. Appearance and vehicle clues describe what the speaker saw; hobby clues describe a remark the speaker overheard or relevant behavior. Generic constructions such as `A pessoa revelou cabelo: raspado` and `A testemunha viu...` are forbidden. Each legal trait value has curated clue prose so grammatical articles and context remain natural.

---

## 56. Identity information requirement

Before the final city, exposed identity traits must be sufficient to reduce the suspect database to exactly one suspect.

Let:

```text
E = set of identity traits guaranteed available before final city
```

Then:

```text
matchingSuspects(E).length == 1
```

must hold.

---

## 57. Minimum trait count

Because trait distributions may vary, uniqueness is determined by matching rather than a fixed trait count.

However:

```text
minimum target exposed categories = 3
```

unless fewer than three genuinely suffice and content balance explicitly permits it.

Preferred standard:

```text
3–4 distinct identity categories
```

available before final city.

---

## 58. Identity-clue scheduling

Identity clues should be distributed across the route rather than all appearing immediately.

The generator prefers categories whose current value is shared by multiple suspects. If a distinctive value matching only the culprit is required for mathematical identification, at most one such clue is selected and it is scheduled after the shared clues. Across the normal case pool these isolated strong clues must remain a minority of all identity reports.

Canonical scheduling target:

### Route with 4 cities

Identity categories appear across:

```text
r0, r1, r2
```

before final `r3`.

### Longer routes

Spread clues across early and middle cities.

At least one identifying clue should normally appear within the first two route cities.

---

## 59. Guaranteed identity path

The generator must choose a subset of city/location slots designated as guaranteed identity-clue carriers.

Example:

```text
route city 0 / location slot 2
route city 1 / location slot 1
route city 3 / location slot 3
```

These slots are fixed at case generation.

---

## 60. Identity-clue category diversity

Do not repeat the same identity category as the only evidence source when unused categories are available.

If:

```text
hair = blonde
```

has already been guaranteed, prefer:

```text
vehicle
hobby
feature
sex
```

for subsequent guaranteed identity clues.

Repeated clues may still occur as redundancy.

---

# PART XV — NEGATIVE / NON-USEFUL CLUES

## 61. Wrong-city negative clues

In wrong cities:

```text
100% of witness responses are cold-trail/negative
```

They provide:

- no new route information;
- no new identity traits;
- no false information.

---

## 62. Correct-route non-useful clue budget

Maximum purely non-useful witness count per correct non-final route city:

| Rank | Max non-useful responses |
|---|---:|
| Rookie | 0 |
| Sleuth | 0 |
| Private Eye | 1 occasionally |
| Investigator | 1 |
| Ace Detective | 1 |
| Final Deolane | 1 |

---

## 63. Non-useful clue probability

For ranks where one is allowed:

| Rank | Probability that a correct-route city contains one non-useful witness |
|---|---:|
| Private Eye | 15% |
| Investigator | 30% |
| Ace Detective | 40% |
| Final Deolane | 40% |

If selected, exactly one of the three locations becomes non-useful.

---

## 64. Non-useful constraint

A non-useful slot cannot replace a clue required for:

- geographic uniqueness;
- identity uniqueness;
- temporal reasonable-path solvability.

After assigning a non-useful slot, the case must be revalidated.

---

# PART XVI — COMBINED CLUE DISTRIBUTION

## 65. Witness payload model

Each correct-route witness slot may contain:

```text
GEO_ONLY
IDENTITY_ONLY
GEO_AND_IDENTITY
NON_USEFUL
```

---

## 66. Rookie distribution

Preferred:

```text
slot A = GEO + IDENTITY
slot B = GEO
slot C = GEO + optional IDENTITY
```

All three provide geographic progress information.

---

## 67. Sleuth distribution

Preferred:

```text
2–3 GEO slots
1–2 IDENTITY inclusions
0 NON_USEFUL
```

---

## 68. Private Eye distribution

Preferred:

```text
2–3 GEO slots
1 IDENTITY inclusion minimum while identity plan incomplete
0–1 NON_USEFUL
```

---

## 69. Investigator distribution

Preferred:

```text
2 useful GEO slots minimum
1 identity inclusion where scheduled
0–1 NON_USEFUL
```

---

## 70. Ace Detective / final distribution

Preferred:

```text
2 useful GEO slots minimum
identity according to schedule
0–1 NON_USEFUL
```

Geographic clues should more often require combination.

---

# PART XVII — FINAL CITY GENERATION

## 71. Final-city clue mode

The final city does not need to reveal another geographic destination.

Its three locations use final-pursuit witness content instead.

---

## 72. Final hideout selection

Let final places be:

```text
F = [p0, p1, p2]
```

Choose:

```text
hideoutIndex = randomInt(0, 2, hideoutRng)
```

Then:

```text
finalHideout = F[hideoutIndex]
```

---

## 73. Final non-hideout responses

The other two locations receive deterministic "very close" responses.

They must not falsely identify another city.

They must not reveal:

```text
"The criminal is at the hotel."
```

The player discovers the hideout by searching.

---

# PART XVIII — TIME GENERATION

## 74. Fixed case clock

Case start:

```text
Monday 07:00
```

Deadline:

```text
Sunday 17:00
```

Total budget:

```text
154 chronological hours, including mandatory sleep
```

---

## 75. Travel-edge weights

Travel costs are stored in city connection data.

Allowed baseline range:

```text
3 <= travelHours <= 7
```

The generator does not invent travel cost per case.

It reads the graph edge's configured weight.

---

## 76. Investigation cost schedule

Per city visit:

```text
first unvisited location  = 2h
second                    = 3h
third                     = 4h
```

---

## 77. Warrant computation budget

A reasonable successful path must include at least:

```text
one warrant computation = 2h
```

The generator must not assume perfect zero-cost suspect identification.

---

# PART XIX — TEMPORAL SOLVABILITY

## 78. Minimum theoretical path

For a route of length `L`, theoretical minimum time is:

```text
Tmin =
Σ travel costs across correct route
+
Σ minimum investigations required per route city
+
2h warrant compute
+
minimum final-hideout search cost
```

The generator must calculate a conservative solvable path, not merely an impossible omniscient path.

---

## 79. Reasonable-player path

A case is valid only if a **reasonable deduction path** fits within the deadline.

Baseline validation assumes:

- enough investigations to obtain geographic certainty;
- enough investigations to obtain guaranteed identity clues;
- one warrant compute;
- final city may require searching up to two non-hideout locations before hideout.

Therefore final hideout timing validation must use worst-case search order:

```text
2h + 3h + 4h = 9h
```

for the final city.

The case must remain winnable even if the hideout is the third location searched.

---

## 80. Geographic investigation budget

For each non-final route city, calculate the minimum number of locations required to uniquely identify the next destination using the generated clue set.

Call it:

```text
g_i
```

where:

```text
1 <= g_i <= 3
```

For Rookie cases, expected:

```text
g_i = 1 or 2
```

For higher ranks:

```text
g_i <= 3
```

---

## 81. Identity investigation budget

The solver must also ensure that the locations chosen along the valid route can expose enough identity traits to uniquely identify the culprit.

This may require additional visits beyond geographic minimum.

---

## 82. Solver path search

Temporal validation should use a small state-space search.

State may include:

```text
route index
collected identity categories
visited clue slots in current city
elapsed hours
warrant status
```

The validator should find at least one legal successful path.

Pseudo-concept:

```pseudo
solutions = search all sensible investigation/travel choices

valid if exists solution where:
    culprit uniquely identifiable
    correct warrant issued
    final hideout reached
    elapsedTime < 154h
```

---

## 83. Comfortable margin

Do not accept cases that are technically solvable with one minute/hour to spare only under perfect play.

Required baseline margin:

```text
best reasonable solution time <= deadline - 12 chronological hours
```

This leaves at least:

```text
12 chronological hours
```

for one or more mistakes.

The same minimum applies to Ace Detective and the final Deolane case.

Therefore:

```text
best reasonable solution <= 105 hours
```

---

# PART XX — GEOGRAPHIC SOLVABILITY VALIDATION

## 84. Candidate-clue compatibility table

For each correct route city, build:

```text
candidate destinations × generated clue attributes
```

Example:

| Candidate | Yen | Japanese language | Colosseum |
|---|---|---|---|
| Tokyo | yes | yes | no |
| Rome | no | no | yes |
| Bangkok | no | no | no |

The intended clue intersection must isolate target.

---

## 85. Invalid ambiguity

Reject if:

```text
intersection(useful clues) contains > 1 displayed candidate
```

unless the game intentionally supplies another available clue that resolves the tie.

Since the player can investigate all three, total clue set must always isolate target.

---

## 86. Invalid contradiction

Reject if two useful clues imply mutually incompatible target cities.

Example:

```text
currency clue → Tokyo
landmark clue → Rome
```

when target is one city.

No contradictory clue set is allowed.

---

# PART XXI — IDENTITY SOLVABILITY VALIDATION

## 87. Evidence simulation

Collect all guaranteed identity clues available before final city.

Apply them using the actual warrant matching algorithm.

Valid only if:

```text
matches.length == 1
AND matches[0] == culprit
```

---

## 88. Avoid premature triviality

Preferred balance rejects cases where the first identity clue immediately isolates the culprit.

Exception:

- final Deolane case may include distinctive late-game flavor;
- but the warrant should still require player interaction.

---

## 89. Contradictory identity clues

Any case where generated identity clues refer to conflicting values of the same trait is invalid.

Example:

```text
hair = blonde
hair = black
```

for one culprit is impossible.

---

# PART XXII — RANK-SPECIFIC GENERATION PROFILE

## 90. Rookie profile

```text
route length: 4
preferred travel choices: 3
correct-city non-useful chance: 0%
geo clue style: strong/direct
geo clues per city: 3 useful preferred
identity clue density: high
required geographic combination: low
comfortable margin target: >= 20h
```

The first case should teach the system through generosity, not a separate tutorial that solves it for the player.

---

## 91. Sleuth profile

```text
route length: 5
preferred travel choices: 3
non-useful chance: 0%
geo clues: 2–3 useful
identity clue density: medium-high
clue obscurity: low-medium
margin: >= 20h
```

---

## 92. Private Eye profile

```text
route length: 6
preferred travel choices: 4
non-useful city chance: 15%
max non-useful: 1
clue combination: moderate
identity clue density: medium
margin: >= 20h
```

---

## 93. Investigator profile

```text
route length: 7
preferred travel choices: 4
non-useful city chance: 30%
max non-useful: 1
clue combination: common
clue obscurity: high
identity clue density: controlled
margin: >= 20h
```

---

## 94. Ace Detective profile

```text
route length: 8
preferred travel choices: 5
non-useful city chance: 40%
max non-useful: 1
clue combination: frequent
clue obscurity: highest
margin: >= 15h
```

---

## 95. Final Deolane profile

Same mechanical difficulty as Ace Detective:

```text
route length: 8
preferred travel choices: 5
non-useful city chance: 40%
max non-useful: 1
clue obscurity: highest
margin: >= 15h
culprit: Deolane San Paolo
```

Narrative presentation is different, gameplay rules are not.

---

# PART XXIII — CASE ACCEPTANCE VALIDATOR

## 96. Mandatory validation phases

A generated case must pass:

```text
V1 structural
V2 route
V3 city/place
V4 geographic clue
V5 identity clue
V6 warrant
V7 temporal
V8 final hideout
V9 determinism
```

---

## 97. V1 — Structural validation

Require:

```text
one culprit
one stolen object
one start city
one route
one final city
one final hideout
valid deadline
```

---

## 98. V2 — Route validation

Require:

```text
correct length
no duplicate cities
all route edges legal
all route cities exist
```

---

## 99. V3 — Place validation

For every generated city state:

```text
exactly 3 unique places
all places allowed by city
each place has at least one witness
```

---

## 100. V4 — Geographic clue validation

For every non-final route city:

```text
>= 2 useful geo clues
combined clues isolate next city
no false clue
no contradictory clue
```

Rookie additionally expects 3 useful whenever possible.

---

## 101. V5 — Identity validation

Before final city:

```text
guaranteed identity clues
→ exactly one matching suspect
→ actual culprit
```

---

## 102. V6 — Warrant validation

Simulate the warrant system with guaranteed evidence.

Require:

```text
exactly one match
match == culprit
```

---

## 103. V7 — Temporal validation

Require:

```text
reasonable successful path exists
reasonable path < deadline
margin threshold satisfied
```

---

## 104. V8 — Final-hideout validation

Require:

```text
final city has exactly 3 places
hideout belongs to those places
hideout is stable
worst-case local search remains temporally solvable
```

---

## 105. V9 — Determinism validation

Regenerate case from:

```text
seed
generationVersion
contentVersion
```

and compare canonical serialization.

Expected:

```text
hash(caseA) == hash(caseB)
```

---

# PART XXIV — REGENERATION

## 106. Case rejection

If any validation phase fails:

```text
do not patch the case ad hoc
```

Instead reject and attempt another deterministic generation candidate.

---

## 107. Attempt seeds

Derived attempt seed:

```text
attemptSeed = hash(rootSeed + ":attempt:" + attemptIndex)
```

where:

```text
attemptIndex = 0,1,2,...
```

This keeps retries deterministic.

---

## 108. Maximum attempts

Baseline:

```text
MAX_GENERATION_ATTEMPTS = 100
```

If no valid case is generated:

- fail loudly in development;
- log validation reasons;
- do not expose an invalid case to the player.

Production may fall back to a prevalidated emergency seed if required.

---

# PART XXV — PREVALIDATED FALLBACK CASES

## 109. Emergency fallback

The project may include one prevalidated fallback case per rank.

These are used only if procedural generation unexpectedly fails in production.

Fallback cases must follow the same data schema.

---

## 110. Final-case fallback

The final Deolane case must have at least one prevalidated fallback seed.

The career must never become impossible to finish because of generator failure.

---

# PART XXVI — LAZY WRONG-CITY GENERATION

## 111. Why wrong cities are lazy

There is no need to precompute every possible wrong-city witness state for all 30 cities at case start.

Generate a wrong-city state deterministically on first visit.

---

## 112. Wrong-city deterministic key

Use:

```text
hash(
  rootSeed
  + ":wrong:"
  + trailAnchorId
  + ":"
  + wrongCityId
)
```

Including the trail anchor prevents ambiguity if the same wrong city could be visited from different stages.

---

## 113. Wrong-city state contents

Generate:

- three local places;
- one witness per place;
- negative statement IDs;
- destination order.

No route clue or new identity clue is generated.

---

# PART XXVII — OLD ROUTE CITIES

## 114. Old-route state

When the player returns to a previously confirmed city behind the trail anchor, treat it as:

```text
OLD_TRAIL
```

It must not generate new clues toward an obsolete next city.

---

## 115. Old-route witness content

Use negative/old-trail responses such as:

```text
"They were here, but they're long gone."
```

No new identity traits are granted.

The recovery destination should direct back toward the current trail anchor.

---

# PART XXVIII — PERSISTED CASE SNAPSHOT

## 116. Persist generated results

Do not rely solely on regenerating every detail from seed after play begins.

Persist canonical generated case definition including at minimum:

```text
seed
versions
culpritId
stolenObjectId
route[]
route city generated states
finalHideout
```

And runtime state separately:

```text
currentCity
furthestRouteIndex
trailAnchor
elapsedTime
visited locations
collected clues
active warrant
status
```

---

## 117. Why persist both seed and definition

Seed provides:

- reproducibility;
- debugging;
- compact identification.

Persisted definition protects saved games from future content changes.

---

# PART XXIX — DEBUGGING SUPPORT

## 118. Case debug export

Development builds should support exporting a generated case as JSON.

Example:

```json
{
  "seed": "...",
  "rank": "PRIVATE_EYE",
  "culprit": "...",
  "route": ["...", "..."],
  "clues": {},
  "hideout": "...",
  "validation": {
    "geo": true,
    "identity": true,
    "time": true
  }
}
```

This must never be exposed as a cheat UI in production.

---

## 119. Human-readable generation report

Development tooling should be able to produce:

```text
CASE SEED
CULPRIT
ROUTE
TRAVEL COSTS
CANDIDATES PER CITY
GEO CLUES
IDENTITY CLUES
EXPECTED WARRANT TRAITS
MINIMUM SOLUTION TIME
REASONABLE SOLUTION TIME
MARGIN
FINAL HIDEOUT
```

This is essential for debugging procedural failures.

---

# PART XXX — BULK GENERATION TESTS

## 120. Statistical validation

Automated tests must generate large batches.

Minimum continuous-test target:

```text
1,000 cases per rank
```

Total:

```text
5,000+ standard cases
```

Final Deolane:

```text
1,000 seeded variants
```

---

## 121. Bulk-test assertions

Across generated cases:

- 100% pass structural validation;
- 100% pass route validation;
- 100% pass clue solvability;
- 100% pass warrant solvability;
- 100% pass temporal solvability;
- 100% reproduce from seed;
- 0 duplicate-city routes;
- 0 false identity clues;
- 0 contradictory geographic clue sets.

---

## 122. Distribution monitoring

Tests should report but not necessarily fail on:

- culprit frequency;
- start-city frequency;
- final-city frequency;
- place frequency;
- witness frequency;
- clue-template frequency;
- region frequency;
- average solution time;
- average margin;
- average candidate count.

Use reports to detect biased RNG or content starvation.

---

# PART XXXI — PSEUDOCODE REFERENCE

## 123. Full generation pseudocode

```pseudo
function generateCase(player, rootSeed, content):

    rank = player.rank
    caseType =
        player.solvedCases == 13
            ? FINAL_DEOLANE
            : STANDARD

    for attempt in 0 .. MAX_GENERATION_ATTEMPTS - 1:

        seed = deriveAttemptSeed(rootSeed, attempt)
        rngs = createSubstreams(seed)

        culprit =
            caseType == FINAL_DEOLANE
                ? DEOLANE
                : chooseCulprit(player, rngs.culprit)

        routeLength = getRouteLength(rank, caseType)

        startCity =
            chooseStartCity(
                player,
                routeLength,
                rngs.route
            )

        route =
            generateConnectedUniqueRoute(
                startCity,
                routeLength,
                rngs.route
            )

        if route failed:
            continue

        stolenObject =
            chooseCompatibleObject(
                startCity,
                player,
                rngs.stolenItem
            )

        generatedCities = {}

        for each route city except final:

            places =
                chooseThreeAllowedPlaces(
                    city,
                    rngs.place
                )

            witnesses =
                chooseWitnesses(
                    places,
                    rngs.witness
                )

            candidates =
                buildTravelCandidates(
                    city,
                    nextRouteCity,
                    rank,
                    rngs.route
                )

            geoClues =
                generateSolvableGeoClues(
                    nextRouteCity,
                    candidates,
                    rank,
                    places,
                    rngs.geoClue
                )

            generatedCities[city] =
                combine(
                    places,
                    witnesses,
                    candidates,
                    geoClues
                )

        identityPlan =
            createIdentityPlan(
                culprit,
                route,
                generatedCities,
                rank,
                rngs.identityClue
            )

        applyIdentityPlan(
            generatedCities,
            identityPlan
        )

        applyNegativeClues(
            generatedCities,
            rank,
            rngs.negativeClue
        )

        finalPlaces =
            chooseThreeAllowedPlaces(
                route.last,
                rngs.place
            )

        finalHideout =
            chooseOne(
                finalPlaces,
                rngs.hideout
            )

        caseDefinition =
            assembleCase(...)

        validation =
            validateCase(caseDefinition, content)

        if validation.allPassed:
            return caseDefinition

    throw GenerationFailure
```

---

# PART XXXII — GENERATION INVARIANTS

## 124. Hard invariants

These may never be violated.

### Culprit

```text
exactly one culprit
ordinary culprit != Deolane
final culprit == Deolane
```

### Route

```text
length matches rank
all cities unique
all forward edges valid
```

### Local investigation

```text
exactly 3 locations
all 3 unique
```

### Geographic clues

```text
truthful
>= 2 useful per correct non-final city
combined set identifies next destination
```

### Identity clues

```text
truthful
before final city → culprit uniquely identifiable
```

### Negative clues

```text
never falsely point to another destination
never describe another suspect as culprit
```

### Final city

```text
exactly 3 locations
exactly 1 hideout
```

### Time

```text
valid reasonable solution exists before deadline
```

### Determinism

```text
same seed + versions = same case
```

---

# PART XXXIII — WHAT THE GENERATOR MUST NOT DO

## 125. Forbidden generation behavior

Do not:

- choose arbitrary disconnected cities and call them a route;
- generate clues with runtime LLM calls;
- create false clues for difficulty;
- allow all three correct-city witnesses to be useless;
- make the target destination absent from candidate list;
- generate a suspect that cannot become unique;
- make identity clues contradict each other;
- create duplicate route cities;
- let reload reroll the hideout;
- let witness content change when revisiting;
- adjust deadline secretly to rescue a bad case;
- reveal correct answer because generation failed;
- make Deolane appear as ordinary culprit before final career case;
- use non-seeded `Math.random()` inside generation;
- rely on object-property iteration order as RNG behavior;
- make the correct destination occupy a fixed UI position;
- accept a case merely because a perfect omniscient player can finish it.

---

# PART XXXIV — SOURCE OF TRUTH SUMMARY

## 126. Canonical constants inherited from GAME_SPEC.md

```text
SUSPECT_COUNT = 10

SUBORDINATE_CULPRIT_COUNT = 9

CITY_TARGET_COUNT = 30

LOCAL_PLACE_COUNT = 3

INVESTIGATION_COSTS = [2h, 3h, 4h]

WARRANT_COMPUTE_COST = 2h

TRAVEL_COST_RANGE = 3h..7h

CASE_DURATION = 154 chronological hours

CASE_START = Monday 07:00

DEADLINE = Sunday 17:00

ROUTE_LENGTHS:
Rookie        = 4
Sleuth        = 5
Private Eye   = 6
Investigator  = 7
Ace Detective = 8
Final Deolane = 8

FINAL_DEOLANE_CASE_TRIGGER:
solvedCases == 13
```

If any of these values change in `GAME_SPEC.md`, this document must be updated.

---

## 127. Final directive

The generator is not allowed to be clever at the player's expense.

Its job is to construct a fair mystery.

A valid Deolane San Paolo case must feel uncertain to the player while remaining completely certain to the engine.

The player may make the wrong deduction.

The generator may not make an impossible deduction.

The player may waste time.

The generator may not create a case whose required actions already consume the deadline.

The player may issue the wrong warrant.

The generator must always have made the correct warrant logically obtainable.

The procedural system must therefore behave like:

```text
randomness
    constrained by
logic
    constrained by
solvability
    constrained by
GAME_SPEC.md
```

Never the reverse.

**`CASE_GENERATION.md` is the source of truth for procedural case construction.**
