"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { getDeckById, updateDeckById, insertDeck } from "@/db/queries/decks";
import { revalidatePath } from "next/cache";

const updateDeckSchema = z.object({
  deckId: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500).optional(),
});

type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export async function updateDeck(input: UpdateDeckInput) {
  const result = updateDeckSchema.safeParse(input);
  
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
  
  const updatedDeck = await updateDeckById(
    validated.deckId,
    userId,
    {
      name: validated.name,
      description: validated.description,
    }
  );
  
  revalidatePath(`/decks/${validated.deckId}`);
  revalidatePath("/dashboard");
  
  return { success: true, deck: updatedDeck };
}

const createDeckSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500).optional(),
});

type CreateDeckInput = z.infer<typeof createDeckSchema>;

export async function createDeck(input: CreateDeckInput) {
  const result = createDeckSchema.safeParse(input);
  
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
  
  const newDeck = await insertDeck({
    userId,
    name: validated.name,
    description: validated.description,
  });
  
  revalidatePath("/dashboard");
  
  return { success: true, deck: newDeck };
}

