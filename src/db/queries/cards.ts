import { db } from "@/db";
import { cardsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getCardsByDeckId(deckId: number) {
  return await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId));
}

export async function getCardById(cardId: number) {
  const [card] = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.id, cardId));
  
  return card;
}

export async function insertCard(data: {
  deckId: number;
  front: string;
  back: string;
}) {
  const [newCard] = await db
    .insert(cardsTable)
    .values(data)
    .returning();
  
  return newCard;
}

export async function updateCardById(
  cardId: number,
  data: {
    front?: string;
    back?: string;
  }
) {
  const [updatedCard] = await db
    .update(cardsTable)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(cardsTable.id, cardId))
    .returning();
  
  return updatedCard;
}

export async function deleteCardById(cardId: number) {
  await db
    .delete(cardsTable)
    .where(eq(cardsTable.id, cardId));
}

export async function deleteCardsByDeckId(deckId: number) {
  await db
    .delete(cardsTable)
    .where(eq(cardsTable.deckId, deckId));
}

