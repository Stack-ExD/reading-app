"use client";
import { useState } from "react";
import { passage, mockQuestions } from "@/lib/data";

export default function ReadingInterface() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Reading, 1: Questions, 2: Results
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const paragraphs = passage.content.split("\n\n");

  const handleFinishReading = () => setCurrentStep(1);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const calculateScore = () => {
    // TODO: AI call to evaluate answers
    // Dummy marking, we just count answers longer than 10 characters
    const score = mockQuestions.filter(
      (q) => (answers[q.id] || "").length > 10
    ).length;
    return score;
  };

  if (currentStep === 2 || showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadown-sm border">
        <h2> Assessment Complete!</h2>
        <p>
          You answerd {Object.keys(answers).length} out of{" "}
          {mockQuestions.length}.
        </p>
        <p>
          Score: {calculateScore()}/{mockQuestions.length}
        </p>
        <button onClick={() => window.location.reload()}>
          Try Another Passage
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 ">
      {/*Left side: Passage*/}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">
          {passage.title}
        </h1>
        <div>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {currentStep === 0 && (
          <button
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-700 trabsition-colors"
            onClick={handleFinishReading}
          >
            I&apos;ve finished reading
          </button>
        )}
      </div>

      <div className="bg-slate-50">
        {/*Right Side: Questions and Results*/}
        {currentStep === 0 ? (
          <div>Questions will appear after reading</div>
        ) : (
          <div>
            {mockQuestions.map((q, index) => (
              <div key={q.id} className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  {index + 1}. {q.question}
                </label>
                <textarea
                  placeholder="Typer your answer here..."
                  rows={3}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                ></textarea>
              </div>
            ))}
            <button
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                Object.keys(answers).length >= mockQuestions.length
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-xl"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
              onClick={() => setShowResults(true)}
              disabled={Object.keys(answers).length < mockQuestions.length}
            >
              Submit for grading
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
