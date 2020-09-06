module.exports = {
    name: 'stop',
    description: 'Stop all music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        if (!guild || !(guild.isPlaying || guild.soundBoardPLaying)) {
            Guild.say({
                channel: msg.channel,
                message: "No Songs to stop"
            })
            return
        }
        guild.say({
            title: "Stoping all sounds ⏹️"
        })
        guild.songs = []
        guild.stopAudio()
    }
}