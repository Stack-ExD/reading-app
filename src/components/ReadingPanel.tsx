import { useState } from "react";

interface ReadingPanelProps {
  passage: {
    title: string;
    content: string;
  };
  onFinish: () => void;
}

export default function ReadingPanel({ passage, onFinish }: ReadingPanelProps) {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const paragraphs = passage.content.split("\n\n");

  const handleNextParagraph = () => {
    if (currentParagraphIndex < paragraphs.length - 1) {
      setCurrentParagraphIndex((prevIndex) => prevIndex + 1);
    } else {
      onFinish();
    }
  };

  const handlePrevParagraph = () => {
    if (currentParagraphIndex > 0) {
      setCurrentParagraphIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-5xl font-black text-foreground">{passage.title}</h1>
        <div className="h-1.5 w-20 bg-primary rounded-full" />
      </header>

      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-xl font-medium leading-relaxed opacity-85 transition-all duration-300">
          {paragraphs[currentParagraphIndex]}
        </p>
      </div>

      <div className="flex items-center justify-between mt-8 gap-4">
        <button
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            currentParagraphIndex === 0
              ? "opacity-0 pointer-events-none"
              : "bg-secondary text-foreground hover:bg-secondary/80"
          }`}
          onClick={handlePrevParagraph}
        >
          Previous
        </button>

        <div className="text-sm font-bold text-muted-foreground">
          {currentParagraphIndex + 1} / {paragraphs.length}
        </div>

        <button
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all"
          onClick={handleNextParagraph}
        >
          {currentParagraphIndex < paragraphs.length - 1 ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
}
