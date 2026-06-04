"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { useLang } from "../LanguageContext";

interface Props {
  transactions: Transaction[];
  month: Date;
}

export default function TrendChart({ transactions, month }: Props) {
  const { lang, t } = useLang();
  const locale = lang === "th" ? th : enUS;

  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  let cumulative = 0;
  const data = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayTotal = transactions
      .filter(
        (txn) =>
          txn.type === "expense" &&
          format(new Date(txn.date), "yyyy-MM-dd") === dayStr
      )
      .reduce((s, t) => s + t.amount, 0);
    cumulative += dayTotal;
    return {
      day: format(day, "d", { locale }),
      daily: dayTotal,
      cumulative,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
        <YAxis tick={{ fontSize: 10 }} width={55} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
        <Tooltip
          formatter={(value: number, name: string) => [
            value.toLocaleString() + (lang === "th" ? " บาท" : " THB"),
            name === "cumulative" ? (lang === "th" ? "สะสม" : "Cumulative") : (lang === "th" ? "รายวัน" : "Daily"),
          ]}
        />
        <Line type="monotone" dataKey="cumulative" stroke="#ef4444" strokeWidth={2} dot={false} name="cumulative" />
        <Line type="monotone" dataKey="daily" stroke="#f97316" strokeWidth={1.5} dot={false} name="daily" strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}
