# TECH_ARCHITECTURE.md

## 1. Document authority

This document defines the canonical technical architecture for **Deolane San Paolo / `DeolaneSanPaolo`**.

It specifies:

- application stack;
- project directory structure;
- engine modules;
- runtime state;
- state machines;
- procedural generation boundaries;
- deterministic RNG;
- persistence;
- content loading;
- asset loading;
- UI integration;
- testing;
- GitHub Pages build/deployment;
- extension rules;
- dependency boundaries;
- error handling;
- versioning.

For implementation decisions:

```text
AGENTS.md
    ↓
GAME_SPEC.md
    ↓
CASE_GENERATION.md
    ↓
CONTENT_MODEL.md
    ↓
UI_UX_SPEC.md
    ↓
VISUAL_SPEC.md
    ↓
ASSET_MANIFEST.md
    ↓
TECH_ARCHITECTURE.md
    ↓
source code
```

If implementation code conflicts with this document or any higher-priority gameplay specification, the code is wrong.

---

# PART I — ARCHITECTURAL GOALS

## 2. Primary goals

The architecture must make the game:

- completely browser-native;
- completely static-hostable;
- compatible with GitHub Pages;
- independent from a backend;
- deterministic where procedural generation requires it;
- data-driven;
- testable without rendering the UI;
- resilient to browser refresh;
- easy to extend with additional content;
- visually independent from gameplay logic;
- small enough to understand as a whole.

---

## 3. Non-goals

The project does not need:

- backend services;
- cloud databases;
- user accounts;
- authentication;
- multiplayer;
- websocket connections;
- server-side rendering;
- runtime OpenAI API calls;
- dynamic image generation during play;
- microservices;
- Electron;
- Node.js runtime on the deployed site;
- complex state-management frameworks unless later proven necessary.

---

# PART II — CANONICAL STACK

## 4. Baseline stack

Canonical implementation stack:

```text
TypeScript
Vite
Svelte
HTML
CSS
Canvas only where appropriate
JSON / TypeScript content data
localStorage
IndexedDB only if later required
Vitest
Playwright
GitHub Actions
GitHub Pages
```

---

## 5. Why Svelte

Svelte is used primarily as a thin UI/view layer.

It must not become the home of gameplay rules.

Svelte components:

```text
render state
receive user input
dispatch intentions
```

They do not:

```text
generate cases
determine correct city
determine warrant validity
advance time independently
calculate rank
choose clues
```

---

## 6. Vite

Vite handles:

- development server;
- TypeScript transformation;
- static production build;
- asset bundling;
- GitHub Pages-compatible output.

Production output:

```text
dist/
```

The deployed application must remain a static site.

---

## 7. TypeScript strictness

Enable strict TypeScript settings.

Expected baseline:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Exact configuration may vary if tooling requires adjustments, but weakening type safety to silence implementation problems is forbidden.

---

# PART III — REPOSITORY STRUCTURE

## 8. Canonical repository tree

Recommended baseline:

```text
DeolaneSanPaolo/
│
├── AGENTS.md
├── ORIGINAL_GAME_ANALYSIS.md
├── GAME_SPEC.md
├── NARRATIVE_WALKTHROUGH.md
├── CASE_GENERATION.md
├── CONTENT_MODEL.md
├── UI_UX_SPEC.md
├── VISUAL_SPEC.md
├── ASSET_MANIFEST.md
├── TECH_ARCHITECTURE.md
├── REFERENCES_AND_ACCEPTANCE.md
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── svelte.config.js
│
├── public/
│   └── assets/
│       ├── title/
│       ├── narrative/
│       ├── emblems/
│       ├── maps/
│       ├── ranks/
│       ├── icons/
│       ├── animations/
│       ├── cities/
│       ├── places/
│       ├── witnesses/
│       ├── suspects/
│       │   ├── dossiers/
│       │   └── encounters/
│       └── items/
│
├── src/
│   ├── main.ts
│   ├── App.svelte
│   │
│   ├── engine/
│   │   ├── GameEngine.ts
│   │   ├── CaseEngine.ts
│   │   ├── RouteEngine.ts
│   │   ├── ClueEngine.ts
│   │   ├── WarrantEngine.ts
│   │   ├── TimeEngine.ts
│   │   ├── TravelEngine.ts
│   │   ├── ProgressionEngine.ts
│   │   ├── InvestigationEngine.ts
│   │   ├── SaveEngine.ts
│   │   └── types.ts
│   │
│   ├── generation/
│   │   ├── CaseGenerator.ts
│   │   ├── RouteGenerator.ts
│   │   ├── ClueGenerator.ts
│   │   ├── IdentityPlanGenerator.ts
│   │   ├── CandidateGenerator.ts
│   │   ├── CaseValidator.ts
│   │   ├── CaseSolver.ts
│   │   └── rng/
│   │       ├── SeededRng.ts
│   │       ├── deriveSeed.ts
│   │       └── hash.ts
│   │
│   ├── state/
│   │   ├── GameState.ts
│   │   ├── CaseState.ts
│   │   ├── UiState.ts
│   │   ├── GameStore.ts
│   │   └── selectors.ts
│   │
│   ├── content/
│   │   ├── index.ts
│   │   ├── loader/
│   │   ├── schemas/
│   │   ├── validators/
│   │   ├── data/
│   │   └── i18n/
│   │
│   ├── ui/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── gameplay/
│   │   ├── dossier/
│   │   ├── warrant/
│   │   ├── map/
│   │   └── narrative/
│   │
│   ├── rendering/
│   │   ├── pixel.ts
│   │   ├── canvas.ts
│   │   ├── sprite.ts
│   │   └── viewport.ts
│   │
│   ├── persistence/
│   │   ├── StorageAdapter.ts
│   │   ├── LocalStorageAdapter.ts
│   │   ├── SaveRepository.ts
│   │   ├── migrations/
│   │   └── schema.ts
│   │
│   ├── assets/
│   │   ├── registry.ts
│   │   ├── preload.ts
│   │   └── types.ts
│   │
│   ├── i18n/
│   │   ├── translator.ts
│   │   └── types.ts
│   │
│   └── utils/
│       ├── assert.ts
│       ├── invariant.ts
│       └── deepFreeze.ts
│
├── scripts/
│   ├── generate-assets.ts
│   ├── analyze-reference-art.ts
│   ├── validate-assets.ts
│   ├── validate-content.ts
│   ├── build-asset-registry.ts
│   └── export-case-debug.ts
│
├── tests/
│   ├── engine/
│   ├── generation/
│   ├── content/
│   ├── persistence/
│   ├── ui/
│   └── e2e/
│
├── references/
│   └── ...
│
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy-pages.yml
```

---

# PART IV — LAYERING

## 9. Canonical dependency direction

Dependencies flow downward only:

```text
UI
↓
GameEngine facade
↓
domain engines
↓
state/content
↓
pure utilities
```

Procedural generation is separate:

```text
GameEngine
↓
CaseGenerator
↓
generation modules
↓
content + seeded RNG
```

---

## 10. Forbidden dependency directions

Forbidden:

```text
engine → Svelte component
engine → DOM
engine → CSS
engine → browser events
content → UI component
generation → localStorage
ClueEngine → image asset
WarrantEngine → city artwork
```

---

## 11. Browser APIs behind adapters

Browser-specific APIs should be isolated.

Examples:

```text
localStorage
Fullscreen API
Audio API
ResizeObserver
requestAnimationFrame
```

Core engine code must not require these APIs.

---

# PART V — GAME ENGINE FACADE

## 12. GameEngine

`GameEngine` is the primary API consumed by UI/state integration.

Conceptual interface:

```ts
interface GameEngine {
  newProfile(name: string): GameState;
  loadProfile(profileId: string): GameState;

  startCase(): EngineResult;
  investigate(placeId: PlaceId): EngineResult;
  travel(cityId: CityId): EngineResult;

  computeWarrant(input: WarrantInput): EngineResult;

  abandonCase(): EngineResult;

  acknowledgeNarrative(): EngineResult;
}
```

The exact signatures may evolve.

The architectural role may not.

---

## 13. GameEngine responsibility

`GameEngine` coordinates domain modules.

It does not contain every rule itself.

It orchestrates:

```text
CaseEngine
InvestigationEngine
TravelEngine
WarrantEngine
TimeEngine
ProgressionEngine
```

---

## 14. EngineResult

All gameplay actions should return an explicit result.

Conceptually:

```ts
interface EngineResult<T = void> {
  ok: boolean;

  event: GameEvent;

  state: Readonly<GameState>;

  data?: T;

  error?: EngineError;
}
```

UI should react to engine events rather than reconstructing rules.

---

# PART VI — CASE ENGINE

## 15. CaseEngine responsibility

`CaseEngine` owns case lifecycle.

Responsibilities:

- start generated case;
- track active case;
- determine active/solved/failed state;
- coordinate final encounter;
- finalize success/failure;
- expose trail anchor and route progress;
- reject actions when case is no longer active.

---

## 16. CaseEngine must not

It must not:

- generate text;
- render UI;
- query DOM;
- select artwork;
- directly write localStorage;
- use random numbers.

---

# PART VII — ROUTE ENGINE

## 17. RouteEngine responsibility

`RouteEngine` evaluates runtime travel relative to the hidden generated route.

It determines classifications such as:

```text
CORRECT_FORWARD
WRONG_CITY
OLD_ROUTE_CITY
TRAIL_ANCHOR
FINAL_CITY
```

---

## 18. Route progress

Canonical mutable values:

```ts
interface RouteRuntimeState {
  furthestRouteIndex: number;
  trailAnchorCityId: CityId;
  currentCityId: CityId;
}
```

`furthestRouteIndex` never decreases.

---

## 19. RouteEngine API concept

```ts
class RouteEngine {
  classifyDestination(...): ArrivalClassification;
  applyArrival(...): RouteRuntimeState;
  isFinalCity(...): boolean;
}
```

---

# PART VIII — TRAVEL ENGINE

## 20. TravelEngine responsibility

TravelEngine:

- verifies destination is currently selectable;
- resolves edge travel cost;
- asks TimeEngine to advance time;
- aborts arrival if deadline expires;
- delegates route classification;
- emits travel/arrival events.

---

## 21. TravelEngine does not decide clues

Route movement and clue content remain separate.

---

# PART IX — INVESTIGATION ENGINE

## 22. InvestigationEngine responsibility

InvestigationEngine owns local location interactions.

It determines:

- whether place exists in current generated city state;
- whether place was already visited;
- current visit investigation count;
- time cost;
- clue instance retrieval;
- final-hideout encounter trigger.

---

## 23. Review behavior

If already visited:

```text
time cost = 0
```

and the existing clue is returned.

No generation occurs.

---

# PART X — CLUE ENGINE

## 24. Runtime ClueEngine

`ClueEngine` does not procedurally create the case.

Generated clue instances already exist in the immutable case definition.

Runtime responsibility:

- retrieve clue instances;
- mark clues discovered;
- expose discovered evidence;
- resolve localized clue presentation data.

---

## 25. Clue generation is separate

Generation belongs in:

```text
generation/ClueGenerator.ts
```

Runtime clue state belongs in:

```text
engine/ClueEngine.ts
```

Do not merge these concepts.

---

# PART XI — WARRANT ENGINE

## 26. WarrantEngine responsibility

WarrantEngine implements the exact suspect-filtering algorithm from `GAME_SPEC.md`.

Input:

```ts
interface WarrantInput {
  sex?: TraitValueId;
  hair?: TraitValueId;
  hobby?: TraitValueId;
  feature?: TraitValueId;
  vehicle?: TraitValueId;
}
```

---

## 27. Match algorithm

Pure function:

```ts
function matchSuspects(
  suspects: readonly Suspect[],
  input: WarrantInput
): readonly SuspectId[]
```

No state mutation.

---

## 28. Compute workflow

Stateful compute:

```text
invalidate current warrant
↓
advance time +2h
↓
deadline check
↓
filter suspects
↓
0 matches      → no warrant
1 match        → issue warrant
>1 matches     → no warrant
```

---

## 29. WarrantEngine must not know culprit during matching

Suspect filtering cannot inspect:

```text
case.culpritId
```

to decide which result to issue.

Correctness is evaluated only at final encounter.

---

# PART XII — TIME ENGINE

## 30. Time representation

Internal canonical representation:

```text
elapsedHours
```

integer from case start.

Case start:

```text
0
```

Deadline:

```text
120
```

---

## 31. Why elapsed hours

This avoids calendar arithmetic bugs.

UI derives:

```text
Monday 09:00 + elapsedHours
```

for presentation.

---

## 32. TimeEngine API

Conceptually:

```ts
class TimeEngine {
  advance(hours: number): TimeResult;
  isExpired(): boolean;
  remainingHours(): number;
  getDisplayTime(): DisplayTime;
}
```

---

## 33. Exclusive deadline

Expired if:

```ts
elapsedHours >= 120
```

---

## 34. TimeEngine is the only gameplay clock mutator

No other module may modify elapsed time directly.

Forbidden:

```ts
state.elapsedHours += 3;
```

outside TimeEngine/reducer logic.

---

# PART XIII — PROGRESSION ENGINE

## 35. ProgressionEngine responsibility

ProgressionEngine determines:

- solved-case count;
- failed-case count;
- current rank;
- promotion;
- final Deolane case eligibility;
- Hall of Fame state.

---

## 36. Rank is derived

Prefer rank derivation from solved-case count rather than treating it as unrelated mutable state.

Concept:

```ts
rank = rankFromSolvedCases(solvedCases)
```

If rank is persisted for convenience, validation must ensure consistency.

---

# PART XIV — CASE GENERATOR

## 37. CaseGenerator role

`CaseGenerator` orchestrates procedural creation.

It consumes:

```text
player profile
rank
content
root seed
generationVersion
```

It returns:

```text
immutable CaseDefinition
```

---

## 38. CaseDefinition is immutable

After acceptance:

```ts
Object.freeze(...)
```

or equivalent deep immutability should prevent accidental mutation.

Runtime progress belongs in `CaseRuntimeState`.

---

# PART XV — GENERATOR SUBMODULES

## 39. RouteGenerator

Responsibilities:

- select start city;
- generate connected unique route;
- obey route length;
- obey route diversity heuristics.

---

## 40. CandidateGenerator

Responsibilities:

- build player-facing travel choices;
- include correct destination;
- select decoys;
- deterministically shuffle candidates;
- produce recovery candidates for wrong-city runtime generation.

---

## 41. ClueGenerator

Responsibilities:

- select true target facts;
- select compatible templates;
- construct geographic clue plans;
- guarantee destination disambiguation.

---

## 42. IdentityPlanGenerator

Responsibilities:

- inspect culprit trait vector;
- choose identity categories;
- distribute them across route cities;
- guarantee eventual unique suspect match.

---

## 43. CaseValidator

Runs all generation invariants.

No generated case may bypass it.

---

## 44. CaseSolver

The validator may use an internal solver to prove:

- route solvability;
- identity solvability;
- warrant availability;
- temporal solvability.

This solver is developer-only.

Its conclusions must never be shown as hints to the player.

---

# PART XVI — RNG

## 45. Central deterministic RNG

All procedural randomness uses one project-owned RNG abstraction.

Concept:

```ts
interface SeededRng {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  shuffle<T>(items: readonly T[]): T[];
}
```

---

## 46. No Math.random in domain/generation code

Lint/test should fail if:

```text
Math.random
```

appears inside:

```text
src/engine/
src/generation/
```

unless specifically whitelisted for root entropy creation outside deterministic generation.

---

## 47. Root entropy boundary

Only root seed creation may use nondeterministic browser entropy.

Recommended:

```text
crypto.getRandomValues()
```

Then deterministic generation takes over.

---

## 48. Sub-seed derivation

Use stable substreams:

```text
culprit
route
places
witnesses
geo-clues
identity-clues
hideout
```

as specified in `CASE_GENERATION.md`.

---

# PART XVII — IMMUTABLE DEFINITION VS MUTABLE STATE

## 49. Critical split

Never store generated definition and mutable progress in one amorphous object.

Use:

```text
CaseDefinition
+
CaseRuntimeState
```

---

## 50. CaseDefinition

Example:

```ts
interface CaseDefinition {
  id: string;

  seed: string;
  generationVersion: number;
  contentVersion: number;

  caseType: CaseType;

  culpritId: SuspectId;
  stolenItemId: StolenItemId;

  route: readonly CityId[];

  cityStates: Readonly<Record<CityId, GeneratedCityDefinition>>;

  finalCityId: CityId;
  finalHideoutPlaceId: PlaceId;

  startHour: 0;
  deadlineHour: 120;
}
```

---

## 51. CaseRuntimeState

Example:

```ts
interface CaseRuntimeState {
  status: CaseStatus;

  currentCityId: CityId;
  furthestRouteIndex: number;
  trailAnchorCityId: CityId;

  elapsedHours: number;

  currentVisitInvestigationCount: number;

  visitedLocations: Record<string, true>;

  discoveredClueIds: GeneratedClueId[];

  activeWarrantSuspectId?: SuspectId;

  wrongCityStates: Record<string, GeneratedWrongCityState>;
}
```

---

# PART XVIII — GLOBAL GAME STATE

## 52. GameState

Conceptually:

```ts
interface GameState {
  schemaVersion: number;

  profile: DetectiveProfile;

  activeCase?: {
    definition: CaseDefinition;
    runtime: CaseRuntimeState;
  };

  ui: UiState;
}
```

---

## 53. DetectiveProfile

```ts
interface DetectiveProfile {
  id: string;
  name: string;

  solvedCases: number;
  failedCases: number;

  deolaneCaptured: boolean;
  hallOfFame: boolean;

  recentCulpritIds: SuspectId[];
  recentStartCityIds: CityId[];
  recentStolenItemIds: StolenItemId[];
}
```

---

# PART XIX — UI STATE

## 54. UiState is separate from gameplay state

Examples:

```ts
interface UiState {
  screen: UiScreen;

  openMenu?: MenuId;
  focusedControl?: string;
  selectedDossierId?: SuspectId;

  textReveal?: TextRevealState;

  modal?: ModalState;
}
```

---

## 55. UI state must not change gameplay truth

Examples of UI-only state:

```text
which dossier page is open
which menu item has focus
text reveal progress
selected uncommitted destination
```

These do not belong in CaseRuntimeState.

---

# PART XX — STATE MACHINE

## 56. High-level application machine

Canonical states:

```text
BOOT
TITLE
HEADQUARTERS
CASE_BRIEFING
CASE_ACTIVE
CASE_RESULT
PROMOTION
HALL_OF_FAME
```

---

## 57. CASE_ACTIVE nested machine

```text
CITY_IDLE
CITY_PLACES
CITY_WITNESS
TRAVEL_SELECT
TRAVEL_TRANSITION
DOSSIERS
WARRANT
TRAIL_FEEDBACK
FINAL_ENCOUNTER
```

---

## 58. State transitions are explicit

Do not infer transitions from DOM visibility.

Bad:

```text
if modal not visible and destination selected...
```

Good:

```text
dispatch(TRAVEL_COMMITTED)
stateMachine.transition(...)
```

---

## 59. Illegal transitions

Illegal transitions should fail safely.

Example:

```text
FINAL_ENCOUNTER → TRAVEL_SELECT
```

must not be possible.

---

# PART XXI — EVENT MODEL

## 60. Game events

Domain actions should emit meaningful events such as:

```text
CASE_STARTED
INVESTIGATION_COMPLETED
CLUE_DISCOVERED
TRAVEL_STARTED
ARRIVED_CORRECT_CITY
ARRIVED_WRONG_CITY
RETURNED_TO_TRAIL
WARRANT_NO_MATCH
WARRANT_MULTIPLE_MATCHES
WARRANT_ISSUED
DEADLINE_EXPIRED
CULPRIT_FOUND
CULPRIT_CAPTURED
CULPRIT_ESCAPED
CASE_SOLVED
CASE_FAILED
RANK_PROMOTED
DEOLANE_CAPTURED
```

---

## 61. Why events

Events allow UI to select:

- animation;
- sound;
- narrative message;

without engine logic knowing about presentation.

---

# PART XXII — COMMAND MODEL

## 62. Commands

User intentions can be represented as commands.

Example:

```ts
type GameCommand =
  | { type: "INVESTIGATE"; placeId: PlaceId }
  | { type: "TRAVEL"; cityId: CityId }
  | { type: "COMPUTE_WARRANT"; input: WarrantInput }
  | { type: "ABANDON_CASE" };
```

This is recommended, not required if direct methods remain equally explicit.

---

# PART XXIII — STATE UPDATE MODEL

## 63. Central mutation boundary

All gameplay state mutation must occur through engine actions/reducers.

Svelte components must not modify nested game state directly.

---

## 64. Prefer immutable updates

Example:

```ts
const nextState = {
  ...state,
  activeCase: {
    ...state.activeCase,
    runtime: {
      ...state.activeCase.runtime,
      elapsedHours: newElapsed
    }
  }
};
```

Implementation may use carefully controlled helpers, but externally visible state should behave immutably.

---

# PART XXIV — CONTENT LOADING

## 65. Startup content pipeline

At startup:

```text
import/load raw content
↓
schema validation
↓
cross-reference validation
↓
rule validation
↓
build indexes
↓
deep freeze
↓
GameContent
```

---

## 66. No raw JSON access from UI

UI consumes selectors/view models.

It should not traverse arbitrary raw JSON files.

---

## 67. Content repository

Recommended abstraction:

```ts
interface ContentRepository {
  getCity(id: CityId): City;
  getPlace(id: PlaceId): Place;
  getWitness(id: WitnessId): Witness;
  getSuspect(id: SuspectId): Suspect;
  getRank(id: RankId): RankDefinition;
  ...
}
```

---

# PART XXV — ASSET ARCHITECTURE

## 68. Asset registry

All production assets must resolve through stable IDs.

Example:

```ts
assetRegistry["city-cairo"]
```

returns:

```text
/assets/cities/cairo.png
```

---

## 69. No arbitrary paths in components

Forbidden:

```svelte
<img src="/assets/cities/cairo.png">
```

Preferred:

```svelte
<img src={resolveAsset(city.artworkAssetId)}>
```

---

## 70. Asset preload

Create category-aware preloading.

Critical preload:

- UI icons;
- current screen background;
- current city;
- immediate narrative assets.

Noncritical:

- unused dossier portraits;
- future cities;
- optional result backgrounds.

---

# PART XXVI — PIXEL RENDERING

## 71. Logical viewport

The game renders into the canonical:

```text
640 × 400
```

logical surface.

---

## 72. DOM versus Canvas

Use DOM/Svelte for:

- menus;
- buttons;
- text;
- panels;
- dossiers;
- warrant controls;
- form fields.

Use Canvas only when materially useful for:

- sprite animation;
- pixel-perfect map composition;
- controlled transition effects.

Do not implement the entire UI in Canvas merely because the game looks old.

---

## 73. Pixel coordinates

All logical geometry uses integers.

Avoid:

```text
x = 12.5
```

within the game surface.

---

# PART XXVII — PERSISTENCE

## 74. Baseline storage

Baseline persistence uses:

```text
localStorage
```

because saves are small and structured.

---

## 75. Storage abstraction

Gameplay code must not directly call:

```text
localStorage.getItem()
localStorage.setItem()
```

outside a storage adapter.

---

## 76. StorageAdapter

Concept:

```ts
interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}
```

---

## 77. SaveRepository

Responsible for:

- serializing;
- parsing;
- validating;
- migrating;
- saving detective profiles;
- saving active case state.

---

## 78. Save key

Recommended namespace:

```text
deolane-san-paolo.save
```

or:

```text
deolane-san-paolo.profile.<id>
```

---

## 79. Save schema version

Every persisted payload contains:

```text
schemaVersion
```

Example:

```json
{
  "schemaVersion": 1
}
```

---

## 80. Save migration

Migration pipeline:

```text
v1
→ v2
→ v3
```

Never write one giant migration from every old version to latest.

---

# PART XXVIII — AUTOSAVE

## 81. Autosave events

Autosave after any gameplay-changing action:

```text
case start
investigation
travel
warrant compute
case completion
case failure
promotion
profile creation
```

---

## 82. UI-only changes do not require save

Examples:

```text
hover
menu open
dossier page selection
text reveal progress
```

unless needed for user-experience restoration.

---

# PART XXIX — SAVE CONSISTENCY

## 83. Transaction-style update

Gameplay flow:

```text
compute next state
↓
validate
↓
commit in memory
↓
persist
↓
render
```

Avoid writing half-updated state.

---

## 84. Save corruption

If parsing fails:

- do not crash into blank screen;
- preserve raw corrupted payload if possible;
- offer safe recovery/reset flow;
- log diagnostic information in development.

---

# PART XXX — WRONG-CITY LAZY GENERATION

## 85. Runtime generation boundary

Wrong-city states may be generated lazily as defined by `CASE_GENERATION.md`.

They still use:

```text
seeded deterministic generator
```

not runtime nondeterminism.

---

## 86. Persist wrong-city state

Once materialized, persist it.

Do not reroll on return.

---

# PART XXXI — LOCALIZATION

## 87. Translator interface

Use key-based lookup:

```ts
t("clues.geo.currency-exchange", tokens)
```

---

## 88. Engine does not localize

Engine events use IDs.

Presentation resolves them to localized strings.

---

## 89. Baseline locale

Initial:

```text
pt-BR
```

Architecture remains locale-agnostic.

---

# PART XXXII — ERRORS

## 90. Domain errors

Use explicit errors/codes.

Examples:

```text
CASE_NOT_ACTIVE
INVALID_DESTINATION
INVALID_PLACE
LOCATION_ALREADY_RESOLVED
INVALID_WARRANT_TRAIT
CONTENT_REFERENCE_MISSING
GENERATION_FAILED
SAVE_CORRUPTED
```

---

## 91. Development invariants

Use assertions for impossible internal states.

Example:

```ts
invariant(route.length > 0, "Case route cannot be empty");
```

---

## 92. Production behavior

Production should fail gracefully where recoverable.

Do not expose stack traces to player-facing UI.

---

# PART XXXIII — TEST ARCHITECTURE

## 93. Test levels

Use:

```text
unit
integration
property/bulk generation
UI component
end-to-end
visual regression
```

---

## 94. Unit tests

Target pure logic:

- suspect matching;
- time advancement;
- rank derivation;
- route classification;
- visit-cost calculation;
- seed derivation.

---

## 95. Integration tests

Target combinations:

```text
GameEngine + domain engines
CaseGenerator + ContentRepository
SaveRepository + migrations
```

---

## 96. Bulk generation tests

As required by `CASE_GENERATION.md`:

```text
>= 1,000 generated cases per rank
```

in stress/validation suites.

CI may use a smaller deterministic smoke subset if full bulk tests become too slow, while scheduled/local validation runs the complete suite.

---

## 97. Property tests

Useful invariants:

```text
route has no duplicates
warrant unique match is deterministic
same seed → same definition
elapsedHours never decreases
furthestRouteIndex never decreases
```

---

## 98. UI tests

UI tests verify:

- screen transitions;
- buttons dispatch correct intent;
- disabled states;
- modal focus;
- text-skip behavior;
- dossier restoration;
- warrant display states.

They must not test gameplay rules that already belong to engine tests by reimplementing them in UI assertions.

---

## 99. End-to-end tests

Use Playwright for:

```text
new profile
start case
investigate
travel
issue warrant
capture culprit
fail by wrong warrant
fail by timeout
reload and resume
final Deolane flow
```

Use predetermined seeds.

---

# PART XXXIV — VISUAL REGRESSION

## 100. Native screenshot size

Visual regression uses:

```text
640 × 400
```

canonical screenshots.

---

## 101. Stable test seed

Use a fixed test profile and case seed so screenshot state remains reproducible.

---

# PART XXXV — DEVELOPMENT DEBUG MODE

## 102. Debug-only tools

Development builds may expose:

- current seed;
- hidden route;
- culprit;
- clue plan;
- final hideout;
- elapsed time;
- solver path;
- generated definition export.

---

## 103. Production exclusion

Debug tools must be disabled/stripped from production UI.

---

# PART XXXVI — DEBUG EXPORT

## 104. Case export

Support JSON export of:

```text
definition
runtime
validation report
```

for bug reproduction.

---

# PART XXXVII — PERFORMANCE

## 105. Performance philosophy

The game should remain extremely lightweight by modern standards.

Targets:

- minimal JavaScript;
- no unnecessary large framework plugins;
- small initial asset preload;
- lazy-load noncritical images;
- avoid continuous render loops unless an animation is active.

---

## 106. No permanent 60 FPS loop

Do not run:

```text
requestAnimationFrame forever
```

when nothing is moving.

Animations may start/stop on demand.

---

# PART XXXVIII — DEPENDENCY POLICY

## 107. Minimize dependencies

Before adding a package, ask:

```text
Can this be implemented safely in <100 lines?
```

If yes, prefer local code where sensible.

---

## 108. Dependency justification

Dependencies are appropriate for:

- Svelte/Vite;
- validation if useful;
- test tooling;
- build tooling.

Do not add giant utility libraries for trivial helpers.

---

# PART XXXIX — CONTENT VALIDATION AT BUILD TIME

## 109. Build must validate content

Production build must fail on:

- broken references;
- duplicate IDs;
- invalid rank constants;
- missing baseline localization;
- missing required asset registry entries.

---

## 110. Asset existence validation

Build/test tooling verifies every `ASSET_MANIFEST` production path exists once status reaches:

```text
APPROVED
or
IMPLEMENTED
```

During early development, `NOT_STARTED` placeholders may be tolerated according to development mode.

---

# PART XL — IMAGE GENERATION TOOLING

## 111. OpenAI generation is development-only

`scripts/generate-assets.ts` may use the user's OpenAI API.

Nothing under:

```text
src/
```

should contain API credentials or image-generation client logic needed by the shipped game.

---

## 112. Script separation

Generation tooling may depend on Node-only libraries.

That tooling is never bundled into GitHub Pages output.

---

# PART XLI — GITHUB PAGES

## 113. Static deployment

Production output is:

```text
dist/
```

served entirely through GitHub Pages.

---

## 114. Base path

Vite configuration must support project subpath hosting.

Example target:

```text
https://<user>.github.io/DeolaneSanPaolo/
```

Therefore asset routing must not assume:

```text
/
```

is always the app root.

---

## 115. No server routing dependency

Prefer simple SPA state without URL routes for every internal game screen.

If routing library is used later, it must work under static GitHub Pages hosting.

---

# PART XLII — GITHUB ACTIONS

## 116. CI workflow

`.github/workflows/ci.yml` should run:

```text
install
typecheck
lint
unit tests
integration tests
content validation
asset-registry validation
build
```

---

## 117. Pages workflow

Deployment workflow:

```text
checkout
install
test/build
upload Pages artifact
deploy
```

Asset-generation API calls must never run as part of deployment.

---

# PART XLIII — BUILD REPRODUCIBILITY

## 118. Lockfile

Commit package lockfile.

Use deterministic dependency installation in CI.

---

## 119. Generated source control

Production assets are committed.

Do not regenerate art during build.

---

# PART XLIV — EXTENSIBILITY RULES

## 120. Adding a city

Required:

```text
city data
connections
clue facts
allowed places
art asset
localization
asset registry entry
validation
```

No engine code should change.

---

## 121. Adding a suspect

Required:

```text
suspect record
traits
dossier strings
portrait assets
asset registry
validation
```

No warrant algorithm changes.

---

## 122. Adding clue templates

Required:

```text
template data
localization
compatibility metadata
tests
```

No ClueEngine code should change unless a genuinely new clue mechanic is introduced.

---

## 123. Adding a new rank

This is **not** a normal content-only operation because rank count is gameplay specification.

Requires explicit:

```text
GAME_SPEC.md
CASE_GENERATION.md
CONTENT_MODEL.md
TECH_ARCHITECTURE.md
tests
```

updates.

---

# PART XLV — FEATURE FLAGS

## 124. Avoid uncontrolled feature flags

Feature flags may exist for development-only incomplete systems.

They must not become permanent branching architecture.

---

# PART XLVI — NO CONTENT-SPECIFIC ENGINE BRANCHES

## 125. Forbidden examples

```ts
if (cityId === "cairo") { ... }
```

```ts
if (suspectId === "deolane-san-paolo") {
  return true;
}
```

```ts
if (placeId === "hotel") {
  hours = 3;
}
```

unless a specification explicitly requires unique behavior.

---

## 126. Final-case exception

Use:

```text
caseType == FINAL_DEOLANE
```

for final-story mechanics/presentation.

Do not scatter Deolane string comparisons throughout the engine.

---

# PART XLVII — VIEW MODELS

## 127. UI-facing selectors

Expose derived presentation models.

Example:

```ts
interface CityScreenViewModel {
  cityName: string;
  displayTime: string;
  artworkAssetId: AssetId;
  actions: ActionAvailability;
}
```

This reduces Svelte components reaching deep into engine state.

---

# PART XLVIII — SVELTE STORE

## 128. GameStore

A single application store may hold current immutable `GameState`.

The store dispatches engine commands and replaces state with returned state.

---

## 129. No duplicate state

Do not keep:

```text
engine currentCity
and
Svelte currentCity
```

as separate mutable truths.

There must be one canonical gameplay state.

---

# PART XLIX — ACTION FLOW

## 130. Investigation flow example

```text
UI click
↓
GameStore.dispatch(INVESTIGATE)
↓
GameEngine
↓
InvestigationEngine
↓
TimeEngine
↓
CaseEngine if deadline/final encounter
↓
new GameState
↓
SaveRepository autosave
↓
GameEvent
↓
Svelte renders
```

---

## 131. Travel flow example

```text
UI destination commit
↓
GameEngine.travel(cityId)
↓
TravelEngine validates
↓
TimeEngine advances
↓
RouteEngine classifies arrival
↓
CaseRuntimeState updates
↓
autosave
↓
event emitted
↓
UI chooses animation/presentation
```

---

## 132. Warrant flow example

```text
UI selects fields
↓
COMPUTE
↓
GameEngine.computeWarrant
↓
TimeEngine +2h
↓
deadline check
↓
WarrantEngine.matchSuspects
↓
warrant result state
↓
autosave
↓
UI shows result
```

---

# PART L — FINAL ENCOUNTER FLOW

## 133. Final investigation

```text
INVESTIGATE(finalHideout)
↓
InvestigationEngine calculates visit cost
↓
TimeEngine advances
↓
if expired:
    CaseEngine.fail(TIME)
else:
    CaseEngine.beginFinalEncounter()
↓
Warrant validation
↓
capture OR escape
```

---

# PART LI — EVENT/PRESENTATION BOUNDARY

## 134. Presentation maps events to visuals

Example:

```text
ARRIVED_CORRECT_CITY
→ trail animation

WARRANT_ISSUED
→ warrant stamp animation

CULPRIT_CAPTURED
→ capture spritesheet
```

The engine emits semantic events only.

---

# PART LII — SAVE AFTER EVENT

## 135. Animation does not control persistence

State must already be committed before decorative animation finishes.

Closing browser mid-animation cannot undo gameplay action.

---

# PART LIII — VERSION CONSTANTS

## 136. Version categories

Keep separate:

```text
APP_VERSION
SAVE_SCHEMA_VERSION
CONTENT_VERSION
GENERATION_VERSION
POSTPROCESS_VERSION
```

They solve different problems.

---

# PART LIV — DATA MIGRATION PRINCIPLE

## 137. Stable IDs

Migrations refer to stable content IDs.

Never migrate based on localized names.

---

# PART LV — SECURITY

## 138. No secrets in frontend

The production bundle must contain no:

- OpenAI API key;
- GitHub token;
- private endpoint token;
- build secret.

---

## 139. User input

Detective name is plain text content.

Escape/render safely.

Do not inject user-provided name with raw HTML.

---

# PART LVI — OFFLINE/PWA

## 140. Baseline

PWA is optional and not required for first implementation.

Architecture should not prevent a later service worker.

---

## 141. If PWA is added

It must cache:

- build assets;
- production art;
- content data.

It must not alter game mechanics.

---

# PART LVII — AUDIO

## 142. Audio architecture

If audio is implemented:

```text
AudioManager
```

belongs in presentation infrastructure, not engine.

Engine emits events.

AudioManager maps events to sound.

---

# PART LVIII — ACCESSIBILITY

## 143. Semantic DOM

Use semantic buttons/controls under the DOS styling where possible.

The visual illusion should not require inaccessible custom click-only divs.

---

# PART LIX — CODE STYLE

## 144. Module size

Prefer focused modules.

Avoid one 2,000-line engine class.

---

## 145. Pure functions

Use pure functions for:

- ranking;
- matching;
- clue compatibility;
- route checks;
- seed derivation;
- validators.

---

## 146. Comments

Comments should explain:

```text
why
invariant
historical/spec reason
```

not narrate obvious syntax.

---

# PART LX — NAMING

## 147. Domain naming

Use canonical terms consistently:

```text
case
culprit
suspect
route
trailAnchor
furthestRouteIndex
place
witness
clue
warrant
deadline
rank
```

Do not invent synonyms in separate modules.

---

# PART LXI — TEST SEEDS

## 148. Stable fixtures

Maintain fixed seed fixtures:

```text
ROOKIE_HAPPY_PATH
WRONG_CITY_PATH
ZERO_MATCH_WARRANT
MULTI_MATCH_WARRANT
WRONG_WARRANT_FINAL
TIME_EXPIRED
DEOLANE_FINAL
```

---

# PART LXII — REFERENCE IMPLEMENTATIONS

## 149. Reference repositories

Third-party projects may inform implementation.

They must not dictate architecture.

Do not copy a module because its name resembles ours.

Use specifications first.

---

# PART LXIII — PROHIBITED ARCHITECTURES

## 150. Do not implement as

### One giant component

```text
App.svelte owns everything
```

Forbidden.

### One giant engine

```text
Game.ts owns generation + rendering + persistence + rules
```

Forbidden.

### UI-driven gameplay

```text
button click mutates state directly
```

Forbidden.

### Content embedded in code

```text
const cities = [...]
```

inside gameplay modules.

Forbidden.

### Runtime AI

```text
generate clue through API
```

Forbidden.

---

# PART LXIV — DEVELOPMENT ORDER

## 151. Recommended implementation sequence

```text
1. project scaffold
2. TypeScript domain types
3. content schemas/loader
4. deterministic RNG
5. TimeEngine
6. WarrantEngine
7. RouteEngine
8. InvestigationEngine
9. CaseGenerator
10. validators/solver
11. CaseEngine
12. ProgressionEngine
13. GameEngine facade
14. persistence
15. Svelte state/store
16. DOS UI shell
17. gameplay screens
18. narrative flow
19. production assets
20. end-to-end polish
```

This order allows rules to be tested before the interface can hide their mistakes.

---

# PART LXV — DEFINITION OF ENGINE COMPLETE

## 152. Engine completion criteria

The engine is mechanically complete when a test harness can play a full case without Svelte.

Conceptual test:

```ts
const game = createGame(testContent);

game.createProfile("TEST");
game.startCase(seed);

game.investigate(place);
game.travel(city);
game.computeWarrant(...);

...

expect(game.state.activeCase.status).toBe("SOLVED");
```

No DOM required.

---

# PART LXVI — DEFINITION OF ARCHITECTURE COMPLETE

## 153. Architecture acceptance checklist

- [ ] browser-only runtime;
- [ ] static GitHub Pages build;
- [ ] engine independent from Svelte;
- [ ] generated case definition immutable;
- [ ] runtime case state separate;
- [ ] deterministic RNG centralized;
- [ ] no `Math.random()` in generation;
- [ ] content loaded through validated repository;
- [ ] UI uses engine commands;
- [ ] assets referenced by IDs;
- [ ] localStorage isolated behind adapter;
- [ ] save schema versioned;
- [ ] migrations supported;
- [ ] domain events drive presentation;
- [ ] bulk generation tests exist;
- [ ] E2E deterministic seeds exist;
- [ ] no OpenAI key/runtime generation in browser;
- [ ] GitHub Pages base path supported.

---

# PART LXVII — FINAL ARCHITECTURAL CONTRACT

## 154. The shortest complete architecture

The project architecture must behave conceptually like:

```text
STATIC CONTENT
cities / suspects / clues / assets
          │
          ▼
CONTENT REPOSITORY
validated + indexed + immutable
          │
          ├─────────────────┐
          ▼                 ▼
CASE GENERATOR         GAME ENGINE
seeded + validated     deterministic rules
          │                 │
          └──────┬──────────┘
                 ▼
             GAME STATE
                 │
        ┌────────┴────────┐
        ▼                 ▼
   PERSISTENCE           UI
    localStorage       Svelte/DOM
                           │
                           ▼
                      PIXEL RENDERING
                           │
                           ▼
                       USER INPUT
                           │
                           └────→ GAME ENGINE
```

---

## 155. Final directive

A new city should be data.

A new suspect should be data.

A new clue sentence should be data.

A new portrait should be an asset.

A new screen should be presentation.

A new mechanic should be engine code.

Those categories must not bleed into each other.

If adding one city requires modifying `CaseEngine`, something is wrong.

If changing Deolane's portrait requires modifying `WarrantEngine`, something is very wrong.

If Svelte decides whether a warrant is valid, civilization has failed.

Keep the layers separate.

Keep generation deterministic.

Keep gameplay pure.

Keep the browser build static.

**`TECH_ARCHITECTURE.md` is the source of truth for how Deolane San Paolo is implemented.**
