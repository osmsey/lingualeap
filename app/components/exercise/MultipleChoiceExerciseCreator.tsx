import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DifficultySelector } from './DifficultySelector';
import { TopicSelector } from './TopicSelector';
import { ExerciseDetails } from './ExerciseDetails';
import { QuestionDisplay } from './QuestionDisplay';
import { generateTitlePlaceholder, generateUniqueId } from '../../constants/exercise';
import { ExerciseMetadata, ExerciseResponse } from '@/types/exercise';

const MultipleChoiceExerciseCreator: React.FC = () => {
  const [exerciseMetadata, setExerciseMetadata] = useState<ExerciseMetadata>({
    id: generateUniqueId(),
    title: '',
    difficultyLevel: 'Beginner',
    selectedTopics: [],
    learningObjective: '',
    questionCount: 5,
    additionalText: ''
  });

  const [showTopics, setShowTopics] = useState(false);
  const [showLearningObjective, setShowLearningObjective] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exerciseResponse, setExerciseResponse] = useState<ExerciseResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = exerciseResponse?.questions[currentQuestionIndex];

  const handleDifficultyChange = (level: ExerciseMetadata['difficultyLevel']) => {
    setExerciseMetadata(prev => ({
      ...prev,
      difficultyLevel: level,
      selectedTopics: []
    }));
    setShowTopics(true);
  };

  const handleTopicToggle = (topic: string) => {
    setExerciseMetadata(prev => {
      const isSelected = prev.selectedTopics.includes(topic);
      const newTopics = isSelected
        ? prev.selectedTopics.filter(t => t !== topic)
        : [...prev.selectedTopics, topic];
      return {
        ...prev,
        selectedTopics: newTopics,
        title: prev.title || generateTitlePlaceholder(newTopics)
      };
    });
  };

  const generatePromptTemplate = () => {
    const parts = [
      `Create a multiple choice exercise with the following parameters:`,
      `- Difficulty Level: ${exerciseMetadata.difficultyLevel}`,
      `- Number of Questions: ${exerciseMetadata.questionCount}`,
      `- Topics: ${exerciseMetadata.selectedTopics.join(', ')}`,
    ];

    if (exerciseMetadata.additionalText?.trim()) {
      parts.push(`\nAdditional Context:\n${exerciseMetadata.additionalText.trim()}`);
    }

    return parts.join('\n');
  };

  const generateExercise = async () => {
    if (exerciseMetadata.selectedTopics.length === 0) {
      setError("Please select at least one topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setExerciseResponse(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestionIndex(0);
    
    try {
      const response = await fetch("/api/generate-exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: generatePromptTemplate(),
          metadata: exerciseMetadata
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate exercise");
      }

      setExerciseResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate exercise. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Multiple Choice Exercise Creator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <DifficultySelector
            selectedDifficulty={exerciseMetadata.difficultyLevel}
            onDifficultyChange={handleDifficultyChange}
          />

          {showTopics && (
            <TopicSelector
              difficultyLevel={exerciseMetadata.difficultyLevel}
              selectedTopics={exerciseMetadata.selectedTopics}
              onTopicToggle={handleTopicToggle}
            />
          )}

          {exerciseMetadata.selectedTopics.length > 0 && (
            <>
              <ExerciseDetails
                title={exerciseMetadata.title}
                questionCount={exerciseMetadata.questionCount}
                learningObjective={exerciseMetadata.learningObjective}
                additionalText={exerciseMetadata.additionalText}
                showLearningObjective={showLearningObjective}
                titlePlaceholder={generateTitlePlaceholder(exerciseMetadata.selectedTopics)}
                onTitleChange={(value) => setExerciseMetadata({...exerciseMetadata, title: value})}
                onQuestionCountChange={(count) => setExerciseMetadata({...exerciseMetadata, questionCount: count})}
                onLearningObjectiveChange={(value) => setExerciseMetadata({...exerciseMetadata, learningObjective: value})}
                onAdditionalTextChange={(value) => setExerciseMetadata({...exerciseMetadata, additionalText: value})}
                onLearningObjectiveToggle={() => setShowLearningObjective(!showLearningObjective)}
              />

              <Button
                onClick={generateExercise}
                disabled={loading || exerciseMetadata.selectedTopics.length === 0}
                className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? "Generating..." : "Generate Exercise"}
              </Button>

              {error && (
                <div className="bg-error-50 text-error-600 p-4 rounded-md">
                  {error}
                </div>
              )}

              {currentQuestion && (
                <QuestionDisplay
                  question={currentQuestion}
                  currentIndex={currentQuestionIndex}
                  totalQuestions={exerciseResponse?.questions.length || 0}
                  selectedAnswer={selectedAnswer}
                  showResult={showResult}
                  onAnswerSelect={setSelectedAnswer}
                  onCheckAnswer={() => setShowResult(true)}
                  onPrevious={() => {
                    setCurrentQuestionIndex(prev => prev - 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                  }}
                  onNext={() => {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultipleChoiceExerciseCreator;
