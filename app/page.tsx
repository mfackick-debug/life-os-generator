"use client";

import { useState } from "react";
import Image from "next/image";
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
  origin: string;
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

  /** 顔写真スキップ → 手動選択へ */
  const handleFaceSkip = () => {
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
          origin: basicInfo.origin,
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
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative bg-white">
      {/* 背景画像レイヤー（薄い透過） */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'url("/bg.png")',
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* コンテンツレイヤー */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-6 px-8 border-b border-slate-200 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
              <svg
                className="w-7 h-7 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                />
              </svg>
              Life OS
            </div>
            <div className="text-sm font-medium text-slate-500">
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
          {step === "basic" && (
            <BasicInfo
              onNext={handleBasicInfoNext}
              initialData={basicInfo}
            />
          )}
          {step === "face" && (
            <FaceAnalysis
              onAnalysisComplete={handleFaceAnalysisComplete}
              onSkip={handleFaceSkip}
              onBack={() => setStep("basic")}
            />
          )}

          {currentQuestion && (
            <QuestionScreen
              questionNumber={parseInt(currentQuestion.id.replace("q", ""))}
              questionText={currentQuestion.questionText}
              choices={currentQuestion.choices}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
              onNext={() => handleNext(currentQuestion.id)}
              onBack={() => {
                if (currentQuestion.id === "q2") {
                  setStep("q1");
                } else if (currentQuestion.id === "q1") {
                  setStep("face");
                }
              }}
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

        <footer className="py-8 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Life OS Generator. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
