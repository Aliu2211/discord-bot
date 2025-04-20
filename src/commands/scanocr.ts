import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { extractTextFromImage } from '../ocr';

export const scanOcrCommand = {
  data: new SlashCommandBuilder()
    .setName('scanocr')
    .setDescription('Scan a document image for OCR with edge detection')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Image URL to process (or upload an attachment)')
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, _client: Client) {
    await interaction.deferReply();
    let url = interaction.options.getString('url');
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
    // Use strong preprocessing for document scan: grayscale + threshold
    const text = await extractTextFromImage(url, 'eng', 'grayscale,threshold');
    await interaction.editReply(text);
  }
};
