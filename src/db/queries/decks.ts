import { db } from "@/db";
import { decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Get all decks for a specific user
 */
export async function getDecksByUserId(userId: string) {
  return await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.userId, userId));
}

/**
 * Get a single deck by ID and user ID (ensures ownership)
 */
export async function getDeckById(deckId: number, userId: string) {
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ));
  
  return deck;
}

/**
 * Insert a new deck
 */
export async function insertDeck(data: {
  userId: string;
  name: string;
  description?: string;
}) {
  const [newDeck] = await db
    .insert(decksTable)
    .values(data)
    .returning();
  
  return newDeck;
}

/**
 * Update a deck by ID (ensures ownership)
 */
export async function updateDeckById(
  deckId: number,
  userId: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  const [updatedDeck] = await db
    .update(decksTable)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ))
    .returning();
  
  return updatedDeck;
}

/**
 * Delete a deck by ID (ensures ownership)
 */
export async function deleteDeckById(deckId: number, userId: string) {
  await db
    .delete(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ));
}

