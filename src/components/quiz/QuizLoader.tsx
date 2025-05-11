
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";

interface QuizLoaderProps {
  isLoading: boolean;
  hasQuiz: boolean;
  hasQuestions: boolean;
  onNavigateToQuizzes: () => void;
}

export const QuizLoader = ({ 
  isLoading, 
  hasQuiz, 
  hasQuestions, 
  onNavigateToQuizzes 
}: QuizLoaderProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-quiz-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!hasQuiz || !hasQuestions) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <HelpCircle className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Quiz not available</h2>
        <p className="text-muted-foreground mb-6">This quiz is not available or has no questions.</p>
        <Button onClick={onNavigateToQuizzes}>Back to Quizzes</Button>
      </div>
    );
  }

  return null;
};
