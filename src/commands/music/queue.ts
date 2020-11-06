import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'queue',
  description: 'list all musics to be played',
  async execute(msg) {
    const queue = global.PLAYER.getQueue(msg);

    if (queue === undefined || queue.tracks.length === 0) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'Nothing to shown in queue' });
      return;
    }

    let message = '';
    let i = 1;

    queue.tracks.forEach((trk) => {
      message += `${i}:${trk.title}\n`;
      i += 1;
    });

    await sendEmbedMessage({
      color: BotPallete.info, channel: msg.channel, title: '', message,
    });
  },
};

export default command;
