try {
    exports.play = require('./play')
    exports.skip = require('./skip')
    exports.stop = require('./stop')
    exports.queue = require('./queue')
    exports.spotify = require('./spotify')
    exports.sb = require('./soundBoard')
} catch (error) {
    throw error
}