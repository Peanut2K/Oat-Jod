"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Transaction } from "@/types";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { useLang } from "../LanguageContext";

interface Props {
  transactions: Transaction[];
}

export default function MonthlyBarChart({ transactions }: Props) {
  const { lang, t } = useLang();
  const locale = lang === "th" ? th : enUS;

  const data = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const start = startOfMonth(d);
    const end = endOfMonth(d);
    const txns = transactions.filter((txn) => {
      const td = new Date(txn.date);
      return td >= start && td <= end;
    });
    return {
      month: format(d, "MMM", { locale }),
      expense: txns.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0),
      income: txns.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 10 }} width={50} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
        <Tooltip
          formatter={(value: number, name: string) => [
            value.toLocaleString() + (lang === "th" ? " บาท" : " THB"),
            name === "expense" ? t("expense") : t("income"),
          ]}
        />
        <Legend formatter={(name) => name === "expense" ? t("expense") : t("income")} />
        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="expense" />
        <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="income" />
      </BarChart>
    </ResponsiveContainer>
  );
}
