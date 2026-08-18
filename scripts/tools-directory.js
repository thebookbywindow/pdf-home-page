/**
 * Shared footer "All online Tools" directory renderer.
 * Layout: PDF Tools 1 · Conversion 2 · Desktop 2 · 3D Conversion 1 (max 6 items / column).
 */
(function (global) {
  const PDF_TOOLS = [
    { title: "Compress PDF", icon: "compress-pdf.svg" },
    { title: "Convert PDF", icon: "convert-pdf.svg" },
    { title: "Split PDF", icon: "split-pdf.svg" },
    { title: "Merge PDF", icon: "merge-pdf.svg" },
    { title: "Signing PDF", icon: "signing-pdf.svg" }
  ];

  const CONVERSION_TOOLS = [
    { title: "PDF to Word", icon: "PDF to Word.svg" },
    { title: "PDF to Excel", icon: "PDF to Excel.svg" },
    { title: "PDF to PPT", icon: "PDF to PPT.svg" },
    { title: "PDF to JPG", icon: "PDF to JPG.svg" },
    { title: "Word to PDF", icon: "Word to PDF.svg" },
    { title: "Excel to PDF", icon: "Excel to PDF.svg" },
    { title: "PPT to PDF", icon: "PPT to PDF.svg" },
    { title: "JPG to PDF", icon: "JPG to PDF.svg" },
    { title: "XML to PDF", icon: "xml to PDF.svg" },
    { title: "Word to JPG", icon: "Word to jpg.svg" },
    { title: "JPG to Word", icon: "JPG to Word.svg" }
  ];

  const DESKTOP_TOOLS = [
    { title: "Read PDF", icon: "convert-pdf.svg" },
    { title: "PDF AI", icon: "convert-pdf.svg" },
    { title: "Annotate PDF", icon: "convert-pdf.svg" },
    { title: "Edit PDF", icon: "convert-pdf.svg" },
    { title: "PDF Viewer", icon: "convert-pdf.svg" },
    { title: "OCR PDF", icon: "convert-pdf.svg" },
    { title: "Create PDF", icon: "convert-pdf.svg" },
    { title: "Combine PDF", icon: "merge-pdf.svg" },
    { title: "Organize PDF", icon: "organizing-pdf.svg" },
    { title: "Compress PDF", icon: "compress-pdf.svg" },
    { title: "eSign PDF", icon: "signing-pdf.svg" },
    { title: "Protect PDF", icon: "convert-pdf.svg" }
  ];

  function assetBase() {
    return global.WPSToolCatalog?.assetBase?.() || global.WPSSiteChrome?.assetBase?.() || "";
  }

  function href(title) {
    return global.WPSToolRoutes ? WPSToolRoutes.getPageForTool(title) : "#";
  }

  function chunk(items, size) {
    const out = [];
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
    return out;
  }

  function renderLink(item) {
    const link = item.href || href(item.title);
    const iconSrc = `${assetBase()}images/tools-icon/${encodeURIComponent(item.icon || "convert-pdf.svg")}`;
    return `<a class="tools-directory-link" href="${link}" aria-label="${item.title}"><span class="tools-directory-icon"><img src="${iconSrc}" alt=""></span><span>${item.title}</span></a>`;
  }

  function renderHubLink(hub) {
    const link = global.WPSFormatHubs3D?.pageForHub(hub.id) || "#";
    return `<a class="tools-directory-link" href="${link}" aria-label="${hub.title}"><span class="tools-directory-icon"><span class="format-dot" aria-hidden="true"></span></span><span>${hub.title}</span></a>`;
  }

  function renderColumn(title, itemsHtml, continued) {
    const heading = continued
      ? `<h3 class="tools-directory-heading-continued">${title}</h3>`
      : `<h3>${title}</h3>`;
    return `<div class="tools-directory-group">${heading}<div class="tools-directory-list">${itemsHtml}</div></div>`;
  }

  function render(container) {
    if (!container) return;
    const H = global.WPSFormatHubs3D?.HUBS || {};
    const hubs = ["mesh", "cad", "bim"].map((id) => H[id]).filter(Boolean);
    const conversionCols = chunk(CONVERSION_TOOLS, 6);
    const desktopCols = chunk(DESKTOP_TOOLS, 6);

    container.innerHTML = `<div class="tools-directory-row tools-directory-row--six">${[
      renderColumn("PDF Tools", PDF_TOOLS.map(renderLink).join("")),
      ...conversionCols.map((items, i) => renderColumn("Conversion Tools", items.map(renderLink).join(""), i > 0)),
      ...desktopCols.map((items, i) => renderColumn("Desktop Features", items.map(renderLink).join(""), i > 0)),
      renderColumn("3D Conversion", hubs.map(renderHubLink).join(""))
    ].join("")}</div>`;
  }

  global.WPSToolsDirectory = { render };
})(typeof window !== "undefined" ? window : globalThis);
