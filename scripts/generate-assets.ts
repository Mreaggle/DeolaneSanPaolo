import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
import { suspects } from '../src/content/data/suspects';

interface AssetEntry {
  id: string;
  filename: string;
  category: string;
  purpose: string;
  width: number;
  height: number;
  transparency: 'opaque' | 'transparent';
}

const root = resolve(import.meta.dirname, '..');
const rawDir = resolve(root, '.cache/generated-assets');
const metaDir = resolve(root, 'assets-meta');
const cli = resolve(root, 'scripts/imagegen.sh');
const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const option = (name: string): string | undefined => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const run = flag('--run');
const dryRun = flag('--dry-run') || !run;
const force = flag('--force');
const skipExisting = flag('--skip-existing');
const only = option('--only');
const category = option('--category');
const maxAssets = Number(option('--max-assets') ?? Number.POSITIVE_INFINITY);
const concurrency = Math.max(1, Math.min(6, Number(option('--concurrency') ?? 4)));
const model = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2';

const manifest = await readFile(resolve(root, 'ASSET_MANIFEST.md'), 'utf8');
const assets = manifest.split('\n').flatMap((line): AssetEntry[] => {
  const match = line.match(/^\|\s*\d{3}\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*`(\d+)x(\d+)`\s*\|\s*`(opaque|transparent)`/);
  if (!match) return [];
  return [{ id: match[1]!, filename: match[2]!, category: match[3]!, purpose: match[4]!.trim(), width: Number(match[5]), height: Number(match[6]), transparency: match[7] as AssetEntry['transparency'] }];
}).filter((asset) => (!only || asset.id === only) && (!category || asset.category === category)).slice(0, maxAssets);

if (!assets.length) throw new Error('Nenhum asset selecionado.');

const ref = (path: string) => resolve(root, 'references/carmen_sandiego_DOS/www', path);
const referencesFor = (asset: AssetEntry): string[] => {
  if (asset.id === 'icon-pc') return [resolve(root, 'public/assets/icons/icon-see.png'), resolve(root, 'public/assets/icons/icon-depart.png'), resolve(root, 'public/assets/icons/icon-search.png')];
  if (asset.id === 'warrant-computer-panel') return [resolve(root, 'public/assets/narrative/warrant-computer-panel.png')];
  if (asset.id === 'henchman-run-spritesheet') return [resolve(root, 'public/assets/animations/capture-spritesheet.png'), resolve(root, 'public/assets/animations/escape-spritesheet.png')];
  if (asset.id === 'title-background') return [resolve(rawDir, 'title-background-base.png'), resolve(rawDir, 'suspect-deolane-san-paolo-dossier.png'), ref('cities/rio_de_janeiro.png')];
  if (asset.id === 'suspect-deolane-san-paolo-dossier') return [ref('profiles/carmen_sandiego.png'), ref('profiles/lady_agatha_wayland.png'), ref('profiles/len_red_bulk.png')];
  if (asset.category === 'suspect-encounter') {
    const id = asset.id.replace(/^suspect-/, '').replace(/-encounter$/, '');
    return [resolve(rawDir, `suspect-${id}-dossier.png`), ref('profiles/carmen_sandiego.png')];
  }
  if (asset.category === 'city-scene') return [ref('cities/rio_de_janeiro.png'), ref('cities/bangkok.png')];
  if (asset.category === 'place-background') return [ref('raws/bank_raw.png'), ref('raws/harbor_raw.png')];
  if (asset.category === 'witness-sprite') return [ref('raws/bank_person_raw.png'), ref('raws/airport_person_raw.png')];
  if (asset.category.startsWith('suspect')) return [ref('profiles/carmen_sandiego.png'), ref('profiles/len_red_bulk.png')];
  if (asset.category === 'stolen-item') return [ref('fax.png'), ref('paper.png')];
  if (['ui-icon', 'emblem', 'badge', 'animation-sheet'].includes(asset.category)) return [ref('magglass.png'), ref('detective_raw.png')];
  if (asset.id === 'world-map') return [ref('world.png'), ref('cities/london.png')];
  return [ref('cities/rio_de_janeiro.png'), ref('raws/bank_raw.png')];
};

const styleLock = 'STYLE LOCK: late-1980s to early-1990s DOS EGA/VGA pixel art, hard square pixels, strong black outlines, chunky pixel clusters, restrained 32-color indexed-palette appearance, deliberate checkerboard dithering, compact readable silhouettes, period-authentic caricature. Use input images only for rendering grammar and palette; create entirely original subjects and compositions.';
const negatives = 'No copied characters, no copyrighted logo, no readable text, no letters, no watermark, no signature, no modern vector art, no photorealism, no smooth gradients, no blur, no antialiasing, no soft shadow, no rounded app UI.';

const suspectPrompt = (asset: AssetEntry): string => {
  const id = asset.id.replace(/^suspect-/, '').replace(/-(dossier|encounter)$/, '');
  const suspect = suspects.find((candidate) => candidate.id === id);
  const encounter = asset.category === 'suspect-encounter';
  const deolane = id === 'deolane-san-paolo'
    ? 'Mandatory recognition hierarchy: straight voluminous blonde hair; extremely enormous bright-red lipstick-covered lips; very heavy excessive makeup; huge gold earrings; conspicuously oversized thick gold necklace; an ENORMOUS gold pendant centered on the chest; flashy ostentatious magenta/red/leopard-print wardrobe. Preserve every one of these traits.'
    : `Original Brazilian comic criminal named ${suspect?.name ?? id}, occupation ${suspect?.occupation ?? 'Tríade Chapa-Coco henchperson'}. ${suspect?.biography ?? ''} Distinct appearance derived from these identity traits: ${Object.values(suspect?.traits ?? {}).join(', ')}.`;
  return `${styleLock} Create a ${encounter ? 'dynamic knees-up encounter pose' : 'centered head-and-upper-torso dossier portrait'} of an ${deolane} ${encounter ? 'The character is reacting to a detective entering the hideout, but remains fully visible.' : 'Neutral three-quarter mugshot-like composition with expressive face.'} Flat saturated chroma green #00FF00 background, absolutely uniform, with no cast shadow, for local removal. ${negatives}`;
};

const promptFor = (asset: AssetEntry): string => {
  if (asset.id === 'icon-pc') return `${styleLock} Create one compact late-1980s personal-computer pictogram for the P.C. warrant button: CRT monitor with a tiny cyan screen, blocky keyboard, white and light-gray body, dark-navy outline and one restrained magenta accent. It must match the existing SEE, DEPART and SEARCH action icons and remain readable at exactly 24x24. Single centered object with generous margin. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.id === 'warrant-computer-panel') return `${styleLock} Create a straight-on close-up of a bulky late-1980s warrant computer filling the entire 340x306 frame, with almost no surrounding room. Its large, clean, uninterrupted dark-navy CRT display must occupy approximately x=24..316 and y=42..248 so browser-rendered filters can sit inside it. Add a thick gray and beige bezel, vents, indicator lights and a narrow hardware shelf along the bottom. Symmetrical front view, no perspective tilt, no desk, window, landscape, people or embedded interface controls. ${negatives}`;
  if (asset.id === 'henchman-run-spritesheet') return `${styleLock} Create exactly eight equal square frames in one horizontal row showing the same original comic T.C.C. henchman running to the right. Black-and-white striped prison shirt, dark cropped trousers, small black eye mask, soft cap, black shoes and a bouncing brown money sack. Full-body side-view run cycle, stable scale and anchor, readable limb motion and a few dust pixels. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.category.startsWith('suspect')) return suspectPrompt(asset);
  if (asset.id === 'title-background') return `${styleLock} EDIT THE FIRST INPUT, which is an original title background owned by this project. Preserve its complete 640:400 composition: the woman on the left, globe, Rio de Janeiro silhouettes, blue night palette, and quiet dark right half for browser-rendered title text. Change only the woman's facial and identity details to match the SECOND input: make her lips extremely enormous and covered in vivid saturated bright-red lipstick, retain straight blonde hair, intensify the heavy makeup, keep giant gold earrings, thick necklace and enormous centered gold pendant. Her bright-red lips must remain unmistakable after reduction to 640x400. Do not add any text or UI. Edge-to-edge opaque art. ${negatives}`;
  if (asset.category === 'city-scene') return `${styleLock} Create an original vertical world-detective-game city scene: ${asset.purpose} Show two or three unmistakable local architecture/geography cues, foreground activity, middle-ground landmark, distant skyline, daytime unless the subject demands otherwise. Edge-to-edge opaque scene, no people close-up. ${negatives}`;
  if (asset.category === 'place-background') return `${styleLock} Create an original vertical investigation location scene: ${asset.purpose} Clear foreground where a witness sprite could stand, layered interior or exterior, period-neutral international setting, edge-to-edge opaque. ${negatives}`;
  if (asset.category === 'witness-sprite') return `${styleLock} Create one completely original Brazilian-comedy witness character for: ${asset.purpose}. Full body from head to shoes, lively clue-giving gesture, exaggerated friendly face, instantly readable occupational costume and silhouette, centered with generous margin. Flat saturated chroma green #00FF00 background, absolutely uniform, no cast shadow, for local removal. ${negatives}`;
  if (asset.category === 'stolen-item') return `${styleLock} Create one ornate museum-heist object cutout: ${asset.purpose} Centered three-quarter object view, black contour, jewel-like highlights, readable at 96 pixels, generous margin. Flat saturated chroma green #00FF00 background, absolutely uniform, no cast shadow. ${negatives}`;
  if (asset.category === 'ui-icon') return `${styleLock} Create one minimal high-contrast DOS UI pictogram: ${asset.purpose} Single centered object, bold 1-bit-like silhouette, navy/white with one red accent, readable at ${asset.width}x${asset.height}. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.id === 'agency-emblem') return `${styleLock} Create a completely original shield-shaped emblem for the fictional Brazilian Agência Federal, using a fully filled deep-navy central medallion, a gold five-point star, a tiny abstract compass rose, green lower field and restrained laurels. It may evoke broad Brazilian institutional heraldry but must not reproduce or closely resemble the official Polícia Federal badge, coat of arms, wording, proportions, symbols or arrangement. The center must be opaque and meaningful, never a hole. Compact, symmetrical and readable at 64 pixels, without letters or words. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.id === 'tcc-emblem') return `${styleLock} Create the original criminal crest of the Tríade Chapa-Coco. Arrange exactly three stylized cracked coconut halves in a threatening triangular heraldic composition, with gold chain, red accents and dark navy field; compact, symmetrical and readable at 64 pixels, without letters or words. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.category === 'emblem') return `${styleLock} Create one original fictional crest: ${asset.purpose} Symmetrical medal-like emblem, readable at 64 pixels, gold/navy/red, no letters or words. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.category === 'badge') return `${styleLock} Create one original detective rank shield: ${asset.purpose} Symmetrical gold-and-navy badge, visual rank motif without lettering, readable at 48 pixels. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.category === 'animation-sheet') return `${styleLock} Create a single horizontal DOS sprite strip: ${asset.purpose} Exactly four equally spaced sequential frames, consistent sprite scale, no separators, readable after reduction to ${asset.width}x${asset.height}. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.id === 'world-map') return `${styleLock} Create a simplified Robinson-style world map for a detective travel screen, dark navy oceans, pale gray landmasses, black coast outlines, no borders, labels, text or markers, edge-to-edge opaque. ${negatives}`;
  if (asset.id === 'agency-clerk-portrait') return `${styleLock} Create one original Agência Federal terminal clerk, full body, 1990 office uniform, expressive helpful pose, centered. Flat chroma green #00FF00 background. ${negatives}`;
  if (asset.id === 'title-logo') return `${styleLock} Create an ornamental title-logo plaque with empty central negative space, gold, red and navy crime-travel motifs, no actual lettering; title is rendered by browser text. Flat chroma green #00FF00 background. ${negatives}`;
  const screen = asset.id.replaceAll('-', ' ');
  const special = asset.id === 'title-background'
    ? 'Deolane San Paolo occupies the LEFT half: straight blonde hair, enormous red lips, heavy makeup, giant earrings, huge necklace and enormous gold pendant; a globe and red travel route behind her; keep the RIGHT half darker and quieter for browser-rendered title text.'
    : `Original narrative scene for ${screen}: ${asset.purpose}`;
  return `${styleLock} Create a wide 640:400 DOS narrative background. ${special} Dramatic composition, edge-to-edge opaque art, no embedded UI or text. ${negatives}`;
};

const exists = async (path: string): Promise<boolean> => stat(path).then(() => true).catch(() => false);
const sha256 = (data: Buffer | string): string => createHash('sha256').update(data).digest('hex');

const pause = (milliseconds: number) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

const runCliOnce = async (asset: AssetEntry, prompt: string, refs: string[], rawPath: string): Promise<void> => new Promise((resolvePromise, reject) => {
  const size = asset.width / asset.height > 1.3 ? '1536x1024' : asset.height / asset.width > 1.3 ? '1024x1536' : '1024x1024';
  const quality = asset.id.includes('deolane') || asset.id === 'title-background' ? 'medium' : 'low';
  const childArgs = [cli, 'edit', ...refs.flatMap((path) => ['--image', path]), '--prompt', prompt, '--model', model, '--size', size, '--quality', quality, '--out', rawPath, ...(force ? ['--force'] : [])];
  const child = spawn('bash', childArgs, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk.toString(); });
  child.stderr.on('data', (chunk) => { output += chunk.toString(); });
  child.on('error', reject);
  child.on('close', (code) => code === 0 ? resolvePromise() : reject(new Error(`${asset.id}: CLI ${code}\n${output.slice(-2000)}`)));
});

const runCli = async (asset: AssetEntry, prompt: string, refs: string[], rawPath: string): Promise<void> => {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      await runCliOnce(asset, prompt, refs, rawPath);
      await pause(8_000);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const rateLimited = message.includes('429') || message.includes('RateLimitError');
      const retryableSafety = message.includes('moderation_blocked') && attempt <= 4;
      const retryableNetwork = message.includes('APIConnectionError') || message.includes('Connection error');
      if (!rateLimited && !retryableSafety && !retryableNetwork) throw error;
      const wait = rateLimited ? 18_000 + attempt * 4_000 : retryableSafety ? 4_000 : 10_000;
      console.log(`WAIT ${asset.id}: ${retryableSafety ? 'falso positivo de segurança' : retryableNetwork ? 'conexão' : 'limite da API'}, nova tentativa em ${Math.round(wait / 1000)}s`);
      await pause(wait);
    }
  }
  throw new Error(`${asset.id}: limite da API persistiu após 8 tentativas.`);
};

const removeChroma = async (input: Buffer): Promise<Buffer> => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let offset = 0; offset < data.length; offset += 4) {
    const red = data[offset]!;
    const green = data[offset + 1]!;
    const blue = data[offset + 2]!;
    data[offset + 3] = green > 105 && green > red * 1.18 && green > blue * 1.18 ? 0 : 255;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
};

const postprocess = async (asset: AssetEntry, rawPath: string, prompt: string, refs: string[]): Promise<void> => {
  const outputPath = resolve(root, asset.filename);
  await mkdir(dirname(outputPath), { recursive: true });
  await mkdir(metaDir, { recursive: true });
  const raw = await readFile(rawPath);
  if (asset.transparency === 'transparent') {
    const transparent = await removeChroma(raw);
    if (asset.id === 'henchman-run-spritesheet') {
      const metadata = await sharp(transparent).metadata();
      const sourceWidth = metadata.width!;
      const sourceHeight = metadata.height!;
      const cellWidth = Math.floor(sourceWidth / 8);
      const frames = await Promise.all(Array.from({ length: 8 }, async (_, index) => {
        const slice = await sharp(transparent)
          .extract({ left: index * cellWidth, top: 0, width: index === 7 ? sourceWidth - index * cellWidth : cellWidth, height: sourceHeight })
          .png()
          .toBuffer();
        const extracted = await sharp(slice)
          .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
          .resize(60, 60, { fit: 'contain', kernel: sharp.kernel.nearest, background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        return { input: extracted, left: index * 64 + 2, top: 2 };
      }));
      await sharp({ create: { width: 512, height: 64, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite(frames)
        .png({ palette: true, colours: 64, dither: 0 })
        .toFile(outputPath);
    } else {
      await sharp(transparent)
        .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
        .resize(asset.width, asset.height, { fit: 'contain', kernel: sharp.kernel.nearest, background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ palette: true, colours: 64, dither: 0 })
        .toFile(outputPath);
    }
  } else {
    await sharp(raw)
      .resize(asset.width, asset.height, { fit: 'cover', position: 'centre', kernel: sharp.kernel.nearest })
      .png({ palette: true, colours: 64, dither: 0 })
      .toFile(outputPath);
  }
  const final = await readFile(outputPath);
  await writeFile(resolve(metaDir, `${asset.id}.json`), `${JSON.stringify({
    assetId: asset.id,
    model,
    promptVersion: 1,
    promptSha256: sha256(prompt),
    referenceAssets: refs.map((path) => path.replace(`${root}/`, '')),
    generatedAt: new Date().toISOString(),
    originalOutputSha256: sha256(raw),
    finalOutputSha256: sha256(final),
    postprocessVersion: 1
  }, null, 2)}\n`);
};

const processAsset = async (asset: AssetEntry): Promise<void> => {
  const outputPath = resolve(root, asset.filename);
  if (skipExisting && await exists(outputPath)) { console.log(`SKIP ${asset.id}`); return; }
  const rawPath = resolve(rawDir, `${asset.id}.png`);
  const prompt = promptFor(asset);
  const refs = referencesFor(asset);
  if (dryRun) {
    console.log(JSON.stringify({ id: asset.id, category: asset.category, size: `${asset.width}x${asset.height}`, references: refs.map((path) => path.replace(`${root}/`, '')), prompt }));
    return;
  }
  await mkdir(rawDir, { recursive: true });
  if (force || !await exists(rawPath)) {
    console.log(`API ${asset.id}`);
    await runCli(asset, prompt, refs, rawPath);
  } else console.log(`RAW ${asset.id}`);
  await postprocess(asset, rawPath, prompt, refs);
  console.log(`OK  ${asset.id}`);
};

console.log(`${dryRun ? 'DRY-RUN' : 'GERAÇÃO'}: ${assets.length} asset(s), concorrência ${concurrency}, modelo ${model}`);
let cursor = 0;
const workers = Array.from({ length: Math.min(concurrency, assets.length) }, async () => {
  while (cursor < assets.length) {
    const current = assets[cursor++]!;
    await processAsset(current);
  }
});
await Promise.all(workers);
