
const ytdl = require('ytdl-core')
const say = require('../lib/sendMessage')
const ytsr = require('ytsr')
const guilds = new Map()

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
            if(guild.songs.length!==0){
                let info = guild.songs.shift()
                playAudio(info.link,info.name,guild)
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
    description: 'Play music',
    execute: async function (msg, args) {

        const voiceChannel = msg.member.voice.channel
        const textChannel = msg.channel
        let song = args.join(' ')
        if(song===""){
            await say({
                title: `No song provided`,
                color: 'warning',
                channel: msg.channel
            })
            return
        }
        if (!voiceChannel) {
            let reponse = await say({
                title: `You must be in a voice channel ${msg.member.displayName}`,
                color: '#a83232',
                channel: msg.channel
            })
            reponse.react('😖')
            return
        }

        let guild = guilds.get(msg.guild.id)

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



        song = await ytsr(song)

        if (!guild.isPlaying) {

            playAudio(song.items[0].link, song.items[0].title, guild)
        } else {
            await say(
                {
                    channel: guild.textChannel,
                    title: `Queued`,
                    message:song.items[0].title,
                    color: 'sucess'
                }
            )

            guild.songs.push({ name: song.items[0].title, link: song.items[0].link })
        }



    }
}

exports.stop = {
    name: 'stop',
    description: 'Stop music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        guild.songs=[]
        stopAudio(guild)
    }
}

exports.skip = {
    name: 'skip',
    description: 'Stop music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        stopAudio(guild)
    }
}