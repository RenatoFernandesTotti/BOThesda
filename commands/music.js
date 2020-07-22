
const Guild = require('../classes/guild')


bot.on('voiceStateUpdate', (oldP, newP) => {
    let guild = guilds.get(newP.guild.id)

    if (!guild || !guild.isPlaying) return

    if (guild.voiceChannel !== newP.channel) {
        guild.members--
    } else {
        guild.members++
    }
    if (guild.members === 1) {
        guild.say(
            {
                title: `I was alone so I cleared the queue and left the channel`,
                color: 'info',
            }
        )
        guild.songs = []
        guild.stopAudio()
    }
})


exports.play = {
    name: 'play',
    description: 'Play music with name or URL',
    execute: async function (msg, args) {
        let guild
        try {
            let song = args.join(' ')

            //No args
            if (song === "") {
                await Guild.say({
                    title: `No song provided`,
                    color: 'warning',
                    channel: msg.channel
                })
                return
            }

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

            //try to get guild contract
            guild = guilds.get(msg.guild.id)
            //if no guild was found create new contract
            if (!guild) {
                guild = new Guild()
                guilds.set(msg.guild.id, guild)
            }


            //if bot not in a voice channel then join
            if (!guild.voiceChannel) {
                await guild.contract(msg)
            }
            else if (guild.voiceChannel !== msg.member.voice.channel) {
                guild.say({
                    title: `I'm already in a voice channel`,
                    color: 'warning'
                })
                return
            }

            guild.play(song)
            
        } catch (error) {
            throw error
        }
    }
}

exports.stop = {
    name: 'stop',
    description: 'Stop all music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        if (!guild || !guild.isPlaying) {
            Guild.say({
                channel: msg.channel,
                message: "No Songs to stop"
            })
            return
        }
        guild.say({
            title:"Stoping all songs ⏹️"
        })
        guild.songs = []
        guild.stopAudio()
    }
}

exports.skip = {
    name: 'skip',
    description: 'Skip one music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        if (!guild || !guild.isPlaying) {
            Guild.say({
                channel: msg.channel,
                message: "No Songs to skip"
            })
            return
        }
        if (guild.songs.length!==0) {
            guild.say({
                title:"Skiping song ⏩"
            })
        }

        guild.stopAudio()
    }
}

exports.queue = {
    name: 'queue',
    description: 'See next 10 queued music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        if (!guild || !guild.isPlaying) {
            Guild.say({
                channel: msg.channel,
                message: "No Songs to show 🙁"
            })
            return
        }

        let message =
            `Playing: **${guild.songPlaying.title}**\n`

        if (guild.songs.length !== 0) {
            let limit = (guild.songs.length <= 10) ? guild.songs.length : 10
            for (let index = 0; index < limit; index++) {
                message += `${index + 1}: ${guild.songs[index].title}\n`
            }
        }
        guild.say({
            title: "Queue 🎧",
            color: 'info',
            message: message
        })
    }
}

