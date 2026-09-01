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
      <div class="nav-dropdown-footer">
        <a class="nav-all-tools-link" href="https://szdmt.com/en-US/all-products/" target="_blank" rel="noopener noreferrer">All Tools →</a>
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
