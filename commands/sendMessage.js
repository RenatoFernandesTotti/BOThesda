const { MessageEmbed } = require('discord.js');
const embed = new MessageEmbed()



module.exports =async function sendEmbed (args = { title: "", color: "#008744", message: "default message", channel }) {
    embed.setTitle(args.title)
        .setColor(args.color)
        .setDescription(args.message);
    return await args.channel.send(embed)
    
}