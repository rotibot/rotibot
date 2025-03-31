import { Client, Collection, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>;
    }
}
import { readdirSync } from 'fs';
import { join } from 'path';
import { logger } from './utils/logger';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

// Load commands
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(join(commandsPath, file));
    client.commands.set(command.data.name, command);
    logger.info(`Loaded command: ${command.data.name}`);
}

// Load events
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(join(eventsPath, file)).default;
    event(client);
    logger.info(`Loaded event: ${file}`);
}

// Login to Discord
(async () => {
    try {
        logger.info('Logging in to Discord...');
        await client.login(process.env.BOT_TOKEN);
        logger.info('Successfully logged in to Discord.');
    } catch (error) {
        logger.error(`Failed to log in: ${error.message}`);
        process.exit(1); // Exit the process with failure code
    }
})();
