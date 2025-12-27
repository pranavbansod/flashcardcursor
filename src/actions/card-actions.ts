"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { insertCard } from "@/db/queries/cards";
import { getDeckById } from "@/db/queries/decks";
import { revalidatePath } from "next/cache";

// Zod schema for validation
const createCardSchema = z.object({
  deckId: z.number().int().positive(),
  front: z.string().min(1, "Front side is required").max(1000, "Front side too long"),
  back: z.string().min(1, "Back side is required").max(1000, "Back side too long"),
});

// TypeScript type derived from schema
type CreateCardInput = z.infer<typeof createCardSchema>;

export async function createCard(input: CreateCardInput) {
  // 1. Validate with Zod
  const result = createCardSchema.safeParse(input);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.format(),
    };
  }
  
  const validated = result.data;
  
  // 2. Authenticate
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: { _errors: ["Unauthorized"] },
    };
  }
  
  // 3. Verify deck ownership using query helper
  const deck = await getDeckById(validated.deckId, userId);
  
  if (!deck) {
    return {
      success: false,
      error: { _errors: ["Deck not found or access denied"] },
    };
  }
  
  // 4. Create card using query helper
  const newCard = await insertCard({
    deckId: validated.deckId,
    front: validated.front,
    back: validated.back,
  });
  
  // 5. Revalidate relevant paths
  revalidatePath(`/decks/${validated.deckId}`);
  revalidatePath("/dashboard");
  
  return { success: true, card: newCard };
}

