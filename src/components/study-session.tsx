"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { studyCard } from "@/actions/card-actions";
import Link from "next/link";
import { RotateCcw, ChevronLeft, ChevronRight, X, Check, Shuffle, Keyboard, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface StudySessionProps {
  deck: {
    id: number;
    name: string;
    description?: string | null;
  };
  cards: Array<{
    id: number;
    front: string;
    back: string;
    studiedCount: number;
    masteryLevel: number;
  }>;
}

export function StudySession({ deck, cards }: StudySessionProps) {
  const [shuffledCards, setShuffledCards] = useState(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set());
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setViewedCards(new Set([shuffled[0]?.id]));
  }, [cards]);

  useEffect(() => {
    if (viewedCards.size === shuffledCards.length && shuffledCards.length > 0) {
      setShowCompletionDialog(true);
    }
  }, [viewedCards.size, shuffledCards.length]);

  const currentCard = shuffledCards[currentIndex];
  const progress = ((currentIndex + 1) / shuffledCards.length) * 100;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = () => {
    const newShuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(newShuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setViewedCards(new Set([newShuffled[0]?.id]));
  };

  const handleStudyAgain = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setViewedCards(new Set([shuffled[0]?.id]));
    setShowCompletionDialog(false);
  };

  const handleBackToDeck = () => {
    router.push(`/decks/${deck.id}`);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < shuffledCards.length - 1) {
        const nextIndex = prevIndex + 1;
        const nextCard = shuffledCards[nextIndex];
        setViewedCards((prev) => new Set([...prev, nextCard.id]));
        return nextIndex;
      }
      return prevIndex;
    });
    setIsFlipped(false);
  }, [shuffledCards]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        const prevCardIndex = prevIndex - 1;
        const prevCard = shuffledCards[prevCardIndex];
        setViewedCards((prev) => new Set([...prev, prevCard.id]));
        return prevCardIndex;
      }
      return prevIndex;
    });
    setIsFlipped(false);
  }, [shuffledCards]);

  const handleStudyResult = async (masteryLevel: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await studyCard({
        cardId: currentCard.id,
        masteryLevel,
      });

      if (currentIndex < shuffledCards.length - 1) {
        handleNext();
      }
    } catch (error) {
      console.error("Failed to update study progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSubmitting) return;

      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case " ":
          event.preventDefault();
          handleFlip();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, handlePrevious, handleNext, handleFlip]);

  return (
    <>
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Study Session Completed!</DialogTitle>
            <DialogDescription>
              You've reviewed all {shuffledCards.length} card{shuffledCards.length !== 1 ? "s" : ""} in this deck.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button onClick={handleBackToDeck} variant="outline">
              Back to Deck
            </Button>
            <Button onClick={handleStudyAgain}>
              <RotateCw className="mr-2 h-4 w-4" />
              Study Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link href={`/decks/${deck.id}`}>
            <X className="mr-2 h-4 w-4" />
            Exit Study
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleShuffle}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
          <Badge variant="secondary" className="text-base px-3 py-1">
            {currentIndex + 1} / {shuffledCards.length}
          </Badge>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{deck.name}</h1>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Keyboard className="h-3 w-3" />
          <span>
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted rounded border">←</kbd> Previous
            {" • "}
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted rounded border">→</kbd> Next
            {" • "}
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted rounded border">Space</kbd> Flip
          </span>
        </div>
      </div>

      <Card className="mb-6 min-h-[400px] flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <div className="mb-4 text-center">
              <Badge variant="outline" className="mb-4">
                {isFlipped ? "Back" : "Front"}
              </Badge>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-2xl font-medium leading-relaxed break-words">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleFlip}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {isFlipped ? "Show Front" : "Show Back"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFlipped && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <p className="text-sm font-medium mb-4">How well did you know this?</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => handleStudyResult(0)}
                variant="destructive"
                disabled={isSubmitting}
                className="flex-1 min-w-[120px]"
              >
                <X className="mr-2 h-4 w-4" />
                Again
              </Button>
              <Button
                onClick={() => handleStudyResult(1)}
                variant="outline"
                disabled={isSubmitting}
                className="flex-1 min-w-[120px]"
              >
                Hard
              </Button>
              <Button
                onClick={() => handleStudyResult(3)}
                variant="default"
                disabled={isSubmitting}
                className="flex-1 min-w-[120px]"
              >
                Good
              </Button>
              <Button
                onClick={() => handleStudyResult(5)}
                variant="default"
                disabled={isSubmitting}
                className="flex-1 min-w-[120px]"
              >
                <Check className="mr-2 h-4 w-4" />
                Easy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          variant="outline"
          disabled={currentIndex === shuffledCards.length - 1}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
    </>
  );
}

