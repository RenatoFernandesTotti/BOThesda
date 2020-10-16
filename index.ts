import { ShardingManager } from 'discord.js';

import logger from './lib/logger';

require('dotenv').config();

const manager = new ShardingManager('./botInit.js', { token: process.env.AUTH_TOKEN });
manager.on('shardCreate', (shard) => logger.log(`Launched shard ${shard.id}`));
manager.spawn();
