try {
  global.logger = require('./lib/logger')
  const Discord = require('discord.js');

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
        await bot.say({
          title: "Command not found",
          message: `Please type ${prefix}help to see available commands`,
          channel: msg.channel,
          color: 'error'
        })
        return
      }

      logger.info(`Bot called
      Guild:${msg.guild.name}
      Author:${msg.author.username}
      Command:${command.name}
      Args:${args}
      `)

      await command.execute(msg, args)
    } catch (error) {
      await bot.say({
        title: "Err0r",
        message: error.stack,
        channel: msg.channel,
        color: 'error'
      })
      logger.emerg(error.stack)
    }
  });


  bot.on('voiceStateUpdate', (oldP, newP) => {
    let guild = guilds.get(newP.guild.id)

    if (!guild || !guild.isPlaying) return

    if (guild.voiceChannel !== newP.channel) {
      guild.members--
    } else {
      guild.members++
    }
    if (guild.members === 1) {
      bot.say({
        title: `I was alone so I cleared the queue and left the channel`,
        color: 'info',
        channel: guild.textChannel
      })
      guild.songs = []
      guild.stopAudio()
    }
  })

  bot.login(process.env.AUTH_TOKEN);
} catch (error) {
  console.log('Major error:', error)
}