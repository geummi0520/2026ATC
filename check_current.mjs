import { chromium } from 'playwright-core';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1480, height: 1120 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/current-state.png' });
  console.log('errors:', errors);

  const info = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : null;
    const bg = document.querySelector('img[src*="background.svg"]');
    const bgRect = bg?.getBoundingClientRect();
    return { viewportHeight: window.innerHeight, footerTop, bgRect: bgRect ? {w: Math.round(bgRect.width), h: Math.round(bgRect.height)} : null, bodyHTML_hasEggGlyph: !!document.querySelector('[alt=""][width="28"]') };
  });
  console.log('info:', info);
} finally {
  await browser.close();
}
