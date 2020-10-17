import pallete from 'lib/colorPallete';
import Client from './lib/classes/BotClient';

require('./config')();

try {
  global.GUILDS = new Map();
  global.BOT = new Client();

  const prefix = process.env.PREFIX;

  global.BOT.on('ready', () => {
    try {
      if (global.BOT.user !== null) {
        global.LOGGER.info(`Logged in as ${global.BOT.user.tag}!`);
        global.BOT.user.setPresence({
          activity: {
            name: `${prefix}help`,
            type: 'WATCHING',
          },
          status: 'online',
        });
      }
    } catch (error) {
      global.LOGGER.emerg(error.stack);
    }
  });

  global.BOT.on('message', async (msg) => {
    try {
      if (prefix !== undefined) {
        if (!msg.content.startsWith(prefix)) return;
        if (msg.author.bot) return;

        const args = msg.content.replace(prefix, '').split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (commandName === undefined) {
          global.BOT.speak({
            channel: msg.channel,
            message: 'I could not understand what you said, please try again',
          });
          return;
        }

        const command = global.BOT.commands.get(commandName);

        if (!command) {
          await global.BOT.speak({
            title: 'Command not found',
            message: `Please type ${prefix}help to see available commands`,
            channel: msg.channel,
            color: pallete.warning,
          });
          return;
        }

        global.LOGGER.info(`Bot called
        Guild:${msg.guild?.name}
        Author:${msg.author.username}
        Command:${command.name}
        Args:${args}
        `);

        await command.execute(msg, args);
      }
    } catch (error) {
      await global.BOT.speak({
        title: 'Err0r',
        message: error.stack,
        channel: msg.channel,
        color: pallete.warning,
      });
      global.LOGGER.emerg(error.stack);
    }
  });

  global.BOT.on('voiceStateUpdate', (oldP, newP) => {
    const guild = global.GUILDS.get(newP.guild.id);

    if (!guild || !guild.isPlaying) return;

    if (guild.voiceChannel !== newP.channel) {
      guild.members -= 1;
    } else {
      guild.members += 1;
    }
    if (guild.members === 1) {
      global.BOT.speak({
        title: 'I was alone so I cleared the queue and left the channel',
        color: pallete.info,
        channel: guild.textChannel,
      });
      guild.songs = [];
      guild.stopAudio();
    }
  });

  global.BOT.login(process.env.AUTH_TOKEN);
} catch (error) {
  global.LOGGER.emerg('Major error:', error);
}
