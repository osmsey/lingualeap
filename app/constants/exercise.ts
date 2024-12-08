export const TOPICS_BY_LEVEL = {
  Beginner: [
    'Present Simple',
    'Past Simple',
    'Future Simple (will)',
    'Present Continuous'
  ],
  Intermediate: [
    'Present Simple',
    'Past Simple',
    'Future Simple (will)',
    'Present Continuous',
    'Past Continuous',
    'Present Perfect',
    'Future Continuous',
    'Going to Future'
  ],
  Advanced: [
    'Present Simple',
    'Past Simple',
    'Future Simple (will)',
    'Present Continuous',
    'Past Continuous',
    'Present Perfect',
    'Past Perfect',
    'Future Perfect',
    'Present Perfect Continuous',
    'Past Perfect Continuous',
    'Future Perfect Continuous',
    'Future in the Past',
    'Mixed Conditionals'
  ]
} as const;

export const QUESTION_COUNT_OPTIONS = [5, 10, 20] as const;

export const generateTitlePlaceholder = (topics: string[]) => {
  if (topics.length === 0) return 'Enter exercise title';
  if (topics.length === 1) return `Exercise on ${topics[0]}`;
  if (topics.length === 2) return `Exercise on ${topics[0]} and ${topics[1]}`;
  return `Exercise on ${topics[0]}, ${topics[1]}, and more`;
};

export const generateUniqueId = () => {
  return 'exercise_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
