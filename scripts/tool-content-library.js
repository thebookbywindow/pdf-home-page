/**
 * Per-slug marketing content for tool inner pages.
 * Uses crawled pdf.wps.com meta when available; otherwise accurate English copy.
 * Exposes window.WPSToolContentLibrary
 */
(function (global) {
  const DOCS = {
    compress: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/compress-pdf/",
    merge: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/merge-pdf/",
    split: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/split-pdf/",
    convert: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/convert-pdf/",
    pdfToWord: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/convert-pdf/pdf-to-word/",
    create: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/create-new-pdf/",
    blog: "https://pdf.wps.com/blog/"
  };

  const WHY_ICONS = {
    ratios: "images/tool-live/compress/why-ratios.svg",
    shield: "images/tool-live/compress/why-shield.svg",
    desktop: "images/tool-live/compress/why-desktop.svg"
  };

  const BLOG_IMGS = [
    "images/legacy/blog/blog-1.png",
    "images/legacy/blog/blog-2.png",
    "images/legacy/blog/blog-3.png"
  ];

  function why(title, items) {
    return {
      title,
      items: items.map((item) => ({
        icon: item.icon || WHY_ICONS.shield,
        title: item.title,
        body: item.body,
        href: item.href || DOCS.convert
      }))
    };
  }

  function guide(title, steps) {
    return { title, steps };
  }

  function faq(title, items) {
    return {
      title,
      items: items.map((item) => ({
        question: item.q,
        answerHtml: item.a,
        learnMore: item.more || DOCS.convert
      }))
    };
  }

  function singleFile3dFaq() {
    return {
      q: "Is batch conversion available?",
      a: "<p>No. The current 3D converter supports one file per conversion for all account types. Download the result, then start another conversion for the next model.</p>",
      more: DOCS.convert
    };
  }

  function blog(title, articles) {
    return {
      title,
      moreHref: DOCS.blog,
      articles: articles.map((a, i) => ({
        image: BLOG_IMGS[i % 3],
        href: a.href || DOCS.blog,
        title: a.title,
        body: a.body
      }))
    };
  }

  function convertGuide(pairLabel) {
    return guide(`How does ${pairLabel} conversion work?`, [
      `Select ${pairLabel} (or confirm the From / To formats in the format hub).`,
      "Upload your file to the online converter — drag and drop or click Select File.",
      "Wait for processing to finish, then click Download to save the result to your device."
    ]);
  }

  function convertWhy(name) {
    return why(`Why Choose WPS Office for ${name}?`, [
      {
        icon: WHY_ICONS.ratios,
        title: "Fast online conversion",
        body: `Convert with ${name} in your browser. No installation required — upload, convert, and download in a few steps.`,
        href: DOCS.convert
      },
      {
        icon: WHY_ICONS.shield,
        title: "Layout-aware results",
        body: "WPS conversion is tuned to keep readable structure across PDF and Office formats so you can edit or share with confidence.",
        href: DOCS.convert
      },
      {
        icon: WHY_ICONS.desktop,
        title: "Desktop when you need more",
        body: "Need offline batch work or advanced editing? Download WPS Office for PC for the full PDF and office suite.",
        href: DOCS.create
      }
    ]);
  }

  function convertFaq(name, howQ, howSteps) {
    return faq(`${name} FAQs`, [
      {
        q: howQ,
        a: `<ol>${howSteps.map((s) => `<li>${s}</li>`).join("")}</ol>`,
        more: DOCS.convert
      },
      {
        q: "Is this PDF converter free to use online?",
        a: "<p>Yes. WPS PDF Tools offers free online conversion with a daily site-wide free quota. Sign in with a free WPS account to get started. Upgrade to Premium or install desktop for more uses.</p>",
        more: DOCS.convert
      },
      {
        q: "How do I download a free PDF converter for offline use?",
        a: "<ol><li>Open the WPS PDF Tools converter page.</li><li>Use Download for All Features (or the footer download CTA) to get WPS Office.</li><li>Install WPS Office and open PDF Tools to convert offline alongside Word, Excel, and PowerPoint.</li></ol>",
        more: DOCS.convert
      }
    ]);
  }

  function convertBlog(topic) {
    return blog(`Learn More About ${topic}`, [
      {
        title: `Tips for better ${topic} results`,
        body: "Start with a clear source file, pick the right output format, and review the downloaded document before sharing it."
      },
      {
        title: "When to use online vs desktop PDF tools",
        body: "Online tools are ideal for quick one-off jobs. Desktop WPS Office is better for heavy editing, OCR, and repeated batch work."
      },
      {
        title: "Keep documents shareable and secure",
        body: "Prefer PDF when you need a fixed layout for clients; use Word or Excel when collaborators need to edit content."
      }
    ]);
  }

  const CONTENT = {
    "compress-pdf": {
      whyChoose: why("Why Choose WPS Office to Compress PDF Files?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Multiple Compression Ratios",
          body: "WPS PDF Compressor supports HD, Recommended, and Smallest. Choose a ratio based on your needs while keeping quality usable for sharing.",
          href: DOCS.compress
        },
        {
          icon: WHY_ICONS.shield,
          title: "No Information Loss",
          body: "Compression is designed to preserve document information so text and structure remain intact after you download.",
          href: DOCS.compress
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Advanced Compressor Options",
          body: "Need more control? Use WPS Office for PC or keep working in the online app to make large PDFs smaller.",
          href: DOCS.compress
        }
      ]),

      faq: faq("PDF Compression FAQs", [
        {
          q: "How do I compress a large file to make it smaller online?",
          a: "<ol><li>Click Select File to upload your PDF or drag it into the upload area.</li><li>Choose HD, Recommended, or Smallest.</li><li>Wait a few seconds, then click Download to get your compressed file.</li></ol>",
          more: DOCS.compress
        },
        {
          q: "How do I know the size of a compressed file?",
          a: "<p>After compression finishes, the result panel shows the original size, compressed size, and how much space you saved.</p>",
          more: DOCS.compress
        },
        {
          q: "Is PDF file compression free?",
          a: "<p>Yes. WPS Office supports free PDF compression online with a daily quota. Upgrade to Premium or download WPS Office for more features and uses.</p>",
          more: DOCS.create
        }
      ]),
      blog: blog("Learn More About Compress PDF Online for Free", [
        {
          title: "Guideline on How to Compress PDF in InDesign",
          body: "When a PDF grows too large for email limits, compress it with WPS before sharing — or use desktop tools for production workflows."
        },
        {
          title: "Enable More Access to PDF — Free Download WPS for Windows",
          body: "WPS for Windows includes Writer, Spreadsheets, Presentation, and PDF tools in one suite with broad format compatibility."
        },
        {
          title: "How to Compress Multiple PDF Files?",
          body: "Use Premium for multi-file batches. Free users process one file per run; Premium unlocks unlimited PDF features."
        }
      ])
    },

    "split-pdf": {
      whyChoose: why("Why Choose WPS Office to Split PDF Files?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Split pages in minutes",
          body: "Upload a PDF and split it into separate files online without installing software.",
          href: DOCS.split
        },
        {
          icon: WHY_ICONS.shield,
          title: "Keep pages intact",
          body: "Page content stays readable after splitting so you can send only the sections people need.",
          href: DOCS.split
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Works with Merge & Compress",
          body: "After splitting, merge pages back together or compress large outputs with other WPS PDF tools.",
          href: DOCS.merge
        }
      ]),

      faq: faq("PDF Split FAQs", [
        {
          q: "How do I split a PDF online for free?",
          a: "<ol><li>Select Split PDF and upload your file.</li><li>Start the split process.</li><li>Download the output files when processing completes.</li></ol>",
          more: DOCS.split
        },
        {
          q: "Can I split a multi-page PDF into single pages?",
          a: "<p>Yes. The Split PDF tool is designed to separate a PDF into multiple PDF files so you can keep or share only the pages you need.</p>",
          more: DOCS.split
        },
        {
          q: "Do I need to install software?",
          a: "<p>No. Split PDF works in your browser. Sign in with a free WPS account to use the daily quota.</p>",
          more: DOCS.split
        }
      ]),
      blog: blog("Learn More About Split PDF", [
        { title: "When to split vs compress a PDF", body: "Split when recipients only need certain pages; compress when the whole file is still required but too large to send." },
        { title: "Organize scanned documents faster", body: "Break long scans into topic-based PDFs, then merge or convert the pieces you keep." },
        { title: "Share only what is needed", body: "Reducing file size is not the only privacy tip — splitting removes unrelated pages before you share." }
      ])
    },

    "merge-pdf": {
      whyChoose: why("Why Choose WPS Office to Merge PDF Files?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Combine files quickly",
          body: "Merge multiple PDFs into one document online without downloading separate desktop software.",
          href: DOCS.merge
        },
        {
          icon: WHY_ICONS.shield,
          title: "One file to share",
          body: "Deliver proposals, forms, and appendixes as a single PDF that is easy to email or archive.",
          href: DOCS.merge
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Pair with Compress",
          body: "After merging, compress the combined PDF if the attachment is still too large for email limits.",
          href: DOCS.compress
        }
      ]),

      faq: faq("PDF Merge FAQs", [
        {
          q: "How do I merge PDF files online for free?",
          a: "<ol><li>Open Merge PDF and upload two or more PDF files.</li><li>Continue to merge and wait for processing.</li><li>Download the combined PDF.</li></ol>",
          more: DOCS.merge
        },
        {
          q: "Can free users merge multiple files at once?",
          a: "<p>Free users can process one file per run in this demo flow. Upgrade to WPS Pro+ for multi-file batch merges and unlimited PDF features.</p>",
          more: DOCS.merge
        },
        {
          q: "Will merging change my PDF content?",
          a: "<p>Merging concatenates documents into one file. Page content from each source PDF is preserved in order.</p>",
          more: DOCS.merge
        }
      ]),
      blog: blog("Learn More About Merge PDF", [
        { title: "Build client-ready PDF packs", body: "Merge cover letters, contracts, and exhibits into one sendable packet." },
        { title: "Merge then compress for email", body: "Large merged files often need a Recommended or Smallest compress pass before sending." },
        { title: "Keep version control simple", body: "One merged PDF reduces attachment clutter when collecting signatures or reviews." }
      ])
    },

    "signing-pdf": {
      whyChoose: why("Why Choose WPS Office to Sign PDF Files?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Sign without printing",
          body: "Add an electronic signature online and download a signed PDF — no printer or scanner required.",
          href: DOCS.create
        },
        {
          icon: WHY_ICONS.shield,
          title: "Simple upload → sign → download",
          body: "The workspace walks you through signing in three clear steps with progress feedback.",
          href: DOCS.create
        },
        {
          icon: WHY_ICONS.desktop,
          title: "More signing features on desktop",
          body: "Download WPS Office for richer annotation, stamps, and PDF editing alongside eSign.",
          href: DOCS.create
        }
      ]),

      faq: faq("PDF Signing FAQs", [
        {
          q: "How do I sign a PDF online?",
          a: "<ol><li>Upload your PDF.</li><li>Continue to the sign step and apply your signature.</li><li>Download the signed document.</li></ol>",
          more: DOCS.create
        },
        {
          q: "Is online PDF signing free?",
          a: "<p>Yes, with a free WPS account and the daily site-wide quota. Premium or desktop installs unlock more daily uses.</p>",
          more: DOCS.create
        },
        {
          q: "Can I edit the PDF after signing?",
          a: "<p>For deeper editing or annotations after signing, open the file in WPS Office desktop PDF tools.</p>",
          more: DOCS.create
        }
      ]),
      blog: blog("Learn More About Sign PDF", [
        { title: "When eSign is enough", body: "Use online signing for routine acknowledgements; use regulated e-signature platforms when your industry requires audit trails." },
        { title: "Compress before you send", body: "Signed contracts with scans can be large — compress after signing if email size is a limit." },
        { title: "Keep a clean final PDF", body: "Merge related pages first, then sign once so recipients get a single signed packet." }
      ])
    },

    "convert-pdf": {
      whyChoose: convertWhy("PDF Converter"),
      guide: guide("How Do PDF Converters Work?", [
        "First, select the PDF conversion feature (Convert to or from PDF).",
        "Upload the files in the format you want to convert to the online PDF converter.",
        "Click the Download button to export the converted files to your device."
      ]),
      faq: faq("PDF Converter FAQs", [
        {
          q: "How to convert Word to PDF online?",
          a: "<ol><li>Choose Word → PDF in the format hub.</li><li>Upload your Word file.</li><li>Download the converted PDF.</li></ol>",
          more: DOCS.pdfToWord
        },
        {
          q: "How to download a PDF converter for free?",
          a: "<ol><li>WPS Office is an all-in-one suite with PDF tools.</li><li>Use Download for All Features on this page.</li><li>Open WPS Office and use PDF Converter offline with Word, Excel, and PowerPoint.</li></ol>",
          more: DOCS.convert
        },
        {
          q: "How do I save a file as PDF on PDF Converter?",
          a: "<ol><li>Select a From format that can convert to PDF (Word, Excel, PPT, JPG, or XML).</li><li>Upload the file and continue.</li><li>Download the PDF result.</li></ol>",
          more: DOCS.create
        }
      ]),
      blog: convertBlog("PDF Converter")
    },

    "pdf-to-word": {
      whyChoose: convertWhy("PDF to Word"),

      blog: convertBlog("PDF to Word")
    },
    "pdf-to-excel": {
      whyChoose: convertWhy("PDF to Excel"),

      blog: convertBlog("PDF to Excel")
    },
    "pdf-to-ppt": {
      whyChoose: convertWhy("PDF to PPT"),

      blog: convertBlog("PDF to PPT")
    },
    "pdf-to-jpg": {
      whyChoose: convertWhy("PDF to JPG"),

      blog: convertBlog("PDF to JPG")
    },
    "word-to-pdf": {
      whyChoose: convertWhy("Word to PDF"),

      blog: convertBlog("Word to PDF")
    },
    "excel-to-pdf": {
      whyChoose: convertWhy("Excel to PDF"),

      blog: convertBlog("Excel to PDF")
    },
    "ppt-to-pdf": {
      whyChoose: convertWhy("PPT to PDF"),

      blog: convertBlog("PPT to PDF")
    },
    "jpg-to-pdf": {
      whyChoose: convertWhy("JPG to PDF"),

      blog: convertBlog("JPG to PDF")
    },
    "xml-to-pdf": {
      whyChoose: convertWhy("XML to PDF"),

      blog: convertBlog("XML to PDF")
    },
    "word-to-jpg": {
      whyChoose: convertWhy("Word to JPG"),

      blog: convertBlog("Word to JPG")
    },
    "jpg-to-word": {
      whyChoose: convertWhy("JPG to Word"),

      blog: convertBlog("JPG to Word")
    },

    "mesh-converter": {
      whyChoose: why("Why Choose WPS Mesh Converter?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Convert 11 mesh input formats",
          body: "Upload OBJ, STL, FBX, GLB/GLTF, DAE, 3DS, X, 3MF, OFF, AC3D, or PLY and choose an available output format.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.shield,
          title: "Choose from 7 mesh output formats",
          body: "Convert to OBJ, STL, FBX, GLB/GLTF, DAE, 3MF, or PLY. The format selector disables unsupported paths and same-format conversion.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.desktop,
          title: "One file with progress and ETA",
          body: "Process one mesh file per conversion. Most jobs take about 10 seconds to 2 minutes, with progress and estimated time shown on the page.",
          href: DOCS.convert
        }
      ]),
      guide: guide("How to convert mesh files online", [
        "Select the source mesh format and one available output format. Same-format conversion is disabled.",
        "Upload one supported mesh file. The current converter does not accept multiple files in one conversion.",
        "Keep the page open to follow progress and ETA. When conversion finishes, download the converted mesh file."
      ]),
      faq: faq("Mesh Converter FAQs", [
        {
          q: "What mesh formats can I convert?",
          a: "<p>You can upload <strong>OBJ, STL, FBX, GLB/GLTF, DAE, 3DS, X, 3MF, OFF, AC3D, and PLY</strong>. Available outputs are OBJ, STL, FBX, GLB/GLTF, DAE, 3MF, and PLY. The destination options depend on the selected input format.</p>",
          more: DOCS.convert
        },
        {
          q: "How long does mesh conversion take?",
          a: "<p>Most mesh conversions take about <strong>10 seconds to 2 minutes</strong>. The page displays conversion progress and an estimated remaining time while the file is processed.</p>",
          more: DOCS.convert
        },
        {
          q: "Can I convert a mesh file to the same format?",
          a: "<p>No. Same-format conversion is disabled. Select a different supported output from the options available for your source format.</p>",
          more: DOCS.convert
        },
        singleFile3dFaq()
      ]),
      blog: blog("Learn More About Mesh Conversion", [
        {
          title: "Mesh converter input formats",
          body: "The input selector supports OBJ, STL, FBX, GLB/GLTF, DAE, 3DS, X, 3MF, OFF, AC3D, and PLY files."
        },
        {
          title: "Mesh converter output formats",
          body: "Choose OBJ, STL, FBX, GLB/GLTF, DAE, 3MF, or PLY when that destination is available for the selected source format."
        },
        {
          title: "One-file mesh conversion",
          body: "Upload one file, follow the progress and ETA, download the result, and then start another conversion for the next model."
        }
      ])
    },

    "cad-converter": {
      whyChoose: why("Why Choose WPS CAD Converter?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Convert 12 CAD input formats",
          body: "Upload STEP, IGES, CATIA V5, NX, Creo, SolidWorks, Parasolid, Inventor, JT, PRC, ACIS, or Solid Edge files.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.shield,
          title: "Export to STEP or mesh formats",
          body: "Choose STEP, GLB/GLTF, FBX, OBJ, or STL when supported for the selected input. STEP inputs convert to mesh outputs rather than STEP.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.desktop,
          title: "One file with progress and ETA",
          body: "Process one CAD file per conversion. Most jobs take about 30 seconds to 5 minutes, with progress and estimated time shown on the page.",
          href: DOCS.convert
        }
      ]),
      guide: guide("How to convert CAD files online", [
        "Select the CAD input format and one available output. STEP inputs can be converted to GLB/GLTF, FBX, OBJ, or STL.",
        "Upload one supported CAD file. The current converter does not accept multiple files in one conversion.",
        "Keep the page open to follow progress and ETA. When conversion finishes, download the converted file."
      ]),
      faq: faq("CAD Converter FAQs", [
        {
          q: "Which CAD formats can I convert online?",
          a: "<p>You can upload <strong>STEP, IGES, CATIA V5, NX, Creo, SolidWorks, Parasolid, Inventor, JT, PRC, ACIS, and Solid Edge</strong> files. The available destination formats depend on the selected CAD input.</p>",
          more: DOCS.convert
        },
        {
          q: "What output formats does the CAD converter support?",
          a: "<p>Supported outputs are <strong>STEP, GLB/GLTF, FBX, OBJ, and STL</strong>. IGES and the listed native CAD formats can use STEP or mesh outputs. A STEP input can use GLB/GLTF, FBX, OBJ, or STL.</p>",
          more: DOCS.convert
        },
        {
          q: "Can I convert STEP to STEP?",
          a: "<p>No. Same-format conversion is disabled. For a STEP input, select GLB/GLTF, FBX, OBJ, or STL as the output.</p>",
          more: DOCS.convert
        },
        {
          q: "How long does CAD conversion take?",
          a: "<p>Most CAD conversions take about <strong>30 seconds to 5 minutes</strong>. The page displays conversion progress and an estimated remaining time while the file is processed.</p>",
          more: DOCS.convert
        },
        singleFile3dFaq()
      ]),
      blog: blog("Learn More About CAD Conversion", [
        {
          title: "CAD converter input formats",
          body: "The input selector supports STEP, IGES, CATIA V5, NX, Creo, SolidWorks, Parasolid, Inventor, JT, PRC, ACIS, and Solid Edge."
        },
        {
          title: "CAD converter output formats",
          body: "Choose STEP, GLB/GLTF, FBX, OBJ, or STL when that destination is available for the selected CAD source format."
        },
        {
          title: "STEP and mesh conversion paths",
          body: "STEP inputs convert to GLB/GLTF, FBX, OBJ, or STL. Other listed CAD inputs can also use STEP as an output."
        }
      ])
    },

    "bim-converter": {
      whyChoose: why("Why Choose WPS BIM Converter?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Upload 6 BIM and architecture formats",
          body: "Select IFC, Revit, Navisworks, DWF, AutoCAD (DWG/DXF), or SKP as the source format for the conversion.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.shield,
          title: "Convert to 4 mesh output formats",
          body: "Convert a supported BIM or architecture file to GLB/GLTF, FBX, OBJ, or STL for visualization and sharing.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.desktop,
          title: "One file with progress and ETA",
          body: "Process one BIM file per conversion. Most jobs take about 1 to 10 minutes, with progress and estimated time shown on the page.",
          href: DOCS.convert
        }
      ]),
      guide: guide("How to convert BIM files online", [
        "Select a BIM or architecture input format and choose GLB/GLTF, FBX, OBJ, or STL as the output.",
        "Upload one supported BIM file. The current converter does not accept multiple files in one conversion.",
        "Keep the page open to follow progress and ETA. When conversion finishes, download the converted mesh file."
      ]),
      faq: faq("BIM Converter FAQs", [
        {
          q: "Which BIM and architecture formats can I upload?",
          a: "<p>You can upload <strong>IFC, Revit (RVT/RFA), Navisworks (NWD/NWC), DWF (DWF/DWFX), AutoCAD (DWG/DXF), and SKP</strong> files.</p>",
          more: DOCS.convert
        },
        {
          q: "What output formats does the BIM converter support?",
          a: "<p>Supported outputs are <strong>GLB/GLTF, FBX, OBJ, and STL</strong>. The page converts the listed BIM and architecture inputs to these mesh formats; BIM authoring formats are not listed as outputs.</p>",
          more: DOCS.convert
        },
        {
          q: "How long does BIM conversion take?",
          a: "<p>Most BIM conversions take about <strong>1 to 10 minutes</strong>. The page displays conversion progress and an estimated remaining time while the file is processed.</p>",
          more: DOCS.convert
        },
        singleFile3dFaq()
      ]),
      blog: blog("Learn More About BIM Conversion", [
        {
          title: "BIM converter input formats",
          body: "The input selector supports IFC, Revit, Navisworks, DWF, AutoCAD (DWG/DXF), and SKP files."
        },
        {
          title: "BIM converter output formats",
          body: "Each listed BIM and architecture input can be converted to GLB/GLTF, FBX, OBJ, or STL."
        },
        {
          title: "One-file BIM conversion",
          body: "Upload one file, follow the progress and ETA, download the mesh result, and then start another conversion if needed."
        }
      ])
    }
  };

  /** Optional override from scripts/_crawled-wps-content.json (loaded by generator or future fetch). */
  function applyCrawledMeta(slug, crawled) {
    const entry = CONTENT[slug];
    if (!entry || !crawled) return entry;
    // Crawl only seeds titles/descriptions; page chrome uses catalog pageTitle/subtitle.
    // Keep library FAQ/copy; expose crawled strings for consumers that want them.
    entry.crawled = {
      h1: crawled.h1 || "",
      description: crawled.description || "",
      sourceUrl: crawled.sourceUrl || ""
    };
    return entry;
  }

  function get(slug) {
    return CONTENT[slug] || null;
  }

  function getAll() {
    return CONTENT;
  }

  global.WPSToolContentLibrary = {
    CONTENT,
    DOCS,
    get,
    getAll,
    applyCrawledMeta
  };
})(typeof window !== "undefined" ? window : globalThis);
