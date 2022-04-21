import chromium from 'chrome-aws-lambda';
import { Page } from 'puppeteer-core';
import { sendDiscordMessage } from '../sender/discord/init.js';
import sleep from '../utils/sleep.js';
import firestore from '../firestore/init.js';
import firebase from 'firebase/compat';
import { Product } from './types.js';
import randomUseragent from 'random-useragent';

export default async function addCart(products: Product[]) {
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
  await page.setUserAgent(randomUseragent.getRandom());
  await page.setViewport({
    width: 1376,
    height: 786,
  });

  // login
  await page.goto('https://www.freitag.ch/en');
  await sleep(1782);
  await page.click('.dismiss-cookies');
  await sleep(2091);
  await page.click('a[title="View my profile"]');
  await sleep(2749);
  await page.focus('.form-type-email input');
  await page.keyboard.type(process.env.MY_ID);
  await sleep(1049);
  await page.focus('.form-type-password input');
  await page.keyboard.type(process.env.MY_PW);
  await page.click('#edit-submit');
  await sleep(2198);

  // add cart loop;
  for (const product of products) {
    try {
      await addProductToCart(page, product);
      await sleep(2119);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      continue;
    }
  }

  await browser.close();
}

async function addProductToCart(page: Page, product: Product) {
  console.log('장바구니 추가 시작');
  const doc = firestore.collection('freitag').doc('blacklist');
  let db: firebase.firestore.DocumentData;
  await doc.get().then((doc) => {
    db = doc.data();
  });
  if (db) {
    // go to page
    await page.goto(product.url);
    await sleep(3120);

    // add cart
    await page.click('.fri-cart.relative');
    await sleep(2498);

    // go to checkout
    await page.click('.js-cart-button');
    await sleep(2740);

    // save and continue
    await page.click('#edit-actions-next-clone');
    await sleep(3210);
    await page.click('#edit-actions-next-clone');

    await doc.update({
      data: {
        ...db.data,
        [product.id]: true,
      },
    });

    await sendDiscordMessage(`**${product.name}** 장바구니 추가완료`);
    console.log('장바구니 추가 완료');
  }
}
