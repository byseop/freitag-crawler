import cron from 'node-cron';
import { initializeDiscordBot } from './sender/discord/init.js';
import getProduct from './crawlers/product.js';
import { target } from './crawlers/constant.js';

initializeDiscordBot();

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function handleAsync() {
  for (const item of target) {
    await sleep(3000);
    await getProduct(item);
  }
}

// handleAsync();

cron.schedule('*/2 * * * *', async () => {
  console.log('start crwaling');
  await handleAsync();
});
