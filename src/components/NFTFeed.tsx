import React, { useState, useEffect } from "react";
import { ChatNFT, NFT_THEMES } from "../types";
import NFTCard from "./NFTCard";
import { Heart, Search, TrendingUp, DollarSign, ExternalLink, Calendar, HelpCircle, X, Compass } from "lucide-react";

export default function NFTFeed() {
  const [nfts, setNfts] = useState<ChatNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNft, setSelectedNft] = useState<ChatNFT | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderAddress, setBidderAddress] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [votingMap, setVotingMap] = useState<Record<string, boolean>>({});

  // Load feed of posted NFTs
  const loadFeed = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/nfts");
      if (res.ok) {
        const data = await res.json();
        setNfts(data);
      }
    } catch (err) {
      console.error("Error loading NFT feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  // Handle upvoting
  const handleUpvote = async (nftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (votingMap[nftId]) return; // Avoid double voting instantly

    try {
      setVotingMap((prev) => ({ ...prev, [nftId]: true }));
      const res = await fetch(`/api/nfts/${nftId}/upvote`, {
        method: "POST"
      });
      if (res.ok) {
        // Optimistically update
        setNfts((prev) =>
          prev.map((n) => (n.id === nftId ? { ...n, likes: n.likes + 1 } : n))
        );
        if (selectedNft?.id === nftId) {
          setSelectedNft((prev) => prev ? { ...prev, likes: prev.likes + 1 } : null);
        }
      }
    } catch (err) {
      console.error("Upvote error:", err);
    }
  };

  // Place a mock STX bid
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNft) return;
    setBidError("");
    setBidSuccess(false);

    if (!bidderAddress.trim()) {
      setBidError("Please enter a valid Stacks L2 address to place a bid.");
      return;
    }
    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setBidError("Please enter a valid positive STX amount.");
      return;
    }

    try {
      const res = await fetch(`/api/nfts/${selectedNft.id}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidder: bidderAddress,
          amountSTX: amount
        })
      });

      if (res.ok) {
        const updatedNft = await res.json();
        setSelectedNft(updatedNft);
        setNfts((prev) => prev.map((n) => (n.id === updatedNft.id ? updatedNft : n)));
        setBidAmount("");
        setBidSuccess(true);
      } else {
        const errData = await res.json();
        setBidError(errData.error || "Failed to place bid.");
      }
    } catch (err) {
      setBidError("Server communication failed.");
    }
  };

  // Filter based on search query (matches title, description, and logs)
  const filteredNfts = nfts.filter((nft) => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = nft.title.toLowerCase().includes(query);
    const matchesDesc = nft.description.toLowerCase().includes(query);
    const matchesChat = nft.chatLog.some((m) => m.text.toLowerCase().includes(query));
    return matchesTitle || matchesDesc || matchesChat;
  });

  return (
    <div className="space-y-6">
      
      {/* Search Header (Styled as specified in design HTML - high contrast black box with flat borders) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#121212] p-6 rounded-none border border-white/10">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-[#7C3AED]" />
            AI CHAT NFT REGISTRY
          </h2>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">
            Browse, search, upvote, and place STX bids on pioneering AI concepts secured on Bitcoin.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search ideas, tech, or chat log text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-none py-2.5 pl-9 pr-4 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED] transition-all font-mono"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#121212] border border-white/10 rounded-none h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredNfts.length === 0 ? (
        <div className="bg-[#121212]/40 border border-white/10 rounded-none p-12 text-center text-white/40">
          <HelpCircle size={40} className="mx-auto text-white/20 mb-3" />
          <h3 className="font-black text-white uppercase tracking-wider">No Chat NFTs Found</h3>
          <p className="text-xs mt-1 text-white/40 max-w-sm mx-auto">
            Try adjusting your search filters or be the first to mint a new chat-idea into the Bitcoin registry!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNfts.map((nft) => {
            const theme = NFT_THEMES[nft.themeId];
            const highestBid = nft.bids && nft.bids.length > 0 
              ? Math.max(...nft.bids.map((b) => b.amountSTX)) 
              : 0;

            return (
              <div
                key={nft.id}
                onClick={() => {
                  setSelectedNft(nft);
                  setBidError("");
                  setBidSuccess(false);
                }}
                className="bg-[#121212] border border-white/10 hover:border-[#7C3AED] rounded-none overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Visual Cover/Theme banner */}
                <div 
                  className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-black"
                  style={{ borderLeft: `3px solid ${theme.borderColor}` }}
                >
                  <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest">
                    {theme.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#F472B6] font-black">
                    {nft.tokenSerial}
                  </span>
                </div>

                <div className="p-5 space-y-4 flex-1">
                  {/* Title & Author */}
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-[#7C3AED] transition-colors uppercase tracking-tight">
                      {nft.title}
                    </h3>
                    <p className="text-[10px] text-white/40 font-mono mt-1 truncate">
                      MINTED BY: {nft.creatorAddress.substring(0, 16)}...
                    </p>
                  </div>

                  {/* Concept Description */}
                  <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                    {nft.description}
                  </p>

                  {/* Chat Snippet (First 1 user line) */}
                  {nft.chatLog && nft.chatLog.length > 0 && (
                    <div className="bg-black/60 rounded-none p-3 text-[10px] border border-white/5 font-mono text-white/80">
                      <span className="text-[#F472B6] font-bold">ME:</span>{" "}
                      <span className="text-white/60 truncate block mt-0.5">
                        {nft.chatLog[0].text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Metrics */}
                <div className="bg-black border-t border-white/5 px-4 py-3 flex justify-between items-center text-xs">
                  <div className="flex gap-4 items-center">
                    <button
                      type="button"
                      onClick={(e) => handleUpvote(nft.id, e)}
                      className="flex items-center gap-1.5 text-white/40 hover:text-rose-500 transition-colors cursor-pointer group/heart"
                    >
                      <Heart
                        size={14}
                        className={`transition-all ${
                          votingMap[nft.id] ? "fill-rose-500 text-rose-500 scale-125" : "group-hover/heart:scale-110"
                        }`}
                      />
                      <span className={votingMap[nft.id] ? "text-rose-400 font-bold" : ""}>{nft.likes}</span>
                    </button>

                    <span className="flex items-center gap-1.5 text-white/40 font-mono text-[10px]">
                      <Calendar size={12} />
                      {new Date(nft.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Highest Bid Badge */}
                  <div className="flex items-center gap-1 bg-[#7C3AED]/15 border border-[#7C3AED]/20 text-[#7C3AED] font-mono text-[9px] font-black px-2.5 py-1 rounded-none">
                    <DollarSign size={10} />
                    {highestBid > 0 ? `${highestBid} STX` : "NO BID"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL-SCREEN IMMERSIVE INSPECTOR MODAL */}
      {selectedNft && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#080808] border border-white/20 rounded-none w-full max-w-5xl overflow-hidden shadow-2xl animate-scaleIn">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedNft(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-none border border-white/10 transition-colors cursor-pointer z-20"
            >
              <X size={16} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: Interactive NFT Card Visualizer */}
              <div className="lg:col-span-5 bg-black/30 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                <NFTCard
                  title={selectedNft.title}
                  description={selectedNft.description}
                  tokenSerial={selectedNft.tokenSerial}
                  metadataHash={selectedNft.metadataHash}
                  themeId={selectedNft.themeId}
                  chatLog={selectedNft.chatLog}
                  creatorAddress={selectedNft.creatorAddress}
                  interactive={true}
                />
              </div>

              {/* Right Column: Metadata, Bid Portal & Chat Dialogue */}
              <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto max-h-[85vh] scrollbar">
                
                {/* Heading details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-black bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#7C3AED] px-2.5 py-0.5 rounded-none uppercase tracking-widest">
                      {selectedNft.tokenSerial}
                    </span>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                      BLOCK: #{selectedNft.blockNumber || "PENDING"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    {selectedNft.title}
                  </h2>
                  <p className="text-[10px] text-white/40 font-mono break-all truncate uppercase tracking-wider">
                    CONTRACT CREATOR: {selectedNft.creatorAddress}
                  </p>
                </div>

                {/* Concept Overview */}
                <div className="bg-[#121212] rounded-none p-4 border border-white/10 space-y-1">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono block">
                    Technical Blueprint Description
                  </span>
                  <p className="text-xs text-white/75 leading-relaxed">
                    {selectedNft.description}
                  </p>
                </div>

                {/* Chat Log Dialogue (Full view) */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono block">
                    Secured Chat Dialogue Transcript
                  </span>
                  <div className="bg-black border border-white/10 rounded-none p-3.5 max-h-52 overflow-y-auto space-y-3 scrollbar">
                    {selectedNft.chatLog.map((m, i) => {
                      const isUser = m.sender === "user";
                      return (
                        <div
                          key={m.id || i}
                          className={`p-3 rounded-none text-xs leading-normal max-w-[85%] ${
                            isUser
                              ? "bg-[#7C3AED]/10 text-white ml-auto border border-[#7C3AED]/25"
                              : "bg-white/5 text-white/80 mr-auto border border-white/5"
                          }`}
                        >
                          <span className={`block font-mono text-[9px] font-black tracking-widest mb-1.5 ${isUser ? "text-[#F472B6]" : "text-[#7C3AED]"}`}>
                            {isUser ? "ME / CLIENT" : "ASSISTANT"}
                          </span>
                          {m.text}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bidding Portal & upvotes section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* Left: Place Bid Form */}
                  <div className="bg-[#121212] rounded-none p-4 border border-white/10 space-y-3">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono block">
                      STX Bidding Portal
                    </span>

                    <form onSubmit={handlePlaceBid} className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">YOUR WALLET ADDRESS (MOCK)</label>
                        <input
                          type="text"
                          required
                          placeholder="SP3J..."
                          value={bidderAddress}
                          onChange={(e) => setBidderAddress(e.target.value)}
                          className="w-full bg-black border border-white/20 rounded-none px-2.5 py-1.5 text-[11px] font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">BID AMOUNT (STX)</label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            placeholder="Amount > current highest"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="w-full bg-black border border-white/20 rounded-none pl-7 pr-2.5 py-1.5 text-[11px] font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED]"
                          />
                          <DollarSign size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                        </div>
                      </div>

                      {bidError && <p className="text-[10px] text-rose-500 font-mono uppercase tracking-wider">{bidError}</p>}
                      {bidSuccess && <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">✅ Bid placed successfully!</p>}

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-none text-[10px] font-black tracking-widest uppercase transition-all cursor-pointer"
                      >
                        SUBMIT MOCK BID
                      </button>
                    </form>
                  </div>

                  {/* Right: Active Bid History */}
                  <div className="bg-[#121212] rounded-none p-4 border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono block mb-2">
                        Active Bids Log
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar">
                        {!selectedNft.bids || selectedNft.bids.length === 0 ? (
                          <p className="text-[11px] text-white/30 italic font-mono py-4 text-center uppercase tracking-wider">
                            No bids currently active.
                          </p>
                        ) : (
                          selectedNft.bids.map((b, i) => (
                            <div key={b.id || i} className="flex justify-between items-center text-[10px] bg-black p-2 rounded-none border border-white/5 font-mono">
                              <span className="text-white/60 truncate max-w-[110px]">{b.bidder}</span>
                              <span className="text-[#F472B6] font-black">{b.amountSTX} STX</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={(e) => handleUpvote(selectedNft.id, e)}
                        className={`flex-1 py-2 rounded-none flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase font-black border cursor-pointer transition-colors ${
                          votingMap[selectedNft.id]
                            ? "bg-[#7C3AED]/15 text-[#7C3AED] border-[#7C3AED]/30"
                            : "bg-black hover:bg-white/5 text-white/60 border-white/15"
                        }`}
                      >
                        <Heart size={12} className={votingMap[selectedNft.id] ? "fill-rose-500 text-rose-500" : ""} />
                        Upvote ({selectedNft.likes})
                      </button>
                    </div>
                  </div>

                </div>

                {/* Core On-Chain footprint details */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[9px] uppercase tracking-wider text-white/30">
                  <div>
                    <span className="block text-[8px] text-white/20 uppercase tracking-widest mb-0.5">DECENTRALIZED STORAGE</span>
                    <span className="text-white/60">IPFS Gateway (SIP-016)</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-white/20 uppercase tracking-widest mb-0.5">BLOCKCHAIN LAYER</span>
                    <span className="text-white/60">Bitcoin L2 (Stacks PoX)</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-white/20 uppercase tracking-widest mb-0.5">METADATA INTEGRITY</span>
                    <span className="text-white/60 text-[9px] truncate break-all block" title={selectedNft.metadataHash}>
                      {selectedNft.metadataHash.substring(0, 16)}...
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
