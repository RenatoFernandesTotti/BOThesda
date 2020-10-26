import { VoiceChannel, VoiceConnection } from 'discord.js';
import musicMetadata from '../types/musicMetadata';

export default class GuildSound {
    songs:musicMetadata[]

    songPlaying:musicMetadata

    isSBPlaying=false

    isSongPlaying=false

    voiceChannel:VoiceChannel|null

    VoiceCon:VoiceConnection|null

    membersNumber=0
}
