import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot and get a response'),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.reply('Pong!');
  }
};
