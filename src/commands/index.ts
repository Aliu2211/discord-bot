import { Client, ChatInputCommandInteraction, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { helpCommand } from './help';
import { pingCommand } from './ping';
import { ocrCommand } from './ocr';
import { jokeCommand } from './joke';
import { reminderCommand } from './reminder';
import { pollCommand } from './poll';
import { settingsCommand } from './settings';

export const commands = [helpCommand, pingCommand, ocrCommand, jokeCommand, reminderCommand, pollCommand, settingsCommand];

// Registing slash commands

export async function registerSlashCommands(clientId: string, token: string) {
  const rest = new REST({ version: '10' }).setToken(token);
  const slashCommands = commands.map(cmd => cmd.data.toJSON());
  await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
}

// Handling slash commands
export async function handleSlashCommand(interaction: ChatInputCommandInteraction, client: Client) {
  const command = commands.find(cmd => cmd.data.name === interaction.commandName);
  if (command) {
    await command.execute(interaction, client);
  }
}
