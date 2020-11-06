import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'skip',
  description: 'Skip musics!',
  async execute(msg) {
    if (msg.guild === null) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'Something went wrong, please try again' });
      return;
    }
    global.PLAYER.skip(msg);
  },
};

export default command;
