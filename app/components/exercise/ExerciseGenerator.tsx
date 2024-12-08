"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const ExerciseGenerator: React.FC = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateExercise = async () => {
    if (!text.trim()) {
      setError("Please enter some text to generate an exercise.");
      return;
    }

    setLoading(true);
    setError(null);
    setExercise(null);
    setSelectedAnswer(null);
    setShowResult(false);
    
    try {
      const response = await fetch("/api/generate-exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate exercise");
      }

      setExercise(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate exercise. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      setError("Please select an answer");
      return;
    }
    setShowResult(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-heading-2 text-neutral-900">Generate Exercise</h2>
        <div className="space-y-2">
          <label className="text-body-bold text-neutral-700 block">
            Enter text to generate an exercise
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-4 rounded-md border border-neutral-200 text-body focus:border-brand-600 focus:ring-1 focus:ring-brand-600 resize-none"
            placeholder="Enter text here..."
          />
        </div>
        <Button
          onClick={generateExercise}
          disabled={loading || !text.trim()}
          className="w-full h-12 bg-brand-600 text-white hover:bg-brand-700"
        >
          {loading ? "Generating..." : "Generate Exercise"}
        </Button>
      </div>

      {error && (
        <div className="bg-error-50 text-error-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {exercise && (
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-heading-3 text-neutral-900">{exercise.question}</h3>
          <div className="space-y-3">
            {exercise.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  showResult
                    ? option === exercise.correctAnswer
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
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showResult}
                  className="mt-1"
                />
                <span className="text-body text-neutral-700">{option}</span>
              </label>
            ))}
          </div>
          {!showResult && (
            <Button
              onClick={checkAnswer}
              disabled={!selectedAnswer}
              className="w-full mt-4"
            >
              Check Answer
            </Button>
          )}
          {showResult && (
            <div className={`p-4 rounded-md ${
              selectedAnswer === exercise.correctAnswer
                ? "bg-success-50 text-success-700"
                : "bg-error-50 text-error-700"
            }`}>
              {selectedAnswer === exercise.correctAnswer
                ? "Correct! Well done!"
                : `Incorrect. The correct answer is: ${exercise.correctAnswer}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
