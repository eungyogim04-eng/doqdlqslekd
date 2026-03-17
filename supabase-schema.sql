-- Supabase SQL Editor에 이 내용을 붙여넣고 실행하세요

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  platform text not null check (platform in ('instagram', 'twitter', 'youtube')),
  scheduled_at date not null,
  time text not null,
  created_at timestamptz default now()
);

-- 누구나 읽고 쓸 수 있도록 RLS 설정 (나중에 Auth 붙이면 수정)
alter table posts enable row level security;

create policy "Anyone can read posts"
  on posts for select using (true);

create policy "Anyone can insert posts"
  on posts for insert with check (true);

create policy "Anyone can delete posts"
  on posts for delete using (true);
