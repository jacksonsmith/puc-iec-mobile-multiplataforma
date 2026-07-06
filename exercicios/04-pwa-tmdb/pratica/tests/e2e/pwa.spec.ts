// tests/e2e/pwa.spec.ts — gate do grader (roda contra build do aluno)
// Executa com: npm run build && npx playwright test

import { test, expect } from '@playwright/test';

// ── Grupo A: dados (TODO 1 + 2) ─────────────────────────────────────────────

test.describe('A — Dados TMDB', () => {
  test('A1. exibe pelo menos 10 cards de filmes', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('article', { timeout: 10_000 });
    const cards = page.locator('article');
    await expect(cards).toHaveCountGreaterThan(9);
  });

  test('A2. cada card tem título e nota visíveis', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('article');
    const first = page.locator('article').first();
    await expect(first.locator('h3')).not.toBeEmpty();
    await expect(first).toContainText(/[0-9]\.[0-9]/);
  });

  test('A3. campo de busca filtra filmes por título', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('article');
    const total = await page.locator('article').count();

    await page.fill('input[type="search"]', 'xyznotfound999');
    const afterFilter = page.locator('article');
    await expect(afterFilter).toHaveCount(0);

    await page.fill('input[type="search"]', '');
    await expect(page.locator('article')).toHaveCount(total);
  });
});

// ── Grupo B: PWA offline (TODO 3 + Workbox) ─────────────────────────────────

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
    await page.waitForTimeout(2000);
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.length > 0;
    });
    expect(swRegistered).toBe(true);
  });

  test('B3. filmes ainda aparecem após simular offline (cache hit)', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForSelector('article');

    // Ativa modo offline e recarrega
    await context.setOffline(true);
    await page.reload();
    await page.waitForSelector('article', { timeout: 8_000 });

    const cards = page.locator('article');
    await expect(cards).toHaveCountGreaterThan(0);
    await context.setOffline(false);
  });
});

// ── Grupo C: favoritos + badge (TODO 4) ─────────────────────────────────────

test.describe('C — Favoritos', () => {
  test('C1. clicar em Favoritar adiciona o filme e persiste no reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('article');

    await page.locator('button', { hasText: /favoritar/i }).first().click();
    await expect(page.locator('button', { hasText: /★ favorito/i }).first()).toBeVisible();

    await page.reload();
    await page.waitForSelector('article');
    await expect(page.locator('button', { hasText: /★ favorito/i }).first()).toBeVisible();
  });
});
