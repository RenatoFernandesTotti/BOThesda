module.exports = {
    name: 'queue',
    description: 'See next 10 queued music',
    execute: async function (msg, args) {
        try {
            let guild = guilds.get(msg.guild.id)
            if (!guild || !guild.isPlaying) {
                bot.say({
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
            bot.say({
                title: "Queue 🎧",
                color: 'info',
                message: message,
                channel: msg.channel
            })
        } catch (error) {
            throw error
        }

    }
}