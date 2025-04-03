import { Collection } from 'discord.js';
import { logger } from './logger';

interface CooldownInfo {
  timestamp: number;
  uses: number;
}

/**
 * Manages command cooldowns to prevent spam
 */
export class CooldownManager {
  private cooldowns: Collection<string, Collection<string, CooldownInfo>> = new Collection();
  
  /**
   * Checks if a user is on cooldown for a specific command
   * @param userId The ID of the user
   * @param commandName The name of the command
   * @param cooldownSeconds The cooldown duration in seconds
   * @param maxUses Maximum number of uses before triggering cooldown (default: 1)
   * @returns An object containing cooldown status and remaining time
   */
  checkCooldown(
    userId: string, 
    commandName: string, 
    cooldownSeconds: number,
    maxUses: number = 1
  ): { onCooldown: boolean; remainingTime: number; remainingUses: number } {
    // Initialize cooldown collection for this command if it doesn't exist
    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Collection());
    }
    
    const now = Date.now();
    const userCooldowns = this.cooldowns.get(commandName);
    const userCooldownInfo = userCooldowns.get(userId);
    
    // If user hasn't used this command before or cooldown has expired
    if (!userCooldownInfo || (now - userCooldownInfo.timestamp) > cooldownSeconds * 1000) {
      userCooldowns.set(userId, { timestamp: now, uses: 1 });
      return { onCooldown: false, remainingTime: 0, remainingUses: maxUses - 1 };
    }
    
    // If cooldown is still active
    const expirationTime = userCooldownInfo.timestamp + cooldownSeconds * 1000;
    const remainingTime = Math.ceil((expirationTime - now) / 1000);
    
    // Check if user has uses remaining within the cooldown period
    if (userCooldownInfo.uses < maxUses) {
      userCooldowns.set(userId, { 
        timestamp: userCooldownInfo.timestamp, 
        uses: userCooldownInfo.uses + 1 
      });
      return { 
        onCooldown: false, 
        remainingTime: remainingTime, 
        remainingUses: maxUses - userCooldownInfo.uses - 1 
      };
    }
    
    return { 
      onCooldown: true, 
      remainingTime: remainingTime,
      remainingUses: 0
    };
  }
  
  /**
   * Resets a user's cooldown for a specific command
   * @param userId The ID of the user
   * @param commandName The name of the command
   */
  resetCooldown(userId: string, commandName: string): void {
    if (this.cooldowns.has(commandName)) {
      const userCooldowns = this.cooldowns.get(commandName);
      if (userCooldowns.has(userId)) {
        userCooldowns.delete(userId);
        logger.info(`Reset cooldown for user ${userId} on command ${commandName}`);
      }
    }
  }
  
  /**
   * Resets all cooldowns for a specific command
   * @param commandName The name of the command
   */
  resetCommandCooldowns(commandName: string): void {
    if (this.cooldowns.has(commandName)) {
      this.cooldowns.delete(commandName);
      logger.info(`Reset all cooldowns for command ${commandName}`);
    }
  }
  
  /**
   * Resets all cooldowns for a specific user
   * @param userId The ID of the user
   */
  resetUserCooldowns(userId: string): void {
    this.cooldowns.forEach((userCooldowns, commandName) => {
      if (userCooldowns.has(userId)) {
        userCooldowns.delete(userId);
        logger.info(`Reset cooldown for user ${userId} on command ${commandName}`);
      }
    });
  }
}

// Export a singleton instance to be used throughout the application
export const cooldownManager = new CooldownManager(); 