"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { insertCard, updateCardById, getCardByIdWithDeck, deleteCardById, updateCardStudyProgress } from "@/db/queries/cards";
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

const deleteCardSchema = z.object({
  cardId: z.number().int().positive(),
});

type DeleteCardInput = z.infer<typeof deleteCardSchema>;

export async function deleteCard(input: DeleteCardInput) {
  const result = deleteCardSchema.safeParse(input);
  
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
  
  const deckId = card.deckId;
  
  await deleteCardById(validated.cardId);
  
  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/dashboard");
  
  return { success: true };
}

const studyCardSchema = z.object({
  cardId: z.number().int().positive(),
  masteryLevel: z.number().int().min(0).max(5),
});

type StudyCardInput = z.infer<typeof studyCardSchema>;

export async function studyCard(input: StudyCardInput) {
  const result = studyCardSchema.safeParse(input);
  
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
  
  const updatedCard = await updateCardStudyProgress(validated.cardId, {
    studiedCount: card.studiedCount + 1,
    lastStudied: new Date(),
    masteryLevel: validated.masteryLevel,
  });
  
  revalidatePath(`/decks/${card.deckId}/study`);
  revalidatePath(`/decks/${card.deckId}`);
  
  return { success: true, card: updatedCard };
}

