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
assert.match(i18n, /source\.match\(\/\^WPS Drive:/, "WPS Drive quota must translate dynamic remaining-use text.");
assert.match(i18n, /new MutationObserver\(queueApply\)/, "Runtime-rendered workflow states must be translated after DOM updates.");
assert.match(i18n, /attributeRecords/, "Accessible labels and titles must follow the selected language.");
assert.match(i18n, /let activeLanguage = "zh-tw"/, "Tool pages must default to Traditional Chinese.");
assert.match(i18n, /let saved = routeLocale\(\) === "en" \? "en" : "zh-tw"/, "First visit must fall back to Traditional Chinese.");
assert.match(i18n, /localizedPath\(nextLocale\)/, "Language changes must update the locale segment in the URL.");
assert.ok(i18n.includes("\\/zh\\/pdf-tools"), "Traditional Chinese tool pages must use the verified /zh/ locale path.");
assert.match(i18n, /routeLocale\(\) === "en"/, "The explicit English URL must remain an English entry point.");
assert.match(siteChrome, /WPSToolI18n\?\.setLanguage\(link\.dataset\.lang \|\| "en"\)/, "Header and footer language choices must update the tool page.");
assert.match(siteChrome, /win\.WPSToolI18n\?\.init\(\)/, "Tool pages must restore the saved language on startup.");
assert.match(toolBoot, /global\.WPSToolI18n\?\.init\(\)/, "Runtime hero updates must not reset the localized document title.");

console.log("Tool Traditional Chinese i18n contracts passed.");
