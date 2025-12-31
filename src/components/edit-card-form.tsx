"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCard } from "@/actions/card-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditCardFormProps {
  cardId: number;
  deckId: number;
  currentFront: string;
  currentBack: string;
}

export function EditCardForm({
  cardId,
  deckId,
  currentFront,
  currentBack,
}: EditCardFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [front, setFront] = useState(currentFront);
  const [back, setBack] = useState(currentBack);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateCard({
        cardId,
        front,
        back,
      });

      if (result.success) {
        router.push(`/decks/${deckId}`);
        router.refresh();
      } else {
        if (result.error && "_errors" in result.error) {
          setError(result.error._errors[0] || "Failed to update card");
        } else if (result.error) {
          const frontError = result.error.front?._errors?.[0];
          const backError = result.error.back?._errors?.[0];
          setError(frontError || backError || "Failed to update card");
        } else {
          setError("Failed to update card");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Failed to update card:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Flashcard</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="front">Front Side</Label>
              <Textarea
                id="front"
                placeholder="Enter the question or prompt..."
                value={front}
                onChange={(e) => setFront(e.target.value)}
                required
                rows={4}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="back">Back Side</Label>
              <Textarea
                id="back"
                placeholder="Enter the answer..."
                value={back}
                onChange={(e) => setBack(e.target.value)}
                required
                rows={4}
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/decks/${deckId}`)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Card"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

