import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'play',
  description: 'Play musics!',
  async execute(msg, args) {
    try {
      const songString = args.join(' ');

      if (songString === '') {
        await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'No song was provided' });
        return;
      }

      global.LOGGER.info(`${msg.content}:${args}`);
    } catch (error) {
      global.LOGGER.error(error);
    }
  },
};

export default command;
