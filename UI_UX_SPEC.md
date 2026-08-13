# UI_UX_SPEC.md

## 1. Document authority

This document defines the canonical user interface and interaction model for **Deolane San Paolo / `DeolaneSanPaolo`**.

It specifies:

- every major screen;
- every gameplay UI state;
- the logical viewport;
- panel geometry;
- menu behavior;
- button behavior;
- mouse interaction;
- keyboard interaction;
- focus;
- modal states;
- navigation;
- text presentation;
- screen transitions;
- what is visible in each gameplay state.

For interface behavior:

```text
GAME_SPEC.md
    ↓
NARRATIVE_WALKTHROUGH.md
    ↓
UI_UX_SPEC.md
    ↓
VISUAL_SPEC.md
    ↓
implementation
```

`GAME_SPEC.md` defines what the game does.

`NARRATIVE_WALKTHROUGH.md` defines the player-facing sequence.

This document defines how that sequence is presented and controlled.

`VISUAL_SPEC.md` defines the exact pixel-art rendering language.

---

# PART I — PRIMARY UI PRINCIPLE

## 2. The game must look and behave like a DOS-era graphical application

The interface must not be presented as:

- a modern responsive dashboard;
- a mobile app;
- a card grid;
- a single-page web product with modern navigation;
- a modern game HUD with floating icons;
- a full-screen illustration with invisible hotspots.

The target is a deliberately compact, panel-based DOS graphical interface.

The interface is itself part of the historical illusion.

The player should feel that:

```text
a DOS detective program
is running inside the browser
```

not that:

```text
a modern website
is using DOS-themed artwork
```

---

# PART II — LOGICAL RESOLUTION

## 3. Canonical logical viewport

The canonical game viewport is:

```text
640 × 400 logical pixels
```

This is the internal design surface.

All gameplay UI geometry must be defined in integer logical pixels within this coordinate system.

---

## 4. Browser scaling

The logical viewport may be scaled to fit the browser.

Scaling rules:

```text
source viewport:
640 × 400

display:
nearest-neighbor scaling
```

Preferred scaling:

```text
1× = 640 × 400
2× = 1280 × 800
3× = 1920 × 1200
4× = 2560 × 1600
```

When the browser cannot fit a full integer scale:

- scale down while preserving aspect ratio;
- preserve nearest-neighbor rendering;
- do not independently reflow interface panels.

Fractional browser scaling may be used only as a last-resort outer viewport transform if necessary for device fit.

Internal layout must still remain 640 × 400.

---

## 5. Aspect ratio

Canonical aspect ratio:

```text
8:5
```

The game must not stretch horizontally or vertically.

Unused browser space may be filled with a neutral outer background.

---

## 6. Centering

On desktop:

```text
browser viewport
      ↓
centered 640×400 logical surface
      ↓
default display at 2× or the largest fitting integer scale
```

The desktop presentation should normally occupy at least `1280×800` physical CSS pixels when the display permits it. Fullscreen uses the largest fitting scale while preserving 8:5. The game may optionally use a decorative outer frame later, but it is not part of baseline gameplay.

---

# PART III — GLOBAL SCREEN STRUCTURE

## 7. Standard gameplay shell

The main gameplay screen uses a fixed structure inspired by the DOS reference.

Canonical regions:

```text
┌──────────────────────────────────────────────────────────────┐
│ TOP MENU BAR                                                 │
├───────────────────────────────┬──────────────────────────────┤
│ CITY / DATE HEADER            │                              │
├───────────────────────────────┤                              │
│                               │                              │
│                               │                              │
│ CITY / SCENE ART              │      INFORMATION PANEL       │
│                               │                              │
│                               │                              │
│                               │                              │
│                               ├──────────────────────────────┤
│                               │ ACTION BUTTON ROW            │
└───────────────────────────────┴──────────────────────────────┘
```

---

## 8. Canonical panel proportions

Baseline geometry:

```text
viewport:
640 × 400

top menu:
y = 0
height = 22

main content:
y = 22
height = 378

left panel:
x = 0
width = 300

right panel:
x = 300
width = 340
```

These values may receive minor pixel-level adjustment during screenshot matching, but only through explicit update of this specification.

---

## 9. Left panel

The left panel contains:

```text
city header
+
scene/artwork viewport
```

Baseline:

```text
city header:
x = 0
y = 22
w = 300
h = 46

art panel:
x = 0
y = 68
w = 300
h = 332
```

---

## 10. Right panel

Baseline:

```text
information panel:
x = 300
y = 22
w = 340
h = 306

action bar:
x = 300
y = 328
w = 340
h = 72
```

The action bar contains four primary gameplay controls.

---

# PART IV — TOP MENU BAR

## 11. Menu bar

The top menu bar remains visible during standard gameplay screens.

Baseline menu groups:

```text
GAME
OPTIONS
AGENCY
DOSSIERS
```

Final naming may be localized or adapted narratively.

The canonical concepts remain.

---

## 12. GAME menu

May contain:

```text
New Case
Save / Resume behavior if applicable
Abandon Case
Hall of Fame
Return to Title
```

Do not expose developer/debug items in production.

---

## 13. OPTIONS menu

May contain:

```text
Sound
Music
Text speed
Fullscreen
Pixel scale
Language
```

Options must not alter gameplay rules.

---

## 14. AGENCY menu

Provides agency-related reference/actions.

Potential entries:

```text
Headquarters
Current Assignment
Detective Record
Rank
```

Exact structure is refined by `NARRATIVE_WALKTHROUGH.md`.

---

## 15. DOSSIERS menu

Opens suspect dossiers.

This is the exclusive entry point for suspect dossiers. No bottom primary action duplicates it.

---

## 16. Menu interaction

Clicking a menu label opens a rectangular dropdown directly beneath it.

Dropdown rules:

- square corners;
- no animation beyond optional immediate 1-frame open;
- keyboard navigable;
- clicking outside closes it;
- `Esc` closes it;
- only one dropdown open at a time.

Opening a menu costs:

```text
0 game hours
```

---

# PART V — CITY HEADER

## 17. City title

During city gameplay, the upper-left header displays:

```text
CURRENT CITY
```

on the first line.

Below or adjacent:

```text
CURRENT DAY / TIME
```

Example:

```text
BANGKOK
Monday, 9 a.m.
```

Exact typography belongs in `VISUAL_SPEC.md`.

---

## 18. Time updates

The displayed clock updates immediately after every time-consuming action.

The clock does not animate minute-by-minute.

Example:

```text
Monday, 9 a.m.
investigate
→
Monday, 11 a.m.
```

---

## 19. Wrong-city header

The city header never labels a destination as:

```text
WRONG CITY
```

The player learns this through witness responses and trail feedback.

---

# PART VI — ARTWORK PANEL

## 20. Artwork modes

The left artwork panel may display:

```text
city artwork
investigation-location background
witness portrait/composite
travel animation
trail animation
final encounter art
case result art
```

The panel dimensions remain fixed.

The surrounding UI does not resize based on content.

---

## 21. City artwork

On arrival in a city:

```text
artwork = city.artworkAssetId
```

No text is permanently embedded in the city image.

---

## 22. Place investigation artwork

When investigating a location:

```text
place background
+
witness sprite/portrait
```

may replace the city image.

The exact compositing method belongs in `VISUAL_SPEC.md`.

---

# PART VII — INFORMATION PANEL

## 23. Primary purpose

The right information panel presents:

- city descriptions;
- witness statements;
- clues;
- travel destinations;
- location choices;
- dossier information;
- warrant computer;
- status messages;
- case briefing text;
- case-end text.

It must not become a modern scrolling web document.

---

## 24. Text region

Text is constrained to a fixed rectangular area.

Long text must be:

- paginated;
- line-wrapped at fixed width;
- or scrolled using explicit DOS-style controls.

Do not let the panel grow vertically.

---

## 25. Text entry

When user text input is required, such as detective name:

- input appears inside a DOS-style rectangular field;
- visible caret;
- keyboard input;
- no modern browser-styled input border.

---

# PART VIII — PRIMARY ACTION BUTTONS

## 26. Four-button row

The canonical standard gameplay action row contains four controls:

```text
SEE
DEPART
SEARCH
P.C
```

These concepts correspond to the supplied DOS reference.

Labels may be localized.

---

## 27. Button meanings

### SEE

Displays a read-only list of the cities currently reachable from the present city.

It does not select a destination and does not initiate travel.

### DEPART

Opens the actionable travel destinations/map and owns destination selection.

### SEARCH

Opens the local investigation choices such as hotel, bank and museum.

### P.C

Opens characteristic filtering and warrant-computer functionality.

Suspect dossiers are accessed only through the top `DOSSIERS` menu.

---

## 28. Primary action button dimensions

Baseline action bar:

```text
width = 340
```

Preferred four-button split:

```text
85 px each
```

including borders.

Exact border arithmetic may adjust by 1–2 pixels.

---

## 29. Button states

Every primary button must support:

```text
normal
hover/focus
pressed
disabled
```

Pressed behavior:

- border relief reverses;
- icon/label content shifts approximately 1 logical pixel down/right;
- no scaling animation;
- no bounce;
- no modern glow.

---

## 30. Disabled state

Disabled buttons must remain visible but visually unavailable.

Examples:

- actions disabled while mandatory narrative text is typing;
- `DEPART` disabled during travel transition;
- `SEE` disabled while final arrest sequence is resolving.

---

# PART IX — POINTER AND KEYBOARD INPUT

## 31. Mouse

Mouse is the primary baseline interaction.

All clickable regions must use deterministic rectangular hitboxes aligned to logical pixels.

---

## 32. Keyboard

Keyboard support is mandatory for desktop usability.

Minimum controls:

```text
Tab        cycle actionable controls
Shift+Tab  reverse cycle
Enter      activate focused control
Space      activate focused button
Esc        close menu/modal/back
Arrow keys navigate menu/list where applicable
```

---

## 33. Optional shortcut keys

Primary actions may support:

```text
V → SEE / route preview
P → DEPART
B → SEARCH / local investigation
C → P.C / warrant computer
```

Shortcuts must not activate while typing a player name.

---

## 34. Focus indicator

Keyboard focus uses a DOS-style visual marker.

Do not rely only on browser-native outlines.

---

# PART X — TITLE SCREEN

## 34.1 Publisher splash

Antes do primeiro `TITLE`, a superfície 640×400 fica preta e apresenta a vinheta da Mreaggle Software. A arte sem texto ocupa os primeiros 800 ms do sting, com entrada quase imediata e desaparecimento progressivo; a arte completa entra em seguida. Ao terminar o áudio, a arte completa leva mais 1 segundo para desaparecer e então libera a tela de título.

Nenhum botão do título, rodapé, painel de apoio ou estado da engine fica acessível durante essa vinheta. Se autoplay com áudio for bloqueado, uma mensagem bitmap discreta pede clique ou tecla para iniciar, sem pular a sequência.

## 35. Title state

The title screen contains:

- game logo;
- DOS-era background/illustration;
- primary start action;
- optional credits/options access.

Baseline primary action:

```text
START
```

---

## 36. Title navigation

Starting the game transitions to the agency/headquarters sequence.

The title screen must not immediately open a city map.

---

# PART XI — HEADQUARTERS

## 37. Headquarters screen

The headquarters is the narrative and administrative start/end hub.

It may display:

- agency artwork;
- terminal/typewriter;
- detective sign-in;
- rank;
- case assignment;
- news bulletin;
- post-case reporting.

---

## 38. First-player name entry

For a new profile:

```text
HEADQUARTERS
    ↓
machine requests detective name
    ↓
player enters name
    ↓
system searches records
    ↓
new-player response
```

Exact dialogue belongs in `NARRATIVE_WALKTHROUGH.md`.

---

## 39. Returning-player behavior

If the profile name exists:

- system identifies detective;
- rank is shown or acknowledged;
- current/new assignment proceeds.

---

# PART XII — NEWS FLASH

## 40. News Flash state

A case begins with a distinct bulletin/assignment presentation.

The News Flash must present at minimum:

- stolen object;
- starting city;
- urgency;
- target description if narratively appropriate;
- deadline/assignment context.

The assignment presents the canonical deadline as `SUNDAY, 17:00`. It must not append `154 HOURS`: that value is an internal elapsed-time ceiling which includes the two-hour briefing before the first player-controlled action.

It must not reveal culprit identity.

---

## 41. News Flash interaction

The player advances using:

```text
CONTINUE
```

or equivalent.

It is not a gameplay choice screen.

---

# PART XIII — ASSIGNMENT SCREEN

## 42. Assignment

After News Flash, the agency formally assigns the player.

At minimum display:

```text
detective name
rank
starting city
stolen item
case start
```

Then:

```text
BEGIN INVESTIGATION
```

transitions into city gameplay.

---

# PART XIV — CITY ARRIVAL

## 43. Arrival state

After a successful travel transition:

1. update current city;
2. display city header;
3. display city artwork;
4. show short city description or arrival line;
5. restore primary action bar.

---

## 44. Trail feedback

If arrival advanced the correct route, suspicious-presence feedback may interrupt before the standard city state.

This is presentation-only and costs 0 hours.

---

# PART XV — SEARCH / INVESTIGATION FLOW

## 45. SEARCH button

Selecting the magnifying-glass `SEARCH` control opens the three current investigation locations in the information panel.

Display exactly:

```text
3 locations
```

---

## 46. Location selection layout

Preferred structure:

```text
SELECT A LOCATION:

[ HOTEL ]
[ BANK ]
[ MUSEUM ]
```

or a period-authentic list/grid consistent with the DOS reference.

Do not display all twelve global place types.

Only the three generated locations are shown.

Each entry includes a small dedicated bitmap icon showing a concise exterior view of that building or location. It must not crop or reuse the witness/interior background. Selecting an entry locks controls and uses the canonical footprint glyph at its native 15×11 logical-pixel crop to place eight alternating prints as one continuous trail, in four close left/right pairs, for the full duration of the footsteps SFX. A hard one-pixel gold outline keeps the dark sole readable over every place background; it is a sprite contour, never a soft shadow. The trail crosses the central floor area, never collides with the clock label, exists only over the city scene, must not be duplicated over the destination-interior preview and must not restart from a second corner. Only after that approach finishes may the existing clock/investigation presentation begin; footsteps and hourly ticks must never overlap. This transition is presentation-only and adds no simulated hours.

---

## 47. Visited indicator

Already-investigated locations must be visually distinguishable.

Possible DOS-style markers:

```text
✓
*
dimmed label
VISITED
```

Do not disable them completely because revisiting is allowed for free clue review.

---

## 48. Selecting unvisited location

Sequence:

```text
click location
→ controls temporarily locked
→ investigation/travel-time feedback if used
→ clock advances
→ deadline check
→ artwork changes to place/witness
→ clue text appears
```

---

## 49. Selecting visited location

Sequence:

```text
click visited location
→ no clock change
→ same witness/clue redisplayed
```

---

## 50. Returning from witness

A `BACK`, `CONTINUE` or equivalent control returns to the location list or main city state.

Exact flow should minimize accidental extra investigations.

---

# PART XVI — SEE / DEPART FLOW

## 50A. SEE route preview

Selecting `SEE` displays the legal generated candidate cities as plain text.

Each entry displays only the city name. Country names are omitted from this read-only preview so the list does not add an unintended geographic hint; `DEPART` remains the actionable destination view.

The preview is strictly read-only:

- no city is selectable;
- no destination is highlighted as correct;
- no travel occurs;
- the clock does not advance.

The candidate set must be identical to the selectable set shown by `DEPART`.

---

## 51. DEPART button

Selecting `DEPART` opens candidate destinations.

The current city remains visible or transitions to a map view depending on final visual implementation.

---

## 52. Destination list

The list contains only legal generated candidates for the current state.

Each entry displays:

```text
city name
```

Optional map position may visually support the list.

Do not display:

- correctness;
- clue matching score;
- route arrows revealing target;
- "recommended" destination.

---

## 53. Destination confirmation

Selecting a destination should require one clear commitment.

Preferred:

```text
select destination
→ departure confirmation
```

or:

```text
single click directly commits
```

This is finalized by screenshot/reference matching.

If confirmation exists, it costs 0 time until confirmed.

---

## 54. Travel transition

After commitment:

```text
action buttons disabled
→ airplane/travel animation
→ clock advances
→ deadline check
→ arrival screen
```

The animation itself does not consume additional simulated time.

Every committed trip remounts its presentation sequence with a unique run key.
The city-scene image is bound directly to the committed `currentCityId` and must
change before the arrival state is displayed, including on backtracking and
repeated visits.

When the browser requests reduced motion, essential travel, pursuit and result
sequences remain visible in a shorter stepped form. They must not collapse into
an imperceptible single frame because they communicate gameplay state.

---

# PART XVII — MAP

## 55. World map

The DEPART interface may include a world map.

The map shows:

- current city;
- currently offered destination cities;
- optional neutral world geography;
- no hidden route.

---

## 56. Map markers

Marker states:

```text
current
available
selected
```

Do not display:

```text
correct
wrong
future route
```

---

## 57. Map and list relationship

The map must not replace textual destination names.

Each candidate must remain selectable/readable.

---

# PART XVIII — WRONG CITY UI

## 58. Wrong-city arrival

Wrong city looks like a normal city arrival.

The UI does not immediately flash:

```text
WRONG!
```

---

## 59. Cold-trail discovery

The player learns the mistake by investigating.

Witness text is negative/cold-trail content.

The artwork remains normal.

---

## 60. Recovery travel

When off-route, `DEPART` includes the guaranteed recovery candidate required by `GAME_SPEC.md`.

The UI does not label it:

```text
BACK TO CORRECT CITY
```

It is shown as an ordinary city destination.

---

# PART XIX — OLD ROUTE CITY UI

## 61. Returning behind the trail anchor

An old route city displays normal city art.

Witnesses provide old-trail responses.

No obsolete geographic clues are redisplayed as if current.

Previously collected clues remain available through evidence/history if such a feature exists.

---

# PART XX — DOSSIERS MENU

## 62. DOSSIERS menu action

Selecting the top `DOSSIERS` menu opens suspect dossiers.

This does not advance time.

No bottom primary-action button opens dossiers.

---

## 63. Dossier index

Display all ten suspects in a DOS-style list or tiled portrait selector.

Each suspect entry should expose:

- portrait thumbnail or name;
- selectable dossier.

---

## 64. Dossier detail

A dossier displays:

```text
portrait
name
occupation
sex
hair
hobby
feature
vehicle
biographical flavor
```

The five warrant traits must be readable.

---

## 65. Dossier navigation

Controls:

```text
previous
next
back/index
close
```

Keyboard arrows may navigate suspects.

---

## 66. Dossier persistence

Closing dossiers returns the player exactly to the previous gameplay state.

No clue/location selection is lost.

---

# PART XXI — P.C / WARRANT COMPUTER

## 67. P.C action

Selecting the bottom computer control opens the warrant computer.

This is a modal gameplay tool.

Opening it costs 0 hours.

The 340×306 P.C. content block is a front-facing close-up of the warrant
computer, not a small decorative photograph. The artwork fills the block and
the five interactive filters, result text and compute control are positioned
inside the computer's CRT screen. Controls remain browser-rendered and
interactive; they are never baked into the background image.

---

## 68. Warrant fields

Display five categories:

```text
SEX
HAIR
HOBBY
FEATURE
VEHICLE
```

Each may be unset.

---

## 69. Field interaction

Each field uses a period-authentic selector.

Allowed patterns:

- cycle arrows;
- dropdown list;
- click-to-cycle value;
- rectangular selection list.

Do not use modern native HTML `<select>` appearance.

---

## 70. Candidate results

After `COMPUTE`:

### Zero matches

Display:

```text
NO MATCHING SUSPECT
```

No warrant.

### Multiple matches

Display matching suspect names.

Example:

```text
POSSIBLE SUSPECTS:
Suspect A
Suspect D
Suspect F
```

No warrant.

### One match

Display:

```text
WARRANT ISSUED
[ suspect name ]
```

and stamp/document presentation.

---

## 71. Compute confirmation

`COMPUTE` is the action that spends 2 game hours.

The interface must make this commitment obvious.

Simply changing fields must not consume time.

While the computation delay is active, the physical indicator lamps on both sides of the P.C. bezel blink in an alternating stepped pattern. The lights stop when the engine result is presented and do not perform suspect filtering themselves.

---

## 72. Warrant status indicator

After a warrant is issued, the UI should provide a persistent but subtle indication.

Example:

```text
WARRANT: SUSPECT NAME
```

in a status line, dossier menu, or agency panel.

Do not permanently occupy large screen space.

---

# PART XXII — CLUE DISPLAY

## 73. Witness statement layout

The information panel displays:

- localized witness occupation/title, without a personal name;
- statement text;
- optional visual divider;
- continue/back control.

---

## 74. Text typing

Witness text may use typewriter-style progressive reveal.

Default behavior should be specified in narrative/visual documents.

UI must support:

```text
typing
complete
skip-to-complete
```

---

## 75. Skip behavior

Click/Enter while text is typing:

```text
instantly reveal remaining text
```

It must not advance to the next state on the same input event.

A second input advances.

This prevents accidental skipping of entire clues.

---

# PART XXIII — CLUE HISTORY

## 76. Evidence history

Baseline recommendation:

Provide a simple case-note/history screen reachable from:

```text
AGENCY
```

or another explicit menu.

It may list previously discovered witness statements.

This is a convenience layer that preserves deduction rather than automating it.

---

## 77. No automatic interpretation

Evidence history may display:

```text
"asked for yen"
```

It must not display:

```text
→ therefore Tokyo
```

Likewise identity clues may be listed without auto-selecting warrant traits.

---

# PART XXIV — FINAL CITY UI

## 78. Final city arrival

Final city is not explicitly labeled:

```text
FINAL CITY
```

The player should infer proximity from trail feedback.

---

## 79. Final SEARCH behavior

The magnifying-glass `SEARCH` control still presents three investigation locations.

One is the hideout.

---

## 80. Non-hideout final search

After searching a non-hideout:

- clock advances;
- witness/proximity message appears;
- player returns to final city state.

---

## 81. Hideout selection

After selecting the actual hideout:

```text
clock advances
→ deadline check
→ encounter sequence begins
```

Primary controls lock during resolution.

---

# PART XXV — CAPTURE SEQUENCE

## 82. Correct warrant capture

If warrant is correct:

```text
culprit encounter
→ pursuit/capture animation
→ police/arrest presentation
→ recovered object
→ CASE SOLVED
```

The player cannot interact during the capture sequence except to advance text after mandatory animation.

The canonical `capture-dramatic-spritesheet` is staged in three readable beats: the disguised culprit crosses the frame, three federal agents follow while alternating two running poses, and a final right-to-left escort pose shows the arrested culprit with hands raised. Only the pursuing-agent render is mirrored horizontally so the agents face the same rightward direction in which they cross; the source asset and escort are unchanged. Their stride alternates an extended leg and a bent-knee pose. The escort enters from the right, stops centered and remains visible as the final capture tableau after controls are released; the animation window must not become empty. The sequence changes presentation only; the engine has already resolved warrant, time and hideout validity.

---

## 83. Capture information panel

Display at minimum:

```text
culprit name
stolen object recovered
case solved
```

Promotion information may follow.

---

# PART XXVI — NO WARRANT / WRONG WARRANT

## 84. No warrant final encounter

If no active warrant:

```text
encounter
→ system checks warrant
→ escape animation
→ failure message
```

The UI must make clear that the failure happened because no valid warrant existed.

---

## 85. Wrong warrant final encounter

If active warrant names another suspect:

```text
encounter
→ wrong warrant identified
→ culprit escapes
→ case failed
```

Use distinct text from no-warrant failure.

---

# PART XXVII — TIME EXPIRED

## 86. Deadline failure

When an action results in:

```text
currentTime >= deadline
```

the normal destination/clue result is interrupted.

Sequence:

```text
clock updates
→ time-expired alert
→ escape/result screen
```

No further city action is allowed.

---

# PART XXVIII — CASE SOLVED SCREEN

## 87. Case result

Successful case screen contains:

- case solved heading;
- captured suspect;
- stolen object recovered;
- elapsed case time;
- updated solved-case count;
- rank status.

---

## 88. Promotion flow

If threshold reached:

```text
case solved
→ promotion announcement
→ rank badge/art
→ headquarters
```

Exact narrative belongs in `NARRATIVE_WALKTHROUGH.md`.

---

# PART XXIX — CASE FAILED SCREEN

## 89. Failure variants

Supported result types:

```text
TIME EXPIRED
NO WARRANT
WRONG WARRANT
ABANDONED
```

Each receives distinct text.

All lead back to headquarters after acknowledgment.

---

# PART XXX — DEOLANE FINAL CASE

## 90. Final case UI differences

Mechanically the UI remains familiar.

Narrative presentation may intensify:

- special briefing;
- Deolane-specific dossier emphasis;
- unique pursuit imagery;
- unique final encounter;
- unique Hall of Fame sequence.

Do not redesign the gameplay interface for the final case.

---

# PART XXXI — HALL OF FAME

## 91. Hall of Fame screen

After capturing Deolane:

Display:

- detective name;
- final rank;
- solved-case count;
- Deolane capture achievement;
- Hall of Fame artwork.

---

## 92. Hall of Fame accessibility

After career completion, Hall of Fame remains accessible from the title/game menu.

---

# PART XXXII — MODALS

## 93. Modal definition

A modal blocks underlying gameplay controls.

Examples:

- abandon confirmation;
- warrant result;
- case-end acknowledgment;
- options.

---

## 94. Modal rules

While modal is open:

- underlying buttons cannot receive clicks;
- `Esc` closes only if safe;
- keyboard focus remains inside modal;
- game time does not pass.

---

# PART XXXIII — CONFIRMATION DIALOGS

## 95. Destructive actions require confirmation

Required confirmation for:

```text
Abandon Case
Return to Title during active case
Reset detective profile
```

Travel and investigation do not necessarily require confirmation.

---

# PART XXXIV — LOADING

## 96. Initial loading

Because the game is static and lightweight, loading screens should be minimal.

If critical assets are not ready:

```text
DOS-style LOADING...
```

may appear.

Do not use modern skeleton UIs.

---

## 97. Asset preload

Preload at minimum:

- UI atlas;
- font;
- current screen background;
- current city artwork;
- immediate transition sprites.

Do not block the game on every optional dossier image if lazy loading is safe.

---

# PART XXXV — RESPONSIVENESS

## 98. No structural reflow

The gameplay layout must never rearrange from:

```text
two columns
```

into:

```text
stacked mobile cards
```

as an automatic responsive behavior.

---

## 99. Small-screen strategy

On narrow/mobile devices:

1. preserve the 640×400 logical viewport;
2. scale to fit;
3. optionally allow fullscreen;
4. preserve hitbox usability.

If the result becomes physically too small, an explicit zoom/fullscreen affordance may be provided outside the game viewport.

---

# PART XXXVI — FULLSCREEN

## 100. Fullscreen control

Fullscreen is required under OPTIONS and may also be exposed as a small control outside the logical game surface on touch devices.

Fullscreen:

- expands the outer presentation;
- preserves aspect ratio;
- preserves logical resolution;
- does not reflow panels.

---

# PART XXXVII — TEXT SIZE AND WRAPPING

## 101. Bitmap typography constraints

Text layout must be tested at native bitmap font metrics.

No browser auto-scaling of fonts by accessibility heuristics may alter panel geometry unpredictably.

---

## 102. Wrapping

All text containers must use fixed logical widths.

Clue templates must be content-validated against reasonable maximum line lengths.

---

## 103. Overflow

If text exceeds panel capacity:

Preferred order:

```text
paginate
↓
explicit scroll
```

Never:

```text
resize panel
shrink font dynamically
```

---

# PART XXXVIII — SOUND INTERACTION

## 104. UI sounds

Potential sound events:

```text
button click
menu open
typewriter key
travel
computer compute
warrant issued
warning
capture
escape
promotion
```

Sound availability does not change interaction timing.

`typewriter.mp3` is a parallel UI sound layer. Name entry triggers one play for
each input change made by the player. Progressively rendered personnel lookup,
assignment, witness and warrant-computer text uses a fixed 150 ms playback
cadence, independent of character speed. It never stops or replaces the active
music, cue or sting. `mouse_click.mp3` plays on each primary pointer press.

---

# PART XXXIX — CURSOR

## 105. Cursor style

On desktop with a fine pointer, the gameplay viewport uses `mouse-up.png` as
the default cursor and `mouse-down.png` while the primary pointer is pressed.
Touch/coarse-pointer layouts retain the platform cursor behavior.

The cursor must remain precise enough for UI selection.

Do not use animated novelty cursors.

---

# PART XL — ACCESSIBILITY WITHOUT REDESIGN

## 106. Semantic interaction

Despite DOS appearance:

- interactive controls should expose semantic labels;
- keyboard navigation must work;
- focus order must be logical;
- color alone should not convey every important state.

---

## 107. Reduced motion

If browser/user preference requests reduced motion:

- animations may be shortened or simplified;
- gameplay time and sequence remain unchanged.

---

# PART XLI — STATE RESTORATION

## 108. Reload during city state

Reload returns to:

```text
same city
same clock
same route state
same visited locations
same clue state
same warrant
```

---

## 109. Reload during modal/transitional state

Persist canonical gameplay state, not animation frame.

After reload:

- safely resume at the nearest stable screen;
- never replay an action in a way that charges time twice.

---

# PART XLII — SCREEN STATE ENUMERATION

## 110. Canonical top-level UI states

Recommended conceptual states:

```text
BOOT
TITLE
HEADQUARTERS_SIGNIN
HEADQUARTERS_RETURNING
NEWS_FLASH
ASSIGNMENT
CITY_IDLE
CITY_PLACES
CITY_WITNESS
TRAVEL_SELECT
TRAVEL_TRANSITION
DOSSIER_INDEX
DOSSIER_DETAIL
WARRANT
TRAIL_FEEDBACK
FINAL_ENCOUNTER
CASE_SOLVED
CASE_FAILED
PROMOTION
HALL_OF_FAME
OPTIONS
CREDITS
```

Implementation may use nested state machines.

---

# PART XLIII — STATE TRANSITION REFERENCE

## 111. Opening

```text
BOOT
→ TITLE
→ HEADQUARTERS_SIGNIN / RETURNING
→ NEWS_FLASH
→ ASSIGNMENT
→ CITY_IDLE
```

---

## 112. Investigation

```text
CITY_IDLE
→ CITY_PLACES
→ CITY_WITNESS
→ CITY_PLACES or CITY_IDLE
```

---

## 113. Travel

```text
CITY_IDLE
→ TRAVEL_SELECT
→ TRAVEL_TRANSITION
→ TRAIL_FEEDBACK optional
→ CITY_IDLE
```

---

## 114. Dossiers

```text
CITY_IDLE
→ DOSSIER_INDEX
→ DOSSIER_DETAIL
→ DOSSIER_INDEX
→ CITY_IDLE
```

---

## 115. Warrant

```text
CITY_IDLE
→ WARRANT
→ WARRANT RESULT
→ WARRANT or CITY_IDLE
```

---

## 116. Final

```text
CITY_IDLE
→ CITY_PLACES
→ FINAL_ENCOUNTER
→ CASE_SOLVED
   or
→ CASE_FAILED
```

---

# PART XLIV — PRIMARY BUTTON AVAILABILITY MATRIX

## 117. CITY_IDLE

```text
SEE      enabled
DEPART   enabled
SEARCH   enabled
P.C      enabled
```

---

## 118. CITY_PLACES

Primary action row may remain visible but inactive, or be replaced by local navigation.

Preferred:

```text
SEE      available as read-only route preview
DEPART   available
SEARCH   active/current
P.C      available after statement completion
```

Do not allow accidental mode switching mid-location selection unless explicitly designed.

---

## 119. CITY_WITNESS

Primary actions disabled while statement is presented.

After completion, show explicit return/continue.

---

## 120. TRAVEL_SELECT

`DEPART` is active mode and owns destination selection.

Other primary actions should not commit until travel selection closes.

---

## 121. WARRANT / P.C

`P.C` is active/current. Other primary actions remain available except while a warrant computation is resolving.

---

## 122. DOSSIERS

Underlying primary actions disabled.

---

# PART XLV — UI DATA BOUNDARY

## 123. UI does not own gameplay truth

UI reads state from the engine.

Bad:

```ts
if (selectedCityName === "Tokyo") {
  showCorrectAnimation();
}
```

Good:

```ts
if (gameState.arrivalClassification === "CORRECT_FORWARD") {
  showTrailFeedback();
}
```

---

## 124. UI action contract

UI sends intent:

```text
investigate(placeId)
travel(cityId)
computeWarrant(criteria)
openDossier(suspectId)
abandonCase()
```

The engine returns authoritative result/state.

---

# PART XLVI — VISUAL REFERENCE MATCHING

## 125. Supplied DOS screenshot

The supplied DOS screenshot is the primary structural visual reference for:

- menu placement;
- panel proportions;
- border language;
- black information area;
- city/date header;
- left artwork panel;
- lower-right four-button action row;
- compact typography;
- overall information density.

---

## 126. Pixel matching process

Before final UI freeze:

1. place reference screenshot beside implementation;
2. measure relative proportions;
3. reproduce major panel boundaries;
4. compare native-scale screenshot;
5. correct geometry;
6. repeat until visibly indistinguishable in structure.

Do not rely on approximate CSS intuition.

---

## 127. What may differ from reference

Must differ where required by original content:

- game title;
- agency name;
- character names;
- icons if proprietary;
- artwork;
- text;
- logos.

May remain extremely close structurally:

- panel positions;
- menu hierarchy concept;
- border proportions;
- button dimensions;
- spacing;
- information density;
- interaction sequence.

---

# PART XLVII — FORBIDDEN UI PATTERNS

## 128. Never introduce

Do not use:

- rounded cards;
- Material Design;
- Bootstrap-style alerts;
- Tailwind-default visual language;
- floating action buttons;
- hamburger menus for desktop gameplay;
- toast notifications;
- browser-native selects;
- emoji icons;
- modern outline icon packs;
- animated gradient backgrounds;
- backdrop blur;
- glassmorphism;
- parallax;
- smooth scrolling;
- infinite scroll;
- responsive Masonry grids;
- pill buttons;
- full-screen modal sheets;
- modern loading spinners.

The browser is merely the runtime.

The UI belongs to the DOS fiction.

---

# PART XLVIII — ACCEPTANCE CHECKLIST

## 129. Global shell

- [ ] logical viewport is 640×400;
- [ ] layout uses fixed integer geometry;
- [ ] top menu remains compact;
- [ ] left city/art panel and right information panel match reference structure;
- [ ] action row contains four canonical controls;
- [ ] no modern responsive reflow exists.

---

## 130. Investigation

- [ ] SEARCH shows exactly three locations;
- [ ] visited status visible;
- [ ] new investigation transitions cleanly to witness;
- [ ] revisiting redisplays clue without implying new time cost;
- [ ] no hidden additional locations exist.

---

## 131. Travel

- [ ] SEE lists generated candidate cities without allowing selection;
- [ ] DEPART displays the same generated candidates as selectable destinations;
- [ ] no correct destination marking;
- [ ] map does not reveal hidden route;
- [ ] travel locks controls during transition;
- [ ] arrival returns to standard shell.

---

## 132. Dossiers

- [ ] all ten suspects accessible;
- [ ] five warrant traits readable;
- [ ] browsing costs no game time;
- [ ] closing restores previous state.

---

## 133. Warrant

- [ ] five fields;
- [ ] fields editable for free;
- [ ] compute is explicit;
- [ ] 0/1/multiple result states distinct;
- [ ] active warrant visible after issuance.

---

## 134. Failures

- [ ] time-expired failure distinct;
- [ ] no-warrant failure distinct;
- [ ] wrong-warrant failure distinct;
- [ ] abandoned-case failure distinct.

---

## 135. Career

- [ ] promotion screen supported;
- [ ] Deolane final encounter supported;
- [ ] Hall of Fame screen supported.

---

# PART XLIX — FINAL DIRECTIVE

## 136. UI identity

The interface must feel like a piece of software from the same period as the original DOS reference.

That means the user should experience:

```text
rigid panels
compact menus
bitmap text
hard borders
limited screen space
four obvious action controls
modal utilities
text-heavy investigation
pixel-art scenes
deliberate transitions
```

The browser must disappear as a concept.

At no point should the player think:

```text
"This is a responsive web application."
```

The intended reaction is:

```text
"This looks like a DOS detective game that somehow runs perfectly in my browser."
```

**`UI_UX_SPEC.md` is the source of truth for screens, interaction, navigation and layout behavior.**
