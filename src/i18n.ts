import { Language } from './types';

const zh: Record<string, string> = {
  'app.title': 'PopLine 转换器',
  'from': '从',
  'to': '到',
  'swap': '互换',
  'input': '输入',
  'output': '输出',
  'modified': '已修改，未转换',
  'copied': '已复制',
  'convert': '转换',
  'copy': '复制',
  'download': '下载',
  'clear': '清空',
  'source': '源码',
  'report': '反馈',
  'error.prefix': '错误',
  'placeholder.input': '在此粘贴或输入内容...',
  'placeholder.output': '转换结果...',
  'footer.version': 'v0.1.0',
};

const en: Record<string, string> = {
  'app.title': 'PopLine Converter',
  'from': 'From',
  'to': 'To',
  'swap': 'Swap',
  'input': 'Input',
  'output': 'Output',
  'modified': 'Modified, not converted',
  'copied': 'Copied!',
  'convert': 'Convert',
  'copy': 'Copy',
  'download': 'Download',
  'clear': 'Clear',
  'source': 'Source',
  'report': 'Report bug',
  'error.prefix': 'Error',
  'placeholder.input': 'Paste or type here...',
  'placeholder.output': 'Conversion result...',
  'footer.version': 'v0.1.0',
};

const dicts: Record<Language, Record<string, string>> = { zh, en };

let currentLang: Language = 'zh';

export function setLanguage(lang: Language): void {
  currentLang = lang;
}

export function getLanguage(): Language {
  return currentLang;
}

export function t(key: string): string {
  return dicts[currentLang][key] ?? key;
}
