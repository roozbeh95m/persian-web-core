#!/usr/bin/env node
/**
 * Fail CI when published ESM artifacts grow past budgeted limits.
 *
 * Budgets are raw byte sizes of the local import graph for each package
 * export entry (tree-shakeable install cost before minification/gzip).
 * Totals cover every emitted `.js` file under `dist/`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(root, 'dist');

/** @type {Record<string, number>} */
const ENTRY_LIMITS = {
  '.': 90_000,
  './digits': 6_000,
  './normalize': 14_000,
  './format': 12_000,
  './currency': 16_000,
  './phone': 12_000,
  './national-id': 8_000,
  './search': 20_000,
  './slug': 18_000,
  './typography': 14_000,
  './sort': 22_000,
  './date': 24_000,
  './direction': 6_000,
};

const TOTAL_RAW_LIMIT = 100_000;
const TOTAL_GZIP_LIMIT = 28_000;

/**
 * @param {string} dir
 * @param {string[]} files
 */
function listJsFiles(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      listJsFiles(path, files);
      continue;
    }
    if (name.endsWith('.js') && !name.endsWith('.bench.js')) {
      files.push(path);
    }
  }
  return files;
}

/**
 * @param {string} entry
 */
function resolveImportGraph(entry) {
  /** @type {Set<string>} */
  const seen = new Set();
  const queue = [entry];

  while (queue.length > 0) {
    const file = queue.pop();
    if (file === undefined || seen.has(file)) {
      continue;
    }
    seen.add(file);

    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
      const specifier = match[1];
      if (specifier === undefined) {
        continue;
      }
      const base = join(dirname(file), specifier);
      const candidates = [base, `${base}.js`, join(base, 'index.js')];
      for (const candidate of candidates) {
        try {
          if (statSync(candidate).isFile()) {
            queue.push(candidate);
            break;
          }
        } catch {
          // try next candidate
        }
      }
    }
  }

  let raw = 0;
  for (const file of seen) {
    raw += statSync(file).size;
  }
  return { files: seen.size, raw };
}

function main() {
  let packageJson;
  try {
    packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  } catch (error) {
    console.error('Unable to read package.json');
    throw error;
  }

  /** @type {{ exports: Record<string, { import: string }> }} */
  const { exports: exportMap } = packageJson;
  if (!exportMap || typeof exportMap !== 'object') {
    console.error('package.json is missing an exports map');
    process.exit(1);
  }

  try {
    statSync(distRoot);
  } catch {
    console.error('dist/ is missing — run `npm run build` first');
    process.exit(1);
  }

  const failures = [];

  for (const [exportPath, limit] of Object.entries(ENTRY_LIMITS)) {
    const entry = exportMap[exportPath];
    if (!entry?.import) {
      failures.push(`missing export entry for ${exportPath}`);
      continue;
    }
    const absolute = join(root, entry.import);
    const graph = resolveImportGraph(absolute);
    const status = graph.raw <= limit ? 'ok' : 'FAIL';
    console.log(
      `${status.padEnd(4)} ${exportPath.padEnd(14)} ${String(graph.raw).padStart(6)} / ${limit} bytes (${graph.files} files)`,
    );
    if (graph.raw > limit) {
      failures.push(
        `${exportPath} import graph is ${graph.raw} bytes (limit ${limit})`,
      );
    }
  }

  const jsFiles = listJsFiles(distRoot);
  let totalRaw = 0;
  /** @type {Buffer[]} */
  const chunks = [];
  for (const file of jsFiles) {
    const buffer = readFileSync(file);
    totalRaw += buffer.length;
    chunks.push(buffer);
  }
  const totalGzip = gzipSync(Buffer.concat(chunks)).length;

  console.log(
    `${(totalRaw <= TOTAL_RAW_LIMIT ? 'ok' : 'FAIL').padEnd(4)} total raw      ${String(totalRaw).padStart(6)} / ${TOTAL_RAW_LIMIT} bytes (${jsFiles.length} files)`,
  );
  console.log(
    `${(totalGzip <= TOTAL_GZIP_LIMIT ? 'ok' : 'FAIL').padEnd(4)} total gzip     ${String(totalGzip).padStart(6)} / ${TOTAL_GZIP_LIMIT} bytes`,
  );

  if (totalRaw > TOTAL_RAW_LIMIT) {
    failures.push(
      `total raw size is ${totalRaw} bytes (limit ${TOTAL_RAW_LIMIT})`,
    );
  }
  if (totalGzip > TOTAL_GZIP_LIMIT) {
    failures.push(
      `total gzip size is ${totalGzip} bytes (limit ${TOTAL_GZIP_LIMIT})`,
    );
  }

  if (failures.length > 0) {
    console.error('\nBundle size check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('\nBundle size check passed.');
}

main();
