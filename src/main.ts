import cron from 'node-cron';
import getLassie from './crawlers/lassie.js';

async function handleAsync() {
  await getLassie();
}

// handleAsync();

cron.schedule('* * * * *', async () => {
  console.log('running a task every minuets');
  await handleAsync();
});
