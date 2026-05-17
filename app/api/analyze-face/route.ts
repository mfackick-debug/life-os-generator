import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API クライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(request: NextRequest) {
  try {
    // 1. フロントエンドからBase64画像データを受け取る
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "画像データが不足しています" },
        { status: 400 }
      );
    }

    // 2. Gemini 1.5 Flash モデルを取得
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. プロンプトと画像を送信
    const prompt = `この顔画像の輪郭を [A: スマート, B: ニュートラル, C: スクエア] から1つ選び、目元を [A: 切れ長, B: 丸目, C: 穏やか] から1つ選んでください。返答は必ず {"contour":"A", "eyes":"B"} のようなJSON形式のみとし、Markdownのコードブロック（\`\`\`json など）やその他の文章は一切含めないでください。`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    // 4. JSONをパース
    // 念のため、応答からJSONらしき部分だけを抽出（コードブロックが混入した場合の対策）
    let jsonStr = text.trim();
    // コードブロック（```json ... ``` や ``` ... ```）を除去
    jsonStr = jsonStr.replace(/```(?:json)?\s*/gi, "").replace(/```\s*$/gi, "").trim();

    const parsed = JSON.parse(jsonStr);
    const contour = parsed.contour;
    const eyes = parsed.eyes;

    // 値のバリデーション（A/B/C のいずれか）
    const validValues = ["A", "B", "C"];
    const q1 = validValues.includes(contour) ? contour : "A";
    const q2 = validValues.includes(eyes) ? eyes : "B";

    return NextResponse.json({ q1, q2 });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);

    // エラー時はフォールバック値（A, B）を返す
    return NextResponse.json(
      { q1: "A", q2: "B", error: "解析に失敗したためデフォルト値を使用します" },
      { status: 200 }
    );
  }
}
