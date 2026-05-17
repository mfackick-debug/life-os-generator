"use client";

interface ResultScreenProps {
  result: string;
  error: string;
  onRestart: () => void;
}

/**
 * 簡易的なMarkdown→HTML変換（改行・見出し・リスト・太字に対応）
 */
function renderMarkdown(text: string): string {
  return text
    // エスケープ
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // 見出し (h1-h3)
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold border-b pb-4 mb-6 mt-10">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-extrabold mb-6">$1</h1>')
    // 太字
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // リスト
    .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>')
    // 改行を <br/> に変換（連続改行は段落に）
    .replace(/\n\n/g, "</p><p class='mb-4'>")
    .replace(/\n/g, "<br/>")
    // 全体を段落でラップ
    .replace(/^/, "<p class='mb-4'>")
    .replace(/$/, "</p>");
}

export default function ResultScreen({ result, error, onRestart }: ResultScreenProps) {
  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-3xl space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">
            Analysis Complete
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            あなたに最適なメンタルモデルと人生戦略
          </p>
        </div>

        {error ? (
          /* エラー表示 */
          <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl shadow-xl border border-red-200 dark:border-red-800 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">エラーが発生しました</h3>
            </div>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              DEEPSEEK_API_KEY が環境変数に設定されているか確認してください。
            </p>
          </div>
        ) : (
          /* 結果表示 */
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-10">
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
            />
          </div>
        )}

        <div className="pt-8 text-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-foreground dark:text-white bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:border-foreground dark:hover:border-white rounded-full transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            最初からやり直す
          </button>
        </div>
      </div>
    </div>
  );
}
