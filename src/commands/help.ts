import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';

export const helpCommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available commands'),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.reply({
      content: `**Available Commands:**\n/help - Show this help\n/ping - Ping the bot\n/ocr - Extract text from an image\n/joke - Get a random joke\n/reminder - Set a reminder\n/poll - Create a poll`,
      ephemeral: true
    });
  }
};
