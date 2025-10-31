import { saveSettings, loadSettings } from './db.js';

const els = {
  provider: null,
  language: null,
  apiKey: null,
  saveBtn: null,
  saveStatus: null
};

async function init() {
  els.provider = document.getElementById('provider');
  els.language = document.getElementById('language');
  els.apiKey = document.getElementById('apiKey');
  els.saveBtn = document.getElementById('saveBtn');
  els.saveStatus = document.getElementById('saveStatus');

  const settings = await loadSettings();
  if (settings?.provider) els.provider.value = settings.provider;
  if (settings?.language) els.language.value = settings.language;
  if (settings?.apiKey) els.apiKey.value = settings.apiKey;

  els.saveBtn.addEventListener('click', onSave);
}

async function onSave() {
  const settings = {
    provider: els.provider.value,
    language: els.language.value,
    apiKey: (els.apiKey.value || '').trim()
  };
  await saveSettings(settings);
  els.saveStatus.textContent = 'Saved!';
  setTimeout(() => (els.saveStatus.textContent = ''), 1500);
}

document.addEventListener('DOMContentLoaded', init);


