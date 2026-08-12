import { expect, test } from '@playwright/test';
import { content, traitLabels } from '../../src/content';
import { createProfile } from '../../src/engine/CaseEngine';
import { generateCase } from '../../src/generation/CaseGenerator';
import type { TraitCategory } from '../../src/content';

const enterFirstCase = async (page: import('@playwright/test').Page, url = './') => {
  await page.goto(url);
  await page.getByRole('button', { name: 'NOVO JOGO' }).click();
  await page.getByLabel('NOME').fill('Detetive Bia');
  await page.getByRole('button', { name: 'TRANSMITIR' }).click();
  await expect(page.getByText(/NUNCA VI VOCÊ POR AQUI/)).toBeVisible();
  await page.getByRole('button', { name: 'AGUARDAR BOLETIM' }).click();
  await expect(page.getByText('PLANTÃO FEDERAL')).toBeVisible();
  await page.getByRole('button', { name: 'RECEBER MISSÃO' }).click();
  await page.getByRole('button', { name: 'INICIAR INVESTIGAÇÃO' }).click();
};

const expectAudioCue = async (page: import('@playwright/test').Page, cue: string) => {
  await expect(page.locator('.game-stage')).toHaveAttribute('data-audio-cue', cue);
};

test('abre o prólogo e entra no primeiro caso', async ({ page }, testInfo) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Where is Deolane San Paolo?' })).toBeVisible();
  await expect(page.getByAltText('Where is Deolane San Paolo?')).toHaveAttribute('src', /deolane-retro\.png$/);
  await expect(page.getByAltText('Brasão da Agência Federal')).toHaveAttribute('src', /agency-emblem\.png$/);
  await enterFirstCase(page);
  await expect(page.getByRole('navigation', { name: 'Ações de investigação' })).toBeVisible();
  await expect(page.getByText('AGÊNCIA FEDERAL', { exact: true })).toBeVisible();
  await expect(page.locator('.scene > img')).toBeVisible();
  await expect(page.locator('.city-brief')).toBeVisible();
  await expect(page.locator('.city-brief li')).toHaveCount(0);
  await expect(page.locator('.site-credit')).toHaveText('Developed & Powered-By @Mreaggle');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: '@Mreaggle' })).toHaveAttribute('href', 'https://instagram.com/mreaggle');
  await page.getByRole('button', { name: 'DOSSIÊS' }).click();
  await expect(page.getByText(/ARQUIVO T\.C\.C\./)).toBeVisible();
  await expectAudioCue(page, 'DOSSIERS');
  await page.getByRole('button', { name: '▶' }).click();
  await expectAudioCue(page, 'DOSSIERS');
  await page.screenshot({ path: `test-results/gameplay-${testInfo.project.name}.png` });
});

test('informa o prazo completo na ordem de serviço', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'NOVO JOGO' }).click();
  await page.getByLabel('NOME').fill('Detetive Bia');
  await page.getByRole('button', { name: 'TRANSMITIR' }).click();
  await page.getByRole('button', { name: 'AGUARDAR BOLETIM' }).click();
  await page.getByRole('button', { name: 'RECEBER MISSÃO' }).click();

  await expect(page.getByText(/PRAZO: SÁBADO, 09:00 \(120 HORAS\)/)).toBeVisible();
});

test('abre locais, testemunha, mandado e destinos sem revelar a rota', async ({ page }) => {
  await enterFirstCase(page);
  await page.getByRole('button', { name: /VER/ }).click();
  await expect(page.locator('.route-list li')).toHaveCount(3);
  await expect(page.locator('.route-list button')).toHaveCount(0);
  await page.getByRole('button', { name: /BUSCAR/ }).click();
  const places = page.locator('.place-list button');
  await expect(places).toHaveCount(3);
  await places.first().click();
  await expect(page.getByRole('button', { name: 'OUTRO LOCAL' })).toBeVisible();
  await expect(page.locator('.witness')).toBeVisible();
  await expect(page.getByRole('button', { name: /P\.C/ })).toBeDisabled();
  await page.locator('.speech .typewriter').click();
  await expect(page.getByRole('button', { name: /P\.C/ })).toBeEnabled();
  await expect(page.getByRole('button', { name: /PARTIR/ })).toBeEnabled();
  await expect(page.getByRole('button', { name: /VER/ })).toBeEnabled();
  await page.getByRole('button', { name: /P\.C/ }).click();
  await expect(page.getByText('COMPUTADOR DE MANDADOS')).toBeVisible();
  await expectAudioCue(page, 'CRIME_COMPUTER_CALCULATING');
  const panelBox = await page.locator('.info-panel').boundingBox();
  const computerBox = await page.locator('.warrant-machine').boundingBox();
  const firstFilterBox = await page.locator('.warrant-grid select').first().boundingBox();
  expect(panelBox).not.toBeNull();
  expect(computerBox).not.toBeNull();
  expect(firstFilterBox).not.toBeNull();
  expect(Math.abs(computerBox!.x - panelBox!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(computerBox!.y - panelBox!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(computerBox!.width - panelBox!.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(computerBox!.height - panelBox!.height)).toBeLessThanOrEqual(1);
  expect(firstFilterBox!.x).toBeGreaterThan(computerBox!.x);
  expect(firstFilterBox!.y).toBeGreaterThan(computerBox!.y);
  expect(firstFilterBox!.x + firstFilterBox!.width).toBeLessThan(computerBox!.x + computerBox!.width);
  expect(firstFilterBox!.y + firstFilterBox!.height).toBeLessThan(computerBox!.y + computerBox!.height);
  await expect(page.getByRole('button', { name: /P\.C/ }).locator('img')).toHaveAttribute('src', /icon-pc\.png/);
  await page.locator('.warrant-grid select').first().selectOption({ index: 1 });
  await expectAudioCue(page, 'CRIME_COMPUTER_CALCULATING');
  await page.getByRole('button', { name: 'COMPUTAR MANDADO' }).click();
  await expectAudioCue(page, 'WARRANT_INCONCLUSIVE');
  await expect(page.getByRole('button', { name: /VER/ })).toBeEnabled();
  await expect(page.getByRole('button', { name: /PARTIR/ })).toBeEnabled();
  await expect(page.getByRole('button', { name: /BUSCAR/ })).toBeEnabled();
  await page.getByRole('button', { name: /PARTIR/ }).click();
  await expect(page.locator('.destination-list button')).toHaveCount(3);
  await expect(page.getByText(/CORRECT|CERTO|RECOMENDAD/)).toHaveCount(0);
  const markerLeft = await page.locator('.map-box i').first().evaluate((marker) => parseFloat((marker as HTMLElement).style.left));
  const mapFit = await page.locator('.map-box img').evaluate((map) => getComputedStyle(map).objectFit);
  expect(markerLeft).toBeGreaterThan(10);
  expect(mapFit).toBe('fill');
  await page.locator('.destination-list button').first().click();
  await expect(page.getByText('EM TRÂNSITO')).toBeVisible();
  await expect(page.locator('.city-brief')).toBeVisible({ timeout: 5_000 });
});

test('marca local visitado e permite reler a mesma pista sem custo', async ({ page }) => {
  await enterFirstCase(page);
  await page.getByRole('button', { name: /BUSCAR/ }).click();
  const firstPlace = page.locator('.place-list button').first();
  await firstPlace.click();

  const testimony = page.locator('.speech .typewriter');
  await testimony.click();
  const clue = await testimony.textContent();
  const timeAfterInvestigation = await page.locator('.city-header time').textContent();

  await testimony.click();
  await expect(firstPlace).toHaveClass(/visited/);
  await expect(firstPlace).toContainText('VISITADO');
  await firstPlace.click();
  await page.locator('.speech .typewriter').click();

  await expect(page.locator('.speech .typewriter')).toHaveText(clue ?? '');
  await expect(page.locator('.city-header time')).toHaveText(timeAfterInvestigation ?? '');
});

test('mantém uma única superfície 640×400 escalada para o visor', async ({ page }, testInfo) => {
  await page.goto('./');
  const stage = page.locator('.game-stage');
  const box = await stage.boundingBox();
  const fontFamily = await stage.evaluate((element) => getComputedStyle(element).fontFamily);
  expect(fontFamily).toContain('AtlasBitmap');
  expect(box).not.toBeNull();
  if (testInfo.project.name === 'desktop') {
    expect(box!.width).toBeGreaterThanOrEqual(1280);
    expect(box!.height).toBeGreaterThanOrEqual(800);
  } else {
    expect(box!.width).toBeLessThanOrEqual(844);
    expect(box!.height).toBeLessThanOrEqual(390);
  }
});

test('bloqueia o menu de contexto do botão direito', async ({ page }) => {
  await page.goto('./');
  const contextMenuPrevented = await page.locator('.app-shell').evaluate((element) => {
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(contextMenuPrevented).toBe(true);
});

test('bloqueia atalhos de inspeção e seleção de texto', async ({ page }) => {
  await page.goto('./');
  const blocked = await page.evaluate(() => {
    const f12 = new KeyboardEvent('keydown', { key: 'F12', bubbles: true, cancelable: true });
    const inspect = new KeyboardEvent('keydown', { key: 'I', ctrlKey: true, shiftKey: true, bubbles: true, cancelable: true });
    const selection = new Event('selectstart', { bubbles: true, cancelable: true });
    window.dispatchEvent(f12);
    window.dispatchEvent(inspect);
    document.querySelector('.game-stage')?.dispatchEvent(selection);
    return { f12: f12.defaultPrevented, inspect: inspect.defaultPrevented, selection: selection.defaultPrevented };
  });
  expect(blocked).toEqual({ f12: true, inspect: true, selection: true });
  await expect(page.locator('.game-stage')).toHaveCSS('user-select', 'none');
});

test('cadencia textos automáticos e respeita cada entrada do nome', async ({ page }) => {
  await page.addInitScript(() => {
    const plays: { typewriter: number[]; mouse: number[] } = { typewriter: [], mouse: [] };
    Object.defineProperty(window, '__uiSoundPlays', { value: plays });
    HTMLMediaElement.prototype.play = function () {
      if (this.src.endsWith('/typewriter.mp3')) plays.typewriter.push(performance.now());
      if (this.src.endsWith('/mouse_click.mp3')) plays.mouse.push(performance.now());
      return Promise.resolve();
    };
  });
  const soundPlays = () => page.evaluate(() => (window as typeof window & { __uiSoundPlays: { typewriter: number[]; mouse: number[] } }).__uiSoundPlays);
  const clearTypewriter = () => page.evaluate(() => {
    (window as typeof window & { __uiSoundPlays: { typewriter: number[]; mouse: number[] } }).__uiSoundPlays.typewriter.length = 0;
  });

  await page.goto('./');
  await page.getByRole('button', { name: 'NOVO JOGO' }).click();
  await page.waitForTimeout(650);
  const automatic = (await soundPlays()).typewriter;
  expect(automatic.length).toBeGreaterThanOrEqual(4);
  expect(automatic.length).toBeLessThanOrEqual(6);
  expect(automatic.slice(1).every((time, index) => time - automatic[index]! >= 110)).toBe(true);

  await page.locator('.typewriter').click();
  await clearTypewriter();
  await page.getByLabel('NOME').pressSequentially('Bia ');
  expect((await soundPlays()).typewriter).toHaveLength(4);
  expect((await soundPlays()).mouse.length).toBeGreaterThanOrEqual(2);
});

test('usa cursores de mouse solto e pressionado somente no PC', async ({ page }, testInfo) => {
  await page.goto('./');
  const shell = page.locator('.app-shell');
  const button = page.getByRole('button', { name: 'NOVO JOGO' });
  const shellCursor = () => shell.evaluate((element) => getComputedStyle(element).cursor);
  const buttonCursor = () => button.evaluate((element) => getComputedStyle(element).cursor);

  if (testInfo.project.name === 'desktop') {
    await expect.poll(buttonCursor).toContain('mouse-up.png');
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await expect.poll(buttonCursor).toContain('mouse-down.png');
    await page.mouse.move(1, 1);
    await page.mouse.up();
    await expect.poll(buttonCursor).toContain('mouse-up.png');
  } else {
    expect(await shellCursor()).not.toContain('mouse-up.png');
    expect(await buttonCursor()).not.toContain('mouse-up.png');
  }
});

test('percorre um caso funcional e mantém as novas animações legíveis', async ({ page }) => {
  test.setTimeout(70_000);
  const seed = 'animation-demo';
  const definition = generateCase(createProfile('Detetive Bia'), seed, content);
  const culprit = content.suspects.find((suspect) => suspect.id === definition.culpritId)!;
  const categories: TraitCategory[] = ['sex', 'hair', 'hobby', 'feature', 'vehicle'];
  await enterFirstCase(page, `./?caseSeed=${seed}`);

  await page.getByRole('button', { name: /P\.C/ }).click();
  await expectAudioCue(page, 'CRIME_COMPUTER_CALCULATING');
  for (const category of categories) {
    await page.getByLabel(traitLabels[category]).selectOption(culprit.traits[category]);
  }
  await expectAudioCue(page, 'CRIME_COMPUTER_CALCULATING');
  await page.getByRole('button', { name: 'COMPUTAR MANDADO' }).click();
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('deolane-san-paolo.save') ?? '{}').activeCase?.runtime?.activeWarrantSuspectId)).toBe(culprit.id);
  await expect(page.getByText(new RegExp(`MANDADO EMITIDO PARA ${culprit.name.toUpperCase()}`))).toBeVisible();
  await expectAudioCue(page, 'WARRANT_ISSUED');

  for (let index = 1; index < definition.route.length; index += 1) {
    const city = content.cities.find((candidate) => candidate.id === definition.route[index])!;
    const sceneBeforeTravel = await page.locator('.scene > img').getAttribute('src');
    await page.getByRole('button', { name: /PARTIR/ }).click();
    await page.locator('.destination-list button').filter({ hasText: city.name }).click();
    await expect(page.getByText('EM TRÂNSITO')).toBeVisible();
    await expectAudioCue(page, 'AIRPLANE_TRAVEL');
    const plane = page.locator('.travel-animation i');
    const planeStart = await plane.evaluate((element) => parseFloat(getComputedStyle(element).left));
    await page.waitForTimeout(1_150);
    const planeLater = await plane.evaluate((element) => parseFloat(getComputedStyle(element).left));
    expect(planeLater).toBeGreaterThan(planeStart + 20);
    await expect(page.getByText('EM TRÂNSITO')).toBeVisible();
    await expect(page.locator('.city-brief')).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('.scene > img')).toHaveAttribute('data-city-id', city.id);
    await expect(page.locator('.scene > img')).toHaveAttribute('src', new RegExp(`/assets/cities/${city.id}\\.png$`));
    expect(await page.locator('.scene > img').getAttribute('src')).not.toBe(sceneBeforeTravel);
    if (index === definition.route.length - 2) {
      await expectAudioCue(page, 'SUSPICIOUS_HENCHMAN');
      const henchman = page.locator('.henchman-crossing i');
      await expect(henchman).toBeVisible();
      const henchmanStart = await henchman.evaluate((element) => parseFloat(getComputedStyle(element).left));
      await page.waitForTimeout(500);
      const henchmanLater = await henchman.evaluate((element) => parseFloat(getComputedStyle(element).left));
      expect(henchmanLater).toBeGreaterThan(henchmanStart + 10);
      await expect(page.getByText(/CAPANGA DA T\.C\.C\./)).toBeVisible();
      await page.getByRole('button', { name: /BUSCAR/ }).click();
      await page.locator('.place-list button').first().click();
      await expectAudioCue(page, 'CULPRIT_VERY_CLOSE');
      await page.locator('.speech .typewriter').click();
      await page.getByRole('button', { name: 'OUTRO LOCAL' }).click();
    } else if (index === definition.route.length - 1) {
      await expectAudioCue(page, 'FINAL_CITY');
    } else {
      await expectAudioCue(page, 'HOT_TRAIL');
    }
  }

  const hideout = content.places.find((place) => place.id === definition.finalHideoutPlaceId)!;
  await page.getByRole('button', { name: /BUSCAR/ }).click();
  await page.locator('.place-list button').filter({ hasText: hideout.name }).click();
  await expect(page.locator('.result-animation')).toBeVisible();
  await expectAudioCue(page, 'CRIMINAL_REVEALED');
  await expect(page.getByRole('button', { name: 'AGUARDE A SEQUÊNCIA...' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'RELATÓRIO À SEDE' })).toBeEnabled({ timeout: 5_000 });
  await expectAudioCue(page, 'CASE_CLOSED');
});

test('troca imediatamente a viagem por pista fria ao chegar a uma cidade errada', async ({ page }) => {
  const seed = 'cold-trail-audio';
  const definition = generateCase(createProfile('Detetive Bia'), seed, content);
  const start = definition.route[0]!;
  const correct = definition.route[1]!;
  const wrong = definition.cities[start]!.travelCandidates.find((cityId) => cityId !== correct)!;
  const wrongCity = content.cities.find((city) => city.id === wrong)!;

  await enterFirstCase(page, `./?caseSeed=${seed}`);
  await page.getByRole('button', { name: /PARTIR/ }).click();
  await page.locator('.destination-list button').filter({ hasText: wrongCity.name }).click();
  await expectAudioCue(page, 'AIRPLANE_TRAVEL');
  await expect(page.locator('.city-brief')).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/Pista fria/)).toBeVisible();
  await expectAudioCue(page, 'COLD_TRAIL');
});

test('mantém viagens, perseguição e fotos visíveis com redução de movimento', async ({ page }) => {
  test.setTimeout(45_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const seed = 'reduced-motion-presentation';
  const definition = generateCase(createProfile('Detetive Bia'), seed, content);
  await enterFirstCase(page, `./?caseSeed=${seed}`);

  for (let index = 1; index <= definition.route.length - 2; index += 1) {
    const city = content.cities.find((candidate) => candidate.id === definition.route[index])!;
    const previousSrc = await page.locator('.scene > img').getAttribute('src');
    await page.getByRole('button', { name: /PARTIR/ }).click();
    await page.locator('.destination-list button').filter({ hasText: city.name }).click();

    const plane = page.locator('.travel-animation i');
    await expect(plane).toBeVisible();
    const planeStart = await plane.evaluate((element) => ({
      left: parseFloat(getComputedStyle(element).left),
      duration: getComputedStyle(element).animationDuration
    }));
    expect(planeStart.duration).toContain('1.6s');
    await page.waitForTimeout(500);
    const planeLater = await plane.evaluate((element) => parseFloat(getComputedStyle(element).left));
    expect(planeLater).toBeGreaterThan(planeStart.left + 20);

    await expect(page.locator('.city-brief')).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('.scene > img')).toHaveAttribute('src', new RegExp(`/assets/cities/${city.id}\\.png$`));
    expect(await page.locator('.scene > img').getAttribute('src')).not.toBe(previousSrc);

    if (index === definition.route.length - 2) {
      const runner = page.locator('.henchman-crossing i');
      await expect(runner).toBeVisible();
      const runnerStart = await runner.evaluate((element) => ({
        left: parseFloat(getComputedStyle(element).left),
        duration: getComputedStyle(element).animationDuration
      }));
      expect(runnerStart.duration).toContain('2.6s');
      await page.waitForTimeout(500);
      const runnerLater = await runner.evaluate((element) => parseFloat(getComputedStyle(element).left));
      expect(runnerLater).toBeGreaterThan(runnerStart.left + 10);
    } else {
      const trailDuration = await page.locator('.trail-animation-cue i').evaluate((element) => getComputedStyle(element).animationDuration);
      expect(trailDuration).toBe('0.72s');
    }
  }
});
