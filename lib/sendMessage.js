const { MessageEmbed } = require('discord.js');
const pallete = require('./colorPallete')


module.exports =async function sendEmbed ({ title= "", color= 'sucess', message= "", channel }) {
    let embed = new MessageEmbed()
    embed.setTitle(title)
        .setColor(pallete[color])
        .setDescription(message);
    return await channel.send(embed)
    
}