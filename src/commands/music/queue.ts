import BotPallete from '../../lib/pallete';
import sendEmbedMessage from '../../lib/sendEmbedMessage';
import Command from '../../types/commands';

const command:Command = {
  commandName: 'queue',
  description: 'list all musics to be played',
  async execute(msg, args) {
    if (msg.guild === null) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'Something went wrong, please try again' });
      return;
    }
    const guild = global.GUILDS.get(msg.guild.id);

    if (!guild) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'Server not found, please try again' });
      return;
    }
    if (!guild.isSBPlaying && !guild.isSongPlaying) {
      await sendEmbedMessage({ color: BotPallete.warn, channel: msg.channel, message: 'I\'m not playing anything to show' });
      return;
    }

    const title:string = `Playing ${guild.songPlaying.title}`;

    if (guild.songs.length === 0) {
      if (args.length !== 0) {
        await sendEmbedMessage({
          color: BotPallete.warn, channel: msg.channel, title: '', message: 'There is  no queue to jump',
        });
      }
      await sendEmbedMessage({
        color: BotPallete.info, channel: msg.channel, title, message: '',
      });
      return;
    }
    const music = guild.songs;

    let body:string = '';

    for (let index = 0; index < music.length; index += 1) {
      body += `${index + 1}:${music[index].title}\n`;
    }

    await sendEmbedMessage({
      color: BotPallete.info, channel: msg.channel, title, message: body,
    });
  },
};

export default command;
