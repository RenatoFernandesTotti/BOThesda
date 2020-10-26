import { Message } from 'discord.js';

export default interface Command{
            commandName:string
            description:string,
            execute(msg:Message, args:string[]):Promise<any>
        }
