export type Language = "th" | "en";

export type TransactionType = "expense" | "income";

export interface Category {
  id: string;
  name: string;
  nameTh: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  note: string;
  date: string; // ISO string
  imageUrl?: string; // base64 or URL
  createdAt: string;
}

export interface Budget {
  categoryId: string;
  amount: number;
  period: "monthly";
}

export interface AutoRecord {
  id: string;
  name: string;
  nameTh: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  note: string;
  enabled: boolean;
}

export interface AppSettings {
  language: Language;
  currency: string;
  budgetStartDay: number; // 1-28
  notificationsEnabled: boolean;
  notificationTime: string; // "HH:mm"
}

export interface BudgetPeriod {
  start: Date;
  end: Date;
}
