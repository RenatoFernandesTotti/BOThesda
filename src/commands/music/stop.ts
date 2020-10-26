import Command from '../../types/commands';

const command:Command = {
  commandName: 'stop',
  description: 'Stop musics!',
  async execute(msg, args) {
    global.LOGGER.info(`${msg.content}:${args}`);
    return 'doing!';
  },
};

export default command;
