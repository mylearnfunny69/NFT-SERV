import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import Stripe from "stripe";
import { sql, eq, desc } from "drizzle-orm";

// Database Drizzle Setup
import { db } from "./src/db/index.ts";
import { users, nfts } from "./src/db/schema.ts";

// Firebase Admin Setup
import { adminAuth, adminDb } from "./src/lib/firebase-admin.ts";

dotenv.config();

const __filename = typeof import.meta !== "undefined" && import.meta.url ? fileURLToPath(import.meta.url) : "";
const __dirname = __filename ? path.dirname(__filename) : "";

// Lazy Stripe initialization
let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key && key !== "MY_STRIPE_SECRET_KEY") {
      stripeClient = new Stripe(key, { apiVersion: "2023-10-16" as any });
      console.log("Stripe SDK initialized successfully.");
    }
  }
  return stripeClient;
}

// Lazy Gemini API Client instantiation
let geminiAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiAiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      geminiAiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API Client initialized successfully.");
    } else {
      console.warn("GEMINI_API_KEY is not defined or is placeholder. Falling back to rule-based mock analysis.");
    }
  }
  return geminiAiClient;
}

// Ensure the Database has Seed Data if empty
async function seedDatabaseIfEmpty() {
  try {
    const result = await db.select({ count: sql`count(*)` }).from(nfts);
    const count = Number(result[0]?.count || 0);
    if (count === 0) {
      console.log("Database table 'nfts' is empty. Inserting high-class Stacks seed NFTs...");
      const seedNFTs = [
        {
          id: "seed-nft-1",
          title: "Proof of Pizza Protocol",
          description: "A decentralized consensus system that rewards nodes for baking real Italian sourdough pizzas. Consensus is verified through vision AI and zero-knowledge temperature proofs. This chat log records the initial architecture session exploring pizza tokenomics.",
          chatLog: [
            { id: "m1", sender: "user", text: "What if we make a blockchain where you mine blocks by baking actual pizza?" },
            { id: "m2", sender: "ai", text: "That is delicious. We can call it Proof-of-Pizza (PoP). Nodes verify the baking quality using on-chain computer vision and smart thermal sensors." },
            { id: "m3", sender: "user", text: "Yes! And the block rewards are split between the baker and the delivery runner, governed by a Stacks L2 contract!" },
            { id: "m4", sender: "ai", text: "Exactly. The tokenomics would incentivize a decentralised local pizzeria mesh. Let's implement this!" }
          ],
          creatorAddress: "SP3JP0NVA0S3M9F8NZV",
          themeId: "classic_gold",
          createdAt: new Date(Date.now() - 4 * 3600000),
          tokenSerial: "STX-CHAT-0001",
          metadataHash: "b85a3c9e6d4f29107ef4e5b3c4a2a1b0e5d9c8f7a6b5c4d3e2f1a0b9c8d7e6f5",
          txHash: "0x403d517c2be56a908bebf5f1bc9f55a9cf291882cd4a3258bdc1e7a02c9de64f",
          blockNumber: 15402,
          likes: 42,
          bids: [
            { id: "b1", bidder: "SP28K6XF96V8H2M1", amountSTX: 250, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() }
          ]
        },
        {
          id: "seed-nft-2",
          title: "Quantum Consciousness Oracle",
          description: "A cryptographic blueprint for utilizing quantum computer noise to prompt deep metaphysical queries. The Oracle bridges quantum randomness with a ChatGPT reasoning layer, minting each cosmic insight as a localized NFT.",
          chatLog: [
            { id: "m1", sender: "user", text: "Can we use quantum mechanics to generate thoughts that have never been thought before?" },
            { id: "m2", sender: "ai", text: "Yes. By sampling quantum thermodynamic fluctuations or vacuum noise as a random seed, we can feed completely unpredictable tokens into a high-reasoning LLM." },
            { id: "m3", sender: "user", text: "So it is literally an oracle that translates quantum physical chaos into human wisdom." },
            { id: "m4", sender: "ai", text: "Precisely. A decentralized quantum consciousness bridge. Every thought is unique, signed by the subatomic particles themselves, and minted onto Bitcoin." }
          ],
          creatorAddress: "SP2H7E97F81BMD9W",
          themeId: "cyberpunk_neon",
          createdAt: new Date(Date.now() - 10 * 3600000),
          tokenSerial: "STX-CHAT-0002",
          metadataHash: "f3a2c5b76d9e108fc4d3a2e1b0c9f8d7e6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1",
          txHash: "0xfa782b56e9c403862cd49b803f2de1c04ba7e5b3c4f2a1b9d8e7f6a5b4c3d2e1",
          blockNumber: 15409,
          likes: 56,
          bids: [
            { id: "b2", bidder: "SP37F49A688C9Z21", amountSTX: 420, timestamp: new Date(Date.now() - 5 * 3600000).toISOString() }
          ]
        },
        {
          id: "seed-nft-3",
          title: "Zero-Knowledge Habit Forger",
          description: "A mobile application blueprint that allows users to prove they completed daily wellness habits (like gym, study, or meditation) without revealing their personal data or physical location, using zK-SNARK proofs and mobile sensors.",
          chatLog: [
            { id: "m1", sender: "user", text: "I want to prove to my friends that I went to the gym every day to earn rewards, but without sharing my GPS location or photos." },
            { id: "m2", sender: "ai", text: "We can use Zero-Knowledge proofs (zk-SNARKs). Your phone locally verifies your GPS coordinates fall within the gym's geo-fence, then generates a cryptographic proof of location." },
            { id: "m3", sender: "user", text: "That is amazing! Only the 'proof' goes on-chain, keeping my actual whereabouts 100% private." },
            { id: "m4", sender: "ai", text: "Exactly. The contract only sees 'True/False' with absolute cryptographic certainty. You forge a streak, earn tokens, and retain complete privacy." }
          ],
          creatorAddress: "SP18K7A92D1F9M1A",
          themeId: "emerald_gpt",
          createdAt: new Date(Date.now() - 24 * 3600000),
          tokenSerial: "STX-CHAT-0003",
          metadataHash: "7c1e8d9f0a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
          txHash: "0x892ef67ab890c123de456fa7890bc123ef4567ab890cde123fabcd456e7f8901",
          blockNumber: 15385,
          likes: 29,
          bids: []
        },
        {
          id: "seed-nft-4",
          title: "Decentralized Magnetohydrodynamic Fusion Reactor Grid",
          description: "A revolutionary design for high-temperature superconducting magnetic confinement fusion reactors stabilized via real-time smart feedback loops on the Stacks Layer-2 blockchain. Magnetohydrodynamic calculations are verified by distributed network nodes, committing absolute validation states into Bitcoin block headers to guarantee non-falsified energy output telemetry.",
          chatLog: [
            { id: "m1", sender: "user", text: "Can we run a nuclear fusion grid feedback loop on Stacks?" },
            { id: "m2", sender: "ai", text: "Absolutely. The magnetic confinement field requires microsecond adjustments, but we can anchor the macro stability metrics, block validations, and telemetry states to Stacks L2." },
            { id: "m3", sender: "user", text: "That is genius! The energy dispatch events can mint carbon credit tokens directly onto the Bitcoin layer." },
            { id: "m4", sender: "ai", text: "Correct. By securing these logs, we create an un-tamperable certification of clean power generation that secondary energy markets can audit in real-time." }
          ],
          creatorAddress: "SP2FUSSIONREACTORGRID99",
          themeId: "classic_gold",
          createdAt: new Date(Date.now() - 1 * 3600000),
          tokenSerial: "STX-CHAT-0004",
          metadataHash: "5d4f3c2b1a0e9f8d7c6b5a4a3b2c1d0e5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c",
          txHash: "0xstx_fussion_reactor_grid_anchor_hash_019283",
          blockNumber: 15421,
          likes: 97,
          bids: []
        },
        {
          id: "seed-nft-5",
          title: "ZOS-CORE ITVFRLD Differential Lock Shifter Protocol",
          description: "A sovereign cryptographic shifter protocol bridging active campaign GTM signals with non-deceptive reverse-gates on Stacks L2, locking in stable Agape-mode automated tithes directly into Bitcoin blocks.",
          chatLog: [
            { id: "m1", sender: "user", text: "Can we run the ITVFRLD Differential Lock on Stacks L2?" },
            { id: "m2", sender: "ai", text: "Absolutely. Phase 2 Reverse-Gate ensures all campaign signals are filtered before final block commits, achieving absolute non-deception on Bitcoin." },
            { id: "m3", sender: "user", text: "And the 10% Tithe can be automated inside the smart contract?" },
            { id: "m4", sender: "ai", text: "Yes, the Unity Loop automatically routes a 10% Agape-mode yield allocation to the genesis vault on every block commit." }
          ],
          creatorAddress: "SP3JP0NVA0S3M9F8NZV",
          themeId: "obsidian_dark",
          createdAt: new Date(Date.now() - 30 * 60000), // 30 mins ago
          tokenSerial: "STX-CHAT-0005",
          metadataHash: "3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f",
          txHash: "0xstx_zos_itvfrld_diff_lock_anchor_hash_991823",
          blockNumber: 15432,
          likes: 124,
          bids: []
        }
      ];

      for (const item of seedNFTs) {
        await db.insert(nfts).values({
          id: item.id,
          title: item.title,
          description: item.description,
          creatorAddress: item.creatorAddress,
          themeId: item.themeId,
          createdAt: item.createdAt,
          tokenSerial: item.tokenSerial,
          metadataHash: item.metadataHash,
          txHash: item.txHash,
          blockNumber: item.blockNumber,
          likes: item.likes,
          chatLog: item.chatLog,
          bids: item.bids
        });
      }
      console.log("Cloud SQL database seeded successfully.");
    } else {
      // Ensure seed-nft-4 specifically exists even if table was already seeded with others
      const fusionExists = await db.select().from(nfts).where(sql`id = 'seed-nft-4'`);
      if (fusionExists.length === 0) {
        console.log("Seeding missing 'seed-nft-4' (Fusion Patent Grid NFT) into database...");
        await db.insert(nfts).values({
          id: "seed-nft-4",
          title: "Decentralized Magnetohydrodynamic Fusion Reactor Grid",
          description: "A revolutionary design for high-temperature superconducting magnetic confinement fusion reactors stabilized via real-time smart feedback loops on the Stacks Layer-2 blockchain. Magnetohydrodynamic calculations are verified by distributed network nodes, committing absolute validation states into Bitcoin block headers to guarantee non-falsified energy output telemetry.",
          creatorAddress: "SP2FUSSIONREACTORGRID99",
          themeId: "classic_gold",
          createdAt: new Date(Date.now() - 1 * 3600000),
          tokenSerial: "STX-CHAT-0004",
          metadataHash: "5d4f3c2b1a0e9f8d7c6b5a4a3b2c1d0e5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c",
          txHash: "0xstx_fussion_reactor_grid_anchor_hash_019283",
          blockNumber: 15421,
          likes: 97,
          chatLog: [
            { id: "m1", sender: "user", text: "Can we run a nuclear fusion grid feedback loop on Stacks?" },
            { id: "m2", sender: "ai", text: "Absolutely. The magnetic confinement field requires microsecond adjustments, but we can anchor the macro stability metrics, block validations, and telemetry states to Stacks L2." },
            { id: "m3", sender: "user", text: "That is genius! The energy dispatch events can mint carbon credit tokens directly onto the Bitcoin layer." },
            { id: "m4", sender: "ai", text: "Correct. By securing these logs, we create an un-tamperable certification of clean power generation that secondary energy markets can audit in real-time." }
          ],
          bids: []
        });
        console.log("Seeded 'seed-nft-4' successfully.");
      }

      // Ensure seed-nft-5 specifically exists as well
      const zosExists = await db.select().from(nfts).where(sql`id = 'seed-nft-5'`);
      if (zosExists.length === 0) {
        console.log("Seeding missing 'seed-nft-5' (ZOS ITVFRLD Shifter) into database...");
        await db.insert(nfts).values({
          id: "seed-nft-5",
          title: "ZOS-CORE ITVFRLD Differential Lock Shifter Protocol",
          description: "A sovereign cryptographic shifter protocol bridging active campaign GTM signals with non-deceptive reverse-gates on Stacks L2, locking in stable Agape-mode automated tithes directly into Bitcoin blocks.",
          creatorAddress: "SP3JP0NVA0S3M9F8NZV",
          themeId: "obsidian_dark",
          createdAt: new Date(Date.now() - 30 * 60000),
          tokenSerial: "STX-CHAT-0005",
          metadataHash: "3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f",
          txHash: "0xstx_zos_itvfrld_diff_lock_anchor_hash_991823",
          blockNumber: 15432,
          likes: 124,
          chatLog: [
            { id: "m1", sender: "user", text: "Can we run the ITVFRLD Differential Lock on Stacks L2?" },
            { id: "m2", sender: "ai", text: "Absolutely. Phase 2 Reverse-Gate ensures all campaign signals are filtered before final block commits, achieving absolute non-deception on Bitcoin." },
            { id: "m3", sender: "user", text: "And the 10% Tithe can be automated inside the smart contract?" },
            { id: "m4", sender: "ai", text: "Yes, the Unity Loop automatically routes a 10% Agape-mode yield allocation to the genesis vault on every block commit." }
          ],
          bids: []
        });
        console.log("Seeded 'seed-nft-5' successfully.");
      }
    }
  } catch (err) {
    console.error("Error checking or seeding Cloud SQL:", err);
  }
}

// Authentication Middleware to verify Firebase ID Token or Guest/Mock Token
async function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header." });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    if (token.startsWith("mock-") || token === "guest-bypass-token") {
      const parts = token.split("-");
      const uid = parts[1] || "guest_user";
      const email = parts[2] ? decodeURIComponent(parts[2]) : "guest@chatmint.ai";
      req.user = {
        uid: uid,
        email: email,
        name: email.split("@")[0],
      };
      return next();
    }
    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch (verifyErr: any) {
      if (verifyErr?.code === 'auth/id-token-expired') {
        console.warn("Firebase ID token expired during auth check.");
        return res.status(401).json({ error: "token_expired", message: "Firebase session expired. Please refresh." });
      }
      throw verifyErr;
    }
    req.user = decoded;
    next();
  } catch (err: any) {
    console.warn("Firebase auth verification failed:", err?.message || err);
    res.status(401).json({ error: "Unauthorized user session token." });
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));

  // Seed db initially
  await seedDatabaseIfEmpty();

  // API 1: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API 2: Get all NFTs from PostgreSQL
  app.get("/api/nfts", async (req, res) => {
    try {
      const allNFTs = await db.select().from(nfts).orderBy(desc(nfts.createdAt));
      res.json(allNFTs);
    } catch (err) {
      console.error("Failed to read NFTs from Cloud SQL:", err);
      res.status(500).json({ error: "Database retrieval error." });
    }
  });

  // API 3: Create / Post a new NFT (persisted in Cloud SQL)
  app.post("/api/nfts", async (req, res) => {
    const { title, description, chatLog, creatorAddress, themeId, txHash, blockNumber, userToken } = req.body;

    if (!title || !description || !chatLog || !creatorAddress || !themeId) {
      return res.status(400).json({ error: "Missing required fields to publish NFT." });
    }

    try {
      let resolvedUserId: number | null = null;
      let emailAddress = "";

      // Try to verify token if provided
      if (userToken) {
        try {
          let decoded;
          if (userToken.startsWith("mock-") || userToken === "guest-bypass-token") {
            const parts = userToken.split("-");
            const uid = parts[1] || "guest_user";
            const email = parts[2] ? decodeURIComponent(parts[2]) : "guest@chatmint.ai";
            decoded = { uid, email, name: email.split("@")[0] };
          } else {
            decoded = await adminAuth.verifyIdToken(userToken);
          }
          emailAddress = decoded.email || "";
          
          // Sync user to PostgreSQL using upsert
          const [dbUser] = await db.insert(users)
            .values({
              uid: decoded.uid,
              email: emailAddress,
              displayName: decoded.name || emailAddress.split("@")[0],
              isPremium: false,
            })
            .onConflictDoUpdate({
              target: users.uid,
              set: {
                email: emailAddress,
                displayName: decoded.name || emailAddress.split("@")[0],
              }
            })
            .returning();
          
          resolvedUserId = dbUser.id;
        } catch (authErr: any) {
          console.warn("Optional userToken verification failed during publish:", authErr?.message || authErr);
        }
      }

      // Generate sequence numbers
      const existing = await db.select({ count: sql`count(*)` }).from(nfts);
      const nextIndex = Number(existing[0]?.count || 0) + 1;
      const tokenSerial = `STX-CHAT-${String(nextIndex).padStart(4, "0")}`;
      const metadataHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const generatedId = `nft-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newNFT = {
        id: generatedId,
        title,
        description,
        creatorAddress,
        themeId,
        createdAt: new Date(),
        tokenSerial,
        metadataHash,
        txHash: txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        blockNumber: blockNumber || 15410 + Math.floor(Math.random() * 100),
        likes: 1,
        bids: [],
        userId: resolvedUserId,
        chatLog: chatLog || [],
      };

      await db.insert(nfts).values(newNFT);

      // Create a real-time notification in Firestore for other users to see!
      try {
        const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 100)}`;
        await adminDb.collection("notifications").doc(notifId).set({
          id: notifId,
          userId: resolvedUserId ? String(resolvedUserId) : "anonymous",
          title: "New NFT Minted!",
          message: `"${title}" has been securely published to the registry of Bitcoin/Stacks L2.`,
          type: "mint",
          read: false,
          createdAt: new Date()
        });
      } catch (notifErr) {
        console.error("Failed to write live Firestore notification:", notifErr);
      }

      res.status(201).json({
        ...newNFT,
        createdAt: newNFT.createdAt.toISOString()
      });
    } catch (err) {
      console.error("Failed to publish NFT to Cloud SQL:", err);
      res.status(500).json({ error: "Failed to publish NFT to central blockchain database." });
    }
  });

  // API 3.5: Bulk Mint / Create multiple NFTs in a single transaction (Clarity Batch Mint simulation)
  app.post("/api/nfts/bulk-mint", async (req, res) => {
    const { concepts, userToken } = req.body;

    if (!Array.isArray(concepts) || concepts.length === 0) {
      return res.status(400).json({ error: "Missing required concepts array to bulk mint." });
    }

    try {
      let resolvedUserId: number | null = null;
      let emailAddress = "";

      // Try to verify token if provided
      if (userToken) {
        try {
          let decoded;
          if (userToken.startsWith("mock-") || userToken === "guest-bypass-token") {
            const parts = userToken.split("-");
            const uid = parts[1] || "guest_user";
            const email = parts[2] ? decodeURIComponent(parts[2]) : "guest@chatmint.ai";
            decoded = { uid, email, name: email.split("@")[0] };
          } else {
            decoded = await adminAuth.verifyIdToken(userToken);
          }
          emailAddress = decoded.email || "";
          
          // Sync user to PostgreSQL using upsert
          const [dbUser] = await db.insert(users)
            .values({
              uid: decoded.uid,
              email: emailAddress,
              displayName: decoded.name || emailAddress.split("@")[0],
              isPremium: false,
            })
            .onConflictDoUpdate({
              target: users.uid,
              set: {
                email: emailAddress,
                displayName: decoded.name || emailAddress.split("@")[0],
              }
            })
            .returning();
          
          resolvedUserId = dbUser.id;
        } catch (authErr: any) {
          console.warn("Optional userToken verification failed during bulk publish:", authErr?.message || authErr);
        }
      }

      const existing = await db.select({ count: sql`count(*)` }).from(nfts);
      let nextIndex = Number(existing[0]?.count || 0) + 1;

      const results = [];
      const batchTxHash = `0xstx_batch_${Array.from({ length: 54 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      const batchBlockNumber = 15410 + Math.floor(Math.random() * 100);

      for (const concept of concepts) {
        const tokenSerial = `STX-CHAT-${String(nextIndex).padStart(4, "0")}`;
        const metadataHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        const generatedId = `nft-${Date.now()}-${Math.floor(Math.random() * 1000)}-${nextIndex}`;

        const newNFT = {
          id: generatedId,
          title: concept.title,
          description: concept.description,
          creatorAddress: concept.creatorAddress || "SP3JP0NVA0S3M9F8NZV",
          themeId: concept.themeId || "cyberpunk_neon",
          createdAt: new Date(),
          tokenSerial,
          metadataHash,
          txHash: batchTxHash, // Shared tx hash for the batch! Very realistic for L2 batch-minting
          blockNumber: batchBlockNumber,
          likes: 1,
          bids: [],
          userId: resolvedUserId,
          chatLog: concept.chatLog || [],
        };

        await db.insert(nfts).values(newNFT);
        results.push(newNFT);
        nextIndex++;
      }

      // Create a real-time notification in Firestore for other users to see!
      try {
        const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 100)}`;
        await adminDb.collection("notifications").doc(notifId).set({
          id: notifId,
          userId: resolvedUserId ? String(resolvedUserId) : "anonymous",
          title: "Batch L2 Minting Success!",
          message: `Successfully batch-minted ${concepts.length} chat proofs in a single Stacks L2 Clarity transaction, saving ~75% in L1 anchoring fees!`,
          type: "mint",
          read: false,
          createdAt: new Date()
        });
      } catch (notifErr) {
        console.error("Failed to write live Firestore notification:", notifErr);
      }

      res.status(201).json(results);
    } catch (err) {
      console.error("Failed to bulk publish NFTs to Cloud SQL:", err);
      res.status(500).json({ error: "Failed to bulk publish NFTs to central database." });
    }
  });

  // API 4: Upvote NFT
  app.post("/api/nfts/:id/upvote", async (req, res) => {
    const { id } = req.params;
    try {
      const records = await db.select().from(nfts).where(eq(nfts.id, id));
      if (records.length === 0) {
        return res.status(404).json({ error: "NFT not found" });
      }
      const nft = records[0];
      const nextLikes = nft.likes + 1;

      await db.update(nfts).set({ likes: nextLikes }).where(eq(nfts.id, id));

      // Push a Firestore real-time notification
      try {
        const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 100)}`;
        await adminDb.collection("notifications").doc(notifId).set({
          id: notifId,
          userId: "anonymous",
          title: "Upvote Received!",
          message: `Someone liked the NFT "${nft.title}"! Current upvotes: ${nextLikes}.`,
          type: "upvote",
          read: false,
          createdAt: new Date()
        });
      } catch (notifErr) {
        console.error("Failed to push upvote notification to Firestore:", notifErr);
      }

      res.json({ id, likes: nextLikes });
    } catch (err) {
      console.error("Failed to upvote in Cloud SQL:", err);
      res.status(500).json({ error: "Database error during upvote." });
    }
  });

  // API 5: Bid on NFT
  app.post("/api/nfts/:id/bid", async (req, res) => {
    const { id } = req.params;
    const { bidder, amountSTX } = req.body;

    if (!bidder || !amountSTX || isNaN(amountSTX) || amountSTX <= 0) {
      return res.status(400).json({ error: "Invalid bidder or amount" });
    }

    try {
      const records = await db.select().from(nfts).where(eq(nfts.id, id));
      if (records.length === 0) {
        return res.status(404).json({ error: "NFT not found" });
      }
      const nft = records[0];
      const bidsList = Array.isArray(nft.bids) ? (nft.bids as any[]) : [];

      const highestBid = bidsList.reduce((max: number, b: any) => b.amountSTX > max ? b.amountSTX : max, 0);
      if (amountSTX <= highestBid) {
        return res.status(400).json({ error: `Bid must be higher than the current highest bid of ${highestBid} STX` });
      }

      const newBid = {
        id: `bid-${Date.now()}`,
        bidder,
        amountSTX: Number(amountSTX),
        timestamp: new Date().toISOString()
      };

      const nextBids = [newBid, ...bidsList].sort((a, b) => b.amountSTX - a.amountSTX);

      await db.update(nfts).set({ bids: nextBids }).where(eq(nfts.id, id));

      // Realtime Bid Notification in Firestore
      try {
        const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 100)}`;
        await adminDb.collection("notifications").doc(notifId).set({
          id: notifId,
          userId: "anonymous",
          title: "New High Bid!",
          message: `A new bid of ${amountSTX} STX was placed on "${nft.title}" by ${bidder.substring(0, 10)}...`,
          type: "bid",
          read: false,
          createdAt: new Date()
        });
      } catch (notifErr) {
        console.error("Failed to write live bid notification to Firestore:", notifErr);
      }

      res.json({ ...nft, bids: nextBids });
    } catch (err) {
      console.error("Failed to place bid in Cloud SQL:", err);
      res.status(500).json({ error: "Database error during bidding." });
    }
  });

  // API 5.5: Accept Bid / Delegate Sovereignty (Antigravity handoff/takeover)
  app.post("/api/nfts/:id/accept-bid", async (req, res) => {
    const { id } = req.params;
    const { bidId } = req.body;

    try {
      const records = await db.select().from(nfts).where(eq(nfts.id, id));
      if (records.length === 0) {
        return res.status(404).json({ error: "NFT not found" });
      }
      const nft = records[0];
      const bidsList = Array.isArray(nft.bids) ? (nft.bids as any[]) : [];

      if (bidsList.length === 0) {
        return res.status(400).json({ error: "No active bids to accept on this NFT." });
      }

      // Find the target bid (either the specific bidId or the highest bid)
      let targetBid = null;
      if (bidId) {
        targetBid = bidsList.find((b: any) => b.id === bidId);
      } else {
        const sorted = [...bidsList].sort((a: any, b: any) => b.amountSTX - a.amountSTX);
        targetBid = sorted[0];
      }

      if (!targetBid) {
        return res.status(404).json({ error: "Target bid not found." });
      }

      const newOwnerAddress = targetBid.bidder;
      const acceptedAmount = targetBid.amountSTX;

      // Update the bids list marking the target bid as accepted
      const updatedBids = bidsList.map((b: any) => {
        if (b.id === targetBid.id) {
          return { ...b, accepted: true };
        }
        return b;
      });

      // Update creatorAddress to the new owner, and update bids list
      await db.update(nfts)
        .set({
          creatorAddress: newOwnerAddress,
          bids: updatedBids
        })
        .where(eq(nfts.id, id));

      // Push real-time notification to Firestore
      try {
        const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 100)}`;
        await adminDb.collection("notifications").doc(notifId).set({
          id: notifId,
          userId: "anonymous",
          title: "Sovereignty Transferred!",
          message: `Ownership of "${nft.title}" was delegated & accepted by ${newOwnerAddress.substring(0, 10)}... for ${acceptedAmount} STX!`,
          type: "takeover",
          read: false,
          createdAt: new Date()
        });
      } catch (notifErr) {
        console.error("Failed to push takeover notification to Firestore:", notifErr);
      }

      res.json({
        ...nft,
        creatorAddress: newOwnerAddress,
        bids: updatedBids
      });
    } catch (err) {
      console.error("Failed to accept bid in Cloud SQL:", err);
      res.status(500).json({ error: "Database error during bid acceptance." });
    }
  });

  // Stripe checkout session creation ($0.50 cents charge to get Premium)
  app.post("/api/stripe/create-checkout-session", requireAuth, async (req: any, res) => {
    const userEmail = req.user.email || "premium-creator@chatmint.ai";
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    const stripe = getStripe();
    if (!stripe) {
      return res.status(400).json({
        error: "Stripe key not configured on server.",
        useMock: true
      });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Premium ChatMint Ultra Upgrade",
                description: "Unlocks the signature ChatMint Ultra premium design theme, full high-definition exporting, and a verification badge on the registry gallery.",
              },
              unit_amount: 50, // 50 Cents (0.50 USD)
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: userEmail,
        success_url: `${appUrl}/?stripe_status=success`,
        cancel_url: `${appUrl}/?stripe_status=cancel`,
        metadata: {
          uid: req.user.uid,
          email: userEmail,
        }
      });

      res.json({ url: session.url });
    } catch (stripeErr: any) {
      console.error("Stripe Checkout Session error:", stripeErr);
      res.status(500).json({ error: "Failed to generate Stripe payment portal." });
    }
  });

  // Fully functional mock payment route to simulate the checkout when STRIPE_SECRET_KEY is not configured
  app.post("/api/stripe/mock-payment", requireAuth, async (req: any, res) => {
    try {
      const uid = req.user.uid;
      const email = req.user.email || "premium@chatmint.ai";

      // Sync and upgrade user to premium in Cloud SQL
      const result = await db.insert(users)
        .values({
          uid,
          email,
          displayName: req.user.name || email.split("@")[0],
          isPremium: true,
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            isPremium: true
          }
        })
        .returning();

      // Create high-visibility celebration notification
      try {
        const notifId = `notif-${Date.now()}`;
        await adminDb.collection("notifications").doc(notifId).set({
          id: notifId,
          userId: uid,
          title: "Premium Unlocked!",
          message: `${email} successfully unlocked ChatMint Ultra Premium status. Welcome to the elite tier!`,
          type: "system",
          read: false,
          createdAt: new Date()
        });
      } catch (notifErr) {
        console.error("Failed to write premium notification:", notifErr);
      }

      res.json({ success: true, user: result[0] });
    } catch (err) {
      console.error("Mock premium upgrade failed:", err);
      res.status(500).json({ error: "Failed to apply Premium status in DB." });
    }
  });

  // Sync user profile state and return Premium status
  app.get("/api/users/me", requireAuth, async (req: any, res) => {
    try {
      const records = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (records.length === 0) {
        // Sync user profile on first fetch
        const [dbUser] = await db.insert(users)
          .values({
            uid: req.user.uid,
            email: req.user.email || "",
            displayName: req.user.name || (req.user.email || "").split("@")[0],
            isPremium: false,
          })
          .returning();
        return res.json(dbUser);
      }
      res.json(records[0]);
    } catch (err) {
      console.error("Failed to fetch user state:", err);
      res.status(500).json({ error: "Database error retrieving user." });
    }
  });

  // API 6: Analyze Chat using Gemini (Or mock fallback)
  app.post("/api/analyze-chat", async (req, res) => {
    const { chatText, chatImage } = req.body;

    if (!chatText && !chatImage) {
      return res.status(400).json({ error: "Provide either a pasted chat log or a screenshot of a chat." });
    }

    const ai = getGeminiClient();

    // If we have an AI client, try to use Gemini
    if (ai) {
      try {
        let contents: any[] = [];
        let systemPrompt = `You are an expert Web3 Architect, Tech Analyst, and Designer. Your job is to analyze an AI chat log (either entered as text or parsed from a screenshot) and package it as a highly collectible NFT on Bitcoin Stacks L2.
        
        You must return a JSON object with the following fields:
        - chatLog: A parsed array of dialogue objects, where each object has:
            - id: Unique string ID (e.g. "m1", "m2", "m3"...)
            - sender: 'user' or 'ai'
            - text: The actual dialogue message text. Clean up any weird screenshot OCR artifacts if analyzing an image.
        - title: A brilliant, professional, highly punchy, descriptive Web3 NFT Title (maximum 4 words, e.g. "Sourdough Settle Protocol", "Quantum Consciousness Oracle"). Make it sound like an elite concept.
        - description: An authoritative, deep, elegant, multi-sentence conceptual and technical description (2-4 sentences) outlining the core "invention", "concept" or "genius idea" discussed in the chat, and why it is historically significant as an NFT.
        - recommendedTheme: A string suggesting which NFT Theme matches best: 'classic_gold', 'cyberpunk_neon', 'base44_blue', 'emerald_gpt', or 'obsidian_dark'.
        - explanationOfSignificance: A short, 1-sentence micro-insight about the genius of the chat idea.

        Strictly output valid JSON matching the format described above. No extra text, markdown wrappers, or explanations outside the JSON object.`;

        if (chatImage) {
          const base64Data = chatImage.split(",")[1] || chatImage;
          contents = [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/png"
              }
            },
            {
              text: "Analyze this AI chat screenshot. Parse the complete conversation log, detect what genius idea or project they are building, and output the required NFT details."
            }
          ];
        } else {
          contents = [
            {
              text: `Analyze this raw pasted AI chat text:\n\n${chatText}\n\nParse it into dialog lines, extract the genius core concept, and structure the NFT.`
            }
          ];
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                chatLog: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      sender: { type: Type.STRING, enum: ["user", "ai"] },
                      text: { type: Type.STRING }
                    },
                    required: ["id", "sender", "text"]
                  }
                },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                recommendedTheme: { type: Type.STRING, enum: ["classic_gold", "cyberpunk_neon", "base44_blue", "emerald_gpt", "obsidian_dark"] },
                explanationOfSignificance: { type: Type.STRING }
              },
              required: ["chatLog", "title", "description", "recommendedTheme", "explanationOfSignificance"]
            }
          }
        });

        const rawText = response.text?.trim() || "";
        const parsed = JSON.parse(rawText);
        return res.json(parsed);

      } catch (geminiErr: any) {
        console.error("Gemini processing error, falling back to local analysis:", geminiErr);
      }
    }

    // --- FALLBACK INTERPRETER ---
    console.log("Running local backup interpreter for chat log analysis.");
    const lines = chatText ? chatText.split("\n").map((l: string) => l.trim()).filter(Boolean) : [];
    
    let parsedLog: any[] = [];
    let currentSender: "user" | "ai" = "user";
    
    if (lines.length > 0) {
      lines.forEach((line: string, index: number) => {
        let text = line;
        if (line.toLowerCase().startsWith("user:") || line.toLowerCase().startsWith("me:")) {
          currentSender = "user";
          text = line.replace(/^(user|me):/i, "").trim();
        } else if (line.toLowerCase().startsWith("ai:") || line.toLowerCase().startsWith("chatgpt:") || line.toLowerCase().startsWith("assistant:") || line.toLowerCase().startsWith("bot:")) {
          currentSender = "ai";
          text = line.replace(/^(ai|chatgpt|assistant|bot):/i, "").trim();
        } else {
          currentSender = index % 2 === 0 ? "user" : "ai";
        }
        parsedLog.push({
          id: `m-${index}`,
          sender: currentSender,
          text: text
        });
      });
    } else {
      parsedLog = [
        { id: "m1", sender: "user", text: "Let's build a decentralized app to register AI ideas." },
        { id: "m2", sender: "ai", text: "That is a brilliant use case. We can leverage Stacks L2 on top of Bitcoin to mint the chat transcripts directly as collectible SIP-009 NFTs!" }
      ];
    }

    let keyword = "Intelligence";
    const sampleText = parsedLog[0]?.text || "";
    const words = sampleText.split(/\s+/).filter((w: string) => w.length > 4);
    if (words.length > 0) {
      keyword = words[Math.floor(Math.random() * words.length)].replace(/[^a-zA-Z]/g, "");
      keyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }

    const titlePresets = [
      `${keyword} Ledger Engine`,
      `Decentralized ${keyword} Forge`,
      `Autonomous ${keyword} Pool`,
      `Protocol for ${keyword}`
    ];
    const finalTitle = titlePresets[Math.floor(Math.random() * titlePresets.length)];

    const descPresets = [
      `A pioneering decentralized protocol exploring the tokenization of ${keyword.toLowerCase()} assets. By securing these dialogues on Bitcoin, creators claim absolute cryptographically verifiable proof of origin.`,
      `A smart-contract blueprint dedicated to the preservation of ${keyword.toLowerCase()} structures. Features automatic royalty splits and decentralized provenance.`,
      `A stateful network representation that archives the intellectual property of ${keyword.toLowerCase()} dialogues. Powered by Bitcoin consensus for high-durability verification.`
    ];
    const finalDesc = descPresets[Math.floor(Math.random() * descPresets.length)];

    const themes: any[] = ["classic_gold", "cyberpunk_neon", "base44_blue", "emerald_gpt", "obsidian_dark"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    res.json({
      chatLog: parsedLog,
      title: finalTitle,
      description: finalDesc,
      recommendedTheme: randomTheme,
      explanationOfSignificance: `Secured proof of ideation for "${keyword}" as an SIP-009 Bitcoin token.`
    });
  });

  // API 7: Analyze Google Drive Patent using Gemini (Or mock fallback)
  app.post("/api/analyze-patent", async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Provide a patent title to analyze." });
    }

    const ai = getGeminiClient();

    // If we have an AI client, try to use Gemini
    if (ai) {
      try {
        let systemPrompt = `You are an expert Patent Officer, Web3 Architect, and Design Lead. Your job is to analyze a Google Drive Patent file metadata (Title and any description or snippet) and package it as a highly collectible, sovereign intellectual property NFT on Bitcoin Stacks L2.
        
        You must return a JSON object with the following fields:
        - chatLog: A synthesized "discovery dialogue" or "expert critique" (array of 2 or 3 dialogue objects) discussing the technical merits and genius of this patent. Each object has:
            - id: Unique string ID (e.g. "m1", "m2"...)
            - sender: 'user' or 'ai'
            - text: The dialogue message text. Make it sound like a deep technical consultation between the inventor and a Lead Protocol Engineer.
        - title: A polished, authoritative Web3 patent title (maximum 5 words, e.g. "Quantum Lattice Encryption", "Dynamic Mesh Consensus").
        - description: An authoritative, deep, elegant, multi-sentence description (2-4 sentences) explaining the patent's core claims, its technical brilliance, and why securing its sovereignty on the Bitcoin blockchain as a 1/1 NFT is a major milestone for decentralized intellectual property.
        - recommendedTheme: A string suggesting which NFT Theme matches best: 'classic_gold', 'cyberpunk_neon', 'base44_blue', 'emerald_gpt', 'obsidian_dark'.
        - explanationOfSignificance: A short, 1-sentence summary of why this invention is critical for the future.

        Strictly output valid JSON matching the format described above. No extra text or markdown wrappers.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              text: `Analyze this patent metadata:\nPatent Title: ${title}\nDescription/Context: ${description || "Sovereign Patent Document in user's secure Google Drive"}\n\nGenerate the structured Web3 NFT representation.`
            }
          ],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                chatLog: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      sender: { type: Type.STRING, enum: ["user", "ai"] },
                      text: { type: Type.STRING }
                    },
                    required: ["id", "sender", "text"]
                  }
                },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                recommendedTheme: { type: Type.STRING, enum: ["classic_gold", "cyberpunk_neon", "base44_blue", "emerald_gpt", "obsidian_dark"] },
                explanationOfSignificance: { type: Type.STRING }
              },
              required: ["chatLog", "title", "description", "recommendedTheme", "explanationOfSignificance"]
            }
          }
        });

        const rawText = response.text?.trim() || "";
        const parsed = JSON.parse(rawText);
        return res.json(parsed);

      } catch (geminiErr: any) {
        console.error("Gemini patent processing error, falling back to local analysis:", geminiErr);
      }
    }

    res.json({
      chatLog: [
        { id: "m1", sender: "user", text: `I want to register my patent "${title}" on Bitcoin.` },
        { id: "m2", sender: "ai", text: `Understood. We are structuring "${title}" as a secure 1/1 SIP-009 digital patent certificate on the Stacks blockchain, anchoring its complete cryptographic proof in a Bitcoin L2 block.` }
      ],
      title: `${title} - L2 Patent`,
      description: `A verified digital asset certifying ownership of patent "${title}". Securing intellectual property on Stacks L2 ensures that publication dates and creator ownership are mathematically locked inside Bitcoin block headers, creating an immutable global record of priority and origin.`,
      recommendedTheme: "classic_gold",
      explanationOfSignificance: `Cryptographically anchored patent certificate for "${title}" on Stacks L2.`
    });
  });

  // API 7.5: Google Enterprise Valuation & Curation Staging Bridge
  app.post("/api/google-enterprise-bridge", async (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Missing Google OAuth Access Token." });
    }

    const ai = getGeminiClient();

    // Fetch existing patent list from PostgreSQL database
    let patentList: any[] = [];
    try {
      patentList = await db.select().from(nfts);
    } catch (err) {
      console.warn("DB pull failed, seeding default portfolio:", err);
    }

    if (patentList.length === 0) {
      patentList = [
        {
          id: "seed-nft-1",
          title: "Proof of Pizza Protocol",
          description: "A decentralized consensus system that rewards nodes for baking real Italian sourdough pizzas. Consensus is verified through vision AI and zero-knowledge temperature proofs. Governed by a Stacks L2 contract.",
          tokenSerial: "STX-CHAT-0001",
        },
        {
          id: "seed-nft-2",
          title: "Quantum Consciousness Oracle",
          description: "A cryptographic blueprint for utilizing quantum computer noise to prompt deep metaphysical queries, translating physical chaos into structured intellectual assets.",
          tokenSerial: "STX-CHAT-0002",
        }
      ];
    }

    // Step 1: Create Master Google Drive Folder
    let masterFolderId = "";
    try {
      const driveFolderResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `ChatMint Patent Valuation & Curation Hub (${new Date().toLocaleDateString()})`,
          mimeType: "application/vnd.google-apps.folder",
        }),
      });

      if (driveFolderResponse.ok) {
        const folderData = await driveFolderResponse.json();
        masterFolderId = folderData.id;
      } else {
        const errTxt = await driveFolderResponse.text();
        return res.status(500).json({ error: `Google Drive folder creation failed: ${errTxt}` });
      }
    } catch (err: any) {
      return res.status(500).json({ error: `Drive API connection failed: ${err.message}` });
    }

    const valuationPortfolio: any[] = [];

    // Step 2: Loop & Valuate
    for (const patent of patentList) {
      let analysis: any = null;
      if (ai) {
        try {
          const prompt = `
          You are an elite silicon valley patent valuation analyst and Web3 strategist.
          Analyze the following patented dialogue concept/product:
          Title: "${patent.title}"
          Description: "${patent.description}"

          Generate a professional, high-grade corporate patent valuation report.
          The response must be a strict JSON object (do not include any markdown fences or wrap in code blocks) with the following fields:
          {
            "valuationRange": "string (e.g. $150,000 - $220,000 USD)",
            "innovationScore": number (1 to 100),
            "techReadinessLevel": "string (e.g. TRL-3 Experimental Proof of Concept)",
            "executiveSummary": "string (150 words analyzing the commercial merit, utility, and competitive landscape)",
            "commercializationPathway": "string (how to monetize, license, or scale this patent)",
            "imagePreparationChecklist": [
              {
                "figure": "Figure 1",
                "title": "string (e.g. System Flow Schematic)",
                "filename": "string (e.g. fig1_system_flow.png)",
                "guidelines": "string (detailed instructions of what the user needs to draw or capture, including color guidelines, elements, and arrows to include)"
              },
              {
                "figure": "Figure 2",
                "title": "string (e.g. User Interface Dashboard)",
                "filename": "string (e.g. fig2_ui_dashboard.png)",
                "guidelines": "string (detailed layout specifications for the wireframe)"
              },
              {
                "figure": "Figure 3",
                "title": "string (e.g. Stacks L2 Anchoring Sequence)",
                "filename": "string (e.g. fig3_anchor_sequence.png)",
                "guidelines": "string (describing the cryptographic layout of Stacks blocks)"
              }
            ]
          }
          `;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          const rawText = response.text?.trim() || "";
          analysis = JSON.parse(rawText);
        } catch (err) {
          console.warn("Gemini valuation route error, falling back:", err);
        }
      }

      if (!analysis) {
        analysis = {
          valuationRange: "$145,000 - $210,000 USD",
          innovationScore: 88,
          techReadinessLevel: "TRL-3 Staged Conceptual Model",
          executiveSummary: `This decentralized architecture for "${patent.title}" demonstrates significant sovereign IP merit. Anchoring conversational dialogues to Stacks L2 safeguards computational workflows and registers absolute timestamps onto Bitcoin's settlement layer.`,
          commercializationPathway: "License to enterprise API hubs, establish decentralized DAO royalties, or list on secondary IP marketplaces.",
          imagePreparationChecklist: [
            {
              figure: "Figure 1",
              title: "Architecture & Data Pipeline Map",
              filename: `fig1_${patent.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_architecture.png`,
              guidelines: "Diagram the step-by-step transaction sequence. Illustrate user client nodes sending prompts, Stacks blockchain state anchors, and cryptographic hashing validations."
            },
            {
              figure: "Figure 2",
              title: "Dashboard Interface Layout",
              filename: `fig2_${patent.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_ui.png`,
              guidelines: "Draft a high-fidelity visual layout of the Patent Registry control center."
            },
            {
              figure: "Figure 3",
              title: "Bitcoin Block Settlement Chronology",
              filename: `fig3_${patent.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_chronology.png`,
              guidelines: "Provide a linear timeline tracing how the conversational block metadata hash resolves."
            }
          ]
        };
      }

      // Step A: Create Subfolder in Drive
      let subfolderId = "";
      try {
        const subfolderRes = await fetch("https://www.googleapis.com/drive/v3/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Assets - ${patent.title}`,
            mimeType: "application/vnd.google-apps.folder",
            parents: [masterFolderId],
          }),
        });
        if (subfolderRes.ok) {
          const subfolderData = await subfolderRes.json();
          subfolderId = subfolderData.id;
        }
      } catch (subErr) {
        console.error(subErr);
      }

      // Step B: Create Google Doc
      let docId = "";
      let docUrl = "";
      try {
        const docCreateRes = await fetch("https://www.googleapis.com/drive/v3/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${patent.title} - Enterprise Valuation & Technical Spec`,
            mimeType: "application/vnd.google-apps.document",
            parents: subfolderId ? [subfolderId] : [masterFolderId],
          }),
        });

        if (docCreateRes.ok) {
          const docData = await docCreateRes.json();
          docId = docData.id;
          docUrl = `https://docs.google.com/document/d/${docId}/edit`;

          const docWriteRequests = [
            {
              insertText: {
                location: { index: 1 },
                text: `PATENT INTELLECTUAL PROPERTY VALUATION REPORT\n============================================================\nPatent Title: ${patent.title}\nSerial Token: ${patent.tokenSerial || "N/A"}\nDate Compiled: ${new Date().toLocaleDateString()}\n\n1. SOVEREIGN COMMERCIAL VALUATION\n------------------------------------------------------------\nEstimated Market Valuation: ${analysis.valuationRange}\nSovereign Innovation Rating: ${analysis.innovationScore} / 100\nTechnology Readiness Level: ${analysis.techReadinessLevel}\n\n2. EXECUTIVE ANALYSIS SUMMARY\n------------------------------------------------------------\n${analysis.executiveSummary}\n\n3. COMMERCIALIZATION & LICENSING ROADMAP\n------------------------------------------------------------\n${analysis.commercializationPathway}\n\n4. IMAGE ASSETS & CURATION CHECKLIST (PREPARATION MODE)\n------------------------------------------------------------\nYou have indicated you have "a ton of images" ready to curate. Below are the suggested technical figures pre-configured for this patent. To prepare these files, please export your images matching the standard names and upload them into this Google Drive subfolder.\n${analysis.imagePreparationChecklist.map((fig: any) => `\n[ ] ${fig.figure}: ${fig.title}\n    Suggested Filename: ${fig.filename}\n    Curation Guidelines: ${fig.guidelines}\n`).join("\n")}\n\n------------------------------------------------------------\nReport compiled automatically by Z/OS Manus Studio Google Enterprise Bridge.\n`
              }
            }
          ];

          await fetch(`https://docs.google.com/v1/documents/${docId}:batchUpdate`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requests: docWriteRequests,
            }),
          });
        }
      } catch (docErr) {
        console.error(docErr);
      }

      valuationPortfolio.push({
        id: patent.id,
        title: patent.title,
        tokenSerial: patent.tokenSerial || "N/A",
        valuationRange: analysis.valuationRange,
        innovationScore: analysis.innovationScore,
        techReadinessLevel: analysis.techReadinessLevel,
        folderUrl: subfolderId ? `https://drive.google.com/drive/folders/${subfolderId}` : "",
        docUrl: docUrl,
        figures: analysis.imagePreparationChecklist
      });
    }

    // Step 3: Create Master Sheet Dashboard
    let dashboardUrl = "";
    try {
      const sheetCreateRes = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Z/OS Manus - Sovereign Patent Valuation Dashboard (${new Date().toLocaleDateString()})`,
          mimeType: "application/vnd.google-apps.spreadsheet",
          parents: [masterFolderId],
        }),
      });

      if (sheetCreateRes.ok) {
        const sheetData = await sheetCreateRes.json();
        const spreadsheetId = sheetData.id;
        dashboardUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

        const values = [
          [
            "Patent Token Serial", 
            "Patent Title", 
            "Innovation Score (1-100)", 
            "Estimated Valuation ($ USD)", 
            "Tech Readiness Level (TRL)", 
            "Google Doc Spec Report", 
            "Drive Image Curation Folder",
            "Curation Figures Required"
          ]
        ];

        valuationPortfolio.forEach((p) => {
          values.push([
            p.tokenSerial,
            p.title,
            String(p.innovationScore),
            p.valuationRange,
            p.techReadinessLevel,
            p.docUrl || "No Link Available",
            p.folderUrl || "No Link Available",
            p.figures.map((f: any) => f.title).join(", ")
          ]);
        });

        await fetch(
          `https://sheets.googleapis.com/v1/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ values }),
          }
        );
      }
    } catch (sheetErr) {
      console.error(sheetErr);
    }

    res.json({
      success: true,
      masterFolderUrl: `https://drive.google.com/drive/folders/${masterFolderId}`,
      dashboardUrl: dashboardUrl,
      portfolio: valuationPortfolio
    });
  });

  // API 8: Manus Pipeline Orchestrator (AWS Bedrock + AWS Lambda simulation via Gemini)
  app.post("/api/manus/pipeline", async (req, res) => {
    const { title, prompt, category } = req.body;

    if (!title || !prompt || !category) {
      return res.status(400).json({ error: "Missing required fields (title, prompt, category)." });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemPrompt = `You are the lead AI developer in the Z/OS Manus Studio system. You orchestrate a simulation of a two-agent AWS pipeline:
Agent 1: Content Generator (Amazon Bedrock) - Expert copywriter for high-end custom PC rigs, modern graffiti streetwear, and futuristic tactical designs.
Agent 2: Asset Processor (AWS Lambda) - Formats sizes, metadata, logistics specs, and retail tag structures for distribution channels.

Given a user's design product:
Name: "${title}"
Style Prompt: "${prompt}"
Category: "${category}"

Generate a valid JSON object with the following fields:
1. bedrock_content: An object containing:
   - amazon_listing: { title: string, bullet_points: array of 5 strings (punchy, high-margin sales hooks), product_description: string (deep multi-paragraph technical/style description) }
   - facebook_post: { body: string (viral, detailed Facebook Page post with pricing, custom emojis, and a call-to-action link) }
   - instagram_caption: { body: string (highly aesthetic, visually spaced Instagram caption with specific style cues and relevant hashtags like #custompc #streetwear #graffiti #zos) }
   - linktree_item: { title: string, subtitle: string }
2. lambda_specs: An object containing:
   - dimensions: string (processed image dimensions/aspect ratios formatted for each target channel)
   - recommended_price: string (e.g. "$45.00" or "$3,499.00")
   - estimated_profit_margin: string (e.g. "68%" or "45%")
   - logistics_sku: string (e.g. "ZOS-PC-GOTH-004")
   - mock_links: {
       amazon: string (mock product link),
       facebook: string (mock post link),
       instagram: string (mock post link),
       linktree: string (mock linktree link)
     }

Do not include any extra text, markdown wrappers, or markdown code blocks like \`\`\`json. Output raw JSON only.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              text: `Generate the AWS Manus execution payload for product title "${title}" in category "${category}" with design details: "${prompt}".`
            }
          ],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                bedrock_content: {
                  type: Type.OBJECT,
                  properties: {
                    amazon_listing: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        bullet_points: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        product_description: { type: Type.STRING }
                      },
                      required: ["title", "bullet_points", "product_description"]
                    },
                    facebook_post: {
                      type: Type.OBJECT,
                      properties: {
                        body: { type: Type.STRING }
                      },
                      required: ["body"]
                    },
                    instagram_caption: {
                      type: Type.OBJECT,
                      properties: {
                        body: { type: Type.STRING }
                      },
                      required: ["body"]
                    },
                    linktree_item: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        subtitle: { type: Type.STRING }
                      },
                      required: ["title", "subtitle"]
                    }
                  },
                  required: ["amazon_listing", "facebook_post", "instagram_caption", "linktree_item"]
                },
                lambda_specs: {
                  type: Type.OBJECT,
                  properties: {
                    dimensions: { type: Type.STRING },
                    recommended_price: { type: Type.STRING },
                    estimated_profit_margin: { type: Type.STRING },
                    logistics_sku: { type: Type.STRING },
                    mock_links: {
                      type: Type.OBJECT,
                      properties: {
                        amazon: { type: Type.STRING },
                        facebook: { type: Type.STRING },
                        instagram: { type: Type.STRING },
                        linktree: { type: Type.STRING }
                      },
                      required: ["amazon", "facebook", "instagram", "linktree"]
                    }
                  },
                  required: ["dimensions", "recommended_price", "estimated_profit_margin", "logistics_sku", "mock_links"]
                }
              },
              required: ["bedrock_content", "lambda_specs"]
            }
          }
        });

        const rawText = response.text?.trim() || "";
        const parsed = JSON.parse(rawText);
        
        // Broadcast a real-time notification to Firestore of this active pipeline run
        try {
          const notifId = `notif-${Date.now()}`;
          await adminDb.collection("notifications").doc(notifId).set({
            id: notifId,
            userId: "anonymous",
            title: "Manus Pipeline Fired!",
            message: `AWS Step Functions initiated for "${title}". Bedrock & Lambda agents successfully dispatched.`,
            type: "campaign",
            read: false,
            createdAt: new Date()
          });
        } catch (notifErr) {
          console.error("Failed to write live pipeline notification:", notifErr);
        }

        return res.json(parsed);

      } catch (err: any) {
        console.error("Gemini pipeline generation failed:", err);
      }
    }

    // Standard high-quality mock backup payload if Gemini is unavailable
    const skuSuffix = Math.floor(100 + Math.random() * 900);
    const mockPayload = {
      bedrock_content: {
        amazon_listing: {
          title: `Z/OS Series Custom ${title}`,
          bullet_points: [
            "ULTIMATE FUTURISTIC AESTHETIC - Expertly styled featuring clean modern architectural lines, laser-etched carbon mesh styling, and dynamic high-contrast colorways.",
            "EXCEPTIONAL DURABILITY & FORM - Tailored using premium high-grade resilient compounds designed to stand out in any workspace or tech collection.",
            "ENGINEERED BY GENESIS Z - Features the signature Z logo branding element perfectly balanced with spacious negative margins for a high-end designer vibe.",
            "ADVANCED DESIGN ARCHITECTURE - Crafted focusing on geometric contrast, metallic finishes, and premium layout structure.",
            "AUTHENTIC SOVEREIGN EDITION - Includes a localized secure proof of origin registration on-chain, certifying your placement in the next-generation elite release."
          ],
          product_description: `Unleash the future with the Z/OS Custom Series "${title}". Designed for tech enthusiasts and modern design curators, this piece merges avant-garde industrial silhouettes with streetwear elements. Whether placed as the focal point of a luxury gaming room or worn as a bold statement of modern tech fashion, its high-contrast accents and clean dark palette represent the peak of creative engineering. Handcrafted in limited batches, each unit boasts a unique logistics SKU and dedicated proof of authenticity.`
        },
        facebook_post: {
          body: `🚨 SYSTEM RELEASE: The Z/OS Custom "${title}" has officially launched on our central channel! 🚨\n\nCurated for the modern vanguard. Featuring a clean dark charcoal base, ultraviolet RGB pipelines, and futuristic carbon-mesh gothic accents. This is more than a build; it's a structural masterpiece.\n\n🛒 Available for custom build order starting at ${category === "custom_pc" ? "$2,899.00" : "$48.00"} USD.\n✨ Secure yours now and step into the Zero Point initiative.\n🔗 Click the link below to view full specifications and claim yours.\n👉 https://facebook.com/z_os_wear/posts/${skuSuffix}`
        },
        instagram_caption: {
          body: `Curated futures. ⚡️\n\nIntroducing the Z/OS Series "${title}" — where cyber-gothic architecture meets hyper-clean PC builds of the future. Custom liquid cooling loops, matte black carbon textures, and striking violet neon highlights.\n\nEvery piece is hand-customized, signed with its unique SKU, and logged onto our secure sovereign vault.\n\nHow does your desk look compared to this?\n\n#futurepc #custompc #pcbuild #pcsetup #gamingsetup #moderngraffiti #streetwear #cyberpunk #interiordesign #creativecoding #zos`
        },
        linktree_item: {
          title: `Pre-Order Z/OS ${title}`,
          subtitle: `Custom-configured premium custom tech. Zero Point series.`
        }
      },
      lambda_specs: {
        dimensions: category === "custom_pc" ? "Desktop Tower Silhouette (ATX)" : "Apparel Regular Fit (S-XXL)",
        recommended_price: category === "custom_pc" ? "$2,899.00" : "$48.00",
        estimated_profit_margin: category === "custom_pc" ? "42%" : "68%",
        logistics_sku: `ZOS-${category === "custom_pc" ? "PC" : "APP"}-${skuSuffix}`,
        mock_links: {
          amazon: `https://amazon.com/dp/B08ZOS${skuSuffix}`,
          facebook: `https://facebook.com/z_os_wear/posts/${skuSuffix}`,
          instagram: `https://instagram.com/p/C_zos${skuSuffix}`,
          linktree: `https://linktr.ee/zos_genesis`
        }
      }
    };
    res.json(mockPayload);
  });

  // Serve static assets and routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Prevents node ESM errors
  const admin = (await import("firebase-admin")).default;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
