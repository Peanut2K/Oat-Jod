"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Transaction, Category } from "@/types";
import { useLang } from "../LanguageContext";

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export default function ExpensePieChart({ transactions, categories }: Props) {
  const { lang, t } = useLang();
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const data: { name: string; value: number; color: string }[] = [];
  const totals: Record<string, number> = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((txn) => {
      totals[txn.categoryId] = (totals[txn.categoryId] ?? 0) + txn.amount;
    });

  Object.entries(totals).forEach(([catId, value]) => {
    const cat = catMap[catId];
    if (cat)
      data.push({
        name: lang === "th" ? cat.nameTh : cat.name,
        value,
        color: cat.color,
      });
  });

  if (!data.length) {
    return <p className="text-center text-gray-400 text-sm py-8">{t("noData")}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            value.toLocaleString() + (lang === "th" ? " บาท" : " THB"),
          ]}
        />
        <Legend
          formatter={(value) => (
            <span className="text-xs text-gray-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
