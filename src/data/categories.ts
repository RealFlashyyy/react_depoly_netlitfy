
import { CategoryType } from '@/utils/dataUtils';

export const initialCategories: CategoryType[] = [
  {
    id: 1,
    name: "Technology",
    icon: "code",
    quizCount: 2,
    description: "Quizzes related to programming, computers, and digital technology",
    createdAt: "2023-01-15"
  },
  {
    id: 2,
    name: "Science",
    icon: "brain",
    quizCount: 2,
    description: "Quizzes covering various fields of science including physics, chemistry, and biology",
    createdAt: "2023-01-20"
  },
  {
    id: 3,
    name: "Literature",
    icon: "book",
    quizCount: 1,
    description: "Test your knowledge of books, authors, and literary works",
    createdAt: "2023-02-05"
  },
  {
    id: 4,
    name: "General Knowledge",
    icon: "lightbulb",
    quizCount: 0,
    description: "A mix of questions covering a wide range of general topics",
    createdAt: "2023-02-10"
  },
  {
    id: 5,
    name: "Geography",
    icon: "globe",
    quizCount: 1,
    description: "Questions about countries, capitals, landmarks, and geographical features",
    createdAt: "2023-03-01"
  },
  {
    id: 6,
    name: "Health",
    icon: "heart",
    quizCount: 1,
    description: "Quizzes on health, nutrition, fitness, and medical knowledge",
    createdAt: "2023-03-15"
  }
];
