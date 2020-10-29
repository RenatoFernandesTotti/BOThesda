import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'queue',
  description: 'list all musics to be played',
  async execute(msg) {
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
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I\'m not playing anything to pause' });
      return;
    }
    if (guild.VoiceCon === null) {
      await sendEmbedMessage({
        color: BotPallete.info, channel: msg.channel, title: '', message: 'Sorry, but i could not pause de music',
      });
      return;
    }

    if (guild.VoiceCon.dispatcher.paused) {
      await sendEmbedMessage({
        color: BotPallete.info, channel: msg.channel, title: '', message: 'Resuming',
      });
      guild.VoiceCon.dispatcher.resume();
      return;
    }

    await sendEmbedMessage({
      color: BotPallete.warn, channel: msg.channel, title: '', message: 'Pausing music, to resume use pause command again',
    });
    guild.VoiceCon.dispatcher.pause();
  },
};

export default command;
