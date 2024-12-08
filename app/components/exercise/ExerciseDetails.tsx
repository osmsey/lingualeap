import React, { ChangeEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QUESTION_COUNT_OPTIONS } from '../../constants/exercise';

interface ExerciseDetailsProps {
  title: string;
  questionCount: number;
  learningObjective: string;
  additionalText?: string;
  showLearningObjective: boolean;
  titlePlaceholder: string;
  onTitleChange: (value: string) => void;
  onQuestionCountChange: (count: number) => void;
  onLearningObjectiveChange: (value: string) => void;
  onAdditionalTextChange: (value: string) => void;
  onLearningObjectiveToggle: () => void;
}

export const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({
  title,
  questionCount,
  learningObjective,
  additionalText,
  showLearningObjective,
  titlePlaceholder,
  onTitleChange,
  onQuestionCountChange,
  onLearningObjectiveChange,
  onAdditionalTextChange,
  onLearningObjectiveToggle,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Exercise Title</label>
        <Input
          placeholder={titlePlaceholder}
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onTitleChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Number of Questions</label>
        <div className="grid grid-cols-3 gap-4">
          {QUESTION_COUNT_OPTIONS.map((count) => (
            <Button
              key={count}
              onClick={() => onQuestionCountChange(count)}
              className={`${
                questionCount === count
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {count} Questions
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Additional Context (Optional)</label>
        <Textarea
          placeholder="Enter any additional context or specific requirements..."
          value={additionalText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onAdditionalTextChange(e.target.value)}
          className="w-full h-32"
        />
      </div>

      <div className="border rounded-lg p-4 mb-10">
        <button
          onClick={onLearningObjectiveToggle}
          className="flex justify-between items-center w-full text-left"
        >
          <span className="text-sm font-medium text-gray-700">Learning Objective</span>
          {showLearningObjective ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {showLearningObjective && (
          <div className="mt-4">
            <Textarea
              placeholder="Enter learning objective"
              value={learningObjective}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onLearningObjectiveChange(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};
