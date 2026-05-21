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
    const prompt = `この顔画像を分析し、以下の5項目についてそれぞれ [A, B, C] のいずれか1つを選んでください。
1. 輪郭 (contour): [A: スマート(面長/直線的), B: ニュートラル(丸顔/曲線的), C: スクエア(エラ張り/四角形)]
2. 目元 (eyes): [A: 切れ長(鋭い/横長), B: 丸目(穏やか/瞳が大きい), C: その他(タレ目など)]
3. 眉 (eyebrows): [A: 濃く太い, B: 標準的, C: 薄く細い]
4. 鼻 (nose): [A: 高く鼻筋が通っている, B: 標準的, C: 小鼻が横に広がっている/丸みがある]
5. 口 (mouth): [A: 大きく口角が上がっている, B: 標準的, C: 小さい/控えめ]

返答は必ず {"contour":"A", "eyes":"B", "eyebrows":"A", "nose":"B", "mouth":"C"} のようなJSON形式のみとし、Markdownのコードブロック（\`\`\`json など）やその他の文章は一切含めないでください。`;

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

    // 値のバリデーション（A/B/C のいずれか）
    const validValues = ["A", "B", "C"];
    const q1 = validValues.includes(parsed.contour) ? parsed.contour : "A";
    const q2 = validValues.includes(parsed.eyes) ? parsed.eyes : "B";
    const q3 = validValues.includes(parsed.eyebrows) ? parsed.eyebrows : "B";
    const q4 = validValues.includes(parsed.nose) ? parsed.nose : "B";
    const q5 = validValues.includes(parsed.mouth) ? parsed.mouth : "B";

    return NextResponse.json({ q1, q2, q3, q4, q5 });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);

    // エラー時はフォールバック値（5項目分）を返す
    return NextResponse.json(
      { q1: "A", q2: "B", q3: "B", q4: "B", q5: "B", error: "解析に失敗したためデフォルト値を使用します" },
      { status: 200 }
    );
  }
}
