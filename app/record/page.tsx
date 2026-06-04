"use client";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { useExpenses } from "@/hooks/useExpenses";
import ExpenseForm from "@/components/ExpenseForm";
import VoiceInput from "@/components/VoiceInput";
import ImageInput from "@/components/ImageInput";
import AutoRecordManager from "@/components/AutoRecordManager";
import { AutoRecord } from "@/types";
import clsx from "clsx";

type Mode = "text" | "voice" | "image" | "auto";

export default function RecordPage() {
  const { t } = useLang();
  const { addTransaction } = useExpenses();
  const [mode, setMode] = useState<Mode>("text");
  const [saved, setSaved] = useState(false);
  const [voiceAmount, setVoiceAmount] = useState<number | undefined>();
  const [voiceNote, setVoiceNote] = useState<string | undefined>();
  const [imageBase64, setImageBase64] = useState<string | undefined>();

  const tabs: { key: Mode; label: string }[] = [
    { key: "text", label: t("byText") },
    { key: "voice", label: t("byVoice") },
    { key: "image", label: t("byImage") },
    { key: "auto", label: t("autoRecord") },
  ];

  const handleSave = (data: Parameters<typeof addTransaction>[0]) => {
    addTransaction(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setVoiceAmount(undefined);
    setVoiceNote(undefined);
    setImageBase64(undefined);
  };

  const handleAutoApply = (rec: AutoRecord) => {
    addTransaction({
      amount: rec.amount,
      type: rec.type,
      categoryId: rec.categoryId,
      note: rec.note || rec.name,
      date: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleVoiceResult = (amount: number | null, text: string) => {
    if (amount) setVoiceAmount(amount);
    setVoiceNote(text);
    setMode("text");
  };

  const handleImage = (base64: string) => {
    setImageBase64(base64);
    setMode("text");
  };

  return (
    <div className="p-4 space-y-5">
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900">{t("record")}</h1>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
          <CheckCircle size={16} />
          {t("saved")}
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={clsx(
              "flex-1 py-2 text-xs font-medium rounded-lg transition-all",
              mode === key ? "bg-white text-green-600 shadow-sm" : "text-gray-500"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        {mode === "text" && (
          <ExpenseForm
            onSave={handleSave}
            prefillAmount={voiceAmount}
            prefillNote={voiceNote}
            imageUrl={imageBase64}
          />
        )}

        {mode === "voice" && (
          <VoiceInput onResult={handleVoiceResult} />
        )}

        {mode === "image" && (
          <ImageInput onImage={handleImage} />
        )}

        {mode === "auto" && (
          <AutoRecordManager onApply={handleAutoApply} />
        )}
      </div>
    </div>
  );
}
