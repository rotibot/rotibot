import { ChatInputCommandInteraction, Message } from 'discord.js';
import { PermissionLevel } from '../utils/permissions';

export const data = {
    name: 'ping',
    description: 'Ping the bot',
    // Setting permission level to EVERYONE
    permissionLevel: PermissionLevel.EVERYONE,
    // Setting a 5 second cooldown with 2 max uses
    cooldown: 5,
    maxUses: 2,
    async execute(messageOrInteraction: ChatInputCommandInteraction<'cached'> | Message<true>) {
        const rickrollGifUrl = 'https://c.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif';
        if (messageOrInteraction instanceof ChatInputCommandInteraction) {
            await messageOrInteraction.reply({ content: rickrollGifUrl, ephemeral: true });
        } else if (messageOrInteraction instanceof Message) {
            await messageOrInteraction.reply(rickrollGifUrl);
        }
    },
};