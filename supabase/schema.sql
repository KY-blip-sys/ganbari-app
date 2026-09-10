-- ==========================================================
-- 頑張るアプリ Ver1.0 スキーマ
-- Supabase SQL Editor にそのまま貼り付けて実行できます（再実行しても安全）
--
-- テーブル: profiles / tasks / task_logs / user_stats
-- レベル・称号はDBに保存せず、user_stats.total_xp からアプリ側で計算する。
-- ==========================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------
-- テーブル
-- ----------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  is_completed boolean not null default false,
  xp_reward integer not null default 10 check (xp_reward between 1 and 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete set null,
  task_title text not null,
  xp_earned integer not null check (xp_earned > 0),
  completed_at timestamptz not null default now()
);

create table if not exists public.user_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_completed_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------
-- インデックス
-- ----------------------------------------------------------

create index if not exists idx_tasks_user_id on public.tasks (user_id);
create index if not exists idx_tasks_user_incomplete on public.tasks (user_id, is_completed);
create index if not exists idx_task_logs_user_id on public.task_logs (user_id);
create index if not exists idx_task_logs_user_completed_at on public.task_logs (user_id, completed_at desc);
create index if not exists idx_task_logs_task_id on public.task_logs (task_id);

-- ----------------------------------------------------------
-- updated_at 自動更新
-- ----------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_user_stats_updated_at on public.user_stats;
create trigger set_user_stats_updated_at
before update on public.user_stats
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------
-- タスク達成 → task_logs へ記録
-- (未達成→達成の初回遷移のみ発火。達成解除→再達成ではXPを二重付与しない)
-- ----------------------------------------------------------

create or replace function public.handle_task_completion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_completed = true and old.is_completed = false and old.completed_at is null then
    new.completed_at := now();

    insert into public.task_logs (user_id, task_id, task_title, xp_earned, completed_at)
    values (new.user_id, new.id, new.title, new.xp_reward, new.completed_at);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_task_completion on public.tasks;
create trigger trg_task_completion
before update on public.tasks
for each row execute function public.handle_task_completion();

-- ----------------------------------------------------------
-- task_logs 追記 → user_stats(XP・ストリーク) を更新
-- ----------------------------------------------------------

create or replace function public.handle_task_log_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_last_date date;
  v_current_streak integer;
  v_longest_streak integer;
  v_today date := (new.completed_at)::date;
begin
  select last_completed_date, current_streak, longest_streak
    into v_last_date, v_current_streak, v_longest_streak
  from public.user_stats
  where user_id = new.user_id
  for update;

  if not found then
    insert into public.user_stats (user_id, total_xp, current_streak, longest_streak, last_completed_date)
    values (new.user_id, new.xp_earned, 1, 1, v_today);
    return new;
  end if;

  if v_last_date = v_today then
    update public.user_stats
       set total_xp = total_xp + new.xp_earned,
           updated_at = now()
     where user_id = new.user_id;
  elsif v_last_date = v_today - 1 then
    update public.user_stats
       set total_xp = total_xp + new.xp_earned,
           current_streak = v_current_streak + 1,
           longest_streak = greatest(v_longest_streak, v_current_streak + 1),
           last_completed_date = v_today,
           updated_at = now()
     where user_id = new.user_id;
  else
    update public.user_stats
       set total_xp = total_xp + new.xp_earned,
           current_streak = 1,
           longest_streak = greatest(v_longest_streak, 1),
           last_completed_date = v_today,
           updated_at = now()
     where user_id = new.user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_task_log_insert on public.task_logs;
create trigger trg_task_log_insert
after insert on public.task_logs
for each row execute function public.handle_task_log_insert();

-- ----------------------------------------------------------
-- 新規ユーザー登録時に profiles / user_stats を自動作成
-- ----------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );

  insert into public.user_stats (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ----------------------------------------------------------
-- RLS 有効化 & ポリシー
-- ----------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_logs enable row level security;
alter table public.user_stats enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- tasks
drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = user_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = user_id);

-- task_logs（読み取り専用。書き込みはトリガー経由のみ）
drop policy if exists "task_logs_select_own" on public.task_logs;
create policy "task_logs_select_own" on public.task_logs
  for select using (auth.uid() = user_id);

-- user_stats（読み取り専用。書き込みはトリガー経由のみ = 改ざん防止）
drop policy if exists "user_stats_select_own" on public.user_stats;
create policy "user_stats_select_own" on public.user_stats
  for select using (auth.uid() = user_id);
