# R.O.T.I Discord Bot

Welcome to **R.O.T.I**, a powerful and easy-to-use Discord bot designed to enhance your server experience! This bot is open-source, allowing anyone to contribute and help improve its functionality.

## Features

- **Custom Commands**: Create and manage your own commands to personalize your server.
- **Moderation Tools**: Includes kick, ban, mute, and other essential moderation commands.
- **Fun Commands**: Fun interactive commands like `r!vkick`, `r!quote`, and more.
- **Logging & Analytics**: Monitor server activity with detailed logs and analytics.
- **Role Management**: Easily assign roles and manage permissions.

  and many more ...

## Installation

To add **R.O.T.I** to your server, follow these simple steps:

1. **Set up your bot**:
    - Clone the repository:  
      ```bash
      git clone https://github.com/rotibot/rotibot.git
      ```
    - Navigate to the bot's directory:
      ```bash
      cd rotibot
      ```
    - Install dependencies:
      ```bash
      pnpm install
      ```
3. **Configure the bot**:
    - Create a `.env` file in the root directory and add your bot's **Discord Token**:
      ```
      DISCORD_TOKEN=your-bot-token-here
      ```
    - Add any other necessary configuration (like prefix, logging channels, etc.)

4. **Run the bot**:
    ```bash
    node bot.js
    ```

## Usage

Once the bot is running, you can start using the following commands:

### General Commands
- `r!help` – Displays the list of commands.
- `r!ping` – Checks the bot’s latency.

### Moderation Commands
- `r!kick @user` – Kicks a user from the server.
- `r!ban @user` – Bans a user from the server.
- `r!mute @user` – Mutes a user in voice channels.

For the full list of available commands, use `r!help`.

## Contributing

We welcome contributions to **R.O.T.I**! If you would like to help improve this bot, follow these steps:

1. **Fork** the repository and clone your fork:
    ```bash
    git clone https://github.com/rotibot/rotibot.git
    ```
    
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```

3. Make your changes and commit them:
    ```bash
    git commit -m "Add a description of your changes"
    ```

4. Push your changes to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```

5. Create a pull request (PR) to the main repository.

Make sure to follow the code style and include relevant documentation for your changes. We appreciate all contributions!

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Support
If you encounter any issues or have any questions, feel free to open an issue on this repository. You can also join our support [Discord server](https://discord.gg/xD5Yb89VJx) for help.
