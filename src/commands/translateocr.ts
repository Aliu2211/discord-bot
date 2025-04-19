import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { extractTextFromImage } from '../ocr';
import fetch from 'node-fetch';

export const translateOcrCommand = {
  data: new SlashCommandBuilder()
    .setName('translateocr')
    .setDescription('Extract text from an image and translate it to another language')
    .addStringOption(option =>
      option.setName('tolang')
        .setDescription('Target language code (e.g., es, fr, de)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Image URL to process (or upload an attachment)')
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.deferReply();
    let url = interaction.options.getString('url');
    const toLang = interaction.options.getString('tolang', true);
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
    const ocrText = await extractTextFromImage(url);
    if (!ocrText || ocrText.startsWith('Failed')) {
      await interaction.editReply('Could not extract text from the image.');
      return;
    }
    // Translate using LibreTranslate public API
    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: ocrText, source: 'auto', target: toLang, format: 'text' })
      });
      if (!res.ok) throw new Error('Translation API error');
      const data = await res.json();
      await interaction.editReply(`**Extracted Text:**\n${ocrText}\n\n**Translated (${toLang}):**\n${data.translatedText}`);
    } catch (e) {
      await interaction.editReply('Failed to translate the extracted text.');
    }
  }
};
