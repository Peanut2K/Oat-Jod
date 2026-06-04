"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLang } from "./LanguageContext";
import { useCategories } from "@/hooks/useCategories";
import { addCategory, deleteCategory, generateId } from "@/lib/storage";
import { Category, TransactionType } from "@/types";

const ICONS = ["🍔","🚗","🛍️","💊","🎮","📱","📚","📦","💰","💻","🎁","💵","🏠","✈️","☕","🎵","🐾","💈","⚽","🎨"];
const COLORS = ["#f97316","#3b82f6","#ec4899","#ef4444","#8b5cf6","#6b7280","#0891b2","#22c55e","#eab308","#14b8a6"];

export default function CategoryManager() {
  const { t, lang } = useLang();
  const { categories, reload } = useCategories();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ nameTh: "", nameEn: "", icon: "📦", color: "#6b7280", type: "expense" as TransactionType });

  const save = async () => {
    if (!form.nameTh) return;
    const cat: Category = {
      id: generateId(),
      name: form.nameEn || form.nameTh,
      nameTh: form.nameTh,
      icon: form.icon,
      color: form.color,
      type: form.type,
    };
    await addCategory(cat);
    await reload();
    setAdding(false);
    setForm({ nameTh: "", nameEn: "", icon: "📦", color: "#6b7280", type: "expense" });
  };

  const remove = async (id: string) => {
    await deleteCategory(id);
    await reload();
  };

  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <span className="text-2xl">{cat.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {lang === "th" ? cat.nameTh : cat.name}
            </p>
            <p className="text-xs text-gray-400">{cat.type}</p>
          </div>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
          <button onClick={() => remove(cat.id)} className="p-1.5 text-gray-300 hover:text-red-400">
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="p-4 rounded-xl border border-green-200 bg-green-50 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={lang === "th" ? "ชื่อภาษาไทย" : "Thai name"}
              value={form.nameTh}
              onChange={(e) => setForm((f) => ({ ...f, nameTh: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="English name"
              value={form.nameEn}
              onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">{lang === "th" ? "ไอคอน" : "Icon"}</p>
            <div className="flex flex-wrap gap-1">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                  className={`text-xl p-1 rounded ${form.icon === ic ? "bg-green-200 ring-2 ring-green-500" : "hover:bg-gray-100"}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">{lang === "th" ? "สี" : "Color"}</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((col) => (
                <button
                  key={col}
                  onClick={() => setForm((f) => ({ ...f, color: col }))}
                  className={`w-6 h-6 rounded-full transition-transform ${form.color === col ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : ""}`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as TransactionType }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="expense">{t("expense")}</option>
            <option value="income">{t("income")}</option>
          </select>

          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-medium">{t("save")}</button>
            <button onClick={() => setAdding(false)} className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm">{t("cancel")}</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors text-sm"
        >
          <Plus size={18} />
          {t("addCategory")}
        </button>
      )}
    </div>
  );
}
