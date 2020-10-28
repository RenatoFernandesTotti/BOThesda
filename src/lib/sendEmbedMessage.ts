import { MessageEmbed } from 'discord.js';
import embedArgs from '../types/embedArgs';
import BotPallete from './pallete';

export default async ({
  title = '',
  color = BotPallete.info,
  message = 'Place holder',
  channel,
}:embedArgs) => {
  const embed = new MessageEmbed();
  embed.setTitle(title)
    .setColor(color)
    .setDescription(message);

  return channel.send(embed);
};
