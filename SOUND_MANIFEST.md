# SOUND_MANIFEST.md

## 1. Document authority

This document is the canonical soundtrack and runtime-audio manifest for **Deolane San Paolo / `DeolaneSanPaolo`**.

It defines:

- the 26 canonical event-cue MP3 files;
- stable runtime IDs;
- exact filenames;
- production paths;
- gameplay events that request each track;
- playback continuity;
- replacement behavior;
- simultaneous-event priority;
- looping;
- volume;
- preload strategy;
- browser integration;
- persistence-related audio flags;
- non-canonical source files that must not enter the game.

This document is the source of truth for soundtrack playback.

The engine must think in semantic events.

The runtime audio system resolves those events into tracks.

```text
GAME EVENT
    ↓
PRESENTATION / AUDIO EVENT MAPPER
    ↓
AUDIO MANAGER
    ↓
AUDIO REGISTRY
    ↓
MP3
```

Never scatter MP3 filenames through gameplay code.

---

# PART I — CANONICAL PLAYBACK PHILOSOPHY

## 2. Important production reality

The 26 event-cue files were originally conceived as a mixture of:

- stingers;
- short fanfares;
- system cues;
- themes.

However, many of the final Suno generations became **complete musical pieces** rather than tiny effects.

This is now an intentional part of the soundtrack design.

Do **not** automatically crop those tracks merely to force them back into their originally imagined duration.

---

## 3. Continuous-until-replaced policy

This is the primary runtime soundtrack rule:

```text
A TRACK STARTS
    ↓
IT CONTINUES PLAYING
    ↓
SCREEN MAY CHANGE
    ↓
GAMEPLAY MAY CONTINUE
    ↓
IT IS NOT STOPPED JUST BECAUSE ITS ORIGINAL SCREEN ENDED
    ↓
WHEN ANOTHER MUSIC TRACK IS REQUESTED
    ↓
CURRENT TRACK IS REPLACED
    ↓
NEW TRACK STARTS
```

In short:

> **The current soundtrack track continues until it ends naturally or another soundtrack track begins.**

### 3.1 Project addendum — ambient bed 26

`public/audio/music/26_ambient_background.mp3` is the one production track outside the canonical numbered set of 26 event cues. It is a low-volume looping bed and follows the explicit runtime sequence below:

```text
AMBIENT BED (loop)
    ↓ event cue requested
AMBIENT PAUSES, preserving currentTime
    ↓
EVENT CUE PLAYS ALONE
    ↓ natural end
AMBIENT RESUMES from the paused position
```

Event cues must never overlap the ambient bed. Replacing one event cue with another keeps the bed paused; disabling music pauses both layers; re-enabling music resumes the active cue or, when no cue is active, the ambient bed.

---

## 4. Screen transitions do not stop music

Leaving a UI screen is **not** a reason to stop its current track.

Forbidden behavior:

```text
NEWS FLASH closes
→ immediately stop 05_news_flash.mp3
→ silence
```

Correct behavior:

```text
05_news_flash.mp3 continues
↓
assignment screen appears
↓
CASE_ASSIGNMENT event requests 6_case_assignment.mp3
↓
05 stops
↓
06 begins
```

If no new soundtrack cue is requested:

```text
the current song continues
```

---

## 5. Natural track ending

If a track reaches its natural end before another track is requested:

```text
track ends
→ silence
```

Do not automatically restart it.

Baseline:

```text
loop = false
```

for all 26 canonical event tracks.

---

## 6. New track always becomes the new musical state

When a valid later soundtrack event requests another canonical track:

```text
current track
→ stop immediately
→ new track
```

Do not queue the next track behind the entire remaining duration of the old track.

The newest valid musical event represents the new soundtrack state.

---

## 7. No premature cutting

Do not stop a track merely because:

- a dialogue finished;
- text finished typing;
- a panel closed;
- a city screen opened;
- the player opened a dossier;
- the player opened the warrant computer;
- an animation ended;
- the player returned from a submenu.

A track is stopped only by:

1. another canonical soundtrack track beginning;
2. the track reaching its own end;
3. the user disabling/muting music;
4. application teardown;
5. an explicit exceptional rule documented here.

---

# PART II — TRANSITION BETWEEN TRACKS

## 8. Replacement transition

Default replacement:

```text
old track: hard stop
new track start: immediately
transition: 0 ms by default
```

This project uses immediate replacement so a newly triggered gameplay situation is
audible at once. A caller may opt into a transition of at most 30 ms only when it
cannot delay or obscure the semantic cue.

Do not use long cinematic crossfades.

---

## 9. Hard-cut option

For abrupt DOS-style system transitions, the runtime may use:

```text
0–30 ms
```

hard replacement.

Recommended for:

- `DETECTIVE_UNKNOWN`;
- `COLD_TRAIL`;
- `TIME_ALMOST_EXPIRED`;
- `WARRANT_INCONCLUSIVE`;
- `WRONG_FINAL_HIDEOUT`.

---

## 10. No music queue

Do not maintain a FIFO playlist such as:

```text
05 waits
06 waits
07 waits
08 waits
```

That would cause stale event music to play long after the relevant event.

Instead:

```text
latest valid requested track
=
current musical state
```

---

# PART III — PRIORITY REDEFINED

## 11. Priority is only a simultaneous-event tie breaker

Because tracks now continue until replaced, priority must **not** prevent later legitimate events from changing music.

Priority is used only when two or more candidate soundtrack events are produced by the **same atomic gameplay transition**.

Example:

```text
ARRIVED_CORRECT_CITY
+
HENCHMAN_APPEARED
```

Both occur from one arrival.

The higher-priority event wins.

Result:

```text
10_suspicious_henchman.mp3
```

rather than briefly playing:

```text
8_hot_trail.mp3
```

first.

---

## 12. Chronological events override priority

If a lower-priority event occurs later in real gameplay chronology, it may still replace the current music.

Example:

```text
18_criminal_revealed.mp3
    ↓
player proceeds
    ↓
case result resolves
    ↓
20_case_closed.mp3
```

Track 20 replaces 18 because it is the newer valid soundtrack state.

Do not block it merely because 18 had a higher numeric priority.

---

# PART IV — EXACT SOURCE FILENAMES

## 13. Canonical source names

The generated soundtrack files use the exact naming convention visible in the production folder:

```text
1_title_theme.mp3
2_headquarters_agency.mp3
3_detective_search.mp3
4_detective_unknown.mp3
5_news_flash.mp3
6_case_assignment.mp3
7_airplane_travel.mp3
8_hot_trail.mp3
9_cold_trail.mp3
10_suspicious_henchman.mp3
11_culprit_very_close.mp3
12_time_almost_expired.mp3
13_crime_computer_calculating.mp3
14_warrant_issued.mp3
15_warrant_inconclusive.mp3
16_final_city.mp3
17_wrong_final_hideout.mp3
18_criminal_revealed.mp3
19_criminal_escaped.mp3
20_case_closed.mp3
21_rank_promotion.mp3
22_deolane_san_paolo_leitmotif.mp3
23_final_deolane_reveal.mp3
24_final_capture_of_Deolane.mp3
25_hall_of_fame.mp3
27_dossiers.mp3
```

These exact filenames are canonical unless intentionally renamed in a dedicated migration.

**Linux/GitHub Pages paths are case-sensitive.**

Therefore:

```text
24_final_capture_of_Deolane.mp3
```

must be referenced with the exact uppercase `D` if that remains the committed filename.

---

# PART V — PRODUCTION DIRECTORY

## 14. Runtime location

Copy the 26 canonical event files to:

```text
public/
└── audio/
    └── music/
        ├── 1_title_theme.mp3
        ├── 2_headquarters_agency.mp3
        ├── 3_detective_search.mp3
        ├── 4_detective_unknown.mp3
        ├── 5_news_flash.mp3
        ├── 6_case_assignment.mp3
        ├── 7_airplane_travel.mp3
        ├── 8_hot_trail.mp3
        ├── 9_cold_trail.mp3
        ├── 10_suspicious_henchman.mp3
        ├── 11_culprit_very_close.mp3
        ├── 12_time_almost_expired.mp3
        ├── 13_crime_computer_calculating.mp3
        ├── 14_warrant_issued.mp3
        ├── 15_warrant_inconclusive.mp3
        ├── 16_final_city.mp3
        ├── 17_wrong_final_hideout.mp3
        ├── 18_criminal_revealed.mp3
        ├── 19_criminal_escaped.mp3
        ├── 20_case_closed.mp3
        ├── 21_rank_promotion.mp3
        ├── 22_deolane_san_paolo_leitmotif.mp3
        ├── 23_final_deolane_reveal.mp3
        ├── 24_final_capture_of_Deolane.mp3
        ├── 25_hall_of_fame.mp3
        ├── 26_ambient_background.mp3
        └── 27_dossiers.mp3
```

The former opening theme is preserved beside the runtime files as
`1_title_theme.mp3.old`. It is an archival backup only: do not register or play it.

---

# PART VI — NON-CANONICAL FILES

## 15. `Gold of Deolane.mp3`

The source folder also contains:

```text
Gold of Deolane.mp3
```

It is **not part of the canonical 25-track runtime soundtrack**.

Default:

```text
DO NOT REGISTER
DO NOT COPY TO public/audio/music/
DO NOT PLAY AT RUNTIME
```

It may remain in development storage for later evaluation.

---

## 16. `22_deolane_leitmotif.old`

This is an obsolete backup.

```text
IGNORE
DO NOT REGISTER
DO NOT SHIP
```

Canonical file:

```text
22_deolane_san_paolo_leitmotif.mp3
```

---

# PART VII — STABLE AUDIO IDS

## 17. Runtime IDs

```ts
export type MusicCueId =
  | "TITLE_THEME"
  | "HEADQUARTERS_AGENCY"
  | "DETECTIVE_SEARCH"
  | "DETECTIVE_UNKNOWN"
  | "NEWS_FLASH"
  | "CASE_ASSIGNMENT"
  | "AIRPLANE_TRAVEL"
  | "HOT_TRAIL"
  | "COLD_TRAIL"
  | "SUSPICIOUS_HENCHMAN"
  | "CULPRIT_VERY_CLOSE"
  | "TIME_ALMOST_EXPIRED"
  | "CRIME_COMPUTER_CALCULATING"
  | "WARRANT_ISSUED"
  | "WARRANT_INCONCLUSIVE"
  | "FINAL_CITY"
  | "WRONG_FINAL_HIDEOUT"
  | "CRIMINAL_REVEALED"
  | "CRIMINAL_ESCAPED"
  | "CASE_CLOSED"
  | "RANK_PROMOTION"
  | "DEOLANE_LEITMOTIF"
  | "FINAL_DEOLANE_REVEAL"
  | "FINAL_CAPTURE_DEOLANE"
  | "HALL_OF_FAME"
  | "DOSSIERS";
```

---

# PART VIII — MASTER CATALOG

## 18. Canonical soundtrack mapping

| # | Runtime ID | Filename | Event / use | Priority |
|---:|---|---|---|---:|
| 1 | `TITLE_THEME` | `1_title_theme.mp3` | `TITLE_ENTERED` | 1 |
| 2 | `HEADQUARTERS_AGENCY` | `2_headquarters_agency.mp3` | `HEADQUARTERS_ENTERED` | 3 |
| 3 | `DETECTIVE_SEARCH` | `3_detective_search.mp3` | `DETECTIVE_LOOKUP_STARTED` | 2 |
| 4 | `DETECTIVE_UNKNOWN` | `4_detective_unknown.mp3` | `DETECTIVE_NOT_FOUND` | 3 |
| 5 | `NEWS_FLASH` | `5_news_flash.mp3` | `NEWS_FLASH_STARTED` | 4 |
| 6 | `CASE_ASSIGNMENT` | `6_case_assignment.mp3` | `CASE_ASSIGNMENT_SHOWN` | 4 |
| 7 | `AIRPLANE_TRAVEL` | `7_airplane_travel.mp3` | `TRAVEL_STARTED` | 5 |
| 8 | `HOT_TRAIL` | `8_hot_trail.mp3` | `ARRIVED_CORRECT_CITY` | 5 |
| 9 | `COLD_TRAIL` | `9_cold_trail.mp3` | `COLD_TRAIL_CONFIRMED` | 5 |
| 10 | `SUSPICIOUS_HENCHMAN` | `10_suspicious_henchman.mp3` | `HENCHMAN_APPEARED` | 6 |
| 11 | `CULPRIT_VERY_CLOSE` | `11_culprit_very_close.mp3` | `CULPRIT_PROXIMITY_HIGH` | 6 |
| 12 | `TIME_ALMOST_EXPIRED` | `12_time_almost_expired.mp3` | `TIME_WARNING_TRIGGERED` | 7 |
| 13 | `CRIME_COMPUTER_CALCULATING` | `13_crime_computer_calculating.mp3` | `WARRANT_COMPUTER_OPENED` | 3 |
| 14 | `WARRANT_ISSUED` | `14_warrant_issued.mp3` | `WARRANT_ISSUED` | 7 |
| 15 | `WARRANT_INCONCLUSIVE` | `15_warrant_inconclusive.mp3` | `WARRANT_INCONCLUSIVE` | 4 |
| 16 | `FINAL_CITY` | `16_final_city.mp3` | `FINAL_CITY_REACHED` | 8 |
| 17 | `WRONG_FINAL_HIDEOUT` | `17_wrong_final_hideout.mp3` | `FINAL_HIDEOUT_MISSED` | 8 |
| 18 | `CRIMINAL_REVEALED` | `18_criminal_revealed.mp3` | `CULPRIT_FOUND` | 9 |
| 19 | `CRIMINAL_ESCAPED` | `19_criminal_escaped.mp3` | `CULPRIT_ESCAPED` | 9 |
| 20 | `CASE_CLOSED` | `20_case_closed.mp3` | `CASE_SOLVED` | 9 |
| 21 | `RANK_PROMOTION` | `21_rank_promotion.mp3` | `RANK_PROMOTED` | 9 |
| 22 | `DEOLANE_LEITMOTIF` | `22_deolane_san_paolo_leitmotif.mp3` | `DEOLANE_THEME_REQUESTED` | 8 |
| 23 | `FINAL_DEOLANE_REVEAL` | `23_final_deolane_reveal.mp3` | `FINAL_DEOLANE_FOUND` | 10 |
| 24 | `FINAL_CAPTURE_DEOLANE` | `24_final_capture_of_Deolane.mp3` | `DEOLANE_CAPTURED` | 10 |
| 25 | `HALL_OF_FAME` | `25_hall_of_fame.mp3` | `HALL_OF_FAME_ENTERED` | 10 |
| 27 | `DOSSIERS` | `27_dossiers.mp3` | `DOSSIERS_OPENED` | 3 |

All:

```text
loop = false
playbackMode = CONTINUE_UNTIL_REPLACED
```

---

# PART IX — IMPORTANT EVENT POLICIES

## 19. Title

```text
TITLE_ENTERED
→ play TITLE_THEME
```

Leaving the title does **not** itself stop the song.

When Headquarters requests track 2:

```text
track 1
→ short transition
→ track 2
```

---

## 20. Detective lookup

```text
DETECTIVE_LOOKUP_STARTED
→ 3_detective_search.mp3
```

When the lookup result appears:

```text
DETECTIVE_NOT_FOUND
→ replace track 3 with track 4
```

Do not stop track 3 merely because the lookup animation ended unless a result cue is starting.

For a returning detective with no special result cue:

```text
track 3 may finish naturally
```

---

## 21. News Flash → Assignment

```text
NEWS_FLASH_STARTED
→ track 5
```

When assignment begins:

```text
CASE_ASSIGNMENT_SHOWN
→ replace 5 with 6
```

Do not cut track 5 at the end of the News Flash text before track 6 actually begins.

---

## 22. Travel

```text
TRAVEL_STARTED
→ track 7
```

If the travel animation ends before track 7 ends:

```text
track 7 continues
```

Arrival does not automatically silence it.

If arrival immediately produces a new musical event:

```text
correct city → track 8
henchman → track 10
final city → track 16
```

that new track replaces 7.

---

## 23. Hot trail versus henchman

If the same arrival generates:

```text
ARRIVED_CORRECT_CITY
+
HENCHMAN_APPEARED
```

choose only:

```text
SUSPICIOUS_HENCHMAN
```

because it is the stronger event.

Do not play 8 for two seconds and then 10.

---

## 24. Cold trail

Do not trigger `COLD_TRAIL` from secret engine knowledge.

Trigger it when the player-facing state actually reveals that the trail is cold.

At that moment:

```text
current music
→ replaced by 9_cold_trail.mp3
```

---

## 25. Time warning

Recommended trigger:

```text
remainingHours <= 18
```

Hard rule:

```text
play once per case
```

Persist:

```ts
timeWarningPlayed: boolean
```

If another song is currently playing:

```text
12_time_almost_expired.mp3
```

replaces it because the warning is a new valid musical event.

After track 12 ends:

```text
silence
```

unless another event occurs.

Do not resume the previous track.

---

## 26. Warrant computer

```text
player clicks P.C. / opens the warrant computer
↓
WARRANT_COMPUTER_OPENED
→ track 13
```

Changing filters and clicking `COMPUTAR MANDADO` do not request track 13 again.
Because the generated track may be a complete song:

**do not stop it just because the computation animation finishes.**

Instead:

```text
result becomes visible
↓
result cue is requested
↓
13 is replaced by 14 or 15
```

Thus:

```text
13 → 14
```

for a warrant issued,

or:

```text
13 → 15
```

for inconclusive result.

---

## 27. Final city

On first arrival:

```text
FINAL_CITY_REACHED
→ track 16
```

Persist:

```ts
finalCityCuePlayed: boolean
```

Searching locations does not automatically stop track 16.

A later final-location event may replace it.

---

## 28. Wrong final hideout

```text
FINAL_HIDEOUT_MISSED
→ track 17
```

May happen twice if both wrong locations are investigated.

If track 17 continues while the player returns to the three-location selection:

```text
let it continue
```

until it ends or another track starts.

---

## 29. Criminal revealed

Ordinary culprit:

```text
CULPRIT_FOUND
→ track 18
```

Do not stop merely because the reveal animation has finished.

When the outcome resolves:

```text
success → track 20
failure → track 19
```

Those tracks replace 18.

---

## 30. Criminal escaped

```text
CULPRIT_ESCAPED
→ track 19
```

The failure/result screen may appear while track 19 continues.

Returning to Headquarters later requests track 2, which replaces 19 if it is still playing.

---

## 31. Ordinary case closed

```text
CASE_SOLVED
→ track 20
```

The result screen may remain while track 20 continues.

If the player earned a promotion:

```text
promotion screen begins
→ track 21
```

Track 21 replaces 20.

If there is no promotion:

```text
track 20 continues until it ends
or Headquarters begins and track 2 replaces it
```

---

## 32. Deolane leitmotif

Track 22 is a thematic piece.

It should only be requested by explicit narrative presentation.

Once started:

```text
allow full playback across nearby narrative screens
```

until another soundtrack event supersedes it.

Do not restart it because the same Deolane screen rerenders.

---

## 33. Final Deolane reveal

For:

```text
caseType == FINAL_DEOLANE
```

the correct hideout uses:

```text
23_final_deolane_reveal.mp3
```

instead of track 18.

---

## 34. Final Deolane capture

Final success uses:

```text
24_final_capture_of_Deolane.mp3
```

instead of track 20.

Let it continue through the immediate final-capture/result presentation.

When Hall of Fame begins:

```text
track 25 replaces track 24
```

---

## 35. Hall of Fame

```text
HALL_OF_FAME_ENTERED
→ track 25
```

If it ends naturally:

```text
silence
```

Do not loop automatically.

### 35.1 Dossiers

```text
DOSSIERS_OPENED
→ track 27
```

Opening the T.C.C. dossiers immediately replaces the current event cue with
`27_dossiers.mp3`. Moving between suspect pages while the dossiers remain open
must not restart it. If the player leaves and later opens the dossiers again,
the semantic event may request track 27 again; ordinary same-track suppression
still applies while that file is already playing.

---

# PART X — AUDIO REGISTRY

## 36. Recommended registry

Create:

```text
src/audio/audioRegistry.ts
```

Example:

```ts
export interface MusicCueDefinition {
  id: MusicCueId;
  file: string;
  priority: number;
  loop: false;
  playbackMode: "CONTINUE_UNTIL_REPLACED";
  transition: "SOFT_REPLACE" | "HARD_REPLACE";
  gain: number;
}

export const AUDIO_REGISTRY: Record<MusicCueId, MusicCueDefinition> = {
  TITLE_THEME: {
    id: "TITLE_THEME",
    file: "audio/music/1_title_theme.mp3",
    priority: 1,
    loop: false,
    playbackMode: "CONTINUE_UNTIL_REPLACED",
    transition: "SOFT_REPLACE",
    gain: 0.80
  },

  // ...remaining 24 tracks
};
```

---

# PART XI — AUDIO MANAGER

## 37. Dedicated runtime manager

Create:

```text
src/audio/AudioManager.ts
```

It owns:

- current music track;
- playback object;
- music volume;
- mute state;
- track replacement;
- immediate hard cuts (with an optional transition no longer than 30 ms);
- browser audio unlocking;
- duplicate-event suppression.

It does **not** own gameplay rules.

---

## 38. Core AudioManager behavior

Conceptually:

```ts
playMusic(cueId) {
  if (!musicEnabled) return;

  if (currentCueId === cueId && currentAudio && !currentAudio.ended) {
    return;
  }

  replaceCurrentTrack(cueId);
}
```

---

## 39. Same-track duplicate suppression

If the same cue is requested repeatedly while already playing:

```text
do nothing
```

Do not restart from 0:00.

Example:

```text
Svelte rerenders FINAL_CITY
→ must NOT restart track 16
```

---

## 40. Replacement behavior

```ts
async function replaceCurrentTrack(nextCueId) {
  if (currentAudio) {
    await shortFadeOrStop(currentAudio);
  }

  currentCueId = nextCueId;
  currentAudio = getAudio(nextCueId);
  currentAudio.currentTime = 0;
  await currentAudio.play();
}
```

---

# PART XII — SCREEN CHANGE POLICY

## 41. UI state must not control soundtrack lifetime

Do not implement:

```ts
onDestroy(() => audio.stop());
```

inside ordinary screen components.

That would violate the continuity policy.

Components request tracks.

`AudioManager` owns their lifetime.

---

## 42. Modal behavior

Opening:

- options;
- case notes;
- menus;

does not stop current music.

Unless the modal itself triggers a canonical soundtrack event:

```text
music continues underneath
```

The Dossiês screen is an explicit event-bearing panel: opening it produces
`DOSSIERS_OPENED` and immediately requests track 27. The P.C. is the other
explicit exception: opening the warrant computer produces
`WARRANT_COMPUTER_OPENED` and immediately requests track 13.

---

# PART XIII — ENGINE BOUNDARY

## 43. Engine emits meaning

Game engine may emit:

```text
CASE_SOLVED
CULPRIT_FOUND
RANK_PROMOTED
```

It does not play music.

Presentation layer maps those events to soundtrack requests.

---

# PART XIV — EVENT RESOLUTION

## 44. Atomic event resolution

If one engine action emits multiple semantic events:

```text
Time advanced
Arrived correct city
Final city reached
Henchman appeared
```

the presentation layer must choose the most specific soundtrack event before requesting playback.

Do not sequentially fire every candidate soundtrack.

---

## 45. Specificity examples

```text
FINAL_CITY_REACHED
beats
ARRIVED_CORRECT_CITY
```

```text
HENCHMAN_APPEARED
beats
ARRIVED_CORRECT_CITY
```

```text
FINAL_DEOLANE_FOUND
beats
CULPRIT_FOUND
```

```text
DEOLANE_CAPTURED
beats
CASE_SOLVED
```

---

# PART XV — VITE / GITHUB PAGES

## 46. Base-path-safe resolution

Do not use root-hardcoded paths such as:

```text
/audio/music/1_title_theme.mp3
```

Use:

```ts
function resolvePublicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}
```

Example:

```ts
resolvePublicAsset("audio/music/1_title_theme.mp3")
```

This is required for project GitHub Pages deployment.

---

# PART XVI — BROWSER AUTOPLAY

## 47. Audio unlock

Browser autoplay restrictions must be handled.

Recommended:

```text
TITLE displayed
↓
player clicks / presses START
↓
audio unlocked
↓
music system enabled
```

If track 1 cannot start before user gesture:

```text
do not treat it as game failure
```

---

# PART XVII — PRELOADING

## 48. Initial preload

After first valid user interaction, preload:

```text
1
2
3
4
5
6
```

---

## 49. Active-case preload

After case generation begins, progressively preload:

```text
7–21 and 27
```

---

## 50. Final-case preload

For final Deolane case:

```text
22
23
24
25
```

should be preloaded.

---

# PART XVIII — VOLUME

## 51. Music master

Recommended default:

```text
0.75
```

User range:

```text
0.0–1.0
```

---

## 52. Per-track gain

Exact gain may be calibrated after all MP3s are imported.

Do not assume Suno normalized them consistently.

A later audio-analysis script should measure loudness and produce a tuning report.

---

# PART XIX — PERSISTENCE

## 53. Persist preferences

Persist:

```text
music enabled
music volume
```

---

## 54. Do not persist playback milliseconds

Do not store exact MP3 playback position.

Browser reload may return to the stable gameplay state without restoring music at the exact same second.

---

## 55. Persist one-shot gameplay audio flags

Persist where necessary:

```ts
interface CaseAudioFlags {
  timeWarningPlayed: boolean;
  finalCityCuePlayed: boolean;
}
```

This prevents reload-based repeated alerts.

---

# PART XX — GAMEPLAY MUST NOT WAIT FOR MUSIC

## 56. Critical rule

A full-length track never blocks the game.

The player can:

- read;
- click;
- investigate;
- travel;
- open dossiers;
- compute a warrant;

while music continues.

When the next musical event occurs:

```text
new track replaces old track
```

---

## 57. Audio does not determine mechanics

Never:

```text
travel finishes when MP3 finishes
```

Never:

```text
warrant result waits until track ends
```

Never:

```text
capture waits for reveal song to complete
```

Mechanics run independently.

---

# PART XXI — TESTS

## 58. File registry tests

Require:

```text
26 registered event tracks
26 unique IDs
26 canonical event MP3 paths
all files exist
```

---

## 59. Continuity tests

Test:

### Screen changes without new cue

```text
track A playing
→ screen changes
→ no new musical event
→ track A still playing
```

### New cue

```text
track A playing
→ event requests B
→ A stops immediately
→ B begins
```

### Same cue requested

```text
track A playing
→ A requested again
→ A does not restart
```

---

## 60. Event tests

At minimum:

```text
TITLE → 1
HQ → 2
new player lookup → 3 then 4
News Flash → 5
Assignment → 6
Travel → 7
correct city → 8
wrong trail reveal → 9
henchman → 10 instead of 8
high proximity → 11
time warning → 12 once
P.C. / warrant computer opened → 13
issued → 14
inconclusive → 15
final city → 16 once
wrong hideout → 17
ordinary reveal → 18
escape → 19
ordinary success → 20
promotion → 21
Deolane theme → 22
Deolane reveal → 23 instead of 18
Deolane capture → 24 instead of 20
Hall of Fame → 25
Dossiers opened → 27
```

---

# PART XXII — DEBUG AUDIO SCREEN

## 61. Development tool

Development builds may expose a soundtrack tester showing:

```text
ID
filename
duration
current playback time
gain
PLAY
STOP
```

Also show:

```text
CURRENT TRACK
```

This tool must not appear in production navigation.

---

# PART XXIII — OPTIONAL ANALYSIS SCRIPT

## 62. MP3 inspection

Create:

```text
scripts/analyze-audio.ts
```

Report:

```text
filename
duration
file size
bitrate
sample rate
channel count
```

This is particularly useful because the generated tracks have very different lengths and file sizes.

---

# PART XXIV — FUTURE SFX

## 63. Music is separate from sound effects

The 26 canonical event MP3s are soundtrack music.

Future effects should use:

```text
public/audio/sfx/
```

Examples:

- button click;
- keyboard/typewriter;
- computer beep;
- dossier paper;
- warrant stamp;
- printer;
- footsteps;
- handcuffs;
- siren;
- telex/telephone.

SFX may overlap with music.

Music tracks may not overlap with each other.

### 63.1 Clock tick

The canonical hourly clock SFX is:

```text
public/audio/sfx/clock_tick.mp3
```

Stable runtime ID:

```text
CLOCK_TICK
```

`TimeEngine` emits ordered hour-boundary data without depending on audio APIs. The presentation layer advances the visible clock one hour at a time and requests one `CLOCK_TICK` per displayed boundary, including sleep hours. Large advances must be presented sequentially; ticks must not be started simultaneously.

The runtime MP3 is gain-normalized from the supplied source so its short transient remains audible at the configured SFX volume; timing and duration are not extended.

### 63.2 Footsteps

The canonical movement SFX is `public/audio/sfx/footsteps.mp3`, with stable runtime ID `FOOTSTEPS`. The runtime copy is gain-normalized from the supplied source because the original recording's peak was approximately 0.08. The approach-to-location presentation lasts 2.2 seconds to match this recording; only after it ends may hour presentation and `CLOCK_TICK` begin, so the two SFX never overlap. The same sound also accompanies the staged successful-capture pursuit. It is a presentation-only SFX and never changes investigation or capture timing in the engine.

### 63.3 Mreaggle Software sting

The publisher opening uses the project-owner-supplied file `public/audio/sfx/mreaggle_software_sting.mp3`, with stable presentation ID `PUBLISHER_STING`. Playback begins before `TITLE`; at 800 ms the complete publisher logo replaces the mark-only image. The audio never loops. Its `ended` boundary starts a visibly interpolated complete-logo fade from opacity 1 to 0 over exactly 1 second. Once that fade completes, `TITLE_ENTERED` immediately starts `TITLE_THEME` without requiring a second user gesture.

If browser autoplay policy rejects the initial attempt, playback and visual timing wait for the first click or key. That successful gesture silently unlocks the soundtrack manager without starting ambient audio during the publisher sequence, so the title theme can begin automatically after the fade. The publisher sting is presentation-only and is not an engine event or music cue.

---

# PART XXV — ACCEPTANCE CHECKLIST

## 64. Release gate

- [ ] exactly 26 canonical event soundtrack tracks are registered;
- [ ] exact filenames match committed files;
- [ ] GitHub Pages case-sensitive paths work;
- [ ] music continues across screen transitions when no replacement cue occurs;
- [ ] screen component destruction does not stop music;
- [ ] next valid music cue replaces current track;
- [ ] same cue does not restart itself;
- [ ] tracks never form a playback queue;
- [ ] music never blocks gameplay;
- [ ] all loops are disabled;
- [ ] time warning plays at most once per case;
- [ ] final-city cue plays at most once per case;
- [ ] final Deolane reveal replaces generic culprit reveal;
- [ ] final Deolane capture replaces ordinary case-closed track;
- [ ] Hall of Fame replaces final capture music when its screen begins;
- [ ] opening Dossiês immediately requests track 27 without restarting it while paging;
- [ ] `Gold of Deolane.mp3` is not registered;
- [ ] `22_deolane_leitmotif.old` is not shipped;
- [ ] user mute/volume settings work;
- [ ] autoplay restrictions fail gracefully.

---

# PART XXVI — FINAL CONTRACT

## 65. Short rule

The soundtrack behaves like:

```text
EVENT A
→ MUSIC A STARTS

UI keeps moving
→ MUSIC A KEEPS PLAYING

EVENT B
→ MUSIC A STOPS
→ MUSIC B STARTS

no EVENT B
→ MUSIC A FINISHES NATURALLY
→ SILENCE
```

Not:

```text
screen closes
→ music is arbitrarily chopped
```

The final Suno generations are allowed to breathe as full musical pieces.

The soundtrack follows the **chronology of meaningful game events**, not the lifetime of individual Svelte components.

**`SOUND_MANIFEST.md` is the source of truth for soundtrack structure, playback continuity and runtime audio references in Deolane San Paolo.**
