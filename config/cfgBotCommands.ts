import commands from '../commands';

module.exports = () => {
  global.BOT.commands = new Map();
  Object.keys(commands).map((key) => {
    global.BOT.commands.set(commands[key].name, commands[key]);
    global.LOGGER.info(`${commands[key].name} loaded`);
  });

 
};
