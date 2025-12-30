import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDecksByUserId } from "@/db/queries/decks";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const decks = await getDecksByUserId(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/decks/new">Create Deck</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Your Decks</h2>
          {decks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't created any decks yet.
              </p>
              <Button asChild>
                <Link href="/dashboard/decks/new">Create Your First Deck</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => (
                <Link
                  key={deck.id}
                  href={`/decks/${deck.id}`}
                  className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2">{deck.name}</h3>
                  {deck.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {deck.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Last Updated {new Date(deck.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

