import { ShardingManager } from 'discord.js';
import { config } from 'dotenv';
import logger from './lib/logger';

config();

global.LOGGER = logger;

const manager = new ShardingManager('./botInit.js', { token: process.env.AUTH_TOKEN });
manager.on('shardCreate', (shard) => logger.info(`Launched shard ${shard.id}`));
manager.spawn();
