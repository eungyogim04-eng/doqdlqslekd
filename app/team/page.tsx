"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Team {
  id: string;
  name: string;
  owner_id: string;
}

interface TeamMember {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function TeamPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/auth"); return; }
      setUser(data.user);
      await loadTeam(data.user.id);
      setLoading(false);
    });
  }, [router]);

  async function loadTeam(userId: string) {
    const { data: ownedTeam } = await supabase
      .from("teams")
      .select("*")
      .eq("owner_id", userId)
      .single();

    if (ownedTeam) {
      setTeam(ownedTeam);
      const { data: memberData } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", ownedTeam.id)
        .order("created_at", { ascending: true });
      setMembers(memberData ?? []);
    }
  }

  async function handleCreateTeam() {
    if (!teamName.trim()) { setError("팀 이름을 입력해주세요."); return; }
    setCreating(true);
    setError("");
    const { data, error } = await supabase
      .from("teams")
      .insert({ name: teamName.trim(), owner_id: user!.id })
      .select()
      .single();

    if (error) {
      setError("팀 생성 실패: " + error.message);
    } else {
      setTeam(data);
      await supabase.from("team_members").insert({
        team_id: data.id,
        user_id: user!.id,
        email: user!.email,
        role: "owner",
      });
      setSuccess("팀이 생성됐습니다!");
    }
    setCreating(false);
  }

  async function handleInvite() {
    if (!inviteEmail.trim()) { setError("이메일을 입력해주세요."); return; }
    if (!team) return;
    setInviting(true);
    setError("");

    const exists = members.find((m) => m.email === inviteEmail.trim());
    if (exists) { setError("이미 팀 멤버입니다."); setInviting(false); return; }

    const { error } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: null,
      email: inviteEmail.trim(),
      role: "member",
    });

    if (error) {
      setError("초대 실패: " + error.message);
    } else {
      setSuccess(`${inviteEmail}을 초대했습니다!`);
      setInviteEmail("");
      await loadTeam(user!.id);
    }
    setInviting(false);
  }

  async function handleRemoveMember(memberId: string) {
    await supabase.from("team_members").delete().eq("id", memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setSuccess("멤버가 제거됐습니다.");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-900">Postly</span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:bg-zinc-100 transition-colors">캘린더</Link>
            <Link href="/analytics" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:bg-zinc-100 transition-colors">분석</Link>
            <Link href="/team" className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 bg-indigo-50">팀</Link>
            <Link href="/approvals" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:bg-zinc-100 transition-colors">승인</Link>
            <Link href="/settings" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:bg-zinc-100 transition-colors">설정</Link>
          </nav>
          <div className="flex items-center gap-2">
            {user && <span className="hidden sm:block text-xs text-zinc-400 truncate max-w-[140px]">{user.email}</span>}
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push("/auth"); }}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">팀 협업</h1>
        <p className="text-zinc-500 text-sm mb-8">팀원을 초대해서 함께 포스트를 관리하세요.</p>

        {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}
        {success && <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">{success}</div>}

        {!team ? (
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 max-w-md">
            <h2 className="text-base font-semibold text-zinc-800 mb-4">팀 만들기</h2>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="팀 이름 입력"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
            />
            <button
              onClick={handleCreateTeam}
              disabled={creating}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {creating ? "생성 중..." : "팀 생성"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {team.name[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900">{team.name}</h2>
                  <p className="text-xs text-zinc-400">팀장: {user?.email}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6">
              <h3 className="text-sm font-semibold text-zinc-800 mb-4">멤버 초대</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  placeholder="초대할 이메일 주소"
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {inviting ? "초대 중..." : "초대"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-800">팀 멤버 ({members.length}명)</h3>
              </div>
              <ul className="divide-y divide-zinc-100">
                {members.map((member) => (
                  <li key={member.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 text-xs font-bold">
                        {member.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-zinc-800">{member.email}</p>
                        <span className={`text-xs font-medium ${member.role === "owner" ? "text-indigo-500" : "text-zinc-400"}`}>
                          {member.role === "owner" ? "팀장" : "멤버"}
                        </span>
                      </div>
                    </div>
                    {member.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        제거
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
