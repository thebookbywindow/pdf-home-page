/**
 * Boots a generated tool page from body[data-tool-slug] + WPSToolCatalog.
 */
(function (global) {
  const PDF_FROM = ["PDF", "Word", "Excel", "PPT", "JPG", "XML"];
  const PDF_TO = ["PDF", "Word", "Excel", "PPT", "JPG"];
  const PDF_ALLOWED = {
    PDF: ["Word", "Excel", "PPT", "JPG"],
    Word: ["PDF", "JPG"],
    Excel: ["PDF"],
    PPT: ["PDF"],
    JPG: ["PDF", "Word"],
    XML: ["PDF"]
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function collectEls() {
    return {
      header: document.querySelector(".site-header"),
      formatHub: qs("format-hub"),
      loginGateCard: qs("login-gate-card"),
      loginGateTitle: qs("login-gate-title"),
      loginGateBody: qs("login-gate-body"),
      loginGateIcon: qs("login-gate-icon"),
      btnLoginPrimary: qs("btn-login-primary"),
      btnHeaderLogin: qs("chrome-login-link"),
      userLabel: qs("user-label"),
      userAvatar: qs("user-avatar"),
      quotaText: qs("quota-text"),
      quotaInfo: qs("quota-info"),
      quotaTooltip: qs("quota-tooltip"),
      workspaceBody: qs("workspace-body"),
      workspaceSteps: document.querySelectorAll("#workspace-steps .workspace-step"),
      uploadZone: qs("upload-zone"),
      fileInput: qs("file-input"),
      btnSelectFile: qs("btn-select-file"),
      processingPanel: qs("processing-panel"),
      progressBar: qs("progress-bar"),
      progressPercent: qs("progress-percent"),
      progressEta: qs("progress-eta"),
      progressPhase: qs("progress-phase"),
      progressHint: qs("progress-hint"),
      processFilename: qs("process-filename"),
      processFilesize: qs("process-filesize"),
      uploadSuccessPanel: qs("upload-success-panel"),
      uploadSuccessFilename: qs("upload-success-filename"),
      uploadSuccessFilesize: qs("upload-success-filesize"),
      btnUploadBack: qs("btn-upload-back"),
      btnUploadContinue: qs("btn-upload-continue"),
      resultPanel: qs("result-panel"),
      resultFilename: qs("result-filename"),
      resultStats: qs("result-stats"),
      downloadBtn: qs("download-btn"),
      downloadLabel: qs("download-label"),
      btnDownloadClient: qs("btn-download-client"),
      stageGate: qs("stage-gate"),
      stageTitle: qs("stage-title"),
      stageBody: qs("stage-body"),
      stagePrimary: qs("stage-primary"),
      stageSecondary: qs("stage-secondary"),
      stageIcon: qs("stage-icon"),
      ratioButtons: document.querySelectorAll(".ratio-btn")
    };
  }

  function bindDemoPanel(renderUI, resetResult) {
    const Q = global.WPSQuotaFlow;
    const scenarios = qs("demo-scenarios");
    const mcScenarios = qs("mc-scenarios");
    if (!scenarios || !Q) return;

    scenarios.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-scenario]");
      if (!btn) return;
      scenarios.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      Q.setScenario(btn.dataset.scenario);
      resetResult();
      renderUI();
    });

    mcScenarios?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-mc-scenario]");
      if (!btn) return;
      mcScenarios.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const sc = btn.dataset.mcScenario;
      if (sc === "normal") {
        sessionStorage.removeItem("mc_demo_scenario");
      } else {
        sessionStorage.setItem("mc_demo_scenario", sc);
      }
      resetResult();
      renderUI();
    });

    qs("demo-uses")?.addEventListener("change", (e) => {
      Q.setUsesRemaining(parseInt(e.target.value, 10));
      resetResult();
      renderUI();
    });

    qs("demo-reset")?.addEventListener("click", () => {
      Q.reset();
      sessionStorage.removeItem("mc_demo_scenario");
      scenarios.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      mcScenarios?.querySelectorAll("button").forEach((b, idx) => b.classList.toggle("is-active", idx === 0));
      resetResult();
      renderUI();
    });
  }

  function applyHero(tool) {
    const title = tool.pageTitle || tool.title;
    const breadcrumbTitle = tool.type === "3d-conversion" ? title : tool.title;
    document.title = `${title} | WPS PDF Tools`;
    const crumb = qs("crumb-title");
    const h1 = qs("page-title");
    const sub = qs("page-subtitle");
    if (crumb) crumb.textContent = breadcrumbTitle;
    if (h1) h1.textContent = title;
    if (sub) sub.textContent = tool.subtitle || "";
    document.body.dataset.toolId = tool.slug;
  }

  function applySteps(tool) {
    const labels = tool.stepLabels || ["Upload", "Process", "Download"];
    const root = qs("workspace-steps");
    if (!root) return;
    root.innerHTML = labels.map((label, i) =>
      `<span class="workspace-step${i === 0 ? " is-active" : ""}"><span class="step-num">${i + 1}</span> ${label}</span>`
    ).join("");
  }

  function chipHtml(formats, selected) {
    return formats.map((fmt) =>
      `<button class="format-chip${fmt === selected ? " is-selected" : ""}" type="button" data-format="${fmt}">${fmt}</button>`
    ).join("");
  }

  function setupConvertFormats(tool) {
    const is3d = tool.type === "3d-conversion";
    const hub = is3d ? global.WPSFormatHubs3D?.getHub(tool.hubId) : null;
    let fromFormat = tool.defaultFrom || (hub?.defaultFrom) || "PDF";
    let toFormat = tool.defaultTo || (hub?.defaultTo) || "Word";
    const lockFormats = Boolean(tool.lockFormats);

    function isAllowed(from, to) {
      if (is3d) return global.WPSFormatHubs3D.canConvert(tool.hubId, from, to);
      return (PDF_ALLOWED[from] || []).includes(to);
    }

    function applyDisableState() {
      document.querySelectorAll("#chips-from .format-chip").forEach((chip) => {
        const fmt = chip.dataset.format;
        let disabled = !isAllowed(fmt, toFormat);
        if (lockFormats && fmt !== tool.defaultFrom) disabled = true;
        chip.classList.toggle("is-disabled", disabled);
        chip.setAttribute("aria-disabled", disabled ? "true" : "false");
      });
      document.querySelectorAll("#chips-to .format-chip").forEach((chip) => {
        const fmt = chip.dataset.format;
        let disabled = !isAllowed(fromFormat, fmt);
        if (lockFormats && fmt !== tool.defaultTo) disabled = true;
        chip.classList.toggle("is-disabled", disabled);
        chip.setAttribute("aria-disabled", disabled ? "true" : "false");
      });
    }

    function renderChips() {
      if (is3d && hub) {
        qs("chips-from").innerHTML = chipHtml(hub.inputs, fromFormat);
        qs("chips-to").innerHTML = chipHtml(hub.outputs, toFormat);
      } else {
        qs("chips-from").innerHTML = chipHtml(PDF_FROM, fromFormat);
        qs("chips-to").innerHTML = chipHtml(PDF_TO, toFormat);
      }
      applyDisableState();
    }

    function acceptFor(fmt) {
      if (is3d) return global.WPSFormatHubs3D.acceptFor(tool.hubId, fmt);
      return global.WPSToolPage.acceptForFormat(fmt);
    }

    function updateFormatUI() {
      const dropTitle = qs("drop-title");
      const dropSub = qs("drop-sub");
      const selectLabel = qs("select-label");
      if (dropTitle) {
        dropTitle.textContent = `Drop ${fromFormat} ${tool.singleFile ? "file" : "files"} here`;
      }
      if (dropSub) {
        dropSub.textContent = is3d
          ? "or click to select from your device"
          : `Convert to ${toFormat}`;
      }
      if (selectLabel) selectLabel.textContent = `Select ${fromFormat} File`;
      if (qs("file-input")) qs("file-input").accept = acceptFor(fromFormat);
      applyDisableState();
    }

    function selectFormat(type, fmt) {
      if (lockFormats) return;
      if (type === "from") {
        fromFormat = fmt;
        if (!isAllowed(fromFormat, toFormat)) {
          toFormat = is3d
            ? global.WPSFormatHubs3D.firstAllowedTo(tool.hubId, fromFormat, toFormat)
            : (PDF_ALLOWED[fromFormat] || ["PDF"])[0];
        }
      } else {
        toFormat = fmt;
        if (!isAllowed(fromFormat, toFormat)) {
          fromFormat = is3d
            ? global.WPSFormatHubs3D.firstAllowedFrom(tool.hubId, toFormat, fromFormat)
            : Object.keys(PDF_ALLOWED).find((f) => (PDF_ALLOWED[f] || []).includes(toFormat)) || fromFormat;
        }
      }
      renderChips();
      updateFormatUI();
    }

    function bindChips(containerId, type) {
      qs(containerId)?.addEventListener("click", (e) => {
        const chip = e.target.closest(".format-chip");
        if (!chip || chip.classList.contains("is-disabled")) return;
        selectFormat(type, chip.dataset.format);
      });
    }

    renderChips();

    return {
      getFormats: () => ({ from: fromFormat, to: toFormat }),
      bindFormatPicker() {
        bindChips("chips-from", "from");
        bindChips("chips-to", "to");
        updateFormatUI();
      }
    };
  }

  function setupEtaBanner(tool) {
    const banner = qs("eta-banner");
    if (!banner) return;
    if (tool.type === "3d-conversion" && tool.etaRange) {
      banner.hidden = false;
      banner.textContent = `Estimated time for this conversion: ${tool.etaRange}`;
    } else {
      banner.hidden = true;
    }
  }

  function init3dFooterAccordion() {
    const footer = document.querySelector("#site-chrome-footer .footer");
    if (!footer || footer.dataset.mobileAccordionReady === "true") return;

    const media = global.matchMedia?.("(max-width: 768px)");
    const entries = Array.from(footer.querySelectorAll(".footer-col")).map((column, index) => {
      const heading = column.querySelector("h3");
      const links = Array.from(column.children).filter((child) => child.tagName === "A");
      if (!heading || !links.length) return null;

      const panel = document.createElement("div");
      const panelId = `footer-accordion-panel-${index + 1}`;
      panel.className = "footer-accordion-panel";
      panel.id = panelId;
      links.forEach((link) => panel.appendChild(link));
      heading.insertAdjacentElement("afterend", panel);

      const label = heading.textContent.trim();
      const button = document.createElement("button");
      button.type = "button";
      button.className = "footer-accordion-button";
      button.setAttribute("aria-controls", panelId);
      button.innerHTML = `
        <span>${label}</span>
        <span class="material-symbols-rounded footer-accordion-icon" aria-hidden="true">expand_more</span>
      `;
      heading.textContent = "";
      heading.appendChild(button);

      const setExpanded = (expanded) => {
        column.classList.toggle("is-open", expanded);
        button.setAttribute("aria-expanded", String(expanded));
        panel.hidden = !expanded;
      };

      button.addEventListener("click", () => {
        if (!media?.matches) return;
        setExpanded(button.getAttribute("aria-expanded") !== "true");
      });

      return { button, setExpanded };
    }).filter(Boolean);

    const syncViewport = () => {
      const isMobile = Boolean(media?.matches);
      entries.forEach(({ button, setExpanded }) => {
        button.disabled = !isMobile;
        setExpanded(!isMobile);
      });
    };

    if (media?.addEventListener) {
      media.addEventListener("change", syncViewport);
    } else {
      media?.addListener?.(syncViewport);
    }
    footer.dataset.mobileAccordionReady = "true";
    syncViewport();
  }

  async function boot() {
    const slug = document.body?.dataset?.toolSlug;
    const catalog = global.WPSToolCatalog;
    const tool = catalog?.getBySlug(slug);
    if (!tool) {
      console.error("[tool-boot] Unknown tool slug:", slug);
      return;
    }

    applyHero(tool);
    applySteps(tool);
    setupEtaBanner(tool);

    const resultTitle = document.querySelector("#result-panel h3");
    if (resultTitle && tool.resultTitle) resultTitle.textContent = tool.resultTitle;

    const hasFormatHub = tool.type === "pdf-convert" || tool.type === "3d-conversion";
    const is3d = tool.type === "3d-conversion";
    const isConvert = hasFormatHub || Boolean(tool.fixedPair);

    await global.WPSSiteChrome?.mount();
    if (is3d) init3dFooterAccordion();
    global.WPSDemoPanel?.init();

    const contentMount = qs("tool-content-mount");
    if (global.WPSToolContent?.mount) {
      global.WPSToolContent.mount(slug, contentMount, { relatedSlugs: tool.related });
    }

    let formatApi = null;
    if (hasFormatHub) {
      formatApi = setupConvertFormats(tool);
    } else if (tool.fixedPair) {
      formatApi = {
        getFormats: () => ({ from: tool.defaultFrom, to: tool.defaultTo }),
        bindFormatPicker() {}
      };
      // Fixed pair: seed drop zone labels / accept
      const dropTitle = qs("drop-title");
      const dropSub = qs("drop-sub");
      const selectLabel = qs("select-label");
      if (dropTitle) {
        dropTitle.textContent = `Drop ${tool.defaultFrom} ${tool.singleFile ? "file" : "files"} here`;
      }
      if (dropSub) dropSub.textContent = `Convert to ${tool.defaultTo}`;
      if (selectLabel) selectLabel.textContent = `Select ${tool.defaultFrom} File`;
      if (qs("file-input") && tool.accept) qs("file-input").accept = tool.accept;
    }

    if (!isConvert && tool.accept && qs("file-input")) {
      qs("file-input").accept = tool.accept;
    }

    const syncDemo = (state) => {
      const sel = qs("demo-uses");
      if (sel) sel.value = String(state.usesRemaining);
    };

    const workflow = tool.workflow;
    if (workflow === "split" || workflow === "merge" || workflow === "sign") {
      if (!global.WPSToolWorkflowsExtra?.init) {
        console.error("[tool-boot] WPSToolWorkflowsExtra missing for workflow:", workflow);
        return;
      }
      global.WPSToolWorkflowsExtra.init(tool, collectEls(), bindDemoPanel, syncDemo);
      return;
    }

    const mode = isConvert ? "convert" : "compress";
    const processLabelMap = {
      "compress-pdf": "Compressing",
      "split-pdf": "Splitting",
      "merge-pdf": "Merging",
      "signing-pdf": "Signing"
    };
    global.WPSToolPage.initToolPage({
      mode,
      toolVerb: tool.toolVerb,
      continueLabel: tool.continueLabel || (isConvert ? "Continue to convert" : "Continue"),
      downloadLabel: tool.downloadLabel,
      batchActionLabel: tool.stepLabels?.[1] || (isConvert ? "Convert" : "Process"),
      batchSuccessLabel: tool.type === "3d-conversion" || isConvert
        ? "Conversion succeeded!"
        : (tool.slug === "compress-pdf"
          ? "Compression succeeded!"
          : `${tool.stepLabels?.[1] || "Processing"} succeeded!`),
      sharedPipeline: Boolean(tool.sharedPipeline),
      autoProcessAfterUpload: Boolean(tool.autoProcessAfterUpload),
      singleFile: Boolean(tool.singleFile),
      longRunning: is3d,
      etaProfile: is3d ? tool.hubId : "pdf",
      processingLabel: is3d
        ? "Converting 3D model"
        : (isConvert ? "Converting" : (processLabelMap[tool.slug] || "Processing")),
      getFormats: formatApi ? formatApi.getFormats : undefined,
      bindFormatPicker: formatApi ? formatApi.bindFormatPicker : undefined,
      bindDemoPanel,
      onSyncDemo: syncDemo,
      els: collectEls()
    });
  }

  global.WPSToolBoot = { boot, PDF_ALLOWED, PDF_FROM, PDF_TO };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { boot(); });
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);
