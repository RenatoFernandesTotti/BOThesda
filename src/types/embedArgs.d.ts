import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import BotPallete from 'lib/pallete';

export default interface embedArgs{
    title?:string,
    color?:BotPallete,
    message?:string,
    channel:TextChannel|NewsChannel|DMChannel,
};
