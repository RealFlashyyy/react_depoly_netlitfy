import React, { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuizQuestionType } from "@/types/quiz";

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: {
    selectedOptionId?: number;
    answerText?: string;
  };
  onAnswerChange: (value: string, type: "multiple-choice" | "true-false" | "descriptive") => void;
}

export const QuizQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
}: QuizQuestionProps) => {
  // Debug log to track component re-renders and props
  useEffect(() => {
    console.log(`QuizQuestion for question ${question.id} rendered:`, { 
      selectedOptionId: selectedAnswer?.selectedOptionId,
      hasAnswer: !!selectedAnswer?.selectedOptionId
    });
  }, [question.id, selectedAnswer]);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-medium">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm text-muted-foreground">
          {question.points} {question.points === 1 ? 'point' : 'points'}
        </span>
      </div>
      
      <h3 className="text-lg font-medium">{question.text}</h3>
      
      {(question.type === "multiple-choice" || question.type === "true-false") ? (
        <RadioGroup 
          onValueChange={(value) => {
            console.log(`Selected option for question ${question.id}:`, value);
            onAnswerChange(value, question.type);
          }}
          value={selectedAnswer?.selectedOptionId?.toString()}
        >
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      ) : (
        <Textarea 
          placeholder="Type your answer here..."
          value={selectedAnswer?.answerText || ""}
          onChange={(e) => {
            console.log(`Text answer for question ${question.id} updated`);
            onAnswerChange(e.target.value, "descriptive");
          }}
          className="min-h-[150px]"
        />
      )}
    </div>
  );
};
