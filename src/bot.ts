import { Client, Message } from 'discord.js';
import { register } from 'ts-node';

register();

global.BOT = new Client();

global.BOT.on('ready', () => {
  console.log('urra');
  console.log(`${global.BOT.user}`);
});

global.BOT.on('message', (msg:Message) => {
  msg.channel.send('hallo!');
});

global.BOT.login(process.env.DISCORD_API_KEY);
