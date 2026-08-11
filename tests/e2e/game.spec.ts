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
  await expect(page.getByRole('heading', { name: /DEOLANE/ })).toBeVisible();
  await enterFirstCase(page);
  await expect(page.getByRole('navigation', { name: 'Ações de investigação' })).toBeVisible();
  await expect(page.getByText('AGÊNCIA FEDERAL', { exact: true })).toBeVisible();
  await expect(page.locator('.scene > img')).toBeVisible();
  await expect(page.locator('.city-brief')).toBeVisible();
  await expect(page.locator('.city-brief li')).toHaveCount(0);
  await page.screenshot({ path: `test-results/gameplay-${testInfo.project.name}.png` });
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
    await page.getByRole('button', { name: /PARTIR/ }).click();
    await page.locator('.destination-list button').filter({ hasText: city.name }).click();
    await expect(page.getByText('EM TRÂNSITO')).toBeVisible();
    await expectAudioCue(page, 'AIRPLANE_TRAVEL');
    await page.waitForTimeout(1_150);
    await expect(page.getByText('EM TRÂNSITO')).toBeVisible();
    await expect(page.locator('.city-brief')).toBeVisible({ timeout: 5_000 });
    if (index === definition.route.length - 2) {
      await expectAudioCue(page, 'SUSPICIOUS_HENCHMAN');
      await expect(page.locator('.henchman-crossing')).toBeVisible();
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
