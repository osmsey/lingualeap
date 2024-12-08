import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Question } from '../../types/exercise';

interface QuestionDisplayProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  showResult: boolean;
  onAnswerSelect: (answer: string) => void;
  onCheckAnswer: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  showResult,
  onAnswerSelect,
  onCheckAnswer,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="text-gray-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm font-medium text-gray-600">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <Button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="text-gray-600"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="text-heading-3 text-neutral-900">{question.question}</h3>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-md border cursor-pointer transition-colors ${
              showResult
                ? option === question.correctAnswer
                  ? "bg-success-50 border-success-500"
                  : option === selectedAnswer
                  ? "bg-error-50 border-error-500"
                  : "border-neutral-200"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => onAnswerSelect(e.target.value)}
              disabled={showResult}
              className="mt-1"
            />
            <span className="text-body text-neutral-700">{option}</span>
          </label>
        ))}
      </div>
      {!showResult && (
        <Button
          onClick={onCheckAnswer}
          disabled={!selectedAnswer}
          className="w-full mt-4"
        >
          Check Answer
        </Button>
      )}
      {showResult && (
        <div className={`p-4 rounded-md ${
          selectedAnswer === question.correctAnswer
            ? "bg-success-50 text-success-700"
            : "bg-error-50 text-error-700"
        }`}>
          {selectedAnswer === question.correctAnswer
            ? "Correct! Well done!"
            : `Incorrect. The correct answer is: ${question.correctAnswer}`}
        </div>
      )}
    </div>
  );
};
