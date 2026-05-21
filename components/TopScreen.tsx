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
      <div className="flex flex-col md:flex-row items-center justify-between min-h-[70vh] px-4 md:px-8 max-w-6xl mx-auto gap-8 md:gap-16 py-12">
        {/* 左側：コンテンツエリア */}
        <div className="flex-1 space-y-6 text-left flex flex-col items-start animate-fade-in-up max-w-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            迷いを行動に変える。<br />
            新しい一歩への作戦会議。
          </h1>
          
          <p className="text-lg md:text-xl text-blue-600 font-semibold">
            あなた専用の意思決定戦略AI
          </p>

          <div className="pt-4 w-full sm:w-auto">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 border border-transparent rounded-full shadow-sm hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
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
            <p className="mt-4 text-xs text-slate-400 max-w-sm">
              ※入力された生年月日や画像データは、AIによる解析にのみ一時的に使用され、サーバーやデータベースには一切保存されません。
            </p>
          </div>

          {/* Aboutリンク */}
          <div className="pt-2">
            <button
              onClick={() => setAboutOpen(true)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
            >
              このアプリについて
            </button>
          </div>
        </div>

        {/* 右側：グラフィックエリア */}
        <div className="flex-1 w-full max-w-md aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200/50 relative animate-fade-in-up">
          <Image
            src="/bg.png"
            alt="Life OS - Abstract Design"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
