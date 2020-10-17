import { Message } from 'discord.js';
import GuildAudio from 'lib/classes/GuildAudio';
import pallete from 'lib/colorPallete';

module.exports = {
  name: 'play',
  description: 'Play music with name or URL',
  async execute(msg:Message, args:string[], shoudSayQueued = true) {
    let guild:GuildAudio;
    try {
      const song = args.join(' ');

      if (msg.member === null) {
        global.BOT.speak({
          channel: msg.channel,
          color: pallete.warning,
          message: 'I could not find who you are, please try again',
        });
        return;
      }

      // No args
      if (song === '') {
        await global.BOT.speak({
          title: 'No song provided',
          color: pallete.warning,
          channel: msg.channel,
        });
        return;
      }

      // try to get guild contract
      guild = global.GUILDS.get(msg.guild?.id);
      // if no guild was found create new contract
      if (!guild) {
        guild = new GuildAudio(msg);
        global.GUILDS.set(msg.guild?.id, guild);
      }
      if (guild.isSoundBoardPlaying) {
        global.BOT.speak({
          message: `I'm playing a sound in soundboard right now, plase stop\
                        it before with ${process.env.PREFIX}stop first`,
          channel: msg.channel,
        });
        return;
      }

      // if bot not in a voice channel then join
      if (!guild.voiceChannel) {
        if (!msg.member.voice.channel) {
          global.BOT.speak({
            title: `You must be in a voice channel ${msg.member.displayName}`,
            channel: msg.channel,
          });
          return;
        }
        await guild.changeVoiceChannel(msg.member?.voice.channel);
        await guild.joinVoiceChannel();
      } else if (guild.voiceChannel !== msg.member?.voice.channel) {
        global.BOT.speak({
          title: 'I\'m already in a voice channel',
          color: pallete.warning,
          channel: msg.channel,
        });
        return;
      }

      await guild.playAudio(song);

      return;
    } catch (error) {
      global.LOGGER.error(error);
    }
  },
};
