import {Message} from 'discord.js';
import pallete from 'lib/colorPallete';

export default {
  name: 'queue',
  description: 'See next 10 queued music',
  execute: async function(msg:Message) {
    try {
      const guild = global.GUILDS.get(msg.guild?.id);
      if (!guild || !guild.isPlaying) {
        global.BOT.speak({
          channel: msg.channel,
          message: 'No Songs to show 🙁',
        });
        return;
      }

      let message =
                `Playing: **${guild.songPlaying.title}**\n`;

      if (guild.songs.length !== 0) {
        const limit = (guild.songs.length <= 10) ? guild.songs.length : 10;
        for (let index = 0; index < limit; index++) {
          message += `${index + 1}: ${guild.songs[index].title}\n`;
        }
      }
      global.BOT.speak({
        title: 'Queue 🎧',
        color: pallete.info,
        message: message,
        channel: msg.channel,
      });
    } catch (error) {
      throw error;
    }
  },
};
