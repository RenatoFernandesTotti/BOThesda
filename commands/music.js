
const ytdl = require('ytdl-core')
const say = require('../lib/sendMessage')
const ytsr = require('ytsr')


bot.on('voiceStateUpdate', (oldP, newP) => {
    let guild = guilds.get(newP.guild.id)

    if (!guild || !guild.isPlaying) return

    if (guild.voiceChannel !== newP.channel) {
        guild.members--
    } else {
        guild.members++
    }
    if (guild.members === 1) {
        stopAudio(guild)
    }
})



async function playAudio(url, name, guild) {
    guild.isPlaying = true

    await say(
        {
            channel: guild.textChannel,
            title: `Playing`,
            message: name,
            color: 'sucess'
        }
    )

    guild.voiceCon.play(ytdl(url, { filter: 'audioonly' }))
        .on('finish', () => {
            if (guild.songs.length !== 0) {
                let info = guild.songs.shift()
                playAudio(info.link, info.name, guild)
                return
            }
            guild.voiceChannel.leave()
            guild.voiceChannel = null
            guild.isPlaying = false
        })
        .on('error', () => {
            say({
                title: "An error has ocurred",
                color: "error",
                channel: guild.textChannel
            })
        })
}

function stopAudio(guild) {
    guild.voiceCon.dispatcher.end()
}

exports.play = {
    name: 'play',
    description: 'Play music with name or URL',
    execute: async function (msg, args) {
        let guild
        try {
            const voiceChannel = msg.member.voice.channel
            const textChannel = msg.channel
            let song = args.join(' ')
            let metaData = {}

            //No args
            if (song === "") {
                await say({
                    title: `No song provided`,
                    color: 'warning',
                    channel: msg.channel
                })
                return
            }

            //User was not in a voice channel
            if (!voiceChannel) {
                let reponse = await say({
                    title: `You must be in a voice channel ${msg.member.displayName}`,
                    color: '#a83232',
                    channel: msg.channel
                })
                reponse.react('😖')
                return
            }
            //try to get guild contract
            guild = guilds.get(msg.guild.id)

            //if no guild was found create new contract
            if (!guild) {
                guilds.set(msg.guild.id, {
                    songs: [],
                    voiceChannel: null,
                    textChannel: null,
                    voiceCon: null,
                    isPlaying: false,
                    members: 0
                })

                guild = guilds.get(msg.guild.id)
            }


            //if bot not in a voice channel then join
            if (!guild.voiceChannel) {
                guild.voiceCon = await voiceChannel.join()
                guild.voiceChannel = voiceChannel
                guild.textChannel = msg.channel
                guild.members = guild.voiceChannel.members.size
            }
            else if (guild.voiceChannel !== voiceChannel) {
                say(
                    {
                        channel: guild.textChannel,
                        title: `I'm already in a voice channel`,
                        color: 'warning'
                    }
                )
            }
            //If song was URL playit directly and get the video title, if not,
            //search for it and get the metadata
            if (ytdl.validateURL(song)) {
                metaData.title = (await ytdl.getBasicInfo(song)).videoDetails.title
                metaData.link = song
            } else {

                song = await ytsr(song)
                if (song.items.length === 0) {
                    await say({
                        color: "error",
                        title: "Error ",
                        message: "I didn't find any songs",
                        channel: guild.textChannel
                    })
                    if (!guild.isPlaying) {
                        guild.voiceChannel.leave()
                    }
                    return
                }
                metaData.title = song.items[0].title
                metaData.link = song.items[0].link

            }

            if (!guild.isPlaying) {

                playAudio(metaData.link, metaData.title, guild)
            } else {
                await say(
                    {
                        channel: guild.textChannel,
                        title: `Queued`,
                        message: metaData.title,
                        color: 'sucess'
                    }
                )

                guild.songs.push({ name: metaData.title, link: metaData.link })
            }
        } catch (error) {
            await say({
                title: "Major error",
                message: error,
                channel: guild.textChannel
            })
        }




    }
}

exports.stop = {
    name: 'stop',
    description: 'Stop all music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)

        if(guild.songs.length === 0){
            await say({
                channel:guild.textChannel
            })
        }
        guild.songs = []
        stopAudio(guild)
    }
}

exports.skip = {
    name: 'skip',
    description: 'Skip one music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        stopAudio(guild)
    }
}