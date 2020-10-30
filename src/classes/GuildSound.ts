import {
  DMChannel, NewsChannel, TextChannel, VoiceChannel, VoiceConnection,
} from 'discord.js';
import { Readable } from 'stream';
import ytdl from 'ytdl-core';
import BotPallete from '../lib/pallete';
import sendEmbedMessage from '../lib/sendEmbedMessage';
import musicMetadata from '../types/musicMetadata';

export default class GuildSound {
      songs:musicMetadata[]=[]

      songPlaying:musicMetadata={}

      isSBPlaying=false

      isSongPlaying=false

      voiceChannel:VoiceChannel|null=null

      VoiceCon:VoiceConnection|null=null

      membersNumber=0

      textChannel:TextChannel|DMChannel|NewsChannel|null=null

      retrys=0

      streamRetry:any

      async joinVoiceChannel(voiceChannel:VoiceChannel) {
        this.voiceChannel = voiceChannel;
        this.membersNumber = voiceChannel.members.size;
        await this.connectVoiceChannel(voiceChannel);
      }

      async setTextChannel(channel:TextChannel|DMChannel|NewsChannel) {
        this.textChannel = channel;
      }

      async enqueue(song:musicMetadata|musicMetadata[]) {
        this.songs = this.songs.concat(song);
      }

      async dequeue(index?:number) {
        if (index) {
          return this.songs.splice(index + 1, 1);
        }
        return this.songs.shift();
      }

      async stopAudio() {
        if (this.VoiceCon?.dispatcher !== null) {
          this.VoiceCon?.dispatcher.destroy();
        }
        this.voiceChannel?.leave();
        this.isSongPlaying = false;
        this.isSBPlaying = false;
        this.voiceChannel = null;
        this.VoiceCon = null;
      }

      async skipSong(shouldSpeak:boolean = true) {
        await this.shiftSong(this, shouldSpeak);
      }

      async playSong(song:musicMetadata) {
        if (this.isSongPlaying) {
          this.enqueue(song);
          return true;
        }

        this.songPlaying = song;
        this.isSongPlaying = true;
        this.playAudio(await this.findStream(song));
        return false;
      }

      // eslint-disable-next-line class-methods-use-this
      async findStream(song:musicMetadata):Promise<Readable | null> {
        if (song.link === undefined) return null;
        // eslint-disable-next-line no-return-await
        return ytdl(song.link, { filter: 'audioonly', quality: 'highestaudio' });
      }

      private async playAudio(stream:any) {
        if (this.VoiceCon !== null) {
          this.streamRetry = stream;
          this.VoiceCon.play(stream)
            .on('finish', () => this.shiftSong(this))
            .on('error', (error) => {
              global.LOGGER.error(error.message);
              sendEmbedMessage({
                color: BotPallete.error, channel: msg.channel, title: '', message: 'An error has ocurred, skiping to next song',
              });
              this.shiftSong(this);
            });
        }
      }

      private async connectVoiceChannel(voiceChannel:VoiceChannel) {
        this.VoiceCon = await voiceChannel.join();
      }

      // eslint-disable-next-line class-methods-use-this
      private async shiftSong(guild:GuildSound, sholdSpeak:boolean = true) {
        this.retrys = 0;
        if (guild.songs.length !== 0) {
          const nextSong = guild.songs.shift();
          if (nextSong !== undefined) {
          // eslint-disable-next-line no-param-reassign
            guild.songPlaying = nextSong;
            if (nextSong.link !== undefined && guild.textChannel !== null) {
              if (sholdSpeak) {
                await sendEmbedMessage({
                  color: BotPallete.info, channel: guild.textChannel, title: `Playing song from queue: ${nextSong.title}`, message: '',
                });
              }

              guild.playAudio(await guild.findStream(nextSong));
            }
          }
          return;
        }

        guild.stopAudio();
      }
}
