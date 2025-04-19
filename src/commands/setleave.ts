import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../config';

export const setLeaveCommand = {
  data: new SlashCommandBuilder()
    .setName('setleave')
    .setDescription('Set a custom leave message for departing members')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Leave message (use {user} for the departing member)')
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
    config.leaveMessage = message;
    setGuildConfig(interaction.guildId, config);
    await interaction.editReply('Leave message set!');
  }
};
