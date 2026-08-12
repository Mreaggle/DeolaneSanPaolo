import { describe, expect, it } from 'vitest';
import { assetRegistry } from '../../src/assets/registry';
import manifest from '../../ASSET_MANIFEST.md?raw';

describe('assetRegistry', () => {
  it('corresponde integralmente aos IDs e caminhos de imagem do manifesto', () => {
    const entries = manifest.split('\n').flatMap((line) => {
      const match = line.match(/^\|\s*(?:\d{3}\s*\|\s*)?`([^`]+)`\s*\|\s*`public\/(assets\/[^`]+)`/);
      return match ? [[match[1]!, match[2]!] as const] : [];
    });
    expect(assetRegistry).toEqual(Object.fromEntries(entries));
  });
});
