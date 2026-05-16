import { convert } from './converter';
import { Format, ConverterError, Language } from './types';
import { t, setLanguage, getLanguage } from './i18n';

// --- State ---
let dirty = false;

// --- DOM refs ---
const inputArea = document.getElementById('input-area') as HTMLTextAreaElement;
const outputArea = document.getElementById('output-area') as HTMLTextAreaElement;
const statusMsg = document.getElementById('status-msg') as HTMLSpanElement;
const fromSelect = document.getElementById('from-format') as HTMLSelectElement;
const toSelect = document.getElementById('to-format') as HTMLSelectElement;
const langLinks = document.querySelectorAll('#lang-switch a[data-lang]');

// --- Helpers ---
function updateI18n(): void {
  const els = document.querySelectorAll('[data-i18n]');
  els.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && !(el instanceof HTMLSelectElement)) el.textContent = t(key);
  });
  const phs = document.querySelectorAll('[data-i18n-placeholder]');
  phs.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) (el as HTMLTextAreaElement).placeholder = t(key);
  });
  document.documentElement.lang = getLanguage();
}

function setStatus(text: string, color?: string): void {
  statusMsg.textContent = text;
  statusMsg.style.color = color ?? '#c80';
}

function doConvert(): void {
  const text = inputArea.value;
  if (!text.trim()) return;
  const from = fromSelect.value as Format;
  const to = toSelect.value as Format;
  try {
    const result = convert(text, from, to);
    outputArea.value = result;
    dirty = false;
    statusMsg.textContent = '';
  } catch (e) {
    const msg = e instanceof ConverterError ? e.message : String(e);
    outputArea.value = `[ ${t('error.prefix')}: ${msg} ]`;
    dirty = false;
    statusMsg.textContent = '';
  }
}

function doCopy(): void {
  if (!outputArea.value) return;
  navigator.clipboard.writeText(outputArea.value).then(() => {
    const prev = statusMsg.textContent;
    const prevColor = statusMsg.style.color;
    setStatus(t('copied'), '#080');
    setTimeout(() => {
      statusMsg.textContent = prev;
      statusMsg.style.color = prevColor;
    }, 1500);
  });
}

function doDownload(): void {
  if (!outputArea.value) return;
  const fmt = toSelect.value;
  const extMap: Record<string, string> = { pln: 'pln', json: 'json', yaml: 'yaml', toml: 'toml', ini: 'ini', xml: 'xml' };
  const ext = extMap[fmt] ?? 'txt';
  const blob = new Blob([outputArea.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `output.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

function doClear(): void {
  inputArea.value = '';
  outputArea.value = '';
  dirty = false;
  statusMsg.textContent = '';
}

function doSwap(): void {
  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
  const inVal = inputArea.value;
  inputArea.value = outputArea.value;
  outputArea.value = inVal;
  dirty = false;
  statusMsg.textContent = '';
}

function setLang(lang: Language): void {
  setLanguage(lang);
  updateI18n();
  langLinks.forEach(el => {
    el.classList.toggle('lang-active', el.getAttribute('data-lang') === lang);
  });
  if (dirty) setStatus(t('modified'));
}

// --- Event binding ---
inputArea.addEventListener('input', () => {
  dirty = true;
  setStatus(t('modified'));
});

document.getElementById('convert-btn')!.addEventListener('click', e => { e.preventDefault(); doConvert(); });
document.getElementById('copy-btn')!.addEventListener('click', e => { e.preventDefault(); doCopy(); });
document.getElementById('download-btn')!.addEventListener('click', e => { e.preventDefault(); doDownload(); });
document.getElementById('clear-btn')!.addEventListener('click', e => { e.preventDefault(); doClear(); });
document.getElementById('swap-btn')!.addEventListener('click', e => { e.preventDefault(); doSwap(); });

langLinks.forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    setLang(el.getAttribute('data-lang') as Language);
  });
});

// --- Init ---
setLang(getLanguage());
