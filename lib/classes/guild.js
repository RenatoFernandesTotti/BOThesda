const send = require('../sendEmbedMessage');
const ytdl = require('ytdl-core')
const ytsr = require('ytsr');
module.exports = class Guild {

    //properties
    songs = []
    songPlaying = {}
    soundBoardPLaying = false
    voiceChannel = null
    textChannel = null
    voiceCon = null
    isPlaying = false
    members = 0

    //constructor
    constructor() {}


    async contract(msg) {
        try {
            //User was not in a voice channel
            if (!msg.member.voice.channel) {
                let reponse = await bot.say({
                    title: `You must be in a voice channel ${msg.member.displayName}`,
                    color: '#a83232',
                    channel: msg.channel
                })
                reponse.react('😖')
                return
            }
            this.voiceChannel = msg.member.voice.channel
            this.voiceCon = await this.voiceChannel.join()
            this.textChannel = msg.channel
            this.members = this.voiceChannel.members.size
        } catch (error) {
            await bot.say({
                channel: msg.channel,
                title: 'An error has occured',
                message: "Please try again"
            })
            throw error
        }
    }


    //If song was URL playit directly and get the video title, if not,
    //search for it and get the metadata
    async play(song, shoudSayQueued = true) {
        try {
            let metaData = {}
            if (ytdl.validateURL(song)) {
                metaData.title = (await ytdl.getBasicInfo(song)).videoDetails.title
                metaData.link = song
            } else {
                song = await ytsr(song, {
                    limit: 1
                })
                song.items = song.items.filter(it => {
                    return it.type === "video"
                })
                if (song.items.length === 0) {
                    await bot.say({
                        color: "error",
                        message: "I didn't find any songs",
                        channel: this.textChannel
                    })
                    if (!this.isPlaying) {
                        this.voiceChannel.leave()
                        this.voiceChannel = null
                    }
                    return
                }
                metaData.title = song.items[0].title
                metaData.link = song.items[0].link

            }

            if (!this.isPlaying) {
                this.songPlaying = metaData
                this.playAudio(metaData.link, metaData.title)
            } else {
                if (shoudSayQueued) {

                    await bot.say({
                        title: `Queued 📜`,
                        message: metaData.title,
                        color: 'sucess',
                        channel: this.textChannel
                    })
                }

                this.songs.push({
                    title: metaData.title,
                    link: metaData.link
                })
            }
        } catch (error) {
            throw error
        }

    }

    async playAudio(url, name) {
        try {
            this.isPlaying = true

            await bot.say({
                title: `Playing ▶️`,
                message: name,
                color: 'sucess',
                channel: this.textChannel
            })


            this.voiceCon.play(ytdl(url, {
                    requestOptions: {
                        headers: {
                            'Cookie': process.env.COOKIE
                        }
                    },
                    filter: 'audioonly',
                    quality:"highestaudio"
                }))
                .on('finish', _ => {
                    if (this.songs.length !== 0) {
                        let info = this.songs.shift()
                        this.songPlaying = info

                        this.playAudio(info.link, info.title)
                        return
                    }

                    bot.say({
                        message: "Finished playing all songs 💽",
                        channel: this.textChannel
                    })
                    this.voiceChannel.leave()
                    this.voiceChannel = null
                    this.isPlaying = false
                })
                .on('error', async (error) => {
                    await this.voiceChannel.leave()
                    this.voiceChannel = null
                    this.isPlaying = false
                    bot.say({
                        title: "Error",
                        message: error.stack,
                        channel: this.textChannel
                    })
                })
        } catch (error) {
            throw error
        }

    }

    async playSoundBoard(url) {
        try {
            if (!!this.voiceCon) {
                this.soundBoardPLaying = true
                await this.voiceCon.play(url).on('finish', async _ => {
                    await this.voiceChannel.leave()
                    this.soundBoardPLaying = false
                    this.voiceChannel = null
                })
            }
        } catch (error) {
            throw error
        }

    }

    async stopAudio() {
        try {
            if ((this.voiceCon !== null) && (this.isPlaying || this.soundBoardPLaying)) this.voiceCon.dispatcher.end()
        } catch (error) {
            throw error
        }
    }

}