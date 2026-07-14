import React, { useEffect, useRef, useState } from "react";
import { ChatMessage, NFTThemeId, NFT_THEMES } from "../types";
import { renderNFTCardOnCanvas } from "../utils";
import { Download, Sparkles, Shield, Compass } from "lucide-react";

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
    const card = cardContainerRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 15 degrees tilt
    const tiltX = ((y - centerY) / centerY) * -12;
    const tiltY = ((x - centerX) / centerX) * 12;

    setRotateX(tiltX);
    setRotateY(tiltY);
  };

  const handleMouseLeave = () => {
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

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Interactive Card Canvas Wrapper */}
      <div
        ref={cardContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
        style={{
          perspective: "1000px",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          width: "360px",
          height: "500px",
        }}
      >
        {/* Holographic Layer effect */}
        {showHologram && (
          <div
            className="absolute inset-0 z-10 rounded-none pointer-events-none holo-overlay opacity-60"
            style={{
              boxShadow: `inset 0 0 40px ${theme.glowColor}, 0 10px 30px rgba(0, 0, 0, 0.5)`,
              border: `2px solid ${theme.borderColor}`,
            }}
          />
        )}

        {/* Shiny Edge reflection */}
        <div 
          className="absolute inset-0 z-15 rounded-none pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10" 
        />

        {/* Hidden Canvas - keeps standard 2X resolution for crystal clear exporting */}
        <canvas
          ref={canvasRef}
          width={720}
          height={1000}
          className="w-full h-full rounded-none bg-[#121212] border border-white/10"
          style={{
            boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 30px ${theme.glowColor}`,
          }}
        />
      </div>

      {/* Utility Panel */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleDownloadImage}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-none text-xs font-black uppercase tracking-widest border border-white/10 transition-colors shadow-md cursor-pointer"
        >
          <Download size={14} />
          Save Image
        </button>

        <button
          type="button"
          onClick={() => setShowHologram(!showHologram)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-none text-xs font-black uppercase tracking-widest border transition-colors shadow-md cursor-pointer ${
            showHologram
              ? "bg-[#7C3AED]/20 hover:bg-[#7C3AED]/30 text-[#7C3AED] border-[#7C3AED]/30"
              : "bg-white/5 hover:bg-white/10 text-white/50 border-white/10"
          }`}
        >
          <Sparkles size={14} />
          Holo: {showHologram ? "ON" : "OFF"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 justify-center text-white/40 text-[9px] uppercase tracking-widest font-mono select-none">
        <span className="flex items-center gap-1.5">
          <Shield size={11} className="text-[#F472B6]" />
          Bitcoin Sealed (SIP-009)
        </span>
        <span className="flex items-center gap-1.5">
          <Compass size={11} className="text-[#7C3AED]" />
          Kinetic Hover
        </span>
      </div>
    </div>
  );
}
