// Pull the ways out of content/process.ts, so the canvas board and the site share one source.
import { readFileSync, writeFileSync } from 'node:fs';
const [src, out] = process.argv.slice(2);
const s = readFileSync(src, 'utf8');
const start = s.indexOf('[', s.indexOf('\n  ways: ['));
let depth = 0, end = start;
for (let i = start; i < s.length; i++) { if (s[i] === '[') depth++; else if (s[i] === ']') { depth--; if (!depth) { end = i; break; } } }
const ways = (0, eval)('(' + s.slice(start, end + 1) + ')');
writeFileSync(out, JSON.stringify(ways, null, 1));
console.log(ways.map((w) => `${w.id}:${w.moments.length}`).join(' '));
