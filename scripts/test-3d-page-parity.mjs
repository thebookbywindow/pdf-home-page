import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const threeDSlugs = ["mesh-converter", "cad-converter", "bim-converter"];
const parityStylesheet = "../tool-3d-parity.css";
const heroContracts = {
  "mesh-converter": {
    title: "Free Mesh Converter Online",
    subtitle: "Convert 3D mesh files between popular formats like OBJ, STL, FBX, GLB, DAE and more. Simply upload your file, choose an output format, and convert it online in seconds.",
    defaultFrom: "OBJ"
  },
  "cad-converter": {
    title: "Free CAD Converter Online",
    subtitle: "Convert CAD files between popular formats like STEP, IGES, CATIA, NX, SolidWorks and more. Simply upload your file, choose an output format, and convert it online in seconds.",
    defaultFrom: "STEP"
  },
  "bim-converter": {
    title: "Free BIM Converter Online",
    subtitle: "Convert BIM files from formats like IFC, Revit, Navisworks, DWF and more to GLB, FBX, OBJ or STL. Simply upload your file, choose an output format, and convert it online in seconds.",
    defaultFrom: "IFC"
  }
};

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertInOrder(source, markers, message) {
  let previous = -1;
  for (const marker of markers) {
    const current = source.indexOf(marker);
    assert.ok(current >= 0, `${message}: missing ${marker}`);
    assert.ok(current > previous, `${message}: ${marker} is out of order`);
    previous = current;
  }
}

for (const slug of threeDSlugs) {
  const html = read(`tools/${slug}.html`);
  const contract = heroContracts[slug];

  assert.match(
    html,
    /<body class="tool-page tool-page--3d-parity"/,
    `${slug} must opt into the isolated 3D parity shell.`
  );
  assert.match(
    html,
    new RegExp(`<link rel="stylesheet" href="${parityStylesheet.replaceAll(".", "\\.")}"`),
    `${slug} must load the scoped 3D parity stylesheet.`
  );
  assert.match(html, /class="tool-hero tool-hero-v2"/, `${slug} must use the official-style hero.`);
  assert.match(html, /class="tool-hero-orbs"/, `${slug} hero must render the official orb layer.`);
  assert.match(html, /class="hero-copy"/, `${slug} hero copy must use the official layout wrapper.`);
  assert.ok(
    html.includes(`<span class="bread-tool" id="crumb-title">${contract.title}</span>`),
    `${slug} breadcrumb must use the approved free-converter title.`
  );
  assert.ok(
    html.includes(`<h1 class="title" id="page-title">${contract.title}</h1>`),
    `${slug} H1 must use the approved free-converter title.`
  );
  assert.ok(
    html.includes(`<p class="subtitle desc" id="page-subtitle">${contract.subtitle}</p>`),
    `${slug} hero description must use the approved factual copy.`
  );
  assert.match(
    html,
    /class="format-hub-grid format-hub-grid--aligned"/,
    `${slug} format hub must opt into equal-height From/To tracks.`
  );
  assert.match(
    html,
    /class="format-group format-group--from"[\s\S]*?<h4 class="format-group-title">Convert from<\/h4>/,
    `${slug} must expose a stable From heading track.`
  );
  assert.match(
    html,
    /class="format-group format-group--to"[\s\S]*?<h4 class="format-group-title">Convert to<\/h4>/,
    `${slug} must expose a stable To heading track.`
  );
  assert.match(html, /class="tool-quota-bar"/, `${slug} must use the official-style quota row.`);
  assert.match(
    html,
    /id="quota-text">Daily <strong>10<\/strong> of 10<\/span>/,
    `${slug} compact quota copy must retain the real ten-use rule.`
  );
  assert.match(
    html,
    /id="quota-info"[^>]*>Get more uses<\/button>/,
    `${slug} must expose the quota action pill.`
  );
  assert.doesNotMatch(html, /id="eta-banner"/, `${slug} must not render the ETA banner.`);
  assert.doesNotMatch(html, /workspace-toolbar--3d/, `${slug} must not render the 3D step toolbar.`);
  assert.doesNotMatch(html, /id="workspace-steps"/, `${slug} must not render conversion steps.`);
  assert.match(
    html,
    /class="upload-zone tool-dashed-zone hero-dropzone"/,
    `${slug} must use the official-style upload zone.`
  );
  assert.match(html, /class="tool-drop-outline"/, `${slug} upload zone must render an SVG outline.`);
  assert.match(html, /class="hero-center"/, `${slug} upload controls must use the centered hero stack.`);
  assert.match(
    html,
    new RegExp(`id="drop-title">Drop ${contract.defaultFrom} file here</h3>`),
    `${slug} upload title must start with the selected input format.`
  );
  assert.match(
    html,
    new RegExp(`id="select-label">Select ${contract.defaultFrom} File</span>`),
    `${slug} upload button must start with the selected input format.`
  );
  assert.match(
    html,
    /id="drop-sub">or click to select from your device<\/p>/,
    `${slug} upload helper must match the approved reference copy.`
  );
  assert.match(html, /class="hero-file-sheet"/, `${slug} must use the approved file-tile artwork.`);
  assert.match(
    html,
    /class="upload-privacy-note"[\s\S]*?Your files stay private and are deleted after processing\./,
    `${slug} must retain the approved privacy note.`
  );
  assertInOrder(
    html,
    [
      'class="tool-quota-bar"',
      'class="workspace-card workspace-card--3d"',
      'id="format-hub"',
      'id="upload-zone"'
    ],
    `${slug} must place quota above the unified format-and-upload card`
  );

  for (const id of [
    "format-hub",
    "quota-text",
    "quota-info",
    "quota-tooltip",
    "workspace-body",
    "upload-zone",
    "file-input",
    "btn-select-file",
    "processing-panel",
    "upload-success-panel",
    "result-panel",
    "workspace-back-wrap"
  ]) {
    assert.match(html, new RegExp(`id="${id}"`), `${slug} must preserve #${id}.`);
  }

  const input = html.match(/<input type="file" id="file-input"[^>]*>/)?.[0] || "";
  assert.ok(input, `${slug} must render its file input.`);
  assert.doesNotMatch(input, /\bmultiple\b/i, `${slug} must remain single-file.`);
  assert.match(
    html,
    /<aside class="demo-panel is-hidden" aria-label="Demo controls"/,
    `${slug} R&D controls must be hidden before JavaScript initializes.`
  );
}

const nonThreeDHtml = read("tools/compress-pdf.html");
assert.doesNotMatch(
  nonThreeDHtml,
  /tool-page--3d-parity|tool-3d-parity\.css|format-hub-grid--aligned/,
  "Non-3D tools must not inherit the 3D parity shell."
);
assert.match(nonThreeDHtml, /id="eta-banner"/, "Non-3D tools must preserve the shared ETA hook.");
assert.match(nonThreeDHtml, /id="workspace-steps"/, "Non-3D tools must preserve their workflow steps.");

const contentBlocksSource = read("scripts/tool-content-blocks.js");
const mountSource = contentBlocksSource.slice(contentBlocksSource.indexOf("function mount("));
assertInOrder(
  mountSource,
  [
    "renderRelatedTools(",
    "renderWhyChoose(",
    "renderConverterGuide(",
    "renderBlog(",
    "renderFaq("
  ],
  "Shared marketing sections must preserve the approved module order"
);
assert.match(
  mountSource,
  /const is3d = global\.WPSToolCatalog\?\.getBySlug\?\.\(slugOrKey\)\?\.type === "3d-conversion";/,
  "The content renderer must identify 3D pages before choosing optional modules."
);
assert.match(
  mountSource,
  /if \(data\.blog && !is3d\) html \+= renderBlog\(data\.blog\);/,
  "3D pages must omit the entire Learn More module."
);

const toolsDirectorySource = read("scripts/tools-directory.js");
assert.doesNotMatch(
  toolsDirectorySource,
  /tools-directory-heading-continued" aria-hidden="true"/,
  "Continuation column headings must remain available to assistive technology when shown."
);

const demoPanelSource = read("scripts/demo-panel.js");
assert.match(
  demoPanelSource,
  /const stored = sessionStorage\.getItem\(STORAGE_KEY\);[\s\S]*?return stored === null \? true : stored === "1";/,
  "The R&D controls must default to hidden when the session has no saved choice."
);

const parityCssPath = path.join(root, "tool-3d-parity.css");
assert.ok(fs.existsSync(parityCssPath), "The isolated 3D parity stylesheet must exist.");
const parityCss = fs.readFileSync(parityCssPath, "utf8");
assert.match(
  parityCss,
  /body\.tool-page--3d-parity\s*\{[^}]*padding-top:\s*64px/s,
  "The 3D content must clear the fixed 64px site header."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.bread-box\s*\{[^}]*font-size:\s*14px;[^}]*line-height:\s*22px/s,
  "The desktop breadcrumb must match the official 14/22 typography."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.tool-hero-v2\s+\.title\s*\{[^}]*font-size:\s*56px;[^}]*line-height:\s*60px/s,
  "The desktop H1 must match the official 56/60 typography."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.tool-hero-v2\s+\.desc\s*\{[^}]*font-size:\s*18px;[^}]*line-height:\s*26px/s,
  "The desktop hero description must match the official 18/26 typography."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.hero-upload-title\s*\{[^}]*font-size:\s*24px;[^}]*line-height:\s*32px/s,
  "The desktop upload title must match the official 24/32 typography."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.hero-upload-sub\s*\{[^}]*font-size:\s*16px;[^}]*line-height:\s*24px/s,
  "The desktop upload helper must match the official 16/24 typography."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.hero-select-btn\s*\{[^}]*min-width:\s*208px;[^}]*min-height:\s*56px;[^}]*font-size:\s*16px/s,
  "The desktop upload button must match the official dimensions and font size."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.upload-privacy-note\s*\{[^}]*font-size:\s*14px;[^}]*line-height:\s*22px/s,
  "The desktop privacy note must match the official 14/22 typography."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.workspace-card--3d\s*\{[^}]*border-radius:\s*20px;[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.94\)/s,
  "Formats and upload must share the approved rounded white card."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.hero-dropzone\s*\{[^}]*height:\s*526px/s,
  "The desktop upload zone must match the official 526px height."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.format-chip\.is-selected\s*\{[^}]*background:\s*var\(--parity-ink\)/s,
  "Selected 3D format chips must use the reference black state."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.format-hub-grid--aligned\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto\s+minmax\(0,\s*1fr\)/s,
  "The format hub must use two equal columns around an independent arrow column."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.format-group\s*\{[^}]*grid-template-rows:\s*22px\s+1fr/s,
  "From and To groups must reserve the same heading row before wrapping chips."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.format-group-title\s*\{[^}]*line-height:\s*22px/s,
  "From and To headings must share an explicit line height."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.tool-related\s*\{[^}]*gap:\s*72px/s,
  "Related Tools must use the official desktop section gap."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.tool-why\s*\{[^}]*gap:\s*72px/s,
  "Why Choose must use the official desktop section gap."
);
assert.match(
  parityCss,
  /@media\s*\(max-width:\s*768px\)[\s\S]*?\.tool-page--3d-parity\s+\.tool-faq\s*\{[^}]*padding:\s*64px 16px;[^}]*gap:\s*40px/s,
  "The 3D FAQ must match the official mobile spacing."
);
assert.match(
  parityCss,
  /\.tool-page--3d-parity\s+\.tools-directory-heading-continued\s*\{[^}]*visibility:\s*visible/s,
  "All six 3D tool-directory columns must show their headings."
);

const bootSource = read("scripts/tool-boot.js");
assert.match(
  bootSource,
  /function init3dFooterAccordion\(/,
  "3D pages must expose a dedicated accessible mobile footer accordion."
);
assert.match(
  bootSource,
  /if\s*\(is3d\)\s*init3dFooterAccordion\(/,
  "The mobile footer accordion must be isolated to 3D pages."
);
assert.match(
  bootSource,
  /is3d\s*\?\s*"or click to select from your device"\s*:\s*`Convert to \$\{toFormat\}`/,
  "3D format changes must preserve the approved upload helper copy."
);

console.log(`PASS ${threeDSlugs.length} 3D pages satisfy the scoped parity contract.`);
