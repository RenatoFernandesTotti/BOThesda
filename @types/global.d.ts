/* eslint-disable no-unused-vars */
import { Logger } from 'winston';
import Client from '../lib/classes/BotClient';

declare global {
    // eslint-disable-next-line import/prefer-default-export
     namespace NodeJS {
      interface Global {
            BOT:Client;
            GUILDS: Map<any, any>;
            LOGGER:Logger;
      }
    }
  }

export default global;
