import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import pallete from 'lib/colorPallete';

interface sendEmbedArgs{
    title?:string,
    color?:pallete,
    message:string,
    channel:TextChannel|DMChannel|NewsChannel
  }

export default sendEmbedArgs;
