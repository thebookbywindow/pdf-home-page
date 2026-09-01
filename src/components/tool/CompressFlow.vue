<template>
  <div class="compress-flow" id="compress-flow" hidden>
    <div class="compress-single" id="compress-single" hidden>
      <div class="compress-single__card uploading" id="compress-single-card">
        <div class="tool-dashed-zone compress-single__zone" id="compress-single-zone">
          <svg class="tool-dashed-zone__svg" aria-hidden="true" viewBox="0 0 1118 360" preserveAspectRatio="none"><rect x="0.75" y="0.75" width="1116.5" height="358.5" rx="19.25" ry="19.25"></rect></svg>
          <div class="compress-single-busy" id="compress-single-busy" hidden>
            <img class="compress-single__spinner" :src="loadingIcon" alt="" width="60" height="60">
            <p class="compress-single__filename compress-single-name" id="compress-single-name"></p>
            <button class="compress-single__btn compress-single__btn--primary" type="button" id="compress-single-pill" disabled>Uploading...</button>
          </div>
          <div class="compress-single-ready" id="compress-single-ready" hidden>
            <img class="compress-single__pdf-icon" :src="pdfIcon" alt="" width="48" height="48">
            <p class="compress-single__filename compress-single-name" id="compress-single-ready-name"></p>
            <button class="compress-single__btn compress-single__btn--primary" type="button" id="btn-single-compress">Compress</button>
          </div>
          <div class="compress-single-done" id="compress-single-done" hidden>
            <div class="compress-single__title-row">
              <span class="compress-single__check" aria-hidden="true"><img :src="successIcon" alt="" width="17" height="13"></span>
              <p class="compress-single__title">Compression succeeded!</p>
            </div>
            <div class="compress-single__file-row">
              <img class="compress-single__pdf-icon compress-single__pdf-icon--sm" :src="pdfIcon" alt="" width="48" height="48">
              <span class="compress-single__filename" id="compress-single-done-name"></span>
            </div>
            <div class="compress-single__diff" id="compress-single-done-stats"></div>
            <p class="result-client-hint compress-single__cloud-hint" id="compress-single-cloud-hint" hidden>
              Saved to WPS Cloud Documents. Download WPS Office, then open Cloud Documents to view and edit.
            </p>
            <div class="compress-single__btns">
              <button class="compress-single__btn compress-single__btn--primary" type="button" id="compress-single-download">
                <img class="compress-single__btn-icon" :src="downloadIcon" alt="" width="24" height="24"><span>Download</span>
              </button>
              <button class="compress-single__btn compress-single__btn--secondary" type="button" id="compress-single-wps">
                <img class="compress-single__btn-icon" :src="wpsIcon" alt="" width="24" height="24"><span>Download WPS Office</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="batch-panel" id="batch-panel">
      <ul class="batch-file-list" id="batch-file-list" role="list"></ul>
      <div class="batch-footer" id="batch-footer">
        <span class="compress-status-pill" id="compress-status-pill" hidden>Uploading...</span>
        <button class="btn-upload hero-select-btn" type="button" id="btn-batch-action">Compress</button>
        <button class="btn-compress-wps" type="button" id="btn-batch-client" hidden>Download WPS Office</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import loadingIcon from "../../../images/tool-live/compress/loading.svg";
import pdfIcon from "../../../images/tool-hero/pdf-local-format-48.svg";
import successIcon from "../../../images/tool-live/compress/success-check.svg";
import downloadIcon from "../../../images/tool-live/compress/tool-download-white.svg";
import wpsIcon from "../../../images/tool-live/compress/tool-download-wps.svg";
</script>
