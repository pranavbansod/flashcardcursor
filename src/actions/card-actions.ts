"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { insertCard, updateCardById, getCardByIdWithDeck } from "@/db/queries/cards";
import { getDeckById } from "@/db/queries/decks";
import { revalidatePath } from "next/cache";

const createCardSchema = z.object({
  deckId: z.number().int().positive(),
  front: z.string().min(1, "Front side is required").max(1000, "Front side too long"),
  back: z.string().min(1, "Back side is required").max(1000, "Back side too long"),
});

type CreateCardInput = z.infer<typeof createCardSchema>;

export async function createCard(input: CreateCardInput) {
  const result = createCardSchema.safeParse(input);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.format(),
    };
  }
  
  const validated = result.data;
  
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: { _errors: ["Unauthorized"] },
    };
  }
  
  const deck = await getDeckById(validated.deckId, userId);
  
  if (!deck) {
    return {
      success: false,
      error: { _errors: ["Deck not found or access denied"] },
    };
  }
  
  const newCard = await insertCard({
    deckId: validated.deckId,
    front: validated.front,
    back: validated.back,
  });
  
  revalidatePath(`/decks/${validated.deckId}`);
  revalidatePath("/dashboard");
  
  return { success: true, card: newCard };
}

const updateCardSchema = z.object({
  cardId: z.number().int().positive(),
  front: z.string().min(1, "Front side is required").max(1000, "Front side too long"),
  back: z.string().min(1, "Back side is required").max(1000, "Back side too long"),
});

type UpdateCardInput = z.infer<typeof updateCardSchema>;

export async function updateCard(input: UpdateCardInput) {
  const result = updateCardSchema.safeParse(input);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.format(),
    };
  }
  
  const validated = result.data;
  
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: { _errors: ["Unauthorized"] },
    };
  }
  
  const card = await getCardByIdWithDeck(validated.cardId, userId);
  
  if (!card) {
    return {
      success: false,
      error: { _errors: ["Card not found or access denied"] },
    };
  }
  
  const updatedCard = await updateCardById(validated.cardId, {
    front: validated.front,
    back: validated.back,
  });
  
  revalidatePath(`/decks/${card.deckId}`);
  revalidatePath(`/decks/${card.deckId}/cards/${validated.cardId}/edit`);
  revalidatePath("/dashboard");
  
  return { success: true, card: updatedCard };
}

