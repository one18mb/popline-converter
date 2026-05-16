import { describe, it, expect } from 'vitest';
import { t, setLanguage, getLanguage } from './i18n';

describe('i18n', () => {
  it('returns Chinese by default', () => {
    expect(getLanguage()).toBe('zh');
  });

  it('returns translated key', () => {
    expect(t('convert')).toBe('转换');
  });

  it('switches to English', () => {
    setLanguage('en');
    expect(t('convert')).toBe('Convert');
  });

  it('returns key itself for missing keys', () => {
    expect(t('nonexistent')).toBe('nonexistent');
  });

  it('round-trips language switch', () => {
    setLanguage('zh');
    expect(t('copy')).toBe('复制');
    setLanguage('en');
    expect(t('copy')).toBe('Copy');
    setLanguage('zh');
  });
});
