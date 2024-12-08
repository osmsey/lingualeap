import React from 'react';
import { Button } from '@/components/ui/button';
import { ExerciseMetadata } from '@/types/exercise';

interface DifficultySelectorProps {
  selectedDifficulty: ExerciseMetadata['difficultyLevel'];
  onDifficultyChange: (level: ExerciseMetadata['difficultyLevel']) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Choose Difficulty Level</h3>
      <div className="grid grid-cols-3 gap-4">
        {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
          <Button
            key={level}
            onClick={() => onDifficultyChange(level)}
            className={`h-16 ${
              selectedDifficulty === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {level}
          </Button>
        ))}
      </div>
    </div>
  );
};
