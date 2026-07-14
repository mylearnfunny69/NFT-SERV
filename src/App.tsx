import React, { useState, useEffect } from "react";
import NFTFeed from "./components/NFTFeed.tsx";
import NFTCreator from "./components/NFTCreator.tsx";
import UserProfile from "./components/UserProfile.tsx";
import { User } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db as firestoreDb } from "./lib/firebase.ts";
import { Sparkles, TrendingUp, Cpu, Flame, Compass, Bell, AlertCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"feed" | "creator">("feed");
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [allNFTs, setAllNFTs] = useState<any[]>([]);
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);

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
          <div className="flex bg-black border border-white/10 p-1 rounded-none w-full md:w-auto">
            <button
              onClick={() => setActiveTab("feed")}
              className={`flex-1 md:flex-none px-6 py-3 rounded-none text-xs tracking-widest uppercase font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
              className={`flex-1 md:flex-none px-6 py-3 rounded-none text-xs tracking-widest uppercase font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "creator"
                  ? "bg-white text-black font-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles size={14} />
              Mint Chat NFT
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

        {/* Active Tab View */}
        <main className="animate-fadeIn">
          {activeTab === "feed" ? (
            <NFTFeed />
          ) : (
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
          )}
        </main>

        {/* Footer info */}
        <footer className="border-t border-white/10 pt-8 mt-12 pb-6 flex flex-col md:flex-row gap-4 justify-between items-center text-[10px] uppercase tracking-wider font-mono text-white/40">
          <div>
            <span>© 2026 CHATMINT.AI. SECURED VIA BITCOIN POX CONSENSUS.</span>
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

      </div>
    </div>
  );
}
