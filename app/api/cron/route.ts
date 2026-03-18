import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  // 보안: cron secret 확인
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // 오늘 예약된 포스트 조회
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("scheduled_at", today);

  if (!posts || posts.length === 0) {
    return NextResponse.json({ message: "오늘 예약된 포스트 없음" });
  }

  // 유저별로 그룹화
  const byUser: Record<string, any[]> = {};
  for (const post of posts) {
    if (!byUser[post.user_id]) byUser[post.user_id] = [];
    byUser[post.user_id].push(post);
  }

  // 각 유저에게 이메일 발송
  const { data: users } = await supabase.auth.admin.listUsers();
  let sent = 0;

  for (const [userId, userPosts] of Object.entries(byUser)) {
    const user = users.users.find((u) => u.id === userId);
    if (!user?.email) continue;

    await resend.emails.send({
      from: "Postly <onboarding@resend.dev>",
      to: user.email,
      subject: `Postly — 오늘 예약된 포스트 ${userPosts.length}개`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #4f46e5;">📅 오늘의 예약 포스트 (${userPosts.length}개)</h2>
          ${userPosts.map((p) => `
            <div style="border-left: 3px solid #4f46e5; padding: 10px 14px; margin: 12px 0; background: #f5f3ff; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 12px; color: #7c3aed; font-weight: 600;">${p.platform.toUpperCase()} · ${p.time}</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #3f3f46;">${p.content.slice(0, 100)}</p>
            </div>
          `).join("")}
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; margin-top: 16px; background: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">대시보드 열기 →</a>
        </div>
      `,
    });
    sent++;
  }

  return NextResponse.json({ message: `${sent}명에게 이메일 발송 완료` });
}
