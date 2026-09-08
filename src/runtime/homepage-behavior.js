const toolHref = (title) => (window.WPSToolRoutes ? WPSToolRoutes.getPageForTool(title) : "#");

      const tools = [
        { title: "PDF to Word", desc: "Convert PDF files to editable Word documents in seconds (doc, docx formats)", icon: "PDF to Word.svg", bg: "pdf to Word.png", fg: "#00152a" },
        { title: "PDF to Excel", desc: "Convert PDF files to editable Excel spreadsheets online without downloading any software", icon: "PDF to Excel.svg", bg: "PDF to Excel.png", fg: "#002a1e" },
        { title: "PDF to PPT", desc: "WPS PDF Tools to PPT can convert PDF to editable PPT or PPTX slideshows. No watermarks, just converting PDF to PowerPoint in seconds.", icon: "PDF to PPT.svg", bg: "PDF to PPT.png", fg: "#2a1300" },
        { title: "Word to PDF", desc: "Convert Word (doc, docx) files to easy-to-share PDF files while preserving the layout for free", icon: "Word to PDF.svg", bg: "Word to PDF.png", fg: "#ffffff", descFg: "rgba(255,255,255,0.8)" },
        { title: "Excel to PDF", desc: "Convert Excel spreadsheets (xls, xlsx) to easy-to-read PDF files for free", icon: "Excel to PDF.svg", bg: "Excel to PDF.png", fg: "#002a1e" },
        { title: "PPT to PDF", desc: "Convert PowerPoint presentations (ppt, pptx) to easy-to-view and easy-to-share PDF files for free", icon: "PPT to PDF.svg", bg: "PPT to PDF.png", fg: "#2a0b00" },
        { title: "JPG to PDF", desc: "Convert images (JPG, JPEG, PNG, BMP) to PDF files for free and easily adjust PDF orientation and margins", icon: "JPG to PDF.svg", bg: "JPG to PDF.png", fg: "#ffffff" },
        { title: "Merge PDF", desc: "Select multiple PDF files and merge them into one PDF file online", icon: "merge-pdf.svg", bg: "Merge PDF.png", fg: "#ffffff" },
        { title: "Split PDF", desc: "Separate all pages from a single PDF file online and extract pages to multiple PDF files", icon: "split-pdf.svg", bg: "Split PDF.png", fg: "#2a0b00" },
        { title: "Compress PDF", desc: "Reduce the size of PDF files online using 3 compression methods", icon: "compress-pdf.svg", bg: "Compress PDF.png", fg: "#ffffff", badge: "NEW" },
        { title: "Convert PDF", desc: "Convert PDF files to the format you need online in seconds.", icon: "convert-pdf.svg", bg: "Compress PDF.png", fg: "#ffffff" },
        { title: "Signing PDF", desc: "Create and fill e-signatures in PDF files online and secure your e-signature", icon: "signing-pdf.svg", bg: "Signing PDF.png", fg: "#2a0b00" },
        { title: "XML to PDF", desc: "Convert XML files (NFE/CTE) to PDF documents online for free", icon: "xml to PDF.svg", bg: "XML to PDF.png", fg: "#2a0b00" },
        { title: "PDF to JPG", desc: "Convert PDF files to JPG images online with high quality and no sign-up required", icon: "PDF to JPG.svg", bg: "PDF to JPG.png", fg: "#ffffff" },
        { title: "Word to JPG", desc: "Convert Word documents to JPG images online with high quality and no sign-up required", icon: "Word to jpg.svg", bg: "Word to JPG.png", fg: "#ffffff", descFg: "rgba(255,255,255,0.82)" },
        { title: "JPG to Word", desc: "Convert JPG images to editable Word documents online with OCR technology", icon: "JPG to Word.svg", bg: "JPG to Word-1.png", fg: "#2a0b00", badge: "OCR" }
      ];

      const conversion3DGradients = [
        "linear-gradient(135deg, #f4f1ff 0%, #e8e2ff 55%, #ddd4ff 100%)",
        "linear-gradient(135deg, #eef8ff 0%, #dcefff 55%, #c8e4ff 100%)",
        "linear-gradient(135deg, #f2fff8 0%, #ddf7ea 55%, #c8efd8 100%)"
      ];

      const tools3D = (window.WPSSiteNav3D?.getHubCards?.() || []).map((item, index) => ({
        ...item,
        bg: "Compress PDF.png",
        fg: "#121317",
        gradient: conversion3DGradients[index % conversion3DGradients.length]
      }));

      const carouselTools = [...tools, ...tools3D];

      function render3DNavMenu() {
        window.WPSSiteNav3D?.render3DNavMenu(document);
      }

      function renderToolsDirectory() {
        window.WPSToolsDirectory?.render(document.querySelector("[data-tools-directory]"));
      }

      render3DNavMenu();
      renderToolsDirectory();
      window.WPSToolRoutes?.wireHomepage(document);

      const dockGradients = {
        "Compress PDF.png": ["#fff6f6", "#ffe9e9", "#ffd7d7", "#ffc6c6"],
        "Excel to PDF.png": ["#effbf6", "#d8f4e9", "#bfead9", "#a3dcc8"],
        "JPG to PDF.png": ["#fff6f5", "#ffe8e6", "#ffd5d2", "#ffc4c0"],
        "JPG to Word-1.png": ["#f2f7ff", "#dceaff", "#bdd6ff", "#9fc2ff"],
        "JPG to Word.png": ["#f2f8ff", "#ddecff", "#c0dbff", "#9fc7ff"],
        "Merge PDF.png": ["#f6f0ff", "#eadcff", "#d6c0ff", "#b99af6"],
        "PDF to Excel.png": ["#effbf6", "#d9f3e8", "#c2e8d9", "#a8dccb"],
        "PDF to JPG.png": ["#fff6ef", "#ffe9d7", "#ffd9bd", "#ffc996"],
        "PDF to PPT.png": ["#fff8ed", "#ffefd9", "#ffe1bd", "#ffd099"],
        "PPT to PDF.png": ["#fff8ed", "#ffefd9", "#ffe1bd", "#ffd099"],
        "Signing PDF.png": ["#fff6f4", "#ffeae6", "#ffdad4", "#ffc9c1"],
        "Split PDF.png": ["#fff6f5", "#ffe8e6", "#ffd7d3", "#ffc6c1"],
        "Word to JPG.png": ["#f7f1ff", "#eadcff", "#d6c0ff", "#bc9af8"],
        "Word to PDF.png": ["#f2f7ff", "#dceaff", "#bdd6ff", "#9fc2ff"],
        "XML to PDF.png": ["#fff5ee", "#ffe7da", "#ffd7c4", "#ffc3a5"],
        "pdf to Word.png": ["#f2f8ff", "#ddecff", "#c0dbff", "#9fc7ff"]
      };

      console.assert(tools.length === 16, "Expected 16 tools.");
      const siteHeader = document.querySelector(".site-header");
      const dockScroller = document.querySelector("[data-dock-scroller]");
      const dockTrack = document.querySelector("[data-dock-track]");
      const dockViewport = document.querySelector(".dock-viewport");
      const dockLabel = document.querySelector("[data-dock-label]");
      const mobileButton = document.querySelector(".menu-button");
      const mobileMenu = document.querySelector(".mobile-menu");

      function updateHeaderState() {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
      }

      updateHeaderState();
      window.addEventListener("scroll", updateHeaderState, { passive: true });

      function renderDockTool(tool) {
        const appIcon = tool.bg.replace(/\.png$/i, ".png");
        const encodedIcon = `images/tools-icon-image2-glass/${encodeURIComponent(appIcon)}`;
        const gradient = dockGradients[tool.bg] || ["#eef2f7", "#dde6f3", "#cbd8ea", "#f8f9fc", "#dce7f6"];
        const gradientStyle = gradient.map((color, index) => `--dock-grad-${index + 1}:${color}`).join(";");
        return `
          <a class="dock-item" href="${toolHref(tool.title)}" draggable="false" data-title="${tool.title}" data-title-source="${tool.title}" data-desc-source="${tool.desc}" ${tool.badge ? `data-badge-source="${tool.badge}"` : ""} aria-label="${tool.title}. ${tool.desc}" style="${gradientStyle}">
            <span class="dock-tooltip">${tool.title}</span>
            <span class="dock-icon-stack" aria-hidden="true">
              <span class="dock-icon-shell">
                <span class="dock-icon-gloss"></span>
                <img class="dock-tool-icon dock-tool-icon-app" src="${encodedIcon}" draggable="false" alt="" />
              </span>
              ${tool.badge ? `<span class="dock-badge">${tool.badge}</span>` : ""}
            </span>
          </a>
        `;
      }

      function renderMiniTool(tool) {
        const encodedIcon = `images/tools-icon/${encodeURIComponent(tool.icon)}`;
        return `
          <a class="mini-tool" href="#" aria-label="${tool.title}. ${tool.desc}">
            <img src="${encodedIcon}" alt="" />
            <span><strong>${tool.title}</strong><span>${tool.desc}</span></span>
          </a>
        `;
      }

      if (dockTrack) dockTrack.innerHTML = tools.map(renderDockTool).join("");
      const toolGrid = document.querySelector("[data-tool-grid]");
      if (toolGrid) {
        toolGrid.innerHTML = tools.map(renderMiniTool).join("");
      }

      function initDock() {
        if (!dockScroller || !dockTrack) return;

        const dockItems = Array.from(dockTrack.querySelectorAll(".dock-item"));
        const dockStage = dockTrack.closest(".dock-stage");
        const dockItemStates = dockItems.map((item) => ({ item, scale: 1, targetScale: 1 }));
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let activeItem = null;
        let lastPointerX = null;
        let lastPointerY = null;
        let isPointerInDock = false;
        let isPointerDownDock = false;
        let isDraggingDock = false;
        let didDragDock = false;
        let dragLastX = 0;
        let dragLastTime = 0;
        let dragVelocity = 0;
        let pressedDockItem = null;
        let inertiaFrame = 0;
        let magnifyFrame = 0;
        let scaleFrame = 0;
        let pendingPointerX = 0;
        let pendingPointerY = 0;

        function positionDockLabel(item) {
          if (!dockViewport || !dockLabel || !item) return;
          const viewportRect = dockViewport.getBoundingClientRect();
          const shellRect = item.querySelector(".dock-icon-stack")?.getBoundingClientRect() || item.getBoundingClientRect();
          const labelX = shellRect.left + shellRect.width / 2 - viewportRect.left;
          const labelY = shellRect.top - viewportRect.top - 24;
          dockLabel.textContent = item.dataset.title || item.getAttribute("aria-label")?.split(".")[0] || "";
          dockLabel.style.setProperty("--dock-label-x", `${Math.round(labelX)}px`);
          dockLabel.style.setProperty("--dock-label-y", `${Math.round(labelY)}px`);
          dockViewport.classList.add("is-label-visible");
        }

        function wave(distance, radius) {
          if (distance >= radius) return 0;
          return (Math.cos((distance / radius) * Math.PI) + 1) / 2;
        }

        function setActiveItem(item) {
          if (activeItem === item) return;
          activeItem?.classList.remove("is-active");
          activeItem = item;
          activeItem?.classList.add("is-active");
          if (activeItem) {
            positionDockLabel(activeItem);
          } else {
            dockViewport?.classList.remove("is-label-visible");
          }
        }

        function resetDockItems() {
          dockViewport?.classList.remove("is-live-magnifying");
          dockItemStates.forEach((state) => {
            state.targetScale = 1;
            state.item.style.zIndex = "";
          });
          animateDockScales();
          setActiveItem(null);
        }

        function isDockHoverZone(clientY) {
          const iconRects = dockItems
            .map((item) => item.querySelector(".dock-icon-stack")?.getBoundingClientRect())
            .filter(Boolean);

          if (!iconRects.length) {
            const stageRect = dockStage?.getBoundingClientRect();
            return !!stageRect && clientY >= stageRect.top && clientY <= stageRect.bottom;
          }

          const top = Math.min(...iconRects.map((rect) => rect.top)) - 10;
          const bottom = Math.max(...iconRects.map((rect) => rect.bottom)) + 12;
          return clientY >= top && clientY <= bottom;
        }

        function magnifyDock(clientX, clientY) {
          if (reducedMotion || isDraggingDock) return;
          if (!isDockHoverZone(clientY)) {
            isPointerInDock = false;
            lastPointerX = null;
            lastPointerY = null;
            resetDockItems();
            return;
          }
          lastPointerX = clientX;
          lastPointerY = clientY;
          isPointerInDock = true;
          let nearestItem = null;
          let nearestDistance = Infinity;

          dockViewport?.classList.add("is-live-magnifying");
          dockItemStates.forEach((state) => {
            const item = state.item;
            const rect = item.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const distance = Math.abs(clientX - center);
            const influence = wave(distance, 285);
            const scale = 1 + influence * 0.31;
            state.targetScale = scale;
            item.style.zIndex = String(Math.round(scale * 100));

            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestItem = item;
            }
          });

          animateDockScales();
          setActiveItem(nearestDistance < 46 ? nearestItem : null);
          if (activeItem) positionDockLabel(activeItem);
        }

        function animateDockScales() {
          if (scaleFrame) return;
          const step = () => {
            let shouldContinue = false;
            dockItemStates.forEach((state) => {
              const delta = state.targetScale - state.scale;
              if (Math.abs(delta) > 0.0015) {
                state.scale += delta * 0.32;
                shouldContinue = true;
              } else {
                state.scale = state.targetScale;
              }
              state.item.style.setProperty("--dock-scale", state.scale.toFixed(3));
            });

            if (activeItem) positionDockLabel(activeItem);

            if (shouldContinue) {
              scaleFrame = requestAnimationFrame(step);
            } else {
              scaleFrame = 0;
              if (!isPointerInDock) dockViewport?.classList.remove("is-live-magnifying");
            }
          };

          scaleFrame = requestAnimationFrame(step);
        }

        function scheduleMagnify(clientX, clientY) {
          if (isDraggingDock) return;
          pendingPointerX = clientX;
          pendingPointerY = clientY;
          if (magnifyFrame) return;
          magnifyFrame = requestAnimationFrame(() => {
            magnifyFrame = 0;
            magnifyDock(pendingPointerX, pendingPointerY);
          });
        }

        function cancelInertia() {
          if (!inertiaFrame) return;
          cancelAnimationFrame(inertiaFrame);
          inertiaFrame = 0;
        }

        function clearPressedDockItem() {
          pressedDockItem?.classList.remove("is-pressed");
          pressedDockItem = null;
        }

        function startInertia() {
          cancelInertia();
          if (Math.abs(dragVelocity) < 22) return;

          let previousTime = performance.now();
          const step = (time) => {
            const delta = Math.min(32, time - previousTime) / 1000;
            previousTime = time;
            dockScroller.scrollLeft -= dragVelocity * delta;
            dragVelocity *= Math.pow(0.935, delta * 60);
            if (lastPointerX !== null && lastPointerY !== null && isPointerInDock) {
              magnifyDock(lastPointerX, lastPointerY);
            }
            if (Math.abs(dragVelocity) > 8) {
              inertiaFrame = requestAnimationFrame(step);
            } else {
              inertiaFrame = 0;
            }
          };

          inertiaFrame = requestAnimationFrame(step);
        }

        dockScroller.addEventListener("pointerenter", (event) => {
          if (event.pointerType && event.pointerType !== "mouse") return;
          scheduleMagnify(event.clientX, event.clientY);
        });

        dockScroller.addEventListener("pointermove", (event) => {
          if (isDraggingDock) return;
          if (event.pointerType && event.pointerType !== "mouse") return;
          scheduleMagnify(event.clientX, event.clientY);
        });

        dockScroller.addEventListener("pointerleave", (event) => {
          if (event.pointerType && event.pointerType !== "mouse") return;
          isPointerInDock = false;
          lastPointerX = null;
          lastPointerY = null;
          resetDockItems();
        });

        dockScroller.addEventListener("scroll", () => {
          if (!isDraggingDock && lastPointerX !== null && lastPointerY !== null && isPointerInDock) {
            scheduleMagnify(lastPointerX, lastPointerY);
          } else if (!isDraggingDock && activeItem) {
            requestAnimationFrame(() => positionDockLabel(activeItem));
          }
        }, { passive: true });

        dockScroller.addEventListener("wheel", (event) => {
          if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
          const maxScroll = dockScroller.scrollWidth - dockScroller.clientWidth;
          if (maxScroll <= 0) return;

          const nextScroll = Math.max(0, Math.min(maxScroll, dockScroller.scrollLeft + event.deltaY));
          if (nextScroll === dockScroller.scrollLeft) return;
          event.preventDefault();
          dockScroller.scrollLeft = nextScroll;
        }, { passive: false });

        dockScroller.addEventListener("pointerdown", (event) => {
          if (event.button !== 0) return;
          cancelInertia();
          isPointerDownDock = true;
          isDraggingDock = false;
          didDragDock = false;
          if (event.pointerType === "mouse") scheduleMagnify(event.clientX, event.clientY);
          dragLastX = event.clientX;
          dragLastTime = performance.now();
          dragVelocity = 0;
          clearPressedDockItem();
          pressedDockItem = event.target.closest(".dock-item");
          if (pressedDockItem && dockTrack.contains(pressedDockItem)) {
            pressedDockItem.classList.add("is-pressed");
          } else {
            pressedDockItem = null;
          }
          dockScroller.setPointerCapture(event.pointerId);
        });

        dockScroller.addEventListener("pointermove", (event) => {
          if (!isPointerDownDock) return;
          const now = performance.now();
          const dx = event.clientX - dragLastX;
          const dt = Math.max(16, now - dragLastTime);

          if (!isDraggingDock && Math.abs(dx) > 3) {
            isDraggingDock = true;
            didDragDock = true;
            isPointerInDock = false;
            lastPointerX = null;
            lastPointerY = null;
            if (magnifyFrame) {
              cancelAnimationFrame(magnifyFrame);
              magnifyFrame = 0;
            }
            clearPressedDockItem();
            dockScroller.classList.add("is-dragging");
            dockViewport?.classList.add("is-dock-dragging");
            resetDockItems();
          }
          if (!isDraggingDock) return;
          event.preventDefault();
          dockScroller.scrollLeft -= dx;
          dragVelocity = (dx / dt) * 1000;
          dragLastX = event.clientX;
          dragLastTime = now;
        });

        function endDockDrag(event) {
          if (!isPointerDownDock && !isDraggingDock) return;
          const wasDragging = isDraggingDock;
          isPointerDownDock = false;
          isDraggingDock = false;
          dockScroller.classList.remove("is-dragging");
          dockViewport?.classList.remove("is-dock-dragging");
          clearPressedDockItem();
          if (wasDragging) {
            isPointerInDock = false;
            lastPointerX = null;
            lastPointerY = null;
            resetDockItems();
          } else if (event.pointerType === "mouse") {
            scheduleMagnify(event.clientX, event.clientY);
          }
          if (event.pointerId !== undefined && dockScroller.hasPointerCapture(event.pointerId)) {
            dockScroller.releasePointerCapture(event.pointerId);
          }
          if (wasDragging) startInertia();
        }

        dockScroller.addEventListener("pointerup", endDockDrag);
        dockScroller.addEventListener("pointercancel", endDockDrag);
        dockScroller.addEventListener("lostpointercapture", endDockDrag);

        dockScroller.addEventListener("click", (event) => {
          if (!didDragDock) return;
          event.preventDefault();
          event.stopPropagation();
          didDragDock = false;
        }, true);

        dockItems.forEach((item) => {
          item.addEventListener("focus", () => {
            setActiveItem(item);
            positionDockLabel(item);
            if (reducedMotion) return;
            item.style.setProperty("--dock-scale", "1.24");
          });
          item.addEventListener("blur", () => {
            if (isPointerInDock && lastPointerX !== null && lastPointerY !== null) {
              magnifyDock(lastPointerX, lastPointerY);
              return;
            }
            resetDockItems();
          });
        });
      }

      initDock();

      function initToolCarousel() {
        const carousel = document.querySelector("[data-tool-carousel]");
        const track = document.querySelector("[data-tool-carousel-track]");
        const viewport = carousel?.querySelector(".tool-carousel-viewport");
        const prev = carousel?.querySelector("[data-tool-prev]");
        const next = carousel?.querySelector("[data-tool-next]");
        const filters = Array.from(carousel?.querySelectorAll("[data-tool-filter]") || []);
        if (!carousel || !track || !viewport || !prev || !next) return;

        const metadata = {
          "Compress PDF": { category: "convert-compress", art: "compress-pdf.webp" },
          "Convert PDF": { category: "convert-compress", art: "convert-pdf.webp" },
          "Merge PDF": { category: "split-merge", art: "merge-pdf.webp" },
          "Split PDF": { category: "split-merge", art: "split-pdf.webp" },
          "Signing PDF": { category: "sign-organize", art: "signing-pdf.webp" },
          "PDF to Word": { category: "from-pdf", art: "pdf-to-word.webp" },
          "PDF to Excel": { category: "from-pdf", art: "pdf-to-excel.webp" },
          "PDF to PPT": { category: "from-pdf", art: "pdf-to-ppt.webp" },
          "PDF to JPG": { category: "from-pdf", art: "pdf-to-jpg.webp" },
          "Word to PDF": { category: "to-pdf", art: "word-to-pdf.webp" },
          "Excel to PDF": { category: "to-pdf", art: "excel-to-pdf.webp" },
          "PPT to PDF": { category: "to-pdf", art: "ppt-to-pdf.webp" },
          "JPG to PDF": { category: "to-pdf", art: "jpg-to-pdf.webp" },
          "XML to PDF": { category: "other", art: "xml-to-pdf.webp" },
          "Word to JPG": { category: "other", art: "word-to-jpg.webp" },
          "JPG to Word": { category: "other", art: "jpg-to-word.webp" }
        };

        tools3D.forEach((tool) => {
          const froms = tool.hubInputs || [];
          const tos = tool.hubOutputs || [];
          metadata[tool.title] = {
            category: "3d-conversion",
            gradient: tool.gradient,
            input: froms.slice(0, 3).join(" / "),
            outputs: tos.slice(0, 3)
          };
        });

        let currentFilter = "all";
        let visibleTools = carouselTools;
        let cards = [];
        let position = 0;
        let targetPosition = 0;
        let spacing = 310;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartPosition = 0;
        let dragLastX = 0;
        let dragLastTime = 0;
        let dragVelocity = 0;
        let didDrag = false;
        let animationFrame = 0;
        let lastTickTime = 0;
        let entryProgress = 0;
        let entryStart = 0;
        let entryHasPlayed = false;
        let sectionIsVisible = false;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
        const maxPosition = () => Math.max(0, visibleTools.length - 1);

        const measureSpacing = () => {
          const cardWidth = cards[0]?.getBoundingClientRect().width || 286;
          const viewportWidth = viewport.clientWidth;
          if (cards.length <= 5) {
            spacing = cardWidth + 24;
            return;
          }
          if (viewportWidth <= 640) {
            spacing = Math.min(cardWidth + 24, viewportWidth * .88);
            return;
          }

          const edgeStep = viewportWidth >= 1800 ? 4 : viewportWidth >= 1320 ? 3 : 2.5;
          const edgePeek = cardWidth * .18;
          spacing = Math.min(cardWidth + 24, (viewportWidth / 2 + edgePeek) / edgeStep);
        };

        const renderArc = () => {
          const count = cards.length;
          const compact = count <= 5;
          const mobile = window.innerWidth <= 640;
          const viewportWidth = viewport.clientWidth;
          const visibleRadius = mobile
            ? 1.15
            : viewportWidth >= 1800
              ? 4.15
              : viewportWidth >= 1320
                ? 3.15
                : 2.65;
          const fadeStart = visibleRadius - 1.15;

          cards.forEach((card, cardIndex) => {
            const rawOffset = compact ? cardIndex - (count - 1) / 2 : cardIndex - position;
            const distance = Math.abs(rawOffset);
            const visible = compact || distance <= visibleRadius;
            const staggered = reducedMotion
              ? 1
              : clamp(entryProgress * 1.35 - Math.min(distance, 3) * .11, 0, 1);
            const easedEntry = 1 - Math.pow(1 - staggered, 3);
            const arcY = Math.pow(distance, 1.72) * (mobile ? 18 : 23);
            const rotation = rawOffset * (mobile ? 2.2 : 3.15);
            const finalScale = Math.max(.91, 1 - distance * .018);
            const scale = .84 + (finalScale - .84) * easedEntry;
            const outerProgress = compact ? 0 : clamp((distance - fadeStart) / 1.15, 0, 1);
            const x = rawOffset * spacing * easedEntry;
            const y = (1 - easedEntry) * 72 + arcY * easedEntry;
            const edgeOpacity = 1 - outerProgress * (mobile ? .58 : .48);

            card.style.setProperty("--arc-x", `${x}px`);
            card.style.setProperty("--arc-y", `${y}px`);
            card.style.setProperty("--arc-rotate", `${rotation * easedEntry}deg`);
            card.style.setProperty("--arc-scale", String(scale));
            card.style.setProperty("--arc-opacity", visible ? String(easedEntry * edgeOpacity) : "0");
            card.style.setProperty("--arc-pointer", visible && easedEntry > .96 ? "auto" : "none");
            card.style.zIndex = String(60 - Math.round(distance * 5));
            card.setAttribute("aria-hidden", String(!visible));
          });

          prev.disabled = compact || targetPosition <= .001;
          next.disabled = compact || targetPosition >= maxPosition() - .001;
        };

        const tick = (now) => {
          animationFrame = 0;
          let keepAnimating = false;
          const frameTime = lastTickTime ? Math.min(34, now - lastTickTime) : 16;
          lastTickTime = now;

          if (entryStart) {
            entryProgress = reducedMotion ? 1 : clamp((now - entryStart) / 1500, 0, 1);
            if (entryProgress < 1) keepAnimating = true;
            else entryStart = 0;
          }

          if (!isDragging) {
            const delta = targetPosition - position;
            const easing = 1 - Math.exp(-frameTime / 280);
            position = clamp(position + delta * easing, 0, maxPosition());
            if (Math.abs(delta) > .0005) {
              keepAnimating = true;
            } else {
              position = targetPosition;
            }
          }

          renderArc();
          if (keepAnimating) {
            animationFrame = requestAnimationFrame(tick);
          } else {
            lastTickTime = 0;
          }
        };

        const ensureAnimation = () => {
          if (!animationFrame) animationFrame = requestAnimationFrame(tick);
        };

        const startEntry = () => {
          entryProgress = reducedMotion ? 1 : 0;
          entryStart = reducedMotion ? 0 : performance.now();
          ensureAnimation();
        };

        const renderCards = () => {
          track.innerHTML = visibleTools.map((tool, toolIndex) => {
            const meta = metadata[tool.title] || { category: "other", art: "convert-pdf.webp" };
            const imagePriority = toolIndex < 9 ? "high" : "auto";
            const is3D = meta.category === "3d-conversion";
            const artMarkup = is3D
              ? `<div class="lab-tool-art lab-tool-art--gradient" style="--art-gradient: ${meta.gradient}">
                  <span class="lab-tool-format">${meta.input}</span>
                  <span class="lab-tool-format-arrow" aria-hidden="true">→</span>
                  <span class="lab-tool-format lab-tool-format--multi">${(meta.outputs || []).join("/")}</span>
                </div>`
              : `<div class="lab-tool-art">
                  <img
                    src="images/tool-covers-v4/${meta.art}"
                    alt=""
                    width="640"
                    height="480"
                    loading="eager"
                    decoding="sync"
                    fetchpriority="${imagePriority}"
                    draggable="false"
                  />
                </div>`;
            return `
              <article class="lab-tool-card${is3D ? " lab-tool-card--3d" : ""}" data-category="${meta.category}" data-tool-title-source="${tool.title}">
                ${artMarkup}
                <div class="lab-tool-copy">
                  <h3 data-i18n-key="${tool.title}">${tool.title}</h3>
                  <p data-i18n-key="${tool.desc}">${tool.desc}</p>
                  <a class="lab-tool-link" href="${toolHref(tool.title)}" aria-label="Open ${tool.title}">
                    <span data-i18n-key="Try this tool">Try this tool</span>
                    <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </article>
            `;
          }).join("");
          cards = Array.from(track.querySelectorAll(".lab-tool-card"));
          window.wpsApplyLanguageTo?.(track);
          const initialPosition = visibleTools.length > 5 ? Math.min(2, maxPosition()) : 0;
          position = initialPosition;
          targetPosition = initialPosition;
          lastTickTime = 0;
          measureSpacing();
          entryProgress = sectionIsVisible ? 0 : entryProgress;
          renderArc();
          if (sectionIsVisible) startEntry();
        };

        const getPageStep = () => {
          if (!cards.length || visibleTools.length <= 5) return 1;
          measureSpacing();
          const viewportWidth = viewport.clientWidth;
          const step = Math.max(1, Math.floor(viewportWidth / spacing));
          return Math.min(step, maxPosition() + 1);
        };

        const move = (direction) => {
          if (visibleTools.length <= 5) return;
          const step = getPageStep();
          targetPosition = clamp(targetPosition + direction * step, 0, maxPosition());
          ensureAnimation();
        };

        prev.addEventListener("click", () => move(-1));
        next.addEventListener("click", () => move(1));

        filters.forEach((button) => {
          button.addEventListener("click", () => {
            currentFilter = button.dataset.toolFilter;
            filters.forEach((item) => {
              const active = item === button;
              item.classList.toggle("is-active", active);
              item.setAttribute("aria-pressed", String(active));
            });
            visibleTools = currentFilter === "all"
              ? carouselTools
              : currentFilter === "3d-conversion"
                ? tools3D
                : carouselTools.filter((tool) => metadata[tool.title]?.category === currentFilter);
            renderCards();
          });
        });

        viewport.addEventListener("wheel", (event) => {
          if (visibleTools.length <= 5) return;
          const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) * .55;
          if (!horizontalIntent && !event.shiftKey) return;
          event.preventDefault();
          const rawDelta = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
          const normalizedDelta = event.deltaMode === 1 ? rawDelta * 16 : rawDelta;
          targetPosition = clamp(targetPosition + normalizedDelta / spacing, 0, maxPosition());
          ensureAnimation();
        }, { passive: false });

        viewport.addEventListener("pointerdown", (event) => {
          if (visibleTools.length <= 5 || (event.pointerType === "mouse" && event.button !== 0)) return;
          isDragging = true;
          didDrag = false;
          dragStartX = event.clientX;
          dragStartPosition = position;
          dragLastX = event.clientX;
          dragLastTime = performance.now();
          dragVelocity = 0;
          targetPosition = position;
          lastTickTime = 0;
          viewport.classList.add("is-dragging");
          viewport.setPointerCapture(event.pointerId);
        });

        viewport.addEventListener("pointermove", (event) => {
          if (!isDragging) return;
          const delta = event.clientX - dragStartX;
          const now = performance.now();
          const frameDelta = event.clientX - dragLastX;
          const frameTime = Math.max(8, now - dragLastTime);
          if (Math.abs(delta) > 4) didDrag = true;
          dragVelocity = dragVelocity * .7 + (-frameDelta / spacing) * (16 / frameTime) * .3;
          dragLastX = event.clientX;
          dragLastTime = now;
          position = clamp(dragStartPosition - delta / spacing, 0, maxPosition());
          targetPosition = position;
          renderArc();
        });

        const finishDrag = (event) => {
          if (!isDragging) return;
          isDragging = false;
          viewport.classList.remove("is-dragging");
          if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
          targetPosition = clamp(position + dragVelocity * 5, 0, maxPosition());
          ensureAnimation();
        };

        viewport.addEventListener("pointerup", finishDrag);
        viewport.addEventListener("pointercancel", finishDrag);
        viewport.addEventListener("click", (event) => {
          if (!didDrag) return;
          event.preventDefault();
          event.stopPropagation();
          didDrag = false;
        }, true);

        const entryObserver = new IntersectionObserver((entries) => {
          const entry = entries[0];
          sectionIsVisible = entry.isIntersecting;
          if (!entry.isIntersecting || entryHasPlayed) return;
          entryHasPlayed = true;
          startEntry();
        }, { threshold: .18 });
        entryObserver.observe(carousel);

        window.addEventListener("resize", () => {
          measureSpacing();
          renderArc();
        }, { passive: true });
        renderCards();
      }

      initToolCarousel();

      document.querySelectorAll("[data-testimonial-tab]").forEach((tab) => {
        tab.addEventListener("click", () => {
          document.querySelectorAll("[data-testimonial-tab]").forEach((item) => {
            const active = item === tab;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-selected", String(active));
          });
        });
      });

      mobileButton.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("is-open");
        document.body.classList.toggle("is-menu-open", isOpen);
        mobileButton.setAttribute("aria-expanded", String(isOpen));
        mobileButton.querySelector(".material-symbols-rounded").textContent = isOpen ? "close" : "menu";
      });

      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          const filter = link.dataset.toolFilterLink;
          if (filter) {
            const filterButton = document.querySelector(`[data-tool-filter="${filter}"]`);
            filterButton?.click();
          }
          mobileMenu.classList.remove("is-open");
          document.body.classList.remove("is-menu-open");
          mobileButton.setAttribute("aria-expanded", "false");
          mobileButton.querySelector(".material-symbols-rounded").textContent = "menu";
        });
      });

      document.querySelectorAll(".nav-item").forEach((item) => {
        const trigger = item.querySelector(".nav-trigger");
        if (!trigger) return;
        const desktopMenu = item.querySelector(".desktop-menu");

        const positionDesktopMenu = () => {
          if (!desktopMenu) return;
          const triggerRect = trigger.getBoundingClientRect();
          const menuWidth = Math.min(1200, window.innerWidth - 48);
          const maxLeft = Math.max(24, window.innerWidth - menuWidth - 24);
          const left = Math.min(Math.max(24, triggerRect.left), maxLeft);
          desktopMenu.style.setProperty("--desktop-menu-left", `${Math.round(left)}px`);
        };

        const setExpanded = (expanded) => {
          if (expanded) positionDesktopMenu();
          item.classList.toggle("is-open", expanded);
          trigger.setAttribute("aria-expanded", String(expanded));
        };

        item.addEventListener("mouseenter", () => setExpanded(true));
        item.addEventListener("mouseleave", () => setExpanded(false));
        item.addEventListener("focusin", () => setExpanded(true));
        item.addEventListener("focusout", (event) => {
          if (!item.contains(event.relatedTarget)) setExpanded(false);
        });
        trigger.addEventListener("click", () => setExpanded(!item.classList.contains("is-open")));
        item.querySelectorAll(".nav-menu-link").forEach((link) => {
          link.addEventListener("click", () => {
            setExpanded(false);
            link.blur();
            trigger.blur();
          });
        });
        window.addEventListener("resize", () => {
          if (item.classList.contains("is-open")) positionDesktopMenu();
        });
      });

      function initButtonAnimations() {
        document.querySelectorAll(".btn, .pill").forEach((button) => {
          const textSpan = Array.from(button.children).find((child) => {
            return child.tagName === "SPAN" && !child.classList.contains("btn-icon");
          });

          if (!textSpan || textSpan.classList.contains("btn-text")) return;

          const label = textSpan.textContent.trim();
          textSpan.classList.add("btn-text");
          textSpan.textContent = "";

          const roll = document.createElement("span");
          roll.className = "btn-roll";

          for (let index = 0; index < 2; index += 1) {
            const line = document.createElement("span");
            line.className = "btn-roll-line";
            line.textContent = label;
            roll.appendChild(line);
          }

          textSpan.appendChild(roll);
        });

        document.querySelectorAll(".btn-icon img").forEach((icon) => {
          const src = icon.getAttribute("src") || "";
          const isArrowIcon = src.includes("arrow-up-right.svg");
          const isDownIcon = src.includes("down.svg");

          if (!isArrowIcon && !isDownIcon) return;

          const iconWrap = icon.closest(".btn-icon");
          if (!iconWrap || iconWrap.classList.contains("arrow-roll") || iconWrap.classList.contains("down-roll")) return;

          if (isDownIcon) {
            const spin = document.createElement("span");
            const clone = icon.cloneNode(true);
            spin.className = "down-spin";
            clone.classList.add("btn-icon-clone");
            clone.setAttribute("aria-hidden", "true");
            iconWrap.classList.add("down-roll");
            iconWrap.appendChild(spin);
            spin.appendChild(icon);
            spin.appendChild(clone);
            return;
          }

          const clone = icon.cloneNode(true);
          clone.classList.add("btn-icon-clone");
          clone.setAttribute("aria-hidden", "true");
          iconWrap.classList.add("is-preparing");
          iconWrap.classList.add("arrow-roll");
          iconWrap.appendChild(clone);
          requestAnimationFrame(() => {
            iconWrap.classList.remove("is-preparing");
          });
        });
      }

      initButtonAnimations();

      const WPS_DOWNLOAD_URLS = {
        windows: "https://wdl1.pcfg.cache.wpscdn.com/wpsdl/wpsoffice/onlinesetup/distsrc/200.1021/wpsinst/wps_office_inst.exe",
        mac: "https://wdl1.pcfg.cache.wpscdn.com/wpsdl/macwpsoffice/download/installer/WPS_Office_Installer_0024.31300027.zip",
        "linux-deb": "https://wdl1.pcfg.cache.wpscdn.com/wpsdl/wpsoffice/download/linux/11691/wps-office_11.1.0.11691.XA_amd64.deb",
        "linux-rpm": "https://wdl1.pcfg.cache.wpscdn.com/wpsdl/wpsoffice/download/linux/11691/wps-office-11.1.0.11691.XA-1.x86_64.rpm",
        android: "https://play.google.com/store/apps/details?id=cn.wps.moffice_eng&referrer=utm_source%3Dseo_com_pdf%26utm_medium%3D{cid}%26source%3Dseo_com_pdf",
        ios: "https://wpsoffice.onelink.me/Z13H/ikut3iwr"
      };

      function detectWpsPlatform() {
        const ua = navigator.userAgent || "";
        if (/android/i.test(ua)) return "android";
        if (/(iPad|iPhone|iPod)/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
        if (/Win/i.test(ua) || /Windows/i.test(navigator.platform || "")) return "windows";
        if (/Mac/i.test(ua) || /Macintosh/i.test(navigator.platform || "")) return "mac";
        if (/Linux/i.test(ua) || /Linux/i.test(navigator.platform || "")) return "linux-deb";
        return "windows";
      }

      function openWpsDownload(platform) {
        const resolved = platform === "auto" ? detectWpsPlatform() : platform;
        if (resolved === "windows" && window.__WPSdownloader?.download) {
          window.__WPSdownloader.download();
          return;
        }
        const url = WPS_DOWNLOAD_URLS[resolved];
        if (!url) return;
        const cid = Date.now().toString(36);
        window.open(url.replace("{cid}", cid), "_blank", "noopener,noreferrer");
      }

      function initWpsDownloads() {
        document.querySelectorAll("[data-wps-download]").forEach((trigger) => {
          trigger.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openWpsDownload(trigger.dataset.wpsDownload || "auto");
          });
        });
      }

      initWpsDownloads();

      document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");
        if (!link) return;
        if (link.hasAttribute("data-wps-download")) return;
        const href = link.getAttribute("href");
        if (!href) return;
        if (/^https?:\/\//i.test(href)) return;
        if (href === "#") {
          event.preventDefault();
          return;
        }
        if (href.startsWith("#") && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, true);

      document.querySelectorAll(".faq-item").forEach((item) => {
        const button = item.querySelector(".faq-question");
        if (!button) return;

        button.addEventListener("click", () => {
          const isOpen = item.classList.toggle("is-open");
          button.setAttribute("aria-expanded", String(isOpen));
        });
      });

      function closeDownloadDropdowns() {
        document.querySelectorAll(".dropdown").forEach((menu) => menu.classList.remove("is-open"));
        document.querySelectorAll("[data-dropdown-toggle]").forEach((button) => button.setAttribute("aria-expanded", "false"));
      }

      document.querySelectorAll("[data-dropdown-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
          const menu = document.getElementById(button.dataset.dropdownToggle);
          if (!menu) return;
          const isOpen = menu.classList.toggle("is-open");
          button.setAttribute("aria-expanded", String(isOpen));
          if (isOpen) {
            const card = button.closest(".download-card");
            const cards = button.closest(".download-cards");
            if (card && cards) {
              const cardRect = card.getBoundingClientRect();
              const cardsRect = cards.getBoundingClientRect();
              menu.style.setProperty("--dropdown-left", `${cardRect.left - cardsRect.left + 24}px`);
              menu.style.setProperty("--dropdown-top", `${cardRect.bottom - cardsRect.top - 18}px`);
            }
          }
          document.querySelectorAll(".dropdown").forEach((other) => {
            if (other !== menu) other.classList.remove("is-open");
          });
          document.querySelectorAll("[data-dropdown-toggle]").forEach((otherButton) => {
            if (otherButton !== button) otherButton.setAttribute("aria-expanded", "false");
          });
        });
      });

      document.querySelector(".download-cards")?.addEventListener("pointerleave", closeDownloadDropdowns);

      const languagePicker = document.querySelector(".language-picker");
      const languageButton = languagePicker?.querySelector(".language");
      const headerLanguagePicker = document.querySelector(".header-language-picker");
      const headerLanguageButton = headerLanguagePicker?.querySelector(".header-language-button");
      const headerLanguageMenu = headerLanguagePicker?.querySelector(".header-language-menu");
      const footerLanguageMenu = languagePicker?.querySelector(".language-menu");
      const languageOptions = [
        ["en", "English"],
        ["de", "Deutsch"],
        ["nl", "Nederlands"],
        ["fi", "Suomi"],
        ["ru", "Русский"],
        ["zh-tw", "繁體中文"],
        ["es", "Español"],
        ["pl", "Polski"],
        ["sv", "Svenska"],
        ["uk", "Українська"],
        ["id", "Bahasa Indonesia"],
        ["fr", "Français"],
        ["pt", "Português"],
        ["vi", "Tiếng Việt"],
        ["he", "עברית"],
        ["nb", "Bokmål"],
        ["hr", "Hrvatski"],
        ["ro", "Română"],
        ["tr", "Türkçe"],
        ["ar", "العربية"],
        ["cs", "Čeština"],
        ["it", "Italiano"],
        ["sk", "Slovenčina"],
        ["el", "Ελληνικά"],
        ["th", "ไทย"],
        ["da", "Dansk"],
        ["hu", "Magyar"],
        ["sr", "Srpski"],
        ["bg", "Български"],
        ["ko", "한국어"],
        ["zh-cn", "简体中文"],
        ["ja", "日本語"]
      ];
      const languageNames = Object.fromEntries(languageOptions);
      const renderLanguageMenus = () => {
        if (headerLanguageMenu) {
          headerLanguageMenu.innerHTML = languageOptions.map(([lang, label]) => {
            const activeClass = lang === "en" ? " class=\"is-active\"" : "";
            return `<a${activeClass} href="#" role="menuitem" data-lang="${lang}">${label}</a>`;
          }).join("");
        }
        if (footerLanguageMenu) {
          footerLanguageMenu.innerHTML = languageOptions.map(([lang, label]) => {
            const activeClass = lang === "en" ? " class=\"is-active\"" : "";
            return `<li><a${activeClass} href="#" data-lang="${lang}">${label}</a></li>`;
          }).join("");
        }
      };
      renderLanguageMenus();
      const i18n = Object.fromEntries(Object.keys(languageNames).filter((lang) => lang !== "en").map((lang) => [lang, {}]));
      let activeLanguage = "en";
      const addTranslation = (source, values) => {
        Object.entries(values).forEach(([lang, text]) => {
          if (i18n[lang]) i18n[lang][source] = text;
        });
      };

      [
        ["WPS PDF Tools", { de: "WPS PDF Tools", fr: "Outils WPS PDF", es: "Herramientas WPS PDF", pt: "Ferramentas WPS PDF", it: "Strumenti WPS PDF", ja: "WPS PDF ツール", ko: "WPS PDF 도구", "zh-cn": "WPS PDF 工具", "zh-tw": "WPS PDF 工具" }],
        ["Tools", { de: "Werkzeuge", fr: "Outils", es: "Herramientas", pt: "Ferramentas", it: "Strumenti", ja: "ツール", ko: "도구", "zh-cn": "工具", "zh-tw": "工具" }],
        ["3D Conversion", { de: "3D-Konvertierung", fr: "Conversion 3D", es: "Conversión 3D", pt: "Conversão 3D", it: "Conversione 3D", ja: "3D 変換", ko: "3D 변환", "zh-cn": "3D 格式转换", "zh-tw": "3D 格式轉換" }],
        ["Why Choose WPS PDF?", { de: "Warum WPS PDF?", fr: "Pourquoi WPS PDF ?", es: "¿Por qué WPS PDF?", pt: "Por que WPS PDF?", it: "Perché WPS PDF?", ja: "WPS PDF が選ばれる理由", ko: "WPS PDF를 선택하는 이유", "zh-cn": "为何选择 WPS PDF？", "zh-tw": "為何選擇 WPS PDF？" }],
        ["All online Tools", { de: "Alle Online-Tools", fr: "Tous les outils en ligne", es: "Todas las herramientas en línea", pt: "Todas as ferramentas online", it: "Tutti gli strumenti online", ja: "オンラインツール一覧", ko: "모든 온라인 도구", "zh-cn": "全部在线工具", "zh-tw": "全部線上工具" }],
        ["Desktop", { de: "Desktop", fr: "Bureau", es: "Escritorio", pt: "Desktop", it: "Desktop", ja: "デスクトップ", ko: "데스크톱", "zh-cn": "桌面端", "zh-tw": "桌面版" }],
        ["Blog", { de: "Blog", fr: "Blog", es: "Blog", pt: "Blog", it: "Blog", ja: "ブログ", ko: "블로그", "zh-cn": "博客", "zh-tw": "部落格" }],
        ["Pricing", { de: "Preise", fr: "Tarifs", es: "Precios", pt: "Preços", it: "Prezzi", ja: "料金", ko: "요금", "zh-cn": "价格", "zh-tw": "價格" }],
        ["PDF Extension", { de: "PDF-Erweiterung", fr: "Extension PDF", es: "Extensión PDF", pt: "Extensão PDF", it: "Estensione PDF", ja: "PDF 拡張機能", ko: "PDF 확장 프로그램", "zh-cn": "PDF 扩展", "zh-tw": "PDF 擴充功能" }],
        ["login", { de: "Anmelden", fr: "Connexion", es: "Iniciar sesión", pt: "Entrar", it: "Accedi", ja: "ログイン", ko: "로그인", "zh-cn": "登录", "zh-tw": "登入" }],
        ["Free Download", { de: "Kostenlos herunterladen", fr: "Téléchargement gratuit", es: "Descarga gratis", pt: "Download grátis", it: "Download gratuito", ja: "無料ダウンロード", ko: "무료 다운로드", "zh-cn": "免费下载", "zh-tw": "免費下載" }],
        ["Convert & Compress", { de: "Konvertieren & Komprimieren", fr: "Convertir et compresser", es: "Convertir y comprimir", pt: "Converter e compactar", it: "Converti e comprimi", ja: "変換と圧縮", ko: "변환 및 압축", "zh-cn": "转换与压缩", "zh-tw": "轉換與壓縮" }],
        ["Split & Merge", { de: "Teilen & Zusammenführen", fr: "Diviser et fusionner", es: "Dividir y unir", pt: "Dividir e mesclar", it: "Dividi e unisci", ja: "分割と結合", ko: "분할 및 병합", "zh-cn": "拆分与合并", "zh-tw": "分割與合併" }],
        ["Sign & Organize", { de: "Signieren & Organisieren", fr: "Signer et organiser", es: "Firmar y organizar", pt: "Assinar e organizar", it: "Firma e organizza", ja: "署名と整理", ko: "서명 및 정리", "zh-cn": "签署与整理", "zh-tw": "簽署與整理" }],
        ["Convert from PDF", { de: "Aus PDF konvertieren", fr: "Convertir depuis PDF", es: "Convertir desde PDF", pt: "Converter de PDF", it: "Converti da PDF", ja: "PDF から変換", ko: "PDF에서 변환", "zh-cn": "从 PDF 转换", "zh-tw": "從 PDF 轉換" }],
        ["Convert to PDF", { de: "In PDF konvertieren", fr: "Convertir en PDF", es: "Convertir a PDF", pt: "Converter para PDF", it: "Converti in PDF", ja: "PDF に変換", ko: "PDF로 변환", "zh-cn": "转换为 PDF", "zh-tw": "轉換為 PDF" }],
        ["Educational Users", { de: "Bildungsnutzer", fr: "Utilisateurs éducatifs", es: "Usuarios educativos", pt: "Usuários educacionais", it: "Utenti didattici", ja: "教育ユーザー", ko: "교육 사용자", "zh-cn": "教育用户", "zh-tw": "教育用戶" }],
        ["Personal Users", { de: "Privatnutzer", fr: "Utilisateurs personnels", es: "Usuarios personales", pt: "Usuários pessoais", it: "Utenti personali", ja: "個人ユーザー", ko: "개인 사용자", "zh-cn": "个人用户", "zh-tw": "個人用戶" }],
        ["Professional Users", { de: "Professionelle Nutzer", fr: "Utilisateurs professionnels", es: "Usuarios profesionales", pt: "Usuários profissionais", it: "Utenti professionali", ja: "プロユーザー", ko: "전문 사용자", "zh-cn": "专业用户", "zh-tw": "專業用戶" }]
      ].forEach(([source, values]) => addTranslation(source, values));

      [
        ["Online PDF toolkit", { de: "Online-PDF-Werkzeuge", fr: "Boîte à outils PDF en ligne", es: "Kit de herramientas PDF online", pt: "Kit de ferramentas PDF online", it: "Kit di strumenti PDF online", ja: "オンライン PDF ツールキット", ko: "온라인 PDF 도구 모음", "zh-cn": "在线 PDF 工具箱", "zh-tw": "線上 PDF 工具箱" }],
        ["Smart PDF tools with", { de: "Intelligente PDF-Werkzeuge mit", fr: "Des outils PDF intelligents à", es: "Herramientas PDF inteligentes con", pt: "Ferramentas PDF inteligentes com", it: "Strumenti PDF intelligenti con", ja: "スマートな PDF ツールで", ko: "스마트 PDF 도구로", "zh-cn": "智能 PDF 工具，带来", "zh-tw": "智慧 PDF 工具，帶來" }],
        ["real impact.", { de: "echter Wirkung.", fr: "impact réel.", es: "impacto real.", pt: "impacto real.", it: "un impatto reale.", ja: "確かな成果を。", ko: "확실한 변화를.", "zh-cn": "真正的效率提升。", "zh-tw": "真正的效率提升。" }],
        ["Best online PDF editor, converter, merger, form filler and organizer for easy editing page, text or layout on PDF documents like Word for FREE in seconds.", { de: "Der beste kostenlose Online-PDF-Editor, Konverter, Zusammenführer, Formularausfüller und Organizer – Seiten, Text und Layout in Sekunden wie in Word bearbeiten.", fr: "Le meilleur éditeur, convertisseur, outil de fusion, remplisseur de formulaires et organiseur PDF en ligne pour modifier gratuitement pages, texte et mise en page en quelques secondes.", es: "El mejor editor, convertidor, combinador, rellenador de formularios y organizador de PDF online para editar gratis páginas, texto y diseño en segundos.", pt: "O melhor editor, conversor, combinador, preenchedor de formulários e organizador de PDF online para editar páginas, texto e layout grátis em segundos.", it: "Il miglior editor, convertitore, strumento di unione, compilatore di moduli e organizzatore PDF online per modificare gratis pagine, testo e layout in pochi secondi.", ja: "ページ、テキスト、レイアウトを Word のようにすばやく無料編集できる、オンライン PDF 編集・変換・結合・フォーム入力・整理ツールです。", ko: "페이지, 텍스트, 레이아웃을 Word처럼 몇 초 만에 무료로 편집하는 온라인 PDF 편집, 변환, 병합, 양식 작성 및 정리 도구입니다.", "zh-cn": "在线完成 PDF 编辑、转换、合并、表单填写与页面整理，像使用 Word 一样轻松修改页面、文字和版式，快速且免费。", "zh-tw": "線上完成 PDF 編輯、轉換、合併、表單填寫與頁面整理，像使用 Word 一樣輕鬆修改頁面、文字和版面，快速且免費。" }],
        ["All tools", { de: "Alle Werkzeuge", fr: "Tous les outils", es: "Todas las herramientas", pt: "Todas as ferramentas", it: "Tutti gli strumenti", ja: "すべてのツール", ko: "모든 도구", "zh-cn": "全部工具", "zh-tw": "全部工具" }],
        ["Other Conversion", { de: "Weitere Konvertierungen", fr: "Autres conversions", es: "Otras conversiones", pt: "Outras conversões", it: "Altre conversioni", ja: "その他の変換", ko: "기타 변환", "zh-cn": "其他转换", "zh-tw": "其他轉換" }],
        ["3D Conversion", { de: "3D-Konvertierung", fr: "Conversion 3D", es: "Conversión 3D", pt: "Conversão 3D", it: "Conversione 3D", ja: "3D 変換", ko: "3D 변환", "zh-cn": "3D 格式转换", "zh-tw": "3D 格式轉換" }],
        ["Try this tool", { de: "Dieses Tool testen", fr: "Essayer cet outil", es: "Probar esta herramienta", pt: "Testar esta ferramenta", it: "Prova questo strumento", ja: "このツールを試す", ko: "이 도구 사용하기", "zh-cn": "试用此工具", "zh-tw": "試用此工具" }],
        ["Filter PDF tools", { de: "PDF-Werkzeuge filtern", fr: "Filtrer les outils PDF", es: "Filtrar herramientas PDF", pt: "Filtrar ferramentas PDF", it: "Filtra gli strumenti PDF", ja: "PDF ツールを絞り込む", ko: "PDF 도구 필터", "zh-cn": "筛选 PDF 工具", "zh-tw": "篩選 PDF 工具" }],
        ["Tool carousel navigation", { de: "Navigation im Werkzeug-Karussell", fr: "Navigation du carrousel d’outils", es: "Navegación del carrusel de herramientas", pt: "Navegação do carrossel de ferramentas", it: "Navigazione del carosello strumenti", ja: "ツールカルーセルのナビゲーション", ko: "도구 캐러셀 탐색", "zh-cn": "工具轮播导航", "zh-tw": "工具輪播導覽" }],
        ["Previous tools", { de: "Vorherige Werkzeuge", fr: "Outils précédents", es: "Herramientas anteriores", pt: "Ferramentas anteriores", it: "Strumenti precedenti", ja: "前のツール", ko: "이전 도구", "zh-cn": "上一组工具", "zh-tw": "上一組工具" }],
        ["Next tools", { de: "Nächste Werkzeuge", fr: "Outils suivants", es: "Herramientas siguientes", pt: "Próximas ferramentas", it: "Strumenti successivi", ja: "次のツール", ko: "다음 도구", "zh-cn": "下一组工具", "zh-tw": "下一組工具" }],
        ["Open", { de: "Öffnen", fr: "Ouvrir", es: "Abrir", pt: "Abrir", it: "Apri", ja: "開く", ko: "열기", "zh-cn": "打开", "zh-tw": "開啟" }]
      ].forEach(([source, values]) => addTranslation(source, values));

      [
        ["Convert PDF files to editable Word documents in seconds (doc, docx formats)", { de: "PDF-Dateien in Sekunden in bearbeitbare Word-Dokumente umwandeln (doc, docx)", fr: "Convertissez des PDF en documents Word modifiables en quelques secondes (doc, docx)", es: "Convierte PDF en documentos Word editables en segundos (doc, docx)", pt: "Converta PDFs em documentos Word editáveis em segundos (doc, docx)", it: "Converti PDF in documenti Word modificabili in pochi secondi (doc, docx)", ja: "PDF を数秒で編集可能な Word 文書（doc、docx）に変換", ko: "PDF를 몇 초 만에 편집 가능한 Word 문서(doc, docx)로 변환", "zh-cn": "数秒内将 PDF 转换为可编辑的 Word 文档（doc、docx 格式）", "zh-tw": "數秒內將 PDF 轉換為可編輯的 Word 文件（doc、docx 格式）" }],
        ["WPS PDF Tools to PPT can convert PDF to editable PPT or PPTX slideshows. No watermarks, just converting PDF to PowerPoint in seconds.", { de: "WPS PDF Tools to PPT wandelt PDF-Dateien ohne Wasserzeichen in bearbeitbare PPT- oder PPTX-Präsentationen um.", fr: "WPS PDF Tools to PPT convertit les PDF en présentations PPT ou PPTX modifiables, sans filigrane.", es: "WPS PDF Tools to PPT convierte PDF en presentaciones PPT o PPTX editables, sin marcas de agua.", pt: "WPS PDF Tools to PPT converte PDFs em apresentações PPT ou PPTX editáveis, sem marcas d’água.", it: "WPS PDF Tools to PPT converte PDF in presentazioni PPT o PPTX modificabili, senza filigrane.", ja: "WPS PDF Tools to PPT は PDF を透かしなしで編集可能な PPT/PPTX スライドに変換します。", ko: "WPS PDF Tools to PPT는 PDF를 워터마크 없이 편집 가능한 PPT/PPTX 슬라이드로 변환합니다.", "zh-cn": "WPS PDF Tools to PPT 可将 PDF 转换为可编辑的 PPT 或 PPTX 幻灯片，无水印，数秒完成。", "zh-tw": "WPS PDF Tools to PPT 可將 PDF 轉換為可編輯的 PPT 或 PPTX 簡報，無浮水印，數秒完成。" }],
        ["Convert Word (doc, docx) files to easy-to-share PDF files while preserving the layout for free", { de: "Word-Dateien (doc, docx) kostenlos in leicht teilbare PDF-Dateien umwandeln und das Layout beibehalten", fr: "Convertissez gratuitement des fichiers Word (doc, docx) en PDF faciles à partager tout en conservant la mise en page", es: "Convierte gratis archivos Word (doc, docx) a PDF fáciles de compartir conservando el diseño", pt: "Converta grátis arquivos Word (doc, docx) em PDFs fáceis de compartilhar mantendo o layout", it: "Converti gratis file Word (doc, docx) in PDF facili da condividere mantenendo il layout", ja: "Word（doc、docx）をレイアウトを保ったまま共有しやすい PDF に無料変換", ko: "Word(doc, docx) 파일을 레이아웃 그대로 공유하기 쉬운 PDF로 무료 변환", "zh-cn": "免费将 Word（doc、docx）文件转换为便于分享的 PDF，并保留原排版", "zh-tw": "免費將 Word（doc、docx）檔案轉換為便於分享的 PDF，並保留原版面" }],
        ["Convert Excel spreadsheets (xls, xlsx) to easy-to-read PDF files for free", { de: "Excel-Tabellen (xls, xlsx) kostenlos in gut lesbare PDF-Dateien umwandeln", fr: "Convertissez gratuitement des feuilles Excel (xls, xlsx) en fichiers PDF faciles à lire", es: "Convierte gratis hojas de Excel (xls, xlsx) a archivos PDF fáciles de leer", pt: "Converta grátis planilhas Excel (xls, xlsx) em arquivos PDF fáceis de ler", it: "Converti gratis fogli Excel (xls, xlsx) in PDF facili da leggere", ja: "Excel（xls、xlsx）を読みやすい PDF に無料変換", ko: "Excel 스프레드시트(xls, xlsx)를 읽기 쉬운 PDF로 무료 변환", "zh-cn": "免费将 Excel 表格（xls、xlsx）转换为易读的 PDF 文件", "zh-tw": "免費將 Excel 試算表（xls、xlsx）轉換為易讀的 PDF 檔案" }],
        ["Convert PowerPoint presentations (ppt, pptx) to easy-to-view and easy-to-share PDF files for free", { de: "PowerPoint-Präsentationen (ppt, pptx) kostenlos in leicht lesbare und teilbare PDF-Dateien umwandeln", fr: "Convertissez gratuitement des présentations PowerPoint (ppt, pptx) en PDF faciles à consulter et partager", es: "Convierte gratis presentaciones PowerPoint (ppt, pptx) a PDF fáciles de ver y compartir", pt: "Converta grátis apresentações PowerPoint (ppt, pptx) em PDFs fáceis de visualizar e compartilhar", it: "Converti gratis presentazioni PowerPoint (ppt, pptx) in PDF facili da vedere e condividere", ja: "PowerPoint（ppt、pptx）を閲覧・共有しやすい PDF に無料変換", ko: "PowerPoint 프레젠테이션(ppt, pptx)을 보기 쉽고 공유하기 쉬운 PDF로 무료 변환", "zh-cn": "免费将 PowerPoint 演示文稿（ppt、pptx）转换为便于查看和分享的 PDF 文件", "zh-tw": "免費將 PowerPoint 簡報（ppt、pptx）轉換為便於檢視和分享的 PDF 檔案" }],
        ["Convert images (JPG, JPEG, PNG, BMP) to PDF files for free and easily adjust PDF orientation and margins", { de: "Bilder (JPG, JPEG, PNG, BMP) kostenlos in PDF umwandeln und Ausrichtung sowie Ränder einfach anpassen", fr: "Convertissez gratuitement des images (JPG, JPEG, PNG, BMP) en PDF et ajustez facilement l’orientation et les marges", es: "Convierte gratis imágenes (JPG, JPEG, PNG, BMP) a PDF y ajusta fácilmente la orientación y los márgenes", pt: "Converta grátis imagens (JPG, JPEG, PNG, BMP) em PDF e ajuste facilmente a orientação e as margens", it: "Converti gratis immagini (JPG, JPEG, PNG, BMP) in PDF e regola facilmente orientamento e margini", ja: "画像（JPG、JPEG、PNG、BMP）を無料で PDF に変換し、向きと余白をかんたんに調整", ko: "이미지(JPG, JPEG, PNG, BMP)를 PDF로 무료 변환하고 방향과 여백을 쉽게 조정", "zh-cn": "免费将图片（JPG、JPEG、PNG、BMP）转换为 PDF，并轻松调整方向和边距", "zh-tw": "免費將圖片（JPG、JPEG、PNG、BMP）轉換為 PDF，並輕鬆調整方向和邊距" }],
        ["Convert PDF files to the format you need online in seconds.", { de: "PDF-Dateien online in Sekunden in das gewünschte Format umwandeln.", fr: "Convertissez vos PDF en ligne au format souhaité en quelques secondes.", es: "Convierte PDF online al formato que necesitas en segundos.", pt: "Converta PDFs online para o formato desejado em segundos.", it: "Converti PDF online nel formato che ti serve in pochi secondi.", ja: "PDF を必要な形式にオンラインで数秒変換", ko: "PDF 파일을 필요한 형식으로 몇 초 만에 온라인 변환", "zh-cn": "数秒内在线将 PDF 转换为所需格式。", "zh-tw": "數秒內線上將 PDF 轉換為所需格式。" }],
        ["Manage multiple pages of a PDF file (add, delete, or rearrange pages)", { de: "Mehrere Seiten einer PDF verwalten (hinzufügen, löschen oder neu anordnen)", fr: "Gérez plusieurs pages d’un PDF (ajouter, supprimer ou réorganiser)", es: "Gestiona varias páginas de un PDF (añadir, eliminar o reordenar)", pt: "Gerencie várias páginas de um PDF (adicionar, excluir ou reorganizar)", it: "Gestisci più pagine di un PDF (aggiungi, elimina o riordina)", ja: "PDF の複数ページを管理（追加、削除、並べ替え）", ko: "PDF의 여러 페이지 관리(추가, 삭제 또는 재정렬)", "zh-cn": "管理 PDF 的多个页面（添加、删除或重新排序）", "zh-tw": "管理 PDF 的多個頁面（新增、刪除或重新排序）" }],
        ["Convert XML files (NFE/CTE) to PDF documents online for free", { de: "XML-Dateien (NFE/CTE) kostenlos online in PDF-Dokumente umwandeln", fr: "Convertissez gratuitement des fichiers XML (NFE/CTE) en PDF en ligne", es: "Convierte gratis archivos XML (NFE/CTE) a PDF online", pt: "Converta grátis arquivos XML (NFE/CTE) em PDF online", it: "Converti gratis file XML (NFE/CTE) in PDF online", ja: "XML（NFE/CTE）を無料で PDF 文書にオンライン変換", ko: "XML 파일(NFE/CTE)을 PDF 문서로 무료 온라인 변환", "zh-cn": "免费在线将 XML 文件（NFE/CTE）转换为 PDF 文档", "zh-tw": "免費線上將 XML 檔案（NFE/CTE）轉換為 PDF 文件" }]
      ].forEach(([source, values]) => addTranslation(source, values));

      [
        "Compress PDF", "Convert PDF", "Split PDF", "Merge PDF", "Signing PDF",
        "PDF to Word", "PDF to Excel", "PDF to PPT", "PDF to JPG", "Word to PDF", "Excel to PDF",
        "PPT to PDF", "JPG to PDF", "JPG to Word", "Word to JPG", "XML to PDF",
        "Read PDF", "PDF AI", "Annotate PDF", "Create PDF", "Add Page Numbers to PDF", "Combine PDF",
        "PDF Viewer", "Edit PDF", "Unlock PDF", "Delete Pages from PDF", "Organize PDF", "PDF Filler",
        "eSign PDF", "Protect PDF", "OCR PDF", "Compare PDF", "PDF Tutorials", "PDF Softwares",
        "PDF Download", "PDF Trending", "WPS PDF AI"
      ].forEach((source) => {
        const zh = {
          "Compress PDF": "压缩 PDF", "Convert PDF": "转换 PDF", "Split PDF": "拆分 PDF", "Merge PDF": "合并 PDF",
          "Signing PDF": "签署 PDF", "PDF to Word": "PDF 转 Word", "PDF to Excel": "PDF 转 Excel",
          "PDF to PPT": "PDF 转 PPT", "PDF to JPG": "PDF 转 JPG", "Word to PDF": "Word 转 PDF", "Excel to PDF": "Excel 转 PDF",
          "PPT to PDF": "PPT 转 PDF", "JPG to PDF": "JPG 转 PDF", "JPG to Word": "JPG 转 Word", "Word to JPG": "Word 转 JPG",
          "XML to PDF": "XML 转 PDF", "Read PDF": "阅读 PDF", "PDF AI": "PDF AI",
          "Annotate PDF": "批注 PDF", "Create PDF": "创建 PDF", "Add Page Numbers to PDF": "添加 PDF 页码",
          "Combine PDF": "组合 PDF", "PDF Viewer": "PDF 查看器", "Edit PDF": "编辑 PDF", "Unlock PDF": "解锁 PDF",
          "Delete Pages from PDF": "删除 PDF 页面", "Organize PDF": "整理 PDF", "PDF Filler": "填写 PDF",
          "eSign PDF": "电子签署 PDF", "Protect PDF": "保护 PDF", "OCR PDF": "OCR PDF", "Compare PDF": "比较 PDF",
          "PDF Tutorials": "PDF 教程", "PDF Softwares": "PDF 软件", "PDF Download": "PDF 下载",
          "PDF Trending": "PDF 趋势", "WPS PDF AI": "WPS PDF AI"
        }[source];
        const zht = zh?.replaceAll("压", "壓").replaceAll("转", "轉").replaceAll("签", "簽").replaceAll("创", "創").replaceAll("软", "軟").replaceAll("页", "頁").replaceAll("护", "護").replaceAll("较", "較").replaceAll("击", "擊").replaceAll("载", "載");
        addTranslation(source, {
          de: source.replace(" to ", " zu "),
          fr: source.replace(" to ", " vers "),
          es: source.replace(" to ", " a "),
          pt: source.replace(" to ", " para "),
          it: source.replace(" to ", " in "),
          ja: zh || source,
          ko: zh ? zh.replaceAll("转", "변환").replaceAll("压缩", "압축").replaceAll("合并", "병합").replaceAll("拆分", "분할").replaceAll("签署", "서명").replaceAll("整理", "정리") : source,
          "zh-cn": zh || source,
          "zh-tw": zht || zh || source
        });
      });

      [
        ["NEW", { de: "NEU", nl: "NIEUW", fi: "UUSI", ru: "НОВОЕ", fr: "NOUVEAU", es: "NUEVO", pl: "NOWE", sv: "NY", uk: "НОВЕ", id: "BARU", pt: "NOVO", vi: "MỚI", he: "חדש", nb: "NY", hr: "NOVO", ro: "NOU", tr: "YENİ", ar: "جديد", cs: "NOVÉ", it: "NUOVO", sk: "NOVÉ", el: "ΝΕΟ", th: "ใหม่", da: "NY", hu: "ÚJ", sr: "NOVO", bg: "НОВО", ja: "新規", ko: "신규", "zh-cn": "新", "zh-tw": "新" }],
        ["Convert PDF files to editable Word documents in seconds（doc, docx formats）", { de: "PDF-Dateien in Sekunden in bearbeitbare Word-Dokumente umwandeln (doc, docx)", fr: "Convertissez des PDF en documents Word modifiables en quelques secondes (doc, docx)", es: "Convierte PDF en documentos Word editables en segundos (doc, docx)", pt: "Converta PDFs em documentos Word editáveis em segundos (doc, docx)", it: "Converti PDF in documenti Word modificabili in pochi secondi (doc, docx)", ja: "PDF を数秒で編集可能な Word 文書（doc、docx）に変換", ko: "PDF를 몇 초 만에 편집 가능한 Word 문서(doc, docx)로 변환", "zh-cn": "数秒内将 PDF 转换为可编辑的 Word 文档（doc、docx 格式）", "zh-tw": "數秒內將 PDF 轉換為可編輯的 Word 文件（doc、docx 格式）" }],
        ["Convert PDF files to editable Excel spreadsheets online without downloading any software", { de: "PDFs online ohne Softwaredownload in bearbeitbare Excel-Tabellen umwandeln", fr: "Convertissez des PDF en feuilles Excel modifiables en ligne sans logiciel", es: "Convierte PDF en hojas de cálculo Excel editables online sin descargar software", pt: "Converta PDFs em planilhas Excel editáveis online sem baixar software", it: "Converti PDF in fogli Excel modificabili online senza scaricare software", ja: "ソフト不要で PDF を編集可能な Excel スプレッドシートにオンライン変換", ko: "소프트웨어 설치 없이 PDF를 편집 가능한 Excel 스프레드시트로 온라인 변환", "zh-cn": "无需下载软件，在线将 PDF 转为可编辑的 Excel 表格", "zh-tw": "無需下載軟體，線上將 PDF 轉為可編輯的 Excel 試算表" }],
        ["WPS PDF Tools to PPT can convert PDF to editable PPT or PPTX slideshows. No watermarks, just converting PDF to PowerPoint inseconds.", { de: "WPS PDF Tools to PPT wandelt PDF in bearbeitbare PPT- oder PPTX-Folien um. Ohne Wasserzeichen.", fr: "WPS PDF Tools to PPT convertit les PDF en présentations PPT ou PPTX modifiables. Sans filigrane.", es: "WPS PDF Tools to PPT convierte PDF en presentaciones PPT o PPTX editables. Sin marcas de agua.", pt: "WPS PDF Tools to PPT converte PDFs em apresentações PPT ou PPTX editáveis. Sem marcas d'água.", it: "WPS PDF Tools to PPT converte PDF in presentazioni PPT o PPTX modificabili. Senza filigrane.", ja: "WPS PDF Tools to PPT は PDF を編集可能な PPT/PPTX スライドに変換します。透かしはありません。", ko: "WPS PDF Tools to PPT는 PDF를 편집 가능한 PPT/PPTX 슬라이드로 변환합니다. 워터마크가 없습니다.", "zh-cn": "WPS PDF Tools to PPT 可将 PDF 转换为可编辑的 PPT 或 PPTX 幻灯片。无水印，快速转为 PowerPoint。", "zh-tw": "WPS PDF Tools to PPT 可將 PDF 轉換為可編輯的 PPT 或 PPTX 簡報。無浮水印，快速轉為 PowerPoint。" }],
        ["Convert Word （doc, docx）files to easy-to-share PDF files while preserving the layout for free", { de: "Word-Dateien (doc, docx) kostenlos in layoutgetreue PDF-Dateien umwandeln", fr: "Convertissez gratuitement des fichiers Word (doc, docx) en PDF faciles à partager en conservant la mise en page", es: "Convierte archivos Word (doc, docx) a PDF fáciles de compartir conservando el diseño gratis", pt: "Converta arquivos Word (doc, docx) em PDFs fáceis de compartilhar mantendo o layout grátis", it: "Converti gratis file Word (doc, docx) in PDF facili da condividere mantenendo il layout", ja: "Word（doc、docx）をレイアウトを保ったまま共有しやすい PDF に無料変換", ko: "Word(doc, docx) 파일을 레이아웃 그대로 공유하기 쉬운 PDF로 무료 변환", "zh-cn": "免费将 Word（doc、docx）文件转换为便于分享的 PDF，并保留原排版", "zh-tw": "免費將 Word（doc、docx）檔案轉換為便於分享的 PDF，並保留原排版" }],
        ["Convert Excel spreadsheets（XIs, XIsX） to easy-to-read PDF files for free", { de: "Excel-Tabellen kostenlos in gut lesbare PDF-Dateien umwandeln", fr: "Convertissez gratuitement des feuilles Excel en fichiers PDF faciles à lire", es: "Convierte hojas de cálculo Excel a PDF fáciles de leer gratis", pt: "Converta planilhas Excel em PDFs fáceis de ler grátis", it: "Converti gratis fogli Excel in PDF facili da leggere", ja: "Excel スプレッドシートを読みやすい PDF に無料変換", ko: "Excel 스프레드시트를 읽기 쉬운 PDF로 무료 변환", "zh-cn": "免费将 Excel 表格转换为易读的 PDF 文件", "zh-tw": "免費將 Excel 試算表轉換為易讀的 PDF 檔案" }],
        ["Convert PowerPoint presentations （ppt, Pptx） to easy-to-view and easy-to-share PDF files for free", { de: "PowerPoint-Präsentationen kostenlos in leicht teilbare PDF-Dateien umwandeln", fr: "Convertissez gratuitement des présentations PowerPoint en PDF faciles à consulter et partager", es: "Convierte presentaciones PowerPoint a PDF fáciles de ver y compartir gratis", pt: "Converta apresentações PowerPoint em PDFs fáceis de visualizar e compartilhar grátis", it: "Converti gratis presentazioni PowerPoint in PDF facili da vedere e condividere", ja: "PowerPoint を閲覧・共有しやすい PDF に無料変換", ko: "PowerPoint 프레젠테이션을 보기 쉽고 공유하기 쉬운 PDF로 무료 변환", "zh-cn": "免费将 PowerPoint 演示文稿转换为便于查看和分享的 PDF 文件", "zh-tw": "免費將 PowerPoint 簡報轉換為便於檢視和分享的 PDF 檔案" }],
        ["Convert images （JPG, JPEG，PNG, BMP） to PDF files for free and easily adjust PDF orientation and margins", { de: "Bilder (JPG, JPEG, PNG, BMP) kostenlos in PDF umwandeln und Ausrichtung sowie Ränder anpassen", fr: "Convertissez gratuitement des images (JPG, JPEG, PNG, BMP) en PDF et ajustez orientation et marges", es: "Convierte imágenes (JPG, JPEG, PNG, BMP) a PDF gratis y ajusta orientación y márgenes", pt: "Converta imagens (JPG, JPEG, PNG, BMP) em PDF grátis e ajuste orientação e margens", it: "Converti gratis immagini (JPG, JPEG, PNG, BMP) in PDF e regola orientamento e margini", ja: "画像（JPG、JPEG、PNG、BMP）を無料で PDF に変換し、向きと余白を調整", ko: "이미지(JPG, JPEG, PNG, BMP)를 PDF로 무료 변환하고 방향과 여백을 쉽게 조정", "zh-cn": "免费将图片（JPG、JPEG、PNG、BMP）转换为 PDF，并轻松调整方向和边距", "zh-tw": "免費將圖片（JPG、JPEG、PNG、BMP）轉換為 PDF，並輕鬆調整方向和邊距" }],
        ["Select multiple PDF files and merge them into one PDF file online", { de: "Mehrere PDF-Dateien auswählen und online zu einer PDF zusammenführen", fr: "Sélectionnez plusieurs PDF et fusionnez-les en un seul fichier en ligne", es: "Selecciona varios PDF y únelos en un solo archivo online", pt: "Selecione vários PDFs e mescle em um único arquivo online", it: "Seleziona più PDF e uniscili online in un unico file", ja: "複数の PDF を選択してオンラインで 1 つの PDF に結合", ko: "여러 PDF 파일을 선택해 온라인에서 하나의 PDF로 병합", "zh-cn": "选择多个 PDF 文件，并在线合并为一个 PDF 文件", "zh-tw": "選擇多個 PDF 檔案，並線上合併為一個 PDF 檔案" }],
        ["Separate all pages from a single PDF file online and extract pages to multiple PDF files", { de: "Alle Seiten einer PDF online trennen und in mehrere PDF-Dateien extrahieren", fr: "Séparez toutes les pages d'un PDF en ligne et extrayez-les en plusieurs fichiers", es: "Separa todas las páginas de un PDF online y extráelas en varios archivos", pt: "Separe todas as páginas de um PDF online e extraia em vários arquivos", it: "Separa online tutte le pagine di un PDF ed estraile in più file", ja: "1 つの PDF の全ページをオンラインで分割し、複数の PDF に抽出", ko: "단일 PDF의 모든 페이지를 온라인에서 분리하고 여러 PDF로 추출", "zh-cn": "在线拆分单个 PDF 的所有页面，并提取为多个 PDF 文件", "zh-tw": "線上拆分單個 PDF 的所有頁面，並擷取為多個 PDF 檔案" }],
        ["Reduce the size of PDF files online using 3 compression methods", { de: "PDF-Dateien online mit 3 Komprimierungsmethoden verkleinern", fr: "Réduisez la taille des PDF en ligne avec 3 méthodes de compression", es: "Reduce el tamaño de PDF online con 3 métodos de compresión", pt: "Reduza o tamanho de PDFs online com 3 métodos de compactação", it: "Riduci online le dimensioni dei PDF con 3 metodi di compressione", ja: "3 つの圧縮方法で PDF ファイルサイズをオンライン削減", ko: "3가지 압축 방식으로 PDF 파일 크기를 온라인에서 줄이기", "zh-cn": "使用 3 种压缩方式在线减小 PDF 文件大小", "zh-tw": "使用 3 種壓縮方式線上減小 PDF 檔案大小" }],
        ["Create and fill e-signatures in PDF files online and secure your e-signature", { de: "E-Signaturen in PDF-Dateien online erstellen und ausfüllen", fr: "Créez et remplissez des signatures électroniques dans les PDF en ligne", es: "Crea y rellena firmas electrónicas en PDF online de forma segura", pt: "Crie e preencha assinaturas eletrônicas em PDFs online com segurança", it: "Crea e compila firme elettroniche nei PDF online in sicurezza", ja: "PDF にオンラインで電子署名を作成・入力し、安全に署名", ko: "PDF 파일에 전자 서명을 온라인으로 만들고 입력하며 안전하게 보호", "zh-cn": "在线创建并填写 PDF 电子签名，保护你的签名安全", "zh-tw": "線上建立並填寫 PDF 電子簽名，保護你的簽名安全" }],
        ["Manage multiple pages of a PDF file （add, delete, or rearrange pages）", { de: "Mehrere Seiten einer PDF verwalten (hinzufügen, löschen oder neu anordnen)", fr: "Gérez plusieurs pages d'un PDF (ajouter, supprimer ou réorganiser)", es: "Gestiona páginas de un PDF (añadir, eliminar o reordenar)", pt: "Gerencie páginas de um PDF (adicionar, excluir ou reorganizar)", it: "Gestisci pagine di un PDF (aggiungi, elimina o riordina)", ja: "PDF の複数ページを管理（追加、削除、並べ替え）", ko: "PDF의 여러 페이지 관리(추가, 삭제, 재정렬)", "zh-cn": "管理 PDF 的多个页面（添加、删除或重新排序）", "zh-tw": "管理 PDF 的多個頁面（新增、刪除或重新排序）" }],
        ["Convert HTML files to PDF documents online with perfect formatting and no sign-up required", { de: "HTML-Dateien online ohne Anmeldung mit perfekter Formatierung in PDF umwandeln", fr: "Convertissez des fichiers HTML en PDF en ligne avec une mise en forme parfaite, sans inscription", es: "Convierte HTML a PDF online con formato perfecto y sin registrarte", pt: "Converta HTML em PDF online com formatação perfeita e sem cadastro", it: "Converti HTML in PDF online con formattazione perfetta e senza registrazione", ja: "登録不要で HTML を完璧な書式の PDF にオンライン変換", ko: "가입 없이 HTML 파일을 완벽한 서식의 PDF 문서로 온라인 변환", "zh-cn": "无需注册，在线将 HTML 文件转换为格式完美的 PDF 文档", "zh-tw": "無需註冊，線上將 HTML 檔案轉換為格式完美的 PDF 文件" }],
        ["Convert XML files （NFE/CTE） to PDF documents online for free", { de: "XML-Dateien (NFE/CTE) kostenlos online in PDF-Dokumente umwandeln", fr: "Convertissez gratuitement des fichiers XML (NFE/CTE) en PDF en ligne", es: "Convierte archivos XML (NFE/CTE) a PDF online gratis", pt: "Converta arquivos XML (NFE/CTE) em PDF online grátis", it: "Converti gratis file XML (NFE/CTE) in PDF online", ja: "XML（NFE/CTE）を無料で PDF 文書にオンライン変換", ko: "XML 파일(NFE/CTE)을 PDF 문서로 무료 온라인 변환", "zh-cn": "免费在线将 XML 文件（NFE/CTE）转换为 PDF 文档", "zh-tw": "免費線上將 XML 檔案（NFE/CTE）轉換為 PDF 文件" }],
        ["Convert PDF files to JPG images online with high quality and no sign-up required", { de: "PDF-Dateien online ohne Anmeldung in hochwertige JPG-Bilder umwandeln", fr: "Convertissez des PDF en images JPG de haute qualité en ligne, sans inscription", es: "Convierte PDF a imágenes JPG de alta calidad online sin registrarte", pt: "Converta PDFs em imagens JPG de alta qualidade online sem cadastro", it: "Converti PDF in immagini JPG di alta qualità online senza registrazione", ja: "登録不要で PDF を高品質な JPG 画像にオンライン変換", ko: "가입 없이 PDF 파일을 고품질 JPG 이미지로 온라인 변환", "zh-cn": "无需注册，在线将 PDF 文件转换为高质量 JPG 图片", "zh-tw": "無需註冊，線上將 PDF 檔案轉換為高品質 JPG 圖片" }],
        ["Convert Word documents to JPG images online with high quality and no sign-up required", { de: "Word-Dokumente online ohne Anmeldung in hochwertige JPG-Bilder umwandeln", fr: "Convertissez des documents Word en images JPG de haute qualité en ligne, sans inscription", es: "Convierte Word a imágenes JPG de alta calidad online sin registrarte", pt: "Converta documentos Word em imagens JPG de alta qualidade online sem cadastro", it: "Converti documenti Word in immagini JPG di alta qualità online senza registrazione", ja: "登録不要で Word 文書を高品質な JPG 画像にオンライン変換", ko: "가입 없이 Word 문서를 고품질 JPG 이미지로 온라인 변환", "zh-cn": "无需注册，在线将 Word 文档转换为高质量 JPG 图片", "zh-tw": "無需註冊，線上將 Word 文件轉換為高品質 JPG 圖片" }],
        ["Convert JPG images to editable Word documents online with OCR technology", { de: "JPG-Bilder mit OCR online in bearbeitbare Word-Dokumente umwandeln", fr: "Convertissez des images JPG en documents Word modifiables en ligne avec l'OCR", es: "Convierte imágenes JPG en documentos Word editables online con OCR", pt: "Converta imagens JPG em documentos Word editáveis online com OCR", it: "Converti immagini JPG in documenti Word modificabili online con OCR", ja: "OCR 技術で JPG 画像を編集可能な Word 文書にオンライン変換", ko: "OCR 기술로 JPG 이미지를 편집 가능한 Word 문서로 온라인 변환", "zh-cn": "通过 OCR 技术在线将 JPG 图片转换为可编辑的 Word 文档", "zh-tw": "透過 OCR 技術線上將 JPG 圖片轉換為可編輯的 Word 文件" }]
      ].forEach(([source, values]) => addTranslation(source, values));

      [
        ["Free online PDF tools by", { de: "Kostenlose Online-PDF-Tools von", fr: "Outils PDF en ligne gratuits par", es: "Herramientas PDF online gratis de", pt: "Ferramentas PDF online gratuitas por", it: "Strumenti PDF online gratuiti di", ja: "無料オンライン PDF ツール提供", ko: "무료 온라인 PDF 도구 제공", "zh-cn": "免费在线 PDF 工具来自", "zh-tw": "免費線上 PDF 工具來自" }],
        ["All Your PDF Tools, in One Place.", { de: "Alle PDF-Werkzeuge an einem Ort.", fr: "Tous vos outils PDF au même endroit.", es: "Todas tus herramientas PDF en un solo lugar.", pt: "Todas as suas ferramentas PDF em um só lugar.", it: "Tutti gli strumenti PDF in un unico posto.", ja: "PDF ツールをひとつに集約。", ko: "모든 PDF 도구를 한곳에서.", "zh-cn": "所有 PDF 工具，一站搞定。", "zh-tw": "所有 PDF 工具，一站搞定。" }],
        ["Edit, convert, merge, compress, sign, fill, and organize PDFs with ease. Work seamlessly with PDF, Word, Excel, PPT, and image files--fast, simple, and free.", { de: "PDFs einfach bearbeiten, konvertieren, zusammenführen, komprimieren, signieren, ausfüllen und organisieren. Arbeiten Sie schnell, einfach und kostenlos mit PDF-, Word-, Excel-, PPT- und Bilddateien.", fr: "Modifiez, convertissez, fusionnez, compressez, signez, remplissez et organisez vos PDF facilement. Travaillez avec PDF, Word, Excel, PPT et images rapidement, simplement et gratuitement.", es: "Edita, convierte, une, comprime, firma, rellena y organiza PDF con facilidad. Trabaja con PDF, Word, Excel, PPT e imágenes de forma rápida, sencilla y gratis.", pt: "Edite, converta, mescle, compacte, assine, preencha e organize PDFs com facilidade. Trabalhe com PDF, Word, Excel, PPT e imagens de forma rápida, simples e grátis.", it: "Modifica, converti, unisci, comprimi, firma, compila e organizza PDF con facilità. Lavora con PDF, Word, Excel, PPT e immagini in modo rapido, semplice e gratuito.", ja: "PDF の編集、変換、結合、圧縮、署名、入力、整理をかんたんに。PDF、Word、Excel、PPT、画像ファイルをすばやく無料で扱えます。", ko: "PDF 편집, 변환, 병합, 압축, 서명, 입력, 정리를 쉽게 처리하세요. PDF, Word, Excel, PPT, 이미지 파일을 빠르고 간단하게 무료로 다룰 수 있습니다.", "zh-cn": "轻松编辑、转换、合并、压缩、签署、填写和整理 PDF。快速、简单、免费地处理 PDF、Word、Excel、PPT 和图片文件。", "zh-tw": "輕鬆編輯、轉換、合併、壓縮、簽署、填寫和整理 PDF。快速、簡單、免費地處理 PDF、Word、Excel、PPT 和圖片檔案。" }],
        ["Try a PDF Tool", { de: "PDF-Tool testen", fr: "Essayer un outil PDF", es: "Probar herramienta PDF", pt: "Testar ferramenta PDF", it: "Prova uno strumento PDF", ja: "PDF ツールを試す", ko: "PDF 도구 사용", "zh-cn": "试用 PDF 工具", "zh-tw": "試用 PDF 工具" }],
        ["Download WPS Office", { de: "WPS Office herunterladen", fr: "Télécharger WPS Office", es: "Descargar WPS Office", pt: "Baixar WPS Office", it: "Scarica WPS Office", ja: "WPS Office をダウンロード", ko: "WPS Office 다운로드", "zh-cn": "下载 WPS Office", "zh-tw": "下載 WPS Office" }],
        ["and", { de: "und", fr: "et", es: "y", pt: "e", it: "e", ja: "と", ko: "및", "zh-cn": "和", "zh-tw": "和" }],
        ["Download WPS Office to get more PDF management features such as OCR (image scanning and conversion), adding watermarks and e-signatures, and PDF to image conversion.", { de: "Laden Sie WPS Office herunter, um weitere PDF-Funktionen wie OCR, Wasserzeichen, E-Signaturen und PDF-zu-Bild-Konvertierung zu nutzen.", fr: "Téléchargez WPS Office pour obtenir plus de fonctions PDF comme l'OCR, les filigranes, les signatures électroniques et la conversion PDF en image.", es: "Descarga WPS Office para obtener más funciones PDF como OCR, marcas de agua, firmas electrónicas y conversión de PDF a imagen.", pt: "Baixe o WPS Office para ter mais recursos de PDF, como OCR, marcas d'água, assinaturas eletrônicas e conversão de PDF em imagem.", it: "Scarica WPS Office per ottenere più funzioni PDF come OCR, filigrane, firme elettroniche e conversione da PDF a immagine.", ja: "WPS Office をダウンロードすると、OCR、透かし、電子署名、PDF から画像への変換など、さらに多くの PDF 管理機能を利用できます。", ko: "WPS Office를 다운로드하면 OCR, 워터마크, 전자 서명, PDF 이미지 변환 등 더 많은 PDF 관리 기능을 사용할 수 있습니다.", "zh-cn": "下载 WPS Office，获取 OCR（图片扫描与转换）、添加水印和电子签名、PDF 转图片等更多 PDF 管理功能。", "zh-tw": "下載 WPS Office，取得 OCR（圖片掃描與轉換）、新增浮水印和電子簽名、PDF 轉圖片等更多 PDF 管理功能。" }],
        ["WPS Office for", { de: "WPS Office für", fr: "WPS Office pour", es: "WPS Office para", pt: "WPS Office para", it: "WPS Office per", ja: "WPS Office 対応", ko: "WPS Office 지원", "zh-cn": "WPS Office 适用于", "zh-tw": "WPS Office 適用於" }],
        ["Download WPS Office Desktop Editor to get a lightweight PDF tool that provides complete solutions for all PDF problems.", { de: "Laden Sie den WPS Office Desktop Editor herunter und erhalten Sie ein leichtes PDF-Tool für alle PDF-Aufgaben.", fr: "Téléchargez WPS Office Desktop Editor pour obtenir un outil PDF léger couvrant tous vos besoins.", es: "Descarga WPS Office Desktop Editor para obtener una herramienta PDF ligera con soluciones completas.", pt: "Baixe o WPS Office Desktop Editor para ter uma ferramenta PDF leve com soluções completas.", it: "Scarica WPS Office Desktop Editor per avere uno strumento PDF leggero con soluzioni complete.", ja: "WPS Office デスクトップエディターをダウンロードして、PDF のあらゆる課題に対応する軽量 PDF ツールを利用できます。", ko: "WPS Office 데스크톱 편집기를 다운로드하여 모든 PDF 문제를 해결하는 가벼운 PDF 도구를 사용하세요.", "zh-cn": "下载 WPS Office 桌面编辑器，获得轻量级 PDF 工具，一站解决各种 PDF 问题。", "zh-tw": "下載 WPS Office 桌面編輯器，取得輕量級 PDF 工具，一站解決各種 PDF 問題。" }],
        ["WPS Office, perfectly compatible with the macOS system on Mac, and supports Intel and Apple chips to help you edit PDFs easily.", { de: "WPS Office ist vollständig mit macOS kompatibel und unterstützt Intel- sowie Apple-Chips, damit Sie PDFs einfach bearbeiten können.", fr: "WPS Office est parfaitement compatible avec macOS et prend en charge les puces Intel et Apple pour éditer vos PDF facilement.", es: "WPS Office es compatible con macOS y admite chips Intel y Apple para editar PDF fácilmente.", pt: "O WPS Office é compatível com macOS e oferece suporte a chips Intel e Apple para editar PDFs facilmente.", it: "WPS Office è compatibile con macOS e supporta chip Intel e Apple per modificare PDF con facilità.", ja: "WPS Office は macOS と完全互換で、Intel チップと Apple チップに対応し、PDF 編集をかんたんにします。", ko: "WPS Office는 macOS와 완벽하게 호환되며 Intel 및 Apple 칩을 지원해 PDF 편집을 쉽게 도와줍니다.", "zh-cn": "WPS Office 完美兼容 Mac 的 macOS 系统，并支持 Intel 与 Apple 芯片，帮助你轻松编辑 PDF。", "zh-tw": "WPS Office 完美相容 Mac 的 macOS 系統，並支援 Intel 與 Apple 晶片，協助你輕鬆編輯 PDF。" }],
        ["WPS Office is a free office suite that supports Linux. Download the WPS Office app to access PDF tools anytime.", { de: "WPS Office ist eine kostenlose Office-Suite für Linux. Laden Sie die App herunter, um jederzeit PDF-Tools zu nutzen.", fr: "WPS Office est une suite bureautique gratuite compatible Linux. Téléchargez l'application pour accéder aux outils PDF à tout moment.", es: "WPS Office es una suite ofimática gratuita compatible con Linux. Descárgala para acceder a herramientas PDF cuando quieras.", pt: "O WPS Office é uma suíte gratuita compatível com Linux. Baixe o app para acessar ferramentas PDF a qualquer momento.", it: "WPS Office è una suite gratuita compatibile con Linux. Scarica l'app per accedere agli strumenti PDF in qualsiasi momento.", ja: "WPS Office は Linux に対応した無料オフィススイートです。アプリをダウンロードして、いつでも PDF ツールを使えます。", ko: "WPS Office는 Linux를 지원하는 무료 오피스 제품군입니다. 앱을 다운로드해 언제든 PDF 도구를 사용하세요.", "zh-cn": "WPS Office 是支持 Linux 的免费办公套件。下载 WPS Office 应用，随时使用 PDF 工具。", "zh-tw": "WPS Office 是支援 Linux 的免費辦公套件。下載 WPS Office 應用程式，隨時使用 PDF 工具。" }],
        ["Get it on Google Play", { de: "Bei Google Play", fr: "Disponible sur Google Play", es: "Disponible en Google Play", pt: "Disponível no Google Play", it: "Disponibile su Google Play", ja: "Google Play で入手", ko: "Google Play에서 받기", "zh-cn": "在 Google Play 获取", "zh-tw": "在 Google Play 取得" }],
        ["Download on the AppStore", { de: "Im App Store laden", fr: "Télécharger dans l'App Store", es: "Descargar en App Store", pt: "Baixar na App Store", it: "Scarica su App Store", ja: "App Store からダウンロード", ko: "App Store에서 다운로드", "zh-cn": "在 App Store 下载", "zh-tw": "在 App Store 下載" }]
      ].forEach(([source, values]) => addTranslation(source, values));

      [
        ["About", { de: "Über", fr: "À propos", es: "Acerca de", pt: "Sobre", it: "Informazioni", ja: "概要", ko: "소개", "zh-cn": "关于", "zh-tw": "關於" }],
        ["WPS PDF is a useful all-in-one PDF online tool. It is easy to edit, convert and manage PDF files, you can try it for free. For efficient PDF processing, please use WPS PDF.", { de: "WPS PDF ist ein praktisches All-in-one-Online-Tool für PDF. Sie können PDF-Dateien einfach bearbeiten, konvertieren und verwalten und es kostenlos ausprobieren.", fr: "WPS PDF est un outil PDF en ligne tout-en-un pratique. Modifiez, convertissez et gérez vos PDF facilement, gratuitement.", es: "WPS PDF es una práctica herramienta PDF online todo en uno. Edita, convierte y gestiona archivos PDF fácilmente y pruébala gratis.", pt: "WPS PDF é uma ferramenta PDF online completa. Edite, converta e gerencie PDFs facilmente e experimente grátis.", it: "WPS PDF è un utile strumento PDF online tutto in uno. Modifica, converti e gestisci PDF facilmente e provalo gratis.", ja: "WPS PDF は便利なオールインワンのオンライン PDF ツールです。PDF の編集、変換、管理をかんたんに無料で試せます。", ko: "WPS PDF는 유용한 올인원 온라인 PDF 도구입니다. PDF 파일을 쉽게 편집, 변환, 관리할 수 있으며 무료로 사용해 볼 수 있습니다.", "zh-cn": "WPS PDF 是一款实用的一站式在线 PDF 工具。你可以轻松编辑、转换和管理 PDF 文件，并免费试用。高效处理 PDF，就用 WPS PDF。", "zh-tw": "WPS PDF 是一款實用的一站式線上 PDF 工具。你可以輕鬆編輯、轉換和管理 PDF 檔案，並免費試用。高效處理 PDF，就用 WPS PDF。" }],
        ["WPS PDF is also compatible with a variety of file formats, including Adobe PDF. PDF is now a component of WPS Office application, providing collaborative viewing, annotation, and editing.", { de: "WPS PDF ist mit vielen Dateiformaten kompatibel, einschließlich Adobe PDF, und unterstützt gemeinsames Anzeigen, Kommentieren und Bearbeiten.", fr: "WPS PDF est compatible avec de nombreux formats, dont Adobe PDF, avec affichage collaboratif, annotation et édition.", es: "WPS PDF es compatible con diversos formatos, incluido Adobe PDF, con visualización colaborativa, anotación y edición.", pt: "WPS PDF é compatível com vários formatos, incluindo Adobe PDF, com visualização colaborativa, anotação e edição.", it: "WPS PDF è compatibile con molti formati, incluso Adobe PDF, e offre visualizzazione collaborativa, annotazione e modifica.", ja: "WPS PDF は Adobe PDF を含むさまざまな形式に対応し、共同閲覧、注釈、編集を提供します。", ko: "WPS PDF는 Adobe PDF를 포함한 다양한 파일 형식과 호환되며 공동 보기, 주석, 편집 기능을 제공합니다.", "zh-cn": "WPS PDF 还兼容包括 Adobe PDF 在内的多种文件格式。PDF 现已成为 WPS Office 应用的一部分，支持协同查看、批注和编辑。", "zh-tw": "WPS PDF 也相容包括 Adobe PDF 在內的多種檔案格式。PDF 現已成為 WPS Office 應用程式的一部分，支援協同檢視、註解和編輯。" }],
        ["PDF Guide", { de: "PDF-Anleitung", fr: "Guide PDF", es: "Guía PDF", pt: "Guia PDF", it: "Guida PDF", ja: "PDF ガイド", ko: "PDF 가이드", "zh-cn": "PDF 指南", "zh-tw": "PDF 指南" }],
        ["How to Instructions", { de: "Anleitungen", fr: "Instructions", es: "Instrucciones", pt: "Instruções", it: "Istruzioni", ja: "使い方", ko: "사용 방법", "zh-cn": "操作指南", "zh-tw": "操作指南" }],
        ["How to convert a PDF file?", { de: "Wie konvertiert man eine PDF-Datei?", fr: "Comment convertir un fichier PDF ?", es: "¿Cómo convertir un archivo PDF?", pt: "Como converter um arquivo PDF?", it: "Come convertire un file PDF?", ja: "PDF ファイルを変換するには？", ko: "PDF 파일을 변환하는 방법은?", "zh-cn": "如何转换 PDF 文件？", "zh-tw": "如何轉換 PDF 檔案？" }],
        ["How to edit a PDF file?", { de: "Wie bearbeitet man eine PDF-Datei?", fr: "Comment modifier un fichier PDF ?", es: "¿Cómo editar un archivo PDF?", pt: "Como editar um arquivo PDF?", it: "Come modificare un file PDF?", ja: "PDF ファイルを編集するには？", ko: "PDF 파일을 편집하는 방법은?", "zh-cn": "如何编辑 PDF 文件？", "zh-tw": "如何編輯 PDF 檔案？" }],
        ["How to organize a PDF file?", { de: "Wie organisiert man eine PDF-Datei?", fr: "Comment organiser un fichier PDF ?", es: "¿Cómo organizar un archivo PDF?", pt: "Como organizar um arquivo PDF?", it: "Come organizzare un file PDF?", ja: "PDF ファイルを整理するには？", ko: "PDF 파일을 정리하는 방법은?", "zh-cn": "如何整理 PDF 文件？", "zh-tw": "如何整理 PDF 檔案？" }],
        ["You can use PDF Converter to convert PDF files to/from Word, Excel, PowerPoint, and image files online. Take PDF to Word conversion as an example. Open PDF to Word Converter, click Select File to upload your file, then download the Word document.", { de: "Mit PDF Converter können Sie PDF-Dateien online in Word, Excel, PowerPoint und Bilder umwandeln und umgekehrt. Öffnen Sie z. B. PDF to Word, laden Sie Ihre Datei hoch und laden Sie das Word-Dokument herunter.", fr: "Utilisez PDF Converter pour convertir des PDF vers ou depuis Word, Excel, PowerPoint et des images en ligne. Ouvrez PDF to Word, importez votre fichier, puis téléchargez le document Word.", es: "Usa PDF Converter para convertir PDF hacia o desde Word, Excel, PowerPoint e imágenes online. Abre PDF to Word, sube el archivo y descarga el documento Word.", pt: "Use o PDF Converter para converter PDFs de/para Word, Excel, PowerPoint e imagens online. Abra PDF to Word, envie o arquivo e baixe o documento Word.", it: "Usa PDF Converter per convertire PDF da e verso Word, Excel, PowerPoint e immagini online. Apri PDF to Word, carica il file e scarica il documento Word.", ja: "PDF Converter を使うと、PDF と Word、Excel、PowerPoint、画像をオンラインで相互変換できます。PDF to Word を開き、ファイルをアップロードして Word 文書をダウンロードします。", ko: "PDF Converter를 사용하면 PDF를 Word, Excel, PowerPoint, 이미지 파일로 온라인 변환하거나 반대로 변환할 수 있습니다. PDF to Word를 열고 파일을 업로드한 뒤 Word 문서를 다운로드하세요.", "zh-cn": "你可以使用 PDF Converter 在线将 PDF 与 Word、Excel、PowerPoint 和图片文件互相转换。以 PDF 转 Word 为例，打开 PDF to Word Converter，点击 Select File 上传文件，然后下载 Word 文档。", "zh-tw": "你可以使用 PDF Converter 線上將 PDF 與 Word、Excel、PowerPoint 和圖片檔案互相轉換。以 PDF 轉 Word 為例，開啟 PDF to Word Converter，點擊 Select File 上傳檔案，然後下載 Word 文件。" }],
        ["download WPS Office", { de: "WPS Office herunterladen", fr: "télécharger WPS Office", es: "descargar WPS Office", pt: "baixar WPS Office", it: "scaricare WPS Office", ja: "WPS Office をダウンロード", ko: "WPS Office 다운로드", "zh-cn": "下载 WPS Office", "zh-tw": "下載 WPS Office" }],
        ["Start Editing", { de: "Bearbeitung starten", fr: "Commencer l'édition", es: "Empezar a editar", pt: "Começar a editar", it: "Inizia a modificare", ja: "編集を開始", ko: "편집 시작", "zh-cn": "开始编辑", "zh-tw": "開始編輯" }],
        ["Free Trial", { de: "Kostenlos testen", fr: "Essai gratuit", es: "Prueba gratis", pt: "Teste grátis", it: "Prova gratuita", ja: "無料体験", ko: "무료 체험", "zh-cn": "免费试用", "zh-tw": "免費試用" }]
      ].forEach(([source, values]) => addTranslation(source, values));

      [
        ["1. Open the WPS PDF editor or", { de: "1. Öffnen Sie den WPS PDF-Editor oder", fr: "1. Ouvrez l'éditeur WPS PDF ou", es: "1. Abre el editor WPS PDF o", pt: "1. Abra o editor WPS PDF ou", it: "1. Apri l'editor WPS PDF oppure", ja: "1. WPS PDF エディターを開くか", ko: "1. WPS PDF 편집기를 열거나", "zh-cn": "1. 打开 WPS PDF 编辑器，或", "zh-tw": "1. 開啟 WPS PDF 編輯器，或" }],
        ["to open a PDF file.", { de: "um eine PDF-Datei zu öffnen.", fr: "pour ouvrir un fichier PDF.", es: "para abrir un archivo PDF.", pt: "para abrir um arquivo PDF.", it: "per aprire un file PDF.", ja: "PDF ファイルを開きます。", ko: "PDF 파일을 엽니다.", "zh-cn": "来打开 PDF 文件。", "zh-tw": "來開啟 PDF 檔案。" }],
        ["2. Click Text Tools on the top navigation bar.", { de: "2. Klicken Sie oben in der Navigation auf Text Tools.", fr: "2. Cliquez sur Text Tools dans la barre de navigation supérieure.", es: "2. Haz clic en Text Tools en la barra superior.", pt: "2. Clique em Text Tools na barra superior.", it: "2. Fai clic su Text Tools nella barra superiore.", ja: "2. 上部ナビゲーションバーの Text Tools をクリックします。", ko: "2. 상단 탐색 표시줄에서 Text Tools를 클릭합니다.", "zh-cn": "2. 点击顶部导航栏中的 Text Tools。", "zh-tw": "2. 點擊頂部導覽列中的 Text Tools。" }],
        ["3. Add text to the PDF page. Click the existing text to start editing.", { de: "3. Fügen Sie Text zur PDF-Seite hinzu. Klicken Sie auf vorhandenen Text, um ihn zu bearbeiten.", fr: "3. Ajoutez du texte à la page PDF. Cliquez sur le texte existant pour le modifier.", es: "3. Añade texto a la página PDF. Haz clic en el texto existente para editarlo.", pt: "3. Adicione texto à página PDF. Clique no texto existente para editá-lo.", it: "3. Aggiungi testo alla pagina PDF. Fai clic sul testo esistente per modificarlo.", ja: "3. PDF ページにテキストを追加します。既存のテキストをクリックして編集します。", ko: "3. PDF 페이지에 텍스트를 추가합니다. 기존 텍스트를 클릭해 편집을 시작합니다.", "zh-cn": "3. 向 PDF 页面添加文本。点击已有文本即可开始编辑。", "zh-tw": "3. 向 PDF 頁面新增文字。點擊既有文字即可開始編輯。" }],
        ["4. Add images to the PDF page. Drag and move, resize, or rotate the images.", { de: "4. Fügen Sie Bilder zur PDF-Seite hinzu. Ziehen, verschieben, skalieren oder drehen Sie sie.", fr: "4. Ajoutez des images à la page PDF. Déplacez, redimensionnez ou faites pivoter les images.", es: "4. Añade imágenes a la página PDF. Arrástralas, muévelas, cambia su tamaño o gíralas.", pt: "4. Adicione imagens à página PDF. Arraste, mova, redimensione ou gire as imagens.", it: "4. Aggiungi immagini alla pagina PDF. Trascinale, spostale, ridimensionale o ruotale.", ja: "4. PDF ページに画像を追加し、ドラッグ、移動、サイズ変更、回転を行います。", ko: "4. PDF 페이지에 이미지를 추가하고 끌어서 이동, 크기 조절 또는 회전합니다.", "zh-cn": "4. 向 PDF 页面添加图片，并拖动、移动、调整大小或旋转图片。", "zh-tw": "4. 向 PDF 頁面新增圖片，並拖曳、移動、調整大小或旋轉圖片。" }],
        ["5. Fill PDFs and add an e-signature by drawing, typing, or uploading your signature image.", { de: "5. Füllen Sie PDFs aus und fügen Sie eine E-Signatur per Zeichnen, Tippen oder Upload hinzu.", fr: "5. Remplissez les PDF et ajoutez une signature électronique en dessinant, tapant ou important votre signature.", es: "5. Rellena PDF y añade una firma electrónica dibujando, escribiendo o subiendo tu firma.", pt: "5. Preencha PDFs e adicione uma assinatura eletrônica desenhando, digitando ou enviando sua assinatura.", it: "5. Compila PDF e aggiungi una firma elettronica disegnandola, digitandola o caricandola.", ja: "5. PDF に入力し、描画、入力、画像アップロードで電子署名を追加します。", ko: "5. PDF를 작성하고 그리기, 입력 또는 서명 이미지 업로드로 전자 서명을 추가합니다.", "zh-cn": "5. 通过手绘、输入或上传签名图片来填写 PDF 并添加电子签名。", "zh-tw": "5. 透過手繪、輸入或上傳簽名圖片來填寫 PDF 並新增電子簽名。" }],
        ["6. Annotate PDF pages with highlighted text, and mark changes. Try the Sign PDF tool online for free.", { de: "6. Kommentieren Sie PDF-Seiten mit Hervorhebungen und Markierungen. Testen Sie Sign PDF online kostenlos.", fr: "6. Annotez les pages PDF avec du texte surligné et marquez les changements. Essayez Sign PDF gratuitement en ligne.", es: "6. Anota páginas PDF con resaltados y marca cambios. Prueba Sign PDF online gratis.", pt: "6. Anote páginas PDF com destaques e marque alterações. Experimente Sign PDF online grátis.", it: "6. Annota pagine PDF con evidenziazioni e segna le modifiche. Prova Sign PDF online gratis.", ja: "6. ハイライトや変更マークで PDF に注釈を付けます。Sign PDF を無料でお試しください。", ko: "6. 강조 표시와 변경 마크로 PDF 페이지에 주석을 달 수 있습니다. Sign PDF 도구를 온라인에서 무료로 사용해 보세요.", "zh-cn": "6. 使用高亮文本批注 PDF 页面并标记修改。免费在线试用 Sign PDF 工具。", "zh-tw": "6. 使用醒目提示文字註解 PDF 頁面並標記修改。免費線上試用 Sign PDF 工具。" }],
        ["1. You can open the PDF Organizer online tool and click Select File to upload your file.", { de: "1. Öffnen Sie PDF Organizer online und klicken Sie auf Select File, um Ihre Datei hochzuladen.", fr: "1. Ouvrez PDF Organizer en ligne et cliquez sur Select File pour importer votre fichier.", es: "1. Abre PDF Organizer online y haz clic en Select File para subir tu archivo.", pt: "1. Abra o PDF Organizer online e clique em Select File para enviar seu arquivo.", it: "1. Apri PDF Organizer online e fai clic su Select File per caricare il file.", ja: "1. PDF Organizer オンラインツールを開き、Select File をクリックしてファイルをアップロードします。", ko: "1. PDF Organizer 온라인 도구를 열고 Select File을 클릭해 파일을 업로드합니다.", "zh-cn": "1. 打开在线 PDF Organizer 工具，点击 Select File 上传文件。", "zh-tw": "1. 開啟線上 PDF Organizer 工具，點擊 Select File 上傳檔案。" }],
        ["2. You can arrange the pages in this PDF file by adding new pages, deleting old pages, or adjusting the order of the pages.", { de: "2. Ordnen Sie PDF-Seiten an, indem Sie Seiten hinzufügen, löschen oder die Reihenfolge ändern.", fr: "2. Organisez les pages du PDF en ajoutant, supprimant ou réordonnant les pages.", es: "2. Organiza las páginas del PDF añadiendo, eliminando o reordenando páginas.", pt: "2. Organize as páginas do PDF adicionando, excluindo ou reordenando páginas.", it: "2. Organizza le pagine del PDF aggiungendo, eliminando o riordinando pagine.", ja: "2. 新しいページの追加、古いページの削除、順序変更で PDF ページを整理できます。", ko: "2. 새 페이지 추가, 기존 페이지 삭제, 순서 조정으로 PDF 페이지를 정리할 수 있습니다.", "zh-cn": "2. 你可以通过添加新页面、删除旧页面或调整页面顺序来整理 PDF。", "zh-tw": "2. 你可以透過新增頁面、刪除舊頁面或調整頁面順序來整理 PDF。" }],
        ["3. Click Continue to download the file.", { de: "3. Klicken Sie auf Continue, um die Datei herunterzuladen.", fr: "3. Cliquez sur Continue pour télécharger le fichier.", es: "3. Haz clic en Continue para descargar el archivo.", pt: "3. Clique em Continue para baixar o arquivo.", it: "3. Fai clic su Continue per scaricare il file.", ja: "3. Continue をクリックしてファイルをダウンロードします。", ko: "3. Continue를 클릭해 파일을 다운로드합니다.", "zh-cn": "3. 点击 Continue 下载文件。", "zh-tw": "3. 點擊 Continue 下載檔案。" }],
        ["4. Try the Manage PDF tool online for free now.", { de: "4. Testen Sie das Manage PDF-Tool jetzt kostenlos online.", fr: "4. Essayez gratuitement l'outil Manage PDF en ligne maintenant.", es: "4. Prueba ahora gratis la herramienta Manage PDF online.", pt: "4. Experimente agora a ferramenta Manage PDF online grátis.", it: "4. Prova subito online gratis lo strumento Manage PDF.", ja: "4. Manage PDF ツールを今すぐオンラインで無料体験してください。", ko: "4. 지금 Manage PDF 도구를 온라인에서 무료로 사용해 보세요.", "zh-cn": "4. 立即免费在线试用 Manage PDF 工具。", "zh-tw": "4. 立即免費線上試用 Manage PDF 工具。" }]
      ].forEach(([source, values]) => addTranslation(source, values));

      [
        ["PDF Blog helps you fully understand how to use PDF tools, provides you quick access to software news, recommends different types of office software worth downloading, and offers you information about PDF version update.", { de: "Der PDF Blog erklärt PDF-Tools, liefert Software-News, empfiehlt nützliche Office-Software und informiert über PDF-Updates.", fr: "Le blog PDF vous aide à comprendre les outils PDF, donne accès aux actualités logicielles, recommande des logiciels de bureau et présente les mises à jour PDF.", es: "El blog PDF te ayuda a usar herramientas PDF, ofrece noticias de software, recomienda programas de oficina y muestra novedades de versiones PDF.", pt: "O blog PDF ajuda você a usar ferramentas PDF, traz notícias de software, recomenda apps de escritório e informa atualizações de PDF.", it: "Il blog PDF ti aiuta a usare gli strumenti PDF, offre notizie software, consiglia programmi office e informa sugli aggiornamenti PDF.", ja: "PDF ブログでは、PDF ツールの使い方、ソフトウェアニュース、便利なオフィスソフト、PDF アップデート情報を紹介します。", ko: "PDF 블로그는 PDF 도구 사용법, 소프트웨어 뉴스, 추천 오피스 소프트웨어, PDF 버전 업데이트 정보를 제공합니다.", "zh-cn": "PDF 博客帮助你全面了解 PDF 工具的使用方法，快速获取软件资讯，推荐值得下载的办公软件，并提供 PDF 版本更新信息。", "zh-tw": "PDF 部落格協助你全面了解 PDF 工具的使用方法，快速取得軟體資訊，推薦值得下載的辦公軟體，並提供 PDF 版本更新資訊。" }],
        ["Get the Free Key for WPS Premium and Download WPS Office Right Now", { de: "Kostenlosen Schlüssel für WPS Premium erhalten und WPS Office jetzt herunterladen", fr: "Obtenez la clé gratuite WPS Premium et téléchargez WPS Office maintenant", es: "Obtén la clave gratuita de WPS Premium y descarga WPS Office ahora", pt: "Obtenha a chave gratuita do WPS Premium e baixe o WPS Office agora", it: "Ottieni la chiave gratuita per WPS Premium e scarica WPS Office ora", ja: "WPS Premium の無料キーを入手して WPS Office を今すぐダウンロード", ko: "WPS Premium 무료 키를 받고 지금 WPS Office 다운로드", "zh-cn": "获取 WPS Premium 免费密钥并立即下载 WPS Office", "zh-tw": "取得 WPS Premium 免費金鑰並立即下載 WPS Office" }],
        ["As a both lightweight and powerful office suite, WPS Office has become more and more popular and competitive among its competitors. WPS Office has provided free access to its four programs.", { de: "Als leichte und leistungsstarke Office-Suite wird WPS Office immer beliebter und wettbewerbsfähiger. Vier Programme sind kostenlos verfügbar.", fr: "Suite bureautique légère et puissante, WPS Office gagne en popularité et propose un accès gratuit à ses quatre programmes.", es: "Como suite ligera y potente, WPS Office es cada vez más popular y ofrece acceso gratuito a sus cuatro programas.", pt: "Como suíte leve e poderosa, o WPS Office está cada vez mais popular e oferece acesso gratuito aos seus quatro programas.", it: "Suite leggera e potente, WPS Office è sempre più popolare e offre accesso gratuito ai suoi quattro programmi.", ja: "軽量で高機能なオフィススイートとして、WPS Office は人気を高め、4 つのプログラムを無料で提供しています。", ko: "가볍고 강력한 오피스 제품군인 WPS Office는 점점 더 인기를 얻고 있으며 네 가지 프로그램을 무료로 제공합니다.", "zh-cn": "作为轻量且强大的办公套件，WPS Office 越来越受欢迎，也更具竞争力。WPS Office 已免费提供四大程序访问。", "zh-tw": "作為輕量且強大的辦公套件，WPS Office 越來越受歡迎，也更具競爭力。WPS Office 已免費提供四大程式存取。" }],
        ["Quick Overview of WPS File and How to Convert WPS to Word for Free", { de: "Kurzer Überblick über WPS-Dateien und kostenlose Konvertierung in Word", fr: "Aperçu rapide du fichier WPS et conversion gratuite en Word", es: "Resumen rápido del archivo WPS y cómo convertirlo gratis a Word", pt: "Visão rápida do arquivo WPS e como converter grátis para Word", it: "Panoramica rapida dei file WPS e conversione gratuita in Word", ja: "WPS ファイルの概要と無料で Word に変換する方法", ko: "WPS 파일 개요 및 무료로 Word로 변환하는 방법", "zh-cn": "WPS 文件快速概览及免费转换为 Word 的方法", "zh-tw": "WPS 檔案快速概覽及免費轉換為 Word 的方法" }],
        ["WPS is a file format, similar to text documents, created by Microsoft Works Word Processor. This file is homogeneous to the Doc files created by Microsoft Word.", { de: "WPS ist ein Dateiformat ähnlich Textdokumenten, erstellt von Microsoft Works Word Processor, und ähnelt Doc-Dateien aus Microsoft Word.", fr: "WPS est un format de fichier proche des documents texte, créé par Microsoft Works Word Processor, similaire aux fichiers Doc de Microsoft Word.", es: "WPS es un formato similar a documentos de texto, creado por Microsoft Works Word Processor, parecido a los archivos Doc de Microsoft Word.", pt: "WPS é um formato semelhante a documentos de texto, criado pelo Microsoft Works Word Processor, parecido com arquivos Doc do Word.", it: "WPS è un formato simile ai documenti di testo, creato da Microsoft Works Word Processor, simile ai file Doc di Word.", ja: "WPS は Microsoft Works Word Processor で作成されたテキスト文書に似た形式で、Microsoft Word の Doc ファイルに近いものです。", ko: "WPS는 Microsoft Works Word Processor에서 만든 텍스트 문서와 유사한 파일 형식이며 Microsoft Word의 Doc 파일과 비슷합니다.", "zh-cn": "WPS 是一种类似文本文件的格式，由 Microsoft Works Word Processor 创建，与 Microsoft Word 创建的 Doc 文件相似。", "zh-tw": "WPS 是一種類似文字文件的格式，由 Microsoft Works Word Processor 建立，與 Microsoft Word 建立的 Doc 檔案相似。" }],
        ["WPS PDF on the WPS Premium Free Trial", { de: "WPS PDF in der kostenlosen WPS Premium-Testversion", fr: "WPS PDF avec l'essai gratuit WPS Premium", es: "WPS PDF en la prueba gratis de WPS Premium", pt: "WPS PDF no teste grátis do WPS Premium", it: "WPS PDF nella prova gratuita di WPS Premium", ja: "WPS Premium 無料体験版の WPS PDF", ko: "WPS Premium 무료 체험의 WPS PDF", "zh-cn": "WPS Premium 免费试用中的 WPS PDF", "zh-tw": "WPS Premium 免費試用中的 WPS PDF" }],
        ["WPS Office is a powerful alternative to Microsoft Office for producing and editing documents. Templates for documents, presentations, and spreadsheets are provided at no cost.", { de: "WPS Office ist eine starke Alternative zu Microsoft Office zum Erstellen und Bearbeiten von Dokumenten. Vorlagen für Dokumente, Präsentationen und Tabellen sind kostenlos.", fr: "WPS Office est une alternative puissante à Microsoft Office pour créer et modifier des documents. Des modèles sont fournis gratuitement.", es: "WPS Office es una potente alternativa a Microsoft Office para crear y editar documentos. Hay plantillas gratuitas para documentos, presentaciones y hojas de cálculo.", pt: "WPS Office é uma alternativa poderosa ao Microsoft Office para criar e editar documentos. Modelos de documentos, apresentações e planilhas são gratuitos.", it: "WPS Office è una potente alternativa a Microsoft Office per creare e modificare documenti. I modelli sono gratuiti.", ja: "WPS Office は文書作成と編集に使える Microsoft Office の強力な代替です。文書、プレゼン、表計算のテンプレートを無料で提供します。", ko: "WPS Office는 문서 제작과 편집을 위한 강력한 Microsoft Office 대안입니다. 문서, 프레젠테이션, 스프레드시트 템플릿을 무료로 제공합니다.", "zh-cn": "WPS Office 是制作和编辑文档的强大 Microsoft Office 替代方案，并免费提供文档、演示文稿和表格模板。", "zh-tw": "WPS Office 是製作和編輯文件的強大 Microsoft Office 替代方案，並免費提供文件、簡報和試算表範本。" }],
        ["Ready to make every PDF", { de: "Bereit, jede PDF-Aufgabe", fr: "Prêt à rendre chaque tâche PDF", es: "Listo para hacer que cada tarea PDF", pt: "Pronto para tornar cada tarefa PDF", it: "Pronto a rendere ogni attività PDF", ja: "すべての PDF 作業を", ko: "모든 PDF 작업을", "zh-cn": "准备让每个 PDF", "zh-tw": "準備讓每個 PDF" }],
        ["task feel", { de: "fühlbar", fr: "plus", es: "se sienta", pt: "mais", it: "più", ja: "もっと", ko: "더", "zh-cn": "任务变得", "zh-tw": "任務變得" }],
        ["faster", { de: "schneller zu machen", fr: "rapide", es: "más rápida", pt: "rápida", it: "veloce", ja: "速く", ko: "빠르게", "zh-cn": "更快", "zh-tw": "更快" }],
        ["Download for All Features", { de: "Alle Funktionen herunterladen", fr: "Télécharger toutes les fonctionnalités", es: "Descargar todas las funciones", pt: "Baixar todos os recursos", it: "Scarica tutte le funzioni", ja: "全機能をダウンロード", ko: "모든 기능 다운로드", "zh-cn": "下载全部功能", "zh-tw": "下載全部功能" }],
        ["WPS Office Products", { de: "WPS Office-Produkte", fr: "Produits WPS Office", es: "Productos WPS Office", pt: "Produtos WPS Office", it: "Prodotti WPS Office", ja: "WPS Office 製品", ko: "WPS Office 제품", "zh-cn": "WPS Office 产品", "zh-tw": "WPS Office 產品" }],
        ["Office Components", { de: "Office-Komponenten", fr: "Composants Office", es: "Componentes Office", pt: "Componentes Office", it: "Componenti Office", ja: "Office コンポーネント", ko: "Office 구성 요소", "zh-cn": "Office 组件", "zh-tw": "Office 元件" }],
        ["Company", { de: "Unternehmen", fr: "Entreprise", es: "Empresa", pt: "Empresa", it: "Azienda", ja: "会社", ko: "회사", "zh-cn": "公司", "zh-tw": "公司" }],
        ["Download Center", { de: "Download-Center", fr: "Centre de téléchargement", es: "Centro de descargas", pt: "Central de downloads", it: "Centro download", ja: "ダウンロードセンター", ko: "다운로드 센터", "zh-cn": "下载中心", "zh-tw": "下載中心" }],
        ["Privacy Policy", { de: "Datenschutzrichtlinie", fr: "Politique de confidentialité", es: "Política de privacidad", pt: "Política de privacidade", it: "Informativa sulla privacy", ja: "プライバシーポリシー", ko: "개인정보 처리방침", "zh-cn": "隐私政策", "zh-tw": "隱私權政策" }],
        ["Contact Us", { de: "Kontakt", fr: "Contactez-nous", es: "Contáctanos", pt: "Fale conosco", it: "Contattaci", ja: "お問い合わせ", ko: "문의하기", "zh-cn": "联系我们", "zh-tw": "聯絡我們" }],
        ["Copyright © Kingsoft Office Software, All Rights Reserved.", { de: "Copyright © Kingsoft Office Software, alle Rechte vorbehalten.", fr: "Copyright © Kingsoft Office Software, tous droits réservés.", es: "Copyright © Kingsoft Office Software, todos los derechos reservados.", pt: "Copyright © Kingsoft Office Software, todos os direitos reservados.", it: "Copyright © Kingsoft Office Software, tutti i diritti riservati.", ja: "Copyright © Kingsoft Office Software, All Rights Reserved.", ko: "Copyright © Kingsoft Office Software, All Rights Reserved.", "zh-cn": "版权所有 © Kingsoft Office Software，保留所有权利。", "zh-tw": "版權所有 © Kingsoft Office Software，保留所有權利。" }]
      ].forEach(([source, values]) => addTranslation(source, values));

      [
        "Windows", "Mac", "Linux", "Android & iOS", "Deb Package", "Rpm Package", "Google Play Best of 2015", "App Store Best of 2015",
        "WPS Office for Windows", "WPS Office for Mac", "WPS Office for Android", "WPS Office for iOS", "WPS Office for Linux",
        "WPS Writer", "WPS Spreadsheet", "WPS Presentation", "WPS Official", "WPS Premium", "WPS PDF", "blog"
      ].forEach((source) => addTranslation(source, {
        "zh-cn": source.replace("blog", "博客").replace("WPS Office for Windows", "Windows 版 WPS Office").replace("WPS Office for Mac", "Mac 版 WPS Office").replace("WPS Office for Android", "Android 版 WPS Office").replace("WPS Office for iOS", "iOS 版 WPS Office").replace("WPS Office for Linux", "Linux 版 WPS Office").replace("WPS Writer", "WPS 文字").replace("WPS Spreadsheet", "WPS 表格").replace("WPS Presentation", "WPS 演示").replace("WPS Official", "WPS 官网").replace("WPS Premium", "WPS 高级版").replace("Deb Package", "Deb 安装包").replace("Rpm Package", "Rpm 安装包").replace("Google Play Best of 2015", "Google Play 2015 年度最佳").replace("App Store Best of 2015", "App Store 2015 年度最佳").replace("Android & iOS", "Android 与 iOS"),
        "zh-tw": source.replace("blog", "部落格").replace("WPS Office for Windows", "Windows 版 WPS Office").replace("WPS Office for Mac", "Mac 版 WPS Office").replace("WPS Office for Android", "Android 版 WPS Office").replace("WPS Office for iOS", "iOS 版 WPS Office").replace("WPS Office for Linux", "Linux 版 WPS Office").replace("WPS Writer", "WPS 文字").replace("WPS Spreadsheet", "WPS 試算表").replace("WPS Presentation", "WPS 簡報").replace("WPS Official", "WPS 官網").replace("WPS Premium", "WPS 進階版").replace("Deb Package", "Deb 安裝包").replace("Rpm Package", "Rpm 安裝包").replace("Google Play Best of 2015", "Google Play 2015 年度最佳").replace("App Store Best of 2015", "App Store 2015 年度最佳").replace("Android & iOS", "Android 與 iOS")
      }));

      const translatableTextNodes = [];
      const translateSource = (source, lang = activeLanguage) => {
        if (lang === "en") return source;
        return i18n[lang]?.[source] || source;
      };

      const applyLanguageTo = (root = document) => {
        root.querySelectorAll("[data-i18n-key]").forEach((element) => {
          element.textContent = translateSource(element.dataset.i18nKey || "");
        });
        root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
          element.setAttribute("aria-label", translateSource(element.dataset.i18nAriaLabel || ""));
        });
        root.querySelectorAll("[data-tool-title-source]").forEach((card) => {
          const sourceTitle = card.dataset.toolTitleSource || "";
          const translatedTitle = translateSource(sourceTitle);
          const link = card.querySelector(".lab-tool-link");
          if (link) link.setAttribute("aria-label", `${translateSource("Open")} ${translatedTitle}`);
        });
      };
      window.wpsApplyLanguageTo = applyLanguageTo;

      const shouldTranslateTextNode = (node) => {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue.trim()) return false;
        return !parent.closest("script, style, svg, .material-symbols-rounded, .language-picker, .header-language-menu");
      };

      const collectTranslatableTextNodes = () => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            return shouldTranslateTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        });
        while (walker.nextNode()) {
          const node = walker.currentNode;
          translatableTextNodes.push({ node, source: node.nodeValue.trim() });
        }
      };

      const applyLanguage = (lang) => {
        activeLanguage = lang;
        const dictionary = i18n[lang] || {};
        translatableTextNodes.forEach(({ node, source }) => {
          const target = translateSource(source, lang);
          node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), target);
        });
        applyLanguageTo(document);
        dockTrack?.querySelectorAll(".dock-item").forEach((item) => {
          const titleSource = item.dataset.titleSource || item.dataset.title || "";
          const descSource = item.dataset.descSource || "";
          const title = translateSource(titleSource, lang);
          const desc = translateSource(descSource, lang);
          item.dataset.title = title;
          item.setAttribute("aria-label", desc ? `${title}. ${desc}` : title);
          const tooltip = item.querySelector(".dock-tooltip");
          if (tooltip) tooltip.textContent = title;
          const badge = item.querySelector(".dock-badge");
          if (badge && item.dataset.badgeSource) badge.textContent = translateSource(item.dataset.badgeSource, lang);
        });
        const activeDockItem = dockTrack?.querySelector(".dock-item.is-active");
        if (dockLabel && activeDockItem && dockViewport?.classList.contains("is-label-visible")) {
          dockLabel.textContent = activeDockItem.dataset.title || "";
        }
        document.documentElement.lang = lang;
        document.documentElement.dir = ["ar", "he"].includes(lang) ? "rtl" : "ltr";
        document.title = lang === "en" ? "WPS PDF Tools" : dictionary["WPS PDF Tools"] || "WPS PDF Tools";
      };

      const setFooterLanguageLabel = (lang) => {
        if (!languageButton) return;
        const label = languageButton.querySelector(".language-label");
        if (label) label.textContent = languageNames[lang] || languageNames.en;
      };

      const setLanguage = (lang) => {
        const nextLang = languageNames[lang] ? lang : "en";
        applyLanguage(nextLang);
        setFooterLanguageLabel(nextLang);
        document.querySelectorAll("[data-lang]").forEach((link) => {
          link.classList.toggle("is-active", link.dataset.lang === nextLang);
        });
        try {
          localStorage.setItem("wpsPdfLanguage", nextLang);
        } catch (error) {
          /* localStorage can be unavailable for file previews. */
        }
      };

      function closeLanguageMenu() {
        if (!languagePicker || !languageButton) return;
        languagePicker.classList.remove("is-open");
        languageButton.setAttribute("aria-expanded", "false");
      }

      function closeHeaderLanguageMenu() {
        if (!headerLanguagePicker || !headerLanguageButton) return;
        headerLanguagePicker.classList.remove("is-open");
        headerLanguageButton.setAttribute("aria-expanded", "false");
      }

      languageButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = languagePicker.classList.toggle("is-open");
        languageButton.setAttribute("aria-expanded", String(isOpen));
      });

      languagePicker?.addEventListener("click", (event) => {
        const option = event.target.closest(".language-menu a");
        if (!option || !languageButton) return;
        event.preventDefault();
        setLanguage(option.dataset.lang || "en");
        closeLanguageMenu();
      });

      headerLanguagePicker?.addEventListener("click", (event) => {
        const option = event.target.closest(".header-language-menu a");
        if (!option) return;
        event.preventDefault();
        setLanguage(option.dataset.lang || "en");
        closeHeaderLanguageMenu();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeLanguageMenu();
          closeHeaderLanguageMenu();
        }
      });

      document.addEventListener("click", (event) => {
        if (!event.target.closest(".language-picker")) closeLanguageMenu();
        if (!event.target.closest(".header-language-picker")) closeHeaderLanguageMenu();
        if (event.target.closest("[data-dropdown-toggle]") || event.target.closest(".dropdown")) return;
        closeDownloadDropdowns();
      });

      collectTranslatableTextNodes();
      let savedLanguage = "en";
      try {
        savedLanguage = localStorage.getItem("wpsPdfLanguage") || "en";
      } catch (error) {
        savedLanguage = "en";
      }
      setLanguage(savedLanguage);
      window.WPSToolRoutes?.wireHomepage(document);
