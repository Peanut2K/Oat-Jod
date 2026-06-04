"use client";
import { useLang } from "./LanguageContext";
import { Transaction, Category, Budget } from "@/types";

interface Props {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  periodStart: Date;
  periodEnd: Date;
}

export default function BudgetOverview({ transactions, categories, budgets, periodStart, periodEnd }: Props) {
  const { t, lang } = useLang();

  if (!budgets.length) return null;

  const periodTxns = transactions.filter((txn) => {
    const d = new Date(txn.date);
    return txn.type === "expense" && d >= periodStart && d <= periodEnd;
  });

  const spendByCategory: Record<string, number> = {};
  periodTxns.forEach((txn) => {
    spendByCategory[txn.categoryId] = (spendByCategory[txn.categoryId] ?? 0) + txn.amount;
  });

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  return (
    <div className="space-y-3">
      {budgets.map((budget) => {
        const cat = catMap[budget.categoryId];
        if (!cat) return null;
        const spent = spendByCategory[budget.categoryId] ?? 0;
        const pct = Math.min((spent / budget.amount) * 100, 100);
        const over = spent > budget.amount;

        return (
          <div key={budget.categoryId}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {lang === "th" ? cat.nameTh : cat.name}
                </span>
                {over && (
                  <span className="text-xs text-red-500 font-semibold">{t("over")}</span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {spent.toLocaleString()} / {budget.amount.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${over ? "bg-red-500" : pct > 75 ? "bg-orange-400" : "bg-green-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
