import {ShardingManager} from 'discord.js';
import {config} from 'dotenv';
import logger from './lib/logger';
import fireStore from './config/cfgFirestore';
config();
fireStore();
global.LOGGER = logger;

const manager = new ShardingManager('./botInit.ts', {
  token: process.env.AUTH_TOKEN,
});
manager.on('shardCreate', (shard) => logger.info(`Launched shard ${shard.id}`));
manager.spawn();
