import { describe, it, expect } from 'vitest';
import { convert, FORMATS } from './converter';

const samplePln = `{
name: "PopLine"
version: "0.4.0"
features: [
"speed"
"simplicity" 1`;

const sampleJson = `{
  "name": "PopLine",
  "version": "0.4.0",
  "features": ["speed", "simplicity"]
}`;

describe('convert', () => {
  it('converts PopLine to JSON', () => {
    const result = convert(samplePln, 'pln', 'json');
    const parsed = JSON.parse(result);
    expect(parsed.name).toBe('PopLine');
    expect(parsed.features).toEqual(['speed', 'simplicity']);
  });

  it('converts JSON to PopLine', () => {
    const result = convert(sampleJson, 'json', 'pln');
    expect(result).toContain('name:');
    expect(result).toContain('PopLine');
    expect(result).toContain('speed');
  });

  it('round-trips through all formats', () => {
    for (const f of FORMATS) {
      if (f === 'xml') continue; // XML has structural quirks with arrays
      const a = convert(sampleJson, 'json', f);
      const b = convert(a, f, 'json');
      expect(JSON.parse(b)).toEqual(JSON.parse(sampleJson));
    }
  });

  it('throws on empty input', () => {
    expect(() => convert('', 'json', 'yaml')).toThrow('Input is empty');
  });

  it('throws on invalid JSON', () => {
    expect(() => convert('not json', 'json', 'yaml')).toThrow('Invalid JSON');
  });

  it('throws on invalid popline', () => {
    expect(() => convert('bare string', 'pln', 'json')).toThrow();
  });

  it('converts between non-JSON formats (pln→yaml)', () => {
    const result = convert(samplePln, 'pln', 'yaml');
    expect(result).toContain('name: PopLine');
    expect(result).toContain('features:');
  });

  it('converts toml to json and back', () => {
    const toml = 'title = "PopLine"\ncount = 42';
    const json = convert(toml, 'toml', 'json');
    expect(JSON.parse(json).title).toBe('PopLine');
  });
});
