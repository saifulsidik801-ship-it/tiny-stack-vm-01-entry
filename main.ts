import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input', O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const T = new TextEncoder();
for (const d of readdirSync(I).sort()) {
  const p = readFileSync(join(I, d, 'program.bin')), g = readFileSync(join(I, d, 'input.bin'));
  const D = new Int32Array(256), C = new Int32Array(64), M = new Int32Array(256), o = new Uint8Array(65536);
  const n = p.length;
  let s = 0, y = 0, l = 0, j = 0, k = 0, w = 0, e = -1;
  for (; e < 0;) {
    if (k === 1e6) { e = 10; break; }
    if (w < 0 || w >= n) { e = 9; break; }
    const h = p[w], m = h === 2 ? 4 : h > 47 && h < 52 ? 2 : h === 1 ? 1 : 0;
    if (w + m >= n) { e = 9; break; }
    k++;
    w += m + 1;
    if (h > 15 && h < 35 && h !== 23 && h !== 27 && h !== 31) {
      if (s < 2) e = 2;
      else {
        const b = D[s - 1], a = D[s - 2];
        let r = 0;
        if (h < 19) r = h === 16 ? (a + b) | 0 : h === 17 ? (a - b) | 0 : Math.imul(a, b);
        else if (h < 23) {
          if (b === 0) e = 4;
          else r = h === 19 ? (a === -2147483648 && b === -1 ? a : (a / b) | 0) : h === 20 ? (b === -1 ? 0 : (a % b) | 0) : h === 21 ? Math.floor((a >>> 0) / (b >>> 0)) | 0 : ((a >>> 0) % (b >>> 0)) | 0;
        } else if (h < 27) r = h === 24 ? a & b : h === 25 ? a | b : a ^ b;
        else if (h < 31) r = h === 28 ? a << (b & 31) : h === 29 ? a >> (b & 31) : (a >>> (b & 31)) | 0;
        else r = h === 32 ? (a === b ? 1 : 0) : h === 33 ? (a < b ? 1 : 0) : ((a >>> 0) < (b >>> 0) ? 1 : 0);
        if (e < 0) { s -= 2; D[s++] = r; }
      }
    } else switch (h) {
      case 0: e = 0; break;
      case 1: if (s > 255) e = 3; else D[s++] = (p[w - 1] << 24) >> 24; break;
      case 2: if (s > 255) e = 3; else D[s++] = p[w - 4] | (p[w - 3] << 8) | (p[w - 2] << 16) | (p[w - 1] << 24); break;
      case 3: if (s < 1) e = 2; else s--; break;
      case 4: if (s < 1) e = 2; else if (s > 255) e = 3; else { D[s] = D[s - 1]; s++; } break;
      case 5: if (s < 2) e = 2; else { const t = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = t; } break;
      case 6: if (s < 2) e = 2; else if (s > 255) e = 3; else { D[s] = D[s - 2]; s++; } break;
      case 7: if (s < 3) e = 2; else { const t = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = t; } break;
      case 23: if (s < 1) e = 2; else D[s - 1] = -D[s - 1] | 0; break;
      case 27: if (s < 1) e = 2; else D[s - 1] = ~D[s - 1]; break;
      case 48: case 49: case 50: {
        const r = ((p[w - 2] | (p[w - 1] << 8)) << 16) >> 16;
        if (h === 48) w += r;
        else if (s < 1) e = 2;
        else { const v = D[--s]; if (h === 49 ? v === 0 : v !== 0) w += r; }
        break;
      }
      case 51: if (y > 63) e = 7; else { C[y++] = w; w = p[w - 2] | (p[w - 1] << 8); } break;
      case 52: if (y === 0) e = 8; else w = C[--y]; break;
      case 64: if (s < 1) e = 2; else { const a = D[s - 1]; if (a < 0 || a > 255) e = 6; else D[s - 1] = M[a]; } break;
      case 65: if (s < 2) e = 2; else { const a = D[s - 1]; if (a < 0 || a > 255) e = 6; else { M[a] = D[s - 2]; s -= 2; } } break;
      case 80: if (s < 1) e = 2; else { const u = T.encode(String(D[s - 1])); if (l + u.length > 65536) e = 11; else { o.set(u, l); l += u.length; s--; } } break;
      case 81: if (s < 1) e = 2; else if (l > 65535) e = 11; else o[l++] = D[--s] & 255; break;
      case 82: if (s > 255) e = 3; else D[s++] = j < g.length ? g[j++] : -1; break;
      case 83: if (s < 1) e = 2; else e = D[--s] & 255; break;
      default: e = 5;
    }
  }
  mkdirSync(join(O, d), { recursive: true });
  writeFileSync(join(O, d, 'stdout.bin'), o.slice(0, l));
  writeFileSync(join(O, d, 'exit.txt'), e + '\n');
}
