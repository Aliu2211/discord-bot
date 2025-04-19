import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import fetch from 'node-fetch';
// Use require for Jimp to fix static method typing issue
const Jimp = require('jimp');
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const filterCommand = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Apply a fun filter to an image')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Filter type (e.g., grayscale, invert, blur)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Image URL to filter (or upload an attachment)')
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.deferReply();
    let url = interaction.options.getString('url');
    const filterType = interaction.options.getString('type', true);
    // Try to get attachment if no URL
    if (!url && interaction.channel) {
      const messages = await interaction.channel.messages.fetch({ limit: 10 });
      const userMsg = messages.find(m => m.author.id === interaction.user.id && m.attachments.size > 0);
      if (userMsg) {
        const attachment = userMsg.attachments.first();
        if (attachment && attachment.contentType?.startsWith('image/')) {
          url = attachment.url;
        }
      }
    }
    if (!url) {
      await interaction.editReply('Please provide an image URL or upload an image as an attachment.');
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        await interaction.editReply('Failed to fetch the image.');
        return;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      const image = await Jimp.read(buffer);
      if (filterType === 'grayscale') image.grayscale();
      else if (filterType === 'invert') image.invert();
      else if (filterType === 'blur') image.blur(5);
      else {
        await interaction.editReply('Unknown filter type. Supported: grayscale, invert, blur.');
        return;
      }
      const tempFile = path.join(__dirname, `../../temp_${uuidv4()}.png`);
      await image.writeAsync(tempFile);
      await interaction.editReply({ content: `Here is your filtered image (${filterType}):`, files: [tempFile] });
      fs.unlinkSync(tempFile);
    } catch (e) {
      await interaction.editReply('Sorry, something went wrong while applying the filter.');
    }
  }
};
