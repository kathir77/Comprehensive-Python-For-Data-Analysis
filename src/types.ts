export interface Flashcard {
  term: string;
  definition: string;
}

export interface Project {
  title: string;
  description: string;
  tasks: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  concepts: string[];
  conceptExplanations?: { title: string; explanation: string }[];
  diagram?: 'spark-arch' | 'pandas-flow';
  codeSnippet?: string;
  codeExplanation?: string;
  flashcards?: Flashcard[];
  projects?: Project[];
  quiz?: QuizQuestion[];
}
