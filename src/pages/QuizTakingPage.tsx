import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuiz } from "@/contexts/QuizContext";
import { QuizQuestionType, QuizType } from "@/types/quiz";
import { supabase, submitQuizWithLogging } from "@/integrations/supabase/client";
import { QuizTimer } from "@/components/quiz/QuizTimer";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizNavigation } from "@/components/quiz/QuizNavigation";
import { QuizCompletionSummary } from "@/components/quiz/QuizCompletionSummary";
import { QuizLoader } from "@/components/quiz/QuizLoader";

const QuizTakingPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { quizzes, getQuestionsByQuizId } = useQuiz();
  
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selectedOptionId?: number, answerText?: string, isCorrect: boolean, points: number }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState({ earned: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) return;
      
      setIsLoading(true);
      try {
        const quizData = quizzes.find(q => q.id === Number(quizId));
        if (!quizData) {
          toast({
            title: "Quiz not found",
            description: "The quiz you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate("/quizzes");
          return;
        }
        
        setQuiz(quizData);
        
        const questionsData = await getQuestionsByQuizId(Number(quizId));
        if (questionsData.length === 0) {
          toast({
            title: "No questions found",
            description: "This quiz doesn't have any questions yet.",
            variant: "destructive"
          });
          navigate("/quizzes");
          return;
        }
        
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error loading quiz:", error);
        toast({
          title: "Error loading quiz",
          description: "There was a problem loading this quiz. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuiz();
  }, [quizId, quizzes, getQuestionsByQuizId, toast, navigate]);

  const handleAnswerChange = (value: string, type: "multiple-choice" | "true-false" | "descriptive") => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) {
      console.error("No current question found");
      return;
    }
    
    // Use string keys to avoid any number/string conversion issues
    const questionKey = String(currentQuestion.id);
    
    if (type === "multiple-choice" || type === "true-false") {
      const selectedOptionId = Number(value);
      const correctOption = currentQuestion.options?.find(option => option.isCorrect);
      
      const isCorrect = correctOption?.id === selectedOptionId;
      const points = isCorrect ? currentQuestion.points : 0;
      
      console.log(`Updating answer for question ${questionKey}:`, {
        questionId: currentQuestion.id,
        selectedOptionId,
        isCorrect,
        points
      });
      
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionKey]: {
          selectedOptionId,
          isCorrect,
          points
        }
      }));
    } else if (type === "descriptive") {
      console.log(`Updating descriptive answer for question ${questionKey}`);
      
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionKey]: {
          answerText: value,
          isCorrect: false,
          points: 0
        }
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Log the current question's answer before moving to the next
      const currentQuestion = questions[currentQuestionIndex];
      console.log(`Moving from question ${currentQuestion.id} to next question. Current answer:`, 
        answers[String(currentQuestion.id)] || 'No answer');
      
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Log the current question's answer before moving to the previous
      const currentQuestion = questions[currentQuestionIndex];
      console.log(`Moving from question ${currentQuestion.id} to previous question. Current answer:`, 
        answers[String(currentQuestion.id)] || 'No answer');
      
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const calculateFinalScore = () => {
    console.log("All available questions:", questions.map(q => ({ id: q.id, points: q.points })));
    console.log("Current answers state:", answers);
    
    let earnedPoints = 0;
    let totalPoints = 0;
    
    questions.forEach(question => {
      const questionKey = String(question.id);
      totalPoints += question.points;
      
      if (answers[questionKey]?.isCorrect) {
        earnedPoints += answers[questionKey].points;
        console.log(`Question ${questionKey} is correct, adding ${answers[questionKey].points} points`);
      } else {
        console.log(`Question ${questionKey} is incorrect or not answered`);
      }
    });
    
    console.log(`Final score calculation: ${earnedPoints}/${totalPoints}`);
    return { earned: earnedPoints, total: totalPoints };
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    
    if (!userName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to submit the quiz.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Log the current answers state before calculating final score
      console.log("Answers at submission time:", JSON.stringify(answers, null, 2));
      
      const finalScore = calculateFinalScore();
      setScore(finalScore);
      
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        selectedOptionId: answer.selectedOptionId,
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
        points: answer.points
      }));

      const submissionData = {
        quizid: quiz.id,
        username: userName.trim(),
        score: finalScore.earned,
        maxscore: finalScore.total,
        completedat: new Date().toISOString(),
        answers: formattedAnswers,
        userid: null
      };
      
      console.log("Attempting quiz submission with data:", submissionData);
      
      const result = await submitQuizWithLogging(submissionData);
      
      console.log("Quiz submission successful:", result);
      
      try {
        const { error: updateError } = await supabase
          .from('quizzes')
          .update({ attempts: quiz.attempts + 1 })
          .eq('id', quiz.id);
          
        if (updateError) {
          console.warn("Could not update attempts count:", updateError);
        }
      } catch (updateError) {
        console.warn("Error updating attempts count:", updateError);
        // Non-critical error, continue
      }
      
      setQuizComplete(true);
      
      toast({
        title: "Quiz submitted successfully!",
        description: `Your score: ${finalScore.earned}/${finalScore.total}`,
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setQuizComplete(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeSpent(0);
  };

  const handleTimeUpdate = (seconds: number) => {
    setTimeSpent(seconds);
  };
  
  // Render loading state or error state if quiz is not available
  const loaderComponent = (
    <QuizLoader
      isLoading={isLoading}
      hasQuiz={!!quiz}
      hasQuestions={questions.length > 0}
      onNavigateToQuizzes={() => navigate("/quizzes")}
    />
  );

  if (isLoading || !quiz || questions.length === 0) {
    return loaderComponent;
  }

  if (quizComplete) {
    return (
      <div className="py-12 max-w-3xl mx-auto">
        <QuizCompletionSummary
          score={score}
          timeSpent={timeSpent}
          answers={answers}
          questionsCount={questions.length}
          onTryAgain={handleTryAgain}
          onBackToQuizzes={() => navigate("/quizzes")}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{quiz.category}</p>
              <CardTitle className="text-xl sm:text-2xl">{quiz.title}</CardTitle>
            </div>
            <QuizTimer startTime={startTime} onTimeUpdate={handleTimeUpdate} />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <QuizQuestion
            question={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={answers[String(currentQuestion.id)] || {}}
            onAnswerChange={handleAnswerChange}
          />
        </CardContent>
        
        <CardFooter>
          <QuizNavigation
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onPrevious={handlePrevQuestion}
            onNext={handleNextQuestion}
            onSubmit={handleSubmitQuiz}
            isLastQuestion={isLastQuestion}
            isSubmitting={isSubmitting}
            userName={userName}
            onUserNameChange={setUserName}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizTakingPage;
