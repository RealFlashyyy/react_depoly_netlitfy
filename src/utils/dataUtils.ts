
// Types for our data model
export type CategoryType = {
  id: number;
  name: string;
  icon: string;
  quizCount: number;
  description: string;
  createdAt: string;
};

export type QuizType = {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryId: number;
  difficulty: string;
  questionsCount: number;
  timeEstimate: string;
  attempts: number;
  rating?: number;
  status: "Draft" | "Published";
  lastUpdated: string;
  thumbnailUrl?: string; // Made optional to match the type in src/types/quiz.ts
};

export type QuestionType = {
  id: number;
  quizId: number;
  text: string;
  type: "multiple-choice" | "true-false";
  options: OptionType[];
  correctOptionId: number;
  explanation?: string;
};

export type OptionType = {
  id: number;
  text: string;
};

// Format a date string into a readable format
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Generate a random ID for new items
export const generateId = (): number => {
  return Math.floor(Math.random() * 10000) + 1;
};

// Get a random thumbnail URL if none is provided
export const getRandomThumbnail = (): string => {
  const thumbnails = [
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&h=400&q=80",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&h=400&q=80",
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&h=400&q=80",
    "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&h=400&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=400&q=80"
  ];
  return thumbnails[Math.floor(Math.random() * thumbnails.length)];
};

// Find a category by ID
export const findCategoryById = (categories: CategoryType[], id: number): CategoryType | undefined => {
  return categories.find(category => category.id === id);
};

// Find a quiz by ID
export const findQuizById = (quizzes: QuizType[], id: number): QuizType | undefined => {
  return quizzes.find(quiz => quiz.id === id);
};

// Helper to truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
