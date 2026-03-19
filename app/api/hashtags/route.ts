import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const COUNT_GUIDE: Record<string, number> = {
  instagram: 10,
  twitter: 3,
  youtube: 8,
};

export async function POST(req: NextRequest) {
  try {
    const { content, platform } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "content가 필요합니다." }, { status: 400 });
    }

    const count = COUNT_GUIDE[platform] ?? 8;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `다음 소셜 미디어 포스트 내용을 보고 ${platform ?? "instagram"}에 적합한 한국어/영어 해시태그 ${count}개를 추천해주세요.

포스트 내용: ${content.trim()}

해시태그만 공백으로 구분해서 출력하세요. 예시: #일상 #맛집 #foodie #daily
설명 없이 해시태그만 출력하세요.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const hashtags = text.trim().split(/\s+/).filter((t) => t.startsWith("#"));
    return NextResponse.json({ hashtags });
  } catch (err) {
    console.error("[hashtags] error:", err);
    return NextResponse.json({ error: "해시태그 추천 중 오류가 발생했습니다." }, { status: 500 });
  }
}
