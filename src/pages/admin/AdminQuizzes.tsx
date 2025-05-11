
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import QuizFormDialog from "@/components/admin/QuizFormDialog";
import QuizTable from "@/components/admin/QuizTable";
import EmptyQuizState from "@/components/admin/EmptyQuizState";
import { useQuiz } from "@/contexts/QuizContext";
import { supabase } from "@/integrations/supabase/client";

const AdminQuizzes = () => {
  const { 
    categories, 
    quizzes, 
    addQuiz, 
    deleteQuiz, 
    duplicateQuiz,
    fetchInitialData 
  } = useQuiz();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use useCallback to prevent the function from being recreated on every render
  const initData = useCallback(async () => {
    if (!isInitialDataLoading) return; // Prevent multiple calls if already loading
    
    setIsInitialDataLoading(true);
    try {
      await fetchInitialData();
      
      // Check if user is authenticated
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("You must be logged in to manage quizzes");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error initializing data:", error);
      toast.error("Failed to load quiz data");
    } finally {
      setIsInitialDataLoading(false);
    }
  }, [fetchInitialData, navigate, isInitialDataLoading]);
  
  useEffect(() => {
    initData();
  }, [initData]);

  // Function to handle adding a new quiz
  const handleAddQuiz = async (quizData: any) => {
    try {
      setIsLoading(true);
      console.log("Adding quiz with data:", quizData);
      
      // Check auth status before proceeding
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to create a quiz");
        navigate("/signin");
        return;
      }
      
      const newQuiz = {
        title: quizData.title,
        description: quizData.description,
        categoryId: parseInt(quizData.category),
        category: categories.find(cat => cat.id === parseInt(quizData.category))?.name || "Uncategorized",
        difficulty: quizData.difficulty,
        timeEstimate: quizData.timeEstimate,
        thumbnailUrl: quizData.thumbnailUrl || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&h=400&q=80",
        status: "Published" as "Draft" | "Published",
      };
      
      const newQuizId = await addQuiz(newQuiz);
      
      if (newQuizId) {
        toast.success("Quiz created successfully!");
        // Navigate to the questions page for this quiz
        navigate(`/admin/quizzes/${newQuizId}/questions`);
      } else {
        toast.error("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle quiz deletion
  const handleDeleteQuiz = async (id: number) => {
    try {
      await deleteQuiz(id);
      toast.success("Quiz deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete quiz");
      console.error(error);
    }
  };

  // Function to duplicate a quiz
  const handleDuplicateQuiz = async (id: number) => {
    try {
      await duplicateQuiz(id);
      toast.success("Quiz duplicated successfully!");
    } catch (error) {
      toast.error("Failed to duplicate quiz");
      console.error(error);
    }
  };

  const handleEditQuestions = (id: number) => {
    navigate(`/admin/quizzes/${id}/questions`);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  if (isInitialDataLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-quiz-purple border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <Button 
          className="bg-quiz-purple hover:bg-quiz-purple-dark"
          onClick={handleOpenDialog}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Quiz
        </Button>
      </div>
      
      {quizzes.length === 0 ? (
        <EmptyQuizState onAddQuiz={handleOpenDialog} />
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Manage Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizTable 
              quizzes={quizzes} 
              onDeleteQuiz={handleDeleteQuiz}
              onDuplicateQuiz={handleDuplicateQuiz}
              onEditQuestions={handleEditQuestions}
            />
          </CardContent>
        </Card>
      )}

      <QuizFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onQuizSave={handleAddQuiz} 
        categories={categories}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminQuizzes;
