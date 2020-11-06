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
    if (!global.PLAYER.isPlaying(msg)) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I\'m not playing anything to pause' });
      return;
    }

    global.PLAYER.pause(msg);
  },
};

export default command;
