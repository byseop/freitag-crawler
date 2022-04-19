import Discord, { TextChannel } from 'discord.js';

const client = new Discord.Client({});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity({
    type: 'PLAYING',
    name: '프라이탁 크롤링',
  });
});

// client.on('debug', console.log);

export async function initializeDiscordBot(name: string, callback) {
  await client
    .login(process.env[`DISCORD_BOT_TOKEN_${name.toUpperCase()}`])
    .then(await callback);
}

export async function sendDiscordMessage(
  message: string,
  type?: 'normal' | 'mention',
) {
  const messageChannel = (await client.channels.fetch(
    '963350400596074519',
  )) as TextChannel;

  messageChannel
    ?.send(`${type === 'mention' ? '<@&965276206780018738>\n' : ''}${message}`)
    .then(() => {
      console.log(
        `Discord send message complete.: ${
          typeof message === 'string' && message
        }`,
      );
    });
}

// export function replyDiscordMessage(id: string, message: string) {
//   const messageChannel = client.channels.cache.get(
//     process.env.DISCORD_CHANNEL_ID,
//   ) as TextChannel;
//   const target = messageChannel.messages.cache.get(id);

//   if (target) {
//     target.reply(message);
//   }
// }
