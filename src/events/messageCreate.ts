import { Client, Message } from "discord.js";
import { logger } from "../utils/logger";
import { ErrorHandler, ErrorType } from "../utils/errorHandler";
import { cooldownManager } from "../utils/cooldown";
import { permissionManager, PermissionLevel } from "../utils/permissions";

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
            // Get the user's permission level
            const requiredPermissionLevel = command.data.permissionLevel || PermissionLevel.EVERYONE;
            
            // Check if the user has permission to use this command
            if (message.guild && message.member) {
                if (!permissionManager.hasPermissionLevel(message.member, requiredPermissionLevel)) {
                    await permissionManager.handlePermissionDenied(message, requiredPermissionLevel);
                    return;
                }
            }
            
            // Check for cooldown
            const cooldownDuration = command.data.cooldown || 3; // Default cooldown of 3 seconds
            const maxUses = command.data.maxUses || 1; // Default max uses is 1
            
            const { onCooldown, remainingTime } = cooldownManager.checkCooldown(
                message.author.id,
                commandName,
                cooldownDuration,
                maxUses
            );
            
            if (onCooldown) {
                message.reply(`Please wait ${remainingTime} more second(s) before using this command again.`);
                return;
            }
            
            // Execute the command
            await command.data.execute(message);
            logger.info(`Executed command: ${commandName}`);
        } catch (error) {
            await ErrorHandler.handleCommandError(error, message, commandName);
        }
    });
};
