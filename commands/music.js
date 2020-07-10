
const ytdl = require('ytdl-core');
const say =require('./sendMessage')


function playAudio(url) {
    global.songQueue.voiceCon.play(ytdl(url, { filter: 'audioonly' }))
        .on('finish', () => {
            global.songQueue.voiceChannel.leave()
            global.songQueue.voiceChannel = null
        })
        .on('error',()=>{

        })
}

function stopAudio() {
    global.songQueue.voiceCon.dispatcher.end()
}

exports.play = {
    name: 'play',
    description: 'Play music',
    execute: async function (msg, args) {
        
        const voiceChannel = msg.member.voice.channel
        const song = args.join(' ')
        if (!voiceChannel) {
            let reponse=await say({
                title:`You must be in a voice channel ${msg.member.displayName}`,
                color:'#a83232',
                channel:msg.channel
            })

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

exports.stop = {
    name: 'stop',
    description: 'Stop music',
    execute: async function (msg, args) {
        stopAudio()
    }
}