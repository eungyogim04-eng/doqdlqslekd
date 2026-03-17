import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { topic, platform } = await req.json();

  if (!topic || !platform) {
    return NextResponse.json({ error: "topic과 platform이 필요합니다." }, { status: 400 });
  }

  const platformGuide: Record<string, string> = {
    instagram: "Instagram용 — 감성적이고 해시태그 2~3개 포함, 이모지 활용, 150자 내외",
    twitter: "Twitter/X용 — 간결하고 임팩트 있게, 140자 이내, 해시태그 1개",
    youtube: "YouTube 커뮤니티 포스트용 — 구독자와 소통하는 친근한 톤, 200자 내외",
  };

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `당신은 소셜 미디어 전문 카피라이터입니다.
다음 주제로 ${platformGuide[platform]} 포스트를 한국어로 작성해주세요.

주제: ${topic}

포스트 본문만 작성하세요. 설명이나 제목 없이 바로 포스트 내용만 출력하세요.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return NextResponse.json({ result: text.trim() });
}
