import chromium from 'chrome-aws-lambda';
import { Page } from 'puppeteer-core';
import { sendDiscordMessage } from '../sender/discord/init.js';
import sleep from '../utils/sleep.js';
import firestore from '../firestore/init.js';
import firebase from 'firebase/compat';
import { Product } from './types.js';
import UserAgent from 'user-agents';
import getRandomNumber from '../utils/randomNumber.js';
import { add, format } from 'date-fns';

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
  const userAgent = new UserAgent({ deviceCategory: 'desktop' });
  await page.setUserAgent(userAgent.toString());
  await page.setViewport({
    width: 1376,
    height: 786,
  });

  const navigationPromise = page.waitForNavigation({
    waitUntil: 'networkidle2',
  });

  // login
  await page.goto('https://www.freitag.ch/en');
  await navigationPromise;
  await sleep(getRandomNumber(1500, 2900));
  await page.click('.dismiss-cookies');
  await sleep(getRandomNumber(1500, 2900));
  await page.click('a[title="View my profile"]');
  await navigationPromise;
  await sleep(getRandomNumber(1500, 2900));
  await page.focus('#edit-name');
  await navigationPromise;
  await page.keyboard.type(process.env.MY_ID);
  await sleep(getRandomNumber(1500, 2900));
  await page.focus('#edit-pass');
  await page.keyboard.type(process.env.MY_PW);
  await page.click('#edit-submit');
  await navigationPromise;
  await sleep(getRandomNumber(1500, 2900));

  // add cart loop;
  for (const product of products) {
    try {
      await addProductToCart(page, product);
      await sleep(getRandomNumber(1500, 2900));
    } catch (e) {
      console.error(e);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      continue;
    }
  }

  await browser.close();
}

async function addProductToCart(page: Page, product: Product) {
  const navigationPromise = page.waitForNavigation({
    waitUntil: 'networkidle2',
  });
  console.log('장바구니 추가 시작');
  const doc = firestore.collection('freitag').doc('blacklist');
  let db: firebase.firestore.DocumentData;
  await doc.get().then((doc) => {
    db = doc.data();
  });
  if (db) {
    // go to page
    await page.goto(product.url);
    await navigationPromise;
    await sleep(getRandomNumber(1500, 2900));

    // add cart
    await page.click('.fri-cart.relative');
    await navigationPromise;
    await sleep(getRandomNumber(1500, 2900));

    // go to checkout
    await page.click('.js-cart-button');
    await navigationPromise;
    await sleep(getRandomNumber(1500, 2900));

    // save and continue
    await page.click('#edit-actions-next-clone');
    await navigationPromise;
    await sleep(getRandomNumber(1500, 2900));
    await page.click('#edit-actions-next-clone');
    await navigationPromise;

    await doc.update({
      data: {
        ...db.data,
        [product.id]: true,
      },
    });

    await sendDiscordMessage(`**${product.name}** 장바구니 추가완료`);

    await doc.update({
      collectDate: format(add(new Date(), { hours: 9 }), 'yyyy-MM-dd hh:mm:ss'),
    });
    console.log('장바구니 추가 완료');
  }
}
