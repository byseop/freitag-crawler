import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export async function getFreitag(url: string) {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  const cookies = [
    {
      name: 'datadome',
      value:
        'ZWalW3qMeSfzd_LGaMdFacRS1Bnw~Fy6XSjZxf6WZ-dmf2LsjnSLuX384MdSYm0FygNgm0GZj9BQwgsI-o6ImYkBJdtgpaNyDHzEqw9N-PCMczuDMyXnOXKm6tkih_A',
      domain: '.freitag.ch',
    },
  ];
  await page.setCookie(...cookies);
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
