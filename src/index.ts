import { ShardingManager } from "discord.js";
import { logger } from "./utils/logger";
import 'dotenv/config';

// Initialize ShardingManager
const manager = new ShardingManager('./dist/bot.js', {
    token: process.env.BOT_TOKEN,
    totalShards: 'auto',
    shardArgs: ['--color'],
    execArgv: ['--trace-warnings'],
    respawn: true,
    shardList: 'auto',
    //@ts-ignore
    maxShards: 'auto',
    shardConcurrency: 'auto',
    execFile: 'node',
    execOptions: {
        env: {
            NODE_ENV: 'production',
            SHARDING_MANAGER: true,
        },
    },
});

// Log shard creation
manager.on('shardCreate', shard => {
    logger.info(`Launched shard ${shard.id}`);
    shard.on('death', () => logger.error(`Shard ${shard.id} died unexpectedly.`));
    shard.on('disconnect', () => logger.warn(`Shard ${shard.id} disconnected.`));
    shard.on('reconnecting', () => logger.info(`Shard ${shard.id} is reconnecting.`));
    shard.on('ready', () => logger.info(`Shard ${shard.id} is ready.`));
    shard.on('error', error => logger.error(`Shard ${shard.id} encountered an error: ${error.message}`));
});

// Error handling for the manager
manager.on('shardCreate', shard => {
    shard.on('error', error => {
        logger.error(`Shard ${shard.id} encountered an error: ${error.message}`);
    });
});

// Spawn shards with error handling
(async () => {
    try {
        logger.info('Starting shard spawning process...');
        await manager.spawn();
        logger.info('All shards launched successfully.');
    } catch (error) {
        logger.error(`Failed to spawn shards: ${error.message}`);
        process.exit(1); // Exit the process with failure code
    }
})();