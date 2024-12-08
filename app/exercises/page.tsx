"use client";

import React, { useState } from "react";
import { ExerciseGenerator } from "../components/exercise/ExerciseGenerator";
import MultipleChoiceExerciseCreator from "../components/exercise/MultipleChoiceExerciseCreator";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

export default function ExercisesPage() {
  const [showCreator, setShowCreator] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-heading-1 text-neutral-900">Exercise Generator</h1>
            <p className="text-body text-neutral-600 mt-2">
              Enter any text and generate a multiple choice exercise to test understanding.
            </p>
          </div>
          <Button
            onClick={() => setShowCreator(!showCreator)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showCreator ? "Close Creator" : "Create Exercise"}
          </Button>
        </div>
        
        {showCreator ? (
          <div className="mb-8">
            <MultipleChoiceExerciseCreator />
          </div>
        ) : (
          <ExerciseGenerator />
        )}
      </div>
    </div>
  );
}
