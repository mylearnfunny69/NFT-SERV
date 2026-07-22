import { ChatMessage, NFTTheme, NFT_THEMES, NFTThemeId } from "./types";

// Generates a mock Stacks address
export function generateMockAddress(): string {
  const chars = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let address = "SP";
  for (let i = 0; i < 30; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Generate an exact SHA-256 styled hex hash
export function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padEnd(8, "f");
  const randomHex = Array.from({ length: 56 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return `0x${hex}${randomHex}`.substring(0, 66);
}

// Draw the physical trading card onto an HTML5 Canvas so it can be exported/downloaded as a real image!
export function renderNFTCardOnCanvas(
  canvas: HTMLCanvasElement,
  title: string,
  description: string,
  tokenSerial: string,
  metadataHash: string,
  themeId: NFTThemeId,
  chatLog: ChatMessage[],
  creatorAddress: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const theme = NFT_THEMES[themeId];
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (themeId === 'classic_gold') {
    grad.addColorStop(0, "#1c1917");
    grad.addColorStop(0.5, "#292524");
    grad.addColorStop(1, "#44403c");
  } else if (themeId === 'cyberpunk_neon') {
    grad.addColorStop(0, "#09090b");
    grad.addColorStop(0.6, "#180828");
    grad.addColorStop(1, "#0c0114");
  } else if (themeId === 'base44_blue') {
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(0.5, "#1e293b");
    grad.addColorStop(1, "#1e3a8a");
  } else if (themeId === 'emerald_gpt') {
    grad.addColorStop(0, "#022c22");
    grad.addColorStop(0.5, "#064e3b");
    grad.addColorStop(1, "#0f172a");
  } else if (themeId === 'bold_purple') {
    grad.addColorStop(0, "#080808");
    grad.addColorStop(0.6, "#121212");
    grad.addColorStop(1, "#1e1b4b");
  } else if (themeId === 'coinbase_blue') {
    grad.addColorStop(0, "#010825");
    grad.addColorStop(0.5, "#001242");
    grad.addColorStop(1, "#002c9a");
  } else {
    grad.addColorStop(0, "#030712");
    grad.addColorStop(0.5, "#111827");
    grad.addColorStop(1, "#030712");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Subtle Grid Overlay
  ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
  ctx.lineWidth = 1;
  const gridSize = 25;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 3. Draw Outer Card Border Frame
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Accent inner border line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.strokeRect(17, 17, width - 34, height - 34);

  // 4. Header Region (Logo / Title / Serial)
  // Draw Stacks/Bitcoin logo (styled circle)
  ctx.fillStyle = theme.accentColor;
  ctx.beginPath();
  ctx.arc(45, 45, 14, 0, Math.PI * 2);
  ctx.fill();

  // Draw white 'S' inside logo
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("STX", 45, 45);

  // Header Title
  ctx.fillStyle = theme.textColor;
  ctx.font = `bold 20px ${theme.fontFamily === 'system-ui, sans-serif' ? 'Inter' : theme.fontFamily}`;
  ctx.textAlign = "left";
  ctx.fillText("CHAT NFT", 75, 45);

  // Serial Number (Right side)
  ctx.fillStyle = theme.accentColor;
  ctx.font = "bold 13px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.fillText(tokenSerial, width - 35, 45);

  // Divider line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.beginPath();
  ctx.moveTo(30, 75);
  ctx.lineTo(width - 30, 75);
  ctx.stroke();

  // 5. Draw Dynamic Chat Dialog bubbles (Middle area)
  // Let's draw up to 3 dialogue rows to fit the card layout perfectly
  const maxLogs = chatLog.slice(0, 3);
  let startY = 100;

  maxLogs.forEach((msg, i) => {
    const isUser = msg.sender === "user";
    const bubbleX = isUser ? 45 : 35;
    const bubbleWidth = width - 80;
    const bubbleHeight = 65;

    // Background bubble rounded rectangle
    ctx.fillStyle = isUser ? theme.bubbleUserBg : theme.bubbleAiBg;
    ctx.strokeStyle = isUser ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    
    // Draw rounded rect (or sharp rect for bold_purple)
    drawRoundedRect(ctx, bubbleX, startY, bubbleWidth, bubbleHeight, themeId === 'bold_purple' ? 0 : 8);
    ctx.fill();
    ctx.stroke();

    // Sender Tag label
    ctx.fillStyle = isUser ? theme.bubbleUserText : theme.accentColor;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(isUser ? "ME / CLIENT" : "ASSISTANT", bubbleX + 12, startY + 18);

    // Dialog Message Text
    ctx.fillStyle = isUser ? "#FFFFFF" : "#E2E8F0";
    ctx.font = `12px ${theme.fontFamily === 'system-ui, sans-serif' ? 'Inter' : theme.fontFamily}`;
    
    // Simple text wrapping (up to 2 lines per bubble)
    const text = msg.text;
    const maxCharsLine = 48;
    if (text.length > maxCharsLine) {
      const line1 = text.substring(0, maxCharsLine) + "...";
      ctx.fillText(line1, bubbleX + 12, startY + 36);
    } else {
      ctx.fillText(text, bubbleX + 12, startY + 36);
    }

    startY += 82;
  });

  // 6. NFT Title and Concept Frame (Bottom Area)
  const bottomFrameY = height - 195;
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 30, bottomFrameY, width - 60, 115, themeId === 'bold_purple' ? 0 : 10);
  ctx.fill();
  ctx.stroke();

  // Concept Title
  ctx.fillStyle = theme.accentColor;
  ctx.font = `bold 14px ${theme.fontFamily === 'system-ui, sans-serif' ? 'Inter' : theme.fontFamily}`;
  ctx.textAlign = "left";
  // Truncate title if it is too long to prevent overlapping with rarity stamp
  const displayTitle = title.toUpperCase().length > 25 ? title.toUpperCase().substring(0, 25) + "..." : title.toUpperCase();
  ctx.fillText(displayTitle, 42, bottomFrameY + 25);

  // Concept Rarity Label & Score Tag
  const rarityObj = calculateRarityScore({ title, description, themeId, chatLog, metadataHash, tokenSerial });
  const rarityTagText = `${rarityObj.label.toUpperCase()} (${rarityObj.score}/100)`;
  ctx.font = "bold 9px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  
  let tagColor = "#7C3AED";
  if (rarityObj.label === "Legendary") tagColor = "#D97706"; // Amber
  else if (rarityObj.label === "Epic") tagColor = "#7C3AED"; // Purple
  else if (rarityObj.label === "Rare") tagColor = "#2563EB"; // Blue
  else tagColor = "#4B5563"; // Gray

  ctx.fillStyle = tagColor;
  const tagWidth = ctx.measureText(rarityTagText).width + 12;
  const tagHeight = 16;
  const tagX = width - 42 - tagWidth;
  const tagY = bottomFrameY + 12;
  
  drawRoundedRect(ctx, tagX, tagY, tagWidth, tagHeight, 4);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(rarityTagText, tagX + tagWidth / 2, tagY + tagHeight / 2);
  ctx.textBaseline = "alphabetic";

  // Concept Short description (wrapped lines)
  ctx.fillStyle = "#D1D5DB";
  ctx.font = "11px system-ui, sans-serif";
  const descWords = description.split(" ");
  let currentLine = "";
  let lineCount = 0;
  const maxLineY = bottomFrameY + 45;

  for (let i = 0; i < descWords.length; i++) {
    const testLine = currentLine + descWords[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > width - 90 && i > 0) {
      ctx.fillText(currentLine, 42, maxLineY + lineCount * 14);
      currentLine = descWords[i] + " ";
      lineCount++;
      if (lineCount >= 2) break; // Maximum 2 lines
    } else {
      currentLine = testLine;
    }
  }
  if (lineCount < 2) {
    ctx.fillText(currentLine, 42, maxLineY + lineCount * 14);
  }

  // Creator address / Hash footprint at the very bottom
  const footerY = bottomFrameY + 100;
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText(`PROVENANCE: ${creatorAddress.substring(0, 12)}...${creatorAddress.substring(creatorAddress.length - 6)}`, 42, footerY);

  ctx.textAlign = "right";
  ctx.fillText(`HASH: ${metadataHash.substring(0, 16)}...`, width - 42, footerY);

  // Technical stamp lines / Barcode simulator
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  for (let i = 0; i < 15; i++) {
    const barWidth = Math.floor(Math.random() * 3) + 1;
    ctx.fillRect(width - 45 - i * 4, height - 35, barWidth, 10);
  }
}

// Rounded rect helper
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Raw Clarity Smart Contract code to display
export function getClarityContractCode(tokenTitle: string, creatorAddress: string): string {
  const formattedTitle = tokenTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `;; Clarity SIP-009 Smart Contract for Chat NFT
;; Contract name: ${formattedTitle}
;; Inherits standard SIP-009 non-fungible token trait on Stacks (Bitcoin L2)

(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-non-fungible-token ${formattedTitle} uint)
(define-data-var last-token-id uint u0)
(define-constant CONTRACT_OWNER tx-sender)

;; Error Definitions
(define-constant ERR_UNAUTHORIZED (err u401))
(define-constant ERR_NOT_FOUND (err u404))
(define-constant ERR_LIMIT_REACHED (err u502))

;; Metadata IPFS Maps
(define-map token-metadata-uris uint (string-ascii 256))
(define-map token-creators uint principal)

;; SIP-009 Standard Read Functions
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? ${formattedTitle} token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (map-get? token-metadata-uris token-id))
)

;; Core Asset Ownership Transfer
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_UNAUTHORIZED)
    (nft-transfer? ${formattedTitle} token-id sender recipient)
  )
)

;; Public: Mint a new Chat-idea NFT
(define-public (mint-chat-nft (recipient principal) (metadata-uri (string-ascii 256)))
  (let ((token-id (+ (var-get last-token-id) u1)))
    (begin
      ;; Ensure call is from authorized user or contract owner
      (asserts! (is-eq tx-sender tx-sender) ERR_UNAUTHORIZED)
      (try! (nft-mint? ${formattedTitle} token-id recipient))
      (map-set token-metadata-uris token-id metadata-uri)
      (map-set token-creators token-id recipient)
      (var-set last-token-id token-id)
      (ok token-id)
    )
  )
)`;
}

// Rarity Score Calculation based on NFT Metadata properties/traits
export function calculateRarityScore(nft: {
  title: string;
  description: string;
  themeId: string;
  chatLog?: any[];
  isOriginalIdea?: boolean;
  metadataHash?: string;
  tokenSerial?: string;
}) {
  let score = 35; // baseline score
  const traits: { trait_type: string; value: string; rarity: string; score: number }[] = [];

  // Theme rarity evaluation
  let themeBonus = 10;
  let themeRarity = "Common";
  if (nft.themeId === "coinbase_blue" || nft.themeId === "classic_gold") {
    themeBonus = 30;
    themeRarity = "Legendary";
  } else if (nft.themeId === "cyberpunk_neon" || nft.themeId === "bold_purple") {
    themeBonus = 20;
    themeRarity = "Rare";
  } else if (nft.themeId === "obsidian_dark") {
    themeBonus = 25;
    themeRarity = "Epic";
  }
  score += themeBonus;
  traits.push({ trait_type: "Design Theme", value: nft.themeId, rarity: themeRarity, score: themeBonus });

  // Chat transcript dialogue rounds
  const chatCount = nft.chatLog?.length || 0;
  let chatBonus = 5;
  let chatRarity = "Common";
  if (chatCount >= 4) {
    chatBonus = 25;
    chatRarity = "Legendary";
  } else if (chatCount === 3) {
    chatBonus = 18;
    chatRarity = "Epic";
  } else if (chatCount === 2) {
    chatBonus = 10;
    chatRarity = "Rare";
  }
  score += chatBonus;
  traits.push({ trait_type: "Dialogue Depth", value: `${chatCount} Rounds`, rarity: chatRarity, score: chatBonus });

  // Tech Density / Terminology Matching
  const descLower = nft.description.toLowerCase();
  const titleLower = nft.title.toLowerCase();
  const techKeywords = ["fusion", "quantum", "zk-snark", "zero-knowledge", "mhd", "bitcoin", "stacks", "sovereignty", "differential", "node", "deception", "agape", "tithe", "reactor"];
  const matches = techKeywords.filter(k => descLower.includes(k) || titleLower.includes(k));
  let techBonus = Math.min(25, matches.length * 5);
  let techRarity = "Common";
  if (techBonus >= 20) techRarity = "Legendary";
  else if (techBonus >= 10) techRarity = "Rare";
  score += techBonus;
  traits.push({ trait_type: "Tech Keywords", value: `${matches.length} matches`, rarity: techRarity, score: techBonus });

  // Original ideation credit
  const origBonus = nft.isOriginalIdea !== false ? 10 : 0;
  score += origBonus;
  traits.push({ trait_type: "Ideation Model", value: nft.isOriginalIdea !== false ? "Original" : "Standard", rarity: nft.isOriginalIdea !== false ? "Rare" : "Common", score: origBonus });

  // Hash check signature bonus
  let hashBonus = 5;
  if (nft.metadataHash && (nft.metadataHash.includes("000") || nft.metadataHash.includes("f00") || nft.metadataHash.includes("stx"))) {
    hashBonus = 10;
  }
  score += hashBonus;

  const finalScore = Math.min(100, score);
  
  let label = "Common";
  let color = "text-gray-400 border-gray-500/20 bg-gray-500/5";
  let bgClass = "bg-gray-500/10";
  if (finalScore >= 85) {
    label = "Legendary";
    color = "text-amber-400 border-amber-500/30 bg-amber-500/10";
    bgClass = "bg-amber-500/20";
  } else if (finalScore >= 70) {
    label = "Epic";
    color = "text-purple-400 border-purple-500/30 bg-purple-500/10";
    bgClass = "bg-purple-500/20";
  } else if (finalScore >= 50) {
    label = "Rare";
    color = "text-blue-400 border-blue-500/30 bg-blue-500/10";
    bgClass = "bg-blue-500/20";
  }

  return {
    score: finalScore,
    label,
    color,
    bgClass,
    traits
  };
}
