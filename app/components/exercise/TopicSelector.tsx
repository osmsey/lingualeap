import React from 'react';
import { TOPICS_BY_LEVEL } from '../../constants/exercise';
import { ExerciseMetadata } from '@/types/exercise';

interface TopicSelectorProps {
  difficultyLevel: ExerciseMetadata['difficultyLevel'];
  selectedTopics: string[];
  onTopicToggle: (topic: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  difficultyLevel,
  selectedTopics,
  onTopicToggle,
}) => {
  const handleTopicClick = (topic: string) => {
    onTopicToggle(topic);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Select Topics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {TOPICS_BY_LEVEL[difficultyLevel].map((topic: string) => (
          <button
            key={topic}
            onClick={() => handleTopicClick(topic)}
            className={`p-3 rounded-lg border text-sm transition-colors ${
              selectedTopics.includes(topic)
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};
