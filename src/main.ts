// import cron from 'node-cron';
import { getPreitag } from './crawlers/preitag.js';
import { url } from './crawlers/constant.js';

async function handleAsync() {
  const lassie = await getPreitag(url.lassie);
  console.log(lassie);
}

handleAsync();

// cron.schedule('* * * * *', async () => {
//   console.log('running a task every minuets');
//   await handleAsync();
// });
