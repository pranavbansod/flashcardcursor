import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getDeckById } from "@/db/queries/decks";
import { getCardsByDeckId } from "@/db/queries/cards";
import { StudySession } from "@/components/study-session";

interface StudyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
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

  if (cards.length === 0) {
    redirect(`/decks/${deckId}`);
  }

  return <StudySession deck={deck} cards={cards} />;
}

