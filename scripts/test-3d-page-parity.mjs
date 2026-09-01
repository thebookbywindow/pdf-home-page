import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const threeDSlugs = ["mesh-converter", "cad-converter", "bim-converter"];
const parityStylesheet = "../../tool-3d-parity.css";
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

const toolComponent = read("src/components/tool/ToolPage.vue");
const formatComponent = read("src/components/tool/FormatHub.vue");
const compressFlowComponent = read("src/components/tool/CompressFlow.vue");
const quotaComponent = read("src/components/tool/QuotaControls.vue");
const toolEntry = read("src/entries/tool/main.js");
assert.match(quotaComponent, /v-if="!official" class="quota-info-btn"/, "Only non-official tools should retain the standalone quota info button.");
for (const slug of threeDSlugs) {
  const html = read(`en/pdf-tools/${slug}/index.html`);
  const contract = heroContracts[slug];
  assert.match(html, /data-tool-slug="[^"]+"/, `${slug} must expose its MPA tool slug.`);
  assert.match(html, /src="..\/..\/..\/src\/entries\/tool\/main\.js"/, `${slug} must use the Vue tool entry.`);
  assert.match(toolEntry, /tool-3d-parity\.css/, `${slug} must load parity CSS through the Vue entry.`);
  assert.match(toolComponent, /tool-hero tool-hero-v2/, `${slug} must use the official-style hero.`);
  assert.match(toolComponent, /tool-hero-orbs|tool-hero-orb--a/, `${slug} hero must render the official orb layer.`);
  assert.match(formatComponent, /format-hub-grid--aligned/, `${slug} format hub must keep equal-height tracks.`);
  assert.match(toolComponent, /tool-quota-bar|quota-flow-back/, `${slug} must expose the official quota row.`);
  assert.match(toolComponent, /hero-file-sheet|tool-drop-outline/, `${slug} must use the approved upload artwork.`);
  assert.match(toolComponent, /Your files stay private and are deleted after processing\./, `${slug} must retain the privacy note.`);
  assert.match(formatComponent, /id="format-hub"/, `${slug} must keep the format structure.`);
  assert.match(toolComponent, /id="upload-zone"/, `${slug} must keep the upload structure.`);
  for (const id of ["format-hub", "quota-text", "client-quota-text", "quota-info", "quota-tooltip", "workspace-body", "upload-zone", "file-input", "btn-select-file", "processing-panel", "upload-success-panel", "result-panel", "workspace-back-wrap"]) {
    assert.match(`${toolComponent}\n${formatComponent}\n${compressFlowComponent}\n${quotaComponent}`, new RegExp(`id="${id}"`), `${slug} must preserve #${id}.`);
  }
  assert.doesNotMatch(toolComponent, /demo-panel|demo-panel-toggle|demo-scenarios|demo-uses/, `${slug} must not ship R&D controls.`);
  assert.ok(contract.title && contract.subtitle && contract.defaultFrom, `${slug} contract must remain explicit.`);
}

const compressHtml = read("en/pdf-tools/compress-pdf/index.html");
assert.match(
  compressHtml,
  /<body class="tool-page tool-page--pdf-parity"/,
  "Compress PDF must use the official pdf.wps.com shell, not the 3D body class."
);
assert.doesNotMatch(
  compressHtml,
  /tool-page--3d-parity|format-hub-grid--aligned/,
  "Compress PDF must not inherit 3D format-hub chrome."
);
assert.match(
  toolEntry,
  /tool-3d-parity\.css/,
  "Compress PDF must load the shared official shell stylesheet through Vue."
);
assert.match(toolComponent, /id="eta-banner"/, "Compress PDF must preserve the shared ETA hook.");
assert.match(toolComponent, /id="compress-flow"|CompressFlow/, "Compress PDF must keep upload/compress/download inside the dashed zone.");
assert.match(compressFlowComponent, /id="compress-single"/, "Compress PDF must use the official single-file uploading center.");
assert.match(compressFlowComponent, /id="compress-status-pill"/, "Compress PDF must show the official Uploading/Compressing status pill.");
assert.match(compressFlowComponent, /id="btn-batch-action"/, "Compress PDF must wait for an explicit Compress action.");
assert.match(compressFlowComponent, /Download WPS/, "Compress PDF success footer must match the official Download WPS control.");
assert.match(compressFlowComponent, /id="compress-single-cloud-hint"/, "WPS Office conversions must expose the cloud-document handoff.");
assert.match(toolComponent, /id="quota-flow-back"/, "Compress PDF must expose the official in-flow Back control.");
assert.match(
  toolComponent,
  /class="quota-flow-back tool-task-toolbar__back"/,
  "Compress PDF Back must expose the official task-toolbar control class."
);
assert.match(
  toolComponent,
  /class="tool-task-toolbar__back-icon-wrap"[\s\S]*?class="quota-flow-back__icon tool-task-toolbar__back-icon"[\s\S]*?class="tool-task-toolbar__back-label">Back/,
  "Compress PDF Back must preserve the official icon wrapper and label units."
);
assert.match(quotaComponent, /Get more uses/, "Compress PDF quota row must match the official Get more uses control.");
assert.doesNotMatch(compressHtml, /id="ratio-picker"|Add files/, "Compress PDF must not invent the HD cards or Add files control.");
assert.match(
  compressFlowComponent,
  /class="compress-single__card uploading"/,
  "Compress PDF single-file flow must use the official uploading card."
);
assert.match(
  compressFlowComponent,
  /class="tool-dashed-zone compress-single__zone"/,
  "Compress PDF single-file flow must keep the official dashed inner zone."
);
assert.match(
  compressFlowComponent,
  /tool-live\/compress\/loading\.svg/,
  "Compress PDF uploading and processing states must use the official loading SVG."
);
assert.match(
  compressFlowComponent,
  /tool-live\/compress\/success-check\.svg/,
  "Compress PDF success state must use the official success-check SVG."
);
assert.match(
  compressFlowComponent,
  /tool-download-white\.svg|tool-download-wps\.svg/,
  "Compress PDF success actions must use the official download SVG assets."
);

const generatorSource = read("scripts/generate-vue-pages.mjs");
assert.doesNotMatch(generatorSource, /demoPanelHtml|demo-panel|demo-scenarios|demo-uses/, "Generated pages must not include R&D panel markup.");
assert.doesNotMatch(generatorSource, /redirectHtml|legacyDir|homepage\.html|toolsDir/, "The generator must emit canonical Vue pages only.");
assert.match(generatorSource, /canonicalToolsDir/, "The generator must target the canonical /en/pdf-tools/ tree.");
assert.match(
  compressFlowComponent,
  /compress-single__card|compress-single__zone/,
  "The Vue tool component must own the official single-file flow structure."
);
const flowParityCss = read("tool-3d-parity.css");
assert.match(
  flowParityCss,
  /\.tool-page--pdf-parity \.compress-single__card[\s\S]*?padding:\s*24px/,
  "Official single-file cards must use the measured 24px inset."
);
assert.match(
  flowParityCss,
  /\.tool-page--pdf-parity \.compress-single__zone[\s\S]*?min-height:\s*360px/,
  "Official single-file zones must use the measured 360px minimum height."
);
assert.match(
  flowParityCss,
  /\.tool-page--pdf-parity \.compress-single__card[\s\S]*?background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.698\)/,
  "Official upload states must retain the translucent white card edge."
);
assert.match(
  flowParityCss,
  /\.tool-page--pdf-parity \.compress-single__zone[\s\S]*?background:\s*rgba\(89,\s*72,\s*243,\s*0\.02\)/,
  "Official upload states must retain the pale purple inner zone."
);

const chromeSource = read("src/components/site/HeaderChrome.vue") + read("src/components/site/FooterChrome.vue");
const headerChromeSource = read("src/components/site/HeaderChrome.vue");
assert.match(headerChromeSource, /nav-item--highlight.*isThreeDPage/, "3D navigation highlighting must follow the active page.");
assert.match(chromeSource, /id="chrome-login-link"[^>]*aria-controls="header-user-menu"/, "Shared chrome must expose the user-state menu from the login link.");
assert.match(chromeSource, /id="chrome-login-label"/, "Shared chrome must expose a dedicated current-user label.");
assert.match(chromeSource, /class="header-user-caret"/, "Shared chrome must show the user switch caret.");
for (const state of ["logged_out", "free", "premium"]) {
  assert.match(chromeSource, new RegExp(`data-user-state="${state}"`), `Shared chrome must expose the ${state} user state.`);
}
assert.match(chromeSource, /role="menuitemcheckbox"[^>]*data-quota-state="online-exhausted"/, "Shared chrome must expose the online quota checkbox.");
assert.match(chromeSource, /role="menuitemcheckbox"[^>]*data-quota-state="office-exhausted"/, "Shared chrome must expose the WPS Office quota checkbox.");

const toolBootSource = read("src/runtime/tool-boot.js");
assert.doesNotMatch(toolBootSource, /bindDemoPanel|WPSDemoPanel|demo-scenarios|demo-uses/, "Tool boot must use the top user-state switcher, not demo controls.");
assert.match(toolBootSource, /function bindUserSwitcher\(/, "Tool boot must bind the top user-state switcher.");
assert.match(toolBootSource, /chrome-login-label/, "Tool boot must sync the concrete user type into the header.");
assert.match(toolBootSource, /data-quota-state=['"]online-exhausted['"]/, "Tool boot must bind the online quota checkbox.");
assert.match(toolBootSource, /data-quota-state=['"]office-exhausted['"]/, "Tool boot must bind the WPS Office quota checkbox.");
assert.match(toolBootSource, /Q\.setClientUsesRemaining\(state\.clientUsesRemaining <= 0 \? restoreTo : 0\)/, "Tool boot must toggle WPS Office quota without changing identity.");
const sharedChromeCss = read("site-chrome.css");
assert.match(sharedChromeCss, /\.login-link \{[^}]*display:\s*inline-flex/s, "The user type and caret must stay on one horizontal row.");

const quotaModalsSource = read("src/runtime/tool-quota-modals.js");
assert.match(quotaModalsSource, /class="daily-quota-panel"/, "Official quota hover must use the live daily-quota-panel shell.");
assert.match(quotaModalsSource, /panelTitle: "Daily free quota"/, "Official quota hover title must use the concise quota copy.");
assert.match(quotaModalsSource, /colSignedIn: "Signed-in"/, "Official quota hover must include the Signed-in column.");
assert.match(quotaModalsSource, /downloadHint: "Saved to WPS Cloud\. Download, then open Cloud Documents"/, "Official quota hover must explain the WPS Cloud Documents path.");

const toolPageSource = read("src/runtime/tool-page.js");
assert.match(toolPageSource, /directDownload\.hidden = lastProcessingSource === "wps-office"/, "Cloud-document conversions must keep only the WPS Office download action.");
assert.match(toolPageSource, /clientQuotaText\.textContent = `WPS Office: \$\{state\.clientUsesRemaining\} uses left`/, "The upload state must expose remaining WPS Office uses.");
assert.match(toolPageSource, /const showClientQuota = state\.loggedIn && !state\.isPremium/, "Guests must not receive a WPS Office quota hint.");
assert.match(toolPageSource, /function isCompressShell\(/, "Compress flow must detect the official shell.");
assert.match(toolPageSource, /function isOfficialShell\(/, "Quota bar in-flow must apply to every official pdf.wps.com shell.");
assert.doesNotMatch(toolPageSource, /quotaMore\.hidden = inFlow/, "Official in-flow quota must keep Get more uses visible after a file is selected.");
assert.doesNotMatch(toolPageSource, /quotaTip\?\.classList\.remove\("is-visible"\)/, "Official in-flow quota must not forcibly close the Get more uses panel.");
const setViewSource = toolPageSource.slice(
  toolPageSource.indexOf("function setView(view)"),
  toolPageSource.indexOf("function updateProgressUI")
);
assert.doesNotMatch(
  setViewSource,
  /syncCompressShell\(view\);[\s\S]*?batchPanel\.hidden = view === "upload"/,
  "Official Compress view switching must not re-show the batch panel after single-file success."
);
assert.match(toolPageSource, /function startCompressUpload\(/, "Compress flow must play the official uploading state before Compress.");
assert.match(toolPageSource, /function startCompressProcess\(/, "Compress must not start until the Compress button is pressed.");

const quotaFlowSource = read("src/runtime/tool-quota-flow.js");
assert.match(
  quotaFlowSource,
  /options\.compact \? "Unlimited" : "<strong>Unlimited<\/strong>"/,
  "Official Pro badge copy must be Unlimited."
);
assert.doesNotMatch(quotaFlowSource, /Unlimited uses/, "Official Pro badge must not use Unlimited uses.");

const contentBlocksSource = read("src/runtime/tool-content-blocks.js");
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

const toolsDirectorySource = read("src/runtime/tools-directory.js");
assert.doesNotMatch(
  toolsDirectorySource,
  /tools-directory-heading-continued" aria-hidden="true"/,
  "Continuation column headings must remain available to assistive technology when shown."
);

const parityCssPath = path.join(root, "tool-3d-parity.css");
assert.ok(fs.existsSync(parityCssPath), "The isolated 3D parity stylesheet must exist.");
const parityCss = fs.readFileSync(parityCssPath, "utf8");
assert.match(
  parityCss,
  /\.tool-page--pdf-parity \.workspace-card--pdf-parity \{[^}]*padding:\s*24px;[^}]*background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.698\)/s,
  "The empty PDF upload state must retain the official translucent white outer edge."
);
assert.match(
  parityCss,
  /\.tool-page--pdf-parity \.workspace-card--pdf-parity\.is-flow \{[^}]*padding:\s*0;[^}]*background:\s*transparent/s,
  "The in-flow PDF state must remove the outer wrapper so the single-file card is not nested."
);
const compressShellSource = read("src/runtime/tool-page.js");
assert.match(
  compressShellSource,
  /workspaceCard\?\.classList\.toggle\("is-flow",\s*inFlow\)/,
  "The PDF shell must switch the outer card between empty and in-flow layouts."
);
assert.match(
  parityCss,
  /\.tool-page--pdf-parity \.compress-single \{[^}]*max-width:\s*1200px/s,
  "Official single-file flow must use the live 1200px content column."
);
assert.match(
  parityCss,
  /\.tool-page--pdf-parity \.compress-flow \.batch-file-list \{[^}]*gap:\s*20px/s,
  "Official multi-file rows must use the screenshot-matched vertical rhythm."
);
assert.match(
  parityCss,
  /\.tool-page--pdf-parity \.compress-flow \.batch-file-main \{[^}]*flex:\s*0\s*0\s*306px/s,
  "Upload, ready, and processing rows must reserve the official file column."
);
assert.match(
  parityCss,
  /\.tool-page--pdf-parity \.compress-flow \.batch-file-row\.is-done \.batch-file-main \{[^}]*flex-basis:\s*154px/s,
  "Completed rows must switch to the official compact file column."
);
assert.doesNotMatch(
  parityCss,
  /is-in-flow \.quota-info-btn/,
  "Official in-flow CSS must keep Get more uses visible."
);
assert.doesNotMatch(
  parityCss,
  /is-in-flow \.quota-tooltip/,
  "Official in-flow CSS must keep the quota hover panel available."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.tool-quota-bar\.is-in-flow \{[^}]*min-height:\s*86px;[^}]*margin:\s*0\s+16px\s+16px;[^}]*padding:\s*48px\s+16px\s+0/s,
  "The in-flow PDF toolbar must reserve the official top spacing and content column."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.tool-quota-bar\.is-in-flow \.quota-flow-back \{[^}]*height:\s*36px;[^}]*gap:\s*4px;[^}]*padding:\s*0\s+24px\s+0\s+16px;[^}]*border-radius:\s*18px;[^}]*font-size:\s*16px;[^}]*line-height:\s*24px/s,
  "The in-flow PDF Back control must match the official 36px task-toolbar pill."
);
assert.match(parityCss, /\.daily-quota-panel \{[^}]*width:\s*516px/s, "Official quota hover width must match the live 516px panel.");
assert.match(parityCss, /\.daily-quota-panel \{[^}]*border-radius:\s*24px/s, "Official quota hover radius must match the live 24px card.");
assert.match(
  parityCss,
  /body:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s*\{[^}]*padding-top:\s*64px/s,
  "The 3D content must clear the fixed 64px site header."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.bread-box\s*\{[^}]*font-size:\s*14px;[^}]*line-height:\s*22px/s,
  "The desktop breadcrumb must match the official 14/22 typography."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.tool-hero-v2\s+\.title\s*\{[^}]*font-size:\s*56px;[^}]*line-height:\s*60px/s,
  "The desktop H1 must match the official 56/60 typography."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.tool-hero-v2\s+\.desc\s*\{[^}]*font-size:\s*18px;[^}]*line-height:\s*26px/s,
  "The desktop hero description must match the official 18/26 typography."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.hero-upload-title\s*\{[^}]*font-size:\s*24px;[^}]*line-height:\s*32px/s,
  "The desktop upload title must match the official 24/32 typography."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.hero-upload-sub\s*\{[^}]*font-size:\s*16px;[^}]*line-height:\s*24px/s,
  "The desktop upload helper must match the official 16/24 typography."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.hero-select-btn\s*\{[^}]*min-width:\s*208px;[^}]*min-height:\s*56px;[^}]*font-size:\s*16px/s,
  "The desktop upload button must match the official dimensions and font size."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.upload-privacy-note\s*\{[^}]*font-size:\s*14px;[^}]*line-height:\s*22px/s,
  "The desktop privacy note must match the official 14/22 typography."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.workspace-card--3d\s*\{[^}]*border-radius:\s*20px;[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.94\)/s,
  "Formats and upload must share the approved rounded white card."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.hero-dropzone\s*\{[^}]*height:\s*526px/s,
  "The desktop upload zone must match the official 526px height."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.format-chip\.is-selected\s*\{[^}]*background:\s*var\(--parity-ink\)/s,
  "Selected 3D format chips must use the reference black state."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.format-hub-grid--aligned\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto\s+minmax\(0,\s*1fr\)/s,
  "The format hub must use two equal columns around an independent arrow column."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.format-group\s*\{[^}]*grid-template-rows:\s*22px\s+1fr/s,
  "From and To groups must reserve the same heading row before wrapping chips."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.format-group-title\s*\{[^}]*line-height:\s*22px/s,
  "From and To headings must share an explicit line height."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.tool-related\s*\{[^}]*gap:\s*72px/s,
  "Related Tools must use the official desktop section gap."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.tool-why\s*\{[^}]*gap:\s*72px/s,
  "Why Choose must use the official desktop section gap."
);
assert.match(
  parityCss,
  /@media\s*\(max-width:\s*768px\)[\s\S]*?:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.tool-faq\s*\{[^}]*padding:\s*64px 16px;[^}]*gap:\s*40px/s,
  "The 3D FAQ must match the official mobile spacing."
);
assert.match(
  parityCss,
  /:is\(\.tool-page--3d-parity,\s*\.tool-page--pdf-parity\)\s+\.tools-directory-heading-continued\s*\{[^}]*visibility:\s*visible/s,
  "All six 3D tool-directory columns must show their headings."
);

const chromeMarkupSources = [
  "src/components/site/HeaderChrome.vue",
  "src/components/site/FooterChrome.vue",
  "src/components/home/homepage-body.html"
];
for (const relativePath of chromeMarkupSources) {
  const source = read(relativePath);
  assert.doesNotMatch(
    source,
    /<button class="nav-link nav-trigger"[\s\S]*?keyboard_arrow_down[\s\S]*?<\/button>/,
    `${relativePath} nav triggers must not expose a font-ligature name when icon fonts fail.`
  );
}
assert.equal(
  Array.from(chromeSource.matchAll(/class="nav-chevron"/g)).length,
  4,
  "The Vue shared chrome must render all four desktop dropdown arrows as local SVG chevrons."
);

const chromeCss = read("site-chrome.css");
const homepageCss = read("src/styles/homepage.css");
assert.match(
  chromeCss,
  /\.nav-link\s+\.nav-chevron\s*\{[^}]*width:\s*16px;[^}]*height:\s*16px;/s,
  "Shared tool-page navigation must size the local SVG chevron explicitly."
);
assert.match(
  chromeCss,
  /\.nav-link\s*\{[^}]*white-space:\s*nowrap;/s,
  "Shared navigation labels must stay on one line at compact desktop widths."
);
assert.match(
  chromeCss,
  /\.pill\s*\{[^}]*white-space:\s*nowrap;/s,
  "Shared header pills must keep their labels on one line."
);
for (const relativePath of ["site-chrome.css", "src/styles/homepage.css"]) {
  assert.match(
    read(relativePath),
    /\.nav-link\s*\{[^}]*white-space:\s*nowrap;/s,
    `${relativePath} navigation labels must stay on one line at compact desktop widths.`
  );
  assert.match(
    read(relativePath),
    /\.pill\s*\{[^}]*white-space:\s*nowrap;/s,
    `${relativePath} header pills must keep their labels on one line.`
  );
}

const bootSource = read("src/runtime/tool-boot.js");
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
