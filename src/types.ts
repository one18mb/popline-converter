export type Format = 'pln' | 'json' | 'yaml' | 'toml' | 'ini' | 'xml';

export type Language = 'zh' | 'en';

export type I18nDict = Record<string, string>;

export class ConverterError extends Error {
  constructor(msg: string) { super(msg); this.name = 'ConverterError'; }
}
