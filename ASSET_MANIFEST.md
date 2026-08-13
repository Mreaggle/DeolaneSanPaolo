# ASSET_MANIFEST.md

## 1. Document authority

This document is the canonical catalog of all production art assets for **Deolane San Paolo / `DeolaneSanPaolo`**.

It is the official source of truth for:

- asset IDs;
- production filenames/paths;
- visual category;
- gameplay/UI purpose;
- native pixel dimensions;
- transparency rules;
- reuse policy;
- production state.

This manifest is the bridge between:

```text
VISUAL_SPEC.md
    ↓
ASSET_MANIFEST.md
    ↓
asset-generation tooling
    ↓
code/runtime asset registry
```

If a production visual asset exists in the project, it must exist here first.

If an asset is not listed here, it is not part of the official production bundle.

---

## 2. Scope

This manifest covers **production art assets** that must exist as raster images, primarily PNGs generated through the user's OpenAI image-generation API workflow as defined in `VISUAL_SPEC.md`.

This manifest does **not** cover UI primitives that must be rendered in code, including:

- menu-bar rectangles;
- panel borders;
- button chrome;
- button bevel states;
- dynamic labels;
- clue text;
- city names;
- time/date text;
- dossier text blocks;
- warrant field labels;
- generic UI separators.

Those elements belong to the code/UI layer and must not silently turn into baked PNGs.

---

## 3. Asset count summary

**Total assets in this manifest: 168**

### Category breakdown
- `animation-sheet`: **8**
- `badge`: **5**
- `city-scene`: **30**
- `emblem`: **2**
- `narrative-screen`: **20**
- `place-background`: **12**
- `stolen-item`: **20**
- `suspect-dossier`: **10**
- `suspect-encounter`: **10**
- `ui-icon`: **15**
- `witness-sprite`: **36**


---

## 4. Status enum

Use the following status values:

- `NOT_STARTED` — specified in the manifest but not yet generated.
- `IN_GENERATION` — currently being generated/regenerated through the API pipeline.
- `IN_REVIEW` — generated, but pending artistic/technical approval.
- `APPROVED` — visually approved and technically valid.
- `IMPLEMENTED` — approved and wired into the runtime.

At manifest creation time, all entries default to `NOT_STARTED` unless explicitly updated later.

---

## 5. Reuse enum

Use the following reuse scopes:

- `UNIQUE_SCREEN` — one specific screen only.
- `GLOBAL_SHARED` — reusable anywhere in the game.
- `CITY_UNIQUE` — one city-specific scene only.
- `SUSPECT_UNIQUE` — one suspect-specific asset only.

---

## 6. Transparency enum

- `opaque` — full-background image, no alpha expected.
- `transparent` — transparent-background sprite/graphic expected.

For transparent assets, final production alpha must normally be binary (`0` or `255`) as required by `VISUAL_SPEC.md`.

---

## 7. Filename and path rules

- Production paths are specified relative to the repository root.
- All art assets listed here are expected to be `.png`.
- IDs are stable and are the canonical symbolic identifiers used by code and tooling.
- Filenames must remain synchronized with the runtime asset registry.
- If a filename must change, update this manifest and the asset registry in the same change.

---

## 8. Native-dimension rules

Native dimensions are the target post-processed output dimensions, not arbitrary API-output dimensions.

The generation workflow may generate a larger source image temporarily, but the approved production file must match the `native_size` in this manifest.

---

## 9. Priority note

The highest-priority assets to generate first are:

1. `title-logo`
2. `title-background`
3. `world-map`
4. the 10 suspect dossier portraits
5. the 10 suspect encounter portraits
6. the 12 place backgrounds
7. the 36 witness sprites
8. the 30 city scenes

This allows style calibration before the full bundle is generated.

---

## 10. Placeholder/stability note

The subordinate suspect IDs are the canonical roster IDs:

```text
cris-minosa, lua-metrayu, thais-kizita, tigrinia-fonseca,
narcola-tamacho, paulo-escolar, zeze-do-rap, cleitinho-matador,
vanzeira
```

These IDs must remain synchronized with `SUSPECT_CAST.md`.

---

## 11. Catalog columns

Each catalog row contains:

| Column | Meaning |
|---|---|
| `#` | Sequential manifest number, zero-padded to 3 digits |
| `id` | Stable canonical asset ID |
| `filename` | Required production path/filename |
| `category` | Visual asset family |
| `purpose` | What the asset is for |
| `native_size` | Final native output dimensions |
| `transparency` | `opaque` or `transparent` |
| `reuse` | Reuse scope |
| `status` | Production state |

---

## 12. Master catalog

### Bundled bitmap type resource

| id | filename | category | purpose | license | status |
|---|---|---|---|---|---|
| `font-atlas-bitmap` | `public/fonts/silkscreen-regular.ttf` | `bitmap-font` | Canonical game-surface typography, exposed in CSS as `AtlasBitmap`. | SIL Open Font License 1.1 (`public/fonts/OFL.txt`) | `IMPLEMENTED` |

### Bundled UI sound resource

| id | filename | category | purpose | status |
|---|---|---|---|---|
| `sfx-typewriter` | `public/audio/sfx/typewriter.mp3` | `ui-sfx` | Parallel per-input feedback for name entry and fixed-cadence feedback for progressively rendered text. | `IMPLEMENTED` |
| `sfx-mouse-click` | `public/audio/sfx/mouse_click.mp3` | `ui-sfx` | Parallel feedback for primary pointer presses. | `IMPLEMENTED` |
| `sfx-publisher-sting` | `public/audio/sfx/mreaggle_software_sting.mp3` | `ui-sfx` | Non-looping Mreaggle Software opening sting synchronized with the publisher logo sequence. | `IMPLEMENTED` |

### Bundled cursor resources

| id | filename | category | purpose | native_size | transparency | status |
|---|---|---|---|---|---|---|
| `cursor-mouse-up` | `public/assets/cursors/mouse-up.png` | `cursor` | Default desktop fine-pointer cursor, downscaled from the supplied source with nearest-neighbor sampling. | `32x35` | `transparent` | `IMPLEMENTED` |
| `cursor-mouse-down` | `public/assets/cursors/mouse-down.png` | `cursor` | Pressed desktop fine-pointer cursor, downscaled from the supplied source with nearest-neighbor sampling. | `32x35` | `transparent` | `IMPLEMENTED` |

### A. Narrative / Meta / UI-Support / Icons / Animation (001–040)

| # | id | filename | category | purpose | native_size | transparency | reuse | status |
|---:|---|---|---|---|---|---|---|---|
| 001 | `title-logo` | `public/assets/title/title-logo.png` | `narrative-screen` | Auxiliary decorative title frame retained for credits or later reuse. | `320x96` | `transparent` | `GLOBAL_SHARED` | `APPROVED` |
| 161 | `title-wordmark` | `public/assets/title/deolane-logo.png` | `narrative-screen` | Official square “Where is Deolane San Paolo?” wordmark supplied by the project owner and retained at the top of the README. | `1254x1254` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 162 | `title-wordmark-retro` | `public/assets/title/deolane-retro.png` | `narrative-screen` | Wide retro wordmark supplied by the project owner, used exclusively on the in-game title screen. | `1536x1024` | `transparent` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 165 | `publisher-mreaggle-logo-notext` | `public/assets/publisher/mreaggle_software_logo_notext.png` | `narrative-screen` | Project-owner-supplied mark-only Mreaggle Software logo shown during the first 800 ms of the publisher sting. | `1254x1254` | `transparent` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 166 | `publisher-mreaggle-logo` | `public/assets/publisher/mreaggle_software_logo.png` | `narrative-screen` | Project-owner-supplied complete Mreaggle Software logo shown from 800 ms until the final post-sting fade. | `1254x1254` | `transparent` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 002 | `title-background` | `public/assets/title/title-background.png` | `narrative-screen` | Full title-screen background artwork. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 003 | `hq-background` | `public/assets/narrative/hq-background.png` | `narrative-screen` | Headquarters backdrop for sign-in, returning-detective and agency hub scenes. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 004 | `news-flash-background` | `public/assets/narrative/news-flash-background.png` | `narrative-screen` | Backdrop for News Flash / case briefing announcement. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 005 | `assignment-background` | `public/assets/narrative/assignment-background.png` | `narrative-screen` | Backdrop for formal case assignment screen. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 006 | `case-solved-background` | `public/assets/narrative/case-solved-background.png` | `narrative-screen` | Success result screen background. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 007 | `case-failed-time-background` | `public/assets/narrative/case-failed-time-background.png` | `narrative-screen` | Failure screen background for time-expired cases. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 008 | `case-failed-no-warrant-background` | `public/assets/narrative/case-failed-no-warrant-background.png` | `narrative-screen` | Failure screen background for final encounter without warrant. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 009 | `case-failed-wrong-warrant-background` | `public/assets/narrative/case-failed-wrong-warrant-background.png` | `narrative-screen` | Failure screen background for final encounter with incorrect warrant. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 010 | `case-failed-abandoned-background` | `public/assets/narrative/case-failed-abandoned-background.png` | `narrative-screen` | Failure screen background for abandoned cases. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 011 | `promotion-background` | `public/assets/narrative/promotion-background.png` | `narrative-screen` | Promotion announcement background used when rank increases. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 012 | `hall-of-fame-background` | `public/assets/narrative/hall-of-fame-background.png` | `narrative-screen` | Hall of Fame completion background after Deolane capture. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 013 | `agency-clerk-portrait` | `public/assets/narrative/agency-clerk-portrait.png` | `narrative-screen` | Portrait/sprite for headquarters attendant / agency operator / terminal guide. | `128x184` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 014 | `world-map` | `public/assets/maps/world-map.png` | `narrative-screen` | World map used in DEPART mode for candidate destination visualization. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 015 | `dossier-cabinet-illustration` | `public/assets/narrative/dossier-cabinet-illustration.png` | `narrative-screen` | Illustrated filing-cabinet / dossier-browser background for suspect index screen. | `640x400` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 016 | `warrant-computer-panel` | `public/assets/narrative/warrant-computer-panel.png` | `narrative-screen` | Front-facing close-up of the warrant computer, with an empty oversized CRT screen behind browser-rendered controls. | `340x306` | `opaque` | `UNIQUE_SCREEN` | `IMPLEMENTED` |
| 017 | `agency-emblem` | `public/assets/emblems/agency-emblem.png` | `emblem` | Detective agency emblem/crest used in narrative screens and UI references. | `64x64` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 018 | `tcc-emblem` | `public/assets/emblems/tcc-emblem.png` | `emblem` | T.C.C. (Tríade Chapa-Coco) emblem used in dossiers / briefings / final case flavor. | `64x64` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 019 | `rank-rookie-badge` | `public/assets/ranks/rank-rookie-badge.png` | `badge` | Rank badge for Rookie. | `48x48` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 020 | `rank-sleuth-badge` | `public/assets/ranks/rank-sleuth-badge.png` | `badge` | Rank badge for Sleuth. | `48x48` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 021 | `rank-private-eye-badge` | `public/assets/ranks/rank-private-eye-badge.png` | `badge` | Rank badge for Private Eye. | `48x48` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 022 | `rank-investigator-badge` | `public/assets/ranks/rank-investigator-badge.png` | `badge` | Rank badge for Investigator. | `48x48` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 023 | `rank-ace-detective-badge` | `public/assets/ranks/rank-ace-detective-badge.png` | `badge` | Rank badge for Ace Detective. | `48x48` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 024 | `icon-see` | `public/assets/icons/icon-see.png` | `ui-icon` | Action icon for SEE. | `24x24` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 025 | `icon-depart` | `public/assets/icons/icon-depart.png` | `ui-icon` | Action icon for DEPART. | `24x24` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 026 | `icon-search` | `public/assets/icons/icon-search.png` | `ui-icon` | Action icon for SEARCH. | `24x24` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 027 | `icon-files` | `public/assets/icons/icon-files.png` | `ui-icon` | Action icon for FILES. | `24x24` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 028 | `icon-back` | `public/assets/icons/icon-back.png` | `ui-icon` | Generic back/return icon. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 029 | `icon-continue` | `public/assets/icons/icon-continue.png` | `ui-icon` | Generic continue/advance icon. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 030 | `icon-clock` | `public/assets/icons/icon-clock.png` | `ui-icon` | Clock/time indicator icon. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 031 | `icon-warrant` | `public/assets/icons/icon-warrant.png` | `ui-icon` | Warrant/status icon. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 032 | `icon-map-marker-current` | `public/assets/icons/icon-map-marker-current.png` | `ui-icon` | Current-city marker for world map. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 033 | `icon-map-marker-available` | `public/assets/icons/icon-map-marker-available.png` | `ui-icon` | Selectable candidate-destination marker for world map. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 034 | `icon-warning` | `public/assets/icons/icon-warning.png` | `ui-icon` | Warning/alert icon for failures or urgent notices. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 035 | `icon-sound-on` | `public/assets/icons/icon-sound-on.png` | `ui-icon` | Sound/music enabled icon for options menu. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 036 | `icon-sound-off` | `public/assets/icons/icon-sound-off.png` | `ui-icon` | Sound/music disabled icon for options menu. | `16x16` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 037 | `travel-airplane-spritesheet` | `public/assets/animations/travel-airplane-spritesheet.png` | `animation-sheet` | Small airplane travel animation spritesheet used during DEPART transitions. | `128x32` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 038 | `trail-alert-spritesheet` | `public/assets/animations/trail-alert-spritesheet.png` | `animation-sheet` | Short trail/proximity feedback spritesheet. | `128x48` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 039 | `capture-spritesheet` | `public/assets/animations/capture-spritesheet.png` | `animation-sheet` | Capture/arrest sequence spritesheet. | `192x64` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 040 | `escape-spritesheet` | `public/assets/animations/escape-spritesheet.png` | `animation-sheet` | Escape/failure sequence spritesheet. | `192x64` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |


### B. City Scenes (041–070)

| # | id | filename | category | purpose | native_size | transparency | reuse | status |
|---:|---|---|---|---|---|---|---|---|
| 041 | `city-mexico-city` | `public/assets/cities/mexico-city.png` | `city-scene` | Primary city artwork for Mexico City. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 042 | `city-london` | `public/assets/cities/london.png` | `city-scene` | Primary city artwork for London. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 043 | `city-moscow` | `public/assets/cities/moscow.png` | `city-scene` | Primary city artwork for Moscow. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 044 | `city-istanbul` | `public/assets/cities/istanbul.png` | `city-scene` | Primary city artwork for Istanbul. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 045 | `city-baghdad` | `public/assets/cities/baghdad.png` | `city-scene` | Primary city artwork for Baghdad. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 046 | `city-tokyo` | `public/assets/cities/tokyo.png` | `city-scene` | Primary city artwork for Tokyo. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 047 | `city-port-moresby` | `public/assets/cities/port-moresby.png` | `city-scene` | Primary city artwork for Port Moresby. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 048 | `city-new-delhi` | `public/assets/cities/new-delhi.png` | `city-scene` | Primary city artwork for New Delhi. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 049 | `city-buenos-aires` | `public/assets/cities/buenos-aires.png` | `city-scene` | Primary city artwork for Buenos Aires. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 050 | `city-sydney` | `public/assets/cities/sydney.png` | `city-scene` | Primary city artwork for Sydney. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 051 | `city-san-marino` | `public/assets/cities/san-marino.png` | `city-scene` | Primary city artwork for San Marino. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 052 | `city-singapore` | `public/assets/cities/singapore.png` | `city-scene` | Primary city artwork for Singapore. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 053 | `city-rome` | `public/assets/cities/rome.png` | `city-scene` | Primary city artwork for Rome. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 054 | `city-reykjavik` | `public/assets/cities/reykjavik.png` | `city-scene` | Primary city artwork for Reykjavik. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 055 | `city-beijing` | `public/assets/cities/beijing.png` | `city-scene` | Primary city artwork for Beijing. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 056 | `city-montreal` | `public/assets/cities/montreal.png` | `city-scene` | Primary city artwork for Montreal. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 057 | `city-lima` | `public/assets/cities/lima.png` | `city-scene` | Primary city artwork for Lima. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 058 | `city-new-york` | `public/assets/cities/new-york.png` | `city-scene` | Primary city artwork for New York. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 059 | `city-paris` | `public/assets/cities/paris.png` | `city-scene` | Primary city artwork for Paris. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 060 | `city-colombo` | `public/assets/cities/colombo.png` | `city-scene` | Primary city artwork for Colombo. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 061 | `city-budapest` | `public/assets/cities/budapest.png` | `city-scene` | Primary city artwork for Budapest. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 062 | `city-kathmandu` | `public/assets/cities/kathmandu.png` | `city-scene` | Primary city artwork for Kathmandu. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 063 | `city-bangkok` | `public/assets/cities/bangkok.png` | `city-scene` | Primary city artwork for Bangkok. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 064 | `city-cairo` | `public/assets/cities/cairo.png` | `city-scene` | Primary city artwork for Cairo. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 065 | `city-athens` | `public/assets/cities/athens.png` | `city-scene` | Primary city artwork for Athens. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 066 | `city-rio-de-janeiro` | `public/assets/cities/rio-de-janeiro.png` | `city-scene` | Primary city artwork for Rio de Janeiro. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 067 | `city-kigali` | `public/assets/cities/kigali.png` | `city-scene` | Primary city artwork for Kigali. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 068 | `city-bamako` | `public/assets/cities/bamako.png` | `city-scene` | Primary city artwork for Bamako. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 069 | `city-moroni` | `public/assets/cities/moroni.png` | `city-scene` | Primary city artwork for Moroni. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |
| 070 | `city-oslo` | `public/assets/cities/oslo.png` | `city-scene` | Primary city artwork for Oslo. | `300x332` | `opaque` | `CITY_UNIQUE` | `IMPLEMENTED` |


### C. Place Backgrounds (071–082)

| # | id | filename | category | purpose | native_size | transparency | reuse | status |
|---:|---|---|---|---|---|---|---|---|
| 071 | `place-airport` | `public/assets/places/airport.png` | `place-background` | Shared investigation-location background for Airport. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 072 | `place-bank` | `public/assets/places/bank.png` | `place-background` | Shared investigation-location background for Bank. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 073 | `place-foreign-ministry` | `public/assets/places/foreign-ministry.png` | `place-background` | Shared investigation-location background for Foreign Ministry. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 074 | `place-harbor` | `public/assets/places/harbor.png` | `place-background` | Shared investigation-location background for Harbor. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 075 | `place-hotel` | `public/assets/places/hotel.png` | `place-background` | Shared investigation-location background for Hotel. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 076 | `place-library` | `public/assets/places/library.png` | `place-background` | Shared investigation-location background for Library. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 077 | `place-marketplace` | `public/assets/places/marketplace.png` | `place-background` | Shared investigation-location background for Marketplace. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 078 | `place-museum` | `public/assets/places/museum.png` | `place-background` | Shared investigation-location background for Museum. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 079 | `place-palace` | `public/assets/places/palace.png` | `place-background` | Shared investigation-location background for Palace. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 080 | `place-riverfront` | `public/assets/places/riverfront.png` | `place-background` | Shared investigation-location background for Riverfront. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 081 | `place-sports-club` | `public/assets/places/sports-club.png` | `place-background` | Shared investigation-location background for Sports Club. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 082 | `place-stock-exchange` | `public/assets/places/stock-exchange.png` | `place-background` | Shared investigation-location background for Stock Exchange. | `300x332` | `opaque` | `GLOBAL_SHARED` | `IMPLEMENTED` |


### D. Witness Sprites (083–118)

| # | id | filename | category | purpose | native_size | transparency | reuse | status |
|---:|---|---|---|---|---|---|---|---|
| 083 | `witness-airport-pilot` | `public/assets/witnesses/airport-pilot.png` | `witness-sprite` | Airport pilot witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 084 | `witness-airport-ticket-clerk` | `public/assets/witnesses/airport-ticket-clerk.png` | `witness-sprite` | Airport ticket clerk witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 085 | `witness-airport-ground-controller` | `public/assets/witnesses/airport-ground-controller.png` | `witness-sprite` | Airport ground controller witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 086 | `witness-bank-teller` | `public/assets/witnesses/bank-teller.png` | `witness-sprite` | Bank teller witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 087 | `witness-bank-guard` | `public/assets/witnesses/bank-guard.png` | `witness-sprite` | Bank guard witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 088 | `witness-bank-executive` | `public/assets/witnesses/bank-executive.png` | `witness-sprite` | Bank executive witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 089 | `witness-foreign-ministry-clerk` | `public/assets/witnesses/foreign-ministry-clerk.png` | `witness-sprite` | Foreign ministry clerk witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 090 | `witness-foreign-ministry-attache` | `public/assets/witnesses/foreign-ministry-attache.png` | `witness-sprite` | Foreign ministry attache witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 091 | `witness-foreign-ministry-ambassador` | `public/assets/witnesses/foreign-ministry-ambassador.png` | `witness-sprite` | Foreign ministry ambassador witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 092 | `witness-harbor-dockworker` | `public/assets/witnesses/harbor-dockworker.png` | `witness-sprite` | Harbor dockworker witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 093 | `witness-harbor-captain` | `public/assets/witnesses/harbor-captain.png` | `witness-sprite` | Harbor captain witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 094 | `witness-harbor-customs-officer` | `public/assets/witnesses/harbor-customs-officer.png` | `witness-sprite` | Harbor customs officer witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 095 | `witness-hotel-manager` | `public/assets/witnesses/hotel-manager.png` | `witness-sprite` | Hotel manager witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 096 | `witness-hotel-bellhop` | `public/assets/witnesses/hotel-bellhop.png` | `witness-sprite` | Hotel bellhop witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 097 | `witness-hotel-concierge` | `public/assets/witnesses/hotel-concierge.png` | `witness-sprite` | Hotel concierge witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 098 | `witness-library-librarian` | `public/assets/witnesses/library-librarian.png` | `witness-sprite` | Library librarian witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 099 | `witness-library-archivist` | `public/assets/witnesses/library-archivist.png` | `witness-sprite` | Library archivist witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 100 | `witness-library-researcher` | `public/assets/witnesses/library-researcher.png` | `witness-sprite` | Library researcher witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 101 | `witness-marketplace-vendor` | `public/assets/witnesses/marketplace-vendor.png` | `witness-sprite` | Marketplace vendor witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 102 | `witness-marketplace-jeweler` | `public/assets/witnesses/marketplace-jeweler.png` | `witness-sprite` | Marketplace jeweler witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 103 | `witness-marketplace-food-seller` | `public/assets/witnesses/marketplace-food-seller.png` | `witness-sprite` | Marketplace food seller witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 104 | `witness-museum-curator` | `public/assets/witnesses/museum-curator.png` | `witness-sprite` | Museum curator witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 105 | `witness-museum-guard` | `public/assets/witnesses/museum-guard.png` | `witness-sprite` | Museum guard witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 106 | `witness-museum-restorer` | `public/assets/witnesses/museum-restorer.png` | `witness-sprite` | Museum restorer witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 107 | `witness-palace-chamberlain` | `public/assets/witnesses/palace-chamberlain.png` | `witness-sprite` | Palace chamberlain witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 108 | `witness-palace-guard` | `public/assets/witnesses/palace-guard.png` | `witness-sprite` | Palace guard witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 109 | `witness-palace-gardener` | `public/assets/witnesses/palace-gardener.png` | `witness-sprite` | Palace gardener witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 110 | `witness-riverfront-fisher` | `public/assets/witnesses/riverfront-fisher.png` | `witness-sprite` | Riverfront fisher witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 111 | `witness-riverfront-boatman` | `public/assets/witnesses/riverfront-boatman.png` | `witness-sprite` | Riverfront boatman witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 112 | `witness-riverfront-tour-guide` | `public/assets/witnesses/riverfront-tour-guide.png` | `witness-sprite` | Riverfront tour guide witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 113 | `witness-sports-club-coach` | `public/assets/witnesses/sports-club-coach.png` | `witness-sprite` | Sports club coach witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 114 | `witness-sports-club-player` | `public/assets/witnesses/sports-club-player.png` | `witness-sprite` | Sports club player witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 115 | `witness-sports-club-attendant` | `public/assets/witnesses/sports-club-attendant.png` | `witness-sprite` | Sports club attendant witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 116 | `witness-stock-exchange-broker` | `public/assets/witnesses/stock-exchange-broker.png` | `witness-sprite` | Stock exchange broker witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 117 | `witness-stock-exchange-runner` | `public/assets/witnesses/stock-exchange-runner.png` | `witness-sprite` | Stock exchange runner witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 118 | `witness-stock-exchange-analyst` | `public/assets/witnesses/stock-exchange-analyst.png` | `witness-sprite` | Stock exchange analyst witness | `96x144` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |


### E. Suspect Dossier Portraits (119–128)

| # | id | filename | category | purpose | native_size | transparency | reuse | status |
|---:|---|---|---|---|---|---|---|---|
| 119 | `suspect-cris-minosa-dossier` | `public/assets/suspects/dossiers/cris-minosa-dossier.png` | `suspect-dossier` | Cris Minosa dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 120 | `suspect-lua-metrayu-dossier` | `public/assets/suspects/dossiers/lua-metrayu-dossier.png` | `suspect-dossier` | Lua Metrayu dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 121 | `suspect-thais-kizita-dossier` | `public/assets/suspects/dossiers/thais-kizita-dossier.png` | `suspect-dossier` | Thais Kizita dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 122 | `suspect-tigrinia-fonseca-dossier` | `public/assets/suspects/dossiers/tigrinia-fonseca-dossier.png` | `suspect-dossier` | Tigrínia Fonseca dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 123 | `suspect-narcola-tamacho-dossier` | `public/assets/suspects/dossiers/narcola-tamacho-dossier.png` | `suspect-dossier` | Narcola Tamacho dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 124 | `suspect-paulo-escolar-dossier` | `public/assets/suspects/dossiers/paulo-escolar-dossier.png` | `suspect-dossier` | Paulo Escolar dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 125 | `suspect-zeze-do-rap-dossier` | `public/assets/suspects/dossiers/zeze-do-rap-dossier.png` | `suspect-dossier` | Zezé do Rap dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 126 | `suspect-cleitinho-matador-dossier` | `public/assets/suspects/dossiers/cleitinho-matador-dossier.png` | `suspect-dossier` | Cleitinho Matador dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 127 | `suspect-vanzeira-dossier` | `public/assets/suspects/dossiers/vanzeira-dossier.png` | `suspect-dossier` | Vanzeira dossier portrait. | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 128 | `suspect-deolane-san-paolo-dossier` | `public/assets/suspects/dossiers/deolane-san-paolo-dossier.png` | `suspect-dossier` | Deolane San Paolo dossier portrait (master identity asset). | `128x154` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |


### F. Suspect Encounter Portraits (129–138)

| # | id | filename | category | purpose | native_size | transparency | reuse | status |
|---:|---|---|---|---|---|---|---|---|
| 129 | `suspect-cris-minosa-encounter` | `public/assets/suspects/encounters/cris-minosa-encounter.png` | `suspect-encounter` | Cris Minosa encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 130 | `suspect-lua-metrayu-encounter` | `public/assets/suspects/encounters/lua-metrayu-encounter.png` | `suspect-encounter` | Lua Metrayu encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 131 | `suspect-thais-kizita-encounter` | `public/assets/suspects/encounters/thais-kizita-encounter.png` | `suspect-encounter` | Thais Kizita encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 132 | `suspect-tigrinia-fonseca-encounter` | `public/assets/suspects/encounters/tigrinia-fonseca-encounter.png` | `suspect-encounter` | Tigrínia Fonseca encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 133 | `suspect-narcola-tamacho-encounter` | `public/assets/suspects/encounters/narcola-tamacho-encounter.png` | `suspect-encounter` | Narcola Tamacho encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 134 | `suspect-paulo-escolar-encounter` | `public/assets/suspects/encounters/paulo-escolar-encounter.png` | `suspect-encounter` | Paulo Escolar encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 135 | `suspect-zeze-do-rap-encounter` | `public/assets/suspects/encounters/zeze-do-rap-encounter.png` | `suspect-encounter` | Zezé do Rap encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 136 | `suspect-cleitinho-matador-encounter` | `public/assets/suspects/encounters/cleitinho-matador-encounter.png` | `suspect-encounter` | Cleitinho Matador encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 137 | `suspect-vanzeira-encounter` | `public/assets/suspects/encounters/vanzeira-encounter.png` | `suspect-encounter` | Vanzeira encounter portrait. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |
| 138 | `suspect-deolane-san-paolo-encounter` | `public/assets/suspects/encounters/deolane-san-paolo-encounter.png` | `suspect-encounter` | Deolane San Paolo encounter portrait used in final case scenes. | `144x188` | `transparent` | `SUSPECT_UNIQUE` | `IMPLEMENTED` |


### G. Stolen Item Illustrations (139–158)

| # | id | filename | category | purpose | native_size | transparency | reuse | status |
|---:|---|---|---|---|---|---|---|---|
| 139 | `item-golden-astrolabe` | `public/assets/items/golden-astrolabe.png` | `stolen-item` | Golden astrolabe illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 140 | `item-imperial-dagger` | `public/assets/items/imperial-dagger.png` | `stolen-item` | Imperial dagger illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 141 | `item-ceremonial-gold-mask` | `public/assets/items/ceremonial-gold-mask.png` | `stolen-item` | Ceremonial gold mask illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 142 | `item-emerald-scepter` | `public/assets/items/emerald-scepter.png` | `stolen-item` | Emerald scepter illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 143 | `item-royal-seal` | `public/assets/items/royal-seal.png` | `stolen-item` | Royal seal illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 144 | `item-sun-disc` | `public/assets/items/sun-disc.png` | `stolen-item` | Sun disc illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 145 | `item-ivory-manuscript-box` | `public/assets/items/ivory-manuscript-box.png` | `stolen-item` | Ivory manuscript box illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 146 | `item-jeweled-crown` | `public/assets/items/jeweled-crown.png` | `stolen-item` | Jeweled crown illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 147 | `item-obsidian-idol` | `public/assets/items/obsidian-idol.png` | `stolen-item` | Obsidian idol illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 148 | `item-silver-compass` | `public/assets/items/silver-compass.png` | `stolen-item` | Silver compass illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 149 | `item-sapphire-chalice` | `public/assets/items/sapphire-chalice.png` | `stolen-item` | Sapphire chalice illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 150 | `item-bronze-tablet` | `public/assets/items/bronze-tablet.png` | `stolen-item` | Bronze tablet illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 151 | `item-crystal-lotus` | `public/assets/items/crystal-lotus.png` | `stolen-item` | Crystal lotus illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 152 | `item-pearl-diadem` | `public/assets/items/pearl-diadem.png` | `stolen-item` | Pearl diadem illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 153 | `item-ancient-map-case` | `public/assets/items/ancient-map-case.png` | `stolen-item` | Ancient map case illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 154 | `item-jade-amulet` | `public/assets/items/jade-amulet.png` | `stolen-item` | Jade amulet illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 155 | `item-marble-bust` | `public/assets/items/marble-bust.png` | `stolen-item` | Marble bust illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 156 | `item-gilded-music-box` | `public/assets/items/gilded-music-box.png` | `stolen-item` | Gilded music box illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 157 | `item-ruby-orb` | `public/assets/items/ruby-orb.png` | `stolen-item` | Ruby orb illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 158 | `item-scholar-scroll` | `public/assets/items/scholar-scroll.png` | `stolen-item` | Scholar scroll illustration for case briefings/results. | `96x96` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 159 | `icon-pc` | `public/assets/icons/icon-pc.png` | `ui-icon` | Action icon for the P.C. warrant computer, matching the existing bitmap action-icon family. | `24x24` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 160 | `henchman-run-spritesheet` | `public/assets/animations/henchman-run-spritesheet.png` | `animation-sheet` | Eight-frame side-view run cycle for a striped T.C.C. henchman crossing the city scene when the trail is close. | `512x64` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 163 | `henchman-sneak-spritesheet` | `public/assets/animations/henchman-sneak-spritesheet.png` | `animation-sheet` | Eight-frame side-view tiptoe cycle for the same striped T.C.C. henchman balancing across a high parapet. | `512x64` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 164 | `capture-dramatic-spritesheet` | `public/assets/animations/capture-dramatic-spritesheet.png` | `animation-sheet` | Five-cell dramatic arrest strip: two culprit poses, two pursuing-agent poses rendered with a horizontal mirror only during the rightward chase, and one right-to-left prisoner escort pair. | `320x64` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 167 | `place-icon-atlas` | `public/assets/icons/place-icon-atlas.png` | `ui-icon` | Twelve-cell exterior-view atlas for airport, bank, foreign ministry, harbor, hotel, library, marketplace, museum, palace, riverfront, sports club and stock exchange investigation buttons. | `256x192` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |
| 168 | `footsteps-spritesheet` | `public/assets/animations/footsteps-spritesheet.png` | `animation-sheet` | Canonical footprint source. Runtime samples its base glyph to compose one eight-print, four-pair trail and deliberately does not expose the cumulative frames that restart at the sheet's lower edge. | `512x64` | `transparent` | `GLOBAL_SHARED` | `IMPLEMENTED` |

---

## 13. Production checklist by category

### Narrative / meta assets
- Must visually match the DOS-era screen language.
- Must not introduce modern gradients, blur or soft shadows.
- Full-screen narrative backdrops should remain compositionally compatible with the 640×400 logical viewport.

### City scenes
- Must fill the city-art area correctly at native scale.
- Must be geographically recognizable without text baked into the art.
- Must preserve the travel-postcard DOS composition language.

### Place backgrounds
- Must clearly signal the location type without depending on labels.
- Must be globally reusable across cities unless a later manifest revision explicitly adds city-specific variants.

### Witness sprites
- Must use transparent backgrounds.
- Must read clearly at native scale.
- Must share the same rendering language as suspects.

### Suspect portraits
- `suspect-deolane-san-paolo-dossier` is the **master identity anchor** for all future Deolane art.
- Every suspect dossier portrait must be approved before the matching encounter portrait is finalized.
- Encounter portraits must remain visibly the same characters.

### Stolen items
- Must be readable both in briefings and in end-of-case recovery scenes.
- Must use transparent backgrounds unless a future revision explicitly says otherwise.

### Icons
- Must stay simple, period-authentic and readable at 1×.
- If an icon is better rendered directly in code, that should be decided before generation and the manifest should be updated accordingly.

---

## 14. Manifest synchronization rule

This Markdown file is the human-readable source of truth.

The codebase should maintain a machine-readable mirror (for example JSON or TypeScript registry data) generated from or manually synchronized with this manifest.

The runtime asset registry must not silently diverge from `ASSET_MANIFEST.md`.

---

## 15. Change-control rules

Any addition, removal or rename of an art asset requires:

1. updating this manifest;
2. updating the runtime asset registry;
3. updating any generation descriptor/spec file;
4. updating tests or validation rules if dimensions or category expectations change.

Do not create orphan PNGs in the repository.

Do not leave production-used assets undocumented.

---

## 16. Final directive

This manifest is intentionally rigid.

The art pipeline must not behave like:

```text
"generate something later and see where it fits"
```

It must behave like:

```text
"generate the asset whose ID, dimensions, purpose and reuse policy
already exist in the manifest"
```

That is what keeps the OpenAI image-generation workflow controlled, reproducible and affordable.

**`ASSET_MANIFEST.md` is the source of truth for the complete production art inventory of Deolane San Paolo.**
