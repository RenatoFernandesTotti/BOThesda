
const Discord = require('discord.js');
global.guilds = new Map()
global.bot = new Discord.Client();
global.logger = require('./lib/logger')
const commands = require('./commands/exporter')
const sendMessage = require('./lib/sendMessage')

require('dotenv').config()
let prefix = process.env.PREFIX




bot.commands = new Discord.Collection();


Object.keys(commands).map(key => {
  bot.commands.set(commands[key].name, commands[key]);
});

bot.on('ready', () => {
  try {
    logger.info(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({ activity: { name: `${prefix}help`, type: "WATCHING" }, status: 'idle' })
  } catch (error) {
    logger.error(error.stack)
  }
  
});

bot.on('message', msg => {
  try {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    let args = msg.content.replace(prefix, "").split(/ +/)
    let command = args.shift().toLowerCase()

    command = bot.commands.get(command)
    if (!command) {
      throw new Error('command not found')
    }
    command.execute(msg, args)
  } catch (error) {
    sendMessage({
      title: "Command not found",
      message: `Please type ${prefix}help to see available commands`,
      channel: msg.channel,
      color: 'info'
    })
  }
});



bot.login(process.env.AUTH_TOKEN);