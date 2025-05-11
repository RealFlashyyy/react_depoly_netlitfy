import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CategoryType, generateId } from '@/utils/dataUtils';
import { QuizType, QuizQuestionType, SupabaseQuizType, SupabaseQuestionType } from '@/types/quiz';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

type QuizContextType = {
  categories: CategoryType[];
  quizzes: QuizType[];
  questions: QuizQuestionType[];
  addCategory: (category: Omit<CategoryType, 'id' | 'quizCount' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<CategoryType>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  addQuiz: (quiz: Omit<QuizType, 'id' | 'questionsCount' | 'attempts' | 'rating' | 'lastUpdated'>) => Promise<number>;
  updateQuiz: (id: number, quiz: Partial<QuizType>) => Promise<void>;
  deleteQuiz: (id: number) => Promise<void>;
  duplicateQuiz: (id: number) => Promise<number>;
  addQuestion: (question: Omit<QuizQuestionType, 'id'>) => Promise<number>;
  updateQuestion: (id: number, question: Partial<QuizQuestionType>) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
  getQuestionsByQuizId: (quizId: number) => Promise<QuizQuestionType[]>;
  fetchInitialData: () => Promise<void>;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);

  const mapSupabaseQuizToFrontend = (supabaseQuiz: SupabaseQuizType): QuizType => {
    return {
      id: supabaseQuiz.id,
      title: supabaseQuiz.title,
      description: supabaseQuiz.description,
      categoryId: supabaseQuiz.categoryid,
      category: supabaseQuiz.category,
      difficulty: supabaseQuiz.difficulty,
      timeEstimate: supabaseQuiz.timeestimate,
      thumbnailUrl: supabaseQuiz.thumbnailurl || undefined,
      status: supabaseQuiz.status,
      questionsCount: supabaseQuiz.questionscount,
      attempts: supabaseQuiz.attempts,
      rating: supabaseQuiz.rating,
      lastUpdated: supabaseQuiz.lastupdated || new Date().toISOString()
    };
  };

  const mapSupabaseQuestionToFrontend = (supabaseQuestion: SupabaseQuestionType): QuizQuestionType => {
    return {
      id: supabaseQuestion.id,
      quizId: supabaseQuestion.quizid,
      text: supabaseQuestion.text,
      type: supabaseQuestion.type,
      options: supabaseQuestion.options ? JSON.parse(JSON.stringify(supabaseQuestion.options)) : undefined,
      correctAnswer: supabaseQuestion.correctanswer || undefined,
      points: supabaseQuestion.points,
      explanation: supabaseQuestion.explanation || undefined
    };
  };

  const mapFrontendQuizToSupabase = (frontendQuiz: Partial<QuizType>): Partial<SupabaseQuizType> => {
    const supabaseQuiz: Partial<SupabaseQuizType> = {};
    
    if ('title' in frontendQuiz) supabaseQuiz.title = frontendQuiz.title!;
    if ('description' in frontendQuiz) supabaseQuiz.description = frontendQuiz.description!;
    if ('categoryId' in frontendQuiz) supabaseQuiz.categoryid = frontendQuiz.categoryId!;
    if ('category' in frontendQuiz) supabaseQuiz.category = frontendQuiz.category!;
    if ('difficulty' in frontendQuiz) supabaseQuiz.difficulty = frontendQuiz.difficulty!;
    if ('timeEstimate' in frontendQuiz) supabaseQuiz.timeestimate = frontendQuiz.timeEstimate!;
    if ('thumbnailUrl' in frontendQuiz) supabaseQuiz.thumbnailurl = frontendQuiz.thumbnailUrl!;
    if ('status' in frontendQuiz) supabaseQuiz.status = frontendQuiz.status!;
    
    supabaseQuiz.lastupdated = new Date().toISOString();
    
    return supabaseQuiz;
  };

  const mapFrontendQuestionToSupabase = (frontendQuestion: Partial<QuizQuestionType>): Partial<SupabaseQuestionType> => {
    const supabaseQuestion: Partial<SupabaseQuestionType> = {};
    
    if ('text' in frontendQuestion) supabaseQuestion.text = frontendQuestion.text!;
    if ('type' in frontendQuestion) supabaseQuestion.type = frontendQuestion.type!;
    if ('options' in frontendQuestion) supabaseQuestion.options = frontendQuestion.options as any;
    if ('correctAnswer' in frontendQuestion) supabaseQuestion.correctanswer = frontendQuestion.correctAnswer;
    if ('points' in frontendQuestion) supabaseQuestion.points = frontendQuestion.points!;
    if ('explanation' in frontendQuestion) supabaseQuestion.explanation = frontendQuestion.explanation;
    if ('quizId' in frontendQuestion) supabaseQuestion.quizid = frontendQuestion.quizId!;
    
    return supabaseQuestion;
  };

  const fetchInitialData = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      if (categoriesError) throw categoriesError;
      
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*');
      if (quizzesError) throw quizzesError;
      
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*');
      if (questionsError) throw questionsError;

      const mappedCategories: CategoryType[] = (categoriesData || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        quizCount: cat.quizcount,
        description: '',
        createdAt: cat.createdat || new Date().toISOString()
      }));

      const mappedQuizzes: QuizType[] = (quizzesData || []).map((quiz: SupabaseQuizType) => 
        mapSupabaseQuizToFrontend(quiz)
      );

      const mappedQuestions: QuizQuestionType[] = (questionsData || []).map((q: SupabaseQuestionType) => 
        mapSupabaseQuestionToFrontend(q)
      );

      setCategories(mappedCategories);
      setQuizzes(mappedQuizzes);
      setQuestions(mappedQuestions);
    } catch (error) {
      toast.error('Failed to fetch initial data');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const addCategory = async (category: Omit<CategoryType, 'id' | 'quizCount' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          icon: category.icon,
          quizcount: 0,
          createdat: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      if (data) {
        const newCategory: CategoryType = {
          id: data[0].id,
          name: data[0].name,
          icon: data[0].icon,
          quizCount: data[0].quizcount,
          description: '',
          createdAt: data[0].createdat || new Date().toISOString()
        };
        setCategories(prev => [...prev, newCategory]);
      }
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  const updateCategory = async (id: number, categoryUpdates: Partial<CategoryType>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryUpdates)
        .eq('id', id);
      
      if (error) throw error;
      
      setCategories(prev => 
        prev.map(category => 
          category.id === id ? { ...category, ...categoryUpdates } : category
        )
      );
    } catch (error) {
      toast.error('Failed to update category');
      console.error(error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (error) {
      toast.error('Failed to delete category');
      console.error(error);
    }
  };

  const addQuiz = async (quiz: Omit<QuizType, 'id' | 'questionsCount' | 'attempts' | 'rating' | 'lastUpdated'>) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to create a quiz');
        return 0;
      }

      const supabaseQuiz = {
        title: quiz.title,
        description: quiz.description,
        categoryid: quiz.categoryId,
        category: quiz.category,
        difficulty: quiz.difficulty,
        timeestimate: quiz.timeEstimate,
        thumbnailurl: quiz.thumbnailUrl,
        status: quiz.status,
        questionscount: 0,
        attempts: 0,
        rating: 0,
        lastupdated: new Date().toISOString()
      };
      
      console.log("Inserting quiz with data:", supabaseQuiz);
      
      const { data, error } = await supabase
        .from('quizzes')
        .insert(supabaseQuiz)
        .select();
      
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const newQuiz = mapSupabaseQuizToFrontend(data[0] as SupabaseQuizType);
        setQuizzes(prev => [...prev, newQuiz]);
        return newQuiz.id;
      }
      
      return 0;
    } catch (error) {
      console.error("Error in addQuiz:", error);
      toast.error('Failed to add quiz: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return 0;
    }
  };

  const updateQuiz = async (id: number, quizUpdates: Partial<QuizType>) => {
    try {
      const supabaseUpdates = mapFrontendQuizToSupabase(quizUpdates);
      
      const { error } = await supabase
        .from('quizzes')
        .update(supabaseUpdates)
        .eq('id', id);
      
      if (error) throw error;
      
      setQuizzes(prev => 
        prev.map(quiz => 
          quiz.id === id ? { ...quiz, ...quizUpdates, lastUpdated: new Date().toISOString() } : quiz
        )
      );
    } catch (error) {
      toast.error('Failed to update quiz');
      console.error(error);
    }
  };

  const deleteQuiz = async (id: number) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
      
      await supabase
        .from('questions')
        .delete()
        .eq('quizid', id);
      
      setQuestions(prev => prev.filter(question => question.quizId !== id));
    } catch (error) {
      toast.error('Failed to delete quiz');
      console.error(error);
    }
  };

  const duplicateQuiz = async (id: number) => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (quizError) throw quizError;
      
      const { data: newQuizData, error: newQuizError } = await supabase
        .from('quizzes')
        .insert({
          title: `${quizData.title} (Copy)`,
          description: quizData.description,
          categoryid: quizData.categoryid,
          category: quizData.category,
          difficulty: quizData.difficulty,
          timeestimate: quizData.timeestimate,
          thumbnailurl: quizData.thumbnailurl,
          status: 'Draft',
          questionscount: 0,
          attempts: 0,
          rating: 0,
          lastupdated: new Date().toISOString()
        })
        .select();
      
      if (newQuizError) throw newQuizError;
      
      if (newQuizData && newQuizData.length > 0) {
        const newQuiz = mapSupabaseQuizToFrontend(newQuizData[0] as SupabaseQuizType);
        setQuizzes(prev => [...prev, newQuiz]);
        
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('quizid', id);
        
        if (questionsError) throw questionsError;
        
        if (questionsData && questionsData.length > 0) {
          const newQuestions = questionsData.map(q => ({
            ...q,
            id: undefined,
            quizid: newQuiz.id
          }));
          
          const { error: insertQuestionsError } = await supabase
            .from('questions')
            .insert(newQuestions);
          
          if (insertQuestionsError) throw insertQuestionsError;
        }
        
        return newQuiz.id;
      }
      return 0;
    } catch (error) {
      toast.error('Failed to duplicate quiz');
      console.error(error);
      return 0;
    }
  };

  const addQuestion = async (question: Omit<QuizQuestionType, 'id'>) => {
    try {
      const supabaseQuestion = {
        quizid: question.quizId,
        text: question.text,
        type: question.type,
        options: question.options,
        correctanswer: question.correctAnswer,
        points: question.points,
        explanation: question.explanation
      };
      
      const { data, error } = await supabase
        .from('questions')
        .insert(supabaseQuestion)
        .select();
      
      if (error) {
        console.error("Error inserting question:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const newQuestion = mapSupabaseQuestionToFrontend(data[0] as SupabaseQuestionType);
        
        setQuestions(prev => {
          const exists = prev.some(q => 
            q.quizId === newQuestion.quizId && 
            q.text === newQuestion.text && 
            q.type === newQuestion.type
          );
          
          if (exists) {
            console.log("Question appears to be already in state, not adding again");
            return prev;
          }
          
          return [...prev, newQuestion];
        });
        
        await supabase.rpc('increment_quiz_questions_count', { quiz_id: question.quizId });
        
        return newQuestion.id;
      }
      return 0;
    } catch (error) {
      toast.error('Failed to add question');
      console.error(error);
      return 0;
    }
  };

  const updateQuestion = async (id: number, questionUpdates: Partial<QuizQuestionType>) => {
    try {
      const supabaseUpdates = mapFrontendQuestionToSupabase(questionUpdates);
      
      const { error } = await supabase
        .from('questions')
        .update(supabaseUpdates)
        .eq('id', id);
      
      if (error) throw error;
      
      setQuestions(prev => 
        prev.map(question => 
          question.id === id ? { ...question, ...questionUpdates } : question
        )
      );
    } catch (error) {
      toast.error('Failed to update question');
      console.error(error);
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      const question = questions.find(q => q.id === id);
      
      if (!question) {
        toast.error('Question not found');
        return;
      }
      
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      setQuestions(prev => prev.filter(q => q.id !== id));
      
      await supabase.rpc('decrement_quiz_questions_count', { quiz_id: question.quizId });
    } catch (error) {
      toast.error('Failed to delete question');
      console.error(error);
    }
  };

  const getQuestionsByQuizId = async (quizId: number) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quizid', quizId);
      
      if (error) throw error;
      
      const mappedQuestions: QuizQuestionType[] = (data || []).map((q: SupabaseQuestionType) => 
        mapSupabaseQuestionToFrontend(q)
      );

      return mappedQuestions;
    } catch (error) {
      toast.error('Failed to fetch quiz questions');
      console.error(error);
      return [];
    }
  };

  return (
    <QuizContext.Provider value={{ 
      categories, 
      quizzes,
      questions,
      addCategory, 
      updateCategory, 
      deleteCategory, 
      addQuiz, 
      updateQuiz, 
      deleteQuiz, 
      duplicateQuiz,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      getQuestionsByQuizId,
      fetchInitialData
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
