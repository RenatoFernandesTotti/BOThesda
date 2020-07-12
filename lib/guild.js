const send = require('./sendMessage');

module.exports= class Guild {

    //properties
    songs = []
    voiceChannel = null
    textChannel = null
    voiceCon = null
    isPlaying = false
    members = 0

    //constructor
    constructor(){}

    //static methods
    async say({ title= "", color= 'sucess', message= "", channel=null }){
        let medium = this.textChannel

        if(!medium){
            console.log("Channel not specified");
            return
        }
        await send({title, color, message, medium})
    }

}