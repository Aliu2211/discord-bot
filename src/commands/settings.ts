import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../config';

export const settingsCommand = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Configure server settings')
    .addStringOption(option =>
      option.setName('prefix')
        .setDescription('Set a custom command prefix')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('adminrole')
        .setDescription('Set the admin role name')
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    if (!interaction.guildId) return;
    const prefix = interaction.options.getString('prefix');
    const adminRole = interaction.options.getString('adminrole');
    const config = getGuildConfig(interaction.guildId);
    if (prefix) config.prefix = prefix;
    if (adminRole) config.adminRole = adminRole;
    setGuildConfig(interaction.guildId, config);
    await interaction.reply(`Settings updated! Prefix: \
\
${config.prefix} Admin Role: ${config.adminRole || 'Not set'}`);
  }
};
