import {Message} from 'discord.js';

export default {
  name: 'skip',
  description: 'Skip one music',
  execute: async function(msg:Message ) {
    try {
      const guild = global.GUILDS.get(msg.guild?.id);
      if (!guild || !guild.isPlaying) {
        global.BOT.speak({
          channel: msg.channel,
          message: 'No Songs to skip',
        });
        return;
      }
      if (guild.songs.length !== 0) {
        global.BOT.speak({
          title: 'Skiping song ⏩',
          channel: msg.channel,
        });
      }

      guild.nextSong();
    } catch (error) {
      throw error;
    }
  },
};
