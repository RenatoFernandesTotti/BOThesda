global.logger = require('./lib/logger')
try {
  require('dotenv').config()
  const Discord = require('discord.js');
  global.guilds = new Map()
  global.bot = new Discord.Client();
  const commands = require('./commands/exporter')
  const sendEmbed = require('./classes/guild').say
  global.fbAdm = require("firebase-admin");
  const prefix = process.env.PREFIX


  fbAdm.initializeApp({
    credential: fbAdm.credential.cert(JSON.parse(process.env.FB_ADM_KEY)),
    databaseURL: "https://soundboardbot-ed2d4.firebaseio.com"
  });

  global.db=fbAdm.firestore()

  bot.commands = new Discord.Collection();
  Object.keys(commands).map(key => {
    bot.commands.set(commands[key].name, commands[key]);
  });

  bot.on('ready', () => {
    try {
      logger.info(`Logged in as ${bot.user.tag}!`);
      bot.user.setPresence({ activity: { name: `${prefix}help`, type: "WATCHING" }, status: 'online' })
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

      if (error.message === "command not found") {
        logger.notice(error.message)
        sendEmbed({
          title: "Command not found",
          message: `Please type ${prefix}help to see available commands`,
          channel: msg.channel,
          color: 'error'
        })
        return
      }
      sendEmbed({
        title: "Err0r",
        message: error.stack,
        channel: msg.channel,
        color: 'error'
      })
    }
  });



  bot.login(process.env.AUTH_TOKEN);
} catch (error) {
  logger.emerg(error.stack)
}
