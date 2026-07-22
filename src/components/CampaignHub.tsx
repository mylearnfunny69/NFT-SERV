import React, { useState } from "react";
import { 
  Megaphone, Target, BarChart3, Coins, Users, PenTool, 
  Sparkles, Share2, ExternalLink, RefreshCw, Send, CheckCircle2 
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  channel: "Twitter/X" | "Farcaster" | "Mirror" | "Discord" | "Newsletter";
  status: "Active" | "Draft" | "Completed";
  budget: number;
  impressions: number;
  clicks: number;
  mintsGenerated: number;
  copy: string;
}

export default function CampaignHub() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "c1",
      name: "Sovereign Patent Lore Drop",
      channel: "Twitter/X",
      status: "Active",
      budget: 1500,
      impressions: 48500,
      clicks: 3420,
      mintsGenerated: 142,
      copy: "🔒 Turn your Google Drive patent documents into sovereign 1/1 digital certificates on Bitcoin L2 instantly. Secured via Stacks SIP-009. Claim absolute priority in block headers today. #BitcoinL2 #Sovereignty"
    },
    {
      id: "c2",
      name: "Coinbase L2 Bridge Onboarding",
      channel: "Farcaster",
      status: "Active",
      budget: 800,
      impressions: 24100,
      clicks: 1890,
      mintsGenerated: 98,
      copy: "🌉 Bridge your verified Base NFT mints or Coinbase Smart Wallet assets into the Stacks Bitcoin ecosystem. Solve multi-chain discovery with zero friction. /youchain"
    },
    {
      id: "c3",
      name: "100% Equity Founder Manifesto",
      channel: "Mirror",
      status: "Completed",
      budget: 500,
      impressions: 12500,
      clicks: 980,
      mintsGenerated: 45,
      copy: "Why progressive decentralization is the only safe path for solo developers and 100% equity operators. An authoritative breakdown on how Stacks Clarity contract isolation guarantees structural sovereignty."
    },
    {
      id: "c4",
      name: "Z-Shirt Physical-to-Digital Wearable Scan",
      channel: "Twitter/X",
      status: "Active",
      budget: 1250,
      impressions: 38200,
      clicks: 2950,
      mintsGenerated: 89,
      copy: "👕 Scan your sleeve, claim the ledger. Our custom Z-Shirt physical apparel is officially paired with 1/1 Chat NFTs on Bitcoin L2. Proof of craftsmanship is here. Authenticate your wearable twin instantly. #ZShirt #BitcoinL2 #SovereignApparel"
    }
  ]);

  // Campaign creation states
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignChannel, setNewCampaignChannel] = useState<Campaign["channel"]>("Twitter/X");
  const [newCampaignBudget, setNewCampaignBudget] = useState(250);
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleGenerateCopy = async () => {
    if (!newCampaignName.trim()) {
      alert("Please enter a campaign name first.");
      return;
    }
    setIsGenerating(true);
    setGeneratedCopy("");
    try {
      const response = await fetch("/api/analyze-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatText: `Generate a high-impact Web3 marketing post for a campaign named "${newCampaignName}" on channel "${newCampaignChannel}". ${
            generationPrompt ? `Focus on: ${generationPrompt}` : ""
          } Make it sound authoritative, exciting, and deeply technical (referencing Bitcoin security, L2 scalability, and creator sovereignty).`
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Extract title or description to format a great copy
        const parsedCopy = `📢 [${newCampaignChannel.toUpperCase()} LAUNCH] ${data.title}\n\n${data.description}\n\n🔐 Secured directly in Bitcoin block headers. ${data.explanationOfSignificance}\n\n#YouChain #Stacks #BitcoinL2`;
        setGeneratedCopy(parsedCopy);
      } else {
        throw new Error("Unable to contact copywriting AI.");
      }
    } catch (err) {
      // Fallback post
      const fallback = `🚀 Launching ${newCampaignName} on ${newCampaignChannel}!\n\nProtect your intellectual property by turning transcripts and files directly into sovereign 1/1 SIP-009 NFTs on Bitcoin. Zero gas on-boarding active now!\n\n#BitcoinL2 #CryptoSovereignty`;
      setGeneratedCopy(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;

    const newCampaign: Campaign = {
      id: "c-" + Date.now(),
      name: newCampaignName,
      channel: newCampaignChannel,
      status: "Active",
      budget: newCampaignBudget,
      impressions: 0,
      clicks: 0,
      mintsGenerated: 0,
      copy: generatedCopy || `📢 Introducing ${newCampaignName}! Built with YouChain. Securing sovereign creator records on Bitcoin L2.`
    };

    setCampaigns([newCampaign, ...campaigns]);
    setNewCampaignName("");
    setGenerationPrompt("");
    setGeneratedCopy("");
    setSuccessMsg(`Campaign "${newCampaignName}" successfully deployed to active queues!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Quick stats calculation
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalMints = campaigns.reduce((acc, c) => acc + c.mintsGenerated, 0);
  const averageCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-8 animate-fadeIn" id="campaign-hub">
      {/* Visual Header */}
      <div className="p-6 bg-black border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-7xl select-none uppercase font-mono pointer-events-none">
          CAMPAIGN
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-950/20 text-rose-400 border border-rose-900/40 font-mono text-[9px] font-bold tracking-widest uppercase">
              Go-To-Market Suite
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-widest">
              Growth Strategy Active
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Marketing Strategy & Campaign Portal
          </h2>
          <p className="text-white/60 text-xs max-w-3xl leading-relaxed">
            Execute a bulletproof GTM strategy designed for 100% equity sovereign operators. 
            Leverage organic developer lore, drive-patent drops, and high-conversion L2 loops 
            to acquire high-durability users without paying institutional VC fees.
          </p>
        </div>
      </div>

      {/* Strategic Masterplan Grid */}
      <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-6">
        <div className="border-b border-white/5 pb-3">
          <h3 className="text-xs uppercase font-black tracking-widest text-white flex items-center gap-2">
            <Target size={14} className="text-[#CA8A04]" />
            5-Stage GTM Masterplan
          </h3>
          <p className="text-[10px] text-white/40 font-mono mt-0.5">
            Tactical outline for organic growth and viral distribution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              stage: "01",
              name: "The Sovereign Leak",
              desc: "Deploy raw developer transcripts of Stacks Clarity breakthroughs on Twitter/X and Farcaster. Build initial cult-like developer consensus.",
              color: "border-[#7C3AED]/30 text-[#7C3AED]"
            },
            {
              stage: "02",
              name: "Patent Lore Drops",
              desc: "Onboard tech founders to turn their raw Google Drive patents into historic Bitcoin L2 art. Creates visual, authoritative, shareable content.",
              color: "border-[#CA8A04]/30 text-[#CA8A04]"
            },
            {
              stage: "03",
              name: "100% Equity Hype",
              desc: "Target indie hackers and solo founders on HackerNews & Mirror with manifestos outlining why holding 100% of your admin keys is the future.",
              color: "border-sky-500/30 text-sky-400"
            },
            {
              stage: "04",
              name: "L2 Bridging Wars",
              desc: "Target existing Base L2 or Coinbase smart-wallet users with direct cross-chain port incentives. Free mint slots for active Coinbase usernames.",
              color: "border-blue-500/30 text-blue-400"
            },
            {
              stage: "05",
              name: "DAO Handoff Loop",
              desc: "Transition administrative fee controls to the community governance treasury. Spark viral bidding pools for historic dialog NFTs.",
              color: "border-emerald-500/30 text-emerald-400"
            }
          ].map((s) => (
            <div key={s.stage} className={`p-4 bg-black border ${s.color} flex flex-col justify-between space-y-3`}>
              <div className="space-y-1">
                <span className="font-mono text-xs font-black opacity-40 block">STAGE {s.stage}</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">{s.name}</h4>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT PANEL: Interactive Campaign Deployer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Megaphone className="text-rose-400" size={18} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Organic Campaign Architect
                </h3>
                <p className="text-[9px] text-white/40 font-mono">
                  Draft and queue high-impact growth loops
                </p>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-400 font-mono flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={14} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleLaunchCampaign} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-white/40 uppercase tracking-wider">Campaign Identity</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Patent Lore Drop Alpha"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    required
                    className="w-full bg-black border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-rose-400 font-mono"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="font-mono text-white/40 uppercase tracking-wider">Growth Channel</label>
                  <select 
                    value={newCampaignChannel}
                    onChange={(e) => setNewCampaignChannel(e.target.value as any)}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-rose-400 font-mono"
                  >
                    <option value="Twitter/X">Twitter/X (Viral Reach)</option>
                    <option value="Farcaster">Farcaster (Crypto Devs)</option>
                    <option value="Mirror">Mirror (Authoritative Writeups)</option>
                    <option value="Discord">Discord (Community Loops)</option>
                    <option value="Newsletter">Newsletter (Retention)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-white/40 uppercase tracking-wider">Budget Allocation (STX Value Equivalent)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="100" 
                      max="5000" 
                      step="50" 
                      value={newCampaignBudget}
                      onChange={(e) => setNewCampaignBudget(parseInt(e.target.value))}
                      className="flex-1 accent-rose-500"
                    />
                    <span className="font-mono text-xs font-bold text-white w-20 text-right">{newCampaignBudget} STX</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="font-mono text-white/40 uppercase tracking-wider">Gemini Guidance Theme (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. focused on zeroVC, builder-first..."
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-rose-400 font-mono"
                  />
                </div>
              </div>

              {/* AI Generation Box */}
              <div className="p-4 bg-black border border-white/5 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Sparkles size={12} className="text-rose-400" />
                    Gemini Copywriting Engine
                  </span>
                  <button 
                    type="button"
                    onClick={handleGenerateCopy}
                    disabled={isGenerating || !newCampaignName.trim()}
                    className="text-[10px] text-rose-400 hover:underline uppercase font-mono flex items-center gap-1 cursor-pointer disabled:text-white/20"
                  >
                    {isGenerating ? (
                      <><RefreshCw size={10} className="animate-spin" /> Analyzing...</>
                    ) : (
                      "Draft Web3 Copy via Gemini"
                    )}
                  </button>
                </div>

                {generatedCopy ? (
                  <textarea 
                    value={generatedCopy}
                    onChange={(e) => setGeneratedCopy(e.target.value)}
                    className="w-full h-24 bg-black text-white/90 border border-rose-500/20 p-2 font-mono text-[11px] leading-relaxed focus:outline-none"
                  />
                ) : (
                  <p className="text-[10px] text-white/40 italic py-2">
                    Enter a campaign name and click "Draft Web3 Copy" to generate customized, high-converting social copy.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!newCampaignName.trim()}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-white/5 disabled:text-white/20 text-white font-black uppercase tracking-[0.2em] text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-rose-500/40"
              >
                <Send size={13} />
                Launch Campaign Loop
              </button>
            </form>
          </div>

          {/* Active Campaigns Registry */}
          <div className="border border-white/10 bg-[#0c0c0c] p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <BarChart3 className="text-rose-400" size={18} />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Live Campaign Ledger
              </h3>
            </div>

            <div className="space-y-3">
              {campaigns.map((c) => {
                const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0.00";
                return (
                  <div key={c.id} className="p-4 bg-black border border-white/5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 border ${
                          c.status === "Active" 
                            ? "bg-emerald-950/40 border-emerald-900/30 text-emerald-400" 
                            : "bg-white/5 border-white/10 text-white/40"
                        } font-bold uppercase tracking-wider`}>
                          ● {c.status}
                        </span>
                        <span className="font-mono text-[10px] text-white/30">{c.channel}</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{c.name}</h4>
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed font-mono italic">
                        "{c.copy}"
                      </p>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-1 md:flex md:flex-col justify-between md:text-right font-mono text-[10px] min-w-[120px] gap-2 border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
                      <div>
                        <span className="text-white/40 block uppercase text-[8px]">Budget:</span>
                        <span className="text-white font-bold">{c.budget} STX</span>
                      </div>
                      <div>
                        <span className="text-white/40 block uppercase text-[8px]">Reach:</span>
                        <span className="text-white font-bold">{c.impressions ? c.impressions.toLocaleString() : "Queueing"}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block uppercase text-[8px]">Clicks (CTR):</span>
                        <span className="text-white font-bold">{c.clicks ? `${c.clicks.toLocaleString()} (${ctr}%)` : "Queueing"}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400 block uppercase text-[8px] font-bold">Mints:</span>
                        <span className="text-emerald-400 font-bold">{c.mintsGenerated ? c.mintsGenerated : "Queueing"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Tactical GTM Metrics */}
        <div className="space-y-6">
          <div className="border border-white/10 bg-[#0c0c0c] p-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Coins className="text-rose-400" size={18} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Cumulative ROI metrics
                </h3>
                <p className="text-[9px] text-white/40 font-mono">
                  Sovereign marketing funnel performance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-black border border-white/5">
                <span className="text-white/40 font-mono text-[9px] block uppercase">Total Budget</span>
                <span className="text-lg font-black text-white font-mono">{totalBudget} STX</span>
              </div>
              <div className="p-3 bg-black border border-white/5">
                <span className="text-white/40 font-mono text-[9px] block uppercase">Total Reach</span>
                <span className="text-lg font-black text-white font-mono">{(totalImpressions / 1000).toFixed(1)}K</span>
              </div>
              <div className="p-3 bg-black border border-white/5">
                <span className="text-white/40 font-mono text-[9px] block uppercase">Avg Click CTR</span>
                <span className="text-lg font-black text-white font-mono">{averageCTR}%</span>
              </div>
              <div className="p-3 bg-black border border-white/5">
                <span className="text-emerald-400 font-mono text-[9px] block uppercase font-bold">Total L2 Mints</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{totalMints}</span>
              </div>
            </div>

            <div className="p-4 bg-rose-950/10 border border-rose-900/30 text-[11px] space-y-2 text-rose-200/90 leading-relaxed">
              <span className="font-black uppercase tracking-wider text-rose-400 block font-mono flex items-center gap-1">
                <Target size={12} /> Key Growth Milestones:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[10px]">
                <li><strong>Meme Leverage:</strong> Average CAC (Customer Acquisition Cost) is currently <strong className="text-white">5.4 STX</strong>.</li>
                <li><strong>Base Handshake:</strong> Coinbase smart wallet integrations drove <strong className="text-white">35%</strong> of all new mints.</li>
                <li><strong>IP Proofs:</strong> Google Drive Patent bridging has high conversions (<strong className="text-white">12.4% click-to-mint</strong>).</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
