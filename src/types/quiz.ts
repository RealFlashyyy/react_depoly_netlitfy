
export type QuizQuestionType = {
  id: number;
  quizId: number;
  text: string;
  type: "multiple-choice" | "true-false" | "descriptive";
  options?: {
    id: number;
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer?: string;
  points: number;
  explanation?: string;
};

export type QuizSubmissionType = {
  id: number;
  quizId: number;
  userId: string;
  userName: string;
  score: number;
  maxScore: number;
  completedAt: string;
  answers: {
    questionId: number;
    selectedOptionId?: number;
    answerText?: string;
    isCorrect: boolean;
    points: number;
  }[];
};

// Frontend QuizType using camelCase
export type QuizType = {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  category: string;
  difficulty: string;
  timeEstimate: string;
  thumbnailUrl?: string;
  status: 'Draft' | 'Published';
  questionsCount: number;
  attempts: number;
  rating: number;
  lastUpdated: string;
};

// Supabase database schema using snake_case
export type SupabaseQuizType = {
  id: number;
  title: string;
  description: string;
  categoryid: number;
  category: string;
  difficulty: string;
  timeestimate: string;
  thumbnailurl: string | null;
  status: 'Draft' | 'Published';
  questionscount: number;
  attempts: number;
  rating: number;
  lastupdated: string | null;
};

// Supabase database schema for questions using snake_case
export type SupabaseQuestionType = {
  id: number;
  quizid: number;
  text: string;
  type: "multiple-choice" | "true-false" | "descriptive";
  options: any | null;
  correctanswer: string | null;
  points: number;
  explanation: string | null;
};
