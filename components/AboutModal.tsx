"use client";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden">
        <div className="p-8 md:p-10">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="閉じる"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
            なぜこのアプリを作ったのか？
          </h2>

          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p className="text-base md:text-lg">
              人生、迷うことばかりですよね。
            </p>

            <p>
              自分だけで考えても方向性が決まらない時や、失敗を繰り返してしまう時。
              なんだか上手くいかないなと感じる時に、「客観的な自分の傾向」を知り、
              「具体的にどう行動すればいいか」のヒントをくれるツールがあったら助かる。
              そう思ったのが開発のきっかけです。
            </p>

            <p>
              深く迷っている時はもちろん、なんとなく新しい方向性を見てみたい時にも。
            </p>

            <p className="font-semibold text-slate-800">
              このアプリが、新しい気持ちで行動を起こすための
              「モチベーション」につながれば嬉しいです。
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="px-8 md:px-10 py-6 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
