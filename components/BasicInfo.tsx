"use client";

import { useState } from "react";

interface BasicInfoData {
  name: string;
  dob: string;
  gender: string;
  origin: string;
}

interface BasicInfoProps {
  onNext: (data: BasicInfoData) => void;
  onBack?: () => void;
  initialData?: BasicInfoData | null;
}

const ORIGIN_OPTIONS = ["日本", "中国", "韓国", "台湾"];

export default function BasicInfo({ onNext, onBack, initialData }: BasicInfoProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [dob, setDob] = useState(initialData?.dob ?? "");
  const [gender, setGender] = useState(initialData?.gender ?? "");
  const [origin, setOrigin] = useState(initialData?.origin ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob && gender && origin) {
      onNext({ name, dob, gender, origin });
    }
  };

  const isFormValid = name && dob && gender && origin;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl animate-fade-in-up border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          基本情報の入力
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 姓名 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            />
          </div>

          {/* 生年月日 (YYYY/MM/DD) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              生年月日
            </label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="1990/01/01"
              pattern="\d{4}/\d{2}/\d{2}"
              title="YYYY/MM/DD 形式で入力してください（例: 1990/01/01）"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            />
            <p className="text-xs text-slate-400">YYYY/MM/DD 形式で入力してください</p>
          </div>

          {/* 出身 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              出身
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors appearance-none"
            >
              <option value="" disabled>
                選択してください
              </option>
              {ORIGIN_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* 性別 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              性別
            </label>
            <div className="flex gap-4">
              {["男性", "女性", "その他"].map((g) => (
                <label
                  key={g}
                  className={`flex-1 flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                    gender === g
                      ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 font-semibold"
                      : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => setGender(e.target.value)}
                    className="sr-only"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* ボタンエリア */}
          <div className="pt-6 space-y-3">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
                isFormValid
                  ? "bg-foreground dark:bg-white dark:text-foreground hover:scale-[1.02] shadow-lg"
                  : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70"
              }`}
            >
              次へ進む
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 bg-transparent border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                ← 戻る
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
