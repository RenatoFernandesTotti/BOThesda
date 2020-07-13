const music =require('./music')
const util = require('./util')
const shitPost = require('./shitPost');
//music
exports.play=music.play
exports.stop=music.stop
exports.skip=music.skip
exports.queue=music.queue
//util
exports.help=util.help

//shitPost
exports.copypasta = shitPost.copyPasta