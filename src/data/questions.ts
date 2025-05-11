
import { QuizQuestionType } from '@/types/quiz';

export const initialQuestions: QuizQuestionType[] = [
  {
    id: 1,
    quizId: 1,
    text: "What does HTML stand for?",
    type: "multiple-choice",
    options: [
      { id: 1, text: "Hyper Text Markup Language", isCorrect: true },
      { id: 2, text: "High Tech Multi Language", isCorrect: false },
      { id: 3, text: "Hyper Transfer Markup Language", isCorrect: false },
      { id: 4, text: "Home Tool Markup Language", isCorrect: false }
    ],
    points: 10,
    explanation: "HTML stands for HyperText Markup Language and is the standard markup language for creating web pages."
  },
  {
    id: 2,
    quizId: 1,
    text: "Which CSS property is used to change the text color of an element?",
    type: "multiple-choice",
    options: [
      { id: 1, text: "color", isCorrect: true },
      { id: 2, text: "text-color", isCorrect: false },
      { id: 3, text: "font-color", isCorrect: false },
      { id: 4, text: "background-color", isCorrect: false }
    ],
    points: 10,
    explanation: "The CSS property 'color' is used to set the color of the text content."
  },
  {
    id: 3,
    quizId: 2,
    text: "The planet with the most moons in our solar system is:",
    type: "multiple-choice",
    options: [
      { id: 1, text: "Jupiter", isCorrect: false },
      { id: 2, text: "Saturn", isCorrect: true },
      { id: 3, text: "Uranus", isCorrect: false },
      { id: 4, text: "Neptune", isCorrect: false }
    ],
    points: 10,
    explanation: "Saturn has 82 confirmed moons, the most of any planet in our solar system."
  },
  {
    id: 4,
    quizId: 2,
    text: "The sun is a star.",
    type: "true-false",
    options: [
      { id: 1, text: "True", isCorrect: true },
      { id: 2, text: "False", isCorrect: false }
    ],
    points: 5,
    explanation: "The sun is indeed a star - specifically a G-type main-sequence star (G2V) at the center of our solar system."
  },
  {
    id: 5,
    quizId: 3,
    text: "Who wrote 'Pride and Prejudice'?",
    type: "multiple-choice",
    options: [
      { id: 1, text: "Jane Austen", isCorrect: true },
      { id: 2, text: "Charlotte Brontë", isCorrect: false },
      { id: 3, text: "Emily Dickinson", isCorrect: false },
      { id: 4, text: "George Eliot", isCorrect: false }
    ],
    points: 10,
    explanation: "Pride and Prejudice was written by Jane Austen and first published in 1813."
  },
  {
    id: 6,
    quizId: 1,
    text: "Explain how JavaScript differs from Java.",
    type: "descriptive",
    correctAnswer: "JavaScript is a scripting language primarily used for web development, while Java is a general-purpose programming language. Despite the similar names, they have different syntax, use cases, and execution environments.",
    points: 15,
    explanation: "This is an open-ended question to test understanding of programming languages."
  }
];
