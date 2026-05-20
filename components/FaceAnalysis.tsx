"use client";

import { useState, useRef } from "react";

interface FaceAnalysisProps {
  onAnalysisComplete: (result: { q1: string; q2: string }) => void;
  onSkip: () => void;
  onError?: () => void;
  onBack?: () => void;
}

/**
 * 画像をBase64に変換する
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Gemini APIを使って顔画像を解析する
 */
async function analyzeFace(file: File): Promise<{ q1: string; q2: string }> {
  const base64Image = await fileToBase64(file);

  const response = await fetch("/api/analyze-face", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  const data = await response.json();
  return { q1: data.q1, q2: data.q2 };
}

export default function FaceAnalysis({
  onAnalysisComplete,
  onSkip,
  onError,
  onBack,
}: FaceAnalysisProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeText, setAnalyzeText] = useState(
    "写真をアップロードしてください"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImage(file);
  };

  const processImage = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setIsAnalyzing(true);
    setAnalyzeText("顔写真を解析中...");

    try {
      const result = await analyzeFace(file);
      setAnalyzeText("解析が完了しました！");
      onAnalysisComplete(result);
    } catch (err) {
      console.error("解析エラー:", err);
      setAnalyzeText("解析に失敗しました。もう一度お試しください。");
      if (onError) {
        onError();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl animate-fade-in-up border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-4 text-foreground">
          顔写真の登録
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
          顔写真をアップロードしてください
        </p>

        <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="アップロードされた顔写真"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">写真がここに表示されます</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-2xl">
              <svg
                className="animate-spin w-12 h-12 text-white mb-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-30"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-white font-semibold">解析中...</p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          {analyzeText}
        </p>

        <div className="space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center -mt-2 mb-2">
            ※アップロードされた写真は解析直後に完全に破棄され、保存されません。
          </p>

          <button
            onClick={handleUploadClick}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-xl font-bold text-white bg-foreground dark:bg-white dark:text-foreground hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5 inline mr-2 -mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            画像をアップロード
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {!isAnalyzing && (
            <div className="pt-2">
              <button
                onClick={onSkip}
                className="w-full py-3 rounded-xl font-bold text-slate-400 dark:text-slate-500 bg-transparent border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-500 dark:hover:text-slate-400 transition-all duration-200"
              >
                写真をスキップして手動で特徴を選ぶ
              </button>
            </div>
          )}

          {onBack && !isAnalyzing && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 bg-transparent border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              ← 戻る
            </button>
          )}
        </div>
      </div>
    </div>
  );
}