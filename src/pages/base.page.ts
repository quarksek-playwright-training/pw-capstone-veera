import type { Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected async waitForApp(marker: Locator): Promise<void> {
    try {
      await marker.waitFor({ state: 'visible', timeout: 20_000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/has been closed/i.test(message)) {
        throw error;
      }
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await marker.waitFor({ state: 'visible', timeout: 30_000 });
    }
  }

  async goto(path: string): Promise<void> {
    const options = { waitUntil: 'domcontentloaded' as const };
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.page.goto(path, options);
        return;
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);
        if (/has been closed/i.test(message) || attempt === 2) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    throw lastError;
  }
}
