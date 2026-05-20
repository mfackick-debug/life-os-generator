"use client";

import { useState, useRef, useCallback } from "react";

interface FaceAnalysisProps {
  onAnalysisComplete: (result: { q1: string; q2: string }) => void;
  onSkip: () => void;
  onBack?: () => void;
}

/**
 * 画像をBase64に変換する
 */
function fileToBase64(fileOrBlob: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // data:image/jpeg;base64,... のプレフィックスを除去
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Gemini APIを使って顔画像を解析する
 */
async function analyzeFace(fileOrBlob: File | Blob): Promise<{ q1: string; q2: string }> {
  // 画像をBase64に変換
  const base64Image = await fileToBase64(fileOrBlob);

  // APIルートに送信
  const response = await fetch("/api/analyze-face", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  const data = await response.json();
  return { q1: data.q1, q2: data.q2 };
}

export default function FaceAnalysis({ onAnalysisComplete, onSkip, onBack }: FaceAnalysisProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeText, setAnalyzeText] = useState("写真をアップロードまたはカメラで撮影してください");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  /** ファイル選択ダイアログを開く */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /** ファイルが選択された時の処理 */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImage(file);
  };

  /** カメラを起動 */
  const handleCameraStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("カメラ起動エラー:", err);
      setAnalyzeText("カメラを起動できませんでした。アップロードをお試しください。");
    }
  };

  /** カメラで撮影 */
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      if (blob) {
        await processImage(blob);
      }
    }, "image/jpeg");
  };

  /** カメラを停止 */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  /** 画像を解析に回す共通処理 */
  const processImage = async (fileOrBlob: File | Blob) => {
    // プレビュー表示
    const previewUrl = URL.createObjectURL(fileOrBlob);
    setImagePreview(previewUrl);
    setIsAnalyzing(true);
    setAnalyzeText("顔写真を解析中...");

    // カメラが起動中なら停止
    if (cameraActive) {
      stopCamera();
    }

    try {
      const result = await analyzeFace(fileOrBlob);
      setAnalyzeText("解析が完了しました！");
      onAnalysisComplete(result);
    } catch (err) {
      console.error("解析エラー:", err);
      setAnalyzeText("解析に失敗しました。もう一度お試しください。");
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
          顔写真をアップロードまたはカメラで撮影してください
        </p>

        {/* プレビュー or カメラ映像 */}
        <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : imagePreview ? (
            <img
              src={imagePreview}
              alt="アップロードされた顔写真"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">写真がここに表示されます</p>
            </div>
          )}

          {/* 解析中オーバーレイ */}
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

        {/* 解析ステータス */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          {analyzeText}
        </p>

        {/* 操作ボタン */}
        <div className="space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center -mt-2 mb-2">
            ※アップロードされた写真は解析直後に完全に破棄され、保存されません。
          </p>
          {/* アップロード */}
          <button
            onClick={handleUploadClick}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-xl font-bold text-white bg-foreground dark:bg-white dark:text-foreground hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 inline mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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

          {/* カメラ撮影 */}
          {!cameraActive ? (
            <button
              onClick={handleCameraStart}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl font-bold text-foreground dark:text-white bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:border-foreground dark:hover:border-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 inline mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              カメラで撮影
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleCapture}
                className="w-full py-3 rounded-xl font-bold text-white bg-accent-500 hover:bg-accent-600 transition-all duration-200 shadow-lg"
              >
                <svg className="w-5 h-5 inline mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                撮影する
              </button>
              <button
                onClick={stopCamera}
                className="w-full py-3 rounded-xl font-bold text-slate-500 bg-transparent border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                キャンセル
              </button>
            </div>
          )}

          {/* スキップ / 手動選択へ */}
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

          {/* 戻るボタン */}
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

      {/* カメラ撮影用の隠しCanvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
