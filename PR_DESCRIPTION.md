# Enhanced Bot Systems

This PR adds three major improvements to the bot:

## 1. Error Handling System

- Added a new `ErrorHandler` class that properly categorizes, logs, and responds to errors
- Created error type categorization for better error tracking
- Enhanced user feedback with error embeds instead of plain text
- Improved logging with stack traces and context information

## 2. Cooldown System

- Implemented a flexible cooldown system to prevent command spam
- Support for per-command and per-user cooldowns
- Configurable cooldown duration and maximum uses within the cooldown period
- User-friendly cooldown messages showing remaining time
- Ability to reset cooldowns programmatically

## 3. Permission System

- Added a comprehensive permission system with five permission levels:
  - `EVERYONE`: All users can access
  - `MODERATOR`: Users with moderator roles or permissions
  - `ADMINISTRATOR`: Users with administrator permission
  - `SERVER_OWNER`: Server owner only
  - `BOT_OWNER`: Bot owner only
- Support for custom moderator roles per server
- Permission checking before command execution
- User-friendly permission denied messages

## Implementation Details

All three systems have been integrated into the command handling flow:
1. The message event handler first checks for permission level
2. Then it verifies cooldown status
3. If a command fails during execution, the error handler provides proper feedback

Each command can now specify its required permission level and cooldown settings in its data object.

## Example Usage

```typescript
export const data = {
    name: 'example',
    description: 'An example command',
    // Permission level required (EVERYONE, MODERATOR, ADMINISTRATOR, SERVER_OWNER, BOT_OWNER)
    permissionLevel: PermissionLevel.MODERATOR,
    // Cooldown in seconds
    cooldown: 10,
    // Maximum uses within cooldown period
    maxUses: 2,
    async execute(messageOrInteraction) {
        // Command logic
    }
};
```

These improvements make the bot more robust, user-friendly, and secure. 