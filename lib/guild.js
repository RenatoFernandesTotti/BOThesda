const send = require('./sendMessage');
const ytdl = require('ytdl-core')
module.exports = class Guild {

    //properties
    songs = []
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
        let channel=this.textChannel
        return await send({ title, color, message, channel })
    }

    async contract(msg) {
        this.voiceChannel = msg.member.voice.channel
        this.voiceCon = await this.voiceChannel.join()
        this.textChannel = msg.channel
        this.members = this.voiceChannel.members.size
    }

    async playAudio(url, name) {
        this.isPlaying = true

        await this.say(
            {
                title: `Playing`,
                message: name,
                color: 'sucess'
            }
        )

        this.voiceCon.play(ytdl(url, { filter: 'audioonly' }))
            .on('finish', () => {
                if (this.songs.length !== 0) {
                    let info = this.songs.shift()
                    this.playAudio(info.link, info.name)
                    return
                }
                this.voiceChannel.leave()
                this.voiceChannel = null
                this.isPlaying = false
            })
            .on('error', () => {
                say({
                    title: "An error has ocurred",
                    color: "error",
                    channel: this.textChannel
                })
            })
    }

    stopAudio() {
        this.voiceCon.dispatcher.end()
    }

}