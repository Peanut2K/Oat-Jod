"use client";
import { useLang } from "./LanguageContext";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";
import { saveBudgets } from "@/lib/storage";
import { Budget } from "@/types";

export default function BudgetManager() {
  const { lang } = useLang();
  const { categories } = useCategories();
  const { budgets, reload } = useBudgets();
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const getBudgetFor = (catId: string) =>
    budgets.find((b) => b.categoryId === catId)?.amount ?? 0;

  const setBudget = async (catId: string, amount: number) => {
    const existing = budgets.filter((b) => b.categoryId !== catId);
    const updated: Budget[] = amount > 0
      ? [...existing, { categoryId: catId, amount, period: "monthly" }]
      : existing;
    await saveBudgets(updated);
    await reload();
  };

  return (
    <div className="space-y-3">
      {expenseCategories.map((cat) => {
        const val = getBudgetFor(cat.id);
        return (
          <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xl">{cat.icon}</span>
            <p className="flex-1 text-sm font-medium text-gray-800">
              {lang === "th" ? cat.nameTh : cat.name}
            </p>
            <input
              type="number"
              value={val || ""}
              onChange={(e) => setBudget(cat.id, parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-28 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <span className="text-xs text-gray-400">
              {lang === "th" ? "บาท/เดือน" : "THB/mo"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
