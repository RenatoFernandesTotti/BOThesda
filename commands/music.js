const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

function playAudio(url) {
    global.songQueue.voiceCon.play(ytdl(url, { filter: 'audioonly' }))
        .on('finish', () => {
            global.songQueue.voiceChannel.leave()
            global.songQueue.voiceChannel=null
        })
}

exports.play = {
    name: 'play',
    description: 'Play music',
    execute: async function (msg, args) {
        const embed = new MessageEmbed()
        const voiceChannel = msg.member.voice.channel
        const song = args.join(' ')
        if (!voiceChannel) {
            embed.setTitle(`You must be in a voice channel ${msg.member.displayName}`)
                .setColor('#a83232')
            let reponse = await msg.channel.send(embed);
            reponse.react('😖')
            return
        }
        if (!global.songQueue.voiceChannel) {
            global.songQueue.voiceCon = await voiceChannel.join()
            global.songQueue.voiceChannel = voiceChannel
        } else if (global.songQueue.voiceChannel !== voiceChannel) {
            embed.setTitle(`I'm already in a voice channel`)
                .setColor('#3238b8')
            msg.channel.send(embed);
        }
        playAudio(song)

    }
}