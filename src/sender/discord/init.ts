import Discord, { TextChannel } from 'discord.js';

const client = new Discord.Client({});
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity({
    type: 'PLAYING',
    name: '열심히 프라이탁 크롤링',
  });
});

export function initializeDiscordBot() {
  client.login(process.env.DISCORD_BOT_TOKEN);
}

export function sendDiscordMessage(
  message:
    | Discord.APIMessageContentResolvable
    | (Discord.MessageOptions & {
        split?: false;
      }),
) {
  const messageChannel = client.channels.cache.get(
    process.env.DISCORD_CHANNEL_ID,
  ) as TextChannel;

  messageChannel?.send(message);
}
