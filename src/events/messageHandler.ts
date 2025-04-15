import { Message } from 'discord.js';
import { extractTextFromImage } from '../ocr';

const prefix = '!';
const rateLimit = new Map<string, number>();
const RATE_LIMIT_SECONDS = 10;

export async function handleMessage(msg: Message) {
  if (msg.author.bot) return;

  // Rate limiting
  const now = Date.now();
  const last = rateLimit.get(msg.author.id) || 0;
  if (now - last < RATE_LIMIT_SECONDS * 1000) {
    await msg.reply('⏳ Please wait before using another command.');
    return;
  }
  rateLimit.set(msg.author.id, now);

  // Prefix command support
  if (msg.content.startsWith(prefix)) {
    const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/\s+/);
    if (cmd === 'ping') {
      await msg.reply('Pong!');
    } else if (cmd === 'help') {
      await msg.reply('Try /help for a list of commands!');
    } else if (cmd === 'ocr' && msg.attachments.size > 0) {
      for (const attachment of msg.attachments.values()) {
        if (!attachment.contentType?.startsWith('image/')) continue;
        const text = await extractTextFromImage(attachment.url);
        await msg.reply(text);
      }
    }
    // Add more legacy commands as needed
    return;
  }

  // OCR on image attachments (legacy, no command)
  if (msg.attachments.size > 0) {
    for (const attachment of msg.attachments.values()) {
      if (!attachment.contentType?.startsWith('image/')) continue;
      const text = await extractTextFromImage(attachment.url);
      await msg.reply(text);
    }
  }
}
