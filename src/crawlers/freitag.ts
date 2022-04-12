import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export async function getFreitag(url: string) {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1376,
    height: 786,
  });
  await page.goto(url);

  const dismissCookies = await page.$('.dismiss-cookies');
  await dismissCookies?.click();

  const [button] = await page.$x("//span[contains(., 'Show all')]");
  await button?.click();

  const $ = cheerio.load(await page.content());

  browser.close();

  return $;
}
