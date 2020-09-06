module.exports = {
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
        if (guild.songs.length !== 0) {
            guild.say({
                title: "Skiping song ⏩"
            })
        }

        guild.stopAudio()
    }
}