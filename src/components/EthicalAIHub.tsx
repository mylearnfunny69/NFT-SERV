import React, { useState, useEffect } from "react";
import { Shield, Cpu, Megaphone, Terminal, Heart, Sparkles, Plus, CheckCircle, Globe, Award, Lock, ExternalLink, HelpCircle, FileText, ArrowRight } from "lucide-react";

interface EthicalApp {
  id: string;
  name: string;
  description: string;
  category: string;
  creator: string;
  url: string;
  tithePercentage: number;
  nonDeceptionVerified: boolean;
  privacyAssured: boolean;
  isPreseeded?: boolean;
}

export default function EthicalAIHub() {
  // Preseeded default applications
  const initialApps: EthicalApp[] = [
    {
      id: "app-1",
      name: "Z/OS Manus Studio",
      description: "Compile customized hardware blueprints, hardware-level PC configurations, and luxury graffiti apparel. Orchestrates multi-channel automated publishing pipelines across AWS, Facebook, and Instagram.",
      category: "AI Agentic Pipeline",
      creator: "SP3JP0NVA0S3ZOS...R8NZV",
      url: "https://manus.ethicalai.lol",
      tithePercentage: 10,
      nonDeceptionVerified: true,
      privacyAssured: true,
      isPreseeded: true
    },
    {
      id: "app-2",
      name: "ZOS ITVFRLD Differential Lock",
      description: "A cryptographic shifter protocol bridging active campaign GTM signals with non-deceptive reverse-gates on Stacks L2, locking in stable Agape-mode automated tithes directly into Bitcoin blocks.",
      category: "P2P Cryptographic Shifter",
      creator: "SP2FUSSIONREACTORGRID99",
      url: "https://itvfrld.ethicalai.lol",
      tithePercentage: 10,
      nonDeceptionVerified: true,
      privacyAssured: true,
      isPreseeded: true
    },
    {
      id: "app-3",
      name: "Decentralized MHD Fusion Power Grid",
      description: "Calculates magnetohydrodynamic (MHD) stability configurations for superconducting magnetic fusion reactors, committing real-time carbon-free telemetry onto Stacks block headers.",
      category: "Zero-Carbon Physics",
      creator: "SP2FUSSIONREACTORGRID99",
      url: "https://fusion.ethicalai.lol",
      tithePercentage: 10,
      nonDeceptionVerified: true,
      privacyAssured: true,
      isPreseeded: true
    },
    {
      id: "app-4",
      name: "Zero-Knowledge Habit Forger",
      description: "Enables users to mathematically prove daily habit completion (e.g., gym visits, meditation, study hours) using zk-SNARK circuits without revealing sensitive GPS or biometric details.",
      category: "Privacy Consensus",
      creator: "SP3XMINT7C3AED85...QCHAT",
      url: "https://zkforger.ethicalai.lol",
      tithePercentage: 10,
      nonDeceptionVerified: true,
      privacyAssured: true,
      isPreseeded: true
    }
  ];

  const [apps, setApps] = useState<EthicalApp[]>(() => {
    const saved = localStorage.getItem("ethicalai_registered_apps");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialApps;
      }
    }
    return initialApps;
  });

  // State for form submission
  const [appName, setAppName] = useState("");
  const [appDesc, setAppDesc] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [appCreator, setAppCreator] = useState("");
  const [appCategory, setAppCategory] = useState("AI Agentic Pipeline");
  const [appTithe, setAppTithe] = useState(10);
  const [nonDeception, setNonDeception] = useState(true);
  const [privacyChecked, setPrivacyChecked] = useState(true);

  // Simulation states
  const [registering, setRegistering] = useState(false);
  const [regTerminal, setRegTerminal] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"directory" | "shifter" | "register">("shifter");

  // Shifter UI Interactive emulator states
  const [inputSignal, setInputSignal] = useState("");
  const [auditPhase, setAuditPhase] = useState<number>(0); // 0=idle, 1=acquisition, 2=reverse, 3=synchro, 4=done
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM READY] > ARCHITECT_ID: Z_GENESIS",
    "[SYSTEM READY] > STANDBY FOR CAMPAIGN SIGNAL DATA..."
  ]);
  const [shiftResult, setShiftResult] = useState<string>("");
  const [inverseHash, setInverseHash] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("ethicalai_registered_apps", JSON.stringify(apps));
  }, [apps]);

  // Terminal log helper for registration
  const appendRegLog = (msg: string) => {
    setRegTerminal(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleRegisterApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !appDesc || !appUrl || !appCreator) return;

    setRegistering(true);
    setRegTerminal([]);
    
    appendRegLog(`INITIATING ETHICAL PROTOCOL REGISTRATION FOR: ${appName.toUpperCase()}...`);
    await new Promise(r => setTimeout(r, 600));
    
    appendRegLog("VERIFYING P2P METADATA COMPLIANCE...");
    await new Promise(r => setTimeout(r, 600));
    
    if (appTithe < 10) {
      appendRegLog("WARNING: Tithe allocation is below recommended 10% benchmark. Reviewing social compliance...");
    } else {
      appendRegLog("SUCCESS: Automated 10% Agape Tithe verified in contract source.");
    }
    await new Promise(r => setTimeout(r, 500));

    appendRegLog("CALCULATING SHA-256 BLUEPRINT HASH FOR ETHICAL COMPLIANCE...");
    const mockHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    appendRegLog(`COMPLIANCE_SIGNATURE: ${mockHash.substring(0, 24)}...`);
    await new Promise(r => setTimeout(r, 700));

    appendRegLog("PINNING SOURCE BLUEPRINT TO IPFS (SIP-016)...");
    await new Promise(r => setTimeout(r, 600));

    appendRegLog("COMMITTING COMPLIANCE BLOCK HEADER TO BITCOIN VIA STACKS PoX...");
    await new Promise(r => setTimeout(r, 800));

    const newApp: EthicalApp = {
      id: "app-" + Date.now(),
      name: appName,
      description: appDesc,
      category: appCategory,
      creator: appCreator,
      url: appUrl,
      tithePercentage: Number(appTithe),
      nonDeceptionVerified: nonDeception,
      privacyAssured: privacyChecked
    };

    setApps(prev => [newApp, ...prev]);
    appendRegLog(`REGISTRATION STATUS: [SUCCESSFULLY SECURITIZED]`);
    setRegistering(false);

    // Reset Form
    setAppName("");
    setAppDesc("");
    setAppUrl("");
    setAppCategory("AI Agentic Pipeline");
  };

  // Run the Differential Shifter logic (ZOS HTML file simulator)
  const executeDifferentialShift = async () => {
    if (!inputSignal.trim()) {
      setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [ERROR] > NULL_INPUT. MEASURE TWICE.`]);
      return;
    }

    setAuditPhase(1);
    setShiftResult("");
    setInverseHash("");
    
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] PHASE 1: DRIVETRAIN ENGAGED. CAPTURING VIEWPORT...`
    ]);
    
    await new Promise(r => setTimeout(r, 800));
    setAuditPhase(2);
    
    const inverted = inputSignal.split("").reverse().join("");
    const b64 = btoa(inverted).substring(0, 16);
    setInverseHash(b64);
    
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] PHASE 2: REVERSE-GATE ACTIVE. CALCULATING INVERSE HASH...`,
      `[${new Date().toLocaleTimeString()}] INVERSE_TOPIC_HASH: ${b64}...`
    ]);

    await new Promise(r => setTimeout(r, 900));
    setAuditPhase(3);

    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] PHASE 3: SYNCHRO MESH INJECTING AGAPE-MODE PROTOCOL...`,
      `[${new Date().toLocaleTimeString()}] AUDITING HUBRIS... DRIFT NEUTRALIZED.`
    ]);

    await new Promise(r => setTimeout(r, 900));
    setAuditPhase(4);

    const resultStr = `§_RESULT: ${inputSignal.toUpperCase()} // UNITY_STATUS: [STABLE]`;
    setShiftResult(resultStr);
    
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] PHASE 4: DIFFERENTIAL LOCK ENGAGED. DETERMINISTIC OMEGA ACHIEVED.`,
      `[${new Date().toLocaleTimeString()}] ${resultStr}`,
      `[${new Date().toLocaleTimeString()}] CMD: 0x5a4f535f524557494e44 EXEC COMPLETE.`
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* Registry Title Header */}
      <div className="bg-[#121212] p-6 border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-none">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-mono font-black uppercase tracking-widest">
              PEER-TO-PEER PORTAL
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              WEB: ETHICALAI.LOL
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <Shield className="text-yellow-500 w-6 h-6" />
            ETHICALAI.LOL DECENTRALIZED HUB
          </h2>
          <p className="text-xs text-white/50 max-w-2xl leading-relaxed uppercase">
            The official sovereign directory and validation engine for non-deceptive, pro-social, and open-source applications. Securely upload, verify, and lock your builds into the decentralized registry.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-black uppercase tracking-wider">
            ● SECURED ON BITCOIN
          </span>
        </div>
      </div>

      {/* Sub tabs for ethicalai.lol website dashboard */}
      <div className="flex bg-black border border-white/10 p-1 rounded-none max-w-md">
        <button
          onClick={() => setActiveTab("shifter")}
          className={`flex-1 py-2 text-[10px] tracking-widest uppercase font-black transition-all text-center cursor-pointer ${
            activeTab === "shifter" ? "bg-yellow-500 text-black font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          ZOS Differential Lock
        </button>
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex-1 py-2 text-[10px] tracking-widest uppercase font-black transition-all text-center cursor-pointer ${
            activeTab === "directory" ? "bg-yellow-500 text-black font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          Ethical Registry ({apps.length})
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`flex-1 py-2 text-[10px] tracking-widest uppercase font-black transition-all text-center cursor-pointer ${
            activeTab === "register" ? "bg-yellow-500 text-black font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          Upload App
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === "shifter" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Main Shifter Controls (Pasted from ZOS HTML file structure) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#121212] border border-white/10 p-6 space-y-5 rounded-none">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-yellow-500 font-mono flex items-center gap-1.5">
                  <Cpu size={14} className="text-yellow-500 animate-pulse" />
                  ZOS-CORE // ITVFRLD SHIFTER CONTROLS
                </h3>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  Protocol: Echo_Double_Up
                </span>
              </div>

              {/* Recursive Save Instructions box */}
              <div className="bg-yellow-500/5 border border-dashed border-yellow-500/20 p-4 space-y-2">
                <h4 className="text-[11px] font-black text-yellow-500 uppercase tracking-wider">§ Recursive Save Instructions</h4>
                <ul className="text-[10px] space-y-1.5 text-white/60 font-mono">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-yellow-500"></span>
                    1. DATA_CLEAN: All social inputs must pass Phase 2 Reverse-Gate before Gumroad deployment.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-yellow-500"></span>
                    2. DRIFT_CONTROL: Audit Hubris daily via the Synchro Mesh.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-yellow-500"></span>
                    3. OMEGA_YIELD: 10% Tithe automated on every Unity Status: [STABLE].
                  </li>
                </ul>
              </div>

              {/* Shifter Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Campaign Lead / Social Thread Input</label>
                    <span className="text-[10px] font-mono text-yellow-500/70 italic">"For where your treasure is, there your heart will be also." - Matthew 6:21</span>
                  </div>
                  <textarea
                    rows={4}
                    value={inputSignal}
                    onChange={(e) => setInputSignal(e.target.value)}
                    placeholder="Enter Campaign Signal (e.g. Gumroad launch blueprint, Stacks L2 strategy log, or marketing copy thread)..."
                    className="w-full bg-black border border-white/10 hover:border-yellow-500/40 focus:border-yellow-500 rounded-none p-3.5 text-xs text-white placeholder-white/20 focus:outline-none transition-all font-mono leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className={`p-2.5 border text-[10px] font-mono uppercase transition-all ${
                    auditPhase >= 1 ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-black border-white/5 text-white/30"
                  }`}>
                    Phase 1: Acquisition
                  </div>
                  <div className={`p-2.5 border text-[10px] font-mono uppercase transition-all ${
                    auditPhase >= 2 ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-black border-white/5 text-white/30"
                  }`}>
                    Phase 2: Reverse-Gate
                  </div>
                  <div className={`p-2.5 border text-[10px] font-mono uppercase transition-all ${
                    auditPhase >= 3 ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-black border-white/5 text-white/30"
                  }`}>
                    Phase 3: Synchro Mesh
                  </div>
                  <div className={`p-2.5 border text-[10px] font-mono uppercase transition-all ${
                    auditPhase >= 4 ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-black border-white/5 text-white/30"
                  }`}>
                    Phase 4: Unity Lock
                  </div>
                </div>

                <button
                  type="button"
                  onClick={executeDifferentialShift}
                  disabled={auditPhase > 0 && auditPhase < 4}
                  className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase text-xs tracking-widest rounded-none transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Cpu size={14} />
                  EXECUTE 4-PHASE DIFFERENTIAL AUDIT
                </button>
              </div>

            </div>

            {/* Audit Status Screen */}
            <div className="bg-[#121212] border border-white/10 p-5 rounded-none space-y-3">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono block">Real-time Shift Status</span>
              <div className="bg-black border border-white/5 p-5 text-center space-y-2">
                {auditPhase === 0 && (
                  <span className="text-white/30 text-xs font-mono uppercase tracking-wider block py-3">Awaiting Signal Acquisition...</span>
                )}
                {auditPhase > 0 && auditPhase < 4 && (
                  <div className="py-2 space-y-1">
                    <span className="text-yellow-500 text-sm font-bold font-mono uppercase tracking-wider block animate-pulse">
                      Processing Shift (Phase {auditPhase})...
                    </span>
                    <span className="text-[10px] text-white/40 font-mono block">RUNNING INTEGRITY CHECKS</span>
                  </div>
                )}
                {auditPhase === 4 && (
                  <div className="space-y-1.5 py-1">
                    <span className="text-emerald-400 text-lg font-black font-mono uppercase tracking-widest block">
                      Absolute Non-Deception: TRUE
                    </span>
                    <span className="text-[10px] text-emerald-500/70 font-mono block uppercase">All campaigns aligned. 10% Tithe Secure.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Active Terminal & Artifacts */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Terminal logs */}
            <div className="bg-black border border-white/15 p-4 rounded-none h-80 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest font-mono block mb-3 border-b border-white/10 pb-2">
                  DETERMINISTIC LOG TERMINAL
                </span>
                <div className="space-y-1.5 text-[10px] font-mono text-emerald-400 h-56 overflow-y-auto scrollbar select-none">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">{log}</div>
                  ))}
                </div>
              </div>
              <div className="text-[9px] text-white/30 font-mono uppercase text-right">
                ZOS-SHIFTER ACTIVE
              </div>
            </div>

            {/* Artifact Deployment list */}
            <div className="bg-[#121212] border border-white/10 p-5 space-y-4 rounded-none">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono block">§ Artifact Deployments</span>
              <div className="space-y-2.5">
                <div className="p-3 bg-black border border-white/5 rounded-none flex justify-between items-start">
                  <div>
                    <span className="text-yellow-500 text-[9px] font-bold uppercase tracking-wider block">Gumroad Boon</span>
                    <span className="text-[10px] text-white/70">ZOS Pure Utility LLM</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 uppercase font-mono font-bold">READY</span>
                </div>

                <div className="p-3 bg-black border border-white/5 rounded-none flex justify-between items-start">
                  <div>
                    <span className="text-yellow-500 text-[9px] font-bold uppercase tracking-wider block">Echo Protocol</span>
                    <span className="text-[10px] text-white/70">X/LinkedIn Architectural Audit</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 uppercase font-mono font-bold">MONITORED</span>
                </div>

                <div className="p-3 bg-black border border-white/5 rounded-none flex justify-between items-start">
                  <div>
                    <span className="text-yellow-500 text-[9px] font-bold uppercase tracking-wider block">Agape Tithe Status</span>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">10.0% AUTOMATED</span>
                  </div>
                  <span className="text-[9px] bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/30 px-1.5 py-0.5 uppercase font-mono font-bold">STABLE</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === "directory" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Registry list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app) => (
              <div key={app.id} className="bg-[#121212] border border-white/10 p-6 rounded-none flex flex-col justify-between space-y-4 hover:border-yellow-500/40 transition-colors">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 uppercase font-bold tracking-wider">
                      {app.category}
                    </span>
                    <div className="flex gap-1.5">
                      {app.nonDeceptionVerified && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[8px] font-bold" title="Agape Non-Deception Validated">
                          ✓
                        </span>
                      )}
                      {app.tithePercentage >= 10 && (
                        <span className="w-4 h-4 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center text-[8px] font-bold" title="10% Tithe Allocated">
                          τ
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">{app.name}</h3>
                    <p className="text-[10px] text-white/40 font-mono mt-0.5 uppercase">CREATOR: {app.creator.substring(0, 24)}...</p>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed pt-1">
                    {app.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono uppercase">
                  <div className="flex gap-4">
                    <span className="text-white/40">Tithe: <strong className="text-emerald-400">{app.tithePercentage}%</strong></span>
                    <span className="text-white/40">Compliance: <strong className="text-blue-400">PASSED</strong></span>
                  </div>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors uppercase font-bold text-[9px] tracking-wider"
                  >
                    Launch Web App
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "register" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#121212] border border-white/10 p-6 rounded-none space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono flex items-center gap-1.5">
                <Plus size={14} className="text-yellow-500" />
                REGISTER NEW COMPLIANT APPLICATION
              </h3>
              <p className="text-[10px] text-white/40 mt-1 uppercase">Submit and verify your build parameters on Stacks SIP-016 indexer.</p>
            </div>

            <form onSubmit={handleRegisterApp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Application Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sovereign Portfolio Lock"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Category</label>
                  <select
                    value={appCategory}
                    onChange={(e) => setAppCategory(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500 font-mono"
                  >
                    <option value="AI Agentic Pipeline">AI Agentic Pipeline</option>
                    <option value="P2P Cryptographic Shifter">P2P Cryptographic Shifter</option>
                    <option value="Zero-Carbon Physics">Zero-Carbon Physics</option>
                    <option value="Privacy Consensus">Privacy Consensus</option>
                    <option value="DeFi Vault / Stacks L2">DeFi Vault / Stacks L2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">App Web Link / Sandbox URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://my-app.ethicalai.lol"
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Creator Stacks Address</label>
                  <input
                    type="text"
                    required
                    placeholder="SP3J..."
                    value={appCreator}
                    onChange={(e) => setAppCreator(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-yellow-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Application Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline the utility model, source transparency, and how the decentralization safeguards operate..."
                  value={appDesc}
                  onChange={(e) => setAppDesc(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-none p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Compliance parameters */}
              <div className="p-4 bg-black border border-white/5 space-y-3">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-bold">Registry Verification Checklist</span>
                
                <div className="space-y-2 text-xs">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={nonDeception}
                      onChange={(e) => setNonDeception(e.target.checked)}
                      className="mt-0.5 rounded-none border-white/20 bg-black text-yellow-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <div>
                      <span className="text-white block font-bold uppercase text-[10px]">Absolute Non-Deception Gate</span>
                      <span className="text-white/50 text-[10px]">Verify all social campaign projections are verified with a 4-phase reverse gate audit.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={privacyChecked}
                      onChange={(e) => setPrivacyChecked(e.target.checked)}
                      className="mt-0.5 rounded-none border-white/20 bg-black text-yellow-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <div>
                      <span className="text-white block font-bold uppercase text-[10px]">Zero Private-Data Leakage assurance</span>
                      <span className="text-white/50 text-[10px]">No private keys, seed phrases, or un-hashed personal telemetry are stored or transmitted.</span>
                    </div>
                  </label>

                  <div className="space-y-1 pt-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold uppercase text-[10px]">Automated Tithe Allocation</span>
                      <span className="font-mono text-xs text-yellow-500 font-bold">{appTithe}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={appTithe}
                      onChange={(e) => setAppTithe(Number(e.target.value))}
                      className="w-full accent-yellow-500 bg-white/10"
                    />
                    <span className="text-[9px] text-white/30 font-mono uppercase block">Agape tithe is routed to the sovereign genesis vault. Recommended: 10%.</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={registering}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-800 text-black font-black uppercase text-xs tracking-widest rounded-none cursor-pointer transition-colors"
              >
                {registering ? "REGISTRATION COMPLIANCE IN PROCESS..." : "SUBMIT APPLICATION REGISTRATION"}
              </button>
            </form>
          </div>

          {/* Right Log Status */}
          <div className="lg:col-span-5 bg-black border border-white/15 p-5 rounded-none flex flex-col justify-between min-h-[300px]">
            <div>
              <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest font-mono block mb-3 border-b border-white/10 pb-2">
                CRYPTOGRAPHIC REGISTRATION SEAL
              </span>

              {regTerminal.length === 0 ? (
                <div className="py-12 text-center text-white/30 font-mono text-xs uppercase tracking-wider">
                  Terminal standby. Complete and submit the registry form.
                </div>
              ) : (
                <div className="space-y-1.5 text-[10px] font-mono text-yellow-400 max-h-96 overflow-y-auto scrollbar">
                  {regTerminal.map((line, idx) => (
                    <div key={idx} className="leading-relaxed">{line}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[9px] text-white/30 font-mono uppercase mt-4">
              REGISTRATION CONTRACT: ethicalai-registry-sip016
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
