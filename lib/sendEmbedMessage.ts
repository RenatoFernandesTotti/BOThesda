import sendEmbedArgs from '@types/sendEmbedArgs.d';
import { MessageEmbed } from 'discord.js';
import pallete from './colorPallete';

export default async function sendEmbed({
  title = '',
  color = pallete.sucess,
  message = '',
  channel,
}:sendEmbedArgs) {
  try {
    const embed = new MessageEmbed();
    embed.setTitle(title)
      .setColor(color)
      .setDescription(message);
    return await channel.send(embed);
  } catch (error) {
    global.LOGGER.error(error);
  }
}
