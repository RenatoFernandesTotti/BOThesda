
import { Player } from 'discord-player';
import { Client } from 'discord.js';
import { Logger } from 'winston';
import GuildSound from '../../classes/GuildSound';
import Command from '../commands';

declare global{
    namespace NodeJS{
        interface Global{
            BOT:Client,
            LOGGER:Logger,
            COMMANDS:Map<string, Command>,
            GUILDS:Map<string, GuildSound>,
            PLAYER:Player
        }

    }
}
