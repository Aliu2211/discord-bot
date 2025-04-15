import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';

export const pollCommand = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Poll question')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('options')
        .setDescription('Comma-separated poll options (max 10)')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    const question = interaction.options.getString('question', true);
    const options = interaction.options.getString('options', true).split(',').map(o => o.trim()).slice(0, 10);
    if (options.length < 2) {
      await interaction.reply('Please provide at least 2 options.');
      return;
    }
    let description = '';
    const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
    options.forEach((opt, i) => {
      description += `${emojis[i]} ${opt}\n`;
    });
    const pollMsg = await interaction.reply({ content: `**${question}**\n${description}`, fetchReply: true });
    for (let i = 0; i < options.length; i++) {
      await pollMsg.react(emojis[i]);
    }
  }
};
