const Guild = require('../classes/guild')
const { loggers } = require('winston')

exports.sb = {
    name: 'sb',
    description: 'Play audio from soundboard',
    execute: async function (msg, args) {
        try {

            let guild
            let sound
            guild = guilds.get(msg.guild.id)
            if (!guild) {
                guild = new Guild()
                guilds.set(msg.guild.id, guild)

            }

            if(guild.isPlaying){
                guild.say({
                    message:"Im playing music right now, stop it to use the sound board"
                })
                return
            }

            switch (args[0]) {
                case 'register':
                    sound = msg.attachments.entries().next().value[1]
                    logger.info(args)
                    await db.collection(msg.guild.id).doc().set({
                        name: sound.name.replace(/\.[^/.]+$/, ""),
                        url: sound.url
                    })
                    break;

                default:
                    sound = (await db.collection(msg.guild.id).where('name', '==', args.shift()).get()).docs[0]

                    if (!sound) {
                        Guild.say({
                            channel: msg.channel,
                            message: "I did not find any sounds with that name"
                        })
                        return
                    }
                    sound = sound.data()
                    await guild.contract(msg)
                    guild.playSoundBoard(sound.url)
                    break;
            }
        } catch (error) {
            throw error
        }
    }
}