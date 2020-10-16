import seed from 'seedrandom';

const randomWithLimits = (max:number, min:number) => Math.floor((seed('iguinho', { entropy: true })() * (max - min)) + min);

export randomWithLimits