
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyQuizStateProps {
  onAddQuiz: () => void;
}

const EmptyQuizState = ({ onAddQuiz }: EmptyQuizStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
        <p className="text-muted-foreground mb-6">
          Get started by creating your first quiz.
        </p>
        <Button onClick={onAddQuiz} className="bg-quiz-purple hover:bg-quiz-purple-dark">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create First Quiz
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyQuizState;
