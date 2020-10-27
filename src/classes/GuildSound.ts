import { VoiceChannel, VoiceConnection } from 'discord.js';
import { InternalSymbolName } from 'typescript';
import ytdl from 'ytdl-core';
import musicMetadata from '../types/musicMetadata';

export default class GuildSound {
     songs:musicMetadata[]=[]

     songPlaying:musicMetadata={}

     isSBPlaying=false

     isSongPlaying=false

     voiceChannel:VoiceChannel|null=null

     VoiceCon:VoiceConnection|null=null

    membersNumber=0

    async joinVoiceChannel(voiceChannel:VoiceChannel) {
      this.voiceChannel = voiceChannel;
      this.membersNumber = voiceChannel.members.size;
      await this.connectVoiceChannel(voiceChannel);
    }

    async enqueue(song:musicMetadata) {
      this.songs.push(song);
    }

    async dequeue(index?:number) {
      if (index) {
        return this.songs.splice(index + 1, 1);
      }
      return this.songs.shift();
    }

    async stopAudio() {
      this.VoiceCon?.dispatcher.end();
      this.voiceChannel?.leave();
      this.isSongPlaying = false;
      this.isSBPlaying = false;
      this.voiceChannel = null;
      this.VoiceCon = null;
    }

    async playSong(song:musicMetadata) {
      if (this.isSongPlaying) {
        this.enqueue(song);
      }
    }

    // eslint-disable-next-line class-methods-use-this
    async findStream(song:musicMetadata):InternalSymbolName.Reada {
      if (song.link === undefined) return;
      return ytdl(song.link);
    }

    private async playAudio(stream:any, callback:Function) {
      if (this.VoiceCon !== null) {
        this.VoiceCon.play(stream)
          .on('finish', callback())
          .on('error', (error) => {
            global.LOGGER.error(error);
            callback();
          });
      }
    }

    private async connectVoiceChannel(voiceChannel:VoiceChannel) {
      this.VoiceCon = await voiceChannel.join();
    }

    private async shiftSong() {
      if (this.songs.length !== 0) {
        const nextSong = this.songs.shift();
        if (nextSong !== undefined) {
          this.songPlaying = nextSong;
          if (nextSong.link !== undefined) {
            this.playAudio(this.findStream(nextSong), this.shiftSong);
          }
        }
        return;
      }

      this.stopAudio();
    }
}
