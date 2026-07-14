export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp?: string;
}

export type NFTThemeId = 'classic_gold' | 'cyberpunk_neon' | 'base44_blue' | 'emerald_gpt' | 'obsidian_dark' | 'bold_purple';

export interface NFTTheme {
  id: NFTThemeId;
  name: string;
  description: string;
  borderColor: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  bubbleUserBg: string;
  bubbleUserText: string;
  bubbleAiBg: string;
  bubbleAiText: string;
  fontFamily: string;
  glowColor: string;
}

export type MintingStep = 'draft' | 'analyzing' | 'designed' | 'minting' | 'minted' | 'posted';

export interface StacksTransaction {
  txHash: string;
  blockNumber: number;
  senderAddress: string;
  contractName: string;
  functionName: string;
  feeSTX: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
}

export interface ChatNFT {
  id: string;
  title: string;
  description: string;
  chatLog: ChatMessage[];
  creatorAddress: string;
  themeId: NFTThemeId;
  createdAt: string;
  tokenSerial: string; // e.g., STX-CHAT-0142
  metadataHash: string; // SHA-256 mock hash
  txHash?: string;
  blockNumber?: number;
  likes: number;
  upvotesList?: string[]; // user ip or cookie-like string to avoid spam
  bids?: NFTBid[];
  isOriginalIdea?: boolean;
  score?: number;
}

export interface NFTBid {
  id: string;
  bidder: string;
  amountSTX: number;
  timestamp: string;
}

export const NFT_THEMES: Record<NFTThemeId, NFTTheme> = {
  classic_gold: {
    id: 'classic_gold',
    name: 'Royal Gold',
    description: 'A classic, high-class ornamental theme with gold borders and elegant serifs.',
    borderColor: '#D4AF37',
    bgGradient: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
    textColor: '#F5F5F4',
    accentColor: '#D4AF37',
    bubbleUserBg: 'rgba(212, 175, 55, 0.25)',
    bubbleUserText: '#FDE047',
    bubbleAiBg: 'rgba(255, 255, 255, 0.08)',
    bubbleAiText: '#F5F5F4',
    fontFamily: 'Georgia, serif',
    glowColor: 'rgba(212, 175, 55, 0.4)',
  },
  cyberpunk_neon: {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon',
    description: 'High-contrast grid aesthetic styled with vibrant pinks, cyans, and neon glows.',
    borderColor: '#FF007F',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #180828 60%, #0c0114 100%)',
    textColor: '#00FFFF',
    accentColor: '#39FF14',
    bubbleUserBg: 'rgba(255, 0, 127, 0.2)',
    bubbleUserText: '#FF007F',
    bubbleAiBg: 'rgba(0, 255, 255, 0.1)',
    bubbleAiText: '#E0FFFF',
    fontFamily: '"Courier New", monospace',
    glowColor: 'rgba(255, 0, 127, 0.7)',
  },
  base44_blue: {
    id: 'base44_blue',
    name: 'Base 44 Blue',
    description: 'The signature modern Web3 styling of Base 44, with clean electric blues and whites.',
    borderColor: '#2563EB',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)',
    textColor: '#F8FAFC',
    accentColor: '#38BDF8',
    bubbleUserBg: 'rgba(37, 99, 235, 0.4)',
    bubbleUserText: '#F8FAFC',
    bubbleAiBg: 'rgba(30, 41, 59, 0.8)',
    bubbleAiText: '#E2E8F0',
    fontFamily: 'system-ui, sans-serif',
    glowColor: 'rgba(37, 99, 235, 0.5)',
  },
  emerald_gpt: {
    id: 'emerald_gpt',
    name: 'Emerald GPT',
    description: 'Modern AI-inspired deep greens, obsidian frames, and sleek technical lines.',
    borderColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)',
    textColor: '#ECFDF5',
    accentColor: '#34D399',
    bubbleUserBg: 'rgba(16, 185, 129, 0.15)',
    bubbleUserText: '#A7F3D0',
    bubbleAiBg: 'rgba(255, 255, 255, 0.05)',
    bubbleAiText: '#ECFDF5',
    fontFamily: 'system-ui, sans-serif',
    glowColor: 'rgba(16, 185, 129, 0.4)',
  },
  obsidian_dark: {
    id: 'obsidian_dark',
    name: 'Obsidian Sheen',
    description: 'Premium pitch black with rainbow-shifting metallic holographic overlays.',
    borderColor: '#E2E8F0',
    bgGradient: 'linear-gradient(135deg, #030712 0%, #111827 50%, #030712 100%)',
    textColor: '#F9FAFB',
    accentColor: '#818CF8',
    bubbleUserBg: 'rgba(129, 140, 248, 0.25)',
    bubbleUserText: '#C7D2FE',
    bubbleAiBg: 'rgba(55, 65, 81, 0.3)',
    bubbleAiText: '#F9FAFB',
    fontFamily: 'system-ui, sans-serif',
    glowColor: 'rgba(255, 255, 255, 0.25)',
  },
  bold_purple: {
    id: 'bold_purple',
    name: 'ChatMint Ultra',
    description: 'The premium high-contrast theme from ChatMint with deep purples and hot pink gradients.',
    borderColor: '#7C3AED',
    bgGradient: 'linear-gradient(135deg, #080808 0%, #121212 60%, #1e1b4b 100%)',
    textColor: '#FFFFFF',
    accentColor: '#F472B6',
    bubbleUserBg: 'rgba(124, 58, 237, 0.3)',
    bubbleUserText: '#F472B6',
    bubbleAiBg: 'rgba(255, 255, 255, 0.08)',
    bubbleAiText: '#FFFFFF',
    fontFamily: '"Outfit", sans-serif',
    glowColor: 'rgba(124, 58, 237, 0.7)',
  }
};
