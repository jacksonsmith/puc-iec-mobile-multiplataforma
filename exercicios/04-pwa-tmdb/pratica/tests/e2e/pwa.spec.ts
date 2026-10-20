// tests/e2e/pwa.spec.ts — verificação OPCIONAL na sua máquina (o bot NÃO executa este arquivo)
// Executa com: npm run build && npx playwright test

import { test, expect, type Page } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Só repete a navegação quando a conexão externa é explicitamente resetada.
// Falhas de UI, autenticação ou outras asserções continuam falhando normalmente.
async function loadMovies(page: Page, reload = false) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let reset = false;
    const failed = (request: import('@playwright/test').Request) => {
      if (new URL(request.url()).hostname === 'api.themoviedb.org' &&
          request.failure()?.errorText === 'net::ERR_CONNECTION_RESET') reset = true;
    };
    page.on('requestfailed', failed);
    try {
      if (reload) await page.reload();
      else await page.goto('/');
      await page.waitForSelector('article', { timeout: 7_000 });
      return;
    } catch (error) {
      if (!reset || attempt === 2) throw error;
      console.log('Repetindo navegação após reset da conexão externa do TMDB.');
    } finally {
      page.off('requestfailed', failed);
    }
  }
}

// ── Grupo A: dados (TODO 1) ─────────────────────────────────────────────

test.describe('A — Dados TMDB', () => {
  test('A1. exibe pelo menos 10 cards de filmes', async ({ page }) => {
    await loadMovies(page);
    const cards = page.locator('article');
    await expect.poll(() => cards.count()).toBeGreaterThan(9);
  });

  test('A2. cada card tem título e nota visíveis', async ({ page }) => {
    await loadMovies(page);
    const first = page.locator('article').first();
    await expect(first.locator('h3')).not.toBeEmpty();
    await expect(first).toContainText(/[0-9]\.[0-9]/);
  });

  test('A3. campo de busca filtra filmes por título', async ({ page }) => {
    await loadMovies(page);
    const total = await page.locator('article').count();

    await page.getByRole('button', { name: 'Buscar', exact: true }).click();
    await page.fill('input[type="search"]', 'xyznotfound999');
    const afterFilter = page.locator('article');
    await expect(afterFilter).toHaveCount(0);

    await page.fill('input[type="search"]', '');
    await expect(page.locator('article')).toHaveCount(total);
  });
});

test.describe('D — Requisitos completos e evidências', () => {
  test('D0. ícones do manifest existem e podem ser decodificados', async ({ page }) => {
    await page.goto('/');
    const icons = await page.evaluate(async () => {
      const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')!;
      const data = await (await fetch(manifest.href)).json();
      return Promise.all(data.icons.map(async (icon: {src: string; sizes: string}) => {
        const bitmap = await createImageBitmap(await (await fetch(icon.src)).blob());
        return { sizes: icon.sizes, width: bitmap.width, height: bitmap.height };
      }));
    });
    expect(icons).toEqual(expect.arrayContaining([
      {sizes: '192x192', width: 192, height: 192},
      {sizes: '512x512', width: 512, height: 512},
    ]));
  });

  test('D1. cache de API e pôsteres, favoritos offline e reconexão', async ({ page, context }) => {
    test.setTimeout(90_000);
    const evidence = path.resolve('evidencias');
    await mkdir(evidence, { recursive: true });
    await loadMovies(page);
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await loadMovies(page, true);
    await expect.poll(() => page.evaluate(async () => {
      const result: Record<string, number> = {};
      for (const name of ['tmdb-api', 'tmdb-images']) {
        result[name] = (await (await caches.open(name)).keys()).length;
      }
      return result;
    })).toEqual({ 'tmdb-api': expect.any(Number), 'tmdb-images': expect.any(Number) });
    await expect.poll(() => page.evaluate(async () =>
      (await (await caches.open('tmdb-api')).keys()).length)).toBeGreaterThan(0);
    await expect.poll(() => page.evaluate(async () =>
      (await (await caches.open('tmdb-images')).keys()).length)).toBeGreaterThan(0);

    const report = await page.evaluate(async () => {
      const result: Record<string, string[]> = {};
      for (const name of ['tmdb-api', 'tmdb-images']) {
        result[name] = (await (await caches.open(name)).keys()).map((request) => request.url);
      }
      return result;
    });
    await writeFile(path.join(evidence, 'cache-storage.json'), JSON.stringify(report, null, 2));
    const inspection = await context.newPage();
    await inspection.setContent('<html lang="pt-BR"><body style="font:16px monospace;background:#0d253f;color:white;padding:24px"><h1>Cache Storage — inspeção real do navegador</h1><p>Origem: http://localhost:4173 · API CacheStorage</p><pre></pre></body></html>');
    await inspection.locator('pre').evaluate((el, value) => { el.textContent = value; }, JSON.stringify(report, null, 2));
    await inspection.screenshot({ path: path.join(evidence, 'cache-storage.png'), fullPage: true });
    await inspection.close();

    await page.getByRole('button', { name: 'Favoritar', exact: true }).first().click();
    await page.getByRole('button', { name: 'Favoritos', exact: true }).click();
    await expect(page.locator('article')).toHaveCount(1);
    await page.screenshot({ path: path.join(evidence, 'favoritos-online.png') });
    await context.setOffline(true);
    await expect(page.getByText('📡 Offline — exibindo dados do cache')).toBeVisible();
    await expect(page.locator('article')).toHaveCount(1);
    await page.screenshot({ path: path.join(evidence, 'favoritos-offline.png') });
    await loadMovies(page, true);
    await page.getByRole('button', { name: 'Favoritos', exact: true }).click();
    await expect(page.locator('article')).toHaveCount(1);
    await expect(page.getByText('📡 Offline — exibindo dados do cache')).toBeVisible();
    await page.screenshot({ path: path.join(evidence, 'reload-offline.png') });
    await context.setOffline(false);
    await expect(page.getByText('📡 Offline — exibindo dados do cache')).not.toBeVisible();
    await page.getByRole('button', { name: 'Remover favorito', exact: true }).click();
    await expect(page.getByText('Nenhum favorito ainda — toque ★ em um filme.')).toBeVisible();
  });

  test('D2. uma nova versão pede confirmação antes de atualizar', async ({ page }) => {
    test.setTimeout(90_000);
    await loadMovies(page);
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await loadMovies(page, true);
    const swPath = path.resolve('dist/sw.js');
    const original = await readFile(swPath, 'utf8');
    try {
      await writeFile(swPath, original + '\n// verificação de atualização ' + Date.now());
      await page.evaluate(async () => {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
      });
      await expect(page.getByText('Nova versão disponível')).toBeVisible({ timeout: 20_000 });
      await page.screenshot({ path: path.resolve('evidencias/nova-versao.png') });
      await page.getByRole('button', { name: 'Atualizar', exact: true }).click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText('Nova versão disponível')).not.toBeVisible();
      await expect(page.locator('article').first()).toBeVisible();
    } finally {
      await writeFile(swPath, original);
    }
  });
});

// ── Grupo B: PWA offline (TODO 2 e 3 + Workbox) ─────────────────────────────────

test.describe('B — PWA & Offline', () => {
  test('B1. Web App Manifest está linkado e tem display=standalone', async ({ page }) => {
    await page.goto('/');
    const manifest = await page.evaluate(async () => {
      const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
      if (!link) return null;
      const res = await fetch(link.href);
      return res.json();
    });
    expect(manifest).not.toBeNull();
    expect(manifest.display).toBe('standalone');
  });

  test('B2. Service Worker registrado', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.length > 0;
    });
    expect(swRegistered).toBe(true);
  });

  test('B3. filmes ainda aparecem após simular offline (cache hit)', async ({ page, context }) => {
    await loadMovies(page);

    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await loadMovies(page, true);
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    // Ativa modo offline e recarrega
    await context.setOffline(true);
    await loadMovies(page, true);

    const cards = page.locator('article');
    await expect.poll(() => cards.count()).toBeGreaterThan(0);
    await context.setOffline(false);
  });
});

// ── Grupo C: favoritos + badge (TODO 4 e 5) ─────────────────────────────────────

test.describe('C — Favoritos', () => {
  test('C1. clicar em Favoritar adiciona o filme e persiste no reload', async ({ page }) => {
    await loadMovies(page);

    await page.getByRole('button', { name: 'Favoritar', exact: true }).first().click();
    await expect(page.getByRole('button', { name: 'Remover favorito', exact: true }).first()).toBeVisible();

    await loadMovies(page, true);
    await expect(page.getByRole('button', { name: 'Remover favorito', exact: true }).first()).toBeVisible();
  });
});
