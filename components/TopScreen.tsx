"use client";

import { useState } from "react";
import Image from "next/image";
import AboutModal from "@/components/AboutModal";

interface TopScreenProps {
  onStart: () => void;
}

export default function TopScreen({ onStart }: TopScreenProps) {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
          {/* 幾何学デザインの横長アイキャッチ画像 */}
          <div className="flex justify-center">
            <div className="w-full max-w-xl aspect-[21/9] h-44 overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200/50">
              <Image
                src="/bg.png"
                alt="Life OS - Abstract Design"
                width={672}
                height={128}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight text-balance px-2 sm:px-4">
            迷いを変える。新しい一歩への作戦会議。
          </h1>
          
          <p className="text-lg md:text-xl text-blue-600 font-semibold mt-2">
            あなた専用の意思決定戦略AI
          </p>
          
          <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            顔写真×生年月日から、あなたの&ldquo;勝ちパターン&rdquo;をAIが特定化。努力を成果に直結させるための、具体的なネクストアクションを導き出します。
          </p>

          <div className="pt-8">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 border border-transparent rounded-full shadow-sm hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              戦略OSを生成する
              <svg
                className="w-5 h-5 ml-3 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
            <p className="mt-4 text-xs text-slate-400">
              ※入力された生年月日や画像データは、AIによる解析にのみ一時的に使用され、サーバーやデータベースには一切保存されません。
            </p>
          </div>

          {/* Aboutリンク */}
          <div className="pt-4">
            <button
              onClick={() => setAboutOpen(true)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
            >
              このアプリについて
            </button>
          </div>
        </div>
      </div>

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
