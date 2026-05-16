import { Pln, PlnError } from 'popline';
import yaml from 'js-yaml';
import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml';
import ini from 'ini';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { Format, ConverterError } from './types';

function parseInput(text: string, format: Format): unknown {
  switch (format) {
    case 'pln': {
      try { return Pln.parse(text); } catch (e) {
        throw new ConverterError(e instanceof PlnError ? e.message : String(e));
      }
    }
    case 'json': {
      try { return JSON.parse(text); } catch (e) {
        throw new ConverterError(`Invalid JSON: ${(e as Error).message}`);
      }
    }
    case 'yaml': {
      try { return yaml.load(text); } catch (e) {
        throw new ConverterError(`Invalid YAML: ${(e as Error).message}`);
      }
    }
    case 'toml': {
      try { return tomlParse(text); } catch (e) {
        throw new ConverterError(`Invalid TOML: ${(e as Error).message}`);
      }
    }
    case 'ini': {
      try { return ini.parse(text); } catch (e) {
        throw new ConverterError(`Invalid INI: ${(e as Error).message}`);
      }
    }
    case 'xml': {
      try {
        return new XMLParser({ ignoreAttributes: false }).parse(text);
      } catch (e) {
        throw new ConverterError(`Invalid XML: ${(e as Error).message}`);
      }
    }
  }
}

function serializeOutput(obj: unknown, format: Format): string {
  switch (format) {
    case 'pln': {
      try { return Pln.stringify(obj); } catch (e) {
        throw new ConverterError(e instanceof PlnError ? e.message : String(e));
      }
    }
    case 'json':
      return JSON.stringify(obj, null, 2);
    case 'yaml':
      return yaml.dump(obj);
    case 'toml':
      return tomlStringify(obj);
    case 'ini':
      return ini.stringify(obj);
    case 'xml':
      return new XMLBuilder({ ignoreAttributes: false, format: true }).build(obj);
  }
}

export function convert(text: string, from: Format, to: Format): string {
  if (!text.trim()) {
    throw new ConverterError('Input is empty');
  }
  const obj = parseInput(text, from);
  return serializeOutput(obj, to);
}

export const FORMATS: Format[] = ['pln', 'json', 'yaml', 'toml', 'ini', 'xml'];
