const Guild = require('../lib/classes/guild')
const { loggers } = require('winston')

exports.sb = {
    name: 'sb',
    description: 'Play/register/delete/list audio from soundboard, just use sb <command>, to play a sound just use sb <sound name>',
    execute: async function (msg, args) {
        try {

            let guild
            let sound
            guild = guilds.get(msg.guild.id)
            if (!guild) {
                guild = new Guild()
                guilds.set(msg.guild.id, guild)

            }

            if (guild.isPlaying) {
                guild.say({
                    message: "Im playing music right now, stop it to use the sound board"
                })
                return
            }

            switch (args[0]) {
                case 'register':
                    let nameExists = false
                    var docs
                    if (!msg.attachments.size) {
                        Guild.say({
                            channel: msg.channel,
                            message: "No file provided"
                        })
                        return
                    }
                    sound = msg.attachments.entries().next().value[1]
                    docs = (await db.collection(msg.guild.id).where('name', '==', sound.name.replace(/\.[^/.]+$/, "")).get()).docs
                    if (docs.length !== 0) {
                        Guild.say({
                            channel: msg.channel,
                            message: "Sound with that name already exists"
                        })
                        return
                    }
                    await db.collection(msg.guild.id).doc().set({
                        name: sound.name.replace(/\.[^/.]+$/, ""),
                        url: sound.url
                    })
                    break;
                case 'delete':
                    args.shift()
                    var docs = (await db.collection(msg.guild.id).where('name', '==', args[0]).get()).docs
                    if (docs.length === 0) {
                        Guild.say({
                            channel: msg.channel,
                            message: "There are no sounds with that name to delete"
                        })
                        return
                    }
                    await db.collection(msg.guild.id).doc(docs[0].id).delete()

                case 'list':
                    let list = ""
                    sound = (await db.collection(msg.guild.id).get()).docs
                    if (sound.length === 0) {
                        Guild.say({
                            channel: msg.channel,
                            message: "there are no sounds for this server"
                        })
                        return
                    }
                    sound.forEach(element => {
                        element = element.data()
                        list += `${element.name}\n`
                    });

                    Guild.say({
                        channel: msg.channel,
                        title: "Sounds list",
                        message: list
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