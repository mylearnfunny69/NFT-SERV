import React, { useState, useEffect } from "react";
import { 
  Shield, Key, Timer, Sliders, Code2, Users, CheckCircle2, 
  Lock, Unlock, ArrowRight, RefreshCw, Layers, Award, Terminal, HardDrive
} from "lucide-react";

export default function SovereigntyPortal() {
  // --- Smart Contract Upgrade States ---
  const [activeLogic, setActiveLogic] = useState<string>("SP2PAB...youchain-logic-v1");
  const [proposedLogic, setProposedLogic] = useState<string>("SP3FBC...youchain-logic-v2");
  const [upgradeStatus, setUpgradeStatus] = useState<"v1" | "proposing" | "timelocked" | "v2">("v1");
  const [timelockSeconds, setTimelockSeconds] = useState<number>(0);
  const [currentFee, setCurrentFee] = useState<number>(0.50);
  const [allowedAssetTypes, setAllowedAssetTypes] = useState<string[]>(["Chat Transcripts", "Base 44 Screenshots"]);
  
  // --- Progressive Decentralization States ---
  const [decentralizationStage, setDecentralizationStage] = useState<1 | 2 | 3>(1);
  const [multiSigKeys, setMultiSigKeys] = useState<string[]>([
    "SP2PAB57Q0746Q996K2DMVQT3K7H62696K9C2E38A (Founder)",
  ]);
  const [newKeyInput, setNewKeyInput] = useState<string>("");
  const [daoTokenName, setDaoTokenName] = useState<string>("YCNT");
  const [daoTreasuryFeeAllocation, setDaoTreasuryFeeAllocation] = useState<number>(10); // 10% to community treasury
  
  // --- Hybrid Upgradeability States (Middleware Cloud Router) ---
  const [otaAddress, setOtaAddress] = useState<string>("SP2PAB...youchain-logic-v1");
  const [otaStatus, setOtaStatus] = useState<string>("Active routing via Firebase Config");
  const [otaHistory, setOtaHistory] = useState<string[]>([
    "Init: Mobile routing mapped to SP2PAB...youchain-logic-v1 (2026-07-13)",
  ]);

  // Handle timelock simulation countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (upgradeStatus === "proposing" && timelockSeconds > 0) {
      timer = setInterval(() => {
        setTimelockSeconds((prev) => {
          if (prev <= 1) {
            setUpgradeStatus("timelocked");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [upgradeStatus, timelockSeconds]);

  // Initiate the Clarity contract upgrade sequence with 72-hour timelock simulation
  const handleProposeUpgrade = () => {
    setUpgradeStatus("proposing");
    // Simulate high-speed 72 hour timelock (72 simulated hours = 10 seconds)
    setTimelockSeconds(10);
    
    // Push system log to OTA history
    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
    setOtaHistory(prev => [
      `[${logTime}] Proposed contract logic upgrade pointer to ${proposedLogic}`,
      ...prev
    ]);
  };

  // Execute and finalize the contract swap (modifies state on-chain data registry)
  const handleExecuteUpgrade = () => {
    setActiveLogic(proposedLogic);
    setOtaAddress(proposedLogic);
    setUpgradeStatus("v2");
    
    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
    setOtaHistory(prev => [
      `[${logTime}] SUCCESS: Sovereign contract set-active-logic executed to ${proposedLogic}`,
      ...prev
    ]);
  };

  // Add key to Multi-Sig allocation list
  const handleAddMultiSigKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyInput.trim() && !multiSigKeys.includes(newKeyInput)) {
      setMultiSigKeys([...multiSigKeys, newKeyInput.trim()]);
      setNewKeyInput("");
      
      const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
      setOtaHistory(prev => [
        `[${logTime}] Key added to Stacks Multi-Sig controller: ${newKeyInput.substring(0, 12)}...`,
        ...prev
      ]);
    }
  };

  // Cloud OTA dynamic configuration updates
  const handleUpdateOtaRouting = (newAddr: string) => {
    setOtaAddress(newAddr);
    setOtaStatus("Over-the-air routing updated instantly");
    
    const logTime = new Date().toISOString().split("T")[1].substring(0, 8);
    setOtaHistory(prev => [
      `[${logTime}] OTA: Client gateway re-mapped to ${newAddr}`,
      ...prev
    ]);
  };

  // Add new asset support after upgrading to Logic v2
  const handleAddAssetType = (type: string) => {
    if (!allowedAssetTypes.includes(type)) {
      setAllowedAssetTypes([...allowedAssetTypes, type]);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="sovereignty-portal">
      {/* Visual Header */}
      <div className="p-6 bg-black border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-7xl select-none uppercase font-mono pointer-events-none">
          SOVEREIGN
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 font-mono text-[9px] font-bold tracking-widest uppercase">
              Sovereignty Control Suite
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
              Live Network Integration
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Unicorn Sovereignty & Upgradeability Portal
          </h2>
          <p className="text-white/60 text-xs max-w-3xl leading-relaxed">
            Configure YouChain's upgrade pathways, timelocks, and progressive decentralization mechanics. 
            Act as a true one-person strategic operator, leveraging bulletproof Clarity smart contract isolation 
            and hybrid cloud routing to protect your 100% equity stake.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Data-Logic Separation Blueprint */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="text-[#7C3AED]" size={20} />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    1. Clarity Data-Logic Separation Simulator
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    State: {upgradeStatus === "v2" ? "Upgraded to Logic v2" : "Running Logic v1"}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 ${
                upgradeStatus === "v2" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {upgradeStatus === "v2" ? "ACTIVE_LOGIC_V2" : "ACTIVE_LOGIC_V1"}
              </span>
            </div>

            {/* Architectural Diagram */}
            <div className="p-4 bg-black/60 border border-white/5 font-mono text-[10px] text-white/50 space-y-3 leading-snug">
              <div className="text-white/80 font-bold uppercase border-b border-white/5 pb-1 flex items-center gap-1">
                <Sliders size={12} className="text-[#7C3AED]" />
                Interactive Clarity Pointer Mapping
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <div className="p-3 bg-black border border-white/10 w-full sm:w-auto text-center">
                  <div className="text-white font-bold mb-1">youchain-data.clar</div>
                  <div className="text-[9px] text-white/40">Sovereign Permanent Storage</div>
                  <div className="mt-2 text-[9px] text-emerald-400 px-1 py-0.5 bg-emerald-500/5 border border-emerald-500/20 inline-block font-bold">
                    Active Pointer: {activeLogic.substring(0, 18)}...
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <ArrowRight size={16} className="text-[#7C3AED] rotate-90 sm:rotate-0" />
                  <span className="text-[8px] text-white/30 font-bold uppercase tracking-wider">AUTHORIZED WRITE</span>
                </div>

                <div className="p-3 bg-black border border-white/10 w-full sm:w-auto text-center relative">
                  <div className="text-white font-bold mb-1">
                    {upgradeStatus === "v2" ? "youchain-logic-v2.clar" : "youchain-logic-v1.clar"}
                  </div>
                  <div className="text-[9px] text-white/40">Active Rule Set</div>
                  <div className="mt-2 text-[9px] text-white/70">
                    Calculated micro-fee: <span className="text-amber-500 font-bold">${currentFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Simulator Controls */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Initiate Upgrade Pipeline
              </h4>

              {upgradeStatus === "v1" && (
                <div className="p-4 bg-black/40 border border-white/5 space-y-4">
                  <p className="text-xs text-white/60">
                    Propose a swap to Logic Contract V2. This will trigger the <span className="text-[#7C3AED] font-bold">72-Hour Timelock Safety Switch</span> inside the Data Contract, giving your users 3 days to inspect the proposal on GitHub.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-[9px] font-mono text-white/40 uppercase tracking-wider mb-1">
                        New Logic Address (SP-Principal)
                      </label>
                      <input 
                        type="text" 
                        value={proposedLogic}
                        onChange={(e) => setProposedLogic(e.target.value)}
                        className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleProposeUpgrade}
                      className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-mono uppercase text-xs font-black tracking-wider transition-all self-end cursor-pointer"
                    >
                      Propose V2 Logic Swap
                    </button>
                  </div>
                </div>
              )}

              {upgradeStatus === "proposing" && (
                <div className="p-5 bg-[#7C3AED]/5 border border-[#7C3AED]/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <Timer className="text-[#7C3AED] animate-spin" size={24} />
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                        72-HOUR TIMELOCK ACTIVE IN SEC-GUARD DATA CONTRACT
                      </h5>
                      <p className="text-[10px] text-white/40 font-mono">
                        Simulating countdown... users on GitHub alerted via webhook.
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-black border border-white/10 h-2 relative">
                    <div 
                      className="bg-[#7C3AED] h-full transition-all duration-1000" 
                      style={{ width: `${(10 - timelockSeconds) * 10}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/40">Remaining: {timelockSeconds}s (Simulated 72 Hours)</span>
                    <span className="text-[#7C3AED] font-bold">LOCKED</span>
                  </div>
                </div>
              )}

              {upgradeStatus === "timelocked" && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Unlock size={16} />
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      TIMELOCK EXPIRED: UPGRADE READY FOR EXECUTION
                    </h5>
                  </div>
                  <p className="text-xs text-white/60">
                    The 72-hour delay has passed. You can now execute the state modification function <code className="font-mono text-[10px] bg-black px-1.5 py-0.5 text-[#F472B6]">set-active-logic</code> on the data contract.
                  </p>
                  <button
                    type="button"
                    onClick={handleExecuteUpgrade}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono uppercase text-xs font-black tracking-wider transition-all cursor-pointer"
                  >
                    Execute set-active-logic (Commit V2)
                  </button>
                </div>
              )}

              {upgradeStatus === "v2" && (
                <div className="p-5 bg-emerald-950/20 border border-emerald-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      LOGIC CONTRACT UPGRADED SUCCESSFULLY
                    </h5>
                  </div>
                  <p className="text-xs text-white/60">
                    Your Sovereign Data Contract is now routing write operations exclusively through <code className="font-mono text-[10px] bg-black px-1.5 py-0.5 text-white/80">{activeLogic}</code>. You have unlocked new v2 administrative settings:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Dynamic Fee Modifier */}
                    <div className="p-3 bg-black border border-white/5 space-y-2">
                      <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">
                        [RULE CONFIG: STACK-PAY]
                      </span>
                      <h6 className="text-[11px] font-bold text-white uppercase">Adjust Protocol Base Fee</h6>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" 
                          min="0.10" 
                          max="2.00" 
                          step="0.10" 
                          value={currentFee} 
                          onChange={(e) => setCurrentFee(parseFloat(e.target.value))}
                          className="flex-1 accent-[#7C3AED]"
                        />
                        <span className="font-mono text-xs font-bold text-white">${currentFee.toFixed(2)}</span>
                      </div>
                      <p className="text-[9px] text-white/40">Updates Bitcoin L2 gas computation rules live.</p>
                    </div>

                    {/* Dynamic Asset Type Integrations */}
                    <div className="p-3 bg-black border border-white/5 space-y-2">
                      <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">
                        [RULE CONFIG: ASSETS]
                      </span>
                      <h6 className="text-[11px] font-bold text-white uppercase">Inject New IP Legos</h6>
                      <div className="flex flex-wrap gap-1.5">
                        <button 
                          type="button" 
                          onClick={() => handleAddAssetType("Fiction Books")}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-none border ${
                            allowedAssetTypes.includes("Fiction Books") ? "bg-[#7C3AED]/20 text-white border-[#7C3AED]/40" : "bg-black text-white/40 border-white/5 hover:border-white/20"
                          }`}
                        >
                          + Fiction Books
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleAddAssetType("Video Stream IP")}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-none border ${
                            allowedAssetTypes.includes("Video Stream IP") ? "bg-[#7C3AED]/20 text-white border-[#7C3AED]/40" : "bg-black text-white/40 border-white/5 hover:border-white/20"
                          }`}
                        >
                          + Video Stream IP
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleAddAssetType("Patent Outlines")}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-none border ${
                            allowedAssetTypes.includes("Patent Outlines") ? "bg-[#7C3AED]/20 text-white border-[#7C3AED]/40" : "bg-black text-white/40 border-white/5 hover:border-white/20"
                          }`}
                        >
                          + Patent Outlines
                        </button>
                      </div>
                      <p className="text-[9px] text-white/40">Allowed types: {allowedAssetTypes.join(", ")}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveLogic("SP2PAB...youchain-logic-v1");
                      setOtaAddress("SP2PAB...youchain-logic-v1");
                      setUpgradeStatus("v1");
                    }}
                    className="mt-2 text-[10px] text-white/40 hover:text-white uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={10} /> Reset Simulator to V1 State
                  </button>
                </div>
              )}
            </div>

            {/* Smart Contract Code Snippet Preview */}
            <div className="border border-white/5 bg-black p-4 space-y-2">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Code2 size={12} className="text-[#F472B6]" />
                  youchain-data.clar (L2 Clarity Contract)
                </span>
                <span className="text-[9px] font-mono text-[#F472B6] uppercase">SIP-009 Standard</span>
              </div>
              <pre className="text-[9px] leading-relaxed font-mono text-white/70 overflow-x-auto scrollbar-none select-all bg-black/40 p-2 max-h-48 overflow-y-auto">
{`;; Sovereign Data Contract (youchain-data.clar)
(define-constant CONTRACT_OWNER tx-sender)

;; The address allowed to execute writes
(define-data-var active-logic-contract principal '${activeLogic})

;; The database of registered IP assets
(define-map ip-registry uint { creator: principal, metadata-cid: (string-ascii 256) })

;; Administrative function to swap logic in the future
(define-public (set-active-logic (new-logic principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u401))
    (ok (var-set active-logic-contract new-logic))
  )
)

;; Data-writing function exposed ONLY to the active logic contract
(define-public (write-ip-record (token-id uint) (creator principal) (metadata-cid (string-ascii 256)))
  (begin
    ;; Safety lock: reject calls if they don't originate from your active logic contract
    (asserts! (is-eq contract-caller (var-get active-logic-contract)) (err u403))
    (map-set ip-registry token-id { creator: creator, metadata-cid: metadata-cid })
    (ok true)
  )
)
`}
              </pre>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Progressive Decentralization & Hybrid Middleware Routing */}
        <div className="space-y-6">
          
          {/* Progressive Decentralization Progress Tracking */}
          <div className="border border-white/10 bg-[#0c0c0c] p-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Users className="text-[#F472B6]" size={18} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  2. Progressive Decentralization Path
                </h3>
                <p className="text-[9px] text-white/40 font-mono">
                  Trust alignment checklist for investors & buyers
                </p>
              </div>
            </div>

            {/* Stages Grid */}
            <div className="space-y-3">
              {/* Stage 1 */}
              <div 
                onClick={() => setDecentralizationStage(1)}
                className={`p-3 border cursor-pointer transition-all ${
                  decentralizationStage === 1 
                    ? "bg-[#7C3AED]/10 border-[#7C3AED]/40 text-white" 
                    : "bg-black/40 border-white/5 text-white/40 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold">
                    STAGE 01: Day 1 - Solo Launch
                  </span>
                  <span className="text-[9px] font-mono px-1 bg-[#7C3AED]/20 text-white border border-[#7C3AED]/30">
                    1 OWNER
                  </span>
                </div>
                <h4 className="text-[11px] font-bold uppercase mb-1">Developer Admin Key + Timelock</h4>
                <p className="text-[10px] leading-normal text-white/60">
                  Full control with absolute execution agility. 72-hour code safety timelock guarantees users cannot be "stealth-hacked".
                </p>
              </div>

              {/* Stage 2 */}
              <div 
                onClick={() => setDecentralizationStage(2)}
                className={`p-3 border cursor-pointer transition-all ${
                  decentralizationStage === 2 
                    ? "bg-[#F472B6]/10 border-[#F472B6]/40 text-white" 
                    : "bg-black/40 border-white/5 text-white/40 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold">
                    STAGE 02: Day 180 - Scale & Audit
                  </span>
                  <span className="text-[9px] font-mono px-1 bg-[#F472B6]/20 text-white border border-[#F472B6]/30">
                    MULTI-SIG
                  </span>
                </div>
                <h4 className="text-[11px] font-bold uppercase mb-1">Multi-Signature Wallet Delegation</h4>
                <p className="text-[10px] leading-normal text-white/60">
                  Keys allocated across key partners (Owner, Auditor, Escrow) to assure institutional buyers of security.
                </p>
              </div>

              {/* Stage 3 */}
              <div 
                onClick={() => setDecentralizationStage(3)}
                className={`p-3 border cursor-pointer transition-all ${
                  decentralizationStage === 3 
                    ? "bg-emerald-500/15 border-emerald-500/40 text-white" 
                    : "bg-black/40 border-white/5 text-white/40 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold">
                    STAGE 03: Day 365+ - Exit Handoff
                  </span>
                  <span className="text-[9px] font-mono px-1 bg-emerald-500/20 text-white border border-emerald-500/30">
                    DAO COMM
                  </span>
                </div>
                <h4 className="text-[11px] font-bold uppercase mb-1">DAO Community Handoff</h4>
                <p className="text-[10px] leading-normal text-white/60">
                  Transition control to governance tokens. Community treasury handles acquisitions, allowing a multi-million dollar cash out.
                </p>
              </div>
            </div>

            {/* Dynamic Stage Context Display */}
            {decentralizationStage === 1 && (
              <div className="p-3.5 bg-black border border-white/5 text-xs space-y-2 font-mono">
                <span className="text-[10px] text-amber-500 font-bold uppercase">
                  ACTIVE MODE: 100% PERSONAL EQUITY
                </span>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Your private wallet holds full deployer authority. Total administrative agility to patch bugs immediately.
                </p>
              </div>
            )}

            {decentralizationStage === 2 && (
              <div className="p-3.5 bg-black border border-white/5 text-xs space-y-3 font-mono">
                <span className="text-[10px] text-[#F472B6] font-bold uppercase">
                  MULTI-SIG KEY CONTROLLERS ({multiSigKeys.length})
                </span>
                
                <ul className="space-y-1.5 text-[9px] text-white/60 overflow-y-auto max-h-24">
                  {multiSigKeys.map((key, i) => (
                    <li key={i} className="flex items-center gap-1.5 truncate border-b border-white/5 pb-1">
                      <Lock size={10} className="text-amber-500 shrink-0" />
                      <span>{key}</span>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleAddMultiSigKey} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Stacks Principal (SP...)"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    className="flex-1 bg-black border border-white/10 px-2 py-1 text-[10px] text-white font-mono focus:outline-none focus:border-[#F472B6]"
                  />
                  <button 
                    type="submit"
                    className="px-3 bg-[#F472B6]/10 hover:bg-[#F472B6]/20 border border-[#F472B6]/30 text-white font-mono text-[10px] uppercase font-bold"
                  >
                    Add Key
                  </button>
                </form>
              </div>
            )}

            {decentralizationStage === 3 && (
              <div className="p-3.5 bg-black border border-white/5 text-xs space-y-3 font-mono">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">
                  DAO Exit Launchpad Config
                </span>
                
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">DAO Governance Token Symbol:</span>
                    <input 
                      type="text" 
                      value={daoTokenName}
                      onChange={(e) => setDaoTokenName(e.target.value.toUpperCase())}
                      className="w-16 bg-black border border-white/10 px-1 text-center font-bold font-mono text-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Community Fee Treasury Allocation:</span>
                    <span className="text-white font-bold">{daoTreasuryFeeAllocation}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="5" 
                    value={daoTreasuryFeeAllocation} 
                    onChange={(e) => setDaoTreasuryFeeAllocation(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <p className="text-[9px] text-white/40 leading-snug">
                    Fees will be split automatically: {100 - daoTreasuryFeeAllocation}% to promoters/creators, {daoTreasuryFeeAllocation}% to community DAO treasury.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hybrid Upgradeability: Middleware Configuration Cloud Router */}
          <div className="border border-white/10 bg-[#0c0c0c] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <HardDrive className="text-[#7C3AED]" size={18} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  3. Hybrid Gateway Router Middleware
                </h3>
                <p className="text-[9px] text-white/40 font-mono">
                  Firebase dynamic logic override (No app store force updates)
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-white/60 leading-normal text-[11px]">
                Clients resolve contract interactions through serverless functions. 
                Remap the destination endpoint to route millions of active users to new logical rules instantly.
              </p>
              
              <div className="p-3 bg-black border border-white/5 font-mono text-[10px] space-y-1.5">
                <div className="flex justify-between items-center text-white/40 uppercase">
                  <span>Firebase Route Registry</span>
                  <span className="text-emerald-400 animate-pulse font-bold">● RESOLVING</span>
                </div>
                <div className="text-white truncate font-bold text-[11px]">
                  youchain.api/v1/router ──&gt; <span className="text-[#7C3AED]">{otaAddress}</span>
                </div>
                <div className="text-[9px] text-white/30 italic">
                  Status: {otaStatus}
                </div>
              </div>

              {/* OTA Quick Swappers */}
              <div className="space-y-2 pt-1">
                <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">
                  Force OTA Routing remap:
                </span>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => handleUpdateOtaRouting("SP2PAB...youchain-logic-v1")}
                    className={`flex-1 py-1.5 font-mono text-[9px] uppercase font-bold border transition-all ${
                      otaAddress === "SP2PAB...youchain-logic-v1" 
                        ? "bg-[#7C3AED]/20 text-white border-[#7C3AED]/40" 
                        : "bg-black text-white/40 border-white/5 hover:border-white/20"
                    }`}
                  >
                    Point to Logic v1
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleUpdateOtaRouting("SP3FBC...youchain-logic-v2")}
                    className={`flex-1 py-1.5 font-mono text-[9px] uppercase font-bold border transition-all ${
                      otaAddress === "SP3FBC...youchain-logic-v2" 
                        ? "bg-[#7C3AED]/20 text-white border-[#7C3AED]/40" 
                        : "bg-black text-white/40 border-white/5 hover:border-white/20"
                    }`}
                  >
                    Point to Logic v2
                  </button>
                </div>
              </div>
            </div>

            {/* Micro-term console output logs */}
            <div className="p-3.5 bg-black border border-white/5 rounded-none font-mono text-[9px] text-white/40 space-y-1.5 max-h-32 overflow-y-auto">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 text-white/60 font-bold">
                <Terminal size={11} className="text-[#F472B6]" />
                Live Router Transaction Stream:
              </div>
              {otaHistory.map((log, i) => (
                <div key={i} className="leading-normal truncate">{log}</div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
