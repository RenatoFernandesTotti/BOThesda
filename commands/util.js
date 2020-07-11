const say = require('../lib/sendMessage')
exports.help = {
    name: 'help',
    description: 'Show this message',
    execute: async function (msg, args) {
        let message="\`\`\`css\n"
        bot.commands.forEach(command=>{
            message+=` ${command.name} : ${command.description}\n`
        })
        message+="\`\`\`"


        say({
            title:"Commands",
            message:message,
            color:"info",
            channel:msg.channel
        })
    }
}