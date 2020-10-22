import { Message } from 'discord.js';
import GuildAudio from 'lib/classes/GuildAudio.ts';

export default {
  name: 'sb',
  // eslint-disable-next-line max-len
  description: 'Play/register/delete/list audio from soundboard, just use sb <command>, to play a sound just use sb <sound name>',
  async execute(msg:Message, args:string[]) {
    try {
      if (!args[0]) {
        global.BOT.speak({
          message: 'No sound provided',
          channel: msg.channel,
        });
        return;
      }
      let guild;
      let sound;
      guild = global.GUILDS.get(msg.guild?.id);
      if (!guild) {
        guild = new GuildAudio(msg);
        global.GUILDS.set(msg.guild?.id, guild);
      }

      if (guild.isPlaying) {
        global.BOT.speak({
          message: 'Im playing music right now, stop it to use the sound board',
          channel: msg.channel,
        });
        return;
      }

      let docs;
      let list;
      switch (args[0]) {
        case 'register':
          if (!msg.attachments.size) {
            global.BOT.speak({
              channel: msg.channel,
              message: 'No file provided',
            });
            return;
          }
          // eslint-disable-next-line prefer-destructuring
          sound = msg.attachments.entries().next().value[1];
          docs = (await global.db.collection(msg.guild?.id)
            .where('name', '==', sound.name.replace(/\.[^/.]+$/, ''))
            .get()).docs;
          if (docs.length !== 0) {
            global.BOT.speak({
              channel: msg.channel,
              message: 'Sound with that name already exists',
            });
            return;
          }
          await global.db.collection(msg.guild?.id).doc().set({
            name: sound.name.replace(/\.[^/.]+$/, ''),
            url: sound.url,
          });
          break;
        case 'delete':
          args.shift();
          docs = (await global.db.collection(msg.guild?.id)
            .where('name', '==', args[0]).get())
            .docs;
          if (docs.length === 0) {
            global.BOT.speak({
              channel: msg.channel,
              message: 'There are no sounds with that name to delete',
            });
            return;
          }
          await global.db.collection(msg.guild?.id).doc(docs[0].id).delete();

        // eslint-disable-next-line no-fallthrough
        case 'list':
          sound = (await global.db.collection(msg.guild?.id).get()).docs;
          if (sound.length === 0) {
            global.BOT.speak({
              channel: msg.channel,
              message: 'there are no sounds for this server',
            });
            return;
          }
          sound.forEach((element) => {
            element = element.data();
            list += `${element.name}\n`;
          });

          global.BOT.speak({
            channel: msg.channel,
            title: 'Sounds list',
            message: list,
          });
          break;
        default:
          sound = (await global.db.collection(msg.guild.id).where('name', '==', args.shift()).get()).docs[0];

          if (!sound) {
            global.BOT.speak({
              channel: msg.channel,
              message: 'I did not find any sounds with that name',
            });
            return;
          }
          sound = sound.data();
          await guild.contract(msg);
          guild.playSoundBoard(sound.url);
          break;
      }
    } catch (error) {
      global.LOGGER.error(error);
    }
  },
};
