import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const i18n = read("src/runtime/tool-i18n.js");
const runtimeIndex = read("src/runtime/index.js");
const toolBoot = read("src/runtime/tool-boot.js");
const siteChrome = read("src/components/site/SiteChrome.vue");
const headerChrome = read("src/components/site/HeaderChrome.vue");
const homepageBehavior = read("src/runtime/homepage-behavior.js");
const homepageStyles = read("src/styles/homepage.css");
const siteChromeStyles = read("site-chrome.css");
const siteNav3D = read("src/runtime/site-nav-3d.js");

assert.match(runtimeIndex, /import "\.\/tool-i18n\.js";/, "Tool runtime must load the Traditional Chinese localization layer.");
assert.match(i18n, /"Drop PDF files here": "將 PDF 檔案拖放到這裡"/, "Upload copy must have a Traditional Chinese translation.");
assert.match(i18n, /"Compressing\.\.\.": "壓縮中\.\.\."/);
assert.match(i18n, /"Compression succeeded!": "壓縮成功！"/);
assert.match(i18n, /"Download WPS Office": "下載 WPS Office"/);
assert.match(i18n, /"Back": "返回"/);
assert.match(i18n, /"Unlimited use with WPS Pro\+": "WPS Pro\+ 無限使用"/);
assert.match(i18n, /"Download WPS Office to view and edit the converted file in WPS Drive\.": "下载 WPS Office，在 WPS Drive 中查看和编辑转换后的文件"/);
assert.match(i18n, /"Upgrade": "升級"/);
assert.match(i18n, /"Cancel Current Task\?": "取消目前工作？"/);
assert.match(i18n, /source\.match\(\/\^Online:/, "Online quota must translate dynamic remaining-use text.");
assert.match(i18n, /"Sign in": "登入"/, "Sign in action must be translated in Traditional Chinese.");
assert.match(
  i18n,
  /"Need more free uses\? Visit": "次數不夠？訪問"/,
  "Quota-bar WPS AI lead copy must have Traditional Chinese.",
);
assert.match(i18n, /"to keep using for free": "繼續免費使用"/, "Quota-bar WPS AI tail copy must explain free continued use.");
const toolPage = read("src/components/tool/ToolPage.vue");
assert.match(toolPage, /class="tool-quota-wps-ai"/, "Official quota bar must keep a non-clickable WPS AI capsule.");
assert.doesNotMatch(toolPage, /class="tool-quota-wps-ai" href=/, "The WPS AI capsule itself must not be a link.");
assert.match(
  toolPage,
  /asset\('images\/legacy\/wps-ai-logo-official\.svg'\)/,
  "Quota-bar mark must use the official www.wps.ai header logo asset.",
);
assert.match(toolPage, /title="https:\/\/www\.wps\.ai"/, "The site link must expose the www.wps.ai URL.");
assert.match(toolPage, />\s*WPS\.AI\s*/, "The clickable label must show the WPS.AI domain.");
assert.match(toolPage, /<QuotaControls :official="true" \/>/, "Local quota sign-in capsule must stay on the official tool page.");
assert.match(
  read("src/components/tool/QuotaControls.vue"),
  /data-quota-sign-in/,
  "Sign in must keep the local quota sign-in hook.",
);
assert.match(i18n, /source\.match\(\/\^WPS Drive:/, "WPS Drive quota must translate dynamic remaining-use text.");
assert.match(i18n, /new MutationObserver\(queueApply\)/, "Runtime-rendered workflow states must be translated after DOM updates.");
assert.match(i18n, /attributeRecords/, "Accessible labels and titles must follow the selected language.");
assert.match(i18n, /let activeLanguage = "zh-tw"/, "Tool pages must default to Traditional Chinese.");
assert.match(i18n, /let saved = routeLocale\(\) === "en" \? "en" : "zh-tw"/, "First visit must fall back to Traditional Chinese.");
assert.match(i18n, /localizedPath\(nextLocale\)/, "Language changes must update the locale segment in the URL.");
assert.ok(i18n.includes("\\/zh\\/pdf-tools"), "Traditional Chinese tool pages must use the verified /zh/ locale path.");
assert.match(i18n, /routeLocale\(\) === "en"/, "The explicit English URL must remain an English entry point.");
assert.match(i18n, /function isHomepage\(\)/, "Tool i18n must detect homepage routes that have no /en|/zh/pdf-tools locale.");
assert.match(i18n, /if \(!document\.body \|\| isHomepage\(\)\) return/, "Tool i18n must not observe or rewrite homepage copy.");
assert.match(i18n, /WPSHomepageI18n\?\.setLanguage/, "Homepage language choices must delegate to the homepage i18n owner.");
assert.match(homepageBehavior, /\["PDF Tools"/, "Homepage header PDF Tools label must have translations.");
assert.match(homepageBehavior, /\["en", "English"\],\s*\["zh-tw", "繁體中文"\]/, "Homepage language menu must only offer English and Traditional Chinese.");
assert.doesNotMatch(headerChrome, /data-lang="zh-cn"|data-lang="de"/, "Header language menu must only keep English and Traditional Chinese.");
assert.match(headerChrome, /data-lang="zh-tw">繁體中文/, "Header language menu must keep Traditional Chinese.");
assert.match(siteChrome, /WPSToolI18n\?\.setLanguage\(link\.dataset\.lang \|\| "en"\)/, "Header and footer language choices must update the tool page.");
assert.doesNotMatch(homepageBehavior, /headerLanguageButton\?\.addEventListener\("click"/, "Homepage must not bind a second click handler to the shared header language button.");
assert.match(siteChrome, /win\.WPSToolI18n\?\.init\(\)/, "Tool pages must restore the saved language on startup.");
assert.match(toolBoot, /global\.WPSToolI18n\?\.init\(\)/, "Runtime hero updates must not reset the localized document title.");
assert.match(headerChrome, /class="nav-link nav-wps-ai" href="https:\/\/www\.wps\.ai" target="_blank" rel="noopener noreferrer"/, "The desktop header must provide a safe WPS AI link.");
assert.match(headerChrome, /<img class="nav-wps-ai__mark" :src="asset\('images\/legacy\/wps-ai-mark\.svg'\)" alt="">/, "The WPS AI link must render the official-style WPS AI mark.");
assert.match(headerChrome, /<span class="nav-wps-ai__label">WPS AI<\/span>/, "The WPS AI link must show a readable label beside the mark.");
assert.match(siteChromeStyles, /@keyframes nav-wps-ai-breathe/, "The WPS AI link must use a breathing animation.");
assert.match(siteChromeStyles, /prefers-reduced-motion: reduce/, "The WPS AI animation must respect reduced-motion preferences.");
assert.match(siteNav3D, /nav-dropdown-footer nav-dropdown-footer--3d/, "The 3D dropdown footer must opt out of the divider treatment.");
assert.match(siteNav3D, /nav-all-tools-link nav-all-tools-link--icon/, "The 3D dropdown must use the icon-style All Tools link.");
assert.match(siteChromeStyles, /\.nav-dropdown-footer--3d \{[^}]*border-top: 0;/, "The 3D dropdown footer must not render a divider.");
assert.match(siteChromeStyles, /\.desktop-nav \{[^}]*overflow: visible/, "Header nav must not clip dropdown panels.");
assert.match(homepageStyles, /\.desktop-nav \{[^}]*overflow: visible/, "Homepage header nav must not clip dropdown panels.");

console.log("Tool Traditional Chinese i18n contracts passed.");
