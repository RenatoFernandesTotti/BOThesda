const send = require('../lib/sendEmbedMessage');
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
    constructor() { }

    //static methods
    static async say({ title = "", color = 'sucess', message = "", channel }) {
        if (!channel) {
            logger.error("Channel not specified");
            return
        }
        return await send({ title, color, message, channel })
    }


    //methods
    async say({ title = "", color = 'sucess', message = "" }) {
        if (!this.textChannel) {
            logger.error("Channel not specified");
            return
        }
        let channel = this.textChannel
        return await send({ title, color, message, channel })
    }

    async contract(msg) {
        try {
            //User was not in a voice channel
            if (!msg.member.voice.channel) {
                let reponse = await Guild.say({
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
        }
        catch (error) {
            await Guild.say({
                channel: msg.channel,
                title: 'An error has occured',
                message: "Trying to connect again"
            })
            this.contract(msg)
        }
    }


    //If song was URL playit directly and get the video title, if not,
    //search for it and get the metadata
    async play(song, shoudSayQueued = true) {
        let metaData = {}
        if (ytdl.validateURL(song)) {
            metaData.title = (await ytdl.getBasicInfo(song)).videoDetails.title
            metaData.link = song
        } else {
            song = await ytsr(song, { limit: 1 })
            song.items = song.items.filter(it => { return it.type === "video" })
            if (song.items.length === 0) {
                await this.say({
                    color: "error",
                    message: "I didn't find any songs",
                })
                if (!this.isPlaying) {
                    this.voiceChannel.leave()
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

                await this.say(
                    {
                        title: `Queued 📜`,
                        message: metaData.title,
                        color: 'sucess'
                    }
                )
            }

            this.songs.push({ title: metaData.title, link: metaData.link })
        }
    }

    async playAudio(url, name) {
        this.isPlaying = true



        await this.say(
            {
                title: `Playing ▶️`,
                message: name,
                color: 'sucess'
            }
        )


        this.voiceCon.play(ytdl(url, {
            requestOptions: {
                headers: {
                    'Cookie': process.env.COOKIE
                }
            },
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }))
            .on('finish', _ => {
                if (this.songs.length !== 0) {
                    let info = this.songs.shift()
                    this.songPlaying = info

                    this.playAudio(info.link, info.title)
                    return
                }

                this.say({
                    message: "Finished playing all songs 💽"
                })
                this.voiceChannel.leave()
                this.voiceChannel = null
                this.isPlaying = false
            })
            .on('error', async (error) => {
                await this.voiceChannel.leave()
                this.voiceChannel = null
                this.isPlaying = false
                this.say({
                    title: "Error",
                    message: error.stack
                })
            })
    }

    async playSoundBoard(url) {
        if (!!this.voiceCon) {
            this.soundBoardPLaying = true
            await this.voiceCon.play(url).on('finish', async _ => {
                await this.voiceChannel.leave()
                this.soundBoardPLaying = false
                this.voiceChannel = null
            })
        }
    }

    stopAudio() {
        if (!!this.voiceCon && (this.isPlaying || this.soundBoardPLaying)) this.voiceCon.dispatcher.end()
    }

}