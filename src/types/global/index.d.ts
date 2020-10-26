import GuildSound from 'classes/GuildSound';
import guildSound from 'classes/GuildSound';
import { Client } from 'discord.js';
import { Logger } from 'winston';
import Command from '../commands';

declare global{
    namespace NodeJS{
        interface Global{
            BOT:Client,
            LOGGER:Logger,
            COMMANDS:Map<string, Command>,
            GUILDS:Map<string, GuildSound>
        }

    }
}
