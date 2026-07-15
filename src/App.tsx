import React, { useState, useEffect } from "react";
import NFTFeed from "./components/NFTFeed.tsx";
import NFTCreator from "./components/NFTCreator.tsx";
import UserProfile from "./components/UserProfile.tsx";
import SovereigntyPortal from "./components/SovereigntyPortal.tsx";
import WANNodeHub from "./components/WANNodeHub.tsx";
import ComplianceDrawer from "./components/ComplianceDrawer.tsx";
import { User } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db as firestoreDb } from "./lib/firebase.ts";
import { Sparkles, TrendingUp, Cpu, Flame, Compass, Bell, AlertCircle, Shield, Network } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"feed" | "creator" | "governance" | "nodes">("feed");
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [allNFTs, setAllNFTs] = useState<any[]>([]);
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [requireComplianceAcceptance, setRequireComplianceAcceptance] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);

  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === "/privacy" || path === "/terms" || path === "/legal" || window.location.hash === "#privacy") {
      setShowPrivacyPage(true);
    }
  }, []);

  const handleAcceptCompliance = () => {
    localStorage.setItem("youchain_compliance_accepted", "true");
    setIsComplianceOpen(false);
    setRequireComplianceAcceptance(false);
  };

  // Lifted method to refresh current NFT inventory for the export backups
  const loadNFTs = async () => {
    try {
      const res = await fetch("/api/nfts");
      if (res.ok) {
        const data = await res.json();
        setAllNFTs(data);
      }
    } catch (err) {
      console.error("Error fetching inventory for backup:", err);
    }
  };

  useEffect(() => {
    loadNFTs();
  }, [activeTab]);

  // Real-time listener for Firestore activity notifications (upvotes, bids, mints)
  useEffect(() => {
    try {
      const q = query(
        collection(firestoreDb, "notifications"),
        orderBy("createdAt", "desc"),
        limit(4)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setLiveNotifications(list);
      }, (error) => {
        console.warn("Firestore listener restricted or inactive:", error);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Could not load Firestore notifications:", err);
    }
  }, []);

  const handleUserUpdate = (updatedUser: User | null, updatedIsPremium: boolean, updatedToken: string | null) => {
    setUser(updatedUser);
    setIsPremium(updatedIsPremium);
    if (updatedToken) {
      setAccessToken(updatedToken);
    }
  };

  const handlePublishSuccess = () => {
    loadNFTs();
    setActiveTab("feed");
  };

  if (showPrivacyPage) {
    return (
      <div className="min-h-screen bg-[#080808] text-white font-sans p-6 sm:p-12 flex flex-col items-center justify-start selection:bg-[#7C3AED]/30">
        <div className="w-full max-w-4xl bg-black border border-white/15 p-8 sm:p-12 space-y-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/30 font-mono text-[9px] font-black tracking-widest uppercase">
                  ZOS-CORE Legal Systems
                </span>
                <span className="text-[9px] font-mono text-[#F472B6] font-bold uppercase tracking-widest">
                  SEC-GUARD v3.4
                </span>
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                Privacy Policy & Regulatory Disclaimers
              </h1>
              <p className="text-[10px] font-mono text-white/40">
                EFFECTIVE DATE: JULY 13, 2026 // DOCUMENT ID: ZOS-EOG-WAN-DISC-2026
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="py-1.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[10px] font-black tracking-widest uppercase cursor-pointer transition-colors"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => {
                  setShowPrivacyPage(false);
                  window.history.pushState({}, "", "/");
                }}
                className="py-1.5 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-mono text-[10px] font-black tracking-widest uppercase cursor-pointer transition-colors"
              >
                Launch App Dashboard
              </button>
            </div>
          </div>

          {/* Quick Notice Box */}
          <div className="p-5 bg-[#7C3AED]/10 border border-[#7C3AED]/30 space-y-1 text-xs">
            <p className="font-bold uppercase tracking-wider text-white">Notice regarding Stripe Integration and Web3 Platforms</p>
            <p className="text-white/70 leading-relaxed text-[11px]">
              This privacy statement describes how ChatMint and its integrated ZOS-CORE systems collect, protect, and use user information. To facilitate secure, non-custodial decentralized video NFTs on Stacks L2, we collect zero private wallet keys, zero seed phrases, and maintain data privacy controls over emails used for authentication and payment verification.
            </p>
          </div>

          {/* Detailed Policy Text */}
          <div className="space-y-6 text-xs text-white/70 leading-relaxed font-sans">
            
            <div className="space-y-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-1 font-mono">
                1. Information Collection and Non-Custodial Safeguards
              </h2>
              <p>
                We do not collect or store any of your private cryptographic assets, private keys, or wallet seed phrases. All digital wallet authentications are processed client-side through decentralized protocols (including BIP-322 signature structures and Stacks/Bitcoin web extensions).
              </p>
              <p>
                To maintain standard platform services (including our premium verification tier and Google Workspace backups), we securely store user email addresses and basic metadata linked to published Chat NFTs. These are hosted on an encrypted relational database with rigorous access controls and security policies.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-1 font-mono">
                2. Stripe Payment Processing & Data Security
              </h2>
              <p>
                All financial payments, billing, and credit card processing are securely processed directly by Stripe, Inc. We do not store or transmit any raw credit card details, CVV codes, or full bank credentials on our systems. Transaction receipts and user premium upgrade statuses are synced securely via webhook protocols to our database, strictly to enable premium features.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-1 font-mono">
                3. Section 6.1 — Financial and Transactional Disclaimers
              </h2>
              <p className="font-mono text-[11px] text-white/50">
                All educational modules, trading logs, investment frameworks, and system blueprints—including but not limited to the Keystone Bitcoin Strategy, 24-Hour Alpha Stratagem, and algorithmic models—are provided strictly for educational, informational, and illustrative purposes.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-white/60">
                <li><strong>No Professional Advice:</strong> The Lead Architect and the Firm do not operate as registered financial advisors, commodity trading advisors, or broker-dealers under any jurisdiction. No information constitutes a solicitation, recommendation, or endorsement to buy or sell securities or digital assets.</li>
                <li><strong>AVGO Validation:</strong> Any reference to previous successful market executions, including the AVGO strategy, is used solely to demonstrate system logic, loss avoidance, and adherence to the "Protective Stop" protocols. Past performance is not indicative of future market results.</li>
                <li><strong>Risk of Loss:</strong> Trading volatile cryptocurrencies carries a substantial risk of financial loss. Users execute transactions entirely at their own discretion and financial risk.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-1 font-mono">
                4. Section 6.2 — Web3 & Decentralized Protocol Disclosures
              </h2>
              <p>
                The platform utilizes peer-to-peer decentralized Web3 protocols, public smart contracts (Clarity/Stacks L2), and decentralized storage (Arweave/IPFS). We assume no liability for transaction failures, network congestion, forks, smart contract exploits, or software vulnerabilities native to Stacks or Bitcoin Layer-1.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-1 font-mono">
                5. Section 6.16 — SEC Compliance Guard & Non-Security Warranty
              </h2>
              <p>
                All utility tokens, NFTs, Clarity smart contracts (including SIP-009 video assets), on-chain routing scripts, and computational allocation rules are software tools designed exclusively for functional utility, decentralization, in-game logic, and digital rights registration. They do not represent, nor are they intended to represent, ownership shares, debt instruments, capital stock, or equity options in any corporate entity.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-1 font-mono">
                6. Contact and Administration
              </h2>
              <p>
                For questions regarding this policy or compliance queries, users may reach out to the administration principal at <span className="text-white underline font-mono">zshepard78@cherry5000zos.com</span> or <span className="text-white underline font-mono">zshepard78@gmail.com</span>.
              </p>
            </div>

          </div>

          <div className="border-t border-white/10 pt-6 text-center text-[10px] text-white/30 font-mono">
            SECURED & AUTHORIZED BY GENESIS Z // CO-ADHERENT SYSTEM MODEL v3
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans tech-grid selection:bg-[#7C3AED]/30 selection:text-white">
      
      {/* High-Contrast Live Event Stream Ticker (Firestore real-time updates) */}
      {liveNotifications.length > 0 && (
        <div className="bg-black border-b border-white/10 py-2.5 px-4 overflow-hidden text-[10px] font-mono tracking-wider flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#F472B6] font-black shrink-0 uppercase animate-pulse">
            <Bell size={11} />
            LIVE BLOCK FEED Ticker:
          </div>
          <div className="flex-1 flex gap-8 items-center animate-marquee whitespace-nowrap overflow-x-auto scrollbar-none">
            {liveNotifications.map((notif, idx) => (
              <span key={notif.id || idx} className="inline-flex items-center gap-1.5 text-white/70">
                <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-none"></span>
                <span className="text-white font-bold">{notif.type?.toUpperCase()}:</span>
                <span>{notif.message}</span>
                <span className="text-white/30 text-[9px] font-normal">({new Date(notif.createdAt).toLocaleTimeString()})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* High impact neon line matching ChatMint theme */}
      <div className="h-1 bg-gradient-to-r from-[#7C3AED] via-[#F472B6] to-[#7C3AED] neon-glow" style={{ "--pulse-color": "rgba(124, 58, 237, 0.4)" } as React.CSSProperties} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-none bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/30 font-mono text-[9px] font-black tracking-widest uppercase flex items-center gap-1">
                <Flame size={12} className="animate-pulse" />
                STACKS L2 BITCOIN
              </div>
              <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-widest">
                SIP-009 NFT Standard
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white flex items-baseline gap-1">
              CHAT<span className="text-[#7C3AED] bg-gradient-to-r from-[#7C3AED] to-[#F472B6] bg-clip-text text-transparent">MINT</span>.AI
            </h1>
            <p className="text-sm text-white/60 max-w-xl leading-relaxed">
              Compile your conceptual ChatGPT dialogue lines or Base 44 chat screenshots into custom Clarity smart contracts on Bitcoin, mint them as SIP-009 NFTs, and share them on the public registry.
            </p>
          </div>

          {/* Navigation Tabs (Styled to match design-spec uppercase block buttons) */}
          <div className="flex flex-wrap bg-black border border-white/10 p-1 rounded-none w-full md:w-auto gap-1 sm:gap-0">
            <button
              onClick={() => setActiveTab("feed")}
              className={`flex-1 md:flex-none px-5 py-3 rounded-none text-[11px] tracking-widest uppercase font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "feed"
                  ? "bg-white text-black font-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <TrendingUp size={14} />
              Registry Gallery
            </button>
            <button
              onClick={() => setActiveTab("creator")}
              className={`flex-1 md:flex-none px-5 py-3 rounded-none text-[11px] tracking-widest uppercase font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "creator"
                  ? "bg-white text-black font-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles size={14} />
              Mint Chat NFT
            </button>
            <button
              onClick={() => setActiveTab("governance")}
              className={`flex-1 md:flex-none px-5 py-3 rounded-none text-[11px] tracking-widest uppercase font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "governance"
                  ? "bg-white text-black font-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shield size={14} />
              Founder Sovereignty
            </button>
            <button
              onClick={() => setActiveTab("nodes")}
              className={`flex-1 md:flex-none px-5 py-3 rounded-none text-[11px] tracking-widest uppercase font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "nodes"
                  ? "bg-white text-black font-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Network size={14} className="text-[#F472B6]" />
              EOG WAN Node Hub
            </button>
          </div>
        </header>

        {/* Integrated User Profile Identity, Stripe Pay-gate & Google Workspace backup dashboard */}
        <UserProfile 
          onUserUpdate={handleUserUpdate} 
          allNFTs={allNFTs} 
        />

        {/* Informational context card */}
        {activeTab === "creator" && (
          <div className="bg-[#121212] border border-white/10 rounded-none p-5 flex flex-col md:flex-row items-start md:items-center gap-4 text-xs animate-fadeIn">
            <div className="w-8 h-8 rounded-none bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED] font-black shrink-0">
              💡
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-white uppercase tracking-wider block">Bitcoin L2 Clarity Provenance:</span>
              <p className="text-white/60 leading-normal">
                By minting, your dialogue transcript is compiled as an SIP-009 asset. The generated metadata has an exact SHA-256 cryptographic footprint anchored directly onto Stacks blockchain block headers.
              </p>
            </div>
          </div>
        )}

        {activeTab === "governance" && (
          <div className="bg-[#121212] border border-white/10 rounded-none p-5 flex flex-col md:flex-row items-start md:items-center gap-4 text-xs animate-fadeIn">
            <div className="w-8 h-8 rounded-none bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED] font-black shrink-0">
              🛡️
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-white uppercase tracking-wider block">Sovereign Data Contract Safety Model:</span>
              <p className="text-white/60 leading-normal">
                Under Clarity's security model, your code is immutable. Upgradeability is achieved through strict state contract pointer decoupling, paired with timed administration locks.
              </p>
            </div>
          </div>
        )}

        {/* Active Tab View */}
        <main className="animate-fadeIn">
          {activeTab === "feed" ? (
            <NFTFeed />
          ) : activeTab === "creator" ? (
            <NFTCreator 
              onPublishSuccess={handlePublishSuccess} 
              user={user}
              isPremium={isPremium}
              accessToken={accessToken}
              onUpgradePrompt={() => {
                // Focus on identity panel where Stripe pay button resides
                window.scrollTo({ top: 120, behavior: "smooth" });
              }}
            />
          ) : activeTab === "governance" ? (
            <SovereigntyPortal />
          ) : (
            <WANNodeHub />
          )}
        </main>

        {/* Footer info */}
        <footer className="border-t border-white/10 pt-8 mt-12 pb-6 flex flex-col md:flex-row gap-4 justify-between items-center text-[10px] uppercase tracking-wider font-mono text-white/40">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span>© 2026 CHATMINT.AI. SECURED VIA BITCOIN POX CONSENSUS.</span>
            <button 
              onClick={() => {
                setRequireComplianceAcceptance(false);
                setIsComplianceOpen(true);
              }}
              className="hover:text-[#7C3AED] transition-colors underline cursor-pointer text-[#7C3AED]/80 font-bold"
            >
              REGULATORY DISCLAIMERS & SEC-GUARD
            </button>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <Cpu size={12} className="text-[#7C3AED]" />
              STACKS CLARITY v2
            </span>
            <span className="flex items-center gap-1.5">
              <Compass size={12} className="text-[#F472B6]" />
              IPFS SIP-016
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              MAINNET STABLE
            </span>
          </div>
        </footer>

        {/* Legal Disclaimer Modal/Drawer */}
        <ComplianceDrawer 
          isOpen={isComplianceOpen} 
          onClose={() => setIsComplianceOpen(false)}
          requireAcceptance={requireComplianceAcceptance}
          onAccept={handleAcceptCompliance}
        />

      </div>
    </div>
  );
}
