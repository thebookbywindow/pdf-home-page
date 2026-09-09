<template>
<div id="site-chrome-header">
<header class="site-header" aria-label="Primary navigation">
  <div class="header-glass" aria-hidden="true">
    <span class="header-glass-base"></span>
    <span class="header-glass-layer glass-layer-1"></span>
    <span class="header-glass-layer glass-layer-2"></span>
    <span class="header-glass-layer glass-layer-3"></span>
    <span class="header-glass-layer glass-layer-4"></span>
  </div>
  <a class="brand" :href="siteHref('/')" aria-label="WPS PDF home">
    <span class="brand-mark" aria-hidden="true"><img :src="asset('images/legacy/wps-pdf-logo.svg')" alt="" /></span>
    <span>WPS PDF Tools</span>
  </a>
  <nav class="desktop-nav" aria-label="Main">
    <div class="nav-item">
      <button class="nav-link nav-trigger" type="button" aria-expanded="false">
        PDF Tools <svg class="nav-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" /></svg>
      </button>
      <div class="nav-dropdown tools-menu" role="menu">
        <div class="nav-dropdown-grid">
          <div class="nav-group">
            <p class="nav-group-title">Convert &amp; Compress</p>
            <div class="nav-menu-list">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/compress-pdf.svg')" alt="">Compress PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Convert PDF</a>
            </div>
          </div>
          <div class="nav-group">
            <p class="nav-group-title">Split &amp; Merge</p>
            <div class="nav-menu-list">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/split-pdf.svg')" alt="">Split PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/merge-pdf.svg')" alt="">Merge PDF</a>
            </div>
          </div>
          <div class="nav-group">
            <p class="nav-group-title">Sign &amp; Organize</p>
            <div class="nav-menu-list">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/signing-pdf.svg')" alt="">Signing PDF</a>
            </div>
          </div>
          <div class="nav-group">
            <p class="nav-group-title">Convert from PDF</p>
            <div class="nav-menu-list">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/PDF to Word.svg')" alt="">PDF to Word</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/PDF to Excel.svg')" alt="">PDF to Excel</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/PDF to PPT.svg')" alt="">PDF to PPT</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/PDF to JPG.svg')" alt="">PDF to JPG</a>
            </div>
          </div>
          <div class="nav-group">
            <p class="nav-group-title">Convert to PDF</p>
            <div class="nav-menu-list">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/Word to PDF.svg')" alt="">Word to PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/Excel to PDF.svg')" alt="">Excel to PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/PPT to PDF.svg')" alt="">PPT to PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/JPG to PDF.svg')" alt="">JPG to PDF</a>
            </div>
          </div>
          <div class="nav-group">
            <p class="nav-group-title">Other Conversion <span class="nav-group-new">New</span></p>
            <div class="nav-menu-list">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/xml to PDF.svg')" alt="">XML to PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/Word to jpg.svg')" alt="">Word to JPG</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/JPG to Word.svg')" alt="">JPG to Word</a>
            </div>
          </div>
        </div>
        <div class="nav-dropdown-footer">
          <a class="nav-all-tools-link" href="https://szdmt.com/en-US/all-products/" target="_blank" rel="noopener noreferrer">All Tools →</a>
        </div>
      </div>
    </div>
    <div :class="['nav-item', { 'nav-item--highlight': isThreeDPage }]">
      <button class="nav-link nav-trigger" type="button" aria-expanded="false">
        <span class="nav-new-badge">NEW</span>
        3D Conversion <svg class="nav-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" /></svg>
      </button>
      <div class="nav-dropdown conversion-3d-menu" id="nav-3d-menu" role="menu" data-3d-nav-menu></div>
    </div>
    <div class="nav-item">
      <button class="nav-link nav-trigger" type="button" aria-expanded="false">
        Desktop <svg class="nav-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" /></svg>
      </button>
      <div class="nav-dropdown desktop-menu" role="menu">
        <div class="nav-dropdown-grid">
          <div class="nav-group">
            <p class="nav-group-title">Educational Users</p>
            <div class="nav-subgrid">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Read PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">PDF AI</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Annotate PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/JPG to PDF.svg')" alt="">JPG to PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Create PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/organizing-pdf.svg')" alt="">Add Page Numbers to PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/merge-pdf.svg')" alt="">Combine PDF</a>
            </div>
          </div>
          <div class="nav-group">
            <p class="nav-group-title">Personal Users</p>
            <div class="nav-subgrid">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Convert PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">PDF Viewer</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Edit PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/split-pdf.svg')" alt="">Unlock PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/compress-pdf.svg')" alt="">Compress PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/organizing-pdf.svg')" alt="">Delete Pages from PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/organizing-pdf.svg')" alt="">Organize PDF</a>
            </div>
          </div>
          <div class="nav-group">
            <p class="nav-group-title">Professional Users</p>
            <div class="nav-subgrid">
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">PDF Filler</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/signing-pdf.svg')" alt="">eSign PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Protect PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Sign PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">PDF Splitter</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/signing-pdf.svg')" alt="">Extra PDF Data</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Batch PDF</a>
              <a class="nav-menu-link" :href="siteHref('#')"><img :src="asset('images/tools-icon/convert-pdf.svg')" alt="">Add Watermark to PDF</a>
            </div>
          </div>
        </div>
        <div class="nav-dropdown-footer">
          <a class="nav-all-tools-link" href="https://szdmt.com/en-US/all-products/" target="_blank" rel="noopener noreferrer">All Tools →</a>
        </div>
      </div>
    </div>
    <div class="nav-item">
      <button class="nav-link nav-trigger" type="button" aria-expanded="false">
        Blog <svg class="nav-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" /></svg>
      </button>
      <div class="nav-dropdown blog-menu" role="menu">
        <a class="nav-menu-link" :href="siteHref('/#blog')">PDF Tutorials</a>
        <a class="nav-menu-link" :href="siteHref('/#blog')">PDF Softwares</a>
        <a class="nav-menu-link" :href="siteHref('/#blog')">PDF Download</a>
        <a class="nav-menu-link" :href="siteHref('/#blog')">PDF Trending</a>
        <a class="nav-menu-link" :href="siteHref('/#blog')">WPS PDF AI</a>
      </div>
    </div>
    <a class="nav-link" :href="siteHref('#')">Pricing</a>
    <a class="nav-link nav-extension" :href="siteHref('#')"><img :src="asset('images/legacy/Google plugin.svg')" alt="">PDF Extension</a>
    <a class="nav-link nav-wps-ai" href="https://www.wps.ai" target="_blank" rel="noopener noreferrer" aria-label="Open WPS AI in a new tab">
      <img class="nav-wps-ai__mark" :src="asset('images/legacy/wps-ai-mark.svg')" alt="">
      <span class="nav-wps-ai__label">WPS AI</span>
    </a>
  </nav>
  <div class="header-actions">
    <div class="header-language-picker">
      <button class="header-icon-button header-language-button" type="button" aria-label="Change language" aria-expanded="false" aria-controls="header-language-menu">
        <img :src="asset('images/legacy/earth.svg')" alt="" aria-hidden="true">
      </button>
      <div class="nav-dropdown header-language-menu" id="header-language-menu" role="menu">
        <a class="is-active" :href="siteHref('#')" role="menuitem" data-lang="en">English</a>
        <a :href="siteHref('#')" role="menuitem" data-lang="zh-tw">繁體中文</a>
      </div>
    </div>
    <button class="header-icon-button" type="button" aria-label="Search">
      <img :src="asset('images/legacy/search.svg')" alt="" aria-hidden="true">
    </button>
    <div class="header-user-picker" id="header-user-picker">
      <a class="login-link" :href="siteHref('#')" id="chrome-login-link" aria-haspopup="menu" aria-expanded="false" aria-controls="header-user-menu">
        <span id="chrome-login-label">login</span>
        <img class="header-user-caret" :src="asset('images/legacy/down.svg')" alt="" aria-hidden="true">
      </a>
      <div class="nav-dropdown header-user-menu" id="header-user-menu" role="menu" aria-label="Switch user">
        <button type="button" role="menuitemradio" data-user-state="logged_out" aria-checked="true">Not signed in</button>
        <button type="button" role="menuitemradio" data-user-state="free" aria-checked="false">Free user</button>
        <button type="button" role="menuitemradio" data-user-state="premium" aria-checked="false">WPS Pro+</button>
        <button type="button" role="menuitemcheckbox" data-quota-state="online-exhausted" aria-checked="false">Online quota exhausted</button>
        <button type="button" role="menuitemcheckbox" data-quota-state="office-exhausted" aria-checked="false">WPS Office quota exhausted</button>
      </div>
    </div>
    <a class="pill primary" :href="siteHref('#')" data-wps-download="auto"><span>Free Download</span></a>
    <button class="menu-button" type="button" aria-label="Open menu" aria-expanded="false" id="chrome-menu-button">
      <span class="material-symbols-rounded" aria-hidden="true">menu</span>
    </button>
  </div>
</header>
<nav class="mobile-menu" id="chrome-mobile-menu" aria-label="Mobile navigation">
  <a :href="siteHref('/#tools')">Tools</a>
  <a :href="siteHref('/#tools')" data-tool-filter-link="3d-conversion">3D Conversion</a>
  <a :href="siteHref('/#download')">Desktop</a>
  <a :href="siteHref('/#blog')">Blog</a>
  <a :href="siteHref('#')">Pricing</a>
  <a :href="siteHref('#')">PDF Extension</a>
  <a :href="siteHref('#')" data-wps-download="auto">Free Download</a>
</nav>
</div>
</template>

<script setup>
import { assetUrl, normalizeSiteHref, siteBase } from "../../shared/urls";

const asset = (value) => assetUrl(value, siteBase());
const siteHref = (value) => normalizeSiteHref(value, siteBase());
const isThreeDPage = document.body?.classList.contains("tool-page--3d-parity")
  || /\/en\/pdf-tools\/(?:mesh|cad|bim)-converter\/?$/i.test(window.location.pathname);
</script>
