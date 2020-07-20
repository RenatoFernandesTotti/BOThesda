const send = require('../lib/sendEmbedMessage');
const ytdl = require('ytdl-core')
const ytsr = require('ytsr')
module.exports = class Guild {

    //properties
    songs = []
    songPlaying={}
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
            console.log("Channel not specified");
            return
        }
        return await send({ title, color, message, channel })
    }


    //methods
    async say({ title = "", color = 'sucess', message = "" }) {
        if (!this.textChannel) {
            console.log("Channel not specified");
            return
        }
        let channel = this.textChannel
        return await send({ title, color, message, channel })
    }

    async contract(msg) {
        this.voiceChannel = msg.member.voice.channel
        this.voiceCon = await this.voiceChannel.join()
        this.textChannel = msg.channel
        this.members = this.voiceChannel.members.size
    }


    //If song was URL playit directly and get the video title, if not,
    //search for it and get the metadata
    async play(song) {
        let metaData = {}
        if (ytdl.validateURL(song)) {
            metaData.title = (await ytdl.getBasicInfo(song)).videoDetails.title
            metaData.link = song
        } else {
            song = await ytsr(song)
            song.items=song.items.filter(it=>{return it.type==="video"})
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
            this.songPlaying=metaData
            this.playAudio(metaData.link, metaData.title)
        } else {
            await this.say(
                {
                    title: `Queued 📜`,
                    message: metaData.title,
                    color: 'sucess'
                }
            )

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

        this.voiceCon.play(ytdl(url, { filter: 'audioonly' }))
            .on('finish', () => {
                if (this.songs.length !== 0) {
                    let info = this.songs.shift()
                    this.songPlaying=info
                    this.playAudio(info.link, info.title)
                    return
                }

                this.say({
                    message:"Finished playing all songs 💽"
                })
                this.voiceChannel.leave()
                this.isPlaying = false
            })
            .on('error', (error) => {
                say({
                    title: "An error has ocurred",
                    color: "error",
                    channel: this.textChannel
                })
            })
    }

    stopAudio() {
        if(!!this.voiceCon) this.voiceCon.dispatcher.end()
    }

}