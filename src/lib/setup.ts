import { Client } from 'discord.js';
import { config } from 'dotenv';
import { Player } from 'discord-player';
import logger from './logger';
import commands from '../commands';

// DotEnv config
async function setupPlayer() {
  global.PLAYER = new Player(global.BOT);

  global.PLAYER
    .on('trackStart', (message, track) => message.channel.send(`Now playing ${track.title}...`))

  // Send a message when something is added to the queue
    .on('trackAdd', (message, queue, track) => message.channel.send(`${track.title} has been added to the queue!`))
    .on('noResults', (message, query) => message.channel.send(`No results found on YouTube for ${query}!`))

  // Send a message when the music is stopped
    .on('queueEnd', (message) => message.channel.send('Music stopped as there is no more music in the queue!'))
    .on('channelEmpty', (message) => message.channel.send('Music stopped as there is no more member in the voice channel!'))
    .on('botDisconnect', (message) => message.channel.send('Music stopped as I have been disconnected from the channel!'))

  // Error handling
    .on('error', (error, message) => {
      switch (error) {
        case 'NotPlaying':
          message.channel.send('There is no music being played on this server!');
          break;
        case 'NotConnected':
          message.channel.send('You are not connected in any voice channel!');
          break;
        case 'UnableToJoin':
          message.channel.send('I am not able to join your voice channel, please check my permissions!');
          break;
        default:
          message.channel.send(`Something went wrong... Error: ${error}`);
      }
    });
}

export default () => {
  config();

  // Setup for global variables
  // checkk the index.d.ts in types/global for reference
  global.BOT = new Client();
  global.LOGGER = logger;
  global.COMMANDS = new Map();
  global.GUILDS = new Map();
  setupPlayer();
  Object.keys(commands).forEach((key) => {
    global.COMMANDS.set(key, commands[key]);
  });
};
