import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function POST(req: NextRequest) {
  try {
    const { content, platform } = await req.json();

    if (platform === "twitter") {
      const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY!,
        appSecret: process.env.TWITTER_API_SECRET!,
        accessToken: process.env.TWITTER_ACCESS_TOKEN!,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
      });

      const tweet = await client.v2.tweet(content);
      return NextResponse.json({ success: true, id: tweet.data.id });
    }

    return NextResponse.json({ error: "지원하지 않는 플랫폼입니다." }, { status: 400 });
  } catch (error: any) {
    console.error("Publish error:", error);
    return NextResponse.json({ error: error.message ?? "발행 실패" }, { status: 500 });
  }
}
