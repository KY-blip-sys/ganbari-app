-- ==========================================================
-- schema.sql — 頑張りアプリ用テーブル定義 + RLS ポリシー
-- Supabase ダッシュボード > SQL Editor で一度だけ実行する。
-- ==========================================================

create table if not exists user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_exp integer not null default 0,
  quests jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists records (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date_key text not null,
  title text not null,
  category text not null,
  exp integer not null,
  created_at timestamptz not null
);

create index if not exists records_user_date_idx on records (user_id, date_key);

alter table user_progress enable row level security;
alter table records enable row level security;

create policy "select own progress" on user_progress for select using (auth.uid() = user_id);
create policy "insert own progress" on user_progress for insert with check (auth.uid() = user_id);
create policy "update own progress" on user_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own progress" on user_progress for delete using (auth.uid() = user_id);

create policy "select own records" on records for select using (auth.uid() = user_id);
create policy "insert own records" on records for insert with check (auth.uid() = user_id);
create policy "update own records" on records for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own records" on records for delete using (auth.uid() = user_id);
