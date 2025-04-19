import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../config';

export const setWelcomeCommand = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Set a custom welcome message for new members')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Welcome message (use {user} for the new member)')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.deferReply();
    if (!interaction.guildId) {
      await interaction.editReply('This command can only be used in a server.');
      return;
    }
    const message = interaction.options.getString('message', true);
    const config = getGuildConfig(interaction.guildId);
    config.welcomeMessage = message;
    setGuildConfig(interaction.guildId, config);
    await interaction.editReply('Welcome message set!');
  }
};
