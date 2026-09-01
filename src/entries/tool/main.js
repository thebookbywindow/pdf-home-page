import { createApp } from "vue";
import { createPinia } from "pinia";
import "../../app.css";
import "../../../site-chrome.css";
import "../../../tool-shell.css";
import "../../../tool-home-sections.css";
import "../../../tool-3d-parity.css";
import ToolPage from "../../components/tool/ToolPage.vue";
import "../../runtime/index.js";

const slug = document.body?.dataset?.toolSlug;
if (!slug) throw new Error("Missing body[data-tool-slug]");

document.body.dataset.assetBase = "../../../";
createApp(ToolPage, { slug }).use(createPinia()).mount("#app");
