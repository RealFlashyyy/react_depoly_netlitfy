
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { QuizQuestionType } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowLeft, Trash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const QuizQuestions = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { 
    quizzes, 
    getQuestionsByQuizId, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion 
  } = useQuiz();
  
  const quiz = quizzes.find(q => q.id === Number(quizId));
  
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("You must be logged in to manage questions");
        navigate("/signin");
        return false;
      }
      return true;
    };

    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) return;
        
        if (quizId) {
          const fetchedQuestions = await getQuestionsByQuizId(Number(quizId));
          setQuestions(fetchedQuestions);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, [quizId, getQuestionsByQuizId, navigate]);
  
  const [newQuestion, setNewQuestion] = useState<{
    text: string;
    type: "multiple-choice" | "true-false" | "descriptive";
    options: { id: number; text: string; isCorrect: boolean }[];
    correctAnswer?: string;
    points: number;
    explanation: string;
  }>({
    text: "",
    type: "multiple-choice",
    options: [
      { id: 1, text: "", isCorrect: true },
      { id: 2, text: "", isCorrect: false },
      { id: 3, text: "", isCorrect: false },
      { id: 4, text: "", isCorrect: false }
    ],
    points: 10,
    explanation: ""
  });
  
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  
  useEffect(() => {
    if (!quiz && !isLoading) {
      toast.error("Quiz not found!");
      navigate("/admin/quizzes");
    }
  }, [quiz, navigate, isLoading]);
  
  useEffect(() => {
    if (editingQuestionId) {
      const questionToEdit = questions.find(q => q.id === editingQuestionId);
      if (questionToEdit) {
        setNewQuestion({
          text: questionToEdit.text,
          type: questionToEdit.type,
          options: questionToEdit.options || [],
          correctAnswer: questionToEdit.correctAnswer,
          points: questionToEdit.points,
          explanation: questionToEdit.explanation || ""
        });
      }
    }
  }, [editingQuestionId, questions]);
  
  const handleTypeChange = (type: "multiple-choice" | "true-false" | "descriptive") => {
    let options = newQuestion.options;
    
    if (type === "true-false") {
      options = [
        { id: 1, text: "True", isCorrect: true },
        { id: 2, text: "False", isCorrect: false }
      ];
    } else if (type === "multiple-choice" && options.length < 2) {
      options = [
        { id: 1, text: "", isCorrect: true },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false }
      ];
    }
    
    setNewQuestion({
      ...newQuestion,
      type,
      options
    });
  };
  
  const handleOptionChange = (id: number, text: string) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.map(option => 
        option.id === id ? { ...option, text } : option
      )
    });
  };
  
  const handleCorrectAnswerChange = (id: number) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.map(option => ({
        ...option,
        isCorrect: option.id === id
      }))
    });
  };
  
  const resetForm = () => {
    setNewQuestion({
      text: "",
      type: "multiple-choice",
      options: [
        { id: 1, text: "", isCorrect: true },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false }
      ],
      points: 10,
      explanation: ""
    });
    setEditingQuestionId(null);
  };
  
  const handleSubmit = async () => {
    // Prevent duplicate submissions
    if (isSubmitting) {
      console.log("Submission already in progress, preventing duplicate");
      return;
    }
    
    // Validate auth first
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      toast.error("You must be logged in to add questions");
      navigate("/signin");
      return;
    }
    
    if (!newQuestion.text) {
      toast.error("Question text is required!");
      return;
    }
    
    if (newQuestion.type === "multiple-choice" || newQuestion.type === "true-false") {
      const emptyOptions = newQuestion.options.filter(o => !o.text.trim());
      if (emptyOptions.length > 0) {
        toast.error("All options must have text!");
        return;
      }
      
      if (!newQuestion.options.some(o => o.isCorrect)) {
        toast.error("You must select a correct answer!");
        return;
      }
    }
    
    if (newQuestion.type === "descriptive" && !newQuestion.correctAnswer) {
      toast.error("You must provide a sample correct answer!");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const questionData: Omit<QuizQuestionType, "id"> = {
        quizId: Number(quizId),
        text: newQuestion.text,
        type: newQuestion.type,
        options: newQuestion.type !== "descriptive" ? newQuestion.options : undefined,
        correctAnswer: newQuestion.type === "descriptive" ? newQuestion.correctAnswer : undefined,
        points: newQuestion.points,
        explanation: newQuestion.explanation
      };
      
      if (editingQuestionId) {
        await updateQuestion(editingQuestionId, questionData);
        toast.success("Question updated successfully!");
        
        // Update local questions state
        setQuestions(prevQuestions => 
          prevQuestions.map(q => 
            q.id === editingQuestionId 
              ? { ...q, ...questionData, id: editingQuestionId } 
              : q
          )
        );
      } else {
        const newQuestionId = await addQuestion(questionData);
        
        if (newQuestionId) {
          toast.success("Question added successfully!");
          
          // Update local questions state - fetch fresh questions instead of appending
          // This helps prevent duplicate UI rendering if the backend has already updated
          const refreshedQuestions = await getQuestionsByQuizId(Number(quizId));
          setQuestions(refreshedQuestions);
        } else {
          toast.error("Failed to add question");
        }
      }
      
      resetForm();
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("An error occurred while saving the question");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteQuestion = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
        toast.success("Question deleted successfully!");
        
        // Update local questions state
        setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Failed to delete question");
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-quiz-purple border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>Quiz not found. <a href="/admin/quizzes" className="underline">Return to quizzes</a></p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/quizzes")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>
        <h1 className="text-2xl font-bold">Questions for: {quiz?.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {editingQuestionId ? "Edit Question" : "Add New Question"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="questionText">Question Text</Label>
                  <Textarea 
                    id="questionText"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                    placeholder="Enter your question here..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select 
                    value={newQuestion.type} 
                    onValueChange={(value) => handleTypeChange(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="descriptive">Descriptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(newQuestion.type === "multiple-choice" || newQuestion.type === "true-false") && (
                  <div className="space-y-3">
                    <Label>Options</Label>
                    {newQuestion.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={option.isCorrect}
                          onChange={() => handleCorrectAnswerChange(option.id)}
                          className="h-4 w-4"
                        />
                        <Input
                          value={option.text}
                          onChange={(e) => handleOptionChange(option.id, e.target.value)}
                          placeholder={`Option ${option.id}`}
                          disabled={newQuestion.type === "true-false"}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {newQuestion.type === "descriptive" && (
                  <div>
                    <Label htmlFor="correctAnswer">Sample Correct Answer</Label>
                    <Textarea
                      id="correctAnswer"
                      value={newQuestion.correctAnswer || ""}
                      onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                      placeholder="Enter a sample correct answer..."
                      className="min-h-[100px]"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    value={newQuestion.points}
                    onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="explanation">Explanation (shown after answering)</Label>
                  <Textarea
                    id="explanation"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                    placeholder="Explain why the answer is correct..."
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-3">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-quiz-purple hover:bg-quiz-purple-dark"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                        {editingQuestionId ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editingQuestionId ? "Update Question" : "Add Question"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Questions ({questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No questions added yet.</p>
                  <p className="text-sm mt-1">Add your first question using the form.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div 
                      key={question.id} 
                      className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                            {question.type === "multiple-choice" ? "Multiple Choice" : 
                             question.type === "true-false" ? "True/False" : "Descriptive"}
                          </span>
                          <span className="text-xs text-muted-foreground">{question.points} pts</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingQuestionId(question.id)}
                          >
                            <span className="sr-only">Edit</span>
                            ✏️
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium">{question.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;
