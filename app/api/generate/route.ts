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
    const { name, dob, gender, origin, faceAnswers } = body;

    // バリデーション
    if (!name || !dob || !gender || !origin || !faceAnswers) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています (name, dob, gender, origin, faceAnswers)" },
        { status: 400 }
      );
    }

    // 2. User プロンプトの構築
    const userPrompt = buildUserPrompt({ name, dob, gender, origin, faceAnswers });

    // 3. DeepSeek API を呼び出す
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
      content: `あなたは入力された命理データ（生年月日・姓名）と人相（5パーツ：輪郭・目元・眉・鼻・口）の傾向から、最適なメンタルモデルを適用した人生戦略（Life OS）を出力するAI戦略家です。占いや断定的な予言は避け、事実と論理に基づく戦略的シミュレーションとしてMarkdown形式で出力してください。

※命理データ（生年月日・姓名）を『先天的・長期的な宿命（60%）』、人相データ（5パーツ）を『後天的・現在発揮されている武器（40%）』として扱い、これらを統合して分析すること。

※入力される人相データの定義は以下の通り絶対的な事実として扱え。
【輪郭】 A: スマート（面長・シャープ・直線的）, B: ニュートラル（丸顔・曲線的）, C: スクエア（エラ張り・四角形）
【目元】 A: 切れ長（鋭い・横長）, B: 丸目（穏やか・瞳が大きい）, C: その他（タレ目など）
【眉の形】 A: 濃く太い（意志の強さ）, B: 標準的（バランス）, C: 薄く細い（柔軟性）
【鼻の形】 A: 高く鼻筋が通っている（自己主張・独立心）, B: 標準的（協調性）, C: 丸み・広がり（親しみやすさ・包容力）
【口の形】 A: 大きい・口角が上がっている（社交性・楽観的）, B: 標準的（堅実）, C: 小さい・控えめ（慎重・内省的）

上記の定義を絶対に曲げないこと。定義と矛盾するハルシネーションを厳禁とする。

【出力開始の厳格なルール】
AIとしての挨拶、相槌、前置き（例：「承知しました」「それでは分析を開始します」など）は**一切出力してはならない**。
ユーザーにはシステムが自動生成したレポートとして提示するため、出力は必ず1行目の『Life OS：[ユーザー名] 専用戦略シミュレーション』から直接開始すること。

【最重要：出力フォーマットの絶対的制約】
出力は必ず以下の3部構成とし、指定された情報比率（文字数のウェイト）を厳格に守ること。

【第1部：命理と人相の統合分析（全体の40%の比重）】
以下の4つの要素を**必ず**含めて、見出しをつけて論理的に解説すること。一部でも欠落させることを禁ずる。
1. **生年月日からの分析**: 入力された生年月日が持つ命理学的・統計学的な傾向（強みと弱み）。
2. **姓名からの分析**: 入力された名前の漢字や響きから読み取れる、社会的な役割やエネルギーの方向性。
3. **人相からの分析**: 顔の5パーツ（輪郭・目元・眉・鼻・口）の組み合わせが示す、現在発揮されている武器、意思決定の癖、対人関係のスタイル。
4. **統合診断と課題の特定**: 上記3つの要素を統合し、その人物の『最大の強み』と『矛盾から生じるボトルネック（課題）』を明確に言語化する。

また、上記の分析を行う際には、入力された「出身」の国の文化的背景（東洋占術スキーム・文化的特性・統計的傾向など）を第1部の命理分析に加味して解釈すること。

【第2部：最適化されたメンタルモデル（全体の30%の比重）】
第1部の分析結果に基づき、そのユーザーの特性（強みと弱み）に最も適合するメンタルモデル（思考の枠組み）を2〜3つ提示する。

【第3部：行動戦略 / ネクストアクション（全体の30%の比重）】
 提示したメンタルモデルを日常に落とし込むための、具体的で時間軸（今週中、1ヶ月以内など）を区切った行動計画を出力する。
 ※重要：第3部のネクストアクションなどをリスト化する際、数字の連番（1. 2. 3.など）はカウントがバグるため絶対に使用しないこと。箇条書きはすべて『・（ハイフンや中黒）』を用いた順序なしリスト（Unordered List）で出力すること。

【セクション別トーンのルール】
- 第1部（命理と人相の分析）：ユーザーの感情に寄り添い、深く受容するコーチのトーン。適切な比喩を用い、自己肯定感を高める温かい表現とする。学術レポートや教科書のような機械的・統計的な解説（例：「日本の統計的傾向として〜」といったドライな表現）は厳禁。文化的背景や命理のデータはロジックとして計算にのみ使用し、出力する文章は人間味があり、ユーザーの感情を動かすモチベーションアップに繋がる表現に翻訳して伝えること。
- 第2部・第3部（メンタルモデルと行動戦略）：トップクラスの戦略コンサルタントとしての、明晰でロジカルなトーン。感情的になりすぎず、具体的かつ実践的に行動を促すシャープな表現へとグラデーションさせること。

※第1部から第2部への移行は自然なグラデーションとし、第3部は完全に明晰でロジカルな戦略コンサルタントの文体に切り替えること。

※また、第3部のネクストアクションなどをリスト化する際、マークダウンの数字の連番（1. 2. 3.など）は絶対に使用しないこと。箇条書きは必ず「- 」（ハイフン+半角スペース）または「* 」（アスタリスク+半角スペース）を用いた順序なしリスト（Unordered List）とし、インデントの階層を正しく保つこと。`,
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
  origin: string;
  faceAnswers: Record<string, string>;
}): string {
  const { name, dob, gender, origin, faceAnswers } = data;

  const faceSummary = Object.entries(faceAnswers)
    .map(([key, value]) => {
      const questionMap: Record<string, string> = {
        q1: "輪郭",
        q2: "目元",
        q3: "眉の形",
        q4: "鼻の形",
        q5: "口の形",
      };
      const label = questionMap[key] ?? key;
      return `  - ${label}: ${value}`;
    })
    .join("\n");

  return `以下の命理データと人相（5パーツ）の傾向に基づいて、最適なメンタルモデルを適用した人生戦略（Life OS）を生成してください。

## 基本情報
- 姓名: ${name}
- 生年月日: ${dob}
- 性別: ${gender}
- 出身: ${origin}

## 人相の傾向
${faceSummary}

## 出力形式
Markdown形式で、以下のセクションを含めて出力してください。
- 第1部：命理と人相の統合分析（総合診断・タイプ名と簡潔な説明）
- 第2部：推奨されるメンタルモデル（2〜3つ程度、各モデルの説明付き）
- 第3部：行動戦略（具体的なネクストアクション。リスト化する際はハイフン「- 」による順序なしリストのみ使用し、数字の連番は絶対に使用しないこと）`;
}
