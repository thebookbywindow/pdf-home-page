/**
 * 3D Conversion nav: 3 scenario hubs (Mesh / CAD / BIM).
 */
(function (global) {
  function hubs() {
    return global.WPSFormatHubs3D?.HUBS || {};
  }

  function render3DNavMenu(root) {
    const menu = (root || document).querySelector("[data-3d-nav-menu]");
    if (!menu) return;
    const H = hubs();
    const order = ["mesh", "cad", "bim"];
    menu.innerHTML = `
      <div class="nav-dropdown-grid nav-dropdown-grid--3d-hubs">
        ${order.map((id) => {
          const hub = H[id];
          if (!hub) return "";
          const href = global.WPSFormatHubs3D.pageForHub(id);
          return `
            <div class="nav-group">
              <p class="nav-group-title">${hub.navGroup}</p>
              <div class="nav-menu-list">
                <a class="nav-menu-link" href="${href}" data-3d-hub="${id}" data-tool-title="${hub.title}">
                  <span class="nav-format-icon">${hub.iconShort}</span>
                  ${hub.title}
                </a>
              </div>
            </div>`;
        }).join("")}
      </div>
      <div class="nav-dropdown-footer nav-dropdown-footer--3d">
        <a class="nav-all-tools-link nav-all-tools-link--icon" href="https://szdmt.com/en-US/all-products/" target="_blank" rel="noopener noreferrer">
          <span>All Tools</span><span class="nav-all-tools-icon" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg></span>
        </a>
      </div>
    `;
  }

  function getHubCards() {
    const H = hubs();
    return ["mesh", "cad", "bim"].map((id) => {
      const hub = H[id];
      return {
        title: hub.title,
        desc: hub.cardDesc || hub.subtitle,
        icon: "convert-pdf.svg",
        category: "3d-conversion",
        hubId: id,
        href: global.WPSFormatHubs3D.pageForHub(id),
        hubInputs: hub.inputs,
        hubOutputs: hub.outputs,
        badge: id === "mesh" ? "NEW" : undefined
      };
    });
  }

  global.WPSSiteNav3D = {
    render3DNavMenu,
    getHubCards,
    SCENE_LABELS: {
      mesh: "Mesh & Graphics",
      cad: "CAD Industrial",
      bim: "BIM & Architecture"
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
