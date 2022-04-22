import chromium from 'chrome-aws-lambda';
import cheerio from 'cheerio';
import sleep from '../utils/sleep.js';
import randomUseragent from 'random-useragent';
import getRandomNumber from '../utils/randomNumber.js';

export async function getFreitag(url: string) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: true,
    // defaultViewport: chromium.defaultViewport,
  });

  const page = (await browser.pages())[0];
  const value = process.env.DATADOM_COOKIES;
  if (value && value.length > 0) {
    const cookies = [
      {
        name: 'datadome',
        value,
        domain: '.freitag.ch',
      },
    ];
    await page.setCookie(...cookies);
  }
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-gb',
  });
  await page.setUserAgent(randomUseragent.getRandom());
  await page.setViewport({
    width: 1376,
    height: 786,
  });
  await page.goto(url);
  const $ = cheerio.load(await page.content());
  await sleep(getRandomNumber(1500, 2900));
  await browser.close();
  return $;
}
