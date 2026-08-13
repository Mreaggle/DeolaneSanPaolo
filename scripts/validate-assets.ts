import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const manifest = await readFile(resolve(root, 'ASSET_MANIFEST.md'), 'utf8');
const assets = manifest.split('\n').flatMap((line) => {
  const match = line.match(/^\|\s*\d{3}\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|.*?`(\d+)x(\d+)`\s*\|\s*`(opaque|transparent)`/);
  return match ? [{ id: match[1]!, filename: match[2]!, category: match[3]!, width: Number(match[4]), height: Number(match[5]), transparency: match[6]! }] : [];
});

const failures: string[] = [];
const animationFrameCounts: Readonly<Record<string, number>> = {
  'travel-airplane-spritesheet': 4,
  'trail-alert-spritesheet': 4,
  'capture-spritesheet': 3,
  'escape-spritesheet': 3,
  'henchman-run-spritesheet': 8,
  'henchman-sneak-spritesheet': 8,
  'capture-dramatic-spritesheet': 5,
  'footsteps-spritesheet': 8
};

for (const asset of assets) {
  const path = resolve(root, asset.filename);
  try {
    await stat(path);
    const metadata = await sharp(path).metadata();
    if (metadata.format !== 'png') failures.push(`${asset.id}: formato ${metadata.format}`);
    if (metadata.width !== asset.width || metadata.height !== asset.height) failures.push(`${asset.id}: ${metadata.width}x${metadata.height}`);
    if (asset.transparency === 'transparent' && !metadata.hasAlpha) failures.push(`${asset.id}: sem alpha`);
    const frameCount = animationFrameCounts[asset.id];
    if (asset.category === 'animation-sheet' && !frameCount) failures.push(`${asset.id}: animação sem contagem de quadros registrada em validate-assets.ts`);
    if (frameCount) {
      if (asset.width % frameCount !== 0) {
        failures.push(`${asset.id}: largura não divisível por ${frameCount} quadros`);
      } else {
        const frameWidth = asset.width / frameCount;
        const hashes = new Set<string>();
        for (let index = 0; index < frameCount; index += 1) {
          const { data, info } = await sharp(path)
            .extract({ left: index * frameWidth, top: 0, width: frameWidth, height: asset.height })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
          let opaquePixels = 0;
          for (let offset = 3; offset < data.length; offset += info.channels) {
            if (data[offset]! > 0) opaquePixels += 1;
          }
          if (opaquePixels === 0) failures.push(`${asset.id}: quadro ${index + 1} totalmente transparente`);
          hashes.add(createHash('sha256').update(data).digest('hex'));
        }
        if (hashes.size !== frameCount) failures.push(`${asset.id}: contém quadros visualmente duplicados`);
      }
    }
    await stat(resolve(root, 'assets-meta', `${asset.id}.json`));
  } catch { failures.push(`${asset.id}: ausente`); }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`${assets.length} assets PNG e sidecars validados.`);
