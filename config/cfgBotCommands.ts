const { loggers } = require('winston');

module.exports = (_) => {
  const commands = require('../commands');
  global.BOT.commands = new Map();
  Object.keys(commands).map((key) => {
    global.BOT.commands.set(commands[key].name, commands[key]);
    logger.info(`${commands[key].name} loaded`);
  });

  global.BOT.say = require('../lib/sendEmbedMessage');
};
