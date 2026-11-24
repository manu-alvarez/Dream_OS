const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../app');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
test('JavaScript parses without executing browser code', () => {
  for (const file of [...fs.readdirSync(path.join(root,'js')).filter(x => x.endsWith('.js')).map(x => 'js/'+x), 'sw.js']) {
    execFileSync(process.execPath, ['--check', path.join(root,file)], {stdio:'pipe'});
  }
});
test('manifest and knowledge files parse, and manifest icons exist', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.ok(manifest.icons.length);
  for (const icon of manifest.icons) assert.ok(fs.statSync(path.join(root, icon.src)).isFile(), icon.src);
  for (const file of ['data/knowledge_base.json','data/synonyms.json']) assert.ok(JSON.parse(read(file)));
});
test('service worker precache references existing local resources', () => {
  const match = /const SHELL\s*=\s*(\[[\s\S]*?\]);/.exec(read('sw.js'));
  assert.ok(match, 'missing shell list');
  const shell = JSON.parse(match[1]);
  assert.ok(shell.includes('./offline.html'));
  for (const file of shell) assert.ok(fs.existsSync(path.join(root,file)), file);
});
