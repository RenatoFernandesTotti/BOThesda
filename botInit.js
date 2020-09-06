'use strict'
try {
  global.logger = require('./lib/logger')
  const Discord = require('discord.js');
  require('dotenv').config()
  global.guilds = new Map()
  global.bot = new Discord.Client();
  
  const prefix = process.env.PREFIX

  require('./config')()



  bot.on('ready', _ => {
    try {

      logger.info(`Logged in as ${bot.user.tag}!`);
      bot.user.setPresence({
        activity: {
          name: `${prefix}help`,
          type: "WATCHING"
        },
        status: 'online'
      })
    } catch (error) {
      logger.emerg(error.stack)
    }

  });

  bot.on('message', async msg => {
    try {
      if (!msg.content.startsWith(prefix)) return;
      if (msg.author.bot) return;

      let args = msg.content.replace(prefix, "").split(/ +/)
      let command = args.shift().toLowerCase()
      command = bot.commands.get(command)
      if (!command) {
        throw new TypeError('command not found')
      }
      await command.execute(msg, args)
    } catch (error) {

      if (error.message === "command not found") {
        logger.notice(error.message)
        await bot.say({
          title: "Command not found",
          message: `Please type ${prefix}help to see available commands`,
          channel: msg.channel,
          color: 'error'
        })
        return
      }

      await bot.say({
        title: "Err0r",
        message: error.stack,
        channel: msg.channel,
        color: 'error'
      })
      logger.emerg(error.stack)
    }
  });
  bot.login(process.env.AUTH_TOKEN);
} catch (error) {
  logger.emerg(error.stack)
}