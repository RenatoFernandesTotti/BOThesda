try {
    const music = require('./music')
    const util = require('./util')
    const shitPost = require('./shitPost');
    const sb = require('./soundBoard')

    //music
    exports.play = music.play
    exports.stop = music.stop
    exports.skip = music.skip
    exports.queue = music.queue

    //util
    exports.help = util.help

    //shitPost
    exports.copypasta = shitPost.copyPasta

    //soundboard
    exports.sb = sb.sb
} catch (error) {
    throw error
}
