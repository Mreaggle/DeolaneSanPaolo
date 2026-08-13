import { describe, expect, it } from 'vitest';
import { content } from '../../src/content';
import { createProfile, initialState } from '../../src/engine/CaseEngine';
import { GameEngine } from '../../src/engine/GameEngine';
import { advanceTime, displayCaseTime, investigationCost, isSleeping } from '../../src/engine/TimeEngine';
import { matchSuspects } from '../../src/engine/WarrantEngine';

describe('regras centrais', () => {
  it('cobra 2h, 3h e 4h e apresenta o relógio desde segunda às 07:00', () => {
    expect([0, 1, 2, 3].map(investigationCost)).toEqual([2, 3, 4, 4]);
    expect(displayCaseTime(0)).toContain('07:00');
    expect(displayCaseTime(154)).toContain('Domingo, 17:00');
  });

  it('interrompe ações pelo sono obrigatório e detecta deadline hora a hora', () => {
    expect(advanceTime(15, 1)).toMatchObject({ elapsedHours: 16, expired: false });
    const overnight = advanceTime(16, 4);
    expect(overnight).toMatchObject({ elapsedHours: 29, expired: false });
    expect(displayCaseTime(overnight.elapsedHours)).toContain('Terça, 12:00');
    expect(overnight.hourBoundaries).toHaveLength(13);
    expect(overnight.hourBoundaries.filter((event) => event.phase === 'SLEEP')).toHaveLength(9);
    expect(isSleeping(17)).toBe(true);
    expect(isSleeping(25)).toBe(true);
    expect(isSleeping(26)).toBe(false);
    expect(() => advanceTime(17, 1)).toThrow('CHARACTER_SLEEPING');

    const deadlineDuringSleep = advanceTime(16, 4, 20);
    expect(deadlineDuringSleep).toMatchObject({ elapsedHours: 20, expired: true });
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

  it('só sinaliza o capanga ao investigar a penúltima pista correta', () => {
    const engine = new GameEngine(initialState(createProfile('Lia')));
    engine.startCase('capanga-corredor');
    const route = engine.state.activeCase!.definition.route;
    for (const destination of route.slice(1, -1)) {
      const arrival = engine.travel(destination).event;
      expect(arrival.type).toBe('ARRIVED');
      expect(arrival).not.toHaveProperty('henchmanAppeared');
    }
    const hotPlaces = engine.getCurrentCityDefinition().places;
    const investigation = engine.investigate(hotPlaces[0]!.placeId).event;
    expect(investigation).toMatchObject({ type: 'INVESTIGATION_COMPLETED', henchmanAppeared: true, henchmanVariant: 'run' });
    expect(engine.investigate(hotPlaces[1]!.placeId).event)
      .toMatchObject({ type: 'INVESTIGATION_COMPLETED', henchmanAppeared: true, henchmanVariant: 'sneak' });
    expect(engine.investigate(hotPlaces[2]!.placeId).event)
      .toMatchObject({ type: 'INVESTIGATION_COMPLETED', henchmanAppeared: false });

    const coldEngine = new GameEngine(initialState(createProfile('Lia')));
    coldEngine.startCase('capanga-frio');
    const definition = coldEngine.state.activeCase!.definition;
    const start = coldEngine.getCurrentCityDefinition();
    const wrong = start.travelCandidates.find((cityId) => cityId !== definition.route[1])!;
    coldEngine.travel(wrong);
    expect(coldEngine.investigate(coldEngine.getCurrentCityDefinition().places[0]!.placeId).event)
      .toMatchObject({ type: 'INVESTIGATION_COMPLETED', henchmanAppeared: false });
  });

  it('falha sem saltar o deadline e impede ações durante o sono', () => {
    const engine = new GameEngine(initialState(createProfile('Lia')));
    engine.startCase('prazo-hora-a-hora');
    const nearDeadline = structuredClone(engine.state);
    nearDeadline.activeCase!.runtime.elapsedHours = 153;
    engine.replaceState(nearDeadline);
    expect(engine.investigate(engine.getCurrentCityDefinition().places[0]!.placeId).event)
      .toMatchObject({ type: 'CASE_FAILED', status: 'FAILED_TIME' });
    expect(engine.state.activeCase!.runtime.elapsedHours).toBe(154);

    const sleeping = structuredClone(nearDeadline);
    sleeping.activeCase!.runtime.elapsedHours = 17;
    sleeping.activeCase!.runtime.status = 'ACTIVE';
    engine.replaceState(sleeping);
    expect(() => engine.investigate(engine.getCurrentCityDefinition().places[0]!.placeId)).toThrow('CHARACTER_SLEEPING');
  });

  it('retry preserva carreira e limpa o caso; não retorna ao menu sem apagar progresso', () => {
    const profile = { ...createProfile('Lia'), solvedCases: 5 };
    const retryEngine = new GameEngine(initialState(profile));
    retryEngine.startCase('caso-perdido');
    retryEngine.abandonCase();
    const careerAfterFailure = structuredClone(retryEngine.state.profile);
    retryEngine.retryCase('caso-retry');
    expect(retryEngine.state.profile).toEqual(careerAfterFailure);
    expect(retryEngine.state.activeCase?.runtime).toMatchObject({ status: 'ACTIVE', elapsedHours: 2, visitedLocationKeys: [] });

    retryEngine.abandonCase();
    const careerBeforeNo = structuredClone(retryEngine.state.profile);
    retryEngine.returnToHeadquarters();
    expect(retryEngine.state.profile).toEqual(careerBeforeNo);
    expect(retryEngine.state.activeCase).toBeUndefined();
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
