import chromium from 'chrome-aws-lambda';
import cheerio from 'cheerio';

export async function getFreitag(url: string) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: true,
    // defaultViewport: chromium.defaultViewport,
  });

  const page = (await browser.pages())[0];
  const cookies = [
    {
      name: 'datadome',
      value:
        '.DdxX4DggLnPeqQ-az.yIkTH.JK41KFjFIOxujbPPmWq688I0Ea2~vsvhrRc-N5-e6mndlgvptxJ3b~uRnYiqbxRTwyMvFkbRfsfPUPd0D-TRkD2RcUc3feOC.aR32ee',
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
  const $ = cheerio.load(await page.content());
  await browser.close();
  return $;
}
