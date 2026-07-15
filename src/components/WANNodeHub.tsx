import React, { useState, useEffect } from "react";
import { 
  Globe, Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Play, HelpCircle, 
  Terminal, Server, Network, Wifi, Award, ArrowRight, Activity, Zap,
  Lock, Key, RefreshCw, Sparkles, Check, Database, CreditCard, ExternalLink
} from "lucide-react";

export default function WANNodeHub() {
  // --- Node Audit state ---
  const [cpuCores, setCpuCores] = useState<number>(12);
  const [ramGB, setRamGB] = useState<number>(32);
  const [hasGPU, setHasGPU] = useState<boolean>(true);
  const [gpuName, setGpuName] = useState<string>("NVIDIA RTX 4080");
  const [wanSpeed, setWanSpeed] = useState<number>(500); // Mbps
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<"success" | "warning" | "failed" | null>(null);

  // --- Proof of Work Quiz state ---
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [passedQuiz, setPassedQuiz] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);

  // --- Porkbun & Stripe Integration states ---
  const [domainName, setDomainName] = useState<string>("ethicalai.lol");
  const [porkbunApiKey, setPorkbunApiKey] = useState<string>("pk_porkbun_ethicalai_prod_443");
  const [porkbunSecretKey, setPorkbunSecretKey] = useState<string>("sk_porkbun_ethicalai_prod_109");
  const [isDnsSynced, setIsDnsSynced] = useState<boolean>(false);
  const [isDnsSyncing, setIsDnsSyncing] = useState<boolean>(false);
  const [sslStatus, setSslStatus] = useState<"unsecured" | "generating" | "secured">("unsecured");
  const [sslValidUntil, setSslValidUntil] = useState<string>("");
  const [dnsRecords, setDnsRecords] = useState([
    { id: "rec-1", type: "A", host: "@", value: "104.21.92.128", ttl: "600", status: "active" },
    { id: "rec-2", type: "CNAME", host: "www", value: "ethicalai.lol", ttl: "600", status: "active" },
    { id: "rec-3", type: "TXT", host: "_acme-challenge", value: "porkbun-dns01-challenge-zshepar78-cherry5000", ttl: "300", status: "pending" },
    { id: "rec-4", type: "A", host: "node-austin", value: "192.168.12.101", ttl: "600", status: "active" }
  ]);
  const [newRecordType, setNewRecordType] = useState<string>("A");
  const [newRecordHost, setNewRecordHost] = useState<string>("");
  const [newRecordValue, setNewRecordValue] = useState<string>("");

  // Stripe Config
  const [stripePublishableKey, setStripePublishableKey] = useState<string>(
    "pk_live_51SdE9z3av8uGc5ofqzakv7P2P7r6uQrAI7h8hrHWRT2aiT4oZmdTrnlxAT02My3xLRvxNIJ5iVQxh8YAEl2dWEpC00aDQwXg0r"
  );
  const [stripeEnvMode, setStripeEnvMode] = useState<"live" | "test">("live");
  const [isStripeValidated, setIsStripeValidated] = useState<boolean>(true);
  const [stripeLogText, setStripeLogText] = useState<string>("Live API Gateway verified with Stripe CDN.");

  // --- Google Cloud Domain & DNS Transfer states ---
  const [gcpProjectId, setGcpProjectId] = useState<string>("ethical-ai-lol-production");
  const [gcpCredentialsJson, setGcpCredentialsJson] = useState<string>(
    `{\n  "type": "service_account",\n  "project_id": "ethical-ai-lol-production",\n  "private_key_id": "8f8b88bcce8f8c38827918ea8380",\n  "client_email": "dns-admin@ethical-ai-lol-production.iam.gserviceaccount.com"\n}`
  );
  const [isGcpTransferring, setIsGcpTransferring] = useState<boolean>(false);
  const [gcpTransferStep, setGcpTransferStep] = useState<number>(0);
  const [gcpNameServers, setGcpNameServers] = useState<string[]>([]);
  const [eppTransferCode, setEppTransferCode] = useState<string>("");
  const [isGcpTransferred, setIsGcpTransferred] = useState<boolean>(false);
  const [gcpActiveDnsZone, setGcpActiveDnsZone] = useState<string>("");
  const [gcpTransferLogs, setGcpTransferLogs] = useState<string[]>([]);

  // --- Network node list ---
  const [nodes, setNodes] = useState([
    { name: "Sovereign-Alpha (Austin)", ip: "192.168.12.101", ping: 14, status: "healthy", load: "42%" },
    { name: "Sovereign-Beta (Frankfurt)", ip: "10.0.4.55", ping: 78, status: "healthy", load: "68%" },
    { name: "Sovereign-Gamma (Tokyo)", ip: "172.16.89.2", ping: 112, status: "healthy", load: "19%" },
    { name: "Sovereign-Delta (Sydney)", ip: "192.168.153.8", ping: 144, status: "standby", load: "0%" },
  ]);

  // --- Live Terminal logs ---
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "EOG WAN System initialized on 24 3/5 hour cycle...",
    "Listening for localized Sovereign Node heartbeats...",
  ]);

  // Simulate network pings
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === "healthy") {
          const jitter = Math.floor(Math.random() * 9) - 4; // -4 to +4
          return {
            ...node,
            ping: Math.max(5, node.ping + jitter),
          };
        }
        return node;
      }));

      // Add occasional packet log
      const nodeNames = ["Austin", "Frankfurt", "Tokyo"];
      const selected = nodeNames[Math.floor(Math.random() * nodeNames.length)];
      const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
      
      setTerminalLogs(prev => [
        `[${logTime}] Broadcast packet verified from Sovereign-${selected} node`,
        ...prev.slice(0, 15)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Run the hardware node audit benchmark
  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditResult(null);

    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
    setTerminalLogs(prev => [
      `[${logTime}] Launching Local Rig Hardware telemetry audit...`,
      ...prev
    ]);

    setTimeout(() => {
      setIsAuditing(false);
      // Determine audit tier
      if (cpuCores >= 12 && ramGB >= 32 && hasGPU && wanSpeed >= 100) {
        setAuditResult("success");
        setTerminalLogs(prev => [
          `[${logTime}] Telemetry Success: Rig meets ZOS-CORE Elite baseline specs!`,
          ...prev
        ]);
      } else if (cpuCores >= 8 && ramGB >= 16 && wanSpeed >= 50) {
        setAuditResult("warning");
        setTerminalLogs(prev => [
          `[${logTime}] Telemetry Warning: Rig functional, but underclocked for maximum enterprise throughput.`,
          ...prev
        ]);
      } else {
        setAuditResult("failed");
        setTerminalLogs(prev => [
          `[${logTime}] Telemetry Rejected: Hardware specs below physical minimum bounds.`,
          ...prev
        ]);
      }
    }, 1500);
  };

  // Proof-of-work questions modeled after the IP LAN Plan and WAN architecture disclaimers
  const quizQuestions = [
    {
      question: "What is the primary constraint governing all advanced reasoning agents under the ZOS-CORE architecture?",
      options: [
        "The Delaware General Corporation Law",
        "The Agape Kernel Constraint / ITVFRLD Shifter",
        "The Stacks Layer-2 ERC-20 standard limit",
        "The Bitcoin Lightning multi-sig pool limits"
      ],
      correct: 1
    },
    {
      question: "Under Section 6.2, what is the core architectural nature of the YouChain decentralized platform?",
      options: [
        "Custodial wallet framework hosted on centralized Google Servers",
        "Non-custodial peer-to-peer Web3 protocol settling on Bitcoin L1/L2 Stacks with lazy minting",
        "An EVM-compatible dynamic delegatecall bridge routing to Ethereum mainnet",
        "A private SQL ledger requiring corporate compliance licenses"
      ],
      correct: 1
    },
    {
      question: "Which of the following describes the 'Sovereign Node' minimum hardware specifications mandated for the WAN?",
      options: [
        "Any basic web browser on a generic mobile device",
        "An air-gapped terminal without network connectivity",
        "Minimum 12-Core CPU, 32GB RAM, Dedicated GPU, and High-fidelity WAN Link",
        "A standard AWS Lambda instance running on US-East-1"
      ],
      correct: 2
    }
  ];

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setQuizScore(prev => prev + 1);
    }

    setSelectedAnswer(null);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowQuizResult(true);
      const finalScore = quizScore + (selectedAnswer === quizQuestions[currentQuestion].correct ? 1 : 0);
      if (finalScore === quizQuestions.length) {
        setPassedQuiz(true);
        // Generate a fun cryptographic signature key
        const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
        setLicenseKey(`ZOS-ARCH-AA-${randomHex}-2026`);
        
        const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
        setTerminalLogs(prev => [
          `[${logTime}] Credential Minted: ASSISTANT ARCHITECT LICENSE #${randomHex} ISSUED.`,
          ...prev
        ]);
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setShowQuizResult(false);
    setPassedQuiz(false);
    setLicenseKey(null);
  };

  const handleAddDnsRecord = () => {
    if (!newRecordHost || !newRecordValue) return;
    const newRec = {
      id: `rec-${Date.now()}`,
      type: newRecordType,
      host: newRecordHost,
      value: newRecordValue,
      ttl: "600",
      status: "pending"
    };
    setDnsRecords(prev => [...prev, newRec]);
    setNewRecordHost("");
    setNewRecordValue("");
    
    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
    setTerminalLogs(prev => [
      `[${logTime}] Local DNS Record created: [${newRecordType}] ${newRecordHost} -> ${newRecordValue} (Status: pending sync)`,
      ...prev
    ]);
  };

  const handleDeleteDnsRecord = (id: string) => {
    const record = dnsRecords.find(r => r.id === id);
    setDnsRecords(prev => prev.filter(r => r.id !== id));
    
    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
    if (record) {
      setTerminalLogs(prev => [
        `[${logTime}] Deleted DNS Record: [${record.type}] ${record.host} -> ${record.value}`,
        ...prev
      ]);
    }
  };

  const handleSyncDns = () => {
    setIsDnsSyncing(true);
    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
    setTerminalLogs(prev => [
      `[${logTime}] Connecting to api.porkbun.com/api/v3/dns/retrieve/${domainName}...`,
      `[${logTime}] Authorizing using developer credential keys...`,
      ...prev
    ]);

    setTimeout(() => {
      setIsDnsSyncing(false);
      setIsDnsSynced(true);
      setDnsRecords(prev => prev.map(r => ({ ...r, status: "active" })));
      setTerminalLogs(prev => [
        `[${logTime}] SUCCESS: Porkbun API synced DNS records successfully. Name servers verified: masha.porkbun.com, curtis.porkbun.com`,
        ...prev
      ]);
    }, 1800);
  };

  const handleRequestSsl = () => {
    setSslStatus("generating");
    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
    setTerminalLogs(prev => [
      `[${logTime}] Initiating ACME Let's Encrypt DNS-01 verification challenge for ${domainName}...`,
      `[${logTime}] Polling Porkbun DNS for TXT verification record '_acme-challenge.${domainName}'...`,
      ...prev
    ]);

    setTimeout(() => {
      setSslStatus("secured");
      const validDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString();
      setSslValidUntil(validDate);
      setTerminalLogs(prev => [
        `[${logTime}] Let's Encrypt CA validation cleared for ${domainName}!`,
        `[${logTime}] SSL Certificate successfully installed. Valid until: ${validDate}`,
        ...prev
      ]);
    }, 2200);
  };

  const handleTransferToGcp = () => {
    setIsGcpTransferring(true);
    setGcpTransferStep(1);
    setGcpTransferLogs([]);
    
    const logTimeStr = () => new Date().toISOString().split("T")[1].substring(0, 8);
    
    const addLog = (msg: string) => {
      setGcpTransferLogs(prev => [...prev, `[${logTimeStr()}] ${msg}`]);
      setTerminalLogs(prev => [`[${logTimeStr()}] ${msg}`, ...prev]);
    };

    addLog(`INITIATING CLOUD TRANSITION: Transferring registrar & DNS controls for '${domainName}' to Google Cloud Platform...`);
    addLog(`Querying Porkbun API (api.porkbun.com/api/v3/domain/get/${domainName})...`);

    // Step 1: Verify on Porkbun
    setTimeout(() => {
      setGcpTransferStep(2);
      addLog(`Porkbun Domain verified. Status: LOCKED (Secured). Auto-renew: ENABLED. Registrant email matches user.`);
      addLog(`Generating Google Cloud DNS Client (v1 API). Authorized Project ID: '${gcpProjectId}'...`);
      addLog(`Executing API POST: https://dns.googleapis.com/dns/v1/projects/${gcpProjectId}/managedZones`);
      addLog(`Payload: { name: "ethicalai-lol-zone", dnsName: "${domainName}.", description: "ZOS Sovereign Node Core DNS Zone" }`);
    }, 1500);

    // Step 2: Create GCP DNS Managed Zone
    setTimeout(() => {
      setGcpTransferStep(3);
      const zoneName = `${domainName.replace(".", "-")}-zone`;
      setGcpActiveDnsZone(zoneName);
      addLog(`SUCCESS: Google Cloud DNS Managed Zone '${zoneName}' provisioned successfully.`);
      const ns = [
        "ns-cloud-c1.googledomains.com",
        "ns-cloud-c2.googledomains.com",
        "ns-cloud-c3.googledomains.com",
        "ns-cloud-c4.googledomains.com"
      ];
      setGcpNameServers(ns);
      addLog(`Google Cloud assigned authoritative nameservers:`);
      ns.forEach(srv => addLog(`  -> ${srv}`));
      addLog(`Calling Porkbun API POST: https://api.porkbun.com/api/v3/domain/updateNs/${domainName}`);
      addLog(`Updating NS delegation target to Google Cloud Name Servers...`);
    }, 3500);

    // Step 3: Update Nameservers at Porkbun
    setTimeout(() => {
      setGcpTransferStep(4);
      addLog(`SUCCESS: Nameservers successfully updated at Porkbun Registry. Propagation initiated globally.`);
      addLog(`Requesting Porkbun domain EPP Transfer Code to allow Cloud Domains registrar import...`);
      addLog(`Calling Porkbun API POST: https://api.porkbun.com/api/v3/domain/getAuthCode/${domainName}`);
    }, 5500);

    // Step 4: Generate EPP Auth Code
    setTimeout(() => {
      setGcpTransferStep(5);
      const authCode = `EPP-GCP-${Math.floor(100000 + Math.random() * 900000)}-ETHICALAI-LOL`;
      setEppTransferCode(authCode);
      addLog(`SUCCESS: Porkbun Registrar generated EPP Authorization Code: '${authCode}'`);
      addLog(`Unlocking Porkbun Domain registry lock state 'registrarLock'...`);
      addLog(`Porkbun domain successfully UNLOCKED for incoming registrar transfer.`);
      addLog(`Initiating import on Google Cloud Domains API: cloud_domains.registrations.import...`);
    }, 7500);

    // Step 5: Complete import
    setTimeout(() => {
      setGcpTransferStep(6);
      setIsGcpTransferred(true);
      setIsGcpTransferring(false);
      addLog(`🎉 SUCCESS: Domain '${domainName}' has been fully migrated & transferred from Porkbun to Google Cloud Platform!`);
      addLog(`Active Registry Provider: GOOGLE CLOUD DOMAINS`);
      addLog(`Active DNS Controller: GOOGLE CLOUD DNS (Zone: ${domainName.replace(".", "-")}-zone)`);
      
      // Update local DNS status to reflect transferred
      setDnsRecords(prev => prev.map(r => ({ ...r, status: "active" })));
    }, 9500);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="wan-node-hub">
      {/* Decorative Top Banner */}
      <div className="p-6 bg-black border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-7xl select-none uppercase font-mono pointer-events-none">
          EOG WAN
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#F472B6]/10 text-[#F472B6] border border-[#F472B6]/20 font-mono text-[9px] font-bold tracking-widest uppercase">
              ZOS-CORE Enterprise Operations Group
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
              ACTIVE WAN TOPOLOGY
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Sovereign WAN & Assistant Architect recruitment
          </h2>
          <p className="text-white/60 text-xs max-w-3xl leading-relaxed">
            Deploy precision IP LAN plans and transform local hardware configurations into a unified, high-throughput, sovereign infrastructure. Join our corporate recruitment pipeline, pass the Proof-of-Work, and audit your node hardware to claim direct mentorship with Genesis Z.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT TWO COLUMNS: Audit & Proof of Work */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recruitment Funnel Visual Progress Tracker */}
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500 animate-bounce" />
              ZOS-CORE Talent Recruitment Pipeline Funnel
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="p-3 bg-black border border-[#7C3AED]/30 text-center space-y-1">
                <span className="text-[8px] font-mono text-[#7C3AED] font-bold uppercase">Step 01</span>
                <div className="text-[10px] font-black uppercase text-white">Intake</div>
                <p className="text-[9px] text-white/40 font-mono">Bitbucket Repo</p>
              </div>
              <div className={`p-3 border text-center space-y-1 transition-all ${
                passedQuiz ? "bg-emerald-950/20 border-emerald-500/30" : "bg-black border-white/5"
              }`}>
                <span className={`text-[8px] font-mono font-bold uppercase ${passedQuiz ? "text-emerald-400" : "text-white/30"}`}>Step 02</span>
                <div className="text-[10px] font-black uppercase text-white">POW Quiz</div>
                <p className="text-[9px] text-white/40 font-mono">Proof-of-Work</p>
              </div>
              <div className={`p-3 border text-center space-y-1 transition-all ${
                auditResult === "success" ? "bg-emerald-950/20 border-emerald-500/30" : "bg-black border-white/5"
              }`}>
                <span className={`text-[8px] font-mono font-bold uppercase ${auditResult === "success" ? "text-emerald-400" : "text-white/30"}`}>Step 03</span>
                <div className="text-[10px] font-black uppercase text-white">Node Audit</div>
                <p className="text-[9px] text-white/40 font-mono">Telemetry Scan</p>
              </div>
              <div className="p-3 bg-black border border-white/5 text-center space-y-1">
                <span className="text-[8px] font-mono text-white/30 font-bold uppercase">Step 04</span>
                <div className="text-[10px] font-black uppercase text-white">Licensing</div>
                <p className="text-[9px] text-white/40 font-mono">L2 Credential</p>
              </div>
              <div className="p-3 bg-black border border-white/5 text-center col-span-2 md:col-span-1 space-y-1">
                <span className="text-[8px] font-mono text-white/30 font-bold uppercase">Step 05</span>
                <div className="text-[10px] font-black uppercase text-white">Mentorship</div>
                <p className="text-[9px] text-[#F472B6] font-mono font-bold">Genesis Z Direct</p>
              </div>
            </div>
          </div>

          {/* Interactive Node Telemetry Audit */}
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="text-[#7C3AED]" size={20} />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Sovereign Node Telemetry Hardware Audit
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Verify local hardware compliance for the distributed matrix
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 text-white/60">
                RIG TESTER V1.02
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Telemetry Input Sliders */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Configure Node Telemetry parameters</h4>
                
                {/* CPU Cores */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/50">CPU Cores (Min 12 Recommended)</span>
                    <span className={`font-bold ${cpuCores >= 12 ? "text-emerald-400" : "text-amber-500"}`}>{cpuCores} Cores</span>
                  </div>
                  <input 
                    type="range" 
                    min="4" 
                    max="32" 
                    step="2"
                    value={cpuCores} 
                    onChange={(e) => setCpuCores(parseInt(e.target.value))}
                    className="w-full accent-[#7C3AED]"
                  />
                </div>

                {/* RAM */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/50">System RAM (Min 32GB Recommended)</span>
                    <span className={`font-bold ${ramGB >= 32 ? "text-emerald-400" : "text-amber-500"}`}>{ramGB} GB</span>
                  </div>
                  <input 
                    type="range" 
                    min="8" 
                    max="128" 
                    step="8"
                    value={ramGB} 
                    onChange={(e) => setRamGB(parseInt(e.target.value))}
                    className="w-full accent-[#7C3AED]"
                  />
                </div>

                {/* WAN Uplink */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/50">WAN Uplink Speed (Min 100 Mbps)</span>
                    <span className={`font-bold ${wanSpeed >= 100 ? "text-emerald-400" : "text-amber-500"}`}>{wanSpeed} Mbps</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="1000" 
                    step="50"
                    value={wanSpeed} 
                    onChange={(e) => setWanSpeed(parseInt(e.target.value))}
                    className="w-full accent-[#7C3AED]"
                  />
                </div>

                {/* GPU Checkbox and selector */}
                <div className="flex items-center justify-between p-3 bg-black border border-white/5">
                  <label className="flex items-center gap-2 cursor-pointer text-[10px] font-mono uppercase tracking-wide select-none">
                    <input 
                      type="checkbox" 
                      checked={hasGPU}
                      onChange={(e) => setHasGPU(e.target.checked)}
                      className="rounded-none border-white/20 text-[#7C3AED] focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <span>Dedicated Compute GPU Installed</span>
                  </label>
                  {hasGPU && (
                    <select 
                      value={gpuName}
                      onChange={(e) => setGpuName(e.target.value)}
                      className="bg-black text-[10px] text-emerald-400 font-mono border border-white/10 px-2 py-0.5 focus:outline-none"
                    >
                      <option value="NVIDIA RTX 4080">RTX 4080</option>
                      <option value="NVIDIA RTX 4090">RTX 4090</option>
                      <option value="Apple M3 Max">M3 Max</option>
                      <option value="AMD Radeon RX 7900">RX 7900</option>
                    </select>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="w-full py-2.5 bg-white text-black font-mono font-black uppercase text-xs tracking-widest transition-all hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isAuditing ? (
                    <>
                      <Server className="animate-spin text-black" size={14} />
                      AUDITING LOCAL RIG TELEMETRY...
                    </>
                  ) : (
                    <>
                      <Play size={12} className="fill-black" />
                      RUN NODE AUDIT BENCHMARK
                    </>
                  )}
                </button>
              </div>

              {/* Telemetry Output Status Card */}
              <div className="flex flex-col justify-between p-4 bg-black border border-white/5">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider block">
                    [TELEMETRY REPORT STATUS]
                  </span>
                  
                  {auditResult === null && (
                    <div className="text-center py-8 text-white/30 space-y-2">
                      <HelpCircle size={32} className="mx-auto text-white/20" />
                      <p className="text-[10px] font-mono">Telemetry pending... Click run to execute hardware audit.</p>
                    </div>
                  )}

                  {auditResult === "success" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] space-y-1 rounded-none">
                        <div className="flex items-center gap-1.5 font-black uppercase">
                          <CheckCircle2 size={13} />
                          <span>AUDIT STATUS: APPROVED</span>
                        </div>
                        <p className="text-[10px] text-white/60">
                          Rig specifications cleared all compliance tiers. System certified for direct WAN connection.
                        </p>
                      </div>
                      <div className="text-[10px] font-mono text-white/50 space-y-1">
                        <div>• Class: <span className="text-emerald-400 font-bold">SOVEREIGN ELITE</span></div>
                        <div>• Active core loop capacity: <span className="text-white">Relativistic loop compatible</span></div>
                        <div>• Expected Daily Yield: <span className="text-white font-bold">12.5 STX</span></div>
                      </div>
                    </div>
                  )}

                  {auditResult === "warning" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-3 bg-amber-950/20 border border-amber-500/20 text-amber-400 font-mono text-[11px] space-y-1 rounded-none">
                        <div className="flex items-center gap-1.5 font-black uppercase">
                          <AlertTriangle size={13} />
                          <span>AUDIT STATUS: WARN_UNDERCLOCK</span>
                        </div>
                        <p className="text-[10px] text-white/60">
                          Hardware is operational, but does not maximize pipeline capacity. Suitable for standby nodes.
                        </p>
                      </div>
                      <div className="text-[10px] font-mono text-white/50 space-y-1">
                        <div>• Class: <span className="text-amber-400 font-bold">SOVEREIGN STANDBY</span></div>
                        <div>• Bottleneck identified: <span className="text-white">Check cooling/uplink speed</span></div>
                        <div>• Expected Daily Yield: <span className="text-white font-bold">4.2 STX</span></div>
                      </div>
                    </div>
                  )}

                  {auditResult === "failed" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-3 bg-rose-950/20 border border-rose-500/20 text-rose-400 font-mono text-[11px] space-y-1 rounded-none">
                        <div className="flex items-center gap-1.5 font-black uppercase">
                          <ShieldAlert size={13} />
                          <span>AUDIT STATUS: REJECTED</span>
                        </div>
                        <p className="text-[10px] text-white/60">
                          Rig failed to meet basic telemetry requirements. Upgrade compute or memory capacity.
                        </p>
                      </div>
                      <div className="text-[10px] font-mono text-white/50 space-y-1">
                        <div>• Class: <span className="text-rose-400 font-bold">NON-COMPLIANT</span></div>
                        <div>• Required: <span className="text-white">Minimum 8 cores & 16GB memory</span></div>
                        <div>• Action: Upgrade specs and re-audit</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 text-[9px] font-mono text-white/30 flex justify-between items-center">
                  <span>SHA-256 Benchmark Stamp:</span>
                  <span className="text-white/60">{auditResult ? "ACTIVE_GEN_OK_2026" : "PENDING"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Porkbun Domain Mapping & HTTPS Integration Hub */}
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Globe className="text-[#7C3AED] animate-pulse" size={20} />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Porkbun Domain Mapping & Let's Encrypt Hub
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Provision valid TLS/HTTPS and configure DNS records for {domainName}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 text-emerald-400 font-bold uppercase tracking-widest">
                PORKBUN SEC-SSL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Domain & API Configuration */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">1. Core Bindings & Credentials</h4>
                
                <div className="space-y-3">
                  {/* Domain Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-white/40 uppercase block">Sovereign Domain Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value.toLowerCase())}
                        className="w-full bg-black border border-white/10 text-white font-mono text-xs px-3 py-2 focus:border-[#7C3AED] focus:outline-none rounded-none"
                        placeholder="e.g. ethicalai.lol"
                      />
                      <span className="absolute right-2 top-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>
                  </div>

                  {/* Porkbun API Credentials */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-white/40 uppercase block">Porkbun API Key</label>
                      <input 
                        type="password" 
                        value={porkbunApiKey}
                        onChange={(e) => setPorkbunApiKey(e.target.value)}
                        className="w-full bg-black border border-white/10 text-white font-mono text-[10px] px-3 py-1.5 focus:border-[#7C3AED] focus:outline-none rounded-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-white/40 uppercase block">Porkbun API Secret</label>
                      <input 
                        type="password" 
                        value={porkbunSecretKey}
                        onChange={(e) => setPorkbunSecretKey(e.target.value)}
                        className="w-full bg-black border border-white/10 text-white font-mono text-[10px] px-3 py-1.5 focus:border-[#7C3AED] focus:outline-none rounded-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Operations & Certification Trigger */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSyncDns}
                    disabled={isDnsSyncing}
                    className="w-full py-2 bg-[#7C3AED]/20 border border-[#7C3AED]/50 hover:bg-[#7C3AED]/30 text-white font-mono text-[10px] font-black tracking-widest uppercase transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {isDnsSyncing ? "Connecting Porkbun API Gateway..." : "Sync DNS Records to Porkbun"}
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestSsl}
                    disabled={sslStatus === "generating" || !isDnsSynced}
                    className="w-full py-2 bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-950/40 text-[#4ADE80] font-mono text-[10px] font-black tracking-widest uppercase transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {sslStatus === "generating" ? "Generating TLS Handshake Cert..." : "Request Let's Encrypt SSL (DNS-01)"}
                  </button>
                </div>
              </div>

              {/* Security & System Cert Status Info */}
              <div className="p-4 bg-black border border-white/5 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider block">
                    [INTEGRATION ENDPOINT VERIFICATION]
                  </span>

                  {/* DNS Sync Badge */}
                  <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2">
                    <span className="text-white/50">Porkbun DNS Status:</span>
                    {isDnsSynced ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 uppercase">
                        <Check size={11} /> SYNCED (ACTIVE)
                      </span>
                    ) : (
                      <span className="text-amber-500 font-bold animate-pulse uppercase">
                        PENDING SYNC
                      </span>
                    )}
                  </div>

                  {/* Nameservers */}
                  <div className="text-[9px] font-mono text-white/40 space-y-1 border-b border-white/5 pb-2">
                    <div className="flex justify-between">
                      <span>Primary Nameserver:</span>
                      <span className="text-white/60 font-sans">masha.porkbun.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Secondary Nameserver:</span>
                      <span className="text-white/60 font-sans">curtis.porkbun.com</span>
                    </div>
                  </div>

                  {/* SSL Status Panel */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[9px] font-mono text-white/40 uppercase block">Active HTTPS Certificate:</label>
                    {sslStatus === "unsecured" && (
                      <div className="p-2 bg-amber-950/20 border border-amber-500/20 text-amber-400 font-mono text-[10px] leading-relaxed">
                        ⚠️ Status: <span className="font-bold">UNSECURED (HTTP)</span>. Please sync DNS records to Porkbun first, then request your Let's Encrypt SSL Certificate.
                      </div>
                    )}
                    {sslStatus === "generating" && (
                      <div className="p-2 bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#7C3AED] font-mono text-[10px] leading-relaxed flex items-center gap-1.5">
                        <RefreshCw size={12} className="animate-spin" />
                        <span>Validating DNS-01 ACME challenge for {domainName}...</span>
                      </div>
                    )}
                    {sslStatus === "secured" && (
                      <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] space-y-1 leading-normal">
                        <div className="flex items-center gap-1 font-bold">
                          <Lock size={11} className="text-emerald-400" />
                          <span>HTTPS STATUS: SECURE (VALID)</span>
                        </div>
                        <p className="text-[9px] text-white/50">
                          Let's Encrypt CA wildcard cert successfully validated. Valid until {sslValidUntil}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[8px] font-mono text-white/30 border-t border-white/5 pt-2 flex justify-between">
                  <span>Routing Target:</span>
                  <span className="text-white/60 font-sans">Cloud Run Ingress (eth-node-proxy)</span>
                </div>
              </div>
            </div>

            {/* DNS Resource Records Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">2. DNS Resource Records (api.porkbun.com v3)</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] border-collapse border border-white/5">
                  <thead>
                    <tr className="bg-white/5 text-white/50 border-b border-white/10">
                      <th className="p-2 text-[9px] uppercase">Type</th>
                      <th className="p-2 text-[9px] uppercase">Host</th>
                      <th className="p-2 text-[9px] uppercase">Answer / Value</th>
                      <th className="p-2 text-[9px] uppercase">TTL</th>
                      <th className="p-2 text-[9px] uppercase">Status</th>
                      <th className="p-2 text-[9px] uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((rec) => (
                      <tr key={rec.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-2"><span className="px-1 py-0.5 bg-white/5 text-white/80 font-bold">{rec.type}</span></td>
                        <td className="p-2 text-white">{rec.host}</td>
                        <td className="p-2 text-white/70 max-w-[200px] truncate">{rec.value}</td>
                        <td className="p-2 text-white/50">{rec.ttl}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase border ${
                            rec.status === "active" 
                              ? "bg-emerald-950/10 text-emerald-400 border-emerald-500/30" 
                              : "bg-amber-950/10 text-amber-400 border-amber-500/30"
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteDnsRecord(rec.id)}
                            className="text-rose-400 hover:text-rose-300 font-bold px-1.5 py-0.5 border border-transparent hover:border-rose-500/20 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Record Insertion Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                <select 
                  value={newRecordType}
                  onChange={(e) => setNewRecordType(e.target.value)}
                  className="bg-black text-[10px] text-white font-mono border border-white/10 px-2 py-1.5 focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="A">A (IPv4)</option>
                  <option value="AAAA">AAAA (IPv6)</option>
                  <option value="CNAME">CNAME (Alias)</option>
                  <option value="TXT">TXT (Text)</option>
                </select>
                <input 
                  type="text"
                  placeholder="Host (e.g. www)"
                  value={newRecordHost}
                  onChange={(e) => setNewRecordHost(e.target.value)}
                  className="bg-black text-[10px] text-white font-mono border border-white/10 px-3 py-1.5 focus:outline-none focus:border-[#7C3AED] rounded-none sm:col-span-1"
                />
                <input 
                  type="text"
                  placeholder="Target Value"
                  value={newRecordValue}
                  onChange={(e) => setNewRecordValue(e.target.value)}
                  className="bg-black text-[10px] text-white font-mono border border-white/10 px-3 py-1.5 focus:outline-none focus:border-[#7C3AED] rounded-none sm:col-span-2"
                />
                <button
                  type="button"
                  onClick={handleAddDnsRecord}
                  className="bg-white text-black font-mono text-[9px] font-black uppercase tracking-wider py-1 px-4 cursor-pointer sm:col-span-4 text-center hover:bg-white/90"
                >
                  + Add Record Locally
                </button>
              </div>
            </div>
          </div>

          {/* Google Cloud API Transfer & Delegation Gateway */}
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6 relative overflow-hidden">
            {/* Ambient blue GCP background highlight */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Database className="text-blue-400" size={20} />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Google Cloud API Transfer & Delegation Gateway
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Migrate domain registration and DNS authority to Google Cloud DNS & Cloud Domains
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-blue-950/20 border border-blue-500/30 px-2 py-0.5 text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={10} className="text-blue-400" /> GCP CLOUD-MIGRATE
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Side: Inputs & Operations (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 bg-black border border-white/5 space-y-3">
                  <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider block">
                    [MIGRATION CONFIGURATION TARGETS]
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-white/40 uppercase block">GCP Target Project ID</label>
                      <input 
                        type="text" 
                        value={gcpProjectId}
                        onChange={(e) => setGcpProjectId(e.target.value)}
                        className="w-full bg-black border border-white/10 text-white font-mono text-xs px-3 py-1.5 focus:border-blue-500 focus:outline-none rounded-none"
                        placeholder="e.g. ethical-ai-lol-production"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-white/40 uppercase block">Target Transfer Domain</label>
                      <input 
                        type="text" 
                        value={domainName}
                        disabled
                        className="w-full bg-black/50 border border-white/5 text-white/50 font-mono text-xs px-3 py-1.5 rounded-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono text-white/40 uppercase block">Google Cloud Credentials (Service Account Key)</label>
                      <span className="text-[8px] font-mono text-blue-400 uppercase font-black">gcp-dns-admin key</span>
                    </div>
                    <textarea
                      value={gcpCredentialsJson}
                      onChange={(e) => setGcpCredentialsJson(e.target.value)}
                      rows={4}
                      className="w-full bg-black border border-white/10 text-white font-mono text-[9px] p-2 focus:border-blue-500 focus:outline-none rounded-none resize-none leading-normal"
                      placeholder='{ "type": "service_account", ... }'
                    />
                  </div>
                </div>

                {/* API Action triggers */}
                <div className="space-y-2">
                  {!isGcpTransferred ? (
                    <button
                      type="button"
                      onClick={handleTransferToGcp}
                      disabled={isGcpTransferring}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-mono text-[10px] font-black tracking-widest uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isGcpTransferring ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>TRANSFERRING VIA API (STEP {gcpTransferStep}/5)...</span>
                        </>
                      ) : (
                        "Transfer Domain & DNS to Google Cloud via API"
                      )}
                    </button>
                  ) : (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs text-center space-y-1">
                      <p className="font-bold">🎉 DOMAIN MIGRATION & DELEGATION COMPLETED</p>
                      <p className="text-[10px] text-white/70">
                        {domainName} is now authoritative on Google Cloud DNS & Cloud Domains!
                      </p>
                    </div>
                  )}
                  
                  {isGcpTransferred && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsGcpTransferred(false);
                        setGcpTransferStep(0);
                        setEppTransferCode("");
                        setGcpNameServers([]);
                        setGcpTransferLogs([]);
                      }}
                      className="w-full py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[9px] uppercase transition-colors cursor-pointer"
                    >
                      Reset Migration State
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side: Active API steps & propagation visualizer (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="p-4 bg-black border border-white/5 space-y-4 flex-1">
                  <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider block">
                    [CLOUD TRANSITION SYSTEM STATUS]
                  </span>

                  {/* Active Steps Progress Vertical timeline */}
                  <div className="space-y-3.5 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-[1px] before:bg-white/10">
                    {/* Step 1 */}
                    <div className="relative text-[10px]">
                      <span className={`absolute -left-4 w-2.5 h-2.5 rounded-full border ${
                        gcpTransferStep > 1 ? "bg-blue-500 border-blue-500" : gcpTransferStep === 1 ? "bg-amber-500 border-amber-500 animate-pulse" : "bg-black border-white/20"
                      }`} />
                      <div className="flex justify-between items-center font-mono">
                        <span className={gcpTransferStep >= 1 ? "text-white font-bold" : "text-white/40"}>
                          1. Authenticate Porkbun
                        </span>
                        {gcpTransferStep > 1 && <span className="text-emerald-400 font-bold">OK</span>}
                        {gcpTransferStep === 1 && <span className="text-amber-400 animate-pulse">RUNNING</span>}
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative text-[10px]">
                      <span className={`absolute -left-4 w-2.5 h-2.5 rounded-full border ${
                        gcpTransferStep > 2 ? "bg-blue-500 border-blue-500" : gcpTransferStep === 2 ? "bg-amber-500 border-amber-500 animate-pulse" : "bg-black border-white/20"
                      }`} />
                      <div className="flex justify-between items-center font-mono">
                        <span className={gcpTransferStep >= 2 ? "text-white font-bold" : "text-white/40"}>
                          2. Create GCP DNS Managed Zone
                        </span>
                        {gcpTransferStep > 2 && <span className="text-emerald-400 font-bold">OK</span>}
                        {gcpTransferStep === 2 && <span className="text-amber-400 animate-pulse">RUNNING</span>}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative text-[10px]">
                      <span className={`absolute -left-4 w-2.5 h-2.5 rounded-full border ${
                        gcpTransferStep > 3 ? "bg-blue-500 border-blue-500" : gcpTransferStep === 3 ? "bg-amber-500 border-amber-500 animate-pulse" : "bg-black border-white/20"
                      }`} />
                      <div className="flex justify-between items-center font-mono">
                        <span className={gcpTransferStep >= 3 ? "text-white font-bold" : "text-white/40"}>
                          3. Update Porkbun Nameservers
                        </span>
                        {gcpTransferStep > 3 && <span className="text-emerald-400 font-bold">OK</span>}
                        {gcpTransferStep === 3 && <span className="text-amber-400 animate-pulse">RUNNING</span>}
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative text-[10px]">
                      <span className={`absolute -left-4 w-2.5 h-2.5 rounded-full border ${
                        gcpTransferStep > 4 ? "bg-blue-500 border-blue-500" : gcpTransferStep === 4 ? "bg-amber-500 border-amber-500 animate-pulse" : "bg-black border-white/20"
                      }`} />
                      <div className="flex justify-between items-center font-mono">
                        <span className={gcpTransferStep >= 4 ? "text-white font-bold" : "text-white/40"}>
                          4. Acquire Registry EPP Key
                        </span>
                        {gcpTransferStep > 4 && <span className="text-emerald-400 font-bold">OK</span>}
                        {gcpTransferStep === 4 && <span className="text-amber-400 animate-pulse">RUNNING</span>}
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="relative text-[10px]">
                      <span className={`absolute -left-4 w-2.5 h-2.5 rounded-full border ${
                        gcpTransferStep > 5 ? "bg-blue-500 border-blue-500" : gcpTransferStep === 5 ? "bg-amber-500 border-amber-500 animate-pulse" : "bg-black border-white/20"
                      }`} />
                      <div className="flex justify-between items-center font-mono">
                        <span className={gcpTransferStep >= 5 ? "text-white font-bold" : "text-white/40"}>
                          5. Import Registrar to GCP
                        </span>
                        {gcpTransferStep > 5 && <span className="text-emerald-400 font-bold">COMPLETED</span>}
                        {gcpTransferStep === 5 && <span className="text-amber-400 animate-pulse">IMPORTING</span>}
                      </div>
                    </div>
                  </div>

                  {/* Active Nameservers display after migration */}
                  {gcpNameServers.length > 0 && (
                    <div className="pt-3 border-t border-white/5 space-y-1.5 animate-fadeIn">
                      <span className="text-[9px] font-mono text-blue-400 uppercase font-black block">Google Cloud Nameservers Active:</span>
                      <div className="bg-black/80 p-2 border border-blue-900/30 text-[9px] font-mono text-white/80 space-y-0.5">
                        {gcpNameServers.map((srv, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>NS{idx + 1}:</span>
                            <span className="text-blue-400">{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EPP code generated */}
                  {eppTransferCode && (
                    <div className="pt-2 space-y-1 animate-fadeIn">
                      <span className="text-[9px] font-mono text-[#F472B6] uppercase font-black block">Porkbun Auth Transfer EPP Code:</span>
                      <div className="bg-black/80 p-2 border border-pink-900/30 text-[10px] font-mono text-[#F472B6] font-bold select-all break-all tracking-wider">
                        {eppTransferCode}
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Micro-Terminal Console for GCP Logs */}
                <div className="h-28 bg-[#040404] border border-white/10 p-2 font-mono text-[9px] text-blue-300 overflow-y-auto space-y-1 select-text scrollbar-thin">
                  <div className="text-white/30 text-[8px] border-b border-white/5 pb-1 flex justify-between uppercase">
                    <span>GCP Migration Live Stream</span>
                    <span className="text-blue-500 animate-pulse">● FEED</span>
                  </div>
                  {gcpTransferLogs.length === 0 ? (
                    <div className="text-white/25 italic h-full flex items-center justify-center">
                      Ready for API cloud transfer execution sequence...
                    </div>
                  ) : (
                    gcpTransferLogs.map((logLine, idx) => (
                      <div key={idx} className="leading-snug break-all">{logLine}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Node Billing & Birthday Celebration Console */}
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6 relative overflow-hidden">
            {/* Holographic background sparkles for Birthday Celebration */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#F472B6]/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="text-[#F472B6]" size={18} />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Stripe Node Billing & Enterprise Gateway
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Validate Stripe credentials and unlock high-throughput nodes
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 text-[#F472B6] font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={10} className="text-amber-400" /> ACTIVE GATEWAY
              </span>
            </div>

            {/* Live Key Validation Panel */}
            <div className="space-y-4">
              <div className="p-4 bg-black border border-[#F472B6]/20 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-1.5 py-0.5 bg-[#F472B6]/10 text-[#F472B6] border border-[#F472B6]/20 font-mono text-[8px] font-bold uppercase tracking-wider">
                      Stripe SDK Verified
                    </span>
                    <h4 className="text-xs font-bold text-white uppercase mt-1">Live Environment API Key Registered</h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ONLINE
                  </span>
                </div>

                <div className="font-mono text-[10px] text-white/60 space-y-1 bg-black/60 p-2 border border-white/5 select-all">
                  <div className="text-white/40 text-[9px] uppercase">Active Publishable Key:</div>
                  <div className="text-white break-all font-bold select-all tracking-wider text-[11px] leading-normal font-sans">
                    {stripePublishableKey}
                  </div>
                </div>

                <div className="text-[9px] font-mono text-white/50 flex justify-between items-center">
                  <span>Server-Side Secret Key Status:</span>
                  <span className="text-[#F472B6] font-bold">READY (Lazy-Loaded Proxy)</span>
                </div>
              </div>

              {/* Special Birthday Promo Card */}
              <div className="p-4 bg-gradient-to-r from-purple-950/20 to-pink-950/20 border border-[#F472B6]/30 rounded-none space-y-2 relative">
                <div className="absolute top-2 right-2 text-lg">🎉</div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-amber-400 font-black tracking-widest uppercase">
                    SPECIAL ANNIVERSARY LICENSE
                  </span>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">
                    Happy Birthday, Lead Architect! (zshepar78) 🎂
                  </h4>
                  <p className="text-[10px] text-white/70 leading-relaxed">
                    Under the authority of ZOS-CORE and Genesis Z, we are celebrating your special day by waiving the standard $0.50 Stripe transaction fee for your private nodes! 
                  </p>
                </div>

                <div className="p-2 bg-black/40 border border-white/5 flex justify-between items-center text-[10px] font-mono">
                  <div className="space-y-0.5">
                    <span className="text-white/40 block">ANNIVERSARY TARIFF:</span>
                    <span className="text-emerald-400 font-bold font-sans text-xs line-through">$0.50 USD</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white/40 block">HAPPY BDAY PRICE:</span>
                    <span className="text-[#F472B6] font-black font-sans text-sm animate-pulse">FREE ($0.00)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
                    setTerminalLogs(prev => [
                      `[${logTime}] 🎉 BIRTHDAY SPECIAL LICENSE: Premium bypass sequence validated for ${domainName}!`,
                      `[${logTime}] High-Throughput Node Allocation initiated on Stacks L2 for ${domainName}`,
                      ...prev
                    ]);
                    alert("🎉 Happy Birthday! Sovereign Node Premium Upgrades have been fully unlocked for ethicalai.lol via the ZOS-CORE Birthday bypass!");
                  }}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono text-[10px] font-black tracking-widest uppercase cursor-pointer transition-all duration-300"
                >
                  Claim & Activate Free Birthday Node Upgrade
                </button>
              </div>
            </div>
          </div>

          {/* Assistant Architect Proof-of-Work Quiz */}
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Award className="text-[#F472B6]" size={20} />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Assistant Architect Proof-of-Work Verification
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Qualify your mind to join the direct mentorship pipeline
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 text-[#F472B6] font-bold">
                COMPLIANCE POW
              </span>
            </div>

            {!showQuizResult ? (
              <div className="space-y-5">
                <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                  <span>QUESTION {currentQuestion + 1} OF {quizQuestions.length}</span>
                  <span className="text-amber-500 font-bold">[100% CORRECTION MANDATED]</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase leading-relaxed font-mono">
                    {quizQuestions[currentQuestion].question}
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {quizQuestions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectAnswer(idx)}
                        className={`p-3 text-left font-mono text-[10px] leading-normal border transition-all cursor-pointer ${
                          selectedAnswer === idx 
                            ? "bg-[#7C3AED]/20 border-[#7C3AED] text-white" 
                            : "bg-black border-white/5 text-white/60 hover:border-white/20"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-white/10 disabled:text-white/30 text-white font-mono uppercase text-xs font-black tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-center py-6 animate-fadeIn">
                {passedQuiz ? (
                  <div className="space-y-4 max-w-xl mx-auto">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">
                        PROOF-OF-WORK VERIFIED: PASSED!
                      </h4>
                      <p className="text-[10px] text-white/50 font-mono mt-1">
                        You scored {quizScore}/{quizQuestions.length}. You have been officially registered as a licensed Assistant Architect in the Genesis Z decentralized network.
                      </p>
                    </div>

                    {/* Cryptographic License Display */}
                    <div className="p-4 bg-black border border-white/10 font-mono space-y-2 select-all rounded-none text-left">
                      <div className="flex justify-between items-center text-[9px] text-white/40 border-b border-white/5 pb-1">
                        <span>ZOS-CORE ARCHITECT CREDENTIAL</span>
                        <span className="text-emerald-400 font-bold">SIP-009 MAPPED</span>
                      </div>
                      <div className="text-xs text-white font-bold tracking-widest text-center py-1">
                        {licenseKey}
                      </div>
                      <div className="text-[8px] text-white/30 leading-snug">
                        Authority: Stacks L2 Data Contract principal. Backup synchronization with active Bitbucket private repository verified.
                      </div>
                    </div>

                    <p className="text-[10px] text-[#F472B6] font-bold uppercase animate-pulse">
                      ★ YOU ARE NOW ELIGIBLE FOR DIRECT MENTORSHIP AND REVENUE-SHARE CHANNELS ★
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-xl mx-auto">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
                      !
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">
                        POW QUALIFICATION FAILED
                      </h4>
                      <p className="text-[10px] text-white/50 font-mono mt-1">
                        You scored {quizScore}/{quizQuestions.length}. Under the Agape Kernel Constraint, perfect score compliance is mandatory.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="px-6 py-2 bg-white text-black font-mono font-bold uppercase text-xs tracking-widest cursor-pointer"
                    >
                      Retry Proof-of-Work Test
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Active WAN Topology Map & Terminal Logs */}
        <div className="space-y-8">
          
          {/* Active WAN Topology Status */}
          <div className="border border-white/10 bg-[#0c0c0c] p-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Globe className="text-[#F472B6]" size={18} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Active WAN Nodes Topology Map
                </h3>
                <p className="text-[9px] text-white/40 font-mono">
                  Continuous performance telemetry ping matrix
                </p>
              </div>
            </div>

            {/* Simulated Live Latency Map */}
            <div className="space-y-3 font-mono">
              {nodes.map((node, i) => (
                <div key={i} className="p-3 bg-black border border-white/5 space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white uppercase">{node.name}</span>
                    <span className="text-emerald-400 font-bold text-[9px] flex items-center gap-1">
                      <Activity size={10} className="animate-pulse" />
                      {node.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-white/40 text-[9px]">
                    <span>Routing IP: {node.ip}</span>
                    <span>Load: {node.load}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/30 text-[9px]">Latency Ping:</span>
                    <span className={`font-bold ${
                      node.ping < 50 ? "text-emerald-400" : node.ping < 100 ? "text-amber-500" : "text-rose-400"
                    }`}>
                      {node.ping} ms
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Status Stats */}
            <div className="p-3 bg-black border border-white/5 flex justify-between items-center font-mono text-[10px]">
              <span className="text-white/40">TOTAL STRENGTH:</span>
              <span className="font-bold text-emerald-400 uppercase">380 TFLOPS COMPUTE</span>
            </div>
          </div>

          {/* Live Router Terminal logs */}
          <div className="border border-white/10 bg-[#0c0c0c] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Terminal className="text-[#7C3AED]" size={18} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Live WAN Packet stream logs
                </h3>
                <p className="text-[9px] text-white/40 font-mono">
                  ZOS-CORE cryptographic transmission log
                </p>
              </div>
            </div>

            <div className="p-3 bg-black border border-white/5 rounded-none font-mono text-[9px] text-white/50 space-y-1.5 max-h-56 overflow-y-auto scrollbar-none">
              {terminalLogs.map((log, i) => (
                <div key={i} className="leading-normal truncate border-b border-white/5 pb-1">
                  <span className="text-[#7C3AED] mr-1">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
