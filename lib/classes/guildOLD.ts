import {
  DMChannel, Message, NewsChannel, TextChannel, VoiceChannel, VoiceConnection,
} from 'discord.js';

import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import ytpl from 'ytpl';
import { metaData } from 'types/song';
import pallete from 'lib/colorPallete';
// import queue from '../../commands/sounds/queue';

export default class Guild {
    // properties
    songs:metaData[] = []

    songPlaying:metaData = {}

    soundBoardPLaying!:boolean

    voiceChannel!:VoiceChannel|null

    textChannel!:TextChannel|DMChannel|NewsChannel

    voiceCon? :VoiceConnection

    isPlaying!:boolean

    members!:number

    // constructor
    constructor(msg:Message) {
      try {
        // User was not in a voice channel
        if (!msg.member) {
          global.BOT.speak({
            channel: msg.channel,
            message: 'I could not find how you are, please try again',
          });
          return;
        }
        if (!msg.member.voice.channel) {
          global.BOT.speak({
            title: `You must be in a voice channel ${msg.member.displayName}`,
            channel: msg.channel,
          });
          return;
        }
        this.voiceChannel = null;
        this.textChannel = msg.channel;
        this.members = 0;
        this.isPlaying = false;
        this.soundBoardPLaying = false;
      } catch (error) {
        global.BOT.speak({
          channel: msg.channel,
          title: 'An error has occured',
          message: 'Please try again',
        });
        global.LOGGER.error(`${error.message}\n${error.stack}`);
      }
    }

    async joinVoiceChannel() {
      this.voiceCon = await this.voiceChannel.join();
    }

    // If song was URL playlist directly and get the video title, if not,
    // search for it and get the songData
    async play(song:string, shoudSayQueued = true, msg:Message) {
      try {
        let songData:metaData = {};
        let isplaylist = false;
        if (ytdl.validateURL(song)) {
          if (song.includes('list')) {
            songData = await this.getPlaylist(song);
            isplaylist = true;
          } else {
            const item = await ytdl.getBasicInfo(song);
            songData.title = item.videoDetails.title;
            songData.link = song;
          }
        } else {
          const songStr = song;
          let search = await ytsr(song, {
            limit: 1,
          });
          if (search.items.length === 0) {
            const i = 0;

            do {
              // eslint-disable-next-line no-await-in-loop
              search = await ytsr(songStr, {
                limit: 1,
              });
            } while (i < 5 && search.items.length === 0);

            if (search.items.length === 0) {
              await global.BOT.speak({
                color: pallete.warning,
                message: "I didn't find any songs",
                channel: this.textChannel,
              });
              if (!this.isPlaying) {
                await this.stopAudio();
              }
              return;
            }
          }

          if (search.items[0].type === 'playlist') {
            isplaylist = true;
            songData = await this.getPlaylist(search.items[0].link);
          } else {
            search.items = search.items.filter((it) => it.type === 'video');
            if (search.items.length === 0) {
              await global.BOT.speak({
                color: pallete.warning,
                message: "I didn't find any songs",
                channel: this.textChannel,
              });
              if (!this.isPlaying) {
                await this.stopAudio();
              }
              return;
            }
            songData.title = search.items[0].title;
            songData.link = search.items[0].link;
          }
        }

        if (!this.isPlaying) {
          this.songPlaying = songData;
          await this.playAudio(songData.link, songData.title);
          if (isplaylist) queue.execute(msg);
        } else {
          if (shoudSayQueued) {
            await global.BOT.speak({
              title: 'Queued 📜',
              message: songData.title,
              color: 'sucess',
              channel: this.textChannel,
            });
          }

          this.songs.push({
            title: songData.title,
            link: songData.link,
          });
        }
      } catch (error) {
        global.LOGGER.error(`${error.message}\n${error.stack}`);
        global.BOT.speak({
          title: 'Error',
          message: 'Please try again, something went wrong while I fetched de music',
          channel: this.textChannel,
        });

        if (!this.isPlaying) {
          await this.stopAudio();
        }
      }
    }

    async playAudio(url, name) {
      try {
        this.isPlaying = true;

        await global.BOT.speak({
          title: 'Playing ▶️',
          message: name,
          color: pallete.sucess,
          channel: this.textChannel,
        });

        this.voiceCon.play(ytdl(url, {
          requestOptions: {
            headers: {
              Cookie: process.env.COOKIE,
            },
          },
          filter: 'audioonly',
          quality: 'highestaudio',
        }))
          .on('finish', async (_) => {
            this.nextSong();
            if (this.songs.length === 0) {
              await global.BOT.speak({
                message: 'Finished playing all songs 💽',
                channel: this.textChannel,
              });
            }
          })
          .on('error', async (error) => {
            global.LOGGER.error(`${error.message}\n${error.stack}`);
            if (error.message.includes('416') || error.message.includes('429')) {
              global.BOT.speak({
                title: 'Error',
                message: 'Something went wrong with the music',
                channel: this.textChannel,
              });
              this.nextSong();
              return;
            }
            this.stopAudio();

            global.BOT.speak({
              title: 'Error',
              message: 'Something went wrong',
              channel: this.textChannel,
            });
          });
      } catch (error) {
        global.LOGGER.error(`${error.message}\n${error.stack}`);

        global.BOT.speak({
          title: 'Error',
          message: error,
          channel: this.textChannel,
        });

        if (!this.isPlaying) {
          this.stopAudio();
        }
      }
    }

    async playSoundBoard(url:string) {
      try {
        if (this.voiceCon) {
          this.soundBoardPLaying = true;
          await this.voiceCon.play(url).on('finish', async (_) => {
            await this.stopAudio();
          });
        }
      } catch (error) {
        global.LOGGER.error(error);
      }
    }

    async stopAudio() {
      try {
        if ((this.voiceCon !== undefined) && (this.isPlaying || this.soundBoardPLaying)) {
          if (this.voiceCon.dispatcher !== undefined) this.voiceCon.dispatcher.end();
          await this.voiceChannel.leave();
          this.voiceChannel = null;
          this.isPlaying = false;
          this.soundBoardPLaying = false;
        }
        return;
      } catch (error) {
        global.LOGGER.error(error);
      }
    }

    async getPlaylist(song:string) {
      const playlist = await ytpl(song);
      const songData:metaData = {};
      playlist.items = playlist.items.filter((sg) => sg.title !== '[Deleted video]' && sg.title !== '[Private video]');
      let i = true;

      await global.BOT.speak({
        channel: this.textChannel,
        message: `Playing ${playlist.title} playlist from youtube`,
      });

      playlist.items.forEach((song) => {
        if (i && !this.isPlaying) {
          songData.title = song.title;
          songData.link = song.url;
          i = false;
          return;
        }
        this.songs.push({
          title: song.title,
          link: song.url,
        });
      });

      return songData;
    }

    async nextSong() {
      if (this.songs.length !== 0) {
        const info = this.songs.shift();
        this.songPlaying = info;

        this.playAudio(info.link, info.title);
        return;
      }
      await this.stopAudio();
    }
}
