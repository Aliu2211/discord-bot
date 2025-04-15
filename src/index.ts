import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { registerSlashCommands, handleSlashCommand } from './commands';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', async () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerSlashCommands(client.user.id, process.env.DISCORD_TOKEN!);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await handleSlashCommand(interaction, client);
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('DISCORD_TOKEN is not set in .env');
}

client.login(token);
