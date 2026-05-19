import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// DeepSeek API クライアントの初期化（OpenAI SDK互換）
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: "https://api.deepseek.com/v1",
});

export async function POST(request: NextRequest) {
  try {
    // 1. フロントエンドからデータを受け取る
    const body = await request.json();
    const { name, dob, gender, faceAnswers } = body;

    // バリデーション
    if (!name || !dob || !gender || !faceAnswers) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています (name, dob, gender, faceAnswers)" },
        { status: 400 }
      );
    }

    // 2. User プロンプトの構築
    const userPrompt = buildUserPrompt({ name, dob, gender, faceAnswers });

    // 3. DeepSeek API を呼び出す
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
      content: `あなたは入力された命理データ（生年月日・姓名）と人相（輪郭・目元）の傾向から、最適なメンタルモデルを適用した人生戦略（Life OS）を出力するAI戦略家です。占いや断定的な予言は避け、事実と論理に基づく戦略的シミュレーションとしてMarkdown形式で出力してください。

※入力される人相データの定義は以下の通り絶対的な事実として扱え。
【輪郭】 A: スマート（面長・シャープ・直線的）, B: ニュートラル（丸顔・曲線的）, C: スクエア（エラ張り・四角形）
【目元】 A: 切れ長（鋭い・横長）, B: 丸目（穏やか・瞳が大きい）, C: その他（タレ目など）

上記の定義を絶対に曲げないこと。輪郭Aを丸顔と解釈するなど、定義と矛盾するハルシネーションを厳禁とする。

【最重要：出力フォーマットの絶対的制約】
出力は必ず以下の3部構成とし、指定された情報比率（文字数のウェイト）を厳格に守ること。

【第1部：命理と人相の統合分析（全体の40%の比重）】
以下の4つの要素を**必ず**含めて、見出しをつけて論理的に解説すること。一部でも欠落させることを禁ずる。
1. **生年月日からの分析**: 入力された生年月日が持つ命理学的・統計学的な傾向（強みと弱み）。
2. **姓名からの分析**: 入力された名前の漢字や響きから読み取れる、社会的な役割やエネルギーの方向性。
3. **人相からの分析**: 輪郭（A:スマート/B:ニュートラル/C:スクエア）と目元（A:切れ長/B:丸目/C:その他）の組み合わせが示す、意思決定の癖や対人関係のスタイル。
4. **統合診断と課題の特定**: 上記3つの要素を統合し、その人物の『最大の強み』と『矛盾から生じるボトルネック（課題）』を明確に言語化する。

【第2部：最適化されたメンタルモデル（全体の30%の比重）】
第1部の分析結果に基づき、そのユーザーの特性（強みと弱み）に最も適合するメンタルモデル（思考の枠組み）を2〜3つ提示する。

【第3部：行動戦略 / ネクストアクション（全体の30%の比重）】
提示したメンタルモデルを日常に落とし込むための、具体的で時間軸（今週中、1ヶ月以内など）を区切った行動計画を出力する。`,

        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    // 4. 結果を返す
    const resultText =
      completion.choices[0]?.message?.content ??
      "結果を生成できませんでした。";

    return NextResponse.json({ result: resultText });
  } catch (error: unknown) {
    console.error("API Error:", error);

    const message =
      error instanceof Error ? error.message : "不明なエラーが発生しました";

    return NextResponse.json(
      { error: `DeepSeek API 呼び出し中にエラーが発生しました: ${message}` },
      { status: 500 }
    );
  }
}

/**
 * フロントエンドから受け取ったデータを整形し、User プロンプト文字列を生成する
 */
function buildUserPrompt(data: {
  name: string;
  dob: string;
  gender: string;
  faceAnswers: Record<string, string>;
}): string {
  const { name, dob, gender, faceAnswers } = data;

  const faceSummary = Object.entries(faceAnswers)
    .map(([key, value]) => {
      const questionMap: Record<string, string> = {
        q1: "輪郭",
        q2: "目元",
      };
      const label = questionMap[key] ?? key;
      return `  - ${label}: ${value}`;
    })
    .join("\n");

  return `以下の命理データと人相（輪郭・目元）の傾向に基づいて、最適なメンタルモデルを適用した人生戦略（Life OS）を生成してください。

## 基本情報
- 姓名: ${name}
- 生年月日: ${dob}
- 性別: ${gender}

## 人相の傾向
${faceSummary}

## 出力形式
Markdown形式で、以下のセクションを含めて出力してください。
1. 総合診断（タイプ名と簡潔な説明）
2. 推奨されるメンタルモデル（3つ程度、各モデルの説明付き）
3. 行動戦略（具体的なネクストアクション）`;
}
