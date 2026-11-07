// Prépare une photo pour le portfolio : JPEG sRGB, 2500 px max sur le grand
// côté (jamais agrandie), qualité 80 avec mozjpeg. Un scan de pellicule passe
// d'environ 2 Mo à 500-700 ko sans différence visible, même à 100 %.
//
//   node scripts/compress-photo.mjs <source> <destination.jpg>
//   node scripts/compress-photo.mjs <fichier.jpg>   (remplace le fichier)
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const [source, destination = source] = process.argv.slice(2);
if (!source) {
  console.error('Usage : node scripts/compress-photo.mjs <source> [destination.jpg]');
  process.exit(1);
}

const input = await readFile(source);
const output = await sharp(input)
  .rotate()
  .resize(2500, 2500, { fit: 'inside', withoutEnlargement: true })
  .withIccProfile('srgb')
  .jpeg({ quality: 80, mozjpeg: true })
  .toBuffer();
await writeFile(destination, output);
console.log(`${destination} : ${Math.round(input.length / 1024)} ko → ${Math.round(output.length / 1024)} ko`);
