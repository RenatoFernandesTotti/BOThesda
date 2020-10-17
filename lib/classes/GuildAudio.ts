import {
  Message, VoiceChannel, VoiceConnection,
} from 'discord.js';

import ytdl from 'ytdl-core';
// import ytsr from 'ytsr';
// import ytpl from 'ytpl';
import { metaData } from 'types/song';
// import pallete from 'lib/colorPallete';

export default class GuildAudio {
        // properties
        songs:metaData[] = []

        songPlaying:metaData = {}

        isSoundBoardPlaying!:boolean

        voiceChannel!:VoiceChannel|null

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

            // Make contract to new guild
            this.voiceChannel = null;
            this.members = 0;
            this.isPlaying = false;
            this.isSoundBoardPlaying = false;
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
          if (this.voiceChannel !== null) {
            this.voiceCon = await this.voiceChannel.join();
          }
        }

        async changeVoiceChannel(voiceChannel:VoiceChannel) {
          this.voiceChannel = voiceChannel;
          this.members = voiceChannel.members.size;
        }

        async playSoundBoard(url:string) {
          this.isSoundBoardPlaying = true;
          this.playAudio(url);
        }

        async playAudio(stream:any) {
          if (this.voiceCon !== undefined) {
            this.isPlaying = true;
            this.voiceCon.play(stream)
              .on('finish', async () => { await this.nextSong(); });
          }
        }

        async stopAudio() {
          this.voiceCon?.dispatcher.end();
          this.voiceChannel?.leave();
          this.isPlaying = false;
          this.isSoundBoardPlaying = false;
          this.voiceChannel = null;
        }

        async pauseAudio() {
          this.voiceCon?.dispatcher.pause();
        }

        async continueAudio() {
          this.voiceCon?.dispatcher.resume();
        }

        private async nextSong() {
          if (this.songs.length !== 0) {
            const nextSong = this.songs.shift();
            if (nextSong !== undefined) {
              this.songPlaying = nextSong;
              if (nextSong.link !== undefined) {
                this.playAudio(ytdl(nextSong.link, {
                  requestOptions: {
                    headers: {
                      Cookie: process.env.COOKIE,
                    },
                  },
                }));
              }
            }
            return;
          }

          this.stopAudio();
        }
}
