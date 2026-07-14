import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table holding identity synchronized with Firebase Auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Authentication UID
  email: text("email").notNull(),
  displayName: text("display_name"),
  stripeCustomerId: text("stripe_customer_id"),
  isPremium: boolean("is_premium").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// NFTs table holding ChatGPT dialogues minted as Bitcoin/Stacks NFTs
export const nfts = pgTable("nfts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  creatorAddress: text("creator_address").notNull(),
  themeId: text("theme_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  tokenSerial: text("token_serial").notNull(),
  metadataHash: text("metadata_hash").notNull(),
  txHash: text("tx_hash"),
  blockNumber: integer("block_number"),
  likes: integer("likes").default(1).notNull(),
  chatLog: jsonb("chat_log").notNull(), // JSON list of ChatMessage objects
  bids: jsonb("bids").default("[]").notNull(), // JSON list of bid objects
  userId: integer("user_id").references(() => users.id),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  nfts: many(nfts),
}));

export const nftsRelations = relations(nfts, ({ one }) => ({
  author: one(users, {
    fields: [nfts.userId],
    references: [users.id],
  }),
}));
