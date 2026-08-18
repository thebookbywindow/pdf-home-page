/**
 * 3D Converter hubs: Mesh / CAD / BIM
 * Mapping matches capability inventory + user-approved gray-out matrix.
 */
(function (global) {
  const HUBS = {
    mesh: {
      id: "mesh",
      title: "Mesh Converter",
      navGroup: "Mesh & Graphics",
      navHint: "OBJ · STL · FBX · GLB…",
      pageTitle: "Free Mesh Converter Online",
      subtitle: "Convert 3D mesh files between popular formats like OBJ, STL, FBX, GLB, DAE and more. Simply upload your file, choose an output format, and convert it online in seconds.",
      cardDesc: "In Mesh scenarios, convert OBJ, STL, FBX, GLB/GLTF, DAE, 3DS, X, 3MF, OFF, AC3D, and PLY to OBJ, STL, FBX, GLB/GLTF, DAE, 3MF, and PLY.",
      toolVerb: "convert your mesh files",
      category: "3d-conversion",
      iconShort: "MESH",
      inputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3DS", "X", "3MF", "OFF", "AC3D", "PLY"],
      outputs: ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"],
      defaultFrom: "OBJ",
      defaultTo: "STL",
      // allowed[from] = set of outputs (same format never allowed)
      allowed: {
        "OBJ": ["STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"],
        "STL": ["OBJ", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"],
        "FBX": ["OBJ", "STL", "GLB/GLTF", "DAE", "3MF", "PLY"],
        "GLB/GLTF": ["OBJ", "STL", "FBX", "DAE", "3MF", "PLY"],
        "DAE": ["OBJ", "STL", "FBX", "GLB/GLTF", "3MF", "PLY"],
        "3DS": ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"],
        "X": ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"],
        "3MF": ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "PLY"],
        "OFF": ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"],
        "AC3D": ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF", "PLY"],
        "PLY": ["OBJ", "STL", "FBX", "GLB/GLTF", "DAE", "3MF"]
      },
      accept: {
        "OBJ": ".obj,model/obj",
        "STL": ".stl,model/stl",
        "FBX": ".fbx",
        "GLB/GLTF": ".glb,.gltf,model/gltf-binary,model/gltf+json",
        "DAE": ".dae,model/vnd.collada+xml",
        "3DS": ".3ds",
        "X": ".x",
        "3MF": ".3mf,model/3mf",
        "OFF": ".off",
        "AC3D": ".ac",
        "PLY": ".ply,application/x-ply"
      }
    },
    cad: {
      id: "cad",
      title: "CAD Converter",
      navGroup: "CAD Industrial",
      navHint: "STEP · IGES · SolidWorks…",
      pageTitle: "Free CAD Converter Online",
      subtitle: "Convert CAD files between popular formats like STEP, IGES, CATIA, NX, SolidWorks and more. Simply upload your file, choose an output format, and convert it online in seconds.",
      cardDesc: "In CAD scenarios, convert STEP, IGES, CATIA V5, NX, Creo, SolidWorks, Parasolid, Inventor, JT, PRC, ACIS, and Solid Edge to STEP, GLB/GLTF, FBX, OBJ, and STL.",
      toolVerb: "convert your CAD files",
      category: "3d-conversion",
      iconShort: "CAD",
      inputs: ["STEP", "IGES", "CATIA V5", "NX", "Creo", "SolidWorks", "Parasolid", "Inventor", "JT", "PRC", "ACIS", "Solid Edge"],
      outputs: ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
      defaultFrom: "STEP",
      defaultTo: "GLB/GLTF",
      allowed: {
        "STEP": ["GLB/GLTF", "FBX", "OBJ", "STL"],
        "IGES": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "CATIA V5": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "NX": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "Creo": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "SolidWorks": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "Parasolid": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "Inventor": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "JT": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "PRC": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "ACIS": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"],
        "Solid Edge": ["STEP", "GLB/GLTF", "FBX", "OBJ", "STL"]
      },
      accept: {
        "STEP": ".step,.stp",
        "IGES": ".iges,.igs",
        "CATIA V5": ".catpart,.catproduct,.cgr",
        "NX": ".prt",
        "Creo": ".prt,.asm",
        "SolidWorks": ".sldprt,.sldasm",
        "Parasolid": ".x_t,.x_b",
        "Inventor": ".ipt,.iam",
        "JT": ".jt",
        "PRC": ".prc",
        "ACIS": ".sat,.sab",
        "Solid Edge": ".par,.psm,.asm"
      }
    },
    bim: {
      id: "bim",
      title: "BIM Converter",
      navGroup: "BIM & Architecture",
      navHint: "IFC · Revit · AutoCAD…",
      pageTitle: "Free BIM Converter Online",
      subtitle: "Convert BIM files from formats like IFC, Revit, Navisworks, DWF and more to GLB, FBX, OBJ or STL. Simply upload your file, choose an output format, and convert it online in seconds.",
      cardDesc: "In BIM scenarios, convert IFC, Revit, Navisworks, DWF, AutoCAD, and SKP to GLB/GLTF, FBX, OBJ, and STL.",
      toolVerb: "convert your BIM files",
      category: "3d-conversion",
      iconShort: "BIM",
      inputs: ["IFC", "Revit", "Navisworks", "DWF", "AutoCAD", "SKP"],
      outputs: ["GLB/GLTF", "FBX", "OBJ", "STL"],
      defaultFrom: "IFC",
      defaultTo: "GLB/GLTF",
      allowed: {
        "IFC": ["GLB/GLTF", "FBX", "OBJ", "STL"],
        "Revit": ["GLB/GLTF", "FBX", "OBJ", "STL"],
        "Navisworks": ["GLB/GLTF", "FBX", "OBJ", "STL"],
        "DWF": ["GLB/GLTF", "FBX", "OBJ", "STL"],
        "AutoCAD": ["GLB/GLTF", "FBX", "OBJ", "STL"],
        "SKP": ["GLB/GLTF", "FBX", "OBJ", "STL"]
      },
      accept: {
        "IFC": ".ifc",
        "Revit": ".rvt,.rfa",
        "Navisworks": ".nwd,.nwc",
        "DWF": ".dwf,.dwfx",
        "AutoCAD": ".dwg,.dxf",
        "SKP": ".skp"
      }
    }
  };

  const TITLE_TO_HUB = {
    "Mesh Converter": "mesh",
    "CAD Converter": "cad",
    "BIM Converter": "bim"
  };

  function getHub(idOrTitle) {
    if (HUBS[idOrTitle]) return HUBS[idOrTitle];
    const id = TITLE_TO_HUB[idOrTitle];
    return id ? HUBS[id] : null;
  }

  function canConvert(hubId, from, to) {
    const hub = HUBS[hubId];
    if (!hub) return false;
    const outs = hub.allowed[from];
    return Array.isArray(outs) && outs.includes(to);
  }

  function firstAllowedTo(hubId, from, preferred) {
    const hub = HUBS[hubId];
    const outs = hub?.allowed[from] || [];
    if (preferred && outs.includes(preferred)) return preferred;
    return outs[0] || hub.defaultTo;
  }

  function firstAllowedFrom(hubId, to, preferred) {
    const hub = HUBS[hubId];
    const inputs = (hub?.inputs || []).filter((from) => canConvert(hubId, from, to));
    if (preferred && inputs.includes(preferred)) return preferred;
    return inputs[0] || hub.defaultFrom;
  }

  function acceptFor(hubId, format) {
    const hub = HUBS[hubId];
    return hub?.accept?.[format] || "*/*";
  }

  function pageForHub(hubId) {
    const map = {
      mesh: "tools/mesh-converter.html",
      cad: "tools/cad-converter.html",
      bim: "tools/bim-converter.html"
    };
    const page = map[hubId] || `tools/${hubId}-converter.html`;
    if (global.WPSToolCatalog?.resolvePage) return global.WPSToolCatalog.resolvePage(page);
    return page;
  }

  global.WPSFormatHubs3D = {
    HUBS,
    TITLE_TO_HUB,
    getHub,
    canConvert,
    firstAllowedTo,
    firstAllowedFrom,
    acceptFor,
    pageForHub
  };
})(typeof window !== "undefined" ? window : globalThis);
