

const Guild = require('../lib/guild')


bot.on('voiceStateUpdate', (oldP, newP) => {
    let guild = guilds.get(newP.guild.id)

    if (!guild || !guild.isPlaying) return

    if (guild.voiceChannel !== newP.channel) {
        guild.members--
    } else {
        guild.members++
    }
    if (guild.members === 1) {
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
                guilds.set(msg.guild.id, new Guild())
                guild = guilds.get(msg.guild.id)
            }


            //if bot not in a voice channel then join
            if (!guild.voiceChannel) {
                guild.contract(msg)
            }
            else if (guild.voiceChannel !== msg.member.voice.channel) {
                guild.say(
                    {
                        title: `I'm already in a voice channel`,
                        color: 'warning'
                    }
                )

                return
            }

            guild.play(song)
        } catch (error) {
            await Guild.say({
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
        if (!guild || !guild.isPlaying) {
            Guild.say({
                channel: msg.channel,
                title: "Error",
                message: "No Songs to stop"
            })
            return
        }
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
                title: "Error",
                message: "No Songs to skip"
            })
            return
        }
        guild.stopAudio()
    }
}