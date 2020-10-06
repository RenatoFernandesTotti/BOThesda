module.exports = {
    name: 'play',
    description: 'Play music with name or URL',
    execute: async function (msg, args, shoudSayQueued = true) {
        let guild
        try {
            let song = args.join(' ')

            //No args
            if (song === "") {
                await bot.say({
                    title: `No song provided`,
                    color: 'warning',
                    channel: msg.channel
                })
                return
            }



            //try to get guild contract
            guild = guilds.get(msg.guild.id)
            //if no guild was found create new contract
            if (!guild) {
                guild = new Guild()
                guilds.set(msg.guild.id, guild)
            }
            if (guild.soundBoardPLaying) {
                bot.say({
                    message: `I'm playing a sound in soundboard right now, plase stop\
                        it before with ${process.env.PREFIX}stop first`,
                    channel: msg.channel
                })
                return
            }

            //if bot not in a voice channel then join
            if (!guild.voiceChannel) {
                await guild.contract(msg)
            } else if (guild.voiceChannel !== msg.member.voice.channel) {
                bot.say({
                    title: `I'm already in a voice channel`,
                    color: 'warning',
                    channel: msg.channel
                })
                return
            }

            await guild.play(song, shoudSayQueued,msg)

            return

        } catch (error) {
            throw error
        }
    }
}