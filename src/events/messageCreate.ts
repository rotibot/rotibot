import { Client, Message } from "discord.js";
import { logger } from "../utils/logger";

const PREFIX = "r!";

export default (client: Client) => {
    client.on('messageCreate', async (message: Message) => {
        if (message.author.bot || !message.content.startsWith(PREFIX)) return;

        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;
        const command = client.commands.get(commandName);
        if (!command) {
            logger.warn(`No command found for: ${commandName}`);
            return;
        }

        try {
            await command.data.execute(message);
            logger.info(`Executed command: ${commandName}`);
        } catch (error) {
            logger.error(`Error executing command ${commandName}: ${error.message}`);
            message.reply('There was an error executing this command.');
        }
    });
};
