import { derived, get, writable } from 'svelte/store';
import { content } from '../content';
import { createProfile, initialState } from '../engine/CaseEngine';
import { GameEngine } from '../engine/GameEngine';
import type { GameEvent, GameState, WarrantInput } from '../engine/types';
import { BrowserStorageAdapter, SaveRepository } from '../persistence/SaveRepository';

export type UiScreen =
  | 'title' | 'signin' | 'new-player' | 'news' | 'assignment' | 'city' | 'places' | 'witness'
  | 'routes' | 'travel' | 'traveling' | 'dossiers' | 'warrant' | 'result' | 'promotion' | 'hall-of-fame' | 'credits';

export interface UiState {
  screen: UiScreen;
  event?: GameEvent;
  selectedDossierIndex: number;
  message?: string;
  timeAdvancing?: boolean;
  displayedElapsedHours?: number;
  hourTickSerial?: number;
}

const repository = typeof window !== 'undefined' ? new SaveRepository(new BrowserStorageAdapter()) : undefined;
const saved = repository?.load();
let engine = saved ? new GameEngine(saved) : undefined;

export const gameState = writable<GameState | undefined>(saved);
export const uiState = writable<UiState>({ screen: 'title', selectedDossierIndex: 0 });
export const hasSave = derived(gameState, ($state) => Boolean($state));

const sync = (event: GameEvent, screen?: UiScreen): void => {
  const state = engine!.state as GameState;
  gameState.set(state);
  repository?.save(state);
  uiState.update((ui) => ({ ...ui, ...(screen ? { screen } : {}), event }));
};

const HOUR_PRESENTATION_MS = 180;
let timePresentationToken = 0;

const syncTimed = (result: ReturnType<GameEngine['investigate']>, interimScreen: UiScreen, finalScreen: UiScreen, minimumDuration = 0): void => {
  const state = engine!.state as GameState;
  gameState.set(state);
  repository?.save(state);
  const advance = result.timeAdvance;
  if (!advance?.hourBoundaries.length) {
    uiState.update((ui) => ({ ...ui, screen: finalScreen, event: result.event, timeAdvancing: false }));
    return;
  }

  const token = ++timePresentationToken;
  uiState.update((ui) => {
    const next = {
      ...ui,
      screen: interimScreen,
      timeAdvancing: true,
      displayedElapsedHours: advance.fromElapsedHours
    };
    delete next.event;
    return next;
  });
  advance.hourBoundaries.forEach((boundary, index) => {
    window.setTimeout(() => {
      if (token !== timePresentationToken) return;
      uiState.update((ui) => ({
        ...ui,
        displayedElapsedHours: boundary.elapsedHours,
        hourTickSerial: (ui.hourTickSerial ?? 0) + 1
      }));
    }, (index + 1) * HOUR_PRESENTATION_MS);
  });
  window.setTimeout(() => {
    if (token !== timePresentationToken) return;
    uiState.update((ui) => {
      const next = { ...ui, screen: finalScreen, event: result.event, timeAdvancing: false };
      delete next.displayedElapsedHours;
      return next;
    });
  }, Math.max(advance.hourBoundaries.length * HOUR_PRESENTATION_MS, minimumDuration));
};

const seed = (): string => {
  const requested = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('caseSeed');
  if (import.meta.env.DEV && requested) return requested;
  const values = new Uint32Array(2);
  crypto.getRandomValues(values);
  return `${values[0]!.toString(16)}${values[1]!.toString(16)}`;
};

export const actions = {
  newGame(): void { uiState.set({ screen: 'signin', selectedDossierIndex: 0 }); },
  continueGame(): void {
    const state = get(gameState);
    if (!state) return actions.newGame();
    if (state.profile.hallOfFame) uiState.update((ui) => ({ ...ui, screen: 'hall-of-fame' }));
    else if (state.activeCase?.runtime.status === 'ACTIVE') uiState.update((ui) => ({ ...ui, screen: 'city' }));
    else actions.prepareCase();
  },
  createProfile(name: string): void {
    const state = initialState(createProfile(name));
    engine = new GameEngine(state);
    gameState.set(state);
    repository?.save(state);
    uiState.set({ screen: 'new-player', selectedDossierIndex: 0 });
  },
  prepareCase(): void {
    if (!engine) return;
    const result = engine.startCase(seed());
    sync(result.event, 'news');
  },
  go(screen: UiScreen, clearEvent = false): void {
    uiState.update((ui) => {
      if (!clearEvent) return { ...ui, screen };
      const next = { ...ui, screen };
      delete next.event;
      return next;
    });
  },
  investigate(placeId: string): void {
    if (!engine) return;
    const result = engine.investigate(placeId);
    const screen = result.event.type === 'CASE_SOLVED' || result.event.type === 'CASE_FAILED' ? 'result' : 'witness';
    syncTimed(result, 'places', screen);
  },
  travel(cityId: string): void {
    if (!engine) return;
    const result = engine.travel(cityId);
    syncTimed(result, 'traveling', result.event.type === 'CASE_FAILED' ? 'result' : 'city', 3_400);
  },
  warrant(input: WarrantInput): void {
    if (!engine) return;
    const result = engine.computeWarrant(input);
    syncTimed(result, 'warrant', result.event.type === 'CASE_FAILED' ? 'result' : 'warrant');
  },
  abandon(): void {
    if (!engine) return;
    const result = engine.abandonCase();
    sync(result.event, 'result');
  },
  afterResult(): void {
    const ui = get(uiState);
    if (ui.event?.type !== 'CASE_SOLVED') return;
    if (ui.event?.type === 'CASE_SOLVED' && ui.event.promoted) uiState.update((value) => ({ ...value, screen: 'promotion' }));
    else if (get(gameState)?.profile.hallOfFame) uiState.update((value) => ({ ...value, screen: 'hall-of-fame' }));
    else actions.prepareCase();
  },
  retry(): void {
    if (!engine) return;
    const result = engine.retryCase(seed());
    sync(result.event, 'news');
  },
  declineRetry(): void {
    if (!engine) return;
    const result = engine.returnToHeadquarters();
    sync(result.event, 'title');
  },
  dossier(index: number): void { uiState.update((ui) => ({ ...ui, screen: 'dossiers', selectedDossierIndex: index })); },
  markAudioFlag(flag: 'timeWarningPlayed' | 'finalCityPlayed'): void {
    if (!engine) return;
    engine.markAudioFlag(flag);
    const state = engine.state as GameState;
    gameState.set(state);
    repository?.save(state);
  },
  reset(): void {
    timePresentationToken += 1;
    repository?.clear();
    engine = undefined;
    gameState.set(undefined);
    uiState.set({ screen: 'title', selectedDossierIndex: 0 });
  },
  currentCityDefinition() { return engine?.getCurrentCityDefinition(); },
  content
};
