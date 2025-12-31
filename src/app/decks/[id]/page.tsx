import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getDeckById } from "@/db/queries/decks";
import { getCardsByDeckId } from "@/db/queries/cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddCardModal } from "@/components/add-card-modal";
import { EditDeckModal } from "@/components/edit-deck-modal";
import { DeleteCardButton } from "@/components/delete-card-button";
import { DeleteDeckButton } from "@/components/delete-deck-button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface DeckPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { id } = await params;
  const deckId = parseInt(id, 10);

  if (isNaN(deckId)) {
    notFound();
  }

  const deck = await getDeckById(deckId, user.id);

  if (!deck) {
    notFound();
  }

  const cards = await getCardsByDeckId(deckId);

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/dashboard">← Back to Dashboard</Link>
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{deck.name}</h1>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {cards.length} {cards.length === 1 ? "card" : "cards"}
                </Badge>
              </div>
              {deck.description && (
                <p className="text-muted-foreground text-lg mt-2">{deck.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-3">
                Created {new Date(deck.createdAt).toLocaleDateString()} • Last updated {new Date(deck.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <EditDeckModal
                deckId={deck.id}
                currentName={deck.name}
                currentDescription={deck.description}
                variant="outline"
                size="sm"
              />
              <DeleteDeckButton
                deckId={deck.id}
                deckName={deck.name}
                cardCount={cards.length}
              />
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button asChild size="lg" className="flex-1" disabled={cards.length === 0}>
              <Link href={`/decks/${deck.id}/study`}>
                <BookOpen className="mr-2 h-5 w-5" />
                Start Study Session
              </Link>
            </Button>
            <AddCardModal deckId={deck.id} variant="outline" size="lg" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
            <CardDescription>
              {cards.length === 0
                ? "No flashcards yet. Add your first card to get started!"
                : `${cards.length} flashcard${cards.length === 1 ? "" : "s"} in this deck`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  This deck doesn't have any flashcards yet.
                </p>
                <AddCardModal deckId={deck.id}>
                  <Button>Add Your First Card</Button>
                </AddCardModal>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cards.map((card) => (
                  <Card key={card.id} className="hover:bg-accent/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-base">Front</CardTitle>
                      <CardDescription className="text-base text-foreground bg-muted/50 px-3 py-2 rounded-md">
                        {card.front}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold mb-1">Back</p>
                        <p className="text-sm text-muted-foreground bg-accent/30 px-3 py-2 rounded-md">{card.back}</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/decks/${deck.id}/cards/${card.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <DeleteCardButton cardId={card.id} deckId={deck.id} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

