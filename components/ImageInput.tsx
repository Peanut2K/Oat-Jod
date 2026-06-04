"use client";
import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { useLang } from "./LanguageContext";

interface Props {
  onImage: (base64: string) => void;
}

export default function ImageInput({ onImage }: Props) {
  const { t } = useLang();
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      onImage(result);
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <p className="text-sm text-gray-500 text-center">{t("imageHint")}</p>

      {preview ? (
        <div className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="receipt"
            className="w-full max-h-64 object-contain rounded-xl border border-gray-200"
          />
          <button
            onClick={clear}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200 hover:bg-red-50"
          >
            <X size={16} className="text-red-500" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-10 hover:border-green-400 hover:bg-green-50 transition-colors"
        >
          <Camera size={36} className="text-gray-400" />
          <span className="text-sm text-gray-500">{t("selectImage")}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
