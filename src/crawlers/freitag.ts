import chromium from 'chrome-aws-lambda';
import cheerio from 'cheerio';
import sleep from '../utils/sleep.js';

export async function getFreitag(url: string) {
  const browser = await chromium.puppeteer.launch({
    // headless: false,
  });

  const page = (await browser.pages())[0];
  const cookies = [
    {
      name: 'datadome',
      value:
        'Zf898gLgAO1DHv5g4zffKeo4eTFqjlbBFnUy17Witz2_~xpp~GQeoy_tWa~D~AZFYxifGplPvXIn3g2pATFSLTZv4aJo4TRUb-6ZI3yLYNREY.B~-61LOXBV__6865P',
      domain: '.freitag.ch',
    },
  ];
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-gb',
  });
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
  );
  await page.setCookie(...cookies);
  await page.setViewport({
    width: 1376,
    height: 786,
  });
  await page.goto(url);

  const dismissCookies = await page.$('.dismiss-cookies');
  await sleep(1000);
  await dismissCookies?.click();

  const [button] = await page.$x("//span[contains(., 'Show all')]");
  await sleep(1000);
  await button?.click();

  const $ = cheerio.load(await page.content());

  browser.close();

  return $;
}
