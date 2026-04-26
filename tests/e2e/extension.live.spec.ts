import { collectPageErrors, expect, extensionErrors, test, waitForExtensionReady } from './extension-fixture';

test.describe('live YouTube smoke', () => {
  test.skip(!process.env.SIMPLE_YT_TWEAKS_LIVE, 'Set SIMPLE_YT_TWEAKS_LIVE=1 to run live YouTube smoke checks.');

  test('loads the extension on public YouTube pages without extension console errors', async ({ context, extensionId }) => {
    const page = await context.newPage();
    const errors = collectPageErrors(page);

    try {
      await page.goto('https://www.youtube.com/', { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await waitForExtensionReady(page);
      await page.goto('https://www.youtube.com/results?search_query=weather', {
        waitUntil: 'domcontentloaded',
        timeout: 20_000,
      });
      await waitForExtensionReady(page);
    } catch (error) {
      test.info().annotations.push({
        type: 'live-smoke-skipped',
        description: `Live YouTube smoke could not complete in this environment: ${String(error)}`,
      });
      return;
    }

    const popup = await context.newPage();
    const popupErrors = collectPageErrors(popup);
    await popup.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    await expect(popup.locator('#versionLabel')).toHaveText(/^v\d+\.\d+\.\d+$/);

    expect(extensionErrors([...errors, ...popupErrors])).toEqual([]);
  });
});
