import { SlashCommandBuilder, ChatInputCommandInteraction, Client, AttachmentBuilder } from 'discord.js';
import { extractTextFromImage } from '../ocr';

export const ocrCommand = {
  data: new SlashCommandBuilder()
    .setName('ocr')
    .setDescription('Extract text from an image')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Image URL to process (optional if uploading an attachment)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('lang')
        .setDescription('Language code for OCR (default: eng)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('preprocess')
        .setDescription('Preprocess: grayscale, threshold, etc.')
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    let url = interaction.options.getString('url');
    const lang = interaction.options.getString('lang') || 'eng';
    const preprocess = interaction.options.getString('preprocess') || '';

    // If no URL provided, check for attachment
    if (!url && interaction.options.data.length === 0 && interaction.channel) {
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
      await interaction.reply('Please provide an image URL or upload an image as an attachment.');
      return;
    }

    await interaction.deferReply();
    const text = await extractTextFromImage(url, lang, preprocess);
    await interaction.editReply(text);
  }
};
