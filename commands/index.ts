try {
  let commands = {};
  commands = Object.assign(commands, require('./sounds'));
  commands = Object.assign(commands, require('./util'));
  commands = Object.assign(commands, require('./misc'));
  commands = Object.assign(commands, require('./rpg'));

  export default commands;
} catch (error) {
  global.LOGGER.error(error);
}
