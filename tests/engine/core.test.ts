import { describe, expect, it } from 'vitest';
import { content } from '../../src/content';
import { createProfile, initialState } from '../../src/engine/CaseEngine';
import { GameEngine } from '../../src/engine/GameEngine';
import { advanceTime, displayCaseTime, investigationCost } from '../../src/engine/TimeEngine';
import { matchSuspects } from '../../src/engine/WarrantEngine';

describe('regras centrais', () => {
  it('cobra 2h, 3h e 4h e falha exatamente no prazo', () => {
    expect([0, 1, 2, 3].map(investigationCost)).toEqual([2, 3, 4, 4]);
    expect(advanceTime(117, 2)).toEqual({ elapsedHours: 119, expired: false });
    expect(advanceTime(118, 2)).toEqual({ elapsedHours: 120, expired: true });
    expect(displayCaseTime(0)).toContain('09:00');
  });

  it('só emite mandado com identificação única', () => {
    expect(matchSuspects(content.suspects, {})).toHaveLength(10);
    expect(matchSuspects(content.suspects, content.suspects[0]!.traits)).toEqual(['deolane-san-paolo']);
  });

  it('permite resolver um caso pelo motor sem DOM', () => {
    const engine = new GameEngine(initialState(createProfile('Lia')));
    engine.startCase('happy-route');
    const definition = engine.state.activeCase!.definition;
    for (let index = 0; index < definition.route.length - 1; index += 1) {
      const city = engine.getCurrentCityDefinition();
      for (const place of city.places) engine.investigate(place.placeId);
      const result = engine.travel(definition.route[index + 1]!);
      expect(result.event.type).toBe('ARRIVED');
    }
    const culprit = content.suspects.find((suspect) => suspect.id === definition.culpritId)!;
    expect(engine.computeWarrant(culprit.traits).event).toEqual({ type: 'WARRANT_ISSUED', suspectId: culprit.id });
    const solved = engine.investigate(definition.finalHideoutPlaceId);
    expect(solved.event.type).toBe('CASE_SOLVED');
    expect(engine.state.profile.solvedCases).toBe(1);
  });

  it('mantém a âncora ao viajar para uma cidade errada e permite retorno', () => {
    const engine = new GameEngine(initialState(createProfile('Lia')));
    engine.startCase('wrong-route');
    const original = engine.state.activeCase!.runtime.trailAnchorCityId;
    const city = engine.getCurrentCityDefinition();
    const correct = engine.state.activeCase!.definition.route[1]!;
    const wrong = city.travelCandidates.find((id) => id !== correct)!;
    expect(engine.travel(wrong).event).toMatchObject({ type: 'ARRIVED', classification: 'WRONG_CITY' });
    expect(engine.state.activeCase!.runtime.trailAnchorCityId).toBe(original);
    const cold = engine.getCurrentCityDefinition();
    expect(cold.travelCandidates).toContain(original);
    expect(engine.travel(original).event).toMatchObject({ classification: 'TRAIL_ANCHOR' });
  });

  it('encerra a carreira ao capturar Deolane no décimo quarto caso', () => {
    const profile = { ...createProfile('Lia'), solvedCases: 13 };
    const engine = new GameEngine(initialState(profile));
    engine.startCase('deolane-final');
    const definition = engine.state.activeCase!.definition;
    expect(definition.culpritId).toBe('deolane-san-paolo');
    for (const destination of definition.route.slice(1)) engine.travel(destination);
    const deolane = content.suspects.find((suspect) => suspect.id === 'deolane-san-paolo')!;
    engine.computeWarrant(deolane.traits);
    expect(engine.investigate(definition.finalHideoutPlaceId).event.type).toBe('CASE_SOLVED');
    expect(engine.state.profile).toMatchObject({ solvedCases: 14, deolaneCaptured: true, hallOfFame: true });
  });
});
