const axios = require('axios')
const Guild = require('../lib/guild')

exports.copyPasta = {
    name: 'copypasta',
    description: 'Grab a top copypasta',
    execute: async function (msg, args) {
        let info = (await axios.get('https://www.reddit.com/r/copypastabr/top/.json?t=week')).data.data.children
        let index = Math.floor(Math.random() * info.length)
        let text = info[index].data.selftext

        if (text.length <= 2048) {
            Guild.say({
                channel: msg.channel,
                message: text
            })
        }
        else {
            let i = 1
            await Guild.say({
                channel: msg.channel,
                message: `Copy pasta too large, falling to safe mode`
            })

            while (text.length / i > 2048) {
                i++
            }

            let pivot = Math.floor(text.length / i)
            let pointer=0
            for (let index = 0; index < i; index++) {
                await Guild.say({
                    channel: msg.channel,
                    message: text.substr(pointer,pivot)
                })
                pointer+=pivot
            }
        }


    }
}