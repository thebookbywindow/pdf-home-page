<template>
  <SiteChrome part="header" />
  <div ref="pageRoot" v-html="bodyMarkup"></div>
  <SiteChrome part="footer" />
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import bodyMarkup from "./homepage-body.html?raw";
import { normalizeSiteHref } from "../../shared/urls";
import SiteChrome from "../site/SiteChrome.vue";

const pageRoot = ref(null);

function normalizeLinks() {
  pageRoot.value?.querySelectorAll("[href]").forEach((link) => {
    const href = link.getAttribute("href");
    link.setAttribute("href", normalizeSiteHref(href, ""));
  });
}

onMounted(async () => {
  await nextTick();
  normalizeLinks();
  await import("../../runtime/homepage-behavior.js");
});
</script>
