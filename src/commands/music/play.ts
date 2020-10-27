import { ifError } from 'assert';
import GuildSound from 'classes/GuildSound';
import songFinder from 'lib/songFinder';
import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'play',
  description: 'Play musics!',
  async execute(msg, args) {
    try {
      const songString = args.join(' ');

      if (!msg.member) {
        await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I could find out who you were, please try again' });
        return;
      }
      if (songString === '') {
        await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'No song was provided' });
        return;
      }
      if (msg.guild === null) {
        await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I could not find your guild, please try again' });
        return;
      }
      let guild = global.GUILDS.get(msg.guild.id);

      if (!guild) {
        guild = new GuildSound();
        global.GUILDS.set(msg.guild.id, guild);
      }

      if (guild.isSBPlaying) {
        await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I am playing a sound from soundboard right now' });
        return;
      }

      if (!guild.voiceChannel) {
        if (!msg.member.voice.channel) {
          await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: `You must be in a voice channel ${msg.author.username}` });
          return;
        }

        const music = await songFinder(songString);

        if (guild.isSongPlaying) {
          // todo queue
        } else {
          await guild.joinVoiceChannel(msg.member.voice.channel);
        }
      } else {

      }
    } catch (error) {
      global.LOGGER.error(error);
    }
  },
};

export default command;
