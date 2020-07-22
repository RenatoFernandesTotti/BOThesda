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
            if(!guild){
                guild = new Guild()
                guilds.set(msg.guild.id, guild)
                
            }
            if(args.length === 1){

                sound = (await db.collection(msg.guild.id).where('name','==',args).get()).docs[0]
                
                if(!sound){
                    guild.say({
                        message:"I did not find any sounds with that name"
                    })
                    return
                }

                await guild.contract(msg)

                return
            }

            switch (args[0]) {
                case 'register':
                    loggers.info(args)
                    break;
            
                default:
                    break;
            }
            db.collection(msg.guild.id)
        } catch (error) {
            throw error
        }
    }
}