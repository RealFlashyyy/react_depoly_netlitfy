
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { formatTime } from "./QuizTimer";

interface QuizCompletionSummaryProps {
  score: {
    earned: number;
    total: number;
  };
  timeSpent: number;
  answers: Record<number, { isCorrect: boolean }>;
  questionsCount: number;
  onTryAgain: () => void;
  onBackToQuizzes: () => void;
}

export const QuizCompletionSummary = ({
  score,
  timeSpent,
  answers,
  questionsCount,
  onTryAgain,
  onBackToQuizzes,
}: QuizCompletionSummaryProps) => {
  const percentage = Math.round((score.earned / score.total) * 100);
  const correctAnswersCount = Object.values(answers).filter(a => a.isCorrect).length;
  
  return (
    <Card className="border-2 border-quiz-purple">
      <CardHeader className="bg-quiz-purple/10 text-center">
        <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          {percentage >= 70 ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <AlertCircle className="h-16 w-16 text-amber-500" />
          )}
          <h3 className="text-3xl font-bold">Your Score: {score.earned}/{score.total}</h3>
          <p className="text-lg">
            {percentage >= 90 ? "Excellent!" : 
             percentage >= 70 ? "Good job!" : 
             percentage >= 50 ? "Not bad!" : "Keep practicing!"}
          </p>
          <div className="text-sm text-muted-foreground">
            Time spent: {formatTime(timeSpent)}
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Quiz Summary:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium">Correct Answers</p>
              <p className="text-2xl font-bold">{correctAnswersCount}</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium">Incorrect Answers</p>
              <p className="text-2xl font-bold">{questionsCount - correctAnswersCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onBackToQuizzes}
          >
            Back to Quizzes
          </Button>
          <Button 
            className="w-full bg-quiz-purple hover:bg-quiz-purple-dark"
            onClick={onTryAgain}
          >
            Try Again
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
