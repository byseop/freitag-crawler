import Discord, { TextChannel } from 'discord.js';

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.on('message', (message) => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

export function initializeDiscordBot() {
  client.login(process.env.DISCORD_BOT_TOKEN);
}

export function sendDiscordMessage(
  message: string | Discord.MessagePayload | Discord.MessageOptions,
) {
  const messageChannel = client.channels.cache.get(
    process.env.DISCORD_CHANNEL_ID,
  ) as TextChannel;

  messageChannel?.send(message);
}
