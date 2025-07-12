import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X, Play, Trash2 } from "lucide-react";

interface FlashcardData {
  front: string;
  back: string;
}

export function FlashcardCreator() {
  const [deckName, setDeckName] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: flashcards = [], isLoading } = useQuery({
    queryKey: ["/api/flashcards"],
  });

  const createFlashcardMutation = useMutation({
    mutationFn: (flashcard: { deckName: string; cards: FlashcardData[] }) =>
      apiRequest("POST", "/api/flashcards", flashcard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards"] });
      setDeckName("");
      setCards([]);
      toast({
        title: "Flashcard deck created",
        description: "Your flashcard deck has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create flashcard deck. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteFlashcardMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/flashcards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards"] });
      setSelectedDeck(null);
      setStudyMode(false);
      toast({
        title: "Deck deleted",
        description: "Flashcard deck has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete deck. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddCard = () => {
    if (!front.trim() || !back.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both front and back of the card.",
        variant: "destructive",
      });
      return;
    }

    setCards([...cards, { front: front.trim(), back: back.trim() }]);
    setFront("");
    setBack("");
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleSaveDeck = () => {
    if (!deckName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a deck name.",
        variant: "destructive",
      });
      return;
    }

    if (cards.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one card to the deck.",
        variant: "destructive",
      });
      return;
    }

    createFlashcardMutation.mutate({
      deckName: deckName.trim(),
      cards,
    });
  };

  const handleStartStudy = (deck: any) => {
    setSelectedDeck(deck);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const handleNextCard = () => {
    if (currentCardIndex < selectedDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setStudyMode(false);
      toast({
        title: "Study session completed!",
        description: "You've reviewed all cards in this deck.",
      });
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-16 bg-surface-variant rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (studyMode && selectedDeck) {
    const currentCard = selectedDeck.cards[currentCardIndex];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setStudyMode(false)}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Decks
          </Button>
          <Badge variant="outline">
            {currentCardIndex + 1} / {selectedDeck.cards.length}
          </Badge>
        </div>

        <Card className="min-h-48">
          <CardHeader>
            <CardTitle className="text-center">{selectedDeck.deckName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="bg-surface-variant p-6 rounded-lg min-h-24 flex items-center justify-center">
                <p className="text-lg">
                  {showAnswer ? currentCard.back : currentCard.front}
                </p>
              </div>
              <Button
                onClick={() => setShowAnswer(!showAnswer)}
                variant="outline"
              >
                {showAnswer ? "Show Question" : "Show Answer"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={handleNextCard}
            disabled={currentCardIndex === selectedDeck.cards.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Deck</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="Deck name..."
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Front</label>
                <Textarea
                  placeholder="Question or term..."
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Back</label>
                <Textarea
                  placeholder="Answer or definition..."
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <Button onClick={handleAddCard} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Add Card
            </Button>
          </div>

          {cards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cards in Deck ({cards.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {cards.map((card, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-surface-variant rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{card.front}</p>
                        <p className="text-xs text-text-secondary truncate">{card.back}</p>
                      </div>
                      <Button
                        onClick={() => handleRemoveCard(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSaveDeck}
                  disabled={createFlashcardMutation.isPending}
                  className="w-full mt-3"
                >
                  Save Deck
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="study" className="space-y-4">
          {flashcards.length > 0 ? (
            <div className="space-y-3">
              {flashcards.map((deck: any) => (
                <Card key={deck.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{deck.deckName}</h3>
                        <p className="text-sm text-text-secondary">
                          {deck.cards.length} cards
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleStartStudy(deck)}
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Study
                        </Button>
                        <Button
                          onClick={() => deleteFlashcardMutation.mutate(deck.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <span className="material-icons text-4xl mb-2">quiz</span>
              <p>No flashcard decks yet. Create your first deck!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
