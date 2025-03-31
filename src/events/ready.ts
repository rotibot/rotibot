import { Client } from 'discord.js';
import { logger } from '../utils/logger';

export default (client: Client) => {
    client.once('ready', () => {
        logger.info(`Bot is online as ${client.user?.tag}`);
    });
};
