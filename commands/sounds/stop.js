module.exports = {
    name: 'stop',
    description: 'Stop all music',
    execute: async function (msg, args) {
        try {
            let guild = guilds.get(msg.guild.id)
            if (!guild || !(guild.isPlaying || guild.soundBoardPLaying)) {
                bot.say({
                    channel: msg.channel,
                    message: "No Songs to stop"
                })
                return
            }
            bot.say({
                title: "Stoping all sounds ⏹️",
                channel: msg.channel
            })
            guild.songs = []
            guild.stopAudio()
        } catch (error) {
            throw error
        }

    }
}