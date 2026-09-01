import "./wps-links.js";
import "./model-converter-client.js";
import "./format-hubs-3d.js";
import "./tool-catalog.js";
import "./tool-routes.js";
import "./site-nav-3d.js";
import "./tools-directory.js";
import "./tool-quota-flow.js";
import "./tool-quota-modals.js";
import "./tool-content-library.js";
import "./tool-content-blocks.js";
import "./tool-page.js";
import "./tool-workflows-extra.js";

export async function loadToolBoot() {
  await import("./tool-boot.js");
}

export function runtimeWindow() {
  return window;
}
