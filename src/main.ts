import {
  initializeDiscordBot,
  // sendDiscordMessage,
} from './sender/discord/init.js';
import getProduct from './crawlers/product.js';
import { target } from './crawlers/constant.js';
// import sleep from './utils/sleep.js';

// export async function handleAsync() {
//   await initializeDiscordBot(async () => {
//     // await sendDiscordMessage('크롤링 시작입니다.');
//     for (const item of target) {
//       // await sleep(2500);
//       await getProduct(item);
//     }
//   });
//   // return process.exit();
//   return;
// }
// handleAsync();

export async function getLassie() {
  await initializeDiscordBot(target[0].name, async () => {
    await getProduct(target[0]);
  });
  return;
}
export async function getDexter() {
  await initializeDiscordBot(target[1].name, async () => {
    await getProduct(target[1]);
  });
  return;
}
export async function getJamie() {
  await initializeDiscordBot(target[2].name, async () => {
    await getProduct(target[2]);
  });
  return;
}
export async function getHawaiiFiveO() {
  await initializeDiscordBot(target[3].name, async () => {
    await getProduct(target[3]);
  });
  return;
}

// getLassie();
// getDexter();
// getJamie();
// getHawaiiFiveO();
