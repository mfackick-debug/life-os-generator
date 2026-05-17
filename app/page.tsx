"use client";

import { useState } from "react";
import TopScreen from "@/components/TopScreen";
import BasicInfo from "@/components/BasicInfo";
import FaceAnalysis from "@/components/FaceAnalysis";
import QuestionScreen from "@/components/QuestionScreen";
import LoadingScreen from "@/components/LoadingScreen";
import ResultScreen from "@/components/ResultScreen";

type Step =
  | "top"
  | "basic"
  | "face"
  | "q1"
  | "q2"
  | "loading"
  | "result";

interface BasicInfoData {
  name: string;
  dob: string;
  gender: string;
}

interface FaceAnalysisResult {
  q1: string;
  q2: string;
}

const questions = [
  {
    id: "q1",
    questionText: "あなたの輪郭のタイプは？",
    choices: [
      { id: "A", label: "スマート（細め・シャープ）" },
      { id: "B", label: "ニュートラル（バランス型）" },
      { id: "C", label: "スクエア（四角形・がっしり）" },
    ],
  },
  {
    id: "q2",
    questionText: "あなたの目元のタイプは？",
    choices: [
      { id: "A", label: "切れ長（目尻が上がっている）" },
      { id: "B", label: "丸目（大きな瞳）" },
      { id: "C", label: "穏やか（優しい印象）" },
    ],
  },
];

export default function Home() {
  const [step, setStep] = useState<Step>("top");

  const [basicInfo, setBasicInfo] = useState<BasicInfoData | null>(null);
  const [faceResult, setFaceResult] = useState<FaceAnalysisResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleBasicInfoNext = (data: BasicInfoData) => {
    setBasicInfo(data);
    setStep("face");
  };

  const handleFaceAnalysisComplete = (result: FaceAnalysisResult) => {
    setFaceResult(result);
    // 解析結果を初期値としてanswersにセット
    setAnswers({ q1: result.q1, q2: result.q2 });
    setStep("q1");
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = (currentId: string) => {
    if (currentId === "q1") {
      setStep("q2");
    } else if (currentId === "q2") {
      setStep("loading");
      generateResult();
    }
  };

  const generateResult = async () => {
    if (!basicInfo) return;

    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: basicInfo.name,
          dob: basicInfo.dob,
          gender: basicInfo.gender,
          faceAnswers: answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "APIエラーが発生しました");
      }

      setResult(data.result);
      setStep("result");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "不明なエラーが発生しました";
      setError(message);
      setStep("result");
    }
  };

  const currentQuestion = questions.find((q) => q.id === step);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <header className="py-6 px-8 border-b border-slate-100 dark:border-slate-800/50 backdrop-blur-md sticky top-0 z-10 bg-white/70 dark:bg-slate-950/70">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center text-white shadow-md">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Life OS
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {step === "top" && "Welcome"}
            {step === "basic" && "Step 1 of 4"}
            {step === "face" && "Step 2 of 4"}
            {step === "q1" && "Step 3 of 4"}
            {step === "q2" && "Step 4 of 4"}
            {step === "loading" && "Analyzing..."}
            {step === "result" && "Result"}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center py-12">
        {step === "top" && <TopScreen onStart={() => setStep("basic")} />}
        {step === "basic" && <BasicInfo onNext={handleBasicInfoNext} />}
        {step === "face" && (
          <FaceAnalysis onAnalysisComplete={handleFaceAnalysisComplete} />
        )}

        {currentQuestion && (
          <QuestionScreen
            questionNumber={parseInt(currentQuestion.id.replace("q", ""))}
            questionText={currentQuestion.questionText}
            choices={currentQuestion.choices}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
            onNext={() => handleNext(currentQuestion.id)}
            isLast={currentQuestion.id === "q2"}
          />
        )}

        {step === "loading" && <LoadingScreen />}
        {step === "result" && (
          <ResultScreen
            result={result}
            error={error}
            onRestart={() => {
              setBasicInfo(null);
              setFaceResult(null);
              setAnswers({});
              setResult("");
              setError("");
              setStep("top");
            }}
          />
        )}
      </main>

      <footer className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} Life OS Generator. All rights reserved.
      </footer>
    </div>
  );
}
