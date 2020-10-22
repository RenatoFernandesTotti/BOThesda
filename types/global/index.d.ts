/* eslint-disable no-unused-vars */
import {Logger} from 'winston';
import Client from '../../lib/classes/BotClient';

declare global {
     namespace NodeJS {
      interface Global {
            BOT:Client;
            GUILDS: Map<any, any>;
            LOGGER:Logger;
            db:any;
            fbAdm:any;
      }
    }
  }
