# Discord Bot (TypeScript)

A modular, feature-rich Discord bot with OCR, fun, utility, and server management commands. Built with TypeScript, Discord.js v14+, and Tesseract.js.

## Features
- **Slash Commands**: `/help`, `/ping`, `/ocr`, `/joke`, `/reminder`, `/poll`, `/settings`
- **OCR**: Extract text from images with optional language and preprocessing (grayscale, threshold)
- **Fun & Utility**: Jokes, reminders, polls
- **Legacy Prefix Support**: `!ping`, `!help`, `!ocr` (with image attachment)
- **Per-Server Settings**: Custom prefix, admin role
- **Rate Limiting**: Prevents command spam
- **Image Filtering**: Only processes image attachments
- **Multi-image Support**: OCR on multiple images
- **Admin Controls**: Restrict settings to admins

## Setup
1. **Clone the repo**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment**
   - Create a `.env` file:
     ```env
     DISCORD_TOKEN=your-bot-token-here
     ```
4. **Run the bot**
   ```sh
   npm start
   ```

## Commands
### Slash Commands
- `/help` — List all commands
- `/ping` — Ping the bot
- `/ocr url:<image_url> [lang:<code>] [preprocess:<option>]` — OCR with options
- `/joke` — Get a random joke
- `/reminder text:<text> minutes:<n>` — Set a reminder
- `/poll question:<q> options:<opt1,opt2,...>` — Create a poll
- `/settings [prefix:<char>] [adminrole:<role>]` — Configure server

### Prefix Commands (Legacy)
- `!ping`, `!help`, `!ocr` (with image attachment)

## Customization
- Edit `src/config.ts` for config logic
- Add new commands in `src/commands/`

## Dependencies
- discord.js
- tesseract.js
- jimp
- dotenv
- typescript

---
MIT License