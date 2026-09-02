import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src", "runtime", "tool-quota-modals.js"), "utf8");
const quotaFlowSource = fs.readFileSync(path.join(root, "src", "runtime", "tool-quota-flow.js"), "utf8");
const toolPageSource = fs.readFileSync(path.join(root, "src", "runtime", "tool-page.js"), "utf8");
const workflowSource = fs.readFileSync(path.join(root, "src", "runtime", "tool-workflows-extra.js"), "utf8");
const linksSource = fs.readFileSync(path.join(root, "src", "runtime", "wps-links.js"), "utf8");
const start = source.indexOf("function ensureQuotaExhaustedModal()");
const end = source.indexOf("/** 图3", start);
assert.ok(start >= 0 && end > start, "quota exhausted modal factory must exist");

const modalSource = source.slice(start, end);
assert.match(modalSource, /className\s*=\s*"continer-wrap is-guest-login"/);
assert.match(modalSource, /class="guest-login-dialog"/);
assert.match(modalSource, />Unlock more</);
assert.match(modalSource, /Sign in/);
assert.match(source, /colSignedIn: "Signed-in"/);
assert.match(source, /colClient: "WPS Office"/);
assert.match(source, /Daily uses", signedIn: "1\/day", client: "5\/day"/);
assert.match(source, /download: "Download"/, "Quota modal download action must use the concise Download label.");
assert.doesNotMatch(source, /colGuest: "Guest"/);
assert.match(modalSource, /data-quota-sign-in/);
assert.match(modalSource, /BUY_CTA/);
assert.match(modalSource, /intro-r2525\.svg/);
assert.match(modalSource, /upgrade-union\.svg/);
assert.doesNotMatch(modalSource, /Free Download/);

const loginStart = source.indexOf("function ensureLoginRequiredModal()");
const loginEnd = source.indexOf("/** 图3", loginStart);
assert.ok(loginStart >= 0 && loginEnd > loginStart, "unauthenticated PDF login modal factory must exist");
const loginModalSource = source.slice(loginStart, loginEnd);
assert.match(loginModalSource, /id\s*=\s*"login-required-modal"/);
assert.match(loginModalSource, />Sign in to continue</);
assert.match(loginModalSource, /Sign in to continue processing your file/);
assert.match(loginModalSource, /data-login-required-sign-in/);
assert.match(source, /interceptUnauthenticatedPdf/);
assert.match(source, /const resume = loginContinuation/);
assert.match(source, /resume\?\.\(\)/);
assert.match(toolPageSource, /btnSelectFile\?\.addEventListener\("click", \(\) => \{[\s\S]*?els\.fileInput\.click\(\)/);
const startUploadStart = toolPageSource.indexOf("async function startUpload(files)");
const startUploadEnd = toolPageSource.indexOf("function resetWorkspace()", startUploadStart);
assert.ok(startUploadStart >= 0 && startUploadEnd > startUploadStart, "shared upload handler must exist");
assert.match(
  toolPageSource.slice(startUploadStart, startUploadEnd),
  /if \(isCompressShell\(\)\)[\s\S]*?startCompressUpload\(list\);[\s\S]*?return;[\s\S]*?interceptUnauthenticatedPdf/,
  "Official compression upload must bypass login and quota validation until processing."
);
const compressProcessStart = toolPageSource.indexOf("async function startCompressProcess()");
const compressProcessEnd = toolPageSource.indexOf("async function startUpload(files)", compressProcessStart);
assert.match(
  toolPageSource.slice(compressProcessStart, compressProcessEnd),
  /interceptUnauthenticatedPdf\?\.\(processFiles, \(\) => startCompressProcess\(\)\)/,
  "Compression must gate unauthenticated users when processing starts."
);
assert.match(toolPageSource, /if \(els\.quotaBadge\)[\s\S]*?state\?\.loggedIn[\s\S]*?global\.WPSLinks\?\.openSignIn/, "Signed-out quota badge clicks must open sign-in.");
assert.match(toolPageSource, /clientOnlyResult \? "Open with WPS Office" : "Download"/, "Client-only results must use the WPS Office action label.");
assert.match(toolPageSource, /else directDownload\.textContent = labelText/, "Client-only action label must also work without a nested label span.");
assert.match(toolPageSource, /Your converted file is saved to WPS Drive\. Download and use WPS Office to view and edit it in Cloud Documents\./, "Client-only results must explain the Cloud Documents destination.");
assert.match(workflowSource, /function acceptFiles\(files\)[\s\S]*?onFiles\(list\)/);
assert.doesNotMatch(workflowSource.slice(workflowSource.indexOf("function acceptFiles(files)"), workflowSource.indexOf("els.btnSelectFile", workflowSource.indexOf("function acceptFiles(files)"))), /interceptUnauthenticatedPdf|interceptUpload/, "Specialized upload must not gate before processing.");
assert.match(workflowSource, /function tryStartProcess\(files, onLogin\)/);
assert.match(workflowSource, /tryStartProcess\(\[sourceFile\], \(\) => extractPages\(asOne\)\)/);
assert.match(workflowSource, /tryStartProcess\(mergeFiles\.map\(\(item\) => item\.file\), runMerge\)/);
assert.match(workflowSource, /tryStartProcess\(\[sourceFile\], finishSign\)/);
assert.match(workflowSource, /els\.fileInput\?\.addEventListener\("change"/);
assert.match(workflowSource, /if \(els\.quotaBadge\)[\s\S]*?state\?\.loggedIn[\s\S]*?Links\(\)\?\.openSignIn/, "Specialized workflows must share signed-out quota badge behavior.");
assert.match(linksSource, /function openSignIn\(\) \{[\s\S]*?WPSQuotaFlow[\s\S]*?\.login\?\./);
assert.match(linksSource, /const clientQuotaText = document\.getElementById\("client-quota-text"\)/);
assert.match(linksSource, /clientQuotaText\.textContent = `WPS Office: \$\{state\.clientUsesRemaining\} uses left`/);
assert.match(quotaFlowSource, /STORAGE_KEY = "wps_pdf_quota_demo_v3"/);
assert.match(quotaFlowSource, /loggedIn: false/);

console.log("PASS quota and login modal contracts are up to date.");
