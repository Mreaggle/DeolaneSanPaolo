# CONTENT_MODEL.md

## 1. Document authority

This document defines the canonical **data model** for all content in **Deolane San Paolo / `DeolaneSanPaolo`**.

It defines:

- which content entities exist;
- which fields each entity contains;
- how entities reference each other;
- which values are data;
- which values are gameplay rules;
- how content is loaded;
- how IDs remain stable;
- how localization is structured;
- how assets are referenced;
- how content validation works.

The purpose of this document is to guarantee that game content remains **fully decoupled from the engine**.

The engine must not know what "Paris", "Deolane", "Hotel" or "gold necklace" means.

The engine must know only:

```text
city
connection
place
witness
suspect
trait
clue
stolen item
rank
asset reference
localized text
```

---

# PART I — CONTENT ARCHITECTURE PRINCIPLES

## 2. Data-driven design

All gameplay content must be represented as structured data.

Adding a new city should primarily require:

```text
new city data
+
new connections
+
new clue attributes
+
new assets
```

Adding a new suspect should primarily require:

```text
new suspect data
+
trait values
+
dossier content
+
asset references
```

The engine should not require suspect-specific or city-specific code changes unless a unique scripted event is explicitly defined in another specification.

---

## 3. Separation of concerns

The project must keep the following layers distinct:

```text
engine rules
    ↓
content data
    ↓
localized strings
    ↓
asset references
    ↓
rendering/UI
```

Examples:

### Engine rule

```text
Exactly 3 investigation locations per city state.
```

Belongs in:

```text
GAME_SPEC.md
engine code
tests
```

### Content data

```text
Cairo allows:
- airport
- bank
- hotel
- museum
- marketplace
- palace
```

Belongs in:

```text
cities.json
```

### Localized text

```text
"Cairo"
"Hotel"
"The witness said..."
```

Belongs in localization files.

### Asset

```text
assets/cities/cairo.png
```

Belongs in:

```text
ASSET_MANIFEST.md
asset registry/data
```

---

## 4. No gameplay logic hidden in prose

Do not encode gameplay-critical behavior inside unparsed human-readable descriptions.

Bad:

```json
{
  "description": "This city is connected to Rome and Athens."
}
```

Good:

```json
{
  "connections": [
    "rome",
    "athens"
  ]
}
```

Descriptions are presentation.

Structured fields are logic.

---

## 5. Stable IDs

Every entity must use a stable machine-readable ID.

IDs must:

- be lowercase;
- use ASCII;
- use hyphen-separated or snake_case consistently;
- never depend on translated labels;
- remain stable after release whenever possible;
- not contain spaces;
- not change because display text changes.

Preferred convention:

```text
kebab-case
```

Examples:

```text
deolane-san-paolo
rio-de-janeiro
foreign-ministry
red-lipstick
gold-necklace
```

---

## 6. Human labels must not be IDs

Bad:

```json
{
  "id": "Deolane San Paolo"
}
```

Good:

```json
{
  "id": "deolane-san-paolo",
  "nameKey": "suspects.deolane-san-paolo.name"
}
```

---

# PART II — DIRECTORY STRUCTURE

## 7. Canonical content directory

Recommended structure:

```text
src/
└── content/
    ├── index.ts
    ├── schemas/
    │   ├── city.schema.ts
    │   ├── suspect.schema.ts
    │   ├── clue.schema.ts
    │   ├── place.schema.ts
    │   ├── witness.schema.ts
    │   ├── item.schema.ts
    │   ├── rank.schema.ts
    │   └── content.schema.ts
    │
    ├── data/
    │   ├── cities.json
    │   ├── connections.json
    │   ├── places.json
    │   ├── witnesses.json
    │   ├── suspects.json
    │   ├── traits.json
    │   ├── clue-templates.json
    │   ├── stolen-items.json
    │   ├── ranks.json
    │   ├── regions.json
    │   ├── organizations.json
    │   └── asset-registry.json
    │
    └── i18n/
        ├── pt-BR/
        │   ├── common.json
        │   ├── cities.json
        │   ├── places.json
        │   ├── witnesses.json
        │   ├── suspects.json
        │   ├── clues.json
        │   ├── items.json
        │   └── narrative.json
        │
        └── en/
            └── ...
```

Exact file names may later change in `TECH_ARCHITECTURE.md`, but the separation itself is mandatory.

---

# PART III — TOP-LEVEL CONTENT REGISTRY

## 8. Content manifest

The content loader should expose a validated aggregate object conceptually similar to:

```ts
interface GameContent {
  contentVersion: number;

  cities: City[];
  connections: Connection[];
  places: Place[];
  witnesses: Witness[];
  suspects: Suspect[];
  traitDefinitions: TraitDefinition[];
  clueTemplates: ClueTemplate[];
  stolenItems: StolenItem[];
  ranks: RankDefinition[];
  regions: Region[];
  organizations: Organization[];
  assets: AssetRegistryEntry[];
}
```

No unvalidated raw JSON should directly reach gameplay systems.

---

## 9. Content version

All content packs must contain:

```text
contentVersion
```

This is separate from:

```text
generationVersion
```

as defined in `CASE_GENERATION.md`.

Example:

```json
{
  "contentVersion": 1
}
```

A content change that may alter generated cases should increment `contentVersion`.

---

# PART IV — CITIES

## 10. City entity

A city is a gameplay node in the world graph.

Canonical shape:

```ts
interface City {
  id: CityId;

  nameKey: I18nKey;
  countryKey: I18nKey;

  regionId: RegionId;

  coordinates: {
    x: number;
    y: number;
  };

  mapLabelOffset?: {
    x: number;
    y: number;
  };

  canStartCase: boolean;

  allowedPlaceIds: PlaceId[];

  clueProfile: CityClueProfile;

  stolenItemTags: string[];

  artworkAssetId: AssetId;

  /** Cultural and economic orientation text; never reused as a clue. */
  briefKey: I18nKey;

  postcardDescriptionKeys: I18nKey[];

  flags?: string[];
}
```

---

## 11. City coordinates

Coordinates exist for UI/map placement.

They are not real GPS requirements.

Recommended normalized range:

```text
0.0–1.0
```

Example:

```json
{
  "coordinates": {
    "x": 0.72,
    "y": 0.38
  }
}
```

These coordinates must not be used to calculate travel time.

Travel times are explicit connection data.

---

## 12. City region

Each city belongs to exactly one broad gameplay region.

Example regions:

```text
north-america
south-america
europe
africa
middle-east
asia
oceania
```

Regions support:

- route diversity heuristics;
- content grouping;
- analytics/testing;
- clue context if required.

Regions do not determine legal travel.

---

## 13. City clue profile

Each city exposes structured geographic/cultural attributes.

Canonical shape:

```ts
interface CityClueProfile {
  currencies: ClueFact[];
  languages: ClueFact[];
  flags: ClueFact[];
  landmarks: ClueFact[];
  history: ClueFact[];
  geography: ClueFact[];
  rivers: ClueFact[];
  mountains: ClueFact[];
  fauna: ClueFact[];
  foods: ClueFact[];
  architecture: ClueFact[];
  culture: ClueFact[];
  institutions: ClueFact[];
  transport: ClueFact[];
  objects: ClueFact[];
  topics: ClueFact[];
}
```

Not every city must populate every category.

---

## 14. Clue fact

A city clue fact represents one true piece of information usable by the clue engine.

```ts
interface ClueFact {
  id: string;
  textKey: I18nKey;
  tags?: string[];
  difficulty?: ClueDifficulty;
}
```

Example:

```json
{
  "id": "currency-yen",
  "textKey": "facts.currency.yen",
  "difficulty": "easy"
}
```

The fact is not itself a full witness sentence.

It is inserted or referenced by clue templates.

---

## 15. City allowed places

Each city defines:

```text
allowedPlaceIds[]
```

Example:

```json
{
  "allowedPlaceIds": [
    "airport",
    "bank",
    "hotel",
    "museum",
    "marketplace",
    "palace"
  ]
}
```

Validation rule:

```text
allowedPlaceIds.length >= 3
```

---

# PART V — CONNECTIONS

## 16. Connection entity

Connections define the world travel graph.

Canonical structure:

```ts
interface Connection {
  id: ConnectionId;

  fromCityId: CityId;
  toCityId: CityId;

  travelHours: number;

  bidirectional: boolean;

  enabled: boolean;

  tags?: string[];
}
```

---

## 17. Travel time

Validation:

```text
3 <= travelHours <= 7
```

unless `GAME_SPEC.md` is changed.

Travel hours are integers.

No runtime geographic-distance calculation is required.

---

## 18. Bidirectional baseline

Preferred content:

```json
{
  "fromCityId": "paris",
  "toCityId": "london",
  "travelHours": 3,
  "bidirectional": true
}
```

The content loader may normalize a bidirectional connection into two directed edges internally.

---

## 19. Connection IDs

Recommended:

```text
<from>--<to>
```

Example:

```text
paris--london
```

For bidirectional edges, either ordering may be canonical but must be consistent.

---

## 20. Graph validation

The full connection set must satisfy:

- every referenced city exists;
- no duplicate directed edge exists;
- no self-connection exists;
- all travel times are valid;
- graph is globally connected;
- enough route depth exists for Ace Detective cases;
- generated routes can satisfy `CASE_GENERATION.md`.

---

# PART VI — PLACES

## 21. Place entity

A place is an investigation-location type reused across cities.

Canonical structure:

```ts
interface Place {
  id: PlaceId;

  nameKey: I18nKey;

  witnessRoleIds: WitnessId[];

  compatibleGeoClueTypes: GeoClueType[];

  identityCluesAllowed: boolean;

  backgroundAssetId: AssetId;

  iconAssetId: AssetId;

  iconAtlasIndex: number;

  tags?: string[];
}
```

---

## 22. Baseline place IDs

Canonical baseline:

```text
airport
bank
foreign-ministry
harbor
hotel
library
marketplace
museum
palace
riverfront
sports-club
stock-exchange
```

Exactly twelve baseline place types.

---

## 23. Place-to-clue compatibility

Example:

```json
{
  "id": "bank",
  "compatibleGeoClueTypes": [
    "currency",
    "institution",
    "object"
  ],
  "identityCluesAllowed": true
}
```

This is content-driven.

The clue engine should not contain:

```ts
if (place.id === "bank") ...
```

unless merely reading this data.

---

# PART VII — WITNESSES

## 24. Witness entity

A witness is a reusable role associated with one place type.

Canonical structure:

```ts
interface Witness {
  id: WitnessId;

  placeId: PlaceId;

  nameKey: I18nKey;

  artworkAssetId: AssetId;

  voiceStyleTags?: string[];

  geoTemplateTags?: string[];
  identityTemplateTags?: string[];
  negativeTemplateTags?: string[];

  tags?: string[];
}
```

---

## 25. Witness scope

Witnesses are roles, not case-specific people.

Example:

```text
bank-teller
hotel-manager
airport-pilot
museum-curator
```

A witness may be reused across many cities.

---

## 26. Witness count baseline

Each place should define approximately:

```text
3 witness roles
```

Validation target:

```text
witnessRoleIds.length >= 3
```

unless content intentionally permits fewer.

---

## 27. Witness artwork

Witness artwork is referenced using:

```text
artworkAssetId
```

Never by direct arbitrary path.

---

# PART VIII — SUSPECTS

## 28. Suspect entity

Canonical structure:

```ts
interface Suspect {
  id: SuspectId;

  nameKey: I18nKey;

  isMastermind: boolean;

  traits: SuspectTraitVector;

  dossier: {
    occupationKey: I18nKey;
    biographyKey: I18nKey;
    extraKeys?: I18nKey[];
  };

  assets: {
    dossierPortraitAssetId: AssetId;
    encounterAssetId: AssetId;
  };

  selection: {
    standardCaseEligible: boolean;
    finalCaseOnly: boolean;
  };

  tags?: string[];
}
```

---

## 29. Suspect trait vector

Canonical shape:

```ts
interface SuspectTraitVector {
  sex: TraitValueId;
  hair: TraitValueId;
  hobby: TraitValueId;
  feature: TraitValueId;
  vehicle: TraitValueId;
}
```

Exactly five categories exist in baseline gameplay.

---

## 30. Deolane record

Deolane must satisfy:

```text
isMastermind = true
standardCaseEligible = false
finalCaseOnly = true
```

Her canonical suspect ID:

```text
deolane-san-paolo
```

---

## 31. Deolane visual identity data

The content model may expose tags for asset/content validation:

```json
{
  "visualTags": [
    "blonde",
    "huge-red-lips",
    "heavy-makeup",
    "large-earrings",
    "oversized-gold-necklace",
    "huge-gold-pendant"
  ]
}
```

These tags do not drive gameplay.

They assist asset consistency.

---

## 32. Suspect count validation

Baseline content must contain:

```text
10 total suspects
```

with:

```text
1 mastermind
9 subordinate suspects
```

---

# PART IX — TRAIT DEFINITIONS

## 33. Trait definition entity

Trait categories and legal values are content.

Canonical structure:

```ts
interface TraitDefinition {
  id: TraitCategoryId;

  nameKey: I18nKey;

  values: TraitValue[];
}
```

---

## 34. Trait categories

Canonical IDs:

```text
sex
hair
hobby
feature
vehicle
```

---

## 35. Trait value

```ts
interface TraitValue {
  id: TraitValueId;
  nameKey: I18nKey;
  clueTextKeys?: I18nKey[];
  tags?: string[];
}
```

Example:

```json
{
  "id": "hair-blonde",
  "nameKey": "traits.hair.blonde"
}
```

---

## 36. Trait value IDs

Trait IDs should be globally unambiguous.

Recommended:

```text
sex-female
sex-male

hair-blonde
hair-black
hair-brown
hair-red

vehicle-limousine
vehicle-convertible
vehicle-motorcycle
```

---

## 37. Suspect uniqueness validation

For every pair of suspects:

```text
full trait vector must differ
```

Validation:

```pseudo
serializeTraits(suspectA) != serializeTraits(suspectB)
```

---

## 38. Partial trait balance validation

The content validator should report:

- traits that uniquely identify one suspect alone;
- two-trait combinations that uniquely identify one suspect;
- overrepresented trait values;
- underrepresented values.

An isolated trait value matching exactly one suspect is a hard content error. Every suspect must also remain uniquely identifiable through at least one valid multi-trait combination.

The balanced trait matrix increments `contentVersion` to 2. Save migration preserves the detective career but discards a version-1 active case because its persisted identity clues refer to superseded trait values.

Preferred design is defined in `GAME_SPEC.md`.

---

# PART X — CLUE TYPES

## 39. Clue family

Canonical top-level families:

```ts
type ClueFamily =
  | "geographic"
  | "identity"
  | "negative"
  | "old-trail"
  | "final-proximity";
```

---

## 40. Geographic clue types

Baseline:

```ts
type GeoClueType =
  | "currency"
  | "language"
  | "flag"
  | "landmark"
  | "history"
  | "geography"
  | "river"
  | "mountain"
  | "fauna"
  | "food"
  | "architecture"
  | "culture"
  | "institution"
  | "transport"
  | "object"
  | "topic";
```

---

## 41. Identity clue types

Canonical:

```ts
type IdentityClueType =
  | "sex"
  | "hair"
  | "hobby"
  | "feature"
  | "vehicle";
```

---

# PART XI — CLUE TEMPLATES

## 42. Clue template entity

Clue templates define how structured facts become witness statements.

Canonical structure:

```ts
interface ClueTemplate {
  id: ClueTemplateId;

  family: ClueFamily;

  geoType?: GeoClueType;
  identityType?: IdentityClueType;

  textKey: I18nKey;

  allowedPlaceIds?: PlaceId[];
  allowedWitnessIds?: WitnessId[];

  minRankId?: RankId;
  maxRankId?: RankId;

  difficulty: ClueDifficulty;

  requiredTokens: string[];

  tags?: string[];
}
```

---

## 43. Template tokenization

Templates may reference tokens such as:

```text
{fact}
{currency}
{language}
{landmark}
{trait}
{pronoun}
{culpritDescriptor}
```

Example localized template:

```text
"The traveler asked where to exchange money for {currency}."
```

The engine must validate that all required tokens are supplied.

---

## 44. No raw destination requirement

A geographic clue template must not require:

```text
{cityName}
```

for ordinary clue generation unless explicitly tagged as an approved direct/easy clue.

Preferred:

```text
attribute-based clue
```

not:

```text
go-to-city clue
```

---

## 45. Clue difficulty

Canonical difficulty values:

```text
very-easy
easy
medium
hard
very-hard
```

Ranks determine which templates may be used.

Exact mapping belongs in `CASE_GENERATION.md`.

---

## 46. Negative clue templates

Negative templates contain no geographic target fact and no suspect trait.

Example data shape:

```json
{
  "id": "negative-no-one-seen",
  "family": "negative",
  "textKey": "clues.negative.no-one-seen",
  "difficulty": "easy"
}
```

---

## 47. Old-trail templates

Used when player returns behind the trail anchor.

Example semantics:

```text
"They were here earlier, but the trail has moved on."
```

---

## 48. Final-proximity templates

Used in final-city non-hideout locations.

They confirm proximity without naming the hideout.

---

# PART XII — GENERATED CLUE INSTANCE

## 49. Runtime clue instance

Generated case data should store normalized clue instances, not only template IDs.

Recommended shape:

```ts
interface GeneratedClue {
  id: GeneratedClueId;

  family: ClueFamily;

  templateId: ClueTemplateId;

  targetCityId?: CityId;

  targetTraitCategory?: TraitCategoryId;
  targetTraitValueId?: TraitValueId;

  factId?: string;

  resolvedTokens: Record<string, string>;

  textKey: I18nKey;

  provenance: {
    routeCityId: CityId;
    placeId: PlaceId;
    witnessId: WitnessId;
  };
}
```

Persist enough information to guarantee save stability.

---

# PART XIII — STOLEN ITEMS

## 50. Stolen item entity

Canonical structure:

```ts
interface StolenItem {
  id: StolenItemId;

  nameKey: I18nKey;
  descriptionKey?: I18nKey;

  compatibleCityIds?: CityId[];
  compatibleRegionIds?: RegionId[];

  tags: string[];

  briefingAssetId?: AssetId;

  enabled: boolean;
}
```

---

## 51. Item compatibility

An item is eligible for a starting city if any of these is true:

```text
city explicitly listed
OR
region explicitly listed
OR
item tags match city stolenItemTags
```

At least one compatibility path must exist.

---

## 52. Item mechanics

Stolen items are narrative content only.

No item may:

- change travel time;
- alter warrant logic;
- provide inventory abilities;
- change culprit traits;

unless `GAME_SPEC.md` is explicitly revised.

---

# PART XIV — RANKS

## 53. Rank definition entity

Canonical structure:

```ts
interface RankDefinition {
  id: RankId;

  nameKey: I18nKey;

  order: number;

  solvedCasesMin: number;
  solvedCasesMax: number | null;

  routeLength: number;

  preferredTravelChoiceCount: number;

  clueProfileId: string;

  rankBadgeAssetId: AssetId;

  promotionNarrativeKey?: I18nKey;
}
```

---

## 54. Canonical ranks

IDs:

```text
rookie
sleuth
private-eye
investigator
ace-detective
```

---

## 55. Rank gameplay values

The rank JSON may repeat values already fixed by `GAME_SPEC.md` for convenient data loading.

However:

```text
GAME_SPEC.md is authoritative
```

Validation must ensure content values match canonical gameplay constants.

---

# PART XV — REGIONS

## 56. Region entity

Canonical:

```ts
interface Region {
  id: RegionId;
  nameKey: I18nKey;
  routeDiversityWeight?: number;
}
```

Regions are content metadata, not gameplay destinations.

---

# PART XVI — ORGANIZATIONS

## 57. Organization entity

Narrative organizations may be represented as content.

Canonical:

```ts
interface Organization {
  id: OrganizationId;

  nameKey: I18nKey;
  shortNameKey?: I18nKey;
  descriptionKey?: I18nKey;

  type:
    | "detective-agency"
    | "criminal-organization"
    | "other";

  emblemAssetId?: AssetId;
}
```

Canonical organizations for the initial content pack:

```text
agencia-atlas → Agência Federal             → detective-agency
tcc           → T.C.C. — Tríade Chapa-Coco → criminal-organization
```

The stable organization ID `agencia-atlas` is retained for save and content compatibility; its canonical player-facing name is **Agência Federal**.

The canonical expansion of `T.C.C.` is **Tríade Chapa-Coco**. Internal stable IDs remain `tcc`.

---

# PART XVII — ASSET REGISTRY

## 58. Asset registry entry

Code should reference assets using stable IDs.

Canonical:

```ts
interface AssetRegistryEntry {
  id: AssetId;

  path: string;

  type:
    | "image"
    | "sprite"
    | "icon"
    | "background"
    | "portrait"
    | "map"
    | "ui";

  width?: number;
  height?: number;

  transparent?: boolean;

  manifestNumber?: number;

  tags?: string[];
}
```

---

## 59. Asset IDs versus paths

Good:

```json
{
  "artworkAssetId": "city-cairo"
}
```

Registry:

```json
{
  "id": "city-cairo",
  "path": "/assets/cities/cairo.png"
}
```

Bad:

```json
{
  "artwork": "../../../public/assets/final2/cairo-real.png"
}
```

---

## 60. Asset manifest integration

Every production asset reference must exist in:

```text
ASSET_MANIFEST.md
```

and in the runtime asset registry.

The validator must reject unknown asset IDs.

---

# PART XVIII — LOCALIZATION

## 61. Localization principle

Gameplay content must never depend on localized text.

All logic references IDs.

Rendering resolves IDs to text keys.

---

## 62. I18n key example

Content:

```json
{
  "id": "deolane-san-paolo",
  "nameKey": "suspects.deolane-san-paolo.name"
}
```

Portuguese localization:

```json
{
  "suspects": {
    "deolane-san-paolo": {
      "name": "Deolane San Paolo"
    }
  }
}
```

---

## 63. Baseline language

Initial production language:

```text
pt-BR
```

The data architecture must support future additional locales.

---

## 64. No text embedded in gameplay data where avoidable

Bad:

```json
{
  "name": "Hotel"
}
```

Preferred:

```json
{
  "nameKey": "places.hotel.name"
}
```

---

# PART XIX — CONTENT REFERENCES

## 65. Referential integrity

Every ID reference must resolve.

Examples:

```text
City.regionId → Region.id
City.allowedPlaceIds[] → Place.id
Place.witnessRoleIds[] → Witness.id
Witness.placeId → Place.id
Suspect.trait values → TraitValue.id
ClueTemplate.allowedPlaceIds → Place.id
StolenItem.compatibleCityIds → City.id
Rank.rankBadgeAssetId → Asset.id
```

Missing references are build errors.

---

## 66. No circular semantic dependencies

Data may reference other entities, but loading must not depend on accidental file order.

The content loader should:

1. load raw files;
2. validate schema;
3. build indexes;
4. validate cross-references;
5. freeze normalized content.

---

# PART XX — CONTENT INDEXES

## 67. Runtime indexing

After validation, create maps:

```ts
citiesById
connectionsFromCity
placesById
witnessesById
suspectsById
traitValuesById
clueTemplatesById
itemsById
ranksById
assetsById
```

Gameplay systems should use O(1)-style lookups rather than repeatedly scanning arrays.

---

# PART XXI — JSON EXAMPLES

## 68. Example city

Illustrative only:

```json
{
  "id": "cairo",
  "nameKey": "cities.cairo.name",
  "countryKey": "countries.egypt",
  "regionId": "africa",

  "coordinates": {
    "x": 0.55,
    "y": 0.48
  },

  "canStartCase": true,

  "allowedPlaceIds": [
    "airport",
    "bank",
    "hotel",
    "museum",
    "marketplace",
    "palace"
  ],

  "clueProfile": {
    "currencies": [
      {
        "id": "egyptian-pound",
        "textKey": "facts.currency.egyptian-pound",
        "difficulty": "easy"
      }
    ],
    "languages": [
      {
        "id": "arabic",
        "textKey": "facts.language.arabic",
        "difficulty": "easy"
      }
    ],
    "landmarks": [
      {
        "id": "giza-pyramids",
        "textKey": "facts.landmark.giza-pyramids",
        "difficulty": "easy"
      }
    ],
    "geography": [],
    "rivers": [
      {
        "id": "nile",
        "textKey": "facts.river.nile",
        "difficulty": "easy"
      }
    ],
    "history": [],
    "flags": [],
    "mountains": [],
    "fauna": [],
    "foods": [],
    "architecture": [],
    "culture": [],
    "institutions": [],
    "transport": [],
    "objects": [],
    "topics": []
  },

  "stolenItemTags": [
    "egypt",
    "antiquity",
    "museum"
  ],

  "artworkAssetId": "city-cairo",

  "postcardDescriptionKeys": [
    "cities.cairo.descriptions.0",
    "cities.cairo.descriptions.1"
  ]
}
```

---

## 69. Example connection

```json
{
  "id": "cairo--athens",
  "fromCityId": "cairo",
  "toCityId": "athens",
  "travelHours": 4,
  "bidirectional": true,
  "enabled": true
}
```

---

## 70. Example place

```json
{
  "id": "bank",
  "nameKey": "places.bank.name",

  "witnessRoleIds": [
    "bank-guard",
    "bank-teller",
    "bank-executive"
  ],

  "compatibleGeoClueTypes": [
    "currency",
    "institution",
    "object"
  ],

  "identityCluesAllowed": true,

  "backgroundAssetId": "place-bank",
  "iconAssetId": "place-icon-atlas",
  "iconAtlasIndex": 1
}
```

---

## 71. Example witness

```json
{
  "id": "bank-teller",
  "placeId": "bank",
  "nameKey": "witnesses.bank-teller.name",
  "artworkAssetId": "witness-bank-teller",

  "geoTemplateTags": [
    "currency"
  ],

  "identityTemplateTags": [
    "neutral"
  ],

  "negativeTemplateTags": [
    "polite"
  ]
}
```

---

## 72. Example suspect

```json
{
  "id": "deolane-san-paolo",
  "nameKey": "suspects.deolane-san-paolo.name",

  "isMastermind": true,

  "traits": {
    "sex": "sex-female",
    "hair": "hair-blonde",
    "hobby": "hobby-luxury",
    "feature": "feature-oversized-gold-pendant",
    "vehicle": "vehicle-luxury-car"
  },

  "dossier": {
    "occupationKey": "suspects.deolane-san-paolo.occupation",
    "biographyKey": "suspects.deolane-san-paolo.biography"
  },

  "assets": {
    "dossierPortraitAssetId": "suspect-deolane-dossier",
    "encounterAssetId": "suspect-deolane-encounter"
  },

  "selection": {
    "standardCaseEligible": false,
    "finalCaseOnly": true
  },

  "visualTags": [
    "blonde",
    "huge-red-lips",
    "heavy-makeup",
    "large-earrings",
    "oversized-gold-necklace",
    "huge-gold-pendant"
  ]
}
```

The example trait values are placeholders until the suspect roster is finalized.

---

## 73. Example trait definitions

```json
[
  {
    "id": "hair",
    "nameKey": "traits.hair.name",
    "values": [
      {
        "id": "hair-blonde",
        "nameKey": "traits.hair.blonde"
      },
      {
        "id": "hair-black",
        "nameKey": "traits.hair.black"
      },
      {
        "id": "hair-brown",
        "nameKey": "traits.hair.brown"
      },
      {
        "id": "hair-red",
        "nameKey": "traits.hair.red"
      }
    ]
  }
]
```

---

## 74. Example geographic clue template

```json
{
  "id": "bank-currency-exchange",
  "family": "geographic",
  "geoType": "currency",
  "textKey": "clues.geo.bank-currency-exchange",

  "allowedPlaceIds": [
    "bank",
    "hotel",
    "airport"
  ],

  "difficulty": "easy",

  "requiredTokens": [
    "currency"
  ]
}
```

---

## 75. Example identity clue template

```json
{
  "id": "identity-hair-observed",
  "family": "identity",
  "identityType": "hair",
  "textKey": "clues.identity.hair-observed",

  "difficulty": "easy",

  "requiredTokens": [
    "hair"
  ]
}
```

---

## 76. Example negative clue

```json
{
  "id": "negative-no-sighting",
  "family": "negative",
  "textKey": "clues.negative.no-sighting",
  "difficulty": "easy",
  "requiredTokens": []
}
```

---

## 77. Example stolen item

```json
{
  "id": "ceremonial-gold-mask",
  "nameKey": "items.ceremonial-gold-mask.name",
  "descriptionKey": "items.ceremonial-gold-mask.description",

  "compatibleCityIds": [
    "cairo"
  ],

  "compatibleRegionIds": [
    "africa"
  ],

  "tags": [
    "gold",
    "museum",
    "antiquity"
  ],

  "enabled": true
}
```

---

## 78. Example rank

```json
{
  "id": "rookie",
  "nameKey": "ranks.rookie.name",

  "order": 0,

  "solvedCasesMin": 0,
  "solvedCasesMax": 0,

  "routeLength": 4,

  "preferredTravelChoiceCount": 3,

  "clueProfileId": "rookie",

  "rankBadgeAssetId": "rank-rookie"
}
```

---

# PART XXII — GENERATED CASE CONTENT REFERENCES

## 79. Case generation does not duplicate source content

Generated case data stores references to canonical content.

Example:

```ts
interface GeneratedCityState {
  cityId: CityId;

  placeStates: GeneratedPlaceState[];

  travelCandidateCityIds: CityId[];
}
```

---

## 80. Generated place state

```ts
interface GeneratedPlaceState {
  placeId: PlaceId;
  witnessId: WitnessId;

  clueIds: GeneratedClueId[];

  visited: boolean;
}
```

Runtime mutable fields may be separated from immutable generated definition.

---

# PART XXIII — CONTENT VALIDATION

## 81. Validation phases

Build/startup validation should include:

```text
schema validation
ID uniqueness
reference validation
game-rule validation
balance warnings
asset validation
localization validation
case-generation stress validation
```

---

## 82. Schema validation

Every JSON file must conform to its schema.

Unknown required fields or invalid types must fail development builds.

---

## 83. ID uniqueness

Within each entity type:

```text
all IDs unique
```

Asset IDs must also be globally unique.

---

## 84. City validation

For every city:

- ID unique;
- region exists;
- at least 3 allowed places;
- every allowed place exists;
- artwork asset exists;
- coordinates valid;
- at least one clue fact exists;
- if `canStartCase`, at least one stolen item can match.

---

## 85. Connection validation

For every connection:

- origin exists;
- destination exists;
- origin != destination;
- travel hours in range;
- no duplicate edge;
- enabled edge contributes to valid graph.

---

## 86. Place validation

For every place:

- at least one witness exists;
- baseline target is three;
- background asset exists;
- compatible clue types valid.

---

## 87. Witness validation

For every witness:

- associated place exists;
- witness is listed by same place or normalized consistently;
- artwork exists;
- referenced template tags are valid if tag registry exists.

---

## 88. Suspect validation

For every suspect:

- all five trait categories present;
- every trait value exists;
- dossier asset exists;
- encounter asset exists.

Global:

```text
10 suspects
1 mastermind
9 standard criminals
```

---

## 89. Trait validation

Every suspect trait value must belong to the correct category.

Bad:

```text
hair = vehicle-limousine
```

must fail.

---

## 90. Clue template validation

For every template:

- family valid;
- referenced place IDs valid;
- difficulty valid;
- required tokens valid;
- geographic template has compatible geoType;
- identity template has identityType;
- localization key exists.

---

## 91. Item validation

For every stolen item:

- localized name exists;
- all city IDs valid;
- all region IDs valid;
- if briefing asset present, asset exists.

---

## 92. Rank validation

Rank data must match `GAME_SPEC.md`.

Mismatch is a hard error.

Example:

```text
GAME_SPEC:
Rookie route length = 4

ranks.json:
Rookie route length = 5

→ BUILD ERROR
```

---

# PART XXIV — LOCALIZATION VALIDATION

## 93. Required keys

Every:

- city name;
- country name;
- place name;
- witness name;
- suspect name;
- dossier field;
- stolen item name;
- rank name;
- clue template;

must resolve in the baseline locale.

---

## 94. Missing localization

Development:

```text
fail loudly
```

Production fallback:

```text
show explicit missing-key marker
```

not empty text.

Example:

```text
[[missing: clues.geo.currency.01]]
```

This makes missing content obvious instead of silently broken.

---

# PART XXV — CONTENT IMMUTABILITY

## 95. Freeze normalized content

After loading and validation, normalized content should be treated as immutable.

Gameplay state must not mutate source content objects.

Bad:

```ts
city.allowedPlaceIds.pop();
```

Good:

```ts
const selected = chooseFrom(city.allowedPlaceIds);
```

---

# PART XXVI — CONTENT ENABLE/DISABLE FLAGS

## 96. Enabled field

Entities that may be staged before release may contain:

```text
enabled
```

Disabled content must not enter procedural pools.

Use for:

- incomplete stolen items;
- unfinished cities;
- disabled clue templates;
- experimental suspects.

---

## 97. Do not delete stable IDs unnecessarily

If released content is retired, prefer:

```text
enabled = false
```

over ID reuse.

Never reuse an old ID for a semantically different entity.

Save-game references depend on stable IDs.

---

# PART XXVII — CONTENT TAGS

## 98. Tags are metadata

Tags may support:

- compatibility;
- search;
- filtering;
- generation heuristics;
- tooling;
- validation;
- asset organization.

Tags must not become hidden arbitrary logic without documentation.

---

## 99. Example tags

```text
coastal
landlocked
historic
modern
religious
financial
museum
luxury
gold
food
night
formal
comic
```

---

# PART XXVIII — CONTENT PACK EXTENSIBILITY

## 100. Future expansion

The model should support adding:

- more cities;
- more suspects;
- more stolen items;
- more clue templates;
- more witnesses;

without core engine changes.

However, baseline gameplay constants such as:

```text
10 suspects
30 city target
```

remain defined by `GAME_SPEC.md`.

Expansion beyond these values requires explicit design approval.

---

# PART XXIX — PROHIBITED HARDCODING

## 101. Engine code must not contain content-specific branching

Forbidden examples:

```ts
if (city.id === "cairo") {
  clue = ...
}
```

```ts
if (suspect.id === "deolane-san-paolo") {
  warrantWorks = true;
}
```

```ts
switch (place.id) {
  case "bank":
    ...
}
```

when the behavior can be represented by content data.

---

## 102. Allowed scripted exceptions

Unique narrative events may require explicit IDs.

Example:

```text
final Deolane sequence
```

This must be controlled by narrative/game state:

```text
caseType == FINAL_DEOLANE
```

not random suspect-name checks scattered across components.

---

# PART XXX — CONTENT LOADER CONTRACT

## 103. Loader sequence

Recommended:

```text
load raw files
    ↓
schema validate
    ↓
normalize
    ↓
build indexes
    ↓
cross-reference validate
    ↓
game-rule validate
    ↓
localization validate
    ↓
asset validate
    ↓
freeze
    ↓
expose GameContent
```

---

## 104. Loader failure

Development/build environment:

```text
content error = hard failure
```

Do not continue with partially valid content.

---

# PART XXXI — TYPESCRIPT ID TYPES

## 105. Branded ID types

Recommended:

```ts
type CityId = string & { readonly __brand: "CityId" };
type PlaceId = string & { readonly __brand: "PlaceId" };
type WitnessId = string & { readonly __brand: "WitnessId" };
type SuspectId = string & { readonly __brand: "SuspectId" };
type AssetId = string & { readonly __brand: "AssetId" };
```

This is optional implementation detail but strongly recommended.

It reduces accidental ID mixing.

---

# PART XXXII — CONTENT TESTING

## 106. Unit validation tests

Tests should assert:

- every city valid;
- every connection valid;
- every place valid;
- every witness valid;
- every suspect valid;
- all trait vectors valid;
- all clue templates render;
- all assets resolve;
- all localization keys resolve.

---

## 107. Graph tests

Automated tests:

- graph connected;
- every city has route opportunities;
- routes up to length 8 can be generated;
- no city is isolated;
- no city has only one unusable onward option.

---

## 108. Suspect-matrix tests

Generate a matrix of all suspect trait combinations.

Report:

- unique full profiles;
- single-trait uniqueness;
- pair uniqueness;
- three-trait uniqueness;
- distribution balance.

---

## 109. Clue discriminator tests

For every possible candidate set used by generator:

- identify available clue facts;
- confirm target can be discriminated;
- report cities with weak clue coverage.

---

# PART XXXIII — EDITORIAL RULES

## 110. Geographic facts must be curated

City facts used for clues should be:

- factually correct;
- stable enough for gameplay;
- not reliant on volatile political/current information unless intentionally updated;
- concise;
- recognizable;
- suitable for indirect deduction.

Do not use brittle facts such as:

```text
current president name
today's exchange rate
current airline route
```

unless a content update process explicitly supports them.

---

## 111. Avoid clue duplication

Different cities should not rely on the same exact clue identity where it causes ambiguity.

Example:

```text
currency = euro
```

is shared widely and is therefore often weak.

Such facts are allowed but should be paired with other distinguishing facts.

---

# PART XXXIV — CONTENT AND VISUAL ASSETS

## 112. Content IDs drive visual selection

Example:

```text
City.id = cairo
City.artworkAssetId = city-cairo
```

The rendering system resolves:

```text
city-cairo
→ asset registry
→ actual file path
```

---

## 113. No filename parsing for logic

Do not infer semantics from file names.

Bad:

```ts
if (assetPath.includes("bank")) ...
```

Good:

```text
Place.id = bank
Place.backgroundAssetId = place-bank
```

---

# PART XXXV — SAVE COMPATIBILITY

## 114. Save references use IDs

Saved cases store:

```text
city IDs
suspect IDs
place IDs
witness IDs
clue/template IDs
item IDs
asset-neutral gameplay state
```

They must not store translated display strings as canonical identity.

---

## 115. Content-version migration

If content changes:

```text
contentVersion increments
```

The save loader may:

- load persisted generated case snapshot;
- migrate known old IDs;
- reject truly incompatible saves gracefully.

Never silently map an old ID to an unrelated new entity.

---

# PART XXXVI — SOURCE OF TRUTH SUMMARY

## 116. Canonical entity set

Baseline content model includes:

```text
City
Connection
Region
Place
Witness
Suspect
TraitDefinition
TraitValue
ClueTemplate
GeneratedClue
StolenItem
RankDefinition
Organization
AssetRegistryEntry
LocalizationEntry
```

---

## 117. Cardinality summary

Baseline expected content:

```text
Cities:
30 target

Suspects:
10 total
1 Deolane
9 subordinates

Places:
12

Witness roles:
~36
approximately 3 per place

Trait categories:
5

Rank tiers:
5

Stolen items:
expandable pool

Clue templates:
expandable curated pool

Connections:
enough to produce connected 30-city graph
and valid 8-city routes
```

---

# PART XXXVII — FINAL DIRECTIVE

## 118. Content must remain replaceable

The engine must be capable of running with a completely different valid content pack.

If replacing:

```text
all cities
all suspects
all witnesses
all stolen items
all clue text
all artwork
```

requires rewriting gameplay logic, this architecture has failed.

The engine should only care that the replacement content satisfies the same schemas and invariants.

That means:

```text
Deolane San Paolo
is content

the warrant algorithm
is engine logic
```

```text
Cairo
is content

travel graph traversal
is engine logic
```

```text
bank teller
is content

investigation action
is engine logic
```

```text
gold pendant
is content

identity filtering
is engine logic
```

Keep those boundaries rigid.

**`CONTENT_MODEL.md` is the source of truth for structured game content and relationships.**
