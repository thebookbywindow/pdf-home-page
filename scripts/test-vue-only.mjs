import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localeRoots = ["en", "zh"].map((locale) => path.join(root, locale, "pdf-tools"));
const forbidden = [
  "tools",
  "partials",
  "src/legacy",
  "scripts/tool-catalog.js",
  "scripts/tool-page.js",
  "scripts/tool-boot.js",
  "homepage.html",
  "tool-compress-demo.html",
  "tool-convert-demo.html",
];

for (const relativePath of forbidden) {
  assert.equal(
    fs.existsSync(path.join(root, relativePath)),
    false,
    `Vue-only project must not retain ${relativePath}.`
  );
}

const runtimeScripts = fs
  .readdirSync(path.join(root, "scripts"))
  .filter((entry) => entry.endsWith(".js"));
assert.deepEqual(runtimeScripts, [], "Runtime JavaScript must live under src/, not scripts/.");

assert.ok(fs.existsSync(path.join(root, "index.html")), "Vue MPA must retain the homepage entry.");
const toolDirectoriesByLocale = localeRoots.map((localeRoot) => {
  assert.ok(fs.existsSync(localeRoot), "Vue MPA must retain every locale tool root.");
  const toolDirectories = fs
    .readdirSync(localeRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  assert.ok(toolDirectories.length > 0, "Localized tool pages must be generated.");
  for (const slug of toolDirectories) {
    assert.ok(
      fs.existsSync(path.join(localeRoot, slug, "index.html")),
      `${slug} must expose only its localized Vue entry.`
    );
  }
  return toolDirectories;
});
const toolDirectories = toolDirectoriesByLocale[0];
assert.deepEqual(toolDirectoriesByLocale[1], toolDirectories, "English and Traditional Chinese must expose the same tool set.");

const generatorSource = fs.readFileSync(path.join(root, "scripts", "generate-vue-pages.mjs"), "utf8");
assert.doesNotMatch(generatorSource, /redirectHtml|legacyDir|homepage\.html|toolsDir/);
assert.match(generatorSource, /localeTools/);

const homeComponent = fs.readFileSync(path.join(root, "src", "components", "home", "HomePage.vue"), "utf8");
assert.match(homeComponent, /<SiteChrome part="header" \/>/);
assert.match(homeComponent, /<SiteChrome part="footer" \/>/);

console.log(`PASS Vue-only layout contains ${toolDirectories.length} tools across ${localeRoots.length} locales.`);
