import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
// sample jokes 
const jokes = [
  'Why did the scarecrow win an award? Because he was outstanding in his field!',
  'Why don’t skeletons fight each other? They don’t have the guts.',
  'What do you call fake spaghetti? An impasta!'
];
// randomly select a joke from the sample jokes
export const jokeCommand = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await interaction.reply(joke);
  }
};
