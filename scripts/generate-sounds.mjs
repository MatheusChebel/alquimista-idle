import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'assets', 'audio');

function writeWav(filePath, freq, durationSec, volume = 0.35, type = 'sine') {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * (type === 'drone' ? 1.2 : 14));
    let sample = 0;
    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * freq * t);
    } else if (type === 'chime') {
      sample =
        Math.sin(2 * Math.PI * freq * t) * 0.6 +
        Math.sin(2 * Math.PI * freq * 2.01 * t) * 0.3 +
        Math.sin(2 * Math.PI * freq * 3.02 * t) * 0.1;
    } else if (type === 'shimmer') {
      sample = Math.sin(2 * Math.PI * freq * t) * (0.5 + 0.5 * Math.sin(2 * Math.PI * 12 * t));
    } else if (type === 'whoosh') {
      const noise = Math.sin(2 * Math.PI * (freq * 0.4 + i * 0.013) * t);
      sample = noise * (1 - t / durationSec);
    } else if (type === 'drone') {
      sample =
        Math.sin(2 * Math.PI * freq * t) * 0.5 +
        Math.sin(2 * Math.PI * (freq * 1.5) * t) * 0.25;
    }
    const intSample = Math.max(-32767, Math.min(32767, sample * env * volume * 32767));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
}

fs.mkdirSync(outDir, { recursive: true });
writeWav(path.join(outDir, 'plink.wav'), 880, 0.09, 0.28, 'sine');
writeWav(path.join(outDir, 'shimmer.wav'), 1320, 0.35, 0.22, 'shimmer');
writeWav(path.join(outDir, 'chime.wav'), 660, 0.55, 0.3, 'chime');
writeWav(path.join(outDir, 'whoosh.wav'), 120, 0.7, 0.35, 'whoosh');
writeWav(path.join(outDir, 'ambient.wav'), 110, 4.0, 0.18, 'drone');
console.log('Generated audio in assets/audio/');
