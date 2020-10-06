require('dotenv').config()
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./botInit.js', { token: process.env.AUTH_TOKEN });
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();