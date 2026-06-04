"use client";
import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { th, enUS } from "date-fns/locale";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { useExpenses } from "@/hooks/useExpenses";
import { getCategories, getBudgets, getSettings } from "@/lib/storage";
import BudgetOverview from "@/components/BudgetOverview";
import ExpenseList from "@/components/ExpenseList";

export default function HomePage() {
  const { t, lang } = useLang();
  const { transactions, deleteTransaction } = useExpenses();
  const categories = getCategories();
  const budgets = getBudgets();
  const settings = getSettings();

  const now = new Date();
  const locale = lang === "th" ? th : enUS;

  const periodStart = useMemo(() => {
    const d = new Date(now.getFullYear(), now.getMonth(), settings.budgetStartDay);
    return d > now ? subMonths(d, 1) : d;
  }, [now, settings.budgetStartDay]);

  const periodEnd = useMemo(() => addMonths(periodStart, 1), [periodStart]);

  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= monthStart && d <= monthEnd;
  });

  const totalExpense = monthTxns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const totalIncome = monthTxns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="pt-4">
        <p className="text-sm text-gray-500 capitalize">
          {format(now, "MMMM yyyy", { locale })}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{t("home")}</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow">
          <p className="text-sm opacity-80">{t("balance")}</p>
          <p className={`text-3xl font-bold mt-1 ${balance < 0 ? "text-red-200" : ""}`}>
            {balance >= 0 ? "" : "−"}
            {Math.abs(balance).toLocaleString()}
            <span className="text-base font-normal ml-1 opacity-70">
              {settings.currency}
            </span>
          </p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">{t("totalIncome")}</p>
          <p className="text-lg font-bold text-green-600 mt-0.5">
            +{totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 col-span-2">
          <p className="text-xs text-gray-500">{t("totalExpense")}</p>
          <p className="text-lg font-bold text-red-500 mt-0.5">
            −{totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Budget Overview */}
      {budgets.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">{t("budgetOverview")}</h2>
          <BudgetOverview
            transactions={transactions}
            categories={categories}
            budgets={budgets}
            periodStart={periodStart}
            periodEnd={periodEnd}
          />
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">{t("recentTransactions")}</h2>
          <Link href="/reports" className="text-sm text-green-600 font-medium">
            {lang === "th" ? "ดูทั้งหมด" : "See all"}
          </Link>
        </div>
        <ExpenseList
          transactions={monthTxns}
          categories={categories}
          onDelete={deleteTransaction}
          limit={8}
        />
      </div>

      {/* FAB */}
      <Link
        href="/record"
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center text-white hover:bg-green-600 active:scale-95 transition-all z-40"
      >
        <Plus size={28} />
      </Link>
    </div>
  );
}
