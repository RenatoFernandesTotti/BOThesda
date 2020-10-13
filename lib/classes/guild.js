const send = require('../sendEmbedMessage');
const ytdl = require('ytdl-core')
const ytsr = require('ytsr');
const ytpl = require('ytpl')
const queue = require('../../commands/sounds/queue')
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
            logger.error(error.message + '\n' + error.stack)
        }
    }


    //If song was URL playlist directly and get the video title, if not,
    //search for it and get the metadata
    async play(song, shoudSayQueued = true, msg) {
        try {
            let metaData = {}
            let isplaylist = false
            if (ytdl.validateURL(song)) {
                if (song.includes('list')) {
                    metaData = await this.getPlaylist(song)
                    isplaylist = true
                } else {

                    let item = await ytdl.getBasicInfo(song)
                    metaData.title = item.videoDetails.title
                    metaData.link = song
                }
            } else {
                let songStr = song
                song = await ytsr(song, {
                    limit: 1
                })
                if (song.items.length === 0) {
                    let i = 0

                    do {
                        song = await ytsr(songStr, {
                            limit: 1
                        })
                    } while (i < 5 && song.items.length === 0)

                    if (song.items.length === 0) {
                        await bot.say({
                            color: "error",
                            message: "I didn't find any songs",
                            channel: this.textChannel
                        })
                        if (!this.isPlaying) {
                            await this.stopAudio()
                        }
                        return
                    }

                }

                if (song.items[0].type === 'playlist') {
                    isplaylist = true
                    metaData = await this.getPlaylist(song.items[0].link)
                } else {

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
                            await this.stopAudio()
                        }
                        return
                    }
                    metaData.title = song.items[0].title
                    metaData.link = song.items[0].link
                }


            }

            if (!this.isPlaying) {
                this.songPlaying = metaData
                await this.playAudio(metaData.link, metaData.title)
                if (isplaylist) queue.execute(msg)
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
            logger.error(error.message + '\n' + error.stack)
            bot.say({
                title: "Error",
                message: "Please try again, something went wrong while I fetched de music",
                channel: this.textChannel
            })

            if (!this.isPlaying) {
                await this.stopAudio()
            }
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
                    quality: "highestaudio"
                }))
                .on('finish', async _ => {
                    this.nextSong()
                    if (this.songs.length === 0) {
                        await bot.say({
                            message: "Finished playing all songs 💽",
                            channel: this.textChannel
                        })
                    }
                })
                .on('error', async (error) => {
                    logger.error(error.message + '\n' + error.stack)
                    if (error.message.includes('416') || error.message.includes('429')) {
                        bot.say({
                            title: "Error",
                            message: "Something went wrong with the music",
                            channel: this.textChannel
                        })
                        this.nextSong()
                        return
                    }
                    this.stopAudio()

                    bot.say({
                        title: "Error",
                        message: "Something went wrong",
                        channel: this.textChannel
                    })
                })
        } catch (error) {

            logger.error(error.message + '\n' + error.stack)

            bot.say({
                title: "Error",
                message: error,
                channel: this.textChannel
            })

            if (!this.isPlaying) {
                this.stopAudio()
            }
        }

    }

    async playSoundBoard(url) {
        try {
            if (!!this.voiceCon) {
                this.soundBoardPLaying = true
                await this.voiceCon.play(url).on('finish', async _ => {
                    await this.stopAudio()
                })
            }
        } catch (error) {
            throw error
        }

    }

    async stopAudio() {
        try {
            if ((this.voiceCon !== null) && (this.isPlaying || this.soundBoardPLaying)) {
                if (this.voiceCon.dispatcher != null) this.voiceCon.dispatcher.end()
                await this.voiceChannel.leave()
                this.voiceChannel = null
                this.isPlaying = false
                this.soundBoardPLaying = false
            }
            return
        } catch (error) {
            throw error
        }
    }


    async getPlaylist(song) {
        let playlist = await ytpl(song)
        var metaData = {}
        playlist.items = playlist.items.filter(sg => {
            return sg.title !== "[Deleted video]" && sg.title !== "[Private video]"
        })
        let i = true

        await bot.say({
            channel: this.textChannel,
            message: `Playing ${playlist.title} playlist from youtube`
        })

        playlist.items.forEach(song => {
            if (i && !this.isPlaying) {
                metaData.title = song.title
                metaData.link = song.url
                i = false
                return
            }
            this.songs.push({
                title: song.title,
                link: song.url
            })
        })


        return metaData
    }

    async nextSong() {
        if (this.songs.length !== 0) {
            let info = this.songs.shift()
            this.songPlaying = info

            this.playAudio(info.link, info.title)
            return
        }
        await this.stopAudio()
    }


}