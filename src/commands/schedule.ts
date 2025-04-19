import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { setTimeout } from 'timers';

const scheduledTasks: { [key: string]: NodeJS.Timeout } = {};

export const scheduleCommand = {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Schedule a recurring reminder or announcement')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text to schedule')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('interval')
        .setDescription('Interval in minutes')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.deferReply();
    const text = interaction.options.getString('text', true);
    const interval = interaction.options.getInteger('interval', true);
    const userId = interaction.user.id;
    const channelId = interaction.channelId;
    const taskKey = `${userId}:${channelId}:${text}`;
    if (scheduledTasks[taskKey]) {
      await interaction.editReply('You already have this reminder scheduled.');
      return;
    }
    scheduledTasks[taskKey] = setInterval(async () => {
      try {
        await interaction.channel?.send(`<@${userId}> ⏰ Reminder: ${text}`);
      } catch {}
    }, interval * 60 * 1000);
    await interaction.editReply(`Scheduled reminder every ${interval} minute(s): "${text}". Use "/schedule_cancel" (not implemented) to stop.`);
  }
};
