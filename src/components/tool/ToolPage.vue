<template>
  <SiteChrome part="header" />
  <main class="tool-page-main">
    <section v-if="officialShell" class="tool-hero tool-hero-v2">
      <div class="tool-hero-orbs" aria-hidden="true">
        <span class="tool-hero-orb tool-hero-orb--a"></span>
        <span class="tool-hero-orb tool-hero-orb--b"></span>
        <span class="tool-hero-orb tool-hero-orb--c"></span>
      </div>
      <nav class="breadcrumb bread-box" aria-label="Breadcrumb">
        <a class="bread-home" :href="siteHome">Home</a>
        <span class="bread-chevron" aria-hidden="true">›</span>
        <span class="bread-tool" id="crumb-title">{{ heroTitle }}</span>
      </nav>
      <div class="hero-copy">
        <h1 class="title" id="page-title">{{ heroTitle }}</h1>
        <p class="subtitle desc" id="page-subtitle">{{ tool.subtitle }}</p>
      </div>
    </section>
    <section v-else class="tool-hero">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a :href="siteHome">Home</a>
        <span aria-hidden="true">›</span>
        <span id="crumb-title">{{ tool.title }}</span>
      </nav>
      <h1 id="page-title">{{ heroTitle }}</h1>
      <p class="subtitle" id="page-subtitle">{{ tool.subtitle }}</p>
    </section>

    <section :class="['tool-workspace-wrap', { 'tool-workspace-wrap--3d': officialShell }]">
      <div v-if="officialShell" class="tool-quota-bar" id="tool-quota-bar">
        <div class="tool-quota-bar__row">
          <button class="quota-flow-back tool-task-toolbar__back" type="button" id="quota-flow-back" hidden>
            <span class="tool-task-toolbar__back-icon-wrap" aria-hidden="true">
              <img class="quota-flow-back__icon tool-task-toolbar__back-icon" :src="asset('images/tool-live/compress/back-chevron.svg')" alt="" width="8" height="14">
            </span>
            <span class="tool-task-toolbar__back-label">Back</span>
          </button>
              <QuotaControls :official="true" />
        </div>
      </div>

      <div :class="['workspace-card', { 'workspace-card--3d': is3d, 'workspace-card--pdf-parity': isCompress }]">
        <div v-if="is3d" class="workspace-controls">
          <FormatHub :tool="tool" />
        </div>
        <template v-else>
          <FormatHub v-if="hasFormatHub" :tool="tool" />
          <div v-if="tool.type !== '3d-conversion'" class="eta-banner" id="eta-banner" hidden></div>
          <div v-if="!officialShell" class="workspace-toolbar">
            <div class="workspace-steps" id="workspace-steps">
              <span v-for="(label, index) in stepLabels" :key="label" :class="['workspace-step', { 'is-active': index === 0 }]">
                <span class="step-num">{{ index + 1 }}</span> {{ label }}
              </span>
            </div>
            <QuotaControls />
          </div>
        </template>

        <div class="workspace-body" id="workspace-body">
          <div v-if="tool.showRatio && !officialShell" class="ratio-picker" id="ratio-picker" role="group" aria-label="Compression ratio">
            <button class="ratio-btn" type="button" data-ratio="HD">HD</button>
            <button class="ratio-btn is-selected" type="button" data-ratio="Recommended">Recommended</button>
            <button class="ratio-btn" type="button" data-ratio="Smallest">Smallest</button>
          </div>

          <div v-if="officialShell" class="upload-zone tool-dashed-zone hero-dropzone" id="upload-zone">
            <svg class="tool-drop-outline" viewBox="0 0 1150 526" preserveAspectRatio="none" aria-hidden="true">
              <rect x="1" y="1" width="1148" height="524" :rx="isCompress ? 20 : 14" :ry="isCompress ? 20 : 14" vector-effect="non-scaling-stroke"></rect>
            </svg>
            <div :class="isCompress ? 'hero-center' : 'hero-center' " :id="isCompress ? 'upload-idle' : undefined">
              <div class="upload-icon hero-icon-tile" aria-hidden="true">
                <img v-if="isCompress" class="hero-icon-img" :src="asset('images/tool-hero/pdf-local-format-48.svg')" alt="" width="48" height="48">
                <span v-else class="hero-file-sheet"><span class="hero-file-badge">{{ tool.title.charAt(0) }}</span></span>
              </div>
              <div class="hero-copy-block">
                <h3 class="hero-upload-title" id="drop-title">Drop {{ dropLabel }} {{ fileNoun }} here</h3>
                <p class="hero-upload-sub" id="drop-sub">{{ is3d ? 'or click to select from your device' : dropSub }}</p>
              </div>
              <button class="btn-upload hero-select-btn" type="button" id="btn-select-file">
                <span class="hero-select-plus" aria-hidden="true">
                  <img class="plus-ring" :src="asset('images/tool-hero/vector-2.svg')" alt="" width="22" height="22">
                  <img class="plus-h" :src="asset('images/tool-hero/vector-3.svg')" alt="" width="10" height="2">
                  <img class="plus-v" :src="asset('images/tool-hero/vector-4.svg')" alt="" width="2" height="10">
                </span>
                <span id="select-label">Select {{ selectFormat }} File</span>
              </button>
            </div>
            <p :class="['upload-privacy-note', { 'hero-privacy': isCompress }]" id="upload-privacy">
              <img v-if="isCompress" :src="asset('images/tool-hero/privacy-shield-check.svg')" alt="" width="16" height="16">
              <span v-else class="material-symbols-rounded" aria-hidden="true">shield</span>
              Your files stay private and are deleted after processing.
            </p>
            <CompressFlow v-if="isCompress" />
          </div>

          <div v-else class="upload-zone" id="upload-zone">
            <div class="upload-icon" aria-hidden="true"><span class="material-symbols-rounded">{{ uploadIcon }}</span></div>
            <h3 id="drop-title">Drop {{ dropLabel }} {{ fileNoun }} here</h3>
            <p id="drop-sub">{{ dropSub }}</p>
            <button class="btn-upload" type="button" id="btn-select-file">
              <span class="material-symbols-rounded">add</span>
              <span id="select-label">Select {{ selectFormat }} File</span>
            </button>
          </div>

          <div class="processing-panel" id="processing-panel" hidden>
            <div class="processing-panel-head">
              <h3 id="progress-phase">Processing</h3>
              <button class="batch-file-cancel" type="button" id="btn-pipeline-cancel" aria-label="Cancel">
                <span class="material-symbols-rounded">close</span>
              </button>
            </div>
            <p class="process-meta"><span id="process-filename">file</span> · <span id="process-filesize">0 KB</span></p>
            <div class="progress-track"><div class="progress-bar" id="progress-bar"></div></div>
            <div class="progress-row">
              <span id="progress-percent">0%</span>
              <span id="progress-eta" class="progress-eta">Calculating…</span>
            </div>
            <p class="progress-hint" id="progress-hint" hidden></p>
          </div>

          <div class="upload-success-panel" id="upload-success-panel" hidden>
            <div class="upload-success-icon" aria-hidden="true"><span class="material-symbols-rounded">cloud_done</span></div>
            <h3>Upload complete</h3>
            <p class="process-meta"><span id="upload-success-filename">file</span> · <span id="upload-success-filesize">0 KB</span></p>
            <div class="upload-success-actions">
              <button class="btn-primary" type="button" id="btn-upload-continue">{{ continueLabel }}</button>
            </div>
          </div>

          <div v-if="!isCompress" class="batch-panel" id="batch-panel" hidden>
            <ul class="batch-file-list" id="batch-file-list" role="list"></ul>
            <div class="batch-footer" id="batch-footer">
              <button class="btn-batch-zip" type="button" id="btn-batch-zip" hidden>
                <span class="material-symbols-rounded">folder_zip</span>
                Download all as ZIP
              </button>
              <button class="btn-secondary btn-batch-client" type="button" id="btn-batch-client" hidden>Download WPS Office</button>
              <p class="result-client-hint" id="batch-client-hint" hidden>Download WPS Office, then open Cloud Documents to view and edit.</p>
            </div>
          </div>

          <div class="result-panel" id="result-panel" hidden data-visible="false">
            <div class="result-icon" aria-hidden="true"><span class="material-symbols-rounded">check_circle</span></div>
            <h3>{{ resultTitle }}</h3>
            <p class="process-meta" id="result-filename">output</p>
            <div class="result-stats" id="result-stats"></div>
            <div class="result-actions">
              <a class="btn-download-result" id="download-btn" href="#" download>
                <span class="material-symbols-rounded">download</span>
                <span id="download-label">{{ downloadLabel }}</span>
              </a>
              <div class="result-client-cta">
                <button class="btn-secondary" type="button" id="btn-download-client">Download WPS Office</button>
                <p class="result-client-hint">Download WPS Office, then open Cloud Documents to view and edit.</p>
              </div>
            </div>
          </div>

          <div id="special-workflow" hidden></div>
        </div>

        <div class="workspace-back-wrap" id="workspace-back-wrap" hidden>
          <button class="btn-workspace-back" type="button" id="btn-workspace-back">
            <span class="material-symbols-rounded" aria-hidden="true">arrow_back</span>
            Back
          </button>
        </div>
      </div>
    </section>

    <input type="file" id="file-input" :accept="tool.accept || undefined" :multiple="!singleFile" hidden>
    <div id="tool-content-mount"></div>
  </main>
  <SiteChrome part="footer" />
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import SiteChrome from "../site/SiteChrome.vue";
import QuotaControls from "./QuotaControls.vue";
import FormatHub from "./FormatHub.vue";
import CompressFlow from "./CompressFlow.vue";
import { assetUrl, siteBase } from "../../shared/urls";
import { runtimeWindow, loadToolBoot } from "../../runtime/index.js";

const props = defineProps({ slug: { type: String, required: true } });
const catalog = runtimeWindow().WPSToolCatalog;
const tool = catalog?.getBySlug(props.slug);
if (!tool) throw new Error(`Unknown tool slug: ${props.slug}`);

const is3d = tool.type === "3d-conversion";
const isCompress = tool.slug === "compress-pdf";
const hasFormatHub = tool.type === "pdf-convert" || is3d;
const officialShell = is3d || Boolean(tool.officialShell);
const isConvert = hasFormatHub || Boolean(tool.fixedPair);
const singleFile = Boolean(tool.singleFile) || tool.workflow === "split" || tool.workflow === "sign";
const heroTitle = tool.pageTitle || tool.title;
const stepLabels = tool.stepLabels || ["Upload", "Process", "Download"];
const continueLabel = tool.continueLabel || (isConvert ? "Continue to convert" : "Continue");
const resultTitle = tool.resultTitle || (isConvert ? "Conversion complete" : "Complete");
const downloadLabel = tool.downloadLabel || "Download result";
const dropLabel = tool.fixedPair || hasFormatHub ? (tool.defaultFrom || "files") : "PDF";
const fileNoun = singleFile ? "file" : "files";
const selectFormat = tool.defaultFrom || (isConvert ? "PDF" : "PDF");
const dropSub = tool.fixedPair ? `Convert to ${tool.defaultTo || "output"}` : "or click to select from your device";
const uploadIcon = tool.uploadIcon || (isConvert ? "sync_alt" : "upload_file");
const siteHome = `${siteBase()}`;
let assetObserver;

function asset(path) {
  return assetUrl(path);
}

function fixRuntimeAssets() {
  const base = siteBase();
  document.querySelectorAll('img[src], source[src]').forEach((element) => {
    const src = element.getAttribute("src");
    if (src?.startsWith("images/")) element.setAttribute("src", `${base}${src}`);
  });
}

onMounted(async () => {
  assetObserver = new MutationObserver(fixRuntimeAssets);
  assetObserver.observe(document.body, { childList: true, subtree: true });
  await loadToolBoot();
  fixRuntimeAssets();
});

onBeforeUnmount(() => assetObserver?.disconnect());
</script>
