import { Client } from 'discord.js';
import { Logger } from 'winston';

declare global {
    namespace NodeJS {
      interface Global {
            BOT:Client;
            GUILDS: Map<any, any>;
            LOGGER:Logger;
      }
    }
  }
