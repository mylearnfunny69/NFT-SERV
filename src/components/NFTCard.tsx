import React, { useEffect, useRef, useState } from "react";
import { ChatMessage, NFTThemeId, NFT_THEMES } from "../types";
import { renderNFTCardOnCanvas } from "../utils";
import { Download, Sparkles, Shield, Compass, Rotate3d, RefreshCw, QrCode, Copy, Check, ExternalLink, Heart, Share2 } from "lucide-react";

interface NFTCardProps {
  title: string;
  description: string;
  tokenSerial: string;
  metadataHash: string;
  themeId: NFTThemeId;
  chatLog: ChatMessage[];
  creatorAddress: string;
  interactive?: boolean;
}

export default function NFTCard({
  title,
  description,
  tokenSerial,
  metadataHash,
  themeId,
  chatLog,
  creatorAddress,
  interactive = true,
}: NFTCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [showHologram, setShowHologram] = useState(true);
  
  // Immersive 3D Wearable Preview State
  const [is3DMode, setIs3DMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // QR Code Physical-Digital Linkage State
  const [showQrOverlay, setShowQrOverlay] = useState(false);
  const [qrHighContrast, setQrHighContrast] = useState(false);
  const [copied, setCopied] = useState(false);

  // Interactive Like Counter State
  const [likes, setLikes] = useState(() => {
    if (typeof localStorage === "undefined") return 42;
    const serial = tokenSerial || "STX-CHAT-0000";
    const savedLikes = localStorage.getItem(`chatmint_likes_${serial}`);
    if (savedLikes) return parseInt(savedLikes, 10);
    // Produce deterministic initial likes between 28 and 110 based on serial string
    const hashSeed = serial.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hashSeed % 82) + 28;
  });

  const [hasLiked, setHasLiked] = useState(() => {
    if (typeof localStorage === "undefined") return false;
    const serial = tokenSerial || "STX-CHAT-0000";
    return localStorage.getItem(`chatmint_liked_${serial}`) === "true";
  });

  // Construct Public Metadata Verification URL
  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}?verify=${encodeURIComponent(tokenSerial || "STX-CHAT-0000")}`
    : `https://chatmint.app?verify=${encodeURIComponent(tokenSerial || "STX-CHAT-0000")}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=${
    qrHighContrast ? "000000" : "7c3aed"
  }&bgcolor=${qrHighContrast ? "ffffff" : "080808"}&qzone=1&data=${encodeURIComponent(publicUrl)}`;

  // Toggle Like Handler
  const handleToggleLike = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const serial = tokenSerial || "STX-CHAT-0000";
    if (hasLiked) {
      const newCount = Math.max(0, likes - 1);
      setLikes(newCount);
      setHasLiked(false);
      localStorage.removeItem(`chatmint_liked_${serial}`);
      localStorage.setItem(`chatmint_likes_${serial}`, newCount.toString());
    } else {
      const newCount = likes + 1;
      setLikes(newCount);
      setHasLiked(true);
      localStorage.setItem(`chatmint_liked_${serial}`, "true");
      localStorage.setItem(`chatmint_likes_${serial}`, newCount.toString());
    }
  };

  // Social Share Handlers
  const shareTwitter = () => {
    const shareText = `Check out this 1/1 Chat NFT & Physical Z-Shirt Blueprint "${title || "Chat NFT"}" on Bitcoin L2! 👕⚡`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(publicUrl)}`, "_blank", "noopener,noreferrer");
  };

  const shareFarcaster = () => {
    const shareText = `Minted 1/1 Chat NFT: "${title || "Chat NFT"}" on Bitcoin L2 with physical-digital Z-Shirt linkage! 👕✨`;
    window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(publicUrl)}`, "_blank", "noopener,noreferrer");
  };

  // Copy URL handler
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Re-render canvas whenever details change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      renderNFTCardOnCanvas(
        canvas,
        title || "Untitled Chat Idea",
        description || "Analyze a chat log to generate a cryptographic technical blueprint for this NFT.",
        tokenSerial || "STX-CHAT-0000",
        metadataHash || "0x0000000000000000000000000000000000000000000000000000000000000000",
        themeId,
        chatLog && chatLog.length > 0
          ? chatLog
          : [
              { id: "p1", sender: "user", text: "Enter or paste your chat ideas..." },
              { id: "p2", sender: "ai", text: "Or upload a chat screenshot above!" },
            ],
        creatorAddress || "SP3JP0NVA0S3...R8NZV"
      );
    }
  }, [title, description, tokenSerial, metadataHash, themeId, chatLog, creatorAddress]);

  // Handle card tilt hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardContainerRef.current) return;
    setIsHovered(true);
    const card = cardContainerRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (is3DMode) {
      // In 3D mode, allow a more dramatic tilt (up to 30 degrees)
      // If flipped, invert Y rotation so the intuitive cursor pull direction is preserved
      const tiltX = ((y - centerY) / centerY) * -28;
      const tiltY = ((x - centerX) / centerX) * 28 * (isFlipped ? -1 : 1);
      setRotateX(tiltX);
      setRotateY(tiltY);
    } else {
      // Max 12 degrees classic tilt
      const tiltX = ((y - centerY) / centerY) * -12;
      const tiltY = ((x - centerX) / centerX) * 12;

      setRotateX(tiltX);
      setRotateY(tiltY);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Download high-resolution image of the card
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-nft.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const theme = NFT_THEMES[themeId];

  // Dynamic transformation style mapping
  const containerStyle: React.CSSProperties = {
    perspective: "1200px",
    transformStyle: "preserve-3d",
    width: "360px",
    height: "500px",
    transition: isHovered ? "transform 0.05s ease-out" : "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transform: (is3DMode && !isHovered && !isFlipped)
      ? undefined // CSS keyframe turntable handles idle spin
      : `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none">
      {/* Interactive Card Canvas Wrapper */}
      <div
        ref={cardContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative cursor-grab active:cursor-grabbing ${
          is3DMode && !isHovered && !isFlipped ? "animate-3d-turntable" : ""
        }`}
        style={containerStyle}
      >
        {/* ==================== FRONT SIDE OF THE NFT CARD ==================== */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "translateZ(2px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Holographic Layer effect with 3D Z-translation depth */}
          {showHologram && (
            <div
              className="absolute inset-0 z-10 rounded-none pointer-events-none holo-overlay opacity-60"
              style={{
                boxShadow: `inset 0 0 40px ${theme.glowColor}, 0 10px 30px rgba(0, 0, 0, 0.5)`,
                border: `2px solid ${theme.borderColor}`,
                transform: "translateZ(20px)",
              }}
            />
          )}

          {themeId === 'coinbase_blue' && (
            <div 
              className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-[#0052FF] text-white font-mono text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-lg flex items-center gap-1.5 animate-pulse"
              style={{ transform: "translateZ(30px)" }}
            >
              <span className="w-1.5 h-1.5 rounded-none bg-emerald-400"></span>
              CB BRIDGE VERIFIED
            </div>
          )}

          {/* Interactive Like Counter Badge on Front Top Left */}
          <button
            type="button"
            onClick={handleToggleLike}
            title={hasLiked ? "Unlike NFT" : "Like NFT"}
            className={`absolute ${themeId === 'coinbase_blue' ? 'top-12 left-4' : 'top-4 left-4'} z-25 px-2.5 py-1 text-xs font-mono font-black uppercase tracking-widest border transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
              hasLiked
                ? "bg-rose-500/90 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)] scale-105"
                : "bg-black/80 hover:bg-black text-white/90 border-white/20 hover:border-rose-400"
            }`}
            style={{ transform: "translateZ(35px)" }}
          >
            <Heart size={12} className={hasLiked ? "fill-white text-white animate-pulse" : "text-rose-400"} />
            <span>{likes}</span>
          </button>

          {/* QR Code Quick Badge on Front Top Right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowQrOverlay(!showQrOverlay);
            }}
            title="Scan Physical-Digital QR Code"
            className="absolute top-4 right-4 z-25 p-1.5 bg-black/80 hover:bg-[#7C3AED] text-white border border-white/20 hover:border-[#7C3AED] transition-colors shadow-lg group cursor-pointer"
            style={{ transform: "translateZ(35px)" }}
          >
            <QrCode size={14} className="group-hover:scale-110 transition-transform" />
          </button>

          {/* Shiny Edge reflection with 3D depth */}
          <div 
            className="absolute inset-0 z-15 rounded-none pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10" 
            style={{ transform: "translateZ(10px)" }}
          />

          {/* Hidden Canvas - keeps standard 2X resolution for crystal clear exporting */}
          <canvas
            ref={canvasRef}
            width={720}
            height={1000}
            className="w-full h-full rounded-none bg-[#121212] border border-white/10"
            style={{
              boxShadow: `0 25px 50px rgba(0,0,0,0.8), 0 0 40px ${theme.glowColor}`,
            }}
          />

          {/* Interactive QR Code Overlay HUD on Front when Toggled */}
          {showQrOverlay && (
            <div 
              className="absolute inset-2 z-30 bg-black/95 border-2 border-[#7C3AED] p-5 flex flex-col justify-between backdrop-blur-md font-mono text-left space-y-3"
              style={{ transform: "translateZ(45px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5 text-[#7C3AED] text-[10px] font-black uppercase tracking-wider">
                  <QrCode size={12} />
                  <span>Physical-Digital Twin</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrOverlay(false)}
                  className="text-xs text-white/50 hover:text-white font-bold cursor-pointer px-1.5 py-0.5 bg-white/5 border border-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Scannable QR Image Container */}
              <div className="flex flex-col items-center justify-center p-3 bg-black border border-white/10 relative group">
                <div className={`p-2 transition-all ${qrHighContrast ? "bg-white" : "bg-[#080808]"}`}>
                  <img
                    src={qrImageUrl}
                    alt={`QR Code Metadata Link for ${tokenSerial}`}
                    className="w-32 h-32 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between w-full text-[8px] text-white/40 uppercase tracking-widest">
                  <span>SCAN FOR METADATA</span>
                  <button
                    type="button"
                    onClick={() => setQrHighContrast(!qrHighContrast)}
                    className="text-[#7C3AED] font-bold hover:underline cursor-pointer"
                  >
                    {qrHighContrast ? "Neon Style" : "High Contrast"}
                  </button>
                </div>
              </div>

              {/* URL & Serial Info */}
              <div className="space-y-1.5 text-[9px]">
                <div className="flex justify-between text-white/50">
                  <span>SERIAL</span>
                  <span className="text-white font-bold">{tokenSerial || "STX-CHAT-0000"}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 text-[8px] text-white/70 truncate tracking-wider font-mono">
                  {publicUrl}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[9px]">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="py-2 px-2 bg-[#7C3AED]/20 hover:bg-[#7C3AED]/30 border border-[#7C3AED]/40 text-white font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copied ? "COPIED" : "COPY LINK"}</span>
                </button>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center"
                >
                  <ExternalLink size={11} />
                  <span>VERIFY</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ==================== BACK SIDE OF THE CARD (Z-SHIRT SPECS) ==================== */}
        <div
          className="absolute inset-0 w-full h-full bg-[#080808] border-2 p-6 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(2px)",
            transformStyle: "preserve-3d",
            borderColor: theme.borderColor,
            boxShadow: `0 25px 50px rgba(0,0,0,0.8), 0 0 40px ${theme.glowColor}`,
          }}
        >
          {/* Micro grid pattern background for technical schematic look */}
          <div className="absolute inset-0 opacity-20 tech-grid pointer-events-none" />

          {/* Header */}
          <div className="relative border-b border-white/10 pb-4 space-y-1 z-10" style={{ transform: "translateZ(30px)" }}>
            <div className="flex justify-between items-center">
              <span 
                className="text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 border"
                style={{
                  color: theme.textColor,
                  backgroundColor: `${theme.glowColor}22`,
                  borderColor: `${theme.borderColor}55`,
                }}
              >
                👕 Z-Shirt Apparel Lab
              </span>
              <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Digital Twin Verified
              </span>
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white truncate mt-1">
              {title || "Untitled Chat Idea"}
            </h3>
            <p className="text-[8px] text-white/40 font-mono tracking-widest uppercase">
              SPECIFICATION SERIAL: <span className="text-white font-bold">{tokenSerial || "STX-CHAT-0000"}</span>
            </p>
          </div>

          {/* Specs detail layout with embedded QR Code Generator */}
          <div className="relative space-y-3 flex-1 py-3 z-10" style={{ transform: "translateZ(20px)" }}>
            {/* Live Scannable QR Code & Garment Mock Area */}
            <div className="h-32 bg-black/60 border border-white/10 p-2.5 flex items-center justify-between gap-3 relative overflow-hidden">
              <div 
                className="absolute inset-0 pointer-events-none opacity-20" 
                style={{
                  backgroundImage: `radial-gradient(circle, ${theme.glowColor}44 0%, transparent 70%)`
                }}
              />
              
              {/* Left side: Embedded QR Code */}
              <div className="flex flex-col items-center justify-center p-1 bg-black border border-white/10 shrink-0">
                <img
                  src={qrImageUrl}
                  alt={`Scannable QR Code for ${tokenSerial}`}
                  className="w-20 h-20 object-contain bg-[#080808]"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[7px] text-[#7C3AED] font-mono tracking-widest uppercase mt-1 font-bold">
                  SCAN METADATA
                </span>
              </div>

              {/* Right side: Apparel Spec details */}
              <div className="text-left space-y-1 text-mono text-[8px] text-white/70 overflow-hidden">
                <div className="text-[9px] text-white font-black uppercase tracking-wider flex items-center gap-1">
                  <span>👕 SLEEVE DYE LINK</span>
                </div>
                <p className="text-[8px] text-white/50 leading-tight">
                  Scannable physical patch redirects to immutable public metadata twin:
                </p>
                <div className="text-[7px] text-[#A78BFA] font-mono truncate font-bold bg-black/40 border border-white/5 p-1">
                  {publicUrl}
                </div>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="text-[7px] text-white/80 hover:text-white uppercase tracking-widest font-bold underline cursor-pointer"
                >
                  {copied ? "✓ Copied Metadata Link" : "Copy Metadata Link"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left font-mono text-[9px] uppercase tracking-wider">
              <div className="border border-white/5 p-2 bg-black/30">
                <span className="text-[7px] text-white/40 block">FABRIC GRADE</span>
                <span className="text-white/80 font-black">240GSM Cotton</span>
              </div>
              <div className="border border-white/5 p-2 bg-black/30">
                <span className="text-[7px] text-white/40 block">INK SEALS</span>
                <span className="text-white/80 font-black">Double Plastisol</span>
              </div>
              <div className="border border-white/5 p-2 bg-black/30">
                <span className="text-[7px] text-white/40 block">METADATA COMMIT</span>
                <span className="text-[#A78BFA] font-bold truncate block">{metadataHash.substring(0, 14)}...</span>
              </div>
              <div className="border border-white/5 p-2 bg-black/30">
                <span className="text-[7px] text-white/40 block">L2 LEDGER ANCHOR</span>
                <span className="text-emerald-400 font-bold block">STACKS SIP-009</span>
              </div>
            </div>
          </div>

          {/* Backside Footer */}
          <div className="relative border-t border-white/10 pt-3 flex justify-between items-center z-10" style={{ transform: "translateZ(30px)" }}>
            <div className="text-left font-mono text-[8px] text-white/40 space-y-0.5">
              <div>CREATOR ADDRESS:</div>
              <div className="text-white/70 font-bold truncate max-w-[190px]">{creatorAddress}</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[7px] font-mono text-[#F472B6] font-black uppercase tracking-widest block">
                PHYSICAL WEARABLE
              </span>
              <span className="text-[10px] font-mono text-white font-black uppercase tracking-widest">
                Z-SHOP ORIGINAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Panel */}
      <div className="mt-5 flex flex-wrap justify-center items-center gap-2 max-w-xl">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleToggleLike}
          title={hasLiked ? "Unlike NFT" : "Like NFT"}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-black font-mono uppercase tracking-widest border transition-all cursor-pointer shadow-md ${
            hasLiked
              ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)] scale-105"
              : "bg-white/5 hover:bg-white/10 text-white/70 border-white/10 hover:text-white"
          }`}
        >
          <Heart size={13} className={hasLiked ? "fill-rose-500 text-rose-500 animate-bounce" : "text-rose-400"} />
          <span>{likes} {likes === 1 ? "LIKE" : "LIKES"}</span>
        </button>

        {/* Share to Twitter / X */}
        <button
          type="button"
          onClick={shareTwitter}
          title="Share direct metadata link on Twitter / X"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/25 text-[#1DA1F2] border border-[#1DA1F2]/30 rounded-none text-xs font-black uppercase tracking-widest transition-colors shadow-md cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X / Twitter</span>
        </button>

        {/* Share to Farcaster */}
        <button
          type="button"
          onClick={shareFarcaster}
          title="Share direct metadata link on Farcaster (Warpcast)"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#8a63d2]/15 hover:bg-[#8a63d2]/30 text-[#a855f7] border border-[#8a63d2]/40 rounded-none text-xs font-black uppercase tracking-widest transition-colors shadow-md cursor-pointer"
        >
          <Share2 size={13} className="text-[#a855f7]" />
          <span>Farcaster</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadImage}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-none text-xs font-black uppercase tracking-widest border border-white/10 transition-colors shadow-md cursor-pointer"
        >
          <Download size={13} />
          Save Image
        </button>

        <button
          type="button"
          onClick={() => setShowHologram(!showHologram)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-black uppercase tracking-widest border transition-colors shadow-md cursor-pointer ${
            showHologram
              ? "bg-[#7C3AED]/15 hover:bg-[#7C3AED]/25 text-[#A78BFA] border-[#7C3AED]/30"
              : "bg-white/5 hover:bg-white/10 text-white/50 border-white/10"
          }`}
        >
          <Sparkles size={13} />
          Holo: {showHologram ? "ON" : "OFF"}
        </button>

        <button
          type="button"
          onClick={() => setShowQrOverlay(!showQrOverlay)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-black uppercase tracking-widest border transition-colors shadow-md cursor-pointer ${
            showQrOverlay
              ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-white/5 hover:bg-white/10 text-white/50 border-white/10"
          }`}
        >
          <QrCode size={13} />
          QR Code: {showQrOverlay ? "ON" : "OFF"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIs3DMode(!is3DMode);
            if (is3DMode) setIsFlipped(false); // Reset flip when exiting 3D mode
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-black uppercase tracking-widest border transition-colors shadow-md cursor-pointer ${
            is3DMode
              ? "bg-gradient-to-r from-[#7C3AED]/30 to-[#F472B6]/30 hover:from-[#7C3AED]/40 hover:to-[#F472B6]/40 text-white border-[#7C3AED]/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]"
              : "bg-white/5 hover:bg-white/10 text-white/50 border-white/10"
          }`}
        >
          <Rotate3d size={13} />
          3D Preview: {is3DMode ? "ON" : "OFF"}
        </button>

        {is3DMode && (
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#7C3AED]/20 hover:bg-[#7C3AED]/35 text-[#F472B6] border border-[#7C3AED]/40 rounded-none text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md animate-pulse"
          >
            <RefreshCw size={13} className={isFlipped ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} />
            Flip Blueprint
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 justify-center text-white/40 text-[9px] uppercase tracking-widest font-mono select-none">
        <span className="flex items-center gap-1.5">
          <Shield size={11} className="text-[#F472B6]" />
          Bitcoin Sealed (SIP-009)
        </span>
        <span className="flex items-center gap-1.5">
          <QrCode size={11} className="text-emerald-400" />
          Physical-Digital Linkage
        </span>
        <span className="flex items-center gap-1.5">
          <Compass size={11} className="text-[#7C3AED]" />
          {is3DMode ? "Immersive 3D Orbit Active" : "Kinetic Hover Active"}
        </span>
      </div>
    </div>
  );
}


