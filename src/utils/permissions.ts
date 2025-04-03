import { 
  GuildMember, 
  PermissionResolvable, 
  PermissionFlagsBits,
  Message,
  ChatInputCommandInteraction,
  EmbedBuilder
} from 'discord.js';
import { logger } from './logger';

/**
 * Permission levels for the bot's command system
 */
export enum PermissionLevel {
  EVERYONE = 0,        // Any user can use
  MODERATOR = 1,       // Requires moderator role or permissions
  ADMINISTRATOR = 2,   // Requires administrator role or permissions
  SERVER_OWNER = 3,    // Server owner only
  BOT_OWNER = 4        // Bot owner only
}

/**
 * Maps permission levels to specific Discord permissions
 */
const permissionMap: Record<PermissionLevel, PermissionResolvable[]> = {
  [PermissionLevel.EVERYONE]: [],
  [PermissionLevel.MODERATOR]: [
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.ManageMessages
  ],
  [PermissionLevel.ADMINISTRATOR]: [
    PermissionFlagsBits.Administrator
  ],
  [PermissionLevel.SERVER_OWNER]: [],  // Special check for guild owner
  [PermissionLevel.BOT_OWNER]: []      // Special check for bot owner
};

/**
 * Manages command permissions throughout the bot
 */
export class PermissionManager {
  private botOwnerId: string;
  private moderatorRoleIds: Map<string, string[]> = new Map(); // guildId -> roleIds
  
  constructor(botOwnerId: string = '') {
    this.botOwnerId = botOwnerId;
    // Load bot owner ID from environment variable if not provided
    if (!this.botOwnerId && process.env.BOT_OWNER_ID) {
      this.botOwnerId = process.env.BOT_OWNER_ID;
    }
  }
  
  /**
   * Set the bot owner ID
   * @param userId The ID of the bot owner
   */
  setBotOwnerId(userId: string): void {
    this.botOwnerId = userId;
    logger.info(`Set bot owner ID to ${userId}`);
  }
  
  /**
   * Add moderator roles for a specific guild
   * @param guildId The ID of the guild
   * @param roleId The ID of the moderator role
   */
  addModeratorRole(guildId: string, roleId: string): void {
    if (!this.moderatorRoleIds.has(guildId)) {
      this.moderatorRoleIds.set(guildId, []);
    }
    
    const roles = this.moderatorRoleIds.get(guildId);
    if (!roles.includes(roleId)) {
      roles.push(roleId);
      this.moderatorRoleIds.set(guildId, roles);
      logger.info(`Added moderator role ${roleId} for guild ${guildId}`);
    }
  }
  
  /**
   * Remove a moderator role from a specific guild
   * @param guildId The ID of the guild
   * @param roleId The ID of the moderator role
   */
  removeModeratorRole(guildId: string, roleId: string): void {
    if (this.moderatorRoleIds.has(guildId)) {
      const roles = this.moderatorRoleIds.get(guildId);
      const index = roles.indexOf(roleId);
      
      if (index !== -1) {
        roles.splice(index, 1);
        this.moderatorRoleIds.set(guildId, roles);
        logger.info(`Removed moderator role ${roleId} from guild ${guildId}`);
      }
    }
  }
  
  /**
   * Check if a member has the required permission level
   * @param member The guild member to check
   * @param level The required permission level
   * @returns Whether the member has the required permission level
   */
  hasPermissionLevel(member: GuildMember, level: PermissionLevel): boolean {
    // Everyone has access to level 0
    if (level === PermissionLevel.EVERYONE) return true;
    
    // Check if user is bot owner
    if (member.user.id === this.botOwnerId) return true;
    
    // Server owner check
    if (level <= PermissionLevel.SERVER_OWNER && member.id === member.guild.ownerId) {
      return true;
    }
    
    // Bot owner only commands
    if (level === PermissionLevel.BOT_OWNER) return false;
    
    // Check for role-based permissions
    if (level === PermissionLevel.MODERATOR) {
      const moderatorRoles = this.moderatorRoleIds.get(member.guild.id) || [];
      if (moderatorRoles.some(roleId => member.roles.cache.has(roleId))) {
        return true;
      }
    }
    
    // Check for permission-based access
    const requiredPermissions = permissionMap[level];
    return requiredPermissions.length > 0 && member.permissions.has(requiredPermissions);
  }
  
  /**
   * Handle permission denied messages
   * @param messageOrInteraction The message or interaction that triggered the command
   * @param requiredLevel The permission level that was required
   */
  async handlePermissionDenied(
    messageOrInteraction: Message | ChatInputCommandInteraction,
    requiredLevel: PermissionLevel
  ): Promise<void> {
    const permissionNames = {
      [PermissionLevel.EVERYONE]: 'Everyone',
      [PermissionLevel.MODERATOR]: 'Moderator',
      [PermissionLevel.ADMINISTRATOR]: 'Administrator',
      [PermissionLevel.SERVER_OWNER]: 'Server Owner',
      [PermissionLevel.BOT_OWNER]: 'Bot Owner'
    };
    
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Permission Denied')
      .setDescription(`You need ${permissionNames[requiredLevel]} permissions to use this command.`);
    
    try {
      if (messageOrInteraction instanceof Message) {
        await messageOrInteraction.reply({ embeds: [embed] });
      } else {
        await messageOrInteraction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      logger.error(`Failed to send permission denied message: ${error.message}`);
    }
  }
}

// Export a singleton instance
export const permissionManager = new PermissionManager(); 