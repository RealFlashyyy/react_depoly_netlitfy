
import React from "react";
import { Button } from "@/components/ui/button";

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  userName: string;
  onUserNameChange: (name: string) => void;
}

export const QuizNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isLastQuestion,
  isSubmitting,
  userName,
  onUserNameChange,
}: QuizNavigationProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between border-t p-4 gap-4">
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="min-w-[100px]"
        >
          Previous
        </Button>
        
        {!isLastQuestion ? (
          <Button
            onClick={onNext}
            className="bg-quiz-purple hover:bg-quiz-purple-dark min-w-[100px]"
          >
            Next
          </Button>
        ) : (
          <></>
        )}
      </div>
      
      {isLastQuestion && (
        <div className="w-full sm:w-auto flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          />
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 min-w-[100px]"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      )}
    </div>
  );
};
