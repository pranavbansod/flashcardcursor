"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDeck } from "@/actions/deck-actions";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateDeckModalProps {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function CreateDeckModal({
  variant = "default",
  size = "default",
  className,
  children,
}: CreateDeckModalProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createDeck({
        name,
        description: description || undefined,
      });

      if (result.success && result.deck) {
        setOpen(false);
        router.push(`/decks/${result.deck.id}`);
      } else {
        if (result.error && "_errors" in result.error) {
          setError(result.error._errors[0] || "Failed to create deck");
        } else if (result.error) {
          const nameError = result.error.name?._errors?.[0];
          const descriptionError = result.error.description?._errors?.[0];
          setError(nameError || descriptionError || "Failed to create deck");
        } else {
          setError("Failed to create deck");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Failed to create deck:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <>
        {children || (
          <Button variant={variant} size={size} className={className} disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create Deck
          </Button>
        )}
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant} size={size} className={className}>
            <Plus className="h-4 w-4 mr-2" />
            Create Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Deck</DialogTitle>
            <DialogDescription>
              Create a new flashcard deck. You can add cards to it after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Deck Name</Label>
              <Input
                id="name"
                placeholder="Enter deck name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter deck description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

