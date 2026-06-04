import { supabase } from "@/lib/supabase";
import { Transaction, Category, Budget, AutoRecord, AppSettings } from "@/types";

const DEFAULT_SETTINGS: AppSettings = {
  language: "th",
  currency: "THB",
  budgetStartDay: 1,
  notificationsEnabled: false,
  notificationTime: "20:00",
};

// ─── Transactions ────────────────────────────────────────────────────────────

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    amount: r.amount,
    type: r.type,
    categoryId: r.category_id,
    note: r.note,
    date: r.date,
    imageUrl: r.image_url ?? undefined,
    createdAt: r.created_at,
  }));
}

export async function addTransaction(txn: Transaction): Promise<void> {
  await supabase.from("transactions").insert({
    id: txn.id,
    amount: txn.amount,
    type: txn.type,
    category_id: txn.categoryId,
    note: txn.note,
    date: txn.date,
    image_url: txn.imageUrl ?? null,
    created_at: txn.createdAt,
  });
}

export async function updateTransaction(txn: Transaction): Promise<void> {
  await supabase
    .from("transactions")
    .update({
      amount: txn.amount,
      type: txn.type,
      category_id: txn.categoryId,
      note: txn.note,
      date: txn.date,
      image_url: txn.imageUrl ?? null,
    })
    .eq("id", txn.id);
}

export async function deleteTransaction(id: string): Promise<void> {
  await supabase.from("transactions").delete().eq("id", id);
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("type")
    .order("name");
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    nameTh: r.name_th,
    icon: r.icon,
    color: r.color,
    type: r.type,
  }));
}

export async function saveCategories(cats: Category[]): Promise<void> {
  await supabase.from("categories").delete().neq("id", "__never__");
  if (cats.length > 0) {
    await supabase.from("categories").insert(
      cats.map((c) => ({
        id: c.id,
        name: c.name,
        name_th: c.nameTh,
        icon: c.icon,
        color: c.color,
        type: c.type,
      }))
    );
  }
}

export async function addCategory(cat: Category): Promise<void> {
  await supabase.from("categories").insert({
    id: cat.id,
    name: cat.name,
    name_th: cat.nameTh,
    icon: cat.icon,
    color: cat.color,
    type: cat.type,
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await supabase.from("categories").delete().eq("id", id);
}

// ─── Budgets ─────────────────────────────────────────────────────────────────

export async function getBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase.from("budgets").select("*");
  if (error || !data) return [];
  return data.map((r) => ({
    categoryId: r.category_id,
    amount: r.amount,
    period: r.period,
  }));
}

export async function saveBudgets(budgets: Budget[]): Promise<void> {
  await supabase.from("budgets").delete().neq("category_id", "__never__");
  if (budgets.length > 0) {
    await supabase.from("budgets").insert(
      budgets.map((b) => ({
        category_id: b.categoryId,
        amount: b.amount,
        period: b.period,
      }))
    );
  }
}

// ─── Auto Records ─────────────────────────────────────────────────────────────

export async function getAutoRecords(): Promise<AutoRecord[]> {
  const { data, error } = await supabase.from("auto_records").select("*");
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    nameTh: r.name_th,
    amount: r.amount,
    type: r.type,
    categoryId: r.category_id,
    note: r.note,
    enabled: r.enabled,
  }));
}

export async function saveAutoRecords(records: AutoRecord[]): Promise<void> {
  await supabase.from("auto_records").delete().neq("id", "__never__");
  if (records.length > 0) {
    await supabase.from("auto_records").insert(
      records.map((r) => ({
        id: r.id,
        name: r.name,
        name_th: r.nameTh,
        amount: r.amount,
        type: r.type,
        category_id: r.categoryId,
        note: r.note,
        enabled: r.enabled,
      }))
    );
  }
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<AppSettings> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "singleton")
    .maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return {
    language: data.language,
    currency: data.currency,
    budgetStartDay: data.budget_start_day,
    notificationsEnabled: data.notifications_enabled,
    notificationTime: data.notification_time,
  };
}

export async function saveSettings(s: AppSettings): Promise<void> {
  await supabase.from("settings").upsert({
    id: "singleton",
    language: s.language,
    currency: s.currency,
    budget_start_day: s.budgetStartDay,
    notifications_enabled: s.notificationsEnabled,
    notification_time: s.notificationTime,
  });
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
