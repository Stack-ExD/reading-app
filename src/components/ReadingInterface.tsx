"use client";
import { useEffect, useState } from "react";
import { passage } from "@/lib/data";
import ReadingPanel from "./ReadingPanel";
import QuestionsPanel from "./QuestionsPanel";

export default function ReadingInterface() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Reading, 1: Questions, 2: Results
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    total: number;
    feedback: string;
  } | null>(null);

  const handleFinishReading = () => setCurrentStep(1);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          body: JSON.stringify({ passage: passage.content }),
        });
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to generate questions:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const calculateScore = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/evaluate-answers", {
        method: "POST",
        body: JSON.stringify({
          passage: passage.content,
          questions: questions,
          userAnswers: answers,
        }),
      });

      const result = await res.json();
      setEvaluation(result);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to generate feedback:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (currentStep === 2 || showResults) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-card text-card-foreground rounded-2xl shadow-xl border border-border mt-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Assessment Complete!
          </h2>
          <p className="text-muted-foreground mt-2">
            You&apos;ve successfully finished the comprehension exercise.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-10 text-left">
          <div className="p-6 bg-secondary/30 rounded-2xl border border-border/50">
            <p className="text-sm font-bold mb-2"> Feedback</p>
            <p>{evaluation?.feedback || "No feedback provided"}</p>
          </div>
          <div className="grid gap-4">
            <div className="p-4 bg-secondary/50 rounded-xl">
              <p className="text-xs text-muted-foreground font-bold uppercase">
                Score
              </p>
              <p className="text-2xl font-black">
                {evaluation?.score} / {evaluation?.total}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
        >
          Try Another Passage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <ReadingPanel passage={passage} onFinish={handleFinishReading} />

      <div className="lg:sticky lg:top-12">
        {isGenerating && currentStep === 1 ? (
          <div className="flex items-center justify-center h-64">
            <p className="animate-pulse text-muted-foreground font-bold">
              Evaluating Answers...
            </p>
          </div>
        ) : (
          <QuestionsPanel
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSubmit={calculateScore}
            isLocked={currentStep === 0}
          />
        )}
      </div>
    </div>
  );
}
