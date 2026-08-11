import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const manifest = await readFile(resolve(root, 'ASSET_MANIFEST.md'), 'utf8');
const assets = manifest.split('\n').flatMap((line) => {
  const match = line.match(/^\|\s*\d{3}\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|.*?`(\d+)x(\d+)`\s*\|\s*`(opaque|transparent)`/);
  return match ? [{ id: match[1]!, filename: match[2]!, width: Number(match[3]), height: Number(match[4]), transparency: match[5]! }] : [];
});

const failures: string[] = [];
for (const asset of assets) {
  const path = resolve(root, asset.filename);
  try {
    await stat(path);
    const metadata = await sharp(path).metadata();
    if (metadata.format !== 'png') failures.push(`${asset.id}: formato ${metadata.format}`);
    if (metadata.width !== asset.width || metadata.height !== asset.height) failures.push(`${asset.id}: ${metadata.width}x${metadata.height}`);
    if (asset.transparency === 'transparent' && !metadata.hasAlpha) failures.push(`${asset.id}: sem alpha`);
    await stat(resolve(root, 'assets-meta', `${asset.id}.json`));
  } catch { failures.push(`${asset.id}: ausente`); }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`${assets.length} assets PNG e sidecars validados.`);
