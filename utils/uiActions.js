// utils/uiActions.js
// Small UI helpers to make Playwright interactions more resilient across UI overlays/modals.

/**
 * Clicks the first visible Proceed/Confirm/Continue/Next style button.
 * Handles backdrops intercepting pointer events and falls back to JS click.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ timeout?: number, labels?: string[], postClickWaitFor?: import('@playwright/test').Locator }} [options]
 */
async function clickProceed(page, options = {}) {
  const timeout = options.timeout ?? 15000;
  const labels = options.labels ?? ['Proceed', 'Confirm', 'Continue', 'Next', 'Done'];
  const postClickWaitFor = options.postClickWaitFor;

  // Try to let overlays disappear (best effort).
  try {
    await page.locator('.backdrop-blur-xs').waitFor({ state: 'hidden', timeout: 5000 });
  } catch (e) {
    // ignore
  }

  // Prefer role=button name matching; fallback to button text.
  const nameRegex = new RegExp(labels.join('|'), 'i');
  const byRole = page.getByRole('button', { name: nameRegex }).filter({ hasText: nameRegex });
  const byTextXpath = page.locator(
    'xpath=' +
      labels
        .map(l => `//button[normalize-space()="${l}" or contains(normalize-space(),"${l}")]`)
        .join(' | ')
  );

  const candidates = [byRole, byTextXpath];

  for (const loc of candidates) {
    const btn = loc.first();
    const visible = await btn.isVisible().catch(() => false);
    if (!visible) continue;

    await btn.scrollIntoViewIfNeeded().catch(() => {});

    // Wait for enabled when possible.
    try {
      await btn.waitFor({ state: 'visible', timeout });
    } catch (e) {}

    for (const attempt of [
      () => btn.click({ timeout: 3000 }),
      () => btn.click({ force: true, timeout: 3000 }),
      () => btn.evaluate(el => el.click()),
    ]) {
      try {
        await attempt();

        // Confirm the click had an effect.
        if (postClickWaitFor) {
          await postClickWaitFor.waitFor({ state: 'hidden', timeout }).catch(() => {});
        }

        return;
      } catch (e) {
        // try next
      }
    }
  }

  throw new Error(`Proceed/Confirm button not found or not clickable (labels tried: ${labels.join(', ')})`);
}

module.exports = { clickProceed };
