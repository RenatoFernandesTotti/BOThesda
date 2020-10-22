import { Client } from 'discord.js';

declare global{
    namespace NodeJS{
        interface Global{
            BOT:Client
        }
    }
}
