import React, { useEffect } from "react";
import { X, ExternalLink, Award, Sparkles, Shield, CheckCircle2, Copy, Check, Info } from "lucide-react";
import { calculateRarityScore } from "../utils";
import { ChatMessage, NFTThemeId } from "../types";
import NFTCard from "./NFTCard";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  themeId: NFTThemeId;
  chatLog: ChatMessage[];
  creatorAddress: string;
  tokenSerial: string;
  metadataHash: string;
  txHash: string;
  blockNumber: number;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  title,
  description,
  themeId,
  chatLog,
  creatorAddress,
  tokenSerial,
  metadataHash,
  txHash,
  blockNumber,
}: CelebrationModalProps) {
  const [copiedTx, setCopiedTx] = React.useState(false);

  // Auto-focus or lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const rarity = calculateRarityScore({
    title,
    description,
    themeId,
    chatLog,
    tokenSerial,
  });

  const handleCopyTx = () => {
    navigator.clipboard.writeText(txHash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  // Get color themes for the modal accent
  let accentColor = "from-purple-500 to-indigo-600";
  let borderHighlight = "border-purple-500/50";
  let textHighlight = "text-purple-400";
  let badgeBg = "bg-purple-500/10 text-purple-400 border-purple-500/30";

  if (rarity.label === "Legendary") {
    accentColor = "from-amber-500 to-yellow-600";
    borderHighlight = "border-amber-500/50";
    textHighlight = "text-amber-400";
    badgeBg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  } else if (rarity.label === "Epic") {
    accentColor = "from-fuchsia-500 to-purple-600";
    borderHighlight = "border-fuchsia-500/50";
    textHighlight = "text-fuchsia-400";
    badgeBg = "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30";
  } else if (rarity.label === "Rare") {
    accentColor = "from-blue-500 to-cyan-600";
    borderHighlight = "border-blue-500/50";
    textHighlight = "text-blue-400";
    badgeBg = "bg-blue-500/10 text-blue-400 border-blue-500/30";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto selection:bg-purple-500/30">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F472B6]/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "1.5s" }}></div>

      <div className={`relative w-full max-w-4xl bg-[#09090b] border-2 ${borderHighlight} shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-none overflow-hidden max-h-[95vh] flex flex-col md:flex-row text-white animate-scaleUp`}>
        
        {/* Right Corner Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 border border-white/10 rounded-none text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* LEFT COLUMN: The NFT Trading Card preview */}
        <div className="md:w-5/12 bg-black/60 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
          {/* Grid backdrops */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f11_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f11_1px,transparent_1px)] bg-[size:14px_14px]"></div>
          
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            <NFTCard
              title={title}
              description={description}
              tokenSerial={tokenSerial}
              metadataHash={metadataHash}
              themeId={themeId}
              chatLog={chatLog}
              creatorAddress={creatorAddress}
              interactive={false}
            />
          </div>
          
          <div className="mt-4 text-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 block">Digital Collectible Case</span>
            <span className="font-mono text-[10px] text-[#7C3AED] font-bold mt-0.5 block">{tokenSerial}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Celebration details, Rarity metrics, and Explorer links */}
        <div className="md:w-7/12 p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-none scrollbar">
          <div className="space-y-6">
            
            {/* Header announcement */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-1.5">
                <div className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-widest border ${badgeBg}`}>
                  Mint Success
                </div>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 size={12} /> Deployed to L2
                </span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                CONGRATULATIONS!
              </h2>
              <p className="text-xs text-white/60 max-w-md">
                Your AI-guided idea has been successfully secured in a Clarity smart contract and anchored onto the Bitcoin network.
              </p>
            </div>

            {/* RARITY INSIGHT PANEL */}
            <div className="bg-black/60 border border-white/10 p-5 rounded-none space-y-4 relative">
              <div className="absolute top-2 right-3 flex items-center gap-1 text-[9px] font-mono text-white/30">
                <Award size={10} /> Certified Rarity
              </div>

              <div className="flex items-center gap-4">
                {/* Rarity Ring / Circle score */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      className="text-white/5"
                      strokeWidth="4"
                      fill="transparent"
                      stroke="currentColor"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      className={textHighlight}
                      strokeWidth="4"
                      fill="transparent"
                      stroke="currentColor"
                      strokeDasharray={175.9}
                      strokeDashoffset={175.9 - (175.9 * rarity.score) / 100}
                    />
                  </svg>
                  <span className="absolute text-sm font-black font-mono">{rarity.score}</span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-white/40">Rarity Tier:</span>
                    <span className={`text-lg font-black uppercase tracking-wider ${textHighlight}`}>
                      {rarity.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed mt-1">
                    Your concept is ranked <strong>higher than {rarity.score}%</strong> of random dialog compilations. Traits are mapped using technical keyword density, dialogue cycles, and premium theme styles.
                  </p>
                </div>
              </div>

              {/* Rarity Breakdown Checklist */}
              <div className="border-t border-white/5 pt-3 mt-1 grid grid-cols-2 gap-3 text-[10px] font-mono text-white/60">
                {rarity.traits.map((trait, idx) => (
                  <div key={idx} className="flex flex-col justify-between p-2 bg-white/5 border border-white/5">
                    <span className="text-white/30 uppercase text-[8px] tracking-wider block">{trait.trait_type}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-white font-bold truncate max-w-[100px]">{trait.value}</span>
                      <span className="text-emerald-400">+{trait.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCKCHAIN METADATA & EXPLORER LINKS */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-black block">
                Bitcoin Stacks L2 Transaction Details
              </span>

              <div className="bg-black/40 border border-white/5 p-4 space-y-3 font-mono text-[10px]">
                {/* Hash row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-2">
                  <span className="text-white/40">TRANSACTION HASH</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 break-all select-all font-bold text-right truncate max-w-[200px] sm:max-w-none" title={txHash}>
                      {txHash}
                    </span>
                    <button
                      onClick={handleCopyTx}
                      className="p-1 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                      title="Copy TX Hash"
                    >
                      {copiedTx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                {/* Block row */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">BLOCK ANCHOR HEIGHT</span>
                  <span className="text-[#7C3AED] font-black">#{blockNumber}</span>
                </div>

                {/* Explorer CTA Button */}
                <div className="pt-1.5">
                  <a
                    href={`https://explorer.hiro.so/txid/${txHash}?chain=mainnet`}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/40 hover:border-[#7C3AED]/60 text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ExternalLink size={13} className="text-[#F472B6]" />
                    View Live on Stacks Explorer
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Dialog Action */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Sparkles size={14} />
              Awesome, Let's Continue!
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
