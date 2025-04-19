import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const ttsCommand = {
  data: new SlashCommandBuilder()
    .setName('tts')
    .setDescription('Convert text to speech and send as audio')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text to convert to speech')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.deferReply();
    const text = interaction.options.getString('text', true);
    try {
      const apiKey = process.env.VOICERSS_API_KEY || '';
      if (!apiKey) {
        await interaction.editReply('TTS API key not set. Please set VOICERSS_API_KEY in your .env file.');
        return;
      }
      const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (!response.ok) {
        await interaction.editReply('Failed to generate speech.');
        return;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 1000) {
        await interaction.editReply('TTS API returned an error or empty audio.');
        return;
      }
      const tempFile = path.join(__dirname, `../../temp_${uuidv4()}.mp3`);
      fs.writeFileSync(tempFile, buffer);
      await interaction.editReply({ content: 'Here is your speech:', files: [tempFile] });
      fs.unlinkSync(tempFile);
    } catch (e) {
      await interaction.editReply('Sorry, something went wrong with TTS.');
    }
  }
};
