const { MessageEmbed } = require('discord.js');
const embed = new MessageEmbed()
const pallete = require('./colorPallete')


module.exports =async function sendEmbed ({ title= "", color= 'sucess', message= "", channel }) {
    embed.setTitle(title)
        .setColor(pallete[color])
        .setDescription(message);
    return await channel.send(embed)
    
}