import { integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

// Decks table - each user can create multiple decks
export const decksTable = pgTable("decks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Cards table - each deck can have multiple cards
export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer().notNull().references(() => decksTable.id, { onDelete: "cascade" }),
  front: text().notNull(), // Question/prompt (e.g., "日" or "When was the Battle of Hastings?")
  back: text().notNull(), // Answer (e.g., "day, sun" or "1066")
  // Study tracking fields
  studiedCount: integer().default(0).notNull(), // Number of times successfully studied
  lastStudied: timestamp(), // When the card was last studied (null if never studied)
  masteryLevel: integer().default(0).notNull(), // 0 = not studied, 1-5 = increasing mastery
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
