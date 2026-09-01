const TOOL_PATH_RE = /^(?:tools|en\/pdf-tools)\/([^/?#]+)(?:\.html)?(?:\/)?(?:([?#].*))?$/i;

export function toolUrl(slug) {
  const canonicalSlug = slug === "signing-pdf" ? "sign-pdf" : slug;
  return `/en/pdf-tools/${encodeURIComponent(canonicalSlug)}/`;
}

export function normalizeSiteHref(href, base = siteBase()) {
  if (!href || href === "#") return href || "#";
  if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(href)) return href;

  const clean = href.replace(/^\.?\//, "");
  const toolMatch = clean.match(TOOL_PATH_RE);
  if (toolMatch) return `${base}${toolUrl(decodeURIComponent(toolMatch[1])).replace(/^\//, "")}${toolMatch[2] || ""}`;
  if (/^homepage\.html(?:#.*)?$/i.test(clean)) return `${base}${clean.replace(/^homepage\.html/i, "") || ""}`;
  return href;
}

export function siteBase(pathname = window.location.pathname) {
  if (/\/en\/pdf-tools\/[^/]+(?:\/|$)/i.test(pathname)) return "../../../";
  return /\/tools\/[^/]+(?:\/|$)/i.test(pathname) ? "../../" : "";
}

export function assetUrl(assetPath, base = siteBase()) {
  if (!assetPath || /^(?:https?:|data:|\/\/|\/)/i.test(assetPath)) return assetPath;
  return `${base}${assetPath}`;
}
