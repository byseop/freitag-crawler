import chromium from 'chrome-aws-lambda';
import cheerio from 'cheerio';

export async function getFreitag(url: string) {
  const browser = await chromium.puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  // const cookies = [
  //   {
  //     name: 'datadome',
  //     value:
  //       '.8RmXQ_Zd6xC9n-RsrLS5AI5597zzavoXAgXq77KF5tVgHMnOxR0phEqYwIXNa3IbcsmX2OuBaX_Zvxsf~cvKgrYRpgEHeMuukDG5tH3xpRVHHiKwUHZiPeOTV6d4RWZ',
  //     domain: '.freitag.ch',
  //   },
  // ];
  // await page.setCookie(...cookies);
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
