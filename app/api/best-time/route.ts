import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PLATFORM_NAME: Record<string, string> = {
  instagram: "Instagram",
  twitter: "Twitter/X",
  youtube: "YouTube",
};

export async function POST(req: NextRequest) {
  try {
    const { platform } = await req.json();
    const platformName = PLATFORM_NAME[platform] ?? "Instagram";

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `${platformName}에 포스트를 올릴 때 인게이지먼트(좋아요, 댓글, 공유)가 가장 높은 최적 게시 시간 3개를 추천해줘.
한국 시간(KST) 기준으로 시간(HH:MM 형식)과 이유(한 줄)를 JSON 배열로만 응답해. 다른 텍스트 없이 JSON만.
예시: [{"time":"09:00","reason":"출근 전 모바일 사용 피크"},{"time":"12:30","reason":"점심시간 탐색"},{"time":"21:00","reason":"저녁 여가 시간"}]`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return NextResponse.json({ error: "응답 파싱 실패" }, { status: 500 });

    const times = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(times)) return NextResponse.json({ error: "잘못된 응답 형식" }, { status: 500 });

    return NextResponse.json({ times });
  } catch (err) {
    console.error("[best-time] error:", err);
    return NextResponse.json({ error: "AI 추천 실패" }, { status: 500 });
  }
}
