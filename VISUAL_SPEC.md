# VISUAL_SPEC.md

## 1. Document authority

This document is the canonical visual bible for **Deolane San Paolo / `DeolaneSanPaolo`**.

It defines the mandatory graphical language of the project.

For visual decisions:

```text
AGENTS.md
    ↓
UI_UX_SPEC.md
    ↓
VISUAL_SPEC.md
    ↓
ASSET_MANIFEST.md
    ↓
implementation / asset generation
```

`UI_UX_SPEC.md` defines where interface elements exist and how they behave.

This document defines exactly how they must look.

`ASSET_MANIFEST.md` will define the complete inventory, filenames and exact production dimensions for every visual asset.

---

# PART I — PRIMARY VISUAL DIRECTIVE

## 2. Target

The game must look like a genuine IBM-compatible graphical detective game from approximately:

```text
1989–1991
```

The intended reaction is not:

```text
"modern pixel-art game inspired by DOS"
```

It is:

```text
"this looks like it came from the same visual production pipeline
as the original DOS reference"
```

The browser is only the runtime.

The visual language must remain period-authentic.

---

## 3. Fidelity level

The original reference is **not loose inspiration**.

It is the strict target for:

- apparent pixel density;
- character simplification;
- caricature proportions;
- outline behavior;
- dithering behavior;
- color clustering;
- shadow construction;
- UI density;
- panel construction;
- icon complexity;
- city-scene composition;
- artwork-to-interface relationship;
- visual scale;
- period limitations.

New content must look as though it could have been added to the same game without appearing newer.

---

## 4. What must be original

The following must be newly created for Deolane San Paolo:

- all production character portraits;
- Deolane artwork;
- subordinate criminal artwork;
- witnesses;
- city scene artwork;
- place artwork;
- title artwork;
- logo;
- organization emblems;
- travel sprites;
- pursuit sprites;
- capture/escape imagery;
- rank imagery;
- icons that are shipped as PNG;
- decorative PNG elements;
- any other production raster asset.

Do not ship copied Carmen Sandiego character art or city art.

---

# PART II — CANONICAL VISUAL REFERENCE CORPUS

## 5. Primary repository

The primary raster-reference corpus is:

```text
https://github.com/IcaroBernardes/carmen_sandiego_DOS
```

Reference directory:

```text
www/
```

Codex must inspect this repository before generating final assets.

---

## 6. Local reference checkout

The reference repository must be cloned or otherwise made available locally under a non-production path such as:

```text
references/
└── carmen_sandiego_DOS/
    └── www/
```

This directory must be excluded from the public production bundle.

Recommended `.gitignore` policy when the reference checkout is local-only:

```gitignore
references/carmen_sandiego_DOS/
```

If metadata about references is committed, do not commit copyrighted reference PNG binaries unless explicitly authorized.

---

## 7. Mandatory recursive inventory

Before generating project art, Codex must recursively inventory:

```text
references/carmen_sandiego_DOS/www/**/*.png
```

For every PNG, record locally:

```text
relative path
width
height
color mode
alpha presence
unique-color count
dominant colors
file size
SHA-256
```

Generate a machine-readable analysis file such as:

```text
.cache/visual-reference/reference-index.json
```

This file is analytical tooling output, not gameplay content.

---

## 8. Known reference categories

The repository contains or references categories including:

```text
www/cities/
www/raws/
www/wrapped/
www/profiles/
www/outlines/
```

and individual files such as:

```text
world.png
detective.png
detective_raw.png
magglass.png
trispeech.png
fax.png
thumb.png
```

The actual local inventory is authoritative.

Do not assume this list is complete.

---

## 9. City reference scale

The repository's city artwork is used as the primary visual reference for:

- architectural simplification;
- nighttime/daytime palette handling;
- skies;
- water;
- landmarks;
- vegetation;
- atmospheric depth;
- DOS pixel density.

A representative city PNG in the repository is stored at approximately:

```text
500 × 540 px
```

in the visualization corpus.

This repository dimension is **not automatically the production game dimension**.

Production assets must target the Deolane native UI dimensions defined later in this document and in `ASSET_MANIFEST.md`.

---

## 10. Processed-reference warning

The Ícaro repository contains transformed versions of source artwork.

Its `R/modify_assets.R` performs operations including:

- resizing;
- wrapping;
- adding hard outer borders/glow;
- background replacement;
- transparency manipulation;
- profile processing.

Therefore:

```text
www/wrapped/
www/outlines/
*_final.png
```

must not automatically be treated as pristine original game bitmaps.

---

## 11. Reference priority order

For analysis of **drawing style**, use this priority:

```text
1. unprocessed/raw artwork when present
2. city artwork
3. original-profile source artwork before final transformations
4. processed wrapped/profile assets
5. data-visualization composition
```

For analysis of **how a witness or suspect was framed**, processed assets may still be useful.

For analysis of exact source palette or line thickness, prefer raw/unprocessed references.

---

## 12. Reference use boundary

Reference PNGs may be used for:

- visual analysis;
- palette study;
- pixel-density study;
- composition study;
- reference input to the OpenAI image-generation workflow;
- local comparison;
- local contact sheets.

Reference PNGs must not be:

- copied into production assets;
- renamed and shipped;
- used as final city art;
- used as final suspect art;
- published as part of the Deolane game merely because they are available in the reference repository.

The reference repository itself credits its sprites/artwork to Brøderbund Software, Inc.

---

# PART III — OPENAI API ASSET-GENERATION REQUIREMENT

## 13. Mandatory generation source

Every production PNG used by Deolane San Paolo must originate from the user's **OpenAI image-generation API workflow**.

This is a hard project rule.

No production PNG may be:

- copied from the Carmen reference corpus;
- downloaded from stock sites;
- generated through another image provider;
- manually painted as a replacement without explicit project-owner approval;
- silently sourced from icon libraries.

---

## 14. What "generated through the API" means

A compliant production PNG follows:

```text
project asset specification
        +
selected original-style reference images
        +
OpenAI image-generation request
        ↓
API-generated raster output
        ↓
deterministic post-processing
        ↓
validated production PNG
```

Deterministic post-processing is allowed and expected.

It may include:

- cropping;
- resizing;
- nearest-neighbor reduction;
- palette quantization;
- alpha cleanup;
- removal of semitransparent edge pixels;
- pixel-grid snapping;
- indexed PNG conversion;
- metadata stripping.

The artistic source must still be API-generated.

---

## 15. No runtime image generation

Image generation happens during development.

It must never happen inside the GitHub Pages game at runtime.

Production architecture:

```text
OPENAI API
used locally by asset-generation tooling
        ↓
approved PNG
        ↓
committed production asset
        ↓
GitHub Pages serves static PNG
```

Never:

```text
browser
→ OpenAI API
→ image generated while player waits
```

---

## 16. API key security

The API key must only be read from an environment variable:

```text
OPENAI_API_KEY
```

Never:

- hard-code it;
- include it in TypeScript shipped to the browser;
- include it in `public/`;
- include it in Git;
- include it in GitHub Pages;
- expose it in generated metadata.

Recommended:

```gitignore
.env
.env.*
!.env.example
```

---

## 17. Image model configuration

The generation script must expose:

```text
OPENAI_IMAGE_MODEL
```

as configuration.

Baseline default verified against current official OpenAI documentation during implementation:

```text
gpt-image-2
```

Before bulk generation, Codex must verify that the configured model is currently available to the user's OpenAI project.

Do not bake model assumptions deeply into the asset system.

---

## 18. Reference-image fidelity

When the selected API/model supports reference images and image fidelity controls, use:

```text
input_fidelity = high
```

for strict style-reference tasks.

The input reference images are style and rendering references.

The output must depict original Deolane content.

---

## 19. PNG output

API request must request or produce:

```text
PNG
```

Production raster format:

```text
.png
```

For assets requiring transparency:

```text
background = transparent
```

when supported.

For full-scene backgrounds:

```text
background = opaque
```

---

## 20. Generation script

Create an explicit development utility such as:

```text
scripts/generate-assets.ts
```

The generator must not be embedded in the game engine.

---

## 21. Generation must be explicit

Do not call the OpenAI API automatically during:

```text
npm install
npm run dev
npm test
npm run build
GitHub Pages deployment
ordinary CI
```

Generation must require an intentional command.

Example:

```text
npm run assets:generate -- --only suspect-deolane-dossier
```

---

## 22. Cost-control commands

The generator must support controls equivalent to:

```text
--dry-run
--only <asset-id>
--category <category>
--max-assets <n>
--force
--skip-existing
```

Bulk-generating the entire manifest without an explicit command is forbidden.

Humans have invented enough ways to spend API credits accidentally.

---

## 23. Regeneration policy

OpenAI image generation is not assumed to be deterministic.

Therefore every approved asset must store local generation metadata.

Recommended sidecar:

```text
assets-meta/<asset-id>.json
```

containing:

```json
{
  "assetId": "...",
  "model": "...",
  "promptVersion": 1,
  "promptSha256": "...",
  "referenceAssets": ["..."],
  "generatedAt": "...",
  "originalOutputSha256": "...",
  "finalOutputSha256": "...",
  "postprocessVersion": 1
}
```

Do not depend on being able to recreate identical pixels later from the same prompt.

Once approved, the generated PNG becomes the stable source asset.

---

# PART IV — REFERENCE-SELECTION STRATEGY

## 24. Every generated asset must receive style references

Do not generate final production assets from text prompt alone unless the API temporarily cannot accept references.

Each generation should receive:

```text
2–4 references from the same asset category
+
optional 1 cross-category visual anchor
```

---

## 25. Character reference bundle

For a suspect portrait, select examples from:

```text
www/profiles/
www/raws/ where relevant
```

Choose references that demonstrate:

- head-to-body ratio;
- caricature exaggeration;
- black contour;
- skin dithering;
- eye/nose/mouth economy;
- clothing simplification.

Do not choose a Carmen image merely because Deolane is the mastermind.

Use multiple cast members so the model learns the game's **portrait system**, not one character.

---

## 26. Witness reference bundle

For witnesses, use references from:

```text
www/raws/*_person*
www/wrapped/*_person*
```

Prefer raw versions for rendering technique.

Processed versions may establish framing.

---

## 27. City reference bundle

For new city art, use:

```text
www/cities/*.png
```

Select references with similar scene properties.

Examples:

```text
night city → night references
waterfront → waterfront references
desert → warm/dry references
dense urban skyline → urban references
```

Do not copy the depicted landmark arrangement.

---

## 28. UI/icon reference bundle

Use original-reference PNGs and supplied screenshots to infer:

- icon size;
- outline density;
- color count;
- bevel conventions.

Do not use modern icon-library images as visual anchors.

---

# PART V — MASTER STYLE PROMPT

## 29. Mandatory style-lock block

Every visual-generation prompt must include a shared style-lock block equivalent to:

```text
STRICT VISUAL STYLE LOCK:

Authentic late-1980s to early-1990s IBM PC DOS graphical adventure
and educational-game artwork.

Match the supplied reference images in apparent native pixel density,
outline thickness, palette behavior, dithering, facial simplification,
caricature proportions, hard-edged shading, geometric shape language,
detail density and period technical limitations.

This must look manually pixel-drawn for an IBM-compatible game of the
same era, not like modern high-resolution digital art converted with
a pixel-art filter.

Use crisp square pixels and deliberate pixel clusters.

No antialiasing.
No soft edges.
No vector-like curves.
No painterly brush texture.
No photographic texture.
No smooth gradient shading.
No bloom.
No ambient occlusion.
No cinematic depth of field.
No modern game concept-art lighting.
No anime rendering.
No modern indie pixel-art polish.

Curves and diagonals must resolve into visible stepped pixel geometry.

Shadows must be constructed from flat color regions and controlled
dithering.

The result must appear technically and stylistically compatible with
the supplied DOS reference artwork.
```

Exact wording may evolve, but the constraints may not be weakened.

---

## 30. Negative prompt concepts

Prompts must explicitly reject:

```text
modern pixel art
HD pixel art
vector illustration
smooth shading
anti-aliased linework
3D render
realistic photograph
cinematic lighting
soft brush
airbrush
watercolor
anime
comic-book halftone
mobile-game icon
modern retro synthwave
neon cyberpunk
isometric game art
```

unless a specific asset intentionally requires one of those concepts, which baseline production does not.

---

# PART VI — TRUE PIXEL OUTPUT PIPELINE

## 31. API output is not automatically final pixel art

Even when the generated image looks pixelated, the raw API output may contain:

- hundreds/thousands of colors;
- anti-aliased edges;
- soft transitions;
- subpixel artifacts.

Therefore every raster asset must pass a native-pixel post-process.

---

## 32. Post-processing pipeline

Canonical sequence:

```text
API output
    ↓
crop to intended composition
    ↓
resize to target native dimensions
    ↓
nearest-neighbor resampling
    ↓
quantize against approved project palette
    ↓
alpha threshold / fringe cleanup
    ↓
optional controlled dithering
    ↓
PNG optimization
    ↓
validation
```

---

## 33. No smooth resampling

Forbidden final resizing filters:

```text
bilinear
bicubic
Lanczos
browser smoothing
```

Use:

```text
nearest-neighbor
```

for pixel-grid scale operations.

---

## 34. Integer visual grid

At native resolution, one source pixel equals one logical visual pixel.

Never create fake micro-pixels inside a logical pixel.

---

# PART VII — PALETTE

## 35. Palette principle

The project uses a limited DOS/VGA-inspired indexed palette derived empirically from the visual reference corpus.

Do not invent a completely unrelated "retro" palette.

---

## 36. Palette extraction task

Before final asset generation, tooling must analyze representative unprocessed references and create:

```text
visual-reference-report.json
master-palette.json
master-palette.png
```

`master-palette.png` is an analytical/generated project aid, not necessarily a shipped gameplay PNG unless registered.

---

## 37. Palette derivation

Analyze:

- recurring black/dark outline colors;
- skin ramps;
- grays;
- whites;
- primary reds;
- blues;
- gold/yellow;
- greens;
- browns;
- purples;
- cyan;
- common shadow colors.

Prefer colors repeatedly present across original-style source assets.

---

## 38. Project palette size

Baseline target:

```text
32–64 global colors
```

Individual assets should use substantially fewer.

Recommended typical limits:

```text
small icon:           4–8
UI decoration:        4–12
character portrait:   12–24
witness sprite:       12–24
city scene:           24–48
special scene:        24–48
```

These are visual targets, not license to add unnecessary shades.

---

## 39. Black

Outlines should generally use:

```text
true black
or the darkest approved palette tone
```

Do not use soft dark-gray antialiased border pixels.

---

## 40. White

Highlights use hard palette white/light gray.

Do not create bloom-like white glows.

---

# PART VIII — DITHERING

## 41. Dithering is structural

Dithering is a deliberate shading technique, not noise.

Use it to simulate intermediate colors while keeping the palette limited.

---

## 42. Preferred dithering patterns

Preferred patterns include:

```text
1×1 checkerboard alternation

A B A B
B A B A
A B A B
B A B A
```

and sparse 2×2 ordered patterns where reference-consistent.

---

## 43. Dithering usage

Appropriate for:

- skin shadow transitions;
- sky transitions;
- water;
- clothing shade;
- building surfaces;
- large midtone areas.

---

## 44. Forbidden dithering

Do not use:

- random photographic noise;
- grain overlays;
- JPEG artifacts;
- high-frequency texture everywhere;
- modern diffusion dithering that looks accidental.

---

# PART IX — OUTLINES

## 45. Character outlines

At final native resolution:

```text
1 px primary contour
```

with occasional:

```text
2 px mass
```

where needed for strong silhouette or reference compatibility.

---

## 46. Interior facial lines

Interior face lines should be economical.

A nose may be:

```text
a few dark pixel clusters
```

not a fully rendered realistic contour.

---

## 47. No anti-aliased outline edges

Outer edges must terminate sharply.

For transparent sprites, alpha should generally be:

```text
0
or
255
```

not intermediate fringe values.

---

# PART X — SHADING

## 48. Flat-shading rule

Use:

```text
base tone
shadow tone
highlight tone
optional dither transition
```

instead of smooth gradient ramps.

---

## 49. Light-source consistency

Lighting is simple and graphic.

It should not behave like modern physically based rendering.

Character portrait lighting:

```text
simple upper/front light
hard shape shadows
```

City lighting may vary but remains constructed from solid clusters.

---

# PART XI — CHARACTER PORTRAITS

## 50. Portrait language

Suspect portraits must match the original reference's caricature system.

Mandatory traits:

- bust composition;
- head visually dominant;
- relatively narrow shoulders;
- exaggerated identifying features;
- instantly readable silhouette;
- front or slight three-quarter view;
- limited color clusters;
- hard black contour;
- no realistic skin rendering.

---

## 51. Facial exaggeration

Important identifying features should be enlarged enough to remain readable at low resolution.

Examples:

- nose;
- jaw;
- glasses;
- moustache;
- hairstyle;
- earrings;
- necklace;
- lipstick;
- hat;
- facial shape.

---

## 52. Hair

Hair must be rendered as:

```text
large graphic masses
+
few highlight/shadow clusters
```

not hundreds of individual strands.

---

## 53. Eyes

Eyes should use very few pixels.

No modern glossy anime eyes.

No photorealistic catchlight rendering.

---

## 54. Teeth/lips

Mouth features use simple pixel masses.

Lipstick, if present, must be represented through strong flat shapes.

---

# PART XII — DEOLANE SAN PAOLO VISUAL LOCK

## 55. Mandatory Deolane traits

Every Deolane image must preserve:

1. blonde hair;
2. enormous exaggerated lips;
3. intense bright red lipstick;
4. heavy/forced makeup;
5. prominent large earrings;
6. oversized gold necklace;
7. extremely large gold pendant;
8. ostentatious visual presence.

These are non-negotiable recognition traits.

---

## 56. Deolane lips

Her lips are intentionally disproportionate.

At low resolution they must remain one of the first features noticed.

They must:

- occupy an exaggerated facial area;
- use saturated approved red;
- have strong dark contour;
- remain visibly lipstick-covered;
- not shrink toward naturalistic anatomy during regeneration.

---

## 57. Deolane makeup

Makeup should be intentionally excessive:

- strong eye makeup;
- visible eyebrows/eye shadow where pixels permit;
- strong cheek/face treatment where appropriate;
- bright lipstick.

Do not render her as subtle or naturalistic.

---

## 58. Deolane jewelry

The necklace and pendant are signature identifiers.

The pendant must be:

```text
unusually large
bright gold
high-contrast
visible at dossier scale
```

Large earrings must also remain visible.

---

## 59. Deolane hair

Hair:

```text
blonde
voluminous
highly readable silhouette
```

Exact hairstyle is defined when the final character design is approved.

Once approved, every future Deolane asset must use the same canonical hairstyle.

---

## 60. Deolane consistency

The following must depict the same character design:

```text
dossier portrait
encounter
pursuit
capture
escape
intro/promotional cutscene
final sequence
```

Do not regenerate each as an unrelated interpretation.

Use an approved Deolane master reference image as additional input for all later Deolane generations.

---

# PART XIII — CHARACTER MASTER REFERENCE WORKFLOW

## 61. Master portrait first

For every major suspect:

1. generate dossier portrait;
2. iterate until approved;
3. mark it `MASTER_CHARACTER_REFERENCE`;
4. use that PNG as an input reference for all subsequent poses/scenes.

This is mandatory for Deolane.

---

## 62. Character consistency inputs

When generating additional artwork:

```text
original DOS style references
+
approved Deolane/character master
+
new scene prompt
```

The DOS references define style.

The approved character reference defines identity.

---

# PART XIV — WITNESS / NPC ART

## 63. Witness style

Witnesses must belong to the same character-rendering system as suspects.

They may be slightly less detailed.

Mandatory:

- caricature silhouette;
- occupation immediately readable;
- period-authentic costume simplification;
- strong outline;
- limited palette;
- no modern portrait rendering.

---

## 64. Witness occupation signaling

Use visual shorthand.

Examples:

```text
pilot → cap/uniform
bank teller → formal attire
curator → formal/cultural presentation
harbor master → nautical attire
bellhop → uniform
```

Avoid overly detailed props that disappear at native scale.

---

## 65. Witness transparency

Witness sprites should normally use transparent backgrounds.

Final alpha:

```text
0 or 255
```

except where an approved special asset needs otherwise.

---

# PART XV — CITY SCENES

## 66. City scene objective

Every city image must communicate geographic identity immediately without rendering the city name inside the image.

---

## 67. City composition

Preferred structure:

```text
foreground element
+
dominant recognizable landmark / architectural identity
+
simplified middle distance
+
simple background/sky
```

---

## 68. City scenes are travel postcards

Think:

```text
DOS travel postcard
```

not:

```text
satellite-accurate architectural visualization
```

The image should be readable in seconds.

---

## 69. Landmark priority

Use one dominant visual idea.

Bad:

```text
15 famous monuments squeezed together
```

Good:

```text
one dominant landmark
+
supporting local cues
```

---

## 70. City camera

Preferred:

- eye-level or slightly elevated view;
- readable horizon;
- simple perspective;
- no extreme cinematic lens;
- no modern drone photography composition.

---

## 71. Architecture

Architecture must be simplified into pixel clusters.

Do not generate tiny photorealistic façade detail.

---

## 72. Sky

Skies use:

- flat bands;
- limited palette;
- controlled dithering.

No smooth 4K sunset gradients.

---

## 73. Water

Water uses:

- horizontal pixel clusters;
- limited reflections;
- hard color bands;
- controlled dither.

No ray-traced reflections.

---

## 74. City source composition size

The production city asset is designed to fill the city-art region defined by `UI_UX_SPEC.md`.

Baseline native production target:

```text
300 × 332 px
```

`ASSET_MANIFEST.md` is allowed to formalize or override per-asset size while preserving UI fit.

---

# PART XVI — PLACE BACKGROUNDS

## 75. Place background language

Generic investigation locations use the same DOS rendering system as city scenes.

They should clearly read as:

```text
airport
bank
hotel
museum
library
etc.
```

without requiring embedded text.

---

## 76. Place reuse

Place backgrounds are globally reusable unless content explicitly requires variants.

They must therefore avoid city-specific signage unless the asset is specifically a city variant.

---

## 77. Witness compositing space

Place art should leave readable negative space for witness placement where the UI composition requires it.

Do not fill every pixel with detail.

---

# PART XVII — PROFILE / DOSSIER ART

## 78. Dossier framing

The original reference corpus contains portrait profiles at a relatively vertical aspect ratio.

Production dossier portraits should preserve a similar visual rhythm.

Baseline target envelope:

```text
approximately 128 × 154 px
```

Exact values are finalized by `ASSET_MANIFEST.md`.

---

## 79. Dossier background

Prefer:

```text
transparent portrait sprite
+
dossier frame/background rendered by UI
```

rather than permanently baking the entire dossier UI into each suspect PNG.

This improves consistency and localization.

---

# PART XVIII — ICONS

## 80. Icon target

Icons must look as though drawn by the same period artist/toolchain.

Typical native size:

```text
24–32 px
```

on the longest dimension.

---

## 81. Icon palette

Typical:

```text
4–8 colors
```

Strong black contour.

---

## 82. Icon concepts

Examples include:

```text
SEE
DEPART
SEARCH
FILES
back
continue
clock
warrant
map pin
warning
```

Do not use emoji.

Do not use Font Awesome/Material icons in production gameplay.

---

## 83. API-generated icon rule

If an icon is shipped as PNG, it must be generated through the user's OpenAI API like every other production PNG.

It may then be aggressively simplified/post-processed.

---

# PART XIX — UI PANELS

## 84. UI is rendered in code

Most interface chrome should **not** be a generated PNG.

Construct through HTML/CSS/Canvas using exact pixel geometry:

- panel borders;
- menu bar;
- window fills;
- button bevels;
- separators;
- text boxes;
- selection rectangles.

---

## 85. UI visual language

Baseline:

- square corners;
- black borders;
- light gray/white raised controls;
- dark information panel where specified;
- 1–2 px border logic;
- compact spacing;
- no soft shadows.

---

## 86. Button bevel

Normal button:

```text
light top/left
dark bottom/right
```

Pressed:

```text
dark top/left
light bottom/right
content shifts +1,+1
```

---

## 87. No border radius

Production gameplay:

```text
border-radius: 0
```

unless a very specific original-reference ornament requires another shape.

---

## 88. No CSS gradients

Forbidden:

```css
linear-gradient(...)
radial-gradient(...)
```

for game UI.

Use solid palette colors and pixel patterns.

---

# PART XX — TYPOGRAPHY

## 89. Typography target

Typography must look like bitmap-rendered period software.

---

## 90. Do not assume the Ícaro web font is original

The reference visualization uses modern web-font tooling.

Do not use a font merely because it appears in the visualization source.

The production font must be selected based on the original screenshot's glyph proportions and pixel metrics.

---

## 91. Bitmap font requirements

Preferred:

- bundled legal bitmap/pixel font;
- monospaced or pseudo-monospaced where reference-consistent;
- no antialiasing;
- integer scale;
- stable glyph metrics.

### Production selection

The initial browser release bundles **Silkscreen Regular** locally as `AtlasBitmap`. It is distributed under the SIL Open Font License 1.1, includes the accented Latin glyphs required by the Portuguese text, and must be used throughout the game surface, including menus, buttons, terminal copy, dossiers and headings. System fonts are fallback-only and must not be the normal rendered result.

---

## 92. Font smoothing

Where supported, disable smoothing.

More importantly, select a font/rendering method whose actual rasterization stays crisp.

Canvas bitmap glyph atlas is acceptable if normal browser font rendering cannot reproduce the target faithfully.

---

## 93. Text scaling

Allowed:

```text
1×
2×
3×
4×
```

Avoid fractional glyph scaling.

---

# PART XXI — LOGO AND TITLE ART

## 93.1 Publisher sting

A abertura usa os PNGs fornecidos `mreaggle_software_logo_notext.png` e `mreaggle_software_logo.png` centralizados sobre preto, sem filtros, suavização, recorte ou efeitos modernos. A primeira arte tem fade-in muito curto e fade-out até 800 ms; a arte completa aparece nesse marco e só inicia seu fade-out linear de 1 segundo quando o sting termina.

## 94. Title logo

The Deolane San Paolo logo may use original lettering/content but must visually belong to the DOS title-screen era.

It must not imitate modern glossy game logos.

---

## 95. Title PNG generation

If the title logo/background is PNG, generate it through the OpenAI asset pipeline.

Text-critical logos may require post-production cleanup because generated text is not guaranteed to be typographically exact.

Preferred workflow:

```text
API generates ornamental/logo graphic structure
+
final title lettering reproduced deterministically in code or bitmap typography
```

If the production logo remains a PNG containing lettering, the final letters must be manually validated for exact spelling after API generation.

---

# PART XXII — BACKGROUNDS

## 96. Narrative backgrounds

Headquarters, News Flash, Hall of Fame and other narrative scenes must:

- use the same palette logic;
- use the same hard pixel treatment;
- avoid cinematic modern lighting;
- preserve readable UI space.

---

# PART XXIII — TRAVEL ANIMATION

## 97. Travel sprite

Airplane/travel sprites use:

- very low frame count;
- strong silhouette;
- minimal color count;
- 1 px outline;
- code-controlled movement.

Do not generate 30-frame smooth animation sequences.

---

## 98. Frame economy

Preferred:

```text
2–4 distinct source frames
```

with motion created in code.

This is period-authentic and asset-efficient.

---

# PART XXIV — TRAIL / PURSUIT ART

## 99. Pursuit language

Suspicious-presence art should be:

- dramatic;
- simple;
- high contrast;
- readable in a fraction of a second;
- somewhat theatrical/comedic;
- visually compatible with the original game's pursuit-feedback language.

---

## 100. Reuse

Use generic pursuit states where possible.

Do not generate a unique chase animation for every city.

The striped henchman has two reusable 8-frame states: a rightward run and a rightward tiptoe balance across a simple parapet. Both preserve the same silhouette, palette and 64-pixel frame footprint.

Investigation-location buttons use the dedicated twelve-cell `place-icon-atlas`: each cell is an exterior architectural shorthand, never a crop of the interior witness scene. The approach transition samples the canonical 15×11 footprint glyph from `footsteps-spritesheet` and places eight prints, one at a time, as a single four-pair human trail across the central floor area of the city scene. The dark sole receives a hard one-pixel gold sprite contour for contrast across light and dark backgrounds; blur and soft shadow remain forbidden. It never collides with the clock label, renders a duplicate trail in the information panel or exposes the sheet's later cumulative restart. The sequence lasts 2.2 seconds, matching the canonical footsteps MP3, and completes before clock advancement is presented.

---

# PART XXV — CAPTURE / ESCAPE ART

## 101. Capture

Capture imagery should use:

- simple staged action;
- readable police/arrest cues;
- limited frames;
- no violent realism.

The `capture-dramatic-spritesheet` is presented as three sequential beats: culprit escape attempt, three-agent pursuit, then controlled escort entering in the opposite direction. Pursuing agents face right and alternate between two leg poses—extended stride and bent knee—so their body direction and run cycle agree with their rightward movement. The escort stops centered and persists as the final still frame; the capture panel never resolves to an empty background.

---

## 102. Escape

Escape imagery should clearly communicate:

```text
too late
criminal got away
```

without requiring elaborate animation.

---

# PART XXVI — WORLD MAP

## 103. Map visual style

World map must be:

- simplified;
- low-detail;
- flat;
- compatible with DOS reference;
- readable beneath city markers.

---

## 104. Geography accuracy

Recognizable continental shapes matter.

Hyper-detailed political borders do not.

---

## 105. Map markers

Markers are simple pixel shapes.

No glossy pins.

No Google Maps visual language.

---

# PART XXVII — MASTER PALETTE ENFORCEMENT

## 106. Palette mapping

Every generated asset must be converted to the approved master palette or approved category subset.

---

## 107. Nearest palette conversion

For each source color:

```text
map → closest allowed palette color
```

optionally with controlled ordered dithering.

---

## 108. No accidental palette creep

A generated asset cannot introduce 200 new near-identical shades.

Validation must report:

```text
unique RGB colors
```

and fail category thresholds where appropriate.

---

# PART XXVIII — ALPHA

## 109. Transparent sprites

Default final alpha allowed values:

```text
0
255
```

---

## 110. Semitransparency

Semitransparent pixels are forbidden in ordinary pixel sprites.

Exceptions require explicit asset-manifest declaration.

---

# PART XXIX — ASSET GENERATION PROMPT TEMPLATES

## 111. Character template

Use a structure equivalent to:

```text
[STYLE LOCK]

Create an original DOS-era criminal dossier portrait for
Deolane San Paolo.

This is a new character, not Carmen Sandiego and not a copy of any
character shown in the references.

Composition:
- bust from upper chest upward
- centered
- head visually dominant
- slight three-quarter or near-front orientation
- silhouette readable at very low resolution

Canonical identity:
- blonde hair
- extremely oversized lips
- intense bright red lipstick
- heavy exaggerated makeup
- very large earrings
- oversized gold necklace
- enormous gold pendant
- ostentatious appearance

Rendering:
- match supplied DOS portrait references
- strong black 1-pixel native contour
- limited flat color clusters
- checkerboard dithering
- no antialiasing
- no gradients
- no realistic skin texture
- hair rendered in large masses
- facial features simplified to economical pixel clusters

Background:
transparent

Do not include:
text
logo
frame
modern UI
```

---

## 112. Witness template

```text
[STYLE LOCK]

Create an original DOS-era witness sprite for the role:
[ROLE]

Match the supplied witness references in:
- silhouette
- head/body proportion
- pixel density
- occupation readability
- hard contour
- limited palette

Transparent background.

No text.
No scene background.
```

---

## 113. City template

```text
[STYLE LOCK]

Create an original city-scene illustration depicting:
[CITY]

Geographic visual identity:
[LANDMARKS / CULTURAL / ARCHITECTURAL ELEMENTS]

Composition:
- one dominant recognizable visual motif
- simple foreground
- readable middle distance
- simplified background
- travel-postcard framing
- no text
- no UI
- no characters unless requested

Match the supplied DOS city references in:
- apparent pixel density
- flat color areas
- dithering
- black/dark contour behavior
- simplified architecture
- atmospheric color handling

Do not make a photograph converted to pixel art.
```

---

## 114. Icon template

```text
[STYLE LOCK]

Create one original DOS-era UI icon representing:
[ACTION]

Requirements:
- instantly recognizable
- approximately 24–32 native pixels after reduction
- maximum visual complexity consistent with supplied DOS UI references
- strong black contour
- approximately 4–8 colors after quantization
- transparent background
- no text
- no emoji styling
- no modern vector icon styling
```

---

# PART XXX — OPENAI GENERATION SCRIPT CONTRACT

## 115. Manifest-driven generation

`scripts/generate-assets.ts` must read `ASSET_MANIFEST.md` indirectly through a machine-readable asset manifest/registry or an equivalent canonical data file.

Do not maintain an unrelated list inside the script.

---

## 116. Asset-generation descriptor

Each generatable asset should provide:

```ts
interface AssetGenerationSpec {
  assetId: string;
  category: string;

  promptTemplateId: string;
  description: string;

  referencePaths: string[];

  api: {
    model?: string;
    size: string;
    quality: string;
    background: "transparent" | "opaque";
    inputFidelity?: "high" | "low";
  };

  output: {
    width: number;
    height: number;
    paletteGroup: string;
    maxColors: number;
    alphaMode: "opaque" | "binary";
  };
}
```

Exact implementation may vary.

---

## 117. Reference path security

Reference paths point to local reference corpus.

They must never be fetched by the deployed browser.

---

## 118. API result handling

For every successful generation:

1. decode output;
2. save raw API output under temporary work directory;
3. hash raw output;
4. post-process;
5. validate;
6. save final PNG;
7. write metadata;
8. never overwrite an approved asset unless `--force` is explicit.

---

## 119. Temporary outputs

Recommended:

```text
.cache/generated-assets/
```

Raw generation files do not need to ship with the game.

---

# PART XXXI — QUALITY AND COST CONTROLS

## 120. Generation iterations

Default maximum generation attempts per asset:

```text
3
```

before requiring human review.

Do not burn API budget indefinitely because a necklace is 3 pixels too small.

---

## 121. Low-cost preview workflow

For complex assets:

```text
preview generation
→ human composition approval
→ high-quality final generation
→ native pixel postprocess
```

Where model/settings allow economical preview quality, use it.

---

## 122. Never bulk regenerate approved assets casually

Changing a prompt-template file must not automatically invalidate every approved PNG.

Asset regeneration is explicit.

---

# PART XXXII — VISUAL VALIDATION

## 123. Automatic validation

Every final PNG should be checked for:

```text
exact dimensions
PNG format
expected alpha mode
palette-color count
no unexpected semitransparency
registered asset ID
nonzero file size
hash
```

---

## 124. Edge validation

Transparent sprites should fail if significant antialiased alpha fringes remain.

---

## 125. Pixel-scale review

Every asset must be reviewed at:

```text
1× native resolution
and
4× nearest-neighbor zoom
```

A piece that only looks good when enlarged is not valid.

---

## 126. Visual compatibility review

Place the new asset beside 2–4 reference images.

Ask:

- does it look newer?
- does it contain too many shades?
- are curves too smooth?
- is the lighting too modern?
- is the outline too thin?
- is dithering absent?
- is facial detail too realistic?
- is the silhouette readable?
- does the asset feel like the same game?

If the answer exposes a mismatch, regenerate or post-process.

---

# PART XXXIII — OPTIONAL API-ASSISTED STYLE REVIEW

## 127. Vision review

Development tooling may optionally send:

```text
reference contact sheet
+
new generated asset
```

to an OpenAI vision-capable model and request a structured style-compliance critique.

This is optional because it consumes API usage.

Human approval remains final.

---

# PART XXXIV — CONTACT SHEETS

## 128. Local reference contact sheets

Generate local analytical contact sheets by category:

```text
reference-characters.png
reference-witnesses.png
reference-cities.png
reference-icons.png
```

These are local development aids.

If they contain original reference artwork, do not publish them as production assets.

---

## 129. Production contact sheets

A project-only contact sheet of newly generated original assets may be committed for QA if useful.

---

# PART XXXV — ORIGINAL REFERENCE ANALYSIS

## 130. Reference-report script

Create:

```text
scripts/analyze-reference-art.ts
```

or equivalent.

It must recursively inspect `www/`.

---

## 131. Report fields

For each file:

```json
{
  "path": "...",
  "width": 0,
  "height": 0,
  "hasAlpha": false,
  "uniqueColors": 0,
  "dominantColors": [],
  "sha256": "..."
}
```

---

## 132. Processed-file labeling

The report should classify:

```text
raw/reference
processed/wrapped
processed/outline
processed/final
city
utility
unknown
```

based on directory/path and processing script knowledge.

---

# PART XXXVI — SCREENSHOT REGRESSION

## 133. UI screenshot tests

Once the UI is stable, capture deterministic screenshots at:

```text
640 × 400
```

for important screens.

Every newly implemented animation also requires a deterministic visual-progress test. The test must capture at least two meaningful moments while browser animation remains enabled and prove that rendered pixels change inside the intended viewport. DOM presence, CSS animation names, opacity and background URLs alone are insufficient because a transparent or incorrect spritesheet crop can satisfy all of them without displaying artwork.

Animation spritesheets must additionally pass asset validation proving that every declared frame contains opaque pixels and that sequential frames are not byte-identical.

---

## 134. Golden UI states

At minimum:

```text
title
headquarters
news flash
city idle
SEE location list
witness clue
DEPART list/map
dossier index
dossier detail
warrant computer
warrant issued
final encounter
case solved
case failed
Hall of Fame
```

---

## 135. Geometry regression

Screenshot comparison should prioritize:

- panel boundaries;
- button dimensions;
- text position;
- icon position;
- artwork viewport.

Do not demand pixel-identical anti-aliased browser font output across operating systems if font rendering differs; use controlled bitmap rendering where necessary.

---

# PART XXXVII — PRODUCTION PNG RULE

## 136. Absolute rule

If a file in the production bundle has extension:

```text
.png
```

and is a visual art asset,

its artistic source must have been generated through the user's OpenAI API workflow.

---

## 137. Programmatically generated technical PNG exception

Purely technical test fixtures such as:

- test masks;
- generated palette swatches;
- automated screenshot captures;

are not considered production art.

They may be produced programmatically.

They must not masquerade as shipped illustration assets.

---

# PART XXXVIII — WHAT MUST NOT BE GENERATED AS PNG

## 138. Dynamic UI text

Do not generate PNGs for:

- city names;
- clue text;
- witness dialogue;
- player name;
- rank labels;
- dates/times;
- destination names;
- warrant field labels.

These must remain dynamic text.

---

## 139. UI border geometry

Do not generate separate images for every:

- border;
- button rectangle;
- panel separator;
- text box.

Render these in code.

This ensures pixel-perfect consistency.

---

# PART XXXIX — BROWSER RENDERING

## 140. CSS image rendering

Raster game assets must use:

```css
image-rendering: pixelated;
image-rendering: crisp-edges;
```

where supported.

---

## 141. Canvas rendering

For Canvas:

```js
ctx.imageSmoothingEnabled = false;
```

---

## 142. No transform blur

Avoid CSS transforms that place sprite edges on fractional logical coordinates.

Use integer translation coordinates.

---

# PART XL — VISUAL CONSISTENCY ACROSS CATEGORIES

## 143. One game, not separate art packs

City scenes, portraits, witnesses and icons must appear to share:

- palette family;
- outline philosophy;
- pixel density;
- shadow construction;
- color saturation;
- dithering logic.

---

## 144. Avoid category-style drift

Do not permit:

```text
characters = modern polished pixel art
cities = painterly pixel art
icons = vector art
UI = Windows 95
```

Everything belongs to one production era.

---

# PART XLI — ACCEPTANCE RULES FOR CHARACTERS

## 145. Character asset passes only if

- [ ] readable at native size;
- [ ] strong silhouette;
- [ ] 1 px style contour apparent;
- [ ] no smooth skin gradient;
- [ ] no antialiased edge fringe;
- [ ] palette within limit;
- [ ] DOS reference compatibility;
- [ ] character identity consistent;
- [ ] no unintended text;
- [ ] transparent background where required.

---

## 146. Deolane additional acceptance

- [ ] blonde hair unmistakable;
- [ ] lips extremely large;
- [ ] lipstick strongly red;
- [ ] heavy makeup visible;
- [ ] earrings visible;
- [ ] necklace visibly oversized;
- [ ] gold pendant exceptionally large;
- [ ] same canonical face/hair across assets.

Failure of any identity item invalidates the Deolane asset.

---

# PART XLII — ACCEPTANCE RULES FOR CITIES

## 147. City passes only if

- [ ] identity recognizable without text;
- [ ] composition matches DOS travel-postcard language;
- [ ] no photorealistic texture;
- [ ] no smooth sky gradient;
- [ ] architecture simplified;
- [ ] palette within category target;
- [ ] no embedded UI;
- [ ] no embedded city-name lettering;
- [ ] fills production art viewport correctly.

---

# PART XLIII — ACCEPTANCE RULES FOR ICONS

## 148. Icon passes only if

- [ ] recognizable at 1×;
- [ ] no modern vector smoothness;
- [ ] 4–8-ish color target;
- [ ] hard contour;
- [ ] transparent/binary alpha;
- [ ] consistent with action semantics;
- [ ] no text baked in.

---

# PART XLIV — ACCEPTANCE RULES FOR UI

## 149. UI passes only if

- [ ] 640×400 logical composition preserved;
- [ ] square corners;
- [ ] no soft shadows;
- [ ] no gradients;
- [ ] buttons look physically raised/pressed through hard pixel bevels;
- [ ] information density matches DOS reference;
- [ ] dynamic text is bitmap-like;
- [ ] no modern icon library appears;
- [ ] pixel art is never smoothed.

---

# PART XLV — FORBIDDEN VISUAL DRIFT

## 150. Reject any proposal described as

```text
"cleaner"
"more modern"
"more cinematic"
"more responsive"
"more polished"
"HD remake"
"modern retro"
"neo-retro"
"pixel-art inspired"
```

if it materially changes the reference visual language.

This project is intentionally not a visual modernization.

---

# PART XLVI — VISUAL SOURCE RECORD

## 151. Reference provenance

Document known visual references under a local record.

Primary:

```text
https://github.com/IcaroBernardes/carmen_sandiego_DOS/tree/master/www
```

The repository README states that its sprites and artwork were made by Brøderbund Software, Inc.

The visual corpus is therefore treated as reference material, not production ownership.

---

## 152. Reference analysis evidence

The repository's `index.qmd` explicitly references:

- city PNGs under `www/cities/`;
- witness/location PNGs under `www/wrapped/`;
- suspect portrait PNGs under `www/profiles/`;
- suspect outlines under `www/outlines/`;
- `world.png`;
- `detective.png`;
- `magglass.png`;
- `trispeech.png`;
- `fax.png`.

The actual local inventory must still be used rather than relying on this summary.

---

## 153. Reference transformation evidence

`R/modify_assets.R` shows that the visualization creator:

- reads raw images;
- adds hard outer outlining/glow;
- saves resized location wrappers around 325×205;
- saves witness wrappers around 130×185;
- creates processed suspect/profile files around 201×242;
- manipulates transparency/backgrounds.

This is why raw and transformed assets must be distinguished during style analysis.

---

# PART XLVII — OPENAI API IMPLEMENTATION NOTES

## 154. Current official capabilities to rely on conceptually

The OpenAI image-generation workflow currently supports concepts including:

- PNG output;
- transparent or opaque background configuration;
- configurable output size/quality;
- reference image input;
- high input fidelity on supported GPT Image models.

Codex must consult the current official OpenAI API documentation at implementation time rather than assuming this document's sample parameter surface will remain unchanged forever.

---

## 155. Do not expose API in GitHub Pages

The deployed game contains:

```text
zero OpenAI API credentials
zero image-generation requests
```

Asset creation is a developer tool only.

---

# PART XLVIII — GENERATION WORKFLOW FOR THE WHOLE PROJECT

## 156. Phase 1 — Analyze originals

```text
clone reference
→ inventory www/**/*.png
→ distinguish raw/processed
→ create local contact sheets
→ derive palette
→ document visual metrics
```

---

## 157. Phase 2 — Lock style

Generate a small calibration set:

```text
1 original Deolane master portrait
1 generic subordinate suspect
1 witness
1 city
1 icon
```

Do not generate the entire asset manifest yet.

---

## 158. Phase 3 — Calibration approval

Compare calibration assets beside reference corpus at 1×.

Adjust:

- prompt;
- palette;
- post-processing;
- target resolution;
- dithering;
- outline cleanup.

Only continue after the calibration set looks like the same visual generation.

---

## 159. Phase 4 — Character masters

Generate and approve:

```text
Deolane
+
9 subordinate suspect dossier masters
```

---

## 160. Phase 5 — Core environments

Generate:

```text
city scenes
place backgrounds
```

in batches with human QA.

---

## 161. Phase 6 — Witnesses

Generate witness roles by place family.

Reuse consistent generation settings.

---

## 162. Phase 7 — Secondary assets

Generate:

```text
travel sprites
trail sprites
capture/escape assets
rank imagery
icons
narrative backgrounds
```

---

## 163. Phase 8 — Final validation

Run:

```text
asset-validator
+
visual contact sheet
+
UI screenshot regression
+
human review
```

before considering visual production complete.

---

# PART XLIX — CODEX BEHAVIOR

## 164. Before generating any image

Codex must:

1. read `VISUAL_SPEC.md`;
2. read the target entry in `ASSET_MANIFEST.md`;
3. inspect selected reference PNGs;
4. check whether an approved character master exists;
5. print generation plan;
6. estimate number of API calls;
7. avoid bulk generation unless explicitly requested.

---

## 165. Codex may not substitute placeholders as final art

Placeholders are allowed during coding.

They must be clearly marked.

They are not considered production-complete assets.

---

## 166. Codex may not silently use original PNGs

If API generation fails:

```text
leave placeholder
report failure
```

Do not fall back to copying Carmen reference artwork.

---

# PART L — FINAL VISUAL CONTRACT

## 167. Short definition

Every screen of Deolane San Paolo must satisfy:

```text
DOS-era layout
+
DOS-era bitmap typography
+
hard integer geometry
+
limited palette
+
hard-edged pixel clusters
+
controlled dithering
+
black contour logic
+
original Deolane content
+
OpenAI-API-generated production PNGs
+
nearest-neighbor final rendering
```

---

## 168. Final directive

Do not ask the image model for:

```text
"pixel art"
```

and consider the job finished.

The target is far narrower.

The project must reproduce the **specific visual grammar** of the supplied classic DOS reference corpus:

```text
same apparent era
same apparent technical limitations
same visual density
same caricature logic
same palette discipline
same dithering discipline
same pixel harshness
same UI rigidity
```

while creating entirely new imagery for:

```text
Deolane San Paolo
```

Every shipped PNG must be a new OpenAI-API-generated asset.

Every final raster must survive native-resolution inspection.

Every UI screen must look like it belongs beside the original reference without becoming a modern reinterpretation.

**`VISUAL_SPEC.md` is the source of truth for the visual identity of Deolane San Paolo.**
