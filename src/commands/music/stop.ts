import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'stop',
  description: 'Stop musics!',
  async execute(msg) {
    if (!global.PLAYER.isPlaying(msg)) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I\'m not playing anything to stop' });
      return;
    }

    global.PLAYER.stop(msg);
  },
};

export default command;
