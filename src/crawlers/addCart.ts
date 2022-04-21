import chromium from 'chrome-aws-lambda';
import { Page } from 'puppeteer-core';
import { sendDiscordMessage } from '../sender/discord/init.js';
import sleep from '../utils/sleep.js';
import firestore from '../firestore/init.js';
import firebase from 'firebase/compat';

export default async function addCart(products: { url: string; id: string }[]) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: false,
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
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
  );
  await page.setViewport({
    width: 1376,
    height: 786,
  });

  // login
  await page.goto('https://www.freitag.ch/en');
  await sleep(2115);
  await page.click('.dismiss-cookies');
  await sleep(2238);
  await page.click('a[title="View my profile"]');
  await sleep(2138);
  await page.focus('.form-type-email input');
  await page.keyboard.type(process.env.MY_ID);
  await page.focus('.form-type-password input');
  await page.keyboard.type(process.env.MY_PW);
  await page.click('#edit-submit');
  await sleep(2111);

  // add cart loop;
  for (const product of products) {
    try {
      await addProductToCart(page, product);
      await sleep(2000);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      continue;
    }
  }

  await browser.close();
}

async function addProductToCart(
  page: Page,
  product: { url: string; id: string },
) {
  const doc = firestore.collection('freitag').doc('blacklist');
  let db: firebase.firestore.DocumentData;
  await doc.get().then((doc) => {
    db = doc.data();
  });
  if (db) {
    // go to page
    await page.goto(product.url);
    await sleep(3004);

    // add cart
    await page.click('.fri-cart.relative');
    await sleep(3098);

    // go to checkout
    await page.click('.js-cart-button');
    await sleep(3111);

    // save and continue
    await page.click('#edit-actions-next-clone');
    await sleep(3210);
    await page.click('#edit-actions-next-clone');

    await doc
      .update({
        data: {
          ...db.data,
          [product.id]: true,
        },
      })
      .then(async () => {
        await sendDiscordMessage(`ID: ${product.id} 장바구니 추가완료`);
      });
  }
}
