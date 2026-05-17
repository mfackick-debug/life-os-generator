"use client";

import { useState } from "react";

interface BasicInfoData {
  name: string;
  dob: string;
  gender: string;
}

interface BasicInfoProps {
  onNext: (data: BasicInfoData) => void;
}

export default function BasicInfo({ onNext }: BasicInfoProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob && gender) {
      onNext({ name, dob, gender });
    }
  };

  const isFormValid = name && dob && gender;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl animate-fade-in-up border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          基本情報の入力
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              生年月日
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            />
          </div>

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

          <div className="pt-6">
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
          </div>
        </form>
      </div>
    </div>
  );
}
