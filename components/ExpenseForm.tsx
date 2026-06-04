"use client";
import { useState } from "react";
import { format } from "date-fns";
import { useLang } from "./LanguageContext";
import { getCategories } from "@/lib/storage";
import { TransactionType } from "@/types";
import clsx from "clsx";

interface Props {
  onSave: (data: {
    amount: number;
    type: TransactionType;
    categoryId: string;
    note: string;
    date: string;
    imageUrl?: string;
  }) => void;
  prefillAmount?: number;
  prefillNote?: string;
  imageUrl?: string;
}

export default function ExpenseForm({ onSave, prefillAmount, prefillNote, imageUrl }: Props) {
  const { t, lang } = useLang();
  const categories = getCategories();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState(prefillAmount?.toString() ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState(prefillNote ?? "");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const filtered = categories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;
    onSave({
      amount: parseFloat(amount),
      type,
      categoryId,
      note,
      date: new Date(date).toISOString(),
      imageUrl,
    });
    setAmount("");
    setNote("");
    setCategoryId("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        {(["expense", "income"] as TransactionType[]).map((tp) => (
          <button
            key={tp}
            type="button"
            onClick={() => { setType(tp); setCategoryId(""); }}
            className={clsx(
              "flex-1 py-2.5 text-sm font-semibold transition-colors",
              type === tp
                ? tp === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
                : "bg-white text-gray-500"
            )}
          >
            {t(tp)}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("amount")}</label>
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("category")}</label>
        <div className="grid grid-cols-4 gap-2">
          {filtered.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={clsx(
                "flex flex-col items-center p-2 rounded-xl border-2 text-xs transition-all",
                categoryId === cat.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-100 bg-gray-50 hover:border-gray-300"
              )}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="mt-1 text-center leading-tight">
                {lang === "th" ? cat.nameTh : cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("note")}</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={lang === "th" ? "หมายเหตุ (ไม่บังคับ)" : "Note (optional)"}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("date")}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors active:scale-95"
      >
        {t("save")}
      </button>
    </form>
  );
}
