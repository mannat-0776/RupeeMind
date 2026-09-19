import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    for (let j = 0; j < 8; j++) {
      let bit = (crc ^ byte) & 1;
      crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
      byte >>>= 1;
    }
  }
  return (crc ^ -1) >>> 0;
}

function writePng(width, height, isMaskable = false) {
  // Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Generate image data (smooth linear gradient from #2F66F6 to #00D1FF with rounded squircle and center Rupee symbol)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const radius = isMaskable ? 0 : width * 0.22;
  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const t = (x + y) / (width + height); // gradient factor

      // Interpolate #2F66F6 (47, 102, 246) -> #00D1FF (0, 209, 255)
      let r = Math.round(47 * (1 - t) + 0 * t);
      let g = Math.round(102 * (1 - t) + 209 * t);
      let b = Math.round(246 * (1 - t) + 255 * t);
      let a = 255;

      // Squircle mask (if not maskable)
      if (!isMaskable) {
        const dx = Math.max(Math.abs(x - cx) - (width / 2 - radius), 0);
        const dy = Math.max(Math.abs(y - cy) - (height / 2 - radius), 0);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) {
          a = 0;
        } else if (dist > radius - 1.5) {
          a = Math.round(255 * Math.max(0, (radius - dist) / 1.5));
        }
      }

      // Draw Indian Rupee Symbol in Center (simplified geometric symbol)
      if (a > 0) {
        const nx = (x - cx) / (width * 0.5); // -1 to 1
        const ny = (y - cy) / (height * 0.5); // -1 to 1

        // Horizontal bar 1
        const bar1 = Math.abs(ny - (-0.35)) < 0.05 && nx > -0.4 && nx < 0.4;
        // Horizontal bar 2
        const bar2 = Math.abs(ny - (-0.15)) < 0.05 && nx > -0.4 && nx < 0.35;
        // Stem
        const stem = Math.abs(nx - (-0.25)) < 0.05 && ny > -0.35 && ny < 0.45;
        // Loop
        const loopDist = Math.sqrt(Math.pow(nx - (-0.05), 2) + Math.pow(ny - 0.05, 2));
        const inLoopRing = loopDist > 0.18 && loopDist < 0.28 && nx > -0.25;
        // Leg
        const leg = Math.abs((ny - 0.1) - (nx - (-0.1)) * 1.3) < 0.07 && nx > -0.1 && nx < 0.35 && ny > 0.1 && ny < 0.45;

        // Sparkle green dot
        const sparkDist = Math.sqrt(Math.pow(nx - 0.38, 2) + Math.pow(ny - (-0.38), 2));
        const isSpark = sparkDist < 0.08;

        if (bar1 || bar2 || stem || inLoopRing || leg) {
          r = 255;
          g = 255;
          b = 255;
        } else if (isSpark) {
          r = 16;
          g = 185;
          b = 129; // Emerald green AI badge
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcTarget = Buffer.alloc(4 + len);
  chunk.copy(crcTarget, 0, 4, 8 + len);
  const c = crc32(crcTarget);
  chunk.writeUInt32BE(c, 8 + len);

  return chunk;
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), writePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), writePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), writePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), writePng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), writePng(64, 64, false));

console.log('Successfully generated all PWA icon assets: 192x192, 512x512, maskable-512x512, apple-touch-icon, and favicon.ico.');
