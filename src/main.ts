import cron from 'node-cron';
import { format } from 'date-fns';
import { initializeDiscordBot } from './sender/discord/init.js';
import getProduct from './crawlers/product.js';
import { target } from './crawlers/constant.js';
import sleep from './utils/sleep.js';

initializeDiscordBot();

export async function handleAsync() {
  for (const item of target) {
    await sleep(3000);
    await getProduct(item);
  }
}

// handleAsync();

cron.schedule('*/2 * * * *', async () => {
  console.log(
    `Start crawling 🔥🔥 ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
  );
  await handleAsync();
  console.log(
    `Finish crawling 👏👏 ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
  );
});
