/* eslint-disable no-await-in-loop */
import { Message } from 'discord.js';
import GuildSound from '../../classes/GuildSound';
import songFinder from '../../lib/songFinder';
import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

async function play(msg:Message, args:string[]):Promise<boolean> {
  try {
    const songString = args.join(' ');

    const music = await songFinder(songString);

    if (music.length === 0) {
      await sendEmbedMessage({ color: BotPallete.error, channel: msg.channel, message: 'I did not found any songs' });
      return true;
    }

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
    let guild = global.GUILDS.get(msg.guild.id);

    if (!guild) {
      guild = new GuildSound();
      global.GUILDS.set(msg.guild.id, guild);
    }

    if (guild.isSBPlaying) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I am playing a sound from soundboard right now' });
      return true;
    }

    if (!guild.voiceChannel) {
      if (!msg.member.voice.channel) {
        await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: `You must be in a voice channel ${msg.author.username}` });
        return true;
      }

      await guild.joinVoiceChannel(msg.member.voice.channel);
      await guild.setTextChannel(msg.channel);
    }

    if (music.length === 1) {
      if (await guild.playSong(music[0])) {
        await sendEmbedMessage({
          color: BotPallete.info, channel: msg.channel, title: `Enqueued song: ${music[0].title}`, message: '',
        });
        return true;
      }
      await sendEmbedMessage({
        color: BotPallete.info, channel: msg.channel, title: `Playing song: ${music[0].title}`, message: '',
      });
      return true;
    }

    return true;
  } catch (error) {
    global.LOGGER.error(error.message + error.stack);
    return false;
  }
}

const command:Command = {
  commandName: 'play',
  description: 'Play musics!',
  async execute(msg, args) {
    for (let index = 0; index < 4; index += 1) {
      if (await play(msg, args)) return;
    }
    await sendEmbedMessage({ color: BotPallete.error, channel: msg.channel, message: 'I could not play this song, care to try again?' });
  },
};

export default command;
