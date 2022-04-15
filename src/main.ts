import { initializeDiscordBot } from './sender/discord/init.js';
import getProduct from './crawlers/product.js';
import { target } from './crawlers/constant.js';
import sleep from './utils/sleep.js';

initializeDiscordBot();

export async function handleAsync() {
  for (const item of target) {
    await sleep(2000);
    await getProduct(item);
  }
}

handleAsync();
