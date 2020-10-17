import { MessageEmbed } from 'discord.js';
import { sendEmbedArgs } from 'types/embed';

import pallete from './colorPallete';

// eslint-disable-next-line consistent-return
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
