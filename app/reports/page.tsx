"use client";
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, addMonths } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { useExpenses } from "@/hooks/useExpenses";
import { useCategories } from "@/hooks/useCategories";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import TrendChart from "@/components/charts/TrendChart";
import ExpenseList from "@/components/ExpenseList";
import { exportToCSV, exportToXLSX } from "@/lib/exportUtils";
import clsx from "clsx";

type Period = "monthly" | "weekly" | "daily";

export default function ReportsPage() {
  const { t, lang } = useLang();
  const { transactions, deleteTransaction } = useExpenses();
  const { categories } = useCategories();
  const locale = lang === "th" ? th : enUS;

  const [period, setPeriod] = useState<Period>("monthly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"pie" | "bar" | "trend" | "list">("pie");
  const [exporting, setExporting] = useState(false);

  const { start, end, label } = useMemo(() => {
    if (period === "monthly") {
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
        label: format(currentDate, "MMMM yyyy", { locale }),
      };
    }
    if (period === "weekly") {
      const s = startOfWeek(currentDate, { weekStartsOn: 1 });
      const e = endOfWeek(currentDate, { weekStartsOn: 1 });
      return {
        start: s, end: e,
        label: `${format(s, "d MMM", { locale })} – ${format(e, "d MMM", { locale })}`,
      };
    }
    return {
      start: new Date(currentDate.setHours(0, 0, 0, 0)),
      end: new Date(currentDate.setHours(23, 59, 59, 999)),
      label: format(currentDate, "d MMMM yyyy", { locale }),
    };
  }, [period, currentDate, locale]);

  const filtered = transactions.filter((txn) => {
    const d = new Date(txn.date);
    return d >= start && d <= end;
  });

  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const navigate = (dir: 1 | -1) => {
    const d = new Date(currentDate);
    if (period === "monthly") d.setMonth(d.getMonth() + dir);
    else if (period === "weekly") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const handleExportCSV = () => exportToCSV(filtered, categories);
  const handleExportXLSX = async () => {
    setExporting(true);
    await exportToXLSX(filtered, categories);
    setExporting(false);
  };

  const chartTabs = [
    { key: "pie", label: t("byCategory") },
    { key: "bar", label: t("monthly") },
    { key: "trend", label: t("trend") },
    { key: "list", label: lang === "th" ? "รายการ" : "List" },
  ] as const;

  const catTotals: Record<string, number> = {};
  filtered.filter((t) => t.type === "expense").forEach((t) => {
    catTotals[t.categoryId] = (catTotals[t.categoryId] ?? 0) + t.amount;
  });
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const topCats = Object.entries(catTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, amt]) => ({ cat: catMap[id], amt }));

  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900">{t("reports")}</h1>
      </div>

      {/* Period tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(["monthly", "weekly", "daily"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => { setPeriod(p); setCurrentDate(new Date()); }}
            className={clsx(
              "flex-1 py-2 text-xs font-medium rounded-lg transition-all",
              period === p ? "bg-white text-green-600 shadow-sm" : "text-gray-500"
            )}
          >
            {t(p)}
          </button>
        ))}
      </div>

      {/* Navigator */}
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-400 hover:text-gray-700">
          <ChevronLeft size={20} />
        </button>
        <span className="font-medium text-sm text-gray-800 capitalize">{label}</span>
        <button onClick={() => navigate(1)} className="p-1 text-gray-400 hover:text-gray-700">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-xs text-red-400">{t("totalExpense")}</p>
          <p className="text-xl font-bold text-red-500 mt-0.5">−{totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <p className="text-xs text-green-500">{t("totalIncome")}</p>
          <p className="text-xl font-bold text-green-600 mt-0.5">+{totalIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Top categories */}
      {topCats.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">{t("topSpending")}</p>
          <div className="space-y-2">
            {topCats.map(({ cat, amt }, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{cat?.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{cat ? (lang === "th" ? cat.nameTh : cat.name) : "?"}</span>
                    <span className="font-semibold text-red-500">{amt.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(amt / totalExpense) * 100}%`,
                        backgroundColor: cat?.color ?? "#6b7280",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {chartTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                "flex-1 py-2.5 text-xs font-medium transition-colors",
                activeTab === key ? "text-green-600 border-b-2 border-green-500" : "text-gray-500"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === "pie" && (
            <ExpensePieChart transactions={filtered} categories={categories} />
          )}
          {activeTab === "bar" && (
            <MonthlyBarChart transactions={transactions} />
          )}
          {activeTab === "trend" && (
            <TrendChart transactions={filtered} month={currentDate} />
          )}
          {activeTab === "list" && (
            <ExpenseList
              transactions={filtered}
              categories={categories}
              onDelete={deleteTransaction}
            />
          )}
        </div>
      </div>

      {/* Export */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">{t("export")}</p>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <Download size={16} />
            CSV
          </button>
          <button
            onClick={handleExportXLSX}
            disabled={exporting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 active:scale-95 transition-all disabled:opacity-60"
          >
            <Download size={16} />
            {exporting ? "..." : "Excel"}
          </button>
        </div>
      </div>
    </div>
  );
}
