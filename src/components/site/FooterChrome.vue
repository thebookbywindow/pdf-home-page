<template>
<div id="site-chrome-footer">
<section class="tools-directory" aria-labelledby="tools-directory-title">
  <div class="tools-directory-inner">
    <h2 id="tools-directory-title">All online Tools</h2>
    <div class="tools-directory-sections" data-tools-directory></div>
  </div>
</section>
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand"><img class="footer-logo" :src="asset('images/legacy/wps_logo_horizontal.svg')" alt="WPS Office"><p class="footer-address">WPS SOFTWARE PTE. LTD., 6 RAFFLES QUAY #14-06 SINGAPORE (048580)</p></div>
      <div class="footer-col footer-products"><h3>WPS Office Products</h3><a :href="siteHref('#')">WPS Office for Windows</a><a :href="siteHref('#')">WPS Office for Mac</a><a :href="siteHref('#')">WPS Office for Android</a><a :href="siteHref('#')">WPS Office for iOS</a><a :href="siteHref('#')">WPS Office for Linux</a><a :href="siteHref('#')">Pricing</a></div>
      <div class="footer-col footer-components"><h3>Office Components</h3><a :href="siteHref('#')">WPS Writer</a><a :href="siteHref('#')">WPS Spreadsheet</a><a :href="siteHref('#')">WPS Presentation</a><a :href="siteHref('#')">WPS PDF</a></div>
      <div class="footer-col footer-company"><h3>Company</h3><a :href="siteHref('#')">WPS Official</a><a :href="siteHref('#')">WPS Premium</a><a :href="siteHref('#')">Download Center</a><a :href="siteHref('#')">Privacy Policy</a><a :href="siteHref('#')">Contact Us</a></div>
    </div>
    <div class="footer-bottom"><p class="copyright">Copyright © Kingsoft Office Software, All Rights Reserved.</p><div class="language-picker"><button class="language" type="button" aria-expanded="false" aria-controls="footer-language-menu"><img :src="asset('images/legacy/earth.svg')" alt="" aria-hidden="true"><span class="language-label">English</span></button><ul class="language-menu" id="footer-language-menu"><li><a class="is-active" :href="siteHref('#')" data-lang="en">English</a></li><li><a :href="siteHref('#')" data-lang="de">Deutsch</a></li><li><a :href="siteHref('#')" data-lang="fr">Français</a></li><li><a :href="siteHref('#')" data-lang="es">Español</a></li><li><a :href="siteHref('#')" data-lang="pt">Português</a></li><li><a :href="siteHref('#')" data-lang="it">Italiano</a></li><li><a :href="siteHref('#')" data-lang="ja">日本語</a></li><li><a :href="siteHref('#')" data-lang="ko">한국어</a></li><li><a :href="siteHref('#')" data-lang="zh-cn">简体中文</a></li><li><a :href="siteHref('#')" data-lang="zh-tw">繁體中文</a></li></ul></div></div>
  </div>
</footer>
</div>
</template>

<script setup>
import { assetUrl, normalizeSiteHref, siteBase } from "../../shared/urls";

const asset = (value) => assetUrl(value, siteBase());
const siteHref = (value) => normalizeSiteHref(value, siteBase());
</script>
