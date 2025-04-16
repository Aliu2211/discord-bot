import Tesseract from 'tesseract.js';
// Use require for Jimp to fix static method typing issue
const Jimp = require('jimp');
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function extractTextFromImage(imageUrl: string, lang: string = 'eng', preprocess: string = ''): Promise<string> {
  try {
    // Download the image as a buffer
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('Failed to fetch image:', imageUrl, response.statusText);
      return 'Failed to fetch image.';
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    if (!imageBuffer || imageBuffer.length === 0) {
      console.error('Downloaded image buffer is empty:', imageUrl);
      return 'Downloaded image is empty or invalid.';
    }
    let processedBuffer = imageBuffer;
    if (preprocess) {
      try {
        const image = await Jimp.read(imageBuffer);
        if (preprocess.includes('grayscale')) image.grayscale();
        if (preprocess.includes('threshold')) image.threshold({ max: 128 });
        processedBuffer = await image.getBufferAsync('image/png');
        if (!processedBuffer || processedBuffer.length === 0) {
          console.error('Jimp processed buffer is empty.');
          return 'Image processing failed.';
        }
      } catch (err) {
        console.error('Jimp failed to process image:', err);
        return 'Image processing failed.';
      }
    }
    // Write buffer to a temp file
    const tempFile = path.join(__dirname, `../temp_${uuidv4()}.png`);
    fs.writeFileSync(tempFile, processedBuffer);
    let text = '';
    try {
      const result = await Tesseract.recognize(tempFile, lang, { logger: m => console.log(m) });
      text = result.data.text || 'No text found in image.';
      // Format the extracted text for readability
      text = formatExtractedText(text);
    } catch (error) {
      console.error('OCR error:', error);
      text = 'Failed to process image.';
    } finally {
      // Clean up temp file
      fs.unlinkSync(tempFile);
    }
    return text;
  } catch (error) {
    console.error('OCR error:', error);
    return 'Failed to process image.';
  }
}

// Helper to format extracted text for readability with Markdown
function formatExtractedText(text: string): string {
  // Remove excessive whitespace, normalize line breaks, trim lines
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // If the text is short, return as a code block for clarity
  if (lines.length <= 10) {
    return '```\n' + lines.join('\n') + '\n```';
  }

  // For longer text, use bullet points for each line
  return lines.map(line => `• ${line}`).join('\n');
}
