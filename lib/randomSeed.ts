import seed from 'seedrandom';

exports.randomWithLimits = (max:number, min:number) => Math.floor((seed('iguinho', { entropy: true })() * (max - min)) + min);
