export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ExerciseResponse {
  questions: Question[];
}

export interface ExerciseMetadata {
  id: string;
  title: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  selectedTopics: string[];
  learningObjective: string;
  questionCount: number;
  additionalText?: string;
}
