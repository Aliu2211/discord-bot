import fs from 'fs';
import path from 'path';

const configPath = path.join(__dirname, '../config.json');

export interface GuildConfig {
  prefix: string;
  adminRole?: string;
}

interface ConfigData {
  [guildId: string]: GuildConfig;
}

export function getGuildConfig(guildId: string): GuildConfig {
  if (!fs.existsSync(configPath)) return { prefix: '!' };
  const data: ConfigData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return data[guildId] || { prefix: '!' };
}

export function setGuildConfig(guildId: string, config: GuildConfig) {
  let data: ConfigData = {};
  if (fs.existsSync(configPath)) {
    data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  data[guildId] = config;
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
}
