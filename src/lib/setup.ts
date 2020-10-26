import { Client } from 'discord.js';
import { config } from 'dotenv';
import logger from './logger';
import commands from '../commands';

// DotEnv config

export default () => {
  config();

  // Setup for global variables
  // checkk the index.d.ts in types/global for reference
  global.BOT = new Client();
  global.LOGGER = logger;
  global.COMMANDS = new Map();
  Object.keys(commands).forEach((key) => {
    global.COMMANDS.set(key, commands[key]);
  });
};
