import cron from 'node-cron';
import { initializeDiscordBot } from './sender/discord/init.js';
import getLassie from './crawlers/lassie.js';

initializeDiscordBot();

async function handleAsync() {
  await getLassie();
}

// handleAsync();

cron.schedule('* * * * *', async () => {
  console.log('running a task every minuets');
  await handleAsync();
});
