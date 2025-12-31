import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getCardByIdWithDeck } from "@/db/queries/cards";
import { getDeckById } from "@/db/queries/decks";
import { EditCardForm } from "@/components/edit-card-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditCardPageProps {
  params: Promise<{
    id: string;
    cardId: string;
  }>;
}

export default async function EditCardPage({ params }: EditCardPageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { id, cardId } = await params;
  const deckId = parseInt(id, 10);
  const parsedCardId = parseInt(cardId, 10);

  if (isNaN(deckId) || isNaN(parsedCardId)) {
    notFound();
  }

  const deck = await getDeckById(deckId, user.id);

  if (!deck) {
    notFound();
  }

  const card = await getCardByIdWithDeck(parsedCardId, user.id);

  if (!card || card.deckId !== deckId) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href={`/decks/${deckId}`}>← Back to Deck</Link>
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Edit Flashcard</h1>
        <p className="text-muted-foreground mb-8">
          Update the front and back sides of your flashcard.
        </p>

        <EditCardForm
          cardId={card.id}
          deckId={deckId}
          currentFront={card.front}
          currentBack={card.back}
        />
      </div>
    </div>
  );
}

