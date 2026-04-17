const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.toString()));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });
  
  await page.goto('http://localhost:3005/login', { waitUntil: 'networkidle0' }).catch(x=>console.log(x));
  await page.type('input[name="email"]', 'test@example.com').catch(() => page.type('input[type="email"]', 'test@example.com'));
  await page.type('input[type="password"]', 'password123');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('button[type="submit"]')
  ]);
  
  await page.screenshot({ path: 'screenshot_dashboard.png' });
  await browser.close();
})();
