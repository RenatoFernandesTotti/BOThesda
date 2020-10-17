import { Client, ClientOptions } from 'discord.js';
import { command } from 'types/command';
import sendMessage from '../sendEmbedMessage';
import rawCommands from '../../commands';

class BotClient extends Client {
    commands!: Map<string, command>;

    constructor(options?:ClientOptions) {
      super(options);
      
    }

    readonly speak = sendMessage
}

export default BotClient;
