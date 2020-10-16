const Discord = require('discord.js');
require('./config')();

try {
  global.GUILDS = new Map();
  global.BOT = new Discord.Client();

  const prefix = process.env.PREFIX;

  global.BOT.on('ready', () => {
    try {
      logger.info(`Logged in as ${global.BOT.user.tag}!`);
      global.BOT.user.setPresence({
        activity: {
          name: `${prefix}help`,
          type: 'WATCHING',
        },
        status: 'online',
      });
    } catch (error) {
      logger.emerg(error.stack);
    }
  });

  global.BOT.on('message', async (msg) => {
    try {
      if (!msg.content.startsWith(prefix)) return;
      if (msg.author.bot) return;

      const args = msg.content.replace(prefix, '').split(/ +/);
      let command = args.shift().toLowerCase();
      command = global.BOT.commands.get(command);

      if (!command) {
        await global.BOT.say({
          title: 'Command not found',
          message: `Please type ${prefix}help to see available commands`,
          channel: msg.channel,
          color: 'error',
        });
        return;
      }

      logger.info(`Bot called
      Guild:${msg.guild.name}
      Author:${msg.author.username}
      Command:${command.name}
      Args:${args}
      `);

      await command.execute(msg, args);
    } catch (error) {
      await global.BOT.say({
        title: 'Err0r',
        message: error.stack,
        channel: msg.channel,
        color: 'error',
      });
      logger.emerg(error.stack);
    }
  });

  global.BOT.on('voiceStateUpdate', (oldP, newP) => {
    const guild = guilds.get(newP.guild.id);

    if (!guild || !guild.isPlaying) return;

    if (guild.voiceChannel !== newP.channel) {
      guild.members--;
    } else {
      guild.members++;
    }
    if (guild.members === 1) {
      global.BOT.say({
        title: 'I was alone so I cleared the queue and left the channel',
        color: 'info',
        channel: guild.textChannel,
      });
      guild.songs = [];
      guild.stopAudio();
    }
  });

  global.BOT.login(process.env.AUTH_TOKEN);
} catch (error) {
  console.log('Major error:', error);
}
