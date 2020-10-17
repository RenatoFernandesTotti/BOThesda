import {
  DMChannel, Message, NewsChannel, TextChannel, VoiceChannel, VoiceConnection,
} from 'discord.js';

import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import ytpl from 'ytpl';
import { metaData } from 'types/song';
import pallete from 'lib/colorPallete';

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
            // Make contract to new guild
            this.voiceChannel = msg.member.voice.channel;
            this.textChannel = msg.channel;
            this.members = this.voiceChannel.members.size;
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
          if (this.voiceChannel !== null) {
            this.voiceCon = await this.voiceChannel.join();
          }
        }

        async playAudio(stream:any) {
          if (this.voiceCon !== undefined) {
            this.isPlaying = true;
            this.voiceCon.play(stream)
              .on('finish', async () => { await this.nextSong(); });
          }
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
          }
        }
}
