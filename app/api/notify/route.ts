import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, posts } = await req.json();

    const postList = posts
      .map((p: any) => `• [${p.platform.toUpperCase()}] ${p.time} — ${p.content.slice(0, 60)}${p.content.length > 60 ? "..." : ""}`)
      .join("\n");

    const { data, error } = await resend.emails.send({
      from: "Postly <onboarding@resend.dev>",
      to: email,
      subject: `Postly — 오늘 예약된 포스트 ${posts.length}개`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9fafb;">
          <div style="background: #4f46e5; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">📅 오늘의 예약 포스트</h1>
          </div>
          <div style="background: white; border-radius: 12px; padding: 20px 24px; border: 1px solid #e4e4e7;">
            <p style="color: #52525b; font-size: 14px; margin-top: 0;">안녕하세요! 오늘 예정된 포스트 <strong>${posts.length}개</strong>를 확인하세요.</p>
            ${posts.map((p: any) => `
              <div style="border-left: 3px solid #4f46e5; padding: 10px 14px; margin: 12px 0; background: #f5f3ff; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 12px; color: #7c3aed; font-weight: 600; text-transform: uppercase;">${p.platform} · ${p.time}</p>
                <p style="margin: 4px 0 0; font-size: 14px; color: #3f3f46;">${p.content.slice(0, 100)}${p.content.length > 100 ? "..." : ""}</p>
              </div>
            `).join("")}
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; margin-top: 16px; background: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">대시보드 열기 →</a>
          </div>
          <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin-top: 16px;">Postly · 소셜 미디어 스케줄러</p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
