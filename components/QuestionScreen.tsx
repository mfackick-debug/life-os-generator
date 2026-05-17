"use client";

interface Choice {
  id: string;
  label: string;
}

interface QuestionScreenProps {
  questionNumber: number;
  questionText: string;
  choices: Choice[];
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function QuestionScreen({
  questionNumber,
  questionText,
  choices,
  selectedAnswer,
  onAnswer,
  onNext,
  isLast,
}: QuestionScreenProps) {
  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            質問 {questionNumber} / 2
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {questionText}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            あなたの人相に一番近いものを選んでください
            {selectedAnswer && (
              <span className="block mt-1 text-sm text-accent-500">
                ※ AI解析結果が初期選択されています。手動で変更できます。
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          {choices.map((choice) => {
            const isSelected = selectedAnswer === choice.id;
            return (
              <button
                key={choice.id}
                onClick={() => onAnswer(choice.id)}
                className={`group flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20 shadow-lg scale-[1.02]"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {/* Choice letter badge */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 transition-colors ${
                    isSelected
                      ? "bg-accent-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-accent-100 dark:group-hover:bg-accent-900/30"
                  }`}
                >
                  {choice.id}
                </div>

                <span
                  className={`text-lg font-bold ${
                    isSelected
                      ? "text-accent-600 dark:text-accent-400"
                      : "text-foreground"
                  }`}
                >
                  {choice.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 次へボタン */}
        <div className="pt-8 text-center">
          <button
            onClick={onNext}
            disabled={!selectedAnswer}
            className={`px-10 py-4 rounded-xl font-bold text-white transition-all duration-200 ${
              selectedAnswer
                ? "bg-foreground dark:bg-white dark:text-foreground hover:scale-[1.02] shadow-lg"
                : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70"
            }`}
          >
            {isLast ? "診断を実行する" : "次へ進む"}
            <svg
              className="w-5 h-5 inline ml-2 -mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
