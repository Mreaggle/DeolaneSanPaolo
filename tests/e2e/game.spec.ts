import { expect, test } from '@playwright/test';

const enterFirstCase = async (page: import('@playwright/test').Page) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'NOVO JOGO' }).click();
  await page.getByLabel('NOME').fill('Detetive Bia');
  await page.getByRole('button', { name: 'TRANSMITIR' }).click();
  await expect(page.getByText(/NUNCA VI VOCÊ POR AQUI/)).toBeVisible();
  await page.getByRole('button', { name: 'AGUARDAR BOLETIM' }).click();
  await expect(page.getByText('PLANTÃO FEDERAL')).toBeVisible();
  await page.getByRole('button', { name: 'RECEBER MISSÃO' }).click();
  await page.getByRole('button', { name: 'INICIAR INVESTIGAÇÃO' }).click();
};

test('abre o prólogo e entra no primeiro caso', async ({ page }, testInfo) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /DEOLANE/ })).toBeVisible();
  await enterFirstCase(page);
  await expect(page.getByRole('navigation', { name: 'Ações de investigação' })).toBeVisible();
  await expect(page.getByText('AGÊNCIA FEDERAL', { exact: true })).toBeVisible();
  await expect(page.locator('.scene > img')).toBeVisible();
  await expect(page.locator('.city-curiosities li')).toHaveCount(2);
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
  await expect(page.locator('.city-curiosities li')).toHaveCount(2, { timeout: 2_000 });
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
