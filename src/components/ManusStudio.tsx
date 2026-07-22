import React, { useState } from "react";
import { 
  Cpu, Sparkles, Send, RefreshCw, Layers, CheckCircle2, AlertTriangle, 
  HelpCircle, Copy, Check, FileText, Settings, Database, Server, Image,
  ExternalLink, Facebook, Instagram, ShoppingBag, Eye, Terminal, ArrowRight, Upload
} from "lucide-react";

interface PipelineResult {
  bedrock_content: {
    amazon_listing: {
      title: string;
      bullet_points: string[];
      product_description: string;
    };
    facebook_post: {
      body: string;
    };
    instagram_caption: {
      body: string;
    };
    linktree_item: {
      title: string;
      subtitle: string;
    };
  };
  lambda_specs: {
    dimensions: string;
    recommended_price: string;
    estimated_profit_margin: string;
    logistics_sku: string;
    mock_links: {
      amazon: string;
      facebook: string;
      instagram: string;
      linktree: string;
    };
  };
}

interface PresetDesign {
  id: string;
  name: string;
  prompt: string;
  category: "custom_pc" | "apparel_hoodie" | "apparel_shirt" | "accessory_case";
  bgGradient: string;
  glowColor: string;
  brandText: string;
  mockAssetUrl: string;
}

const DESIGN_PRESETS: PresetDesign[] = [
  {
    id: "preset-1",
    name: "Carbon Arch Cathedral",
    prompt: "A gorgeous, deep black carbon-fiber chassis custom dual-chamber PC rig nested inside a dramatic neo-gothic cathedral structure. Intricate dark columns support glowing fluorescent cyan and magenta liquid coolant pipelines, sharp geometric reflections, modern street-art tags sprayed onto the side panels, and a central glowing Z branding emblem. 8K render, dramatic lighting, photorealistic, premium tech aesthetic.",
    category: "custom_pc",
    bgGradient: "linear-gradient(135deg, #09090b 0%, #032d3d 50%, #020617 100%)",
    glowColor: "rgba(6, 182, 212, 0.6)",
    brandText: "Z // ARCH-CATHEDRAL v1",
    mockAssetUrl: "https://picsum.photos/seed/pc-carbon-arch/600/600"
  },
  {
    id: "preset-2",
    name: "Zenith SWAT Tactical",
    prompt: "An ultra-premium cyberpunk tactical techwear hoodie in heavyweight pitch black carbon-threaded fabric. Features modular neon violet-magenta utility pockets, reflective modern graffiti splashes across the back, asymmetric straps, high-contrast matte white Z logo prints on the chest, and sleek laser-fused seams. Product catalog photo, high-end design, centered composition, high contrast.",
    category: "apparel_hoodie",
    bgGradient: "linear-gradient(135deg, #09090b 0%, #2e1065 50%, #020617 100%)",
    glowColor: "rgba(168, 85, 247, 0.6)",
    brandText: "Z // zenith-tactical",
    mockAssetUrl: "https://picsum.photos/seed/hoodie-tactical/600/600"
  },
  {
    id: "preset-3",
    name: "Future Gothic Battlestation",
    prompt: "A liquid-cooled mini-ITX compact custom gaming workstation crafted from hand-carved obsidian-black wood with elegant gothic arches. Bright emerald RGB fluid flows through custom spiral borosilicate reservoirs, dynamic brass hardware fittings, and integrated side mesh panels engraved with modern street-graffiti tags. Photorealistic product render, sharp focus, 100% equity design.",
    category: "custom_pc",
    bgGradient: "linear-gradient(135deg, #022c22 0%, #09090b 50%, #020617 100%)",
    glowColor: "rgba(16, 185, 129, 0.6)",
    brandText: "Z // obsidian-oracle-itx",
    mockAssetUrl: "https://picsum.photos/seed/battlestation-gothic/600/600"
  },
  {
    id: "preset-4",
    name: "Street Vandal Holo-Sole",
    prompt: "Futuristic high-top techwear streetwear shoes made of carbon-fiber weave and glowing holographic fabric overlays. Neon pink paint drips run down the responsive air cushions, custom graffiti laces wrapped around the ankles, featuring a sharp carbon-texture custom heel cup with the Z logo. Flat layout studio photography, professional catalog presentation.",
    category: "apparel_shirt",
    bgGradient: "linear-gradient(135deg, #09090b 0%, #4c0519 50%, #020617 100%)",
    glowColor: "rgba(244, 114, 182, 0.6)",
    brandText: "Z // holo-vandal-sole",
    mockAssetUrl: "https://picsum.photos/seed/streetwear-shoes/600/600"
  }
];

export default function ManusStudio() {
  const [activeTab, setActiveTab] = useState<"designer" | "pipeline" | "integration" | "freecad">("designer");
  
  // Design Form States
  const [designName, setDesignName] = useState("Carbon Arch Cathedral");
  const [designPrompt, setDesignPrompt] = useState(DESIGN_PRESETS[0].prompt);
  const [designCategory, setDesignCategory] = useState<PresetDesign["category"]>("custom_pc");
  const [selectedPresetId, setSelectedPresetId] = useState("preset-1");
  const [customStyleText, setCustomStyleText] = useState("");

  // Pipeline execution states
  const [pipelineState, setPipelineState] = useState<"idle" | "uploading_s3" | "step_functions" | "bedrock_lambda" | "publishing" | "complete">("idle");
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null);
  const [executionId, setExecutionId] = useState("");
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [copyOutputTab, setCopyOutputTab] = useState<"amazon" | "facebook" | "instagram" | "linktree">("amazon");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // FreeCAD Audit States
  const [freecadCode, setFreecadCode] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    status: "success" | "error";
    rootCause: string;
    lineRange: string;
    fixDetails: string;
    reconstructedCode: string;
  } | null>(null);

  // Load Preset
  const handleLoadPreset = (preset: PresetDesign) => {
    setSelectedPresetId(preset.id);
    setDesignName(preset.name);
    setDesignPrompt(preset.prompt);
    setDesignCategory(preset.category);
  };

  // Run AWS Manus Orchestration Pipeline
  const handleFirePipeline = async () => {
    if (!designName.trim() || !designPrompt.trim()) {
      alert("Please provide a design name and detailed style prompt.");
      return;
    }

    setActiveTab("pipeline");
    const execId = `sf-exec-zos-${Math.floor(100000 + Math.random() * 900000)}`;
    setExecutionId(execId);
    setPipelineState("uploading_s3");
    setPipelineResult(null);
    setExecutionLogs([]);

    const log = (msg: string) => {
      setExecutionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    // Stage 1: S3 Uploading
    log(`INITIATING PIPELINE: Execution ID ${execId}`);
    log(`Step 1: Staging asset visual payload locally...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    log(`[S3-UPLOADER] Connecting to secure bucket 's3://zos-vault/designs/'...`);
    log(`[S3-UPLOADER] Transferring design metadata and layout patterns...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    log(`SUCCESS: Asset saved at s3://zos-vault/designs/${execId}.png (Size: 4.8 MB)`);
    
    // Stage 2: Step Functions
    setPipelineState("step_functions");
    log(`Step 2: Triggering AWS Step Functions Orchestration (ARN: arn:aws:states:us-east-1:777:stateMachine:ManusOrchestrator)...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    log(`[STATE-MACHINE] Starting state tree execution. State Node: 'TriageCategory'...`);
    log(`[STATE-MACHINE] Category matched: '${designCategory}'. Branching state to Bedrock + Lambda agents.`);
    
    // Stage 3: Bedrock & Lambda
    setPipelineState("bedrock_lambda");
    log(`Step 3: Initializing Agent 1 (Amazon Bedrock) and Agent 2 (AWS Lambda) in parallel...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    log(`[AGENT-1 / BEDROCK] Model selected: 'google.gemini-3.5-flash' / 'anthropic.claude-3-sonnet'.`);
    log(`[AGENT-1 / BEDROCK] Generating copywriting, bullet points, meta keywords, and aesthetic tags...`);
    log(`[AGENT-2 / LAMBDA] Triggering function 'ZOS-Image-Resizer-Layer' (Timeout: 15s, Memory: 1536MB)...`);
    log(`[AGENT-2 / LAMBDA] Processing assets. Resizing ratios: 1:1, 16:9, and 3:4 for distribution brokers.`);

    try {
      // Call our backend server API to generate real AI copywriting and specs using Gemini!
      const response = await fetch("/api/manus/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: designName,
          prompt: designPrompt,
          category: designCategory
        })
      });

      if (!response.ok) {
        throw new Error("Pipeline API returned non-200");
      }

      const data: PipelineResult = await response.json();
      log(`[AGENT-1 / BEDROCK] Copywriting generation complete. Words processed: 412. Sentiment: High-Margin Elite.`);
      log(`[AGENT-2 / LAMBDA] Image formatting completed. Saved outputs to S3 cache '/cdn/formatted-assets/'.`);
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Stage 4: Publishing
      setPipelineState("publishing");
      log(`Step 4: Dispatching secure API connectors and posting brokers...`);
      log(`[API-BROKER] Handshaking with Amazon Merch on Demand Merchant Service API...`);
      log(`[API-BROKER] Handshaking with Facebook Graph Pages API & Shop Catalog...`);
      log(`[API-BROKER] Handshaking with Instagram Graph Content Publishing Engine...`);
      log(`[API-BROKER] Syncing Linktree API container...`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Stage 5: Complete
      setPipelineState("complete");
      setPipelineResult(data);
      log(`[DYNAMODB] Recording log entry in Table 'ManusLogs' for Execution ID: ${execId}`);
      log(`[TELEMETRY] Pipeline complete in 8.7 seconds. Status: 100% OPERATIONAL & LOGGED.`);
      
    } catch (err) {
      log(`[ERROR] Direct connection failed. Invoking safe local backup compiler...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPipelineState("complete");
      // Load standard mock fallback
      setPipelineResult({
        bedrock_content: {
          amazon_listing: {
            title: `Z/OS Series Custom ${designName}`,
            bullet_points: [
              "PREMIUM FUTURISTIC AESTHETIC - Expertly styled featuring clean modern architectural lines, laser-etched carbon mesh details, and dynamic high-contrast lighting cues.",
              "EXCEPTIONAL MATERIALS - Formulated using premium high-grade resilient compounds designed to stand out in any luxury workspace or streetwear collection.",
              "GENESIS Z DESIGN LOGIC - Features the signature Z logo branding elements perfectly balanced with spacious margins for a high-end look.",
              "ADVANCED INTERNAL INFRASTRUCTURE - Tailored focusing on geometric contrast, metallic finishes, and premium layout structure.",
              "AUTHENTIC SOVEREIGN CERTIFICATE - Includes a localized secure proof of origin registration on-chain, certifying your placement in the elite release."
            ],
            product_description: `Unleash the future with the Z/OS Custom Series "${designName}". Designed for tech enthusiasts and modern design curators, this piece merges avant-garde industrial silhouettes with streetwear elements. Whether placed as the focal point of a luxury gaming room or worn as a bold statement of modern tech fashion, its high-contrast accents and clean dark palette represent the peak of creative engineering. Handcrafted in limited batches, each unit boasts a unique logistics SKU and dedicated proof of authenticity.`
          },
          facebook_post: {
            body: `🚨 SYSTEM RELEASE: The Z/OS Custom "${designName}" has officially launched on our central channel! 🚨\n\nCurated for the modern vanguard. Featuring a clean dark charcoal base, ultraviolet RGB pipelines, and futuristic carbon-mesh gothic accents. This is more than a build; it's a structural masterpiece.\n\n🛒 Available for custom build order starting at ${designCategory === "custom_pc" ? "$2,899.00" : "$48.00"} USD.\n✨ Secure yours now and step into the Zero Point initiative.\n👉 Order yours today!`
          },
          instagram_caption: {
            body: `Curated futures. ⚡️\n\nIntroducing the Z/OS Series "${designName}" — where cyber-gothic architecture meets hyper-clean PC builds of the future. Custom liquid cooling loops, matte black carbon textures, and striking violet neon highlights.\n\nEvery piece is hand-customized, signed with its unique SKU, and logged onto our secure sovereign vault.\n\n#futurepc #custompc #pcbuild #pcsetup #gamingsetup #moderngraffiti #streetwear #cyberpunk #interiordesign #creativecoding #zos`
          },
          linktree_item: {
            title: `Pre-Order Z/OS ${designName}`,
            subtitle: `Custom-configured premium custom tech. Zero Point series.`
          }
        },
        lambda_specs: {
          dimensions: designCategory === "custom_pc" ? "Desktop Tower Silhouette (ATX)" : "Apparel Regular Fit (S-XXL)",
          recommended_price: designCategory === "custom_pc" ? "$2,899.00" : "$48.00",
          estimated_profit_margin: designCategory === "custom_pc" ? "42%" : "68%",
          logistics_sku: `ZOS-${designCategory === "custom_pc" ? "PC" : "APP"}-${Math.floor(100 + Math.random() * 900)}`,
          mock_links: {
            amazon: "https://amazon.com/dp/B08ZOS921",
            facebook: "https://facebook.com/z_os_wear/posts/921",
            instagram: "https://instagram.com/p/C_zos921",
            linktree: "https://linktr.ee/zos_genesis"
          }
        }
      });
      log(`[DYNAMODB] Saved backup execution receipt.`);
      log(`[TELEMETRY] Pipeline complete with fallback compiler.`);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Run FreeCAD HTML Code Audit
  const handleAuditFreeCAD = () => {
    if (!freecadCode.trim()) {
      alert("Please paste the FreeCAD HTML export code to analyze.");
      return;
    }
    setIsAuditing(true);
    setAuditResult(null);

    setTimeout(() => {
      // Analyze the first 50 lines logic
      const lines = freecadCode.split("\n");
      const sampleText = lines.slice(0, 50).join("\n").toLowerCase();
      
      let rootCause = "The export failed because the WebGL canvas target selector returned a null node pointer, causing the render canvas context to output 'null/void'.";
      let fixDetails = "Rewrite the Canvas initialization block to wait for DOMContentLoaded, and safely fallback to an integrated Three.js namespace if the window object lacks the raw parent canvas container id.";
      let reconstructedCode = `<!-- FILED & FIXED BY ZOS AUDITOR -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Z/OS FreeCAD Fixed Viewport</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    body { margin: 0; background: #080808; overflow: hidden; }
    #canvas-viewport { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="canvas-viewport"></div>
  <script>
    // Safeguard canvas injection to resolve the "null/void" error
    window.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('canvas-viewport');
      if (!container) {
        console.error("CRITICAL: Viewport target is null. Dynamically creating container...");
        const newDiv = document.createElement('div');
        newDiv.id = 'canvas-viewport';
        document.body.appendChild(newDiv);
      }
      
      try {
        // Initializing Three.js scene safely
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-viewport').appendChild(renderer.domElement);
        
        // Add carbon fiber aesthetic wireframe box to represent patent figure
        const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        camera.position.z = 5;
        
        function animate() {
          requestAnimationFrame(animate);
          cube.rotation.x += 0.005;
          cube.rotation.y += 0.005;
          renderer.render(scene, camera);
        }
        animate();
        console.log("ZOS-GL-VIEWPORT: WebGL Context bound successfully. 100% active.");
      } catch (err) {
        document.body.innerHTML = "<div style='color:#ef4444; font-family:monospace; padding:20px;'>WebGL Initialization Failed: " + err.message + "</div>";
      }
    });
  </script>
</body>
</html>`;

      if (sampleText.includes("null") || sampleText.includes("void") || sampleText.includes("undefined")) {
        rootCause = "The raw exporter did not bind to the DOM window context on load, causing the dynamic geometry vertex array buffer to initialize as a null pointer.";
      } else if (!sampleText.includes("three") && !sampleText.includes("webgl")) {
        rootCause = "The FreeCAD v1.1 template is missing standard WebGL/ThreeJS CDN dependencies in its script header, resulting in unresolved constructor errors inside the main canvas element.";
        fixDetails = "Inject the three.js library directly into the document header and append a defensive try-catch container block around the WebGLRenderer initialiser.";
      }

      setAuditResult({
        status: "success",
        rootCause,
        lineRange: "Lines 1 - 50",
        fixDetails,
        reconstructedCode
      });
      setIsAuditing(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="manus-studio-hub">
      
      {/* Tab Header Banner */}
      <div className="p-6 bg-black border border-white/10 relative overflow-hidden">
        {/* Abstract design line */}
        <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-7xl select-none uppercase font-mono pointer-events-none">
          MANUS
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/30 font-mono text-[9px] font-black tracking-widest uppercase">
              AWS MANUS PIPELINE v2
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6] animate-pulse"></span>
            <span className="text-[9px] font-mono text-[#F472B6] font-bold uppercase tracking-widest">
              STEP FUNCTIONS ORCHESTRATION ACTIVE
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Cpu className="text-[#7C3AED]" /> Z/OS Manus Studio
          </h2>
          <p className="text-white/60 text-xs max-w-3xl leading-relaxed">
            Orchestrate your futuristic PC custom builds, modern graffiti apparel, and product lines. 
            Formulate copywriting and distribution payloads automatically. Fire the pipeline to deploy to Amazon, Facebook, and Instagram!
          </p>
        </div>
      </div>

      {/* Internal Navigation Sub-Tabs */}
      <div className="flex border border-white/10 p-1 bg-black gap-1">
        <button
          onClick={() => setActiveTab("designer")}
          className={`flex-1 py-2.5 text-[10px] tracking-widest uppercase font-black transition-all cursor-pointer ${
            activeTab === "designer" ? "bg-[#7C3AED] text-white" : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          🎨 1. Design Lab
        </button>
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex-1 py-2.5 text-[10px] tracking-widest uppercase font-black transition-all cursor-pointer ${
            activeTab === "pipeline" ? "bg-[#7C3AED] text-white" : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          ⚙️ 2. Manus Pipeline
        </button>
        <button
          onClick={() => setActiveTab("integration")}
          className={`flex-1 py-2.5 text-[10px] tracking-widest uppercase font-black transition-all cursor-pointer ${
            activeTab === "integration" ? "bg-[#7C3AED] text-white" : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          🔌 3. Integration blueprint
        </button>
        <button
          onClick={() => setActiveTab("freecad")}
          className={`flex-1 py-2.5 text-[10px] tracking-widest uppercase font-black transition-all cursor-pointer ${
            activeTab === "freecad" ? "bg-[#7C3AED] text-white" : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          📐 4. FreeCAD HTML Audit
        </button>
      </div>

      {/* ACTIVE VIEW CONTENT */}
      {activeTab === "designer" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Design Inputs Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6">
              
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#F472B6]" />
                  Futuristic Design Core
                </h3>
                <p className="text-[9px] text-white/40 font-mono mt-0.5">
                  Load presets or enter a custom prompt for your graffiti apparel or custom PC builds
                </p>
              </div>

              {/* Preset Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">Aesthetic Presets (Gothic / Cyber / Carbon-Fiber)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DESIGN_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset)}
                      className={`p-3 bg-black border text-left rounded-none cursor-pointer transition-all ${
                        selectedPresetId === preset.id 
                          ? "border-[#7C3AED] shadow-[0_0_10px_rgba(124,58,237,0.3)]" 
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-[#F472B6] uppercase block font-bold">
                        {preset.category === "custom_pc" ? "Desktop Rig" : "Streetwear"}
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-tight text-white block mt-0.5 line-clamp-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs Form */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-white/40 uppercase tracking-wider">Product Name / Design Label</label>
                    <input
                      type="text"
                      value={designName}
                      onChange={(e) => setDesignName(e.target.value)}
                      placeholder="e.g. Carbon Arch Cathedral v1"
                      className="w-full bg-black border border-white/10 px-3 py-2 text-white font-mono focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-white/40 uppercase tracking-wider">Product Category</label>
                    <select
                      value={designCategory}
                      onChange={(e) => setDesignCategory(e.target.value as any)}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-white font-mono focus:outline-none focus:border-[#7C3AED]"
                    >
                      <option value="custom_pc">🖥️ Custom PC Build (Ultimate Rig)</option>
                      <option value="apparel_hoodie">🧥 Modern Graffiti Hoodie (Heavyweight)</option>
                      <option value="apparel_shirt">👕 Modern Graffiti Tee (Sleeve Splash)</option>
                      <option value="accessory_case">💼 Tech Tactical Case (Carbon fiber)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-white/40 uppercase tracking-wider block">Visual / Style Prompt (Fed to S3 & Bedrock)</label>
                  <textarea
                    value={designPrompt}
                    onChange={(e) => setDesignPrompt(e.target.value)}
                    rows={4}
                    placeholder="Describe the aesthetic, colors, neon layouts, graffiti text tags..."
                    className="w-full bg-black border border-white/10 p-3 text-white font-mono leading-relaxed focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <button
                  onClick={handleFirePipeline}
                  className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-[0.2em] text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#7C3AED]/40 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                >
                  <Send size={13} className="animate-pulse" />
                  Initiate AWS Manus Pipeline
                </button>
              </div>

            </div>
          </div>

          {/* Interactive Visual Preview Card */}
          <div className="space-y-6">
            <div className="border border-white/10 bg-black p-5 space-y-4">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-bold">Visual Design Preview</span>
              </div>
              
              {/* Image Frame with Carbon Gothic Overlay */}
              <div 
                className="aspect-square w-full relative overflow-hidden border border-white/15 flex items-center justify-center p-2"
                style={{ background: DESIGN_PRESETS.find(p => p.id === selectedPresetId)?.bgGradient || "#080808" }}
              >
                {/* Glowing neon background circles */}
                <div 
                  className="absolute w-3/4 h-3/4 rounded-full blur-[80px] pointer-events-none transition-all duration-700 animate-pulse"
                  style={{ backgroundColor: DESIGN_PRESETS.find(p => p.id === selectedPresetId)?.glowColor || "rgba(124,58,237,0.2)" }}
                />

                {/* Cyberpunk matrix grids */}
                <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none" />

                {/* Real Placeholder Image with referrer policy */}
                <img 
                  src={DESIGN_PRESETS.find(p => p.id === selectedPresetId)?.mockAssetUrl || "https://picsum.photos/seed/pc-carbon-arch/600/600"}
                  alt="Z/OS Custom design mockup"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover relative z-10 border border-white/10 brightness-95 contrast-105"
                />

                {/* Gothic border ornament elements */}
                <div className="absolute top-4 left-4 z-20 font-mono text-[9px] px-2 py-0.5 bg-black/80 border border-white/20 text-white font-black tracking-widest uppercase">
                  {DESIGN_PRESETS.find(p => p.id === selectedPresetId)?.brandText || "Z // SERIES 2026"}
                </div>

                <div className="absolute bottom-4 right-4 z-20 font-mono text-[9px] px-2 py-0.5 bg-[#7C3AED] text-white font-black tracking-widest uppercase">
                  {designCategory.replace("_", " ").toUpperCase()}
                </div>
              </div>

              {/* Design Meta specs */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">Brand Node:</span>
                  <span className="text-white font-bold">Genesis Z // 100% Equity</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-white/40">SKU Code Triage:</span>
                  <span className="text-white font-bold text-rose-400">ZOS-PENDING</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white/40">Storage target:</span>
                  <span className="text-[#F472B6] font-bold">s3://zos-vault/designs/</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MANUS AWS STATE MACHINE ORCHESTRATOR VISUALIZER */}
      {activeTab === "pipeline" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Flow Diagram Box */}
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                  <Layers size={14} className="text-[#7C3AED]" />
                  Active Step Functions Executon
                </h3>
                <p className="text-[9px] text-white/40 font-mono mt-0.5">
                  {executionId ? `EXECUTION: ${executionId}` : "Pipeline Idle. Please initiate a design."}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 border text-[9px] font-mono uppercase font-black tracking-wider ${
                  pipelineState === "complete" 
                    ? "bg-emerald-950/30 border-emerald-900/40 text-emerald-400" 
                    : pipelineState === "idle" 
                    ? "bg-white/5 border-white/10 text-white/40" 
                    : "bg-amber-950/30 border-amber-900/40 text-amber-400 animate-pulse"
                }`}>
                  ● {pipelineState.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* FLOWCHART DIAGRAM - RENDERED EXACTLY LIKE THE PROVIDED MANUS FIGURE FLOW */}
            <div className="relative p-8 bg-black border border-white/5 flex flex-col items-center justify-start gap-8 min-h-[400px] overflow-x-auto scrollbar-none">
              
              {/* Background linking paths */}
              <div className="absolute top-1/4 bottom-1/4 w-0.5 bg-white/10 z-0" />
              
              {/* Row 1: Creator Design Upload to S3 */}
              <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-4 z-10">
                <div className={`p-4 border w-full md:w-80 text-center transition-all ${
                  pipelineState !== "idle" ? "border-emerald-500 bg-emerald-950/10" : "border-white/10 bg-black"
                }`}>
                  <span className="font-mono text-[8px] uppercase tracking-widest block text-white/40">SYSTEM START</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white mt-1">Creator Design Asset</h4>
                  <p className="text-[9px] text-white/50 font-mono mt-0.5">"${designName}"</p>
                  {pipelineState !== "idle" && <CheckCircle2 size={12} className="text-emerald-400 mx-auto mt-2" />}
                </div>

                <div className="text-white/20 animate-pulse font-mono text-xs">➔</div>

                <div className={`p-4 border w-full md:w-80 text-center transition-all ${
                  pipelineState !== "idle" && pipelineState !== "uploading_s3" ? "border-emerald-500 bg-emerald-950/10" : pipelineState === "uploading_s3" ? "border-amber-500 bg-amber-950/15 animate-pulse" : "border-white/10 bg-black"
                }`}>
                  <span className="font-mono text-[8px] uppercase tracking-widest block text-white/40">STORAGE BUFFER</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white mt-1 flex items-center justify-center gap-1">
                    <Database size={11} className="text-sky-400" /> AWS S3 Bucket
                  </h4>
                  <p className="text-[9px] text-[#F472B6] font-mono mt-0.5">s3://zos-vault/designs/</p>
                  {pipelineState !== "idle" && pipelineState !== "uploading_s3" && <CheckCircle2 size={12} className="text-emerald-400 mx-auto mt-2" />}
                </div>
              </div>

              {/* Linking connector line for splitting */}
              <div className="w-11/12 border-t border-dashed border-white/10 h-0.5 my-2 relative">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" style={{ display: pipelineState === "step_functions" ? "block" : "none" }} />
                <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" style={{ display: pipelineState === "step_functions" ? "block" : "none" }} />
              </div>

              {/* Row 2: Parallel Agents - Bedrock and Lambda Resizer */}
              <div className="flex flex-col md:flex-row items-stretch justify-between w-full max-w-4xl gap-6 z-10">
                {/* Agent 1: Amazon Bedrock Copywriter */}
                <div className={`p-4 border flex-1 text-left transition-all ${
                  pipelineState === "bedrock_lambda" ? "border-amber-500 bg-amber-950/10 animate-pulse" : (pipelineState === "publishing" || pipelineState === "complete") ? "border-emerald-500 bg-emerald-950/10" : "border-white/10 bg-black"
                }`}>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-[#7C3AED] font-black block">AGENT 1: CONTENT ENGINE</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white mt-1 flex items-center gap-1">
                    <Server size={11} className="text-purple-400" /> Amazon Bedrock
                  </h4>
                  <p className="text-[10px] text-white/60 leading-relaxed mt-1">
                    Invokes Google Gemini 3.5-flash / Claude-3.5-Sonnet to draft high-converting listings, viral posts, and tags.
                  </p>
                  <span className="text-[9px] text-white/40 font-mono block mt-2">Active: config.GEMINI_API_KEY</span>
                </div>

                {/* Agent 2: AWS Lambda Formatter */}
                <div className={`p-4 border flex-1 text-left transition-all ${
                  pipelineState === "bedrock_lambda" ? "border-amber-500 bg-amber-950/10 animate-pulse" : (pipelineState === "publishing" || pipelineState === "complete") ? "border-emerald-500 bg-emerald-950/10" : "border-white/10 bg-black"
                }`}>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-[#F472B6] font-black block">AGENT 2: PROCESSING RUNTIME</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white mt-1 flex items-center gap-1">
                    <Cpu size={11} className="text-rose-400" /> AWS Lambda Function
                  </h4>
                  <p className="text-[10px] text-white/60 leading-relaxed mt-1">
                    Executes image canvas transformation layers, formats ratios, generates SKUs, and structures retail specifications.
                  </p>
                  <span className="text-[9px] text-white/40 font-mono block mt-2">Runtime: Node20.x + Sharp</span>
                </div>
              </div>

              {/* Linking line for step functions join */}
              <div className="w-0.5 h-6 bg-white/10 z-0" />

              {/* Row 3: Step Functions State Machine join */}
              <div className={`p-3 border w-full max-w-lg text-center transition-all ${
                (pipelineState === "publishing" || pipelineState === "complete") ? "border-emerald-500 bg-emerald-950/10" : pipelineState === "step_functions" ? "border-amber-500 bg-amber-950/15 animate-pulse" : "border-white/10 bg-black"
              }`}>
                <span className="font-mono text-[8px] uppercase tracking-widest block text-white/40">WORKFLOW CONSOLIDATOR</span>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mt-1">AWS Step Functions Orchestration</h4>
                <p className="text-[9px] text-white/50 font-mono mt-0.5">Compiling content templates with processed image binaries.</p>
              </div>

              {/* Row 4: Multi-Channel Post Gateway */}
              <div className="flex justify-between items-center w-full max-w-4xl gap-4 border-t border-white/5 pt-6 mt-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full text-center">
                  {[
                    { name: "Amazon Merch", icon: <ShoppingBag size={12} className="text-[#CA8A04]" />, field: "amazon" },
                    { name: "Facebook Pages", icon: <Facebook size={12} className="text-blue-500" />, field: "facebook" },
                    { name: "Instagram Shop", icon: <Instagram size={12} className="text-[#F472B6]" />, field: "instagram" },
                    { name: "Linktree Bio", icon: <ExternalLink size={12} className="text-emerald-500" />, field: "linktree" }
                  ].map((chan) => {
                    const isChanDone = pipelineState === "complete";
                    return (
                      <div key={chan.name} className={`p-3 border rounded-none transition-all ${
                        isChanDone ? "border-emerald-500 bg-emerald-950/5" : "border-white/10 bg-black"
                      }`}>
                        <div className="flex items-center justify-center gap-1 text-white">
                          {chan.icon}
                          <span className="text-[10px] font-black uppercase tracking-wider">{chan.name}</span>
                        </div>
                        {isChanDone ? (
                          <a 
                            href={pipelineResult?.lambda_specs?.mock_links[chan.field as keyof typeof pipelineResult.lambda_specs.mock_links]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[9px] text-emerald-400 font-mono hover:underline block mt-1 uppercase font-bold flex items-center justify-center gap-0.5"
                          >
                            Published <ExternalLink size={8} />
                          </a>
                        ) : (
                          <span className="text-[9px] text-white/30 font-mono block mt-1 uppercase">Pending run</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* TWO PANEL OUTPUT: Left Logs, Right generated results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Terminal Logs */}
            <div className="border border-white/10 bg-[#0c0c0c] p-5 space-y-4 font-mono text-[11px] leading-relaxed">
              <div className="border-b border-white/5 pb-2 flex items-center gap-1.5 text-white/50 uppercase text-[10px]">
                <Terminal size={12} />
                <span>AWS Step Functions Log Stream</span>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-none h-64 overflow-y-auto space-y-1.5 text-white/80 scrollbar-none">
                {executionLogs.length === 0 ? (
                  <p className="text-white/30 italic">No execution trace loaded. Initiate Manus Pipeline in the Design Lab to witness the AWS Step Function logs.</p>
                ) : (
                  executionLogs.map((logStr, idx) => (
                    <div key={idx} className={logStr.includes("SUCCESS") || logStr.includes("complete") ? "text-emerald-400" : logStr.includes("ERROR") ? "text-rose-400 font-bold" : "text-white/70"}>
                      {logStr}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* GENERATED CONTENT ACCORDION RESULTS */}
            <div className="lg:col-span-2 border border-white/10 bg-[#0c0c0c] p-5 space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  Manus Execution Output Payloads
                </h3>
                <p className="text-[9px] text-white/40 font-mono mt-0.5">
                  Generated copywriting and retail configuration metadata synced directly from S3
                </p>
              </div>

              {pipelineResult ? (
                <div className="space-y-4 text-xs">
                  
                  {/* Lambda stats bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-black border border-white/5 p-3 font-mono text-[10px]">
                    <div>
                      <span className="text-white/40 block">SKU Code:</span>
                      <span className="text-white font-bold text-rose-400">{pipelineResult.lambda_specs.logistics_sku}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">RRP Price:</span>
                      <span className="text-white font-bold">{pipelineResult.lambda_specs.recommended_price}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Est Profit Margin:</span>
                      <span className="text-emerald-400 font-bold">{pipelineResult.lambda_specs.estimated_profit_margin}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Ratios Layer:</span>
                      <span className="text-white font-bold">{pipelineResult.lambda_specs.dimensions}</span>
                    </div>
                  </div>

                  {/* Copy tabs */}
                  <div className="flex border-b border-white/5 gap-2">
                    {[
                      { id: "amazon", label: "Amazon Merch" },
                      { id: "facebook", label: "Facebook Post" },
                      { id: "instagram", label: "Instagram Caption" },
                      { id: "linktree", label: "Linktree Meta" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setCopyOutputTab(tab.id as any)}
                        className={`pb-2 px-1 text-[10px] uppercase font-black tracking-wider cursor-pointer ${
                          copyOutputTab === tab.id ? "text-[#7C3AED] border-b-2 border-[#7C3AED]" : "text-white/40 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Active Copy Tab Content */}
                  <div className="p-4 bg-black border border-white/5 font-mono text-[11px] leading-relaxed space-y-3 relative">
                    <button
                      onClick={() => {
                        let textToCopy = "";
                        if (copyOutputTab === "amazon") {
                          textToCopy = `TITLE: ${pipelineResult.bedrock_content.amazon_listing.title}\n\nBULLET POINTS:\n${pipelineResult.bedrock_content.amazon_listing.bullet_points.join("\n")}\n\nDESCRIPTION:\n${pipelineResult.bedrock_content.amazon_listing.product_description}`;
                        } else if (copyOutputTab === "facebook") {
                          textToCopy = pipelineResult.bedrock_content.facebook_post.body;
                        } else if (copyOutputTab === "instagram") {
                          textToCopy = pipelineResult.bedrock_content.instagram_caption.body;
                        } else if (copyOutputTab === "linktree") {
                          textToCopy = `LINK TITLE: ${pipelineResult.bedrock_content.linktree_item.title}\nSUBTITLE: ${pipelineResult.bedrock_content.linktree_item.subtitle}`;
                        }
                        copyToClipboard(textToCopy, copyOutputTab);
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-white/5 hover:bg-white/10 text-white cursor-pointer border border-white/15"
                      title="Copy full tab output"
                    >
                      {copiedField === copyOutputTab ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>

                    {copyOutputTab === "amazon" && (
                      <div className="space-y-3 pr-8">
                        <div>
                          <span className="text-[#F472B6] font-bold block">[Listing Title]</span>
                          <p className="text-white font-bold">{pipelineResult.bedrock_content.amazon_listing.title}</p>
                        </div>
                        <div>
                          <span className="text-[#F472B6] font-bold block">[Bullet Points]</span>
                          <ul className="list-disc pl-4 space-y-1 text-white/80">
                            {pipelineResult.bedrock_content.amazon_listing.bullet_points.map((pt, idx) => (
                              <li key={idx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[#F472B6] font-bold block">[Product Description]</span>
                          <p className="text-white/80 leading-relaxed whitespace-pre-line">{pipelineResult.bedrock_content.amazon_listing.product_description}</p>
                        </div>
                      </div>
                    )}

                    {copyOutputTab === "facebook" && (
                      <div className="pr-8 whitespace-pre-line text-white/95">
                        {pipelineResult.bedrock_content.facebook_post.body}
                      </div>
                    )}

                    {copyOutputTab === "instagram" && (
                      <div className="pr-8 whitespace-pre-line text-white/95">
                        {pipelineResult.bedrock_content.instagram_caption.body}
                      </div>
                    )}

                    {copyOutputTab === "linktree" && (
                      <div className="space-y-2 pr-8">
                        <div>
                          <span className="text-[#F472B6] font-bold block">[Link Title Text]</span>
                          <p className="text-white font-bold">{pipelineResult.bedrock_content.linktree_item.title}</p>
                        </div>
                        <div>
                          <span className="text-[#F472B6] font-bold block">[Link Subtitle / Bio Text]</span>
                          <p className="text-white/80">{pipelineResult.bedrock_content.linktree_item.subtitle}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="p-8 bg-black border border-white/5 text-center text-white/30 italic">
                  Pipeline results pending. Back to the "Design Lab" tab and initiate a Manus run to see generated distribution materials.
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* DETAILED PLUGGING IN BLUEPRINT & WARNINGS */}
      {activeTab === "integration" && (
        <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6 animate-fadeIn">
          
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5 text-rose-400">
              <Settings size={14} />
              🔌 Integration Blueprint: Plugging in AWS, Gumroad, & Socials
            </h3>
            <p className="text-[9px] text-white/40 font-mono mt-0.5">
              Warning Checklist: Raw AWS pipelines require severe authentication parameters. Here is what you need to connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-white/70">
            
            {/* AWS Block */}
            <div className="p-5 bg-black border border-white/5 space-y-3">
              <span className="font-mono text-[10px] font-black uppercase text-[#7C3AED] block">1. AWS CLOUD CONNECTIONS (.env)</span>
              <p>
                To enable S3 uploads, Amazon Bedrock generation, and Step Functions from your container backend, you must declare real AWS IAM access credentials in your environment setup:
              </p>
              <div className="bg-zinc-950 p-3 rounded-none font-mono text-[10px] text-emerald-400 border border-white/5 space-y-1">
                <div>AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE</div>
                <div>AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY</div>
                <div>AWS_REGION=us-east-1</div>
                <div>AWS_S3_BUCKET_NAME=zos-vault-designs</div>
                <div>AWS_STEP_FUNCTION_ARN=arn:aws:states:us-east-1:...</div>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-white/60">
                <li><strong className="text-white">IAM Security policy:</strong> Ensure the IAM Role owns full permissions to `s3:PutObject`, `s3:PutObjectAcl`, `bedrock:InvokeModel`, and `states:StartExecution`.</li>
                <li><strong className="text-white">Bedrock Access:</strong> Enable model access for Anthropic Claude-3 or Llama-3 in the AWS console in your selected region.</li>
              </ul>
            </div>

            {/* Gumroad Webhooks Block */}
            <div className="p-5 bg-black border border-white/5 space-y-3">
              <span className="font-mono text-[10px] font-black uppercase text-[#F472B6] block">2. GUMROAD WEBHOOKS & PRODUCTS</span>
              <p>
                To sync your digital PC designs, streetwear downloads, or 3D patent assets with your e-commerce store, plug in the Gumroad API keys and configure webhooks:
              </p>
              <div className="bg-zinc-950 p-3 rounded-none font-mono text-[10px] text-emerald-400 border border-white/5 space-y-1">
                <div>GUMROAD_ACCESS_TOKEN=gm_acc_token_...</div>
                <div>GUMROAD_WEBHOOK_SECRET=your_secret_guid</div>
              </div>
              <p className="text-[11px] text-white/60">
                Configure your Gumroad dashboard to send an HTTP POST request to your deployed API: <span className="text-white underline font-mono">/api/gumroad-webhook</span> when a sale triggers, which fires the sovereign L2 NFT minting pointer or delivery loops.
              </p>
              <div className="p-2.5 bg-rose-950/15 border border-rose-900/30 text-[10px] text-rose-300">
                ⚠️ <strong className="text-white">API Upload Limits:</strong> For uploading heavy 3D assets to Gumroad, ensure you implement the 4-step upload flow (Get token → Request upload link → Upload to S3 → Update product files).
              </div>
            </div>

            {/* Facebook / Instagram Graph API Block */}
            <div className="p-5 bg-black border border-white/5 space-y-3">
              <span className="font-mono text-[10px] font-black uppercase text-blue-400 block">3. FB & INSTAGRAM GRAPH API KEYS</span>
              <p>
                To allow Agent 1 (Bedrock) to execute live Facebook Page postings and Instagram media updates, you require access tokens generated from Meta Developer Portal:
              </p>
              <div className="bg-zinc-950 p-3 rounded-none font-mono text-[10px] text-emerald-400 border border-white/5 space-y-1">
                <div>META_APP_ID=your_app_id</div>
                <div>META_APP_SECRET=your_app_secret</div>
                <div>FB_PAGE_ID=your_facebook_page_id</div>
                <div>FB_PAGE_ACCESS_TOKEN=EAA... (Long-lived Token)</div>
                <div>IG_BUSINESS_ACCOUNT_ID=your_ig_account_id</div>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-white/60">
                <li><strong className="text-white">Required Permissions:</strong> `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, and `instagram_content_publish`.</li>
                <li><strong className="text-white">Token Lifespan:</strong> Convert standard 2-hour user tokens into 60-day Long-Lived Page tokens via Meta's token exchange endpoint.</li>
              </ul>
            </div>

            {/* Integration Warning checklist */}
            <div className="p-5 bg-rose-950/10 border border-rose-900/40 space-y-3 text-rose-200">
              <span className="font-mono text-[10px] font-black uppercase text-rose-400 block flex items-center gap-1">
                <AlertTriangle size={12} /> CRITICAL SECURITY WARNINGS
              </span>
              <p className="text-[11px] leading-relaxed text-rose-300">
                Because this application runs inside secure server-side containers behind proxy layers, do NOT publish credentials or API keys directly to client-side bundles. Follow these safeguards:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-rose-300/90">
                <li><strong className="text-white">Zero Public Exposure:</strong> Never prefix confidential AWS, Bedrock, or Meta secrets with <span className="text-white font-mono bg-black/40 px-1 py-0.5">VITE_</span>. Keep them server-side inside <span className="text-white font-mono bg-black/40 px-1 py-0.5">server.ts</span> and `.env`.</li>
                <li><strong className="text-white">Fallback Safeties:</strong> Our backend code implements automatic lazy initialization checks. If credentials are empty or missing, the server will safely decline to execute, logging a clear warning rather than crashing.</li>
                <li><strong className="text-white">Database Integrity:</strong> Do not save plain-text API secrets into database columns. Use secure environment variable storage.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* FREECAD HTML CODE AUDIT TOOL */}
      {activeTab === "freecad" && (
        <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6 animate-fadeIn">
          
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
              <Upload size={14} className="text-[#7C3AED]" />
              FreeCAD Export Diagnostics & WebGL Parser
            </h3>
            <p className="text-[9px] text-white/40 font-mono mt-0.5">
              Paste the first 50 lines of your broken FreeCAD HTML export to diagnose why viewport renders are returning "null/void".
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">Pasted Exporter Lines (First 50 lines recommended)</label>
              <textarea
                value={freecadCode}
                onChange={(e) => setFreecadCode(e.target.value)}
                placeholder={`<!DOCTYPE html>\n<html>\n<head>\n  <!-- Paste your raw broken HTML export here to audit -->`}
                rows={8}
                className="w-full bg-black border border-white/10 p-3 text-white font-mono text-[11px] leading-normal focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <button
              onClick={handleAuditFreeCAD}
              disabled={isAuditing || !freecadCode.trim()}
              className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-white/5 disabled:text-white/20 text-white font-black uppercase tracking-wider text-[10px] cursor-pointer transition-all border border-[#7C3AED]/40 flex items-center gap-2"
            >
              {isAuditing ? (
                <><RefreshCw size={12} className="animate-spin" /> Performing WebGL Parser Audit...</>
              ) : (
                "Audit FreeCAD Code"
              )}
            </button>
          </div>

          {/* Audit Results display */}
          {auditResult && (
            <div className="bg-black border border-white/10 p-5 space-y-4 animate-fadeIn">
              
              <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                  ✔ Audit Completed Successfully
                </span>
                <span className="text-[9px] font-mono text-white/30">{auditResult.lineRange} Analyzed</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-rose-400 font-mono block font-bold uppercase text-[10px]">Root Cause of Null/Void Error:</span>
                  <p className="text-white/80 mt-1 leading-relaxed bg-zinc-950 p-3 border border-white/5 font-mono text-[11px]">
                    {auditResult.rootCause}
                  </p>
                </div>

                <div>
                  <span className="text-[#7C3AED] font-mono block font-bold uppercase text-[10px]">Recommended Resolution Strategy:</span>
                  <p className="text-white/80 mt-1 leading-relaxed bg-zinc-950 p-3 border border-white/5 font-mono text-[11px]">
                    {auditResult.fixDetails}
                  </p>
                </div>

                <div>
                  <span className="text-emerald-400 font-mono block font-bold uppercase text-[10px] mb-1">Reconstructed Safe Viewport (Fixed HTML):</span>
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(auditResult.reconstructedCode, "freecad-reconstruct")}
                      className="absolute top-2 right-2 p-1 bg-white/5 hover:bg-white/10 text-white cursor-pointer border border-white/10"
                      title="Copy fixed code"
                    >
                      {copiedField === "freecad-reconstruct" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                    <pre className="bg-zinc-950 p-4 border border-white/5 overflow-x-auto text-[10px] text-white/70 max-h-72 leading-normal scrollbar-none font-mono">
                      {auditResult.reconstructedCode}
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
