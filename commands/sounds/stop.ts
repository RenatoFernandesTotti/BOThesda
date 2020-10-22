import {Message} from 'discord.js';

module.exports = {
  name: 'stop',
  description: 'Stop all music',
  execute: async function(msg:Message) {
    try {
      const guild = global.GUILDS.get(msg.guild?.id);
      if (!guild || !(guild.isPlaying || guild.soundBoardPLaying)) {
        global.BOT.speak({
          channel: msg.channel,
          message: 'No Songs to stop',
        });
        return;
      }
      global.BOT.speak({
        title: 'Stoping all sounds ⏹️',
        channel: msg.channel,
      });
      guild.songs = [];
      guild.stopAudio();
    } catch (error) {
      throw error;
    }
  },
};
