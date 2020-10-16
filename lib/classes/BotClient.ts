import { Client, ClientOptions } from 'discord.js';
import sendMessage from '../sendEmbedMessage';
import rawCommands from '../../commands';

class BotClient extends Client {
    commands :Map<string, any>

    constructor(options?:ClientOptions) {
      super(options);
      Object.keys();
      this.commands;
    }

    readonly speak = sendMessage
}

export default BotClient;
