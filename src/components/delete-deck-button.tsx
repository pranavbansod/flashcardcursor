"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteDeck } from "@/actions/deck-actions";
import { Trash2 } from "lucide-react";

interface DeleteDeckButtonProps {
  deckId: number;
  deckName: string;
  cardCount: number;
}

export function DeleteDeckButton({ deckId, deckName, cardCount }: DeleteDeckButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await deleteDeck({ deckId });

      if (!result.success) {
        const errorMessage = result.error?._errors?.[0] || "Failed to delete deck";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      setOpen(false);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Deck
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Deck</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{deckName}&quot;? This will permanently delete the deck and all {cardCount} {cardCount === 1 ? "card" : "cards"} associated with it. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

