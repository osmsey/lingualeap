import { NextResponse } from "next/server";

interface ExerciseMetadata {
  id: string;
  title: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  selectedTopics: string[];
  learningObjective: string;
  questionCount: number;
  additionalText?: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ExerciseData {
  questions: Question[];
}

function parseExerciseResponse(text: string): Question[] {
  const questions: Question[] = [];
  const sections = text.split('---QUESTION---').filter(Boolean);

  for (const section of sections) {
    const lines = section.trim().split('\n').filter(Boolean);
    if (lines.length < 6) continue; // Question + 4 options + correct answer

    const question = lines[0].replace('Q:', '').trim();
    const options = lines.slice(1, 5).map(line => line.replace(/^[A-D]\)\s*/, '').trim());
    const correctAnswer = lines[5].replace('CORRECT:', '').trim();

    questions.push({
      question,
      options,
      correctAnswer
    });
  }

  return questions;
}

async function generateQuestions(
  metadata: ExerciseMetadata,
  apiKey: string,
  remainingCount: number
): Promise<Question[]> {
  const template = `---QUESTION---
Q: What is the correct form of the verb 'to be' in Present Simple for 'he'?
A) is
B) am
C) are
D) be
CORRECT: is`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      system: `You are an expert at creating educational exercises. Your task is to create multiple choice questions.
              You must respond using the exact format shown in the template, with clear section delimiters.`,
      messages: [{
        role: "user",
        content: `Create ${remainingCount} multiple choice questions about ${metadata.selectedTopics.join(', ')} at ${metadata.difficultyLevel} level.

        Use this exact format for your response:

        ${template}

        Requirements:
        1. Use the EXACT same format as the template
        2. Create EXACTLY ${remainingCount} questions
        3. Each question must have exactly 4 options labeled A) through D)
        4. Mark the correct answer with CORRECT:
        5. Separate questions with ---QUESTION---
        6. Questions should match the ${metadata.difficultyLevel} level
        7. Focus on the topics: ${metadata.selectedTopics.join(', ')}
        8. Return ONLY the questions in this format, no other text`
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.content || !Array.isArray(data.content) || !data.content[0]?.text) {
    throw new Error("Invalid response format from Claude");
  }

  return parseExerciseResponse(data.content[0].text);
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { text, metadata } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const targetQuestionCount = metadata?.questionCount || 1;
    let allQuestions: Question[] = [];
    let attempts = 0;
    const maxAttempts = 3;

    while (allQuestions.length < targetQuestionCount && attempts < maxAttempts) {
      try {
        const remainingCount = targetQuestionCount - allQuestions.length;
        console.log(`Attempt ${attempts + 1}: Generating ${remainingCount} questions...`);

        const newQuestions = await generateQuestions(
          metadata,
          process.env.ANTHROPIC_API_KEY,
          remainingCount
        );

        // Validate questions
        newQuestions.forEach((question, index) => {
          if (!question.question || !Array.isArray(question.options) || !question.correctAnswer) {
            throw new Error(`Invalid format for question ${index + 1}`);
          }
          if (question.options.length !== 4) {
            throw new Error(`Question ${index + 1} must have exactly 4 options`);
          }
          if (!question.options.includes(question.correctAnswer)) {
            throw new Error(`Correct answer must be one of the options for question ${index + 1}`);
          }
        });

        allQuestions = [...allQuestions, ...newQuestions];
        console.log(`Generated ${newQuestions.length} questions. Total: ${allQuestions.length}/${targetQuestionCount}`);

      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
      }

      attempts++;
    }

    if (allQuestions.length === 0) {
      throw new Error("Failed to generate any valid questions after multiple attempts");
    }

    if (allQuestions.length < targetQuestionCount) {
      console.warn(`Warning: Only generated ${allQuestions.length} questions out of ${targetQuestionCount} requested`);
    }

    return NextResponse.json({ questions: allQuestions });
  } catch (error) {
    console.error("Error generating exercise:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate exercise" },
      { status: 500 }
    );
  }
}
