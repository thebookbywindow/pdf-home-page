import { createApp } from "vue";
import "../../app.css";
import "../../runtime/wps-links.js";
import "../../runtime/format-hubs-3d.js";
import "../../runtime/tool-catalog.js";
import "../../runtime/tool-routes.js";
import "../../runtime/site-nav-3d.js";
import "../../runtime/tools-directory.js";
import HomePage from "../../components/home/HomePage.vue";

document.documentElement.lang = "en";
document.title = "Free PDF Tools Online - Convert, Edit, Compress | WPS PDF Tools";

createApp(HomePage).mount("#app");
