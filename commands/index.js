try {
    module.exports=Object.assign(module.exports,require('./music'))
    module.exports=Object.assign(module.exports,require('./util'))
    module.exports=Object.assign(module.exports,require('./shitPost'))
    module.exports=Object.assign(module.exports,require('./soundBoard'))
} catch (error) {
    throw error
}
