
const Guild = require('../classes/guild')
const axios = require('axios')
const { play } = require('./exporter')
const { query } = require('winston')

bot.on('voiceStateUpdate', (oldP, newP) => {
    let guild = guilds.get(newP.guild.id)

    if (!guild || !guild.isPlaying) return

    if (guild.voiceChannel !== newP.channel) {
        guild.members--
    } else {
        guild.members++
    }
    if (guild.members === 1) {
        guild.say(
            {
                title: `I was alone so I cleared the queue and left the channel`,
                color: 'info',
            }
        )
        guild.songs = []
        guild.stopAudio()
    }
})


exports.play = {
    name: 'play',
    description: 'Play music with name or URL',
    execute: async function (msg, args, shoudSayQueued = true) {
        let guild
        try {
            let song = args.join(' ')

            //No args
            if (song === "") {
                await Guild.say({
                    title: `No song provided`,
                    color: 'warning',
                    channel: msg.channel
                })
                return
            }



            //try to get guild contract
            guild = guilds.get(msg.guild.id)
            //if no guild was found create new contract
            if (!guild) {
                guild = new Guild()
                guilds.set(msg.guild.id, guild)
            }
            if (guild.soundBoardPLaying) {
                guild.say({
                    message: `I'm playing a sound in soundboard right now, plase stop\
                    it before with ${process.env.PREFIX}stop first`
                })
                return
            }

            //if bot not in a voice channel then join
            if (!guild.voiceChannel) {
                await guild.contract(msg)
            }
            else if (guild.voiceChannel !== msg.member.voice.channel) {
                guild.say({
                    title: `I'm already in a voice channel`,
                    color: 'warning'
                })
                return
            }

            await guild.play(song, shoudSayQueued)

            return

        } catch (error) {
            throw error
        }
    }
}

exports.stop = {
    name: 'stop',
    description: 'Stop all music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        if (!guild || !(guild.isPlaying || guild.soundBoardPLaying)) {
            Guild.say({
                channel: msg.channel,
                message: "No Songs to stop"
            })
            return
        }
        guild.say({
            title: "Stoping all sounds ⏹️"
        })
        guild.songs = []
        guild.stopAudio()
    }
}

exports.skip = {
    name: 'skip',
    description: 'Skip one music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        if (!guild || !guild.isPlaying) {
            Guild.say({
                channel: msg.channel,
                message: "No Songs to skip"
            })
            return
        }
        if (guild.songs.length !== 0) {
            guild.say({
                title: "Skiping song ⏩"
            })
        }

        guild.stopAudio()
    }
}

exports.queue = {
    name: 'queue',
    description: 'See next 10 queued music',
    execute: async function (msg, args) {
        let guild = guilds.get(msg.guild.id)
        if (!guild || !guild.isPlaying) {
            Guild.say({
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
        guild.say({
            title: "Queue 🎧",
            color: 'info',
            message: message
        })
    }
}

exports.spotify = {
    name: "spotify",
    description: "use the playlist ID to play it, the id can be foundif you open it in a browser and read the url",
    execute: async function (msg, args) {
        try {
            let playlist = args.join(' ')
            let authKey = Buffer.from(`${process.env.CLIENT}:${process.env.CLIENTSECRET}`).toString('base64')
            let token = (await axios.post('https://accounts.spotify.com/api/token', "grant_type=client_credentials",
                {
                    headers: {
                        'Authorization': `Basic ${authKey}`
                    }
                })).data.access_token

            let musics = (await axios.get(`https://api.spotify.com/v1/playlists/${playlist}/tracks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })).data.items

            let querys=[]
            for (const element of musics) {
                let track = element.track
                let query = [`${track.name}`, ` - `, `${track.artists[0].name}`]
                querys.push(query)
            }
            let rand = Math.floor(Math.random()*querys.length)
            await exports.play.execute(msg, querys.splice(rand,1), false)

            querys=querys.map(async x=>{
                return exports.play.execute(msg, x, false)
            })

            
            await Promise.all(querys)

            exports.queue.execute(msg,args)



        } catch (error) {
            console.log(error);
        }
    }
}

