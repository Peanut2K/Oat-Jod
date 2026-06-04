import {
  Transaction,
  Category,
  Budget,
  AutoRecord,
  AppSettings,
} from "@/types";

const KEYS = {
  TRANSACTIONS: "et_transactions",
  CATEGORIES: "et_categories",
  BUDGETS: "et_budgets",
  AUTO_RECORDS: "et_auto_records",
  SETTINGS: "et_settings",
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food & Drink", nameTh: "อาหาร & เครื่องดื่ม", icon: "🍔", color: "#f97316", type: "expense" },
  { id: "transport", name: "Transport", nameTh: "การเดินทาง", icon: "🚗", color: "#3b82f6", type: "expense" },
  { id: "shopping", name: "Shopping", nameTh: "ช้อปปิ้ง", icon: "🛍️", color: "#ec4899", type: "expense" },
  { id: "health", name: "Health", nameTh: "สุขภาพ", icon: "💊", color: "#ef4444", type: "expense" },
  { id: "entertainment", name: "Entertainment", nameTh: "บันเทิง", icon: "🎮", color: "#8b5cf6", type: "expense" },
  { id: "bills", name: "Bills & Utilities", nameTh: "ค่าใช้จ่ายประจำ", icon: "📱", color: "#6b7280", type: "expense" },
  { id: "education", name: "Education", nameTh: "การศึกษา", icon: "📚", color: "#0891b2", type: "expense" },
  { id: "other_exp", name: "Other", nameTh: "อื่นๆ", icon: "📦", color: "#9ca3af", type: "expense" },
  { id: "salary", name: "Salary", nameTh: "เงินเดือน", icon: "💰", color: "#22c55e", type: "income" },
  { id: "freelance", name: "Freelance", nameTh: "ฟรีแลนซ์", icon: "💻", color: "#84cc16", type: "income" },
  { id: "bonus", name: "Bonus", nameTh: "โบนัส", icon: "🎁", color: "#eab308", type: "income" },
  { id: "other_inc", name: "Other Income", nameTh: "รายได้อื่นๆ", icon: "💵", color: "#14b8a6", type: "income" },
];

const DEFAULT_SETTINGS: AppSettings = {
  language: "th",
  currency: "THB",
  budgetStartDay: 1,
  notificationsEnabled: false,
  notificationTime: "20:00",
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Transactions
export function getTransactions(): Transaction[] {
  return getItem<Transaction[]>(KEYS.TRANSACTIONS, []);
}
export function saveTransactions(txns: Transaction[]): void {
  setItem(KEYS.TRANSACTIONS, txns);
}
export function addTransaction(txn: Transaction): void {
  const all = getTransactions();
  setItem(KEYS.TRANSACTIONS, [txn, ...all]);
}
export function updateTransaction(updated: Transaction): void {
  const all = getTransactions().map((t) => (t.id === updated.id ? updated : t));
  setItem(KEYS.TRANSACTIONS, all);
}
export function deleteTransaction(id: string): void {
  setItem(KEYS.TRANSACTIONS, getTransactions().filter((t) => t.id !== id));
}

// Categories
export function getCategories(): Category[] {
  return getItem<Category[]>(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
}
export function saveCategories(cats: Category[]): void {
  setItem(KEYS.CATEGORIES, cats);
}

// Budgets
export function getBudgets(): Budget[] {
  return getItem<Budget[]>(KEYS.BUDGETS, []);
}
export function saveBudgets(budgets: Budget[]): void {
  setItem(KEYS.BUDGETS, budgets);
}

// Auto Records
export function getAutoRecords(): AutoRecord[] {
  return getItem<AutoRecord[]>(KEYS.AUTO_RECORDS, []);
}
export function saveAutoRecords(records: AutoRecord[]): void {
  setItem(KEYS.AUTO_RECORDS, records);
}

// Settings
export function getSettings(): AppSettings {
  return getItem<AppSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}
export function saveSettings(settings: AppSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

// Utility: generate ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
