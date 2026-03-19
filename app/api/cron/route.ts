import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  twitter: "Twitter/X",
  youtube: "YouTube",
};

const PLATFORM_COLOR: Record<string, string> = {
  instagram: "#e1306c",
  twitter: "#1da1f2",
  youtube: "#ff0000",
};

export async function GET(req: NextRequest) {
  // 보안: cron secret 확인
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // 오늘 예약된 포스트 조회
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("scheduled_at", today)
    .order("time", { ascending: true });

  if (postsError) {
    console.error("[cron] fetch posts error:", postsError);
    return NextResponse.json({ error: "포스트 조회 실패" }, { status: 500 });
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ message: "오늘 예약된 포스트 없음" });
  }

  // 유저별로 그룹화
  const byUser: Record<string, typeof posts> = {};
  for (const post of posts) {
    if (!byUser[post.user_id]) byUser[post.user_id] = [];
    byUser[post.user_id].push(post);
  }

  // 각 유저에게 이메일 발송
  const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const userMap = new Map(usersData.users.map((u) => [u.id, u]));

  let sent = 0;
  const errors: string[] = [];

  for (const [userId, userPosts] of Object.entries(byUser)) {
    const user = userMap.get(userId);
    if (!user?.email) continue;

    const postRows = userPosts.map((p) => {
      const label = PLATFORM_LABEL[p.platform] ?? p.platform;
      const color = PLATFORM_COLOR[p.platform] ?? "#4f46e5";
      const preview = p.content.length > 120 ? p.content.slice(0, 120) + "..." : p.content;
      return `
        <div style="border-left: 3px solid ${color}; padding: 10px 14px; margin: 10px 0; background: #fafafa; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 11px; color: ${color}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">${label} · ${p.time}</p>
          <p style="margin: 5px 0 0; font-size: 13px; color: #3f3f46; line-height: 1.5;">${preview}</p>
        </div>
      `;
    }).join("");

    try {
      await resend.emails.send({
        from: "Postly <notifications@postly.app>",
        to: user.email,
        subject: `오늘 예약된 포스트 ${userPosts.length}개가 있어요 📅`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; background: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="max-width: 520px; margin: 32px auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7;">
              <!-- Header -->
              <div style="background: #4f46e5; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="background: white; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #4f46e5; font-weight: 800; font-size: 16px;">P</span>
                  </div>
                  <span style="color: white; font-weight: 700; font-size: 18px;">Postly</span>
                </div>
              </div>
              <!-- Body -->
              <div style="padding: 28px 24px;">
                <h2 style="margin: 0 0 4px; font-size: 18px; color: #18181b;">오늘의 예약 포스트 (${userPosts.length}개)</h2>
                <p style="margin: 0 0 20px; font-size: 13px; color: #71717a;">${today} 기준 예약된 포스트를 확인하세요.</p>
                ${postRows}
                <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://postly.app"}/dashboard"
                   style="display: inline-block; margin-top: 20px; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600;">
                  대시보드 열기 →
                </a>
              </div>
              <!-- Footer -->
              <div style="padding: 16px 24px; border-top: 1px solid #f4f4f5; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #a1a1aa;">
                  이 이메일은 Postly에서 자동으로 발송됩니다.
                  수신 거부는 <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://postly.app"}/settings" style="color: #4f46e5;">설정</a>에서 변경할 수 있습니다.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      sent++;
    } catch (err) {
      console.error(`[cron] email failed for ${user.email}:`, err);
      errors.push(user.email);
    }
  }

  return NextResponse.json({
    message: `${sent}명에게 이메일 발송 완료`,
    ...(errors.length > 0 ? { errors: `${errors.length}건 실패` } : {}),
  });
}
