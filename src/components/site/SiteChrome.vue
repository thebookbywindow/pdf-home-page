<template>
  <HeaderChrome v-if="!isFooterOnly" />
  <FooterChrome v-if="!isHeaderOnly" />
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted } from "vue";
import HeaderChrome from "./HeaderChrome.vue";
import FooterChrome from "./FooterChrome.vue";
import { runtimeWindow } from "../../runtime/index.js";

const cleanups = [];
const props = defineProps({ part: { type: String, default: "both" } });
const isFooterOnly = props.part === "footer";
const isHeaderOnly = props.part === "header";

function listen(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  cleanups.push(() => target.removeEventListener(event, handler, options));
}

function setupDropdowns(root) {
  root.querySelectorAll(".nav-item").forEach((item) => {
    const trigger = item.querySelector(".nav-trigger");
    if (!trigger) return;
    const menu = item.querySelector(".desktop-menu");
    const position = () => {
      if (!menu) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(1200, window.innerWidth - 48);
      const maxLeft = Math.max(24, window.innerWidth - width - 24);
      menu.style.setProperty("--desktop-menu-left", `${Math.round(Math.min(Math.max(24, rect.left), maxLeft))}px`);
    };
    const setOpen = (open) => {
      if (open) position();
      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
    };
    listen(item, "mouseenter", () => setOpen(true));
    listen(item, "mouseleave", () => setOpen(false));
    listen(item, "focusin", () => setOpen(true));
    listen(item, "focusout", (event) => {
      if (!item.contains(event.relatedTarget)) setOpen(false);
    });
    listen(trigger, "click", () => setOpen(!item.classList.contains("is-open")));
    listen(window, "resize", () => {
      if (item.classList.contains("is-open")) position();
    });
  });
}

function setupLanguagePicker(root) {
  const picker = root.querySelector(".header-language-picker");
  const button = picker?.querySelector(".header-language-button");
  if (!picker || !button) return;
  const close = () => {
    picker.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };
  listen(button, "click", (event) => {
    event.stopPropagation();
    const open = !picker.classList.contains("is-open");
    picker.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
  });
  picker.querySelectorAll("a").forEach((link) => {
    listen(link, "click", (event) => {
      event.preventDefault();
      picker.querySelectorAll("a").forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
      close();
    });
  });
  listen(document, "click", (event) => {
    if (!picker.contains(event.target)) close();
  });
}

function setupFooterLanguagePicker(root) {
  const picker = root.querySelector(".language-picker");
  const button = picker?.querySelector(".language");
  const label = picker?.querySelector(".language-label");
  if (!picker || !button) return;
  const close = () => {
    picker.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };
  listen(button, "click", (event) => {
    event.stopPropagation();
    const open = !picker.classList.contains("is-open");
    picker.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
  });
  picker.querySelectorAll("a").forEach((link) => {
    listen(link, "click", (event) => {
      event.preventDefault();
      picker.querySelectorAll("a").forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
      if (label) label.textContent = link.textContent.trim();
      close();
    });
  });
  listen(document, "click", (event) => {
    if (!picker.contains(event.target)) close();
  });
}

function setupMobileMenu(root) {
  const button = root.querySelector("#chrome-menu-button");
  const menu = document.getElementById("chrome-mobile-menu");
  if (!button || !menu) return;
  const close = () => {
    document.body.classList.remove("is-menu-open");
    menu.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };
  listen(button, "click", () => {
    if (menu.classList.contains("is-open")) close();
    else {
      document.body.classList.add("is-menu-open");
      menu.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
  menu.querySelectorAll("a").forEach((link) => listen(link, "click", close));
  listen(document, "keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function setup() {
  const root = document.getElementById("site-chrome-header");
  const footer = document.getElementById("site-chrome-footer");
  if (isFooterOnly) {
    if (!footer) return;
    setupFooterLanguagePicker(footer);
    const win = runtimeWindow();
    win.WPSLinks?.wireDownloadTriggers(footer);
    win.WPSToolsDirectory?.render(footer.querySelector("[data-tools-directory]"));
    return;
  }
  const header = root?.querySelector(".site-header");
  if (!root || !header) return;
  setupDropdowns(header);
  setupLanguagePicker(header);
  setupMobileMenu(root);
  setupFooterLanguagePicker(footer);
  const updateScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateScroll();
  listen(window, "scroll", updateScroll, { passive: true });

  const win = runtimeWindow();
  win.WPSLinks?.wireDownloadTriggers(root);
  win.WPSSiteNav3D?.render3DNavMenu(document);
  win.WPSToolRoutes?.wireHomepage(document);
}

onMounted(() => nextTick(setup));
onBeforeUnmount(() => cleanups.splice(0).forEach((cleanup) => cleanup()));
</script>
