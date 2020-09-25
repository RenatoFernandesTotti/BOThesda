try {
    module.exports=Object.assign(module.exports,require('./sounds'))
    module.exports=Object.assign(module.exports,require('./util'))
    module.exports=Object.assign(module.exports,require('./misc'))
    module.exports=Object.assign(module.exports,require('./rpg'))
} catch (error) {
    throw error
}
