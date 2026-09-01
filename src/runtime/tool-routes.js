/**
 * Shared routing: which canonical Vue page opens for each experience.
 * Prefers WPSToolCatalog so all links stay under /en/pdf-tools/.
 */
(function (global) {
  const PAGES = {
    compress: "en/pdf-tools/compress-pdf/",
    convert: "en/pdf-tools/convert-pdf/"
  };

  const CONVERT_TOOLS = new Set([
    "Convert PDF",
    "PDF to Word", "PDF to Excel", "PDF to PPT", "PDF to JPG",
    "Word to PDF", "Excel to PDF", "PPT to PDF", "JPG to PDF",
    "XML to PDF", "Word to JPG", "JPG to Word"
  ]);

  const THREE_D_HUBS = new Set(["Mesh Converter", "CAD Converter", "BIM Converter"]);

  function resolveHref(pagePath) {
    if (!pagePath) return "#";
    if (global.WPSToolCatalog?.resolvePage) {
      return global.WPSToolCatalog.resolvePage(pagePath);
    }
    return pagePath;
  }

  function getPageForTool(title) {
    const t = (title || "").trim();
    if (!t) return "#";

    const fromCatalog = global.WPSToolCatalog?.pageForTitle?.(t);
    if (fromCatalog) return fromCatalog;

    if (THREE_D_HUBS.has(t) && global.WPSFormatHubs3D) {
      const hub = global.WPSFormatHubs3D.getHub(t);
      if (hub) return resolveHref(global.WPSFormatHubs3D.pageForHub(hub.id));
    }
    if (CONVERT_TOOLS.has(t)) return resolveHref(PAGES.convert);
    return resolveHref(PAGES.compress);
  }

  function wireHomepage(root) {
    root = root || document;
    if (!root.querySelector) return;

    root.querySelectorAll(".nav-menu-link").forEach((link) => {
      const hubId = link.getAttribute("data-3d-hub");
      if (hubId && global.WPSFormatHubs3D) {
        // pageForHub already resolves to the canonical Vue page.
        link.href = global.WPSFormatHubs3D.pageForHub(hubId);
        return;
      }
      const title = (link.dataset.toolTitle || link.textContent || "").replace(/\s+/g, " ").trim();
      if (title && title !== "All Tools →") link.href = getPageForTool(title);
    });

    root.querySelectorAll(".dock-item").forEach((link) => {
      const title = link.dataset.titleSource || link.dataset.title || "";
      if (title) link.href = getPageForTool(title);
    });

    root.querySelectorAll("[data-tool-title-source] .lab-tool-link").forEach((link) => {
      const card = link.closest("[data-tool-title-source]");
      if (card) link.href = getPageForTool(card.dataset.toolTitleSource);
    });

    root.querySelectorAll(".tools-directory-link").forEach((link) => {
      if (link.getAttribute("href") && link.getAttribute("href") !== "#") return;
      const title = link.getAttribute("aria-label") || link.querySelector("strong")?.textContent || link.querySelector("span:last-child")?.textContent;
      if (title) link.href = getPageForTool(title.trim());
    });
  }

  global.WPSToolRoutes = { PAGES, CONVERT_TOOLS, THREE_D_HUBS, getPageForTool, wireHomepage, resolveHref };
})(typeof window !== "undefined" ? window : globalThis);
