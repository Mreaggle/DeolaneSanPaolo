import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const corpus = resolve(root, 'references/carmen_sandiego_DOS/www');
const output = resolve(root, '.cache/visual-reference');

const walk = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
};

const files = (await walk(corpus)).filter((file) => extname(file).toLowerCase() === '.png');
const records = [];
for (const file of files) {
  const image = sharp(file);
  const metadata = await image.metadata();
  const stats = await image.stats();
  records.push({
    path: relative(root, file),
    width: metadata.width,
    height: metadata.height,
    channels: metadata.channels,
    hasAlpha: metadata.hasAlpha,
    dominant: stats.dominant
  });
}
await mkdir(output, { recursive: true });
await writeFile(join(output, 'reference-index.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), source: 'IcaroBernardes/carmen_sandiego_DOS comparative corpus', count: records.length, records }, null, 2)}\n`);
console.log(`Analisadas ${records.length} imagens em ${relative(root, corpus)}.`);
