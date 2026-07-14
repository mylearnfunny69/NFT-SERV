import React, { useState, useEffect } from "react";
import { getClarityContractCode } from "../utils";
import { ShieldAlert, Cpu, Terminal, Compass, CheckCircle2, Copy, FileCode, Check } from "lucide-react";

interface NFTSimulatorProps {
  title: string;
  creatorAddress: string;
  metadataHash: string;
  tokenSerial: string;
  onMintSuccess: (txDetails: { txHash: string; blockNumber: number }) => void;
}

export default function NFTSimulator({
  title,
  creatorAddress,
  metadataHash,
  tokenSerial,
  onMintSuccess,
}: NFTSimulatorProps) {
  const [step, setStep] = useState<"code" | "wallet_prompt" | "minting_logs" | "explorer">("code");
  const [logs, setLogs] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [mockTxHash, setMockTxHash] = useState("");
  const [mockBlock, setMockBlock] = useState(0);

  const clarityCode = getClarityContractCode(title, creatorAddress);

  // Run mock minting console logs
  const runMintingSimulation = () => {
    setStep("minting_logs");
    setLogs([]);

    const logMessages = [
      "Initializing Stacks Web3 environment...",
      "Generating standard SIP-016 NFT Metadata JSON payload...",
      "Compiling metadata.json... mapping properties & chat logs...",
      "Packaging assets: base64 image converted to localized SVG asset...",
      "Publishing metadata to IPFS decentralized gateway: ipfs://QmXhK...c912",
      "Validating secp256k1 wallet signature payload...",
      "Enforcing Stacks transaction post-conditions (SENT_EQUAL_TO 1.5 STX)...",
      "Broadcasting Clarity contract-call transaction to Bitcoin L2 mempool...",
      "Awaiting consensus anchor: Stacks miner validating block...",
      "Consensus confirmed! Anchoring L2 block headers to Bitcoin L1 consensus (PoX)...",
      "Smart contract function [mint-chat-nft] executed successfully!",
      "SIP-009 Token minted! Token ID registered.",
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logMessages.length) {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[currentLogIndex]}`]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        // Generate final tx info
        const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
        const block = 15400 + Math.floor(Math.random() * 200);
        setMockTxHash(hash);
        setMockBlock(block);
        setStep("explorer");
        onMintSuccess({ txHash: hash, blockNumber: block });
      }
    }, 900);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(clarityCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-none overflow-hidden shadow-2xl font-sans text-white/80">
      {/* Header Tabs */}
      <div className="flex bg-black border-b border-white/10 text-[10px] uppercase font-mono tracking-widest px-4 py-3 items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Cpu size={14} className="text-[#7C3AED] neon-glow" style={{ "--pulse-color": "rgba(124,58,237,0.4)" } as React.CSSProperties} />
          <span className="font-black text-white">BITCOIN STACKS L2 COMPILER</span>
        </div>
        <div className="flex gap-2 text-[9px]">
          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60">SIP-009 STANDARD</span>
          <span className="px-2 py-0.5 bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 font-bold">CLARITY v2</span>
        </div>
      </div>

      {/* Simulator Content */}
      <div className="p-5 min-h-[360px] flex flex-col justify-between">
        
        {/* STEP 1: Clarity Smart Contract Code View */}
        {step === "code" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <FileCode size={15} className="text-[#7C3AED]" />
                  Auto-Compiled Smart Contract
                </h3>
                <p className="text-[11px] text-white/40 mt-1">
                  This L2 contract governs ownership, transfer, and provenance rules for your chat NFT.
                </p>
              </div>
              <button
                type="button"
                onClick={copyCodeToClipboard}
                className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-none border border-white/15 cursor-pointer"
              >
                {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copiedCode ? "Copied" : "Copy Clarity"}
              </button>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="text-[11px] font-mono bg-black p-4 rounded-none overflow-y-auto max-h-[220px] text-[#F472B6]/90 border border-white/10 leading-relaxed scrollbar">
                {clarityCode}
              </pre>
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-none bg-black/90 border border-white/10 text-[10px] text-white/30 font-mono">
                {clarityCode.split("\n").length} lines
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("wallet_prompt")}
                className="w-full py-3.5 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-none text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cpu size={14} />
                Deploy & Mint Chat NFT
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Simulated Hiro Wallet Transaction Prompt */}
        {step === "wallet_prompt" && (
          <div className="flex flex-col items-center justify-center gap-4 py-4 max-w-sm mx-auto animate-fadeIn">
            {/* Wallet dialog representation */}
            <div className="w-full bg-black border border-white/20 rounded-none p-4 shadow-2xl">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3 mb-3">
                <div className="w-6 h-6 rounded-none bg-[#7C3AED] flex items-center justify-center text-[10px] font-black text-white">H</div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Hiro Wallet Extension</h4>
                  <p className="text-[9px] font-mono text-white/40">{creatorAddress.substring(0, 16)}...</p>
                </div>
              </div>

              <div className="space-y-3 text-[11px]">
                <div>
                  <span className="text-[9px] text-white/40 block uppercase tracking-widest font-mono">Contract Call</span>
                  <span className="font-mono text-[#F472B6] break-all">{title.toLowerCase().replace(/[^a-z0-9]/g, "-")} (SIP-009)</span>
                </div>

                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-white/40 uppercase tracking-wider">Method</span>
                  <span className="font-mono text-white">mint-chat-nft</span>
                </div>

                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-white/40 uppercase tracking-wider">Recipient</span>
                  <span className="font-mono text-white">{creatorAddress.substring(0, 8)}...{creatorAddress.substring(creatorAddress.length - 4)}</span>
                </div>

                {/* Stacks L2 Post-Condition security warning */}
                <div className="bg-[#121212] border border-white/10 rounded-none p-2.5 text-[10px] text-white/60 flex gap-2">
                  <ShieldAlert size={14} className="text-[#7C3AED] shrink-0" />
                  <div>
                    <span className="font-black text-white uppercase tracking-wider block mb-0.5">Post-Conditions Enforced:</span>
                    Strict guarantee: exactly 1.50 STX transaction gas fee will leave your wallet. No other assets can be drained.
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                  <span className="text-white/40 uppercase tracking-wider font-mono">STX Gas Fee</span>
                  <span className="font-black text-[#F472B6] text-sm">1.5 STX</span>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 mt-1">
              <button
                type="button"
                onClick={() => setStep("code")}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-none text-xs tracking-wider uppercase font-black cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={runMintingSimulation}
                className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-none text-xs tracking-wider uppercase font-black transition-all cursor-pointer"
              >
                Sign & Confirm
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Blockchain Minting Live Console Logs */}
        {step === "minting_logs" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal size={15} className="text-white/40" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">ON-CHAIN MINTING INTERFACE</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6] animate-ping" />
                <span className="text-[10px] font-mono uppercase text-[#F472B6] tracking-widest font-black">BROADCASTING...</span>
              </div>
            </div>

            {/* Logs Area */}
            <div className="bg-black border border-white/10 rounded-none p-4 font-mono text-[10px] h-[210px] overflow-y-auto flex flex-col gap-1 text-white/50 leading-relaxed scrollbar">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-[#7C3AED] font-bold">L2:</span>
                  <span className={index === logs.length - 1 ? "text-[#F472B6] font-black" : ""}>{log}</span>
                </div>
              ))}
              {/* blinking cursor at the end */}
              <div className="flex gap-2 text-[#7C3AED] font-bold mt-1">
                L2: <span className="animate-pulse text-white">_</span>
              </div>
            </div>

            <div className="text-center text-[10px] font-mono text-white/40 uppercase tracking-widest">
              GENERATING POX CONSENSUS ANCHOR... PLEASE WAIT
            </div>
          </div>
        )}

        {/* STEP 4: Simulated Stacks Block Explorer View */}
        {step === "explorer" && (
          <div className="flex flex-col gap-4 animate-fadeIn text-xs">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">NFT MINTING DEPLOYED</h3>
                <p className="text-[10px] text-white/40">SIP-009 Token initialized and anchored on Bitcoin block headers.</p>
              </div>
            </div>

            {/* Block Explorer Table Representation */}
            <div className="bg-black border border-white/10 rounded-none p-4 space-y-2.5 font-mono text-[10px] uppercase text-white/60">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/30">CONTRACT</span>
                <span className="text-[#F472B6] font-bold truncate max-w-[200px]">{title.toLowerCase().replace(/[^a-z0-9]/g, "-")}</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/30">SIP STATUS</span>
                <span className="text-emerald-400 font-bold">MINTED & FINALIZED</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/30">TRANSACTION HASH</span>
                <span className="text-white/60 break-all truncate max-w-[220px]" title={mockTxHash}>{mockTxHash}</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/30">BLOCK HEIGHT</span>
                <span className="text-[#7C3AED] font-bold">#{mockBlock}</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/30">CREATOR ADDRESS</span>
                <span className="text-white">{creatorAddress.substring(0, 16)}...</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/30">METADATA SHA-256</span>
                <span className="text-white/40 truncate max-w-[180px]">{metadataHash}</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-none p-3 text-center text-white/60 border border-white/10 text-[10px] uppercase tracking-wider">
              💡 Your AI Chat Idea is now secured as a collectible cryptographic card. You can now Post & Share it!
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep("code")}
                className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-none text-[10px] tracking-widest font-black uppercase cursor-pointer"
              >
                View Clarity Code
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
