import { Message } from 'discord.js';
import setup from './lib/setup';

setup();

// Bot hooks
global.BOT.on('ready', () => {
  global.LOGGER.info('Client Ready!');
  global.LOGGER.info(`${global.BOT.user?.username}`);
});

global.BOT.on('message', (msg:Message) => {
  if (!process.env.BOT_PREFIX) {
    global.LOGGER.error('Please set the BOT_PREFIX in .env');
    return;
  }
  if (msg.author === global.BOT.user) return;
  if (!msg.content.startsWith(process.env.BOT_PREFIX)) return;

  // remove prefix and put command to lowercase
  const args = msg.content.replace(process.env.BOT_PREFIX, '').split(/ +/);
  const commandString = args.shift()?.toLowerCase();

  if (!commandString) return;
  const command = global.COMMANDS.get(commandString);

  if (!command) {
    return;
  }

  command.execute(msg, args);
});

global.BOT.login(process.env.DISCORD_API_KEY);
