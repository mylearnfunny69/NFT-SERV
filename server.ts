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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    }
  } catch (err) {
    console.error("Error checking or seeding Cloud SQL:", err);
  }
}

// Authentication Middleware to verify Firebase ID Token
async function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header." });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Firebase auth verification failed:", err);
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
          const decoded = await adminAuth.verifyIdToken(userToken);
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
        } catch (authErr) {
          console.warn("Optional userToken verification failed during publish:", authErr);
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
