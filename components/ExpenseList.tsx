"use client";
import { useState } from "react";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { Trash2, ChevronRight } from "lucide-react";
import { useLang } from "./LanguageContext";
import { Transaction, Category } from "@/types";
import clsx from "clsx";

interface Props {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
  limit?: number;
}

export default function ExpenseList({ transactions, categories, onDelete, limit }: Props) {
  const { t, lang } = useLang();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const displayed = limit ? transactions.slice(0, limit) : transactions;

  if (!displayed.length) {
    return (
      <div className="text-center text-gray-400 py-8 text-sm">{t("noData")}</div>
    );
  }

  return (
    <div className="space-y-2">
      {displayed.map((txn) => {
        const cat = catMap[txn.categoryId];
        const isConfirm = confirmId === txn.id;
        return (
          <div
            key={txn.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: cat?.color + "20" }}
            >
              {cat?.icon ?? "📦"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate text-sm">
                {cat ? (lang === "th" ? cat.nameTh : cat.name) : txn.categoryId}
              </p>
              <p className="text-xs text-gray-400">
                {txn.note && <span className="mr-2">{txn.note}</span>}
                {format(new Date(txn.date), "d MMM", { locale: lang === "th" ? th : enUS })}
              </p>
            </div>

            {txn.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={txn.imageUrl}
                alt=""
                className="w-8 h-8 rounded object-cover border border-gray-100"
              />
            )}

            <p
              className={clsx(
                "font-bold text-sm flex-shrink-0",
                txn.type === "expense" ? "text-red-500" : "text-green-500"
              )}
            >
              {txn.type === "expense" ? "−" : "+"}
              {txn.amount.toLocaleString()}
            </p>

            {isConfirm ? (
              <div className="flex gap-1">
                <button
                  onClick={() => { onDelete(txn.id); setConfirmId(null); }}
                  className="px-2 py-1 rounded bg-red-500 text-white text-xs font-medium"
                >
                  {t("confirm")}
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs"
                >
                  {t("cancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(txn.id)}
                className="p-1.5 text-gray-300 hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        );
      })}

      {limit && transactions.length > limit && (
        <button className="w-full flex items-center justify-center gap-1 py-2 text-sm text-gray-500 hover:text-gray-700">
          {transactions.length - limit} {lang === "th" ? "รายการเพิ่มเติม" : "more items"} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
