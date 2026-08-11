import { content, suspects, traitValueLabels, type GameContent } from '../content';
import { generateCase } from '../generation/CaseGenerator';
import { SeededRng } from '../generation/rng/SeededRng';
import { resolveInvestigation } from './InvestigationEngine';
import { applySolvedCase } from './ProgressionEngine';
import { classifyDestination } from './RouteEngine';
import { advanceTime } from './TimeEngine';
import { travelHours } from './TravelEngine';
import { matchSuspects } from './WarrantEngine';
import type {
  ActiveCase, CaseRuntimeState, EngineResult, GameState, GeneratedCityDefinition,
  WrongCityDefinition, WarrantInput
} from './types';

const clone = <T>(value: T): T => structuredClone(value);

export class GameEngine {
  private stateValue: GameState;

  constructor(initialState: GameState, private readonly gameContent: GameContent = content) {
    this.stateValue = clone(initialState);
  }

  get state(): Readonly<GameState> {
    return this.stateValue;
  }

  private requireCase(): ActiveCase {
    const active = this.stateValue.activeCase;
    if (!active || active.runtime.status !== 'ACTIVE') throw new Error('CASE_NOT_ACTIVE');
    return active;
  }

  private commit(next: GameState): void {
    this.stateValue = next;
  }

  startCase(seed: string): EngineResult {
    const definition = generateCase(this.stateValue.profile, seed, this.gameContent);
    const runtime: CaseRuntimeState = {
      status: 'ACTIVE',
      currentCityId: definition.route[0]!,
      furthestRouteIndex: 0,
      trailAnchorCityId: definition.route[0]!,
      elapsedHours: 0,
      investigationsThisVisit: 0,
      visitedLocationKeys: [],
      discoveredClueIds: [],
      wrongCities: {}
    };
    const next = { ...clone(this.stateValue), activeCase: { definition, runtime } };
    this.commit(next);
    return { state: this.state, event: { type: 'CASE_STARTED' } };
  }

  private makeColdCity(cityId: string, anchorCityId: string, oldTrail = false): WrongCityDefinition {
    const seed = `${this.requireCase().definition.seed}:cold:${anchorCityId}:${cityId}`;
    const rng = new SeededRng(seed);
    const city = this.gameContent.cities.find((candidate) => candidate.id === cityId)!;
    const selectedPlaces = rng.shuffle(city.allowedPlaceIds).slice(0, 3);
    const normalDestinations = this.gameContent.connections
      .filter((edge) => edge.fromCityId === cityId)
      .map((edge) => edge.toCityId);
    const destinations = rng.shuffle(Array.from(new Set([anchorCityId, ...normalDestinations]))).slice(0, 5);
    if (!destinations.includes(anchorCityId)) destinations[destinations.length - 1] = anchorCityId;
    return {
      cityId,
      anchorCityId,
      travelCandidates: destinations,
      places: selectedPlaces.map((placeId, index) => {
        const place = this.gameContent.places.find((candidate) => candidate.id === placeId)!;
        return {
          placeId,
          witnessId: rng.pick(place.witnesses).id,
          clue: {
            id: `${seed}:${index}`,
            family: oldTrail ? 'old-trail' : 'negative',
            text: oldTrail
              ? 'A T.C.C. passou por aqui antes, mas essa pista já esfriou.'
              : ['Ninguém com essa descrição passou por aqui.', 'A T.C.C. não deixou sinal nesta cidade.', 'Essa pista esfriou. Eu revisaria o último paradeiro confirmado.'][index]!
          }
        };
      })
    };
  }

  getCurrentCityDefinition(): GeneratedCityDefinition {
    const active = this.requireCase();
    const { definition, runtime } = active;
    if (runtime.currentCityId === runtime.trailAnchorCityId) return definition.cities[runtime.currentCityId]!;
    const key = `${runtime.trailAnchorCityId}:${runtime.currentCityId}`;
    let cold = runtime.wrongCities[key];
    if (!cold) {
      const index = definition.route.indexOf(runtime.currentCityId);
      cold = this.makeColdCity(runtime.currentCityId, runtime.trailAnchorCityId, index >= 0 && index < runtime.furthestRouteIndex);
      runtime.wrongCities[key] = cold;
    }
    return cold;
  }

  investigate(placeId: string): EngineResult {
    const city = this.getCurrentCityDefinition();
    const next = clone(this.stateValue);
    const active = next.activeCase!;
    const result = resolveInvestigation(active.definition, active.runtime, city, placeId);
    if (!result.reviewed) {
      const time = advanceTime(active.runtime.elapsedHours, result.timeCost);
      active.runtime.elapsedHours = time.elapsedHours;
      active.runtime.visitedLocationKeys.push(result.key);
      active.runtime.investigationsThisVisit += 1;
      if (time.expired) return this.fail(next, 'FAILED_TIME');
      active.runtime.discoveredClueIds.push(result.place.clue.id);
    }
    if (result.finalEncounter && !result.reviewed) {
      const warrant = active.runtime.activeWarrantSuspectId;
      if (!warrant) return this.fail(next, 'FAILED_NO_WARRANT');
      if (warrant !== active.definition.culpritId) return this.fail(next, 'FAILED_WRONG_WARRANT');
      active.runtime.status = 'SOLVED';
      const progress = applySolvedCase(next.profile, active.definition.culpritId, active.definition.route[0]!, active.definition.stolenItemId);
      next.profile = progress.profile;
      this.commit(next);
      return { state: this.state, event: { type: 'CASE_SOLVED', promoted: progress.promoted } };
    }
    this.commit(next);
    return {
      state: this.state,
      event: { type: 'INVESTIGATION_COMPLETED', clue: result.place.clue, reviewed: result.reviewed, finalEncounter: false }
    };
  }

  travel(cityId: string): EngineResult {
    this.requireCase();
    const currentDefinition = this.getCurrentCityDefinition();
    if (!currentDefinition.travelCandidates.includes(cityId)) throw new Error('INVALID_DESTINATION');
    const next = clone(this.stateValue);
    const active = next.activeCase!;
    const hours = travelHours(this.gameContent, active.runtime.currentCityId, cityId, active.runtime.trailAnchorCityId);
    const time = advanceTime(active.runtime.elapsedHours, hours);
    active.runtime.elapsedHours = time.elapsedHours;
    active.runtime.investigationsThisVisit = 0;
    if (time.expired) return this.fail(next, 'FAILED_TIME');
    const classification = classifyDestination(active.definition, active.runtime, cityId);
    active.runtime.currentCityId = cityId;
    if (classification === 'CORRECT_FORWARD' || classification === 'FINAL_CITY') {
      active.runtime.furthestRouteIndex += 1;
      active.runtime.trailAnchorCityId = cityId;
    }
    this.commit(next);
    return { state: this.state, event: { type: 'ARRIVED', classification, cityId } };
  }

  computeWarrant(input: WarrantInput): EngineResult {
    const next = clone(this.stateValue);
    const active = next.activeCase!;
    delete active.runtime.activeWarrantSuspectId;
    const time = advanceTime(active.runtime.elapsedHours, 2);
    active.runtime.elapsedHours = time.elapsedHours;
    if (time.expired) return this.fail(next, 'FAILED_TIME');
    const matches = matchSuspects(this.gameContent.suspects, input);
    if (matches.length === 1) {
      active.runtime.activeWarrantSuspectId = matches[0]!;
      this.commit(next);
      return { state: this.state, event: { type: 'WARRANT_ISSUED', suspectId: matches[0]! } };
    }
    this.commit(next);
    return matches.length === 0
      ? { state: this.state, event: { type: 'WARRANT_NO_MATCH' } }
      : { state: this.state, event: { type: 'WARRANT_MULTIPLE_MATCHES', suspectIds: matches } };
  }

  abandonCase(): EngineResult {
    return this.fail(clone(this.stateValue), 'ABANDONED');
  }

  private fail(next: GameState, status: 'FAILED_TIME' | 'FAILED_NO_WARRANT' | 'FAILED_WRONG_WARRANT' | 'ABANDONED'): EngineResult {
    const active = next.activeCase!;
    active.runtime.status = status;
    next.profile.failedCases += 1;
    next.profile.recentCulpritIds = [active.definition.culpritId, ...next.profile.recentCulpritIds].slice(0, 3);
    next.profile.recentStartCityIds = [active.definition.route[0]!, ...next.profile.recentStartCityIds].slice(0, 3);
    next.profile.recentStolenItemIds = [active.definition.stolenItemId, ...next.profile.recentStolenItemIds].slice(0, 3);
    this.commit(next);
    return { state: this.state, event: { type: 'CASE_FAILED', status } };
  }

  replaceState(state: GameState): void {
    this.stateValue = clone(state);
  }
}

export const culpritDisplayName = (id: string): string => suspects.find((suspect) => suspect.id === id)?.name ?? id;
export const traitDisplayName = (value: string): string => traitValueLabels[value] ?? value;
