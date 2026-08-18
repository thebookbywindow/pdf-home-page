import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedSlugs = ["mesh-converter", "cad-converter", "bim-converter"];

function loadBrowserIife(relativePath, exportName, globals = {}) {
  const code = fs.readFileSync(path.join(root, relativePath), "utf8");
  const sandbox = { console, ...globals };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.window[exportName] || sandbox[exportName];
}

const catalog = loadBrowserIife("scripts/tool-catalog.js", "WPSToolCatalog");
const threeDTools = catalog
  .allOnlineTools()
  .filter((tool) => tool.type === "3d-conversion");

assert.deepEqual(
  Array.from(threeDTools, (tool) => tool.slug),
  expectedSlugs,
  "The single-file policy must cover every 3D converter."
);

for (const tool of threeDTools) {
  assert.equal(tool.singleFile, true, `${tool.slug} must be configured as single-file.`);
}

const quota = loadBrowserIife(
  "scripts/tool-quota-flow.js",
  "WPSQuotaFlow",
  { WPSToolCatalog: catalog }
);
assert.equal(
  quota.getQuotaSummary({ isPremium: false, usesRemaining: 10 }, { compact: true }).text,
  "Daily <strong>10</strong> of 10",
  "The compact 3D quota badge must retain the real ten-use rule."
);
for (const slug of expectedSlugs) {
  const filesRule = quota
    .getQuotaRules(slug)
    .table.find((row) => row.label === "Files per task");
  assert.deepEqual(
    { guest: filesRule.guest, member: filesRule.member },
    { guest: "1 file", member: "1 file" },
    `${slug} quota copy must describe the single-file limit for every account type.`
  );
}

const content = loadBrowserIife(
  "scripts/tool-content-library.js",
  "WPSToolContentLibrary"
);
const mesh = content.get("mesh-converter");

const seoCopyContracts = {
  "mesh-converter": {
    eta: /10 seconds to 2 minutes/i,
    requiredTerms: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3DS", "X", "3MF", "OFF", "AC3D", "PLY"],
    faqQuestions: [
      "What mesh formats can I convert?",
      "How long does mesh conversion take?",
      "Can I convert a mesh file to the same format?",
      "Is batch conversion available?"
    ],
    articleTitles: [
      "Mesh converter input formats",
      "Mesh converter output formats",
      "One-file mesh conversion"
    ]
  },
  "cad-converter": {
    eta: /30 seconds to 5 minutes/i,
    requiredTerms: ["STEP", "IGES", "CATIA V5", "NX", "Creo", "SolidWorks", "Parasolid", "Inventor", "JT", "PRC", "ACIS", "Solid Edge", "GLB/GLTF", "FBX", "OBJ", "STL"],
    faqQuestions: [
      "Which CAD formats can I convert online?",
      "What output formats does the CAD converter support?",
      "Can I convert STEP to STEP?",
      "How long does CAD conversion take?",
      "Is batch conversion available?"
    ],
    articleTitles: [
      "CAD converter input formats",
      "CAD converter output formats",
      "STEP and mesh conversion paths"
    ]
  },
  "bim-converter": {
    eta: /1 to 10 minutes/i,
    requiredTerms: ["IFC", "Revit", "Navisworks", "DWF", "AutoCAD", "DWG", "DXF", "SKP", "GLB/GLTF", "FBX", "OBJ", "STL"],
    faqQuestions: [
      "Which BIM and architecture formats can I upload?",
      "What output formats does the BIM converter support?",
      "How long does BIM conversion take?",
      "Is batch conversion available?"
    ],
    articleTitles: [
      "BIM converter input formats",
      "BIM converter output formats",
      "One-file BIM conversion"
    ]
  }
};

for (const [slug, contract] of Object.entries(seoCopyContracts)) {
  const pageCopy = content.get(slug);
  const serialized = JSON.stringify(pageCopy);

  assert.equal(pageCopy.whyChoose.items.length, 3, `${slug} must keep three factual benefit cards.`);
  assert.equal(pageCopy.guide.steps.length, 3, `${slug} must keep a concise three-step guide.`);
  assert.equal(pageCopy.blog.articles.length, 3, `${slug} must keep three factual explainer cards.`);
  assert.match(serialized, contract.eta, `${slug} must retain its confirmed estimated-time range.`);
  assert.match(serialized, /one file|single file/i, `${slug} must clearly state the one-file limit.`);

  for (const term of contract.requiredTerms) {
    assert.ok(serialized.includes(term), `${slug} must mention supported format ${term}.`);
  }

  assert.deepEqual(
    Array.from(pageCopy.faq.items, (item) => item.question),
    contract.faqQuestions,
    `${slug} FAQs must directly cover supported formats, limits, and timing.`
  );
  assert.deepEqual(
    Array.from(pageCopy.blog.articles, (article) => article.title),
    contract.articleTitles,
    `${slug} explainer cards must stay grounded in page capabilities.`
  );
  assert.doesNotMatch(
    serialized,
    /roadmap|coming soon|may be available later|AR experiences|game engines|lossless|guaranteed|best format/i,
    `${slug} must not contain speculative or unsupported product claims.`
  );
}

assert.doesNotMatch(
  JSON.stringify(mesh.whyChoose),
  /Batch when you upgrade|Premium unlocks batch conversion/i,
  "Mesh marketing copy must not promise batch conversion."
);
assert.doesNotMatch(
  JSON.stringify(mesh.guide),
  /multiple if Premium/i,
  "Mesh instructions must describe a single-file upload."
);

for (const slug of expectedSlugs) {
  const batchFaq = content
    .get(slug)
    .faq.items.find((item) => /batch conversion/i.test(item.question));
  assert.ok(batchFaq, `${slug} must include a clear batch-conversion FAQ.`);
  assert.match(
    batchFaq.answerHtml,
    /\bNo\b/i,
    `${slug} batch FAQ must state that batch conversion is unavailable.`
  );
  assert.doesNotMatch(
    batchFaq.answerHtml,
    /Yes for Premium/i,
    `${slug} batch FAQ must not promise Premium batch conversion.`
  );
}

for (const slug of expectedSlugs) {
  const html = fs.readFileSync(path.join(root, "tools", `${slug}.html`), "utf8");
  const input = html.match(/<input type="file" id="file-input"[^>]*>/)?.[0] || "";
  assert.ok(input, `${slug} must render a file input.`);
  assert.doesNotMatch(input, /\bmultiple\b/i, `${slug} file picker must be single-file.`);
  assert.match(
    html,
    /id="drop-title">Drop [^<]+ file here<\/h3>/i,
    `${slug} drop-zone copy must use singular file wording.`
  );
}

const contentBlocksSource = fs.readFileSync(
  path.join(root, "scripts", "tool-content-blocks.js"),
  "utf8"
);
const contentSectionsCss = fs.readFileSync(
  path.join(root, "tool-home-sections.css"),
  "utf8"
);

assert.doesNotMatch(
  contentBlocksSource,
  /class="tool-faq__item faq-item/,
  "The official FAQ component must not inherit the legacy rounded-card .faq-item styles."
);
assert.doesNotMatch(
  contentBlocksSource,
  /class="tool-faq__item[^"]*is-open|aria-expanded="\$\{i === 0/,
  "Official-style FAQ rows must render collapsed by default."
);
assert.match(
  contentBlocksSource,
  /class="tool-faq__toggle-h"[^>]+line-1-2\.svg/,
  "FAQ toggles must use the official horizontal-line asset."
);
assert.match(
  contentBlocksSource,
  /class="tool-faq__toggle-v"[^>]+line-2\.svg/,
  "FAQ toggles must use the official vertical-line asset."
);
assert.match(
  contentBlocksSource,
  /class="tool-faq__learn home-pc-learn-more"/,
  "The FAQ Learn More link must use the official rolling-link structure."
);
assert.match(
  contentSectionsCss,
  /\.tool-faq\s*\{[^}]*gap:\s*72px;/s,
  "The FAQ title-to-list gap must match the official 72px desktop spacing."
);
assert.match(
  contentSectionsCss,
  /\.tool-faq__question\s*\{[^}]*padding:\s*48px 0px;/s,
  "FAQ rows must match the official 48px vertical padding."
);
assert.match(
  contentSectionsCss,
  /\.tool-faq__answer\s*\{[^}]*padding:\s*0px 0px 24px;/s,
  "Expanded FAQ answers must match the official 24px bottom padding."
);

console.log(`PASS ${threeDTools.length} 3D converters are single-file.`);
