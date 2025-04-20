import { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import path from 'path';

// Store custom commands per guild
interface GuildCustomCommands {
  [commandName: string]: string;
}

interface CustomCommandsData {
  [guildId: string]: GuildCustomCommands;
}

const customCommandsPath = path.join(__dirname, '../../customcommands.json');

function getCustomCommands(): CustomCommandsData {
  if (!fs.existsSync(customCommandsPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(customCommandsPath, 'utf8'));
  } catch {
    return {};
  }
}

function saveCustomCommands(data: CustomCommandsData): void {
  fs.writeFileSync(customCommandsPath, JSON.stringify(data, null, 2));
}

export const customCmdCommand = {
  data: new SlashCommandBuilder()
    .setName('customcmd')
    .setDescription('Create or manage a custom command (admin only)')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Custom command name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('response')
        .setDescription('Response for the custom command (leave empty to delete)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.deferReply();
    
    if (!interaction.guild) {
      await interaction.editReply('This command can only be used in a server.');
      return;
    }
    
    const commandName = interaction.options.getString('name', true).toLowerCase();
    const response = interaction.options.getString('response');
    
    // Basic validation for custom command name
    if (!/^[a-z0-9-_]{1,32}$/.test(commandName)) {
      await interaction.editReply('Invalid command name. Use only lowercase letters, numbers, hyphens, and underscores (1-32 characters).');
      return;
    }
    
    // Don't allow overriding built-in commands
    const reservedCommands = ['help', 'ping', 'ocr', 'joke', 'reminder', 'poll', 'settings', 'customcmd'];
    if (reservedCommands.includes(commandName)) {
      await interaction.editReply(`Cannot create custom command "${commandName}" as it would override a built-in command.`);
      return;
    }
    
    const customCommands = getCustomCommands();
    if (!customCommands[interaction.guild.id]) {
      customCommands[interaction.guild.id] = {};
    }
    
    if (!response) {
      // Delete the custom command if no response is provided
      if (customCommands[interaction.guild.id][commandName]) {
        delete customCommands[interaction.guild.id][commandName];
        saveCustomCommands(customCommands);
        await interaction.editReply(`Custom command "/${commandName}" has been deleted.`);
      } else {
        await interaction.editReply(`Custom command "/${commandName}" doesn't exist.`);
      }
      return;
    }
    
    // Create or update the custom command
    customCommands[interaction.guild.id][commandName] = response;
    saveCustomCommands(customCommands);
    
    await interaction.editReply(`Custom command "/${commandName}" has been ${
      customCommands[interaction.guild.id][commandName] ? 'updated' : 'created'
    }. Users can run it by typing "/${commandName}" in chat.`);
  }
};

// Add a utility function to handle custom commands execution
export function handleCustomCommand(commandName: string, interaction: ChatInputCommandInteraction): boolean {
  if (!interaction.guild) return false;
  
  const customCommands = getCustomCommands();
  const guildCommands = customCommands[interaction.guild.id] || {};
  
  if (guildCommands[commandName]) {
    interaction.reply(guildCommands[commandName]);
    return true;
  }
  
  return false;
}
