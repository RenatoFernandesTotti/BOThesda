import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import pallete from '../lib/colorPallete';

export interface sendEmbedArgs{
      title?:string,
      color?:pallete,
      message?:string,
      channel:TextChannel|DMChannel|NewsChannel
    }

export interface test{
      nmber:number
    }
