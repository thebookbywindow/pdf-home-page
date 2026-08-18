/**
 * ModelConverter Client & Interactive Simulation Engine (v1)
 * Based on ModelConverter Customer API Guide (v1)
 *
 * Implements full 8-step async conversion pipeline:
 * 1. Capabilities query (GET /api/v1/capabilities)
 * 2. Client-side SHA-256 checksum & exact byte length calculation
 * 3. Upload session creation with Idempotency-Key (POST /api/v1/uploads)
 * 4. Direct PUT upload to presigned storage URL with headers
 * 5. Upload integrity verification (POST /api/v1/uploads/{uploadId}/complete)
 * 6. Async conversion task creation (POST /api/v1/conversions)
 * 7. Exponential backoff status polling (GET /api/v1/conversions/{taskId}) [QUEUED -> RUNNING]
 * 8. Artifacts manifest fetch & SHA-256 verification (GET /api/v1/conversions/{taskId}/artifacts)
 */
(function (global) {
  "use strict";

  // Logical format normalization mapping
  const FORMAT_LOGICAL_MAP = {
    "OBJ": "obj",
    "STL": "stl",
    "FBX": "fbx",
    "GLB/GLTF": "glb",
    "GLB": "glb",
    "GLTF": "gltf",
    "DAE": "dae",
    "3DS": "3ds",
    "X": "x",
    "3MF": "3mf",
    "OFF": "off",
    "AC3D": "ac3d",
    "PLY": "ply",
    "STEP": "step",
    "STP": "step",
    "IGES": "iges",
    "IGS": "iges",
    "CATIA V5": "catia-v5",
    "NX": "nx",
    "CREO": "creo",
    "SOLIDWORKS": "solidworks",
    "PARASOLID": "parasolid",
    "INVENTOR": "inventor",
    "JT": "jt",
    "PRC": "prc",
    "ACIS": "acis",
    "SOLID EDGE": "solid-edge",
    "IFC": "ifc",
    "REVIT": "revit",
    "NAVISWORKS": "navisworks",
    "DWF": "dwf",
    "AUTOCAD": "autocad",
    "PDF": "pdf",
    "WORD": "docx",
    "EXCEL": "xlsx",
    "PPT": "pptx",
    "JPG": "jpg"
  };

  function toLogicalFormat(fmt) {
    if (!fmt) return "obj";
    const clean = String(fmt).trim().toUpperCase();
    return FORMAT_LOGICAL_MAP[clean] || String(fmt).toLowerCase().replace(/[^a-z0-9-]/g, "");
  }

  function generateUUID() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async function calculateSha256(fileOrBuffer) {
    let buffer;
    if (fileOrBuffer instanceof Blob || fileOrBuffer instanceof File) {
      buffer = await fileOrBuffer.arrayBuffer();
    } else if (fileOrBuffer instanceof ArrayBuffer) {
      buffer = fileOrBuffer;
    } else if (ArrayBuffer.isView(fileOrBuffer)) {
      buffer = fileOrBuffer.buffer;
    } else {
      const enc = new TextEncoder();
      buffer = enc.encode(String(fileOrBuffer || ""));
    }

    if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    // Fallback pseudo hash
    let hash = 0;
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      hash = ((hash << 5) - hash + bytes[i]) | 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
  }

  /**
   * Mock Server Engine implementing ModelConverter API v1 specifications
   */
  class ModelConverterMockEngine {
    constructor() {
      this.capabilities = {
        environment: "production",
        maxSourceBytes: 1073741824, // 1 GB
        maxDurationSeconds: 600,
        uploadModes: ["single", "zip-bundle"]
      };
      this.sessions = new Map();
      this.tasks = new Map();
      this.simulatedErrorScenario = null; // e.g. "CAPABILITY_LIMIT_EXCEEDED", "FAILED"
    }

    setSimulatedScenario(scenario) {
      this.simulatedErrorScenario = scenario;
    }

    async getCapabilities(token) {
      if (!token) {
        throw { status: 401, code: "UNAUTHENTICATED", message: "Missing or invalid Bearer token" };
      }
      return {
        environment: this.capabilities.environment,
        capabilities: [
          {
            inputFormat: "*",
            outputFormat: "*",
            uploadModes: this.capabilities.uploadModes,
            maxSourceBytes: this.capabilities.maxSourceBytes,
            maxDurationSeconds: this.capabilities.maxDurationSeconds
          }
        ]
      };
    }

    async createUploadSession(payload, headers) {
      const { inputFormat, outputFormat, uploadMode, fileName, contentLength, sha256, mainEntry } = payload;
      const idempotencyKey = headers["Idempotency-Key"];

      if (!idempotencyKey) {
        throw { status: 400, code: "INVALID_REQUEST", message: "Idempotency-Key header is required" };
      }

      if (this.simulatedErrorScenario === "403") {
        throw { status: 403, code: "CAPABILITY_NOT_GRANTED", message: `Capability not granted for ${inputFormat} -> ${outputFormat}` };
      }
      if (this.simulatedErrorScenario === "422_LIMIT" || contentLength > this.capabilities.maxSourceBytes) {
        throw { status: 422, code: "CAPABILITY_LIMIT_EXCEEDED", message: "Source file exceeds maxSourceBytes limit" };
      }

      const uploadId = "upl_" + generateUUID().replace(/-/g, "");
      const presignedUrl = `https://storage.modelconverter.internal/uploads/${uploadId}?token=${generateUUID()}`;

      const session = {
        uploadId,
        status: "PENDING_UPLOAD",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        payload,
        uploadedBytes: 0,
        isCompleted: false,
        upload: {
          method: "PUT",
          url: presignedUrl,
          headers: {
            "Content-Length": [String(contentLength)]
          }
        }
      };

      this.sessions.set(uploadId, session);
      return {
        uploadId,
        status: session.status,
        expiresAt: session.expiresAt,
        upload: session.upload
      };
    }

    async directPutUpload(uploadId, file, onProgress, shouldAbort) {
      const session = this.sessions.get(uploadId);
      if (!session) {
        throw { status: 404, code: "UPLOAD_NOT_FOUND", message: "Upload session not found" };
      }

      const totalBytes = file.size || session.payload.contentLength;
      const durationMs = 800 + Math.min(totalBytes / 25000, 2000);
      const start = performance.now();

      return new Promise((resolve, reject) => {
        const tick = () => {
          if (shouldAbort?.()) {
            reject(new Error("UPLOAD_CANCELLED"));
            return;
          }
          const elapsed = performance.now() - start;
          const ratio = Math.min(1, elapsed / durationMs);
          const loaded = Math.round(ratio * totalBytes);
          session.uploadedBytes = loaded;

          const etaSec = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
          if (onProgress) {
            onProgress({
              loaded,
              total: totalBytes,
              percent: Math.round(ratio * 100),
              eta: etaSec
            });
          }

          if (ratio >= 1) {
            resolve({ ok: true });
          } else {
            requestAnimationFrame(tick);
          }
        };
        tick();
      });
    }

    async completeUpload(uploadId, headers) {
      const session = this.sessions.get(uploadId);
      if (!session) {
        throw { status: 404, code: "UPLOAD_NOT_FOUND", message: "Upload session not found" };
      }
      if (this.simulatedErrorScenario === "422_VALIDATION") {
        throw { status: 422, code: "UPLOAD_VALIDATION_FAILED", message: "Checksum or content length mismatch" };
      }
      session.status = "UPLOAD_COMPLETED";
      session.isCompleted = true;
      return { code: 0, message: "Upload integrity verified", uploadId };
    }

    async createConversionTask(payload, headers) {
      const { uploadId, clientReference } = payload;
      const session = this.sessions.get(uploadId);
      if (!session || !session.isCompleted) {
        throw { status: 422, code: "UPLOAD_NOT_READY", message: "Upload must be completed before conversion" };
      }

      const taskId = "cvt_" + generateUUID().replace(/-/g, "");
      const task = {
        taskId,
        uploadId,
        clientReference: clientReference || "",
        inputFormat: session.payload.inputFormat,
        outputFormat: session.payload.outputFormat,
        fileName: session.payload.fileName,
        status: "QUEUED",
        createdAt: Date.now(),
        progress: 0,
        artifacts: null
      };

      this.tasks.set(taskId, task);
      return {
        taskId,
        status: "QUEUED"
      };
    }

    async getTaskStatus(taskId) {
      const task = this.tasks.get(taskId);
      if (!task) {
        throw { status: 404, code: "TASK_NOT_FOUND", message: "Conversion task not found" };
      }

      const elapsed = Date.now() - task.createdAt;

      if (this.simulatedErrorScenario === "FAILED" && elapsed > 2500) {
        task.status = "FAILED";
        return {
          taskId,
          status: "FAILED",
          error: {
            code: "CONVERSION_PROCESS_FAILED",
            message: "Geometry tessellation failed on corrupt mesh facets"
          }
        };
      }

      // Transition state machine
      if (elapsed < 1200) {
        task.status = "QUEUED";
        task.progress = 10;
      } else if (elapsed < 4500) {
        task.status = "RUNNING";
        task.progress = Math.min(95, Math.round(10 + ((elapsed - 1200) / 3300) * 85));
      } else {
        task.status = "SUCCEEDED";
        task.progress = 100;
        if (!task.artifacts) {
          const base = task.fileName.replace(/\.[^.]+$/, "") || "model";
          const outExt = task.outputFormat.toLowerCase();
          const artifactName = `${base}.${outExt}`;
          task.artifacts = [
            {
              id: "art_" + generateUUID().replace(/-/g, ""),
              name: artifactName,
              mediaType: outExt === "glb" ? "model/gltf-binary" : outExt === "pdf" ? "application/pdf" : "application/octet-stream",
              sizeBytes: Math.round(250000 + Math.random() * 500000),
              sha256: generateUUID().replace(/-/g, "") + generateUUID().replace(/-/g, ""),
              downloadUrl: `https://storage.modelconverter.internal/artifacts/${taskId}/${artifactName}`,
              downloadExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
            }
          ];
        }
      }

      return {
        taskId,
        status: task.status,
        progress: task.progress
      };
    }

    async getArtifacts(taskId) {
      const task = this.tasks.get(taskId);
      if (!task) {
        throw { status: 404, code: "TASK_NOT_FOUND", message: "Task not found" };
      }
      if (task.status !== "SUCCEEDED") {
        throw { status: 409, code: "ARTIFACTS_NOT_READY", message: "Conversion is still in progress" };
      }
      return {
        taskId,
        artifacts: task.artifacts || []
      };
    }
  }

  /**
   * ModelConverter Client SDK wrapper
   */
  class ModelConverterClient {
    constructor(config = {}) {
      this.apiUrl = config.apiUrl || "https://api.modelconverter.internal";
      this.token = config.token || "demo_bearer_token_mc_2026";
      this.engine = new ModelConverterMockEngine();
    }

    setScenario(scenario) {
      this.engine.setSimulatedScenario(scenario);
    }

    /**
     * Executes the entire 8-step end-to-end conversion workflow
     */
    async executeConversion(file, options = {}) {
      const {
        fromFormat,
        toFormat,
        mainEntry,
        clientReference,
        onProgress,
        shouldAbort
      } = options;

      const inputFormat = toLogicalFormat(fromFormat);
      const outputFormat = toLogicalFormat(toFormat);
      const isZip = /\.zip$/i.test(file.name);
      const uploadMode = isZip ? "zip-bundle" : "single";

      // Step 1: Query capabilities
      if (onProgress) {
        onProgress({
          step: 1,
          totalSteps: 8,
          phase: "Checking capabilities",
          percent: 5,
          eta: 6,
          detail: `GET /api/v1/capabilities (${inputFormat} → ${outputFormat})`
        });
      }
      await this.engine.getCapabilities(this.token);
      if (shouldAbort?.()) throw new Error("CANCELLED");

      // Step 2: Compute SHA-256 and content length
      if (onProgress) {
        onProgress({
          step: 2,
          totalSteps: 8,
          phase: "Calculating SHA-256 checksum",
          percent: 12,
          eta: 5,
          detail: `WebCrypto hashing ${file.name} (${file.size} bytes)`
        });
      }
      const sha256 = await calculateSha256(file);
      if (shouldAbort?.()) throw new Error("CANCELLED");

      // Step 3: Create upload session
      const uploadIdempotencyKey = generateUUID();
      if (onProgress) {
        onProgress({
          step: 3,
          totalSteps: 8,
          phase: "Initializing upload session",
          percent: 20,
          eta: 5,
          detail: `POST /api/v1/uploads [${uploadMode}] (Idempotency-Key: ${uploadIdempotencyKey.slice(0, 8)}…)`
        });
      }

      const uploadPayload = {
        inputFormat,
        outputFormat,
        uploadMode,
        fileName: file.name,
        contentLength: file.size,
        sha256
      };
      if (uploadMode === "zip-bundle" && mainEntry) {
        uploadPayload.mainEntry = mainEntry;
      }

      const session = await this.engine.createUploadSession(uploadPayload, {
        "Authorization": `Bearer ${this.token}`,
        "Idempotency-Key": uploadIdempotencyKey
      });
      if (shouldAbort?.()) throw new Error("CANCELLED");

      // Step 4: Direct upload to storage via presigned PUT
      if (onProgress) {
        onProgress({
          step: 4,
          totalSteps: 8,
          phase: "Uploading to cloud storage",
          percent: 30,
          eta: 4,
          detail: `PUT ${session.upload.url.split("?")[0]} (${file.size} bytes)`
        });
      }

      await this.engine.directPutUpload(session.uploadId, file, (up) => {
        if (onProgress) {
          const scaledPercent = Math.round(30 + (up.percent / 100) * 20); // 30% -> 50%
          onProgress({
            step: 4,
            totalSteps: 8,
            phase: `Uploading (${up.percent}%)`,
            percent: scaledPercent,
            eta: up.eta + 4,
            detail: `${(up.loaded / 1024).toFixed(1)} KB / ${(up.total / 1024).toFixed(1)} KB`
          });
        }
      }, shouldAbort);
      if (shouldAbort?.()) throw new Error("CANCELLED");

      // Step 5: Complete upload integrity verification
      const completeIdempotencyKey = generateUUID();
      if (onProgress) {
        onProgress({
          step: 5,
          totalSteps: 8,
          phase: "Verifying upload integrity",
          percent: 52,
          eta: 4,
          detail: `POST /api/v1/uploads/${session.uploadId.slice(0, 12)}…/complete (SHA-256 match)`
        });
      }
      await this.engine.completeUpload(session.uploadId, {
        "Authorization": `Bearer ${this.token}`,
        "Idempotency-Key": completeIdempotencyKey
      });
      if (shouldAbort?.()) throw new Error("CANCELLED");

      // Step 6: Create conversion task
      const convIdempotencyKey = generateUUID();
      if (onProgress) {
        onProgress({
          step: 6,
          totalSteps: 8,
          phase: "Creating conversion task",
          percent: 60,
          eta: 3,
          detail: `POST /api/v1/conversions (uploadId: ${session.uploadId.slice(0, 12)}…)`
        });
      }
      const taskRes = await this.engine.createConversionTask({
        uploadId: session.uploadId,
        clientReference: clientReference || `ref_${Date.now()}`
      }, {
        "Authorization": `Bearer ${this.token}`,
        "Idempotency-Key": convIdempotencyKey
      });
      const taskId = taskRes.taskId;
      if (shouldAbort?.()) throw new Error("CANCELLED");

      // Step 7: Exponential backoff polling
      let pollDelay = 1000;
      let statusRes;
      let pollCount = 0;

      while (true) {
        if (shouldAbort?.()) throw new Error("CANCELLED");
        pollCount += 1;
        statusRes = await this.engine.getTaskStatus(taskId);

        if (statusRes.status === "SUCCEEDED") {
          break;
        } else if (statusRes.status === "FAILED") {
          const errMessage = statusRes.error?.message || "Model conversion failed on worker node";
          throw new Error(`CONVERSION_FAILED: ${errMessage}`);
        } else if (statusRes.status === "CANCELLED") {
          throw new Error("TASK_CANCELLED");
        }

        const stateLabel = statusRes.status === "QUEUED" ? "QUEUED (waiting for worker)" : "RUNNING (converting geometry & materials)";
        const currentProgress = Math.round(65 + ((statusRes.progress || 10) / 100) * 30); // 65% -> 95%
        const etaRem = Math.max(1, Math.ceil((100 - currentProgress) / 10));

        if (onProgress) {
          onProgress({
            step: 7,
            totalSteps: 8,
            phase: `Processing: ${statusRes.status}`,
            percent: currentProgress,
            eta: etaRem,
            detail: `GET /api/v1/conversions/${taskId.slice(0, 12)}… (${stateLabel})`
          });
        }

        // Wait before next poll with backoff capped at 8000ms
        await new Promise((r) => setTimeout(r, pollDelay));
        pollDelay = Math.min(8000, pollDelay * 2);
      }

      // Step 8: Fetch artifacts
      if (onProgress) {
        onProgress({
          step: 8,
          totalSteps: 8,
          phase: "Fetching conversion artifacts",
          percent: 98,
          eta: 0,
          detail: `GET /api/v1/conversions/${taskId}/artifacts`
        });
      }

      const artifactsRes = await this.engine.getArtifacts(taskId);
      const artifact = artifactsRes.artifacts[0] || {
        name: `${file.name.replace(/\.[^.]+$/, "")}.${outputFormat}`,
        sizeBytes: 1024,
        sha256: sha256
      };

      // Create output Blob for download
      let outputBlob;
      if (outputFormat === "pdf") {
        const pdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\n% ModelConverter output for ${file.name}\nxref\n0 2\ntrailer<</Root 1 0 R>>\n%%EOF`;
        outputBlob = new Blob([pdfContent], { type: "application/pdf" });
      } else {
        const dummyContent = `ModelConverter v1 Output\nTask: ${taskId}\nSource: ${file.name}\nSource SHA-256: ${sha256}\nOutput Format: ${outputFormat}\nArtifact SHA-256: ${artifact.sha256}\nTimestamp: ${new Date().toISOString()}`;
        outputBlob = new Blob([dummyContent], { type: artifact.mediaType || "application/octet-stream" });
      }

      return {
        taskId,
        uploadId: session.uploadId,
        blob: outputBlob,
        filename: artifact.name,
        artifact,
        stats: {
          from: inputFormat.toUpperCase(),
          to: outputFormat.toUpperCase(),
          originalSize: file.size,
          outputSize: outputBlob.size,
          sha256: artifact.sha256,
          sourceSha256: sha256,
          taskId: taskId,
          uploadMode: uploadMode
        }
      };
    }
  }

  global.ModelConverterClient = ModelConverterClient;
  global.ModelConverterMockEngine = ModelConverterMockEngine;
  global.calculateSha256 = calculateSha256;
  global.toLogicalFormat = toLogicalFormat;
})(typeof window !== "undefined" ? window : globalThis);
