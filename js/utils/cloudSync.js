// ==========================================================
// cloudSync.js — Supabase Database との読み書き
// state 形状 { totalExp, records: {date: [record]}, quests } を
// user_progress / records テーブルと相互変換する
// ==========================================================

import { getSupabaseClient } from "../lib/supabaseClient.js";

export async function hasRemoteData(userId) {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from("user_progress")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return Boolean(data);
}

export async function fetchRemoteState(userId) {
  const supabase = await getSupabaseClient();
  const [{ data: progress }, { data: recordRows }] = await Promise.all([
    supabase.from("user_progress").select("total_exp, quests").eq("user_id", userId).maybeSingle(),
    supabase.from("records").select("id, date_key, title, category, exp, created_at").eq("user_id", userId),
  ]);

  const records = {};
  for (const row of recordRows || []) {
    if (!records[row.date_key]) records[row.date_key] = [];
    records[row.date_key].push({
      id: row.id,
      title: row.title,
      category: row.category,
      exp: row.exp,
      createdAt: new Date(row.created_at).getTime(),
    });
  }
  for (const key of Object.keys(records)) {
    records[key].sort((a, b) => a.createdAt - b.createdAt);
  }

  return {
    totalExp: progress ? progress.total_exp : 0,
    records,
    quests: progress && progress.quests ? progress.quests : {},
  };
}

export async function upsertRecordRemote(userId, dateKey, record) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("records").upsert({
    id: record.id,
    user_id: userId,
    date_key: dateKey,
    title: record.title,
    category: record.category,
    exp: record.exp,
    created_at: new Date(record.createdAt).toISOString(),
  });
  if (error) throw error;
}

export async function deleteRecordRemote(userId, id) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("records").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function upsertProgressRemote(userId, { totalExp, quests }) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    total_exp: totalExp,
    quests,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function migrateLocalToRemote(userId, localState) {
  const supabase = await getSupabaseClient();

  const rows = [];
  for (const [dateKey, list] of Object.entries(localState.records)) {
    for (const r of list) {
      rows.push({
        id: r.id,
        user_id: userId,
        date_key: dateKey,
        title: r.title,
        category: r.category,
        exp: r.exp,
        created_at: new Date(r.createdAt).toISOString(),
      });
    }
  }

  if (rows.length) {
    const { error } = await supabase.from("records").insert(rows);
    if (error) throw error;
  }

  const { error: progressError } = await supabase.from("user_progress").insert({
    user_id: userId,
    total_exp: localState.totalExp,
    quests: localState.quests,
  });
  if (progressError) throw progressError;
}

export async function deleteAllRemoteData(userId) {
  const supabase = await getSupabaseClient();
  const { error: deleteError } = await supabase.from("records").delete().eq("user_id", userId);
  if (deleteError) throw deleteError;

  const { error: progressError } = await supabase.from("user_progress").upsert({
    user_id: userId,
    total_exp: 0,
    quests: {},
    updated_at: new Date().toISOString(),
  });
  if (progressError) throw progressError;
}
