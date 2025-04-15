import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';

export const reminderCommand = {
  data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Set a reminder')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Reminder text')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('Remind after how many minutes?')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    const text = interaction.options.getString('text', true);
    const minutes = interaction.options.getInteger('minutes', true);
    await interaction.reply(`⏰ Reminder set for ${minutes} minute(s): ${text}`);
    setTimeout(() => {
      interaction.followUp(`⏰ Reminder: ${text}`);
    }, minutes * 60 * 1000);
  }
};
