import React, { useState, useEffect } from "react";
import { ChatNFT, NFT_THEMES } from "../types";
import NFTCard from "./NFTCard";
import { calculateRarityScore } from "../utils";
import { Heart, Search, TrendingUp, DollarSign, ExternalLink, Calendar, HelpCircle, X, Compass, Download, ChevronDown, ChevronUp, Activity, BarChart2, Flame, Award, Shield, Square, CheckSquare, Layers, Zap, Coins, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

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
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Batch Selection & Bulk Minting States
  const [viewMode, setViewMode] = useState<"gallery" | "drafts">("gallery");
  const [selectedDraftIds, setSelectedDraftIds] = useState<string[]>([]);
  const [showBulkMintModal, setShowBulkMintModal] = useState(false);
  const [bulkMintState, setBulkMintState] = useState<"idle" | "simulating" | "contract_call" | "finalizing" | "success">("idle");
  const [bulkMintLogs, setBulkMintLogs] = useState<string[]>([]);
  const [bulkMintProgress, setBulkMintProgress] = useState(0);
  const [batchTxHashResult, setBatchTxHashResult] = useState("");
  const [batchBlockResult, setBatchBlockResult] = useState(15450);
  const [qrHighContrast, setQrHighContrast] = useState(false);

  const [pendingDrafts, setPendingDrafts] = useState<any[]>([
    {
      id: "draft-1",
      title: "Sovereign Sourdough Node Network Protocol",
      description: "An autonomous commercial catering protocol integrating hardware-embedded IoT smart sensors to trigger automated sourdough proofing and bake cycles anchored on Stacks block commitments.",
      themeId: "obsidian_dark",
      creatorAddress: "SP3JP0NVA0S3M9F8NZV",
      chatLog: [
        { id: "d1-1", sender: "user", text: "Can we track sourdough fermentation on-chain?" },
        { id: "d1-2", sender: "ai", text: "Yes, we can bind temperature and pH telemetry to Clarity contract variables, minting a unique sourdough DNA certificate upon bake completion." },
        { id: "d1-3", sender: "user", text: "And the automatic payments?" },
        { id: "d1-4", sender: "ai", text: "Using automated Stacks escrow channels, delivery nodes are compensated instantly upon proof-of-delivery signatures." }
      ]
    },
    {
      id: "draft-2",
      title: "Decentralized ZK-Fitness Workout Attestation",
      description: "A cryptographic proof engine allowing local wearables to compile zero-knowledge fitness attestations, verifying exercise goals without leaking spatial/GPS telemetry.",
      themeId: "cyberpunk_neon",
      creatorAddress: "SP2H6945MINT73A",
      chatLog: [
        { id: "d2-1", sender: "user", text: "How do we prove I ran 10k without revealing my home address?" },
        { id: "d2-2", sender: "ai", text: "We process spatial coordinate lines through a ZK-SNARK circuit. It outputs a binary success verification, which is then minted as proof on-chain." },
        { id: "d2-3", sender: "user", text: "Let's secure this run log now!" },
        { id: "d2-4", sender: "ai", text: "Compiling ZK proof metadata... Ready to anchor as a secure SIP-009 fitness asset." }
      ]
    },
    {
      id: "draft-3",
      title: "MHD Fusion Reactor Stabilization Loop",
      description: "A smart grid control system stabilizing magnetic confinement parameters in a magnetohydrodynamic fusion reactor via real-time consensus-approved feedback adjustments.",
      themeId: "emerald_glow",
      creatorAddress: "SP18VANT7C3A9920",
      chatLog: [
        { id: "d3-1", sender: "user", text: "Can Stacks L2 handle microsecond telemetry for fusion?" },
        { id: "d3-2", sender: "ai", text: "No, Stacks blocks are too slow for real-time physics stability. We run a local sub-second consensus ring and commit summary blocks of stateproofs to Stacks." },
        { id: "d3-3", sender: "user", text: "That is brilliant! Let's mint this blueprint." },
        { id: "d3-4", sender: "ai", text: "Agreed. Generating metadata mapping physics variables to token attributes." }
      ]
    },
    {
      id: "draft-4",
      title: "Autonomous AI Carbon Credits Auditor",
      description: "An oracle agent auditing forestation imagery using decentralized vision models to mint verified carbon-offset certificates onto the Stacks ledger.",
      themeId: "classic_gold",
      creatorAddress: "SP3XCARBON77C39201",
      chatLog: [
        { id: "d4-1", sender: "user", text: "How can we stop fake carbon offset mints?" },
        { id: "d4-2", sender: "ai", text: "By requiring multi-agent consensus over satellite image sequences, validating forest density over time before any token is minted." },
        { id: "d4-3", sender: "user", text: "Let's create a batch of audited logs." },
        { id: "d4-4", sender: "ai", text: "Fiona Forest imagery verified. Ready for batch-minting on Stacks." }
      ]
    }
  ]);

  const handleToggleDraftSelection = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDraftIds(prev => 
      prev.includes(draftId) ? prev.filter(id => id !== draftId) : [...prev, draftId]
    );
  };

  const handleSelectAllDrafts = () => {
    if (selectedDraftIds.length === pendingDrafts.length) {
      setSelectedDraftIds([]);
    } else {
      setSelectedDraftIds(pendingDrafts.map(d => d.id));
    }
  };

  const handleInitiateBulkMint = async () => {
    const selectedDrafts = pendingDrafts.filter(d => selectedDraftIds.includes(d.id));
    if (selectedDrafts.length === 0) return;

    setShowBulkMintModal(true);
    setBulkMintState("simulating");
    setBulkMintProgress(15);
    setBulkMintLogs([
      "[STX-COMPILER] Initializing L2 Clarity compilation vectors...",
      `[STX-BATCH] Preparing ${selectedDrafts.length} selected chat proofs for array packaging...`,
      "[STX-FEE-SAVER] Running Clarity contract-call gas estimation..."
    ]);

    // Simulate state progression
    setTimeout(() => {
      setBulkMintState("contract_call");
      setBulkMintProgress(45);
      setBulkMintLogs(prev => [
        ...prev,
        "[CLARITY-VM] Batch size optimized. Loading multi-mint contract SP3XMINT7C3AED85...",
        "[CLARITY-VM] (contract-call? .chatmint-sip009-nft bulk-mint-chat-proofs)",
        `[GAS-OPTIMIZER] Estimated transaction fee: 5.2 STX (Instead of ${selectedDrafts.length * 4.5} STX!)`,
        "[GAS-OPTIMIZER] Total gas savings secured: ~75%!"
      ]);
    }, 1000);

    setTimeout(async () => {
      setBulkMintState("finalizing");
      setBulkMintProgress(75);
      setBulkMintLogs(prev => [
        ...prev,
        "[MEMPOOL] Broadcasting batch transaction to Stacks L2 network...",
        "[MEMPOOL] Securing witness block commitment onto Bitcoin L1 anchor...",
        "[DATABASE] Transmitting finalized metadata payload to PostgreSQL central database..."
      ]);

      try {
        // Trigger actual bulk-mint post request
        const res = await fetch("/api/nfts/bulk-mint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            concepts: selectedDrafts
          })
        });

        if (res.ok) {
          const mintedResult = await res.json();
          const sharedTxHash = mintedResult[0]?.txHash || "0xstx_batch_mint_default_hash";
          const sharedBlock = mintedResult[0]?.blockNumber || 15421;

          setBatchTxHashResult(sharedTxHash);
          setBatchBlockResult(sharedBlock);

          setTimeout(() => {
            setBulkMintState("success");
            setBulkMintProgress(100);
            setBulkMintLogs(prev => [
              ...prev,
              `[SUCCESS] Stacks transaction successfully verified! Tx: ${sharedTxHash.substring(0, 18)}...`,
              `[SUCCESS] Block height confirmed at #${sharedBlock}`,
              "[SUCCESS] Central registry synchronized with Clarity contract state.",
              "[SUCCESS] Stacks L2 batch processing finalized."
            ]);

            // Clean up states
            setPendingDrafts(prev => prev.filter(d => !selectedDraftIds.includes(d.id)));
            setSelectedDraftIds([]);
            setViewMode("gallery"); // Switch back to main gallery feed on successful mint
            loadFeed(); // Refresh the gallery feed to show the newly minted NFTs!
          }, 1200);

        } else {
          const errData = await res.json();
          setBulkMintLogs(prev => [
            ...prev,
            `[ERROR] Batch mint failed: ${errData.error || "Contract interaction failed."}`
          ]);
          setBulkMintState("idle");
        }
      } catch (err) {
        setBulkMintLogs(prev => [
          ...prev,
          "[ERROR] Server communication failed. Failed to commit batch transaction."
        ]);
        setBulkMintState("idle");
      }
    }, 2500);
  };

  // Dynamic 7-day analytics calculations
  const analyticsData = React.useMemo(() => {
    const data = [];
    const now = new Date();
    
    // Create baseline dates for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayKey = d.toDateString(); // For date key matching
      
      // Seed nice baseline trends to prevent empty/blank charts for new servers
      // (Mint volume waves around 2 to 5, secondary interest around 10 to 30 STX)
      const baseMints = 1 + Math.floor(Math.sin((i + 1) * 1.5) * 2 + 2); // 1 to 5
      const baseVolume = 10 + Math.floor(Math.cos(i * 1.2) * 8 + 10); // 10 to 28 STX
      
      data.push({
        date: dateStr,
        dayKey: dayKey,
        mints: baseMints,
        volumeSTX: baseVolume,
        actualMints: 0,
        actualBidsVolume: 0,
      });
    }
    
    // Accumulate actual real-time database state
    nfts.forEach(nft => {
      const nftDate = new Date(nft.createdAt);
      const nftDayKey = nftDate.toDateString();
      
      const dayData = data.find(item => item.dayKey === nftDayKey);
      if (dayData) {
        dayData.actualMints += 1;
        dayData.mints += 1;
        
        if (nft.bids && nft.bids.length > 0) {
          nft.bids.forEach(bid => {
            const bidDate = bid.timestamp ? new Date(bid.timestamp) : nftDate;
            const bidDayKey = bidDate.toDateString();
            const bidDayData = data.find(item => item.dayKey === bidDayKey) || dayData;
            
            const amount = Math.round(bid.amountSTX);
            bidDayData.actualBidsVolume += amount;
            bidDayData.volumeSTX += amount;
          });
        }
      }
    });
    
    return data;
  }, [nfts]);

  // Calculate 7-day aggregated statistics
  const totalMints7D = analyticsData.reduce((acc, item) => acc + item.mints, 0);
  const totalVolumeSTX7D = analyticsData.reduce((acc, item) => acc + item.volumeSTX, 0);
  const realMints7D = analyticsData.reduce((acc, item) => acc + item.actualMints, 0);
  const realBidsVolumeSTX7D = analyticsData.reduce((acc, item) => acc + item.actualBidsVolume, 0);

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

  // Accept highest bid and transfer ownership
  const [acceptingBid, setAcceptingBid] = useState(false);
  const handleAcceptBid = async (nftId: string) => {
    if (window.confirm("Are you sure you want to delegate and transfer ownership of this idea/NFT to the highest bidder? This completes the Antigravity handover process!")) {
      try {
        setAcceptingBid(true);
        const res = await fetch(`/api/nfts/${nftId}/accept-bid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (res.ok) {
          const updatedNft = await res.json();
          setSelectedNft(updatedNft);
          setNfts((prev) => prev.map((n) => (n.id === updatedNft.id ? updatedNft : n)));
          window.alert("Sovereignty delegated successfully! The highest bidder has taken over this idea.");
        } else {
          const errData = await res.json();
          window.alert(errData.error || "Failed to delegate sovereignty.");
        }
      } catch (err) {
        window.alert("Server communication failed.");
      } finally {
        setAcceptingBid(false);
      }
    }
  };

  // Download metadata as a JSON file
  const handleDownloadMetadata = (nft: ChatNFT, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Parse numeric token ID from serial (e.g. "STX-CHAT-0142" -> 142)
    const tokenId = parseInt(nft.tokenSerial.replace(/[^\d]/g, ""), 10) || 0;
    
    const metadata = {
      name: `ChatMint AI Concept - ${nft.title}`,
      description: nft.description,
      image: `https://chatmint.ai/api/nfts/${nft.id}/image`,
      properties: {
        token_id: tokenId,
        token_serial: nft.tokenSerial,
        creator: nft.creatorAddress,
        created_at: nft.createdAt,
        metadata_hash: nft.metadataHash,
        likes_count: nft.likes,
        theme_id: nft.themeId,
        is_original_idea: nft.isOriginalIdea ?? true,
      },
      sip009_contract: {
        standard: "SIP-009",
        asset_class: "NFT",
        contract_name: "chatmint-sip009-nft",
        contract_address: "SP3XMINT7C3AED85JSURDNDXSZVC9KW39QCHAT",
        contract_identifier: "SP3XMINT7C3AED85JSURDNDXSZVC9KW39QCHAT.chatmint-sip009-nft",
        token_id: tokenId,
        token_uri: nft.metadataHash ? `ipfs://${nft.metadataHash}` : `ipfs://QmDefaultHash`,
        associated_tx: nft.txHash || "0x5e13d9a5b6f3c4e5d6f789abcdef0123456789abcdef",
        block_height: nft.blockNumber || 108420
      },
      chat_log: nft.chatLog.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.timestamp || new Date(nft.createdAt).toISOString()
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metadata, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `metadata-${nft.tokenSerial.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-[#7C3AED]/30 bg-black/40 hover:bg-black/80 text-white/60 hover:text-white transition-all text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            <Activity size={12} className={showAnalytics ? "text-[#7C3AED] animate-pulse" : "text-white/40"} />
            {showAnalytics ? "Hide Trends" : "Show Trends"}
            {showAnalytics ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          
          <div className="relative flex-1 md:flex-none md:w-72">
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
      </div>

      {/* 7D TRENDING NFT ACTIVITY MINI-DASHBOARD */}
      {showAnalytics && (
        <div className="bg-[#121212] border border-white/10 p-5 space-y-5 rounded-none animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 size={16} className="text-[#F472B6]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">
                L2 REGISTRY PERFORMANCE & MARKET SENTIMENT (7D)
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-[9px] text-white/40 uppercase tracking-widest">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Syncing
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Bento metrics column */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {/* Metric 1 */}
              <div className="bg-black/60 border border-white/5 hover:border-[#7C3AED]/20 p-4 flex flex-col justify-between transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Mint Velocity</span>
                  <Activity size={12} className="text-[#7C3AED]" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-mono">{totalMints7D}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5">
                    {realMints7D > 0 ? `+${realMints7D} dynamic` : "L2 Secured"}
                  </span>
                </div>
                <p className="text-[9px] text-white/30 font-mono mt-1 uppercase">7-day conceptual deployments</p>
              </div>

              {/* Metric 2 */}
              <div className="bg-black/60 border border-white/5 hover:border-[#F472B6]/20 p-4 flex flex-col justify-between transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Secondary Bid Interest</span>
                  <DollarSign size={12} className="text-[#F472B6]" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#F472B6] font-mono">{totalVolumeSTX7D} <span className="text-xs font-normal">STX</span></span>
                  <span className="text-[10px] font-mono text-[#F472B6] font-bold bg-[#F472B6]/10 px-1.5 py-0.5">
                    {realBidsVolumeSTX7D > 0 ? `+${realBidsVolumeSTX7D} stx live` : "Active Bids"}
                  </span>
                </div>
                <p className="text-[9px] text-white/30 font-mono mt-1 uppercase">Cumulative buy proposals</p>
              </div>

              {/* Metric 3 */}
              <div className="bg-black/60 border border-white/5 hover:border-cyan-500/20 p-4 flex flex-col justify-between transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Engagement Ratio</span>
                  <Flame size={12} className="text-cyan-400 animate-pulse" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-cyan-400 font-mono">
                    {Math.round((totalVolumeSTX7D / Math.max(1, totalMints7D)) * 10) / 10}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">STX/MINT</span>
                </div>
                <p className="text-[9px] text-white/30 font-mono mt-1 uppercase">Capital density per concept</p>
              </div>
            </div>

            {/* Recharts chart column */}
            <div className="lg:col-span-8 bg-black/40 border border-white/5 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest font-bold">Registry Volume Distribution</span>
                <span className="text-[9px] font-mono text-white/30 uppercase">Interactive Timeline</span>
              </div>
              
              <div className="h-[200px] w-full font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="mintColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="volumeColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F472B6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F472B6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.3)" 
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="rgba(255,255,255,0.3)" 
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      allowDecimals={false}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="rgba(255,255,255,0.3)" 
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black/95 border border-[#7C3AED]/40 p-3 shadow-2xl rounded-none font-mono text-[10px] text-white space-y-1">
                              <p className="font-bold border-b border-white/10 pb-1 mb-1 text-white/80">{label}</p>
                              <p className="text-[#A78BFA] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                                Mints: <span className="font-bold text-white ml-auto">{payload[0]?.value}</span>
                              </p>
                              <p className="text-[#F472B6] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6]"></span>
                                Bid Volume: <span className="font-bold text-white ml-auto">{payload[1]?.value} STX</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={30}
                      content={({ payload }) => {
                        return (
                          <div className="flex gap-4 justify-end font-mono text-[9px] uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1.5 text-white/60">
                              <span className="w-2 h-2 bg-[#7C3AED] opacity-70"></span>
                              Mint Count
                            </span>
                            <span className="flex items-center gap-1.5 text-white/60">
                              <span className="w-2 h-2 bg-[#F472B6] opacity-70"></span>
                              STX Bid Volume
                            </span>
                          </div>
                        );
                      }}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="mints" 
                      stroke="#7C3AED" 
                      strokeWidth={1.5}
                      fillOpacity={1} 
                      fill="url(#mintColor)" 
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="volumeSTX" 
                      stroke="#F472B6" 
                      strokeWidth={1.5}
                      fillOpacity={1} 
                      fill="url(#volumeColor)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Tabs (High contrast black tabs with bright accents) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-2 gap-4">
        <div className="flex border border-white/10 p-0.5 bg-black/60">
          <button
            type="button"
            onClick={() => {
              setViewMode("gallery");
              setSelectedDraftIds([]);
            }}
            className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === "gallery"
                ? "bg-[#7C3AED] text-white font-black"
                : "text-white/40 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            Secured L2 Gallery ({nfts.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode("drafts");
              setSelectedDraftIds([]);
            }}
            className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "drafts"
                ? "bg-[#7C3AED] text-white font-black"
                : "text-white/40 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <Layers size={13} />
            Pending Chat Entries ({pendingDrafts.length})
          </button>
        </div>

        {viewMode === "drafts" && pendingDrafts.length > 0 && (
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={handleSelectAllDrafts}
              className="px-3 py-1.5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
            >
              {selectedDraftIds.length === pendingDrafts.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-white/30">|</span>
            <span className="text-white/60 text-[10px] uppercase tracking-wider">
              {selectedDraftIds.length} of {pendingDrafts.length} Selected
            </span>
          </div>
        )}
      </div>

      {viewMode === "gallery" ? (
        /* Loading State & Secured Gallery list */
        loading ? (
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
            const rarity = calculateRarityScore(nft);

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
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 border ${rarity.color} uppercase tracking-wider`}>
                      {rarity.label} ({rarity.score})
                    </span>
                    <span className="text-[10px] font-mono text-[#F472B6] font-black">
                      {nft.tokenSerial}
                    </span>
                  </div>
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

                  {/* Download Metadata JSON Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDownloadMetadata(nft, e)}
                    className="w-full flex items-center justify-center gap-2 py-2 mt-2 border border-white/10 hover:border-[#7C3AED]/50 bg-black/40 hover:bg-[#7C3AED]/10 text-white/60 hover:text-white transition-all text-[11px] font-mono uppercase tracking-wider rounded-none cursor-pointer"
                    title="Save chat proof locally as a SIP-009 JSON file"
                  >
                    <Download size={13} />
                    Download Metadata JSON
                  </button>
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

                    <button
                      type="button"
                      title="Download Metadata (SIP-009)"
                      onClick={(e) => handleDownloadMetadata(nft, e)}
                      className="flex items-center gap-1 text-white/40 hover:text-[#7C3AED] transition-all cursor-pointer hover:scale-105"
                    >
                      <Download size={13} />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider">JSON</span>
                    </button>
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
      )) : (
        /* Pending Drafts selection mode */
        pendingDrafts.length === 0 ? (
          <div className="bg-[#121212]/40 border border-white/10 rounded-none p-12 text-center text-white/40">
            <Award size={40} className="mx-auto text-[#7C3AED] mb-3 animate-pulse" />
            <h3 className="font-black text-white uppercase tracking-wider">All Drafts Deployed!</h3>
            <p className="text-xs mt-1 text-white/40 max-w-sm mx-auto">
              Excellent! Every single pending chat log draft has been securely compiled and batch-minted onto Stacks L2!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingDrafts.map((draft) => {
              const theme = NFT_THEMES[draft.themeId] || NFT_THEMES["cyberpunk_neon"];
              const isSelected = selectedDraftIds.includes(draft.id);

              return (
                <div
                  key={draft.id}
                  onClick={(e) => handleToggleDraftSelection(draft.id, e)}
                  className={`relative bg-[#121212] border rounded-none overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl ${
                    isSelected ? "border-[#7C3AED] ring-1 ring-[#7C3AED]" : "border-white/10 hover:border-[#7C3AED]/50"
                  }`}
                >
                  {/* Selection Indicator Corner Ribbon/Icon */}
                  <div className="absolute top-3 left-3 z-10">
                    {isSelected ? (
                      <CheckSquare size={18} className="text-[#7C3AED]" />
                    ) : (
                      <Square size={18} className="text-white/20 group-hover:text-white/40" />
                    )}
                  </div>

                  {/* Visual Cover/Theme banner */}
                  <div 
                    className="pl-10 pr-4 py-3 border-b border-white/5 flex justify-between items-center bg-black"
                    style={{ borderLeft: `3px solid ${theme.borderColor}` }}
                  >
                    <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest">
                      {theme.name}
                    </span>
                    <span className="text-[8px] font-mono font-black px-1.5 py-0.5 border border-[#7C3AED]/30 text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/5">
                      PENDING MINT
                    </span>
                  </div>

                  <div className="p-5 space-y-4 flex-1">
                    {/* Title & Author */}
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-[#7C3AED] transition-colors uppercase tracking-tight text-left">
                        {draft.title}
                      </h3>
                      <p className="text-[9px] text-white/30 font-mono mt-1 text-left">
                        DRAFT AUTHOR: {draft.creatorAddress.substring(0, 16)}...
                      </p>
                    </div>

                    {/* Concept Description */}
                    <p className="text-xs text-white/60 line-clamp-3 leading-relaxed text-left">
                      {draft.description}
                    </p>

                    {/* Chat Snippet (First 1 user line) */}
                    {draft.chatLog && draft.chatLog.length > 0 && (
                      <div className="bg-black/60 rounded-none p-3 text-[10px] border border-white/5 font-mono text-white/80 text-left">
                        <span className="text-[#F472B6] font-bold">ME:</span>{" "}
                        <span className="text-white/60 truncate block mt-0.5">
                          {draft.chatLog[0].text}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Stats Mockup */}
                  <div className="bg-black border-t border-white/5 px-4 py-3 flex justify-between items-center text-xs font-mono">
                    <div className="text-[9px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={11} />
                      Ready to Anchor
                    </div>
                    <div className="text-[9px] text-[#7C3AED] font-black uppercase tracking-widest flex items-center gap-1">
                      <Zap size={11} className="animate-pulse" />
                      L2 Multi-Mint
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      }

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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-black bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#7C3AED] px-2.5 py-0.5 rounded-none uppercase tracking-widest">
                        {selectedNft.tokenSerial}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                        BLOCK: #{selectedNft.blockNumber || "PENDING"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadMetadata(selectedNft, e)}
                      className="flex items-center gap-1.5 px-3 py-1 border border-white/20 hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10 text-white/60 hover:text-white transition-all text-[10px] font-mono rounded-none uppercase tracking-wider cursor-pointer self-start sm:self-auto"
                    >
                      <Download size={12} />
                      Download Metadata
                    </button>
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

                {/* Z-Shirt Shop Physical Wearable Authenticator QR Code Engine */}
                <div className="border border-dashed border-[#7C3AED]/40 bg-[#7C3AED]/5 p-5 rounded-none space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#7C3AED]/20 pb-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-white font-black uppercase text-[10px] font-mono tracking-wider">
                        👕 Z-Shirt Physical Authenticator
                      </div>
                      <p className="text-[8px] text-[#7C3AED] uppercase font-bold tracking-widest font-mono">
                        Physical-to-Digital Secure Scan Engine
                      </p>
                    </div>
                    <span className="text-[8px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 uppercase tracking-widest font-bold">
                      CONNECTED SHOP ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    <div className="md:col-span-7 space-y-3 text-left">
                      <p className="text-xs text-white/80 leading-relaxed">
                        Tied directly to your Z-Shirt Shop! Print this unique high-fidelity QR code onto your custom apparel sleeves, chests, or labels. 
                      </p>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        When scanned physically, it instantly redirects to our live digital verification twin showing this 1/1 Chat NFT's immutable signature, owner record, and cryptographic on-chain proof.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1.5 font-mono text-[9px]">
                        <button
                          type="button"
                          onClick={() => {
                            const verificationUrl = `${window.location.origin}?verify=${selectedNft.tokenSerial}`;
                            window.open(verificationUrl, "_blank");
                          }}
                          className="px-3 py-2 bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-white rounded-none uppercase font-black tracking-wider cursor-pointer transition-colors"
                        >
                          Simulate Phone Scan 📱
                        </button>
                        <a
                          href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=${qrHighContrast ? "000000" : "7c3aed"}&bgcolor=${qrHighContrast ? "ffffff" : "080808"}&qzone=2&data=${encodeURIComponent(`${window.location.origin}?verify=${selectedNft.tokenSerial}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-none uppercase font-black tracking-wider cursor-pointer transition-colors text-center"
                        >
                          Download QR (High-Res)
                        </a>
                      </div>
                    </div>

                    <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 bg-black/40 border border-white/5 relative">
                      {/* Togglable High Contrast background */}
                      <div className="flex justify-between w-full mb-2 text-[8px] font-mono text-white/40 uppercase tracking-widest">
                        <span>QR Preview</span>
                        <button
                          type="button"
                          onClick={() => setQrHighContrast(!qrHighContrast)}
                          className="text-[#7C3AED] hover:underline font-bold"
                        >
                          {qrHighContrast ? "Neon Style" : "High Contrast"}
                        </button>
                      </div>

                      <div className={`p-1.5 transition-all ${qrHighContrast ? 'bg-white' : 'bg-[#080808]'}`}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=${qrHighContrast ? "000000" : "7c3aed"}&bgcolor=${qrHighContrast ? "ffffff" : "080808"}&qzone=1&data=${encodeURIComponent(`${window.location.origin}?verify=${selectedNft.tokenSerial}`)}`}
                          alt={`QR Verification Code for ${selectedNft.tokenSerial}`}
                          className="w-32 h-32 border border-white/5 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <span className="text-[8px] text-white/30 font-mono tracking-widest uppercase mt-2">
                        {selectedNft.tokenSerial} MATCH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rarity & Traits Scorecard */}
                {(() => {
                  const selectedRarity = calculateRarityScore(selectedNft);
                  return (
                    <div className="bg-[#121212] border border-white/10 p-5 rounded-none space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Award size={14} className="text-yellow-500" />
                          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono">
                            Cryptographic Rarity Scorecard
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-black px-2 py-0.5 border ${selectedRarity.color} uppercase tracking-widest`}>
                            {selectedRarity.label}
                          </span>
                          <span className="text-base font-black text-white font-mono">{selectedRarity.score}/100</span>
                        </div>
                      </div>

                      {/* Traits Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedRarity.traits.map((trait, idx) => (
                          <div key={idx} className="bg-black/40 border border-white/5 p-3 flex flex-col justify-between space-y-1.5 rounded-none">
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">{trait.trait_type}</span>
                            <span className="text-[10px] text-white font-black truncate block uppercase">{trait.value}</span>
                            <div className="flex justify-between items-center text-[8px] font-mono uppercase">
                              <span className="text-white/40">{trait.rarity}</span>
                              <span className="text-yellow-500 font-bold">+{trait.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

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
                          selectedNft.bids.map((b: any, i: number) => (
                            <div key={b.id || i} className={`flex justify-between items-center text-[10px] p-2 rounded-none border font-mono ${b.accepted ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" : "bg-black border-white/5 text-white/60"}`}>
                              <span className="truncate max-w-[110px]">{b.bidder}</span>
                              <span className="font-black flex items-center gap-1">
                                {b.amountSTX} STX {b.accepted && "✓"}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/5">
                      {selectedNft.bids && selectedNft.bids.length > 0 && (
                        <div>
                          {selectedNft.bids.some((b: any) => b.accepted) ? (
                            <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 p-2 text-center text-[9px] font-mono uppercase tracking-wider">
                              🤝 TAKEOVER HANDOVER COMPLETE!
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAcceptBid(selectedNft.id)}
                              disabled={acceptingBid}
                              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black uppercase text-[9px] tracking-widest rounded-none transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1"
                            >
                              🚀 INITIATE ANTIGRAVITY HANDOFF
                            </button>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleUpvote(selectedNft.id, e)}
                        className={`w-full py-2 rounded-none flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase font-black border cursor-pointer transition-colors ${
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

      {/* BATCH SELECTION STICKY FLOATING ACTION BAR */}
      {selectedDraftIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0c0c0c] border-2 border-[#7C3AED] px-6 py-4 shadow-2xl flex flex-col sm:flex-row items-center gap-4 max-w-2xl w-[90vw] animate-slideUp font-mono text-white">
          <div className="flex-1 text-center sm:text-left">
            <div className="text-white font-black uppercase text-xs tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <Layers size={14} className="text-[#7C3AED]" />
              Batch Selection: {selectedDraftIds.length} Chat {selectedDraftIds.length === 1 ? "Entry" : "Entries"} Selected
            </div>
            <p className="text-[10px] text-emerald-400 mt-1 uppercase font-bold tracking-widest flex items-center justify-center sm:justify-start gap-1">
              <Zap size={11} className="animate-bounce" />
              Stacks L2 Gas Savings: ~75% (via Bulk Multi-Mint Contract)
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto text-xs">
            <button
              type="button"
              onClick={() => setSelectedDraftIds([])}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white uppercase font-black tracking-widest text-[10px] transition-all cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleInitiateBulkMint}
              className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-[#7C3AED] to-[#F472B6] hover:from-[#6D28D9] hover:to-[#EC4899] text-white uppercase font-black tracking-widest text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#7C3AED]/20"
            >
              <Coins size={12} />
              Bulk Mint on Stacks L2
            </button>
          </div>
        </div>
      )}

      {/* BULK MINTING SIMULATION OVERLAY MODAL */}
      {showBulkMintModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/25 max-w-xl w-full p-6 space-y-6 shadow-2xl relative font-mono text-white animate-scaleIn">
            
            {/* Close on Success */}
            {bulkMintState === "success" && (
              <button
                type="button"
                onClick={() => {
                  setShowBulkMintModal(false);
                  setBulkMintState("idle");
                }}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-none border border-white/10 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}

            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest flex items-center gap-1">
                <Coins size={14} className="animate-spin text-[#7C3AED]" />
                Stacks L2 Clarity Compiler Console
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2 text-left">
                Simulating L2 Batch Mint Transaction
              </h3>
              <p className="text-[10px] text-white/40 uppercase tracking-wider text-left">
                Consolidating concept metadata into an optimized contract-call array.
              </p>
            </div>

            {/* Fee Comparison Card */}
            <div className="bg-[#121212] border border-white/10 p-4 rounded-none space-y-3">
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest block text-left">
                Transaction Optimization Summary
              </span>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-rose-500/30 bg-rose-950/10 p-3 text-left">
                  <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider block">Individual Gas Cost</span>
                  <span className="text-lg font-bold text-rose-400 line-through">
                    {(selectedDraftIds.length || 3) * 4.5} STX
                  </span>
                  <span className="text-[8px] text-white/30 block mt-0.5">Separate Anchors</span>
                </div>
                <div className="border border-emerald-500/30 bg-emerald-950/10 p-3 text-left">
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider block">Optimized Batch Cost</span>
                  <span className="text-lg font-bold text-emerald-400">
                    5.2 STX
                  </span>
                  <span className="text-[8px] text-white/30 block mt-0.5">Single Clarity Commit</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider text-center py-1 bg-emerald-500/10 border border-emerald-500/20">
                ⚡ Net Savings Secured: ~75% Stacks Tx Fees
              </div>
            </div>

            {/* Simulated Live Compilation Logs console */}
            <div className="space-y-2 text-left">
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest block">
                Real-Time Clarity VM Execution logs
              </span>
              <div className="bg-black border border-white/10 p-4 h-44 overflow-y-auto font-mono text-[10px] text-white/70 space-y-1.5 scrollbar leading-relaxed text-left">
                {bulkMintLogs.map((log, idx) => {
                  let color = "text-white/60";
                  if (log.startsWith("[SUCCESS]")) color = "text-emerald-400 font-bold";
                  if (log.startsWith("[ERROR]")) color = "text-rose-400 font-bold";
                  if (log.startsWith("[CLARITY-VM]")) color = "text-[#A78BFA]";
                  if (log.startsWith("[GAS-OPTIMIZER]")) color = "text-cyan-400";
                  return (
                    <div key={idx} className={`${color} break-all`}>
                      &gt; {log}
                    </div>
                  );
                })}
                {bulkMintState !== "success" && (
                  <div className="text-[#7C3AED] animate-pulse">
                    &gt; [STX-DAEMON] Awaiting block height anchoring...
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar container */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase tracking-wider">
                <span>Contract State synchronization</span>
                <span className={bulkMintState === "success" ? "text-emerald-400" : "text-[#7C3AED]"}>
                  {bulkMintProgress}%
                </span>
              </div>
              <div className="w-full bg-white/5 border border-white/10 p-0.5 rounded-none">
                <div 
                  className="h-2 bg-gradient-to-r from-[#7C3AED] to-[#F472B6] transition-all duration-500" 
                  style={{ width: `${bulkMintProgress}%` }}
                />
              </div>
            </div>

            {/* Block height & Tx Details on success */}
            {bulkMintState === "success" && (
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs space-y-1 rounded-none animate-fadeIn text-left">
                <p className="font-bold uppercase tracking-widest">✓ Bulk Minting Transaction Secured!</p>
                <div className="text-[10px] text-white/60 font-mono pt-1 space-y-0.5 uppercase">
                  <div>Anchor Block: <span className="text-white font-bold font-mono">#{batchBlockResult}</span></div>
                  <div className="truncate">Tx Hash: <span className="text-white font-bold font-mono">{batchTxHashResult}</span></div>
                </div>
              </div>
            )}

            {/* Footer triggers */}
            <div className="pt-2 flex justify-end gap-3 font-mono">
              {bulkMintState !== "success" ? (
                <div className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <Clock size={12} className="animate-pulse" />
                  Broadcasting Anchor...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkMintModal(false);
                    setBulkMintState("idle");
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-wider cursor-pointer"
                >
                  Return to Registry
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
