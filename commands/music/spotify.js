module.exports = {
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