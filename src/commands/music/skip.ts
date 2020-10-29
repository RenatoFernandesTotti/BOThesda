import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'skip',
  description: 'Skip musics!',
  async execute(msg, args) {
    if (msg.guild === null) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'Something went wrong, please try again' });
      return;
    }
    const guild = global.GUILDS.get(msg.guild.id);

    if (!guild) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'Server not found, please try again' });
      return;
    }
    if (!guild.isSBPlaying && !guild.isSongPlaying) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I\'m not playing anything to skip' });
      return;
    }

    const music = guild.songs;
    if (args.length !== 0) {
      const indexOfJump = Number.parseInt(args[0], 10);
      if (indexOfJump < 0) {
        await sendEmbedMessage({
          color: BotPallete.warn, channel: msg.channel, title: 'Sorry negatives numbers are not supported', message: '',
        });
        return;
      }
      if (music.length < indexOfJump) {
        await sendEmbedMessage({
          color: BotPallete.warn, channel: msg.channel, title: 'Sorry your number is not on the queue', message: '',
        });
        return;
      }

      for (let index = 0; index < indexOfJump; index += 1) {
        // eslint-disable-next-line no-await-in-loop
        await guild.skipSong(false);
      }
      await sendEmbedMessage({
        color: BotPallete.info, channel: msg.channel, title: `Playing ${guild.songPlaying.title}`, message: '',
      });
      return;
    }

    await guild.skipSong();
  },
};

export default command;
