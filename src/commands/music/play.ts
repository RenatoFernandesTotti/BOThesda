/* eslint-disable no-await-in-loop */
// import { Message } from 'discord.js';
// import GuildSound from '../../classes/GuildSound';
// import songFinder from '../../lib/songFinder';
import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'play',
  description: 'Play musics!',
  async execute(msg, args) {
    const songString = args.join(' ');

    if (!msg.member) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I could find out who you were, please try again' });
      return true;
    }
    if (songString === '') {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'No song was provided' });
      return true;
    }
    if (msg.guild === null) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I could not find your guild, please try again' });
      return true;
    }
    await global.PLAYER.play(msg, songString);

    return true;
  },
};

export default command;
