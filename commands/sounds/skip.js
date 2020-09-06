module.exports = {
    name: 'skip',
    description: 'Skip one music',
    execute: async function (msg, args) {
        try {
            let guild = guilds.get(msg.guild.id)
            if (!guild || !guild.isPlaying) {
                bot.say({
                    channel: msg.channel,
                    message: "No Songs to skip"
                })
                return
            }
            if (guild.songs.length !== 0) {
                bot.say({
                    title: "Skiping song ⏩",
                    channel: msg.channel
                })
            }

            guild.stopAudio()
        } catch (error) {
            throw error
        }

    }
}