interface Question {
  id: number;
  question: string;
}

interface QuestionsPanelProps {
  questions: Question[];
  answers: Record<number, string>;
  onAnswerChange: (questionId: number, answer: string) => void;
  onSubmit: () => void;
  isLocked: boolean;
}

export default function QuestionsPanel({
  questions,
  answers,
  onAnswerChange,
  onSubmit,
  isLocked,
}: QuestionsPanelProps) {
  if (isLocked) {
    return (
      <div className="bg-secondary/30 border-2 border-dashed border-border rounded-[2rem] p-16 text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">
            Questions locked
          </h3>
          <p className="text-muted-foreground text-lg">
            Focus on the story first. Once you finish reading, we&apos;ll check
            your understanding.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-black">Questions</h2>
          <p className="text-muted-foreground font-medium">
            Test your comprehension
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="group bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 space-y-5"
          >
            <label className="block text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-secondary rounded-lg text-sm font-black mr-3 align-middle">
                {index + 1}
              </span>
              {q.question}
            </label>
            <textarea
              placeholder="Type your response here..."
              className="w-full p-5 bg-secondary/30 border border-transparent rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none min-h-[140px] outline-none text-lg font-medium"
              value={answers[q.id] || ""}
              onChange={(e) => onAnswerChange(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button
          className={`w-full py-6 rounded-2xl font-black text-2xl transition-all shadow-2xl ${
            Object.keys(answers).length >= questions.length
              ? "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/30"
              : "bg-muted text-muted-foreground cursor-not-allowed grayscale"
          }`}
          onClick={onSubmit}
          disabled={Object.keys(answers).length < questions.length}
        >
          Submit for Evaluation
        </button>
      </div>
    </div>
  );
}
