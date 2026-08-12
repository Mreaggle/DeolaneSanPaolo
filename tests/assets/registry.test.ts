import { describe, expect, it } from 'vitest';
import { assetRegistry } from '../../src/assets/registry';
import manifest from '../../ASSET_MANIFEST.md?raw';

describe('assetRegistry', () => {
  it('corresponde integralmente aos 161 IDs e caminhos do manifesto', () => {
    const entries = manifest.split('\n').flatMap((line) => {
      const match = line.match(/^\|\s*\d{3}\s*\|\s*`([^`]+)`\s*\|\s*`public\/([^`]+)`/);
      return match ? [[match[1]!, match[2]!] as const] : [];
    });
    expect(Object.keys(assetRegistry)).toHaveLength(161);
    for (const [id, path] of entries) expect(assetRegistry[id], id).toBe(path);
  });
});
