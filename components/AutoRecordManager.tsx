"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Play } from "lucide-react";
import { useLang } from "./LanguageContext";
import { useCategories } from "@/hooks/useCategories";
import { getAutoRecords, saveAutoRecords, generateId } from "@/lib/storage";
import { AutoRecord, TransactionType } from "@/types";

interface Props {
  onApply: (record: AutoRecord) => void;
}

export default function AutoRecordManager({ onApply }: Props) {
  const { t, lang } = useLang();
  const { categories } = useCategories();
  const [records, setRecords] = useState<AutoRecord[]>([]);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    type: "expense" as TransactionType,
    categoryId: "",
    note: "",
  });

  const reload = useCallback(async () => {
    setRecords(await getAutoRecords());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = async () => {
    if (!form.name || !form.amount || !form.categoryId) return;
    const newRecord: AutoRecord = {
      id: generateId(),
      name: form.name,
      nameTh: form.name,
      amount: parseFloat(form.amount),
      type: form.type,
      categoryId: form.categoryId,
      note: form.note,
      enabled: true,
    };
    const updated = [...records, newRecord];
    await saveAutoRecords(updated);
    await reload();
    setAdding(false);
    setForm({ name: "", amount: "", type: "expense", categoryId: "", note: "" });
  };

  const remove = async (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    await saveAutoRecords(updated);
    await reload();
  };

  const filtered = categories.filter((c) => c.type === form.type);

  return (
    <div className="space-y-3">
      {records.map((rec) => {
        const cat = categories.find((c) => c.id === rec.categoryId);
        return (
          <div key={rec.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-2xl">{cat?.icon ?? "📦"}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{rec.name}</p>
              <p className="text-sm text-gray-500">
                {rec.type === "expense" ? "−" : "+"}{rec.amount.toLocaleString()} {lang === "th" ? "บาท" : "THB"}
              </p>
            </div>
            <button
              onClick={() => onApply(rec)}
              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
            >
              <Play size={16} />
            </button>
            <button
              onClick={() => remove(rec.id)}
              className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}

      {adding ? (
        <div className="p-4 rounded-xl border border-green-200 bg-green-50 space-y-3">
          <input
            type="text"
            placeholder={lang === "th" ? "ชื่อรายการ" : "Item name"}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as TransactionType, categoryId: "" }))}
              className="rounded-lg border border-gray-200 px-2 py-2 text-sm"
            >
              <option value="expense">{t("expense")}</option>
              <option value="income">{t("income")}</option>
            </select>
          </div>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">{t("category")}</option>
            {filtered.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {lang === "th" ? c.nameTh : c.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-medium"
            >
              {t("save")}
            </button>
            <button
              onClick={() => setAdding(false)}
              className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors text-sm"
        >
          <Plus size={18} />
          {t("addAutoRecord")}
        </button>
      )}
    </div>
  );
}
