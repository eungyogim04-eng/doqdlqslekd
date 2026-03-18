"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { PLATFORM_CONFIG } from "../types";
import type { User } from "@supabase/supabase-js";

interface Post {
  id: string;
  content: string;
  platform: string;
  scheduled_at: string;
  time: string;
  status: string;
  user_id: string;
  image_url?: string;
}

export default function ApprovalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/auth"); return; }
      setUser(data.user);
      await loadPosts(data.user.id);
      setLoading(false);
    });
  }, [router]);

  async function loadPosts(userId: string) {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
  }

  async function handleApprove(postId: string) {
    await supabase.from("posts").update({ status: "approved" }).eq("id", postId);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "approved" } : p));
  }

  async function handleReject(postId: string) {
    await supabase.from("posts").update({ status: "rejected" }).eq("id", postId);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "rejected" } : p));
  }

  async function handleSubmitForApproval(postId: string) {
    await supabase.from("posts").update({ status: "pending" }).eq("id", postId);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "pending" } : p));
  }

  const filtered = posts.filter((p) => filter === "all" ? true : p.status === filter);
  const pendingCount = posts.filter((p) => p.status === "pending").length;

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      draft:    { label: "임시저장", cls: "bg-zinc-100 text-zinc-500" },
      pending:  { label: "승인 대기", cls: "bg-yellow-100 text-yellow-700" },
      approved: { label: "승인됨", cls: "bg-green-100 text-green-700" },
      rejected: { label: "반려됨", cls: "bg-red-100 text-red-600" },
    };
    const s = map[status] ?? map.draft;
    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>;
  };

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
            <Link href="/team" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:bg-zinc-100 transition-colors">팀</Link>
            <Link href="/approvals" className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 bg-indigo-50 flex items-center gap-1">
              승인
              {pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{pendingCount}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">포스트 승인</h1>
            <p className="text-zinc-500 text-sm mt-1">포스트를 검토하고 승인/반려하세요.</p>
          </div>
          {pendingCount > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1.5 rounded-xl">
              대기 중 {pendingCount}개
            </span>
          )}
        </div>

        {/* 필터 탭 */}
        <div className="flex gap-2 mb-6">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f ? "bg-indigo-600 text-white" : "bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-300"
              }`}
            >
              {f === "pending" ? "대기 중" : f === "approved" ? "승인됨" : f === "rejected" ? "반려됨" : "전체"}
              {f === "pending" && pendingCount > 0 && ` (${pendingCount})`}
            </button>
          ))}
        </div>

        {/* 포스트 목록 */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-400 text-sm">
            포스트가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => {
              const cfg = PLATFORM_CONFIG[post.platform as keyof typeof PLATFORM_CONFIG];
              return (
                <div key={post.id} className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-semibold ${cfg?.color}`}>{cfg?.label}</span>
                        <span className="text-xs text-zinc-400">{post.scheduled_at} {post.time}</span>
                        {statusBadge(post.status ?? "draft")}
                      </div>
                      <p className="text-sm text-zinc-700 break-words">{post.content}</p>
                      {post.image_url && (
                        <img src={post.image_url} alt="" className="mt-2 rounded-lg h-24 object-cover border border-zinc-100" />
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {post.status === "draft" && (
                        <button
                          onClick={() => handleSubmitForApproval(post.id)}
                          className="rounded-lg bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 hover:bg-yellow-600 transition-colors"
                        >
                          승인 요청
                        </button>
                      )}
                      {post.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(post.id)}
                            className="rounded-lg bg-green-500 text-white text-xs font-semibold px-3 py-1.5 hover:bg-green-600 transition-colors"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleReject(post.id)}
                            className="rounded-lg bg-red-500 text-white text-xs font-semibold px-3 py-1.5 hover:bg-red-600 transition-colors"
                          >
                            반려
                          </button>
                        </>
                      )}
                      {post.status === "rejected" && (
                        <button
                          onClick={() => handleSubmitForApproval(post.id)}
                          className="rounded-lg border border-zinc-200 text-zinc-500 text-xs font-semibold px-3 py-1.5 hover:bg-zinc-50 transition-colors"
                        >
                          재요청
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
