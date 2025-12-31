"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { studyCard } from "@/actions/card-actions";
import Link from "next/link";
import { RotateCcw, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleStudyResult = async (masteryLevel: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await studyCard({
        cardId: currentCard.id,
        masteryLevel,
      });

      if (currentIndex < cards.length - 1) {
        handleNext();
      } else {
        router.push(`/decks/${deck.id}`);
      }
    } catch (error) {
      console.error("Failed to update study progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    router.push(`/decks/${deck.id}`);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link href={`/decks/${deck.id}`}>
            <X className="mr-2 h-4 w-4" />
            Exit Study
          </Link>
        </Button>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {currentIndex + 1} / {cards.length}
        </Badge>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{deck.name}</h1>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
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

        {currentIndex === cards.length - 1 && isFlipped && (
          <Button onClick={handleFinish} variant="default">
            Finish Study Session
          </Button>
        )}

        <Button
          onClick={handleNext}
          variant="outline"
          disabled={currentIndex === cards.length - 1}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

