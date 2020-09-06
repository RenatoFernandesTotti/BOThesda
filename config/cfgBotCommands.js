module.exports = _ => {
    const commands = require('../commands')
    bot.commands = new Map();
    Object.keys(commands).map(key => {
        bot.commands.set(commands[key].name, commands[key]);
    });
}