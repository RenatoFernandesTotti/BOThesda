const seed = require('seedrandom')
exports.randomWithLimits= (max,min)=>{
    return  Math.floor((seed("iguinho", { entropy: true })() *(max-min))+min )
}