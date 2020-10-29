import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'stop',
  description: 'Stop musics!',
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
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I\'m not playing anything to stop' });
      return;
    }

    guild.stopAudio();
  },
};

export default command;
