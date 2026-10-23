import type { BrowserContext } from '@playwright/test';

const adRequest = /googlesyndication|doubleclick|googleadservices|google-analytics|googletagmanager|fundingchoices|adsbygoogle|pagead2/i;

export function hideAds(): void {
  const style = document.createElement('style');
  style.textContent = [
    'ins.adsbygoogle,',
    'iframe[id^="aswift_"],',
    'iframe[title="Advertisement"],',
    '[id^="google_ads_"],',
    '.adsbygoogle,',
    '#google_vignette,',
    '.google-auto-placed {',
    '  display: none !important;',
    '  visibility: hidden !important;',
    '  pointer-events: none !important;',
    '  height: 0 !important;',
    '  max-height: 0 !important;',
    '}',
  ].join('\n');
  document.documentElement.append(style);
}

export async function blockAds(context: BrowserContext): Promise<void> {
  await context.route(adRequest, (route) => route.fulfill({ status: 200, contentType: 'text/plain', body: '' }));
  await context.addInitScript(hideAds);
}
