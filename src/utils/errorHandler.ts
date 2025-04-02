import { Message, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { logger } from './logger';

/**
 * Error types for better categorization and handling
 */
export enum ErrorType {
  COMMAND_EXECUTION = 'Command Execution Error',
  PERMISSION = 'Permission Error',
  COOLDOWN = 'Cooldown Error',
  API = 'Discord API Error',
  DATABASE = 'Database Error',
  UNKNOWN = 'Unknown Error'
}

/**
 * Handles errors throughout the application with proper logging and user feedback
 */
export class ErrorHandler {
  /**
   * Handles command errors with appropriate logging and user feedback
   */
  static async handleCommandError(
    error: Error,
    messageOrInteraction: Message | ChatInputCommandInteraction,
    command: string,
    errorType: ErrorType = ErrorType.COMMAND_EXECUTION
  ): Promise<void> {
    // Log the error with details
    logger.error(`[${errorType}] Command: ${command} | Error: ${error.message}`, {
      stack: error.stack,
      command
    });

    // Create a user-friendly error message
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Error')
      .setDescription(`An error occurred while executing the command.`)
      .setFooter({ text: 'If this issue persists, please contact a server administrator.' });

    // Respond based on context
    try {
      if (messageOrInteraction instanceof Message) {
        await messageOrInteraction.reply({ embeds: [errorEmbed] });
      } else if (messageOrInteraction.deferred || messageOrInteraction.replied) {
        await messageOrInteraction.editReply({ embeds: [errorEmbed] });
      } else {
        await messageOrInteraction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    } catch (replyError) {
      logger.error(`Failed to send error message: ${replyError.message}`);
    }
  }

  /**
   * Handles general application errors
   */
  static handleError(error: Error, context: string, errorType: ErrorType = ErrorType.UNKNOWN): void {
    logger.error(`[${errorType}] Context: ${context} | Error: ${error.message}`, {
      stack: error.stack,
      context
    });
  }
} 