try {
    module.exports=Object.assign(module.exports,require('./sounds'))
    module.exports=Object.assign(module.exports,require('./util'))
    module.exports=Object.assign(module.exports,require('./misc'))
} catch (error) {
    throw error
}
