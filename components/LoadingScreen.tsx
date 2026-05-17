"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loadingText, setLoadingText] = useState("運命データを解析中...");

  useEffect(() => {
    // 1.5秒後にテキストを変更
    const textTimer = setTimeout(() => {
      setLoadingText("メンタルモデルを適用中...");
    }, 1500);

    return () => {
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="space-y-8 text-center animate-fade-in-up">
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto">
          <svg
            className="animate-spin w-full h-full text-slate-200 dark:text-slate-800"
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
            />
            <path
              className="text-accent-500"
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></div>
          </div>
        </div>

        <p className="text-xl md:text-2xl font-bold text-foreground transition-opacity duration-300">
          {loadingText}
        </p>
      </div>
    </div>
  );
}
