// config.js
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Default settings
const defaultConfig = {
  BOT_NAME: 'SILA TECH BOT',
  VERSION: '1.0.0',
  PREFIX: '.',
  OWNER_NUMBER: '255637351032',
  FOOTER: 'Created by Sila Tech',
  BOT_IMAGE: 'https://i.ibb.co/674988wP/silatech.jpg',
  MODE: 'public',
  ALLOW_PREFIXLESS: true
};

// Settings file path
const SETTINGS_FILE = './bot_settings.json';

// Load settings from file or create default
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      return { ...defaultConfig, ...data };
    }
  } catch (error) {
    console.log('⚠️ Error loading settings, using defaults');
  }
  return { ...defaultConfig };
}

// Save settings to file
function saveSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error saving settings:', error);
    return false;
  }
}

// Get setting value
function getSetting(key) {
  const settings = loadSettings();
  return settings[key] || defaultConfig[key];
}

// Update setting
function updateSetting(key, value) {
  const settings = loadSettings();
  settings[key] = value;
  return saveSettings(settings);
}

// Get current prefix
function getPrefix() {
  return getSetting('PREFIX');
}

// Check if prefixless is allowed
function isPrefixlessAllowed() {
  return getSetting('ALLOW_PREFIXLESS');
}

export const config = {
  get BOT_NAME() { return getSetting('BOT_NAME'); },
  get VERSION() { return getSetting('VERSION'); },
  get PREFIX() { return getSetting('PREFIX'); },
  get OWNER_NUMBER() { return getSetting('OWNER_NUMBER'); },
  get FOOTER() { return getSetting('FOOTER'); },
  get BOT_IMAGE() { return getSetting('BOT_IMAGE'); },
  get MODE() { return getSetting('MODE'); },
  get ALLOW_PREFIXLESS() { return getSetting('ALLOW_PREFIXLESS'); },
  loadSettings,
  saveSettings,
  getSetting,
  updateSetting,
  getPrefix,
  isPrefixlessAllowed
};